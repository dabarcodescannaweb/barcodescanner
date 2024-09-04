document.addEventListener("DOMContentLoaded", function() {
    const scannerContainer = document.getElementById("scanner-container");
    const resultElement = document.getElementById("result");
    const listElement = document.getElementById("list");

    // Use Open Food Facts API to get product info based on barcode
    async function fetchProductInfo(barcode) {
        const response = await fetch(`https://world.openfoodfacts.org/api/v0/product/${barcode}.json`);
        if (response.ok) {
            const data = await response.json();
            return data.product;
        } else {
            throw new Error('Product not found');
        }
    }

    function addProductToList(product, barcode) {
        const listItem = document.createElement("li");

        // Basic Product Info (shown initially)
        const basicInfo = document.createElement("div");
        basicInfo.innerHTML = `
            <img src="${product.image_url || 'https://via.placeholder.com/60'}" alt="${product.product_name}">
            <span>Product: ${product.product_name || 'N/A'}</span><br>
            <span>Barcode: ${barcode}</span>
        `;
        
        listItem.appendChild(basicInfo);

        // Create the button to toggle detailed info
        const toggleButton = document.createElement("button");
        toggleButton.className = "toggle-details";
        toggleButton.textContent = "Show More";

        // Detailed Info (hidden initially)
        const details = document.createElement("div");
        details.className = "details";
        details.innerHTML = `
            <strong>Nutritional Info:</strong><br>
            Calories: ${product.nutriments?.energy_value || 'N/A'} kcal<br>
            Fats: ${product.nutriments?.fat || 'N/A'} g<br>
            Sugars: ${product.nutriments?.sugars || 'N/A'} g<br>
            Protein: ${product.nutriments?.proteins || 'N/A'} g<br>
            Fiber: ${product.nutriments?.fiber || 'N/A'} g<br>
            Salt: ${product.nutriments?.salt || 'N/A'} g<br><br>
            <strong>Ingredients:</strong> ${product.ingredients_text || 'N/A'}<br>
            <strong>Allergens:</strong> ${product.allergens_tags?.length > 0 ? product.allergens_tags.join(', ') : 'None'}<br>
            <strong>Nutri-Score:</strong> ${product.nutrition_grades_tags || 'N/A'}<br>
            <strong>Eco-Score:</strong> ${product.ecoscore_grade || 'N/A'}<br>
        `;

        // Toggle button click event
        toggleButton.addEventListener("click", function() {
            details.style.display = details.style.display === "none" ? "block" : "none";
            toggleButton.textContent = details.style.display === "none" ? "Show More" : "Show Less";
        });

        listItem.appendChild(toggleButton);
        listItem.appendChild(details);

        // Add the product list item to the list
        listElement.appendChild(listItem);
    }

    function onScanSuccess(decodedText, decodedResult) {
        resultElement.innerText = "Barcode found: " + decodedText;

        // Fetch the product data from Open Food Facts
        fetchProductInfo(decodedText)
            .then(product => {
                if (product) {
                    addProductToList(product, decodedText);
                } else {
                    resultElement.innerText = "No product data found.";
                }
            })
            .catch(error => {
                resultElement.innerText = "Error fetching product data.";
                console.error(error);
            });
    }

    function onScanError(errorMessage) {
        console.error("Scanning error:", errorMessage);
    }

    const html5QrCode = new Html5Qrcode("scanner-container");

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
