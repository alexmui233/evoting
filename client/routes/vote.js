const express = require("express");
const User = require("../models/user");
const Event = require("../models/event");
const Record = require("../models/record");
const blockchain = require("../public/js/events");
const router = express.Router();
require("request");

router.get('/:eid', async (req, res) => {
  var event = await Event.findOne({eid: req.params.eid});
  var eid = req.params.eid;
  console.log("eid: ", eid);
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
    var event = await Event.findOne({eid: req.params.eid});
    res.render("vote", {
      metamaskaddr_err: metamaskaddr_err,
      selectedanswer_err: selectedanswer_err,
      event: event,
      username: req.session.username,
    });
    console.log("redirected vote page");
  } else {
    var countrecord = await Record.estimatedDocumentCount();
    console.log("countrecord: ", countrecord);
    var record = new Record({
      rid: countrecord,
      eid: eid,
      answer: req.body.selectedanswer,
    });
    try {
      await record.save();
      blockchain.web3.eth.getAccounts().then(async function(accounts){
        var account;
        for (var i = 0; i < 10; i++) {
          if (req.body.ethacc == accounts[i].toLowerCase()){
            account = accounts[i];
            console.log(accounts[i]);
          }
        }
        await blockchain.contract.methods.voting(eid, req.body.selectedanswer).send({from: account, gas:3000000}).then(console.log);
      });
      console.log("record: ", record);
      console.log("connected!");
      res.redirect("/myjoinedevent");
    } catch (e) {
      console.log("error!\n", e);
    }
  }
});

module.exports = router;
