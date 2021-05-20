let Web3 = require('web3');
let Contract = require('web3-eth-contract');
const Tx = require('ethereumjs-tx').Transaction;
let converter = require('hex2dec');
const BosonRouter = require("../../build/contracts/BosonRouter.json").abi;
const { BUYER_SECRET, BUYER_PUBLIC, contracts, PROVIDER} = require('../helpers/config');
let web3 = new Web3(new Web3.providers.HttpProvider(PROVIDER));
// set provider for all later instances to use
Contract.setProvider(PROVIDER);
const buyer = BUYER_PUBLIC;

function refundVoucher(_voucherID) {
    return new Promise((resolve, reject) => {
        const bosonRouterAddr = contracts.BosonRouterContrctAddress;
        const bosonRouter = new Contract(BosonRouter,bosonRouterAddr);
        let gasUsed = "0xF458F";
        web3.eth.getTransactionCount(buyer, function(error, txCount) {
            const encoded = bosonRouter.methods.refund(
                _voucherID
            ).encodeABI();
            let rawTransaction = {
                "nonce": web3.utils.toHex(txCount),
                "gasPrice": "0x04e3b29200",
                "gasLimit": gasUsed,
                "to": bosonRouterAddr,
                "value": 0x0,
                "data": encoded
            };
            let privKey = Buffer.from(BUYER_SECRET, 'hex');
            let tx = new Tx(rawTransaction,  {'chain':'rinkeby'});
            tx.sign(privKey);
            let serializedTx = tx.serialize();
            web3.eth.sendSignedTransaction('0x' + serializedTx.toString('hex'), (err, hash) => {
                if(err) {
                    reject(new Error(err.message))
                }
                console.log("Transaction Hash : "+hash);
            }).on('receipt', function(receipt){
                let logdata1 = receipt.logs[0].data;
                let gasUsed = receipt.gasUsed;
                let burntVoucherID = (converter.hexToDec(logdata1.slice(0, 66))).toString();
                let output = {
                    "refundedVoucherID":burntVoucherID,
                    "gasPaid":gasUsed,
                    "gasUsed":gasUsed
                }
                resolve(output)
            }).on('error', console.error);
        })
    })
}

module.exports = refundVoucher;