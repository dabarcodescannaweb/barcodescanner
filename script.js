document.addEventListener("DOMContentLoaded", function() {
    const scannerContainer = document.getElementById("scanner-container");
    const resultElement = document.getElementById("result");

    // Check if the Html5Qrcode object is available
    if (typeof Html5Qrcode === "undefined") {
        console.error("Html5Qrcode library not loaded.");
        resultElement.innerText = "Error: Html5Qrcode library not loaded.";
        return;
    }

    const html5QrCode = new Html5Qrcode("scanner-container");

    // Define success callback
    function onScanSuccess(decodedText, decodedResult) {
        resultElement.innerText = "Barcode found: " + decodedText;
        html5QrCode.stop().catch(err => {
            console.error("Failed to stop scanning", err);
        });
    }

    // Define error callback
    function onScanError(errorMessage) {
        console.error("Scanning error:", errorMessage);
    }

    // Start the scanner
    html5QrCode.start(
        { facingMode: "environment" }, // Use environment camera
        { fps: 10, qrbox: 250 }, // Set scanning options
        onScanSuccess, // Success callback
        onScanError // Error callback
    ).catch(err => {
        console.error("Failed to start scanning", err);
        resultElement.innerText = "Failed to start scanning. Check console for errors.";
    });
});
