import { LockOutlined, MailOutlined } from '@ant-design/icons';
import { Button, Form, Input, message } from 'antd';
import { Formik } from 'formik';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import { useAuthStore } from '../../../core/store/useAuthStore';

const initialValues = {
	email: 'oliver.lewis@masurao.jp',
	password: 'password',
};

const validationSchema = Yup.object({
	email: Yup.string().email('Invalid email format').required('Required'),
	password: Yup.string().required('Required'),
});

interface LoginDTO {
	email: string;
	password: string;
}
const LoginForm: React.FC = () => {
	const { t } = useTranslation();
	const [form] = Form.useForm();
	const { loginFn } = useAuthStore((state) => state);
	const navigate = useNavigate();
	const [messageApi, contextHolder] = message.useMessage();

	const onLoginSubmit = async (values: LoginDTO) => {
		const { email, password } = values;
		try {
			await loginFn(email, password);
			await messageApi.open({
				type: 'success',
				content: 'Successfully registered',
				duration: 1,
			});
			navigate('/dashboard');
		} catch (error) {
			if (error instanceof Error) {
				messageApi.open({
					type: 'error',
					content: error.message || 'Something went wrong',
				});
			}
		}
	};

	return (
		<>
			{contextHolder}
			<Formik
				initialValues={initialValues}
				onSubmit={(values: LoginDTO) => {
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
						<Form.Item style={{ marginTop: 24 }}>
							<Button
								type="primary"
								shape="round"
								size="large"
								htmlType="submit"
								block
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

export default LoginForm;
