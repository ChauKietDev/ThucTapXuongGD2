const canvas = document.getElementById("gameCanvas") as HTMLCanvasElement;
const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
canvas.width = 800;
canvas.height = 1400;


// Điểm số
let score = 0;
const scoreDisplay = document.getElementById("score") as HTMLElement;

interface Item {
    x: number;
    y: number;
    size: number;
    value: number;
    image: HTMLImageElement;
    isCaught: boolean;
    type: "positive" | "negative"; // Phân biệt vật phẩm
}

// Định nghĩa kiểu dữ liệu cho móc câu
interface Hook {
    x: number;
    y: number;
    angle: number;
    length: number;
    speed: number;
    direction: number;
    isFiring: boolean;
    targetX: number;
    targetY: number;
}

// Tải hình ảnh nhân vật
const characterImage = new Image();
characterImage.src = "./image/khunglong.png"; // Đường dẫn đến hình ảnh nhân vật

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

function generateItems(count: number): Item[] {
    const generatedItems: Item[] = [];
    for (let i = 0; i < count; i++) {
        const x = Math.random() * (canvas.width - 50) + 25; // Random vị trí X
        const y = Math.random() * (canvas.height - paddingTop - 150) + paddingTop + 150; // Random Y bắt đầu từ paddingTop
        const size = Math.random() * 70 + 25;
        const value = Math.floor(size * 30);

        // Ngẫu nhiên loại vật phẩm
        const type = Math.random() < 0.8 ? "positive" : "negative";

        const image = new Image();
        if (type === "positive") {
            image.src = "./image/diamond.png";
        } else {
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
const items: Item[] = generateItems(15);

// Móc câu
let hook: Hook = {
    x: canvas.width / 2, // Vị trí gốc của móc câu
    y: 50, // Vị trí đầu dây
    angle: 0, // Góc quay của móc
    length: 100, // Độ dài dây ban đầu
    speed: 0.01, // Tốc độ quay của móc câu
    direction: 1, // Hướng quay (1 là phải, -1 là trái)
    isFiring: false, // Trạng thái thả móc câu
    targetX: canvas.width / 2, // Vị trí hiện tại của đầu móc (x)
    targetY: 50, // Vị trí hiện tại của đầu móc (y)
};


function updateHook(): void {
    if (!hook.isFiring) {
        // Lắc móc câu trong khoảng từ -π đến π/4
        hook.angle += hook.speed * hook.direction;

        // Đổi hướng khi đạt giới hạn
        if (hook.angle > Math.PI || hook.angle < -Math.PI / 8) {
            hook.direction *= -1;
        }

        // Cập nhật vị trí đầu móc dựa trên góc quay
        hook.targetX = hook.x + hook.length * Math.cos(hook.angle);
        hook.targetY = hook.y + hook.length * Math.sin(hook.angle);
    } else {
        // Hạ móc câu theo góc hiện tại
        hook.targetX += 5 * Math.cos(hook.angle);
        hook.targetY += 5 * Math.sin(hook.angle);

        // Kiểm tra va chạm với vật phẩm
        for (let item of items) {
            if (!item.isCaught && isColliding(hook.targetX, hook.targetY, item.x, item.y, item.size)) {
                item.isCaught = true; // Đánh dấu vật phẩm đã bị bắt
                hook.isFiring = false; // Ngừng trạng thái thả móc câu

                setTimeout(() => {
                    // Kéo móc câu về gốc
                    hook.targetX = hook.x;
                    hook.targetY = hook.y;
                    hook.isFiring = false; // Đặt lại trạng thái sau khi móc câu về vị trí ban đầu

                    // Cập nhật điểm dựa trên loại vật phẩm
                    if (item.type === "positive") {
                        score += item.value; // Cộng điểm nếu vật phẩm là tích cực
                    } else if (item.type === "negative") {
                        score -= item.value; // Trừ điểm nếu vật phẩm là tiêu cực
                    }

                    // Hiển thị điểm số mới
                    scoreDisplay.textContent = score.toString();
                }, 2000); // Thời gian chờ 2 giây
            }
        }

        // Nếu móc câu vượt khỏi màn hình
        if (hook.targetX < 0 || hook.targetX > canvas.width || hook.targetY > canvas.height) {
            hook.isFiring = false; // Dừng thả móc
            hook.targetX = hook.x; // Reset vị trí X
            hook.targetY = hook.y; // Reset vị trí Y
        }
    }
}


// Vẽ biểu tượng từ hình ảnh
const icon = new Image();
icon.src = "./image/hook.png"; // Đường dẫn đến hình ảnh biểu tượng

// Vẽ móc câu
function drawHook(): void {

    // Kích thước nhân vật
    const characterWidth = 50; // Chiều rộng hình ảnh nhân vật (tỷ lệ cân đối với chiều cao)
    const characterHeight = 50; // Chiều cao hình ảnh nhân vật

    // Vẽ nhân vật ở gốc của móc câu
    ctx.drawImage(
        characterImage,
        hook.x - characterWidth / 2, // Căn giữa nhân vật theo chiều ngang
        hook.y - characterHeight,   // Đặt nhân vật ngay trên gốc móc câu
        characterWidth,
        characterHeight
    );

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


// Vẽ vật phẩm
// Vẽ vật phẩm (dùng ảnh thay cho màu vàng)
// function drawItems() {
//   for (let item of items) {
//       if (!item.isCaught) {
//           ctx.drawImage(item.image, item.x - item.size / 2, item.y - item.size / 2, item.size, item.size);
//       }
//   }
// }


function drawItems() {
    for (let item of items) {
        if (!item.isCaught) {
            ctx.drawImage(item.image, item.x - item.size / 2, item.y - item.size / 2, item.size, item.size);
        }
    }
}


// Kiểm tra va chạm hình tròn
function isColliding(x1: number, y1: number, x2: number, y2: number, radius: number): boolean {
    const dx = x1 - x2;
    const dy = y1 - y2;
    return Math.sqrt(dx * dx + dy * dy) < radius;
}

// Vòng lặp game
function gameLoop(): void {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    updateHook();
    drawHook();
    drawItems();

    requestAnimationFrame(gameLoop);
}

// Sự kiện phím
document.addEventListener("keydown", (e: KeyboardEvent) => {
    if (e.code === "Space" && !hook.isFiring) {
        hook.isFiring = true;
    }
});

// Bắt đầu game
gameLoop();
