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
let rankApi = "http://localhost:8080/api/v1/rank";
let playerAPI = "http://localhost:8080/api/v1/playerinfo";
let countTime = null;
let timeRemain = 0;
let currentTurn = 0;
let numberOfTurn = 0;
const play = document.getElementById("play");
function playerRank() {
    return __awaiter(this, void 0, void 0, function* () {
        let rankList;
        let username = localStorage.getItem("UserLogined");
        let str = "";
        let rankNum = 1;
        const resRank = yield fetch(rankApi + "/getAllPlayerRank");
        if (resRank.ok) {
            rankList = yield resRank.json();
            for (let i = 0; i < rankList.length; i++) {
                if (rankList[i].playerInfo.user.username == username) {
                    str +=
                        `<div class="rank-item highlight">
                    <div class="rank">${rankNum}. ${rankList[i].playerInfo.user.username}</div>
                    <div class="score">
                        <img src="./image/diamond.png" alt="Diamond" class="diamond-icon">
                        ${rankList[i].playerInfo.highestScore}
                    </div>
                </div>`;
                    break;
                }
                else {
                    rankNum++;
                }
            }
            const playerNumberElement = document.getElementById("playerNumber");
            if (playerNumberElement) {
                let playerNumber = rankList.length;
                playerNumberElement.innerHTML = playerNumber.toString() + " Players";
            }
        }
        return str;
    });
}
function topRank() {
    return __awaiter(this, void 0, void 0, function* () {
        let rankList;
        let str = "";
        let i = 1;
        const resRank = yield fetch(rankApi + "/getRank");
        if (resRank.ok) {
            rankList = yield resRank.json();
            rankList.forEach(rank => {
                str +=
                    `<div class="rank-item">
                    <div class="rank">${i}. ${rank.playerInfo.user.username}</div>
                    <div class="score">
                        <img src="./image/diamond.png" alt="Diamond" class="diamond-icon">
                        ${rank.playerInfo.highestScore}
                    </div>
                </div>`;
                i++;
            });
        }
        return str;
    });
}
function loaduser() {
    return __awaiter(this, void 0, void 0, function* () {
        let playerinfo;
        let userLogined;
        userLogined = localStorage.getItem("UserLogined");
        const res = yield fetch(playerAPI + `/getInfo/username-${userLogined}`);
        if (res.ok) {
            playerinfo = yield res.json();
            const resUpdate = yield fetch(playerAPI + `/updateTurns/${playerinfo.id}-isPlayed=${false}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: "Plain text data"
            });
            if (resUpdate.ok) {
                playerinfo = yield resUpdate.json();
                localStorage.setItem("playerInfoId", playerinfo.id.toString());
                // Gán số lượt chơi vào các biến toàn cục
                currentTurn = playerinfo.currentTurns;
                numberOfTurn = playerinfo.numberOfTurns;
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
                if (currentTurn > 0) {
                    // Hiển thị số lượt chơi còn lại
                    playElement.innerHTML = `Play Game (Your Attempt: 
                    <span id="currentTurn">${currentTurn}</span>/<span id="numberTurns">${numberOfTurn}</span>)`;
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
                    let timeRemain = Math.floor((timeAdd.getTime() - now.getTime()) / 1000);
                    if (timeRemain < 0) {
                        timeRemain = 0; // Đảm bảo không có giá trị âm
                    }
                    // Khởi động bộ đếm thời gian
                    let diffInMinutes = Math.floor(timeRemain / 60);
                    let diffInSeconds = timeRemain % 60;
                    playElement.innerHTML = `Next attempt in: ${diffInMinutes}:${diffInSeconds >= 10 ? diffInSeconds : "0" + diffInSeconds}`;
                    if (counttime) {
                        clearInterval(counttime);
                    }
                    counttime = setInterval(() => {
                        if (timeRemain > 0) {
                            timeRemain--;
                            diffInMinutes = Math.floor(timeRemain / 60);
                            diffInSeconds = timeRemain % 60;
                            playElement.innerHTML = `Next attempt in: ${diffInMinutes}:${diffInSeconds >= 10 ? diffInSeconds : "0" + diffInSeconds}`;
                        }
                        else {
                            clearInterval(counttime); // Dừng bộ đếm khi hết thời gian
                            counttime = null;
                            currentTurn += 6; // Thêm lượt chơi mới
                            playButton.style.backgroundColor = "#ffc107";
                            playButton.removeAttribute("disabled");
                            playElement.innerHTML = `Play Game (Your Attempt: 
                            <span id="currentTurn">${currentTurn}</span>/<span id="numberTurns">${numberOfTurn}</span>)`;
                        }
                    }, 1000);
                }
            }
        }
    });
}
function checkTurn(event) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        event.preventDefault();
        let currentTurn = Number((_a = document.getElementById("currentTurn")) === null || _a === void 0 ? void 0 : _a.textContent);
        if (currentTurn > 0) {
            window.location.href = "test.html";
        }
    });
}
function loadTurn() {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        let playerinfo;
        let playerInfoId = Number(localStorage.getItem("playerInfoId"));
        const resUpdate = yield fetch(playerAPI + `/updateTurns/${playerInfoId}-isPlayed=${false}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: "Plain text data"
        });
        if (resUpdate.ok) {
            playerinfo = yield resUpdate.json();
            localStorage.setItem("playerInfoId", playerinfo.id.toString());
            const currentTurnElement = document.getElementById("currentTurn");
            if (currentTurnElement) {
                currentTurnElement.innerHTML = playerinfo.currentTurns.toString();
            }
            const numberTurnsElement = document.getElementById("numberTurns");
            if (numberTurnsElement) {
                numberTurnsElement.innerHTML = playerinfo.numberOfTurns.toString();
            }
            (_a = document.getElementById("timeAddTurn")) === null || _a === void 0 ? void 0 : _a.setAttribute("value", playerinfo.timeAddTurn.toString());
        }
    });
}
function loadRank() {
    return __awaiter(this, void 0, void 0, function* () {
        const rankListElement = document.getElementById("ranklist");
        if (rankListElement) {
            rankListElement.innerHTML = (yield playerRank()) + (yield topRank());
        }
        requestAnimationFrame(loadRank);
    });
}
function run() {
    loaduser();
    requestAnimationFrame(loaduser);
}
loadRank();
run();
if (play) {
    play.addEventListener("click", checkTurn);
}
