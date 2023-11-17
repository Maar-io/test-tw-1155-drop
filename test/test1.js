const { expect } = require("chai");
const ENERGY_TOKEN_ID = 0;
const CLAIM_CONDITION_0 = [
  {
    type: "BigNumber",
    hex: "0x65574bbf",
  },
  {
    type: "BigNumber",
    hex: "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff",
  },
  {
    type: "BigNumber",
    hex: "0x04",
  },
  {
    type: "BigNumber",
    hex: "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff",
  },
  "0x0000000000000000000000000000000000000000000000000000000000000000",
  {
    type: "BigNumber",
    hex: "0x00",
  },
  "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
  "ipfs://QmVu98eczZRpSYcF3UKYRDkHsM2RMQR62KUYmk29UDbWTP/0",
];
const CLAIM_CONDITION_1 = [
  {
    type: "BigNumber",
    hex: "0x65574bbf",
  },
  {
    type: "BigNumber",
    hex: "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff",
  },
  {
    type: "BigNumber",
    hex: "0x01",
  },
  {
    type: "BigNumber",
    hex: "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff",
  },
  "0x0000000000000000000000000000000000000000000000000000000000000000",
  {
    type: "BigNumber",
    hex: "0x00",
  },
  "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
  "ipfs://QmVu98eczZRpSYcF3UKYRDkHsM2RMQR62KUYmk29UDbWTP/0",
];

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

    const condition = await gachaContract.setClaimConditions(0, CLAIM_CONDITION_0);
  });
});
