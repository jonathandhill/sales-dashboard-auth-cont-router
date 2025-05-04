import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { useActionState } from 'react';

const Signin = () => {
  const { signInUser } = useAuth();
  const navigate = useNavigate();

  const [error, submitAction, isPending] = useActionState(
    async (previousState, formData) => {
      try {
        const email = formData.get('email');
        const password = formData.get('password');

        const {
          success,
          data,
          error: signInError,
        } = await signInUser(email, password);

        if (signInError) {
          console.log('Supabase sign in error: ', signInError);
          return new Error(signInError);
        }

        if (success && data?.session) {
          navigate('/dashboard');
          return null;
        }

        return null; // Handles any other case, if needed
      } catch (err) {
        console.error('Sign in error: ', err);
        return new Error('An unexpected error occurred. Please try again.');
      }
    },
    null // Initial state
  );

  return (
    <>
      <h1 className="landing-header">Paper Like A Boss</h1>
      <div className="sign-form-container">
        <form
          action={submitAction}
          aria-label="Sign in form"
          aria-describedby="form-description"
        >
          <div id="form-description" className="sr-only">
            Use this form to sign in to your account. Enter your email and
            password.
          </div>

          <h2 className="form-title">Sign in</h2>
          <p>
            Don't have an account yet?{' '}
            <Link className="form-link" to="/signup">
              Sign up
            </Link>
          </p>

          <label htmlFor="email">Email</label>
          <input
            className="form-input"
            type="email"
            name="email"
            id="email"
            placeholder=""
            required
            aria-required="true"
            aria-invalid={error ? 'true' : 'false'}
            aria-describedby={error ? 'signin-error' : undefined}
            disabled={isPending}
          />

          <label htmlFor="password">Password</label>
          <input
            className="form-input"
            type="password"
            name="password"
            id="password"
            placeholder=""
            required
            aria-required="true"
            aria-invalid={error ? 'true' : 'false'}
            aria-describedby={error ? 'signin-error' : undefined}
            disabled={isPending}
          />

          <button
            type="submit"
            disabled={isPending}
            className="form-button"
            aria-busy={isPending}
          >
            {isPending ? 'Signing in...' : 'Sign In'}
          </button>

          {error && (
            <div
              id="signin-error"
              role="alert"
              className="sign-form-error-message"
            >
              {error.message}
            </div>
          )}
        </form>
      </div>
    </>
  );
};

export default Signin;
