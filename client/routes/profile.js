const express = require("express");
const User = require("../models/user");
const router = express.Router();

router.get("/myprofile", async (req, res) => {
  var user = await User.findOne({ username: req.session.username });
  console.log("user: ", user);
  res.render("myprofile", {
    username: req.session.username,
    user: user,
  });
});

module.exports = router;
