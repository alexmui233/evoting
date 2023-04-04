const express = require("express");
const User = require("../models/user");
const Event = require("../models/event");
const blockchain = require("../public/js/events");
const router = express.Router();

router.get("/", (req, res) => {
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
       /*  eval(
          "var " + "answer_err" + " = " + "'Please enter a answer'" + ";"
        ); */
        console.log("answer_err = Please" + answer_err);
        break;
      } else {
        answer_err = "";
        //eval("var " + "answer_err" + " = " + "''" + ";");
        console.log("answer_err = null" + answer_err);
      }
    }
    
  }

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

  if (
    question_err !== "" ||
    answer_err !== "" ||
    metamaskaddr_err !== ""
  ) {
    console.log("question_err: ", question_err);
    console.log("answer_err: ", answer_err);
    res.render("createevent", {
      question_err: question_err,
      answer_err: answer_err,
      metamaskaddr_err: metamaskaddr_err,
      username: req.session.username,
    });
    console.log("redirected createevent page");
  } else {
    //var countevent = await Event.estimatedDocumentCount();
    var answers = [];
    for (var i = 1; i <= req.body.countans; i++) {
      if (req.body["answer" + i] != undefined){
        answers.push(req.body["answer" + i]);
        console.log("answers: ", answers);
      }
    }
    /* console.log("countevent: ", countevent);
    var event = new Event({
      eid: countevent,
      question: req.body.question,
      answers: answers,
      owner: req.session.username,
      participants: [],
      state: "registration",
    }); */
    try {
      //await event.save();
      await blockchain.web3.eth.getAccounts().then(async function(accounts){
        var account;
        for (var i = 0; i < 10; i++) {
          if (req.body.ethacc == accounts[i].toLowerCase()){
            account = accounts[i];
            console.log(accounts[i]);
          }
        }
        await blockchain.contract.methods.createevent(req.body.question, answers, req.session.username).send({from: account, gas:3000000}).then(console.log);
      });

      //console.log("event: ", event);
      console.log("connected!");
      res.redirect("/mycreateevent");
    } catch (e) {
      console.log("error!\n", e);
    }
  }

});

module.exports = router;
