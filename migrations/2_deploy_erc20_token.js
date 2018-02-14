var DSToken = artifacts.require("./dappsys/DSToken.sol");
var DSGuard = artifacts.require("./dappsys/DSGuard.sol");

module.exports = function(deployer) {
    return deployer.deploy(DSGuard)
        .then(() => deployer.deploy(DSToken, 'VIEW'))
        .then(() => DSToken.deployed())
        .then((instance) => instance.setAuthority(DSGuard.address))
}
