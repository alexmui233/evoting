const express = require("express");
const Event = require("../models/event");
const blockchain = require("../public/js/events");
const router = express.Router();

router.get("/", async (req, res) => {
  var events = await Event.find({});
  var checkjoined = [];
  for (var i = 0; i < events.length; i++){
    console.log("events.participants.includes()", events[i].participants.includes(req.session.username));
    checkjoined.push(events[i].participants.includes(req.session.username));
  }
  res.render("allevent", {
    username: req.session.username,
    events: events,
    checkjoined: checkjoined
  });
});

router.get("/:eid", async (req, res) => {
  var eid = req.params.eid;
  console.log("eid: ", eid);
  var joinevent = await Event.findOne({ eid: eid });

  if (joinevent !== null) {
    console.log("joinevent: ", joinevent);
    if (joinevent.owner !== req.session.username) {
      if (joinevent.state == "registration") {
        if (joinevent.participants.includes(req.session.username) == false) {
          await Event.updateOne(
            { eid: eid },
            { $push: { participants: req.session.username } }
          );
          blockchain.web3.eth.getAccounts().then(async function(accounts){
            var account;
            for (var i = 0; i < 10; i++) {
              if (req.session.ethaccount == accounts[i].toLowerCase()){
                account = accounts[i];
                console.log(accounts[i]);
              }
            }
            await blockchain.contract.methods.joinevent(eid, req.session.username).send({from: req.session.ethaccount, gas:3000000}).then(console.log);
            // await blockchain.contract.methods.vieweventparticipants(eid).call().then(console.log());
          });
          
          console.log("You join this event successfully");
        } else {
          console.log("You have been join this event");
        }
      } else {
        console.log("This event is not in registration state");
      }
    } else {
      console.log("Cannot join your own event");
    }
  } else {
    console.log("no event by this eid");
  }

  res.redirect("/allevent");

});

module.exports = router;
