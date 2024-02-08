import _RS from '../../helpers/ResponseHelper';
import Content from '../../models/Content';

var slug = require('slug');

export class ContentController {
	static async list(req, res, next) {
		try {
			const startTime = new Date().getTime();

			let sort: any = [['createdAt', -1]];
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
			let filteredQuery: any = {};
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
			let query: any = [
				{
					$match: filteredQuery,
				},
				{
					$sort: {
						created_at: -1,
					},
				},
			];
			var myAggregate = Content.aggregate(query);
			const list = await Content.aggregatePaginate(myAggregate, options);
			return _RS.ok(res, 'SUCCESS', 'List', { list: list }, startTime);
		} catch (err) {
			next(err);
		}
	}

	static async addEdit(req, res, next) {
		try {
			const startTime = new Date().getTime();
			const { description, name } = req.body;

			const getContent = await Content.findOne({ _id: req.params.id });

			if (!getContent) {
				const contentData = await Content.findOne({ name: name });

				if (contentData) {
					return _RS.conflict(
						res,
						'CONFLICT',
						'Content already exist with this name',
						contentData,
						startTime
					);
				}

				const data = {
					name: name,
					description: description,
					slug: slug(name, { lower: true }),
				};

				const user = await new Content(data).save();
				return _RS.created(
					res,
					'SUCCESS',
					'Content has been added successfully',
					user
				);
			}

			(getContent.name = name ? name : getContent.name),
				(getContent.description = description
					? description
					: getContent.description),
				getContent.save();

			return _RS.ok(
				res,
				'SUCCESS',
				'Content has been update successfully',
				getContent,
				startTime
			);
		} catch (err) {
			next(err);
		}
	}

	static async statusChange(req, res, next) {
		try {
			const startTime = new Date().getTime();

			const getContent = await Content.findOne({ _id: req.params.id });
			if (!getContent) {
				return _RS.notFound(
					res,
					'NOTFOUND',
					'Content not found',
					getContent,
					startTime
				);
			}

			(getContent.is_active = !getContent.is_active), getContent.save();

			return _RS.ok(
				res,
				'SUCCESS',
				'Status changed successfully',
				getContent,
				startTime
			);
		} catch (err) {
			next(err);
		}
	}

	static async view(req, res, next) {
		try {
			const startTime = new Date().getTime();
			const getContent = await Content.findOne({ _id: req.params.id });

			return _RS.ok(
				res,
				'SUCCESS',
				'Data get successfully',
				getContent,
				startTime
			);
		} catch (err) {
			next(err);
		}
	}
}
