import { Button, Card, Col, Form, Input, Row, Skeleton } from 'antd';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useParams, Link } from 'react-router-dom';

import DescriptionEditor from '../../components/DescriptionEditor';
import apiPath from '../../constants/apiPath';
import { Severty, ShowToast } from '../../helper/toast';
import useRequest from '../../hooks/useRequest';

function Edit() {
	const sectionName = 'Content';
	const routeName = 'content';
	const api = {
		addEdit: apiPath.addEditContent,
	};

	const [form] = Form.useForm();
	const { request } = useRequest();
	const params = useParams();
	const [loading, setLoading] = useState(false);
	const navigate = useNavigate();

	const [editorValue, setEditorValue] = useState('');

	const handleEditorChange = (data) => {
		setEditorValue(data);
	};

	const fetchData = (id) => {
		request({
			url: apiPath.viewContent + '/' + id,
			method: 'GET',
			onSuccess: (data) => {
				setLoading(false);
				form.setFieldsValue(data.data);

				setEditorValue(data.data.description);
			},
			onError: (error) => {
				ShowToast(error, Severty.ERROR);
			},
		});
	};

	const OnUpdate = (values) => {
		if (editorValue.trim() === '<p></p>' || editorValue.trim() === '')
			return ShowToast('Please Enter Description', Severty.ERROR);

		const { name } = values;
		const payload = {};
		payload.name = name;
		payload.description = editorValue;
		setLoading(true);
		request({
			url: api.addEdit + '/' + params.id,
			method: 'POST',
			data: payload,
			onSuccess: (data) => {
				setLoading(false);
				if (data.status) {
					ShowToast(data.message, Severty.SUCCESS);
					navigate(`/${routeName}`);
				} else {
					ShowToast(data.message, Severty.ERROR);
				}
			},
			onError: (error) => {
				ShowToast(error.response.data.message, Severty.ERROR);
				setLoading(false);
			},
		});
	};

	useEffect(() => {
		setLoading(true);
		fetchData(params.id);
	}, []);

	return (
		<>
			<Card title={'Update ' + sectionName}>
				{loading ? (
					[1, 2, 3, 4].map((item) => <Skeleton active key={item} />)
				) : (
					<Form
						className='edit-page-wrap'
						form={form}
						onFinish={OnUpdate}
						autoComplete='off'
						layout='verticle'
						name='content_form'
					>
						<Form.Item
							label={`Name`}
							name='name'
							rules={[
								{ required: true, message: `Please enter your name!` },
								{
									max: 100,
									message: 'Name should not contain more then 100 characters!',
								},
								{
									min: 2,
									message: 'Name should contain atleast 2 characters!',
								},
							]}
						>
							<Input autoComplete='off' placeholder={`Enter Name`} />
						</Form.Item>

						<Form.Item
							label={`Description`}
							name='description'
							rules={[{ required: true, message: `Enter Description!` }]}
						>
							<DescriptionEditor
								value={editorValue}
								placeholder={`Enter Description`}
								onChange={(data) => handleEditorChange(data)}
							/>
						</Form.Item>

						<Form.Item className='btn-row float-right'>
							<Link
								className='ant-btn ant-btn-primary'
								type='primary'
								to={`/${routeName}`}
							>
								Back
							</Link>
							<Button type='primary' loading={loading} htmlType='submit'>
								Submit
							</Button>
						</Form.Item>
					</Form>
				)}
			</Card>
		</>
	);
}
export default Edit;
