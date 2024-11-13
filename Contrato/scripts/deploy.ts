import { ethers } from "hardhat";

async function main() {

  const myVai = await ethers.deployContract("ValeImovel");

  await myVai.waitForDeployment();

  const address = await myVai.getAddress();

  console.log(`Deploy finished at ${address}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});