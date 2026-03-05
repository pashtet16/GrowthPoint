// main-script.js - Фильтрация и поиск с сохранением всей функциональности

// Переменные для управления фильтрацией
let currentFilter = 'all';
let currentSearch = '';

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    console.log('Инициализация...');

    // Восстанавливаем всю предыдущую функциональность
    restoreAllFunctionality();

    // Настраиваем фильтры и поиск
    setupFilterAndSearch();

    // Применяем начальные фильтры
    setTimeout(() => {
        applyFilters();
    }, 100);
});

// Восстанавливаем всю предыдущую функциональность
function restoreAllFunctionality() {
    // Восстанавливаем анимации при прокрутке
    initScrollAnimations();

    // Восстанавливаем кнопку "Показать еще"
    setupLoadMoreButton();

    // Восстанавливаем мобильное меню
    setupMobileMenu();

    // Восстанавливаем прокрутку фильтров
    setupFilterScroll();

    // Восстанавливаем плавную прокрутку
    setupSmoothScroll();

    console.log('Вся функциональность восстановлена');
}

// Настройка фильтров и поиска
function setupFilterAndSearch() {
    // Настройка фильтров по категориям
    setupCategoryFilters();

    // Настройка поиска
    setupSearchFunctionality();
}

// Настройка фильтров по категориям
function setupCategoryFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');

    filterButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();

            // Убираем активный класс со всех кнопок
            filterButtons.forEach(btn => {
                btn.classList.remove('active');
            });

            // Добавляем активный класс текущей кнопке
            this.classList.add('active');

            // Устанавливаем текущий фильтр
            currentFilter = this.dataset.filter;
            console.log(`Фильтр категории: ${currentFilter}`);

            // Применяем фильтрацию
            applyFilters();
        });
    });
}

// Настройка функциональности поиска
function setupSearchFunctionality() {
    const searchInput = document.querySelector('.search-input');
    const searchBtn = document.querySelector('.search-btn');

    if (!searchInput) return;

    // Поиск с debounce при вводе
    let searchTimeout;
    searchInput.addEventListener('input', function() {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            currentSearch = this.value.trim().toLowerCase();
            console.log(`Поиск: "${currentSearch}"`);
            applyFilters();
        }, 300);
    });

    // Поиск при нажатии Enter
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            currentSearch = this.value.trim().toLowerCase();
            applyFilters();
        }
    });

    // Поиск при клике на кнопку
    if (searchBtn) {
        searchBtn.addEventListener('click', function(e) {
            e.preventDefault();
            currentSearch = searchInput.value.trim().toLowerCase();
            applyFilters();
        });
    }
}

// Применение фильтров
function applyFilters() {
    console.log('Применение фильтров...');

    const allForms = document.querySelectorAll('.events-grid form');
    const allCards = document.querySelectorAll('.event-card');
    const eventsGrid = document.querySelector('.events-grid');

    if (!eventsGrid || allCards.length === 0) return;

    let visibleCount = 0;

    // Используем CSS Grid для упорядочивания
    // Сначала сбрасываем все стили
    allForms.forEach(form => {
        form.style.display = '';
        form.style.opacity = '';
        form.style.transform = '';
        form.style.pointerEvents = '';
        form.style.visibility = '';
        form.style.position = '';
        form.style.order = '';
    });

    allCards.forEach(card => {
        card.style.display = '';
        card.style.opacity = '';
        card.style.transform = '';
        card.style.pointerEvents = '';
        card.style.visibility = '';
        card.style.position = '';
        card.style.order = '';
    });

    // Ждем небольшое время для сброса стилей
    setTimeout(() => {
        // Фильтруем карточки
        allForms.forEach((form, index) => {
            const card = form.querySelector('.event-card');
            if (!card) return;

            const category = card.dataset.category || '';
            const title = card.querySelector('.event-title')?.textContent?.toLowerCase() || '';
            const description = card.querySelector('.event-description')?.textContent?.toLowerCase() || '';
            const location = card.querySelector('.event-location span')?.textContent?.toLowerCase() || '';

            // Проверка фильтра категории
            const categoryMatch = currentFilter === 'all' || category === currentFilter;

            // Проверка поискового запроса
            const searchMatch = !currentSearch ||
                title.includes(currentSearch) ||
                description.includes(currentSearch) ||
                location.includes(currentSearch);

            if (categoryMatch && searchMatch) {
                // Показываем форму и карточку
                form.style.display = 'block';
                form.style.order = visibleCount;
                card.style.display = 'block';
                visibleCount++;
            } else {
                // Скрываем форму и карточку
                form.style.display = 'none';
                card.style.display = 'none';
            }
        });

        // Обновляем счетчик
        updateEventCounter(visibleCount);

        // Показываем/скрываем сообщение "Ничего не найдено"
        toggleNoResultsMessage(visibleCount === 0);

        console.log(`Отображается карточек: ${visibleCount}`);

    }, 50);
}

// Обновление счетчика мероприятий
function updateEventCounter(count) {
    let counterElement = document.querySelector('.events-counter');

    if (!counterElement) {
        counterElement = document.createElement('div');
        counterElement.className = 'events-counter';
        counterElement.style.cssText = `
            text-align: center;
            margin: 15px 0 30px;
            color: #666;
            font-weight: 500;
            font-size: 1rem;
            padding: 12px;
            background: rgba(77, 194, 247, 0.08);
            border-radius: 10px;
            border: 1px solid rgba(77, 194, 247, 0.2);
            transition: all 0.3s ease;
        `;

        const filtersSection = document.querySelector('.filters-section');
        if (filtersSection) {
            filtersSection.appendChild(counterElement);
        }
    }

    let counterText = `Найдено мероприятий: ${count}`;

    if (currentFilter !== 'all') {
        const categoryName = getCategoryName(currentFilter);
        counterText += ` в категории "${categoryName}"`;
    }

    if (currentSearch) {
        counterText += ` по запросу "${currentSearch}"`;
    }

    counterElement.textContent = counterText;

    // Анимация обновления счетчика
    counterElement.style.transform = 'scale(1.05)';
    setTimeout(() => {
        counterElement.style.transform = 'scale(1)';
    }, 200);
}

// Показать/скрыть сообщение "Ничего не найдено"
function toggleNoResultsMessage(show) {
    let noResultsElement = document.querySelector('.no-results-message');

    if (show && !noResultsElement) {
        noResultsElement = document.createElement('div');
        noResultsElement.className = 'no-results-message';
        noResultsElement.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            text-align: center;
            padding: 60px 40px;
            background: white;
            border-radius: 16px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.12);
            z-index: 10;
            width: 90%;
            max-width: 500px;
        `;

        noResultsElement.innerHTML = `
            <i class="fas fa-search" style="font-size: 3.5rem; color: #e0e0e0; margin-bottom: 20px; display: block;"></i>
            <h3 style="color: #333; margin-bottom: 15px; font-size: 1.4rem; font-weight: 600;">Ничего не найдено</h3>
            <p style="color: #666; margin-bottom: 25px; max-width: 400px; margin-left: auto; margin-right: auto; line-height: 1.6;">
                Попробуйте изменить поисковый запрос<br>или выбрать другую категорию
            </p>
            <button class="btn-reset-filters" style="
                background: linear-gradient(135deg, #4dc2f7, #3aa8e0);
                color: white;
                border: none;
                padding: 14px 28px;
                border-radius: 12px;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.3s ease;
                font-size: 1rem;
                display: inline-flex;
                align-items: center;
                gap: 10px;
            ">
                <i class="fas fa-redo"></i> Сбросить фильтры
            </button>
        `;

        const eventsGrid = document.querySelector('.events-grid');
        if (eventsGrid) {
            eventsGrid.appendChild(noResultsElement);

            // Обработчик для кнопки сброса
            const resetBtn = noResultsElement.querySelector('.btn-reset-filters');
            if (resetBtn) {
                resetBtn.addEventListener('click', function() {
                    resetFilters();
                });

                resetBtn.addEventListener('mouseenter', function() {
                    this.style.transform = 'translateY(-3px)';
                    this.style.boxShadow = '0 10px 30px rgba(77, 194, 247, 0.3)';
                });

                resetBtn.addEventListener('mouseleave', function() {
                    this.style.transform = '';
                    this.style.boxShadow = '';
                });
            }
        }

    } else if (!show && noResultsElement) {
        noResultsElement.remove();
    }
}

// Сброс всех фильтров
function resetFilters() {
    console.log('Сброс фильтров...');

    currentFilter = 'all';
    currentSearch = '';

    const searchInput = document.querySelector('.search-input');
    if (searchInput) {
        searchInput.value = '';
    }

    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });

    const allFilterBtn = document.querySelector('.filter-btn[data-filter="all"]');
    if (allFilterBtn) {
        allFilterBtn.classList.add('active');
    }

    // Показываем все формы и карточки
    const allForms = document.querySelectorAll('.events-grid form');
    const allCards = document.querySelectorAll('.event-card');

    allForms.forEach(form => {
        form.style.display = 'block';
        form.style.order = '';
    });

    allCards.forEach(card => {
        card.style.display = 'block';
        card.style.order = '';
    });

    updateEventCounter(allCards.length);
    toggleNoResultsMessage(false);
}

// === ВОССТАНАВЛИВАЕМ ВСЕ ФУНКЦИИ ИЗ ПРЕДЫДУЩЕГО JS ===

// Восстанавливаем кнопку "Показать еще"
function setupLoadMoreButton() {
    const loadMoreBtn = document.querySelector('.btn-load-more');

    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', function() {
            // Визуальная обратная связь
            const originalHTML = this.innerHTML;
            this.innerHTML = '<i class="fas fa-spinner fa-spin"></i><span>Загрузка...</span>';
            this.disabled = true;

            // Имитация загрузки
            setTimeout(() => {
                console.log('Загрузка дополнительных мероприятий...');

                // Восстановление кнопки
                this.innerHTML = originalHTML;
                this.disabled = false;

                // Анимация для примера
                this.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    this.style.transform = '';
                }, 300);
            }, 1500);
        });
    }
}

// Восстанавливаем мобильное меню
function setupMobileMenu() {
    const menuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');

    if (menuBtn && navLinks) {
        menuBtn.addEventListener('click', function() {
            const isVisible = navLinks.style.display === 'flex';
            navLinks.style.display = isVisible ? 'none' : 'flex';

            // Анимация иконки
            const icon = this.querySelector('i');
            if (icon) {
                icon.classList.toggle('fa-bars');
                icon.classList.toggle('fa-times');
            }
        });
    }
}

// Восстанавливаем прокрутку фильтров
function setupFilterScroll() {
    const filtersWrapper = document.querySelector('.filters-wrapper');
    const scrollLeftBtn = document.querySelector('.scroll-left');
    const scrollRightBtn = document.querySelector('.scroll-right');

    if (!filtersWrapper || !scrollLeftBtn || !scrollRightBtn) return;

    const scrollStep = 200;

    scrollLeftBtn.addEventListener('click', function() {
        filtersWrapper.scrollBy({ left: -scrollStep, behavior: 'smooth' });
        updateScrollButtonsVisibility();
    });

    scrollRightBtn.addEventListener('click', function() {
        filtersWrapper.scrollBy({ left: scrollStep, behavior: 'smooth' });
        updateScrollButtonsVisibility();
    });

    function updateScrollButtonsVisibility() {
        const { scrollLeft, scrollWidth, clientWidth } = filtersWrapper;

        scrollLeftBtn.style.opacity = scrollLeft > 0 ? '1' : '0.3';
        scrollLeftBtn.style.pointerEvents = scrollLeft > 0 ? 'auto' : 'none';

        const isAtEnd = scrollLeft >= scrollWidth - clientWidth - 10;
        scrollRightBtn.style.opacity = !isAtEnd ? '1' : '0.3';
        scrollRightBtn.style.pointerEvents = !isAtEnd ? 'auto' : 'none';
    }

    updateScrollButtonsVisibility();
    window.addEventListener('resize', updateScrollButtonsVisibility);
}

// Восстанавливаем плавную прокрутку
function setupSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId !== '#') {
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    window.scrollTo({
                        top: targetElement.offsetTop - 80,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
}

// Восстанавливаем анимации при прокрутке
function initScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    document.querySelectorAll('.event-card, .stat, .feature-card').forEach(el => {
        observer.observe(el);
    });
}

// Получение читаемого названия категории
function getCategoryName(category) {
    const categoryMap = {
        'sport': 'Спорт',
        'education': 'Образование',
        'travel': 'Путешествия',
        'culture': 'Культура',
        'business': 'Бизнес',
        'all': 'Все'
    };

    return categoryMap[category] || category;
}

// Добавляем CSS для анимаций и фильтрации
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    .event-card {
        animation: fadeInUp 0.4s ease forwards;
        transition: all 0.3s ease;
    }

    .filter-btn.active {
        background: linear-gradient(135deg, #4dc2f7 0%, #3aa8e0 100%);
        border-color: transparent;
        color: white;
        transform: translateY(-2px);
        box-shadow: 0 8px 25px rgba(77, 194, 247, 0.25);
        transition: all 0.3s ease;
    }

    .btn-reset-filters:hover {
        transform: translateY(-3px);
        box-shadow: 0 10px 30px rgba(77, 194, 247, 0.3);
    }

    /* Адаптивность для мобильного меню */
    @media (max-width: 768px) {
        .nav-links {
            display: none;
            flex-direction: column;
            position: absolute;
            top: 100%;
            left: 0;
            right: 0;
            background: rgba(10, 26, 45, 0.98);
            backdrop-filter: blur(20px);
            padding: 20px;
            gap: 15px;
            border-top: 1px solid rgba(255, 255, 255, 0.1);
            z-index: 1000;
        }

        .nav-links a {
            padding: 12px;
            border-radius: 8px;
            transition: all 0.3s ease;
        }

        .nav-links a:hover {
            background: rgba(255, 255, 255, 0.1);
        }
    }

    /* Для корректной работы фильтрации */
    .events-grid {
        position: relative;
        min-height: 400px;
    }

    .events-grid form {
        display: block;
    }

    .no-results-message {
        animation: fadeInUp 0.5s ease forwards;
    }
`;
document.head.appendChild(style);