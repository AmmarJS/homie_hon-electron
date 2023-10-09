import { showAlert } from "./notifications.js"

document.addEventListener("DOMContentLoaded", function() {
    const usernameField = document.querySelector("#username")
    const passwordField = document.querySelector("#password")
    const loginBtn = document.querySelector("#login-btn")

    loginBtn.addEventListener("click", async function() {
        const username = usernameField.value;
        const password = passwordField.value;
        const credentials = {username, password}
        const loginResponse = await loginAPI.login(credentials)
        console.log(loginResponse)
        if(loginResponse) {
            showAlert(loginResponse)
        }
    })

    usernameField.addEventListener("input", function() {
        if(this.value.trim() == "" || passwordField.value.trim() == "") {
            loginBtn.disabled = true;
            loginBtn.classList = "save-btn-disabled"
        } else {
            loginBtn.disabled = false;
            loginBtn.classList = "save-btn"
        }
    })

    passwordField.addEventListener("input", function() {
        if(this.value.trim() == "" || usernameField.value.trim() == "") {
            loginBtn.disabled = true;
            loginBtn.classList = "save-btn-disabled"
        } else {
            loginBtn.disabled = false;
            loginBtn.classList = "save-btn"
        }
    })
})