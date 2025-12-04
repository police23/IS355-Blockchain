// services/EscrowService.js
const escrowClient = require("../utils/escrowClient"); // File cấu hình ethers.js cũ của bạn
const { ethers } = require("ethers");
const db = require("../db");
class EscrowService {
  // Kiểm tra xem có escrow nào active không
  async checkEscrowStatus(orderId) {
    return await escrowClient.hasActiveEscrow(orderId);
  }

  // Gọi smart contract để release tiền cho seller
  async releaseMoney(orderId) {
    const hasEscrow = await this.checkEscrowStatus(orderId);
    if (!hasEscrow) {
      console.log(
        `[EscrowService] Order ${orderId} không có active escrow. Bỏ qua.`
      );
      return null;
    }
    // Gọi hàm releaseEscrowOnChain từ file config cũ
    return await escrowClient.releaseEscrowOnChain(orderId);
  }

  // Gọi smart contract để refund tiền cho buyer
  async refundMoney(orderId) {
    const hasEscrow = await this.checkEscrowStatus(orderId);
    if (!hasEscrow) {
      console.log(
        `[EscrowService] Order ${orderId} không có active escrow. Bỏ qua.`
      );
      return null;
    }
    return await escrowClient.refundEscrowOnChain(orderId);
  }

  // Lấy lịch sử sự kiện của 1 đơn hàng cụ thể
  // (Dùng để hiển thị timeline: Đã thanh toán -> Đã release -> ...)
  async getEventsByOrderId(rawOrderId) {
    // 1. Hash ID (Giữ nguyên)
    const hashedOrderId = ethers.keccak256(
      ethers.toUtf8Bytes(String(rawOrderId))
    );

    console.log(
      `[EscrowService] Lấy logs cho Order: ${rawOrderId} (Hash: ${hashedOrderId})`
    );

    const sql = `SELECT * FROM contract_events WHERE order_id = ? ORDER BY created_at DESC`;

    // 2. Query (Sửa đoạn này)
    const rows = await db.query(sql, {
      replacements: [hashedOrderId], // Truyền tham số vào đây
      type: db.QueryTypes.SELECT, // Trả về mảng object gọn gàng
    });

    return rows;
  }

  // Lấy toàn bộ sự kiện hệ thống (Dùng cho Admin Dashboard để soi log)
  async getAllEvents({ page, limit, type }) {
    const offset = (page - 1) * limit;
    const params = [];

    let sql = `SELECT * FROM contract_events`;
    let countSql = `SELECT COUNT(*) as total FROM contract_events`;

    if (type) {
      const condition = ` WHERE event_name = ?`;
      sql += condition;
      countSql += condition;
      params.push(type);
    }

    sql += ` ORDER BY created_at DESC LIMIT ? OFFSET ?`;

    // 1. Query lấy dữ liệu
    const rows = await db.query(sql, {
      replacements: [...params, parseInt(limit), parseInt(offset)], // Phải bọc trong replacements
      type: db.QueryTypes.SELECT, // Báo cho Sequelize biết đây là câu SELECT để trả về mảng kết quả gọn gàng
    });

    // 2. Query đếm tổng
    const countResult = await db.query(countSql, {
      replacements: type ? [type] : [],
      type: db.QueryTypes.SELECT,
    });

    // --------------------

    return {
      rows, // Với QueryTypes.SELECT, rows chính là mảng kết quả luôn, không cần destructuring [rows]
      total: countResult[0].total,
    };
  }
}

module.exports = new EscrowService();
