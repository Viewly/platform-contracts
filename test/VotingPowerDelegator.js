// let expectRevert = require('../helpers/expectRevert.js')

let VotingPowerDelegator = artifacts.require("VotingPowerDelegator")


contract('VotingPowerDelegator', (accounts) => {
    let instance

    let owner        = accounts[0]
    let delegator    = accounts[1]
    let beneficiary  = accounts[2]

    beforeEach(async () => {
        instance = await VotingPowerDelegator.new()
    })

    describe('delegate', async() => {
        it('should set the delegation', async () => {
            let result = await instance.delegate(beneficiary, {from: delegator})

            // check if delegation was set
            assert.equal((await instance.delegations.call(delegator)), beneficiary)

            // check if event fired properly
            assert.lengthOf(result.logs, 1);
            let event = result.logs[0];
            assert.equal(event.event, 'Delegated');
            assert.equal(event.args.delegator, delegator);
            assert.equal(event.args.beneficiary, beneficiary);
        })

        it('should unset the delegation', async () => {
            await instance.delegate(beneficiary, {from: delegator})
            await instance.delegate(0, {from: delegator})
            assert.equal((await instance.delegations.call(delegator)), 0)
        })

    })

})
