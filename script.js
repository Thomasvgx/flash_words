document.addEventListener('DOMContentLoaded', function () {
    let words = [];
    let currentIndex = 0;
    let startTime;
    let elapsedTimeForEachWord = [];

    const wordInput = document.getElementById('word-input');
    const startButton = document.getElementById('start-button');
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
            words = wordInput.value.split(',');
            currentIndex = 0;
            elapsedTimeForEachWord = [];
            wordDisplay.textContent = words[currentIndex];
            startTimer();
            startButton.style.display = 'none';
            wordInput.style.display = 'none';

            sendWordsToServer(words);
        });
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