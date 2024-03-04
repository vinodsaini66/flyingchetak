import { Badge, Card, Col, Row, Table, Typography } from 'antd';
import _ from 'lodash';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import apiPath from '../../constants/apiPath';
import { Severty, ShowToast } from '../../helper/toast';
import useRequest from '../../hooks/useRequest';

const PRICE = 'USD';
function Transaction() {
	const { Title } = Typography;
	const { request } = useRequest();
	const [loading, setLoading] = useState(false);
	const [transaction, setTransaction] = useState([]);
	const [dashboard, setDashboard] = useState({
		customerCount: 0,
		serviceProviderCount: 0,
	});


	const transactionColumn = [
		{
			title: 'Transaction Id',
			render: (_, { transaction_id, user_id }) => {
				return transaction_id ? (
					<Link
						target='_blank'
						rel='noreferrer noopener'
						className='cap'
						to={`/user/view/transactions/${user_id}`}
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
			render: (_, { name,user_id }) => {
				return  (
					<Link
						target='_blank'
						rel='noreferrer noopener'
						className='cap'
						to={`/user/view/${user_id}`}
					>
						{name ? name : '-'}
					</Link>
				)
			}
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
			title: 'Transaction Type',
			dataIndex: 'transaction_type',
			key: 'transaction_type',
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
			url: apiPath.transaction,
			method: 'GET',
			onSuccess: (data) => {
				setLoading(false);
				if (data?.data?.data.length>0) {
					setTransaction(data.data.data);
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

				<Row gutter={[24, 0]}>
					<Col span={24}>
						<Card bordered={false} className='criclebox tablespace '>
							<p className='dashboard-table-heading'>Transactions</p>
							<div className='table-responsive'>
								<Table
									loading={loading}
									columns={transactionColumn}
									dataSource={transaction}
									className='ant-border-space'
                                    pagination={{
                                        defaultPageSize: 10,
                                        responsive: true,
                                        showSizeChanger: true,
                                        showQuickJumper: true,
                                        pageSizeOptions: ['10', '20', '30', '50'],
                                    }}
								/>
							</div>
						</Card>
					</Col>
				</Row>
			</div>
		</>
	);
}

export default Transaction;
