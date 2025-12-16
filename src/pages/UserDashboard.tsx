import React from 'react';
import HomePage from './HomePage';

const UserDashboard: React.FC = () => {
    // The HomePage component is designed to adapt based on the user's role from AuthContext.
    // We can render it for any non-admin user dashboard view.
    return <HomePage />;
};

export default UserDashboard;
