const express = require("express");
const Event = require("../models/event");
const Record = require("../models/record");
const router = express.Router();

router.get('/', async (req, res) => {
  var events = await Event.find({participants: {$elemMatch: {$eq: req.session.username}}});
  if (events === null){
    console.log("no event you joined");
  } 
  else {
    console.log("events: ", events);
  }

  res.render('myjoinedevent', {  
    username: req.session.username, 
    events: events
  });
})

router.get('/:eid', async (req, res) => {
  var eid = req.params.eid;
  console.log("eid: ", eid);
  var voteevent = await Event.findOne({eid: eid});
  if (voteevent !== null){
    console.log("voteevent: ", voteevent);
    res.redirect("/vote/"+eid);
    console.log("You go to vote page successfully");
  } 
  else {
    console.log("no event by this eid");
  }
});

router.get("/result/:eid", async (req, res) => {
  var eid = req.params.eid;
  console.log("eid: ", eid);
  var eventresult = await Event.findOne({ eid: eid });
  if (eventresult !== null){
    console.log("eventresult: ", eventresult);
    res.redirect("/result/"+eid);
    console.log("You go to result page successfully");
  } 
  else {
    console.log("no event by this eid");
  }
});

module.exports = router;