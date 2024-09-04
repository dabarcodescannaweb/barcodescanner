document.addEventListener("DOMContentLoaded", function() {
    const scannerContainer = document.getElementById("scanner-container");
    const resultElement = document.getElementById("result");

    // Create an instance of the Html5QrcodeScanner
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
        // Handle scan error if needed
    }

    // Start the scanner
    html5QrCode.start(
        { facingMode: "environment" }, // Use environment camera
        { fps: 10, qrbox: 250 }, // Set scanning options
        onScanSuccess, // Success callback
        onScanError // Error callback
    ).catch(err => {
        console.error("Failed to start scanning", err);
    });
});
 
