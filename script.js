// Define the barcode directory
const barcodeDirectory = ["1234567890", "0987654321", "1112131415"]; // Example barcode directory

let currentStream = null;
let useFrontCamera = false;

async function startCamera() {
    const video = document.getElementById('video');

    // Stop any existing video stream
    if (currentStream) {
        currentStream.getTracks().forEach(track => track.stop());
    }

    try {
        const stream = await navigator.mediaDevices.getUserMedia({
            video: {
                facingMode: useFrontCamera ? "user" : "environment"
            }
        });
        video.srcObject = stream;
        currentStream = stream;
        scanBarcode();
    } catch (error) {
        console.error('Error accessing the camera: ', error);
    }
}

function stopCamera() {
    const video = document.getElementById('video');
    const resultMessage = document.getElementById('resultMessage');

    if (currentStream) {
        currentStream.getTracks().forEach(track => track.stop());
        video.srcObject = null;
    }
    document.getElementById('cameraContainer').classList.add('hidden');
    document.getElementById('switchButton').classList.add('hidden');
    resultMessage.classList.remove('hidden');
}

function scanBarcode() {
    const video = document.getElementById('video');
    const resultMessage = document.getElementById('resultMessage');

    video.addEventListener('playing', () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        function scan() {
            if (video.readyState === video.HAVE_ENOUGH_DATA) {
                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;
                ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

                const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                const code = jsQR(imageData.data, canvas.width, canvas.height);

                if (code) {
                    const scannedCode = code.data;
                    console.log("Scanned Code:", scannedCode); // Debugging: log scanned code

                    if (barcodeDirectory.includes(scannedCode)) {
                        resultMessage.textContent = "Successful";
                        resultMessage.style.color = "green";
                    } else {
                        resultMessage.textContent = "Barcode Not Recognized";
                        resultMessage.style.color = "red";
                    }
                    stopCamera(); // Close camera after scanning
                } else {
                    requestAnimationFrame(scan);
                }
            }
        }
        scan();
    });
}

document.getElementById('scanButton').addEventListener('click', function() {
    document.getElementById('cameraContainer').classList.remove('hidden');
    document.getElementById('switchButton').classList.remove('hidden');
    document.getElementById('resultMessage').classList.add('hidden');
    startCamera();
});

document.getElementById('switchButton').addEventListener('click', function() {
    useFrontCamera = !useFrontCamera;
    startCamera();
});

document.getElementById('closeButton').addEventListener('click', function() {
    stopCamera();
});
