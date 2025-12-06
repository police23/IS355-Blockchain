const fs = require("fs-extra");
const path = require("path");
const axios = require("axios"); // Để tải file từ IPFS
const { Order } = require("../models");
const ReceiptService = require("../services/ReceptService");
const OrderRegistryService = require("../services/OrderRegistryService");

// 1. Tạo hóa đơn (Trigger bởi Admin hoặc sau khi thanh toán xong)
exports.generateReceipt = async (req, res) => {
  const { orderId } = req.body;
  const tempDir = path.join(__dirname, "../temp"); // Tạo thư mục temp ở root

  try {
    await fs.ensureDir(tempDir);
    const order = await Order.findByPk(orderId);
    if (!order) throw new Error("Order not found");

    const timestamp = new Date(order.createdAt).getTime(); // Key cố định theo ngày tạo đơn
    const pdfName = `invoice_${orderId}.pdf`;
    const encName = `invoice_${orderId}.enc`;
    const pdfPath = path.join(tempDir, pdfName);
    const encPath = path.join(tempDir, encName);

    // A. Tạo PDF
    console.log("Generating PDF...");
    await ReceiptService.generatePDF(order, pdfPath);

    // B. Mã hóa PDF
    console.log("Encrypting...");
    await ReceiptService.encryptFile(
      pdfPath,
      encPath,
      order.user_id,
      order.id,
      timestamp
    );

    // C. Upload file ĐÃ MÃ HÓA lên IPFS
    console.log("Uploading to IPFS...");
    const cid = await ReceiptService.uploadToIPFS(encPath, encName);

    // D. Lưu vào Blockchain
    console.log("Saving to Blockchain...");
    await OrderRegistryService.saveReceiptCID(order.id, cid);

    // E. Lưu vào DB
    order.receipt_cid = cid; // Đảm bảo bảng orders đã có cột này
    await order.save();

    // F. Dọn rác
    await fs.remove(pdfPath);
    await fs.remove(encPath);

    res.json({
      success: true,
      cid,
      message: "Hóa đơn đã được lưu trữ an toàn",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// 2. Xem hóa đơn (Decrypt & Stream về Client)
exports.viewReceipt = async (req, res) => {
  try {
    const { orderId } = req.params;
    const order = await Order.findByPk(orderId);

    if (!order || !order.receipt_cid) {
      return res.status(404).json({ message: "Chưa có hóa đơn cho đơn này" });
    }

    // A. Tải file mã hóa từ IPFS
    const ipfsUrl = `https://gateway.pinata.cloud/ipfs/${order.receipt_cid}`;
    const response = await axios.get(ipfsUrl, { responseType: "arraybuffer" });
    const encryptedBuffer = Buffer.from(response.data);

    // B. Giải mã tại Backend
    const timestamp = new Date(order.createdAt).getTime();
    const pdfBuffer = await ReceiptService.decryptFile(
      encryptedBuffer,
      order.user_id,
      order.id,
      timestamp
    );

    // C. Trả về file PDF cho trình duyệt hiển thị luôn
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `inline; filename=invoice_${orderId}.pdf`
    );
    res.send(pdfBuffer);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi tải hóa đơn: " + error.message });
  }
};
