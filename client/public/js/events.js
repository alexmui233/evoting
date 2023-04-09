/* When the user clicks on the button, toggle between hiding and showing the dropdown content */
function droplist() {
  document.getElementById("myDropdown").classList.toggle("show");
}

function shownav() {
  var x = document.getElementById("navbar");
  var y = document.getElementById("dropdown");
  var z = document.getElementById("myDropdown");
  var a = document.getElementById("dropbtn");
  if (x.className === "navbar") {
    x.className += " responsive";
  } else {
    x.className = "navbar";
  }
  if (y.className === "dropdown") {
    y.className += " responsive";
  } else {
    y.className = "dropdown";
  }
  if (z.className === "dropdown-content") {
    z.className += " responsive";
  } else {
    z.className = "dropdown-content";
  }
  if (a.className === "dropbtn") {
    a.className += " responsive";
  } else {
    a.className = "dropbtn";
  }
}

function copyToClipboard() {
  var copyText = document.getElementById("txid").innerHTML;
  navigator.clipboard.writeText(copyText);
}

function disablebtn() {
  const button = document.querySelector('input[type="submit"]');

  button.addEventListener("click", () => {
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
const fs = require("fs");
const abipath = JSON.parse(
  fs.readFileSync("../build/contracts/evoting.json", "utf8")
);
const smartcontractaddress = abipath.networks[5777].address;

const abi = abipath.abi;

// Load contract
const contract = new web3.eth.Contract(abi, smartcontractaddress);

module.exports = { web3, contract, requireLogin };
