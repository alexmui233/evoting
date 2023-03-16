const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  eid: {type: Number},
  question: {type: String, required: true},
  answers: {type: Array, required: true},
  owner: {type: String, required: true},
  participants: {type: Array},
  state: {type: String, required: true}
}, {versionKey: false});

module.exports = mongoose.model('events', eventSchema);