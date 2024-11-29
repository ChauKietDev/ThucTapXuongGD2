
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

// // Ví giả lập (có thể thay thế bằng ví thực tế)
// const sender = Keypair.fromSecretKey(new Uint8Array([163, 47, 75, 73, 215, 200, 119, 33, 198, 204, 115, 21, 222, 182, 83, 127, 49, 17, 198, 211, 96, 72, 12, 6, 134, 92, 113, 198, 96, 249, 182, 244, 50, 144, 1, 71, 216, 250, 0, 187, 180, 192, 25, 108, 36, 3, 70, 56, 14, 175, 129, 164, 216, 229, 221, 239, 39, 134, 182, 240, 228, 36, 13, 17])); // Sử dụng Keypair từ secret key của ví gửi
// const receiverPublicKey = new PublicKey('A4UX5999dHCJ9UQKp7VnWhtHTjQ4eaTUucAxqdmVxd1g');  // Ví nhận

// // API chuyển token
// app.post('/transfer', async (req, res) => {
//     try {
//         // Kiểm tra số dư ví gửi và ví nhận trước khi chuyển
//         const preBalance1 = await connection.getBalance(sender.publicKey);
//         const preBalance2 = await connection.getBalance(receiverPublicKey);

//         // Chuyển đổi lamports sang SOL
//         const preBalance1InSOL = preBalance1 / 1e9;  // Chia cho 1 tỷ để chuyển từ lamports sang SOL
//         const preBalance2InSOL = preBalance2 / 1e9;  // Chia cho 1 tỷ để chuyển từ lamports sang SOL

//         console.log("Số dư ví gửi trước khi chuyển:", preBalance1InSOL.toFixed(2));  // Hiển thị 2 chữ số thập phân
//         console.log("Số dư ví nhận trước khi chuyển:", preBalance2InSOL.toFixed(2));  // Hiển thị 2 chữ số thập phân


//         // Số lượng SOL muốn chuyển (có thể thay đổi)
//         const transferAmount = 0.01;  // 0.01 SOL (sử dụng đơn vị lamports)

//         // Tạo lệnh chuyển SOL từ ví gửi đến ví nhận
//         const transferInstruction = SystemProgram.transfer({
//             fromPubkey: sender.publicKey,
//             toPubkey: receiverPublicKey,
//             lamports: transferAmount * 1000000000, // Chuyển đổi SOL sang lamports (1 SOL = 1 tỷ lamports)
//         });

//         // Tạo giao dịch
//         const transaction = new Transaction().add(transferInstruction);

//         // Thực hiện giao dịch và xác nhận
//         const transactionSignature = await sendAndConfirmTransaction(connection, transaction, [sender]);

//         // Kiểm tra số dư sau khi chuyển
//         const postBalance1 = await connection.getBalance(sender.publicKey);
//         const postBalance2 = await connection.getBalance(receiverPublicKey);

//         const postBalance1InSol = postBalance1 / 1e9
//         const postBalance2InSol = postBalance2 / 1e9

//         console.log("Số dư ví gửi sau khi chuyển:", postBalance1InSol.toFixed(2));
//         console.log("Số dư ví nhận sau khi chuyển:", postBalance2InSol.toFixed(2));

//         // Trả về kết quả giao dịch
//         res.json({
//             status: 'success',
//             transactionSignature: `https://explorer.solana.com/tx/${transactionSignature}?cluster=devnet`
//         });

//     } catch (error) {
//         console.error("Lỗi trong quá trình giao dịch:", error);
//         res.status(500).json({ status: 'error', message: error.message });
//     }
// });

// // Khởi động server
// app.listen(port, () => {
//     console.log(`Server đang chạy trên http://localhost:${port}`);
// });



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