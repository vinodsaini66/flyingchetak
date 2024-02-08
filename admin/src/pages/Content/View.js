import { Badge, Card, Skeleton } from 'antd';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

import apiPath from '../../constants/apiPath';
import { Severty, ShowToast } from '../../helper/toast';
import useRequest from '../../hooks/useRequest';

function View() {
	const sectionName = 'Content';
	const routeName = 'content';
	const params = useParams();
	const { request } = useRequest();
	const [list, setList] = useState({});
	const [loading, setLoading] = useState(false);

	const fetchData = (id) => {
		request({
			url: apiPath.viewContent + '/' + id,
			method: 'GET',
			onSuccess: (data) => {
				setLoading(false);
				setList(data.data);
			},
			onError: (error) => {
				ShowToast(error, Severty.ERROR);
			},
		});
	};

	useEffect(() => {
		setLoading(true);
		fetchData(params.id);
	}, []);

	return (
		<>
			<Card title={sectionName + ' Details'}>
				{loading ? (
					<Skeleton active />
				) : (
					<div className='view-main-list'>
						<div className='view-inner-cls'>
							<h5>Name:</h5>
							<h6 className='cap'>{list.name ? list.name : '-'}</h6>
						</div>

						<div className='view-inner-cls'>
							<h5>Description:</h5>
							<h6 className='cap'>
								{list.description ? (
									<p dangerouslySetInnerHTML={{ __html: list.description }}></p>
								) : (
									'-'
								)}
							</h6>
						</div>

						<div className='view-inner-cls'>
							<h5>Status:</h5>
							<h6>
								{list.is_active ? (
									<Badge colorSuccess status='success' text='Active' />
								) : (
									<Badge status='error' text='InActive' />
								)}
							</h6>
						</div>

						<div className='view-inner-cls'>
							<h5>Created On:</h5>
							<h6>
								{list.created_at
									? moment(list.created_at).format('DD-MMM-YYYY, hh:mm A')
									: '-'}
							</h6>
						</div>

						<div className='view-inner-cls float-right'>
							<Link className='ant-btn ant-btn-primary' to={`/${routeName}/`}>
								Back
							</Link>
						</div>
					</div>
				)}
			</Card>
		</>
	);
}

export default View;
