interface User {
    username: string,
    password: string
}
let api = "http://localhost:8080/api/v1/user";
const myButton = document.getElementById("login") as HTMLButtonElement;

async function login(event: Event) {
    event.preventDefault(); // Ngừng hành vi mặc định của form

    let user: User;
    let usernameInput: string = (document.getElementById("username") as HTMLInputElement).value;
    let passwordInput: string = (document.getElementById("password") as HTMLInputElement).value;

    const res = await fetch(api + `/login/${usernameInput}-${passwordInput}`);
    if (!res.ok) { // Nếu mã trạng thái không phải 2xx (thành công)
        alert("Incorrect username or password!")
        return; // Dừng tiếp tục nếu không tìm thấy người dùng
    }
    else {
        user = await res.json();
        localStorage.setItem("UserLogined", user.username);
        alert("Login successful");
        window.location.href = "home.html"
    }    
}

// Đảm bảo nút tồn tại và gắn sự kiện click
if (myButton) {
    myButton.addEventListener("click", login);
}