import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import dotenv from "dotenv";
dotenv.config();

const config: HardhatUserConfig = {
  solidity: "0.8.24",
  networks: {

    infura: {
      url: process.env.INFURA_URL,
      accounts: [`0x${process.env.PRIVATE_KEY}`],
    },

    bnbTestnet: {
      url: process.env.INFURA_BNB,
      accounts: [`0x${process.env.PRIVATE_KEY}`],
    },

    amoy: {
      url: process.env.INFURA_AMOY,
      accounts: [`0x${process.env.PRIVATE_KEY}`],
    },
    
  },

  etherscan: {
    apiKey: process.env.API_KEY
  },

  sourcify: {
    enabled: true
  }

};

export default config;