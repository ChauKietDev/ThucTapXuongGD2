# Game Đào Vàng

## Giới thiệu
Game Đào Vàng là một trò chơi thú vị và hấp dẫn, nơi bạn điều khiển một chiếc móc để thu thập kim cương và tránh đá. Mục tiêu của trò chơi là thu thập càng nhiều kim cương càng tốt để tăng điểm số, trong khi đá sẽ làm giảm điểm. Bạn sử dụng phím **Space** để thả móc và cố gắng bắt kim cương!

## Cách chơi
- Nhấn phím **Space** để thả móc.
- Nếu móc bắt được **kim cương**, điểm số của bạn sẽ tăng lên.
- Nếu móc bắt phải **đá**, điểm số của bạn sẽ giảm đi.

## Cài đặt

### Yêu cầu
Trước khi chạy trò chơi, bạn cần cài đặt các công cụ sau:

- **Node.js**: Dùng để quản lý các phụ thuộc và chạy backend.
- **Solana**: Dùng để tương tác với blockchain Solana.
- Cài đặt extension WSL wsl --install npm install 
- Cài đặt nodejs trên ubuntu:
- curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
- sudo apt-get install -y nodejs
- Cài đặt solana: sh -c "$(curl -sSfL https://release.anza.xyz/stable/install)" 
- npm install @solana/web3.js
- Chạy server nodejs: cd api -> node app.js
### Chạy Game Backend

Mã nguồn backend của trò chơi được lưu trữ trên GitHub. Bạn có thể chạy backend bằng IntelliJ IDEA hoặc Visual Studio Code (VS Code). Dưới đây là các bước cài đặt cho cả hai lựa chọn.

#### Option 1: Chạy với IntelliJ IDEA
1. Clone kho chứa mã nguồn:
   ```bash
   git clone https://github.com/gson2709/GameDaoVang.git
