// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

contract evoting {

    uint256 public eventId;
    uint256 public recordId;

    struct Event {
        uint256 eid;
        string question;
        string[] answers;
        string owner;
        string[] participants;
        string state;
    }

    struct Record {
        uint256 rid;
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

    Event[] public allevent;
    Record[] public allrecord;
    Userringdetail[] public alluserringdetail;

    mapping(uint256 => Event) votingevent;
    mapping(uint256 => Record) eventrecord;
    mapping(string => Userringdetail) eventuserringdetail;
    mapping(string => partsign) eventpartsign;

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
        allrecord.push(Record(recordId, _eid, _answer));
        eventrecord[_eid].rid = recordId;
        eventrecord[_eid].eid = _eid;
        eventrecord[_eid].answer = _answer;
        recordId++;
        return "voting event successful";
    }

    function createuserringdetail(
        uint256 _x,
        uint256 _y,
        uint256 _id,
        string memory _urd_id // eid?participants?
    ) public returns (string memory) {

        alluserringdetail.push(
            Userringdetail(_x, _y, _id, _urd_id)
        );
        eventuserringdetail[_urd_id].x = _x;
        eventuserringdetail[_urd_id].y = _y;
        eventuserringdetail[_urd_id].id = _id;
        eventuserringdetail[_urd_id].urd_id = _urd_id;

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

    function viewevent(uint256 _eid) public view returns (Event memory) {
        return (votingevent[_eid]);
    }

    function viewpartsign(string memory _ps_id) public view returns (partsign memory) {
        return (eventpartsign[_ps_id]);
    }

    function viewallevent() public returns (Event[] memory) {
        delete allevent;
        for (uint256 eid = 0; eid < eventId; eid++) {
            allevent.push(
                Event(
                    votingevent[eid].eid,
                    votingevent[eid].question,
                    votingevent[eid].answers,
                    votingevent[eid].owner,
                    votingevent[eid].participants,
                    votingevent[eid].state
                )
            );
        }
        return (allevent);
    }

    function viewallrecord() public view returns (Record[] memory) {
        return (allrecord);
    }

    function viewalleventuserringdetail() public view returns (Userringdetail[] memory) {
        return (alluserringdetail);
    }
}
