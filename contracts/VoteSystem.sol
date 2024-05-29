// SPDX-License-Identifier: MIT
// Compatible with OpenZeppelin Contracts ^5.0.0
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract VoteSystem is ERC721, Ownable, ERC721URIStorage {

    uint256 private _nextTokenId;

    // Events
    event VoteCasted(address indexed voter, uint256 indexed candidateId);
    event CandidateAdded(uint256 indexed candidateId, address indexed candidateAddress);

    // State variables
    mapping(bytes32 => bool) private votes; // To track who has voted
    mapping(address => uint256) public candidates; // Candidate IDs mapped to addresses
    uint256 public candidateCount; // Total number of candidates

    constructor(address initialOwner)
    ERC721("VotesMex", "VTX")
    Ownable(initialOwner)
    {}

    function safeMint(address to) public onlyOwner {
        uint256 tokenId = _nextTokenId++;
        _safeMint(to, tokenId);
    }

    function addCandidate(address candidate) public onlyOwner {
        require(candidates[candidate] == 0, "Candidate already exists");
        candidateCount++;
        candidates[candidate] = candidateCount;
        emit CandidateAdded(candidateCount, candidate);
    }

    function castVote(address candidate, bytes32 electoralVoteEncoded) public {
        require(candidates[candidate] > 0, "Candidate does not exist");
        require(!votes[keccak256(abi.encodePacked(msg.sender, candidate, electoralVoteEncoded))], "Vote already casted");
        bytes32 voteHash = keccak256(abi.encodePacked(msg.sender, candidate, electoralVoteEncoded));
        votes[voteHash] = true;
        /// increase candidate vote count:
        candidates[candidate]++;
        emit VoteCasted(msg.sender, candidates[candidate]);
    }


    function hasVoted(address candidate, bytes32 electoralVoteEncoded) public view returns (bool) {
        return votes[keccak256(abi.encodePacked(msg.sender, candidate, electoralVoteEncoded))];
    }

    function safeMint(address to, string memory uri) public onlyOwner {
        uint256 tokenId = _nextTokenId++;
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);
    }

    // The following functions are overrides required by Solidity.

    function tokenURI(uint256 tokenId)
    public
    view
    override(ERC721, ERC721URIStorage)
    returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
    public
    view
    override(ERC721, ERC721URIStorage)
    returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
