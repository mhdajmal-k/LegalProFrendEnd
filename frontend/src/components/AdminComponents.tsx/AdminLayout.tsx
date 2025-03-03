
import React from 'react';
import DefaultSidebar from './DefaultSidebar';
import { Outlet } from 'react-router-dom';

const AdminLayout: React.FC = () => {
    return (
        <div className="flex">
            <DefaultSidebar />
            <div className="flex-grow  p-4">
                <Outlet />
            </div>
        </div>
    );
};

export default AdminLayout;
