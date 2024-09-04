<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Barcode Scanner</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
        }

        .container {
            text-align: center;
            background: white;
            border-radius: 12px; /* Rounded corners for the container */
            box-shadow: 0 4px 8px rgba(0,0,0,0.1); /* Slight shadow for depth */
            padding: 20px;
            width: 400px; /* Increased width for larger list */
            position: relative;
        }

        #scanner-container {
            margin: 20px auto;
            height: 240px; /* Adjust height as needed */
            width: 100%; /* Full width of the container */
            border: 2px solid #4CAF50; /* Green border for visibility */
            border-radius: 12px; /* Rounded corners for scanner */
            position: relative;
            overflow: hidden; /* Hide overflow */
            background-color: #fff; /* White background inside scanner */
        }

        #result {
            font-size: 18px;
            color: #333;
            margin-top: 10px;
        }

        .overlay {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            border: 2px solid rgba(76, 175, 80, 0.5); /* Semi-transparent green border */
            border-radius: 12px; /* Match scanner corners */
            pointer-events: none; /* Allow interactions through the overlay */
            display: none; /* Hide overlay initially */
        }

        #list {
            margin-top: 20px;
            text-align: left;
            max-height: 400px; /* Increased height for larger list */
            overflow-y: auto;
            padding: 0;
            list-style-type: none;
            display: flex;
            flex-direction: column;
            align-items: center; /* Center align items */
        }

        #list li {
            background: #f9f9f9;
            border: 1px solid #ddd;
            border-radius: 8px;
            margin-bottom: 15px;
            padding: 15px;
            font-size: 18px;
            width: 100%;
            display: flex;
            align-items: center;
            max-width: 380px; /* Max width to fit within container */
        }

        #list li img {
            max-height: 60px; /* Set max height for images */
            margin-right: 15px; /* Space between image and text */
            border-radius: 8px;
        }

        .input-container {
            margin-top: 20px;
            display: flex;
            flex-direction: column;
            align-items: center;
        }

        .input-container input[type="text"] {
            padding: 10px;
            border: 1px solid #ddd;
            border-radius: 8px;
            width: 80%;
            margin-bottom: 10px;
            font-size: 16px;
        }

        .input-container button {
            padding: 10px 20px;
            border: none;
            border-radius: 8px;
            background-color: #4CAF50;
            color: white;
            font-size: 16px;
            cursor: pointer;
        }

        .input-container button:hover {
            background-color: #45a049;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Barcode Scanner</h1>
        <div id="scanner-container">
            <div class="overlay" id="overlay"></div>
        </div>
        <div id="result">Scan a barcode to see the result</div>
        <div class="input-container">
            <input type="text" id="product-name" placeholder="Enter product name">
            <button id="add-to-list">Add to List</button>
        </div>
        <ul id="list"></ul>
    </div>
    <script src="https://cdn.jsdelivr.net/npm/html5-qrcode/minified/html5-qrcode.min.js"></script>
    <script src="script.js"></script>
</body>
</html>
