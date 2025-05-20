import { createContext, useContext, useEffect, useState } from 'react';
import supabase from '../supabase-client';

// Create the AuthContext
const AuthContext = createContext();

// Provide the AuthContext to the children
export const AuthContextProvider = ({ children }) => {
  //extracting children from props
  const [session, setSession] = useState(undefined);

  useEffect(() => {
    //Get initial session
    async function getInitialSession() {
      const { data, error } = await supabase.auth.getSession();
      if (error) {
        console.error('Error getting session:', error);
        return;
      }
      console.log('Initial Session data:', data);
      setSession(data.session);
    }

    getInitialSession();

    //Listen for session changes
    //callback function that runs when the auth state changes
    supabase.auth.onAuthStateChange((_event, session) => {
      console.log('Auth state changed:', session);
      setSession(session);
    });
  }, []);

  // Sign up
  const signUpNewUser = async (email, password, accountType) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email: email.toLowerCase(),
        password: password,
        options: {
          data: {
            account_type: accountType,
          },
        },
      });

      if (error) {
        console.error('Supabase sign-up error:', error.message);
        return { success: false, error: error.message };
      }

      return { success: true, data };
    } catch (error) {
      console.error('Unexpected error during sign-up:', error.message);
      return {
        success: false,
        error: 'An unexpected error occurred. Please try again.',
      };
    }
  };

  // Sign in
  const signInUser = async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.toLowerCase(),
        password: password,
      });

      // Handle Supabase error explicitly
      if (error) {
        console.error('Supabase sign-in error:', error.message); // Log the error for debugging
        return { success: false, error: error.message }; // Return the error
      }

      // If no error, return success
      console.log('Sign-in success:', data);
      return { success: true, data }; // Return the user data
    } catch (error) {
      // Handle unexpected issues
      console.error('Unexpected error during sign-in:', error.message);
      return {
        success: false,
        error: 'An unexpected error occurred. Please try again.',
      };
    }
  };

  // Sign out
  async function signOut() {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Error signing out:', error.message);
        return { success: false, error: error.message };
      }
      return { success: true };
    } catch (error) {
      console.error('Unexpected error during sign out:', error.message);
      return {
        success: false,
        error: 'An unexpected error occurred during sign out.',
      };
    }
  }

  return (
    // Provide the AuthContext to the children
    <AuthContext.Provider
      value={{ signUpNewUser, signInUser, session, signOut }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to access/subscribe the AuthContext
export const useAuth = () => {
  return useContext(AuthContext);
};
