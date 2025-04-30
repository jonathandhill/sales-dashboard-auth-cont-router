import React, { useState } from 'react';
import { UserAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';

const Signin = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const { signInUser } = UserAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null); // Clear any previous errors

    try {
      const { success, data, error } = await signInUser(
        formData.email,
        formData.password
      );

      if (error) {
        console.log('Supabase sign in error: ', error);
        setError(error);
        return;
      }
      if (success && data?.session) {
        navigate('/dashboard');
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      console.error('Sign in error: ', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <h1 className="landing-header">Paper Like A Boss</h1>
      <div className="sign-form-container">
        <form onSubmit={handleSubmit}>
          <h2 className="form-title">Sign in</h2>
          <p>
            Don't have an account yet?{' '}
            <Link className="form-link" to="/signup">
              Sign up
            </Link>
          </p>
          <div className="form-group">
            {/* <label htmlFor="Email">Email</label> */}
            <input
              className="form-input"
              type="email"
              name="email"
              id="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            {/* <label htmlFor="Password">Password</label> */}
            <input
              className="form-input"
              type="password"
              name="password"
              id="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit" disabled={loading} className="form-button">
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
          {error && <p className="error-message">{error}</p>}
        </form>
      </div>
    </>
  );
};

export default Signin;
