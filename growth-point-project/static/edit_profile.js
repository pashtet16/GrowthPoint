
document.addEventListener('DOMContentLoaded', function() {
    const form = document.querySelector('.edit-profile-form');
    const today = new Date().toISOString().split('T')[0];

    // Устанавливаем максимальную дату для даты рождения (сегодня)
    const birthDateInput = document.getElementById('birth_date');
    if (birthDateInput) {
        birthDateInput.max = today;
    }

    // Маска для телефона
    const phoneInput = document.getElementById('phone');
    if (phoneInput) {
        phoneInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');

            if (value.length > 0) {
                if (value.length === 1) value = '+7 (' + value;
                if (value.length > 1) value = '+7 (' + value.substring(1, 4);
                if (value.length > 4) value = '+7 (' + value.substring(1, 4) + ') ' + value.substring(4, 7);
                if (value.length > 7) value = '+7 (' + value.substring(1, 4) + ') ' + value.substring(4, 7) + '-' + value.substring(7, 9);
                if (value.length > 9) value = '+7 (' + value.substring(1, 4) + ') ' + value.substring(4, 7) + '-' + value.substring(7, 9) + '-' + value.substring(9, 11);
            }

            e.target.value = value;
        });
    }

    // Валидация формы
    form.addEventListener('submit', function(e) {
        let isValid = true;

        // Проверка имени
        const nameInput = document.getElementById('name');
        const nameError = document.getElementById('name-error');
        if (nameInput) {
            const nameValue = nameInput.value.trim();
            if (nameValue.length < 2 || nameValue.length > 50) {
                nameError.textContent = 'Имя должно быть от 2 до 50 символов';
                nameError.style.display = 'block';
                isValid = false;
            } else if (!/^[A-Za-zА-Яа-яЁё0-9\s\-_]+$/.test(nameValue)) {
                nameError.textContent = 'Только буквы, цифры, пробелы, дефисы и подчеркивания';
                nameError.style.display = 'block';
                isValid = false;
            } else {
                nameError.style.display = 'none';
            }
        }

        // Проверка email
        const emailInput = document.getElementById('email');
        const emailError = document.getElementById('email-error');
        if (emailInput) {
            const emailValue = emailInput.value.trim();
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(emailValue)) {
                emailError.textContent = 'Введите корректный email адрес';
                emailError.style.display = 'block';
                isValid = false;
            } else {
                emailError.style.display = 'none';
            }
        }

        // Проверка телефона (если заполнен)
        const phoneInputVal = document.getElementById('phone');
        const phoneError = document.getElementById('phone-error');
        if (phoneInputVal && phoneInputVal.value.trim() !== '') {
            const phoneValue = phoneInputVal.value.trim();
            const phoneRegex = /^\+7\s\(\d{3}\)\s\d{3}-\d{2}-\d{2}$/;
            if (!phoneRegex.test(phoneValue)) {
                phoneError.textContent = 'Формат: +7 (999) 123-45-67';
                phoneError.style.display = 'block';
                isValid = false;
            } else {
                phoneError.style.display = 'none';
            }
        } else {
            phoneError.style.display = 'none';
        }

        // Проверка города (если заполнен)
        const cityInput = document.getElementById('city');
        const cityError = document.getElementById('city-error');
        if (cityInput && cityInput.value.trim() !== '') {
            const cityValue = cityInput.value.trim();
            if (cityValue.length > 100) {
                cityError.textContent = 'Название города не должно превышать 100 символов';
                cityError.style.display = 'block';
                isValid = false;
            } else if (!/^[A-Za-zА-Яа-яЁё\s\-]+$/.test(cityValue)) {
                cityError.textContent = 'Только буквы, пробелы и дефисы';
                cityError.style.display = 'block';
                isValid = false;
            } else {
                cityError.style.display = 'none';
            }
        } else {
            cityError.style.display = 'none';
        }

        // Проверка даты рождения (если заполнена)
        const birthDateInputVal = document.getElementById('birth_date');
        const birthDateError = document.getElementById('birth-date-error');
        if (birthDateInputVal && birthDateInputVal.value !== '') {
            const birthDate = new Date(birthDateInputVal.value);
            const todayDate = new Date();

            if (birthDate > todayDate) {
                birthDateError.textContent = 'Дата рождения не может быть в будущем';
                birthDateError.style.display = 'block';
                isValid = false;
            } else if (birthDate.getFullYear() < 1900) {
                birthDateError.textContent = 'Дата рождения не может быть раньше 1900 года';
                birthDateError.style.display = 'block';
                isValid = false;
            } else {
                birthDateError.style.display = 'none';
            }
        } else {
            birthDateError.style.display = 'none';
        }

        if (!isValid) {
            e.preventDefault();
        }
    });

    // Очистка ошибок при изменении полей
    const inputs = document.querySelectorAll('.form-input');
    inputs.forEach(input => {
        input.addEventListener('input', function() {
            const errorId = this.id + '-error';
            const errorElement = document.getElementById(errorId);
            if (errorElement) {
                errorElement.style.display = 'none';
            }
        });
    });
});