const express = require('express');
const fs = require('fs');
const app = express();
const router = express.Router();

/*
- Create new html file name home.html 
- add <h1> tag with message "Welcome to ExpressJs Tutorial"
- Return home.html page to the client
*/
router.get('/home', (req, res) => {
    const content = `<!DOCTYPE html>
  <html>
  <head>
      <title>ExpressJs Tutorial</title>
  </head>
  <body>
      <h1>Welcome to ExpressJs Tutorial</h1>
  </body>
  </html>`;

    fs.writeFile('home.html', content, (err) => {
        if (err) {
            console.error('Error writing HTML file:', err);
            res.status(500).send('Error writing HTML file');
        } else {
            console.log('HTML file "home.html" has been created successfully.');
            res.sendFile('home.html', { root: __dirname });
        }
    });
});

/*
- Return all details from user.json file to the client as JSON format
*/
router.get('/profile', (req, res) => {
    fs.readFile('user.json', 'utf8', (err, data) => {
        if (err) {
            console.log('Error reading file', err);
            res.status(500).json({ error: 'Error reading file' });
            return;
        }
        const userData = JSON.parse(data);
        res.json(userData);
    });
});

/*
- Modify /login router to accept username and password as query string parameters
- Read data from user.json file
- If username and password are valid, send the response as below:
    {
        status: true,
        message: "User is valid"
    }
- If the username is invalid, send the response as below:
    {
        status: false,
        message: "Username is invalid"
    }
- If the password is invalid, send the response as below:
    {
        status: false,
        message: "Password is invalid"
    }
*/
let userData;
try {
    const userDataFile = fs.readFileSync('user.json', 'utf8');
    userData = JSON.parse(userDataFile);
} catch (error) {
    console.error('Error reading user.json:', error);
    process.exit(1);
}

router.get('/login', (req, res) => {
    const { username, password } = req.query;

    // Check if username and password were provided
    if (!username || !password) {
        return res.status(400).json({
            status: false,
            message: 'Username and password are required.',
        });
    }

    // Find a user with the provided username
    const user = userData.find((u) => u.username === username);

    // If no user is found with the provided username, return an error response
    if (!user) {
        return res.status(401).json({
            status: false,
            message: 'Username is invalid.',
        });
    }

    // Check if the provided password matches the user's password
    if (user.password === password) {
        return res.json({
            status: true,
            message: 'User is valid.',
        });
    } else {
        return res.status(401).json({
            status: false,
            message: 'Password is invalid.',
        });
    }
});

/*
- Modify /logout route to accept username as a parameter and display a message
  in HTML format like <b>${username} successfully logout.<b>
*/
router.get('/logout', (req, res) => {
    const username = req.query.username;

    // Check if a username is provided
    if (!username) {
        return res.status(400).send('Username is required.');
    }

    // Generate an HTML response indicating successful logout
    const htmlResponse = `<b>${username} successfully logout.</b>`;

    // Send the HTML response
    res.send(htmlResponse);
});

app.use('/', router);

app.listen(process.env.PORT || 8081, () => {
    console.log('Web Server is listening at port ' + (process.env.PORT || 8081));
});
