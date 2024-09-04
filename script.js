document.addEventListener("DOMContentLoaded", function() {
    const scannerContainer = document.getElementById("scanner-container");
    const resultElement = document.getElementById("result");
    const overlay = document.getElementById("overlay");
    const listElement = document.getElementById("list");
    
    // Predefined list of barcodes and product names
    const productList = {
        "5449000214911": "Coca-cola - 330 ml",
        "3017620422003": "Nutella - 400g",
        "5449000004864": "Sprite - 2L",
        "222334455667": "Product D",
        "333445566778": "Product E",
        "444556677889": "Product F",
        "555667788990": "Product G",
        "666778899001": "Product H",
        "777889900112": "Product I",
        "888990011223": "Product J"
    };

    // Ensure the Html5Qrcode object is available
    if (typeof Html5Qrcode === "undefined") {
        console.error("Html5Qrcode library not loaded.");
        resultElement.innerText = "Error: Html5Qrcode library not loaded.";
        return;
    }

    const html5QrCode = new Html5Qrcode("scanner-container");

    function onScanSuccess(decodedText, decodedResult) {
        resultElement.innerText = "Barcode found: " + decodedText;
        
        if (productList[decodedText]) {
            addProductToList(decodedText, productList[decodedText]);
        } else {
            resultElement.innerText = "Barcode found, but no product name associated.";
        }
        
        overlay.style.display = 'none'; // Hide the overlay
    }

    function onScanError(errorMessage) {
        console.error("Scanning error:", errorMessage);
    }

    function addProductToList(barcode, productName) {
        const listItem = document.createElement("li");
        listItem.textContent = `Barcode: ${barcode}, Product: ${productName}`;
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
