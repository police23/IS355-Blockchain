// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title BookStoreEscrow
 * @notice 2-phase Escrow:
 *  - Phase 1: owner tạo escrow với orderId + amount (EscrowCreated).
 *  - Phase 2: buyer gọi depositEscrow(orderId) để nạp đúng amount đã định,
 *    nếu khớp thì escrow Active, sau đó mới release/refund như cũ.
 *
 * orderId là string (ví dụ "76", "ORDER-123") đúng với mã đơn off-chain.
 * Trên event:
 *  - orderKey = keccak256(bytes(orderId)) được indexed (bytes32) để filter log.
 *  - orderId (string) giữ nguyên chuỗi gốc để dễ đọc trên explorer.
 */
contract BookStoreEscrow {
    /* ========== Types ========== */

    enum EscrowStatus {
        None,
        Pending,   // đã tạo slot, chưa nạp tiền
        Active,    // đã nạp tiền
        Released,
        Refunded
    }

    enum PaymentStatus {
        EscrowCreated,   // tiền được nạp vào escrow
        EscrowReleased,
        EscrowRefunded
    }

    struct EscrowInfo {
        address buyer;       // được gán khi deposit
        address seller;      // merchantWallet
        uint256 amount;      // số tiền EXPECTED & LOCKED trong escrow
        uint256 createdAt;   // thời điểm deposit
        EscrowStatus status;
    }

    struct Payment {
        string orderId;
        uint256 amount;
        uint256 timestamp;
        PaymentStatus status;
        address sender;
    }

    /* ========== Storage ========== */

    address public owner;
    address public immutable merchantWallet;

    // On-contract timeout cho escrow (7 ngày)
    uint256 public constant ESCROW_TIMEOUT = 7 days;

    // orderId (string) => EscrowInfo
    mapping(string => EscrowInfo) private escrows;

    // Danh sách orderId đang Active để FE/BE query nhanh
    string[] private activeOrderIds;
    // orderId => index+1 trong activeOrderIds (0 = không active)
    mapping(string => uint256) private activeOrderIndex;

    // Stats
    uint256 public activeEscrowCount;
    uint256 public totalAmountInEscrow;

    // Payment log on-chain (audit trail)
    Payment[] private payments;
    // orderId (string) => danh sách paymentId
    mapping(string => uint256[]) private orderPaymentIds;

    /* ========== Reentrancy Guard ========== */

    uint256 private constant _NOT_ENTERED = 1;
    uint256 private constant _ENTERED = 2;
    uint256 private _status;

    /* ========== Events ========== */

    /**
     * Phase 1: backend tạo slot escrow (chưa có buyer, chưa có tiền)
     *
     * orderKey = keccak256(bytes(orderId)) để filter log,
     * orderId giữ chuỗi gốc để dễ đọc.
     */
    event EscrowCreated(
        bytes32 indexed orderKey,
        string  orderId,
        uint256 amount,
        address indexed seller,
        uint256 createdAt   // thời điểm tạo slot (không phải deposit)
    );

    /**
     * Phase 2: buyer nạp tiền vào escrow đã tạo sẵn
     */
    event EscrowFunded(
        bytes32 indexed orderKey,
        string  orderId,
        address indexed buyer,
        address indexed seller,
        uint256 amount,
        uint256 fundedAt,
        uint256 timeoutAt
    );

    event EscrowReleased(
        bytes32 indexed orderKey,
        string  orderId,
        address indexed buyer,
        address indexed seller,
        uint256 amount,
        address releasedBy,
        uint256 releasedAt
    );

    event EscrowRefunded(
        bytes32 indexed orderKey,
        string  orderId,
        address indexed buyer,
        address indexed seller,
        uint256 amount,
        address refundedBy,
        uint256 refundedAt,
        bool timeout
    );

    event PaymentRecorded(
        uint256 indexed paymentId,
        bytes32 indexed orderKey,
        string  orderId,
        uint256 amount,
        PaymentStatus status,
        uint256 timestamp,
        address sender
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

    /* ========== Phase 1: tạo slot escrow (metadata + expected amount) ========== */

    /**
     * @notice Backend tạo 1 escrow "Pending" với orderId + amount.
     * @dev Không nhận tiền, chỉ lưu thông tin để buyer nạp sau.
     *
     * - orderId: mã đơn off-chain, ví dụ "ORDER-123"
     * - amount: số tiền cần thanh toán (wei)
     */
    function createEscrow(
        string calldata orderId,
        uint256 amount
    ) external onlyOwner {
        require(bytes(orderId).length != 0, "BookStoreEscrow: empty orderId");
        EscrowInfo storage e = escrows[orderId];
        require(e.status == EscrowStatus.None, "BookStoreEscrow: escrow exists");
        require(amount > 0, "BookStoreEscrow: amount is zero");

        e.buyer = address(0);
        e.seller = merchantWallet;
        e.amount = amount;
        e.createdAt = 0; // sẽ set khi deposit
        e.status = EscrowStatus.Pending;

        bytes32 orderKey = keccak256(bytes(orderId));

        emit EscrowCreated(orderKey, orderId, amount, e.seller, block.timestamp);
    }

    /* ========== Phase 2: buyer nạp tiền vào escrow đã chuẩn bị ========== */

    /**
     * @notice Buyer nạp tiền vào escrow đã được backend tạo ở Phase 1.
     *
     * Requirements:
     * - Escrow phải đang ở trạng thái Pending.
     * - msg.value phải đúng bằng amount đã define trước đó.
     */
    function depositEscrow(string calldata orderId) external payable nonReentrant {
        EscrowInfo storage e = escrows[orderId];
        require(e.status == EscrowStatus.Pending, "BookStoreEscrow: not pending");
        require(e.amount > 0, "BookStoreEscrow: amount not set");
        require(msg.value == e.amount, "BookStoreEscrow: amount mismatch");

        e.buyer = msg.sender;
        e.createdAt = block.timestamp;
        e.status = EscrowStatus.Active;

        activeEscrowCount += 1;
        totalAmountInEscrow += msg.value;
        _addActiveOrder(orderId);

        uint256 timeoutAt = block.timestamp + ESCROW_TIMEOUT;
        bytes32 orderKey = keccak256(bytes(orderId));

        emit EscrowFunded(orderKey, orderId, e.buyer, e.seller, msg.value, e.createdAt, timeoutAt);

        // Ghi log thanh toán on-chain
        _recordPayment(orderId, msg.value, PaymentStatus.EscrowCreated);
    }

    /* ========== Escrow logic sau khi đã Active ========== */

    /**
     * @notice Release funds to merchant (order completed).
     * @dev Only backend/admin wallet (owner) can call.
     */
    function releaseEscrow(string calldata orderId) external onlyOwner nonReentrant {
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

        bytes32 orderKey = keccak256(bytes(orderId));

        emit EscrowReleased(orderKey, orderId, buyer, seller, amount, msg.sender, block.timestamp);

        _recordPayment(orderId, amount, PaymentStatus.EscrowReleased);
    }

    /**
     * @notice Refund funds back to buyer.
     *
     * - Before timeout (7 days): only owner (backend) can trigger refund.
     * - After timeout: buyer or owner can trigger refund.
     */
    function refundEscrow(string calldata orderId) external nonReentrant {
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

        bytes32 orderKey = keccak256(bytes(orderId));

        emit EscrowRefunded(orderKey, orderId, buyer, seller, amount, msg.sender, block.timestamp, timeoutReached);

        _recordPayment(orderId, amount, PaymentStatus.EscrowRefunded);
    }

    /* ========== Payment log (on-chain audit trail) ========== */

    function _recordPayment(
        string memory orderId,
        uint256 amount,
        PaymentStatus status
    ) internal {
        uint256 paymentId = payments.length;
        address sender = msg.sender;
        bytes32 orderKey = keccak256(bytes(orderId));

        payments.push(
            Payment({
                orderId: orderId,
                amount: amount,
                timestamp: block.timestamp,
                status: status,
                sender: sender
            })
        );

        orderPaymentIds[orderId].push(paymentId);

        emit PaymentRecorded(
            paymentId,
            orderKey,
            orderId,
            amount,
            status,
            block.timestamp,
            sender
        );
    }

    /* ========== View helpers ========== */

    function getEscrow(string calldata orderId) external view returns (EscrowInfo memory) {
        return escrows[orderId];
    }

    function getActiveOrderIds() external view returns (string[] memory) {
        return activeOrderIds;
    }

    function isActive(string calldata orderId) external view returns (bool) {
        return activeOrderIndex[orderId] != 0;
    }

    function getPaymentsLength() external view returns (uint256) {
        return payments.length;
    }

    function getPayment(uint256 paymentId) external view returns (Payment memory) {
        require(paymentId < payments.length, "BookStoreEscrow: invalid id");
        return payments[paymentId];
    }

    function getOrderPaymentIds(string calldata orderId) external view returns (uint256[] memory) {
        return orderPaymentIds[orderId];
    }

    /* ========== Internal helpers ========== */

    function _addActiveOrder(string memory orderId) internal {
        if (activeOrderIndex[orderId] != 0) {
            return;
        }
        activeOrderIds.push(orderId);
        // index là 1-based
        activeOrderIndex[orderId] = activeOrderIds.length;
    }

    function _removeActiveOrder(string memory orderId) internal {
        uint256 idx = activeOrderIndex[orderId];
        if (idx == 0) {
            return;
        }

        uint256 index = idx - 1;
        uint256 lastIndex = activeOrderIds.length - 1;

        if (index != lastIndex) {
            string memory lastOrderId = activeOrderIds[lastIndex];
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