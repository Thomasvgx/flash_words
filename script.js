// const { debug } = require("console");

document.addEventListener('DOMContentLoaded', function () {
    let words = [];
    let currentIndex = 0;
    let startTime;
    let elapsedTimeForEachWord = [];

    const wordInput = document.getElementById('word-input');
    const startButton = document.getElementById('start-button');
    const fileInput = document.getElementById('file-input');
    const wordDisplay = document.getElementById('word-display');
    const timerDisplay = document.getElementById('timer');
    const summaryDisplay = document.getElementById('summary');
    let spacebarPressed = false; // Flag to track spacebar press

    // Function to start the timer
    function startTimer() {
        startTime = new Date();
        document.addEventListener('keydown', handleKeyPress);
    }

    // Function to handle key press events
    function handleKeyPress(event) {
        if (event.code === 'Space' && !spacebarPressed) {
            event.preventDefault(); // Prevent the default behavior (e.g., page refresh)
            spacebarPressed = true;
            showNextWord();
        }
    }

    // Function to show the next word or display the summary if all words are shown
    function showNextWord() {
        spacebarPressed = false; // Reset the flag
        if (currentIndex < words.length) {
            const elapsedTime = (new Date() - startTime) / 1000; // Calculate elapsed time in seconds
            elapsedTimeForEachWord.push(elapsedTime.toFixed(2));

            currentIndex++;
            if (currentIndex < words.length) {
                wordDisplay.textContent = words[currentIndex];
                startTime = new Date(); // Reset the start time for the next word
            } else {
                document.removeEventListener('keydown', handleKeyPress); // Remove the event listener
                showSummary();
            }
        }
    }

    // Function to display the summary
    function showSummary() {
        let summaryHTML = '<p><h1>Summary:</h1></p>';
        for (let i = 0; i < words.length; i++) {
            summaryHTML += `<p>${words[i]}: ${elapsedTimeForEachWord[i]} seconds</p>`;
        }
        summaryDisplay.innerHTML = summaryHTML;
        wordDisplay.style.display = 'none';
    }

    // Function to initialize the app
    function init() {
        startButton.addEventListener('click', function () {
            console.log(fileInput.files);
            // Choose either entered words or words from a file
            if (wordInput.value.trim() !== '') {
                words = wordInput.value.split(',');
                currentIndex = 0;
                elapsedTimeForEachWord = [];
                wordDisplay.textContent = words[currentIndex];
                startTimer();
            } else if (fileInput.files.length > 0) {
                const file = fileInput.files[0];
                const reader = new FileReader();
                reader.onload = function (event) {
                    words = event.target.result.split(',');
                    currentIndex = 0;
                    elapsedTimeForEachWord = [];
                    wordDisplay.textContent = words[currentIndex];
                    startTimer();
                    startButton.style.display = 'none';
                    wordInput.style.display = 'none';
                    fileInput.style.display = 'none';
                };
                reader.readAsText(file);
                // Upload the file to the server
                uploadFile(file);
            } else {
                alert('Please enter words or choose a file.');
            }
        });
    }

    // Function to upload the file to the server
    function uploadFile(file) {
        const formData = new FormData();
        formData.append('file', file);

        fetch('http://localhost:3000/upload-file', {
            method: 'POST',
            body: formData,
        })
        .then(response => response.text())
        .then(data => console.log(data))
        .catch(error => console.error('Error:', error));
    }

    // Function to send the list of words to the server
    function sendWordsToServer(words) {
        fetch('http://localhost:3000/upload', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ words }),
        })
        .then(response => response.text())
        .then(data => console.log(data))
        .catch(error => console.error('Error:', error));
    }

    init();
});
