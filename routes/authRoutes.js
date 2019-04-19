const passport = require("passport");

module.exports = (app) => {

    // just a test to ensure that the rewuest actually works
    //app.get('/', (req, res) => res.send('Live from Emaily!'));

    //this is the set up for the callback from when the 
    //user grants permission for the usage of their google authentication
    //explaied: authenticate the user that is trying to acces this /auth/google path
    app.get('/auth/google', passport.authenticate('google', {
        scope: ['profile', 'email']
    }));

    //at this point the code will be at hand for the server to use
    app.get('/auth/google/callback', passport.authenticate('google'), (req, res) =>{res.redirect("/surveys")});

    app.get('/api/current_user', (req, res) => {
        res.send(req.user);
    });

    app.get('/api/logout', (req, res) => {
        // passport automatically attacts user to the request object
        // this logout() function is also provioded by passport 
        req.logout();
        //res.send("you logged out");
        res.redirect('/');
    })
};