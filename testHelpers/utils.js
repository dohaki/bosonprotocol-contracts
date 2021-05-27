const ethers = require('hardhat').ethers;
const constants = require('./constants');
const BN = ethers.BigNumber.from;
const events = require('./events');
const fnSignatures = require('./functionSignatures');

const {ecsign} = require('ethereumjs-util');

const {toWei, getApprovalDigest} = require('../testHelpers/permitUtils');
class Utils {
  constructor() {
    this.createOrder = '';
    this.commitToBuy = '';
    this.factories = {
      ERC1155ERC721: '',
      VoucherKernel: '',
      Cashier: '',
      BosonRouter: '',
      FundLimitsOracle: '',
      MockERC20Permit: '',
    };
    this.deadline = toWei(1);
  }

  setContracts(
    erc1155721,
    voucherKernel,
    cashier,
    bsnRouter,
    bsnTokenPrice,
    bsnTokenDeposit
  ) {
    this.contractERC1155ERC721 = erc1155721;
    this.contractVoucherKernel = voucherKernel;
    this.contractCashier = cashier;
    this.contractBSNRouter = bsnRouter;
    this.contractBSNTokenPrice = bsnTokenPrice;
    this.contractBSNTokenDeposit = bsnTokenDeposit;
    this.contractBSNTokenSame = bsnTokenPrice;
  }

  async requestCreateOrderETHETH(seller, from, to, sellerDeposit, qty) {
    const txValue = BN(sellerDeposit).mul(BN(qty));

    const sellerInstance = this.contractBSNRouter.connect(seller.signer);
    let txOrder = await sellerInstance.requestCreateOrderETHETH(
      [
        from,
        to,
        constants.product_price,
        sellerDeposit,
        constants.buyer_deposit,
        qty,
      ],
      {
        value: txValue,
      }
    );

    const txReceipt = await txOrder.wait();
    const eventArgs = events.getEventArgs(
      txReceipt,
      this.factories.BosonRouter,
      events.eventNames.LOG_ORDER_CREATED
    );

    return eventArgs._tokenIdSupply.toString();
  }

  async requestCreateOrderETHTKNSameWithPermit(
    seller,
    from,
    to,
    sellerDeposit,
    qty,
    returnTx = false
  ) {
    const txValue = BN(sellerDeposit).mul(BN(qty));

    const nonce = await this.contractBSNTokenSame.nonces(seller.address);

    const digest = await getApprovalDigest(
      this.contractBSNTokenSame,
      seller.address,
      this.contractBSNRouter.address,
      txValue,
      nonce,
      this.deadline
    );

    const {v, r, s} = ecsign(
      Buffer.from(digest.slice(2), 'hex'),
      Buffer.from(seller.privateKey.slice(2), 'hex')
    );

    const sellerInstance = this.contractBSNRouter.connect(seller.signer);
    let txOrder = await sellerInstance.requestCreateOrderTKNTKNWithPermit(
      this.contractBSNTokenSame.address,
      this.contractBSNTokenSame.address,
      txValue,
      this.deadline,
      v,
      r,
      s,
      [
        from,
        to,
        constants.product_price,
        sellerDeposit,
        constants.buyer_deposit,
        qty,
      ],
      {
        from: seller.address,
      }
    );

    const txReceipt = await txOrder.wait();
    const eventArgs = events.getEventArgs(
      txReceipt,
      this.factories.BosonRouter,
      events.eventNames.LOG_ORDER_CREATED
    );

    return returnTx ? txReceipt : eventArgs._tokenIdSupply.toString();
  }

  async requestCreateOrderTKNTKNWithPermit(
    seller,
    from,
    to,
    sellerDeposit,
    qty
  ) {
    const txValue = BN(sellerDeposit).mul(BN(qty));

    const nonce = await this.contractBSNTokenDeposit.nonces(seller.address);

    const digest = await getApprovalDigest(
      this.contractBSNTokenDeposit,
      seller.address,
      this.contractBSNRouter.address,
      txValue,
      nonce,
      this.deadline
    );

    const {v, r, s} = ecsign(
      Buffer.from(digest.slice(2), 'hex'),
      Buffer.from(seller.privateKey.slice(2), 'hex')
    );

    const sellerInstance = this.contractBSNRouter.connect(seller.signer);
    let txOrder = await sellerInstance.requestCreateOrderTKNTKNWithPermit(
      this.contractBSNTokenPrice.address,
      this.contractBSNTokenDeposit.address,
      txValue,
      this.deadline,
      v,
      r,
      s,
      [
        from,
        to,
        constants.product_price,
        sellerDeposit,
        constants.buyer_deposit,
        qty,
      ],
      {
        from: seller.address,
      }
    );

    const txReceipt = await txOrder.wait();
    const eventArgs = events.getEventArgs(
      txReceipt,
      this.factories.BosonRouter,
      events.eventNames.LOG_ORDER_CREATED
    );

    return eventArgs._tokenIdSupply.toString();
  }

  async requestCreateOrderETHTKNWithPermit(
    seller,
    from,
    to,
    sellerDeposit,
    qty,
    returnTx = false
  ) {
    const txValue = BN(sellerDeposit).mul(BN(qty));
    const nonce = await this.contractBSNTokenDeposit.nonces(seller.address);

    const digest = await getApprovalDigest(
      this.contractBSNTokenDeposit,
      seller.address,
      this.contractBSNRouter.address,
      txValue,
      nonce,
      this.deadline
    );

    const {v, r, s} = ecsign(
      Buffer.from(digest.slice(2), 'hex'),
      Buffer.from(seller.privateKey.slice(2), 'hex')
    );

    const sellerInstance = this.contractBSNRouter.connect(seller.signer);
    let txOrder = await sellerInstance.requestCreateOrderETHTKNWithPermit(
      this.contractBSNTokenDeposit.address,
      txValue,
      this.deadline,
      v,
      r,
      s,
      [
        from,
        to,
        constants.product_price,
        sellerDeposit,
        constants.buyer_deposit,
        qty,
      ],
      {
        from: seller.address,
      }
    );

    const txReceipt = await txOrder.wait();
    const eventArgs = events.getEventArgs(
      txReceipt,
      this.factories.BosonRouter,
      events.eventNames.LOG_ORDER_CREATED
    );

    return returnTx ? txReceipt : eventArgs._tokenIdSupply.toString();
  }

  async requestCreateOrderTKNETH(
    seller,
    from,
    to,
    sellerDeposit,
    qty,
    returnTx = false
  ) {
    const txValue = BN(sellerDeposit).mul(BN(qty));

    const sellerInstance = this.contractBSNRouter.connect(seller.signer);
    let txOrder = await sellerInstance.requestCreateOrderTKNETH(
      this.contractBSNTokenPrice.address,
      [
        from,
        to,
        constants.product_price,
        sellerDeposit,
        constants.buyer_deposit,
        qty,
      ],
      {
        value: txValue,
      }
    );

    const txReceipt = await txOrder.wait();
    const eventArgs = events.getEventArgs(
      txReceipt,
      this.factories.BosonRouter,
      events.eventNames.LOG_ORDER_CREATED
    );

    return returnTx ? txReceipt : eventArgs._tokenIdSupply.toString();
  }

  async commitToBuyTKNTKNWithPermit(buyer, seller, tokenSupplyId) {
    const txValue = BN(constants.buyer_deposit).add(
      BN(constants.product_price)
    );
    const nonce1 = await this.contractBSNTokenDeposit.nonces(buyer.address);

    const digestDeposit = await getApprovalDigest(
      this.contractBSNTokenDeposit,
      buyer.address,
      this.contractBSNRouter.address,
      constants.buyer_deposit,
      nonce1,
      this.deadline
    );

    let VRS_DEPOSIT = ecsign(
      Buffer.from(digestDeposit.slice(2), 'hex'),
      Buffer.from(buyer.privateKey.slice(2), 'hex')
    );

    let vDeposit = VRS_DEPOSIT.v;
    let rDeposit = VRS_DEPOSIT.r;
    let sDeposit = VRS_DEPOSIT.s;

    const nonce2 = await this.contractBSNTokenPrice.nonces(buyer.address);

    const digestPrice = await getApprovalDigest(
      this.contractBSNTokenPrice,
      buyer.address,
      this.contractBSNRouter.address,
      constants.product_price,
      nonce2,
      this.deadline
    );

    let VRS_PRICE = ecsign(
      Buffer.from(digestPrice.slice(2), 'hex'),
      Buffer.from(buyer.privateKey.slice(2), 'hex')
    );

    let vPrice = VRS_PRICE.v;
    let rPrice = VRS_PRICE.r;
    let sPrice = VRS_PRICE.s;

    const buyerInstance = this.contractBSNRouter.connect(buyer.signer);
    let commitTx = await buyerInstance.requestVoucherTKNTKNWithPermit(
      tokenSupplyId,
      seller.address,
      txValue,
      this.deadline,
      vPrice,
      rPrice,
      sPrice,
      vDeposit,
      rDeposit,
      sDeposit,
      {from: buyer.address}
    );

    const txReceipt = await commitTx.wait();
    const eventArgs = events.getEventArgs(
      txReceipt,
      this.factories.VoucherKernel,
      events.eventNames.LOG_VOUCHER_DELIVERED
    );

    return eventArgs._tokenIdVoucher;
  }

  async commitToBuyTKNTKNSameWithPermit(buyer, seller, tokenSupplyId) {
    const txValue = BN(constants.buyer_deposit).add(
      BN(constants.product_price)
    );
    const nonce = await this.contractBSNTokenSame.nonces(buyer.address);

    const digestTxValue = await getApprovalDigest(
      this.contractBSNTokenSame,
      buyer.address,
      this.contractBSNRouter.address,
      txValue,
      nonce,
      this.deadline
    );

    let VRS_TX_VALUE = ecsign(
      Buffer.from(digestTxValue.slice(2), 'hex'),
      Buffer.from(buyer.privateKey.slice(2), 'hex')
    );

    let v = VRS_TX_VALUE.v;
    let r = VRS_TX_VALUE.r;
    let s = VRS_TX_VALUE.s;

    const buyerInstance = this.contractBSNRouter.connect(buyer.signer);
    let commitTx = await buyerInstance.requestVoucherTKNTKNSameWithPermit(
      tokenSupplyId,
      seller.address,
      txValue,
      this.deadline,
      v,
      r,
      s,
      {from: buyer.address}
    );

    const txReceipt = await commitTx.wait();
    const eventArgs = events.getEventArgs(
      txReceipt,
      this.factories.VoucherKernel,
      events.eventNames.LOG_VOUCHER_DELIVERED
    );

    return eventArgs._tokenIdVoucher;
  }

  async commitToBuyETHTKNWithPermit(buyer, seller, tokenSupplyId) {
    const nonce1 = await this.contractBSNTokenDeposit.nonces(buyer.address);

    const digestDeposit = await getApprovalDigest(
      this.contractBSNTokenDeposit,
      buyer.address,
      this.contractBSNRouter.address,
      constants.buyer_deposit,
      nonce1,
      this.deadline
    );

    let {v, r, s} = ecsign(
      Buffer.from(digestDeposit.slice(2), 'hex'),
      Buffer.from(buyer.privateKey.slice(2), 'hex')
    );

    const buyerInstance = this.contractBSNRouter.connect(buyer.signer);
    let txOrder = await buyerInstance.requestVoucherETHTKNWithPermit(
      tokenSupplyId,
      seller.address,
      constants.buyer_deposit,
      this.deadline,
      v,
      r,
      s,
      {value: constants.product_price.toString()}
    );

    const txReceipt = await txOrder.wait();
    const eventArgs = events.getEventArgs(
      txReceipt,
      this.factories.VoucherKernel,
      events.eventNames.LOG_VOUCHER_DELIVERED
    );

    return eventArgs._tokenIdVoucher;
  }

  async commitToBuyETHETH(buyer, seller, tokenSupplyId, returnTx = false) {
    const txValue = BN(constants.buyer_deposit).add(
      BN(constants.product_price)
    );

    const buyerInstance = this.contractBSNRouter.connect(buyer.signer);
    let commitTx = await buyerInstance.requestVoucherETHETH(
      tokenSupplyId,
      seller.address,
      {
        value: txValue.toString(),
      }
    );

    const txReceipt = await commitTx.wait();
    const eventArgs = events.getEventArgs(
      txReceipt,
      this.factories.VoucherKernel,
      events.eventNames.LOG_VOUCHER_DELIVERED
    );

    return returnTx ? txReceipt : eventArgs._tokenIdVoucher;
  }

  async commitToBuyTKNETHWithPermit(buyer, seller, tokenSupplyId) {
    const nonce1 = await this.contractBSNTokenPrice.nonces(buyer.address);

    const digestDeposit = await getApprovalDigest(
      this.contractBSNTokenPrice,
      buyer.address,
      this.contractBSNRouter.address,
      constants.product_price,
      nonce1,
      this.deadline
    );

    let {v, r, s} = ecsign(
      Buffer.from(digestDeposit.slice(2), 'hex'),
      Buffer.from(buyer.privateKey.slice(2), 'hex')
    );

    const buyerInstance = this.contractBSNRouter.connect(buyer.signer);
    let txOrder = await buyerInstance.requestVoucherTKNETHWithPermit(
      tokenSupplyId,
      seller.address,
      constants.product_price,
      this.deadline,
      v,
      r,
      s,
      {value: constants.buyer_deposit}
    );

    const txReceipt = await txOrder.wait();
    const eventArgs = events.getEventArgs(
      txReceipt,
      this.factories.VoucherKernel,
      events.eventNames.LOG_VOUCHER_DELIVERED
    );

    return eventArgs._tokenIdVoucher;
  }

  async refund(voucherID, buyer) {
    const buyerInstance = this.contractBSNRouter.connect(buyer);
    return await buyerInstance.refund(voucherID);
  }

  async redeem(voucherID, buyer) {
    const buyerInstance = this.contractBSNRouter.connect(buyer);
    return await buyerInstance.redeem(voucherID);
  }

  async complain(voucherID, buyer) {
    const buyerInstance = this.contractBSNRouter.connect(buyer);
    return await buyerInstance.complain(voucherID);
  }

  async cancel(voucherID, seller) {
    const sellerInstance = this.contractBSNRouter.connect(seller);
    return await sellerInstance.cancelOrFault(voucherID);
  }

  async finalize(voucherID, deployer) {
    const deployerInstance = this.contractVoucherKernel.connect(deployer);
    return await deployerInstance.triggerFinalizeVoucher(voucherID);
  }

  async withdraw(voucherID, deployer) {
    const deployerInstance = this.contractCashier.connect(deployer);
    const tx = await deployerInstance.withdraw(voucherID);

    const receipt = await tx.wait();

    console.log('GAS USED: ', receipt.gasUsed.toString());

    return tx;
  }

  async pause(deployer) {
    const deployerInstance = this.contractVoucherKernel.connect(deployer);
    await deployerInstance.pause();
  }

  async safeTransfer721(oldVoucherOwner, newVoucherOwner, voucherID, signer) {
    const arbitraryBytes = ethers.utils.formatBytes32String('0x0');
    const fromInstance = this.contractERC1155ERC721.connect(signer);

    const method = fromInstance.functions[fnSignatures.safeTransfer721];

    return await method(
      oldVoucherOwner,
      newVoucherOwner,
      voucherID,
      arbitraryBytes
    );
  }

  async safeTransfer1155(
    oldSupplyOwner,
    newSupplyOwner,
    supplyID,
    qty,
    signer
  ) {
    const arbitraryBytes = ethers.utils.formatBytes32String('0x0');
    const fromInstance = this.contractERC1155ERC721.connect(signer);

    const method = fromInstance.functions[fnSignatures.safeTransfer1155];

    return await method(
      oldSupplyOwner,
      newSupplyOwner,
      supplyID,
      qty,
      arbitraryBytes
    );
  }

  async safeBatchTransfer1155(
    oldSupplyOwner,
    newSupplyOwner,
    supplyIDs,
    values,
    signer
  ) {
    const arbitraryBytes = ethers.utils.formatBytes32String('0x0');
    const fromInstance = this.contractERC1155ERC721.connect(signer);

    const method = fromInstance.functions[fnSignatures.safeBatchTransfer1155];

    return await method(
      oldSupplyOwner,
      newSupplyOwner,
      supplyIDs,
      values,
      arbitraryBytes
    );
  }

  calcTotalAmountToRecipients(
    event,
    distributionAmounts,
    recipient,
    buyer,
    seller
  ) {
    if (event[recipient] === buyer) {
      distributionAmounts.buyerAmount = BN(
        distributionAmounts.buyerAmount.toString()
      ).add(BN(event._payment.toString()));
    } else if (event[recipient] === seller) {
      distributionAmounts.sellerAmount = BN(
        distributionAmounts.sellerAmount.toString()
      ).add(BN(event._payment.toString()));
    } else {
      distributionAmounts.escrowAmount = BN(
        distributionAmounts.escrowAmount.toString()
      ).add(BN(event._payment.toString()));
    }
  }

  async mintTokens(tokenContract, to, value) {
    await this[tokenContract].mint(to, value);
  }

  static async getCurrTimestamp() {
    let blockNumber = await ethers.provider.getBlockNumber();
    let block = await ethers.provider.getBlock(blockNumber);

    return block.timestamp;
  }
}

module.exports = Utils;
