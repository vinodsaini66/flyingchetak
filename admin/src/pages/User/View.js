import { Avatar, Badge, Card, Col, Image, Row, Skeleton, Table } from 'antd';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';

import apiPath from '../../constants/apiPath';
import { Severty, ShowToast } from '../../helper/toast';
import useRequest from '../../hooks/useRequest';

function View() {
	const sectionName = 'Customer';
	const routeName = 'customer';
	const params = useParams();
	const { request } = useRequest();
	const [list, setList] = useState({});
	const [loading, setLoading] = useState(false);

	const [vehicles, setVehicles] = useState();

	const fetchData = (id) => {
		setLoading(true);
		request({
			url: apiPath.viewCustomer + '/' + id,
			method: 'GET',
			onSuccess: (data) => {
				console.log("datadata",data)
				setLoading(false);
				setList(data?.data?.data[0]);
			},
			onError: (error) => {
				ShowToast(error, Severty.ERROR);
			},
		});
	};

	const vehicleColumns = [
		{
			title: 'Vehicle Number',
			dataIndex: 'vehicle_number',
			key: 'vehicle_number',
			render: (_, { vehicle_number }) => {
				return vehicle_number;
			},
		},
		{
			title: 'Brand',
			dataIndex: 'brand_id',
			key: 'brand_id',
			render: (_, { brand_id }) => {
				return brand_id && brand_id?.name ? brand_id.name : '-';
			},
		},
		{
			title: 'Category',
			dataIndex: 'category_id',
			key: 'category_id',
			render: (_, { category_id }) => {
				return category_id && category_id?.name ? category_id.name : '-';
			},
		},
		{
			title: 'Fuel',
			dataIndex: 'fuel_id',
			key: 'fuel_id',
			render: (_, { fuel_id }) => {
				return fuel_id && fuel_id?.name ? fuel_id.name : '-';
			},
		},
		{
			title: 'Model',
			dataIndex: 'model_id',
			key: 'model_id',
			render: (_, { model_id }) => {
				return model_id && model_id?.name ? model_id.name : '-';
			},
		},
	];

	useEffect(() => {
		fetchData(params.id);
	}, []);

	return (
		<>
			<Row gutter={24}>
				<Col xs={24} lg={16}>
					<Card title={sectionName + ' Details'}>
						{loading ? (
							<Skeleton active />
						) : (
							<div className='view-main-list'>
								{/* <div className='view-inner-cls'>
									<h5>Image:</h5>
									<h6>
										{list && list.name && !list.image ? (
											<Avatar
												style={{
													backgroundColor: '#00a2ae',
													verticalAlign: 'middle',
												}}
												className='cap'
												size={50}
											>
												{' '}
												{list.name.charAt(0)}{' '}
											</Avatar>
										) : (
											<Image
												className='image-radius'
												src={
													process.env.REACT_AWS_URL
														? process.env.REACT_AWS_URL
														: 'https://inventcolabs.s3.amazonaws.com/' +
														  list.image
												}
											/>
										)}
									</h6>
								</div> */}

								<div className='view-inner-cls'>
									<h5>Name:</h5>
									<h6>
										<span className='cap'>{list?.name ? list.name : '-'}</span>
									</h6>
								</div>

								<div className='view-inner-cls'>
									<h5>Email Address:</h5>
									<h6>{list?.email ? list.email : '-'}</h6>
								</div>

								<div className='view-inner-cls'>
									<h5>Phone Number:</h5>
									<h6>
										{/* {list ? '+' + list.country_code + '-' : '+965'} */}
										{list ? list.mobile_number : '-'}
									</h6>
								</div>
								<div className='view-inner-cls'>
									<h5>Account Hplder Name:</h5>
									<h6>
										{list ? list?.account_holder : '-'}
									</h6>
								</div>
								<div className='view-inner-cls'>
									<h5>IFSC Code:</h5>
									<h6>
										{list ? list?.ifsc_code: '-'}
									</h6>
								</div>
								<div className='view-inner-cls'>
									<h5>Account Number:</h5>
									<h6>
										{list ? list?.account_number : '-'}
									</h6>
								</div>
								<div className='view-inner-cls'>
									<h5>Balance:</h5>
									<h6>
										{list ? list?.balance +" Rs" : '-'}
									</h6>
								</div>

								<div className='view-inner-cls'>
									<h5>Status:</h5>
									<h6>
										{list?.is_active ? (
											<Badge status='success' text='Active' />
										) : (
											<Badge status='error' text='InActive' />
										)}
									</h6>
								</div>

								<div className='view-inner-cls'>
									<h5>Registered On:</h5>
									<h6>
										{list?.created_at
											? moment(list?.created_at).format('MM-DD-YYYY')
											: '-'}
									</h6>
								</div>

								<div className='view-inner-cls float-right'>
									<Link
										className='ant-btn ant-btn-primary'
										to={`/users`}
									>
										Back
									</Link>
								</div>
							</div>
						)}
					</Card>
				</Col>
			</Row>

			{/* <Row gutter={24}>
				<Col xs={24} lg={24}>
					<Card title={'Vehicle Details'}>
						<div className='table-responsive customPagination'>
							<Table
								loading={loading}
								columns={vehicleColumns}
								dataSource={vehicles}
								// pagination={{
								//   defaultPageSize: 10,
								//   responsive: true,
								//   // total: pagination.total,
								//   showSizeChanger: true,
								//   showQuickJumper: true,
								//   pageSizeOptions: ["10", "20", "30", "50"],
								// }}
								// onChange={handleChange}
								className='ant-border-space'
							/>
						</div>
					</Card>
				</Col>
			</Row> */}
		</>
	);
}

export default View;
