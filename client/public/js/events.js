/* When the user clicks on the button, toggle between hiding and showing the dropdown content */
function droplist() {
  document.getElementById("myDropdown").classList.toggle("show");
}

function copyToClipboard() {
  var copyText = document.getElementById("txid").innerHTML;
  navigator.clipboard.writeText(copyText);
}

function disablebtn() {
  const button = document.querySelector('input[type="submit"]');

  button.addEventListener('click', () => {
    button.disabled = true;
  });
}

function requireLogin(req, res, next) {
  if (req.session && req.session.username) {
    return next();
  } else {
    // redirect to login page
    res.redirect("/login");

  }
}

var Web3 = require("web3");
const web3 = new Web3(Web3.givenProvider || "http://127.0.0.1:8545");
// Define contract address
const fs = require('fs');
const abipath = JSON.parse(fs.readFileSync('../build/contracts/evoting.json', 'utf8'));
const smartcontractaddress = abipath.networks[5777].address;

const abi = abipath.abi;

// Load contract
const contract = new web3.eth.Contract(abi, smartcontractaddress);

module.exports = {web3, contract, requireLogin};