document.addEventListener("DOMContentLoaded", function() {
    const scannerContainer = document.getElementById("scanner-container");
    const resultElement = document.getElementById("result");
    const overlay = document.getElementById("overlay");
    const searchIcon = document.getElementById("search-icon");
    const searchInterface = document.getElementById("search-interface");
    const searchResults = document.getElementById("search-results");
    const searchQueryInput = document.getElementById("search-query");
    const searchBar = document.getElementById("search-bar");
    
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
                    addSearchResult(barcode, productName, imageUrl);
                } else {
                    resultElement.innerText = "Product not found!";
                }
            })
            .catch(error => {
                console.error("Error fetching product details:", error);
                resultElement.innerText = "Error fetching product details.";
            });
    }

    function addSearchResult(barcode, productName, imageUrl) {
        const resultItem = document.createElement("li");
        const image = document.createElement("img");
        image.src = imageUrl;
        image.alt = productName;
        
        const text = document.createElement("span");
        text.textContent = `${productName} (Barcode: ${barcode})`;
        
        resultItem.appendChild(image);
        resultItem.appendChild(text);
        searchResults.appendChild(resultItem);
        
        resultItem.addEventListener("click", () => {
            alert(`You selected ${productName} with barcode ${barcode}`);
            // You can update this to show product details on click.
        });
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
        resultElement.innerText = "Failed to start scanning.";
    });

    // Toggle between scanner UI and search interface
    searchIcon.addEventListener("click", () => {
        const scannerUIVisible = scannerContainer.style.display !== "none";
        
        if (scannerUIVisible) {
            scannerContainer.style.display = "none";
            resultElement.style.display = "none";
            searchInterface.style.display = "flex";
        } else {
            scannerContainer.style.display = "block";
            resultElement.style.display = "block";
            searchInterface.style.display = "none";
        }
    });

    // Search for products or barcodes
    searchQueryInput.addEventListener("input", function() {
        const query = searchQueryInput.value.trim();
        if (query) {
            searchResults.innerHTML = ""; // Clear previous results
            fetchProductDetails(query); // Use the same function to fetch by barcode or name
        }
    });
});
