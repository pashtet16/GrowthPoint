    // Функция переключения на форму входа




document.addEventListener('DOMContentLoaded', function() {
    // Основные элементы
    const mainContainer = document.getElementById('mainContainer');
    const registrationFormContainer = document.getElementById('registrationFormContainer');
    const loginFormContainer = document.getElementById('loginFormContainer');
    const loginHeroContent = document.getElementById('loginHeroContent');
    const loginLink = document.getElementById('loginLink');
    const registerLink = document.getElementById('registerLink');

    // Элементы формы регистрации
    const regForm = document.getElementById('registrationForm');
    const usernameInput = document.getElementById('login');
    const passwordInput = document.getElementById('password');
    const emailInput = document.getElementById('email');
    const usernameError = document.getElementById('usernameError');
    const passwordError = document.getElementById('passwordError');
    const emailError = document.getElementById('emailError');
    const successMessage = document.getElementById('successMessage');

    // Элементы формы входа
    const loginForm = document.getElementById('loginForm');
    const loginEmailInput = document.getElementById('loginEmail');
    const loginPasswordInput = document.getElementById('loginPassword');
    const loginEmailError = document.getElementById('loginEmailError');
    const loginPasswordError = document.getElementById('loginPasswordError');
    const loginSuccessMessage = document.getElementById('loginSuccessMessage');

    // Установка текущей даты по умолчанию
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('date of birth').value = today;

    // Переключение на форму входа
    loginLink.addEventListener('click', function(e) {
        e.preventDefault();
        switchToLogin();
    });

    // Переключение на форму регистрации
    registerLink.addEventListener('click', function(e) {
        e.preventDefault();
        switchToRegister();
    });


     function switchToLogin() {
        // Переворачиваем контейнер
        mainContainer.classList.add('login-mode');

        // Показываем форму входа и скрываем форму регистрации
        registrationFormContainer.style.display = 'none';
        loginFormContainer.style.display = 'block';

        // Показываем контент для входа и скрываем контент для регистрации
        document.querySelector('.hero-content').classList.add('login-content');
        loginHeroContent.classList.add('active');

        // Добавляем анимацию появления
        loginFormContainer.classList.add('slide-in');

        // Сброс ошибок формы регистрации
        resetRegistrationErrors();

        // Сброс формы регистрации
        regForm.reset();

        // Удаление анимации после завершения
        setTimeout(() => {
            loginFormContainer.classList.remove('slide-in');
        }, 500);
    }
    // Функция переключения на форму регистрации
    function switchToRegister() {
        // Возвращаем контейнер в исходное состояние
        mainContainer.classList.remove('login-mode');

        // Показываем форму регистрации и скрываем форму входа
        registrationFormContainer.style.display = 'block';
        loginFormContainer.style.display = 'none';

        // Показываем контент для регистрации и скрываем контент для входа
        document.querySelector('.hero-content').classList.remove('login-content');
        loginHeroContent.classList.remove('active');

        // Добавляем анимацию появления
        registrationFormContainer.classList.add('slide-in');

        // Сброс ошибок формы входа
        resetLoginErrors();

        // Сброс формы входа
        loginForm.reset();

        // Удаление анимации после завершения
        setTimeout(() => {
            registrationFormContainer.classList.remove('slide-in');
        }, 500);
    }

    // Валидация формы регистрации
    usernameInput.addEventListener('blur', validateUsername);
    passwordInput.addEventListener('blur', validatePassword);
    emailInput.addEventListener('blur', validateEmail);

    // Валидация имени пользователя
    function validateUsername() {
        if (usernameInput.value.length < 4) {
            usernameError.style.display = 'block';
            usernameInput.style.borderColor = '#dc3545';
            return false;
        } else {
            usernameError.style.display = 'none';
            usernameInput.style.borderColor = '#4dc2f7';
            return true;
        }
    }

    // Валидация пароля
    function validatePassword() {
        if (passwordInput.value.length < 6) {
            passwordError.style.display = 'block';
            passwordInput.style.borderColor = '#dc3545';
            return false;
        } else {
            passwordError.style.display = 'none';
            passwordInput.style.borderColor = '#4dc2f7';
            return true;
        }
    }

    // Валидация email
    function validateEmail() {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(emailInput.value)) {
            emailError.style.display = 'block';
            emailInput.style.borderColor = '#dc3545';
            return false;
        } else {
            emailError.style.display = 'none';
            emailInput.style.borderColor = '#4dc2f7';
            return true;
        }
    }

    // Сброс ошибок формы регистрации
    function resetRegistrationErrors() {
        usernameError.style.display = 'none';
        passwordError.style.display = 'none';
        emailError.style.display = 'none';
        successMessage.style.display = 'none';

        usernameInput.style.borderColor = '#ddd';
        passwordInput.style.borderColor = '#ddd';
        emailInput.style.borderColor = '#ddd';
    }

    // Обработка отправки формы регистрации
    regForm.addEventListener('submit', function(e) {
        // Только клиентская валидация перед отправкой на сервер
        successMessage.style.display = 'none';

        // Проверка валидности всех полей
        const isUsernameValid = validateUsername();
        const isPasswordValid = validatePassword();
        const isEmailValid = validateEmail();

        if (!isUsernameValid || !isPasswordValid || !isEmailValid) {
            // Если валидация не прошла, предотвращаем отправку на сервер
            e.preventDefault();
        }
        // Если все валидно, форма отправится на сервер автоматически
        // Серверная обработка (проверка в БД, редирект на main) выполняется на бэкенде
    });

    // Валидация формы входа
    loginEmailInput.addEventListener('blur', validateLoginEmail);
    loginPasswordInput.addEventListener('blur', validateLoginPassword);

    // Валидация email/логина для входа
    function validateLoginEmail() {
        if (loginEmailInput.value.trim() === '') {
            loginEmailError.style.display = 'block';
            loginEmailInput.style.borderColor = '#dc3545';
            return false;
        } else {
            loginEmailError.style.display = 'none';
            loginEmailInput.style.borderColor = '#4dc2f7';
            return true;
        }
    }

    // Валидация пароля для входа
    function validateLoginPassword() {
        if (loginPasswordInput.value.trim() === '') {
            loginPasswordError.style.display = 'block';
            loginPasswordInput.style.borderColor = '#dc3545';
            return false;
        } else {
            loginPasswordError.style.display = 'none';
            loginPasswordInput.style.borderColor = '#4dc2f7';
            return true;
        }
    }

    // Сброс ошибок формы входа
    function resetLoginErrors() {
        loginEmailError.style.display = 'none';
        loginPasswordError.style.display = 'none';
        loginSuccessMessage.style.display = 'none';

        loginEmailInput.style.borderColor = '#ddd';
        loginPasswordInput.style.borderColor = '#ddd';
    }



    // Анимация плавающих элементов
    const floatingElements = document.querySelectorAll('.floating-element');
    floatingElements.forEach(el => {
        el.style.animationDuration = `${Math.random() * 5 + 4}s`;
    });
});

// Функция переключения видимости пароля для обеих форм
document.addEventListener('DOMContentLoaded', function() {
    // Функция для настройки переключателя пароля
    function setupPasswordToggle(toggleId, passwordId) {
        const togglePassword = document.getElementById(toggleId);
        const passwordInput = document.getElementById(passwordId);

        if (togglePassword && passwordInput) {
            togglePassword.addEventListener('click', function() {
                // Переключаем тип поля ввода
                const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
                passwordInput.setAttribute('type', type);

                // Меняем иконку
                const eyeIcon = this.querySelector('i');
                if (type === 'text') {
                    eyeIcon.classList.remove('fa-eye');
                    eyeIcon.classList.add('fa-eye-slash');
                } else {
                    eyeIcon.classList.remove('fa-eye-slash');
                    eyeIcon.classList.add('fa-eye');
                }
            });
        }
    }

    // Настраиваем переключатели для обеих форм
    setupPasswordToggle('togglePassword', 'password'); // Для формы регистрации
    setupPasswordToggle('toggleLoginPassword', 'loginPassword'); // Для формы входа
});