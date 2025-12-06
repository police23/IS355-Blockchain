// services/EscrowService.js
const escrowClient = require("../utils/escrowClient"); // File cấu hình ethers.js cũ của bạn
const { ethers } = require("ethers");
const db = require("../db");

class EscrowService {
  // ======================================================
  // PHẦN 1: WRITE (GHI - Tương tác trực tiếp với Blockchain)
  // ======================================================

  // Kiểm tra trạng thái trên chain (isActive)
  // ABI: function isActive(string orderId) view returns (bool)
  async checkEscrowStatus(orderId) {
    try {
      // orderId giờ là string, không cần hash nữa
      return await escrowClient.escrowContract.isActive(String(orderId));
    } catch (error) {
      console.error(`[EscrowService] Lỗi checkEscrowStatus: ${error.message}`);
      return false;
    }
  }

  // Tạo Escrow (Admin gọi trước để setup, nhưng thường Frontend deposit luôn)
  // ABI: function createEscrow(string orderId, uint256 amount)
  async createEscrowOnChain(orderId, amountWei) {
    try {
      console.log(
        `[EscrowService] Creating Escrow for ${orderId}, amount: ${amountWei}`
      );
      const tx = await escrowClient.escrowContract.createEscrow(
        String(orderId),
        amountWei
      );
      await tx.wait();
      return tx.hash;
    } catch (error) {
      console.error(
        `[EscrowService] Lỗi createEscrowOnChain: ${error.message}`
      );
      throw error;
    }
  }

  // Giải ngân cho người bán
  // ABI: function releaseEscrow(string orderId)
  async releaseMoney(orderId) {
    const isActive = await this.checkEscrowStatus(orderId);
    if (!isActive) {
      console.log(
        `[EscrowService] Order ${orderId} không có active escrow. Bỏ qua release.`
      );
      return null;
    }

    try {
      console.log(`[EscrowService] Releasing Escrow for ${orderId}`);
      // Gọi hàm releaseEscrow trong contract
      const tx = await escrowClient.escrowContract.releaseEscrow(
        String(orderId)
      );
      await tx.wait(); // Đợi transaction được đào
      return tx.hash;
    } catch (error) {
      console.error(`[EscrowService] Lỗi releaseMoney: ${error.message}`);
      throw error;
    }
  }

  // Hoàn tiền cho người mua
  // ABI: function refundEscrow(string orderId)
  async refundMoney(orderId) {
    const isActive = await this.checkEscrowStatus(orderId);
    if (!isActive) {
      console.log(
        `[EscrowService] Order ${orderId} không có active escrow. Bỏ qua refund.`
      );
      return null;
    }

    try {
      console.log(`[EscrowService] Refunding Escrow for ${orderId}`);
      // Gọi hàm refundEscrow trong contract
      const tx = await escrowClient.escrowContract.refundEscrow(
        String(orderId)
      );
      await tx.wait();
      return tx.hash;
    } catch (error) {
      console.error(`[EscrowService] Lỗi refundMoney: ${error.message}`);
      throw error;
    }
  }

  // ======================================================
  // PHẦN 2: READ (ĐỌC - Lấy dữ liệu từ MySQL đã sync)
  // ======================================================

  // Lấy lịch sử sự kiện của 1 đơn hàng cụ thể
  async getEventsByOrderId(rawOrderId) {
    // Vì ABI mới dùng string orderId, nên trong DB (bảng contract_events)
    // cột order_id bây giờ sẽ lưu chuỗi gốc (VD: "ORD-123") thay vì Hash.
    // -> KHÔNG CẦN HASH NỮA

    const orderIdString = String(rawOrderId);

    console.log(`[EscrowService] Lấy logs cho Order: ${orderIdString}`);

    const sql = `SELECT * FROM contract_events WHERE order_id = ? ORDER BY created_at DESC`;

    const rows = await db.query(sql, {
      replacements: [orderIdString],
      type: db.QueryTypes.SELECT,
    });

    return rows;
  }

  // Lấy toàn bộ sự kiện hệ thống
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

    const rows = await db.query(sql, {
      replacements: [...params, parseInt(limit), parseInt(offset)],
      type: db.QueryTypes.SELECT,
    });

    const countResult = await db.query(countSql, {
      replacements: type ? [type] : [],
      type: db.QueryTypes.SELECT,
    });

    return {
      rows,
      total: countResult[0].total,
    };
  }
}

module.exports = new EscrowService();
