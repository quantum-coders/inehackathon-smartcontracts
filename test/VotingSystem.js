const { expect } = require("chai");
const { ethers } = require("hardhat");
// importa nibbler
const { Nibbler } = require("../nibbler.js");

describe("VoteSystem", function () {
  let VoteSystem;
  let voteSystem;
  let owner;
  let addr1;
  let addr2;
  let addrs;
  let nibbler;

  beforeEach(async function () {
    VoteSystem = await ethers.getContractFactory("VoteSystem");

    [owner, addr1, addr2, ...addrs] = await ethers.getSigners();

    console.log("Owner address:", owner.address);
    voteSystem = await VoteSystem.deploy(owner.address);

    await voteSystem.waitForDeployment();

    nibbler = new Nibbler({
      dataBits: 8,
      codeBits: 5,
      keyString: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",
    });
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      console.log("VoteSystem owner:", owner.address);
      expect(await voteSystem.owner()).to.equal(owner.address);
    });
  });

  describe("Candidates", function () {
    it("Should add a new candidate", async function () {
      await voteSystem.addCandidate(addr1.address);
      expect(await voteSystem.candidates(addr1.address)).to.equal(1);
      expect(await voteSystem.candidateCount()).to.equal(1);
    });

    it("Should emit a CandidateAdded event", async function () {
      await expect(voteSystem.addCandidate(addr1.address))
        .to.emit(voteSystem, "CandidateAdded")
        .withArgs(1, addr1.address);
    });

    it("Should not add a candidate that already exists", async function () {
      await voteSystem.addCandidate(addr1.address);
      await expect(voteSystem.addCandidate(addr1.address)).to.be.revertedWith("Candidate already exists");
    });
  });

  describe("Voting", function () {
    beforeEach(async function () {
      await voteSystem.addCandidate(addr1.address);
    });

    it("Should cast a vote for a candidate", async function () {
      const electoralVoteEncoded = ethers.encodeBytes32String("electoralVote1");
      await voteSystem.castVote(addr1.address, electoralVoteEncoded);

      /// read if the vote returns true from the mapping
        expect(await voteSystem.hasVoted(addr1.address, electoralVoteEncoded)).to.equal(true);
    });

    it("Should emit a VoteCasted event", async function () {
      const electoralVoteEncoded = ethers.encodeBytes32String("electoralVote1");
      await expect(voteSystem.castVote(addr1.address, electoralVoteEncoded))
        .to.emit(voteSystem, "VoteCasted")
        .withArgs(owner.address, 1);
    });

    it("Should not allow voting for a non-existent candidate", async function () {
      const electoralVoteEncoded = ethers.encodeBytes32String("electoralVote2");
      await expect(voteSystem.castVote(addr2.address, electoralVoteEncoded)).to.be.revertedWith("Candidate does not exist");
    });

    it("Should not allow voting twice with the same electoral vote", async function () {
      const electoralVoteEncoded = ethers.encodeBytes32String("electoralVote2");
      await voteSystem.castVote(addr1.address, electoralVoteEncoded);
      await expect(voteSystem.castVote(addr1.address, electoralVoteEncoded)).to.be.revertedWith("Vote already casted");
    });
  });
});
