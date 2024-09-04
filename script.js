document.addEventListener("DOMContentLoaded", function() {
    const scannerContainer = document.getElementById("scanner-container");
    const resultElement = document.getElementById("result");
    const overlay = document.getElementById("overlay");

    // Ensure the Html5Qrcode object is available
    if (typeof Html5Qrcode === "undefined") {
        console.error("Html5Qrcode library not loaded.");
        resultElement.innerText = "Error: Html5Qrcode library not loaded.";
        return;
    }

    const html5QrCode = new Html5Qrcode("scanner-container");

    function onScanSuccess(decodedText, decodedResult) {
        resultElement.innerText = "Barcode found: " + decodedText;
        overlay.style.display = 'none'; // Hide the overlay
        html5QrCode.stop().catch(err => {
            console.error("Failed to stop scanning", err);
        });
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

    // Show the overlay when scanning
    html5QrCode.onScanClick = () => {
        overlay.style.display = 'block';
    };
});
