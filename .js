// Dados dos Produtos
const products = [
    {
        id: 1,
        title: "Camisa Básica Branca",
        category: "masculina",
        price: 59.90,
        oldPrice: 79.90,
        image: "https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9",
        badge: "Novo"
    },
    {
        id: 2,
        title: "Camisa Listrada Azul",
        category: "feminina",
        price: 69.90,
        image: "https://images.unsplash.com/photo-1576566588028-4147f3842f27",
        badge: "Mais Vendido"
    },
    {
        id: 3,
        title: "Camisa Social Preta",
        category: "masculina",
        price: 89.90,
        image: "https://images.unsplash.com/photo-1598033129183-c4f50c736f10",
    },
    {
        id: 4,
        title: "Camisa Estampada Floral",
        category: "feminina",
        price: 75.90,
        oldPrice: 99.90,
        image: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a",
        badge: "Promoção"
    },
    {
        id: 5,
        title: "Camisa Regata Vermelha",
        category: "masculina",
        price: 49.90,
        image: "https://images.unsplash.com/photo-1527719327859-c6ce80353573",
    },
    {
        id: 6,
        title: "Blusa Manga Longa Rosa",
        category: "feminina",
        price: 79.90,
        image: "https://images.unsplash.com/photo-1573878738855-5f1a946d5c8b",
    },
    {
        id: 7,
        title: "Camisa Polo Verde",
        category: "masculina",
        price: 99.90,
        oldPrice: 129.90,
        image: "https://images.unsplash.com/photo-1473966968600-fa801b869a1a",
        badge: "Promoção"
    },
    {
        id: 8,
        title: "Camisa Gola V Azul",
        category: "feminina",
        price: 65.90,
        image: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1",
    }
];

// Carrinho de Compras
let cart = [];

// DOM Elements
const productGrid = document.getElementById('product-grid');
const filterButtons = document.querySelectorAll('.filter-btn');
const cartIcon = document.querySelector('.cart-icon');
const cartModal = document.getElementById('cart-modal');
const closeModal = document.querySelector('.close-modal');
const cartItems = document.getElementById('cart-items');
const cartTotal = document.getElementById('cart-total');
const cartCount = document.querySelector('.cart-count');
const mobileMenu = document.querySelector('.mobile-menu');
const nav = document.querySelector('.nav');
const contactForm = document.getElementById('contact-form');

// Mostrar Produtos
function displayProducts(filter = 'all') {
    productGrid.innerHTML = '';
    
    const filteredProducts = filter === 'all' 
        ? products 
        : products.filter(product => product.category === filter || 
                                    (filter === 'promocao' && product.oldPrice));
    
    filteredProducts.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.dataset.category = product.category;
        
        productCard.innerHTML = `
            <div class="product-image">
                <img src="${product.image}" alt="${product.title}">
                ${product.badge ? `<span class="product-badge">${product.badge}</span>` : ''}
            </div>
            <div class="product-info">
                <h3 class="product-title">${product.title}</h3>
                <span class="product-category">${product.category === 'masculina' ? 'Masculina' : 'Feminina'}</span>
                <div class="product-price">
                    <div>
                        ${product.oldPrice ? `<span class="old-price">R$ ${product.oldPrice.toFixed(2)}</span>` : ''}
                        <span class="price">R$ ${product.price.toFixed(2)}</span>
                    </div>
                    <button class="add-to-cart" data-id="${product.id}">
                        <i class="fas fa-plus"></i>
                    </button>
                </div>
            </div>
        `;
        
        productGrid.appendChild(productCard);
    });
    
    // Adicionar eventos aos botões de adicionar ao carrinho
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', addToCart);
    });
}

// Filtrar Produtos
filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        filterButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        displayProducts(button.dataset.filter);
    });
});

// Adicionar ao Carrinho
function addToCart(e) {
    const productId = parseInt(e.currentTarget.dataset.id);
    const product = products.find(p => p.id === productId);
    
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }
    
    updateCart();
    showCartNotification();
}

// Mostrar Notificação do Carrinho
function showCartNotification() {
    cartIcon.classList.add('animate');
    setTimeout(() => {
        cartIcon.classList.remove('animate');
    }, 500);
}

// Atualizar Carrinho
function updateCart() {
    cartItems.innerHTML = '';
    
    let total = 0;
    
    cart.forEach(item => {
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        
        cartItem.innerHTML = `
            <div class="cart-item-image">
                <img src="${item.image}" alt="${item.title}">
            </div>
            <div class="cart-item-details">
                <h4 class="cart-item-title">${item.title}</h4>
                <p class="cart-item-price">R$ ${item.price.toFixed(2)} x ${item.quantity}</p>
                <span class="cart-item-remove" data-id="${item.id}">Remover</span>
            </div>
        `;
        
        cartItems.appendChild(cartItem);
        total += item.price * item.quantity;
    });
    
    cartTotal.textContent = `R$ ${total.toFixed(2)}`;
    cartCount.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    // Adicionar eventos aos botões de remover
    document.querySelectorAll('.cart-item-remove').forEach(button => {
        button.addEventListener('click', removeFromCart);
    });
}

// Remover do Carrinho
function removeFromCart(e) {
    const productId = parseInt(e.currentTarget.dataset.id);
    cart = cart.filter(item => item.id !== productId);
    updateCart();
}

// Abrir/Fechar Modal do Carrinho
cartIcon.addEventListener('click', () => {
    cartModal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
});

closeModal.addEventListener('click', () => {
    cartModal.style.display = 'none';
    document.body.style.overflow = 'auto';
});

// Fechar modal ao clicar fora
window.addEventListener('click', (e) => {
    if (e.target === cartModal) {
        cartModal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
});

// Menu Mobile
mobileMenu.addEventListener('click', () => {
    nav.classList.toggle('active');
    mobileMenu.innerHTML = nav.classList.contains('active') 
        ? '<i class="fas fa-times"></i>' 
        : '<i class="fas fa-bars"></i>';
});

// Formulário de Contato
contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const message = document.getElementById('message').value;
    
    // Aqui você pode adicionar o código para enviar o formulário
    console.log({ name, email, message });
    
    alert('Mensagem enviada com sucesso! Entraremos em contato em breve.');
    contactForm.reset();
});

// Scroll Header
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        document.querySelector('.header').classList.add('scrolled');
    } else {
        document.querySelector('.header').classList.remove('scrolled');
    }
});

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    displayProducts();
    
    // Adicionar animação ao ícone do carrinho
    const style = document.createElement('style');
    style.textContent = `
        .animate {
            animation: bounce 0.5s;
        }
        @keyframes bounce {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.2); }
        }
    `;
    document.head.appendChild(style);
});
