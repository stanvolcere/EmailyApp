const mongoose = require('mongoose');
const requireLogin = require('../middlewares/requireLogin');
const hasCredits = require('../middlewares/hasCredits');
const Mailer = require('../services/Mailer');
const surveyTemplate = require('../services/EmailTemplates/surveyTemplate');

// side steps the issue caused by running tests
const Survey = mongoose.model('surveys');

module.exports = (app) => {

    app.get('/api/surveys/thanks', (req, res) => {
        res.send("Thank you for answering!");
    });
    // remember we are allowed to have as many middleware executions 
    // they will execute in the order that they are placed 
    app.post('/api/surveys', requireLogin, hasCredits, async (req, res) => {

            // es6 destructuring
            const { title, body, subject, recipients } = req.body;

            const survey = new Survey({
                title,
                subject,
                body,                               // notice condensed es6 syntax here
                recipients: recipients.split(',').map(email => ({ email: email.trim() })),
                dateSent: Date.now(),
                // the _ indicates that this is a relationship field
                _user: req.user.id,

            }); 
            
            // send the email here
            const mailer = new Mailer(survey, surveyTemplate(survey));

        try {
            // this is an async function
            await mailer.send();

            await survey.save();
            req.user.credits -= 1;
            const user = await req.user.save();

            // theauth reducer will cathc this returned user and so update the credits in the header
            res.send(user);
        } catch(e) {
            res.status(422).send("The email info provided is incorrect");
        }
    });
};