import {ethers} from 'hardhat';
import {Signer, ContractFactory, Contract} from 'ethers';

import {expect} from 'chai';
import constants from '../testHelpers/constants';

import Users from '../testHelpers/users';
import Utils from '../testHelpers/utils';
import UtilsBuilder from '../testHelpers/utilsBuilder';

let utils: Utils;

const BN = ethers.BigNumber.from;

import {
  ERC1155NonTransferable,
  Gate,
  BosonRouter,
  ERC1155ERC721,
  VoucherKernel,
  Cashier,
  TokenRegistry,
  MockERC20Permit,
} from '../typechain';

let ERC1155NonTransferable_Factory: ContractFactory;
let Gate_Factory: ContractFactory;
let BosonRouter_Factory: ContractFactory;
let ERC1155ERC721_Factory: ContractFactory;
let VoucherKernel_Factory: ContractFactory;
let Cashier_Factory: ContractFactory;
let TokenRegistry_Factory: ContractFactory;
let MockERC20Permit_Factory: ContractFactory;

import revertReasons from '../testHelpers/revertReasons';
import * as eventUtils from '../testHelpers/events';
import {eventNames} from '../testHelpers/events';

let users;

describe('Gate contract', async () => {
  before(async () => {
    const signers: Signer[] = await ethers.getSigners();
    users = new Users(signers);

    ERC1155NonTransferable_Factory = await ethers.getContractFactory(
      'ERC1155NonTransferable'
    );

    Gate_Factory = await ethers.getContractFactory('Gate');

    ERC1155ERC721_Factory = await ethers.getContractFactory('ERC1155ERC721');
    VoucherKernel_Factory = await ethers.getContractFactory('VoucherKernel');
    Cashier_Factory = await ethers.getContractFactory('Cashier');
    BosonRouter_Factory = await ethers.getContractFactory('BosonRouter');
    TokenRegistry_Factory = await ethers.getContractFactory('TokenRegistry');
    MockERC20Permit_Factory = await ethers.getContractFactory(
      'MockERC20Permit'
    );
  });

  let contractERC1155NonTransferable: ERC1155NonTransferable,
    contractGate: Gate,
    contractERC1155ERC721: ERC1155ERC721,
    contractVoucherKernel: VoucherKernel,
    contractCashier: Cashier,
    contractBosonRouter: BosonRouter,
    contractTokenRegistry: TokenRegistry,
    contractBSNTokenPrice: MockERC20Permit,
    contractBSNTokenDeposit: MockERC20Permit;

  async function deployContracts() {
    contractERC1155NonTransferable = (await ERC1155NonTransferable_Factory.deploy(
      'https://token-cdn-domain/{id}.json'
    )) as Contract & ERC1155NonTransferable;
    const routerAddress =
      (contractBosonRouter && contractBosonRouter.address) ||
      users.other1.address; // if router is not initalized use mock address
    contractGate = (await Gate_Factory.deploy(routerAddress)) as Contract &
      Gate;

    await contractERC1155NonTransferable.deployed();
    await contractGate.deployed();
  }

  async function deployBosonRouterContracts() {
    const sixtySeconds = 60;

    contractTokenRegistry = (await TokenRegistry_Factory.deploy()) as Contract &
      TokenRegistry;
    contractERC1155ERC721 = (await ERC1155ERC721_Factory.deploy()) as Contract &
      ERC1155ERC721;
    contractVoucherKernel = (await VoucherKernel_Factory.deploy(
      contractERC1155ERC721.address
    )) as Contract & VoucherKernel;
    contractCashier = (await Cashier_Factory.deploy(
      contractVoucherKernel.address
    )) as Contract & Cashier;
    contractBosonRouter = (await BosonRouter_Factory.deploy(
      contractVoucherKernel.address,
      contractTokenRegistry.address,
      contractCashier.address
    )) as Contract & BosonRouter;
    contractBSNTokenPrice = (await MockERC20Permit_Factory.deploy(
      'BosonTokenPrice',
      'BPRC'
    )) as Contract & MockERC20Permit;

    contractBSNTokenDeposit = (await MockERC20Permit_Factory.deploy(
      'BosonTokenDeposit',
      'BDEP'
    )) as Contract & MockERC20Permit;

    await contractTokenRegistry.deployed();
    await contractERC1155ERC721.deployed();
    await contractVoucherKernel.deployed();
    await contractCashier.deployed();
    await contractBosonRouter.deployed();
    await contractBSNTokenPrice.deployed();
    await contractBSNTokenDeposit.deployed();

    await contractERC1155ERC721.setApprovalForAll(
      contractVoucherKernel.address,
      true
    );
    await contractERC1155ERC721.setVoucherKernelAddress(
      contractVoucherKernel.address
    );

    await contractERC1155ERC721.setCashierAddress(contractCashier.address);

    await contractVoucherKernel.setBosonRouterAddress(
      contractBosonRouter.address
    );
    await contractVoucherKernel.setCashierAddress(contractCashier.address);

    await contractCashier.setBosonRouterAddress(contractBosonRouter.address);
    await contractCashier.setTokenContractAddress(
      contractERC1155ERC721.address
    );

    await contractVoucherKernel.setComplainPeriod(sixtySeconds);
    await contractVoucherKernel.setCancelFaultPeriod(sixtySeconds);

    await contractTokenRegistry.setTokenLimit(
      contractBSNTokenPrice.address,
      constants.TOKEN_LIMIT
    );
    await contractTokenRegistry.setTokenLimit(
      contractBSNTokenDeposit.address,
      constants.TOKEN_LIMIT
    );
    await contractTokenRegistry.setETHLimit(constants.ETHER_LIMIT);

    //Map $BOSON token to itself so that the token address can be called by casting to the wrapper interface in the Boson Router
    await contractTokenRegistry.setTokenWrapperAddress(
      contractBSNTokenPrice.address,
      contractBSNTokenPrice.address
    );

    await contractTokenRegistry.setTokenWrapperAddress(
      contractBSNTokenDeposit.address,
      contractBSNTokenDeposit.address
    );
  }

  async function registerVoucherSetIdFromBosonProtocol(
    gate,
    conditionalOrderNftTokenID
  ) {
    await contractERC1155NonTransferable.mint(
      users.buyer.address,
      constants.NFT_TOKEN_ID,
      constants.ONE,
      constants.ZERO_BYTES
    );

    await gate.setNonTransferableTokenContract(
      contractERC1155NonTransferable.address
    );
    await gate.setBosonRouterAddress(contractBosonRouter.address);

    utils = await UtilsBuilder.create()
      .ERC20withPermit()
      .TKNTKN()
      .buildAsync(
        contractERC1155ERC721,
        contractVoucherKernel,
        contractCashier,
        contractBosonRouter,
        contractBSNTokenPrice,
        contractBSNTokenDeposit
      );

    const timestamp = await Utils.getCurrTimestamp();
    // timestamp
    constants.PROMISE_VALID_FROM = timestamp;
    constants.PROMISE_VALID_TO = timestamp + 2 * constants.SECONDS_IN_DAY;

    const tokensToMint = BN(constants.product_price).mul(BN(constants.QTY_20));

    await utils.mintTokens(
      'contractBSNTokenDeposit',
      users.seller.address,
      tokensToMint
    );
    await utils.mintTokens(
      'contractBSNTokenPrice',
      users.buyer.address,
      tokensToMint
    );
    await utils.mintTokens(
      'contractBSNTokenDeposit',
      users.buyer.address,
      tokensToMint
    );

    const txOrder = await utils.createOrderConditional(
      users.seller,
      timestamp,
      timestamp + constants.SECONDS_IN_DAY,
      constants.product_price,
      constants.seller_deposit,
      constants.buyer_deposit,
      constants.QTY_10,
      gate,
      conditionalOrderNftTokenID,
      true
    );

    const txReceipt = await txOrder.wait();

    let eventArgs;

    eventUtils.assertEventEmitted(
      txReceipt,
      BosonRouter_Factory,
      eventNames.LOG_ORDER_CREATED,
      (e) => (eventArgs = e)
    );

    const tokenId = eventArgs._tokenIdSupply;
    return {tokenId, nftTokenID: constants.NFT_TOKEN_ID};
  }

  describe('Basic operations', () => {
    beforeEach(async () => {
      await deployContracts();
    });

    it('Owner should be able set ERC1155 contract address', async () => {
      expect(
        await contractGate.setNonTransferableTokenContract(
          contractERC1155NonTransferable.address
        )
      )
        .to.emit(contractGate, eventNames.LOG_NON_TRANSFERABLE_CONTRACT)
        .withArgs(
          contractERC1155NonTransferable.address,
          users.deployer.address
        );
    });

    it('One should be able get ERC1155 contract address', async () => {
      await contractGate.setNonTransferableTokenContract(
        contractERC1155NonTransferable.address
      );

      expect(await contractGate.getNonTransferableTokenContract()).to.equal(
        contractERC1155NonTransferable.address
      );
    });

    it('Owner should be able to register voucher set id', async () => {
      expect(
        await contractGate.registerVoucherSetId(
          constants.VOUCHER_SET_ID,
          constants.NFT_TOKEN_ID
        )
      )
        .to.emit(contractGate, eventNames.LOG_VOUCHER_SET_REGISTERED)
        .withArgs(constants.VOUCHER_SET_ID, constants.NFT_TOKEN_ID);
    });

    it('One should be able to look up on which NFT depends voucher set', async () => {
      await contractGate.registerVoucherSetId(
        constants.VOUCHER_SET_ID,
        constants.NFT_TOKEN_ID
      );
      expect(
        await contractGate.getNftTokenId(constants.VOUCHER_SET_ID)
      ).to.equal(constants.NFT_TOKEN_ID);
    });

    it('check function works correctly', async () => {
      await contractGate.registerVoucherSetId(
        constants.VOUCHER_SET_ID,
        constants.NFT_TOKEN_ID
      );

      await contractGate.setNonTransferableTokenContract(
        contractERC1155NonTransferable.address
      );

      expect(
        await contractGate.check(users.other1.address, constants.VOUCHER_SET_ID)
      ).to.be.false;

      await contractERC1155NonTransferable.mint(
        users.other1.address,
        constants.NFT_TOKEN_ID,
        constants.ONE,
        constants.ZERO_BYTES
      );

      expect(
        await contractGate.check(users.other1.address, constants.VOUCHER_SET_ID)
      ).to.be.true;
      expect(
        await contractGate.check(users.other2.address, constants.VOUCHER_SET_ID)
      ).to.be.false;
    });

    it('Owner should be able to pause', async () => {
      expect(await contractGate.pause())
        .to.emit(contractGate, eventNames.PAUSED)
        .withArgs(users.deployer.address);

      expect(await contractGate.paused()).to.be.true;
    });

    it('Owner should be able to unpause', async () => {
      await contractGate.pause();

      expect(await contractGate.unpause())
        .to.emit(contractGate, eventNames.UNPAUSED)
        .withArgs(users.deployer.address);

      expect(await contractGate.paused()).to.be.false;
    });

    it('During the pause, register and deactivate does not work', async () => {
      await contractGate.pause();

      await expect(
        contractGate
          .connect(users.attacker.signer)
          .registerVoucherSetId(
            constants.VOUCHER_SET_ID,
            constants.NFT_TOKEN_ID
          )
      ).to.be.revertedWith(revertReasons.PAUSED);

      await expect(
        contractGate.deactivate(users.other1.address, constants.VOUCHER_SET_ID)
      ).to.be.revertedWith(revertReasons.PAUSED);
    });

    it('[NEGATIVE][setNonTransferableTokenContract] Should revert if supplied wrong boson router address', async () => {
      await expect(
        contractGate.setNonTransferableTokenContract(constants.ZERO_ADDRESS)
      ).to.be.revertedWith(revertReasons.ZERO_ADDRESS_NOT_ALLOWED);
    });

    it('[NEGATIVE][setNonTransferableTokenContract] Should revert if executed by attacker', async () => {
      await expect(
        contractGate
          .connect(users.attacker.signer)
          .setNonTransferableTokenContract(
            contractERC1155NonTransferable.address
          )
      ).to.be.revertedWith(revertReasons.UNAUTHORIZED_OWNER);
    });

    it('[NEGATIVE][registerVoucherSetId] Should revert if executed by attacker', async () => {
      await expect(
        contractGate
          .connect(users.attacker.signer)
          .registerVoucherSetId(
            constants.VOUCHER_SET_ID,
            constants.NFT_TOKEN_ID
          )
      ).to.be.revertedWith(revertReasons.UNAUTHORIZED_OWNER_OR_ROUTER);
    });

    it('[NEGATIVE][registerVoucherSetId] Should revert if nftTokenID id is zero', async () => {
      const nftTokenID = 0;
      await expect(
        contractGate.registerVoucherSetId(constants.VOUCHER_SET_ID, nftTokenID)
      ).to.be.revertedWith(revertReasons.TOKEN_ID_0_NOT_ALLOWED);
    });

    it('[NEGATIVE][registerVoucherSetId] Should revert if constants.VOUCHER_SET_ID id is zero', async () => {
      const voucherSetId = 0;

      await expect(
        contractGate.registerVoucherSetId(voucherSetId, constants.NFT_TOKEN_ID)
      ).to.be.revertedWith(revertReasons.INVALID_TOKEN_SUPPLY);
    });

    it('[NEGATIVE][check] Should return false if constants.VOUCHER_SET_ID is not registered', async () => {
      await contractGate.setNonTransferableTokenContract(
        contractERC1155NonTransferable.address
      );

      await contractERC1155NonTransferable.mint(
        users.other1.address,
        constants.NFT_TOKEN_ID,
        constants.ONE,
        constants.ZERO_BYTES
      );

      expect(
        await contractGate.check(users.other1.address, constants.VOUCHER_SET_ID)
      ).to.be.false;
    });

    it('[NEGATIVE][pause] Should revert if executed by attacker', async () => {
      await expect(
        contractGate.connect(users.attacker.signer).pause()
      ).to.be.revertedWith(revertReasons.UNAUTHORIZED_OWNER);
    });

    it('[NEGATIVE][unpause] Should revert if executed by attacker', async () => {
      await contractGate.pause();

      await expect(
        contractERC1155NonTransferable.connect(users.attacker.signer).unpause()
      ).to.be.revertedWith(revertReasons.UNAUTHORIZED_OWNER_OR_SELF);
    });
  });

  describe('Boson router operations', () => {
    beforeEach(async () => {
      await deployBosonRouterContracts();
      await deployContracts();
    });

    describe('Setting a boson router address', () => {
      it('Owner should be able set boson router address', async () => {
        expect(
          await contractGate.setBosonRouterAddress(contractBosonRouter.address)
        )
          .to.emit(contractGate, eventNames.LOG_BOSON_ROUTER_SET)
          .withArgs(contractBosonRouter.address, users.deployer.address);
      });

      it('[NEGATIVE][constructor] Should revert if supplied wrong boson router address', async () => {
        await expect(
          Gate_Factory.deploy(constants.ZERO_ADDRESS)
        ).to.be.revertedWith(revertReasons.ZERO_ADDRESS_NOT_ALLOWED);
      });

      it('[NEGATIVE][setBosonRouterAddress] Should revert if supplied wrong boson router address', async () => {
        await expect(
          contractGate.setBosonRouterAddress(constants.ZERO_ADDRESS)
        ).to.be.revertedWith(revertReasons.ZERO_ADDRESS_NOT_ALLOWED);
      });

      it('[NEGATIVE][setBosonRouterAddress] Should revert if executed by attacker', async () => {
        await expect(
          contractGate
            .connect(users.attacker.signer)
            .setBosonRouterAddress(contractBosonRouter.address)
        ).to.be.revertedWith(revertReasons.UNAUTHORIZED_OWNER);
      });
    });

    describe('Voucher set registered by Boson protocol', () => {
      it('Boson router should be able to deactivate voucher set id', async () => {
        const {
          tokenId,
          nftTokenID,
        } = await registerVoucherSetIdFromBosonProtocol(contractGate, 0);

        await contractGate.registerVoucherSetId(tokenId, nftTokenID);

        expect(await contractGate.check(users.buyer.address, tokenId)).to.be
          .true;

        await utils.commitToBuy(
          users.buyer,
          users.seller,
          tokenId,
          constants.product_price,
          constants.buyer_deposit
        );

        expect(await contractGate.check(users.buyer.address, tokenId)).to.be
          .false;
      });

      it('[NEGATIVE] Should revert if attacker tries to deactivate voucher set id', async () => {
        const {
          tokenId,
          nftTokenID,
        } = await registerVoucherSetIdFromBosonProtocol(contractGate, 0);

        await contractGate.registerVoucherSetId(tokenId, nftTokenID);

        await expect(
          contractGate.deactivate(users.buyer.address, tokenId)
        ).to.be.revertedWith(revertReasons.ONLY_FROM_ROUTER);
      });
    });
  });
});
