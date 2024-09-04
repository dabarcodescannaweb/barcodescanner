document.addEventListener("DOMContentLoaded", function() {
    const scannerContainer = document.getElementById("scanner-container");
    const resultElement = document.getElementById("result");
    const overlay = document.getElementById("overlay");
    const productNameInput = document.getElementById("product-name");
    const addToListButton = document.getElementById("add-to-list");
    const listElement = document.getElementById("list");

    let lastBarcode = "";

    // Ensure the Html5Qrcode object is available
    if (typeof Html5Qrcode === "undefined") {
        console.error("Html5Qrcode library not loaded.");
        resultElement.innerText = "Error: Html5Qrcode library not loaded.";
        return;
    }

    const html5QrCode = new Html5Qrcode("scanner-container");

    function onScanSuccess(decodedText, decodedResult) {
        resultElement.innerText = "Barcode found: " + decodedText;
        lastBarcode = decodedText;
        overlay.style.display = 'none'; // Hide the overlay
    }

    function onScanError(errorMessage) {
        console.error("Scanning error:", errorMessage);
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

    // Handle adding scanned barcode to the list
    addToListButton.addEventListener("click", function() {
        const productName = productNameInput.value.trim();
        if (lastBarcode && productName) {
            const listItem = document.createElement("li");
            listItem.textContent = `Barcode: ${lastBarcode}, Product: ${productName}`;
            listElement.appendChild(listItem);
            productNameInput.value = ""; // Clear input field
            lastBarcode = ""; // Clear last barcode
        } else {
            alert("Please scan a barcode and enter a product name.");
        }
    });
});
