const express = require("express");
const Event = require("../models/event");
const router = express.Router();

router.get("/", async (req, res) => {
  var events = await Event.find({ owner: req.session.username });
  if (events === null) {
    console.log("no event created by you");
  } else {
    console.log("events: ", events);
  }

  res.render("mycreateevent", {
    username: req.session.username,
    events: events,
  });
});

router.get("/:eid", async (req, res) => {
  var eid = req.params.eid;
  console.log("eid: ", eid);
  var changestateevent = await Event.findOne({ eid: eid });

  if (changestateevent !== null) {
    console.log("changestateevent: ", changestateevent);
    if (changestateevent.state == "registration") {
      await Event.updateOne({ eid: eid }, { $set: { state: "voting" } });
    } else if (changestateevent.state == "voting") {
      await Event.updateOne({ eid: eid }, { $set: { state: "result" } });
      console.log("Change event state successful");
    } else {
      console.log("This event is not in registration and voting state");
    }
  } else {
    console.log("no event by this eid");
  }

  res.redirect("/mycreateevent");
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