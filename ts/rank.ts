interface Achievement {
    id: number,
    playerInfo: PlayerInfo
}
let rankApi = "http://localhost:8080/api/v1/rank";
let playerAPI = "http://localhost:8080/api/v1/playerinfo";
let countTime: number | null = null;
let timeRemain: number = 0;
let currentTurn: number = 0;
let numberOfTurn: number = 0;
const play = document.getElementById("play") as HTMLButtonElement;

async function playerRank() {
    let rankList: Achievement[];
    let username: string | null = localStorage.getItem("UserLogined");
    let str: string = "";
    let rankNum: number = 1;
    const resRank = await fetch(rankApi + "/getAllPlayerRank");
    if (resRank.ok) {
        rankList = await resRank.json();
        for (let i: number = 0; i < rankList.length; i++) {
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
}
async function topRank() {
    let rankList: Achievement[];
    let str: string = "";
    let i: number = 1;
    const resRank = await fetch(rankApi + "/getRank");
    if (resRank.ok) {
        rankList = await resRank.json();
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
}
async function loaduser() {
    let playerinfo: PlayerInfo;
    let userLogined: string | null; 
    userLogined = localStorage.getItem("UserLogined");
    const res = await fetch(playerAPI + `/getInfo/username-${userLogined}`);
    if (res.ok) {
        playerinfo = await res.json();
        const resUpdate = await fetch(playerAPI + `/updateTurns/${playerinfo.id}-isPlayed=${false}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: "Plain text data"
        });

        if (resUpdate.ok) {
            playerinfo = await resUpdate.json();
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
                timeAddTurnElement.setAttribute("value",
                    playerinfo.timeAddTurn != null ? playerinfo.timeAddTurn.toString() : ""
                );
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
                
            } else {
                // thay đổi thuộc tính css của button
                playButton.style.backgroundColor = "grey";
                playButton.setAttribute("disabled", "true");
                // Đếm ngược thời gian thêm lượt chơi
                let getTime = timeAddTurnElement?.getAttribute("value");
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
                    } else {
                        clearInterval(counttime!); // Dừng bộ đếm khi hết thời gian
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
}
async function checkTurn(event: Event) {
    event.preventDefault();

    let currentTurn: number = Number(document.getElementById("currentTurn")?.textContent);
    if (currentTurn > 0) {
        window.location.href = "test.html";
    }
}
async function loadTurn() {
    let playerinfo: PlayerInfo;
    let playerInfoId: number = Number(localStorage.getItem("playerInfoId"));
    const resUpdate = await fetch(playerAPI + `/updateTurns/${playerInfoId}-isPlayed=${false}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: "Plain text data"
    });

    if (resUpdate.ok) {
        playerinfo = await resUpdate.json();
        localStorage.setItem("playerInfoId", playerinfo.id.toString());

        const currentTurnElement = document.getElementById("currentTurn");
        if (currentTurnElement) {
            currentTurnElement.innerHTML = playerinfo.currentTurns.toString();
        }

        const numberTurnsElement = document.getElementById("numberTurns");
        if (numberTurnsElement) {
            numberTurnsElement.innerHTML = playerinfo.numberOfTurns.toString();
        }

        document.getElementById("timeAddTurn")?.setAttribute("value", playerinfo.timeAddTurn.toString());
    }
    
}
async function loadRank() {
    const rankListElement = document.getElementById("ranklist");
    if (rankListElement) {
        rankListElement.innerHTML = await playerRank() + await topRank();
    }
    requestAnimationFrame(loadRank);
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