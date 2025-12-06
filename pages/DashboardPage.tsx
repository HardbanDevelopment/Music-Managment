import React from 'react';
import Header from '../components/layout/Header';

const DashboardPage: React.FC<{ title: string; component: React.ReactNode }> = ({ title, component }) => (
    <>
        <Header title={title} />
        <div className="p-8">
            {component}
        </div>
    </>
);

export default DashboardPage;
