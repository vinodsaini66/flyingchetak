import { Card, Col, DatePicker, Input, Row, Table, Tabs, Tag } from 'antd';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { Link } from 'react-router-dom';

import ShowTotal from '../../components/ShowTotal';
import apiPath from '../../constants/apiPath';
import { Severty, ShowToast } from '../../helper/toast';
import useDebounce from '../../hooks/useDebounce';
import useRequest from '../../hooks/useRequest';
import WithdrawalStatus from './_changeStatus';

const Search = Input.Search;
const { TabPane } = Tabs;

function Withdrawal() {
	const sectionName = 'Game';
	const routeName = 'game';

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
	const [requestStatus, setRequestStatus] = useState();
	const [requestShow, setRequestShow] = useState();

	const [statusRefresh, setStatusRefresh] = useState(false);
	const { RangePicker } = DatePicker;

	const view = (id) => {
		navigate(`/order/view/${id}`);
	};

	const columns = [
		{
			title: 'Player Name',
			render: (_, { user_id }) => {
				return user_id ? (
					<Link
						target='_blank'
						rel='noreferrer noopener'
						className='cap'
						to={`/user/service-provider/view/${user_id._id}`}
					>
						{user_id && user_id.name ? user_id.name : '-'}
					</Link>
				) : (
					'-'
				);
			},
		},
		{
			title: 'Bet Amount',
			dataIndex: 'bet_amount',
			key: 'bet_amount',
			render: (_, { bet_amount }) => {
				return bet_amount ? <span className='cap'>{bet_amount}</span> : '-';
			},
		},
		{
			title: 'Withdraw Amount',
			dataIndex: 'withdraw_amount',
			key: 'withdraw_amount',
			render: (_, { withdraw_amount }) => {
				return withdraw_amount ? (
					<span className='cap'>{withdraw_amount}</span>
				) : (
					'-'
				);
			},
		},
		{
			title: 'Status',
			key: 'status',
			render: (_, { status, _id }) => {
				let color = status === 'win' ? 'green' : 'error';
				return (
					<a>
						<Tag
							color={color}
							key={status}
							// onClick={() => onClickStatusChange(_id, status)}
						>
							{status}
						</Tag>
					</a>
				);
			},
		},
		{
			title: 'Date And Time',
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
					orderStatus ? orderStatus : 'pending'
				}&search=${debouncedSearchText}&start_date=${
					startDate ? startDate : ''
				}&end_date=${endDate ? endDate : ''}`,
			method: 'GET',
			onSuccess: ({ data, status, message }) => {
				setLoading(false);
				if (!status) return;
				setList(data.list);
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

	const changeBookingStatus = (id, status) => {
		setRequestId(id);
		setRequestStatus(status);
		setRequestShow(true);
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
								{/* <Tabs
                  onTabClick={handleTabChange}
                  tabBarStyle={{ color: "green" }}
                >
                  <TabPane tab='New Request' key={WITHDRAW_STATUS.pending}> */}
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
								{/* </TabPane> */}

								{/* <TabPane tab='Approved' key={WITHDRAW_STATUS.approved}>
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
                          pageSizeOptions: ["10", "20", "30", "50"],
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
                          pageSizeOptions: ["10", "20", "30", "50"],
                        }}
                        onChange={handleChange}
                        className='ant-border-space'
                      />
                    </div>
                  </TabPane> */}
								{/* </Tabs> */}
							</div>
						</Card>
					</Col>
				</Row>
			</div>
			{requestStatus && (
				<WithdrawalStatus
					show={requestShow}
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
