const mongoose = require('mongoose');

const recordSchema = new mongoose.Schema({
  rid: {type: Number},
  eid: {type: Number, required: true},
  answer: {type: String, required: true}
}, {versionKey: false});

module.exports = mongoose.model('records', recordSchema);