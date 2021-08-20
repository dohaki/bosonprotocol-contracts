/* eslint @typescript-eslint/no-var-requires: "off" */

const sellerCreate = require("../seller/createVoucher");
const commitVocucher = require("../buyer/commitVoucher");
const refundVoucher = require("../buyer/refundVoucher");
const checkBalance = require("../helpers/checkBalance");
const sellerFault = require("../seller/faultVoucher");
const Utils = require("../helpers/utils");
const Users = require("../helpers/users");
const { describe, it } = require("mocha");
let format = require("../helpers/formatter");
let helpers = require("../helpers/constants");
let assert = require("chai").assert;
let Web3 = require("web3");
let web3 = new Web3(new Web3.providers.HttpProvider(helpers.PROVIDER));

describe("TEST SCENARIO 10 :: OFFER, COMMIT, REFUND, COF", async function () {
  let voucherSetDetails;
  let committedVoucher;
  let refundedVoucher;
  let cancelVoucher;
  let users;
  let aql = assert.equal;

  before("Before test cases", async function () {
    await Utils.deployContracts();
    users = new Users(await web3.eth.getAccounts());
    let balances = await checkBalance(users);
    console.log(balances);
  });

  it("TEST SCENARIO 10 :: OFFER :: 1.0 SELLER CREATES VOUCHER SET", async function () {
    const timestamp = await Utils.getCurrTimestamp();
    voucherSetDetails = await sellerCreate(timestamp, users);
    await format(voucherSetDetails);
  });

  it("TEST SCENARIO 10 :: OFFER :: 1.1 VALIDATE VALID FROM", async function () {
    aql(voucherSetDetails["ValidFrom"], helpers.PROMISE_VALID_FROM);
  });

  it("TEST SCENARIO 10 :: OFFER :: 1.2 VALIDATE VALID TO", async function () {
    aql(voucherSetDetails["ValidTo"], helpers.PROMISE_VALID_TO);
  });

  it("TEST SCENARIO 10 :: OFFER :: 1.3 VALIDATE ORDER QUANTITY", async function () {
    aql(voucherSetDetails["nftSupply"], helpers.ORDER_QUANTITY1);
  });

  it("TEST SCENARIO 10 :: OFFER :: 1.4 VALIDATE SELLER", async function () {
    aql(voucherSetDetails["nftSeller"], users.seller.address);
  });

  it("TEST SCENARIO 10 :: OFFER :: 1.5 VALIDATE PAYMENT TYPE", async function () {
    aql(voucherSetDetails["paymentType"], 1);
  });

  it("TEST SCENARIO 10 :: OFFER :: 1.6 VALIDATE ERC1155ERC721 DATA", async function () {
    aql(voucherSetDetails["operator"], Utils.contractVoucherKernel.address);
    aql(voucherSetDetails["transferFrom"], helpers.ZERO_ADDRESS);
    aql(voucherSetDetails["transferTo"], users.seller.address);
    aql(voucherSetDetails["transferValue"], helpers.ORDER_QUANTITY1);
  });

  it("TEST SCENARIO 10 :: COMMIT :: 2.0 BUYER COMMITS TO REDEEMING A VOUCHER", async function () {
    console.log(await checkBalance(users));
    committedVoucher = await commitVocucher(
      voucherSetDetails["createdVoucherSetID"],
      users
    );
    await format(committedVoucher);
  });

  it("TEST SCENARIO 10 :: COMMIT :: 2.1 VALIDATE ISSUER", async function () {
    aql(committedVoucher["issuer"], users.seller.address);
  });

  it("TEST SCENARIO 10 :: COMMIT :: 2.2 VALIDATE HOLDER", async function () {
    aql(committedVoucher["holder"], users.buyer.address);
  });

  it("TEST SCENARIO 10 :: REFUND :: 3.0 BUYER REQUESTS REFUND OF A COMMITTED VOUCHER", async function () {
    console.log(await checkBalance(users));
    refundedVoucher = await refundVoucher(
      committedVoucher["MintedVoucherID"],
      users
    );
    await format(refundedVoucher);
  });

  it("TEST SCENARIO 10 :: REFUND :: 3.1 VALIDATE REFUNDED VOUCHER", async function () {
    aql(
      refundedVoucher["refundedVoucherID"],
      committedVoucher["MintedVoucherID"]
    );
  });

  it("TEST SCENARIO 10 :: COF :: 4.0 SELLER ACCEPTS FAULT ON A REFUNDED VOUCHER", async function () {
    console.log(await checkBalance(users));
    cancelVoucher = await sellerFault(
      committedVoucher["MintedVoucherID"],
      users
    );
    await format(cancelVoucher);
  });

  it("TEST SCENARIO 10 :: COF :: 4.1 VALIDATE FAULTED VOUCHER", async function () {
    aql(
      cancelVoucher["FaultedVoucherID"],
      refundedVoucher["refundedVoucherID"]
    );
  });

  after("Check Balances", async function () {
    let balances = await checkBalance(users);
    console.log(balances);
  });
});
