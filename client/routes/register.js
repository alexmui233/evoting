const express = require("express");
const User  = require("../models/user");
const router = express.Router();

router.get('/', (req, res) => {
  res.render('register');
})

router.use(express.urlencoded({extended:true})); 
router.post('/', async (req, res) =>{
  var user = new User({
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
    confirm_password: req.body.confirm_password,
  })
  try{
    user = await user.save();
    console.log("connected!");
  }catch (e){
    console.log(req.body.username);
    console.log(req.body.email);
    console.log(req.body.password);
    console.log(req.body.confirm_password);
    console.log("error!\n", e);
    // res.render('register', {user: user});
    
  }
  
})

module.exports = router;