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
// const selectButtons = document.getElementsByClassName("price");
function select(id, event) {
    event.preventDefault();
    console.log(id);
}
function loadCharacter() {
    return __awaiter(this, void 0, void 0, function* () {
        let characters;
        let str = "";
        characters = yield fetch(charApi + "/getAllChar").then(res => {
            return res.json();
        });
        characters.forEach(char => {
            str +=
                `<div class="item">
                <img src="image/${char.image}" alt="Unicorn">
                <button type="submit" class="price" data-id="${char.id}">${char.coins} points</button>
            </div>`;
        });
        const shopElement = document.getElementById("shop");
        if (shopElement) {
            shopElement.innerHTML = str;
        }
        const buttons = document.querySelectorAll(".price");
        buttons.forEach(button => {
            button.addEventListener("click", (event) => {
                const id = Number(button.getAttribute("data-id"));
                select(id, event);
            });
        });
        requestAnimationFrame(loadCharacter);
    });
}
loadCharacter();
