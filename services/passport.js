const passport = require("passport");
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const keys = require('./../config/keys');
const mongoose = require('mongoose');

const User = mongoose.model('user');

passport.serializeUser((user, done) => {
    done(null, user.id);
});

// turns a user into a token to identify the user
passport.deserializeUser(async (id, done) => {
    const user = await User.findById(id);
    done(null, user);
});

//Step 1: creates a new instance of Google Passport Strategy
passport.use(new GoogleStrategy({
    clientID: keys.googleClientID,
    clientSecret: keys.googleClientSecret,
    //tells the incoming request what to do
    callbackURL: '/auth/google/callback',
    proxy: true
    }, async (accessToken, refreshToken, profile, done) => {
        try {
            const existingUser = await User.findOne({googleID: profile.id});

            if (!existingUser) {
                //creates a new instance of a user
                const newUser = await new User({googleID: profile.id, name: profile.displayName}).save();
                done(null, newUser);
            }
            done(null, existingUser);
        } catch(e) {
            console.log(e);
        }
    }
));

// you could potentially add a local strategy here