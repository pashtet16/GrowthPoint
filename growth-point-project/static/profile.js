/**
 * Файл JavaScript для страницы профиля пользователя GrowthPoint
 * Интеграция с существующей структурой проекта
 */

document.addEventListener('DOMContentLoaded', function() {
    initProfilePage();
    setupEventListeners();
});

/**
 * Инициализация страницы профиля
 */
function initProfilePage(userData = null) {
    console.log('Страница профиля GrowthPoint инициализирована');

    // Установка рейтинга из данных пользователя
    if (userData && userData.rating) {
        updateRatingStars(userData.rating);
    }

    // Инициализация мобильного меню
    initMobileMenu();
}

/**
 * Инициализация мобильного меню
 */
function initMobileMenu() {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');

    if (mobileMenuBtn && navLinks) {
        // Проверяем ширину экрана при загрузке
        if (window.innerWidth <= 992) {
            navLinks.style.display = 'none';
        }

        // Обработчик изменения размера окна
        window.addEventListener('resize', function() {
            if (window.innerWidth > 992) {
                navLinks.style.display = 'flex';
            } else {
                navLinks.style.display = 'none';
            }
        });
    }
}

/**
 * Установка обработчиков событий
 */
function setupEventListeners() {

    // Кнопка изменения аватара
    const editAvatarBtn = document.querySelector('.edit-avatar-btn');
    if (editAvatarBtn) {
        editAvatarBtn.addEventListener('click', changeAvatar);
    }

    // Подписка на рассылку
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', handleNewsletterSubmit);
    }
}

/**
 * Показ настроек
 */


/**
 * Смена аватара
 */
document.getElementById('upload-btn').addEventListener('click', uploadAvatar);

async function uploadAvatar() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';

    input.onchange = async function() {
        const file = this.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('avatar', file);

        const response = await fetch('/upload-avatar', {
            method: 'POST',
            body: formData
        });

        const result = await response.json();

        if (result.success) {
            // Обновляем изображение на странице
            const placeholder = document.getElementById('avatar-placeholder');
            let img = document.getElementById('user-avatar');

            if (!img) {
                img = document.createElement('img');
                img.id = 'user-avatar';
                img.style.width = '100%';
                img.style.height = '100%';
                img.style.borderRadius = '50%';

                if (placeholder) {
                    placeholder.parentNode.replaceChild(img, placeholder);
                } else {
                    document.querySelector('.profile-avatar').appendChild(img);
                }
            }

            img.src = result.url;
        } else {
            alert(result.message);
        }
    };

    input.click();
}

/**
 * Отмена участия в мероприятии
 * Эта функция вызывается из шаблона через onclick
 */
function cancelEvent(eventId) {
    if (confirm('Вы уверены, что хотите отменить участие в этом мероприятии?')) {
        console.log('Отмена мероприятия с ID:', eventId);

        // Здесь будет AJAX запрос к Flask
        // fetch(`/api/cancel-event/${eventId}`, {
        //     method: 'POST',
        //     headers: {
        //         'Content-Type': 'application/json',
        //     }
        // })
        // .then(response => response.json())
        // .then(data => {
        //     if (data.success) {
        //         // Удаляем карточку мероприятия
        //         const eventCard = document.querySelector(`[data-event-id="${eventId}"]`);
        //         if (eventCard) {
        //             eventCard.remove();
        //             updateEventsCount();
        //         }
        //     }
        // })
        // .catch(error => console.error('Ошибка:', error));

        // Временное решение - удаляем карточку
        alert(`Отмена участия в мероприятии ${eventId} будет обработана бэкендом`);
    }
}

/**
 * Выход из системы
 */
function performLogout() {
    if (confirm('Вы уверены, что хотите выйти из системы?')) {
        console.log('Выход из системы...');

        // В реальном приложении:
        // fetch('/logout', { method: 'POST' })
        //     .then(() => window.location.href = '/');

        // Временное решение
        window.location.href = '/';
    }
}

/**
 * Подписка на рассылку
 */
function handleNewsletterSubmit(e) {
    e.preventDefault();

    const emailInput = e.target.querySelector('.newsletter-input');
    const email = emailInput.value.trim();

    if (!email) {
        alert('Пожалуйста, введите email');
        return;
    }

    if (!isValidEmail(email)) {
        alert('Пожалуйста, введите корректный email');
        return;
    }

    console.log('Подписка на рассылку:', email);

    // Здесь будет AJAX запрос
    // fetch('/api/subscribe-newsletter', {
    //     method: 'POST',
    //     headers: {
    //         'Content-Type': 'application/json',
    //     },
    //     body: JSON.stringify({ email: email })
    // })
    // .then(response => response.json())
    // .then(data => {
    //     if (data.success) {
    //         alert('Вы успешно подписались на рассылку!');
    //         emailInput.value = '';
    //     }
    // });

    // Временное решение
    alert(`Подписка на рассылку для ${email} будет обработана бэкендом`);
    emailInput.value = '';
}

/**
 * Проверка валидности email
 */
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Переключение мобильного меню
 */
function toggleMobileMenu() {
    const navLinks = document.querySelector('.nav-links');
    if (navLinks) {
        const isVisible = navLinks.style.display === 'flex';
        navLinks.style.display = isVisible ? 'none' : 'flex';
    }
}

/**
 * Обновление счетчика мероприятий
 */
function updateEventsCount() {
    const upcomingGrid = document.getElementById('upcoming-events-grid');
    const pastGrid = document.getElementById('past-events-grid');

    if (upcomingGrid) {
        const upcomingCount = upcomingGrid.querySelectorAll('.event-card').length;
        document.getElementById('upcoming-count').textContent = `${upcomingCount} мероприятий`;
    }

    if (pastGrid) {
        const pastCount = pastGrid.querySelectorAll('.event-card').length;
        document.getElementById('past-count').textContent = `${pastCount} мероприятий`;
    }
}

// Экспортируем функции для использования в шаблонах
window.cancelEvent = cancelEvent;
window.updateRatingStars = updateRatingStars;