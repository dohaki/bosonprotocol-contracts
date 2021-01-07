
const helpers = require('./constants')
const config = require('./config.json')
const BN = web3.utils.BN
const truffleAssert = require('truffle-assertions')

const { ecsign } = require('ethereumjs-util');

const {
    PERMIT_TYPEHASH,
    toWei,
    getApprovalDigest
} = require('../testHelpers/permitUtils');

class Utils {

    constructor() {
        this.createOrder = ''
        this.commitToBuy = ''
        this.deadline = toWei(1)
    }

    setContracts(erc1155721, voucherKernel, cashier, bsnTokenPrice, bsnTokenDeposit) {
        this.contractERC1155ERC721 = erc1155721
        this.contractVoucherKernel = voucherKernel
        this.contractCashier = cashier
        this.contractBSNTokenPrice = bsnTokenPrice
        this.contractBSNTokenDeposit = bsnTokenDeposit
    }

    async requestCreateOrder_ETH_ETH(seller, from, to, sellerDeposit, qty, returnTx = false) {
        const txValue = new BN(sellerDeposit).mul(new BN(qty))

        let txOrder = await this.contractCashier.requestCreateOrder_ETH_ETH(
            [from, 
            to, 
            helpers.product_price, 
            sellerDeposit, 
            helpers.buyer_deposit, 
            qty], 
            { 
                from: seller.address, 
                value: txValue
            }
        );

        return returnTx ? txOrder: (txOrder.logs[0].args._tokenIdSupply).toString() 
    }

    async requestCreateOrder_TKN_TKN_WithPermit(seller, from, to, sellerDeposit, qty) {
        const txValue = new BN(sellerDeposit).mul(new BN(qty))

        const nonce = await this.contractBSNTokenDeposit.nonces(seller.address);

        const digest = await getApprovalDigest(
            this.contractBSNTokenDeposit,
            seller.address,
            this.contractCashier.address,
            txValue,
            nonce,
            this.deadline
        )

        const { v, r, s } = ecsign( 
            Buffer.from(digest.slice(2), 'hex'),
            Buffer.from(seller.pk.slice(2), 'hex'));
       
        let txOrder = await this.contractCashier.requestCreateOrder_TKN_TKN_WithPermit(
            this.contractBSNTokenPrice.address,
            this.contractBSNTokenDeposit.address,
            txValue,
            this.deadline,
            v,r,s,
            [
                from,
                to,
                helpers.product_price,
                sellerDeposit,
                helpers.buyer_deposit,
                qty
            ],
            {
                from: seller.address
            }
        );

        return (txOrder.logs[0].args._tokenIdSupply).toString()
    }

    async requestCreateOrder_ETH_TKN_WithPermit(seller, from, to, sellerDeposit, qty, returnTx = false) {
        const txValue = new BN(sellerDeposit).mul(new BN(qty));
        const nonce = await this.contractBSNTokenDeposit.nonces(seller.address);

        const digest = await getApprovalDigest(
            this.contractBSNTokenDeposit,
            seller.address,
            this.contractCashier.address,
            txValue,
            nonce,
            this.deadline
        )

        const { v, r, s } = ecsign(
            Buffer.from(digest.slice(2), 'hex'),
            Buffer.from(seller.pk.slice(2), 'hex'));


        let txOrder = await this.contractCashier.requestCreateOrder_ETH_TKN_WithPermit(
            this.contractBSNTokenDeposit.address,
            txValue,
            this.deadline,
            v, r, s,
            [
                from,
                to,
                helpers.product_price,
                sellerDeposit,
                helpers.buyer_deposit,
                qty
            ],
            {
                from: seller.address
            }
        );

        return returnTx ? txOrder : (txOrder.logs[0].args._tokenIdSupply).toString()
    }

    async requestCreateOrder_TKN_ETH(seller, from, to, sellerDeposit, qty) {
        const txValue = new BN(sellerDeposit).mul(new BN(qty));

        let txOrder = await this.contractCashier.requestCreateOrder_TKN_ETH(
            this.contractBSNTokenPrice.address,
            [
                from,
                to,
                helpers.product_price,
                sellerDeposit,
                helpers.buyer_deposit,
                qty
            ],
            {
                from: seller.address,
                value: txValue
            }
        );

        return (txOrder.logs[0].args._tokenIdSupply).toString()
    }

    async commitToBuy_TKN_TKN_WithPermit(buyer, seller, tokenSupplyId) {
        const txValue = new BN(helpers.buyer_deposit).add(new BN(helpers.product_price))
        const nonce1 = await this.contractBSNTokenDeposit.nonces(buyer.address);

        const digestDeposit = await getApprovalDigest(
            this.contractBSNTokenDeposit,
            buyer.address,
            this.contractCashier.address,
            helpers.buyer_deposit,
            nonce1,
            this.deadline
        )

        let VRS_DEPOSIT = ecsign(
            Buffer.from(digestDeposit.slice(2), 'hex'),
            Buffer.from(buyer.pk.slice(2), 'hex'));

        let vDeposit = VRS_DEPOSIT.v
        let rDeposit = VRS_DEPOSIT.r
        let sDeposit = VRS_DEPOSIT.s

        const nonce2 = await this.contractBSNTokenPrice.nonces(buyer.address);

        const digestPrice = await getApprovalDigest(
            this.contractBSNTokenPrice,
            buyer.address,
            this.contractCashier.address,
            helpers.product_price,
            nonce2,
            this.deadline
        )

        let VRS_PRICE = ecsign(
            Buffer.from(digestPrice.slice(2), 'hex'),
            Buffer.from(buyer.pk.slice(2), 'hex'));

        let vPrice = VRS_PRICE.v
        let rPrice = VRS_PRICE.r
        let sPrice = VRS_PRICE.s

        let CommitTx = await this.contractCashier.requestVoucher_TKN_TKN_WithPermit(
            tokenSupplyId,
            seller.address,
            txValue,
            this.deadline,
            vPrice, rPrice, sPrice,
            vDeposit, rDeposit, sDeposit,
        { from: buyer.address });

        let nestedValue = (await truffleAssert.createTransactionResult(this.contractVoucherKernel, CommitTx.tx)).logs

        let filtered = nestedValue.filter(e => e.event == 'LogVoucherDelivered')[0]
        return filtered.returnValues['_tokenIdVoucher']
    }

    async commitToBuy_ETH_TKN_WithPermit(buyer, seller, tokenSupplyId) {
        const nonce1 = await this.contractBSNTokenDeposit.nonces(buyer.address);

        const digestDeposit = await getApprovalDigest(
            this.contractBSNTokenDeposit,
            buyer.address,
            this.contractCashier.address,
            helpers.buyer_deposit,
            nonce1,
            this.deadline
        )

        let { v, r, s } = ecsign(
            Buffer.from(digestDeposit.slice(2), 'hex'),
            Buffer.from(buyer.pk.slice(2), 'hex'));


        let txOrder = await this.contractCashier.requestVoucher_ETH_TKN_WithPermit(
            tokenSupplyId,
            seller.address,
            helpers.buyer_deposit,
            this.deadline,
            v, r, s,
            { from: buyer.address, value: helpers.product_price.toString() }
        );

        let nestedValue = (await truffleAssert.createTransactionResult(this.contractVoucherKernel, txOrder.tx)).logs

        let filtered = nestedValue.filter(e => e.event == 'LogVoucherDelivered')[0]
        return filtered.returnValues['_tokenIdVoucher']
    }

    async commitToBuy_ETH_ETH(buyer, seller, tokenSupplyId) {
        const txValue = new BN(helpers.buyer_deposit).add(new BN(helpers.product_price))

        let CommitTx = await this.contractCashier.requestVoucher_ETH_ETH(tokenSupplyId, seller.address, { from: buyer.address, value: txValue.toString() });

        let nestedValue = (await truffleAssert.createTransactionResult(this.contractVoucherKernel, CommitTx.tx)).logs

        let filtered = nestedValue.filter(e => e.event == 'LogVoucherDelivered')[0]
        return filtered.returnValues['_tokenIdVoucher']
    }

    async commitToBuy_TKN_ETH_WithPermit(buyer, seller, tokenSupplyId) {
        const nonce1 = await this.contractBSNTokenPrice.nonces(buyer.address);

        const digestDeposit = await getApprovalDigest(
            this.contractBSNTokenPrice,
            buyer.address,
            this.contractCashier.address,
            helpers.product_price,
            nonce1,
            this.deadline
        )

        let { v, r, s } = ecsign(
            Buffer.from(digestDeposit.slice(2), 'hex'),
            Buffer.from(buyer.pk.slice(2), 'hex'));


        let txOrder = await this.contractCashier.requestVoucher_TKN_ETH_WithPermit(
            tokenSupplyId,
            seller.address,
            helpers.product_price,
            this.deadline,
            v, r, s,
            { from: buyer.address, value: helpers.buyer_deposit }
        );

        let nestedValue = (await truffleAssert.createTransactionResult(this.contractVoucherKernel, txOrder.tx)).logs

        let filtered = nestedValue.filter(e => e.event == 'LogVoucherDelivered')[0]
        return filtered.returnValues['_tokenIdVoucher']
    }

    async refund(voucherID, buyer) {
        await this.contractVoucherKernel.refund(voucherID, { from: buyer });
    }

    async redeem(voucherID, buyer) {
        await this.contractVoucherKernel.redeem(voucherID, { from: buyer });
    }

    async complain(voucherID, buyer) {
        await this.contractVoucherKernel.complain(voucherID, { from: buyer });
    }

    async cancel(voucherID, seller) {
        await this.contractVoucherKernel.cancelOrFault(voucherID, { from: seller });
    }

    async finalize(voucherID, deployer) {
        await this.contractVoucherKernel.triggerFinalizeVoucher(voucherID, {from: deployer})
    }

    async withdraw(voucherID, deployer) {
        const tx = await this.contractCashier.withdraw(voucherID, {from: deployer});
        console.log('GAS USED: ', tx.receipt.gasUsed);
        return tx
    }

    async withdrawWhenPaused(voucherID, executor) {
        const tx =  await this.contractCashier.withdrawWhenPaused(voucherID, {from: executor});
        console.log('GAS USED: ', tx.receipt.gasUsed);
        return tx
    }

    async pause(deployer) {
        await this.contractCashier.pause({from: deployer})
    }

    async safeTransfer721(oldVoucherOwner, newVoucherOwner, voucherID, from) {
        const arbitraryBytes = web3.utils.fromAscii('0x0').padEnd(66, '0')
        return await this.contractERC1155ERC721
            .methods['safeTransferFrom(address,address,uint256,bytes)']
            (oldVoucherOwner, newVoucherOwner, voucherID, arbitraryBytes, from);
    }

    async safeTransfer1155(oldSupplyOwner, newSupplyOwner, supplyID, qty, from) {
        const arbitraryBytes = web3.utils.fromAscii('0x0').padEnd(66, '0')
        return await this.contractERC1155ERC721
            .methods['safeTransferFrom(address,address,uint256,uint256,bytes)']
            (oldSupplyOwner, newSupplyOwner, supplyID, qty, arbitraryBytes, from);
    }

    async safeBatchTransfer1155(oldSupplyOwner, newSupplyOwner, supplyIDs, values, from) {
        const arbitraryBytes = web3.utils.fromAscii('0x0').padEnd(66, '0')
        return await this.contractERC1155ERC721
            .methods['safeBatchTransferFrom(address,address,uint256[],uint256[],bytes)']
            (oldSupplyOwner, newSupplyOwner, supplyIDs, values, arbitraryBytes, from);
    }

    calcTotalAmountToRecipients(event, distributionAmounts, recipient, buyer, seller) {
        if (event[recipient] == buyer) {
            distributionAmounts.buyerAmount = new BN(distributionAmounts.buyerAmount.toString()).add(new BN(event._payment.toString()))
        } else if (event[recipient] == seller) {
            distributionAmounts.sellerAmount = new BN(distributionAmounts.sellerAmount.toString()).add(new BN(event._payment.toString()))
        } else {
            distributionAmounts.escrowAmount = new BN(distributionAmounts.escrowAmount.toString()).add(new BN(event._payment.toString()))
        }
    }

    async mintTokens(tokenContract, to, value) {

        await this[tokenContract].mint(to, value);
    }

    static async  getCurrTimestamp() {
        let blockNumber = await web3.eth.getBlockNumber()
        let block = await web3.eth.getBlock(blockNumber)

        return block.timestamp
    }
}

module.exports = Utils