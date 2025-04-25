import React, { useState } from 'react';
import supabase from '../supabase-client';

const Signup = ({ setCurrentPage }) => {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const signUpNewUser = async (email, password) => {
    const { data, error } = await supabase.auth.signUp({
      email: email.toLowerCase(),
      password: password,
    });

    if (error) {
      console.error('Error signing up: ', error);
      return { success: false, error };
    }

    return { success: true, data };
  };

  const signInUser = async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.toLowerCase(),
        password: password,
      });

      if (error) {
        console.error('Sign-in error:', error.message);
        return { success: false, error: error.message };
      }

      console.log('Sign-in success:', data);
      return { success: true, data };
    } catch (error) {
      console.error('Unexpected error during sign-in:', error.message);
      return {
        success: false,
        error: 'An unexpected error occurred. Please try again.',
      };
    }
  };

  const handleSignUp = async (formData) => {
    setLoading(true);
    const email = formData.get('email');
    const password = formData.get('password');

    try {
      const result = await signUpNewUser(email, password);

      if (result.success) {
        // After successful signup, try to sign in using the provided function
        const signInResult = await signInUser(email, password);

        if (!signInResult.success) {
          setError(signInResult.error);
        }
        // The session will be updated automatically by the auth state change listener
      } else {
        setError(result.error.message);
      }
    } catch (err) {
      setError('An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form action={handleSignUp}>
      <h2 className="form-title">Sign up today!</h2>
      <p>
        Already have an account?{' '}
        <span onClick={() => setCurrentPage('signin')} className="form-link">
          Sign in
        </span>
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
        Sign Up
      </button>
      {error && <p className="error-message">{error}</p>}
    </form>
  );
};

export default Signup;
