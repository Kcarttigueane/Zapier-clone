import * as yup from 'yup';

export const validationSchema = yup.object().shape({
  email: yup.string().email('Invalid email format').required('Email is required'),
  password: yup.string().min(8, 'Minimum 8 characters required').required('Password is required'),
});
