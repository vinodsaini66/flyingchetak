import { Menu, Modal } from 'antd';
import { useContext, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';

import leftArrow from '../../assets/images/icon/leftArrow.svg';
// import Logo from "../../assets/images/Logo.png";
// import smallLogo from "../../assets/images/smallLogo.png";
import { AuthContext } from '../../context/AuthContext';

const navItems = [
	{
		title: 'Dashboard',
		link: '/dashboard',
		icon: 'fas fa-tachometer-alt',
		key: 'dashboard',
	},
	{
		title: 'User Management',
		link: '/users',
		icon: 'fas fa-user',
		key: 'users',
	},
	{
		title: 'Settings',
		link: '/settings',
		icon: 'fa fa-cogs',
		key: 'settings',
	},
	{
		title: 'Game Management', // or game history
		link: '/game',
		icon: 'fa fa-gamepad',
		key: 'Game History Manager',
	},
	{
		title: 'Channel Management', // or game history
		link: '/channel',
		icon: 'fa fa-gamepad',
		key: 'Channel Manager',
	},
	{
		title: 'UTR Management',
		link: '/utr',
		icon: 'fa fa-exchange',
		key: 'UTR Manager',
	},
	{
		title: 'Transaction Management', // or game history
		link: '/transactions',
		icon: 'fa-solid fa-money-bill-transfer',
		key: 'Transaction Manager',
	},
	{
		title: 'Withdrawal Management',
		link: '/withdrawal',
		icon: 'fa fa-exchange',
		key: 'Withdrawal Manager',
	},
];

function Sidenav({ color, closeDrawer }) {
	const { pathname } = useLocation();
	const page = pathname.replace('/', '');
	const { logout } = useContext(AuthContext);
	const { confirm } = Modal;
	const [collapsed, setCollapsed] = useState(false);
	const [toggle, setToggle] = useState(false);
	const [mode, setMode] = useState('inline');
	const [hideButtonClassName, setHideButtonClassName] = useState('');

	const handleHideButton = () => {
		if (!toggle) {
			setMode('vertical');
		} else {
			setMode('inline');
		}
		setToggle((prev) => !prev);
		setHideButtonClassName('hideShowBtn');
		document.body.classList.toggle('navHideShow');
	};

	const changeNavItem = () => {
		if (!!closeDrawer) {
			closeDrawer();
		}
	};

	const isActiveLink = (pattern, pathname) => {
		const regexPattern = new RegExp(`^${pattern.replace('*', '.*')}$`);
		return regexPattern.test(pathname);
	};

	return (
		<>
			<div className='brand sideNavBrand'>
				<NavLink onClick={changeNavItem} to='/dashboard' className='imgOuter'>
					{/* <img className='logo' src={Logo} alt='' />
          <img className='smallLogo' src={smallLogo} alt='' /> */}
				</NavLink>

				<button
					type='button'
					className='hideShowBtn border-0 rounded-circle shadow-none'
					onClick={handleHideButton}
				>
					<img src={leftArrow} />
				</button>
			</div>

			<Menu
				className='sideNavMenu'
				mode={mode}
				inlineCollapsed={collapsed}
				theme='light'
			>
				{navItems.map((item) => (
					<Menu.Item key={item.key}>
						<NavLink onClick={changeNavItem} to={item.link}>
							<span
								className='icon'
								style={{ background: page === item.key ? color : '' }}
							>
								<i className={item.icon}></i>
							</span>
							<span className='label'>{item.title}</span>
						</NavLink>
					</Menu.Item>
				))}
			</Menu>
		</>
	);
}

export default Sidenav;
