document.addEventListener('DOMContentLoaded', () => {
    const productList = document.getElementById('product-list');
    const addToCartBtn = document.getElementById('add-to-cart-btn');
    const cartItems = document.getElementById('cart-items');
    const invoiceItems = document.getElementById('invoice-items');
    const totalPriceElement = document.getElementById('total-price');
    const purchaseBtn = document.getElementById('purchase-btn');
    const newInvoiceBtn = document.getElementById('new-invoice-btn');
    const invoiceHistory = document.getElementById('invoice-history');

    const productImage = document.getElementById('product-image');

    let cart = [];
    let invoice = [];
    let totalFactura = 0;
    let invoiceCount = 0;

    // Mostrar imagen al seleccionar un producto
    productList.addEventListener('change', () => {
        const selectedOption = productList.options[productList.selectedIndex];
        const productImageSrc = selectedOption.getAttribute('data-img');
        
        if (productImageSrc) {
            productImage.src = `IMG/${productImageSrc}`; // Ruta de la imagen
            productImage.style.display = 'block';
        } else {
            productImage.style.display = 'none';
        }
    });

    // Añadir productos al carrito
    addToCartBtn.addEventListener('click', () => {
        const selectedOption = productList.options[productList.selectedIndex];
        const productName = selectedOption.value;
        const productPrice = parseFloat(selectedOption.getAttribute('data-price'));

        if (!productName) {
            swal("Atención", "Por favor, selecciona un producto.", "warning");
            return;
        }

        const product = {
            name: productName,
            price: productPrice,
            quantity: 1
        };

        // Añadir producto al carrito como un nuevo ítem
        cart.push(product);
        renderCart();
        swal("Éxito", `${productName} ha sido añadido al carrito.`, "success");
    });

    // Renderizar el carrito
    function renderCart() {
        cartItems.innerHTML = '';
        cart.forEach((product, index) => {
            const li = document.createElement('li');
            li.innerHTML = `
                ${product.name} - $${product.price} 
                <input type="number" class="quantity" data-index="${index}" value="${product.quantity}" min="1" style="width: 50px;">
                <button class="remove-btn" data-index="${index}">Eliminar</button>
            `;
            cartItems.appendChild(li);
        });

        // Eliminar producto del carrito
        document.querySelectorAll('.remove-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                const index = e.target.dataset.index;
                cart.splice(index, 1);
                renderCart();
                swal("Éxito", "Producto eliminado del carrito.", "success");
            });
        });

        // Actualizar la cantidad del producto
        document.querySelectorAll('.quantity').forEach(input => {
            input.addEventListener('change', (e) => {
                const index = e.target.dataset.index;
                const newQuantity = parseInt(e.target.value);
                if (newQuantity < 1) {
                    swal("Atención", "La cantidad debe ser al menos 1.", "warning");
                    e.target.value = 1;
                    return;
                }
                cart[index].quantity = newQuantity;
                renderCart();
            });
        });
    }

    // Comprar productos
    purchaseBtn.addEventListener('click', () => {
        if (cart.length === 0) {
            swal("Atención", "El carrito está vacío.", "warning");
            return;
        }

        // Añadir productos comprados a la factura actual
        cart.forEach(product => {
            invoice.push({ ...product });
            totalFactura += product.price * product.quantity;
        });

        renderInvoice();
        cart = []; // Limpiar el carrito después de la compra
        renderCart(); // Actualizar la vista del carrito
    });

    // Renderizar la factura
    function renderInvoice() {
        invoiceItems.innerHTML = '';
        invoice.forEach(product => {
            const li = document.createElement('li');
            li.textContent = `${product.name} - $${product.price} x ${product.quantity}`;
            invoiceItems.appendChild(li);
        });
        totalPriceElement.textContent = totalFactura.toFixed(2);
    }

    // Guardar factura en el historial y crear una nueva factura
    newInvoiceBtn.addEventListener('click', () => {
        if (invoice.length === 0) {
            swal("Atención", "No hay factura actual para guardar.", "warning");
            return;
        }

        const invoiceFragment = document.createDocumentFragment();
        const invoiceHeader = document.createElement('h3');
        invoiceHeader.textContent = `Factura #${++invoiceCount}`;
        invoiceFragment.appendChild(invoiceHeader);

        const invoiceList = document.createElement('ul');
        invoice.forEach(product => {
            const li = document.createElement('li');
            li.textContent = `${product.name} - $${product.price} x ${product.quantity}`;
            invoiceList.appendChild(li);
        });

        const totalLine = document.createElement('p');
        totalLine.textContent = `Total: $${totalFactura.toFixed(2)}`;
        invoiceFragment.appendChild(invoiceList);
        invoiceFragment.appendChild(totalLine);

        invoiceHistory.appendChild(invoiceFragment);

        // Reiniciar factura actual
        invoiceItems.innerHTML = '';
        totalPriceElement.textContent = '0';
        invoice = [];
        totalFactura = 0;

        swal("Éxito", "Factura guardada en el historial.", "success");
    });
});
