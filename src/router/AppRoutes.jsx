// AppRoutes.js
import React from 'react';
import {
    BrowserRouter,
    Routes,
    Route
} from "react-router-dom";
import Login from '../views/auth/Login';
import Dashboard from '../views/Dashboard';
import ProtectLayout from '../components/other/ProtecteLayout';
import Invoice from '../views/invoice/Invoice';
import Invoices from '../views/invoice/Invoices';

const AppRoutes = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<ProtectLayout><Dashboard /></ProtectLayout>} />
                <Route path="/invoices" element={<ProtectLayout><Invoices /></ProtectLayout>} />
                <Route path="/invoices/invoice" element={<ProtectLayout><Invoice /></ProtectLayout>} />
                <Route path="/auth" element={<Login />} />
            </Routes>
        </BrowserRouter>
    );
};

export default AppRoutes;