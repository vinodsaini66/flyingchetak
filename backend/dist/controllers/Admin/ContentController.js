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
exports.ContentController = void 0;
const ResponseHelper_1 = require("../../helpers/ResponseHelper");
const Content_1 = require("../../models/Content");
var slug = require('slug');
class ContentController {
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
                            name: {
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
                var myAggregate = Content_1.default.aggregate(query);
                const list = yield Content_1.default.aggregatePaginate(myAggregate, options);
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
                const { description, name } = req.body;
                const getContent = yield Content_1.default.findOne({ _id: req.params.id });
                if (!getContent) {
                    const contentData = yield Content_1.default.findOne({ name: name });
                    if (contentData) {
                        return ResponseHelper_1.default.conflict(res, 'CONFLICT', 'Content already exist with this name', contentData, startTime);
                    }
                    const data = {
                        name: name,
                        description: description,
                        slug: slug(name, { lower: true }),
                    };
                    const user = yield new Content_1.default(data).save();
                    return ResponseHelper_1.default.created(res, 'SUCCESS', 'Content has been added successfully', user);
                }
                (getContent.name = name ? name : getContent.name),
                    (getContent.description = description
                        ? description
                        : getContent.description),
                    getContent.save();
                return ResponseHelper_1.default.ok(res, 'SUCCESS', 'Content has been update successfully', getContent, startTime);
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
                const getContent = yield Content_1.default.findOne({ _id: req.params.id });
                if (!getContent) {
                    return ResponseHelper_1.default.notFound(res, 'NOTFOUND', 'Content not found', getContent, startTime);
                }
                (getContent.is_active = !getContent.is_active), getContent.save();
                return ResponseHelper_1.default.ok(res, 'SUCCESS', 'Status changed successfully', getContent, startTime);
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
                const getContent = yield Content_1.default.findOne({ _id: req.params.id });
                return ResponseHelper_1.default.ok(res, 'SUCCESS', 'Data get successfully', getContent, startTime);
            }
            catch (err) {
                next(err);
            }
        });
    }
}
exports.ContentController = ContentController;
