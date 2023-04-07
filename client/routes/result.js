const express = require("express");
const blockchain = require("../public/js/events");
const router = express.Router();

router.get('/:eid', blockchain.requireLogin, async (req, res) => {

  var eid = req.params.eid;
  console.log("eid: ", eid);
  var event;
  console.log("typeof eid: ", typeof eid);
  await blockchain.contract.methods.viewevent(eid).call().then(async function(_event){
    event = _event;
    console.log("event", event);
  });
  var totalans = 0;
  var per = [];

  const t0 = performance.now();
  await blockchain.contract.methods.viewallrecord().call().then(async function(records){
    for (var k = 0; k < records.length; k++) {
      if (records[k].eid == eid) {
        totalans++;
      }
    }
    
    console.log("totalans", totalans);
    
    for (var i = 0; i < event.answers.length; i++){
      if (totalans != 0){

        var countans = 0;
        for (var j = 0; j < records.length; j++) {
          if (records[j].eid == eid && records[j].answer == event.answers[i]) {
            countans++;
          }
        }
        console.log("countans", i, ": ", countans);
        per.push((countans / totalans * 100).toFixed(2));
        console.log("per", i, ": ", per);
      } else {
        per.push(0);
        console.log("per", i, ": ", per);
      }
    }
  });
  const t1 = performance.now();
  console.log(`Call to smart contract function took ${(t1 - t0) / 1000} seconds.`);
  res.render('result', {
    username: req.session.username,
    event: event,
    totalans: totalans,
    per: per,
    metamaskaddr_err: ""});
});

module.exports = router;
