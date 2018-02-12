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
        },
        kovan: {
            network_id: 42,
            host: "127.0.0.1",
            port: 8545,
        }
    }
};
