// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

contract evoting {

    uint256 public eventId;

    struct User {
        string username;
        string password;
        string addr;
    }

    struct Event {
        uint256 eid;
        string question;
        string[] answers;
        string owner;
        string[] participants;
        string state;
    }

    struct Record {
        uint256 eid;
        string answer;
    }
    
    struct Userringdetail {
        uint256 x;
        uint256 y;
        uint256 id;
        string urd_id;
    }

    struct partsign {
        uint256[][] signature;
    }

    User[] public alluser;
    Event[] public allevent;
    Record[] public allrecord;
    Userringdetail[] public alluserringdetail;

    mapping(uint256 => Event) votingevent;
    mapping(string => partsign) eventpartsign;

    function createuser(string memory _username, string memory _password, string memory _addr) public returns (string memory) {
        alluser.push(User(_username, _password, _addr));
        return "create user successful";
    }

    function createevent(
        string memory _question,
        string[] memory _answers,
        string memory _owner
    ) public returns (string memory) {
        string[] memory _a;

        allevent.push(
            Event(eventId, _question, _answers, _owner, _a, "registration")
        );
        votingevent[eventId].eid = eventId;
        votingevent[eventId].question = _question;
        votingevent[eventId].answers = _answers;
        votingevent[eventId].owner = _owner;
        votingevent[eventId].state = "registration";
        eventId++;
        return "Create event successful";
    }

    function changeeventstate(uint256 _eid, string memory state)
        public
        returns (string memory)
    {
        votingevent[_eid].state = state;
        return votingevent[_eid].state;
    }

    function joinevent(uint256 _eid, string memory _name)
        public
        returns (string memory)
    {
        votingevent[_eid].participants.push(_name);
        return "join event successful";
    }

    function voting(uint256 _eid, string memory _answer)
        public
        returns (string memory)
    {
        allrecord.push(Record(_eid, _answer));
        return "voting event successful";
    }

    function createuserringdetail(
        uint256 _x,
        uint256 _y,
        uint256 _id,
        string memory _urd_id // eid?participants?
    ) public returns (string memory) {

        alluserringdetail.push(Userringdetail(_x, _y, _id, _urd_id));
        return "Create user ring detail successful";
    }

    function addpartsign(string memory _ps_id, uint256[] memory _a0, uint256[] memory _a1, uint256[] memory _a2) public returns (uint256[][] memory) {
        uint256[][] memory nestedArray = new uint256[][](3);
        nestedArray[0] = _a0;
        nestedArray[1] = _a1;
        nestedArray[2] = _a2;

        eventpartsign[_ps_id].signature = nestedArray;
        return eventpartsign[_ps_id].signature;
    }

    function viewalluser() public view returns (User[] memory) {
        return alluser;
    }

    function viewevent(uint256 _eid) public view returns (Event memory) {
        return (votingevent[_eid]);
    }

    function viewpartsign(string memory _ps_id) public view returns (partsign memory) {
        return (eventpartsign[_ps_id]);
    }

    function viewallrecord() public view returns (Record[] memory) {
        return (allrecord);
    }

    function viewalleventuserringdetail() public view returns (Userringdetail[] memory) {
        return (alluserringdetail);
    }
}
