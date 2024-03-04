import { Card, Col, DatePicker, Input, Row, Table, Tabs, Tag } from 'antd';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { Link } from 'react-router-dom';

import ShowTotal from '../../components/ShowTotal';
import { WITHDRAW_STATUS } from '../../constants/WithdrawalStatus';
import apiPath from '../../constants/apiPath';
import { Severty, ShowToast } from '../../helper/toast';
import useDebounce from '../../hooks/useDebounce';
import useRequest from '../../hooks/useRequest';
import WithdrawalStatus from './_changeStatus';

const Search = Input.Search;
const { TabPane } = Tabs;

function Withdrawal() {
	const sectionName = 'Withdrawal';
	const routeName = 'withdrawal';
	const api = {
		status: apiPath.orderStatus,
		list: apiPath.withdraw,
	};

	const [searchText, setSearchText] = useState('');
	const { request } = useRequest();
	const [list, setList] = useState([]);

	const [loading, setLoading] = useState(false);
	const [refresh, setRefresh] = useState(false);
	const [pagination, setPagination] = useState({
		current: 1,
		pageSize: 10,
		total: 0,
	});
	const debouncedSearchText = useDebounce(searchText, 300);
	const navigate = useNavigate();
	const [startDate, setStartDate] = useState();
	const [endDate, setEndDate] = useState();
	const [requestId, setRequestId] = useState();
	const [type, setType] = useState("");
	const [requestStatus, setRequestStatus] = useState();
	const [requestShow, setRequestShow] = useState();

	const [statusRefresh, setStatusRefresh] = useState(false);
	const { RangePicker } = DatePicker;

	const view = (id) => {
		navigate(`/order/view/${id}`);
	};

	const columns = [
		{
			title: 'Provider Name',
			render: (_, { name,user_id }) => {
				return user_id ? (
					
					<Link
						target='_blank'
						rel='noreferrer noopener'
						className='cap'
						to={`/user/view/transactions/${user_id}`}
					>
						{name  ? name : '-'}
					</Link>
				) : (
					'-'
				);
			},
		},
		{
			title: 'Amount',
			dataIndex: 'amount',
			key: 'amount',
			render: (_, { amount }) => {
				return amount ? <span className='cap'>{amount}</span> : '-';
			},
		},

		{
			title: 'Status',
			key: 'status',
			render: (_, { status, _id, transaction_type}) => {
				console.log("statusstatus",status,_id)
				let color =
					status === 'approved'
						? 'green'
						: status === 'rejected'
						? 'red'
						: 'yellow';
				return (
					<a>
						<Tag
							color={color}
							key={status}
							onClick={() => onClickStatusChange(_id, status, transaction_type)}
						>
							{status === WITHDRAW_STATUS.pending
								? 'Pending'
								: status === WITHDRAW_STATUS.approved
								? 'Approved'
								: 'Rejected'}
						</Tag>
					</a>
				);
			},
		},

		{
			title: 'Requested On',
			key: 'created_at',
			dataIndex: 'created_at',
			render: (_, { created_at }) => {
				return moment(created_at).format('MM-DD-YYYY');
			},
		},
	];

	const handleTabChange = (status) => {
		fetchData(pagination, '', status);
	};

	useEffect(() => {
		setLoading(true);
		fetchData(pagination);
	}, [refresh, statusRefresh, debouncedSearchText, startDate, endDate]);

	const fetchData = (pagination, filters, orderStatus) => {
		const filterPaymentMethod = filters ? filters.payment_method : null;
		const paymentDoneFilter = filters ? filters.paid : null;
		setLoading(true);
		request({
			url:
				api.list +
				`?page=${pagination ? pagination.current : 1}&limit=${
					pagination?.pageSize ?? 10
				}&status=${
					orderStatus ? orderStatus : 'Pending'
				}&search=${debouncedSearchText}&start_date=${
					startDate ? startDate : ''
				}&end_date=${endDate ? endDate : ''}`,
			method: 'GET',
			onSuccess: ({ data, status, message }) => {
				setLoading(false);
				if (!status) return;
				console.log("withdrawal",data)
				setList(data);
				setPagination((prev) => ({
					...prev,
					current: pagination.current,
					total: data.total,
				}));
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

	const onClickStatusChange = (_id, status,type) => {
		if (
			!(
				status === WITHDRAW_STATUS.approved ||
				status === WITHDRAW_STATUS.rejected
			)
		) {
			changeBookingStatus(_id, status,type);
		}
	};

	const changeBookingStatus = (id, status,type) => {
		setRequestId(id);
		setRequestStatus(status);
		setRequestShow(true);
		setType(type)
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
										onPressEnter={onSearch}
										value={searchText}
										placeholder='Search By Order Id, Customer Name'
									/>
									<RangePicker
										onChange={handleChangeDate}
										disabledDate={(current) =>
											current.isAfter(moment().subtract(1, 'day'))
										}
									/>
								</>
							}
						>
							<div className='total-record-cls'>
								<h4 className='text-right'>
									{pagination.total
										? ShowTotal(pagination.total)
										: ShowTotal(0)}
								</h4>
							</div>

							<div className='custom-tab'>
								<Tabs
									onTabClick={handleTabChange}
									tabBarStyle={{ color: 'green' }}
								>
									<TabPane tab='New Request' key={WITHDRAW_STATUS.pending}>
										<div className='table-responsive customPagination'>
											<Table
												loading={loading}
												columns={columns}
												dataSource={list}
												pagination={{
													defaultPageSize: 10,
													responsive: true,
													total: pagination.total,
													showSizeChanger: true,
													showQuickJumper: true,
													pageSizeOptions: ['10', '20', '30', '50'],
												}}
												onChange={handleChange}
												className='ant-border-space'
											/>
										</div>
									</TabPane>

									<TabPane tab='Approved' key={WITHDRAW_STATUS.approved}>
										<div className='table-responsive customPagination'>
											<Table
												loading={loading}
												columns={columns}
												dataSource={list}
												pagination={{
													defaultPageSize: 10,
													responsive: true,
													total: pagination.total,
													showSizeChanger: true,
													showQuickJumper: true,
													pageSizeOptions: ['10', '20', '30', '50'],
												}}
												onChange={handleChange}
												className='ant-border-space'
											/>
										</div>
									</TabPane>

									<TabPane tab='Rejected' key={WITHDRAW_STATUS.rejected}>
										<div className='table-responsive customPagination'>
											<Table
												loading={loading}
												columns={columns}
												dataSource={list}
												pagination={{
													defaultPageSize: 10,
													responsive: true,
													total: pagination.total,
													showSizeChanger: true,
													showQuickJumper: true,
													pageSizeOptions: ['10', '20', '30', '50'],
												}}
												onChange={handleChange}
												className='ant-border-space'
											/>
										</div>
									</TabPane>
								</Tabs>
							</div>
						</Card>
					</Col>
				</Row>
			</div>
			{requestStatus && (
				<WithdrawalStatus
					show={requestShow}
					type={type}
					hide={() => {
						setRequestShow(false);
					}}
					status={requestStatus}
					requestId={requestId}
					statusRefresh={() => setRefresh((prev) => !prev)}
				/>
			)}
		</>
	);
}

export default Withdrawal;
