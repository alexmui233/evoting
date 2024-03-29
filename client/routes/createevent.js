const express = require("express");
const blockchain = require("../public/js/events");
const router = express.Router();

router.get("/", blockchain.requireLogin, (req, res) => {

  res.render("createevent", {
    username: req.session.username,
    question_err: "",
    answer_err: "",
    metamaskaddr_err: "",
  });
});

router.post("/", async (req, res) => {
  
  console.log("ethacc: ", req.body.ethacc);

  if (req.body.question == "") {
    question_err = "Please enter a question";
  } else {
    question_err = "";
  }
  console.log("req.body.countans: ", req.body.countans);
  for (var i = 1; i <= req.body.countans; i++) {
    if (req.body["answer" + i] != undefined){
      if (req.body["answer" + i] == "") {
        answer_err = "Please enter a answer";
        break;
      } else {
        answer_err = "";
      }
    }
    
  }

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

  if (
    question_err !== "" ||
    answer_err !== "" ||
    metamaskaddr_err !== ""
  ) {
    res.render("createevent", {
      question_err: question_err,
      answer_err: answer_err,
      metamaskaddr_err: metamaskaddr_err,
      username: req.session.username,
    });
    console.log("redirected createevent page");
  } else {

    var answers = [];
    for (var i = 1; i <= req.body.countans; i++) {
      if (req.body["answer" + i] != undefined){
        answers.push(req.body["answer" + i]);
      }
    }

    try {
      
      await blockchain.web3.eth.getAccounts().then(async function(accounts){
        var account;
        for (var i = 0; i < 10; i++) {
          if (req.body.ethacc == accounts[i].toLowerCase()){
            account = accounts[i];
          }
        }
        const t0 = performance.now();
        await blockchain.contract.methods.createevent(req.body.question, answers, req.session.username).send({from: account, gas:3000000}).then(console.log);
        const t1 = performance.now();
        console.log(`Call to smart contract function took ${(t1 - t0) / 1000} seconds.`);
      });

      console.log("connected!");
      res.redirect("/mycreateevent");
    } catch (e) {
      console.log("error!\n", e);
    }
  }

});

module.exports = router;
