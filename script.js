document.addEventListener("DOMContentLoaded", function() {
    const scannerContainer = document.getElementById("scanner-container");
    const resultElement = document.getElementById("result");
    const overlay = document.getElementById("overlay");
    const listElement = document.getElementById("list");
    const productNameInput = document.getElementById("product-name");
    const addToListButton = document.getElementById("add-to-list");

    // Predefined list of barcodes and product names with image URLs
    const productList = {
        "123456789012": { name: "Product A", image: "https://example.com/images/product_a.jpg" },
        "987654321098": { name: "Product B", image: "https://example.com/images/product_b.jpg" },
        "111223344556": { name: "Product C", image: "https://example.com/images/product_c.jpg" },
        "222334455667": { name: "Product D", image: "https://example.com/images/product_d.jpg" },
        "333445566778": { name: "Product E", image: "https://example.com/images/product_e.jpg" },
        "444556677889": { name: "Product F", image: "https://example.com/images/product_f.jpg" },
        "555667788990": { name: "Product G", image: "https://example.com/images/product_g.jpg" },
        "666778899001": { name: "Product H", image: "https://example.com/images/product_h.jpg" },
        "777889900112": { name: "Product I", image: "https://example.com/images/product_i.jpg" },
        "888990011223": { name: "Product J", image: "https://example.com/images/product_j.jpg" }
    };

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
        
        resultElement.innerText = "Barcode found: " + decodedText;
        
        const product = productList[decodedText];
        if (product) {
            addProductToList(decodedText, product.name, product.image);
        } else {
            resultElement.innerText = "Barcode found, but no product name associated.";
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
