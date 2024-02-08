import { Col, Form, Modal, Row, Select } from 'antd';
import React, { useEffect, useState } from 'react';
import * as _ from 'lodash';
// import { WITHDRAW_STATUS } from "../../constants";
import apiPath from '../../constants/apiPath';
import { Severty, ShowToast } from '../../helper/toast';
import useRequest from '../../hooks/useRequest';

const WithdrawalStatus = ({ show, hide, requestId, statusRefresh }) => {
	const [form] = Form.useForm();
	const { request } = useRequest();
	const [loading, setLoading] = useState(false);

	//   const bookingStatus = [
	//     {
	//       value: WITHDRAW_STATUS.approved,
	//       label: "Approved",
	//     },
	//     {
	//       value: WITHDRAW_STATUS.rejected,
	//       label: "Rejected",
	//     },
	//   ];

	const onStatus = (values) => {
		const { status } = values;
		setLoading(true);
		const payload = {};
		const id = requestId;
		payload.status = status;

		request({
			url: apiPath.withdraw + '/' + id,
			method: 'POST',
			data: payload,
			onSuccess: (data) => {
				setLoading(false);
				if (data) {
					ShowToast(data.message, Severty.SUCCESS);
					hide();
					statusRefresh();
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
			open={show}
			width={600}
			title='Select Request Status'
			okText='Ok'
			onCancel={hide}
			okButtonProps={{
				form: 'status',
				htmlType: 'submit',
				loading: loading,
			}}
		>
			<Form id='status' form={form} onFinish={onStatus} layout='vertical'>
				<Row>
					<Col span={24} style={{ marginLeft: '15px' }}>
						<Form.Item
							label='Select Request status'
							name='status'
							rules={[{ required: true, message: 'Please select the status!' }]}
						>
							{/* <Select
                options={bookingStatus}
                placeholder='Select Request Status'
              ></Select> */}
						</Form.Item>
					</Col>
				</Row>
			</Form>
		</Modal>
	);
};

export default WithdrawalStatus;
