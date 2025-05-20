import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { useActionState } from 'react';

const Signup = () => {
  const { signUpNewUser } = useAuth();
  const navigate = useNavigate();

  const [error, submitAction, isPending] = useActionState(
    async (previousState, formData) => {
      const email = formData.get('email');
      const password = formData.get('password');
      const accountType = formData.get('account-type');
      const name = formData.get('name');
      try {
        const {
          success,
          data,
          error: signUpError,
        } = await signUpNewUser(email, password, accountType, name);

        if (signUpError) {
          //Error would be logged in the AuthContext
          return new Error(signUpError);
        }

        if (success && data?.session) {
          navigate('/dashboard');
          return null; // Return success state
        }

        return null; // Handles any other case, if needed
      } catch (err) {
        console.error('Sign up error: ', err);
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
          aria-label="Sign up form"
          aria-describedby="form-description"
        >
          <div id="form-description" className="sr-only">
            Use this form to create a new account. Enter your email and
            password.
          </div>

          <h2 className="form-title">Sign up today!</h2>
          <p>
            Already have an account?{' '}
            <Link className="form-link" to="/signin">
              Sign in
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
            aria-describedby={error ? 'signup-error' : undefined}
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
            aria-describedby={error ? 'signup-error' : undefined}
            disabled={isPending}
          />

          <label htmlFor="name">Name</label>
          <input
            className="form-input"
            type="text"
            name="name"
            id="name"
            placeholder=""
            required
            aria-required="true"
            aria-invalid={error ? 'true' : 'false'}
            aria-describedby={error ? 'signup-error' : undefined}
            disabled={isPending}
          />

          <fieldset
            className="form-fieldset"
            aria-required="true"
            aria-label="Select your role"
          >
            <legend>Select your role</legend>
            <div className="radio-group">
              <label>
                <input
                  type="radio"
                  name="account-type"
                  value="admin"
                  required
                />{' '}
                Admin
              </label>
              <label>
                <input type="radio" name="account-type" value="rep" required />{' '}
                Sales Rep
              </label>
              <label>
                <input
                  type="radio"
                  name="account-type"
                  value="readonly"
                  required
                />{' '}
                Manager
              </label>
            </div>
          </fieldset>

          <button
            type="submit"
            disabled={isPending}
            className="form-button"
            aria-busy={isPending}
          >
            {isPending ? 'Signing up...' : 'Sign Up'}
          </button>

          {error && (
            <div
              id="signup-error"
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

export default Signup;
