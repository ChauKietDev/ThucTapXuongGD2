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
        var _a, _b;
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
                const currentTurnsElement = document.getElementById("currentTurns");
                if (currentTurnsElement) {
                    currentTurnsElement.innerHTML = playerinfo.currentTurns.toString();
                }
                const numberTurnsElement = document.getElementById("numberTurns");
                if (numberTurnsElement) {
                    numberTurnsElement.innerHTML = playerinfo.numberOfTurns.toString();
                }
                (_a = document.getElementById("timeAddTurn")) === null || _a === void 0 ? void 0 : _a.setAttribute("value", playerinfo.timeAddTurn.toString());
            }
            currentTurn = playerinfo.currentTurns;
            numberOfTurn = playerinfo.numberOfTurns;
            let getTime = (_b = document.getElementById("timeAddTurn")) === null || _b === void 0 ? void 0 : _b.getAttribute("value");
            let timeAdd = new Date(String(getTime));
            let now = new Date();
            timeRemain = Math.floor((timeAdd.getTime() - now.getTime()) / 1000);
            if (countTime) {
                clearInterval(countTime);
            }
            countTime = setInterval(() => {
                if (currentTurn < numberOfTurn) {
                    timeRemain--;
                    if (timeRemain <= 0) {
                        currentTurn++;
                        timeRemain = 60; // Reset thời gian cho lượt mới.
                    }
                }
                else {
                    clearInterval(countTime);
                    countTime = null;
                }
            }, 1000);
        }
    });
}
function updateui() {
    const count = document.getElementById("counttime");
    const currentTurnsElement = document.getElementById("currentTurns");
    const numberTurnsElement = document.getElementById("numberTurns");
    if (currentTurnsElement) {
        currentTurnsElement.innerHTML = currentTurn.toString();
    }
    if (numberTurnsElement) {
        numberTurnsElement.innerHTML = numberOfTurn.toString();
    }
    if (count) {
        if (currentTurn < numberOfTurn) {
            count.innerHTML = "Next attempt in: ";
            let diffInMinutes = Math.floor(timeRemain / 60);
            let diffInSeconds = timeRemain % 60;
            count.innerHTML += `${diffInMinutes}:${diffInSeconds >= 10 ? diffInSeconds : "0" + diffInSeconds}`;
        }
        else {
            count.innerHTML = "";
        }
    }
    const playbutton = document.getElementById("play-button");
    if (currentTurn > 0) {
        if (playbutton) {
            playbutton.removeAttribute("disabled");
            playbutton.style.backgroundColor = "#ffc107";
        }
    }
    else {
        if (play) {
            play.removeAttribute("href");
        }
        if (playbutton) {
            playbutton.setAttribute("disabled", "true");
            playbutton.style.backgroundColor = "grey";
        }
    }
    requestAnimationFrame(updateui);
}
function checkTurn(event) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        event.preventDefault();
        let currentTurns = Number((_a = document.getElementById("currentTurns")) === null || _a === void 0 ? void 0 : _a.textContent);
        if (currentTurns > 0) {
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
            const currentTurnsElement = document.getElementById("currentTurns");
            if (currentTurnsElement) {
                currentTurnsElement.innerHTML = playerinfo.currentTurns.toString();
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
    updateui();
}
loadRank();
run();
if (play) {
    play.addEventListener("click", checkTurn);
}
