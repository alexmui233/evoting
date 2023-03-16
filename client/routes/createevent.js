const express = require("express");
const User = require("../models/user");
const Event = require("../models/event");
const router = express.Router();

router.get('/', (req, res) => {
  res.render('createevent', {
    username: req.session.username, 
    question_err: "",
    answer1_err: "", 
    answer2_err: "",
    answer3_err: "",
    answer4_err: "",
    metamaskaddr_err: ""});
});

router.post('/', async (req, res) =>{
  var question_err = metamaskaddr_err = "";

  console.log("ethacc: ", req.body.ethacc);

  if (req.body.question == ""){
    question_err = "Please enter a question";
  }
  else {
    question_err = "";
  };

  for (var i = 1; i < 5; i++){
    if (req.body["answer" + i] == ""){
      eval("var " + "answer" + i + "_err" + " = " + "'Please enter a answer'" + ";");
    }
    else {
      eval("var " + "answer" + i + "_err" + " = " + "''" + ";");
    };
  };
  console.log("value1=" + answer1_err);
  console.log("value2=" + answer2_err);
  console.log("value3=" + answer3_err);
  console.log("value4=" + answer4_err);

  if (req.body.ethacc === "") {
    metamaskaddr_err = "Please connect to metamask";
  } else {
    await User.findOne({username: req.session.username, address: req.body.ethacc}).then(matchacc => {
      if (matchacc === null){
        metamaskaddr_err = "Please use your linked metamask account";
      } 
      else {
        metamaskaddr_err= "";
      };
    });  
  };
  
  if (question_err !== "" || answer1_err !== "" || answer2_err !== "" || answer3_err !== "" || answer4_err !== "" || metamaskaddr_err !== "") {
    console.log("question_err: ", question_err);
    res.render('createevent', {
      question_err: question_err,
      answer1_err: answer1_err, 
      answer2_err: answer2_err,
      answer3_err: answer3_err,
      answer4_err: answer4_err,
      metamaskaddr_err: metamaskaddr_err,
      username: req.session.username
    });
    console.log("redirected createevent page");
  } else {
    var countevent = await Event.estimatedDocumentCount();
    var answers = [];
    for (var i = 1; i < 5; i++){
      answers.push(req.body['answer' + i]);
    }
    console.log("countevent: ", countevent);
    var event = new Event({
      eid: countevent,
      question: req.body.question,
      answers: answers,
      owner: req.session.username,
      participants: [],
      state: "registration"
    });
    try{
      await event.save();
      console.log("event: ", event);
      console.log("connected!");
      res.redirect('/mycreateevent');
    }catch (e){
      console.log("error!\n", e);
    };
  }
});

module.exports = router;