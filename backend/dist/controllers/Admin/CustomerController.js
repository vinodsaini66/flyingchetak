"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomerController = void 0;
const User_1 = require("../../models/User");
const ResponseHelper_1 = require("../../helpers/ResponseHelper");
const Auth_1 = require("../../Utils/Auth");
const Helper_1 = require("../../helpers/Helper");
const EmailTemplate_1 = require("../../models/EmailTemplate");
const MailHelper_1 = require("../../helpers/MailHelper");
class CustomerController {
    static list(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const startTime = new Date().getTime();
                let sort = [['createdAt', -1]];
                if (req.query.sort) {
                    const map = Array.prototype.map;
                    sort = Object.keys(req.query.sort).map((key) => [
                        key,
                        req.query.sort[key],
                    ]);
                }
                const options = {
                    page: req.query.page || 1,
                    limit: req.query.limit || 10,
                    collation: {
                        locale: 'en',
                    },
                };
                let filteredQuery = {};
                if (req.query.search && req.query.search.trim()) {
                    filteredQuery.$or = [
                        {
                            name: {
                                $regex: new RegExp(req.query.search),
                                $options: 'i',
                            },
                        },
                        {
                            email: {
                                $regex: new RegExp(req.query.search),
                                $options: 'i',
                            },
                        },
                        {
                            mobile_number: {
                                $regex: new RegExp(req.query.search),
                                $options: 'i',
                            },
                        },
                    ];
                }
                if (req.query.start_date && req.query.end_date) {
                    filteredQuery.created_at = {
                        $gte: new Date(req.query.start_date + 'T00:00:00.000Z'),
                        $lte: new Date(req.query.end_date + 'T23:59:59.999Z'),
                    };
                }
                if (req.query.status) {
                    var arrayValues = req.query.status.split(',');
                    var booleanValues = arrayValues.map(function (value) {
                        return value.toLowerCase() === 'true';
                    });
                    filteredQuery.is_active = { $in: booleanValues };
                }
                let query = [
                    {
                        $match: {
                            type: 'Customer',
                        },
                    },
                    {
                        $match: filteredQuery,
                    },
                    {
                        $sort: {
                            created_at: -1,
                        },
                    },
                ];
                var myAggregate = User_1.default.aggregate(query);
                const list = yield User_1.default.aggregatePaginate(myAggregate, options);
                return ResponseHelper_1.default.ok(res, 'SUCCESS', 'List', { list: list }, startTime);
            }
            catch (err) {
                next(err);
            }
        });
    }
    static addEdit(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const startTime = new Date().getTime();
                const { mobile_number, country_code } = req.body;
                const name = req.body.name.trim().toLowerCase();
                const email = req.body.email.trim().toLowerCase();
                const getCustomer = yield User_1.default.findOne({ _id: req.params.id });
                if (!getCustomer) {
                    const customerData = yield User_1.default.findOne({
                        $or: [
                            { email: email },
                            {
                                mobile_number: mobile_number,
                                country_code: country_code,
                                type: 'Customer',
                            },
                        ],
                    });
                    if (customerData) {
                        return ResponseHelper_1.default.conflict(res, 'CONFLICT', 'Customer already exist with this email & phone number', customerData, startTime);
                    }
                    const password = yield Helper_1.default.generatePassword(8, {
                        digits: true,
                        lowercase: true,
                        uppercase: true,
                        symbols: true,
                    });
                    const data = {
                        mobile_number: mobile_number,
                        country_code: country_code,
                        name: name,
                        email: email,
                        type: 'Customer',
                        password: yield Auth_1.default.encryptPassword('Test@123'),
                    };
                    const user = yield new User_1.default(data).save();
                    var emailTemplate = yield EmailTemplate_1.default.findOne({
                        slug: 'welcome-and-password',
                    });
                    var replacedHTML = emailTemplate.description;
                    replacedHTML = replacedHTML
                        .replace('[NAME]', user.name || '')
                        .replace('[PASSWORD]', 'Test@123')
                        .replace('[EMAIL]', user.email || '')
                        .replace('[MOBILE NUMBER]', user.country_code + ' ' + user.mobile_number || '');
                    const sentEmail = yield MailHelper_1.default.sendMail(user.email, emailTemplate.title, replacedHTML);
                    return ResponseHelper_1.default.created(res, 'SUCCESS', 'Customer has been added successfully', { user, sentEmail });
                }
                (getCustomer.name = name ? name : getCustomer.name),
                    (getCustomer.email = email ? email : getCustomer.email),
                    (getCustomer.mobile_number = mobile_number
                        ? mobile_number
                        : getCustomer.mobile_number),
                    (getCustomer.country_code = country_code
                        ? country_code
                        : getCustomer.country_code),
                    getCustomer.save();
                return ResponseHelper_1.default.ok(res, 'SUCCESS', 'Customer has been update successfully', getCustomer, startTime);
            }
            catch (err) {
                next(err);
            }
        });
    }
    static statusChange(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const startTime = new Date().getTime();
                const getCustomer = yield User_1.default.findOne({ _id: req.params.id });
                if (!getCustomer) {
                    return ResponseHelper_1.default.notFound(res, 'NOTFOUND', 'Customer not found', getCustomer, startTime);
                }
                (getCustomer.is_active = !getCustomer.is_active), getCustomer.save();
                return ResponseHelper_1.default.ok(res, 'SUCCESS', 'Status Changed Successfully', getCustomer, startTime);
            }
            catch (err) {
                next(err);
            }
        });
    }
    static view(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const startTime = new Date().getTime();
                const getCustomer = yield User_1.default.findById(req.params.id);
                return ResponseHelper_1.default.ok(res, 'SUCCESS', 'Data get successfully', { customer: getCustomer }, startTime);
            }
            catch (err) {
                next(err);
            }
        });
    }
}
exports.CustomerController = CustomerController;
