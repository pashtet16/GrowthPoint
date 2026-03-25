// eventCard.js - Функционал для страницы мероприятия

document.addEventListener('DOMContentLoaded', function() {
    // Инициализация всех функций
    initCopyButton();
    initMobileMenu();
    initShareButtons();
});

/**
 * Инициализация кнопки копирования ссылки
 */
function initCopyButton() {
    const copyButton = document.querySelector('.share-btn.link');
    if (copyButton) {
        // Удаляем старый обработчик, если есть
        copyButton.removeEventListener('click', copyEventLink);
        copyButton.addEventListener('click', copyEventLink);
    }
}

/**
 * Функция копирования ссылки на мероприятие
 */
function copyEventLink() {
    const eventUrl = window.location.href;

    // Проверяем поддержку Clipboard API
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(eventUrl).then(() => {
            showNotification('Ссылка на мероприятие скопирована!', 'success');
        }).catch(() => {
            fallbackCopy(eventUrl);
        });
    } else {
        fallbackCopy(eventUrl);
    }
}

/**
 * Альтернативный метод копирования для старых браузеров
 */
function fallbackCopy(text) {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();

    try {
        document.execCommand('copy');
        showNotification('Ссылка на мероприятие скопирована!', 'success');
    } catch (err) {
        showNotification('Не удалось скопировать ссылку', 'error');
    }

    document.body.removeChild(textarea);
}

/**
 * Показ уведомления
 */
function showNotification(message, type) {
    // Создаем элемент уведомления
    const notification = document.createElement('div');
    notification.className = `copy-notification ${type}`;
    notification.innerHTML = `
        <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
        <span>${message}</span>
    `;

    // Добавляем стили для уведомления
    notification.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: ${type === 'success' ? '#06d6a0' : '#ff6b6b'};
        color: white;
        padding: 12px 24px;
        border-radius: 8px;
        font-weight: 500;
        z-index: 9999;
        animation: slideIn 0.3s ease;
        box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        display: flex;
        align-items: center;
        gap: 10px;
        font-family: 'Poppins', sans-serif;
    `;

    document.body.appendChild(notification);

    // Удаляем уведомление через 3 секунды
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}


// Добавляем CSS анимации для уведомлений
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }

    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }

    .copy-notification {
        animation: slideIn 0.3s ease !important;
    }
`;
document.head.appendChild(style);