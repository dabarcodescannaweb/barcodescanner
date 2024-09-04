document.addEventListener("DOMContentLoaded", function() {
    const scannerContainer = document.getElementById("scanner-container");
    const resultElement = document.getElementById("result");
    const overlay = document.getElementById("overlay");
    const listElement = document.getElementById("list");
    const searchBar = document.getElementById("search-bar");
    const historyElement = document.getElementById("history");
    const addToListButton = document.getElementById("add-to-list");
    const productNameInput = document.getElementById("product-name");

    let lastScannedBarcode = "";
    let lastScanTime = 0;
    const cooldownPeriod = 3000; // 3 seconds cooldown

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
        const historyItem = document.createElement("li");
        const image = document.createElement("img");
        image.src = imageUrl;
        image.alt = productName;
        image.title = productName;
        
        const text = document.createElement("span");
        text.textContent = `Scanned Barcode: ${barcode}, Product: ${productName}`;
        
        historyItem.appendChild(image);
        historyItem.appendChild(text);
        historyElement.appendChild(historyItem);
    }

    // Start QR code scanning
    html5QrCode.start(
        { facingMode: "environment" },
        { fps: 10, qrbox: { width: 250, height: 250 } },
        onScanSuccess,
        onScanError
    ).then(() => {
        console.log("QR Code scanning started successfully.");
    }).catch(err => {
        console.error("Failed to start QR Code scanning.", err);
        resultElement.innerText = "Failed to start scanning. Check console for errors.";
    });

    addToListButton.addEventListener("click", () => {
        const productName = productNameInput.value.trim();
        if (productName) {
            addProductToList("N/A", productName, "https://via.placeholder.com/150");
            productNameInput.value = ""; // Clear input field
        }
    });

    searchBar.addEventListener("input", function() {
        const filter = searchBar.value.toLowerCase();
        const items = listElement.getElementsByTagName("li");
        for (let i = 0; i < items.length; i++) {
            const item = items[i];
            const text = item.textContent || item.innerText;
            item.style.display = text.toLowerCase().includes(filter) ? "" : "none";
        }
    });
});
