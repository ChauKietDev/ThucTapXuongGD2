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
// khai báo api riêng cho wallet
let playerinfoApi = "http://localhost:8080/api/v1/playerinfo";
function viewScore() {
    return __awaiter(this, void 0, void 0, function* () {
        let playerinfo;
        let pId = Number(localStorage.getItem("playerInfoId"));
        const res = yield fetch(playerinfoApi + `/${pId}`);
        if (res.ok) {
            playerinfo = yield res.json();
            const amount = document.getElementById("amount");
            if (amount) {
                amount.setAttribute("value", playerinfo.highestScore.toString());
            }
        }
    });
}
viewScore();
