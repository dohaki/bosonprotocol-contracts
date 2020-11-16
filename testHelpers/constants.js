//common
const SECONDS_IN_DAY = 86400;
const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";

//asset
const ASSET_VERSION = "0x3132";
const ASSET_TITLE = "Dragon wizard hat";
const ASSET_TITLE2 = "T-shirt dragons";
const ASSET_TITLE3 = "T-shirt goblins";
const ASSET_PIN1 = "I3DESK";
const ASSET_PIN2 = "QBSOS";
const ASSET_QR1 = "XYZ12";
const ASSET_QR2 = "QWY43";
const ASSET_DESCRIPTION = "mighty wizard hat, universal size";
const CATEGORY1 = "entertainment.games.swag";
const CATEGORY2 = "entertainment.games.shield";

//promise
const PROMISE_VALID_FROM 	= ''; // evaluated based on the current block timestamp
const PROMISE_VALID_TO = ''; // evalueated based on the PROMISE_VALID_FROM + 2 * SECONDS_IN_DAY
const PROMISE_PRICE1 		= 10;
const PROMISE_PRICE2 		= 21;
const PROMISE_DEPOSITSE1 	= 1;
const PROMISE_DEPOSITSE2 	= 5;
const PROMISE_DEPOSITBU1 	= 1;
const PROMISE_DEPOSITBU2 	= 2;
const PROMISE_CHALLENGE_PERIOD = 8;
const PROMISE_CANCELORFAULT_PERIOD = 8;

//order
const ORDER_QUANTITY1 = 1;
const ORDER_QUANTITY2 = 1;


const buyer_deposit = '40000000000000000'; // 0.04
const seller_deposit = '50000000000000000'; // 0.05
const product_price = '300000000000000000'; // 0.3

module.exports = {
	ASSET_VERSION,
	ASSET_TITLE,
	ASSET_TITLE2,
	ASSET_TITLE3,
	ASSET_PIN1,
	ASSET_PIN2,
	ASSET_QR1,
	ASSET_QR2,
	ASSET_DESCRIPTION,
	CATEGORY1,
	CATEGORY2,
	PROMISE_VALID_FROM,
	PROMISE_VALID_TO,
	PROMISE_PRICE1,
	PROMISE_PRICE2,
	PROMISE_DEPOSITSE1,
	PROMISE_DEPOSITSE2,
	PROMISE_DEPOSITBU1,
	PROMISE_DEPOSITBU2,
	PROMISE_CHALLENGE_PERIOD,
	PROMISE_CANCELORFAULT_PERIOD,
	ORDER_QUANTITY1,
	ORDER_QUANTITY2,
	SECONDS_IN_DAY,
	ZERO_ADDRESS,
	buyer_deposit,
	seller_deposit,
	product_price
}