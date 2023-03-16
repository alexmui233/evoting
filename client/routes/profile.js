const express = require("express");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const router = express.Router();

router.get("/myprofile", async (req, res) => {
  var user = await User.findOne({ username: req.session.username });
  console.log("user: ", user);
  res.render("myprofile", {
    username: req.session.username,
    user: user,
  });
});

router.get("/editprofile", async (req, res) => {
  var user = await User.findOne({ username: req.session.username });
  console.log("user: ", user);
  res.render("editprofile", {
    username: req.session.username,
    user: user,
    username_err: "",
    email_err: "",
    password_err: "",
    address_err: "",
  });
});

router.post("/", async (req, res) => {
  var username_err = (password_err = email_err = address_err = "");
  var originaluser = await User.findOne({ username: req.session.username });
  console.log("req.body.username: ", req.body.username);
  console.log("req.body.email: ", req.body.email);
  console.log("req.body.password: ", req.body.password);
  console.log("req.body.address: ", req.body.address);

  if (req.body.username == "") {
    username_err = "Please enter a username";
  } else if (req.body.username == originaluser.username) {
    username_err = "";
  } else {
    await User.findOne({ username: req.body.username }).then((user) => {
      if (user !== null) {
        username_err = "This username is already taken";
      } else {
        username_err = "";
      }
    });
  }
  console.log("req.body.email: ", req.body.email);
  if (req.body.email === "") {
    email_err = "Please enter a email";
  } else if (req.body.email == originaluser.email) {
    email_err = "";
  } else {
    await User.findOne({ email: req.body.email }).then((email) => {
      if (email !== null) {
        email_err = "This email is already taken";
      } else {
        email_err = "";
      }
    });
  }
  console.log("req.body.password: ", req.body.password);
  if (req.body.password === "") {
    password_err = "Please enter a password";
  } else if (req.body.password.length < 5) {
    password_err = "Password must have at least 5 characters";
  }
  console.log("req.body.address: ", req.body.address);
  if (req.body.address === "") {
    address_err = "Please enter a metamask account";
  } else if (req.body.address == originaluser.address) {
    address_err = "";
  } else {
    await User.findOne({
      address: req.body.address,
    }).then((matchacc) => {
      if (matchacc !== null) {
        address_err = "This metamask account is already taken";
      } else {
        address_err = "";
      }
    });
  }

  if (
    username_err !== "" ||
    email_err !== "" ||
    password_err !== "" ||
    address_err !== ""
  ) {
    console.log("address_err: ", address_err);
    res.render("editprofile", {
      username: req.session.username,
      user: originaluser,
      username_err: username_err,
      email_err: email_err,
      password_err: password_err,
      address_err: address_err,
    });
    console.log("redirected editprofile page");
  } else {
    await User.updateOne(
      { username: req.session.username },
      {
        $set: {
          username: req.body.username,
          email: req.body.email,
          password: await bcrypt.hash(req.body.password, 10),
          address: req.body.address,
        },
      }
    );
    res.redirect('/profile/myprofile');
    console.log("You edit profile successfully");
  }
});

module.exports = router;
