import Dashboard from "./Dashboard";
import Header from "./Header";
import supabase from './supabase-client';
import { useEffect, useState } from "react";
import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'


function App() {
  const [session, setSession] = useState(null);

  useEffect(() => {
    // Check for an existing session on mount
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log(session);
      setSession(session);
    });

    // Listen for auth changes
    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
    return () => data.subscription.unsubscribe();
  }, []);

  if (!session) {
    return (
      <div>
        <Header session={session}/>
        <div className="auth-container">
          <Auth
            supabaseClient={supabase}
            localization={{
              variables: {
                sign_in: {
                  email_input_placeholder: '',
                  password_input_placeholder: '',
                },
              },
            }}
            appearance={{ 
              theme: ThemeSupa,
              variables: {
                default: {
                  colors: {
                    brand: '#082c1b',
                    brandAccent: '#aadfd7',
                    inputBackground: 'white',
                    anchorTextColor: 'black',
                    inputPlaceholder: 'black',
                    inputLabelText: 'black',
                    brandButtonText: 'white',
                  },
                },
              },
            }}
            providers={[]}
          />
        </div>
      </div>
    );
  }
  return (
    <>
      <Header session={session}/>
      <Dashboard />
    </>
  );
}

export default App;
