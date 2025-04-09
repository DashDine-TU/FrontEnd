document.addEventListener('DOMContentLoaded', () => {
    // DOM елементи
    const restaurantsView = document.getElementById('restaurants-view');
    const menuView = document.getElementById('menu-view');
    const cartView = document.getElementById('cart-view');
    const restaurantsList = document.getElementById('restaurants-list');
    const menuList = document.getElementById('menu-list');
    const cartItems = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');
    const cartCount = document.getElementById('cart-count');
    const backButton = document.getElementById('back-button');
    const backFromCart = document.getElementById('back-from-cart');
    const cartLink = document.getElementById('cart-link');
    const checkoutButton = document.getElementById('checkout-button');
    
    // Текущ избран ресторант
    let currentRestaurant = null;
    
    // Инициализация
    showRestaurants();
    updateCartCount();
    
    // Показване на списък с ресторанти
    function showRestaurants() {
        restaurantsView.style.display = 'block';
        menuView.style.display = 'none';
        cartView.style.display = 'none';
        
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
            
            card.addEventListener('click', () => showRestaurantMenu(restaurant));
            restaurantsList.appendChild(card);
        });
    }
    
    // Показване на менюто на ресторант
    function showRestaurantMenu(restaurant) {
        currentRestaurant = restaurant;
        restaurantsView.style.display = 'none';
        menuView.style.display = 'block';
        cartView.style.display = 'none';
        
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
    
    // Добавяне в количката
    function addToCart(item) {
        const cart = getCart();
        cart.push({
            ...item,
            restaurantId: currentRestaurant.id,
            restaurantName: currentRestaurant.name
        });
        saveCart(cart);
        updateCartCount();
        alert(`${item.name} е добавен в количката!`);
    }
    
    // Показване на количката
    function showCart() {
        restaurantsView.style.display = 'none';
        menuView.style.display = 'none';
        cartView.style.display = 'block';
        
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
    
    // Навигация
    backButton.addEventListener('click', showRestaurants);
    backFromCart.addEventListener('click', () => {
        if (currentRestaurant) {
            showRestaurantMenu(currentRestaurant);
        } else {
            showRestaurants();
        }
    });
    cartLink.addEventListener('click', (e) => {
        e.preventDefault();
        showCart();
    });
    
    // Поръчка
    checkoutButton.addEventListener('click', () => {
        alert('Поръчката е направена успешно!');
        localStorage.removeItem('cart');
        updateCartCount();
        showRestaurants();
    });
});