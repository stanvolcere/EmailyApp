// Mailer.js exports a class and so has the convention captial M
const keys = require('../config/keys');
const sendGrid = require('sendgrid');

// provides us with a group of helper methods from the Sendgrid api 
const helper = sendGrid.mail;


// makes for creation of custom emails
class Mailer extends helper.Mail {
    constructor({subject, recipients}, content) {
        super();

        this.sgAPI = sendGrid(keys.sendGridKey);
        this.from_email = new helper.Email('no-reply@emaily.com');
        this.subject = subject;
        this.body = new helper.Content('text/html', content);
        this.recipients = this.formatAddresses(recipients);

        // addContent is one of the functions part of the Sendgrid helper functions
        this.addContent(this.body);
        this.addClickTracking();
        this.addRecipients(this.recipients);
    }

    // remember on the recipients object we have an email property 
    formatAddresses(recipients) {
        return recipients.map(({ email }) => {
            // the helper.Email method here is 
            return new helper.Email(email);
        });
    }

    // this allows us to track the responce from the recipients of the email
    addClickTracking() {
        const trackingSettings = new helper.TrackingSettings();
        const clickTracking = new helper.ClickTracking(true,true);

        trackingSettings.setClickTracking(clickTracking);
        this.addTrackingSettings(trackingSettings);
    }

    // sendgrid set up stuff
    addRecipients() {
        const personlize = new helper.Personalization();

        this.recipients.forEach(recipient => {
            personlize.addTo(recipient);
        });
        this.addPersonalization(personlize);
    }

    async send() {
        const request = this.sgAPI.emptyRequest({
            method: "POST",
            path: "/v3/mail/send",
            body: this.toJSON(),
        });

        const response = await this.sgAPI.API(request);
        return response;
    }
}

module.exports = Mailer;