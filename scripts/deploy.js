// scripts/deploy.js

const hre = require("hardhat");

async function main() {
  // Get the contract factory
  const VoteSystem = await hre.ethers.getContractFactory("VoteSystem");

  // Get the signers
  const [deployer] = await hre.ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  // Base URI for the NFTs
  const baseTokenURI = "https://example.com/nfts/";

  // Deploy the contract
  const voteSystem = await VoteSystem.deploy(baseTokenURI);

  // Wait for the contract to be deployed
  await voteSystem.deployed();

  console.log("VoteSystem deployed to:", voteSystem.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
