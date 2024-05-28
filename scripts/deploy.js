const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();


  /// print the network
    console.log("Network:", hre.network.name);
  console.log("Deploying contracts with the account:", deployer.address);

  const baseTokenURI = "https://blockchainstarter.nyc3.digitaloceanspaces.com/inehack/";

  const VoteSystem = await hre.ethers.getContractFactory("VoteSystem");
  const voteSystem = await VoteSystem.deploy(deployer.address);

  await voteSystem.waitForDeployment()

  console.log("VoteSystem deployed to:", await voteSystem.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
