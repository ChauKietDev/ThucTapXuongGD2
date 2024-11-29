import { LAMPORTS_PER_SOL, SystemProgram, Transaction, sendAndConfirmTransaction, Keypair, PublicKey, Connection, clusterApiUrl } from "@solana/web3.js";
// Kết nối với mạng Solana
const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');
// Địa chỉ ví gửi cố định dưới dạng chuỗi
const senderPublicKeyString = "A4UX5999dHCJ9UQKp7VnWhtHTjQ4eaTUucAxqdmVxd1g"; // Địa chỉ ví người gửi cố định
const senderPublicKey = new PublicKey(senderPublicKeyString); // Chuyển chuỗi thành PublicKey
// Địa chỉ ví nhận cố định dưới dạng chuỗi
const receiverPublicKeyString = "A4UX5999dHCJ9UQKp7VnWhtHTjQ4eaTUucAxqdmVxd1g"; // Địa chỉ ví người nhận cố định
const receiverPublicKey = new PublicKey(receiverPublicKeyString); // Chuyển chuỗi thành PublicKey
// Giả sử bạn có secretKey dưới dạng một mảng số nguyên (Uint8Array)
const secretKeyArray = new Uint8Array([163, 47, 75, 73, 215, 200, 119, 33, 198, 204, 115, 21, 222, 182, 83, 127, 49, 17, 198, 211, 96, 72, 12, 6, 134, 92, 113, 198, 96, 249, 182, 244, 50, 144, 1, 71, 216, 250, 0, 187, 180, 192, 25, 108, 36, 3, 70, 56, 14, 175, 129, 164, 216, 229, 221, 239, 39, 134, 182, 240, 228, 36, 13, 17]); // Bạn cần điền giá trị thực tế vào đây
// Tạo ví gửi cố định với secretKey
const sender = Keypair.fromSecretKey(secretKeyArray);
// Hàm chuyển Sol
async function transferSol() {
    try {
        // Kiểm tra và in ra số dư trước khi chuyển
        const preBalance1 = await connection.getBalance(sender.publicKey);
        const preBalance2 = await connection.getBalance(receiverPublicKey);
        console.log("Số dư ví gửi trước khi chuyển:", preBalance1 / LAMPORTS_PER_SOL);
        console.log("Số dư ví nhận trước khi chuyển:", preBalance2 / LAMPORTS_PER_SOL);
        console.log("\n");
        // Số lượng SOL muốn chuyển
        const transferAmount = 0.01; // 0.01 SOL
        // Tạo lệnh chuyển tiền từ ví gửi đến ví nhận
        const transferInstruction = SystemProgram.transfer({
            fromPubkey: sender.publicKey,
            toPubkey: receiverPublicKey, // Sử dụng ví nhận cố định
            lamports: transferAmount * LAMPORTS_PER_SOL, // Chuyển đổi SOL sang lamports
        });
        // Thêm lệnh chuyển tiền vào giao dịch
        const transaction = new Transaction().add(transferInstruction);
        // Gửi giao dịch và xác nhận
        const transactionSignature = await sendAndConfirmTransaction(connection, transaction, [sender] // Chữ ký của ví gửi
        );
        // Kiểm tra số dư sau khi chuyển
        const postBalance1 = await connection.getBalance(sender.publicKey);
        const postBalance2 = await connection.getBalance(receiverPublicKey);
        console.log("Số dư ví gửi sau khi chuyển:", postBalance1 / LAMPORTS_PER_SOL);
        console.log("Số dư ví nhận sau khi chuyển:", postBalance2 / LAMPORTS_PER_SOL);
        console.log("\n");
        // In ra chữ ký giao dịch để kiểm tra trên Solana Explorer
        console.log("Chữ ký giao dịch:", `https://explorer.solana.com/tx/${transactionSignature}?cluster=devnet`);
    }
    catch (error) {
        console.error("Lỗi trong quá trình giao dịch:", error);
    }
}
// Gọi hàm transferSol()
transferSol();
