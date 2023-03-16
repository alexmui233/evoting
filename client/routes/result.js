const express = require("express");
const User = require("../models/user");
const Event = require("../models/event");
const Record = require("../models/record");
const router = express.Router();

router.get('/:eid', async (req, res) => {
  var event = await Event.findOne({eid: req.params.eid});
  var eid = req.params.eid;
  console.log("eid: ", eid);

  var totalans = await Record.countDocuments({eid: {$eq: eid}});
  console.log("totalans: ", totalans);
  var per = [];
  for (var i = 0; i < event.answers.length; i++){
    if (totalans != 0){
      var countans = await Record.countDocuments({eid: {$eq: eid}, answer: event.answers[i]});
      console.log("countans", i, ": ", countans);
      per.push((countans / totalans * 100).toFixed(2));
      console.log("per", i, ": ", per);
    } else {
      per.push(0);
      console.log("per", i, ": ", per);
    }
  }
  res.render('result', {
    username: req.session.username,
    event: event,
    totalans: totalans,
    per: per,
    metamaskaddr_err: ""});
});

module.exports = router;
