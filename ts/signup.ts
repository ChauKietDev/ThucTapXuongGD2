let userApi = "http://localhost:8080/api/v1/user";
const signupButton = document.getElementById("signup") as HTMLButtonElement;
async function signup(event: Event) {
    event.preventDefault();

    let username: string = "";
    let password: string = "";
    let confirmPassword: string = "";
    let matchPassword: boolean = false;
    const checkUser = document.getElementById("checkUsername");
    const checkPass = document.getElementById("checkPassword");
    const checkConfirm = document.getElementById("submitPassword");
    // Lấy dữ liệu từ input
    const usernameElement = document.getElementById("username") as HTMLInputElement;
    if (usernameElement) {
        username = String(usernameElement.value);
    }
    const passwordElement = document.getElementById("password") as HTMLInputElement;
    if (passwordElement) {
        password = String(passwordElement.value);
    }
    const confirmPassElement = document.getElementById("confirm-password") as HTMLInputElement;
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
            matchPassword = true;
        }
    }
    // Kiểm tra dữ liệu đã được xác minh thành công
    if (username != "" && password != "" && matchPassword) {
        const userSignup: User = {username, password};
        let res = await fetch(userApi + "/addUser", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(userSignup)
        })
        if (res.ok) {
            const message = document.getElementById("message");
            if (message) {
                message.innerHTML = "Sign up successfully";
            }
        }
    }
}

if (signupButton) {
    signupButton.addEventListener("click", signup);
}