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
exports.EmailTemplateController = void 0;
const EmailTemplate_1 = require("../../models/EmailTemplate");
const ResponseHelper_1 = require("../../helpers/ResponseHelper");
const AdminSetting_1 = require("../../models/AdminSetting");
var slug = require('slug');
class EmailTemplateController {
    static list(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const startTime = new Date().getTime();
                let sort = [['createdAt', -1]];
                if (req.query.sort) {
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
                            title: {
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
                        $match: filteredQuery,
                    },
                    {
                        $sort: {
                            created_at: -1,
                        },
                    },
                ];
                var myAggregate = EmailTemplate_1.default.aggregate(query);
                const list = yield EmailTemplate_1.default.aggregatePaginate(myAggregate, options);
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
                const { title, subject, description } = req.body;
                const getEmailTemp = yield EmailTemplate_1.default.findOne({ _id: req.params.id });
                if (!getEmailTemp) {
                    const EmailTempData = yield EmailTemplate_1.default.findOne({ title: title });
                    if (EmailTempData) {
                        return ResponseHelper_1.default.conflict(res, 'COFLICT', 'Email template already exist with this title', EmailTempData, startTime);
                    }
                    const data = {
                        title: title,
                        subject: subject,
                        description: description,
                        slug: slug(title, { lower: true }),
                    };
                    const user = yield new EmailTemplate_1.default(data).save();
                    return ResponseHelper_1.default.created(res, 'SUCCESS', 'Email template has been added successfully', user);
                }
                (getEmailTemp.title = title ? title : getEmailTemp.title),
                    (getEmailTemp.subject = subject ? subject : getEmailTemp.subject),
                    (getEmailTemp.description = description
                        ? description
                        : getEmailTemp.description),
                    getEmailTemp.save();
                return ResponseHelper_1.default.ok(res, 'SUCCESS', 'Email template has been update successfully', getEmailTemp, startTime);
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
                const getEmailTemp = yield EmailTemplate_1.default.findOne({ _id: req.params.id });
                if (!getEmailTemp) {
                    return ResponseHelper_1.default.notFound(res, 'NOTFOUND', 'Email template not found', getEmailTemp, startTime);
                }
                (getEmailTemp.is_active = !getEmailTemp.is_active), getEmailTemp.save();
                return ResponseHelper_1.default.ok(res, 'SUCCESS', 'Status changed successfully', getEmailTemp, startTime);
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
                const getEmailTemp = yield EmailTemplate_1.default.findOne({ _id: req.params.id });
                const settings = yield AdminSetting_1.default.findOne();
                return ResponseHelper_1.default.ok(res, 'SUCCESS', 'Data get successfully', Object.assign(Object.assign({}, getEmailTemp._doc), { contact_info: {
                        email: settings.email,
                        country_code: settings.country_code,
                        mobile_number: settings.mobile_number,
                    } }), startTime);
            }
            catch (err) {
                next(err);
            }
        });
    }
}
exports.EmailTemplateController = EmailTemplateController;
