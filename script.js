document.addEventListener("DOMContentLoaded", function() {
    const scannerContainer = document.getElementById("scanner-container");
    const resultElement = document.getElementById("result");
    const overlay = document.getElementById("overlay");
    const listElement = document.getElementById("list");
    const searchBar = document.getElementById("search-bar");
    const productSearchBar = document.getElementById("product-search-bar");
    const filterDropdown = document.getElementById("filter-dropdown");
    const historyElement = document.getElementById("history");
    const addToListButton = document.getElementById("add-to-list");
    const productNameInput = document.getElementById("product-name");

    let lastScannedBarcode = "";
    let lastScanTime = 0;
    const cooldownPeriod = 3000; // 3 seconds cooldown

    if (typeof Html5Qrcode === "undefined") {
        console.error("Html5Qrcode library not loaded.");
        resultElement.innerText = "Error: Html5Qrcode library not loaded.";
        return;
    }

    const html5QrCode = new Html5Qrcode("scanner-container");

    function onScanSuccess(decodedText, decodedResult) {
        const now = Date.now();
        if (decodedText === lastScannedBarcode && (now - lastScanTime < cooldownPeriod)) {
            return; // Ignore this scan due to cooldown
        }
        lastScannedBarcode = decodedText;
        lastScanTime = now;

        let processedBarcode = decodedText;
        if (decodedText.length === 22) {
            processedBarcode = decodedText.substring(2, decodedText.length - 7);
        }

        resultElement.innerText = "Barcode found: " + processedBarcode;
        fetchProductDetails(processedBarcode);

        overlay.style.display = 'none'; // Hide the overlay
    }

    function onScanError(errorMessage) {
        console.error("Scanning error:", errorMessage);
    }

    function fetchProductDetails(barcode) {
        const apiUrl = `https://world.openfoodfacts.org/api/v0/product/${barcode}.json`;

        fetch(apiUrl)
            .then(response => response.json())
            .then(data => {
                if (data.status === 1) {
                    const product = data.product;
                    const productName = product.product_name || "Unknown Product";
                    const imageUrl = product.image_url || "https://via.placeholder.com/150";
                    addProductToList(barcode, productName, imageUrl);
                    saveToHistory(barcode, productName, imageUrl);
                } else {
                    resultElement.innerText = "Product not found in ADissapointmentCL's Database!";
                }
            })
            .catch(error => {
                console.error("Error fetching product details:", error);
                resultElement.innerText = "Error fetching product details.";
            });
    }

    function addProductToList(barcode, productName, imageUrl) {
        const listItem = document.createElement("li");
        const image = document.createElement("img");
        image.src = imageUrl;
        image.alt = productName;
        image.title = productName;
        
        const text = document.createElement("span");
        text.textContent = `Barcode: ${barcode}, Product: ${productName}`;
        
        listItem.appendChild(image);
        listItem.appendChild(text);
        listElement.appendChild(listItem);
    }

    function saveToHistory(barcode, productName, imageUrl) {
        const history = JSON.parse(localStorage.getItem('history')) || [];
        history.push({ barcode, productName, imageUrl });
        localStorage.setItem('history', JSON.stringify(history));
        displayHistory();
    }

    function displayHistory() {
        historyElement.innerHTML = '';
        const history = JSON.parse(localStorage.getItem('history')) || [];
        history.forEach(item => {
            const historyItem = document.createElement("li");
            const image = document.createElement("img");
            image.src = item.imageUrl;
            image.alt = item.productName;
            image.title = item.productName;
            
            const text = document.createElement("span");
            text.textContent = `Barcode: ${item.barcode}, Product: ${item.productName}`;
            
            historyItem.appendChild(image);
            historyItem.appendChild(text);
            historyElement.appendChild(historyItem);
        });
    }

    function searchProducts() {
        const query = searchBar.value.toLowerCase();
        const items = document.querySelectorAll('#list li');
        items.forEach(item => {
            const text = item.textContent.toLowerCase();
            item.style.display = text.includes(query) ? '' : 'none';
        });
    }

    function searchProductByName() {
        const query = productSearchBar.value;
        const apiUrl = `https://world.openfoodfacts.org/api/v0/search?search_terms=${query}&sort_by=popularity`;

        fetch(apiUrl)
            .then(response => response.json())
            .then(data => {
                if (data.products && data.products.length > 0) {
                    listElement.innerHTML = '';
                    data.products.forEach(product => {
                        const barcode = product.code || 'Unknown';
                        const productName = product.product_name || 'Unknown Product';
                        const imageUrl = product.image_url || 'https://via.placeholder.com/150';
                        addProductToList(barcode, productName, imageUrl);
                    });
                } else {
                    resultElement.innerText = "No products found!";
                }
            })
            .catch(error => {
                console.error("Error searching for products:", error);
                resultElement.innerText = "Error searching for products.";
            });
    }

    function filterProducts() {
        const selectedShop = filterDropdown.value;
        const items = document.querySelectorAll('#list li');
        items.forEach(item => {
            // Assuming you add shop info in the list items, filter based on that
            const shopInfo = item.getAttribute('data-shop') || '';
            item.style.display = selectedShop ? shopInfo.includes(selectedShop) : '';
        });
    }

    productSearchBar.addEventListener('input', searchProductByName);
    filterDropdown.addEventListener('change', filterProducts);
    searchBar.addEventListener('input', searchProducts);

    addToListButton.addEventListener('click', function() {
        const productName = productNameInput.value.trim();
        if (productName) {
            addProductToList('0000000000000000000000', productName, 'https://via.placeholder.com/150');
            saveToHistory('0000000000000000000000', productName, 'https://via.placeholder.com/150');
            productNameInput.value = '';
        }
    });

    html5QrCode.start(
        { facingMode: "environment" },
        { fps: 10, qrbox: { width: 250, height: 250 } },
        onScanSuccess,
        onScanError
    ).catch(err => {
        console.error("Failed to start scanning", err);
        resultElement.innerText = "Failed to start scanning. Check console for errors.";
    });

    displayHistory();

    // Example: Populate filter dropdown with options
    const filterOptions = ['Supermarket A', 'Supermarket B', 'Online Store']; // Example options
    filterOptions.forEach(option => {
        const opt = document.createElement('option');
        opt.value = option;
        opt.textContent = option;
        filterDropdown.appendChild(opt);
    });
});
