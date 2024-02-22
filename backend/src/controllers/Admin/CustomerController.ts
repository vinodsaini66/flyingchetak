import User from '../../models/User';
import _RS from '../../helpers/ResponseHelper';
import Auth from '../../Utils/Auth';
import Helper from '../../helpers/Helper';
import EmailTemplate from '../../models/EmailTemplate';
import MailHelper from '../../helpers/MailHelper';

export class CustomerController {
	static async list(req, res, next) {
		try {
			const startTime = new Date().getTime();
			let sort: any = [['createdAt', -1]];

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
			let filteredQuery: any = {};

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
			let query: any = [
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
			var myAggregate = User.aggregate(query);
			const list = await User.aggregatePaginate(myAggregate, options);
			return _RS.ok(res, 'SUCCESS', 'List', { list: list }, startTime);
		} catch (err) {
			next(err);
		}
	}

	static async addEdit(req, res, next) {
		try {
			const startTime = new Date().getTime();
			const { mobile_number, country_code } = req.body;

			const name = req.body.name.trim().toLowerCase();
			const email = req.body.email.trim().toLowerCase();

			const getCustomer = await User.findOne({ _id: req.params.id });

			if (!getCustomer) {
				const customerData = await User.findOne({
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
					return _RS.conflict(
						res,
						'CONFLICT',
						'Customer already exist with this email & phone number',
						customerData,
						startTime
					);
				}

				const password = await Helper.generatePassword(8, {
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
					password: await Auth.encryptPassword('Test@123'),
				};

				const user = await new User(data).save();

				var emailTemplate = await EmailTemplate.findOne({
					slug: 'welcome-and-password',
				});

				var replacedHTML = emailTemplate.description;
				replacedHTML = replacedHTML
					.replace('[NAME]', user.name || '')
					.replace('[PASSWORD]', 'Test@123')
					.replace('[EMAIL]', user.email || '')
					.replace(
						'[MOBILE NUMBER]',
						user.country_code + ' ' + user.mobile_number || ''
					);

				const sentEmail = await MailHelper.sendMail(
					user.email,
					emailTemplate.title,
					replacedHTML
				);

				return _RS.created(
					res,
					'SUCCESS',
					'Customer has been added successfully',
					{ user, sentEmail }
				);
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

			return _RS.ok(
				res,
				'SUCCESS',
				'Customer has been update successfully',
				getCustomer,
				startTime
			);
		} catch (err) {
			next(err);
		}
	}

	static async statusChange(req, res, next) {
		try {
			const startTime = new Date().getTime();

			const getCustomer = await User.findOne({ _id: req.params.id });
			if (!getCustomer) {
				return _RS.notFound(
					res,
					'NOTFOUND',
					'Customer not found',
					getCustomer,
					startTime
				);
			}

			(getCustomer.is_active = !getCustomer.is_active), getCustomer.save();

			return _RS.ok(
				res,
				'SUCCESS',
				'Status Changed Successfully',
				getCustomer,
				startTime
			);
		} catch (err) {
			next(err);
		}
	}


	static async view(req, res, next) {
		try {
			const startTime = new Date().getTime();
			const getCustomer = await User.findById(req.params.id);

			return _RS.ok(
				res,
				'SUCCESS',
				'Data get successfully',
				{ customer: getCustomer },
				startTime
			);
		} catch (err) {
			next(err);
		}
	}
}
