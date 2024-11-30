"use strict";
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
canvas.width = 800;
canvas.height = 1400;
// Điểm số
let score = 0;
const scoreDisplay = document.getElementById("score");
let itemNumber = 20;
// Tải hình ảnh nhân vật
const characterImage = new Image();
characterImage.src = "./image/khunglong.png"; // Đường dẫn ảnh nhân vật
characterImage.onload = () => {
    console.log("Hình ảnh nhân vật đã tải xong!");
};
// Tạo ngẫu nhiên nhiều vật phẩm
// Tải ảnh vật phẩm
const itemImage = new Image();
itemImage.src = "./image/diamond.png"; // Đường dẫn đến ảnh vật phẩm
// Đảm bảo ảnh được tải xong trước khi sử dụng
itemImage.onload = () => {
    // Gọi hàm vẽ sau khi ảnh đã tải
    generateItems(5);
};
const paddingTop = 400; // Khoảng cách từ cạnh trên của canvas
// Lấy các phần tử HTML
const countdownElement = document.getElementById("countdown");
// Thiết lập thời gian đếm ngược (ví dụ: 10 phút = 600 giây)
let countdownTime = 60; // Đơn vị: giây
// Hàm thay đổi thời gian mỗi giây
function padStart(input, length, padChar) {
    let str = input.toString();
    while (str.length < length) {
        str = padChar + str;
    }
    return str;
}
// Hàm định dạng thời gian (hh:mm:ss)
function formatTime(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${secs >= 10 ? padStart(secs, 2, "0") : secs}`;
}
// Hàm bắt đầu đếm ngược
function startCountdown() {
    // Hiển thị giá trị ban đầu ngay lập tức
    countdownElement.textContent = "Time: " + countdownTime + "s";
    const interval = setInterval(() => {
        if (countdownTime <= 0) {
            clearInterval(interval);
            setTimeout(() => {
                window.location.href = "home.html";
            }, 1000);
        }
        else {
            countdownTime--;
            countdownElement.textContent = "Time: " + formatTime(countdownTime) + "s";
        }
    }, 1000); // Cập nhật mỗi giây
}
function generateItems(count) {
    const generatedItems = [];
    for (let i = 0; i < count; i++) {
        const x = Math.random() * (canvas.width - 50) + 25; // Random vị trí X
        const y = Math.random() * (canvas.height - paddingTop - 150) + paddingTop + 150; // Random Y bắt đầu từ paddingTop
        const size = Math.random() * 70 + 25;
        const value = Math.floor(size * 1);
        // Ngẫu nhiên loại vật phẩm
        const type = Math.random() < 0.8 ? "positive" : "negative";
        const image = new Image();
        if (type === "positive") {
            image.src = "./image/diamond.png";
        }
        else {
            image.src = "./image/daa.png";
        }
        generatedItems.push({
            x,
            y,
            size,
            value,
            image,
            isCaught: false,
            type,
        });
    }
    return generatedItems;
}
// Tạo danh sách 20 vật phẩm
const items = generateItems(itemNumber);
// // Móc câu
// let hook: Hook = {
//     x: canvas.width / 2, // Vị trí gốc của móc câu
//     y: 200, // Vị trí đầu dây
//     angle: 0, // Góc quay của móc
//     length: 100, // Độ dài dây ban đầu
//     speed: 0.01, // Tốc độ quay của móc câu
//     direction: 1, // Hướng quay (1 là phải, -1 là trái)
//     isFiring: false, // Trạng thái thả móc câu
//     targetX: canvas.width / 2, // Vị trí hiện tại của đầu móc (x)
//     targetY: 50, // Vị trí hiện tại của đầu móc (y)
// };
let hook = {
    x: canvas.width / 2,
    y: 200, // Hạ thấp móc câu để thấy nhân vật
    angle: 0,
    length: 100,
    speed: 0.02,
    direction: 1,
    isFiring: false,
    targetX: canvas.width / 2,
    targetY: 200,
    attachedItem: null, // Không có vật phẩm được kéo ban đầu
};
function updateHook() {
    if (!hook.isFiring) {
        // Móc câu lắc qua lại nhanh hơn
        hook.angle += hook.speed * hook.direction; // Tốc độ lắc qua lắc lại của móc câu
        if (hook.angle > Math.PI || hook.angle < -Math.PI / 8) {
            hook.direction *= -1; // Đổi hướng quay
        }
        hook.targetX = hook.x + hook.length * Math.cos(hook.angle); // Tính toán vị trí đầu móc câu theo góc quay
        hook.targetY = hook.y + hook.length * Math.sin(hook.angle); // Tính toán vị trí đầu móc câu theo góc quay
    }
    else {
        // Nếu đang thả móc câu và kéo vật phẩm về
        if (hook.attachedItem) {
            const item = hook.attachedItem;
            const dx = hook.x - item.x; // Khoảng cách từ vật phẩm đến gốc
            const dy = hook.y - item.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            // Xác định tốc độ kéo tùy vào loại vật phẩm
            let pullSpeed = 0.01; // Mặc định tốc độ kéo bình thường
            if (item.type === "negative") {
                pullSpeed = 0.01; // Tốc độ kéo chậm lại cho vật phẩm tiêu cực
            }
            else if (item.type === "positive") {
                pullSpeed = 0.028; // Tốc độ kéo cho vật phẩm tích cực
            }
            // Di chuyển vật phẩm và móc câu cùng thu về
            if (distance > 5) {
                hook.targetX += dx * pullSpeed; // Di chuyển móc câu về gốc theo trục X
                hook.targetY += dy * pullSpeed; // Di chuyển móc câu về gốc theo trục Y
                item.x = hook.targetX; // Cập nhật vị trí vật phẩm theo móc câu
                item.y = hook.targetY + 20;
            }
            else {
                // Khi vật phẩm chạm vào gốc của móc câu (vị trí nhân vật)
                hook.attachedItem = null; // Giải phóng móc câu
                hook.isFiring = false; // Ngừng trạng thái thả móc
                // Cập nhật điểm khi vật phẩm chạm vào nhân vật
                if (item.type === "positive") {
                    score += item.value; // Cộng điểm
                }
                else {
                    score -= item.value; // Trừ điểm
                }
                scoreDisplay.textContent = score.toString(); // Cập nhật hiển thị điểm
                itemNumber--;
            }
        }
        else {
            // Nếu không có vật phẩm được móc, tiếp tục thả móc
            hook.targetX += 10 * Math.cos(hook.angle);
            hook.targetY += 10 * Math.sin(hook.angle);
            // Kiểm tra va chạm với vật phẩm
            for (let item of items) {
                if (!item.isCaught && isColliding(hook.targetX, hook.targetY, item.x, item.y, item.size)) {
                    item.isCaught = true; // Đánh dấu vật phẩm đã bị bắt
                    hook.attachedItem = item; // Gắn vật phẩm vào móc
                    break; // Chỉ móc một vật phẩm tại một thời điểm
                }
            }
        }
        // Nếu móc câu vượt khỏi màn hình
        if (hook.targetX < 0 || hook.targetX > canvas.width || hook.targetY > canvas.height) {
            hook.isFiring = false; // Reset trạng thái thả móc
            hook.targetX = hook.x;
            hook.targetY = hook.y;
        }
    }
}
// Vẽ biểu tượng từ hình ảnh
const icon = new Image();
icon.src = "./image/hook.png"; // Đường dẫn đến hình ảnh biểu tượng
// Vẽ móc câu
function drawHook() {
    // Kích thước nhân vật
    const characterWidth = 150; // Chiều rộng hình ảnh nhân vật (tỷ lệ cân đối với chiều cao)
    const characterHeight = 150; // Chiều cao hình ảnh nhân vật
    // Vẽ nhân vật ở gốc của móc câu
    ctx.drawImage(characterImage, hook.x - characterWidth / 2, // Căn giữa nhân vật theo chiều ngang
    hook.y - characterHeight, // Đặt nhân vật ngay trên gốc móc câu
    characterWidth, characterHeight);
    // Vẽ dây móc câu
    ctx.beginPath();
    ctx.moveTo(hook.x, hook.y);
    ctx.lineTo(hook.targetX, hook.targetY);
    ctx.strokeStyle = "white";
    ctx.lineWidth = 3;
    ctx.stroke();
    // Tính toán vị trí cố định của lưỡi câu
    const fixedOffsetX = 15 * Math.cos(hook.angle); // Điều chỉnh theo góc
    const fixedOffsetY = 15 * Math.sin(hook.angle); // Điều chỉnh theo góc
    // Vẽ hình ảnh lưỡi câu
    ctx.save(); // Lưu trạng thái canvas
    ctx.translate(hook.targetX + fixedOffsetX, hook.targetY + fixedOffsetY); // Đặt vị trí cố định dựa trên offset
    ctx.rotate(hook.angle + Math.PI / -2); // Xoay hình ảnh theo góc móc câu
    ctx.drawImage(icon, -25, -25, 50, 50); // Đặt tâm hình tại vị trí lưỡi câu
    ctx.restore(); // Phục hồi trạng thái canvas
}
function drawItems() {
    for (let item of items) {
        // Nếu vật phẩm đang được kéo, vẽ vật phẩm ở vị trí mới
        if (hook.attachedItem === item) {
            ctx.drawImage(item.image, item.x - item.size / 2, item.y - item.size / 2, item.size, item.size);
        }
        else if (!item.isCaught) {
            // Nếu vật phẩm chưa bị bắt, vẽ nó ở vị trí ban đầu
            ctx.drawImage(item.image, item.x - item.size / 2, item.y - item.size / 2, item.size, item.size);
        }
    }
}
// Kiểm tra va chạm hình tròn
function isColliding(x1, y1, x2, y2, radius) {
    const dx = x1 - x2;
    const dy = y1 - y2;
    return Math.sqrt(dx * dx + dy * dy) < radius;
}
// Vòng lặp game
function gameLoop() {
    if (itemNumber > 0) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        if (countdownTime > 0) {
            updateHook();
        }
        drawHook();
        drawItems();
        requestAnimationFrame(gameLoop);
    }
    else {
        setTimeout(window.location.href = "home.html", 1000);
    }
}
// Sự kiện phím
document.addEventListener("keydown", (e) => {
    if (e.code === "Space" && !hook.isFiring) {
        hook.isFiring = true;
    }
});
// Bắt đầu game
gameLoop();
// Khởi chạy đếm ngược
startCountdown();
