document.addEventListener('DOMContentLoaded', function () {
    let words = [];
    let currentIndex = 0;
    let startTime;
    let elapsedTimeForEachWord = [];

    const inputSection = document.getElementById('input-section');
    const wordInput = document.getElementById('word-input');
    const fileInput = document.getElementById('file-input');
    const startButton = document.getElementById('start-button');
    const wordDisplay = document.getElementById('word-display');
    const timerDisplay = document.getElementById('timer');
    const summarySection = document.getElementById('summary-section');
    const summaryDisplay = document.getElementById('summary');
    const refreshButton = document.getElementById('refresh-button');
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
        wordDisplay.style.display = 'none';
        summarySection.style.display = 'block';
        let summaryHTML = '<p><h1>Summary:</h1></p>';
        for (let i = 0; i < words.length; i++) {
            summaryHTML += `<p>${words[i]}: ${elapsedTimeForEachWord[i]} seconds</p>`;
        }
        refreshButton.style.display = 'block';
        // summaryHTML += '<button id="refresh-button">Refresh</button>';
        summaryDisplay.innerHTML = summaryHTML;
    }

    // Function to initialize the app
    function init() {
        startButton.addEventListener('click', function () {
            // Choose either entered words or words from a file
            if (wordInput.value.trim() !== '') {
                words = wordInput.value.split(',');
                currentIndex = 0;
                elapsedTimeForEachWord = [];
                wordDisplay.textContent = words[currentIndex];
                startTimer();
                inputSection.style.display = 'none';
            } else if (fileInput.files.length > 0) {
                const file = fileInput.files[0];
                const reader = new FileReader();
                reader.onload = function (event) {
                    words = event.target.result.split(',');
                    currentIndex = 0;
                    elapsedTimeForEachWord = [];
                    wordDisplay.textContent = words[currentIndex];
                    startTimer();
                };
                reader.readAsText(file);
                inputSection.style.display = 'none';
            } else {
                alert('Please enter words or choose a file.');
            }
        });
    }

    refreshButton.addEventListener('click', function () {
        resetApplication();
    });

    function resetApplication() {
        // Clear input fields
        document.getElementById('word-input').value = '';
        document.getElementById('file-input').value = '';

        // Reset state variables
        words = [];
        currentIndex = 0;
        startTime = null;
        elapsedTimeForEachWord = [];

        // Clear displays
        document.getElementById('word-display').textContent = '';
        document.getElementById('timer').textContent = '';
        document.getElementById('summary').textContent = '';

        // Reload the page
        location.reload();
    }

    init();
});