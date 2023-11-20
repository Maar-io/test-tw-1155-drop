import  { expect } from "chai";
import { BigNumberish, BytesLike } from "ethers";
import { ethers } from "hardhat";

const ENERGY_TOKEN_ID = 0;
// const CLAIM_CONDITION_0 = [

  
  interface ClaimCondition {
    startTimestamp: number;
    maxClaimableSupply: number;
    supplyClaimed: number;
    quantityLimitPerWallet: number;
    merkleRoot: BytesLike;
    pricePerToken: BigNumberish;
    currency: string;
    metadata: string;
  }
  // interface ClaimCondition {
  //   uint256 startTimestamp;
  //   uint256 maxClaimableSupply;
  //   uint256 supplyClaimed;
  //   uint256 quantityLimitPerWallet;
  //   bytes32 merkleRoot;
  //   uint256 pricePerToken;
  //   address currency;
  //   string metadata;
  // }

  const claimConditions: {
    _conditions: ClaimCondition[];
  } = {
    _conditions: [
      {
        startTimestamp: Math.floor(Date.now() / 1000),
        maxClaimableSupply: 100,
        supplyClaimed: 0,
        quantityLimitPerWallet: 10,
        merkleRoot: "0x0000000000000000000000000000000000000000000000000000000000000000",
        pricePerToken: ethers.parseEther("0.0"),
        currency: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
        metadata: "ipfs://QmVu98eczZRpSYcF3UKYRDkHsM2RMQR62KUYmk29UDbWTP/0",
      }
    ],
  };
  
  
  
//   {
//     type: "BigNumber",
//     hex: "0x65574bbf",
//   },
//   {
//     type: "BigNumber",
//     hex: "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff",
//   },
//   {
//     type: "BigNumber",
//     hex: "0x04",
//   },
//   {
//     type: "BigNumber",
//     hex: "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff",
//   },
//   "0x0000000000000000000000000000000000000000000000000000000000000000",
//   {
//     type: "BigNumber",
//     hex: "0x00",
//   },
//   "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
//   "ipfs://QmVu98eczZRpSYcF3UKYRDkHsM2RMQR62KUYmk29UDbWTP/0",
// ];
// const CLAIM_CONDITION_1 = [
//   {
//     type: "BigNumber",
//     hex: "0x65574bbf",
//   },
//   {
//     type: "BigNumber",
//     hex: "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff",
//   },
//   {
//     type: "BigNumber",
//     hex: "0x01",
//   },
//   {
//     type: "BigNumber",
//     hex: "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff",
//   },
//   "0x0000000000000000000000000000000000000000000000000000000000000000",
//   {
//     type: "BigNumber",
//     hex: "0x00",
//   },
//   "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
//   "ipfs://QmVu98eczZRpSYcF3UKYRDkHsM2RMQR62KUYmk29UDbWTP/0",
// ];

describe("Token contract", function () {
  it("Set claim conditions", async function () {
    const [owner] = await ethers.getSigners();
    const myContract = await ethers.getContractFactory("MyContract");

    const gachaContract = await myContract.deploy(
      owner.address,
      "Gacha",
      "GACHA",
      owner.address,
      100,
      owner.address
    );
    const ownerBalance = await gachaContract.balanceOf(
      owner.address,
      ENERGY_TOKEN_ID
    );
    expect(await gachaContract.totalSupply(ENERGY_TOKEN_ID)).to.equal(
      ownerBalance
    );

    const condition = await gachaContract.setClaimConditions(0, claimConditions._conditions[0], false);
    await condition.wait();
    const res = await gachaContract.claimCondition(0);
    console.log(res);
    const mintRes = await gachaContract.claim(0, owner.address, 1, "0x00000000)
  });
});
