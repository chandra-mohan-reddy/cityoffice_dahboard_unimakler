import React from 'react';
import { Sidebar, SubMenu, Menu, MenuItem } from 'react-pro-sidebar';
import { Link, useLocation } from 'react-router-dom';

const ChannelpartnerSidebar = ({ user }) => {
    const location = useLocation();
    const isActive = (path) => location.pathname === path;
    return (
        <Sidebar>
            <div className="sidebar-logo-box text-center py-3">
                <Link to="/dashboard">
                    <img src="/assets/images/unimakler-logo.png" alt="Unimakler Logo" style={{ width: 160, maxWidth: '80%', height: 'auto' }} />
                </Link>
            </div>
            <Menu>
                <MenuItem component={<Link to="/dashboard" />} className={isActive('/dashboard') ? 'active' : ''}>
                    Dashboard
                </MenuItem>
                <MenuItem component={<Link to="/projects" />} className={isActive('/projects') ? 'active' : ''}>
                    ASSIGNED PROJECTS
                </MenuItem>
                <MenuItem component={<Link to="/lead-registration" />} className={isActive('/lead-registration') ? 'active' : ''}>
                    Lead Registration
                </MenuItem>
                <MenuItem component={<Link to="/deal-closed" />} className={isActive('/') ? 'active' : ''}>
                    Site Visits
                </MenuItem>
                <MenuItem component={<Link to="/deal-closed" />} className={isActive('/deal-closed') ? 'active' : ''}>
                    Deal Closed
                </MenuItem>
            </Menu>
        </Sidebar >
    )
}

export default ChannelpartnerSidebar
