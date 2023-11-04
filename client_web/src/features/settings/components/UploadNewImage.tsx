import { Upload } from 'antd';
import type { RcFile, UploadFile, UploadProps } from 'antd/es/upload/interface';
import React, { useState } from 'react';
import useUserStore from '../../../core/zustand/useUserStore';
import { base64ToImageUrl, baseUserProfileBase64 } from '../../../core/utils/base64ToImageUrl';
import { UserModelDTO } from '../../../core/models/user';


const UploadNewImage: React.FC = () => {
	const { user, updateUser } = useUserStore((state) => state);

	const [fileList, setFileList] = useState<UploadFile[]>([
		{
			uid: '-1',
			name: 'image.png',
			status: 'done',
			url: base64ToImageUrl(user?.profile.profile_picture || baseUserProfileBase64)
		},
	]);

	const onChange: UploadProps['onChange'] = ({ fileList: newFileList, file, }) => {
		setFileList(newFileList);
		if (user === null || newFileList.length === 0) {
			return;
		}

		const updatedUser: Partial<UserModelDTO> = { ...user };


		if (file && file.thumbUrl) {
			updatedUser.profile = updatedUser.profile || undefined;
			if (updatedUser.profile === undefined) {
				return;
			}
			updatedUser.profile.profile_picture = file.thumbUrl.split(',')[1];
			console.log("Updated User: ", updatedUser);
			updateUser(updatedUser);
		} else {
			console.log("thumbUrl is undefined");
		}
	};

	const onPreview = async (file: UploadFile) => {
		let src = file.url as string;
		if (!src) {
			src = await new Promise((resolve) => {
				const reader = new FileReader();
				reader.readAsDataURL(file.originFileObj as RcFile);
				reader.onload = () => resolve(reader.result as string);
			});
		}
		const image = new Image();
		image.src = src;
		const imgWindow = window.open(src);
		imgWindow?.document.write(image.outerHTML);
	};

	return (
		<Upload
			action="https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188"
			listType="picture-card"
			fileList={fileList}
			onChange={onChange}
			onPreview={onPreview}
		>
			{fileList.length < 1 && '+ Upload'}
		</Upload>
	);
};

export default UploadNewImage;
