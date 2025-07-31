import React from 'react';
import { Sidebar, SubMenu, Menu, MenuItem } from 'react-pro-sidebar';
import { Link, useLocation } from 'react-router-dom';

const SuperFranchiseSidebar = ({ user, role }) => {
    const location = useLocation();
    const isActive = (path) => location.pathname === path;
    return (
        <Sidebar>
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
                <SubMenu label="SALES  EXECUTIVE">
                    <MenuItem component={<Link to="/salesexe" />} className={isActive('/salesexe') ? 'active' : ''}>
                        Add Sales Executive
                    </MenuItem>
                    {/* <MenuItem component={<Link to="/saleslist" />} className={isActive('/saleslist') ? 'active' : ''}>
                        Sales List
                    </MenuItem>
                    <MenuItem component={<Link to="/removesale" />} className={isActive('/removesale') ? 'active' : ''}>
                        Remove Sales Executive
                    </MenuItem> */}
                </SubMenu>
                <SubMenu label="FRANCHISE">
                    <MenuItem component={<Link to="/franchise/create" />} className={isActive('/addbusinessassociate') ? 'active' : ''}>
                        Add Franchise
                    </MenuItem>
                    <MenuItem component={<Link to="/franchise/list" />} className={isActive('/associatelists') ? 'active' : ''}>
                        Franchise List
                    </MenuItem>
                    <MenuItem component={<Link to="/franchise/inactive" />} className={isActive('/removeassociate') ? 'active' : ''}>
                        Inactive Franchise
                    </MenuItem>
                </SubMenu>
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
        </Sidebar >
    )
}

export default SuperFranchiseSidebar
