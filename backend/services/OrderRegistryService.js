// services/OrderRegistryService.js
const { ethers } = require("ethers");
const { ORDER_REGISTRY_ABI } = require("../config/OrderRegistryConfig"); // Bạn tự tạo file config chứa ABI nhé
// 1. Setup Provider & Wallet
// Dùng RPC_URL từ .env (Sepolia)
const provider = new ethers.JsonRpcProvider(process.env.ORDER_REGISTRY_RPC_URL);

// Ví Admin (Owner của contract) dùng để ký các lệnh ghi (Write)
// Bắt buộc phải có Private Key trong .env
const adminWallet = new ethers.Wallet(
  process.env.ORDER_REGISTRY_PRIVATE_KEY,
  provider
);

// 2. Setup Contract Instances
// - readContract: Dùng cho các hàm view (miễn phí gas)
// - writeContract: Dùng cho các hàm ghi (tốn gas, cần admin ký)
const readContract = new ethers.Contract(
  process.env.ORDER_REGISTRY_CONTRACT_ADDRESS,
  ORDER_REGISTRY_ABI,
  provider
);
const writeContract = new ethers.Contract(
  process.env.ORDER_REGISTRY_CONTRACT_ADDRESS,
  ORDER_REGISTRY_ABI,
  adminWallet
);

class OrderRegistryService {
  // Helper: Hash ID từ String -> Bytes32 (Theo chuẩn của Contract)
  _hashOrderId(rawOrderId) {
    return ethers.keccak256(ethers.toUtf8Bytes(String(rawOrderId)));
  }

  /**
   * Ghi thông tin Order lên Blockchain (Gọi hàm createOrder)
   * Thường gọi ngay sau khi tạo đơn hàng thành công trong DB.
   * * @param {string} orderId - ID đơn hàng (VD: "ORD-123")
   * @param {string} buyerAddress - Địa chỉ ví người mua
   * @param {string|number} amount - Số tiền (ETH/Token)
   * @param {string} status - Trạng thái ban đầu (VD: "created")
   */
  async createOrderOnChain(orderId, buyerAddress, amount, status = "created") {
    try {
      // Địa chỉ Seller cố định (Ví Admin/Cửa hàng) hoặc lấy từ DB
      const sellerAddress = adminWallet.address;

      // Convert amount sang Wei (18 số 0) nếu input là ETH
      // Hoặc giữ nguyên nếu input đã là Wei. Ở đây giả sử input là ETH string (VD: "0.01")
      const amountWei = ethers.parseEther(String(amount));

      console.log(`[OrderRegistry] Đang tạo Order on-chain: ${orderId}`);

      const tx = await writeContract.createOrder(
        orderId,
        buyerAddress,
        sellerAddress,
        amountWei,
        status
      );

      console.log(`[OrderRegistry] Tx Hash (Create): ${tx.hash}`);

      // Đợi transaction được đào (1 confirmation)
      await tx.wait();
      return tx.hash;
    } catch (error) {
      console.error(`[OrderRegistry] Lỗi createOrder:`, error);
      throw new Error("Lỗi khi tạo Order trên Blockchain: " + error.message);
    }
  }

  /**
   * Lưu CID hóa đơn PDF lên Blockchain (Gọi hàm setOrderReceiptCID)
   * Gọi sau khi đã upload file lên Pinata IPFS.
   */
  async saveReceiptCID(orderId, cid) {
    try {
      console.log(`[OrderRegistry] Đang lưu CID cho Order: ${orderId}`);

      const tx = await writeContract.setOrderReceiptCID(orderId, cid);

      console.log(`[OrderRegistry] Tx Hash (SetCID): ${tx.hash}`);

      await tx.wait();
      return tx.hash;
    } catch (error) {
      console.error(`[OrderRegistry] Lỗi saveReceiptCID:`, error);
      throw new Error("Lỗi khi lưu CID lên Blockchain");
    }
  }

  /**
   * Lấy CID hóa đơn từ Blockchain (Gọi hàm retrieveOrderReceiptCID)
   */
  async getReceiptCID(orderId) {
    try {
      const cid = await readContract.retrieveOrderReceiptCID(orderId);
      return cid;
    } catch (error) {
      // Xử lý lỗi revert từ contract (VD: order not found)
      if (error.reason)
        console.warn(`[OrderRegistry] Warning: ${error.reason}`);
      return null;
    }
  }

  /**
   * Lấy danh sách Order phân trang từ Blockchain (Gọi hàm retrieveOrders)
   * Dùng cho việc đối soát dữ liệu (Audit)
   */
  async getOrdersOnChain(page = 1, limit = 10) {
    try {
      const offset = (page - 1) * limit;

      // Gọi hàm retrieveOrders trả về tuple (result, total)
      const [ordersRaw, totalBigInt] = await readContract.retrieveOrders(
        offset,
        limit
      );

      // Format lại dữ liệu cho đẹp (BigInt -> String, Bytes32 -> Hex)
      const formattedOrders = ordersRaw.map((o) => ({
        orderIdHash: o.orderId, // Bytes32
        buyer: o.buyer,
        seller: o.seller,
        amount: ethers.formatEther(o.amount), // Wei -> ETH
        createdAt: new Date(Number(o.createdAt) * 1000).toISOString(),
        status: o.status,
        receiptCID: o.receiptCID,
      }));

      return {
        data: formattedOrders,
        total: Number(totalBigInt),
        page,
        limit,
      };
    } catch (error) {
      console.error(`[OrderRegistry] Lỗi getOrdersOnChain:`, error);
      throw new Error("Không thể lấy danh sách Order từ Blockchain");
    }
  }
}

module.exports = new OrderRegistryService();
