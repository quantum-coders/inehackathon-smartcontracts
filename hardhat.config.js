require("@nomicfoundation/hardhat-toolbox");
require('dotenv').config();

const {AVALANCHE_PRIVATE_KEY, SNOWTRACE_API_KEY} = process.env;

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
    solidity: "0.8.24",
    etherscan: {
        apiKey: {
            avalancheFujiTestnet: process.env.STK
        }
    },
    networks: {
        avalanche: {
            url: "https://api.avax.network/ext/bc/C/rpc",
            chainId: 43114,
            accounts: [AVALANCHE_PRIVATE_KEY]
        },
        fuji: {
            url: "https://api.avax-test.network/ext/bc/C/rpc",
            chainId: 43113,
            accounts: [AVALANCHE_PRIVATE_KEY]
        }
    },
};
