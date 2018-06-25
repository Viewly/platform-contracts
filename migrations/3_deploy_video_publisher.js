var DSToken = artifacts.require("./dappsys/DSToken.sol");
var VideoPublisher = artifacts.require("./VideoPublisher.sol");

module.exports = function(deployer, network) {
    const viewTokenAddr = (network == "mainnet") ?
        "0xf03f8d65bafa598611c3495124093c56e8f638f0" : DSToken.address;
    console.log(viewTokenAddr)
    deployer.deploy(VideoPublisher,
        viewTokenAddr,
        web3.toWei('20', 'ether'),
        web3.toWei('0.01', 'ether'))
};
