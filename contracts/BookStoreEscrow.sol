// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title BookStoreEscrow
 * @notice Escrow + on-chain payment log for the IS355 Book Store project.
 *
 * - Customers call createEscrow(orderId) and send native coins (e.g. ETH) to the contract.
 * - Backend/admin wallet (owner) calls releaseEscrow(orderId) after the order is completed.
 * - Backend or buyer can call refundEscrow(orderId) to refund the payment.
 * - All state changes emit events so the backend can sync to SQL and render crypto interactions.
 * - A simple on-chain Payment[] log provides an immutable audit trail.
 *
 * orderId is a bytes32 identifier. On the backend you can derive it from your string/number ID, e.g.:
 *   bytes32 orderId = keccak256(abi.encodePacked("ORDER-123"));
 */
contract BookStoreEscrow {
    /* ========== Types ========== */

    enum EscrowStatus {
        None,
        Active,
        Released,
        Refunded
    }

    enum PaymentStatus {
        EscrowCreated,
        EscrowReleased,
        EscrowRefunded
    }

    struct EscrowInfo {
        address buyer;
        address seller;
        uint256 amount;
        uint256 createdAt;
        EscrowStatus status;
    }

    struct Payment {
        bytes32 orderId;
        address payer;
        address payee;
        uint256 amount;
        uint256 timestamp;
        PaymentStatus status;
    }

    /* ========== Storage ========== */

    address public owner;
    address public immutable merchantWallet;

    // On-contract timeout for escrow (7 days).
    uint256 public constant ESCROW_TIMEOUT = 7 days;

    // orderId => EscrowInfo
    mapping(bytes32 => EscrowInfo) private escrows;

    // Active order IDs for quick querying from frontend/backend.
    bytes32[] private activeOrderIds;
    // orderId => index+1 in activeOrderIds array (0 = not active)
    mapping(bytes32 => uint256) private activeOrderIndex;

    // Aggregated stats
    uint256 public activeEscrowCount;
    uint256 public totalAmountInEscrow;

    // On-chain payment log (audit trail)
    Payment[] private payments;
    // orderId => list of paymentIds
    mapping(bytes32 => uint256[]) private orderPaymentIds;

    /* ========== Reentrancy Guard ========== */

    uint256 private constant _NOT_ENTERED = 1;
    uint256 private constant _ENTERED = 2;
    uint256 private _status;

    /* ========== Events ========== */

    event EscrowCreated(
        bytes32 indexed orderId,
        address indexed buyer,
        address indexed seller,
        uint256 amount,
        uint256 createdAt,
        uint256 timeoutAt
    );

    event EscrowReleased(
        bytes32 indexed orderId,
        address indexed buyer,
        address indexed seller,
        uint256 amount,
        address releasedBy,
        uint256 releasedAt
    );

    event EscrowRefunded(
        bytes32 indexed orderId,
        address indexed buyer,
        address indexed seller,
        uint256 amount,
        address refundedBy,
        uint256 refundedAt,
        bool timeout
    );

    event PaymentRecorded(
        uint256 indexed paymentId,
        bytes32 indexed orderId,
        address indexed payer,
        address payee,
        uint256 amount,
        PaymentStatus status,
        uint256 timestamp
    );

    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);

    /* ========== Modifiers ========== */

    modifier onlyOwner() {
        require(msg.sender == owner, "BookStoreEscrow: caller is not the owner");
        _;
    }

    modifier nonReentrant() {
        require(_status != _ENTERED, "BookStoreEscrow: reentrant call");
        _status = _ENTERED;
        _;
        _status = _NOT_ENTERED;
    }

    /* ========== Constructor ========== */

    /**
     * @param _merchantWallet Wallet that receives funds when an order is confirmed.
     * The deployer becomes contract owner (backend/admin wallet).
     */
    constructor(address _merchantWallet) {
        require(_merchantWallet != address(0), "BookStoreEscrow: merchant is zero");
        owner = msg.sender;
        merchantWallet = _merchantWallet;
        _status = _NOT_ENTERED;
        emit OwnershipTransferred(address(0), msg.sender);
    }

    /* ========== Ownership ========== */

    function transferOwnership(address newOwner) external onlyOwner {
        require(newOwner != address(0), "BookStoreEscrow: new owner is zero");
        emit OwnershipTransferred(owner, newOwner);
        owner = newOwner;
    }

    /* ========== Escrow logic ========== */

    /**
     * @notice Customer creates an escrow for an order by sending native coins.
     * @param orderId bytes32 ID mapped from your off-chain order ID.
     *
     * Requirements:
     * - orderId must be non-zero and unused.
     * - msg.value > 0.
     */
    function createEscrow(bytes32 orderId) external payable nonReentrant {
        require(orderId != bytes32(0), "BookStoreEscrow: empty orderId");
        EscrowInfo storage e = escrows[orderId];
        require(e.status == EscrowStatus.None, "BookStoreEscrow: escrow exists");
        require(msg.value > 0, "BookStoreEscrow: amount is zero");

        e.buyer = msg.sender;
        e.seller = merchantWallet;
        e.amount = msg.value;
        e.createdAt = block.timestamp;
        e.status = EscrowStatus.Active;

        activeEscrowCount += 1;
        totalAmountInEscrow += msg.value;
        _addActiveOrder(orderId);

        uint256 timeoutAt = block.timestamp + ESCROW_TIMEOUT;

        emit EscrowCreated(orderId, e.buyer, e.seller, msg.value, e.createdAt, timeoutAt);

        _recordPayment(orderId, e.buyer, e.seller, msg.value, PaymentStatus.EscrowCreated);
    }

    /**
     * @notice Release funds to merchant (order completed).
     * @dev Only backend/admin wallet (owner) can call.
     */
    function releaseEscrow(bytes32 orderId) external onlyOwner nonReentrant {
        EscrowInfo storage e = escrows[orderId];
        require(e.status == EscrowStatus.Active, "BookStoreEscrow: not active");
        require(e.amount > 0, "BookStoreEscrow: no funds");
        require(block.timestamp <= e.createdAt + ESCROW_TIMEOUT, "BookStoreEscrow: escrow expired");

        uint256 amount = e.amount;
        address buyer = e.buyer;
        address seller = e.seller;

        e.status = EscrowStatus.Released;
        e.amount = 0;

        activeEscrowCount -= 1;
        totalAmountInEscrow -= amount;
        _removeActiveOrder(orderId);

        (bool ok, ) = seller.call{value: amount}("");
        require(ok, "BookStoreEscrow: transfer failed");

        emit EscrowReleased(orderId, buyer, seller, amount, msg.sender, block.timestamp);

        _recordPayment(orderId, buyer, seller, amount, PaymentStatus.EscrowReleased);
    }

    /**
     * @notice Refund funds back to buyer.
     *
     * - Before timeout (7 days): only owner (backend) can trigger refund (manual cancel).
     * - After timeout: buyer or owner can trigger refund.
     */
    function refundEscrow(bytes32 orderId) external nonReentrant {
        EscrowInfo storage e = escrows[orderId];
        require(e.status == EscrowStatus.Active, "BookStoreEscrow: not active");
        require(e.amount > 0, "BookStoreEscrow: no funds");

        bool timeoutReached = block.timestamp >= e.createdAt + ESCROW_TIMEOUT;

        if (!timeoutReached) {
            require(msg.sender == owner, "BookStoreEscrow: only owner before timeout");
        } else {
            require(
                msg.sender == owner || msg.sender == e.buyer,
                "BookStoreEscrow: only owner or buyer after timeout"
            );
        }

        uint256 amount = e.amount;
        address buyer = e.buyer;
        address seller = e.seller;

        e.status = EscrowStatus.Refunded;
        e.amount = 0;

        activeEscrowCount -= 1;
        totalAmountInEscrow -= amount;
        _removeActiveOrder(orderId);

        (bool ok, ) = buyer.call{value: amount}("");
        require(ok, "BookStoreEscrow: refund failed");

        emit EscrowRefunded(orderId, buyer, seller, amount, msg.sender, block.timestamp, timeoutReached);

        _recordPayment(orderId, buyer, seller, amount, PaymentStatus.EscrowRefunded);
    }

    /* ========== Payment log (on-chain audit trail) ========== */

    function _recordPayment(
        bytes32 orderId,
        address payer,
        address payee,
        uint256 amount,
        PaymentStatus status
    ) internal {
        uint256 paymentId = payments.length;

        payments.push(
            Payment({
                orderId: orderId,
                payer: payer,
                payee: payee,
                amount: amount,
                timestamp: block.timestamp,
                status: status
            })
        );

        orderPaymentIds[orderId].push(paymentId);

        emit PaymentRecorded(
            paymentId,
            orderId,
            payer,
            payee,
            amount,
            status,
            block.timestamp
        );
    }

    /* ========== View helpers for backend / tests ========== */

    function getEscrow(bytes32 orderId) external view returns (EscrowInfo memory) {
        return escrows[orderId];
    }

    function getActiveOrderIds() external view returns (bytes32[] memory) {
        return activeOrderIds;
    }

    function isActive(bytes32 orderId) external view returns (bool) {
        return activeOrderIndex[orderId] != 0;
    }

    function getPaymentsLength() external view returns (uint256) {
        return payments.length;
    }

    function getPayment(uint256 paymentId) external view returns (Payment memory) {
        require(paymentId < payments.length, "BookStoreEscrow: invalid id");
        return payments[paymentId];
    }

    function getOrderPaymentIds(bytes32 orderId) external view returns (uint256[] memory) {
        return orderPaymentIds[orderId];
    }

    /* ========== Internal helpers ========== */

    function _addActiveOrder(bytes32 orderId) internal {
        if (activeOrderIndex[orderId] != 0) {
            return;
        }
        activeOrderIds.push(orderId);
        // index is 1-based
        activeOrderIndex[orderId] = activeOrderIds.length;
    }

    function _removeActiveOrder(bytes32 orderId) internal {
        uint256 idx = activeOrderIndex[orderId];
        if (idx == 0) {
            return;
        }

        uint256 index = idx - 1;
        uint256 lastIndex = activeOrderIds.length - 1;

        if (index != lastIndex) {
            bytes32 lastOrderId = activeOrderIds[lastIndex];
            activeOrderIds[index] = lastOrderId;
            activeOrderIndex[lastOrderId] = index + 1;
        }

        activeOrderIds.pop();
        activeOrderIndex[orderId] = 0;
    }

    /* ========== Fallbacks ========== */

    receive() external payable {
        revert("BookStoreEscrow: direct payments not allowed");
    }

    fallback() external payable {
        revert("BookStoreEscrow: unknown function");
    }
}
