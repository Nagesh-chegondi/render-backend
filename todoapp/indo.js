// NOTE: This server runs on HTTP by default. Use http://localhost:3000 in your frontend fetch requests.
const express = require('express')
const app = express();
const cors = require('cors');
const info = []
     




// Handle preflight requests for all routes
app.use(cors({
  origin: 'http://localhost:5500'
}));
app.use(express.json());
app.post('/signup', function(req, res) {
    const username = req.body.username;
    const password = req.body.password;
    info.push({ username, password });
    res.send("Signup successful");
});

app.post('/signin', function(req, res) {
    const username = req.body.username;
    const password = req.body.password;
    const user = info.find(u => u.username === username && u.password === password);
    if (user) {
        res.send("Signin successful");
    } else {
        res.status(401).send("Invalid username or password");
    }
});
app.listen(3000);