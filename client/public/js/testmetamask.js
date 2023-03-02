var Web3 = require("web3");
const web3 = new Web3("http://127.0.0.1:8545");
async function getBlockNumber() {
  const latestBlockNumber = await web3.eth.getBlockNumber()
  console.log("latestBlockNumber", latestBlockNumber)
  return latestBlockNumber
}

getBlockNumber()

const { ethereum } = window;
// return Boolean(ethereum && ethereum.isMetaMask);
console.log("metamask:", Boolean(ethereum && ethereum.isMetaMask));
// var ethereum = require('ethers');
// Initialise the page objects to interact with
/* const ethereumButton = document.querySelector('.enableEthereumButton');
const showAccount = document.querySelector('.showAccount');
const showChainId = document.querySelector('.showChainId'); */

// Initialise the active account and chain id
let activeAccount;
let activeChainId;

// Update the account and chain id when user clicks on button
/* ethereumButton.addEventListener('click', () => {
  getAccount();
  getChainId();
}); */
getAccount();
getChainId();
// Get the account in the window object
async function getAccount() {
  const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
  if (accounts.length === 0) {
    // MetaMask is locked or the user has not connected any accounts
    console.log('Please connect to MetaMask.');
  } else if (accounts[0] !== activeAccount) {
    activeAccount = accounts[0];
  }
  // showAccount.innerHTML = activeAccount;
  console.log('activeAccount', activeAccount);
}

// Get the connected network chainId
async function getChainId() {
    activeChainId = await ethereum.request({ method: 'eth_chainId' });
    // showChainId.innerHTML = activeChainId;
}

// Update the selected account and chain id on change
// ethereum.on('accountsChanged', getAccount);
// ethereum.on('chainChanged', getChainId);