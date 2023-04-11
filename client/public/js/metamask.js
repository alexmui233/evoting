let activeAccount;
var countans = 1;
getAccount();

async function getAccount() {
  if (window.ethereum !== "undefined") {
    const accounts = await ethereum.request({ method: "eth_requestAccounts" });
    if (accounts.length === 0) {
      console.log("Please connect to MetaMask."); // MetaMask is locked or the user has not connected any accounts
    } else if (accounts[0] !== activeAccount) {
      activeAccount = accounts[0];
      document.getElementById("ethacc").value = activeAccount;
      console.log("have MetaMask.", activeAccount);
    }
    document.getElementById("countans").value = countans;
  }
} 

// Update the selected account and chain id on change
ethereum.on("accountsChanged", getAccount);

let form = document.forms[0];

function addField(plusElement) {
  let submitButton = document.querySelector(".spananserr");
  // Stopping the function if the input field has no value.
  if (plusElement.previousElementSibling.value.trim() === "") {
    return false;
  }

  // creating the div container.
  let div = document.createElement("div");
  div.setAttribute("class", "field");

  // Creating the input element.
  countans++;
  let input = document.createElement("input");
  input.setAttribute("type", "text");
  input.setAttribute("name", "answer" + countans);
  input.setAttribute("placeholder", "answer");

  // Creating the plus span element.
  let plus = document.createElement("span");
  plus.setAttribute("class", "spanbtn plus");
  plus.setAttribute("onclick", "addField(this)");
  let plusText = document.createTextNode("+");
  plus.appendChild(plusText);

  // Creating the minus span element.
  let minus = document.createElement("span");
  minus.setAttribute("class", "spanbtn minus");
  minus.setAttribute("style", "display:none");
  minus.setAttribute("onclick", "removeField(this)");
  let minusText = document.createTextNode("-");
  minus.appendChild(minusText);

  // Adding the elements to the DOM.
  form.insertBefore(div, submitButton);
  div.appendChild(input);
  div.appendChild(plus);
  div.appendChild(minus);

  // Un hiding the minus sign.
  plusElement.nextElementSibling.style.display = "block"; // the minus sign
  // Hiding the plus sign.
  plusElement.style.display = "none"; // the plus sign

  document.getElementById("countans").value = countans;
}

function removeField(minusElement) {
  minusElement.parentElement.remove();
}
