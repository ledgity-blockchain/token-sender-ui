import { expect } from 'chai';
import { parseEther } from 'ethers/lib/utils';
import { ethers } from 'hardhat';
import { Token, TokenSender } from '../typechain';

describe('TokenSender', () => {
  let owner: string, alice: string, bob: string, charlie: string;
  before(async () => {
    [owner, alice, bob, charlie] = (await ethers.getSigners()).map(
      (acc) => acc.address,
    );
  });

  let sender: TokenSender;
  let token: Token;
  beforeEach(async () => {
    sender = await (await ethers.getContractFactory('TokenSender')).deploy();
    token = await (await ethers.getContractFactory('Token')).deploy();
    await token.mint(owner, parseEther('100000'));
  });

  describe('#bulkSend', async () => {
    it('should send tokens to addresses', async () => {
      await token.approve(sender.address, 60);
      await sender.bulkSend(token.address, [alice, bob, charlie], [10, 20, 30]);
      expect(await token.balanceOf(alice)).to.eq(10);
      expect(await token.balanceOf(bob)).to.eq(20);
      expect(await token.balanceOf(charlie)).to.eq(30);
    });

    it('should revert if addresses and amounts do not match in lengths', async () => {
      await expect(sender.bulkSend(token.address, [alice, bob], [10, 20, 30]))
        .to.be.reverted;
    });

    it('should revert if necessary amount is not approved', async () => {
      await token.approve(sender.address, 10);
      await expect(
        sender.bulkSend(token.address, [alice, bob], [9, 2]),
      ).to.be.revertedWith('ERC20: transfer amount exceeds allowance');
    });
  });
});
