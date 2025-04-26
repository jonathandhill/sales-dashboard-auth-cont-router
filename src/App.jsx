import { useState } from 'react';
import Dashboard from './components/Dashboard';
import Header from './components/Header';
import Signin from './components/Signin';
import Signup from './components/Signup';
import { UserAuth } from './context/AuthContext';

function App() {
  const [showSignup, setShowSignup] = useState(false);
  const { session } = UserAuth();

  if (!session) {
    return (
      <>
        <h1 className="landing-header">Paper Like A Boss</h1>
        <div
          className="form-container"
          style={{
            border: '1px solid #ccc',
            padding: '2rem',
            borderRadius: '8px',
          }}
        >
          {showSignup ? (
            <Signup setShowSignup={setShowSignup} />
          ) : (
            <Signin setShowSignup={setShowSignup} />
          )}
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <Dashboard />
    </>
  );
}

export default App;
