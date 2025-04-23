document.addEventListener('DOMContentLoaded', () => {
    // DOM елементи
    const homeView = document.getElementById('home-view');
    const menuView = document.getElementById('menu-view');
    const cartView = document.getElementById('cart-view');
    const aboutView = document.getElementById('about-view');
    const loginView = document.getElementById('login-view');
    const registerView = document.getElementById('register-view');
    const restaurantsList = document.getElementById('restaurants-list');
    const menuList = document.getElementById('menu-list');
    const cartItems = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');
    const cartCount = document.getElementById('cart-count');
    const backButton = document.getElementById('back-button');
    const backFromCart = document.getElementById('back-from-cart');
    const cartLink = document.getElementById('cart-link');
    const homeLink = document.getElementById('home-link');
    const aboutLink = document.getElementById('about-link');
    const authLink = document.getElementById('auth-link');
    const loginLink = document.getElementById('login-link');
    const exploreButton = document.getElementById('explore-button');
    const checkoutButton = document.getElementById('checkout-button');
    const loginButton = document.getElementById('login-button');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const registerLink = document.getElementById('register-link');
    const registerButton = document.getElementById('register-button');
    const registerUsernameInput = document.getElementById('register-username');
    const registerEmailInput = document.getElementById('register-email');
    const registerPasswordInput = document.getElementById('register-password');
    const loginFromRegisterLink = document.getElementById('login-from-register-link');
    const modal = document.getElementById('modal');
    const modalMessage = document.getElementById('modal-message');
    const modalClose = document.getElementById('modal-close');
    const exploreCta = document.getElementById('explore-cta');
    const backToTopButton = document.getElementById('back-to-top');
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    const addressModal = document.getElementById('address-modal');
    const addressModalClose = document.getElementById('address-modal-close');
    const streetInput = document.getElementById('street');
    const cityInput = document.getElementById('city');
    const postalCodeInput = document.getElementById('postal-code');
    const addressSubmit = document.getElementById('address-submit');
    
    // Текущ избран ресторант
    let currentRestaurant = null;
    
    // Инициализация
    updateAuthLink();
    showHome();
    updateCartCount();
    setupAnimations();
    
    // Функция за показване на модал
    function showModal(message) {
        modalMessage.textContent = message;
        modal.style.display = 'flex';
        modal.classList.add('show');
        setTimeout(() => {
            hideModal();
        }, 3000);
    }
    
    // Функция за скриване на модал
    function hideModal() {
        modal.classList.remove('show');
        setTimeout(() => {
            modal.style.display = 'none';
        }, 300);
    }
    
    // Функция за показване на адресен модал
    function showAddressModal() {
        addressModal.style.display = 'flex';
        addressModal.classList.add('show');
        streetInput.value = '';
        cityInput.value = '';
        postalCodeInput.value = '';
    }
    
    // Функция за скриване на адресен модал
    function hideAddressModal() {
        addressModal.classList.remove('show');
        setTimeout(() => {
            addressModal.style.display = 'none';
        }, 300);
    }
    
    // Затваряне на модали
    modalClose.addEventListener('click', hideModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            hideModal();
        }
    });
    
    addressModalClose.addEventListener('click', hideAddressModal);
    addressModal.addEventListener('click', (e) => {
        if (e.target === addressModal) {
            hideAddressModal();
        }
    });
    
    // Проверка за логнат потребител
    function isLoggedIn() {
        return !!localStorage.getItem('user');
    }
    
    // Актуализиране на връзката за вход/изход
    function updateAuthLink() {
        if (isLoggedIn()) {
            authLink.innerHTML = '<a href="#" id="logout-link">Изход</a>';
            const logoutLink = document.getElementById('logout-link');
            logoutLink.addEventListener('click', (e) => {
                e.preventDefault();
                localStorage.removeItem('user');
                updateAuthLink();
                showHome();
                showModal('Излязохте успешно!');
            });
        } else {
            authLink.innerHTML = '<a href="#" id="login-link">Вход</a>';
            const loginLink = document.getElementById('login-link');
            loginLink.addEventListener('click', (e) => {
                e.preventDefault();
                showLogin();
            });
        }
    }
    
    // Показване на началната страница
    function showHome() {
        homeView.style.display = 'block';
        menuView.style.display = 'none';
        cartView.style.display = 'none';
        aboutView.style.display = 'none';
        loginView.style.display = 'none';
        registerView.style.display = 'none';
        
        restaurantsList.innerHTML = '';
        
        restaurants.forEach(restaurant => {
            const card = document.createElement('div');
            card.className = 'restaurant-card';
            card.innerHTML = `
                <img src="${restaurant.logo}" alt="${restaurant.name}" class="restaurant-logo">
                <div class="restaurant-info">
                    <h3>${restaurant.name}</h3>
                    <div class="restaurant-categories">${restaurant.categories.join(', ')}</div>
                </div>
            `;
            
            card.addEventListener('click', () => {
                showRestaurantMenu(restaurant);
            });
            restaurantsList.appendChild(card);
        });
    }
    
    // Показване на менюто на ресторант
    function showRestaurantMenu(restaurant) {
        currentRestaurant = restaurant;
        homeView.style.display = 'none';
        menuView.style.display = 'block';
        cartView.style.display = 'none';
        aboutView.style.display = 'none';
        loginView.style.display = 'none';
        registerView.style.display = 'none';
        
        document.getElementById('restaurant-name').textContent = restaurant.name;
        menuList.innerHTML = '';
        
        restaurant.menu.forEach(item => {
            const product = document.createElement('div');
            product.className = 'product-card';
            product.innerHTML = `
                <img src="${item.image}" alt="${item.name}">
                <h3>${item.name}</h3>
                <div class="product-price">${item.price.toFixed(2)} лв</div>
                <button class="add-to-cart" data-id="${item.id}">Добави в количката</button>
            `;
            
            product.querySelector('.add-to-cart').addEventListener('click', () => addToCart(item));
            menuList.appendChild(product);
        });
    }
    
    // Показване на количката
    function showCart() {
        homeView.style.display = 'none';
        menuView.style.display = 'none';
        cartView.style.display = 'block';
        aboutView.style.display = 'none';
        loginView.style.display = 'none';
        registerView.style.display = 'none';
        
        const cart = getCart();
        cartItems.innerHTML = '';
        
        if (cart.length === 0) {
            cartItems.innerHTML = '<p>Количката ви е празна</p>';
            cartTotal.textContent = 'Общо: 0.00 лв';
            return;
        }
        
        let total = 0;
        cart.forEach((item, index) => {
            total += item.price;
            
            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';
            cartItem.innerHTML = `
                <div>
                    <strong>${item.name}</strong><br>
                    <small>${item.restaurantName}</small>
                </div>
                <div>
                    ${item.price.toFixed(2)} лв
                    <button class="remove-item" data-index="${index}">✕</button>
                </div>
            `;
            
            cartItem.querySelector('.remove-item').addEventListener('click', (e) => {
                e.stopPropagation();
                removeFromCart(index);
            });
            
            cartItems.appendChild(cartItem);
        });
        
        cartTotal.textContent = `Общо: ${total.toFixed(2)} лв`;
    }
    
    // Показване на страницата "За нас"
    function showAbout() {
        homeView.style.display = 'none';
        menuView.style.display = 'none';
        cartView.style.display = 'none';
        aboutView.style.display = 'block';
        loginView.style.display = 'none';
        registerView.style.display = 'none';
    }
    
    // Показване на страницата за вход
    function showLogin() {
        homeView.style.display = 'none';
        menuView.style.display = 'none';
        cartView.style.display = 'none';
        aboutView.style.display = 'none';
        loginView.style.display = 'block';
        registerView.style.display = 'none';
    }
    
    // Показване на страницата за регистрация
    function showRegister() {
        homeView.style.display = 'none';
        menuView.style.display = 'none';
        cartView.style.display = 'none';
        aboutView.style.display = 'none';
        loginView.style.display = 'none';
        registerView.style.display = 'block';
    }
    
    // Добавяне в количката
    function addToCart(item) {
        if (!isLoggedIn()) {
            showLogin();
            showModal('Моля, влезте в акаунта си, за да добавите в количката.');
            return;
        }
        
        const cart = getCart();
        cart.push({
            ...item,
            restaurantId: currentRestaurant.id,
            restaurantName: currentRestaurant.name
        });
        saveCart(cart);
        updateCartCount();
        showModal(`${item.name} е добавен в количката!`);
    }
    
    // Премахване от количката
    function removeFromCart(index) {
        const cart = getCart();
        cart.splice(index, 1);
        saveCart(cart);
        updateCartCount();
        showCart();
    }
    
    // Работа с localStorage
    function getCart() {
        return JSON.parse(localStorage.getItem('cart')) || [];
    }
    
    function saveCart(cart) {
        localStorage.setItem('cart', JSON.stringify(cart));
    }
    
    function updateCartCount() {
        const cart = getCart();
        cartCount.textContent = cart.length;
    }
    
    // Обработка на логин
    loginButton.addEventListener('click', () => {
        const username = usernameInput.value.trim();
        const password = passwordInput.value.trim();
        
        if (username && password) {
            const users = JSON.parse(localStorage.getItem('users')) || [];
            const userExists = users.some(user => user.username === username && user.password === password);
            
            if (userExists) {
                localStorage.setItem('user', JSON.stringify({ username }));
                updateAuthLink();
                showModal('Влязохте успешно!');
                usernameInput.value = '';
                passwordInput.value = '';
                
                if (currentRestaurant) {
                    showRestaurantMenu(currentRestaurant);
                } else {
                    showHome();
                }
            } else {
                showModal('Грешно потребителско име или парола.');
            }
        } else {
            showModal('Моля, попълнете всички полета.');
        }
    });
    
    // Обработка на регистрация
    registerButton.addEventListener('click', () => {
        const username = registerUsernameInput.value.trim();
        const email = registerEmailInput.value.trim();
        const password = registerPasswordInput.value.trim();
        
        if (username && email && password) {
            const emailRegex = /^[a-zA-Z0-9._%+-]+@(abv\.bg|gmail\.com)$/;
            if (!emailRegex.test(email)) {
                showModal('Имейлът трябва да е от abv.bg или gmail.com.');
                return;
            }
            
            const users = JSON.parse(localStorage.getItem('users')) || [];
            const usernameExists = users.some(user => user.username === username);
            const emailExists = users.some(user => user.email === email);
            
            if (usernameExists) {
                showModal('Потребителското име вече е заето.');
            } else if (emailExists) {
                showModal('Имейлът вече е регистриран.');
            } else {
                users.push({ username, email, password });
                localStorage.setItem('users', JSON.stringify(users));
                localStorage.setItem('user', JSON.stringify({ username }));
                updateAuthLink();
                showModal('Регистрирахте се успешно!');
                registerUsernameInput.value = '';
                registerEmailInput.value = '';
                registerPasswordInput.value = '';
                
                if (currentRestaurant) {
                    showRestaurantMenu(currentRestaurant);
                } else {
                    showHome();
                }
            }
        } else {
            showModal('Моля, попълнете всички полета.');
        }
    });
    
    // Навигация между логин и регистрация
    registerLink.addEventListener('click', (e) => {
        e.preventDefault();
        showRegister();
    });
    
    loginFromRegisterLink.addEventListener('click', (e) => {
        e.preventDefault();
        showLogin();
    });
    
    // Навигация
    backButton.addEventListener('click', showHome);
    backFromCart.addEventListener('click', () => {
        if (currentRestaurant) {
            showRestaurantMenu(currentRestaurant);
        } else {
            showHome();
        }
    });
    cartLink.addEventListener('click', (e) => {
        e.preventDefault();
        showCart();
    });
    homeLink.addEventListener('click', (e) => {
        e.preventDefault();
        showHome();
    });
    aboutLink.addEventListener('click', (e) => {
        e.preventDefault();
        showAbout();
    });
    exploreButton.addEventListener('click', () => {
        restaurantsList.scrollIntoView({ behavior: 'smooth' });
    });
    exploreCta.addEventListener('click', () => {
        showHome();
        restaurantsList.scrollIntoView({ behavior: 'smooth' });
    });
    
    // Поръчка
    checkoutButton.addEventListener('click', () => {
        const cart = getCart();
        if (cart.length === 0) {
            showModal('Количката ви е празна. Добавете продукти, за да направите поръчка.');
            return;
        }
        showAddressModal();
    });
    
    addressSubmit.addEventListener('click', () => {
        const street = streetInput.value.trim();
        const city = cityInput.value.trim();
        const postalCode = postalCodeInput.value.trim();
        
        if (street && city && postalCode) {
            hideAddressModal();
            showModal(`Поръчката е направена успешно за адрес: ${street}, ${city}, ${postalCode}!`);
            localStorage.removeItem('cart');
            updateCartCount();
            showHome();
        } else {
            showModal('Моля, попълнете всички полета за адреса.');
        }
    });
    
    // Back to Top функционалност
    window.addEventListener('scroll', () => {
        if (window.scrollY > 200) {
            backToTopButton.classList.add('show');
        } else {
            backToTopButton.classList.remove('show');
        }
    });
    
    backToTopButton.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    // Hamburger Menu
    hamburger.addEventListener('click', () => {
        navMenu.classList.toggle('active');
    });
    
    // Setup Animations
    function setupAnimations() {
        const elements = document.querySelectorAll('.restaurant-card, .product-card, .team-member, .value-item, .login-form, .register-form');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.animationPlayState = 'running';
                }
            });
        }, { threshold: 0.1 });
        
        elements.forEach(el => {
            observer.observe(el);
        });
    }
});
