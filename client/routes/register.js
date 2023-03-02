const express = require("express");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const router = express.Router();

router.get('/', (req, res) => {
  res.render('register', {username_err: "", email_err: "", password_err: "", confirm_password_err: "", username: ""});
});

router.get('/registersuccess', (req, res) => {
  res.render('registersuccess');
});

router.use(express.urlencoded({extended: true})); 

router.post('/', async (req, res) =>{
  var username_err = password_err = confirm_password_err = email_err = "";

  if (req.body.username == ""){
    username_err = "Please enter a username";
  }
  else {
    await User.findOne({username: req.body.username }).then(user => {
      if (user !== null){
        username_err = "This username is already taken";
      } 
      else {
        username_err = "";
      };
    });    
  };

  if (req.body.email === ""){
    email_err = "Please enter a email";
  }
  else {
    await User.findOne({email: req.body.email }).then(email => {
      if (email !== null){
        email_err = "This email is already taken";
      } 
      else {
        email_err = "";
      };
    });    
  }

  if (req.body.password === ""){
    password_err = "Please enter a password";
  }
  else if (req.body.password.length < 5) {
    password_err = "Password must have at least 5 characters";
  }

  if (req.body.confirm_password === ""){
    confirm_password_err = "Please enter a confirm password";
  }
  else if (req.body.password !== req.body.confirm_password) {
    confirm_password_err = "Password did not match";
  }

  if (username_err !== "" || email_err !== "" || password_err !== "" || confirm_password_err !== "") {

    res.render('register', {
      username_err: username_err,
      email_err: email_err,
      password_err: password_err,
      confirm_password_err: confirm_password_err
    });
    console.log("redirected register page");

  }else {
    var countuser = await User.estimatedDocumentCount();
    console.log("countuser: ", countuser);
    var user = new User({
      uid: countuser,
      username: req.body.username,
      email: req.body.email,
      password: await bcrypt.hash(req.body.password, 10)
    });
    try{
      user = await user.save();
      console.log("connected!");
      res.redirect('/register/registersuccess');
    }catch (e){
      console.log(req.body.username);
      console.log(req.body.email);
      console.log(req.body.password);
      console.log(req.body.confirm_password);
      console.log("error!\n", e);
      
    };
  };
});

module.exports = router;