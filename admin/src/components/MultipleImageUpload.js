import { message, Upload } from 'antd';
import React, { useState, useEffect } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { uploadFile } from 'react-s3';
import { s3Config } from '../config/s3Config';
import * as _ from 'lodash';

const MultipleImageUpload = ({
	data,
	fileType,
	imageType,
	btnName,
	onDelete,
	onChange,
}) => {
	const [fileList, setFileList] = useState([]);

	const beforeUpload = (file) => {
		if (fileType.includes(file.type)) {
		} else {
			message.error('File format is not correct');
			return false;
		}
		const isLt2M = file.size / 1024 / 1024 < 5;

		if (!isLt2M) {
			message.error(`Image must be smaller than 5 MB!`);
			return false;
		}
		return true;
	};

	useEffect(() => {
		if (data && data.length > 0) {
			const multipleFileList = data.map((url, index) => {
				return {
					uid: `${index + 1}`,
					name: url,
					status: 'done',
					url: url,
				};
			});

			setFileList(multipleFileList);
		}
	}, []);

	const handleImgChange = async (event) => {
		const { file } = event;
		uploadFile(file, s3Config(imageType))
			.then((data) => {
				const fileData = {
					uid: file.uid,
					name: file.name,
					status: 'done',
					url: data.location,
					thumbUrl: data.location,
				};
				const newFileList = [...fileList, fileData];
				handleChange(newFileList);

				const updatedFileList = [...fileList, fileData];

				setFileList((prevState) => {
					const newState = _.map(updatedFileList, (file) => {
						return file;
					});
					return newState;
				});

				if (onChange) {
					onChange([...fileList, fileData]);
				}
			})
			.catch((err) => console.error(err));
	};

	const handleChange = ({ fileList: newFileList }) => {
		if (newFileList) {
			setFileList((prevState) => {
				const newState = prevState;
				const length = newState.length;

				if (
					newState &&
					newState[length - 1] &&
					newState[length - 1].status !== 'done' &&
					newFileList[length]
				) {
					newState[length - 1] = {
						uid: `${newFileList[length].index + 1}`,
						name: newFileList[length].url,
						status: newFileList[length].status,
						url: newFileList[length].url,
					};
					return newState;
				}
				return prevState;
			});
		}
	};

	const uploadButton = (
		<div>
			{' '}
			<PlusOutlined /> <div style={{ marginTop: 8 }}>Upload {btnName}</div>{' '}
		</div>
	);

	const handleRemove = (file) => {
		const newFile = fileList.filter((item) => item.uid != file.uid);
		setFileList(newFile);
		if (onChange) {
			onChange([...newFile]);
		}
	};

	return (
		<Upload
			listType='picture-card'
			onRemove={handleRemove}
			maxCount={8}
			beforeUpload={beforeUpload}
			fileList={fileList}
			onChange={handleChange}
			customRequest={handleImgChange}
		>
			{fileList.length >= 8 ? null : uploadButton}
		</Upload>
	);
};

export default MultipleImageUpload;
