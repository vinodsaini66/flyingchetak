import { Avatar, Badge, Card, Col, Image, Row, Skeleton, Table, Tag } from 'antd';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { WITHDRAW_STATUS } from '../../constants/WithdrawalStatus';
import apiPath from '../../constants/apiPath';
import { Severty, ShowToast } from '../../helper/toast';
import useRequest from '../../hooks/useRequest';
import WithdrawalStatus from '../Withdraw/_changeStatus';

function UserTransaction() {
	const sectionName = 'Customer';
	const routeName = 'customer';
	const params = useParams();
	const { request } = useRequest();
	const [debitList, setDebitList] = useState([]);
	const [creditList, setCreditList] = useState([]);
	const [betList, setBetList] = useState([]);
	const [loading, setLoading] = useState(false);
	const [requestId, setRequestId] = useState();
	const [requestStatus, setRequestStatus] = useState();
	const [requestShow, setRequestShow] = useState();
	const [refresh, setRefresh] = useState(false);

	const [vehicles, setVehicles] = useState();

	const fetchData = (id) => {
		setLoading(true);
		request({
			url: apiPath.getTraByUserId + '/' + id,
			method: 'GET',
			onSuccess: (data) => {
				console.log("datadata================>>>>>>>>>>>",data.data)
				let debitArray = []
				let creditArray = []
				data?.data?.get.map((item,i)=>{
					return item.transaction_type === "Debit" && debitArray.push(item) || item.transaction_type === "Credit" && creditArray.push(item)   
				})
				setBetList(data.data.betData)
				setDebitList(debitArray)
				setCreditList(creditArray)
				setLoading(false);
			},
			onError: (error) => {
				ShowToast(error, Severty.ERROR);
			},
		});
	};

	const onClickStatusChange = (_id, status) => {
		if (
			!(
				status === WITHDRAW_STATUS.approved ||
				status === WITHDRAW_STATUS.rejected ||
				status === WITHDRAW_STATUS.success
			)
		) {
			changeBookingStatus(_id, status);
		}
	};
	
	const changeBookingStatus = (id, status) => {
		setRequestId(id);
		setRequestStatus(status);
		setRequestShow(true);
	};

	const column = [
		{
			title: 'Payee',
			dataIndex: 'payee',
			key: 'payee',
			// render: (_, { vehicle_number }) => {
			// 	return vehicle_number;
			// },
		},
		{
			title: 'Status',
			key: 'status',
			render: (_, { status, _id }) => {
				console.log("statusstatus",status,_id)
				let color =
					status === 'Success'
						? 'green'
						: status === 'Rejected'
						? 'red'
						: 'yellow';
				return (
					<a>
						<Tag
							color={color}
							key={status}
							onClick={() => onClickStatusChange(_id, status)}
						>
							{status === WITHDRAW_STATUS.pending
								? 'Pending'
								: status === WITHDRAW_STATUS.success
								? 'Success'
								: 'Rejected'}
						</Tag>
					</a>
				);
			},
		},
		{
			title: 'Transaction Type',
			dataIndex: 'transaction_type',
			key: 'transaction_type',
			// render: (_, { category_id }) => {
			// 	return category_id && category_id?.name ? category_id.name : '-';
			// },
		},
		{
			title: 'Amount',
			dataIndex: 'amount',
			key: 'amount',
			// render: (_, { model_id }) => {
			// 	return model_id && model_id?.name ? model_id.name : '-';
			// },
		},
		{
			title: 'Date',
			dataIndex: 'created_at',
			key: 'fuel_id',
			render: (_, { created_at }) => {
				return moment(created_at).format("DD-MM-YYYY")
			},
		},
		
	];

	const betColumn = [
		{
			title: 'Game ID',
			dataIndex: 'game_id',
			key: 'game_id',
			// render: (_, { vehicle_number }) => {
			// 	return vehicle_number;
			// },
		},
		{
			title: 'Deposite Amount',
			dataIndex: 'deposit_amount',
			key: 'deposite_amount',
			// render: (_, { model_id }) => {
			// 	return model_id && model_id?.name ? model_id.name : '-';
			// },
		},
		{
			title: 'Win Amount',
			dataIndex: 'win_amount',
			key: 'win_amount',
			// render: (_, { model_id }) => {
			// 	return model_id && model_id?.name ? model_id.name : '-';
			// },
		},
		{
			title: 'Status',
			dataIndex: 'status',
			key: 'status',
			// render: (_, { brand_id }) => {
			// 	return brand_id && brand_id?.name ? brand_id.name : '-';
			// },
		},
		// {
		// 	title: 'Transaction Type',
		// 	dataIndex: 'transaction_type',
		// 	key: 'transaction_type',
		// 	// render: (_, { category_id }) => {
		// 	// 	return category_id && category_id?.name ? category_id.name : '-';
		// 	// },
		// },
		
		{
			title: 'Date',
			dataIndex: 'created_at',
			key: 'fuel_id',
			render: (_, { created_at }) => {
				return moment(created_at).format("DD-MM-YYYY")
			},
		},
		
	];

	const handleChange = () => {

	}

	useEffect(() => {
		fetchData(params.id);
	}, []);

	return (
		<>
			

			<Row gutter={24}>
				<Col xs={12} lg={12}>
					<Card title={'Debit / Deposite List'}>
						<div className='table-responsive customPagination'>
							<Table
								loading={loading}
								columns={column}
								dataSource={debitList}
								pagination={{
								  defaultPageSize: 10,
								  responsive: true,
								  // total: pagination.total,
								  showSizeChanger: true,
								  showQuickJumper: true,
								  pageSizeOptions: ["10", "20", "30", "50"],
								}}
								onChange={handleChange}
								className='ant-border-space'
							/>
						</div>
					</Card>
				</Col>
				<Col xs={12} lg={12}>
					<Card title={'Credit / Withdrawal List'}>
						<div className='table-responsive customPagination'>
							<Table
								loading={loading}
								columns={column}
								dataSource={creditList}
								pagination={{
								  defaultPageSize: 10,
								  responsive: true,
								  // total: pagination.total,
								  showSizeChanger: true,
								  showQuickJumper: true,
								  pageSizeOptions: ["10", "20", "30", "50"],
								}}
								// onChange={handleChange}
								className='ant-border-space'
							/>
						</div>
					</Card>
				</Col>
			</Row>
			<Row>
			<Col xs={24} lg={24}>
					<Card title={'Bet List'}>
						<div className='table-responsive customPagination'>
							<Table
								loading={loading}
								columns={betColumn}
								dataSource={betList}
								pagination={{
								  defaultPageSize: 10,
								  responsive: true,
								  // total: pagination.total,
								  showSizeChanger: true,
								  showQuickJumper: true,
								  pageSizeOptions: ["10", "20", "30", "50"],
								}}
								// onChange={handleChange}
								className='ant-border-space'
							/>
						</div>
					</Card>
				</Col>
			</Row>
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

export default UserTransaction;
