module.exports = {
    // See <http://truffleframework.com/docs/advanced/configuration>
    // to customize your Truffle configuration!
    networks: {
        ganache: {
            host: "127.0.0.1",
            port: 7545,
            network_id: "*" // Match any network id
        },
        mainnet: {
            network_id: 1,
            host: "127.0.0.1",
            port: 8545,
            gasPrice: 2000000000, // 2 gwei
            from: "0x00Db81D2d33b8Ef69a62e3b31bF769a12124C5E8" // deployer
        },
        kovan: {
            network_id: 42,
            host: "127.0.0.1",
            port: 8545,
            gasPrice: 5000000000, // 5 gwei
        }
    }
};
