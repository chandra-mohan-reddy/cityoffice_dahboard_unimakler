import React from 'react'
import { Sidebar, SubMenu, Menu, MenuItem } from 'react-pro-sidebar'
import { Link, useLocation } from 'react-router-dom';
const SalesExecutiveSidebar = () => {
    const location = useLocation();
    const isActive = (path) => location.pathname === path;
    return (
        <Sidebar>
            <Menu>
                <div className="sidebar-logo-box text-center py-3">
                    <Link to="/dashboard">
                        <img src="/assets/images/unimakler-logo.png" alt="Unimakler Logo" style={{ width: 120, maxWidth: '80%', height: 'auto' }} />
                    </Link>
                </div>
                <Menu>
                    <MenuItem component={<Link to="/dashboard" />} className={isActive('/dashboard') ? 'active' : ''}>
                        Dashboard
                    </MenuItem>
                    <MenuItem component={<Link to="/projects" />} className={isActive('/projects') ? 'active' : ''}>
                        ASSIGNED PROJECTS
                    </MenuItem>
                    <MenuItem component={<Link to="/leads/sold" />} className={isActive('/leads/sold') ? 'active' : ''}>
                        Deals Closed
                    </MenuItem>
                    <SubMenu label="LEAD TRANSFER">
                        <MenuItem component={<Link to="/internal-transfer" />} className={isActive('/internal-transfer') ? 'active' : ''}>
                            Internal Requests
                        </MenuItem>
                        <SubMenu label="External Requests">
                            <MenuItem component={<Link to="/external-transfer" />} className={isActive('/external-transfer') ? 'active' : ''}> Inbox </MenuItem>
                            <MenuItem component={<Link to="/outbox" />} className={isActive('/outbox') ? 'active' : ''}> Outbox </MenuItem>
                        </SubMenu>
                    </SubMenu>
                    <SubMenu label="LEADS MANAGEMENT">
                        <MenuItem component={<Link to="/leads/list" />} className={isActive('/leads/list') ? 'active' : ''}> Project Lead List </MenuItem>
                        <MenuItem component={<Link to="/leads/add" />} className={isActive('/leads/add') ? 'active' : ''}> Add Lead </MenuItem>
                        <MenuItem component={<Link to="/leads/dropout" />} className={isActive('/leads/dropout') ? 'active' : ''}> Dropout Leads </MenuItem>
                        <MenuItem component={<Link to="/leads/delete" />} className={isActive('/leads/delete') ? 'active' : ''}> Deleted Leads</MenuItem>
                    </SubMenu>
                </Menu>
            </Menu>
        </Sidebar >
    )
}

export default SalesExecutiveSidebar
