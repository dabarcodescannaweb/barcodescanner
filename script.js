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

    function onScanSuccess(decodedText, decodedResult) {
        const now = Date.now();
        if (decodedText === lastScannedBarcode && (now - lastScanTime < cooldownPeriod)) {
            return; // Ignore this scan due to cooldown
        }
        lastScannedBarcode = decodedText;
        lastScanTime = now;

        // Process the barcode if it's 22 digits long
        let processedBarcode = decodedText;
        if (decodedText.length === 22) {
            processedBarcode = decodedText.substring(2, decodedText.length - 7);
        }

        // Display the processed barcode and fetch product details
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
                    const imageUrl = product.image_url || "https://via.placeholder.com/150"; // Fallback if no image
                    addProductToList(barcode, productName, imageUrl);
                } else {
                    resultElement.innerText = "Product not found in ADissapointmentCL's Database!.";
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

    // Start the scanner with environment-facing camera
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
