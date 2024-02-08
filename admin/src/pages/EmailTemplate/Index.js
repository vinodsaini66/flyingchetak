import { Button, Card, Col, Input, Row, Table, Tooltip } from 'antd';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { Link } from 'react-router-dom';

import ConfirmationBox from '../../components/ConfirmationBox';
import ShowTotal from '../../components/ShowTotal';
import apiPath from '../../constants/apiPath';
import { Severty, ShowToast } from '../../helper/toast';
import useDebounce from '../../hooks/useDebounce';
import useRequest from '../../hooks/useRequest';

const Search = Input.Search;

function Index() {
	const sectionName = 'Email Template';
	const routeName = 'email-template';

	const api = {
		status: apiPath.statusEmailTemplate,
		list: apiPath.listEmailTemplate,
	};

	const [searchText, setSearchText] = useState('');
	const { request } = useRequest();
	const { showConfirm } = ConfirmationBox();
	const [list, setList] = useState([]);
	const [loading, setLoading] = useState(false);
	const [refresh, setRefresh] = useState(false);
	const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });
	const debouncedSearchText = useDebounce(searchText, 300);
	const navigate = useNavigate();

	const view = (id) => {
		navigate(`/${routeName}/view/${id}`);
	};

	const columns = [
		{
			title: 'Title',
			dataIndex: 'title',
			key: 'title',
		},
		{
			title: 'Subject',
			dataIndex: 'subject',
			key: 'subject',
		},
		/* {
      title: "Status",
      key: "is_active",
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
      render: (_, { is_active, _id }) => {
        let color = is_active ? 'green' : 'red';
        return ( <a><Tag onClick={(e) => showConfirm({record : _id, path : api.status, onLoading : ()=>setLoading(true), onSuccess : ()=>setRefresh(prev => !prev)})} color={color} key={is_active}>{is_active ? "Active" : "Inactive"}</Tag></a> );
      },
    }, */
		{
			title: 'Created On',
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
							key={'updateemail'}
						>
							<Link
								className='ant-btn ant-btn-default'
								to={`/${routeName}/update/` + (record ? record._id : null)}
							>
								<i className='fa fa-light fa-pen'></i>
							</Link>
						</Tooltip>
						<Tooltip
							title={'View ' + sectionName}
							color={'purple'}
							key={'viewemail'}
						>
							<Button
								onClick={() => {
									view(record._id);
								}}
							>
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
	}, [refresh, debouncedSearchText]);

	const fetchData = (pagination, filters) => {
		const filterActive = filters ? filters.is_active : null;

		request({
			url:
				api.list +
				`?status=${filterActive ? filterActive.join(',') : ''}&page=${
					pagination ? pagination.current : 1
				}&limit=${
					pagination ? pagination.pageSize : 10
				}&search=${debouncedSearchText}`,
			method: 'GET',
			onSuccess: (data) => {
				setLoading(false);
				setList(data.data.list.docs);
				setPagination((prev) => ({
					current: pagination.current,
					total: data.data.list.totalDocs,
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
										placeholder='Search By Title'
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
						</Card>
					</Col>
				</Row>
			</div>
		</>
	);
}

export default Index;
