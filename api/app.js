
import { Connection, PublicKey, SystemProgram, Transaction, sendAndConfirmTransaction, Keypair } from '@solana/web3.js';

import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';

// Khởi tạo ứng dụng Express
const app = express();

// Sử dụng CORS
app.use(cors());

// Sử dụng body-parser
app.use(bodyParser.json());

// Kết nối đến Solana Devnet (hoặc Mainnet nếu cần)
const connection = new Connection('https://api.devnet.solana.com', 'confirmed');

app.post('/transfer', async (req, res) => {
    const { receiver, amount } = req.body; // Chỉ nhận địa chỉ ví người nhận và số xu
  
    try {
      // Kiểm tra các tham số đã được truyền vào chưa
      if (!receiver || !amount) {
        return res.status(400).json({ error: 'Missing required fields: receiver, amount' });
      }
  
      // Địa chỉ ví người gửi có thể được lấy từ ví đang kết nối hoặc ví mặc định
      const senderPublicKey = new PublicKey("4QNk8cYZfD77usUXsBMRuGUKhHcpKZwHnqQNn3y7k6QG"); // Ví người gửi (ví dụ giả định)
      const receiverPublicKey = new PublicKey(receiver); // Địa chỉ ví người nhận
      const transferAmount = parseFloat(amount) * 1e9; // Chuyển đổi SOL thành lamports (1 SOL = 1e9 lamports)
  
      // Tạo giao dịch chuyển tiền
      const transferInstruction = SystemProgram.transfer({
        fromPubkey: senderPublicKey,
        toPubkey: receiverPublicKey,
        lamports: transferAmount, // Dùng lamports để thực hiện giao dịch
      });
  
      const transaction = new Transaction().add(transferInstruction);
  
      // Sử dụng Keypair thực tế của ví người gửi
      const senderKeypair = Keypair.fromSecretKey(new Uint8Array([163,47,75,73,215,200,119,33,198,204,115,21,222,182,83,127,49,17,198,211,96,72,12,6,134,92,113,198,96,249,182,244,50,144,1,71,216,250,0,187,180,192,25,108,36,3,70,56,14,175,129,164,216,229,221,239,39,134,182,240,228,36,13,17])) // Điền vào SecretKey thật của ví
      const transactionSignature = await sendAndConfirmTransaction(connection, transaction, [senderKeypair]);
  
      // Phản hồi về frontend
      res.json({
        success: true,
        message: 'Chuyển tiền thành công!',
        transactionSignature: `https://explorer.solana.com/tx/${transactionSignature}?cluster=devnet`
      });
    } catch (error) {
      console.error("Lỗi trong quá trình giao dịch:", error);
      res.status(500).json({ error: 'Đã xảy ra lỗi trong quá trình giao dịch.' });
    }
  });
  
// Lắng nghe trên cổng 3000
app.listen(3000, () => {
    console.log('Server đang chạy trên http://localhost:3000');
});