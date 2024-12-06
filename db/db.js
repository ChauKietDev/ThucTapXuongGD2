import mysql from 'mysql2';  // Dùng import thay vì require

// Tạo kết nối tới MySQL
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '12345',
    database: 'daovang',
    port: 3306  // Nếu cổng khác, bạn có thể thay đổi tại đây
});


// Kết nối đến DB
db.connect((err) => {
    if (err) {
        console.error('Không thể kết nối tới cơ sở dữ liệu:', err.message);
        return;
    }
    console.log('Đã kết nối tới cơ sở dữ liệu!');
});
