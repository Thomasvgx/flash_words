document.addEventListener('DOMContentLoaded', function () {
    let words = [];
    let currentIndex = 0;
    let startTime;
    let elapsedTimeForEachWord = [];
    const wordsPerPage = 20;
    let currentPage = 1;

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

    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
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
        let sum = 0;
        for (let i = 0; i < elapsedTimeForEachWord.length; i++) {
            sum += parseFloat(elapsedTimeForEachWord[i]);
        }
        
        summarySection.style.display = 'block';
        // let summaryHTML = '<p><h1>Summary:</h1></p>';

        // Calculate the start and end index for the current page
        const startIndex = (currentPage - 1) * wordsPerPage;
        const endIndex = startIndex + wordsPerPage;

        // Display words for the current page
        const pageWords = words.slice(startIndex, endIndex);
        let summaryHTML = '<p><h1>Summary:</h1></p><ul>' +
        pageWords.map((word, index) => `<li>${word} - ${elapsedTimeForEachWord[startIndex + index]} seconds</li>`).join('') + '</ul>';

        summaryHTML += `<p><b>Total time</b>: ${sum.toFixed(1)}s<p>`;
        refreshButton.style.display = 'block';
        summaryDisplay.innerHTML = summaryHTML;
        showPaginationControls();
    }

    // Function to initialize the app
    function init() {
        startButton.addEventListener('click', function () {
            // Choose either entered words or words from a file
            if (wordInput.value.trim() !== '') {
                words = wordInput.value.split(',');
                shuffleArray(words);
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
                    shuffleArray(words);
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

    function showPaginationControls() {
        const paginationElement = document.getElementById('pagination');
        const totalPages = Math.ceil(words.length / wordsPerPage);
    
        // Create pagination controls with simple styling
        const paginationHTML = '<div class="pagination">' +
            Array.from({ length: totalPages }, (_, index) =>
                `<button class="page-button ${currentPage === index + 1 ? 'active' : ''}" onclick="changePage(${index + 1})">${index + 1}</button>`
            ).join('') +
            '</div>';
    
        paginationElement.innerHTML = paginationHTML;
    }
    
    window.changePage = function(newPage) {
        currentPage = newPage;
        showSummary();
    };

    init();
});