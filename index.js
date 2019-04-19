const express = require("express");
const mongoose = require('mongoose');
const keys = require('./config/keys');
const cookieSession = require('cookie-session');
const passport = require('passport');
const bodyParser = require('body-parser');
// execytes our command to create our user model
// always declare your model first before usage within passport js
require('./models/User');
require('./services/passport');
mongoose.connect(keys.mongoURI);

var app	= express();

// NOTE: app.use is used whenever we wish to add a middleware which we 
// wish express to use
// bodyParser will parse any post request payload to a req.body variable
app.use(bodyParser.json());
app.use(cookieSession({
    maxAge: 30 * 24 * 60 * 60 * 1000,
    keys: [keys.cookieKey]
}));
app.use(passport.initialize());
app.use(passport.session());


//requires the arrow funtion from atheRouthes.js and immidiately
//passes the app variable as argument
// a shortcut to avoid extra/superfluous code
require('./routes/authRoutes')(app);
require('./routes/billingRoutes')(app);

if (process.env.NODE_ENV === 'production') {
    // express serves up main.js file for the bundled up react app
    app.use(express.static('client/build'));
    // express returns the 
    const path = require('path');

    // this assumes that if express doesnt have a route for the 
    // request then it'll pass it over to main.js
    // which is the React side of the application
    // the bottom is the catch all case for our routes
    app.get("*", (req, res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
    });
}

//dynamically retrived the port our app is running on
//or 5000 if one hasn't been set yet
const PORT = process.env.PORT || 5000
app.listen(PORT, function(){
    console.log("App Works Bro! Check on port: 5000");
});

