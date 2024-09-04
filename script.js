document.addEventListener("DOMContentLoaded", function() {
    const qrCodeScanner = new Html5Qrcode("scanner-container");

    function onScanSuccess(decodedText, decodedResult) {
        document.getElementById("result").innerText = "Barcode found: " + decodedText;
        qrCodeScanner.stop().catch(err => {
            console.error("Failed to stop scanning", err);
        });
    }

    function onScanError(errorMessage) {
        // Handle scan error
    }

    qrCodeScanner.start(
        { facingMode: "environment" }, // or { facingMode: { exact: "environment" } }
        { fps: 10, qrbox: 250 },
        onScanSuccess,
        onScanError
    ).catch(err => {
        console.error("Failed to start scanning", err);
    });
});
