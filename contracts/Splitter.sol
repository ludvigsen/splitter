pragma solidity ^0.4.2;

contract Splitter {
  address public owner;
  address[] public splitters;

  function Splitter(address[] _splitters) {
    owner = msg.sender;
    splitters = _splitters;
  }

  modifier isOwner() {
    require(msg.sender == owner);
    _;
  }

  function split()
    payable
    isOwner
  {
    uint amount = msg.value / splitters.length;
    for(uint i = 0; i < splitters.length; i++) {
      if(!splitters[i].send(amount)) {
        revert();
      }
    }
  }
}
