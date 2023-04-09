const express = require("express");
const blockchain = require("../public/js/events");
const router = express.Router();

router.get("/myprofile", async (req, res) => {
  await blockchain.contract.methods.viewalluser().call().then(async function(user){
    for (let i = 0; i < user.length; i++) {
      if (req.session.username == user[i].username){
        res.render("myprofile", {
          username: req.session.username,
          user: user[i],
        });
      };
    }
  });
});

module.exports = router;
