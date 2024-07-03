document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById("login-form-container");
    const registerForm = document.getElementById("register-form-container");
    const showRegisterForm = document.getElementById("show-register-form");
    const showLoginForm = document.getElementById("show-login-form");
    const rememberMeCheckbox = document.getElementById("remember-me");



    const emailCookie = getCookie('Email');
    const passwordCookie = getCookie('Password');

    if (emailCookie && passwordCookie) {
        document.getElementById('login-email').value = emailCookie;
        document.getElementById('login-password').value = passwordCookie;
        rememberMeCheckbox.checked = true;
    }

    showRegisterForm.addEventListener("click", (e) => {
        e.preventDefault();
        loginForm.style.display = "none";
        registerForm.style.display = "block";
    });

    showLoginForm.addEventListener("click", (e) => {
        e.preventDefault();
        registerForm.style.display = "none";
        loginForm.style.display = "block";
    });

    loginForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const loginEmail = document.getElementById("login-email").value;
        const loginPassword = document.getElementById("login-password").value;
        const rememberMeChecked = rememberMeCheckbox.checked;

        const error_email = document.getElementById("error-email-login");
        const error_password = document.getElementById("error-password-login");


        error_email.innerHTML = "";
        error_password.innerHTML = "";

        if (!validateEmail(loginEmail)) {
            const errorMessage = document.createElement("div");
            errorMessage.classList.add("error");
            errorMessage.textContent = "Невалідна електронна пошта";

            error_email.appendChild(errorMessage);

            return;
        }
        if (loginPassword.length < 6) {
            const errorMessage = document.createElement("div");
            errorMessage.classList.add("error");
            errorMessage.textContent = "Довжина пароля повинна бути мінімум 6 символів !!!";

            error_password.appendChild(errorMessage);

            return;
        }



        // cookie
        if (rememberMeChecked) {
            document.cookie = `Email=${loginEmail}`;
            document.cookie = `Password=${loginPassword}`;
        } else {
            document.cookie = `Email=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
            document.cookie = `Password=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
        }

        // alert("Успішний вхід");
        window.location.href = "news.html";
    });

    registerForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const registerUsername = document.getElementById("register-username").value;
        const registerEmail = document.getElementById("register-email").value;
        const registerPassword = document.getElementById("register-password").value;
        const confirmPassword = document.getElementById("confirm-password").value;
        const rememberMeChecked = document.getElementById("remember-me-register").checked;

        const error_email = document.getElementById("error-email-register");
        const error_password = document.getElementById("error-password-register");

        error_password.innerHTML = "";
        error_email.innerHTML = "";

        if (registerPassword !== confirmPassword) {
            const errorMessage = document.createElement("div");
            errorMessage.classList.add("error");
            errorMessage.textContent = "Паролі не співпадають !!!";

            error_password.appendChild(errorMessage);

            return;
        }
        if (registerPassword.length < 6 || confirmPassword.length < 6) {
            const errorMessage = document.createElement("div");
            errorMessage.classList.add("error");
            errorMessage.textContent = "Довжина пароля повинна бути мінімум 6 символів !!!";

            error_email.appendChild(errorMessage);

            return;
        }
        if (!validateEmail(registerEmail)) {
            const errorMessage = document.createElement("div");
            errorMessage.classList.add("error");
            errorMessage.textContent = "Невалідна електронна пошта !!!";

            error_email.innerHTML = "";
            error_email.appendChild(errorMessage);

            return;
        }


        // cookie
        if (rememberMeChecked) {
            document.cookie = `Email=${registerEmail}`;
            document.cookie = `Password=${registerPassword}`;
        } else {
            document.cookie = `Email=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
            document.cookie = `Password=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
        }



        // alert("Успішна реєстрація");
        window.location.href = "news.html";
    });

    function getCookie(name) {
        const cookieName = `${name}=`;
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            let cookie = cookies[i].trim();
            if (cookie.indexOf(cookieName) === 0) {
                return cookie.substring(cookieName.length, cookie.length);
            }
        }
        return null;
    }


    function validateEmail(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    }

});
