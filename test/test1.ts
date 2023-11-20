import { expect } from "chai";
import { BigNumberish, BytesLike } from "ethers";
import { ethers } from "hardhat";

const ENERGY_TOKEN_ID = 0;
const BASE_TOKEN_ID = 1;
const EVOLVED_TOKEN_ID = 2;
const ETH_NATIVE_ADDRESS = "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE";

type AllowlistProof = {
  proof: string[];
  quantityLimitPerWallet: number;
  pricePerToken: BigNumberish;
  currency: string;
}

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
      pricePerToken: ethers.parseEther("0"),
      currency: ETH_NATIVE_ADDRESS,
      metadata: "ipfs://QmVu98eczZRpSYcF3UKYRDkHsM2RMQR62KUYmk29UDbWTP/0",
    }
  ],
};

describe("Token contract", function () {
  let gachaContract: any;


  beforeEach(async () => {
    const [owner] = await ethers.getSigners();
    const myContract = await ethers.getContractFactory("MyContract");
    gachaContract = await myContract.deploy(
      owner.address,
      "Gacha",
      "GACHA",
      owner.address,
      100,
      owner.address
    );
    // lazy mint energy token
    await gachaContract.lazyMint("0x01", "ipfs://QmNb8t2z16ztSg7SRfieQcBd9ARUy4Pp1XRbRsam6cG6Zg/", "0x");
    expect(await gachaContract.totalSupply(ENERGY_TOKEN_ID)).to.equal(0);

    // lazy mint base token
    await gachaContract.lazyMint("0x01", "ipfs://QmNb8t2z16ztSg7SRfieQcBd9ARUy4Pp1XRbRsam6cG6Zg/", "0x");
    expect(await gachaContract.totalSupply(BASE_TOKEN_ID)).to.equal(0);

    // lazy mint evolved token
    await gachaContract.lazyMint("0x01", "ipfs://QmNb8t2z16ztSg7SRfieQcBd9ARUy4Pp1XRbRsam6cG6Zg/", "0x");
    expect(await gachaContract.totalSupply(EVOLVED_TOKEN_ID)).to.equal(0);

    // set and verify claim conditions for token ENERGY_TOKEN_ID
    const condition0 = await gachaContract.setClaimConditions(ENERGY_TOKEN_ID, claimConditions._conditions[0], false);
    await condition0.wait();
    const res = await gachaContract.claimCondition(0);
    expect(res[6]).to.equal(ETH_NATIVE_ADDRESS);

    // set claim conditions for token BASE_TOKEN_ID
    const condition1 = await gachaContract.setClaimConditions(BASE_TOKEN_ID, claimConditions._conditions[0], false);
    await condition1.wait();

    // set claim conditions for token BASE_TOKEN_ID
    const condition2 = await gachaContract.setClaimConditions(EVOLVED_TOKEN_ID, claimConditions._conditions[0], false);
    await condition2.wait();

    await gachaContract.setEvolution(BASE_TOKEN_ID, EVOLVED_TOKEN_ID);

  });

  it("Evolution works", async function () {
    const [owner, account1, account2] = await ethers.getSigners();

    // user claims energy token
    let myAllowlistProof: AllowlistProof = {
      proof: ["0x0000000000000000000000000000000000000000000000000000000000000000"],
      quantityLimitPerWallet: 100,
      pricePerToken: ethers.parseEther("0"),
      currency: ETH_NATIVE_ADDRESS
    };
    await gachaContract.claim(account1.address, ENERGY_TOKEN_ID, "2", ETH_NATIVE_ADDRESS, 0, myAllowlistProof, "0x");
    expect(await gachaContract.totalSupply(ENERGY_TOKEN_ID)).to.equal(2);
    expect(await gachaContract.balanceOf(account1.address, ENERGY_TOKEN_ID)).to.equal(2);

    // user claims base token
    await gachaContract.claim(account1.address, BASE_TOKEN_ID, "1", ETH_NATIVE_ADDRESS, 0, myAllowlistProof, "0x");
    expect(await gachaContract.totalSupply(BASE_TOKEN_ID)).to.equal(1);
    expect(await gachaContract.balanceOf(account1.address, BASE_TOKEN_ID)).to.equal(1);

    // user claims evolved token
    await gachaContract.claim(account1.address, EVOLVED_TOKEN_ID, "1", ETH_NATIVE_ADDRESS, 0, myAllowlistProof, "0x");
    expect(await gachaContract.totalSupply(EVOLVED_TOKEN_ID)).to.equal(1);
    expect(await gachaContract.balanceOf(account1.address, EVOLVED_TOKEN_ID)).to.equal(1);
  });

  it("Fails to evolve, missing base token", async function () {
    const [owner, account1] = await ethers.getSigners();

    // user claims energy token
    let myAllowlistProof: AllowlistProof = {
      proof: ["0x0000000000000000000000000000000000000000000000000000000000000000"],
      quantityLimitPerWallet: 100,
      pricePerToken: ethers.parseEther("0"),
      currency: ETH_NATIVE_ADDRESS
    };
    await gachaContract.claim(account1.address, ENERGY_TOKEN_ID, "2", ETH_NATIVE_ADDRESS, 0, myAllowlistProof, "0x");
    expect(await gachaContract.totalSupply(ENERGY_TOKEN_ID)).to.equal(2);
    expect(await gachaContract.balanceOf(account1.address, ENERGY_TOKEN_ID)).to.equal(2);

    // user does not claim base token
    // user fails to claims evolved token
    await expect(gachaContract.claim(account1.address, EVOLVED_TOKEN_ID, "1", ETH_NATIVE_ADDRESS, 0, myAllowlistProof, "0x")
    ).to.be.revertedWith('Gacha: not a base token holders.')
    expect(await gachaContract.totalSupply(EVOLVED_TOKEN_ID)).to.equal(0);
    expect(await gachaContract.balanceOf(account1.address, EVOLVED_TOKEN_ID)).to.equal(0);
  });

  it("Fails to evolve, not enough energy tokens", async function () {
    const [owner, account1] = await ethers.getSigners();

    // user claims energy token
    let myAllowlistProof: AllowlistProof = {
      proof: ["0x0000000000000000000000000000000000000000000000000000000000000000"],
      quantityLimitPerWallet: 100,
      pricePerToken: ethers.parseEther("0"),
      currency: ETH_NATIVE_ADDRESS
    };
    await gachaContract.claim(account1.address, ENERGY_TOKEN_ID, "1", ETH_NATIVE_ADDRESS, 0, myAllowlistProof, "0x");
    expect(await gachaContract.totalSupply(ENERGY_TOKEN_ID)).to.equal(1);
    expect(await gachaContract.balanceOf(account1.address, ENERGY_TOKEN_ID)).to.equal(1);

    // user claims base token
    await gachaContract.claim(account1.address, BASE_TOKEN_ID, "1", ETH_NATIVE_ADDRESS, 0, myAllowlistProof, "0x");
    expect(await gachaContract.totalSupply(BASE_TOKEN_ID)).to.equal(1);
    expect(await gachaContract.balanceOf(account1.address, BASE_TOKEN_ID)).to.equal(1);

    // user fails to claims evolved token
    await expect(gachaContract.claim(account1.address, EVOLVED_TOKEN_ID, "1", ETH_NATIVE_ADDRESS, 0, myAllowlistProof, "0x")
    ).to.be.revertedWith('Gacha: not enough energy tokens.')
    expect(await gachaContract.totalSupply(EVOLVED_TOKEN_ID)).to.equal(0);
    expect(await gachaContract.balanceOf(account1.address, EVOLVED_TOKEN_ID)).to.equal(0);
  });

});
