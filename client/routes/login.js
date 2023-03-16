const express = require("express");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const router = express.Router();

router.get('/', (req, res) => {
  res.render('login', {username_err: "", password_err: "", metamaskaddr_err: "", username: ""});
});

router.post('/', async (req, res) => {
  var username_err = password_err = metamaskaddr_err = "";

  if (req.body.username == ""){
    username_err = "Please enter a username";
  }
  else {
    await User.findOne({username: req.body.username}).then(async user => {
      if (user === null){
        username_err = "No account found with that username";
      } 
      else {
        username_err = "";
        if (req.body.ethacc == ""){
          username_err = "Please connect to metamask";
        }
        else {
          console.log("type of ethacc: ", req.body.ethacc);
          await User.findOne({username: req.body.username, address: req.body.ethacc}).then(matchacc => {
            if (matchacc === null){
              metamaskaddr_err = "No account found with that username & metamask";
            } 
            else {
              metamaskaddr_err= "";
            };
          });    
        };
      };
    });    
  };

  if (req.body.password === ""){
    password_err = "Please enter a password";
  }
  else {
    await User.findOne({username: req.body.username, address: req.body.ethacc}).then(async user => {
      if (user !== null){
        await bcrypt.compare(req.body.password, user.password).then(async result => {
          if (result == false){
            password_err = "The password you entered was not valid";
          }
          else {
            password_err = "";
            console.log("Login successful");
            req.session.username = req.body.username
            req.session.save();
            res.redirect('/index');
          };
        });
      };
    });
  }
  console.log("redirected: ", username_err);
  console.log("redirected: ", password_err);
  console.log("redirected: ", metamaskaddr_err);
  console.log("redirected login page");
  console.log("redirected login page");
  if (username_err !== "" || password_err !== "" || metamaskaddr_err !== "") {

    res.render('login', {
      username_err: username_err,
      password_err: password_err,
      metamaskaddr_err: metamaskaddr_err,
      username: ""
    });
    console.log("redirected login page");

  }
});
module.exports = router;