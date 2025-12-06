// services/ReceiptService.js
const fs = require("fs-extra");
const path = require("path");
const crypto = require("crypto");
const pinataSDK = require("@pinata/sdk");
const puppeteer = require("puppeteer");

// Config Pinata
const pinata = new pinataSDK(
  process.env.PINATA_API_KEY,
  process.env.PINATA_API_SECRET
);

class ReceiptService {
  // 1. Tạo Key mã hóa (userId + orderId + timestamp)
  _generateKey(userId, orderId, timestamp) {
    // Dùng template string `` để ép kiểu số thành chuỗi an toàn
    const secret = `${userId}-${orderId}-${timestamp}`;
    return crypto.createHash("sha256").update(secret).digest();
  }

  // 2. Tạo file PDF từ HTML
  async generatePDF(order, filePath) {
    // Tạo nội dung HTML đơn giản
    const htmlContent = `
            <html>
                <body style="font-family: Arial; padding: 20px;">
                    <h1>HÓA ĐƠN ĐIỆN TỬ (BLOCKCHAIN)</h1>
                    <hr/>
                    <p><strong>Mã đơn hàng:</strong> ${
                      order.order_code || order.id
                    }</p>
                    <p><strong>Khách hàng:</strong> ${order.user_id}</p>
                    <p><strong>Ngày tạo:</strong> ${order.order_date}</p>
                    <p><strong>Tổng tiền:</strong> ${order.final_amount} VND</p>
                    <p><strong>Phương thức:</strong> ${order.payment_method}</p>
                    <p><strong>Trạng thái Escrow:</strong> ${
                      order.escrow_status
                    }</p>
                </body>
            </html>
        `;

    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setContent(htmlContent);
    await page.pdf({ path: filePath, format: "A4" });
    await browser.close();
  }

  // 3. Mã hóa file PDF
  async encryptFile(inputPath, outputPath, userId, orderId, timestamp) {
    // BƯỚC QUAN TRỌNG: Tự sinh key từ thông tin đơn hàng
    // Đảm bảo userId, orderId được chuyển thành string
    const key = this._generateKey(String(userId), String(orderId), timestamp);

    const iv = crypto.randomBytes(16); // Tạo Vector khởi tạo ngẫu nhiên

    const cipher = crypto.createCipheriv("aes-256-cbc", key, iv);
    const input = fs.createReadStream(inputPath);
    const output = fs.createWriteStream(outputPath);

    // Ghi IV vào 16 bytes đầu tiên của file output
    output.write(iv);

    await new Promise((resolve, reject) => {
      input.pipe(cipher).pipe(output).on("finish", resolve).on("error", reject);
    });
  }

  // 4. Upload lên Pinata (IPFS)
  async uploadToIPFS(filePath, filename) {
    const readableStreamForFile = fs.createReadStream(filePath);
    const options = {
      pinataMetadata: {
        name: filename,
      },
    };
    const result = await pinata.pinFileToIPFS(readableStreamForFile, options);
    return result.IpfsHash; // Trả về CID
  }

  async decryptFile(inputBuffer, userId, orderId, timestamp) {
    try {
      // 1. Tái tạo Key (Quan trọng: Phải ép kiểu String y hệt lúc Encrypt)
      const key = this._generateKey(String(userId), String(orderId), timestamp);

      // 2. Tách IV và Ciphertext
      // 16 bytes đầu tiên là Vector khởi tạo (IV)
      const iv = inputBuffer.subarray(0, 16);

      // Phần còn lại là nội dung đã mã hóa
      const encryptedContent = inputBuffer.subarray(16);

      // 3. Khởi tạo bộ giải mã AES-256-CBC
      const decipher = crypto.createDecipheriv("aes-256-cbc", key, iv);

      // 4. Thực hiện giải mã
      const decrypted = Buffer.concat([
        decipher.update(encryptedContent),
        decipher.final(),
      ]);

      return decrypted; // Trả về Buffer PDF sạch
    } catch (error) {
      console.error("Lỗi giải mã (Decrypt):", error.message);
      throw new Error(
        "Không thể giải mã hóa đơn. Có thể Key sai hoặc file bị lỗi."
      );
    }
  }
}

module.exports = new ReceiptService();
