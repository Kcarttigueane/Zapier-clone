import { LockOutlined, MailOutlined } from '@ant-design/icons';
import { Button, Form, Input } from 'antd';
import { Formik } from 'formik';
import React from 'react';
import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';

const initialValues = {
	email: '',
	password: '',
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

	const onSubmit = async (values: LoginDTO) => {
		console.log(values);
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
							<Button type="primary" shape="round" size="large" htmlType="submit" block>
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
