let allProducts = [];
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Fetch products from the API
fetch('https://dummyjson.com/products')
    .then(res => res.json())
    .then(data => {
        const products = data.products || [];
        allProducts = products;
        console.log(allProducts);
        displayProducts(products);
    })
    .catch(error => console.error('Error fetching data:', error));

// Display products in cards
function displayProducts(products) {
    const productsContainer = document.getElementById('products-cards');
    productsContainer.innerHTML = '';
    products.forEach(product => {
        const card = `
            <div class="card mb-3 p-3 border-animate" style="width: 18rem;">
                <img src="${product.images[0]}" class="card-img-top" alt="${product.title}">
                <div class="card-body text-center">
                    <h5 class="card-title m-1">${product.title}</h5>
                    <p class="card-text m-1">$${product.price}</p>
                    <button class="btn btn-color p-2" onclick="addToCart(${product.id})">Add to Cart</button>
                </div>
            </div>
        `;
        productsContainer.innerHTML += card;
    });
}

// search
function searchProducts() {
    const searchInput = document.getElementById('searchInput');
    const query = searchInput.value.trim().toLowerCase();
    const filteredProducts = allProducts.filter(product => product.title.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query)
    )
    displayProducts(filteredProducts)
}

// Search functionality on button click
document.getElementById("searchButton").addEventListener("click", searchProducts);

// on enter key
document.getElementById("searchInput").addEventListener("keypress", (event) => {
  if (event.key === "Enter") {
    searchProducts(); // Call the search function on Enter key press
    event.preventDefault(); // Prevent form submission (if inside a form)
  }
});

// Function to add product to cart
function addToCart(productId) {
    const product = allProducts.find(product => product.id === productId);
    if (product) {
        const existingItem = cart.find(item => item.id === productId);
        if (existingItem) {
            existingItem.quantity++;
        } else {
            cart.push({ ...product, quantity: 1 });
        }
        updateCart();
        localStorage.setItem('cart', JSON.stringify(cart));
        Swal.fire({
            title: 'Added to Cart!',
            icon: 'success',
            timer: 1000
        });
    }
}

// Function to update cart
function updateCart() {
    const cartContainer = document.getElementById('cart-items');
    cartContainer.innerHTML = '';
    cart.forEach(item => {
        const cartItem = `
            <div class="d-flex align-items-center mb-2">
                <img src="${item.images[0]}" width="50" height="50" alt="${item.title}">
                <div class="ms-3">
                    <h6>${item.title}</h6>
                    <p>Quantity: ${item.quantity}</p>
                    <p>Price: $${item.price * item.quantity}</p>
                    <button class="btn btn-danger btn-sm" onclick="removeFromCart(${item.id})">Remove</button>
                </div>
            </div>
        `;
        cartContainer.innerHTML += cartItem;
    });
    document.getElementById('cart-total').innerText = `Total: $${cart.reduce((acc, item) => acc + item.price * item.quantity, 0)}`;
}

// Function to remove product from cart
function removeFromCart(productId) {
    const index = cart.findIndex(item => item.id === productId);
    if (index !== -1) {
        if (cart[index].quantity > 1) {
            cart[index].quantity--;
        } else {
            cart.splice(index, 1);
        }
    }

    updateCart();
    localStorage.setItem('cart', JSON.stringify(cart));
    Swal.fire({
        title: 'Removed from Cart!',
        icon: 'info',
        timer: 1000
    });
}

// Function to checkout
function checkout() {
    if (cart.length === 0) {
        Swal.fire({
            title: 'Your cart is empty!',
            icon: 'info',
            timer: 1000
        });
    } else {
        localStorage.setItem('cart', JSON.stringify(cart));
        Swal.fire({
            title: 'Checkout successful!',
            icon: 'success',
            timer: 1000
        });
        // You can also send the cart data to your server here
        console.log('Cart data:', cart);
        cart = [];
        updateCart();
    }
}

// Checkout button functionality
document.getElementById("checkoutButton").addEventListener("click", checkout);
// name display
// // In app.js or a script tag at the bottom of your HTML
document.addEventListener("DOMContentLoaded", function () {
    const userName = localStorage.getItem("userName");
    if (userName) {
        document.getElementById("nameDisplay").textContent += `Welcome, ${userName}`;
    } else {
        document.getElementById("nameDisplay").textContent = "Welcome, Guest";
    }
});
