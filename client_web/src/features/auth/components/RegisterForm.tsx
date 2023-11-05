import { LockOutlined, MailOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Form, Input, message } from 'antd';
import { Formik } from 'formik';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import { useAuthStore } from '../../../core/zustand/useAuthStore';

const initialValues = {
	firstName: '',
	lastName: '',
	email: '',
	password: '',
};

const validationSchema = Yup.object({
	firstName: Yup.string().required('Required'),
	lastName: Yup.string().required('Required'),
	email: Yup.string().email('Invalid email format').required('Required'),
	password: Yup.string().required('Required'),
});

interface RegisterDTO {
	firstName: string;
	lastName: string;
	email: string;
	password: string;
}

const RegisterForm: React.FC = () => {
	const { t } = useTranslation();
	const [form] = Form.useForm();
	const navigate = useNavigate();
	const [messageApi, contextHolder] = message.useMessage();
	const { registerFn, isLoading } = useAuthStore((state) => state);

	const onRegisterSubmit = async (values: RegisterDTO) => {
		const { firstName, lastName, email, password } = values;
		try {
			await registerFn(firstName, lastName, email, password);
			await messageApi.open({
				type: 'success',
				content: 'Successfully registered',
				duration: 1,
			});
			navigate('/home');
		} catch (error: any) {
			messageApi.open({
				type: 'error',
				content: error.response.data.detail || 'Something went wrong',
			});
		}
	};

	return (
		<>
			{contextHolder}
			<Formik
				initialValues={initialValues}
				onSubmit={(values: RegisterDTO) => {
					console.log(values);
				}}
				validationSchema={validationSchema}
			>
				{({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
					<Form layout="vertical" onSubmitCapture={handleSubmit} form={form}>
						<Form.Item
							label="firstName"
							validateStatus={touched.firstName && errors.firstName ? 'error' : undefined}
							help={touched.firstName && errors.firstName ? errors.firstName : undefined}
							hasFeedback
						>
							<Input
								size="large"
								placeholder={t('basic.fields.firstName')}
								prefix={<UserOutlined style={{ marginRight: 8 }} />}
								id="firstName"
								name="firstName"
								value={values.firstName}
								onChange={handleChange}
								onBlur={handleBlur}
							/>
						</Form.Item>
						<Form.Item
							label="LastName"
							validateStatus={touched.lastName && errors.lastName ? 'error' : undefined}
							help={touched.lastName && errors.lastName ? errors.lastName : undefined}
							hasFeedback
						>
							<Input
								size="large"
								placeholder={t('basic.fields.lastName')}
								prefix={<UserOutlined style={{ marginRight: 8 }} />}
								id="lastName"
								name="lastName"
								value={values.lastName}
								onChange={handleChange}
								onBlur={handleBlur}
							/>
						</Form.Item>
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
						<Form.Item style={{ marginTop: 32 }}>
							<Button
								type="primary"
								shape="round"
								size="large"
								htmlType="submit"
								block
								loading={isLoading}
								onClick={() => onRegisterSubmit(values)}
								disabled={Object.keys(errors).length > 0}
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

export default RegisterForm;
