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

            const currentTurnsElement = document.getElementById("currentTurns");
            if (currentTurnsElement) {
                currentTurnsElement.innerHTML = playerinfo.currentTurns.toString();
            }

            const numberTurnsElement = document.getElementById("numberTurns");
            if (numberTurnsElement) {
                numberTurnsElement.innerHTML = playerinfo.numberOfTurns.toString();
            }
            document.getElementById("timeAddTurn")?.setAttribute("value", playerinfo.timeAddTurn.toString());
        }
        currentTurn = playerinfo.currentTurns;
        numberOfTurn = playerinfo.numberOfTurns;
        
        let getTime = document.getElementById("timeAddTurn")?.getAttribute("value");
        let timeAdd: Date = new Date(String(getTime));
        let now: Date = new Date();
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
            } else {
                clearInterval(countTime!);
                countTime = null;
            }
        }, 1000);    
    }
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
async function checkTurn(event: Event) {
    event.preventDefault();

    let currentTurns: number = Number(document.getElementById("currentTurns")?.textContent);
    if (currentTurns > 0) {
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

        const currentTurnsElement = document.getElementById("currentTurns");
        if (currentTurnsElement) {
            currentTurnsElement.innerHTML = playerinfo.currentTurns.toString();
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
    updateui();
}

loadRank();
run();
if (play) {
    play.addEventListener("click", checkTurn);
}