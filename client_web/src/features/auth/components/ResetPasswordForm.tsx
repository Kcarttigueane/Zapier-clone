import { LockOutlined, MailOutlined } from '@ant-design/icons';
import { Button, Form, Input, message } from 'antd';
import { Formik } from 'formik';
import React from 'react';
import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';
import { useAuthStore } from '../../../core/zustand/useAuthStore';
import { apiV2 } from '../../../core/api';
import { HttpStatusCode } from 'axios';
import { useNavigate } from 'react-router-dom';

const initialValues = {
	email: 'oliver.lewis@masurao.jp',
	code: '000000',
	password: 'password',
};

const validationSchema = Yup.object({
	email: Yup.string().email('Invalid email format').required('Required'),
	password: Yup.string().required('Required'),
	code: Yup.string().required('Required'),
});

interface ResetDTO {
	email: string;
	code: string;
	password: string;
}
const ResetForm: React.FC = () => {
	const { t } = useTranslation();
	const [form] = Form.useForm();
	const { isLoading } = useAuthStore((state) => state);
	const navigate = useNavigate();
	const [messageApi, contextHolder] = message.useMessage();

	const onLoginSubmit = async (values: ResetDTO) => {
		const { email, code, password } = values;
		try {
			const response = await apiV2.post('/auth/reset-password', null, {
				params: {
					email: email,
					code: code,
					new_password: password,
				},
			});
			if (response.status === HttpStatusCode.Ok && response.data) {
				await messageApi.open({
					type: 'success',
					content: 'Successfully changed password',
					duration: 1,
				});
				navigate('/auth/login/');
			}
		} catch (error: any) {
			messageApi.open({
				type: 'error',
				content: error.response.data.detail || 'Something went wrong',
			});
			throw error;
		}
	};

	return (
		<>
			{contextHolder}
			<Formik
				initialValues={initialValues}
				onSubmit={(values: ResetDTO) => {
					console.log(values);
				}}
				validationSchema={validationSchema}
			>
				{({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
					<Form layout="vertical" onSubmitCapture={handleSubmit} form={form}>
						<Form.Item
							label={t('basic.fields.email')}
							validateStatus={touched.email && errors.email ? 'error' : undefined}
							help={touched.email && errors.email ? errors.email : undefined}
							hasFeedback
						>
							<Input
								size="large"
								placeholder="johnDoe@gmail.com"
								prefix={<MailOutlined style={{ marginRight: 8 }} />}
								id="email"
								name="email"
								value={values.email}
								onChange={handleChange}
								onBlur={handleBlur}
							/>
						</Form.Item>
						<Form.Item
							label="Code"
							validateStatus={touched.code && errors.code ? 'error' : undefined}
							help={touched.code && errors.code ? errors.code : undefined}
						>
							<Input
								prefix={<LockOutlined style={{ marginRight: 8 }} />}
								size="large"
								placeholder="000000"
								id="code"
								name="code"
								value={values.code}
								onChange={handleChange}
								onBlur={handleBlur}
							/>
						</Form.Item>
						<Form.Item
							label={t('basic.fields.password')}
							validateStatus={touched.password && errors.password ? 'error' : undefined}
							help={touched.password && errors.password ? errors.password : undefined}
						>
							<Input.Password
								prefix={<LockOutlined style={{ marginRight: 8 }} />}
								size="large"
								placeholder={t('basic.fields.password')}
								id="password"
								name="password"
								value={values.password}
								onChange={handleChange}
								onBlur={handleBlur}
							/>
						</Form.Item>
						<Form.Item style={{ marginTop: 48 }}>
							<Button
								type="primary"
								shape="round"
								size="large"
								htmlType="submit"
								block
								loading={isLoading}
								disabled={Object.keys(errors).length > 0}
								onClick={() => onLoginSubmit(values)}
							>
								{t('basic.fields.submit')}
							</Button>
						</Form.Item>
					</Form>
				)}
			</Formik>
		</>
	);
};

export default ResetForm;
