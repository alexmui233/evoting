const express = require("express");
const blockchain = require("../public/js/events");
const router = express.Router();

router.get("/", blockchain.requireLogin, async (req, res) => {
  var events = [];
  var checkjoined = [];
  const t0 = performance.now();
  await blockchain.contract.methods.eventId().call().then(async function (_eventId) {
    var eventId = _eventId;
    for (var i = 0; i < eventId; i++) {
      await blockchain.contract.methods.viewevent(i).call().then(async function (_events) {
        console.log("_events.participants.includes()", _events.participants.includes(req.session.username)
        );
        events.push(_events);
        checkjoined.push(_events.participants.includes(req.session.username));
      });
    }

  });
  const t1 = performance.now();
  console.log(`Call to smart contract function took ${(t1 - t0) / 1000} seconds.`);

  res.render("allevent", {
    username: req.session.username,
    events: events,
    checkjoined: checkjoined,
  });
});

router.get("/:eid", async (req, res) => {
  var eid = req.params.eid;
  const t0 = performance.now();
  await blockchain.contract.methods.viewevent(eid).call().then(async function (joinevent) {
      if (joinevent !== null) {
        if (joinevent.owner !== req.session.username) {
          if (joinevent.state == "registration") {
            if (
              joinevent.participants.includes(req.session.username) == false
            ) {
              await blockchain.web3.eth.getAccounts().then(async function (accounts) {
                  var account;
                  for (var i = 0; i < 10; i++) {
                    if (req.session.ethaccount == accounts[i].toLowerCase()) {
                      account = accounts[i];
                      console.log(accounts[i]);
                    }
                  }
                  const t0 = performance.now();
                  await blockchain.contract.methods.joinevent(eid, req.session.username).send({ from: req.session.ethaccount, gas: 3000000 })
                    .then(console.log);
                  const t1 = performance.now();
                  console.log(
                    `Call to smart contract function took ${
                      (t1 - t0) / 1000
                    } seconds.`
                  );
                  res.redirect("/allevent");
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
    });
  const t1 = performance.now();
  console.log(
    `Call to smart contract function took ${(t1 - t0) / 1000} seconds.`
  );
});

module.exports = router;
