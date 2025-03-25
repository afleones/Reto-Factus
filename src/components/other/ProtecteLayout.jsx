import React from 'react';
import Layout from '../layout/Layout';
import ProtectedRoute from '../proptectedRouter/ProtectedRoute';

const ProtectLayout = ({ children }) => {
  return (
    <ProtectedRoute>
        <Layout>
            {children}               
        </Layout>
    </ProtectedRoute>
  );
}

export default ProtectLayout;