import { Row, Col, Radio, Modal, Form, Input } from 'antd';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';

import React, { useState, useEffect, useRef } from 'react';
import useRequest from '../../hooks/useRequest';

import { ShowToast, Severty } from '../../helper/toast';

const UserFrom = ({ type, path, sectionName, show, hide, data, refresh }) => {
	const [form] = Form.useForm();
	const { request } = useRequest();
	const [loading, setLoading] = useState(false);
	const [mobileNumber, setMobileNumber] = useState({
		mobile: '',
		country_code: '',
	});

	const handleChange = (value, data, event, formattedValue) => {
		var country_code = data.dialCode;
		setMobileNumber({
			country_code: country_code,
			mobile: value.slice(data.dialCode.length),
		});
	};

	useEffect(() => {
		if (!data) return;
		form.setFieldsValue({ ...data });
		setMobileNumber({
			mobile: data.mobile_number,
			country_code: data.country_code,
		});
	}, [data]);

	const onCreate = (values) => {
		if (!mobileNumber.mobile)
			return ShowToast('Please enter mobile number', Severty.ERROR);
		if (mobileNumber.mobile.length < 8 || mobileNumber.mobile.length > 12) {
			return ShowToast(
				'Mobile number should be between 8 to 12 digits',
				Severty.ERROR
			);
		}

		const { name, is_featured, email } = values;
		setLoading(true);
		const payload = {};
		payload.country_code = mobileNumber.country_code;
		payload.mobile_number = mobileNumber.mobile;
		payload.name = name;
		payload.email = email;
		payload.type = type;
		payload.is_featured = is_featured;
		payload.id = data?._id;

		request({
			url: `${path}`,
			method: 'POST',
			data: payload,
			onSuccess: (data) => {
				console.log("datadatadtata",data)
				setLoading(false);
				if (data.status) {
					ShowToast(data.message, Severty.SUCCESS);
					hide();
					refresh();
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

	return (
		<Modal
			visible={show}
			title={`${
				data ? 'Update ' + sectionName : 'Create a New ' + sectionName
			}`}
			okText='Ok'
			onCancel={hide}
			okButtonProps={{
				form: 'create',
				htmlType: 'submit',
				loading: loading,
			}}
		>
			<Form id='create' form={form} onFinish={onCreate} layout='vertical'>
				<Row>
					<Col span={24}>
						<Form.Item
							label='Name'
							name='name'
							rules={[
								{ required: true, message: 'Please Enter the name!' },
								{
									max: 80,
									message: 'Name should not contain more then 80 characters!',
								},
								{
									min: 2,
									message: 'Name should contain atleast 2 characters!',
								},
								{
									pattern: new RegExp(/^[a-zA-Z ]*$/),
									message: 'Only Alphabetic Characters Allowed!',
								},
							]}
						>
							<Input
								autoComplete='off'
								placeholder='Enter Name'
								className='cap'
							/>
						</Form.Item>
					</Col>

					<Col span={24}>
						<Form.Item
							label='Email Address'
							name='email'
							rules={[
								{ type: 'email', message: 'The email is not a valid email!' },
								{ required: true, message: 'Please enter the email!' },
								{
									max: 200,
									message: 'Email should not contain more then 200 characters!',
								},
								{
									min: 5,
									message: 'Email should contain atleast 5 characters!',
								},
							]}
						>
							<Input autoComplete='off' placeholder='Enter Email Address' />
						</Form.Item>
					</Col>

					<Col span={24}>
						<Form.Item label='Mobile Number'>
							<PhoneInput
								inputProps={{
									name: 'mobile',
									required: true,
									autoFocus: false,
									placeholder: 'Enter Mobile Number',
								}}
								isValid={(value, country) => {
									if (value.match(/1234/)) {
										return 'Invalid value: ' + value + ', ' + country.name;
									} else if (value.match(/1234/)) {
										return 'Invalid value: ' + value + ', ' + country.name;
									} else {
										return true;
									}
								}}
								country={'us'}
								value={
									mobileNumber
										? (mobileNumber.country_code
												? mobileNumber.country_code
												: '+1') +
										  (mobileNumber.mobile ? mobileNumber.mobile : null)
										: '+1'
								}
								onChange={handleChange}
							/>
						</Form.Item>
					</Col>
				</Row>
			</Form>
		</Modal>
	);
};

export default UserFrom;
