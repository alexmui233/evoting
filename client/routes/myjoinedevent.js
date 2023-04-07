const express = require("express");
const event = require("../models/event");
const blockchain = require("../public/js/events");
const tr_sign = require("../public/js/traceableringsignature");
const router = express.Router();

router.get('/', blockchain.requireLogin, async (req, res) => {
  var events = [];
  var pid;
  var checkvoted = [];
  await blockchain.contract.methods.viewallevent().call().then(async function(_events){
    for (var i = 0; i < _events.length; i++){
      console.log("events.participants.includes()", _events[i].participants.includes(req.session.username));
      if (_events[i].participants.includes(req.session.username) == true) {
        console.log("events.participants", _events[i].participants);
        events.push(_events[i]);
        console.log("events", events);
        pid = _events[i].participants.indexOf(req.session.username);
        console.log("pid indexof: ", pid); // Output: 1

        console.log("_events[i].state: ", _events[i].state);
        if (_events[i].state == "voting" || _events[i].state == "result") {
          var userArray = [];
          var pKeys = [];
          const t0 = performance.now();
          await blockchain.contract.methods.viewalleventuserringdetail().call().then(async function(eventuserringdetail){
            var i_1 = 0;
            for (var j = 0; j < eventuserringdetail.length; j++){
              
              var urd_id = "eid" + _events[i].eid + "participants" + i_1;
              /* console.log("urd_id: ", urd_id);
              console.log("eventuserringdetail[j].urd_id: ", eventuserringdetail[j].urd_id); */
              if (eventuserringdetail[j].urd_id == urd_id) {
                /* console.log("parseInt(eventuserringdetail[j].x): ", parseInt(eventuserringdetail[j].x));
                console.log("parseInt(eventuserringdetail[j].y): ", parseInt(eventuserringdetail[j].y));
                console.log("eventuserringdetail[j].id: ", eventuserringdetail[j].id);
                console.log("eventuserringdetail[j].urd_id: ", eventuserringdetail[j].urd_id); */
      
                userArray.push({ x: parseInt(eventuserringdetail[j].x), y: parseInt(eventuserringdetail[j].y), Pkeys: { g: tr_sign.g, y: parseInt(eventuserringdetail[j].y), G: tr_sign.G }, Skeys: { Pkeys: { g: tr_sign.g, y: parseInt(eventuserringdetail[j].y), G: tr_sign.G }, x: parseInt(eventuserringdetail[j].x) }, id: i_1 });
                //console.log("userArray: ", userArray);
                pKeys.push({ Pkeys: { g: tr_sign.g, y: parseInt(eventuserringdetail[j].y), G: tr_sign.G } })
                i_1++;
              }
            }
          });
          const t1 = performance.now();
          console.log(`Call to smart contract function took ${(t1 - t0) / 1000} seconds.`);

          var ps_id = "eid" + _events[i].eid + "participants" + pid;
          var old_signature;
          const t2 = performance.now();
          await blockchain.contract.methods.viewpartsign(ps_id).call().then(async function (_old_signature) {
            //console.log("_old__signature.signature", _old_signature.signature);
            old_signature = _old_signature.signature;
          });
          const t3 = performance.now();
          console.log(`Call to smart contract function took ${(t3 - t2) / 1000} seconds.`);
          //console.log("old__signature", old_signature);
          if (old_signature.length != 0) {
            var message = "voted";
            var new_signature = tr_sign.Sign(message, "2", pKeys, userArray[pid], tr_sign.G, tr_sign.g, userArray);
            /* console.log("userArray[pid]: ", userArray[pid]);
            console.log("new_signature: ", new_signature); */

            var trace = tr_sign.Trace("2", pKeys, tr_sign.g, tr_sign.G, message, old_signature, message, new_signature);
            //console.log("\nTrace: ", trace);
            if (trace == "linked") {
              checkvoted.push(true);
            } else {
              checkvoted.push(false);
            }
          } else {
            console.log("\nnot have old signature");
            checkvoted.push(false);
          }
        } else {
          checkvoted.push(false);
        }
      }
    }
  });

  console.log("checkvoted: ", checkvoted);

  res.render('myjoinedevent', {  
    username: req.session.username, 
    events: events,
    checkvoted: checkvoted
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