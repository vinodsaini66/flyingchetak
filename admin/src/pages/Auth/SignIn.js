import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
	Layout,
	Button,
	Row,
	Col,
	Typography,
	Form,
	Input,
	Switch,
	Modal,
} from 'antd';

// import signinbg from "../../assets/images/Logo.png";
import useRequest from '../../hooks/useRequest';
import { ShowToast, Severty } from '../../helper/toast';
import { AuthContext } from '../../context/AuthContext';
import Loader from '../../components/Loader';
import apiPath from '../../constants/apiPath';
import encryptDecrypt from '../../helper/encryptDecrypt';
const { Title } = Typography;
const { Content } = Layout;

const SignIn = () => {
	const { setIsLoggedIn, setUserProfile } = useContext(AuthContext);
	const [loading, setLoading] = useState(false);
	const [resetLoading, setResetLoading] = useState(false);
	const [verifyLoading, setVerifyLoading] = useState(false);
	const [passwordLoading, setPasswordLoading] = useState(false);
	const { request } = useRequest();
	const [visible, setVisible] = useState(false);
	const [otpModal, setOtpModal] = useState(false);
	const [resetModal, setResetModal] = useState(false);
	const [selected, setSelected] = useState();
	const navigate = useNavigate();
	const [form] = Form.useForm();
	const [rememberMe, setRememberMe] = useState(false);

	const handleRememberMeChange = (checked) => {
		setRememberMe(checked);
	};

	const onFinish = (values) => {
		onSubmit(values);
	};

	const onSubmit = (values) => {
		const { email, password } = values;

		if (!email)
			return ShowToast('Please enter email to sign in', Severty.ERROR);

		const payload = { password };
		if (!email) return ShowToast('Please enter valid email ', Severty.ERROR);

		setLoading(true);
		payload.email = email;
		request({
			url: apiPath.login,
			method: 'POST',
			data: payload,
			onSuccess: (data) => {
				setLoading(false);
				if (data.status) {
					setIsLoggedIn(true);
					if (rememberMe) {
						// Store the login state in local storage

						var emailEncrypt = encryptDecrypt.encryptEmail(values.email);
						var passwordEncrypt = encryptDecrypt.encryptPassword(
							values.password
						);

						localStorage.setItem('rememberMe', 'true');
						localStorage.setItem('ykmCe2AYEFTHobn', emailEncrypt);
						localStorage.setItem('ouUsippetc8S4Ry', passwordEncrypt);
					} else {
						localStorage.removeItem('ykmCe2AYEFTHobn');
						localStorage.removeItem('ouUsippetc8S4Ry');
					}
					localStorage.setItem('token', data.data.token);
					localStorage.setItem('userProfile', JSON.stringify(data.data.user));

					ShowToast(data.message, Severty.SUCCESS);
					setUserProfile(data.data);
					navigate('/dashboard');
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

	const onFinishFailed = (errorInfo) => {
		// console.log("Failed:", errorInfo);
	};

	const handleForgotPassword = () => {
		setVisible(true);
	};

	const handleResetPassword = (email) => {
		// Send the OTP to the user's email
		setResetLoading(true);
		let payload = {};
		payload.email = email.email;

		request({
			url: apiPath.forgotPassword,
			method: 'POST',
			data: payload,
			onSuccess: (data) => {
				var emailResetEncrypt = encryptDecrypt.encryptEmail(email.email);
				localStorage.setItem('UGwdfdR2uHMM24N', emailResetEncrypt);
				setResetLoading(false);
				ShowToast(data.message, Severty.SUCCESS);
				setVisible(false);
				setOtpModal(true);
				setSelected({ email });
			},
			onError: (error) => {
				setResetLoading(false);
				// console.log(error, "---------");
				ShowToast(error.response.data.message, Severty.ERROR);
			},
		});
	};

	const handleVerifyOTP = (values) => {
		const { email, otp } = values;
		setVerifyLoading(true);
		// Verify the OTP entered by the user
		let payload = {};
		const savedEmail = localStorage.getItem('UGwdfdR2uHMM24N');
		var originalEmail = encryptDecrypt.decryptEmail(savedEmail);
		payload.email = originalEmail;
		payload.otp = otp;
		request({
			url: apiPath.verifyOTP,
			method: 'POST',
			data: payload,
			onSuccess: (data) => {
				setVerifyLoading(false);
				ShowToast(data.message, Severty.SUCCESS);
				setOtpModal(false);
				setSelected(null);
				setVisible(false);
				setResetModal(true);
			},
			onError: (error) => {
				setVerifyLoading(false);
				ShowToast(error.response.data.message, Severty.ERROR);
			},
		});
	};

	const handleReset = (values) => {
		const { email, newPassword } = values;
		setPasswordLoading(true);
		// Reset the password with the new password entered by the user
		let payload = {};

		const savedEmail = localStorage.getItem('UGwdfdR2uHMM24N');
		var originalEmail = encryptDecrypt.decryptEmail(savedEmail);
		payload.email = originalEmail;

		payload.password = newPassword;
		request({
			url: apiPath.resetPassword,
			method: 'POST',
			data: payload,
			onSuccess: (data) => {
				setPasswordLoading(false);
				ShowToast(data.message, Severty.SUCCESS);
				setResetModal(false);
			},
			onError: (error) => {
				setPasswordLoading(false);
				ShowToast(error.response.data.message, Severty.ERROR);
			},
		});
	};

	const handleCancelReset = () => {
		setResetModal(false);
		// form.resetFields()
	};

	// ouUsippetc8S4Ry = Email,
	// ouUsippetc8S4Ry = password,
	// UGwdfdR2uHMM24N = resetEmail

	useEffect(() => {
		const savedEmail = localStorage.getItem('ykmCe2AYEFTHobn');
		const savedPassword = localStorage.getItem('ouUsippetc8S4Ry');

		if (savedEmail && savedPassword) {
			var originalEmail = encryptDecrypt.decryptEmail(savedEmail);
			var originalPassword = encryptDecrypt.decryptEmail(savedPassword);

			form.setFieldsValue({ email: originalEmail, password: originalPassword });
			setRememberMe(true);
		} else {
			setRememberMe(false);
		}
	}, []);

	return (
		<>
			<Layout className='layout-default layout-signin'>
				<Content className='signin'>
					<div className='signin-box'>
						<div className='signup-logo'>
							{/* <img src={signinbg} alt='' /> */}
						</div>
						<Row justify='space-around'>
							<Col xs={{ span: 24 }} lg={{ span: 24 }} md={{ span: 24 }}>
								<div className='signup-form'>
									<Title className='mb-15'>Sign In</Title>
									<Title className='font-regular text-muted' level={5}>
										Enter your email and password to sign in
									</Title>
									<Form
										form={form}
										onFinish={onFinish}
										onFinishFailed={onFinishFailed}
										layout='vertical'
										className='row-col'
									>
										<Form.Item
											className='username'
											label='Email Address'
											name='email'
											rules={[
												{
													type: 'email',
													message: 'Please enter a valid email address!',
												},
												{
													max: 255,
													message:
														'Email address not more then 255 characters!',
												},
												{
													required: true,
													message: 'Please enter your email!',
												},
											]}
										>
											<Input placeholder='Enter Email Address' />
										</Form.Item>

										<Form.Item
											className='password'
											label='Password'
											name='password'
											rules={[
												{
													max: 255,
													message:
														'Password should contain more then 255 characters!',
												},
												{
													required: true,
													message: 'Please enter your password!',
												},
											]}
										>
											<Input.Password
												onCut={(e) => e.preventDefault()}
												onCopy={(e) => e.preventDefault()}
												onPaste={(e) => e.preventDefault()}
												autoComplete='off'
												placeholder='Enter Password'
											/>
										</Form.Item>
										<div className='forgot-pass'>
											<Form.Item
												name='remember'
												className='aligin-center'
												valuePropName='checked'
											>
												<Switch
													className=''
													checked={rememberMe}
													onChange={handleRememberMeChange}
												/>
												Remember me
											</Form.Item>
											<Form.Item
												name='remember'
												className='aligin-center'
												valuePropName='checked'
											>
												<a onClick={handleForgotPassword}>
													<a>Forgot Password?</a>
												</a>
											</Form.Item>
										</div>

										<Form.Item>
											<Button
												className='float-right'
												type='primary'
												htmlType='submit'
												loading={loading}
											>
												{' '}
												SIGN IN{' '}
											</Button>
										</Form.Item>
									</Form>
								</div>
							</Col>
						</Row>
					</div>
				</Content>

				{visible ? (
					<Modal
						visible={visible}
						title='Forgot Password'
						okText='Send OTP'
						onCancel={() => {
							setVisible(false);
							// form.resetFields()
						}}
						okButtonProps={{
							form: 'forget-pasword',
							htmlType: 'submit',
							loading: resetLoading,
						}}
					>
						<Form
							id='forget-pasword'
							onFinish={handleResetPassword}
							layout='vertical'
						>
							<Form.Item
								label='Email Address'
								name='email'
								rules={[
									{
										type: 'email',
										message: 'Please enter a valid email address!',
									},
									{
										max: 255,
										message: 'Email address not more then 255 characters!',
									},
									{
										required: true,
										message: 'Please enter your email!',
									},
								]}
							>
								<Input autoComplete='off' placeholder='Enter Email Address' />
							</Form.Item>
						</Form>
					</Modal>
				) : null}

				{otpModal ? (
					<Modal
						visible={otpModal}
						title='Verify OTP'
						okText='Verify'
						onCancel={(e) => {
							setOtpModal(false);
							// form.resetFields()
						}}
						okButtonProps={{
							form: 'verify-otp',
							htmlType: 'submit',
							loading: verifyLoading,
						}}
					>
						<Form
							id='verify-otp'
							onFinish={(e) => handleVerifyOTP(e)}
							layout='vertical'
						>
							<Form.Item
								label='OTP'
								name='otp'
								rules={[
									{
										required: true,
										message: 'Please enter the OTP',
									},
									{
										len: 4,
										message: 'OTP must be 4 digits',
									},
								]}
							>
								<Input
									autoComplete='off'
									type='number'
									maxLength={4}
									placeholder='Enter OTP'
								/>
							</Form.Item>
						</Form>
					</Modal>
				) : null}

				{resetModal ? (
					<Modal
						visible={resetModal}
						title='Reset Password'
						okText='Update Password'
						onCancel={handleCancelReset}
						okButtonProps={{
							form: 'reset-password',
							htmlType: 'submit',
							loading: passwordLoading,
						}}
					>
						<Form
							id='reset-password'
							onFinish={(e) => handleReset(e)}
							layout='vertical'
						>
							<Form.Item
								label='New Password'
								name='newPassword'
								rules={[
									{
										required: true,
										message: 'Please enter your new password!',
									},
									{
										pattern: new RegExp(
											/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*]).{8,}$/
										),
										message:
											'New password atleast contain 8 characters, atleast contain one captital letter, atleast contain one small letter, atleast contain one digit, atleast contain one special character',
									},
								]}
							>
								<Input.Password placeholder='Enter New Password' />
							</Form.Item>
							<Form.Item
								label='Confirm New Password'
								name='confirm_new_password'
								dependencies={['newPassword']}
								hasFeedback
								rules={[
									{
										required: true,
										message: 'Please enter the confirm password!',
									},
									{
										pattern: new RegExp(
											/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*]).{8,}$/
										),
										message:
											'Confirm password atleast contain 8 characters, atleast contain one captital letter, atleast contain one small letter, atleast contain one digit, atleast contain one special character',
									},
									({ getFieldValue }) => ({
										validator(_, value) {
											if (!value || getFieldValue('newPassword') === value) {
												return Promise.resolve();
											}
											return Promise.reject(
												new Error("Password that you entered doesn't match!")
											);
										},
									}),
								]}
							>
								<Input.Password placeholder='Enter Confirm Password' />
							</Form.Item>
						</Form>
					</Modal>
				) : null}
			</Layout>
		</>
	);
};

export default SignIn;
