import { Avatar, Badge, Button, Card, Col, Form, Image, Input, Modal, Row, Skeleton, Table, Tag } from 'antd';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { WITHDRAW_STATUS } from '../../constants/WithdrawalStatus';
import apiPath from '../../constants/apiPath';
import { Severty, ShowToast } from '../../helper/toast';
import useRequest from '../../hooks/useRequest';
import WithdrawalStatus from '../Withdraw/_changeStatus';

function UserTransaction() {
	const sectionName = 'Customer';
	const routeName = 'customer';
	const params = useParams();
	const { request } = useRequest();
	const [debitList, setDebitList] = useState([]);
	const [creditList, setCreditList] = useState([]);
	const [betList, setBetList] = useState([]);
	const [loading, setLoading] = useState(false);
	const [requestId, setRequestId] = useState();
	const [requestStatus, setRequestStatus] = useState();
	const [requestShow, setRequestShow] = useState();
	const [totalDeposite, setTotalDeposite] = useState(0);
	const [totalWithdrawal, setTotalWithdrawal] = useState(0);
	const [totalBalance, setTotalBalance] = useState(0);
	const [visible,setVisible] = useState(false)
	const [type,setType] = useState("")

	const [refresh, setRefresh] = useState(false);

	const [vehicles, setVehicles] = useState();

	const fetchData = (id) => {
		setLoading(true);
		request({
			url: apiPath.getTraByUserId + '/' + id,
			method: 'GET',
			onSuccess: (data) => {
				let result = data?.data
				console.log("datadata================>>>>>>>>>>>",data.data)
				let debitArray = []
				let creditArray = []
				result?.get.map((item,i)=>{
					return item.transaction_type === "Debit" && debitArray.push(item) || item.transaction_type === "Credit" && creditArray.push(item)   
				})
				setTotalDeposite(result?.DepositeResult[0]?.totalAmount)
				setTotalWithdrawal(result?.withdrawalResult[0]?.totalAmount)
				setTotalBalance(result?.totalAmount?.balance)
				setBetList(data.data.betData)
				setDebitList(debitArray)
				setCreditList(creditArray)
				setLoading(false);
			},
			onError: (error) => {
				ShowToast(error, Severty.ERROR);
			},
		});
	};

	const onClickStatusChange = (_id, status,type) => {
		if (
			!(
				status === WITHDRAW_STATUS.approved ||
				status === WITHDRAW_STATUS.rejected ||
				status === WITHDRAW_STATUS.success
			)
		) {
			changeBookingStatus(_id, status,type);
		}
	};
	
	const changeBookingStatus = (id, status,type) => {
		setRequestId(id);
		setRequestStatus(status);
		setRequestShow(true);
		setType(type)
	};

	const column = [
		{
			title: 'Transaction Id',
			dataIndex: 'transaction_id',
			key: 'transaction_id',
			// render: (_, { vehicle_number }) => {
			// 	return vehicle_number;
			// },
		},
		{
			title: 'Status',
			key: 'status',
			render: (_, { status, _id, transaction_type}) => {
				console.log("statusstatus",status,_id)
				let color =
					status === 'Success'
						? 'green'
						: status === 'Reject'
						? 'red'
						: 'yellow';
				return (
					<a>
						<Tag
							color={color}
							key={status}
							onClick={() => onClickStatusChange(_id, status,transaction_type)}
						>
							{status === WITHDRAW_STATUS.pending
								? 'Pending'
								: status === WITHDRAW_STATUS.success
								? 'Success'
								: 'Rejected'}
						</Tag>
					</a>
				);
			},
		},
		{
			title: 'Transaction Type',
			dataIndex: 'transaction_type',
			key: 'transaction_type',
			// render: (_, { category_id }) => {
			// 	return category_id && category_id?.name ? category_id.name : '-';
			// },
		},
		{
			title: 'Amount',
			dataIndex: 'amount',
			key: 'amount',
			// render: (_, { model_id }) => {
			// 	return model_id && model_id?.name ? model_id.name : '-';
			// },
		},
		{
			title: 'Date',
			dataIndex: 'created_at',
			key: 'fuel_id',
			render: (_, { created_at }) => {
				return moment(created_at).format("DD-MM-YYYY")
			},
		},
		
	];

	const betColumn = [
		{
			title: 'Game ID',
			dataIndex: 'game_id',
			key: 'game_id',
			// render: (_, { vehicle_number }) => {
			// 	return vehicle_number;
			// },
		},
		{
			title: 'Deposite Amount',
			dataIndex: 'deposit_amount',
			key: 'deposite_amount',
			// render: (_, { model_id }) => {
			// 	return model_id && model_id?.name ? model_id.name : '-';
			// },
		},
		{
			title: 'Win Amount',
			dataIndex: 'win_amount',
			key: 'win_amount',
			// render: (_, { model_id }) => {
			// 	return model_id && model_id?.name ? model_id.name : '-';
			// },
		},
		{
			title: 'Status',
			dataIndex: 'status',
			key: 'status',
			// render: (_, { brand_id }) => {
			// 	return brand_id && brand_id?.name ? brand_id.name : '-';
			// },
		},
		// {
		// 	title: 'Transaction Type',
		// 	dataIndex: 'transaction_type',
		// 	key: 'transaction_type',
		// 	// render: (_, { category_id }) => {
		// 	// 	return category_id && category_id?.name ? category_id.name : '-';
		// 	// },
		// },
		
		{
			title: 'Date',
			dataIndex: 'created_at',
			key: 'fuel_id',
			render: (_, { created_at }) => {
				return moment(created_at).format("DD-MM-YYYY")
			},
		},
		
	];

	const handleChange = () => {

	}

	useEffect(() => {
		fetchData(params.id);
	}, []);

	return (
		<>
			<div style={{display:"flex",justifyContent:"space-around"}}>
			<h3>Total Balance:  {totalBalance}</h3>
			<h3>Total Withdrawal:  {totalWithdrawal}</h3>
			<h3>Total Deposite:  {totalDeposite}</h3>
			<Button
                      className={"cap"}
                      onClick={(e) => {
                        setVisible(true);
                      }}
                    >
                      Check Order
                    </Button>
			</div>
			<Row gutter={24}>
				
				<Col xs={12} lg={12}>
					<Card title={'Debit / Withdrawal List'}>
						<div className='table-responsive customPagination'>
							<Table
								loading={loading}
								columns={column}
								dataSource={debitList}
								pagination={{
								  defaultPageSize: 10,
								  responsive: true,
								  // total: pagination.total,
								  showSizeChanger: true,
								  showQuickJumper: true,
								  pageSizeOptions: ["10", "20", "30", "50"],
								}}
								onChange={handleChange}
								className='ant-border-space'
							/>
						</div>
					</Card>
				</Col>
				<Col xs={12} lg={12}>
					<Card title={'Credit / Deposite List'}>
						<div className='table-responsive customPagination'>
							<Table
								loading={loading}
								columns={column}
								dataSource={creditList}
								pagination={{
								  defaultPageSize: 10,
								  responsive: true,
								  // total: pagination.total,
								  showSizeChanger: true,
								  showQuickJumper: true,
								  pageSizeOptions: ["10", "20", "30", "50"],
								}}
								// onChange={handleChange}
								className='ant-border-space'
							/>
						</div>
					</Card>
				</Col>
			</Row>
			<Row>
			<Col xs={24} lg={24}>
					<Card title={'Bet List'}>
						<div className='table-responsive customPagination'>
							<Table
								loading={loading}
								columns={betColumn}
								dataSource={betList}
								pagination={{
								  defaultPageSize: 10,
								  responsive: true,
								  // total: pagination.total,
								  showSizeChanger: true,
								  showQuickJumper: true,
								  pageSizeOptions: ["10", "20", "30", "50"],
								}}
								// onChange={handleChange}
								className='ant-border-space'
							/>
						</div>
					</Card>
				</Col>
			</Row>
			{requestStatus && (
				<WithdrawalStatus
					show={requestShow}
					type = {type}
					hide={() => {
						setRequestShow(false);
					}}
					status={requestStatus}
					requestId={requestId}
					statusRefresh={() => setRefresh((prev) => !prev)}
				/>
			)}

{visible && (
	<AddFrom
	  show={visible}
	  hide={() => {
		setVisible(false);
	  }}
	  type={params.type}
	  refresh={() => setRefresh((prev) => !prev)}
	/>
  )}
		</>
	);
}

const AddFrom = ({ show, hide, type, refresh }) => {
const [form] = Form.useForm();
const { request } = useRequest();
const [showData, setShowData] = useState({})
const [orderStatus, setOrderStatus] = useState(false)
const [loading, setLoading] = useState(false);


const onCreate = (values) => {
const {  client_txn_id,txn_date } = values;
const payload = {};
setLoading(true);
//   payload.date = date;
payload.client_txn_id = client_txn_id;
payload.txn_date = moment(txn_date).format("DD-MM-YYYY");



request({
  url: apiPath.checkOrderStatus,
  method: "POST",
  data: payload,
  onSuccess: (data) => {
	setLoading(false);
	setOrderStatus(data.status)
	if (data.status) {
		console.log("fshdvfhsvfsdfgsd",data)
		setShowData(data.data.data)
	  ShowToast(data.message, Severty.SUCCESS);
	//   hide();
	//   refresh();
	} else {
		setShowData(data.data)
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
  width={400}
  title={"Check Order"}
  okText={!orderStatus?"Ok":""}
  onCancel={hide}
  okButtonProps={{
	form: "create",
	htmlType: "submit",
	loading: loading,
  }}
>
	{console.log("showDatashowData",showData,orderStatus)}
  {!orderStatus?<Form id="create" form={form} onFinish={onCreate} layout="vertical">
	<Row>
	  
	  <Col span={24}>
		<Form.Item
		  label={`Client txn_id`}
		  name="client_txn_id"
		  rules={[
			{ required: true, message: "Please enter Client Txn Id!" },
			{
			  min: 6,
			  message: "id should contain atleast 6 characters!",
			},
		  ]}
		>
		  <Input
			autoComplete="off"
			placeholder={`Enter Client Txn Id`}
			className="cap"
		  />
		</Form.Item>
	  </Col>


	  <Col span={24}>
	  <Form.Item
		  label={`Txn Date`}
		  name="txn_date"
		  rules={[
			{ required: true, message: "Please enter the txn_date!" }
		  ]}
		>
		  <Input
			autoComplete="off"
			placeholder={`Enter Key`}
			className="cap"
			type="date"
			format="dd-mm-yyyy"
		  />
		</Form.Item>
	  </Col>
	  {/* <Col span={24}>
		<Form.Item
		  label={`Date`}
		  name="date"
		  rules={[
			{ required: true, message: "Please enter the date!" },
		  ]}
		>
		  <Input
			autoComplete="off"
			placeholder={`Enter Date`}
			className="cap"
			type="date"
		  />
		</Form.Item>
	  </Col> */}
	</Row>
  </Form>:
  <div>
	<div>
		<h3>Name:-    {showData?.customer_name} </h3>
		<h3>Email:-    {showData?.customer_email}</h3>
		<h3>Mobile Number:-    {showData?.customer_mobile}</h3>
		<h3>amount:-    {showData?.amount}</h3>
		<h3>Client transaction Id:-    {showData?.client_txn_id}</h3>
		
		<h3>Status:-    {showData?.status}</h3>
		<h3>Date:-    {showData?.txnAt}</h3>

	</div>
  </div>
  }
</Modal>
);
};

export default UserTransaction;
