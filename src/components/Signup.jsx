import React, { useState } from 'react';
import { UserAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';

const Signup = () => {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { signUpNewUser } = UserAuth();

  const handleSignUp = async (formData) => {
    setLoading(true);
    setError(null); // Clear any previous errors
    const email = formData.get('email');
    const password = formData.get('password');

    try {
      const result = await signUpNewUser(email, password); // Call context function

      if (result.success) {
        navigate('/dashboard'); // Navigate to dashboard on success
      } else {
        setError(result.error.message); // Show error message on failure
      }
    } catch (err) {
      setError('An unexpected error occurred.'); // Catch unexpected errors
    } finally {
      setLoading(false); // End loading state
    }
  };

  return (
    <>
      <h1 className="landing-header">Paper Like A Boss</h1>
      <div className="sign-form-container">
        <form action={handleSignUp}>
          <h2 className="form-title">Sign up today!</h2>
          <p>
            Already have an account? <Link to="/">Sign in</Link>
          </p>
          <div className="form-group">
            <input
              className="form-input"
              type="email"
              name="email"
              id="email"
              placeholder="Email"
              required
            />
          </div>
          <div className="form-group">
            <input
              className="form-input"
              type="password"
              name="password"
              id="password"
              placeholder="Password"
              required
            />
          </div>
          <button type="submit" disabled={loading} className="form-button">
            {loading ? 'Signing up...' : 'Sign Up'}
          </button>
          {error && <p className="error-message">{error}</p>}
        </form>
      </div>
    </>
  );
};

export default Signup;
