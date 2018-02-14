let expectRevert = require('../helpers/expectRevert.js')

let VideoPublisher = artifacts.require("VideoPublisher")
let DSToken = artifacts.require("DSToken")
let DSGuard = artifacts.require("DSGuard")


contract('VideoPublisher', (accounts) => {
    let viewToken, instance

    // videoID's are 12 ASCII characters long
    let videoID = web3.fromAscii('YMVHa8fEPIXh')

    // buyerWithFunds has sufficient funds to publish
    // and has approved the publishing contract instance
    // to spend on his behalf
    // buywerWithoutFunds has no tokens
    // buyerWithoutAuth has tokens, but hasnt approved the instance
    let owner             = accounts[0]
    let buyerWithFunds    = accounts[1]
    let buyerWithoutAuth  = accounts[2]
    let buyerWithoutFunds = accounts[3]

    let ownerDeposit             = web3.toWei(31, 'ether')
    let buyerWithFundsDeposit    = web3.toWei(20, 'ether')
    let buyerWithoutAuthDeposit  = web3.toWei(10, 'ether')
    let buyerWithoutFundsDeposit = web3.toWei(1, 'ether')

    let price = web3.toWei(10, 'ether')

    beforeEach(async () => {
        viewToken = await DSToken.new('VIEW')
        instance = await VideoPublisher.new(viewToken.address, price)

        // due to a bug in truffle (function overloading)
        // tokens can be minted to owner account only
        await viewToken.mint(ownerDeposit)
        await viewToken.transfer(buyerWithFunds, buyerWithFundsDeposit)
        await viewToken.transfer(buyerWithoutAuth, buyerWithoutAuthDeposit)
        await viewToken.transfer(buyerWithoutFunds, buyerWithoutFundsDeposit)

        // due to a bug in truffle (function overloading)
        // approval have to be done with amounts
        await viewToken.approve(
            instance.address, web3.toWei(20, 'ether'), {from: buyerWithFunds})
    })

    describe('publish', async() => {
        it('should publish with sufficient funds and approval', async () => {
            let result = await instance.publish(videoID, {from: buyerWithFunds})

            // check if video is published
            assert.equal((await instance.videos.call(videoID)), true)

            // check if event fired properly
            assert.lengthOf(result.logs, 1);
            let event = result.logs[0];
            assert.equal(event.event, 'Published');
            assert.equal(event.args.videoID, videoID);
            assert.equal(Number(event.args.price), (await instance.price.call()));

            // check if funds were deducted/credited properly
            let remainingBlance = (await viewToken.balanceOf(buyerWithFunds)).toNumber()
            assert.equal(
                remainingBlance,
                buyerWithFundsDeposit - (await instance.price.call()).toNumber())
            assert.equal(
                (await viewToken.balanceOf(instance.address)).toNumber(),
                (await instance.price.call()).toNumber())
        })

        it('should fail if same video is published twice', async () => {
            await instance.publish(videoID, {from: buyerWithFunds})
            await expectRevert(instance.publish(videoID, {from: buyerWithFunds}))
        })

        it('should fail if user has funds but no approval', async () => {
            await expectRevert(instance.publish(videoID, {from: buyerWithoutAuth}))
        })

        it('should fail if user has insufficient funds', async () => {
            await expectRevert(instance.publish(videoID, {from: buyerWithoutFunds}))
        })
    })

    describe('setPrice', async() => {
        it('should let owner change the price', async () => {
            let newPrice = web3.toWei(20, 'ether')
            await instance.setPrice(newPrice, {from: owner})
            assert.equal((await instance.price.call()), newPrice, 'Invalid New Price')
        })
        it('should not let unauthorized user change the price', async () => {
            let newPrice = web3.toWei(20, 'ether')
            await expectRevert(instance.setPrice(newPrice, {from: buyerWithFunds}))
        })
    })

    describe('withdraw', async() => {
        it('should let owner withdraw tokens', async () => {
            await instance.publish(videoID, {from: buyerWithFunds})
            await instance.withdraw(owner, {from: owner})
            assert.equal(
                (await viewToken.balanceOf(instance.address)).toNumber(),
                web3.toWei(0, 'ether'))
            assert.equal(
                (await viewToken.balanceOf(owner)).toNumber(),
                (await instance.price.call()).toNumber())
        })
        it('should not allow unauthorized user to withdraw tokens', async () => {
            let newPrice = web3.toWei(20, 'ether')
            await expectRevert(instance.withdraw(newPrice, {from: buyerWithFunds}))
        })
    })

    describe('destruct', async() => {
        it('should let owner destruct an empty contract', async () => {
            await instance.publish(videoID, {from: buyerWithFunds})
            await instance.withdraw(owner, {from: owner})
            await instance.destruct(owner, {from: owner})
            assert.equal((await viewToken.balanceOf(owner)).toNumber(), price)
        })
        it('should not let owner destruct a contract with funds', async () => {
            await instance.publish(videoID, {from: buyerWithFunds})
            await expectRevert(instance.destruct(owner))
        })
        it('should not let unauthorized user destruct the contract', async () => {
            await expectRevert(instance.destruct(owner, {from: buyerWithFunds}))
        })
    })

})
