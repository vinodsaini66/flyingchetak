import { Button, message, Upload, Image, Form } from 'antd';
import React, { useState, useEffect } from 'react';
import { UploadOutlined } from '@ant-design/icons';
import { uploadFile } from 'react-s3';
import { s3Config } from '../config/s3Config';

const SingleImageUpload = ({
	fileType,
	imageType,
	btnName,
	onChange,
	isRequired,
}) => {
	const [file, setFile] = useState([]);

	const handleRemove = (file) => {
		setFile([]);
		if (onChange) {
			onChange([]);
		}
	};

	const handleImgChange = async (event) => {
		const { file } = event;
		onChange([file]);
		setFile([file]);
	};

	const beforeUpload = (file) => {
		if (isRequired && !file) {
			message.error('Please Upload Banner Image');
			return false;
		}
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

	return (
		<Upload
			listType='picture'
			maxCount={1}
			beforeUpload={beforeUpload}
			customRequest={handleImgChange}
			onRemove={handleRemove}
			fileList={file}
		>
			{file && file.length > 0 && file !== '' ? null : (
				<Button icon={<UploadOutlined />}>Upload {btnName}</Button>
			)}
		</Upload>
	);
};

export default SingleImageUpload;
