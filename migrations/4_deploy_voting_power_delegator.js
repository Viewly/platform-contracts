var VotingPowerDelegator = artifacts.require("./VotingPowerDelegator.sol");

module.exports = function(deployer, network) {
  deployer.deploy(VotingPowerDelegator);
}
