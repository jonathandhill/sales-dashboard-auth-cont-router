import React, { useState } from 'react';
import { UserAuth } from '../context/AuthContext';

const Signin = ({ setShowSignup }) => {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const { signInUser } = UserAuth();

  const handleSignIn = async (formData) => {
    setLoading(true);
    const email = formData.get('email');
    const password = formData.get('password');

    try {
      const result = await signInUser(email, password);

      if (result.success) {
        // The session will be updated automatically by the auth state change listener
        console.log('Sign in successful, session should update automatically');
      } else {
        setError(result.error);
        setTimeout(() => {
          setError('');
        }, 3000);
      }
    } catch (err) {
      setError('An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form action={handleSignIn}>
      <h2 className="form-title">Sign in</h2>
      <p>
        Don't have an account yet?{' '}
        <span onClick={() => setShowSignup(true)} className="form-link">
          Sign up
        </span>
      </p>
      <div className="form-group">
        {/* <label htmlFor="Email">Email</label> */}
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
        {/* <label htmlFor="Password">Password</label> */}
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
        Sign In
      </button>
      {error && <p className="error-message">{error}</p>}
    </form>
  );
};

export default Signin;
