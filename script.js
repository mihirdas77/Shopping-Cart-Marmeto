document.addEventListener("DOMContentLoaded", function () {
    const style = document.createElement('style');
    style.innerHTML = `
        .product-info {
            display: flex;
            flex-direction: column;
            align-items: center;
        }

        .product-image {
            width: 60px;
            height: auto;
        }

        .product-title {
            margin-bottom: 5px;
            font-size: 14px;
            font-weight: bold;
            text-align: center;
            padding: 0 5px;
        }

        .popup {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            padding: 20px;
            background-color: white;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            border-radius: 8px;
            text-align: center;
            z-index: 1000;
            display: none;
        }

        .popup-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.5);
            z-index: 999;
            display: none;
        }
    `;
    document.head.appendChild(style);

    const cartItemsContainer = document.getElementById("cart-items");
    const subtotalElement = document.getElementById("subtotal");
    const totalElement = document.getElementById("total");

    fetch('https://cdn.shopify.com/s/files/1/0883/2188/4479/files/apiCartData.json?v=1728384889')
        .then(response => response.json())
        .then(data => {
            let subtotal = 0;

            data.items.forEach(item => {
                const row = document.createElement('tr');
                row.setAttribute('data-product-id', item.id);

                const productCell = document.createElement('td');
                const productInfoDiv = document.createElement('div');
                productInfoDiv.classList.add('product-info');

                const productImage = document.createElement('img');
                productImage.src = item.image;
                productImage.alt = item.title;
                productImage.classList.add('product-image');

                const productTitle = document.createElement('span');
                productTitle.classList.add('product-title');
                productTitle.textContent = item.title;

                productInfoDiv.appendChild(productImage);
                productInfoDiv.appendChild(productTitle);
                productCell.appendChild(productInfoDiv);

                const priceCell = document.createElement('td');
                priceCell.textContent = `Rs. ${item.price}`;

                const quantityCell = document.createElement('td');
                const quantityInput = document.createElement('input');
                quantityInput.type = 'number';
                quantityInput.value = item.quantity;
                quantityInput.min = 1;
                quantityInput.addEventListener('input', function () {
                    updateSubtotal(item, quantityInput.value);
                });
                quantityCell.appendChild(quantityInput);

                const subtotalCell = document.createElement('td');
                subtotalCell.classList.add('subtotal');
                subtotalCell.textContent = `Rs. ${item.price * item.quantity}`;

                row.appendChild(productCell);
                row.appendChild(priceCell);
                row.appendChild(quantityCell);
                row.appendChild(subtotalCell);

                cartItemsContainer.appendChild(row);

                subtotal += item.price * item.quantity;
            });

            updateCartTotals();
        });

    function updateSubtotal(item, newQuantity) {
        const newSubtotal = item.price * newQuantity;
        const subtotalCell = document.querySelector(`tr[data-product-id="${item.id}"] .subtotal`);
        subtotalCell.textContent = `Rs. ${newSubtotal.toFixed(2)}`;
        updateCartTotals();
    }

    function updateCartTotals() {
        let subtotal = 0;
        document.querySelectorAll('.cart-table .subtotal').forEach(cell => {
            const price = parseFloat(cell.textContent.replace('Rs. ', '').trim());
            subtotal += price;
        });

        subtotalElement.textContent = `Rs. ${subtotal.toFixed(2)}`;
        totalElement.textContent = `Rs. ${subtotal.toFixed(2)}`;
    }

    const popupOverlay = document.createElement('div');
    popupOverlay.classList.add('popup-overlay');
    document.body.appendChild(popupOverlay);

    const popup = document.createElement('div');
    popup.classList.add('popup');
    popup.innerHTML = `
        <p>Product ordered successfully!</p>
        <button id="close-popup">OK</button>
    `;
    document.body.appendChild(popup);

    document.querySelector('.checkout-btn').addEventListener('click', function () {
        popupOverlay.style.display = 'block';
        popup.style.display = 'block';

        cartItemsContainer.innerHTML = '';
        subtotalElement.textContent = 'Rs. 0.00';
        totalElement.textContent = 'Rs. 0.00';
    });

    document.getElementById('close-popup').addEventListener('click', function () {
        popupOverlay.style.display = 'none';
        popup.style.display = 'none';
    });
});
