const express = require("express");
const mongoose = require('mongoose');
const keys = require('./config/keys');
const cookieSession = require('cookie-session');
const passport = require('passport');
// execytes our command to create our user model
// always declare your model first before usage within passport js
require('./models/User');
require('./services/passport');
mongoose.connect(keys.mongoURI);

var app	= express();

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

//dynamically retrived the port our app is running on
//or 5000 if one hasn't been set yet
const PORT = process.env.PORT || 5000
app.listen(PORT, function(){
    console.log("App Works Bro! Check on port: 5000");
});

