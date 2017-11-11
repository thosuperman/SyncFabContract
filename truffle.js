require('babel-register') ({
  ignore: /node_modules\/(?!zeppelin-solidity)/
});
require('babel-polyfill');

module.exports = {
  networks: {
    development: {
      host: "localhost",
      port: 8545,
      // gas: 0xfffffffffff,
      gas: 6712390,
      network_id: "*" // Match any network id
    }
  }
};
