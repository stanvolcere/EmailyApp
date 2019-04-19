const keys = require('../config/keys');
const requireLogin = require('../middlewares/requireLogin');
const stripe = require('stripe')(keys.stripeSecretKey);

module.exports = app => {
    
    app.post('/api/stripe', requireLogin, async (req, res) => {
        // stripe.charges.create() returns a promise
        const charge = await stripe.charges.create({
            amount: 500,
            currency: 'usd',
            description: "Five dollars for 5 Credits",
            source: req.body.id,
        });

        // whenver we use passport the current user is stored on the req.user variable
        // remember that passport is a middleware for express
        req.user.credits += 5;

        // be convention we always want the freshest instance of the user
        // returned from the save() process
        const user = await req.user.save();

        res.send(user);
    });
};