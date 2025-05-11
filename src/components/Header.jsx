import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

function Header() {
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { session, signOut } = useAuth();

  const handleSignOut = async (e) => {
    e.preventDefault();

    try {
      const { success, error } = await signOut();
      if (success) {
        navigate('/signin');
      } else {
        setError(error);
      }
    } catch (err) {
      setError('An unexpected error occurred during sign out.');
    }
  };

  const accountTypeMap = {
    rep: 'Sales Rep',
    admin: 'Admin',
  };
  const displayAccountType =
    accountTypeMap[session.user.user_metadata.account_type] ||
    session.user.user_metadata.account_type;

  return (
    <header role="banner" aria-label="Dashboard header">
      <h1>
        <svg
          width="28"
          height="28"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ marginRight: '8px' }}
          aria-hidden="true"
          role="img"
          aria-label="Dashboard icon"
        >
          <path
            d="M12 2v8M12 14v8M4.93 4.93l5.66 5.66M13.41 13.41l5.66 5.66M2 12h8M14 12h8M4.93 19.07l5.66-5.66M13.41 10.59l5.66-5.66"
            stroke="#29d952"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
        </svg>
        <span>Sales Team Dashboard</span>
      </h1>
      <div
        className="header-email"
        role="navigation"
        aria-label="User account navigation"
      >
        <h2 className="account-type">{displayAccountType}</h2>
        {error && (
          <div role="alert" className="error-message" id="signout-error">
            {error}
          </div>
        )}
        <h2>
          <span className="sr-only">Logged in as:</span>
          {session.user.email}
        </h2>
        <button onClick={handleSignOut} aria-label="Sign out of your account">
          Sign out
        </button>
      </div>
    </header>
  );
}

export default Header;
