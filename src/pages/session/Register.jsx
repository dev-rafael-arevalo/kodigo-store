import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { createUserWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { auth_user, providerGoogle } from '../../firebase/appConfig';
import toastr from 'toastr'; // Make sure Toastr is installed and configured
import 'toastr/build/toastr.min.css';

// Form validation using Yup
const schema = yup.object().shape({
  email: yup
    .string()
    .required('Email is required')
    .email('Invalid email, example: user@domain.com'),
  password: yup
    .string()
    .required('Password is required')
    .min(8, 'Password must contain at least 8 characters'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password'), null], 'Passwords do not match'),
});

export default function Register() {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
  });

  const navigate = useNavigate();

  // Function to register user
  const onSubmit = async (data) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth_user,
        data.email,
        data.password
      );
      console.log('User registered:', userCredential.user);
      toastr["success"]('User registered successfully', 'Registration Saved'); // Success notification
      navigate('/'); // Redirect to home after successful registration
    } catch (error) {
      console.error('Error registering user:', error.message);
      toastr.error('Error registering user: ' + error.message); // Error notification
    }
  };

  // Function to authenticate with Google
  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth_user, providerGoogle);
      console.log('User authenticated with Google:', result.user);
      toastr["success"]('Successful authentication with Google', 'Registration Saved'); // Success notification
      navigate('/'); // Redirect to home after successful authentication
    } catch (error) {
      console.error('Error authenticating with Google:', error.message);
      toastr.error('Error authenticating with Google: ' + error.message); // Error notification
    }
  };

  return (
    <div className="container">
      <h1 className="text-center">Register</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="needs-validation col-12">
        <div className="my-2 row">
          <label className="col-sm-5 col-form-label">
            <i className="fas fa-envelope"></i> Email
          </label>
          <div className="col-sm-7">
            <input
              type="email"
              className={`form-control ${errors.email ? 'is-invalid' : ''}`}
              placeholder="Enter your email"
              {...register('email')}
            />
            {errors.email && (
              <span className="invalid-feedback">{errors.email.message}</span>
            )}
          </div>
        </div>

        <div className="my-2 row">
          <label className="col-sm-5 col-form-label">
            <i className="fas fa-lock"></i> Password
          </label>
          <div className="col-sm-7">
            <input
              type="password"
              className={`form-control ${errors.password ? 'is-invalid' : ''}`}
              placeholder="Enter your password"
              {...register('password')}
            />
            {errors.password && (
              <span className="invalid-feedback">{errors.password.message}</span>
            )}
          </div>
        </div>

        <div className="my-2 row">
          <label className="col-sm-5 col-form-label">
            <i className="fas fa-lock"></i> Confirm
          </label>
          <div className="col-sm-7">
            <input
              type="password"
              className={`form-control ${errors.confirmPassword ? 'is-invalid' : ''}`}
              placeholder="Confirm your password"
              {...register('confirmPassword')}
            />
            {errors.confirmPassword && (
              <span className="invalid-feedback">{errors.confirmPassword.message}</span>
            )}
          </div>
        </div>

        <button type="submit" className="btn btn-primary">Register</button>
        <button type="button" className="btn btn-danger ms-2" onClick={handleGoogleSignIn}>
          <i className="fab fa-google"></i> Register with Google
        </button>
      </form>
    </div>
  );
}
