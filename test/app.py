import json
from web3 import Web3, HTTPProvider

# truffle development blockchain address
blockchain_address = 'http://127.0.0.1:8545'
# Client instance to interact with the blockchain
web3 = Web3(HTTPProvider(blockchain_address))
# Set the default account (so we don't need to set the "from" for every transaction call)
web3.eth.defaultAccount = web3.eth.accounts[0]

# Path to the compiled contract JSON file
compiled_contract_path = 'build/contracts/helloworld.json'
# Deployed contract address (see `migrate` command output: `contract address`)
deployed_contract_address = web3.toChecksumAddress('0xd699644AFE25F15b54f4886fc34770B3Ae1B1620')

with open(compiled_contract_path) as file:
    contract_json = json.load(file)  # load contract info as JSON
    contract_abi = contract_json['abi']  # fetch contract's abi - necessary to call its functions

# Fetch deployed contract reference
#print("contract_abi:", contract_abi)
contract = web3.eth.contract(address=deployed_contract_address, abi=contract_abi)

tx_hash2 = contract.functions.register('alex', '12345', 'alex@gmail.com').transact()
tx_receipt2 = web3.eth.wait_for_transaction_receipt(tx_hash2)
print('tx_hash2: {}'.format(tx_hash2.hex()))

''' tx_hash3 = contract.functions.login('12345').transact()
tx_receipt3 = web3.eth.wait_for_transaction_receipt(tx_hash3)
print('tx_hash3: {}'.format(tx_hash3.hex())) '''
print("check logind : ", contract.functions.checkIsUserLogged(web3.eth.defaultAccount).call())

# 1. 不知道register 左咩address? 
# 2. 不能用 msg.sender 去register
# 3. 可以用username log in?
# 4. 

