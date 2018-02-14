module.exports =  async (promise) => {
    try {
        await promise;
    } catch (error) {
        const invalidOpcode = error.message.search('invalid opcode') > -1;
        const revert = error.message.search('revert') >= 0;
        const outOfGas = error.message.search('out of gas') > -1;
        assert(invalidOpcode || outOfGas || revert,
            `Expected throw, got ${error} instead`);
        return;
    }
    assert(false, "Expected throw wasn't received");
};
