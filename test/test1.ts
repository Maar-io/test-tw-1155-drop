import  { expect } from "chai";
const ENERGY_TOKEN_ID = 0;
// const CLAIM_CONDITION_0 = [



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

    // const condition = await gachaContract.setClaimConditions(0, CLAIM_CONDITION_0, false);
  });
});
