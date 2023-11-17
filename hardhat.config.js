require("dotenv").config();
require("@nomicfoundation/hardhat-toolbox");

const account = process.env.ACCOUNT_PRIVATE_KEY || "0x0000000000000000000000000000000000000000000000000000000000000000";
module.exports = {
  solidity: {
    version: "0.8.19",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  paths: {
    artifacts: "./src",
  },
  networks: {
    zKatana: {
      url: `https://rpc.zkatana.gelato.digital`,
      accounts: [account],
    },
  },
};