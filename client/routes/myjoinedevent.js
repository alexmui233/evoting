const express = require("express");
const blockchain = require("../public/js/events");
const router = express.Router();

router.get('/', async (req, res) => {
  var events = [];

  await blockchain.contract.methods.viewallevent().call().then(async function(_events){
    for (var i = 0; i < _events.length; i++){
      console.log("events.participants.includes()", _events[i].participants.includes(req.session.username));
      if (_events[i].participants.includes(req.session.username) == true) {
        console.log("events.participants", _events[i].participants);
        events.push(_events[i]);
        console.log("events", events);
      }
    }
  });

  res.render('myjoinedevent', {  
    username: req.session.username, 
    events: events
  });
})

router.get('/:eid', async (req, res) => {
  var eid = req.params.eid;
  console.log("eid: ", eid);

  res.redirect("/vote/"+eid);
});

router.get("/result/:eid", async (req, res) => {
  var eid = req.params.eid;
  console.log("eid: ", eid);

  res.redirect("/result/"+eid);
});

module.exports = router;