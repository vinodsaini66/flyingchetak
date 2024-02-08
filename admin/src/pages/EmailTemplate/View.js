import { Badge, Card, Col, Row, Skeleton } from 'antd';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

import Logo from '../../assets/images/Logo.png';
import callIcon from '../../assets/images/icon/callIcon.svg';
import emailIcon from '../../assets/images/icon/emailIcon.svg';
import apiPath from '../../constants/apiPath';
import { Severty, ShowToast } from '../../helper/toast';
import useRequest from '../../hooks/useRequest';

function View() {
	const sectionName = 'Email Template';
	const routeName = 'email-template';
	const params = useParams();
	const { request } = useRequest();
	const [list, setList] = useState({});
	const [loading, setLoading] = useState(false);

	const fetchData = (id) => {
		request({
			url: apiPath.viewEmailTemplate + '/' + id,
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

	const phone =
		'+' +
		list?.contact_info?.country_code +
		' ' +
		list?.contact_info?.mobile_number;
	const email = list?.contact_info?.email;

	const rawHTML = `
    <html lang="en">
        <body style="font-family: 'Lato', 'Merriweather', 'Roboto', sans-serif;">
            <div class="mainEmailWraper" style="max-width: 680px; margin: 0 auto;">
                <div class="emailHeader" style="display: flex; align-items: center; justify-content: center; padding: 16px; background-color: #0089B6; border-radius: 8px 8px 0 0;">
                    <div class="logoOuter">
                        <img src=${Logo} alt="" style="filter:brightness(1000);width:80%;" />
                    </div>
                </div>
        
                <div class="emailTempBody" style="">
                    <div style="padding: 16px; background-color: #eaeeef; gap: 16px;">
                      ${list.description}
                    </div>
                </div>
        
                <div class="emailFooter" style="padding: 16px; background-color: #0089B6; border-radius: 0 0 8px 8px; text-align: center;">
                    <div class="title" style="font-size: 16px; color: #fff; font-weight: 500;">Please Email us or Call us if you have any queries.</div>
                    <div class="contactDetail" style="display: inline-block; margin-top: 8px;">
                        <span class="email" style="display: inline-block; align-items: center; gap: 4px;">
                            <span class="icon" style="width: 24px; height: 24px; flex:0 0 auto; display:inline-block;">
                                <img style="width: 100%;" src=${emailIcon} alt="">
                            </span>
                            <a href="mailto:${email}" style="text-decoration: none; color: #fff; font-size: 16px;">${email}</a>
                        </span>
                        <span class="phone" style="display: inline-block; align-items: center; gap: 4px;">
                            <span class="icon" style="width: 24px; height: 24px; flex:0 0 auto; display:inline-block;">
                                <img style="width: 100%;" src=${callIcon} alt="">
                            </span>
                            <a href="tel:${phone}" style="text-decoration: none; color: #fff; font-size: 16px;">${phone}</a>
                        </span>
                    </div>
                </div>
            </div>
        </body>
    </html>`;

	useEffect(() => {
		setLoading(true);
		fetchData(params.id);
	}, []);

	return (
		<Row gutter={24}>
			<Col span={12} xs={24} md={12}>
				<Card title={sectionName + ' Details'}>
					{loading ? (
						[1, 2, 3].map((item) => <Skeleton active key={item} />)
					) : (
						<div className='view-main-list'>
							<div className='view-inner-cls'>
								<h5>Title:</h5>
								<h6>{list.title}</h6>
							</div>

							<div className='view-inner-cls'>
								<h5>Subject:</h5>
								<h6>{list.subject}</h6>
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
			</Col>
			<Col span={12} xs={24} md={12}>
				{list && list.description ? (
					<Card title='Email Preview'>
						{loading ? (
							<Skeleton active />
						) : (
							<div className='view-main-list'>
								<h6>{<p dangerouslySetInnerHTML={{ __html: rawHTML }}></p>}</h6>
							</div>
						)}
					</Card>
				) : null}
			</Col>
		</Row>
	);
}

export default View;
