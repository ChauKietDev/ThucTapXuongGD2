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
    }
    requestAnimationFrame(loadUser);
}
async function checkTurns(event: Event) {
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
function closePopup() {
    const customAlert = document.getElementById('customAlert');
    const timerElement = document.getElementById('timer');

    if (customAlert) {
        customAlert.style.display = 'none';
    }
}

loadUser();
if (playGame) {
    playGame.addEventListener("click", checkTurns);
}