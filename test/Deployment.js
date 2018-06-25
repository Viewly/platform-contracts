var VideoPublisher = artifacts.require("VideoPublisher");
var DSToken = artifacts.require("DSToken");
var DSGuard = artifacts.require("DSGuard");


contract('DSToken', function(accounts) {
    let owner = accounts[0];
    let authority = DSGuard.address;

    it("should have initial supply of 0", function() {
        return DSToken.deployed().then(function(instance) {
            return instance.totalSupply.call();
        }).then(function(supply) {
            assert.equal(
                supply.valueOf(),
                0,
                "DSToken Supply is not 0");
        });
    });
    it("should have the correct owner", function() {
        return DSToken.deployed().then(function(instance) {
            return instance.owner.call();
        }).then(function(owner_) {
            assert.equal(owner_, owner, 'Invalid owner');
        });
    });
    it("should have DSGuard authority", function() {
        return DSToken.deployed().then(function(instance) {
            return instance.authority.call();
        }).then(function(authority_) {
            assert.equal(authority_, authority, 'Invalid authority');
        });
    });
});

contract('VideoPublisher', function(accounts) {
    let owner = accounts[0];

    it("should have correct DSToken instance", function() {
        return VideoPublisher.deployed().then(function(instance) {
            return instance.viewToken.call();
        }).then(function(viewToken) {
            assert.equal(
                viewToken.valueOf(),
                DSToken.address,
                'Invalid DSToken');
        });
    });
    it("should have correct starting price", function() {
        return VideoPublisher.deployed().then(function(instance) {
            return instance.priceView.call();
        }).then(function(price) {
            assert.equal(
                price.valueOf(),
                web3.toWei(20, 'ether'),
                'Invalid starting price');
        });
    });
    it("should have correct owner", function() {
        return VideoPublisher.deployed().then(function(instance) {
            return instance.owner.call();
        }).then(function(owner_) {
            assert.equal(owner_, owner, 'Invalid owner');
        });
    });
    it("should have no authority", function() {
        return VideoPublisher.deployed().then(function(instance) {
            return instance.authority.call();
        }).then(function(authority) {
            assert.equal(
                authority.toString(),
                '0x0000000000000000000000000000000000000000',
                'Authority Set');
        });
    });
});
