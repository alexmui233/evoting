const express = require("express");
const bcrypt = require("bcrypt");
const blockchain = require("../public/js/events");
const router = express.Router();

router.get('/', async (req, res) => {

  res.render('register', {username_err: "", email_err: "", password_err: "", confirm_password_err: "", metamaskaddr_err: "", username: ""});
  
  
});

router.get('/registersuccess', (req, res) => {
  res.render('registersuccess', username = "");
});

router.use(express.urlencoded({extended: true})); 

router.post('/', async (req, res) =>{
  var username_err = password_err = confirm_password_err = email_err = metamaskaddr_err = "";

  console.log("ethacc: ", req.body.ethacc);

  if (req.body.username == ""){
    username_err = "Please enter a username";
  }
  else {

    await blockchain.contract.methods.viewalluser().call().then(async function(user){
        console.log("viewuser user: ", user);
        for (let i = 0; i < user.length; i++) {
          if (req.body.username == user[i].username){
            username_err = "This username is already taken";
          };
          if (req.body.ethacc == user[i].addr){
            metamaskaddr_err = "This metamask account is already taken";
          };
        }
    }); 
  };

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

  if (username_err !== "" || password_err !== "" || confirm_password_err !== "" || metamaskaddr_err !== "") {

    res.render('register', {
      username_err: username_err,
      email_err: email_err,
      password_err: password_err,
      confirm_password_err: confirm_password_err,
      metamaskaddr_err: metamaskaddr_err,
      username: ""
    });
    console.log("redirected register page");

  }else {    

    try{
      
      var hashed_password = await bcrypt.hash(req.body.password, 10);
      await blockchain.web3.eth.getAccounts().then(async function(accounts){
        var account;
        for (var i = 0; i < 10; i++) {
          if (req.body.ethacc == accounts[i].toLowerCase()){
            account = accounts[i];
            console.log(accounts[i]);
          }
        }
        const t0 = performance.now();
        await blockchain.contract.methods.createuser(req.body.username, hashed_password, req.body.ethacc).send({from: account, gas:3000000}).then(console.log);
        const t1 = performance.now();
        console.log(`Call to smart contract function took ${(t1 - t0) / 1000} seconds.`);
      });
      
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