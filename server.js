const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const PORT = 3000;

const fs = require('fs');
const path = require('path');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.post('/upload', (req, res) => {
    const words = req.body.words;

    // Insert words into the database or process them as needed
    words.forEach(word => {
        db.run('INSERT INTO words (word) VALUES (?)', [word]);
    });

    res.status(200).send('Words received and stored in the database.');
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});


app.post('/upload-file', (req, res) => {
    const fileData = req.body.fileData;
    const filePath = path.join(__dirname, 'uploaded-files', 'word-list.txt');

    fs.writeFile(filePath, fileData, 'utf8', (err) => {
        if (err) {
            console.error(err);
            res.status(500).send('Error storing file.');
        } else {
            res.status(200).send('File received and stored on the server.');
        }
    });
});

app.get('/words-from-file', (req, res) => {
    const filePath = path.join(__dirname, 'uploaded-files', 'word-list.txt');

    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            res.status(500).send('Error reading file.');
        } else {
            const words = data.split(',');
            res.json({ words });
        }
    });
});