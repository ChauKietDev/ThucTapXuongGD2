interface PlayerInfo {
    id: number,
    highestScore: number,
    numberOfTurns: number,
    currentTurns: number,
    timeUsedTurn : Date,
    timeAddTurn: Date,
    user: User
}
let playerApi = "http://localhost:8080/api/v1/playerinfo";
let counttime: number | null = null;
let timeRemaining: number = 0;
let currentTurns: number = 0;
let numberOfTurns: number = 0;
const playGame = document.getElementById("play") as HTMLButtonElement;

async function loadUser() {
    let playerinfo: PlayerInfo;
    let userLogined: string | null; 
    userLogined = localStorage.getItem("UserLogined");
    const res = await fetch(playerApi + `/getInfo/username-${userLogined}`);
    if (res.ok) {
        playerinfo = await res.json();
        const resUpdate = await fetch(playerApi + `/updateTurns/${playerinfo.id}-isPlayed=${false}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: "Plain text data"
        });

        if (resUpdate.ok) {
            playerinfo = await resUpdate.json();
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
            document.getElementById("timeAddTurn")?.setAttribute("value", playerinfo.timeAddTurn.toString());
        }
        currentTurns = playerinfo.currentTurns;
        numberOfTurns = playerinfo.numberOfTurns;
        
        let getTime = document.getElementById("timeAddTurn")?.getAttribute("value");
        let timeAdd: Date = new Date(String(getTime));
        let now: Date = new Date();
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
            } else {
                clearInterval(counttime!);
                counttime = null;
            }
        }, 1000);    
    }
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
function checkTurns(event: Event) {
    event.preventDefault();

    let currentTurns: number = Number(document.getElementById("currentTurns")?.textContent);
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