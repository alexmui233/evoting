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

    Event[] public allevent;
    Record[] public allrecord;
    mapping(uint256 => Event) votingevent;
    mapping(uint256 => Record) eventresult;

    function createevent(
        string memory _question,
        string[] memory _answers,
        string memory _owner,
        string[] memory _a
    ) public returns (string memory) {
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

    function changeeventstate(uint256 _eid) public returns (string memory) {
        if (
            keccak256(abi.encodePacked(votingevent[_eid].state)) ==
            keccak256(abi.encodePacked("registration"))
        ) {
            votingevent[_eid].state = "voting";
        } else if (
            keccak256(abi.encodePacked(votingevent[_eid].state)) ==
            keccak256(abi.encodePacked("voting"))
        ) {
            votingevent[_eid].state = "result";
        }
        return votingevent[_eid].state;
    }

    function joinevent(uint256 _eid, string memory _name)
        public
        returns (string memory)
    {
        if (
            keccak256(abi.encodePacked(votingevent[_eid].state)) ==
            keccak256(abi.encodePacked("registration"))
        ) {
            for (uint256 i = 0; i < votingevent[_eid].participants.length; i++) {
                if ( keccak256(abi.encodePacked(votingevent[_eid].participants[i])) == keccak256(abi.encodePacked(_name))) {
                    return "already joined event";
                }
            }
            votingevent[_eid].participants.push(_name);
            return "join event successful";
        } else {
            return "This event is not in registration state";
        }
    }

    function voting(uint256 _eid, string memory _answer) public returns (string memory)
    {
        if (
            keccak256(abi.encodePacked(votingevent[_eid].state)) ==
            keccak256(abi.encodePacked("voting"))
        ) {

            for (uint256 i = 0; i < votingevent[_eid].answers.length; i++) {
                if ( keccak256(abi.encodePacked(votingevent[_eid].answers[i])) == keccak256(abi.encodePacked(_answer))) {
                    allrecord.push(Record(recordId, _eid, _answer));
                    eventresult[_eid].rid = recordId;
                    eventresult[_eid].eid = _eid;
                    eventresult[_eid].answer = _answer;
                    recordId++;
                    return "voting event successful";
                }
            }
            return "cannot find this answer";
        } else {
            return "This event is not in voting state";
        }
    }

    function vieweventparticipants(uint256 _eid)public view returns (string[] memory)
    {
        return (votingevent[_eid].participants);
    }

    function viewrecord(uint256 _eid) public view returns (string memory)
    {
        return (eventresult[_eid].answer);
    }

    function viewallevent() public view returns (Event[] memory) {
        return (allevent);
    }
}
