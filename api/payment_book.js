import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { Connection, PublicKey, Keypair, Transaction, SystemProgram } from '@solana/web3.js';
import QRCode from 'qrcode';
import punycode from 'punycode';


const app = express();
app.use(cors());
app.use(bodyParser.json());

// Kết nối đến Solana Devnet
const connection = new Connection('https://api.devnet.solana.com', 'confirmed');

// Địa chỉ ví admin
const receiverPublicKey = new PublicKey('4QNk8cYZfD77usUXsBMRuGUKhHcpKZwHnqQNn3y7k6QG');

// Endpoint: Tạo mã QR cho thanh toán SOL
app.get('/generate-qr', async (req, res) => {
    const amount = req.query.amount;  // Lấy số tiền
    const orderId = req.query.orderId; // Lấy mã đơn hàng làm memo

    if (!amount || isNaN(amount) || !orderId) {
        return res.status(400).json({ error: 'Số tiền hoặc mã đơn hàng không hợp lệ' });
    }

    // Tạo URL thanh toán với memo
    const url = `solana:${receiverPublicKey.toBase58()}?amount=${amount}&memo=${orderId}`;

    // Tạo mã QR
    QRCode.toDataURL(url, (err, qrCodeData) => {
        if (err) {
            return res.status(500).json({ error: 'Không thể tạo QR code' });
        }

        res.json({
            success: true,
            message: 'QR code được tạo thành công',
            qrCodeData
        });
    });
});

// Endpoint: Kiểm tra giao dịch
app.get('/check-transaction', async (req, res) => {
    const orderId = req.query.orderId;
    const expectedAmount = parseFloat(req.query.amount);

    if (!orderId || isNaN(expectedAmount)) {
        return res.status(400).json({ error: 'Thông tin kiểm tra không hợp lệ' });
    }

    try {
        // Lấy danh sách giao dịch gần đây liên quan đến ví admin
        const signatures = await connection.getSignaturesForAddress(receiverPublicKey, { limit: 10 });
        console.log('Danh sách chữ ký:', signatures);

        for (const sig of signatures) {
            if (!sig.signature) {
                console.log('Không tìm thấy chữ ký:', sig);
                continue;
            }

            // Lấy chi tiết giao dịch từ chữ ký
            const transaction = await connection.getTransaction(sig.signature, {
                commitment: 'confirmed',
                maxSupportedTransactionVersion: 0
            });

            if (!transaction) {
                console.log('Không tìm thấy giao dịch cho chữ ký:', sig.signature);
                continue;
            }

            // Kiểm tra trực tiếp `memo` từ giao dịch
            const memo = sig.memo; // Memo từ chữ ký giao dịch
            console.log('Memo gốc:', memo);

            if (memo) {
                // Loại bỏ phần số và ký tự phía trước trong memo
                const cleanedMemo = memo.replace(/^\[\d+\]\s*/, '').trim(); // Loại bỏ "[số] " và khoảng trắng dư
                console.log('Memo đã làm sạch:', cleanedMemo);
                console.log('OrderId:', orderId);

                if (cleanedMemo === orderId) { // So sánh với orderId đã được làm sạch
                    const preBalances = transaction.meta.preBalances;
                    const postBalances = transaction.meta.postBalances;

                    if (!preBalances || !postBalances || preBalances.length < 2 || postBalances.length < 2) {
                        console.log('Dữ liệu balances không hợp lệ:', preBalances, postBalances);
                        continue;
                    }
                    const lamportsToSol = 1000000000;
                    const amountTransferred =
                        (transaction.meta.postBalances[1] - transaction.meta.preBalances[1]) / lamportsToSol; // Chuyển đổi Lamports sang SOL
                    console.log('Số tiền đã chuyển:', amountTransferred);
                    console.log('Số tiền yêu cầu:', expectedAmount);

                    if (amountTransferred === expectedAmount) {
                        return res.json({
                            success: true,
                            message: 'Giao dịch hợp lệ',
                            sender: transaction.transaction.message.accountKeys[0].toBase58(),
                            amount: amountTransferred
                        });
                    } else {
                        console.log('Số tiền không khớp:', amountTransferred, expectedAmount);
                    }
                } else {
                    console.log('Memo không khớp với OrderId:', cleanedMemo, orderId);
                }
            } else {
                console.log('Giao dịch không chứa memo:', sig.signature);
            }
        }

        res.status(404).json({ success: false, message: 'Không tìm thấy giao dịch hợp lệ' });
    } catch (error) {
        res.status(500).json({ error: 'Lỗi khi kiểm tra giao dịch', details: error.message });
    }
});

// Khởi động server
const PORT = 3000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
