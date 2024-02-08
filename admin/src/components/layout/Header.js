import {
	KeyOutlined,
	LogoutOutlined,
	SettingOutlined,
	UserOutlined,
} from '@ant-design/icons';
import { Avatar, Breadcrumb, Button, Col, Dropdown, Form, Image, Row } from 'antd';
import React, { useContext, useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';

import notification from '../../assets/images/icon/notification.svg';
import apiPath from '../../constants/apiPath';
import { AuthContext } from '../../context/AuthContext';
import { Severty, ShowToast } from '../../helper/toast';
import useNotification from '../../hooks/useNotification';
import useRequest from '../../hooks/useRequest';
import { AppSettingModal } from '../AppSettingModal';
import ChangePasswordModal from '../ChangePasswordModal';
import EditProfileModal from '../EditProfileModal';
import RecentNotificationItem from '../RecentNotificationItem';

const toggler = [
	<svg
		width='20'
		height='20'
		xmlns='http://www.w3.org/2000/svg'
		viewBox='0 0 448 512'
		key={0}
	>
		<path d='M16 132h416c8.837 0 16-7.163 16-16V76c0-8.837-7.163-16-16-16H16C7.163 60 0 67.163 0 76v40c0 8.837 7.163 16 16 16zm0 160h416c8.837 0 16-7.163 16-16v-40c0-8.837-7.163-16-16-16H16c-8.837 0-16 7.163-16 16v40c0 8.837 7.163 16 16 16zm0 160h416c8.837 0 16-7.163 16-16v-40c0-8.837-7.163-16-16-16H16c-8.837 0-16 7.163-16 16v40c0 8.837 7.163 16 16 16z'></path>
	</svg>,
];

function Header({ name, onPress }) {
	const { request } = useRequest();

	const {
		recentActivityNotifications,
		fetchRecentActivityNotifications,
		deleteNotification,
	} = useNotification();

	const [visible, setVisible] = useState(false);

	const [profile, setProfile] = useState({});
	const [selected, setSelected] = useState();
	const [profileVisible, setProfileVisible] = useState(false);

	const [appSetting, setAppSetting] = useState({});
	const [appSettingSelected, setAppSettingSelected] = useState();
	const [appSettingVisible, setAppSettingVisible] = useState(false);

	const [refresh, setRefresh] = useState(false);
	const { logout } = useContext(AuthContext);

	const [loading, setLoading] = useState(false);
	const [form] = Form.useForm();

	const items = [
		{
			label: 'Edit Profile',
			key: '1',
			icon: <UserOutlined />,
			danger: true,
		},
		{
			label: 'Change Password',
			key: '2',
			icon: <KeyOutlined />,
			danger: true,
		},
		{
			label: 'App Setting',
			key: '4',
			icon: <SettingOutlined />,
			danger: true,
		},
		{
			label: 'Logout',
			key: '3',
			icon: <LogoutOutlined />,
			danger: true,
		},
	];

	const notificationItems = [
		{
			label: (
				<div className='notification_top'>
					<div className='notification-head'>
						<h5>Notification</h5>
						{recentActivityNotifications &&
						recentActivityNotifications.length > 0 ? (
							<>
								<a href='/activity'>View All</a>
								<a onClick={(e) => deleteNotification()}> Clear All </a>
							</>
						) : null}
					</div>
				</div>
			),
			key: '0',
		},
		{
			label: (
				<div className='notification-main-wrap notificationDrop notificationScroll'>
					{recentActivityNotifications && recentActivityNotifications.length > 0
						? recentActivityNotifications.map((item, index) => (
								<RecentNotificationItem
									item={item}
									deleteNotification={deleteNotification}
									key={item._id + index}
								/>
						  ))
						: 'No Notification Found'}
				</div>
			),
			key: '1',
		},
	];

	const handleMenuClick = (e) => {
		if (e.key == 2) {
			setVisible(true);
		}
		if (e.key == 1) {
			setProfileVisible(true);
		}
		if (e.key == 4) {
			setAppSettingVisible(true);
		}
		if (e.key == 3) {
			logout();
		}
	};

	const menuProps = {
		items,
		onClick: handleMenuClick,
	};

	const handleCreate = (values) => {
		form.resetFields();
		onCreate(values);
	};

	const onCreate = (values) => {
		const { old_password, new_password } = values;
		const payload = {};
		if (!old_password || !new_password)
			return ShowToast('Please enter password ', Severty.ERROR);
		setLoading(true);
		payload.new_password = new_password;
		payload.old_password = old_password;
		request({
			url: apiPath.changePassword,
			method: 'POST',
			data: payload,
			onSuccess: (data) => {
				setLoading(false);
				if (data.status) {
					ShowToast(data.message, Severty.SUCCESS);
					setVisible(false);
					logout();
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

	const closeModal = () => {
		form.resetFields();
		setVisible(false);
	};

	useEffect(() => window.scrollTo(0, 0));

	useEffect(() => {
		request({
			url: apiPath.profile,
			method: 'GET',
			onSuccess: (data) => {
				setProfile(data.data);
				setSelected(data.data);
			},
		});

		request({
			url: apiPath.getAppSetting,
			method: 'GET',
			onSuccess: (data) => {
				setAppSetting(data.data);
				setAppSettingSelected(data.data);
			},
		});

		fetchRecentActivityNotifications();
	}, [refresh]);

	return (
		<>
			<Row gutter={[24, 0]}>
				<Col span={24} xs={24} md={12}>
					<Breadcrumb>
						<Breadcrumb.Item>
							<NavLink to='/'>Dashboard</NavLink>
						</Breadcrumb.Item>
						<Breadcrumb.Item style={{ textTransform: 'capitalize' }}>
							{name.replace('/', ' / ')}
						</Breadcrumb.Item>
					</Breadcrumb>
				</Col>

				<Col span={24} xs={24} md={12} className='header-control'>
					<Button
						type='link'
						className='sidebar-toggler'
						onClick={() => onPress()}
					>
						{toggler}
					</Button>
					<div className='profileDropdownMain'>
						<Dropdown menu={menuProps}>
							<Button className='ant-btn ant-btn-default ant-dropdown-trigger ant-dropdown-open'>
								<div className='userName'>
									{profile ? profile.name : 'Administrator'}
								</div>
								<div className='userEmail'>
									{profile ? profile.email : 'admin@noreply.com'}{' '}
								</div>
							</Button>
						</Dropdown>
						<Avatar
							style={{ backgroundColor: '#00a2ae', verticalAlign: 'middle' }}
							className='cap'
							size={40}
						>
							{' '}
							{profile?.name?.charAt(0)}{' '}
						</Avatar>
						{/* <Image src={profile ? profile.image : 'noimage'} /> */}
					</div>

					<div className='notificationDropdownMain'>
						<Dropdown
							menu={{
								items: notificationItems,
							}}
							trigger={['click']}
						>
							<button
								onClick={(e) => e.preventDefault()}
								className='ant-btn ant-btn-default ant-dropdown-trigger ant-dropdown-open notificationBtn'
							>
								<img src={notification} />
								{recentActivityNotifications?.length && (
									<div className='notiFicationBadge'>
										{!!recentActivityNotifications &&
										recentActivityNotifications.length > 0
											? recentActivityNotifications.length
											: 0}
									</div>
								)}
							</button>
						</Dropdown>
					</div>
				</Col>
			</Row>

			{profileVisible && (
				<EditProfileModal
					show={profileVisible}
					hide={() => {
						setProfileVisible(false);
					}}
					data={selected}
					refresh={() => setRefresh((prev) => !prev)}
				/>
			)}
			{appSettingVisible && (
				<AppSettingModal
					show={appSettingVisible}
					hide={() => {
						setAppSettingVisible(false);
					}}
					data={appSettingSelected}
					refresh={() => setRefresh((prev) => !prev)}
				/>
			)}

			<ChangePasswordModal
				visible={visible}
				closeModal={closeModal}
				handleCreate={handleCreate}
			/>
		</>
	);
}

export default Header;
