const express = require("express");
const blockchain = require("../public/js/events");
const router = express.Router();

router.get("/myprofile", async (req, res) => {
  const t0 = performance.now();
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
  const t1 = performance.now();
  console.log(`Call to smart contract function took ${(t1 - t0) / 1000} seconds.`);
});

module.exports = router;
