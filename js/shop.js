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
let charApi = "http://localhost:8080/api/v1/shop";
let pApi = "http://localhost:8080/api/v1/playerinfo";
let playerInfoId = Number(localStorage.getItem("playerInfoId"));
let currentPage = 1;
let itemsPerPage = 4;
// const selectButtons = document.getElementsByClassName("price");
function addBoughtChar(pId, charId) {
    return __awaiter(this, void 0, void 0, function* () {
        let res = yield fetch(charApi + `/buyChar/playerId-${pId}/charId-${charId}`, {
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
    });
}
function updateBoughtCharStatus(pId, charId, selected) {
    return __awaiter(this, void 0, void 0, function* () {
        let res = yield fetch(charApi + `/boughtChar/updateStatus/playerId-${pId}/charId-${charId}/selected-${selected}`, {
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
    });
}
function getPlayerInfo() {
    return __awaiter(this, void 0, void 0, function* () {
        let res = yield fetch(pApi + `/${playerInfoId}`);
        if (res.ok) {
            return res.json();
        }
        else {
            return null;
        }
    });
}
function decreaseScore(score) {
    return __awaiter(this, void 0, void 0, function* () {
        let curPlayerInfo;
        curPlayerInfo = yield getPlayerInfo();
        if ((curPlayerInfo === null || curPlayerInfo === void 0 ? void 0 : curPlayerInfo.highestScore) != null) {
            curPlayerInfo.highestScore -= score;
        }
        yield fetch(pApi + `/updateInfor/${playerInfoId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(curPlayerInfo)
        });
    });
}
function currentSelectedChar() {
    return __awaiter(this, void 0, void 0, function* () {
        let res = yield fetch(charApi + `/boughtChar/selectedChar/playerId-${playerInfoId}`);
        if (res.ok) {
            return res.json();
        }
        else {
            return null;
        }
    });
}
function viewSelectedChar() {
    return __awaiter(this, void 0, void 0, function* () {
        let selectedChar;
        let str = "";
        selectedChar = yield currentSelectedChar();
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
    });
}
function selectOrBuy(id, currentText, event) {
    return __awaiter(this, void 0, void 0, function* () {
        let resultBoughtChar;
        let currentPlayerInfo;
        let boughtCharElement = document.getElementById(id.toString());
        event.preventDefault();
        if ((currentText === null || currentText === void 0 ? void 0 : currentText.trim()) === "Select") {
            console.log(id, "select character");
            resultBoughtChar = yield currentSelectedChar();
            // Thay đổi trạng thái của nhân vật đã chọn trước đó thành false và thay đổi thuộc tính nút button
            updateBoughtCharStatus(playerInfoId, Number(resultBoughtChar === null || resultBoughtChar === void 0 ? void 0 : resultBoughtChar.charBuy.id), false);
            let changeBoughtCharBefore = document.getElementById(String(resultBoughtChar === null || resultBoughtChar === void 0 ? void 0 : resultBoughtChar.charBuy.id));
            if (changeBoughtCharBefore) {
                changeBoughtCharBefore.textContent = "Select";
                changeBoughtCharBefore.removeAttribute("disabled");
            }
            resultBoughtChar = null;
            // Thay đổi trạng thái nhân vật đã chọn thành true
            resultBoughtChar = yield updateBoughtCharStatus(playerInfoId, id, true);
            if (resultBoughtChar != null && boughtCharElement) {
                boughtCharElement.textContent = "Selected";
                boughtCharElement.setAttribute("disabled", "true");
                viewSelectedChar();
            }
        }
        else if (currentText === null || currentText === void 0 ? void 0 : currentText.trim().includes("points")) {
            currentPlayerInfo = yield getPlayerInfo();
            let points = Number(currentText.trim().substring(0, currentText.trim().indexOf(" ")));
            if ((currentPlayerInfo === null || currentPlayerInfo === void 0 ? void 0 : currentPlayerInfo.highestScore) != null) {
                if (confirm("Are you sure to want to buy this character?")) {
                    if (currentPlayerInfo.highestScore >= points) {
                        resultBoughtChar = yield addBoughtChar(playerInfoId, id);
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
                console.log("Not found player info");
            }
        }
        // else {
        //     console.log(id, "selected");
        // }
    });
}
function fetchCharacters(page, limit) {
    return __awaiter(this, void 0, void 0, function* () {
        // Fetch dữ liệu với phân trang (API có hỗ trợ query parameters)
        const response = yield fetch(charApi + `/pagination/start-${(page * itemsPerPage) - itemsPerPage}/limit-${limit}`);
        if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }
        return response.json();
    });
}
function createPagination(page) {
    return __awaiter(this, void 0, void 0, function* () {
        let allChar;
        const paginationElement = document.getElementById("pagination");
        if (!paginationElement)
            return;
        // Giả sử bạn biết số lượng trang (nên được cung cấp bởi API)
        allChar = yield fetch(charApi + "/getAllChar").then(res => {
            return res.json();
        });
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
            button.addEventListener("click", (event) => {
                const targetPage = Number(event.target.getAttribute("data-page"));
                loadCharacter(targetPage);
            });
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
function loadCharacter(page) {
    return __awaiter(this, void 0, void 0, function* () {
        let characters;
        let str = "";
        characters = yield fetchCharacters(page, itemsPerPage);
        for (const char of characters) {
            // let checkBought: boolean = await fetch(charApi + `/checkBought/${playerInfoId}-${char.id}`).then(res => {
            //     return res.json();
            // });
            let boughtChar = null;
            let res = yield fetch(charApi + `/boughtChar/${playerInfoId}-${char.id}`);
            if (res.ok) {
                boughtChar = yield res.json();
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
            button.addEventListener("click", (event) => {
                const id = Number(button.getAttribute("data-id"));
                const text = button.textContent;
                selectOrBuy(id, text, event);
            });
        });
        createPagination(page);
    });
}
function getSelectedChar() {
    return __awaiter(this, void 0, void 0, function* () {
        let selectedChar;
        let str = "";
        selectedChar = yield fetch(charApi + `/boughtChar/selectedChar/playerId-${playerInfoId}`).then(res => {
            return res.json();
        });
        str += `
        <img src="image/${selectedChar.charBuy.image}" alt="${selectedChar.charBuy.name}" class="header-image">
        <div class="available-coins">
            <h1>Current character</h1>
        </div>`;
        const selectedElement = document.getElementById("selected");
        if (selectedElement) {
            selectedElement.innerHTML = str;
        }
    });
}
getSelectedChar();
loadCharacter(currentPage);
