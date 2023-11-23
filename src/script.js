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
    const elapsedTimeDisplay = document.getElementById('elapsed-time-display');
    const summarySection = document.getElementById('summary-section');
    const summaryDisplay = document.getElementById('summary');
    const refreshButton = document.getElementById('refresh-button');
    const wordDisplaySection = document.getElementById('word-display-section');
    let spacebarPressed = false; // Flag to track spacebar press
    let vKeyPressed = false;

    document.body.addEventListener('click', function () {
        handleKeyPress({ code: 'Space', preventDefault: function() {} });
    });

    document.addEventListener('keydown', handleKeyPress);
    
    const exportButton = document.getElementById('export-button');
    exportButton.addEventListener('click', exportToCSV);

    function handleKeyPress(event) {
        if (wordDisplaySection.style.display == 'block'){
            if ((event.code === 'Space' || event.type === 'click') && !spacebarPressed) {
                event.preventDefault(); // Prevent the default behavior (e.g., page refresh)
                spacebarPressed = true;
                // startTimer();
            } else if (event.code === 'KeyV') {
                event.preventDefault();
                elapsedTimeDisplay.style.display = "block";
                if (vKeyPressed == false){
                    vKeyPressed = true;
                    stopTimer();
                }
                else{
                    elapsedTimeDisplay.style.display = "none";
                    // Timer already stopped
                    showNextWord();
                }
            } else if (event.code === 'KeyB') {
                event.preventDefault();
                elapsedTimeDisplay.style.display = "none";
                if (vKeyPressed == true){
                    // Timer already stopped
                    showNextWord();
                }
                else{
                    stopTimer();
                    showNextWord();
                }
            }
        }
    }

    function startTimer() {
        startTime = Date.now();
    }

    function stopTimer() {
        if (startTime !== undefined) {
            const endTime = Date.now();
            const elapsedSeconds = (endTime - startTime) / 1000;
            elapsedTimeForEachWord[currentIndex] = elapsedSeconds;
            displayElapsedTime(elapsedSeconds);
            spacebarPressed = false;
            vKeyPressed = true;
        }
    }

    function displayElapsedTime(elapsedSeconds) {
        const elapsedTimeDisplay = document.getElementById('elapsed-time-display');
        elapsedTimeDisplay.textContent = `Elapsed Time: ${elapsedSeconds.toFixed(2)}s`;
    }

    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    // Function to show the next word or display the summary if all words are shown
    function showNextWord() {
        vKeyPressed = false;
        currentIndex++;

        if (currentIndex < words.length) {
            wordDisplay.textContent = words[currentIndex];
            startTime = new Date(); // Reset the start time for the next word
        } else {
            document.removeEventListener('keydown', handleKeyPress); // Remove the event listener
            showSummary();
        }
    }

    // Function to display the summary
    function showSummary() {
        wordDisplaySection.style.display = 'none';
        let sum = 0;
        for (let i = 0; i < elapsedTimeForEachWord.length; i++) {
            sum += parseFloat(elapsedTimeForEachWord[i]);
        }

        summarySection.style.display = 'block';

        // Calculate the start and end index for the current page
        const startIndex = (currentPage - 1) * wordsPerPage;
        const endIndex = startIndex + wordsPerPage;

        // Display words for the current page
        const pageWords = words.slice(startIndex, endIndex);
        let summaryHTML = '<p><h1>Summary:</h1></p><ul>' +
        pageWords.map((word, index) => `<li><b>${word}</b> - ${elapsedTimeForEachWord[startIndex + index].toFixed(2)}s</li>`).join('') + '</ul>';

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
                wordDisplaySection.style.display = 'block';
                words = wordInput.value.split(',');
                shuffleArray(words);
                currentIndex = 0;
                elapsedTimeForEachWord = [];
                wordDisplay.textContent = words[currentIndex];
                startTimer();
                inputSection.style.display = 'none';
            } else if (fileInput.files.length > 0) {
                wordDisplaySection.style.display = 'block';
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

    function exportToCSV() {
        // Assuming summaryArray is your array of summary data
        /*const summaryArray = [
            { word: 'Word 1', time: 5.23 },
            { word: 'Word 2', time: 3.45 },
            // Add more objects as needed
        ];*/

        // Convert the array to CSV format
        const combinedArray = words.map((word, index) => ({word, time: elapsedTimeForEachWord[index] }));

        // Convert the combined array to CSV format
        const csvContent = combinedArray.map(entry => `${entry.word},${entry.time}`).join('\n');

        // Create a Blob and create a link to trigger the download
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.setAttribute('download', 'summary.csv');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    init();
});