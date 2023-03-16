let activeAccount;

getAccount();

async function getAccount() {
  const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
  if (accounts.length === 0) {
    console.log('Please connect to MetaMask.');// MetaMask is locked or the user has not connected any accounts
  } else if (accounts[0] !== activeAccount) {
    activeAccount = accounts[0];
    document.getElementById("ethacc").value = activeAccount;
    console.log('have MetaMask.', activeAccount);
  }
  showAccount.innerHTML = activeAccount;
}

// Update the selected account and chain id on change
ethereum.on('accountsChanged', getAccount);