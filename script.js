document.addEventListener('DOMContentLoaded', function () {
    let words = [];
    let currentIndex = 0;
    let startTime;
    let elapsedTimeForEachWord = [];

    const wordInput = document.getElementById('word-input');
    const fileInput = document.getElementById('file-input');
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
        wordDisplay.style.display = 'none';
        let summaryHTML = '<p>Summary:</p>';
        for (let i = 0; i < words.length; i++) {
            summaryHTML += `<p>${words[i]}: ${elapsedTimeForEachWord[i]} seconds</p>`;
        }
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
                fileInput.style.display = 'none';
                wordInput.style.display = 'none';
                startButton.style.display = 'none';
                // Upload the file to the server
                // uploadFile(file);
            } else {
                alert('Please enter words or choose a file.');
            }
        });
    }

    init();
});