const express = require("express");
const router = express.Router();

// Dummy credentials 
const credential = {
    email: "admin@gmail.com",
    password: "admin123",
};

// Route to render login page
router.get('/', (req, res) => {
    res.render('base', { 
        title: "Login System",
        error: req.session.error, // Pass error message to view
        logout: req.query.logout // Use query parameter for logout message
    });
    delete req.session.error;
    delete req.session.logout;
});


router.post('/login', (req, res) => {
    if (req.body.email === credential.email && req.body.password === credential.password) {
        req.session.user = req.body.email;  
        res.redirect('/route/dashboard');
    } else {
        res.redirect('/?error=' + encodeURIComponent("Invalid Username or Password"));
    }
});

// Route to handle logout
router.get('/logout', (req, res) => {
    req.session.destroy(function(err) {
        if (err) {
            console.log(err);
            res.send("Error");
        } else {
            res.redirect('/?logout=true');
        }
    });
});

module.exports = router;
