import { useState, useEffect } from 'react';
import Dashboard from "./components/Dashboard";
import Header from "./components/Header";
import Signin from './components/Signin';
import Signup from './components/Signup';
import supabase from './supabase-client';

function App() {
  const [session, setSession] = useState(undefined);
  const [currentPage, setCurrentPage] = useState('signin');

  // Initialize session
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  // Sign out function
  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Error signing out:', error);
    }
  };


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
          {currentPage === 'signin' ? (
            <Signin setCurrentPage={setCurrentPage} />
          ) : (
            <Signup setCurrentPage={setCurrentPage} />
          )}
        </div>
      </>
    );
  }
  return (
    <>
      <Header signOut={signOut} session={session} />
      <Dashboard 
        setCurrentPage={setCurrentPage}
        session={session}
      />
    </>
  );



  
}

export default App;