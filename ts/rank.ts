interface Achievement {
    id: number,
    playerInfo: PlayerInfo
}
let rankApi = "http://localhost:8080/api/v1/rank";
let playerAPI = "http://localhost:8080/api/v1/playerinfo";
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
async function checkTurn(event: Event) {
    event.preventDefault();

    let currentTurns: number = Number(document.getElementById("currentTurns")?.textContent);
    if (currentTurns > 0) {
        window.location.href = "test.html";
    }
    else {
        const customAlert = document.getElementById('customAlert');
        const timerElement = document.getElementById('timer');

        let getTime = document.getElementById("timeAddTurn")?.getAttribute("value");
        let timeAdd: Date = new Date(String(getTime));
        console.log(timeAdd)
        let now: Date = new Date();

        console.log(timeAdd.getTime(), now.getTime())
        let timeRemaining = Math.floor((timeAdd.getTime() - now.getTime()) / 1000);
        let diffInMinutes = Math.floor(timeRemaining / 60);
        let diffInSeconds = timeRemaining % 60;

        if (customAlert) {
            customAlert.style.display = 'block';
        }
        if (timerElement) {
            timerElement.textContent = `You run out of turn, please wait in: ${diffInMinutes + ":" 
                                        + (diffInSeconds >= 10 ? diffInSeconds : "0" + diffInSeconds)}`;
        }

        const counttime = setInterval(() => {    
            if (timeRemaining == 0) {
                clearInterval(counttime);
                setTimeout(() => {
                    if (customAlert) {
                        customAlert.style.display = 'none';
                    }
                    if (timerElement) {
                        timerElement.style.display = 'none';
                    }
                });
            }
            else {
                timeRemaining--;
                diffInMinutes = Math.floor(timeRemaining / 60);
                diffInSeconds = timeRemaining % 60;
                if (timerElement) {
                    timerElement.textContent = `You run out of turn, please wait in: ${diffInMinutes + ":" 
                                                + (diffInSeconds >= 10 ? diffInSeconds : "0" + diffInSeconds)}`;
                }
                
                // alert("You run out of turn, please wait to " + (diffInHour > 0 ? diffInHour + ":" : "") +
                //     );
            }
        }, 1000)
        
        // alert("You run out of turn, please wait to " + timeAdd);
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
function closePop() {
    const customAlert = document.getElementById('customAlert');
    const timerElement = document.getElementById('timer');

    if (customAlert) {
        customAlert.style.display = 'none';
    }
}
async function loadRank() {
    const rankListElement = document.getElementById("ranklist");
    if (rankListElement) {
        rankListElement.innerHTML = await playerRank() + await topRank();
    }
    loadTurn();
    requestAnimationFrame(loadRank);
}

loadRank();
if (play) {
    play.addEventListener("click", checkTurn);
}