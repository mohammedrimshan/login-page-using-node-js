const express = require('express');
const path = require('path');
const bodyParser = require("body-parser");
const session = require("express-session");
const { v4: uuidv4 } = require("uuid");
const router = require("./router");
const nocache = require('nocache');

const app = express();
const port = process.env.PORT || 3000;

// Middleware for parsing JSON and form-encoded data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Set the view engine to EJS
app.set('view engine', 'ejs');

// Serve static files
app.use('/static', express.static(path.join(__dirname, 'public')));
app.use('/assets', express.static(path.join(__dirname, 'public/assets')));

// Session setup


app.use(session({
    secret: uuidv4(), // Replace with your secret key
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Set to true if using HTTPS
}));




app.use((req, res, next) => {
    res.setHeader('Cache-Control', 'no-store');
    next();
});

// Apply nocache middleware to the login route
app.use(nocache());




// Apply nocache middleware to specific routes
router.use('/login', nocache());
router.use('/dashboard', nocache());

// Home route (login page)
// Login page route
app.get('/', (req, res) => {
    // Check if user is already logged in
    if (req.session.user) {
        res.redirect('/route/dashboard');
    } else {
        // Pass any error or logout messages through `req.query`
        const error = req.query.error || null;
        const logout = req.query.logout || null;
        res.setHeader('Cache-Control', 'no-store'); // Disable caching for login page
        res.render('base', { title: "Login System", error, logout });
    }
});

// Logout route
router.get('/logout', (req, res) => {
    req.session.destroy(function(err) {
        if (err) {
            console.log(err);
            res.send("Error");
        } else {
            // Redirect to the login page with a query parameter for logout
            res.redirect('/?logout=success');
        }
    });
});

// In router.js or a similar file
router.get('/dashboard', (req, res) => {
    if (req.session.user) {
        res.render('dashboard', { user: req.session.user }); // Render the dashboard view
    } else {
        res.redirect('/'); // Redirect to login if not authenticated
    }
});

// Use the router
app.use('/route', router);

// Listen on the specified port
app.listen(port, () => {
    console.log(`Listening on http://localhost:${port}`);
});
