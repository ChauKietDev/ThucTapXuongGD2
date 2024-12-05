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
let userApi = "http://localhost:8080/api/v1/user";
const signupButton = document.getElementById("signup");
function signup(event) {
    return __awaiter(this, void 0, void 0, function* () {
        event.preventDefault();
        let username = "";
        let password = "";
        let confirmPassword = "";
        const checkUser = document.getElementById("checkUsername");
        const checkPass = document.getElementById("checkPassword");
        const checkConfirm = document.getElementById("submitPassword");
        // Lấy dữ liệu từ input
        const usernameElement = document.getElementById("username");
        if (usernameElement) {
            username = String(usernameElement.value);
        }
        const passwordElement = document.getElementById("password");
        if (passwordElement) {
            password = String(passwordElement.value);
        }
        const confirmPassElement = document.getElementById("confirm-password");
        if (confirmPassElement) {
            confirmPassword = String(confirmPassElement.value);
        }
        console.log(username, password, confirmPassword);
        // Validation data
        if (username === "") {
            if (checkUser) {
                checkUser.innerHTML = "Please enter your username";
            }
        }
        else {
            if (checkUser) {
                checkUser.innerHTML = "";
            }
        }
        if (password === "") {
            if (checkPass) {
                checkPass.innerHTML = "Please enter your password";
            }
        }
        else {
            if (checkPass) {
                checkPass.innerHTML = "";
            }
        }
        if (confirmPassword === "") {
            if (checkConfirm) {
                checkConfirm.innerHTML = "Please re-enter your password";
            }
        }
        else if (password != confirmPassword) {
            if (checkConfirm) {
                checkConfirm.innerHTML = "Confirm password not match with your password";
            }
        }
        else {
            if (checkConfirm) {
                checkConfirm.innerHTML = "";
            }
        }
        // Kiểm tra dữ liệu đã được xác minh thành công
        if (username != "" && password != "") {
            const userSignup = { username, password };
            let res = yield fetch(userApi + "/addUser", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(userSignup)
            });
            if (res.ok) {
                const message = document.getElementById("message");
                if (message) {
                    message.innerHTML = "Sign up successfully";
                }
            }
        }
    });
}
if (signupButton) {
    signupButton.addEventListener("click", signup);
}
