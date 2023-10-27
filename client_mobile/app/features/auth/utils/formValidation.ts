import * as yup from 'yup';

export const registerValidationSchema = yup.object().shape({
  email: yup.string().email('Invalid email format').required('Email is required'),
  password: yup.string().min(8, 'Minimum 8 characters required').required('Password is required'),
  firstName: yup.string().required('First name is required'),
  lastName: yup.string().required('Last name is required'),
});

export const loginValidationSchema = yup.object().shape({
  email: yup.string().email('Invalid email format').required('Email is required'),
  password: yup.string().min(8, 'Minimum 8 characters required').required('Password is required'),
});

export const emailValidationSchema = yup.object().shape({
  email: yup.string().email('Invalid email format').required('Email is required'),
});
