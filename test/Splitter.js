var Splitter = artifacts.require("../contracts/Splitter.sol");

contract('SimpleStorage', function(accounts) {

  var owner = accounts[0];
  var splitters = [accounts[1], accounts[2]];
  var contract;

  beforeEach(() => Splitter.new(splitters, {from: owner}).then((instance) => {
    contract = instance;
  }));

  it('Should be owned by owner', function() {
    return contract.owner({from: owner}).then(_owner => {
      assert.strictEqual(_owner, owner, 'Contract is not owned by owner');
    });
  });

  it('Should have correct splitters', function(){
    return contract.splitters(0, {from: owner}).then(splitter0 => {
      assert.strictEqual(splitter0, splitters[0], 'Splitters are not equal');
    });
  });

});
