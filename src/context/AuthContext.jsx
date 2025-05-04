import { createContext, useContext, useEffect, useState } from 'react';
import supabase from '../supabase-client';

// Create the AuthContext
const AuthContext = createContext();

// Provide the AuthContext to the children
export const AuthContextProvider = ({ children }) => { //extracting children from props
  const [session, setSession] = useState(undefined);

  // Sign up
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

  // Sign in
  const signInUser = async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.toLowerCase(),
        password: password,
      });

      // Handle Supabase error explicitly
      if (error) {
        console.error('Sign-in error:', error.message); // Log the error for debugging
        return { success: false, error: error.message }; // Return the error
      }

      // If no error, return success
      console.log('Sign-in success:', data);
      return { success: true, data }; // Return the user data
    } catch (error) {
      // Handle unexpected issues
      console.error('Unexpected error during sign-in:', err.message);
      return {
        success: false,
        error: 'An unexpected error occurred. Please try again.',
      };
    }
  };

  useEffect(() => {
    //Get initial session
    async function getInitialSession() {
      const { data, error } = await supabase.auth.getSession();
      if (error) {
        console.error('Error getting session:', error);
        return;
      }
      setSession(data.session);
    }

    getInitialSession();

    //Listen for session changes
    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  // Sign out
  async function signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Error signing out:', error);
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
