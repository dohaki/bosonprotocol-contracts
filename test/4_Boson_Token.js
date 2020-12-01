const chai = require('chai')
const ethers = require('ethers')
let chaiAsPromised = require("chai-as-promised")
chai.use(chaiAsPromised)
const assert = chai.assert
const truffleAssert = require('truffle-assertions');

const { ecsign } = require('ethereumjs-util');

const BN = web3.utils.BN
const BosonToken = artifacts.require("BosonToken")
const maxuint = new BN('0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff')

const {
    hexlify,
    getAddress,
    keccak256,
    defaultAbiCoder,
    toUtf8Bytes,
    solidityPack
} = require('ethers').utils;

const {
    PERMIT_TYPEHASH,
    toWei,
    getApprovalDigest
} = require('../testHelpers/permitUtils');

const config = require('../testHelpers/config.json')

contract('Boson token', accounts => {

    let BosonTokenContract, bosonContractAddress;

    // let Deployer = accounts[0] //0xD9995BAE12FEe327256FFec1e3184d492bD94C31
    // let Deployer_PK = '0x7ab741b57e8d94dd7e1a29055646bafde7010f38a900f55bbd7647880faa6ee8'
    // let Seller = accounts[1] //0xd4Fa489Eacc52BA59438993f37Be9fcC20090E39
    // let Seller_PK = '0x2030b463177db2da82908ef90fa55ddfcef56e8183caf60db464bc398e736e6f';
    // let Buyer = accounts[2] //0x760bf27cd45036a6C486802D30B5D90CfFBE31FE
    // let Buyer.pk = '0x62ecd49c4ccb41a70ad46532aed63cf815de15864bc415c87d507afd6a5e8da2'
    // let Attacker = accounts[3] //0x56A32fFf5E5A8B40d6A21538579fB8922DF5258c 
    // let Attacker_PK = '0xf473040b1a83739a9c7cc1f5719fab0f5bf178f83314d98557c58aae1910e03a' 

    let Deployer = config.accounts.deployer
    let Seller = config.accounts.seller
    let Buyer = config.accounts.buyer
    let Attacker = config.accounts.attacker //0x56A32fFf5E5A8B40d6A21538579fB8922DF5258c 

    beforeEach(async () => {

        BosonTokenContract = await BosonToken.new('BOSON TOKEN', 'BSNT')
        bosonContractAddress = BosonTokenContract.address
    })

    describe('Boson Token', async () => {

        const ADMIN_ROLE = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("ADMIN_ROLE"))
        const MINTER_ROLE = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("MINTER_ROLE"))

        it("Only Deployer Should have admin and minter rights initiially ", async () => {
           
            const buyerIsAdmin = await BosonTokenContract.hasRole(ADMIN_ROLE, Buyer.address);
            const buyerIsMinter = await BosonTokenContract.hasRole(MINTER_ROLE, Buyer.address);
            const deployerIsAdmin = await BosonTokenContract.hasRole(ADMIN_ROLE, Deployer.address);
            const deployerIsMinter = await BosonTokenContract.hasRole(MINTER_ROLE, Deployer.address);

            assert.isTrue(deployerIsAdmin)
            assert.isTrue(deployerIsMinter)

            assert.isFalse(buyerIsAdmin)
            assert.isFalse(buyerIsMinter)
        })

        it("should revert if unauthorized address tries to mint tokens ", async () => {
            await truffleAssert.reverts(BosonTokenContract.mint(Seller.address, 1000, { from: Attacker.address} ))
        })

        it("should grant minter role to address", async () => {
            await BosonTokenContract.grantRole(MINTER_ROLE, Buyer.address);

            const buyerIsMinter = await BosonTokenContract.hasRole(MINTER_ROLE, Buyer.address);
            
            assert.isTrue(buyerIsMinter)
        })

        it("should mint tokens after minter role is granted", async () => {
            const tokensToMint = 1000;
            const randomAddress = accounts[7];
            let addressBalance = await BosonTokenContract.balanceOf(randomAddress)

            assert.equal(addressBalance, 0, 'address has more tokens than expected')

            await BosonTokenContract.mint(randomAddress, 1000);

            addressBalance = await BosonTokenContract.balanceOf(randomAddress)
            assert.equal(addressBalance, tokensToMint, "minted tokens do not correspond to address balance")
        })

        describe("[PERMIT]", async () => {
            it("Should approve successfully", async () => {
                const balanceToApprove = 1200;
                const nonce = await BosonTokenContract.nonces(Buyer.address)
                const deadline = toWei(1);
                const digest = await getApprovalDigest(
                    BosonTokenContract,
                    Buyer.address,
                    bosonContractAddress,
                    balanceToApprove,
                    nonce,
                    deadline
                )

                const { v, r, s } = ecsign(
                    Buffer.from(digest.slice(2), 'hex'),
                    Buffer.from(Buyer.pk.slice(2), 'hex'));

                await BosonTokenContract.permit(
                    Buyer.address,
                    bosonContractAddress,
                    balanceToApprove,
                    deadline,
                    v, r, s,
                    { from: Buyer.address }
                )

                const tokenAllowanceFromBuyer = await BosonTokenContract.allowance(Buyer.address, bosonContractAddress);

                assert.equal(tokenAllowanceFromBuyer, balanceToApprove, "Allowance does not equal the amount provided!")

            })

            it("should revert if incorrect nonce is provided", async () => {

                const balanceToApprove = 1200;
                const nonce = 7000000;
                const deadline = toWei(1);
                const digest = await getApprovalDigest(
                    BosonTokenContract,
                    Buyer.address,
                    bosonContractAddress,
                    balanceToApprove,
                    nonce,
                    deadline
                )

                const { v, r, s } = ecsign(
                    Buffer.from(digest.slice(2), 'hex'),
                    Buffer.from(Buyer.pk.slice(2), 'hex'));

                await truffleAssert.reverts(BosonTokenContract.permit(
                    Buyer.address,
                    bosonContractAddress,
                    balanceToApprove,
                    deadline,
                    v, r, s,
                    { from: Buyer.address }
                ), truffleAssert.ErrorType.REVERT)
            })

            it("should revert if incorrect balance is provided", async () => {

                const balanceToApprove = 1200;
                const incorrectBalance = 1500;
                const nonce = await BosonTokenContract.nonces(Buyer.address);
                const deadline = toWei(1);
                const digest = await getApprovalDigest(
                    BosonTokenContract,
                    Buyer.address,
                    bosonContractAddress,
                    balanceToApprove,
                    nonce,
                    deadline
                )

                const { v, r, s } = ecsign(
                    Buffer.from(digest.slice(2), 'hex'),
                    Buffer.from(Buyer.pk.slice(2), 'hex'));

                await truffleAssert.reverts(BosonTokenContract.permit(
                    Buyer.address,
                    bosonContractAddress,
                    incorrectBalance,
                    deadline,
                    v, r, s,
                    { from: Buyer.address }
                ), truffleAssert.ErrorType.REVERT)
            })

            it("should revert if incorrect recipient is provided", async () => {
                const incorrectAddress = accounts[6]
                const balanceToApprove = 1200;
                const nonce = await BosonTokenContract.nonces(Buyer.address);
                const deadline = toWei(1);
                const digest = await getApprovalDigest(
                    BosonTokenContract,
                    Buyer.address,
                    bosonContractAddress,
                    balanceToApprove,
                    nonce,
                    deadline
                )

                const { v, r, s } = ecsign(
                    Buffer.from(digest.slice(2), 'hex'),
                    Buffer.from(Buyer.pk.slice(2), 'hex'));

                await truffleAssert.reverts(BosonTokenContract.permit(
                    Buyer.address,
                    incorrectAddress,
                    balanceToApprove,
                    deadline,
                    v, r, s,
                    { from: Buyer.address }
                ), truffleAssert.ErrorType.REVERT)
            })

            it("should revert if owner is incorrect", async () => {
                const inccorectSender = accounts[6]
                const balanceToApprove = 1200;
                const nonce = await BosonTokenContract.nonces(Buyer.address);
                const deadline = toWei(1);
                const digest = await getApprovalDigest(
                    BosonTokenContract,
                    Buyer.address,
                    bosonContractAddress,
                    balanceToApprove,
                    nonce,
                    deadline
                )

                const { v, r, s } = ecsign(
                    Buffer.from(digest.slice(2), 'hex'),
                    Buffer.from(Buyer.pk.slice(2), 'hex'));

                await truffleAssert.reverts(BosonTokenContract.permit(
                    inccorectSender,
                    bosonContractAddress,
                    balanceToApprove,
                    deadline,
                    v, r, s,
                    { from: Buyer.address }
                ), truffleAssert.ErrorType.REVERT)
            })

            it("Should transfer tokens on behalf of the buyer", async() => {
                //Buyer has 1000 preminted tokens
                const tokensToMint = 1000
                await BosonTokenContract.mint(Buyer.address, tokensToMint, { from: Deployer.address });
                const balanceToApprove = 200;
                const tokensToSend = 200;

                const nonce = await BosonTokenContract.nonces(Buyer.address)
                const deadline = toWei(1);
                const digest = await getApprovalDigest(
                    BosonTokenContract,
                    Buyer.address,
                    Deployer.address,
                    balanceToApprove,
                    nonce,
                    deadline
                )

                const { v, r, s } = ecsign(
                    Buffer.from(digest.slice(2), 'hex'),
                    Buffer.from(Buyer.pk.slice(2), 'hex'));

                await BosonTokenContract.permit(
                    Buyer.address,
                    Deployer.address,
                    balanceToApprove,
                    deadline,
                    v, r, s,
                    { from: Buyer.address }
                )


                let sellerBalance = await BosonTokenContract.balanceOf(Seller.address)
                assert.equal(sellerBalance.toString(), 0, 'Seller has funds')

                await BosonTokenContract.transferFrom(Buyer.address, Seller.address, tokensToSend, { from: Deployer.address});

                sellerBalance = await BosonTokenContract.balanceOf(Seller.address)
                assert.equal(sellerBalance.toString(), tokensToSend, 'Seller has different amount of tokens')

            })

            it("Should revert if attacker tries to transfer", async () => {
                //Buyer has 1000 preminted tokens
                const tokensToMint = 1000
                await BosonTokenContract.mint(Buyer.address, tokensToMint, { from: Deployer.address });
                const balanceToApprove = 200;
                const tokensToSend = 200;

                const nonce = await BosonTokenContract.nonces(Buyer.address)
                const deadline = toWei(1);
                const digest = await getApprovalDigest(
                    BosonTokenContract,
                    Buyer.address,
                    Deployer.address,
                    balanceToApprove,
                    nonce,
                    deadline
                )

                const { v, r, s } = ecsign(
                    Buffer.from(digest.slice(2), 'hex'),
                    Buffer.from(Buyer.pk.slice(2), 'hex'));

                await BosonTokenContract.permit(
                    Buyer.address,
                    Deployer.address,
                    balanceToApprove,
                    deadline,
                    v, r, s,
                    { from: Buyer.address }
                )

                await truffleAssert.reverts(BosonTokenContract.transferFrom(Buyer.address, Seller.address, tokensToSend, { from: Attacker.address }));

            })
        })
        
    })

})