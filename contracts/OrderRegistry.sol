// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title OrderRegistry
 * @notice Lưu trữ metadata và CID hóa đơn của order trên-chain cho project IS355.
 *
 * - orderId bây giờ là string (ví dụ: "123", "ORDER-123"), đúng với mã đơn off-chain.
 * - Backend (owner) gọi:
 *     + createOrder          -> khi đơn hàng được tạo/xác nhận
 *     + setOrderReceiptCID   -> khi đã generate & upload PDF hóa đơn lên IPFS
 * - FE / backend có thể gọi:
 *     + retrieveOrderReceiptCID(orderId) -> lấy CID về để fetch/decrypt PDF
 *     + retrieveOrders(offset, limit)    -> phân trang danh sách order on-chain
 */
contract OrderRegistry {
    /* ========== Types ========== */

    struct OrderInfo {
        string  orderId;
        address buyer;
        address seller;
        uint256 amount;
        uint256 createdAt;
        string  status;
        string  receiptCID;
    }

    /* ========== Storage ========== */

    address public owner;

    // orderId (string) => OrderInfo
    mapping(string => OrderInfo) private orders;
    // orderId (string) => tồn tại hay không
    mapping(string => bool) private orderExists;

    // Dùng cho paginate
    string[] private orderIds;

    /* ========== Events ========== */

    // Để explorer hiện orderId dạng text, KHÔNG để indexed cho orderId
    event OrderCreated(
        string  orderId,
        address indexed buyer,
        address indexed seller,
        uint256 amount,
        uint256 createdAt,
        string  status
    );

    event OrderReceiptCIDSet(
        string  orderId,
        string  cid,
        uint256 updatedAt
    );

    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);

    /* ========== Modifiers ========== */

    modifier onlyOwner() {
        require(msg.sender == owner, "OrderRegistry: caller is not the owner");
        _;
    }

    /* ========== Constructor ========== */

    constructor() {
        owner = msg.sender;
        emit OwnershipTransferred(address(0), msg.sender);
    }

    /* ========== Ownership ========== */

    function transferOwnership(address newOwner) external onlyOwner {
        require(newOwner != address(0), "OrderRegistry: new owner is zero");
        emit OwnershipTransferred(owner, newOwner);
        owner = newOwner;
    }

    /* ========== Core Functions ========== */

    /**
     * @notice Tạo record order mới trên-chain.
     * @dev Nên được gọi bởi backend sau khi order được tạo/xác nhận.
     *
     * @param orderId  string id (mã đơn off-chain, ví dụ "123" hoặc "ORDER-123")
     * @param buyer    địa chỉ ví của buyer (nếu có)
     * @param seller   địa chỉ ví của seller (merchant)
     * @param amount   tổng số tiền đơn (cùng đơn vị với escrow, vd wei)
     * @param status   trạng thái text ban đầu, ví dụ "created", "confirmed"
     */
    function createOrder(
        string calldata orderId,
        address buyer,
        address seller,
        uint256 amount,
        string calldata status
    ) external onlyOwner {
        require(bytes(orderId).length != 0, "OrderRegistry: invalid orderId");
        require(!orderExists[orderId], "OrderRegistry: order already exists");
        require(buyer != address(0), "OrderRegistry: buyer is zero");
        require(seller != address(0), "OrderRegistry: seller is zero");

        OrderInfo memory info = OrderInfo({
            orderId:    orderId,
            buyer:      buyer,
            seller:     seller,
            amount:     amount,
            createdAt:  block.timestamp,
            status:     status,
            receiptCID: ""
        });

        orders[orderId] = info;
        orderExists[orderId] = true;
        orderIds.push(orderId);

        emit OrderCreated(orderId, buyer, seller, amount, block.timestamp, status);
    }

    /**
     * @notice Cập nhật / set CID của file PDF hóa đơn.
     * @dev Backend gọi sau khi generate & upload PDF lên IPFS.
     */
    function setOrderReceiptCID(string calldata orderId, string calldata cid) external onlyOwner {
        require(orderExists[orderId], "OrderRegistry: order not found");
        orders[orderId].receiptCID = cid;

        emit OrderReceiptCIDSet(orderId, cid, block.timestamp);
    }

    /**
     * @notice Lấy CID hóa đơn theo orderId.
     */
    function retrieveOrderReceiptCID(string calldata orderId) external view returns (string memory) {
        require(orderExists[orderId], "OrderRegistry: order not found");
        return orders[orderId].receiptCID;
    }

    /**
     * @notice Lấy thông tin chi tiết 1 order.
     * @dev Hữu ích cho backend nếu muốn sync metadata (buyer/seller/amount/status...).
     */
    function getOrder(string calldata orderId) external view returns (OrderInfo memory) {
        require(orderExists[orderId], "OrderRegistry: order not found");
        return orders[orderId];
    }

    /**
     * @notice Lấy danh sách order theo phân trang.
     *
     * @param offset  index bắt đầu (0-based)
     * @param limit   số lượng tối đa trả về
     *
     * @return result mảng OrderInfo
     * @return total  tổng số order hiện có trên-chain
     */
    function retrieveOrders(uint256 offset, uint256 limit)
        external
        view
        returns (OrderInfo[] memory result, uint256 total)
    {
        total = orderIds.length;

        if (offset >= total) {
            result = new OrderInfo[](0);
            return (result, total);
        }

        uint256 end = offset + limit;
        if (end > total) {
            end = total;
        }

        uint256 length = end - offset;
        result = new OrderInfo[](length);

        for (uint256 i = 0; i < length; i++) {
            string memory id = orderIds[offset + i];
            result[i] = orders[id];
        }

        return (result, total);
    }
}
