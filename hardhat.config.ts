import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import * as dotenv from "dotenv";
import "@nomicfoundation/hardhat-ethers";

dotenv.config({ path: __dirname + "/.env" });
const ACCOUNT_PRIVATE_KEY = process.env.ACCOUNT_PRIVATE_KEY || "";
console.log("PrivateKey set:", !!ACCOUNT_PRIVATE_KEY)

const config: HardhatUserConfig = {
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
        accounts: [ACCOUNT_PRIVATE_KEY]
        },
    },
};

export default config;