const baseURL = 'http://34.134.23.12/';
const baseLOCALURL = "https://web.thelotusonline777.com/"
// const baseURL = "http://192.168.1.9:8002/"
// const baseLOCALURL = "http://localhost:3000/"


const apiPath = {
	signup: 'api/app/auth/sign-up',
	login: 'api/app/auth/login',
	userprofile: 'api/app/auth/get-profile',
	updateProfile: 'api/app/auth/update-profile',
	bankInfo: 'api/app/auth/add/bank',
	history: 'api/app/auth/get/history',
	walletupdate: 'api/app/wallet/update/Wallet-Balance',
	getWalletBalance: 'api/app/wallet/get/wallet-balance',
	transactions: 'api/app/transactions/get-transactions',
	promotionData: 'api/app/referral/request/data',
	thirdPartyBalanceRequest: 'api/app/wallet/request/balance-via-third-party',
	withdrawalRequest: 'api/app/transactions/request/withdrawal',
	adminDetails: 'api/app/setting/request/data',
	winningAmount:"api/app/wallet/get/winning-balance",
	gameInitialData: 'api/app/game',
	gameDeposit: 'api/app/game/deposit',
	gameAutoDeposite:"api/app/game/autoBet",
	gameWithdraw: 'api/app/game/withdraw',
	getChannels:"api/app/channel/get",
	getBets:"api/app/game/bets",
	fallrate:"api/app/game/fall-rate"
};

export { baseURL, apiPath,baseLOCALURL };
