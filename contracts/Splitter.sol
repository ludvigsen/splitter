pragma solidity ^0.4.2;

contract Owned {
  address owner;

  function Owned() {
    owner = msg.sender;
  }

  modifier onlyOwner {
    require(msg.sender == owner);
    _;
  }
}

contract Killable is Owned {
  bool killed;

  function kill() onlyOwner {
    selfdestruct(owner);
  }
}

contract Splitter is Killable {
  address public bob;
  address public carol;
  mapping(address => uint) public balances;

  function Splitter(address _bob, address _carol) {
    bob = _bob;
    carol = _carol;
  }

  modifier bobOrCarol {
    require(msg.sender == bob || msg.sender == carol);
    _;
  }

  function split()
    payable
    onlyOwner
  {
    uint amount = msg.value / 2;
    uint remainder = msg.value % 2;
    balances[bob] = balances[bob] + amount;
    balances[carol] = balances[carol] + amount + remainder;
  }

  function withdraw()
    bobOrCarol
  {
    if (!msg.sender.send(balances[msg.sender])) {
      revert();
    }
    balances[msg.sender] = 0;
  }
}
