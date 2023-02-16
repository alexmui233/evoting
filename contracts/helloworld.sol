// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

contract HelloWorld {

  // address public owner = msg.sender;
  string public payload;
  // address[] allUser;
  string[] allUsername;
  uint userId;

  /* constructor() {   
    owner = msg.sender;
  } */
  struct UserDetail {
    address addr;
    string name;
    string password;
    string email;
    bool isUserLoggedIn;
  }

  UserDetail[] public allUser;
  mapping (address => uint) uid;
  mapping (uint => address) useraddr;
  mapping(address => UserDetail) user;

  function register(

    string memory _name,
    string memory _password,
    string memory _email

    ) public returns (bool) {

    allUser.push(UserDetail(msg.sender, _name, _password, _email, false));
    userId++;

    user[msg.sender].addr = msg.sender;
    user[msg.sender].name = _name;
    user[msg.sender].password = _password;
    user[msg.sender].email = _email;
    user[msg.sender].isUserLoggedIn = false;
    return true;

  }

  function login(address _addr, string memory _password)
      public returns (bool){
      if (
          keccak256(abi.encodePacked(user[_addr].password)) ==
          keccak256(abi.encodePacked(_password))
      ) {
          user[_addr].isUserLoggedIn = true;
          return user[_addr].isUserLoggedIn;
      } else {
          return false;
      }
  }
  
  function checkIsUserLogged(address _addr)
      public view returns (bool){
      return (user[_addr].isUserLoggedIn);
  }

  function logoutUser(address _addr) public {
      user[_addr].isUserLoggedIn = false;
  }
  
  function viewregisteduser() view public returns (UserDetail[] memory) {
      return allUser;
  }
}