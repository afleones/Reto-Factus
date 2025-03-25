// ProtectLayout.jsx
import { Navigate } from 'react-router-dom';

const ProtectLayout = ({ children }) => {
  const accessToken = localStorage.getItem('access_token');
  
  if (!accessToken) {
    return <Navigate to="/auth" replace />;
  }

  return children;
};

export default ProtectLayout;