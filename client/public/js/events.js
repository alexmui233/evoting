/* When the user clicks on the button, toggle between hiding and showing the dropdown content */
function droplist() {
  document.getElementById("myDropdown").classList.toggle("show");
}

function copyToClipboard(element) {
  var copyText = document.getElementById("txid").innerHTML;
      navigator.clipboard.writeText(copyText);
}
var Web3 = require("web3");
const web3 = new Web3("http://127.0.0.1:8545");
// Define contract address
const fs = require('fs');
const abipath = JSON.parse(fs.readFileSync('../build/contracts/evoting.json', 'utf8'));
const smartcontractaddress = abipath.networks[5777].address;

const abi = abipath.abi;


// Load contract
const contract = new web3.eth.Contract(abi, smartcontractaddress);

/* async function getBlockNumber() {
  const latestBlockNumber = await web3.eth.getBlock('latest')
  console.log(latestBlockNumber)
  return latestBlockNumber
} */

module.exports = {web3, contract};