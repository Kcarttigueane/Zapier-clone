import { LockOutlined, MailOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Form, Input } from 'antd';
import { Formik } from 'formik';
import React from 'react';
import * as Yup from 'yup';
import { useAuthStore } from '../../../core/store/useAuthStore';

const initialValues = {
	username: 'oliver',
	email: 'oliver.lewis@masurao.jp',
	password: 'password',
};

const validationSchema = Yup.object({
	username: Yup.string().required('Required'),
	email: Yup.string().email('Invalid email format').required('Required'),
	password: Yup.string().required('Required'),
});

interface LoginDTO {
	username: string;
	email: string;
	password: string;
}
const RegisterForm: React.FC = () => {
	const [form] = Form.useForm();
	const { register } = useAuthStore((state) => state);

	const onRegisterSubmit = async (values: LoginDTO) => {
		console.log(values);
		const { username, email, password } = values;

		register(username, email, password);
	};

	return (
		<>
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
							label="Username"
							validateStatus={touched.username && errors.username ? 'error' : undefined}
							help={touched.username && errors.username ? errors.username : undefined}
							hasFeedback
						>
							<Input
								size="large"
								placeholder="Username"
								prefix={<UserOutlined style={{ marginRight: 8 }} />}
								id="username"
								name="username"
								value={values.username}
								onChange={handleChange}
								onBlur={handleBlur}
							/>
						</Form.Item>
						<Form.Item
							label="Email"
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
							label="Password"
							validateStatus={touched.password && errors.password ? 'error' : undefined}
							help={touched.password && errors.password ? errors.password : undefined}
						>
							<Input.Password
								prefix={<LockOutlined style={{ marginRight: 8 }} />}
								size="large"
								placeholder="input password"
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
								onClick={() => onRegisterSubmit(values)}
								disabled={Object.keys(errors).length > 0}
							>
								Submit
							</Button>
						</Form.Item>
					</Form>
				)}
			</Formik>
		</>
	);
};

export default RegisterForm;
