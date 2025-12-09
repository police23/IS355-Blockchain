const OrderService = require("../services/OrderService");
const EscrowService = require("../services/EscrowService");
const { ESCROW_ABI } = require("../utils/escrowClient");
const { ethers } = require("ethers");
const { Order, UserVoucher, VoucherTypes } = require("../models");
const ReceiptService = require("../services/ReceptService");
const OrderRegistryService = require("../services/OrderRegistryService");
const RewardTokenService = require("../services/RewardTokenService");
const fs = require("fs-extra");
const path = require("path");
const getOrdersByUserID = async (req, res) => {
  try {
    const userID = req.user.id;
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;
    const result = await OrderService.getOrdersByUserID(userID, page, pageSize);
    res.json({ success: true, data: result });
  } catch (error) {
    console.error("Error in getOrdersByUserID:", error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
};

const getAllOrdersByStatus = async (req, res) => {
  try {
    const status = getStatusFromRoute(req.path);
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;
    const result = await OrderService.getAllOrdersByStatus(
      status,
      page,
      pageSize
    );
    res.json({ success: true, data: result });
  } catch (error) {
    console.error("Error in getOrdersByStatus:", error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
};

const getOrdersByStatusAndUser = async (req, res) => {
  try {
    const userID = req.user.id;
    const status = getStatusFromRoute(req.path);
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;
    const result = await OrderService.getOrdersByStatusAndUser(
      status,
      userID,
      page,
      pageSize
    );
    res.json({ success: true, data: result });
  } catch (error) {
    console.error("Error in getOrdersByStatusAndUser:", error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
};

const getOrdersByShipperID = async (req, res) => {
  try {
    const shipperID = req.user.id;
    const status = getStatusFromRoute(req.path);
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;
    const result = await OrderService.getOrdersByShipperID(
      shipperID,
      status,
      page,
      pageSize
    );
    res.json({ success: true, data: result });
  } catch (error) {
    console.error("Error in getOrdersByShipperID:", error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
};

const createOrder = async (req, res) => {
  try {
    const userID = req.user.id;
    const orderData = {
      ...req.body,
      userID,
    };
    const result = await OrderService.createOrder(orderData);
    res.status(201).json({ success: true, data: result });
  } catch (error) {
    console.error("Error in createOrder:", error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
};

const confirmOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const result = await OrderService.confirmOrder(orderId);
    res.json({ success: true, data: result });
  } catch (error) {
    console.error("Error in confirmOrder:", error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
};

const completeOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const result = await OrderService.completeOrder(orderId);
    res.json({ success: true, data: result });
  } catch (error) {
    console.error("Error in completeOrder:", error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
};

const cancelOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const result = await OrderService.cancelOrder(orderId);
    res.json({ success: true, ...result });
  } catch (error) {
    console.error("Error in cancelOrder:", error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
};

const assignOrderToShipper = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { shipper_id } = req.body;
    const assignedBy = req.user?.id || null;
    const result = await OrderService.assignOrderToShipper(
      orderId,
      shipper_id,
      assignedBy
    );

    res.json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message || "Failed to assign order to shipper",
    });
  }
};

const getStatusFromRoute = (path) => {
  if (path.includes("/processing")) return "pending";
  if (path.includes("/confirmed")) return "confirmed";
  if (path.includes("/delivering")) return "delivering";
  if (path.includes("/delivered")) return "delivered";
  if (path.includes("/cancelled")) return "cancelled";
  return "pending";
};

// Helper function: Hash ID giống hệt Frontend và Contract
// Frontend: web3.utils.keccak256(orderId)
// Backend: ethers.keccak256(ethers.toUtf8Bytes(orderId))
const getBytes32FromId = (id) => {
  return ethers.keccak256(ethers.toUtf8Bytes(String(id)));
};

const fetchEthPriceVnd = async () => {
  const res = await fetch(
    "https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=vnd"
  );
  if (!res.ok) {
    throw new Error("Không lấy được tỷ giá ETH/VND");
  }
  const data = await res.json();
  const price = Number(data?.ethereum?.vnd);
  if (!price || !Number.isFinite(price)) {
    throw new Error("Giá ETH/VND không hợp lệ");
  }
  console.log("ETH/VND price:", price);
  return price; // VND cho 1 ETH
};
const createCryptoOrder = async (req, res) => {
  try {
    const { amount, userId, orderId, buyerWalletAddress } = req.body; // Lấy thông tin từ request
    const contractAddress = process.env.ESCROW_CONTRACT_ADDRESS;
    const abi = ESCROW_ABI;
    // 1) Lấy tỷ giá ETH/VND
    const ethPriceVnd = await fetchEthPriceVnd(); // VND cho 1 ETH
    const totalVndNumber = Number(amount);
    if (
      !totalVndNumber ||
      !Number.isFinite(totalVndNumber) ||
      totalVndNumber <= 0
    ) {
      throw new Error("Tổng tiền đơn hàng không hợp lệ");
    }
    console.log(
      "Crypto payment - totalVnd:",
      totalVndNumber,
      "ethPriceVnd:",
      ethPriceVnd
    );

    // 2) Tính amountInWei bằng BigInt (tránh sai số số thực)
    const totalVndBig = BigInt(Math.round(totalVndNumber)); // VND
    const ethPriceVndBig = BigInt(Math.round(ethPriceVnd)); // VND cho 1 ETH
    const weiPerEth = 10n ** 18n; // 1 ETH = 10^18 wei
    const amountInWeiBig = (totalVndBig * weiPerEth) / ethPriceVndBig;
    if (amountInWeiBig <= 0n) {
      throw new Error("Số wei tính được không hợp lệ");
    }
    const amountInWeiHex = "0x" + amountInWeiBig.toString(16);
    console.log(
      "amountInWeiBig:",
      amountInWeiBig.toString(),
      "amountInWeiHex:",
      amountInWeiHex
    );
    if (!contractAddress) {
      return res.status(500).json({
        success: false,
        message: "Server chưa cấu hình Contract Address",
      });
    }
    if (buyerWalletAddress) {
      // Giả sử bạn dùng Sequelize
      await Order.update(
        { buyer_wallet_address: buyerWalletAddress },
        { where: { id: orderId } }
      );
      console.log(`Đã cập nhật ví ${buyerWalletAddress} cho đơn ${orderId}`);
    }
    if (amountInWeiHex) {
      // Giả sử bạn dùng Sequelize
      await Order.update(
        { crypto_amount: amountInWeiHex },
        { where: { id: orderId } }
      );
      console.log(
        `Đã cập nhật crypto_amount ${amountInWeiHex} cho đơn ${orderId}`
      );
    }

    // 3. GỌI ORDER REGISTRY ON-CHAIN (QUAN TRỌNG)
    // Chạy ngầm (Fire-and-forget) để không block response cho Frontend
    // Frontend cần nhận ABI ngay để kịp bật MetaMask
    (async () => {
      try {
        // Nếu không có ví người mua thì dùng địa chỉ null hoặc admin
        const buyerAddr =
          buyerWalletAddress || "0x0000000000000000000000000000000000000000";

        // Gọi Service để ghi lên OrderRegistry Contract
        await OrderRegistryService.createOrderOnChain(
          orderId.toString(), // ID đơn hàng
          buyerAddr, // Ví người mua
          amount, // Số tiền (VND hoặc ETH tùy logic bạn chọn)
          "pending" // Status ban đầu
        );
        console.log(
          `[Blockchain] Đã ghi OrderRegistry thành công cho đơn: ${orderId}`
        );
        await EscrowService.createEscrowOnChain(
          orderId.toString(), // ID đơn hàng
          amountInWeiBig // Số tiền (VND hoặc ETH tùy logic bạn chọn)
        );
        console.log(
          `[Blockchain] Đã ghi Escrow thành công cho đơn: ${orderId}`
        );
      } catch (err) {
        console.error(`[Blockchain] Lỗi ghi OrderRegistry: ${err.message}`);
        // Ở đây chỉ log lỗi, không làm fail request của user vì đây là tính năng lưu trữ/audit
      }
    })();
    // Trả về thông tin + ABI cho Frontend dùng
    return res.status(200).json({
      success: true,
      data: {
        orderId,
        amount,
        amountInWeiHex,
        contractAddress: contractAddress,
        abi: abi,
      },
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: "Lỗi tạo đơn hàng" });
  }
};

const submitCryptoResult = async (req, res) => {
  try {
    const { orderId } = req.body;

    if (!orderId) {
      return res.status(400).json({ success: false, message: "Thiếu orderId" });
    }

    const order = await Order.findByPk(orderId);
    if (!order)
      return res.status(404).json({ message: "Không tìm thấy đơn hàng" });

    // 1. Setup Provider (Kết nối mạng Sepolia)
    // Đảm bảo file .env có RPC_URL (VD: Alchemy, Infura hoặc Google RPC)
    const provider = new ethers.JsonRpcProvider(process.env.ESCROW_RPC_URL);

    // 2. Setup Contract (Chỉ cần quyền đọc -> dùng provider là đủ, không cần Wallet/PrivateKey)
    const contract = new ethers.Contract(
      process.env.ESCROW_CONTRACT_ADDRESS,
      ESCROW_ABI,
      provider
    );

    // 3. Chuẩn bị filter
    // Contract lưu orderId dưới dạng bytes32, nên ta phải hash orderId string sang bytes32

    console.log(`Checking events for Order: ${orderId})`);

    // 4. Quét Log (Event) trên Blockchain
    // contract.filters.PaymentRecorded(arg1, arg2...)

    const filter = contract.filters.PaymentRecorded(
      null,
      getBytes32FromId(orderId)
    );

    // Tìm trong 2000 block gần nhất (Sepolia block time ~12s => 2000 blocks ~ 6.5 giờ)
    // Tùy chỉnh số này nếu muốn tìm xa hơn
    const events = await contract.queryFilter(filter, -2000, "latest");

    // 5. Kiểm tra kết quả
    if (events.length > 0) {
      // Lấy sự kiện mới nhất
      const event = events[events.length - 1];

      // Giải mã dữ liệu trong sự kiện (args)
      const paymentInfo = {
        paymentId: event.args[0].toString(),
        orderId: orderId,
        amount: ethers.formatEther(event.args[3]), // Đổi từ Wei sang ETH
        status: event.args[4].toString(), // Enum trả về số (0, 1...)
        timestamp: event.args[5].toString(),
        sender: event.args[6],
        txHash: event.transactionHash,
      };

      console.log("Tìm thấy giao dịch thành công:", paymentInfo);

      res.status(200).json({
        success: true,
        message: "Xác nhận thanh toán thành công. Hóa đơn đang được tạo...",
        data: paymentInfo,
      });
      (async () => {
        const tempDir = path.join(__dirname, "../temp");
        const pdfPath = path.join(tempDir, `invoice_${orderId}.pdf`);
        const encPath = path.join(tempDir, `invoice_${orderId}.enc`);

        try {
          console.log(
            `[Receipt] Bắt đầu quy trình tạo hóa đơn cho đơn: ${orderId}`
          );

          // A. Chuẩn bị thư mục
          await fs.ensureDir(tempDir);
          const timestamp = new Date(order.createdAt).getTime();

          // B. Tạo PDF
          await ReceiptService.generatePDF(order, pdfPath);

          // C. Mã hóa PDF
          await ReceiptService.encryptFile(
            pdfPath,
            encPath,
            order.user_id,
            order.id,
            timestamp
          );

          // D. Upload lên IPFS
          const cid = await ReceiptService.uploadToIPFS(
            encPath,
            `Receipt_${orderId}`
          );
          console.log(`[Receipt] Upload IPFS thành công. CID: ${cid}`);

          // E. Lưu vào Smart Contract OrderRegistry (Quan trọng!)
          // Hàm này tốn khoảng 15s để đào block
          await OrderRegistryService.saveReceiptCID(order.id.toString(), cid);
          console.log(`[Receipt] Đã lưu CID lên Blockchain`);

          // F. Cập nhật lại DB lần nữa
          // Lúc này đơn hàng chính thức có hóa đơn
          await Order.update({ receipt_cid: cid }, { where: { id: orderId } });

          // G. Dọn dẹp file rác
          await fs.remove(pdfPath);
          await fs.remove(encPath);

          console.log(
            `[Receipt] ✅ Hoàn tất toàn bộ quy trình cho đơn ${orderId}`
          );
        } catch (err) {
          console.error(`[Receipt] ❌ Lỗi tạo hóa đơn ngầm:`, err);

          // Hoặc nếu nó là object thì stringify nó lên để đọc
          if (err.response) {
            // Lỗi từ Axios/Pinata thường nằm ở đây
            console.error("Axios/Pinata Error Data:", err.response.data);
          }
          if (fs.existsSync(pdfPath)) fs.remove(pdfPath);
          if (fs.existsSync(encPath)) fs.remove(encPath);
        }
      })();
    } else {
      console.log("Không tìm thấy event nào khớp với OrderId này.");
      return res.status(400).json({
        success: false,
        message:
          "Không tìm thấy xác nhận thanh toán trên Blockchain. Vui lòng thử lại sau giây lát.",
      });
    }
  } catch (error) {
    console.error("Lỗi check blockchain:", error);
    return res
      .status(500)
      .json({ success: false, message: "Lỗi Server khi kiểm tra giao dịch" });
  }
};

const getEventsByOrderId = async (req, res) => {
  try {
    const { orderId } = req.params;
    console.log(orderId);
    // Gọi sang chuyên gia EscrowService để lấy log
    // (Hàm getEventsByOrderId bạn đã viết trong EscrowService ở bước trước)
    const events = await EscrowService.getEventsByOrderId(orderId.toString());

    res.json({
      success: true,
      data: events,
    });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

const getAllOrderEvents = async (req, res) => {
  try {
    // 1. Lấy tham số từ Query String (URL)
    // Mặc định page = 1, limit = 20 nếu user không gửi lên
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const type = req.query.type; // Có thể null (lấy tất cả)

    // 2. Validate cơ bản (Optional nhưng nên có)
    if (page < 1 || limit < 1) {
      return res
        .status(400)
        .json({ success: false, message: "Page và Limit phải lớn hơn 0" });
    }

    // 3. Gọi Service để lấy dữ liệu
    // Lưu ý: Service của bạn hiện tại mới trả về rows,
    // nếu muốn chuyên nghiệp bạn nên sửa Service trả về cả 'total' để Frontend phân trang.
    const events = await EscrowService.getAllEvents({ page, limit, type });

    // 4. Trả về kết quả
    return res.status(200).json({
      success: true,
      items: events.rows,
      page,
      limit,
      total: events.total,
    });
  } catch (error) {
    console.error("[EscrowController] Lỗi lấy danh sách sự kiện:", error);
    return res.status(500).json({
      success: false,
      message: "Lỗi server khi lấy lịch sử sự kiện",
    });
  }
};

const getAllVouchers = async (req, res) => {
  try {
    const userId = req.user?.id || req.query.userId;
    console.log(userId)
    // 1. Lấy danh sách loại voucher
    // Đặt tên biến khác đi (listVoucherTypes) để không nhầm với Model (VoucherTypes)
    const listVoucherTypes = await VoucherTypes.findAll();
    console.log("VoucherTypes found:", listVoucherTypes.length);

    // 2. Lấy danh sách voucher của người dùng kèm thông tin loại voucher
    const userVouchers = await UserVoucher.findAll({
      include: [
        {
          model: VoucherTypes, // <-- Quan trọng: Phải truyền Model Class vào đây
          as: "type", // <-- Quan trọng: Phải khớp với 'as' trong models/index.js (UserVoucher.belongsTo(..., as: 'type'))
          // Nếu trong model/index.js bạn để as: 'voucherType' thì sửa dòng trên thành 'voucherType'
        },
      ],
    });
    console.log("UserVouchers found:", userVouchers.length);
    let userBalance = "0";
    if (userId) {
      try {
        // Gọi Service để lấy số dư trên Blockchain
        userBalance = await RewardTokenService.getBalance(userId);
        console.log(`User ${userId} balance: ${userBalance}`);
      } catch (err) {
        console.error("Lỗi lấy số dư RewardToken:", err.message);
        // Không throw lỗi ở đây để tránh làm hỏng API lấy voucher
        // Nếu lỗi blockchain thì cứ trả về 0 hoặc null
      }
    }
    // ============================================================
    res.json({
      success: true,
      voucherTypes: listVoucherTypes,
      userVouchers,
      userBalance,
    });
  } catch (e) {
    console.error("Error in getAllVouchers:", e);
    return res.status(500).json({ success: false, error: e.message });
  }
};

const purchaseVoucher = async (req, res) => {
  try {
    const { userId, voucherId } = req.body;
    console.log(userId, " ", voucherId)
    // Validate inputs
    if (!userId || !voucherId) {
      console.log("Missing userId or voucherId")
      return res.status(400).json({ success: false, error: "Missing userId or voucherId" });
    }
    // Find the voucher by ID
    const voucher = await VoucherTypes.findOne({ where: { id: voucherId } });
    if (!voucher) {
      console.log("Voucher not found")
      return res.status(404).json({ success: false, error: "Voucher not found" });
    }
    // Get the token cost from voucher
    const tokenCost = voucher.token_cost;
    // Redeem points with the voucher's token cost
    try {
      console.log("Reemding points")
      await RewardTokenService.redeemPoints(userId, tokenCost);
      return res.json({ success: true, message: "Voucher purchased successfully", data: { voucherId, tokenCost } });
    } catch (error) {
      console.log("FAILED FAILED FAILED FAILED")
      console.log("FAILED FAILED FAILED FAILED")
      console.log("FAILED FAILED FAILED FAILED")
      return res.status(400).json({ success: false, error: error.message || "Failed to redeem points" });
    }
  } catch (e) {
    console.error("Error in purchaseVoucher:", e);
    console.log("FAILED FAILED FAILED FAILED")
    console.log("FAILED FAILED FAILED FAILED")
    console.log("FAILED FAILED FAILED FAILED")
    return res.status(500).json({ success: false, error: "Internal server error" });
  }
};

module.exports = {
  getOrdersByUserID,
  getAllOrdersByStatus,
  getOrdersByStatusAndUser,
  getOrdersByShipperID,
  createOrder,
  confirmOrder,
  completeOrder,
  cancelOrder,
  assignOrderToShipper,
  createCryptoOrder,
  submitCryptoResult,
  getEventsByOrderId,
  getAllOrderEvents,
  getAllVouchers,
  purchaseVoucher,
};
