const OrderService = require("../services/OrderService");
const EscrowService = require("../services/EscrowService");
const { ESCROW_ABI } = require("../utils/escrowClient");
const { ethers } = require("ethers");
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

const createCryptoOrder = async (req, res) => {
  try {
    const { amount, userId, orderId } = req.body; // Lấy thông tin từ request
    const contractAddress = process.env.ESCROW_CONTRACT_ADDRESS;
    const abi = [
      {
        inputs: [
          {
            internalType: "bytes32",
            name: "orderId",
            type: "bytes32",
          },
        ],
        name: "confirmEscrow",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "bytes32",
            name: "orderId",
            type: "bytes32",
          },
        ],
        name: "createEscrow",
        outputs: [],
        stateMutability: "payable",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "_merchantWallet",
            type: "address",
          },
        ],
        stateMutability: "nonpayable",
        type: "constructor",
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            internalType: "bytes32",
            name: "orderId",
            type: "bytes32",
          },
          {
            indexed: true,
            internalType: "address",
            name: "buyer",
            type: "address",
          },
          {
            indexed: true,
            internalType: "address",
            name: "seller",
            type: "address",
          },
          {
            indexed: false,
            internalType: "uint256",
            name: "amount",
            type: "uint256",
          },
          {
            indexed: false,
            internalType: "uint256",
            name: "createdAt",
            type: "uint256",
          },
          {
            indexed: false,
            internalType: "uint256",
            name: "timeoutAt",
            type: "uint256",
          },
        ],
        name: "EscrowCreated",
        type: "event",
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            internalType: "bytes32",
            name: "orderId",
            type: "bytes32",
          },
          {
            indexed: true,
            internalType: "address",
            name: "buyer",
            type: "address",
          },
          {
            indexed: true,
            internalType: "address",
            name: "seller",
            type: "address",
          },
          {
            indexed: false,
            internalType: "uint256",
            name: "amount",
            type: "uint256",
          },
          {
            indexed: false,
            internalType: "address",
            name: "refundedBy",
            type: "address",
          },
          {
            indexed: false,
            internalType: "uint256",
            name: "refundedAt",
            type: "uint256",
          },
          {
            indexed: false,
            internalType: "bool",
            name: "timeout",
            type: "bool",
          },
        ],
        name: "EscrowRefunded",
        type: "event",
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            internalType: "bytes32",
            name: "orderId",
            type: "bytes32",
          },
          {
            indexed: true,
            internalType: "address",
            name: "buyer",
            type: "address",
          },
          {
            indexed: true,
            internalType: "address",
            name: "seller",
            type: "address",
          },
          {
            indexed: false,
            internalType: "uint256",
            name: "amount",
            type: "uint256",
          },
          {
            indexed: false,
            internalType: "address",
            name: "releasedBy",
            type: "address",
          },
          {
            indexed: false,
            internalType: "uint256",
            name: "releasedAt",
            type: "uint256",
          },
        ],
        name: "EscrowReleased",
        type: "event",
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            internalType: "bytes32",
            name: "orderId",
            type: "bytes32",
          },
          {
            indexed: true,
            internalType: "address",
            name: "seller",
            type: "address",
          },
          {
            indexed: false,
            internalType: "uint256",
            name: "confirmedAt",
            type: "uint256",
          },
        ],
        name: "EscrowSellerConfirmed",
        type: "event",
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            internalType: "address",
            name: "previousOwner",
            type: "address",
          },
          {
            indexed: true,
            internalType: "address",
            name: "newOwner",
            type: "address",
          },
        ],
        name: "OwnershipTransferred",
        type: "event",
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            internalType: "uint256",
            name: "paymentId",
            type: "uint256",
          },
          {
            indexed: true,
            internalType: "bytes32",
            name: "orderId",
            type: "bytes32",
          },
          {
            indexed: true,
            internalType: "address",
            name: "payer",
            type: "address",
          },
          {
            indexed: false,
            internalType: "address",
            name: "payee",
            type: "address",
          },
          {
            indexed: false,
            internalType: "uint256",
            name: "amount",
            type: "uint256",
          },
          {
            indexed: false,
            internalType: "enum BookStoreEscrow.PaymentStatus",
            name: "status",
            type: "uint8",
          },
          {
            indexed: false,
            internalType: "uint256",
            name: "timestamp",
            type: "uint256",
          },
        ],
        name: "PaymentRecorded",
        type: "event",
      },
      {
        inputs: [
          {
            internalType: "bytes32",
            name: "orderId",
            type: "bytes32",
          },
        ],
        name: "refundEscrow",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "bytes32",
            name: "orderId",
            type: "bytes32",
          },
        ],
        name: "releaseEscrow",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "newOwner",
            type: "address",
          },
        ],
        name: "transferOwnership",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        stateMutability: "payable",
        type: "fallback",
      },
      {
        stateMutability: "payable",
        type: "receive",
      },
      {
        inputs: [],
        name: "activeEscrowCount",
        outputs: [
          {
            internalType: "uint256",
            name: "",
            type: "uint256",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [],
        name: "ESCROW_TIMEOUT",
        outputs: [
          {
            internalType: "uint256",
            name: "",
            type: "uint256",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [],
        name: "getActiveOrderIds",
        outputs: [
          {
            internalType: "bytes32[]",
            name: "",
            type: "bytes32[]",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "bytes32",
            name: "orderId",
            type: "bytes32",
          },
        ],
        name: "getEscrow",
        outputs: [
          {
            components: [
              {
                internalType: "address",
                name: "buyer",
                type: "address",
              },
              {
                internalType: "address",
                name: "seller",
                type: "address",
              },
              {
                internalType: "uint256",
                name: "amount",
                type: "uint256",
              },
              {
                internalType: "uint256",
                name: "createdAt",
                type: "uint256",
              },
              {
                internalType: "enum BookStoreEscrow.EscrowStatus",
                name: "status",
                type: "uint8",
              },
              {
                internalType: "bool",
                name: "sellerConfirmed",
                type: "bool",
              },
              {
                internalType: "uint256",
                name: "sellerConfirmedAt",
                type: "uint256",
              },
            ],
            internalType: "struct BookStoreEscrow.EscrowInfo",
            name: "",
            type: "tuple",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "bytes32",
            name: "orderId",
            type: "bytes32",
          },
        ],
        name: "getOrderPaymentIds",
        outputs: [
          {
            internalType: "uint256[]",
            name: "",
            type: "uint256[]",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "uint256",
            name: "paymentId",
            type: "uint256",
          },
        ],
        name: "getPayment",
        outputs: [
          {
            components: [
              {
                internalType: "bytes32",
                name: "orderId",
                type: "bytes32",
              },
              {
                internalType: "address",
                name: "payer",
                type: "address",
              },
              {
                internalType: "address",
                name: "payee",
                type: "address",
              },
              {
                internalType: "uint256",
                name: "amount",
                type: "uint256",
              },
              {
                internalType: "uint256",
                name: "timestamp",
                type: "uint256",
              },
              {
                internalType: "enum BookStoreEscrow.PaymentStatus",
                name: "status",
                type: "uint8",
              },
            ],
            internalType: "struct BookStoreEscrow.Payment",
            name: "",
            type: "tuple",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [],
        name: "getPaymentsLength",
        outputs: [
          {
            internalType: "uint256",
            name: "",
            type: "uint256",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "bytes32",
            name: "orderId",
            type: "bytes32",
          },
        ],
        name: "isActive",
        outputs: [
          {
            internalType: "bool",
            name: "",
            type: "bool",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [],
        name: "merchantWallet",
        outputs: [
          {
            internalType: "address",
            name: "",
            type: "address",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [],
        name: "owner",
        outputs: [
          {
            internalType: "address",
            name: "",
            type: "address",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [],
        name: "totalAmountInEscrow",
        outputs: [
          {
            internalType: "uint256",
            name: "",
            type: "uint256",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
    ];

    if (!contractAddress) {
      return res.status(500).json({
        success: false,
        message: "Server chưa cấu hình Contract Address",
      });
    }
    // Trả về thông tin + ABI cho Frontend dùng
    return res.status(200).json({
      success: true,
      data: {
        orderId,
        amount,
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
    const orderIdBytes32 = getBytes32FromId(orderId);

    console.log(
      `Checking events for Order: ${orderId} (Hash: ${orderIdBytes32})`
    );

    // 4. Quét Log (Event) trên Blockchain
    // contract.filters.PaymentRecorded(arg1, arg2...)
    // arg2 là orderId. Nếu orderId trong Solidity có 'indexed', ta truyền vào để lọc.
    // Nếu không có 'indexed', ta phải để null và lọc thủ công bằng JS.

    // GIẢ ĐỊNH 1: orderId CÓ 'indexed' (Cách chuẩn)
    const filter = contract.filters.PaymentRecorded(null, orderIdBytes32);

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
        payer: event.args[2],
        amount: ethers.formatEther(event.args[4]), // Đổi từ Wei sang ETH
        status: event.args[5].toString(), // Enum trả về số (0, 1...)
        txHash: event.transactionHash,
      };

      console.log("Tìm thấy giao dịch thành công:", paymentInfo);

      // TODO: Cập nhật Database của bạn ở đây
      // await Order.findOneAndUpdate({ orderId }, { status: 'PAID', paymentInfo });

      return res.status(200).json({
        success: true,
        message: "Giao dịch đã được xác nhận trên Blockchain",
        data: paymentInfo,
      });
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
    const events = await EscrowService.getEventsByOrderId(orderId);

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
      data: events,
      pagination: {
        page,
        limit,
        total: events.total,
      },
    });
  } catch (error) {
    console.error("[EscrowController] Lỗi lấy danh sách sự kiện:", error);
    return res.status(500).json({
      success: false,
      message: "Lỗi server khi lấy lịch sử sự kiện",
    });
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
};
