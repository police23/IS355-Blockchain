// services/QueueService.js
const redisClient = require("../config/redis");
const db = require("../db"); // MySQL Connection

const QUEUE_KEY = "blockchain_events_queue";

class QueueService {
  // 1. Đẩy sự kiện vào hàng đợi (Redis)
  async pushToQueue(eventData) {
    try {
      // Lưu dưới dạng chuỗi JSON
      await redisClient.rPush(QUEUE_KEY, JSON.stringify(eventData));
      console.log(`[Queue] Pushed event: ${eventData.eventName}`);
    } catch (err) {
      console.error("[Queue] Push error:", err);
    }
  }

  // 2. Xử lý hàng loạt (Batch Processing)
  // Hàm này sẽ được gọi định kỳ (VD: 5 giây/lần)
  async processBatch() {
    try {
      const limit = 10; // Lấy tối đa 10 cái mỗi lần
      const items = [];

      // --- SỬA ĐOẠN NÀY ---
      // Thay vì dùng lPopCount, ta loop để pop từng cái (An toàn cho mọi version Redis)
      for (let i = 0; i < limit; i++) {
        // rPush vào bên phải -> lPop lấy từ bên trái (FIFO - Vào trước ra trước)
        const itemStr = await redisClient.lPop(QUEUE_KEY);
        if (!itemStr) break; // Nếu hàng đợi rỗng thì dừng ngay
        console.log("item: " + itemStr);
        items.push(itemStr);
      }
      // --------------------

      if (items.length === 0) return; // Không có gì để xử lý

      console.log(`[Batch] Đang ghi ${items.length} sự kiện vào MySQL...`);

      // 1. Chuẩn bị dữ liệu phẳng (Flat Array)
      // Sequelize raw query không hiểu [[row1], [row2]] cho VALUES ?
      // Nên ta phải biến đổi thành [col1, col2, col3, col1, col2, col3...]
      const flatValues = [];
      const placeholders = items
        .map((itemStr) => {
          const item = JSON.parse(itemStr);

          // Đẩy từng cột vào mảng phẳng
          flatValues.push(
            item.transactionHash,
            item.eventName,
            item.orderId,
            JSON.stringify(item.payload),
            item.blockNumber
          );

          // Trả về một nhóm placeholder cho dòng này
          return "(?, ?, ?, ?, ?)";
        })
        .join(", ");

      // 2. Xây dựng câu SQL
      // Kết quả sẽ dạng: INSERT INTO ... VALUES (?, ?, ?, ?, ?), (?, ?, ?, ?, ?)
      const sql = `INSERT INTO contract_events (transaction_hash, event_name, order_id, payload, block_number) VALUES ${placeholders}`;

      // 3. Thực thi qua Sequelize
      // Lưu ý: Phải dùng { replacements: ... }
      await db.query(sql, {
        replacements: flatValues,
        type: db.QueryTypes.INSERT,
      });

      console.log(`[Batch] ✅ Đã lưu thành công ${items.length} sự kiện.`);
    } catch (err) {
      console.error("[Batch] Process Error:", err);
      // Nếu lỗi DB, nên push ngược lại items vào Redis ở đầu hàng đợi (lPush) để retry
      // items.forEach(item => redisClient.lPush(QUEUE_KEY, item));
    }
  }
}

module.exports = new QueueService();
