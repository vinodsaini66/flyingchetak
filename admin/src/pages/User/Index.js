import {
	Avatar,
	Button,
	Card,
	Col,
	DatePicker,
	Image,
	Input,
	Row,
	Table,
	Tag,
	Tooltip,
} from 'antd';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';

import ConfirmationBox from '../../components/ConfirmationBox';
import ShowTotal from '../../components/ShowTotal';
import apiPath from '../../constants/apiPath';
import { USER_TYPE } from '../../constants/user-type.constants';
import { Severty, ShowToast } from '../../helper/toast';
import useDebounce from '../../hooks/useDebounce';
import useRequest from '../../hooks/useRequest';
import UserFrom from './UserFrom';
import UserTransaction from './Transaction';

const Search = Input.Search;
const { RangePicker } = DatePicker;

function Index() {
	const sectionName = 'User';
	const routeName = 'user';
	const type = USER_TYPE.customer;

	const api = {
		status: apiPath.statusCustomer,
		addEdit: apiPath.addEditCustomer,
		list: apiPath.listCustomer,
		transaction:apiPath.getTraByUserId
	};

	const [searchText, setSearchText] = useState('');
	const { request } = useRequest();
	const { showConfirm } = ConfirmationBox();
	const [list, setList] = useState([]);
	const [loading, setLoading] = useState(false);
	const [refresh, setRefresh] = useState(false);
	const [visible, setVisible] = useState(false);
	const [transactionVisible, setTransactionVisible] = useState(false);
	const [selected, setSelected] = useState();
	const [startDate, setStartDate] = useState();
	const [endDate, setEndDate] = useState();
	const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });
	const debouncedSearchText = useDebounce(searchText, 300);
	const navigate = useNavigate();

	const view = (id) => {
		navigate(`/user/view/${id}`);
	};
	const transactionView = (id) => {
		navigate(`/user/view/transactions/${id}`)
	}

	const columns = [
		{
			title: 'Name',
			dataIndex: 'name',
			key: 'name',
			render: (_, { name, _id, image }) => {
				return name && !image ? (
					<>
						<Avatar
							style={{ backgroundColor: '#00a2ae', verticalAlign: 'middle' }}
							className='cap'
							size={40}
						>
							{' '}
							{name.charAt(0)}{' '}
						</Avatar>
						<a style={{ marginLeft: 12 }} onClick={(e) => view(_id)}>
							{name.charAt(0).toUpperCase()}
							{name.slice(1).toLowerCase()}
						</a>
					</>
				) : (
					<>
						<Image
							className='image-index-radius'
							src={
								process.env.REACT_AWS_URL
									? process.env.REACT_AWS_URL
									: 'https://inventcolabs.s3.amazonaws.com/' + image
							}
						/>
						<a
							style={{ marginLeft: 12 }}
							className='cap'
							onClick={(e) => view(_id)}
						>
							{name}
						</a>
					</>
				);
			},
		},
		{
			title: 'Mobile Number',
			render: (_, { mobile_number, country_code }) => {
				return (
					(country_code ? '+' + country_code + '-' : '+1') +
					(mobile_number ? mobile_number : '')
				);
			},
		},
		{
			title: 'Email',
			dataIndex: 'email',
			key: 'email',
			render: (_, { email }) => {
				return email ? email : '-';
			},
		},
		{
			title: 'Status',
			key: 'is_active',
			filters: [
				{
					text: 'Active',
					value: true,
				},
				{
					text: 'Inactive',
					value: false,
				},
			],
			render: (_, { is_active, is_deleted, _id }) => {
				let color = is_active ? 'green' : 'red';
				return (
					<a>
						<Tag
							onClick={(e) =>
								showConfirm({
									record: _id,
									path: api.status,
									onLoading: () => setLoading(true),
									onSuccess: () => setRefresh((prev) => !prev),
								})
							}
							color={color}
							key={is_active}
						>
							{is_active && !is_deleted ? 'Active' : 'Inactive'}
						</Tag>
					</a>
				);
			},
		},
		{
			title: 'Registered On',
			key: 'created_at',
			dataIndex: 'created_at',
			render: (_, { created_at }) => {
				return moment(created_at).format('MM-DD-YYYY');
			},
		},
		{
			title: 'Action',
			fixed: 'right',
			render: (_, record) => {
				return (
					<>
						<Tooltip
							title={'Update ' + sectionName}
							color={'purple'}
							key={'update' + routeName}
						>
							<Button
								title='Edit'
								onClick={() => {
									setSelected(record);
									setVisible(true);
								}}
							>
								<i className='fa fa-light fa-pen'></i>
							</Button>
						</Tooltip>

						<Tooltip
							title={'View ' + sectionName}
							color={'purple'}
							key={'view' + routeName}
						>
							<Button title='View' onClick={(e) => view(record._id)}>
								<i className='fa fa-light fa-eye'></i>
							</Button>
						</Tooltip>
						<Tooltip
							title={'Transactions ' + sectionName}
							color={'purple'}
							key={'transactions' + routeName}
						>
							<Button title='transactions' onClick={(e) => transactionView(record._id)}>
								<i className='fa fa-light fa-eye'></i>
							</Button>
						</Tooltip>
					</>
				);
			},
		},
	];

	useEffect(() => {
		setLoading(true);
		fetchData(pagination);
	}, [refresh, debouncedSearchText, startDate, endDate]);

	const fetchData = (pagination, filters) => {
		const filterActive = filters ? filters.is_active : null;

		request({
			url: api.list +
			`?status=${filterActive ? filterActive.join(",") : ""}&page=${
			  pagination ? pagination.current : 1
			}&limit=${
			  pagination ? pagination.pageSize : 10
			}&search=${debouncedSearchText}&start_date=${
			  startDate ? startDate : ""
			}&end_date=${endDate ? endDate : ""}`,
			method: 'GET',
			onSuccess: (data) => {
				setLoading(false);
				setList(data.data);
				// setPagination((prev) => ({
				//   current: pagination.current,
				//   total: data.data.list.totalDocs,
				// }));
			},
			onError: (error) => {
				ShowToast(error, Severty.ERROR);
			},
		});
	};

	const handleChange = (pagination, filters) => {
		fetchData(pagination, filters);
	};

	const onSearch = (e) => {
		setSearchText(e.target.value);
		setPagination({ current: 1 });
	};

	const handleChangeDate = (e) => {
		if (e != null) {
			setStartDate(moment(e[0]._d).format('YYYY-MM-DD'));
			setEndDate(moment(e[1]._d).format('YYYY-MM-DD'));
		} else {
			setStartDate();
			setEndDate();
		}
	};

	return (
		<>
			<div className='tabled'>
				<Row gutter={[24, 0]}>
					<Col xs='24' xl={24}>
						<Card
							bordered={false}
							className='criclebox tablespace mb-24'
							title={sectionName + ' Management'}
							extra={
								<>
									<Search
										size='large'
										onChange={onSearch}
										value={searchText}
										onPressEnter={onSearch}
										placeholder='Search By Name, Mobile, Email'
									/>
									<RangePicker
										onChange={handleChangeDate}
										disabledDate={(current) =>
											current.isAfter(moment().subtract(1, 'day'))
										}
									/>
									<Button
										onClick={(e) => {
											setVisible(true);
											setSearchText('');
										}}
									>
										Add {sectionName}
									</Button>
								</>
							}
						>
							<div className='total-record-cls'>
								<h4 className='text-right'>
									{/* {pagination.total
										? ShowTotal(pagination.total)
										: ShowTotal(0)} */}
										Total {list?.length>0 && list.length} Record
								</h4>
							</div>
							<div className='table-responsive customPagination'>
								<Table
									loading={loading}
									columns={columns}
									dataSource={list}
									pagination={{
										defaultPageSize: 10,
										responsive: true,
										showSizeChanger: true,
										showQuickJumper: true,
										pageSizeOptions: ['10', '20', '30', '50'],
									}}
									onChange={handleChange}
									className='ant-border-space'
								/>
							</div>
						</Card>
					</Col>
				</Row>
			</div>
			{visible && (
				<UserFrom
					type={type}
					path={api.addEdit}
					sectionName={sectionName}
					show={visible}
					hide={() => {
						setSelected();
						setVisible(false);
					}}
					data={selected}
					refresh={() => setRefresh((prev) => !prev)}
				/>
			)}
		</>
	);
}
export default Index;
