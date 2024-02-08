import { Button, Card, Col, Form, Input, Row, Skeleton } from 'antd';
import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

import { useNavigate } from 'react-router';
import DescriptionEditor from '../../components/DescriptionEditor';
import apiPath from '../../constants/apiPath';
import { Severty, ShowToast } from '../../helper/toast';
import useRequest from '../../hooks/useRequest';

function Edit() {
	const sectionName = 'Email Template';
	const routeName = 'email-template';

	const api = {
		addEdit: apiPath.addEditEmailTemplate,
		view: apiPath.viewEmailTemplate,
	};

	const [form] = Form.useForm();
	const { request } = useRequest();
	const params = useParams();
	const [loading, setLoading] = useState(false);
	const navigate = useNavigate();
	const [editorValue, setEditorValue] = useState('');

	const fetchData = (id) => {
		request({
			url: api.view + '/' + id,
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

	const handleEditorChange = (data) => {
		setEditorValue(data);
	};

	const OnUpdate = (values) => {
		if (editorValue.trim() == '<p></p>' || editorValue.trim() === '')
			return ShowToast('Please Enter Description', Severty.ERROR);
		const { title, subject } = values;
		const payload = {};
		payload.title = title;
		payload.description = editorValue;
		payload.subject = subject;
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
					[1, 2].map((item) => <Skeleton active key={item} />)
				) : (
					<Form
						className='edit-page-wrap'
						form={form}
						onFinish={OnUpdate}
						autoComplete='off'
						layout='verticle'
						name='email_template_form'
					>
						<Row gutter={[24, 0]}>
							<Col xs={24} md={12}>
								<Form.Item
									label='Title'
									name='title'
									rules={[
										{ required: true, message: 'Please Enter the title!' },
									]}
								>
									<Input autoComplete='off' placeholder='Enter Title' />
								</Form.Item>
							</Col>

							<Col xs={24} md={12}>
								<Form.Item
									label='Subject'
									name='subject'
									rules={[
										{ required: true, message: 'Please Enter the subject!' },
									]}
								>
									<Input autoComplete='off' placeholder='Enter Subject' />
								</Form.Item>
							</Col>

							<Col md={24}>
								<Form.Item
									label='Description'
									name='description'
									rules={[
										{
											required: true,
											message: 'Please Enter the description!',
										},
									]}
								>
									<DescriptionEditor
										value={editorValue}
										placeholder='Enter Email Template Description'
										onChange={(data) => handleEditorChange(data)}
									/>
								</Form.Item>
							</Col>
						</Row>

						<Form.Item className='btn-row float-right'>
							<Link
								type='primary'
								className='ant-btn ant-btn-primary'
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
