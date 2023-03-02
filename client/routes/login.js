const express = require("express");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const router = express.Router();

router.get('/', (req, res) => {
  res.render('login', {username_err: "", password_err: "", username: ""});
});

router.post('/', async (req, res) => {
  var username_err = password_err = "";

  if (req.body.username == ""){
    username_err = "Please enter a username";
  }
  else {
    await User.findOne({username: req.body.username }).then(user => {
      if (user === null){
        username_err = "No account found with that username";
      } 
      else {
        username_err = "";
      };
    });    
  };

  if (req.body.password === ""){
    password_err = "Please enter a password";
  }
  else {
    await User.findOne({username: req.body.username}).then(async user => {
      if (user !== null){
        await bcrypt.compare(req.body.password, user.password).then(result => {
          if (result == false){
            password_err = "The password you entered was not valid";
          }
          else {
            password_err = "";
            console.log("Login successful");
            req.session.username = req.body.username
            req.session.save();
            if (typeof globalThis !== 'undefined') {
              // 👉️ can use window here
              console.log('You are on the browser')
            
              // console.log(globalThis.location.href);
            
              // console.log(globalThis.location.protocol);
              const { ethereum } = globalThis;
              // return Boolean(ethereum && ethereum.isMetaMask);
              console.log("metamask:", Boolean(ethereum.isMetaMask));
            } else{
              console.log('You are not on the browser');
            }
            
            
            res.redirect('/index');
          };
        });
      };
    });
  }

  if (username_err !== "" || password_err !== "") {

    res.render('login', {
      username_err: username_err,
      password_err: password_err,
      username: ""
    });
    console.log("redirected login page");

  }
});
module.exports = router;