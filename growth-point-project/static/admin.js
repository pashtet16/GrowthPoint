// admin.js - Админ панель для управления мероприятиями

// Конфигурация
const API_BASE_URL = '/api/admin';
let currentEventId = null;

// Инициализация
document.addEventListener('DOMContentLoaded', function() {
    console.log('Админ панель загружается...');

    // Инициализация интерфейса
    initInterface();

    // Загрузка данных
    loadDashboardData();
    loadCategories();


    // Настройка обработчиков
    setupEventListeners();

    console.log('Админ панель готова!');
});

// Инициализация интерфейса
function initInterface() {
    // Обновление даты
    updateCurrentDate();

    // Навигация
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', function() {
            const section = this.dataset.section;
            switchSection(section);
        });
    });

    // Быстрые действия на главной
    document.querySelectorAll('.quick-action').forEach(action => {
        action.addEventListener('click', function() {
            const actionType = this.dataset.action;
            handleQuickAction(actionType);
        });
    });
}

// Обновление текущей даты
function updateCurrentDate() {
    const now = new Date();
    const options = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    };
    const dateString = now.toLocaleDateString('ru-RU', options);
    document.getElementById('current-date').textContent = dateString;
}

// Переключение секций
function switchSection(section) {
    // Обновление активного пункта меню
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });
    document.querySelector(`.nav-item[data-section="${section}"]`).classList.add('active');

    // Скрыть все секции
    document.querySelectorAll('.content-section').forEach(sec => {
        sec.classList.remove('active');
    });

    // Показать выбранную секцию
    const targetSection = document.getElementById(`${section}-section`);
    if (targetSection) {
        targetSection.classList.add('active');
        updateSectionTitle(section);
    }

    // Дополнительные действия при переключении
    switch(section) {
        case 'add-event':
            resetForm();
            break;
        case 'categories':
            loadCategories();
            break;
    }
}

// Обновление заголовка секции
function updateSectionTitle(section) {
    const titles = {
        'dashboard': 'Админ панель',
        'events': 'Все мероприятия',
        'add-event': 'Добавить мероприятие',
        'categories': 'Управление категориями'
    };

    const subtitles = {
        'dashboard': 'Управление мероприятиями',
        'events': 'Просмотр и редактирование',
        'add-event': 'Создание нового мероприятия',
        'categories': 'Настройка категорий'
    };

    document.getElementById('section-title').textContent = titles[section] || 'Админ панель';
    document.getElementById('section-subtitle').textContent = subtitles[section] || 'Управление платформой';
}

// Быстрые действия
function handleQuickAction(action) {
    switch(action) {
        case 'add-event':
            switchSection('add-event');
            break;
        case 'view-all':
            switchSection('events');
            break;
        case 'manage-categories':
            switchSection('categories');
            break;
        case 'preview':
            window.open('/admin/preview', '_blank');
            break;
    }
}

// Отображение мероприятий
function displayEvents(events) {
    const eventsGrid = document.querySelector('.events-grid');

    if (!events || events.length === 0) {
        eventsGrid.innerHTML = `
            <div class="no-events">
                <i class="fas fa-calendar-times"></i>
                <h3>Мероприятий пока нет</h3>
                <p>Добавьте первое мероприятие</p>
                <button class="btn-primary" id="add-first-event">
                    <i class="fas fa-plus"></i>
                    Добавить мероприятие
                </button>
            </div>
        `;

        document.getElementById('add-first-event')?.addEventListener('click', () => {
            switchSection('add-event');
        });

        return;
    }

    let eventsHTML = '';

    events.forEach(event => {
        const statusClass = `status-${event.status}`;
        const statusText = getStatusText(event.status);
        const categoryText = getCategoryName(event.category);
        const priceText = event.price === 0 ? 'Бесплатно' : `${event.price} ₽`;

        eventsHTML += `
            <div class="event-card-admin" data-id="${event.id}">
                <div class="event-card-header">
                    <img src="${event.image}" alt="${event.title}">
                    <span class="event-category-badge">${categoryText}</span>
                    <span class="event-status-badge ${statusClass}">${statusText}</span>
                </div>
                <div class="event-card-content">
                    <h3 class="event-card-title">${event.title}</h3>
                    <div class="event-card-details">
                        <div class="event-card-detail">
                            <i class="far fa-calendar"></i>
                            <span>${formatDate(event.date)}</span>
                        </div>
                        <div class="event-card-detail">
                            <i class="fas fa-map-marker-alt"></i>
                            <span>${event.location}</span>
                        </div>
                        <div class="event-card-detail">
                            <i class="fas fa-wallet"></i>
                            <span>${priceText}</span>
                        </div>
                        <div class="event-card-detail">
                            <i class="fas fa-users"></i>
                            <span>${event.capacity} мест</span>
                        </div>
                    </div>
                    <div class="event-card-actions">
                        <button class="action-btn btn-edit" onclick="editEvent(${event.id})">
                            <i class="fas fa-edit"></i>
                            Редактировать
                        </button>
                        <button class="action-btn btn-delete" onclick="deleteEvent(${event.id})">
                            <i class="fas fa-trash"></i>
                            Удалить
                        </button>
                    </div>
                </div>
            </div>
        `;
    });

    eventsGrid.innerHTML = eventsHTML;
}

// Загрузка категорий
async function loadCategories() {
    try {
        const categoriesContainer = document.querySelector('.categories-list');

        // Имитация загрузки
        const categories = [
            { id: 1, name: 'Спорт', icon: '⚽', count: 8 },
            { id: 2, name: 'Образование', icon: '📚', count: 6 },
            { id: 3, name: 'Путешествия', icon: '✈️', count: 5 },
            { id: 4, name: 'Культура', icon: '🎭', count: 3 },
            { id: 5, name: 'Бизнес', icon: '💼', count: 2 }
        ];

        let categoriesHTML = '';

        categories.forEach(category => {
            categoriesHTML += `
                <div class="category-card">
                    <div class="category-icon">${category.icon}</div>
                    <div class="category-content">
                        <h4 class="category-name">${category.name}</h4>
                        <p class="category-count">${category.count} мероприятий</p>
                    </div>
                    <div class="category-actions">
                        <button class="action-btn btn-edit" onclick="editCategory(${category.id})">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="action-btn btn-delete" onclick="deleteCategory(${category.id})">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            `;
        });

        categoriesContainer.innerHTML = categoriesHTML;

    } catch (error) {
        console.error('Ошибка загрузки категорий:', error);
    }
}

// Настройка обработчиков событий
function setupEventListeners() {
    // Кнопка добавления мероприятия
    document.getElementById('add-new-event')?.addEventListener('click', () => {
        switchSection('add-event');
        resetForm();
    });

    // Форма мероприятия
    const eventForm = document.getElementById('event-form');
    if (eventForm) {
        eventForm.addEventListener('submit', handleFormSubmit);
    }

    // Предпросмотр изображения
    document.getElementById('preview-image')?.addEventListener('click', previewImage);

    // Предпросмотр мероприятия
    document.getElementById('preview-event')?.addEventListener('click', showEventPreview);

    // Сохранение черновика
    document.getElementById('save-draft')?.addEventListener('click', saveAsDraft);

    // Поиск мероприятий
    const searchInput = document.getElementById('events-search');
    if (searchInput) {
        searchInput.addEventListener('input', debounce(searchEvents, 300));
    }

    // Создание категории
    document.getElementById('create-category')?.addEventListener('click', createCategory);

    // Модальное окно
    document.querySelectorAll('.modal-close, #close-preview').forEach(btn => {
        btn.addEventListener('click', closeModal);
    });

    // Закрытие модального окна при клике вне контента
    document.getElementById('preview-modal')?.addEventListener('click', function(e) {
        if (e.target === this) {
            closeModal();
        }
    });
}

// Обработка отправки формы
function handleFormSubmit(e) {
    e.preventDefault();

    // Сбор данных формы
    const eventData = {
        id: currentEventId,
        title: document.getElementById('event-title').value,
        category: document.getElementById('event-category').value,
        date: document.getElementById('event-date').value,
        location: document.getElementById('event-location').value,
        price: parseInt(document.getElementById('event-price').value) || 0,
        capacity: parseInt(document.getElementById('event-capacity').value) || 1,
        duration: document.getElementById('event-duration').value,
        description: document.getElementById('event-description').value,
        image: document.getElementById('event-image').value,
        status: document.getElementById('event-status').value,
        featured: document.getElementById('event-featured').checked
    };

    // Валидация
    if (!validateEventData(eventData)) {
        return;
    }

    // Отправка данных
    submitEventData(eventData);
}

// Валидация данных мероприятия
function validateEventData(data) {
    const errors = [];

    if (!data.title.trim()) errors.push('Введите название мероприятия');
    if (!data.category) errors.push('Выберите категорию');
    if (!data.date) errors.push('Укажите дату и время');
    if (!data.location.trim()) errors.push('Введите место проведения');
    if (!data.capacity || data.capacity < 1) errors.push('Укажите количество мест');
    if (!data.duration.trim()) errors.push('Укажите длительность');
    if (!data.description.trim()) errors.push('Введите описание');

    if (errors.length > 0) {
        showError(errors.join('<br>'));
        return false;
    }

    return true;
}

// Отправка данных мероприятия
async function submitEventData(data) {
    try {
        // Показать загрузку
        const submitBtn = document.getElementById('publish-event');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Отправка...';
        submitBtn.disabled = true;

        // 1. Получаем HTML форму
        const form = document.getElementById('event-form');

        // 2. Подготавливаем FormData из формы
        const formData = new FormData(form);

        // 3. Добавляем данные, которые могут отсутствовать в форме
        // (если они есть в объекте data, но не в форме)
        if (data.status) {
            formData.set('status', data.status);
        }

        // 4. Отправляем реальный запрос на Flask сервер
        const response = await fetch('/admin', {
            method: 'POST',
            body: formData,
            // Не нужно устанавливать Content-Type для FormData - браузер сделает это сам
        });

        // 5. Проверяем ответ
        if (response.ok) {
            // Форма успешно отправлена
            showSuccess('Мероприятие успешно сохранено!');

            // Сброс формы
            resetForm();

            // Перезагружаем страницу через 1.5 секунды
            setTimeout(() => {
                window.location.reload(); // Перезагрузка страницы для обновления данных
            }, 1500);
        } else {
            // Ошибка сервера
            const errorText = await response.text();
            console.error('Ошибка сервера:', errorText);
            showError('Ошибка сервера при сохранении');

            // Восстановление кнопки
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }

    } catch (error) {
        console.error('Ошибка отправки данных:', error);
        showError('Ошибка соединения с сервером');

        // Восстановление кнопки
        const submitBtn = document.getElementById('publish-event');
        submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Опубликовать мероприятие';
        submitBtn.disabled = false;
    }
}

// Предпросмотр изображения
function previewImage() {
    const imageUrl = document.getElementById('event-image').value;

    if (!imageUrl) {
        showError('Введите URL изображения');
        return;
    }

    const imagePreview = document.getElementById('image-preview');
    imagePreview.innerHTML = `
        <img src="${imageUrl}" alt="Предпросмотр"
             onerror="this.src='https://images.unsplash.com/photo-1551650975-87deedd944c3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'">
    `;
}

// Предпросмотр мероприятия
function showEventPreview() {
    const eventData = {
        title: document.getElementById('event-title').value || 'Название мероприятия',
        category: document.getElementById('event-category').value || 'sport',
        date: document.getElementById('event-date').value || new Date().toISOString(),
        location: document.getElementById('event-location').value || 'Место проведения',
        price: parseInt(document.getElementById('event-price').value) || 0,
        capacity: parseInt(document.getElementById('event-capacity').value) || 50,
        duration: document.getElementById('event-duration').value || '2 часа',
        description: document.getElementById('event-description').value || 'Описание мероприятия',
        image: document.getElementById('event-image').value || 'https://images.unsplash.com/photo-1551650975-87deedd944c3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    };

    const previewHTML = createEventPreviewHTML(eventData);
    document.getElementById('preview-content').innerHTML = previewHTML;
    document.getElementById('preview-modal').classList.add('active');
}

// Создание HTML предпросмотра
function createEventPreviewHTML(event) {
    const categoryText = getCategoryName(event.category);
    const priceText = event.price === 0 ? 'Бесплатно' : `${event.price} ₽`;
    const formattedDate = formatDate(event.date);

    return `
        <div class="preview-event">
            <div class="preview-image">
                <img src="${event.image}" alt="${event.title}">
                <span class="preview-category">${categoryText}</span>
            </div>
            <div class="preview-content">
                <h3>${event.title}</h3>
                <div class="preview-details">
                    <div class="detail">
                        <i class="far fa-calendar"></i>
                        <span>${formattedDate}</span>
                    </div>
                    <div class="detail">
                        <i class="fas fa-map-marker-alt"></i>
                        <span>${event.location}</span>
                    </div>
                    <div class="detail">
                        <i class="fas fa-clock"></i>
                        <span>${event.duration}</span>
                    </div>
                    <div class="detail">
                        <i class="fas fa-wallet"></i>
                        <span>${priceText}</span>
                    </div>
                    <div class="detail">
                        <i class="fas fa-users"></i>
                        <span>${event.capacity} мест</span>
                    </div>
                </div>
                <div class="preview-description">
                    <h4>Описание:</h4>
                    <p>${event.description}</p>
                </div>
            </div>
        </div>
    `;
}

// Сохранение как черновик
function saveAsDraft() {
    const eventData = {
        title: document.getElementById('event-title').value,
        category: document.getElementById('event-category').value,
        date: document.getElementById('event-date').value,
        location: document.getElementById('event-location').value,
        price: parseInt(document.getElementById('event-price').value) || 0,
        capacity: parseInt(document.getElementById('event-capacity').value) || 1,
        duration: document.getElementById('event-duration').value,
        description: document.getElementById('event-description').value,
        image: document.getElementById('event-image').value
    };

    // Установить статус черновика
    document.getElementById('event-status').value = 'draft';

    // Сохранить в localStorage для примера
    localStorage.setItem('eventDraft', JSON.stringify(eventData));

    showSuccess('Черновик сохранен');
}

// Поиск мероприятий
function searchEvents() {
    const searchTerm = document.getElementById('events-search').value.toLowerCase();
    const events = getMockEvents();

    if (!searchTerm) {
        displayEvents(events);
        return;
    }

    const filteredEvents = events.filter(event =>
        event.title.toLowerCase().includes(searchTerm) ||
        event.location.toLowerCase().includes(searchTerm) ||
        event.category.toLowerCase().includes(searchTerm)
    );

    displayEvents(filteredEvents);
}

//// Создание категории
//function createCategory() {
//    const categoryName = prompt('Введите название новой категории:');
//
//    if (categoryName && categoryName.trim()) {
//        // Здесь будет отправка на сервер
//        showSuccess(`Категория "${categoryName}" создана`);
//        loadCategories(); // Перезагрузить список
//    }
//}

// Редактирование мероприятия
window.editEvent = function(eventId) {
    const events = getMockEvents();
    const event = events.find(e => e.id === eventId);

    if (event) {
        switchSection('add-event');

        // Заполнить форму данными
        document.getElementById('event-id').value = event.id;
        document.getElementById('event-title').value = event.title;
        document.getElementById('event-category').value = event.category;
        document.getElementById('event-date').value = event.date;
        document.getElementById('event-location').value = event.location;
        document.getElementById('event-price').value = event.price;
        document.getElementById('event-capacity').value = event.capacity;
        document.getElementById('event-duration').value = event.duration;
        document.getElementById('event-description').value = event.description;
        document.getElementById('event-image').value = event.image;
        document.getElementById('event-status').value = event.status;

        // Обновить заголовок
        document.getElementById('form-title').textContent = 'Редактировать мероприятие';

        // Показать предпросмотр изображения
        if (event.image) {
            document.getElementById('image-preview').innerHTML = `
                <img src="${event.image}" alt="${event.title}">
            `;
        }

        // Прокрутить вверх
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
};

// Удаление мероприятия
window.deleteEvent = function(eventId) {
    if (confirm('Вы уверены, что хотите удалить это мероприятие?')) {
        // Здесь будет отправка запроса на удаление
        console.log(`Удаление мероприятия ${eventId}`);
        showSuccess('Мероприятие удалено');

        // Обновить список
    }
};

// Редактирование категории
window.editCategory = function(categoryId) {
    const newName = prompt('Введите новое название категории:');
    if (newName && newName.trim()) {
        console.log(`Редактирование категории ${categoryId}: ${newName}`);
        showSuccess('Категория обновлена');
        loadCategories();
    }
};

// Удаление категории
window.deleteCategory = function(categoryId) {
    if (confirm('Вы уверены, что хотите удалить эту категорию?')) {
        console.log(`Удаление категории ${categoryId}`);
        showSuccess('Категория удалена');
        loadCategories();
    }
};

// Закрытие модального окна
function closeModal() {
    document.getElementById('preview-modal').classList.remove('active');
}

//// Сброс формы
//function resetForm() {
//    currentEventId = null;
//    //document.getElementById('event-form').reset();
//    document.getElementById('event-id').value = '';
//    document.getElementById('image-preview').innerHTML = `
//        <div class="preview-placeholder">
//            <i class="fas fa-image"></i>
//            <span>Здесь будет предпросмотр изображения</span>
//        </div>
//    `;
//    document.getElementById('form-title').textContent = 'Добавить мероприятие';
//}

// Вспомогательные функции
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

function getCategoryName(category) {
    const categories = {
        'sport': 'Спорт',
        'education': 'Образование',
        'travel': 'Путешествия',
        'culture': 'Культура',
        'business': 'Бизнес'
    };
    return categories[category] || category;
}

function getStatusText(status) {
    const statuses = {
        'active': 'Активно',
        'upcoming': 'Предстоящее',
        'draft': 'Черновик',
        'completed': 'Завершено',
        'canceled': 'Отменено'
    };
    return statuses[status] || status;
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Уведомления
function showSuccess(message) {
    showNotification(message, 'success');
}

function showError(message) {
    showNotification(message, 'error');
}

function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
            <span>${message}</span>
        </div>
    `;

    document.body.appendChild(notification);

    // Анимация появления
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);

    // Автоматическое скрытие
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}



// Добавить стили для уведомлений
const notificationStyles = document.createElement('style');
notificationStyles.textContent = `
    .notification {
        position: fixed;
        top: 20px;
        right: 20px;
        background: white;
        border-radius: 12px;
        padding: 20px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
        z-index: 3000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        max-width: 400px;
        border-left: 4px solid var(--primary);
    }

    .notification.show {
        transform: translateX(0);
    }

    .notification-success {
        border-left-color: var(--success);
    }

    .notification-error {
        border-left-color: var(--accent);
    }

    .notification-content {
        display: flex;
        align-items: center;
        gap: 15px;
    }

    .notification-content i {
        font-size: 1.5rem;
    }

    .notification-success .notification-content i {
        color: var(--success);
    }

    .notification-error .notification-content i {
        color: var(--accent);
    }
`;
document.head.appendChild(notificationStyles);


// Глобальные функции для HTML
window.editEvent = editEvent;
window.deleteEvent = deleteEvent;
window.editCategory = editCategory;
window.deleteCategory = deleteCategory;

document.addEventListener('DOMContentLoaded', function() {
    const dropArea = document.getElementById('image-drop-area');
    const fileInput = document.getElementById('event-image');
    const imagePreview = document.getElementById('image-preview');
    const previewPlaceholder = imagePreview.querySelector('.preview-placeholder');
    const imageDataInput = document.getElementById('image-data');

    // URL для загрузки в Flask
    const UPLOAD_URL = '/upload-image'; // Flask endpoint

    // Обработчик клика по области загрузки
    dropArea.addEventListener('click', () => fileInput.click());

    // Обработчик изменения файла через input
    fileInput.addEventListener('change', handleFileSelect);

    // Обработчики drag-and-drop
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        dropArea.addEventListener(eventName, preventDefaults, false);
    });

    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    ['dragenter', 'dragover'].forEach(eventName => {
        dropArea.addEventListener(eventName, highlight, false);
    });

    ['dragleave', 'drop'].forEach(eventName => {
        dropArea.addEventListener(eventName, unhighlight, false);
    });

    function highlight() {
        dropArea.classList.add('dragover');
    }

    function unhighlight() {
        dropArea.classList.remove('dragover');
    }

    // Обработчик drop
    dropArea.addEventListener('drop', handleDrop, false);

    function handleDrop(e) {
        const dt = e.dataTransfer;
        const files = dt.files;
        if (files.length) {
            handleFile(files[0]);
        }
    }

    function handleFileSelect(e) {
        const file = e.target.files[0];
        if (file) {
            handleFile(file);
        }
    }

    function handleFile(file) {
        // Проверка типа файла
        if (!file.type.match('image.*')) {
            alert('Пожалуйста, выберите изображение (JPG, PNG, GIF или WebP)');
            return;
        }

        // Проверка размера файла (5MB)
        if (file.size > 5 * 1024 * 1024) {
            alert('Файл слишком большой. Максимальный размер: 5MB');
            return;
        }

        // Показываем предпросмотр локально
        showLocalPreview(file);

        // Отправляем файл на Flask сервер
        uploadToFlask(file);
    }

    function showLocalPreview(file) {
        const reader = new FileReader();

        reader.onload = function(e) {
            previewPlaceholder.style.display = 'none';

            let img = imagePreview.querySelector('img');
            if (!img) {
                img = document.createElement('img');
                img.id = 'preview-img';
                const container = document.createElement('div');
                container.className = 'preview-container';
                container.appendChild(img);
                imagePreview.appendChild(container);
            }

            img.src = e.target.result;
            img.alt = 'Предпросмотр загруженного изображения';
            img.style.maxWidth = '100%';
            img.style.maxHeight = '300px';
            img.style.borderRadius = '6px';

            addControlButtons();
        };

        reader.readAsDataURL(file);
    }

    function addControlButtons() {
        if (!document.getElementById('change-image')) {
            const controlsDiv = document.createElement('div');
            controlsDiv.className = 'image-controls';
            controlsDiv.style.marginTop = '15px';
            controlsDiv.style.display = 'flex';
            controlsDiv.style.gap = '10px';
            controlsDiv.style.justifyContent = 'center';

            const changeBtn = document.createElement('button');
            changeBtn.type = 'button';
            changeBtn.className = 'btn-change-image';
            changeBtn.id = 'change-image';
            changeBtn.innerHTML = '<i class="fas fa-sync-alt"></i> Изменить';

            const removeBtn = document.createElement('button');
            removeBtn.type = 'button';
            removeBtn.className = 'btn-remove-image';
            removeBtn.id = 'remove-image';
            removeBtn.innerHTML = '<i class="fas fa-trash"></i> Удалить';

            controlsDiv.appendChild(changeBtn);
            controlsDiv.appendChild(removeBtn);

            imagePreview.parentNode.insertBefore(controlsDiv, imagePreview.nextSibling);

            changeBtn.addEventListener('click', () => fileInput.click());
            removeBtn.addEventListener('click', removeImage);
        }
    }

    async function uploadToFlask(file) {
        const formData = new FormData();
        formData.append('image', file);

        showUploadIndicator();

        try {
            const response = await fetch(UPLOAD_URL, {
                method: 'POST',
                body: formData,
                // Не нужно указывать Content-Type для FormData - браузер сам установит
            });

            const data = await response.json();

            if (response.ok && data.success) {
                // Сохраняем имя файла или полный URL в скрытое поле
                imageDataInput.value = data.filename || data.url || data.file_path;
                console.log('Изображение сохранено:', data);
            } else {
                alert('Ошибка при загрузке: ' + (data.message || 'Неизвестная ошибка'));
            }
        } catch (error) {
            console.error('Ошибка:', error);
            alert('Ошибка при загрузке изображения');
        } finally {
            hideUploadIndicator();
        }
    }

    function showUploadIndicator() {
        let indicator = document.getElementById('upload-indicator');
        if (!indicator) {
            indicator = document.createElement('div');
            indicator.id = 'upload-indicator';
            indicator.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Загрузка...';
            indicator.style.textAlign = 'center';
            indicator.style.color = '#666';
            indicator.style.marginTop = '10px';
            imagePreview.parentNode.insertBefore(indicator, imagePreview.nextSibling);
        }
        indicator.style.display = 'block';
    }

    function hideUploadIndicator() {
        const indicator = document.getElementById('upload-indicator');
        if (indicator) {
            indicator.style.display = 'none';
        }
    }

    function removeImage() {
        fileInput.value = '';
        imageDataInput.value = '';

        const img = imagePreview.querySelector('img');
        if (img) {
            img.remove();
        }

        previewPlaceholder.style.display = 'block';

        const controls = document.querySelector('.image-controls');
        if (controls) {
            controls.remove();
        }

        // Опционально: отправить запрос на удаление с сервера
        // await fetch('/delete-image', { method: 'POST', body: JSON.stringify({filename: oldFilename}) });
    }

    // Стили для drag-and-drop
    const style = document.createElement('style');
    style.textContent = `
        .image-input-group {
            border: 2px dashed #ccc;
            border-radius: 8px;
            padding: 40px 20px;
            text-align: center;
            cursor: pointer;
            transition: all 0.3s ease;
            background-color: #f9f9f9;
            margin-bottom: 20px;
            position: relative;
        }

        .image-input-group:hover {
            border-color: #007bff;
            background-color: #f0f8ff;
        }

        .image-input-group.dragover {
            border-color: #28a745;
            background-color: #f0fff4;
            transform: scale(1.02);
        }
    `;
    document.head.appendChild(style);
});