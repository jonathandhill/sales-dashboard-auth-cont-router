import { UserAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const { session } = UserAuth();

  if (session === undefined) {
    return <div>Loading...</div>;
  }

  // If the user is not logged in, navigate to the login page
  return <div>{session ? <>{children}</> : <Navigate to="/" />}</div>;
};

export default ProtectedRoute;
