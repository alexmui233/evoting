const express = require("express");
const blockchain = require("../public/js/events");
const tr_sign = require("../public/js/traceableringsignature");
const router = express.Router();
require("request");

router.get('/:eid', blockchain.requireLogin, async (req, res) => {
  var  event;
  
  var eid = req.params.eid;
  await blockchain.contract.methods.viewevent(eid).call().then(async function(_event){
    event = _event;
  });
  res.render('vote', {
    username: req.session.username,
    event: event,
    voted_err: "",
    selectedanswer_err: "",
    metamaskaddr_err: ""});
});


router.post("/:eid", async (req, res) => {
  var metamaskaddr_err = selectedanswer_err = voted_err = "";
  var eid = req.params.eid;

  console.log("ethacc: ", req.body.ethacc);

  if (req.body.ethacc === "") {
    metamaskaddr_err = "Please connect to metamask";
  } else {
    await blockchain.contract.methods.viewalluser().call().then(async function(user){
      metamaskaddr_err = "Please use your linked metamask account";
      for (let i = 0; i < user.length; i++) {
        if (req.session.username == user[i].username && req.body.ethacc == user[i].addr){
          metamaskaddr_err = "";
        };
      }
    });
  }

  if (req.body.selectedanswer == undefined) {
    selectedanswer_err = "Please select a answer";
  } else {
    selectedanswer_err = "";
  }

  
  if (metamaskaddr_err !== "" || selectedanswer_err !== "") {
    var event;
    await blockchain.contract.methods.viewevent(req.params.eid).call().then(async function(_event){
      event = _event;
    });
    res.render("vote", {
      metamaskaddr_err: metamaskaddr_err,
      selectedanswer_err: selectedanswer_err,
      voted_err: voted_err,
      event: event,
      username: req.session.username,
    });
    console.log("redirected vote page");
  } else {

    try {
      var transactionid;
      await blockchain.web3.eth.getAccounts().then(async function(accounts){
        var account;
        for (var i = 0; i < 10; i++) {
          if (req.body.ethacc == accounts[i].toLowerCase()){
            account = accounts[i];
          }
        }
        var event;
        var pid;
        await blockchain.contract.methods.viewevent(eid).call().then(async function(_event){
          event = _event;
          pid = _event.participants.indexOf(req.session.username);
        });

        var userArray = [];
        var pKeys = [];
        await blockchain.contract.methods.viewalleventuserringdetail().call().then(async function(eventuserringdetail){
          var i_1 = 0;
          for (var i = 0; i < eventuserringdetail.length; i++){
            
            //var urd_id = "eid" + eid + "participants" + i;
            var urd_id = "eid" + eid + "participants" + i_1;
            /* console.log("urd_id: ", urd_id);
            console.log("eventuserringdetail[i].urd_id: ", eventuserringdetail[i].urd_id); */
            if (eventuserringdetail[i].urd_id == urd_id) {
              /* console.log("parseInt(eventuserringdetail[i].x): ", parseInt(eventuserringdetail[i].x));
              console.log("parseInt(eventuserringdetail[i].y): ", parseInt(eventuserringdetail[i].y));
              console.log("eventuserringdetail[i].id: ", eventuserringdetail[i].id);
              console.log("eventuserringdetail[i].urd_id: ", eventuserringdetail[i].urd_id);
 */
              userArray.push({ x: parseInt(eventuserringdetail[i].x), y: parseInt(eventuserringdetail[i].y), Pkeys: { g: tr_sign.g, y: parseInt(eventuserringdetail[i].y), G: tr_sign.G }, Skeys: { Pkeys: { g: tr_sign.g, y: parseInt(eventuserringdetail[i].y), G: tr_sign.G }, x: parseInt(eventuserringdetail[i].x) }, id: i_1 });
              console.log("userArray: ", userArray);
              pKeys.push({ Pkeys: { g: tr_sign.g, y: parseInt(eventuserringdetail[i].y), G: tr_sign.G } })
              i_1++;
            }
          }
        }); 
        
        /* console.log("pKeys: ", pKeys);
        console.log("userArray[pid]: ", userArray[pid]); */
        var message = "voted";
        var new_signature = tr_sign.Sign(message, "2", pKeys, userArray[pid], tr_sign.G, tr_sign.g, userArray);
        //console.log("userArray[pid]: ", userArray[pid]);
        //console.log("new_signature: ", new_signature);

        //console.log("pKeys.lenght: ", pKeys.length);
        var verify = tr_sign.Verify("2", pKeys, message, new_signature, tr_sign.G, tr_sign.g, userArray);
        console.log("\nVerify: ", verify)

        var ps_id = "eid" + eid + "participants" + pid;
        var old_signature;
        await blockchain.contract.methods.viewpartsign(ps_id).call().then(async function (_old_signature) {
          //console.log("_old__signature.signature", _old_signature.signature);
          old_signature = _old_signature.signature;
        });
        //console.log("old__signature", old_signature);
        var trace = tr_sign.Trace("2", pKeys, tr_sign.g, tr_sign.G, message, old_signature, message, new_signature);
        console.log("\nTrace: ", trace);
        if (verify == true && trace != "linked") {
          
          var A = new_signature[0];
          var B = new_signature[1];
          var C = new_signature[2];
          //var ps_id = "eid" + eid + "participants" + pid;
          console.log("ps_id: ", ps_id);
          const t0 = performance.now();
          await blockchain.contract.methods.addpartsign(ps_id, [A], B, C).send({from: account, gas:3000000}).then(async function () {
            //console.log("partsign", partsign);
          });
          const t1 = performance.now();
          console.log(`Call to smart contract function took ${(t1 - t0) / 1000} seconds.`);
          const t2 = performance.now();
          await blockchain.contract.methods.voting(eid, req.body.selectedanswer).send({from: account, gas:3000000}).then(async function name(trancontent) {
            console.log("trancontent", trancontent);
            console.log("trancontent.transactionHash", trancontent.transactionHash);
            transactionid = trancontent.transactionHash;
            res.render('votesuccess', { username: req.session.username, transactionid: transactionid });
          });
          const t3 = performance.now();
          console.log(`Call to smart contract function took ${(t3 - t2) / 1000} seconds.`);
          console.log("saved record!");
        } else {
          console.log("you have been voted!");
          var event;
          await blockchain.contract.methods.viewevent(req.params.eid).call().then(async function(_event){
            event = _event;
            console.log("event", event);
          });
          voted_err = "you have been voted!"
          res.render("vote", {
            metamaskaddr_err: metamaskaddr_err,
            selectedanswer_err: selectedanswer_err,
            voted_err: voted_err,
            event: event,
            username: req.session.username,
          });
        }
      });
    } catch (e) {
      console.log("error!\n", e);
    }
  }
});

module.exports = router;
