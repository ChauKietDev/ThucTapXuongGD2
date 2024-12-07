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
const playGame = document.getElementById("play");
function loadUser() {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b;
        let playerinfo;
        let userLogined;
        userLogined = localStorage.getItem("UserLogined");
        const res = yield fetch(playerApi + `/getInfo/username-${userLogined}`);
        if (res.ok) {
            playerinfo = yield res.json();
            const resUpdate = yield fetch(playerApi + `/updateTurns/${playerinfo.id}-isPlayed=${false}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: "Plain text data"
            });
            if (resUpdate.ok) {
                playerinfo = yield resUpdate.json();
                localStorage.setItem("playerInfoId", playerinfo.id.toString());
                const usernameElement = document.getElementById("username");
                if (usernameElement) {
                    usernameElement.innerHTML = playerinfo.user.username;
                }
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
            currentTurns = playerinfo.currentTurns;
            numberOfTurns = playerinfo.numberOfTurns;
            let getTime = (_b = document.getElementById("timeAddTurn")) === null || _b === void 0 ? void 0 : _b.getAttribute("value");
            let timeAdd = new Date(String(getTime));
            let now = new Date();
            timeRemaining = Math.floor((timeAdd.getTime() - now.getTime()) / 1000);
            if (counttime) {
                clearInterval(counttime);
            }
            counttime = setInterval(() => {
                if (currentTurns < numberOfTurns) {
                    timeRemaining--;
                    if (timeRemaining <= 0) {
                        currentTurns++;
                        timeRemaining = 60; // Reset thời gian cho lượt mới.
                    }
                }
                else {
                    clearInterval(counttime);
                    counttime = null;
                }
            }, 1000);
        }
    });
}
function updateUI() {
    const count = document.getElementById("counttime");
    const currentTurnsElement = document.getElementById("currentTurns");
    const numberTurnsElement = document.getElementById("numberTurns");
    if (currentTurnsElement) {
        currentTurnsElement.innerHTML = currentTurns.toString();
    }
    if (numberTurnsElement) {
        numberTurnsElement.innerHTML = numberOfTurns.toString();
    }
    if (count) {
        if (currentTurns < numberOfTurns) {
            count.innerHTML = "Next attempt in: ";
            let diffInMinutes = Math.floor(timeRemaining / 60);
            let diffInSeconds = timeRemaining % 60;
            count.innerHTML += `${diffInMinutes}:${diffInSeconds >= 10 ? diffInSeconds : "0" + diffInSeconds}`;
        }
        else {
            count.innerHTML = "";
        }
    }
    const playbutton = document.getElementById("play-button");
    if (currentTurns > 0) {
        if (playbutton) {
            playbutton.removeAttribute("disabled");
            playbutton.style.backgroundColor = "#ffc107";
        }
    }
    else {
        if (playGame) {
            playGame.removeAttribute("href");
        }
        if (playbutton) {
            playbutton.setAttribute("disabled", "true");
            playbutton.style.backgroundColor = "grey";
        }
    }
    requestAnimationFrame(updateUI);
}
function checkTurns(event) {
    var _a;
    event.preventDefault();
    let currentTurns = Number((_a = document.getElementById("currentTurns")) === null || _a === void 0 ? void 0 : _a.textContent);
    if (currentTurns > 0) {
        window.location.href = "test.html";
    }
}
function start() {
    loadUser();
    updateUI();
}
start();
if (playGame) {
    playGame.addEventListener("click", checkTurns);
}
