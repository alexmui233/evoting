const express = require("express");
const blockchain = require("../public/js/events");
const tr_sign = require("../public/js/traceableringsignature");
const router = express.Router();

router.get("/", blockchain.requireLogin, async (req, res) => {
  var events = [];
  const t0 = performance.now();
  await blockchain.contract.methods.eventId().call().then(async function (_eventId) {
    var eventId = _eventId;
    for (var i = 0; i < eventId; i++) {
      await blockchain.contract.methods.viewevent(i).call().then(async function (_events) {
        if (_events.owner == req.session.username) {
          console.log("events.owner", _events.owner);
          events.push(_events);
        }
      });
    }
  });
  const t1 = performance.now();
  console.log(`Call to smart contract function took ${(t1 - t0) / 1000} seconds.`);

  res.render("mycreateevent", {
    username: req.session.username,
    events: events,
  });
});

router.get("/:eid", async (req, res) => {
  var eid = req.params.eid;

  await blockchain.contract.methods.viewevent(eid).call().then(async function(changestateevent){
    if (changestateevent !== null) {
      if (changestateevent.state == "registration") {
        await blockchain.web3.eth.getAccounts().then(async function(accounts){
          var account;
          for (var i = 0; i < 10; i++) {
            if (req.session.ethaccount == accounts[i].toLowerCase()){
              account = accounts[i];
            }
          }
          const t0 = performance.now();
          await blockchain.contract.methods.changeeventstate(eid, "voting").send({from: account, gas:3000000}).then(console.log);
          const t1 = performance.now();
          console.log(`Call to smart contract function took ${(t1 - t0) / 1000} seconds.`);
          
          var [ring, userArray] = tr_sign.myCreateRing(changestateevent.participants.length, tr_sign.g, tr_sign.G, tr_sign.q);
          /* console.log("ring_mycre: ", ring);
          console.log("userArray_mycre: ", JSON.stringify(userArray)); */

          for (let i = 0; i < userArray.length; i++) {
            /* console.log("userArray[i].x: ", userArray[i].x);
            console.log("typeof userArray[i].x: ", typeof userArray[i].x);
            console.log("userArray[i].y: ", userArray[i].y);
            console.log("typeof userArray[i].y: ", typeof userArray[i].y);
            console.log("userArray[i].id: ", userArray[i].id);
            console.log("typeof userArray[i].id: ", typeof userArray[i].id); */
            //var id_1 = userArray[i].id + 1;
            var urd_id = "eid" + eid + "participants" + userArray[i].id;
            //var urd_id = "eid" + eid + "participants" + id_1;
            //console.log("urd_id: ", urd_id);
            const t0 = performance.now();
            await blockchain.contract.methods.createuserringdetail(userArray[i].x, userArray[i].y, userArray[i].id, urd_id).send({from: account, gas:3000000}).then(console.log);
            const t1 = performance.now();
            console.log(`Call to smart contract function took ${(t1 - t0) / 1000} seconds.`);
          }
        });
      } else if (changestateevent.state == "voting") {
        await blockchain.web3.eth.getAccounts().then(async function(accounts){
          var account;
          for (var i = 0; i < 10; i++) {
            if (req.session.ethaccount == accounts[i].toLowerCase()){
              account = accounts[i];
            }
          }
          await blockchain.contract.methods.changeeventstate(eid, "result").send({from: account, gas:3000000}).then(console.log);
        });
        console.log("Change event state successful");
      } else {
        console.log("This event is not in registration and voting state");
      }
    } else {
      console.log("no event by this eid");
    }
  });
});

router.get("/result/:eid", async (req, res) => {
  var eid = req.params.eid;
  res.redirect("/result/"+eid);
});
module.exports = router;
