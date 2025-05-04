import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => { //destructure children
  const { session } = useAuth();

  if (session === undefined) {  
    return <div>Loading...</div>; 
  }

  // If the user is not logged in, navigate to the login page
  return <div>{session ? <>{children}</> : <Navigate to="/" />}</div>; 
};

export default ProtectedRoute;
