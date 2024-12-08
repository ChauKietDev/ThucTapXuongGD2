// khai báo api riêng cho wallet
let playerinfoApi = "http://localhost:8080/api/v1/playerinfo";
async function viewScore() {
    let playerinfo: PlayerInfo;
    let pId: number = Number(localStorage.getItem("playerInfoId"));
    const res = await fetch(playerinfoApi + `/${pId}`);
    if (res.ok) {
        playerinfo = await res.json();
        const amount = document.getElementById("amount");
        if (amount) {
            amount.setAttribute("value", playerinfo.highestScore.toString());
        }
    }
}
viewScore();