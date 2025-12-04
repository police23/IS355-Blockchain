const { ethers } = require("ethers");
const { ESCROW_ABI } = require("../utils/escrowClient");
const { pushToQueue } = require("./queueService");

// Dùng WSS để nghe sự kiện tốt hơn HTTP
// Bạn cần đổi RPC_URL trong .env thành dạng wss://... (Ví dụ Alchemy/Infura hỗ trợ WSS)
// Nếu dùng public node HTTP, ethers sẽ dùng cơ chế polling (hỏi liên tục) -> Vẫn ổn cho demo.
const provider = new ethers.WebSocketProvider(
  process.env.WSS_RPC_URL || process.env.RPC_URL.replace("https", "wss")
);
// Lưu ý: Nếu public node không có wss, dùng JsonRpcProvider như cũ cũng được, ethers tự lo polling.

const contract = new ethers.Contract(
  process.env.ESCROW_CONTRACT_ADDRESS,
  ESCROW_ABI,
  provider
);

const startListener = () => {
  console.log("🎧 Bắt đầu lắng nghe sự kiện Smart Contract...");

  // 1. Lắng nghe sự kiện Nạp tiền (PaymentRecorded)
  contract.on(
    "PaymentRecorded",
    (
      paymentId,
      orderIdBytes32,
      payer,
      payee,
      amount,
      status,
      timestamp,
      event
    ) => {
      // Decode bytes32 -> string orderId nếu cần
      // Nhưng lưu ý bytes32 hash 1 chiều không decode được, nên ta lưu hash hoặc map từ trước
      // Ở đây ta cứ lưu orderIdBytes32 vào DB

      const eventData = {
        eventName: "PaymentRecorded",
        transactionHash: event.log.transactionHash,
        blockNumber: event.log.blockNumber,
        orderId: orderIdBytes32, // Hoặc tìm cách map lại ID gốc
        payload: {
          paymentId: paymentId.toString(),
          payer,
          payee,
          amount: amount.toString(),
          status: status.toString(),
        },
      };

      // Đẩy vào Redis Queue
      pushToQueue(eventData);
    }
  );

  // 2. Lắng nghe sự kiện Hoàn tiền / Giải phóng
  // contract.on("EscrowReleased", ...tương tự...)
  // contract.on("EscrowRefunded", ...tương tự...)
};

module.exports = { startListener };
