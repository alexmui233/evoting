const express = require("express");
const bcrypt = require("bcrypt");
const blockchain = require("../public/js/events");
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
    await blockchain.contract.methods.viewalluser().call().then(async function(user){
      username_err = "No account found with that username";
      for (let i = 0; i < user.length; i++) {
        if (req.body.username == user[i].username){
          username_err = "";
          if (req.body.ethacc == ""){
            metamaskaddr_err = "Please connect to metamask";
          }
          else {
            if (req.body.ethacc == user[i].addr){
              metamaskaddr_err= "";
            } 
            else {
              metamaskaddr_err = "No account found with that username & metamask";
            };
          };
        };
      }
    });
  };

  if (req.body.password === ""){
    password_err = "Please enter a password";
  }
  else {
    await blockchain.contract.methods.viewalluser().call().then(async function(user){
      for (let i = 0; i < user.length; i++) {
        if (req.body.username == user[i].username && req.body.ethacc == user[i].addr){
          await bcrypt.compare(req.body.password, user[i].password).then(async result => {
            if (result == false){
              password_err = "The password you entered was not valid";
            }
            else {
              password_err = "";
              console.log("Login successful");
              req.session.username = req.body.username;
              req.session.ethaccount = req.body.ethacc;
              req.session.save();
              res.redirect('/index');
            };
          });
        };
      }
    });
  }
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