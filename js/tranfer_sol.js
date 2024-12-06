"use strict";
const QRCode = require('qrcode');
// Địa chỉ ví người nhận và số lượng SOL
const recipientPublicKey = '4QNk8cYZfD77usUXsBMRuGUKhHcpKZwHnqQNn3y7k6QG';
const amount = 1;
// Tạo URL chuyển SOL
const solanaUrl = `solana:${recipientPublicKey}?amount=${amount}`;
// Tạo mã QR từ URL
QRCode.toDataURL(solanaUrl, (err, url) => {
    if (err) {
        console.error('Error generating QR code', err);
    }
    else {
        console.log('QR code URL:', url); // URL của mã QR
        // Bạn có thể hiển thị mã QR này trên trang web hoặc gửi nó cho người dùng
    }
});
