import { ExclamationCircleOutlined } from '@ant-design/icons';
import { Button, Modal } from 'antd';
import { Severty, ShowToast } from '../helper/toast';
import useRequest from '../hooks/useRequest';

const { confirm } = Modal;

const ConfirmationBox = () => {
	const { request } = useRequest();

	const showConfirm = ({ record, path, onLoading, onSuccess, type }) => {
		setTimeout(() => {
			confirm({
				icon: <ExclamationCircleOutlined />,
				content: <Button>Are you sure you want to change the status?</Button>,
				onOk() {
					statusChange(record, path, onLoading, onSuccess, type);
				},
				onCancel() {},
				maskClosable: true, // This allows closing the modal by clicking outside
			});
		}, 5);
	};
	const showConfirmDelete = ({ record,onDelete}) => {
		setTimeout(() => {
			confirm({
				icon: <ExclamationCircleOutlined />,
				content: <Button>Are you sure you want to delete this?</Button>,
				onOk() {
					onDelete(record)
				},
				onCancel() {},
				maskClosable: true, // This allows closing the modal by clicking outside
			});
		}, 5);
	};

	const showConfirmDeleteAllNotifications = ({ onDelete }) => {
		setTimeout(() => {
			confirm({
				icon: <ExclamationCircleOutlined />,
				content: (
					<Button>Are you sure you want to delete all notifications?</Button>
				),
				onOk() {
					onDelete();
				},
				onCancel() {},
				maskClosable: true, // This allows closing the modal by clicking outside
			});
		}, 5);
	};

	const statusChange = (record, path, onLoading, onSuccess, type) => {
		onLoading(true);
		let url = '';
		if (type !== null && type !== undefined) {
			url = path + '/' + type + '/' + record;
		} else {
			url = path + '/' + record;
		}
		request({
			url: url,
			method: 'GET',
			onSuccess: (data) => {
				onSuccess();
				onLoading(false);
			},
			onError: (error) => {
				ShowToast(error, Severty.ERROR);
			},
		});
	};

	return { showConfirm, showConfirmDeleteAllNotifications,showConfirmDelete };
};

export default ConfirmationBox;
