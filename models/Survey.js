const mongoose = require('mongoose');
const { Schema } = mongoose;
const RecipientSchema = require('./Recipient');

// the subdocs allow for prevention of a recipient providing multiple responces

const surveySchema = new Schema({
    title: String,
    subject: String,
    body: String,
    recipients: [RecipientSchema],
    yes: {
        type: Number,
        default: 0
    },
    no: {
        type: Number,
        default: 0
    },
    _user: {
        type: Schema.Types.ObjectId,
        // ref here tells mongo to look for a collection named 
        // user to form the relationship , ie every survey belongs to a user
        ref: 'User'
    },
    // allows a cool feature of recording the last time a responce was recorded
    dateSent: Date,
    lastResponded: Date
});

mongoose.model('surveys', surveySchema);