const mongoose = require('mongoose');
// usage of destructuring 
const { Schema } = mongoose;

const userSchema = new Schema({
    googleID: String,
    name: String
});

mongoose.model('user', userSchema);