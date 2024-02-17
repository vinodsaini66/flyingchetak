let appMode = process.env.REACT_APP_ENV;
let ASSET_URL = "https://inventcolabs.s3.amazonaws.com/";
let URL;
if (appMode === "development") {
  // URL = enter server url
  URL = "localhost:8002/api/"; //development
} else {
  // URL = enter server URL
  URL = "localhost:8002/api/";
}

let pathObj = {
  baseURL: 'http://35.202.132.15/api/',
  assetURL: ASSET_URL,
  dashboard: "admin/dashboard/get",

  // Auth API
  logout: "admin/auth/logout",
  login: "admin/auth/login",

  profile: "admin/auth/get-profile",
  updateProfile: "admin/auth/update-profile",
  changePassword: "admin/auth/change-password",
  updateAppSetting: "admin/auth/update-app-setting",

  withdraw:"admin/withdrawal/get",
  withdrawalStatus:"admin/withdrawal/change/status",

  transaction:"admin/transaction/get",
  getTraByUserId:"admin/transaction/get/by-user-id",

  channelAdd:"admin/channel/add",
  channelGet:"admin/channel/get",
  channelDelete:"admin/channel/remove",

  adminInfoUpdate:"admin/details/update",
  adminInfoGet:"admin/details/get",


  forgotPassword: "admin/auth/forgot-password",
  verifyOTP: "admin/auth/verify-otp",
  resetPassword: "admin/auth/reset-password",

  // Customer APIs
  listCustomer: "admin/user-info-router/list",
  addEditCustomer: "admin/user-info-router/add-edit",
  statusCustomer: "admin/customer/status",
  viewCustomer: "admin/user-info-router/getuser/view",

  editSetting: "admin/setting/update",
  getSetting: "admin/setting/get",

  // EmailTemplate APIs
  listEmailTemplate: "admin/email-template/list",
  addEditEmailTemplate: "admin/email-template/add-edit",
  statusEmailTemplate: "admin/email-template/status",
  viewEmailTemplate: "admin/email-template/view",

  // Content APIs
  addEditContent: "admin/content/add-edit",
  statusContent: "admin/content/status",
  viewContent: "admin/content/view",
};

export default pathObj;
