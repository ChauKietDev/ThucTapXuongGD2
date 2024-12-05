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
let api = "http://localhost:8080/api/v1/user";
const myButton = document.getElementById("login");
function login(event) {
    return __awaiter(this, void 0, void 0, function* () {
        event.preventDefault(); // Ngừng hành vi mặc định của form
        let user;
        let usernameInput = document.getElementById("username").value;
        let passwordInput = document.getElementById("password").value;
        const res = yield fetch(api + `/login/${usernameInput}-${passwordInput}`);
        if (!res.ok) { // Nếu mã trạng thái không phải 2xx (thành công)
            alert("Incorrect username or password!");
            return; // Dừng tiếp tục nếu không tìm thấy người dùng
        }
        else {
            user = yield res.json();
            localStorage.setItem("UserLogined", user.username);
            alert("Login successful");
            window.location.href = "home.html";
        }
    });
}
// Đảm bảo nút tồn tại và gắn sự kiện click
if (myButton) {
    myButton.addEventListener("click", login);
}
