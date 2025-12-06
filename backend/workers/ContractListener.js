// workers/ContractListener.js
const { ethers } = require("ethers");
const { ESCROW_ABI } = require("../utils/escrowClient"); // Import ABI
const QueueService = require("../services/QueueService");

// Mapping Status từ số sang chữ (cho đẹp DB)
const STATUS_MAP = ["None", "Active", "Released", "Refunded"];

const startListener = () => {
  try {
    // Dùng WebSocket (wss) nếu có để nghe sự kiện mượt hơn, không thì dùng http (polling)
    const provider = new ethers.JsonRpcProvider(process.env.ESCROW_RPC_URL);

    // Khởi tạo Contract (chỉ cần quyền Read)
    const contract = new ethers.Contract(
      process.env.ESCROW_CONTRACT_ADDRESS,
      ESCROW_ABI,
      provider
    );

    console.log(
      `🎧 Đang lắng nghe sự kiện trên Contract: ${process.env.ESCROW_CONTRACT_ADDRESS}`
    );

    // 1. Lắng nghe sự kiện EscrowCreated (Khởi tạo instance Escrow cho từng order)
    contract.on(
      "EscrowCreated",
      (orderKey, orderId, amount, seller, createdAt, event) => {
        console.log(`🔥 [EscrowCreated] Order: ${orderId}`);

        const eventData = {
          eventName: "EscrowCreated",
          transactionHash: event.log.transactionHash,
          blockNumber: event.log.blockNumber,
          orderId: orderId,
          payload: {
            seller,
            amount: ethers.formatEther(amount), // Convert Wei -> ETH cho dễ đọc
            createdAt: createdAt.toString(),
            status: "Active", // Map sang trạng thái DB: Active
          },
        };

        QueueService.pushToQueue(eventData);
        console.log("đã đẩy escrow create vào queue");
      }
    );

    contract.on(
      "EscrowFunded",
      (
        orderKey,
        orderId,
        buyer,
        seller,
        amount,
        fundedAt,
        timeoutAt,
        event
      ) => {
        console.log(`🔥 [EscrowFunded] Order: ${orderId} (Key: ${orderKey})`);

        const eventData = {
          eventName: "EscrowFunded",
          transactionHash: event.log.transactionHash,
          blockNumber: event.log.blockNumber,
          // Vì trong Event này orderId là string (không phải indexed), nên lấy trực tiếp được
          orderId: orderId,
          payload: {
            buyer: buyer,
            seller: seller,
            amount: ethers.formatEther(amount), // Convert Wei -> ETH
            fundedAt: fundedAt.toString(), // BigInt -> String
            timeoutAt: timeoutAt.toString(), // BigInt -> String
            status: "Active", // Hoặc "Funded" tùy logic của bạn
          },
          // timestamp: fundedAt.toString() // Nếu bạn muốn dùng thời điểm fund làm time mốc
        };

        // Đẩy sang Queue Service
        QueueService.pushToQueue(eventData);
      }
    );

    // 2. Lắng nghe sự kiện PaymentRecorded (Người mua nạp tiền)
    contract.on(
      "PaymentRecorded",
      (
        paymentId,
        orderKey,
        orderId,
        amount,
        statusInt,
        timestamp,
        sender,
        event
      ) => {
        console.log(
          `🔥 Bắt được sự kiện PaymentRecorded cho OrderHash: ${orderId}`
        );

        const eventData = {
          eventName: "PaymentRecorded",
          transactionHash: event.log.transactionHash,
          blockNumber: event.log.blockNumber,
          orderId: orderId,
          payload: {
            paymentId: paymentId.toString(),
            sender,
            amount: ethers.formatEther(amount),
            status: STATUS_MAP[statusInt] || "Unknown",
          },
          timestamp: timestamp.toString(),
        };

        // Đẩy sang Queue Service
        QueueService.pushToQueue(eventData);
      }
    );

    // 3. Lắng nghe sự kiện EscrowReleased (Shipper ấn xác nhận)
    contract.on(
      "EscrowReleased",
      (
        orderKey,
        orderId,
        buyer,
        seller,
        amount,
        releasedBy,
        releasedAt,
        event
      ) => {
        console.log(`✅ [EscrowReleased] OrderHash: ${orderId}`);

        const eventData = {
          eventName: "EscrowReleased",
          transactionHash: event.log.transactionHash,
          blockNumber: event.log.blockNumber,
          orderId: orderId,
          payload: {
            buyer,
            seller,
            amount: ethers.formatEther(amount),
            releasedBy,
            releasedAt: releasedAt.toString(),
            status: "Released", // Map sang trạng thái DB: Released
          },
        };

        QueueService.pushToQueue(eventData);
      }
    );

    // 4. Lắng nghe sự kiện hoàn tiền (Đơn hủy hoặc Timeout -> Trả tiền Buyer)
    contract.on(
      "EscrowRefunded",
      (
        orderKey,
        orderId,
        buyer,
        seller,
        amount,
        refundedBy,
        refundedAt,
        timeout,
        event
      ) => {
        console.log(`↩️ [EscrowRefunded] OrderHash: ${orderId}`);

        const eventData = {
          eventName: "EscrowRefunded",
          transactionHash: event.log.transactionHash,
          blockNumber: event.log.blockNumber,
          orderId: orderId,
          payload: {
            buyer,
            seller,
            amount: ethers.formatEther(amount),
            refundedBy,
            refundedAt: refundedAt.toString(),
            isTimeout: timeout, // Boolean
            status: "Refunded", // Map sang trạng thái DB: Refunded
          },
        };

        QueueService.pushToQueue(eventData);
      }
    );

    // Xử lý lỗi mất kết nối
    provider.on("error", (err) => {
      console.error("Lỗi kết nối Blockchain provider:", err);
      // Logic reconnect nếu cần
    });
  } catch (error) {
    console.error("Không thể khởi động Listener:", error);
  }
};

module.exports = { startListener };
