import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { Upload, message } from 'antd';
import type { RcFile, UploadProps } from 'antd/es/upload';
import type { UploadChangeParam, UploadFile } from 'antd/es/upload/interface';
import React, { useState } from 'react';
import { UserModelDTO } from '../../../core/models/user';
import useUserStore from '../../../core/zustand/useUserStore';

const getBase64 = (img: RcFile, callback: (url: string) => void) => {
	const reader = new FileReader();
	reader.addEventListener('load', () => callback(reader.result as string));
	reader.readAsDataURL(img);
};

const beforeUpload = (file: RcFile) => {
	const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
	if (!isJpgOrPng) {
		message.error('You can only upload JPG/PNG file!');
	}
	const isLt2M = file.size / 1024 / 1024 < 2;
	if (!isLt2M) {
		message.error('Image must smaller than 2MB!');
	}
	return isJpgOrPng && isLt2M;
};

const UploadNewImage: React.FC = () => {
	const { user, updateUser } = useUserStore((state) => state);

	const [loading, setLoading] = useState(false);

	const handleChange: UploadProps['onChange'] = (info: UploadChangeParam<UploadFile>) => {
		if (info.file.status === 'uploading') {
			setLoading(true);
			return;
		}
		if (info.file.status === 'done') {
			getBase64(info.file.originFileObj as RcFile, async (base64ImageString) => {
				setLoading(false);
				try {
					if (!user) {
						throw new Error('User not found');
					}

					const updatedUserModel: UserModelDTO = {
						...user,
						profile: {
							...user?.profile,
							profile_picture: base64ImageString,
						},
					};

					await updateUser(updatedUserModel);
					message.success('Profile picture updated successfully!');
				} catch (error) {
					message.error('Error updating profile picture.');
					console.error(error);
				}
			});
		}
	};

	const uploadButton = (
		<div>
			{loading ? <LoadingOutlined /> : <PlusOutlined />}
			<div style={{ marginTop: 8 }}>Upload</div>
		</div>
	);

	return (
		<>
			<Upload
				name="avatar"
				listType="picture-card"
				className="avatar-uploader"
				showUploadList={false}
				action="https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188"
				beforeUpload={beforeUpload}
				onChange={handleChange}
			>
				{user?.profile.profile_picture ? (
					<img src={user?.profile.profile_picture} alt="avatar" style={{ width: '100%' }} />
				) : (
					uploadButton
				)}
			</Upload>
		</>
	);
};

export default UploadNewImage;
