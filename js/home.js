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
let playerApi = "http://localhost:8080/api/v1/playerinfo";
let counttime = null;
let timeRemaining = 0;
let currentTurns = 0;
let numberOfTurns = 0;
// lấy li có id là logout
const logoutElement = document.getElementById("logout");
// lấy button có id là play
const playGame = document.getElementById("play-button");
function loadUser() {
    return __awaiter(this, void 0, void 0, function* () {
        // Khai báo biến playerinfo để lưu thông tin người chơi
        let playerinfo;
        // Lấy giá trị từ localStorage với key "UserLogined" (ID của người dùng đã đăng nhập)
        let userLogined;
        userLogined = localStorage.getItem("UserLogined");
        // Gọi API để lấy thông tin người chơi dựa trên username
        const res = yield fetch(playerApi + `/getInfo/username-${userLogined}`);
        if (res.ok) {
            // Nếu gọi API thành công, chuyển đổi dữ liệu JSON từ phản hồi
            playerinfo = yield res.json();
            // Cập nhật lượt chơi (trừ lượt chơi hiện tại)
            const resUpdate = yield fetch(playerApi + `/updateTurns/${playerinfo.id}-isPlayed=${false}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: "Plain text data" // Dữ liệu cập nhật được gửi đi (ở đây là văn bản)
            });
            if (resUpdate.ok) {
                // Nếu cập nhật thành công, lấy lại thông tin người chơi
                playerinfo = yield resUpdate.json();
                // Lưu ID người chơi vào localStorage với key "playerInfoId"
                localStorage.setItem("playerInfoId", playerinfo.id.toString());
                // lấy nhân vật đã chọn để lưu vào localStorage với key "power" và "otherDiamond"
                let boughtCharSelected;
                let res = yield fetch(`http://localhost:8080/api/v1/shop/boughtChar/selectedChar/playerId-${playerinfo.id}`);
                if (res.ok) {
                    boughtCharSelected = yield res.json();
                    localStorage.setItem("otherDiamond", boughtCharSelected.charBuy.otherDiamond);
                    localStorage.setItem("power", boughtCharSelected.charBuy.power);
                }
                // Gán số lượt chơi vào các biến toàn cục
                currentTurns = playerinfo.currentTurns;
                numberOfTurns = playerinfo.numberOfTurns;
                // Hiển thị tên người dùng trên giao diện
                const usernameElement = document.getElementById("username");
                if (usernameElement) {
                    usernameElement.innerHTML = playerinfo.user.username;
                }
                // Gán giá trị thời gian thêm lượt chơi nếu có
                const timeAddTurnElement = document.getElementById("timeAddTurn");
                if (timeAddTurnElement) {
                    timeAddTurnElement.setAttribute("value", playerinfo.timeAddTurn != null ? playerinfo.timeAddTurn.toString() : "");
                }
                const playElement = document.getElementById("play");
                if (!playElement) {
                    console.error("Play button href element not found");
                    return;
                }
                const playButton = document.getElementById("play-button");
                if (!playButton) {
                    console.error("Button not found");
                    return;
                }
                if (currentTurns > 0) {
                    // Hiển thị số lượt chơi còn lại
                    playElement.innerHTML = `Play Game (Your Attempt: 
                    <span id="currentTurns">${currentTurns}</span>/<span id="numberTurns">${numberOfTurns}</span>)`;
                    // thay đổi thuộc tính css của button
                    playButton.style.backgroundColor = "#ffc107";
                    playButton.removeAttribute("disabled");
                }
                else {
                    // thay đổi thuộc tính css của button
                    playButton.style.backgroundColor = "grey";
                    playButton.setAttribute("disabled", "true");
                    // Đếm ngược thời gian thêm lượt chơi
                    let getTime = timeAddTurnElement === null || timeAddTurnElement === void 0 ? void 0 : timeAddTurnElement.getAttribute("value");
                    if (!getTime) {
                        console.error("TimeAddTurn value is missing");
                        return;
                    }
                    let timeAdd = new Date(getTime);
                    let now = new Date();
                    let timeRemaining = Math.floor((timeAdd.getTime() - now.getTime()) / 1000);
                    if (timeRemaining < 0) {
                        timeRemaining = 0; // Đảm bảo không có giá trị âm
                    }
                    // Khởi động bộ đếm thời gian
                    let diffInMinutes = Math.floor(timeRemaining / 60);
                    let diffInSeconds = timeRemaining % 60;
                    playElement.innerHTML = `Next attempt in: ${diffInMinutes}:${diffInSeconds >= 10 ? diffInSeconds : "0" + diffInSeconds}`;
                    if (counttime) {
                        clearInterval(counttime);
                    }
                    counttime = setInterval(() => {
                        if (timeRemaining > 0) {
                            timeRemaining--;
                            diffInMinutes = Math.floor(timeRemaining / 60);
                            diffInSeconds = timeRemaining % 60;
                            playElement.innerHTML = `Next attempt in: ${diffInMinutes}:${diffInSeconds >= 10 ? diffInSeconds : "0" + diffInSeconds}`;
                        }
                        else {
                            clearInterval(counttime); // Dừng bộ đếm khi hết thời gian
                            counttime = null;
                            currentTurns += 6; // Thêm lượt chơi mới
                            playButton.style.backgroundColor = "#ffc107";
                            playButton.removeAttribute("disabled");
                            playElement.innerHTML = `Play Game (Your Attempt: 
                            <span id="currentTurns">${currentTurns}</span>/<span id="numberTurns">${numberOfTurns}</span>)`;
                        }
                    }, 1000);
                }
            }
        }
    });
}
function checkTurns(event) {
    var _a;
    event.preventDefault();
    let currentTurns = Number((_a = document.getElementById("currentTurns")) === null || _a === void 0 ? void 0 : _a.textContent);
    if (currentTurns > 0) {
        window.location.href = "test.html";
    }
}
function logout(event) {
    event.preventDefault();
    localStorage.removeItem("UserLogined");
    localStorage.removeItem("playerInfoId");
    localStorage.removeItem("otherDiamond");
    localStorage.removeItem("power");
    window.location.href = "login.html";
}
function start() {
    loadUser();
    requestAnimationFrame(loadUser);
    // updateUI();
}
start();
if (logoutElement) {
    logoutElement.addEventListener("click", logout);
}
if (playGame) {
    playGame.addEventListener("click", checkTurns);
}
