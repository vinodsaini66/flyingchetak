
const baseURL = 'http://35.222.165.21/api/';
// const baseURL = "http://localhost:8002/api/";
let pathObj = {
  baseURL: baseURL,
  // assetURL: ASSET_URL,
  dashboard: "admin/dashboard/get",
  dashboardBox:"admin/dashboard/box-data/get",

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

  addEditUtr:"admin/channel/add-edit",
  getUtr:"admin/channel/get-utr",
  checkOrderStatus:"admin/channel/utr/check_order_status",

  adminInfoUpdate:"admin/details/update",
  adminInfoGet:"admin/details/get",


  forgotPassword: "admin/auth/forgot-password",
  verifyOTP: "admin/auth/verify-otp",
  resetPassword: "admin/auth/reset-password",

  // Customer APIs
  listCustomer: "admin/user-info-router/list",
  addEditCustomer: "admin/user-info-router/add-edit",
  statusCustomer: "admin/user-info-router/status",
  withdrawal_Active:"admin/user-info-router/withdrawal/change-status",
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
