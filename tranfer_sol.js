"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function () { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function () { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var web3_js_1 = require("@solana/web3.js");
// Kết nối với mạng Solana
var connection = new web3_js_1.Connection((0, web3_js_1.clusterApiUrl)('devnet'), 'confirmed');
// Địa chỉ ví gửi cố định dưới dạng chuỗi
var senderPublicKeyString = "A4UX5999dHCJ9UQKp7VnWhtHTjQ4eaTUucAxqdmVxd1g"; // Địa chỉ ví người gửi cố định
var senderPublicKey = new web3_js_1.PublicKey(senderPublicKeyString); // Chuyển chuỗi thành PublicKey
// Địa chỉ ví nhận cố định dưới dạng chuỗi
var receiverPublicKeyString = "A4UX5999dHCJ9UQKp7VnWhtHTjQ4eaTUucAxqdmVxd1g"; // Địa chỉ ví người nhận cố định
var receiverPublicKey = new web3_js_1.PublicKey(receiverPublicKeyString); // Chuyển chuỗi thành PublicKey
// Giả sử bạn có secretKey dưới dạng một mảng số nguyên (Uint8Array)
var secretKeyArray = new Uint8Array([163, 47, 75, 73, 215, 200, 119, 33, 198, 204, 115, 21, 222, 182, 83, 127, 49, 17, 198, 211, 96, 72, 12, 6, 134, 92, 113, 198, 96, 249, 182, 244, 50, 144, 1, 71, 216, 250, 0, 187, 180, 192, 25, 108, 36, 3, 70, 56, 14, 175, 129, 164, 216, 229, 221, 239, 39, 134, 182, 240, 228, 36, 13, 17]); // Bạn cần điền giá trị thực tế vào đây
// Tạo ví gửi cố định với secretKey
var sender = web3_js_1.Keypair.fromSecretKey(secretKeyArray);
// Hàm chuyển Sol
function transferSol() {
    return __awaiter(this, void 0, void 0, function () {
        var preBalance1, preBalance2, transferAmount, transferInstruction, transaction, transactionSignature, postBalance1, postBalance2, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 6, , 7]);
                    return [4 /*yield*/, connection.getBalance(sender.publicKey)];
                case 1:
                    preBalance1 = _a.sent();
                    return [4 /*yield*/, connection.getBalance(receiverPublicKey)];
                case 2:
                    preBalance2 = _a.sent();
                    console.log("Số dư ví gửi trước khi chuyển:", preBalance1 / web3_js_1.LAMPORTS_PER_SOL);
                    console.log("Số dư ví nhận trước khi chuyển:", preBalance2 / web3_js_1.LAMPORTS_PER_SOL);
                    console.log("\n");
                    transferAmount = 0.01;
                    transferInstruction = web3_js_1.SystemProgram.transfer({
                        fromPubkey: sender.publicKey,
                        toPubkey: receiverPublicKey, // Sử dụng ví nhận cố định
                        lamports: transferAmount * web3_js_1.LAMPORTS_PER_SOL, // Chuyển đổi SOL sang lamports
                    });
                    transaction = new web3_js_1.Transaction().add(transferInstruction);
                    return [4 /*yield*/, (0, web3_js_1.sendAndConfirmTransaction)(connection, transaction, [sender] // Chữ ký của ví gửi
                    )];
                case 3:
                    transactionSignature = _a.sent();
                    return [4 /*yield*/, connection.getBalance(sender.publicKey)];
                case 4:
                    postBalance1 = _a.sent();
                    return [4 /*yield*/, connection.getBalance(receiverPublicKey)];
                case 5:
                    postBalance2 = _a.sent();
                    console.log("Số dư ví gửi sau khi chuyển:", postBalance1 / web3_js_1.LAMPORTS_PER_SOL);
                    console.log("Số dư ví nhận sau khi chuyển:", postBalance2 / web3_js_1.LAMPORTS_PER_SOL);
                    console.log("\n");
                    // In ra chữ ký giao dịch để kiểm tra trên Solana Explorer
                    console.log("Chữ ký giao dịch:", "https://explorer.solana.com/tx/".concat(transactionSignature, "?cluster=devnet"));
                    return [3 /*break*/, 7];
                case 6:
                    error_1 = _a.sent();
                    console.error("Lỗi trong quá trình giao dịch:", error_1);
                    return [3 /*break*/, 7];
                case 7: return [2 /*return*/];
            }
        });
    });
}
// Gọi hàm transferSol()
transferSol();
