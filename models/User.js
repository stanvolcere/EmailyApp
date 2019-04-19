const mongoose = require('mongoose');
// usage of destructuring 
const { Schema } = mongoose;

const userSchema = new Schema({
    googleID: String,
    name: String,
    credits: {
        type: Number,
        default: 0
    }
});

mongoose.model('user', userSchema);