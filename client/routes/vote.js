const express = require("express");
const User = require("../models/user");
const Event = require("../models/event");
const Record = require("../models/record");
const blockchain = require("../public/js/events");
const tr_sign = require("../public/js/traceableringsignature");
const router = express.Router();
require("request");

/* router.get('/votesuccess', async (req, res) => {
  res.render('votesuccess', {username: req.session.username});
});
 */
router.get('/:eid', async (req, res) => {
  var  event;
  
  var eid = req.params.eid;
  console.log("eid: ", eid);
  await blockchain.contract.methods.viewevent(eid).call().then(async function(_event){
    event = _event;
    console.log("event", event);
  });
  res.render('vote', {
    username: req.session.username,
    event: event,
    selectedanswer_err: "",
    metamaskaddr_err: ""});
});


router.post("/:eid", async (req, res) => {
  var metamaskaddr_err = selectedanswer_err = "";
  var eid = req.params.eid;

  console.log("ethacc: ", req.body.ethacc);

  if (req.body.ethacc === "") {
    metamaskaddr_err = "Please connect to metamask";
  } else {
    await User.findOne({
      username: req.session.username,
      address: req.body.ethacc,
    }).then((matchacc) => {
      if (matchacc === null) {
        metamaskaddr_err = "Please use your linked metamask account";
      } else {
        metamaskaddr_err = "";
      }
    });
  }
  console.log("req.body.selectedanswer: ", req.body.selectedanswer);

  if (req.body.selectedanswer == undefined) {
    selectedanswer_err = "Please select a answer";
  } else {
    selectedanswer_err = "";
  }

  
  if (metamaskaddr_err !== "" || selectedanswer_err !== "") {
    console.log("metamaskaddr_err: ", metamaskaddr_err);
    console.log("selectedanswer_err: ", selectedanswer_err);
    //var event = await Event.findOne({eid: req.params.eid});
    var event;
    await blockchain.contract.methods.viewevent(req.params.eid).call().then(async function(_event){
      event = _event;
      console.log("event", event);
    });
    res.render("vote", {
      metamaskaddr_err: metamaskaddr_err,
      selectedanswer_err: selectedanswer_err,
      event: event,
      username: req.session.username,
    });
    console.log("redirected vote page");
  } else {

    try {
      var transactionid;
      blockchain.web3.eth.getAccounts().then(async function(accounts){
        var account;
        for (var i = 0; i < 10; i++) {
          if (req.body.ethacc == accounts[i].toLowerCase()){
            account = accounts[i];
            console.log(accounts[i]);
          }
        }
        var event;
        var pid;
        var partlen;
        await blockchain.contract.methods.viewevent(eid).call().then(async function(_event){
          event = _event;
          partlen = _event.participants.length;
          for (var i = 0; i < _event.participants.length; i++){
            console.log("i: ", i);
            if (_event.participants[i] == req.session.username) {
              pid = i;
              console.log("pid: ", pid);
            }
          }
        });

        var userArray = [];
        var pKeys = [];
        await blockchain.contract.methods.viewalleventuserringdetail().call().then(async function(eventuserringdetail){
          var i_1 = 1;
          for (var i = 0; i < eventuserringdetail.length; i++){
            
            //var urd_id = "eid" + eid + "participants" + i;
            var urd_id = "eid" + eid + "participants" + i_1;
            console.log("urd_id: ", urd_id);
            console.log("eventuserringdetail[i].urd_id: ", eventuserringdetail[i].urd_id);
            if (eventuserringdetail[i].urd_id == urd_id) {
              console.log("parseInt(eventuserringdetail[i].x): ", parseInt(eventuserringdetail[i].x));
              console.log("parseInt(eventuserringdetail[i].y): ", parseInt(eventuserringdetail[i].y));
              console.log("eventuserringdetail[i].id: ", eventuserringdetail[i].id);
              console.log("eventuserringdetail[i].urd_id: ", eventuserringdetail[i].urd_id);

              userArray.push({ x: parseInt(eventuserringdetail[i].x), y: parseInt(eventuserringdetail[i].y), Pkeys: { g: tr_sign.g, y: parseInt(eventuserringdetail[i].y), G: tr_sign.G }, Skeys: { Pkeys: { g: tr_sign.g, y: parseInt(eventuserringdetail[i].y), G: tr_sign.G }, x: parseInt(eventuserringdetail[i].x) }, id: i_1 });
              console.log("userArray: ", userArray);
              pKeys.push({ Pkeys: { g: tr_sign.g, y: parseInt(eventuserringdetail[i].y), G: tr_sign.G } })
              i_1++;
            }
          }
        }); 
        
        console.log("pKeys: ", pKeys);
        console.log("userArray[pid]: ", userArray[pid]);
        var signature = tr_sign.Sign("voted", "2", pKeys, userArray[pid], tr_sign.G, tr_sign.g, userArray);
        console.log("userArray[pid]: ", userArray[pid]);
        console.log("signature: ", signature);

        console.log("pKeys.lenght: ", pKeys.length);
        var verify = tr_sign.Verify("2", pKeys, "voted", signature, tr_sign.G, tr_sign.g, userArray);
        console.log("\nVerify: ", verify)

        await blockchain.contract.methods.voting(eid, req.body.selectedanswer).send({from: account, gas:3000000}).then(async function name(trancontent) {
          console.log("trancontent", trancontent);
          console.log("trancontent.transactionHash", trancontent.transactionHash);
          transactionid = trancontent.transactionHash;
          res.render('votesuccess', { username: req.session.username, transactionid: transactionid });
        });

      });
      console.log("saved record!");
    } catch (e) {
      console.log("error!\n", e);
    }
  }
});

module.exports = router;
