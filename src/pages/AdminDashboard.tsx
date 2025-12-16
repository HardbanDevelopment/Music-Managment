import React from 'react';
import HomePage from './HomePage';

const AdminDashboard: React.FC = () => {
    // The HomePage component is designed to adapt based on the user's role from AuthContext.
    // So for the admin dashboard, we can simply render HomePage.
    return <HomePage />;
};

export default AdminDashboard;
