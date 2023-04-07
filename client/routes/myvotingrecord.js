const express = require("express");
const User = require("../models/user");
const blockchain = require("../public/js/events");
const router = express.Router();

router.get("/", blockchain.requireLogin, (req, res) => {
  res.render("myvotingrecord", {
    username: req.session.username,
    event: "",
    answer: "",
    transactionid_err: "",
    metamaskaddr_err: "",
  });
});

router.post('/', async (req, res) => {
  var transactionid_err = metamaskaddr_err = "";
  var txid = req.body.txid;
  console.log("txid: ", txid);
  var decodedInput = [];
  var event;
  var txObject;

  if (req.body.ethacc === "") {
    metamaskaddr_err = "Please connect to metamask";
  } else {
    await User.findOne({
      username: req.session.username,
      address: req.body.ethacc,
    }).then((matchacc) => {
      if (matchacc === null) {
        metamaskaddr_err = "Please use your linked metamask account";
      } else {
        metamaskaddr_err = "";
      }
    });
  }

  const removeFunctionSelector = (data) => {
    // Removes the function signature from the data (the first 10 characters)
    // It assumes that the `data` always has the `0x` prefix. It adds it again after removing the function signature.
    return `0x${data.substring(10)}`;
  };

  if (req.body.txid === "") {
    transactionid_err = "Please enter a transaction id";
  } else {
    await blockchain.web3.eth.getTransaction(txid).then(async function(_txObject){
      if (_txObject == null) {

        transactionid_err = "Not found match transaction id";
        console.log('transactionid_err:', transactionid_err);
      }
      else {
        txObject = _txObject;
        console.log(_txObject);
        if (req.body.ethacc == txObject.from.toLowerCase()){
          transactionid_err = "";
          decodedInput = await blockchain.web3.eth.abi.decodeParameters(['uint256', 'string'], removeFunctionSelector(txObject.input));
          console.log("eid:", decodedInput[0]);
          console.log("answer:", decodedInput[1]);
          console.log("type decodedInput[0]", typeof decodedInput[0]);
          console.log("type decodedInput[0]", typeof parseInt(decodedInput[0]));
          await blockchain.contract.methods.viewevent(decodedInput[0]).call().then(async function(_event){
            event = _event;
            console.log("can view event", event);
          });
        } else {
          transactionid_err = "This transaction is not belong to you";
        }
      }
    });

    
  }

  if (
    transactionid_err !== "" ||
    metamaskaddr_err !== ""
  ) {
    console.log("metamaskaddr_err: ", metamaskaddr_err);
    console.log("transactionid_err: ", transactionid_err);

    res.render("myvotingrecord", {
      username: req.session.username,
      event: "",
      answer: "",
      transactionid_err: transactionid_err,
      metamaskaddr_err: metamaskaddr_err
    });
    console.log("redirected myvotingrecord page");
  } else {
 
    console.log("event: ", event);

    res.render('myvotingrecord', {
      username: req.session.username,
      event: event,
      answer: decodedInput[1],
      transactionid_err: transactionid_err,
      metamaskaddr_err: metamaskaddr_err});
  }
  
});

module.exports = router;