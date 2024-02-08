import { Badge, Card, Col, Row, Table, Typography } from 'antd';
import _ from 'lodash';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import apiPath from '../../constants/apiPath';
import { Severty, ShowToast } from '../../helper/toast';
import useRequest from '../../hooks/useRequest';

const PRICE = 'USD';
function Home() {
	const { Title } = Typography;
	const { request } = useRequest();
	const [loading, setLoading] = useState(false);
	const [transaction, setTransaction] = useState([]);

	const [earnings, setEarnings] = useState({});

	const [dashboard, setDashboard] = useState({
		customerCount: 0,
		serviceProviderCount: 0,
	});

	console.log('dashboard', dashboard);

	const users = [
		{
			today: 'Number of Users',
			title: `${
				dashboard && dashboard.customerCount ? dashboard.customerCount : 0
			}`,
			percent: '1s0%',
			icon: <i className='fa fa-user'></i>,
			bnb: 'bnb2',
			url: '/users',
		},
	];

	const earningsColumn = [
		{
			title: 'Earnings (USD)',
			value: `${earnings && earnings.balance ? earnings.balance : 0}`,
			icon: <i class='fas fa-money-bill'></i>,
		},
		{
			title: 'Total Balance (USD)',
			value: `${
				earnings && earnings.total_balance ? earnings.total_balance : 0
			}`,
			icon: <i class='fas fa-balance-scale'></i>,
		},
		{
			title: 'Revenue (USD)',
			value: `${earnings && earnings.revenue ? earnings.revenue : 0}`,
			icon: <i class='fas fa-chart-bar'></i>,
		},
	];

	const transactionColumn = [
		{
			title: 'Transaction Id',
			render: (_, { transaction_id, _id }) => {
				return transaction_id ? (
					<Link
						target='_blank'
						rel='noreferrer noopener'
						className='cap'
						to={`/report/view/${_id}`}
					>
						{transaction_id ? transaction_id : '-'}
					</Link>
				) : (
					'-'
				);
			},
		},
		{
			title: 'Payee',
			dataIndex: 'payee',
			key: 'payee',
			render: (_, { name }) => {
				return name ? name : '-';
			},
		},
		{
			title: 'Amount (' + PRICE + ')',
			dataIndex: 'amount',
			key: 'amount',
			render: (_, { amount }) => {
				return amount ? amount : '-';
			},
		},
		{
			title: 'Receiver',
			dataIndex: 'receiver',
			key: 'receiver',
			render: (_, { receiver }) => {
				return receiver && receiver.name ? receiver.name : '-';
			},
		},
		{
			title: 'Payment Status',
			key: 'payment_status',
			render: (_, { payment_status }) => {
				return (
					<>
						{payment_status === 'paid' ? (
							<Badge colorSuccess status='success' text='Paid' />
						) : (
							<Badge status='yellow' text='Pending' />
						)}
					</>
				);
			},
		},
		{
			title: 'Transaction On',
			key: 'created_at',
			dataIndex: 'created_at',
			render: (_, { created_at }) => {
				return moment(created_at).format('MM-DD-YYYY');
			},
		},
	];

	useEffect(() => {
		setLoading(true);
		request({
			url: apiPath.dashboard,
			method: 'GET',
			onSuccess: (data) => {
				setLoading(false);
				setDashboard({
					customerCount: data.data.customerCount,
				});
				if (data.data.tentransaction && data.data.tentransaction.length > 0) {
					setTransaction(data.data.tentransaction);
				}
				if (!!data.data.earnings) {
					setEarnings(data.data.earnings);
				}
			},
			onError: (error) => {
				ShowToast(error, Severty.ERROR);
			},
		});
	}, []);

	return (
		<>
			<div className='layout-content'>
				<Row className='rowgap-vbox' gutter={[24, 0]}>
					{_.map(users, (item, index) => (
						<Col key={index} md={5} style={{ marginBottom: '20px' }}>
							<Link to={item.url}>
								<Card
									bordered={false}
									className='criclebox'
									style={{ height: '100%' }}
								>
									<div className='number'>
										<Row align='middle' gutter={[24, 0]}>
											<Col xs={18}>
												{/* <Link to={item.url}> */}
												<span>{item.today}</span>
												<Title level={3}>{item.title}</Title>
												{/* </Link> */}
											</Col>
											<Col xs={6}>
												<div className='icon-box'>{item.icon}</div>
											</Col>
										</Row>
									</div>
								</Card>
							</Link>
						</Col>
					))}

					{_.map(earningsColumn, (item, index) => (
						<Col key={index} md={4} style={{ marginBottom: '20px' }}>
							<Card
								bordered={false}
								className='criclebox'
								style={{ height: '100%' }}
							>
								<div className='number'>
									<Row align='middle' gutter={[24, 0]}>
										<Col xs={18}>
											<span>{item.title}</span>
											<Title level={3}>{item.value}</Title>
										</Col>
										<Col xs={6}>
											<div className='icon-box'>{item.icon}</div>
										</Col>
									</Row>
								</div>
							</Card>
						</Col>
					))}
				</Row>

				<Row gutter={[24, 0]}>
					<Col span={24}>
						<Card bordered={false} className='criclebox tablespace '>
							<p className='dashboard-table-heading'>Recent 10 Transactions</p>
							<div className='table-responsive'>
								<Table
									loading={loading}
									columns={transactionColumn}
									dataSource={transaction}
									pagination={false}
									className='ant-border-space'
								/>
							</div>
						</Card>
					</Col>
				</Row>
			</div>
		</>
	);
}

export default Home;
