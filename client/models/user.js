const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  uid: {type: Number},
  username: {type: String, required: true},
  email: {type: String, required: true},
  password: {type: String, required: true}
}, {versionKey: false});

module.exports = mongoose.model('users', userSchema);