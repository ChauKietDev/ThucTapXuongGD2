interface Character {
    id: number,
    name: string,
    coins: number,
    image: string
}
interface BoughtChar {
    id: number,
    playerInfo: PlayerInfo,
    charBuy: Character,
    isSelected: boolean
}
let charApi = "http://localhost:8080/api/v1/shop";
let pApi = "http://localhost:8080/api/v1/playerinfo"
let playerInfoId: number = Number(localStorage.getItem("playerInfoId"));
let currentPage = 1;
let itemsPerPage = 4;
// const selectButtons = document.getElementsByClassName("price");
async function addBoughtChar(pId: number, charId: number): Promise<BoughtChar | null> {
    let res = await fetch(charApi + `/buyChar/playerId-${pId}/charId-${charId}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: "Plain text data"
    });
    if (res.ok) {
        return res.json();
    }
    else {
        return null;
    }
}
async function updateBoughtCharStatus(pId: number, charId: number, selected: boolean): Promise<BoughtChar | null> {
    let res = await fetch(charApi + `/boughtChar/updateStatus/playerId-${pId}/charId-${charId}/selected-${selected}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: "Plain text data"
    });
    if (res.ok) {
        return res.json();
    }
    else {
        return null;
    } 
}
async function getPlayerInfo(): Promise<PlayerInfo | null> {
    let res = await fetch(pApi + `/${playerInfoId}`);
    if (res.ok) {
        return res.json();
    }
    else {
        return null;
    }
}
async function decreaseScore(score: number) {
    let curPlayerInfo: PlayerInfo | null;
    curPlayerInfo = await getPlayerInfo();
    if (curPlayerInfo?.highestScore != null) {
        curPlayerInfo.highestScore -= score;
    }
    await fetch(pApi + `/updateInfor/${playerInfoId}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(curPlayerInfo) 
    });
}
async function currentSelectedChar(): Promise<BoughtChar | null> {
    let res = await fetch(charApi + `/boughtChar/selectedChar/playerId-${playerInfoId}`);
    if (res.ok) {
        return res.json();
    }
    else {
        return null;
    }
}
async function viewSelectedChar() {
    let selectedChar: BoughtChar | null;
    let str: string = "";
    selectedChar = await currentSelectedChar();
    const viewSelectedChar = document.getElementById("selected");
    if (selectedChar != null) {
        str += `<img src="image/${selectedChar.charBuy.image}" alt="${selectedChar.charBuy.name}" class="header-image">
                <div class="available-coins">
                    <h1>Current character</h1>
                </div>`;
        if (viewSelectedChar) {
            viewSelectedChar.innerHTML = str;
        }
    }
}
async function selectOrBuy(id: number, currentText: string | null, event: Event) {
    let resultBoughtChar: BoughtChar | null;
    let currentPlayerInfo: PlayerInfo | null;
    let boughtCharElement = document.getElementById(id.toString());
    event.preventDefault();
    if (currentText?.trim() === "Select") {
        console.log(id, "select character");
        resultBoughtChar = await currentSelectedChar();
        // Thay đổi trạng thái của nhân vật đã chọn trước đó thành false và thay đổi thuộc tính nút button
        updateBoughtCharStatus(playerInfoId, Number(resultBoughtChar?.charBuy.id), false);
        let changeBoughtCharBefore = document.getElementById(String(resultBoughtChar?.charBuy.id));
        if (changeBoughtCharBefore) {
            changeBoughtCharBefore.textContent = "Select";
            changeBoughtCharBefore.removeAttribute("disabled");
        }
        resultBoughtChar = null;
        // Thay đổi trạng thái nhân vật đã chọn thành true
        resultBoughtChar = await updateBoughtCharStatus(playerInfoId, id, true);
        if (resultBoughtChar != null && boughtCharElement) {
            boughtCharElement.textContent = "Selected";
            boughtCharElement.setAttribute("disabled", "true");
            viewSelectedChar();
        }

    }
    else if (currentText?.trim().includes("points")) {
        currentPlayerInfo = await getPlayerInfo();
        let points: number = Number(currentText.trim().substring(0, currentText.trim().indexOf(" ")));
        if (currentPlayerInfo?.highestScore != null) {
            if (confirm("Are you sure to want to buy this character?")) {
                if (currentPlayerInfo.highestScore >= points) {
                    resultBoughtChar = await addBoughtChar(playerInfoId, id);
                    decreaseScore(points);
                    if (resultBoughtChar != null && boughtCharElement) {
                        boughtCharElement.textContent = "Select";
                    }
                }
                else {
                    alert("Not enough points!");
                }
            }
        }
        else {
            console.log("Not found player info")
        }
    }
    // else {
    //     console.log(id, "selected");
    // }
}
async function fetchCharacters(page: number, limit: number): Promise<Character[]> {
    // Fetch dữ liệu với phân trang (API có hỗ trợ query parameters)
    const response = await fetch(charApi + `/pagination/start-${(page * itemsPerPage) - itemsPerPage}/limit-${limit}`);
    if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
    }
    return response.json();
}
async function createPagination(page: number) {
    let allChar: Character[];
    const paginationElement = document.getElementById("pagination");
    if (!paginationElement) return;

    // Giả sử bạn biết số lượng trang (nên được cung cấp bởi API)
    allChar = await fetch(charApi + "/getAllChar").then(res => {
        return res.json();
    })
    const totalPages = Math.ceil(allChar.length / 4); // Tổng số trang (tạm thời giả định)

    let paginationHTML = "";

    // Tạo các nút trang
    for (let i = 1; i <= totalPages; i++) {
        paginationHTML += `<button class="pagination-btn ${i === page ? "active" : ""}" data-page="${i}"></button>`;
    }

    paginationElement.innerHTML = paginationHTML;

    // Thêm sự kiện click cho các nút phân trang
    const paginationButtons = document.querySelectorAll(".pagination-btn");
    paginationButtons.forEach(button => {
        button.addEventListener("click", (event: Event) => {
            const targetPage = Number((event.target as HTMLElement).getAttribute("data-page"));
            loadCharacter(targetPage);
        });
    });
}
// async function loadBoughtChars(): Promise<BoughtChar[]>{
//     let boughtChars: BoughtChar[];
//     let playerInfoId: number = Number(localStorage.getItem("playerInfoId"));
//     boughtChars = await fetch(charApi + `/boughtchar/${playerInfoId}`).then(res => {
//         return res.json();
//     });
//     return boughtChars;
// }
async function loadCharacter(page: number) {
    let characters: Character[];
    let str: string = "";
    characters = await fetchCharacters(page, itemsPerPage);
    for (const char of characters) {
        // let checkBought: boolean = await fetch(charApi + `/checkBought/${playerInfoId}-${char.id}`).then(res => {
        //     return res.json();
        // });
        let boughtChar: BoughtChar | null = null;
        let res = await fetch(charApi + `/boughtChar/${playerInfoId}-${char.id}`);
        if (res.ok) {
            boughtChar = await res.json();
        }
        str += `
            <div class="item">
                <img src="image/${char.image}" alt="${char.name}">
                <button type="submit" class="price" data-id="${char.id}" id="${char.id}">
                    ${boughtChar != null ? (boughtChar.isSelected ? 'Selected' : 'Select')
                                         : char.coins + " points"}
                </button>
            </div>`;
    }
    const shopElement = document.getElementById("shop");
    if (shopElement) {
        shopElement.innerHTML = str;
    }
    const buttons = document.querySelectorAll(".price");
    buttons.forEach(button => {
        button.addEventListener("click", (event: Event) => {
            const id = Number((button as HTMLElement).getAttribute("data-id"));
            const text: string | null = (button as HTMLElement).textContent;
            selectOrBuy(id, text, event);      
        });
    });
    createPagination(page);

}
async function getSelectedChar() {
    let selectedChar: BoughtChar;
    let str: string = "";
    selectedChar = await fetch(charApi + `/boughtChar/selectedChar/playerId-${playerInfoId}`).then(res => {
        return res.json();
    });
    str += `
        <img src="image/${selectedChar.charBuy.image}" alt="${selectedChar.charBuy.name}" class="header-image">
        <div class="available-coins">
            <h1>Your character</h1>
        </div>`;
    const selectedElement = document.getElementById("selected");
    if (selectedElement) {
        selectedElement.innerHTML = str;
    }
}

getSelectedChar();
loadCharacter(currentPage);
