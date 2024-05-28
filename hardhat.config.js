require("@nomicfoundation/hardhat-toolbox");

/// import dotenv
require('dotenv').config();

const {AVALANCHE_PRIVATE_KEY} = process.env;


/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
    solidity: "0.8.24",
    etherscan: {
        // Your API key for Snowtrace
        // Obtain one at https://snowtrace.io/
        apiKey: process.env.STK,
    },
    /// add avalanche network
    networks: {
        avalanche: {
            url: "https://api.avax.network/ext/bc/C/rpc",
            chainId: 43114,
            accounts: [ AVALANCHE_PRIVATE_KEY ]
        },
        avalancheFuji: {
            url: "https://api.avax-test.network/ext/bc/C/rpc",
            chainId: 43113,
            accounts: [AVALANCHE_PRIVATE_KEY]

        }

    },
};
