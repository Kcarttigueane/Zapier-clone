import { MailOutlined } from '@ant-design/icons';
import { Button, Form, Input } from 'antd';
import { Formik } from 'formik';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';
import { useAuthStore } from '../../../core/zustand/useAuthStore';
import { useNavigate } from 'react-router-dom';
import { apiV2 } from '../../../core/api';
import { HttpStatusCode } from 'axios';

const initialValues = {
	email: 'oliver.lewis@masurao.jp',
};

const validationSchema = Yup.object({
	email: Yup.string().email('Invalid email format').required('Required'),
});

interface ForgotDTO {
	email: string;
}
const ForgotForm: React.FC = () => {
	const { t } = useTranslation();
	const [form] = Form.useForm();
	const navigate = useNavigate();
	const { isLoading } = useAuthStore((state) => state);
	const [apiResponse, setApiResponse] = useState<string | null>(null);

	const onLoginSubmit = async (values: ForgotDTO) => {
		const { email } = values;
		console.log('email: ', email);
		try {
			const response = await apiV2.post('/auth/forgot-password', null, {
				params: {
					email: email,
				},
			});
			if (response.status === HttpStatusCode.Ok && response.data) {
				setApiResponse('Redirection');
				setTimeout(() => {
					navigate('/auth/login/reset-password');
				}, 3000);
			}
		} catch (error: any) {
			setApiResponse("Erreur lors de l'envoi du courriel");
			throw error;
		}
	};

	return (
		<>
			<Formik
				initialValues={initialValues}
				onSubmit={(values: ForgotDTO) => {
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
						<Form.Item style={{ marginTop: 48 }}>
							{apiResponse && (
								<div style={{ color: apiResponse.includes('Erreur') ? 'red' : 'green' }}>{apiResponse}</div>
							)}
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

export default ForgotForm;
