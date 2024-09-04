document.addEventListener("DOMContentLoaded", function() {
    const scannerContainer = document.getElementById("scanner-container");
    const resultElement = document.getElementById("result");
    const overlay = document.getElementById("overlay");
    const listElement = document.getElementById("list");

    let lastScannedBarcode = "";
    let lastScanTime = 0;
    const cooldownPeriod = 3000; // 3 seconds cooldown

    // Ensure the Html5Qrcode object is available
    if (typeof Html5Qrcode === "undefined") {
        console.error("Html5Qrcode library not loaded.");
        resultElement.innerText = "Error: Html5Qrcode library not loaded.";
        return;
    }

    const html5QrCode = new Html5Qrcode("scanner-container");

    async function fetchProductData(barcode) {
        const API_ENDPOINT = `https://world.openfoodfacts.org/api/v0/product/${barcode}.json`;
        
        try {
            const response = await fetch(API_ENDPOINT);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error fetching product data:', error);
            return null;
        }
    }

    async function onScanSuccess(decodedText, decodedResult) {
        const now = Date.now();
        if (decodedText === lastScannedBarcode && (now - lastScanTime < cooldownPeriod)) {
            return; // Ignore this scan due to cooldown
        }
        lastScannedBarcode = decodedText;
        lastScanTime = now;

        resultElement.innerText = "Scanning barcode: " + decodedText;
        const productData = await fetchProductData(decodedText);

        if (productData && productData.product) {
            const { product_name, image_url } = productData.product;
            addProductToList(decodedText, product_name, image_url || 'https://via.placeholder.com/60');
        } else {
            resultElement.innerText = "Barcode found, but no product information available.";
        }
        
        overlay.style.display = 'none'; // Hide the overlay
    }

    function onScanError(errorMessage) {
        console.error("Scanning error:", errorMessage);
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

    html5QrCode.start(
        { facingMode: "environment" }, // Use environment camera
        { fps: 10, qrbox: { width: 250, height: 250 } }, // Adjust qrbox size
        onScanSuccess, // Success callback
        onScanError // Error callback
    ).catch(err => {
        console.error("Failed to start scanning", err);
        resultElement.innerText = "Failed to start scanning. Check console for errors.";
    });

});
