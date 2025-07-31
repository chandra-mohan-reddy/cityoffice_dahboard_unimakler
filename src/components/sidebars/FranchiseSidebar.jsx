import React from 'react';
import { Sidebar, SubMenu, Menu, MenuItem } from 'react-pro-sidebar';
import { Link, useLocation } from 'react-router-dom';

const FranchiseSidebar = ({ user, role }) => {
    const location = useLocation();
    const isActive = (path) => location.pathname === path;
    return (
        <Sidebar>
            <div className="sidebar-logo-box text-center py-3">
                <Link to="/dashboard">
                    <img src="/assets/images/unimakler-logo.png" alt="Unimakler Logo" style={{ width: 120, maxWidth: '80%', height: 'auto' }} />
                </Link>
            </div>
            {/* <div className='usr_dta d-flex align-items-center py-2' style={{ padding: '0 16px' }}>
                <div style={{ width: 48, height: 48, overflow: 'hidden', borderRadius: '50%', background: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <img src={user.franchise_image_file_name} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <div className='pl-2' style={{ marginLeft: 12 }}>
                    <h6 className='mb-0' style={{ fontSize: 16, fontWeight: 600 }}> {user.contact_person}</h6>
                    <p className='mb-0' style={{ fontSize: 13, color: '#888' }}> {user.franchiseTire} </p>
                    <Link to="/profile" style={{ fontSize: 13 }}>Profile View </Link>
                </div>
            </div> */}

            <Menu>
                <MenuItem component={<Link to="/dashboard" />} className={isActive('/dashboard') ? 'active' : ''}>
                    Dashboard
                </MenuItem>
                <MenuItem component={<Link to="/projects" />} className={isActive('/projects') ? 'active' : ''}>
                    ASSIGNED PROJECTS
                </MenuItem>
                {/* <SubMenu label="SALES  EXECUTIVE">
                    <MenuItem component={<Link to="/salesexe" />} className={isActive('/salesexe') ? 'active' : ''}>
                        Add Sales Executive
                    </MenuItem>
         
                </SubMenu> */}
                {/* <SubMenu label="FRANCHISE">
                    <MenuItem component={<Link to="/addbusinessassociate" />} className={isActive('/addbusinessassociate') ? 'active' : ''}>
                        Add Franchise
                    </MenuItem>
                    <MenuItem component={<Link to="/associatelists" />} className={isActive('/associatelists') ? 'active' : ''}>
                        Franchise List
                    </MenuItem>
                    <MenuItem component={<Link to="/removeassociate" />} className={isActive('/removeassociate') ? 'active' : ''}>
                        Inactive Franchise
                    </MenuItem>
                </SubMenu> */}
                <SubMenu label="LEAD TRANSFER">
                    {/* <MenuItem component={<Link to="/internal-transfer" />} className={isActive('/internal-transfer') ? 'active' : ''}>
                        Internal Requests
                    </MenuItem> */}
                        <MenuItem component={<Link to="/internal-transfer" />} className={isActive('/external-transfer') ? 'active' : ''}> Inbox </MenuItem>
                        <MenuItem component={<Link to="/outbox" />} className={isActive('/outbox') ? 'active' : ''}> Outbox </MenuItem>
                    {/* <SubMenu label="Internal Requests">
                    </SubMenu> */}
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

export default FranchiseSidebar
