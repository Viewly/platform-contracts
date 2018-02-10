var DSToken = artifacts.require("./dappsys/DSToken.sol");
var VideoPublisher = artifacts.require("./VideoPublisher.sol");

module.exports = function(deployer) {
    deployer.deploy(VideoPublisher, DSToken.address, web3.toWei('10', 'ether'))
};
