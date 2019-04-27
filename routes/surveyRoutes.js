const mongoose = require('mongoose');
const _ = require('lodash');
const { Path } = require('path-parser');
const { URL } = require('url');
const requireLogin = require('../middlewares/requireLogin');
const hasCredits = require('../middlewares/hasCredits');
const Mailer = require('../services/Mailer');
const surveyTemplate = require('../services/EmailTemplates/surveyTemplate');

// side steps the issue caused by running tests
const Survey = mongoose.model('surveys');

module.exports = (app) => {

    app.get('api/surveys', (req, res) => {
        Survey.find({ });
    });

    app.post('/api/surveys/webhooks', (req, res) => {

        const p = new Path('/api/surveys/:surveyId/:choice');

        // lodash will iterate over the req.body 
        // events will look like this 
        // { email: 'stanvolcere@hotmail.com',
        // surveyId: '5cc43645732e9e27626c1ad3',
        //  choice: 'no' } 
        _.chain(req.body)
            // first extract the route of the event 
            .map(({ email, url }) => {         
                // returns null if no match is found for both surveyID and choice
                // extrtacts just the route  
                const match = p.test(new URL(url).pathname);
                if (match) {
                    return { email, surveyId: match.surveyId, choice: match.choice };
                }
            })
            // step removes the undifined ellemnts
            .compact()
            // step remove duplicates
            .uniqBy('email', 'surveyId')
            .each( ({ surveyId, email, choice }) => {
                // this is async function however it is not necessary for us to wait for it to respond beofre continuing 
                // because sendgrid need not be notified of anything having been saved 
                Survey.updateOne({
                    _id: surveyId,
                    recipients: {
                        $elemMatch: { email: email, responded: false}
                    }
                }, {
                    $inc: { [choice ]: 1},
                    $set: { 'recipients.$.responded': true},
                    lastResponded: new Date()
                }).exec();
            })
            .value();
        
        res.send({});
    });

    app.get('/api/surveys/:surveyId/:choice', (req, res) => {
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
            res.status(422).send(e);
        }
    });
};