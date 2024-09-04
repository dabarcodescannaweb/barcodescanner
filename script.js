document.getElementById('scanButton').addEventListener('click', async function() {
    const cameraContainer = document.getElementById('cameraContainer');
    const video = document.getElementById('video');

    // Show camera container
    cameraContainer.classList.remove('hidden');

    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        video.srcObject = stream;
    } catch (error) {
        console.error('Error accessing the camera: ', error);
    }
});

document.getElementById('closeButton').addEventListener('click', function() {
    const cameraContainer = document.getElementById('cameraContainer');
    const video = document.getElementById('video');

    // Hide camera container
    cameraContainer.classList.add('hidden');

    // Stop video stream
    if (video.srcObject) {
        const stream = video.srcObject;
        const tracks = stream.getTracks();
        tracks.forEach(track => track.stop());
        video.srcObject = null;
    }
});
