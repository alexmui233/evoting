/* When the user clicks on the button, toggle between hiding and showing the dropdown content */
function droplist() {
  document.getElementById("myDropdown").classList.toggle("show");
}
var Web3 = require("web3");
const web3 = new Web3("http://127.0.0.1:8545");
// Define contract address
const smartcontractaddress = '0x5e16277c54C854a8E7436d41AFa6fb5188231b74';
const abi = [
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "allevent",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "eid",
        "type": "uint256"
      },
      {
        "internalType": "string",
        "name": "question",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "owner",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "state",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "allrecord",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "rid",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "eid",
        "type": "uint256"
      },
      {
        "internalType": "string",
        "name": "answer",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  },
  {
    "inputs": [],
    "name": "eventId",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  },
  {
    "inputs": [],
    "name": "recordId",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "_question",
        "type": "string"
      },
      {
        "internalType": "string[]",
        "name": "_answers",
        "type": "string[]"
      },
      {
        "internalType": "string",
        "name": "_owner",
        "type": "string"
      },
      {
        "internalType": "string[]",
        "name": "_a",
        "type": "string[]"
      }
    ],
    "name": "createevent",
    "outputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_eid",
        "type": "uint256"
      }
    ],
    "name": "changeeventstate",
    "outputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_eid",
        "type": "uint256"
      },
      {
        "internalType": "string",
        "name": "_name",
        "type": "string"
      }
    ],
    "name": "joinevent",
    "outputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_eid",
        "type": "uint256"
      },
      {
        "internalType": "string",
        "name": "_answer",
        "type": "string"
      }
    ],
    "name": "voting",
    "outputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_eid",
        "type": "uint256"
      }
    ],
    "name": "vieweventparticipants",
    "outputs": [
      {
        "internalType": "string[]",
        "name": "",
        "type": "string[]"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_eid",
        "type": "uint256"
      }
    ],
    "name": "viewrecord",
    "outputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  },
  {
    "inputs": [],
    "name": "viewallevent",
    "outputs": [
      {
        "components": [
          {
            "internalType": "uint256",
            "name": "eid",
            "type": "uint256"
          },
          {
            "internalType": "string",
            "name": "question",
            "type": "string"
          },
          {
            "internalType": "string[]",
            "name": "answers",
            "type": "string[]"
          },
          {
            "internalType": "string",
            "name": "owner",
            "type": "string"
          },
          {
            "internalType": "string[]",
            "name": "participants",
            "type": "string[]"
          },
          {
            "internalType": "string",
            "name": "state",
            "type": "string"
          }
        ],
        "internalType": "struct evoting.Event[]",
        "name": "",
        "type": "tuple[]"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  }
]
// Load contract
const contract = new web3.eth.Contract(abi, smartcontractaddress);

module.exports = {web3, contract};
