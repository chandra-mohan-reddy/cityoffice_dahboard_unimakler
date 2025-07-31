import React from 'react';
import { Sidebar, SubMenu, Menu, MenuItem } from 'react-pro-sidebar';
import { Link, useLocation } from 'react-router-dom';

const CityAdminSidebar = ({ user }) => {
    const location = useLocation();
    const isActive = (path) => location.pathname === path;
    return (
        <Sidebar>
            {/* <div className="sidebar-logo-box text-center py-3">
                <Link to="/dashboard">
                    <img src="/assets/images/unimakler-logo.png" alt="Unimakler Logo" style={{ width: 160, maxWidth: '80%', height: 'auto' }} />
                </Link>
            </div> */}
            {/* <div className='usr_dta d-flex align-items-center py-2' style={{ padding: '0 16px' }}>
                <div style={{ width: 48, height: 48, overflow: 'hidden', borderRadius: '50%', background: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <img src={user.office_head_profile} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <div className='pl-2' style={{ marginLeft: 12 }}>
                    <h6 className='mb-0' style={{ fontSize: 16, fontWeight: 600 }}> {user.office_head_name} </h6>
                    <Link to="/profile" style={{ fontSize: 13 }}>Profile View </Link>
                </div>
            </div> */}

            <Menu>
                {/* <div className="crm-hd"><h4>CITY OFFICE</h4></div> */}
                {/* <MenuItem component={<Link to="/dashboard" />} className={isActive('/dashboard') ? 'active' : ''}>
                    Dashboard
                </MenuItem>
                <MenuItem component={<Link to="/projects" />} className={isActive('/projects') ? 'active' : ''}>
                    ASSIGNED PROJECTS
                </MenuItem>
                <SubMenu label="OFFICE TEAM">
                    <MenuItem component={<Link to="/citymanager" />} className={isActive('/addcitymanager') ? 'active' : ''}>City Office Manager</MenuItem>
                    <MenuItem component={<Link to="/generalmanager" />} className={isActive('/addgeneralmanager') ? 'active' : ''}>General Manager</MenuItem>
                    <MenuItem component={<Link to="/teamleader" />} className={isActive('/addteamleader') ? 'active' : ''}>Team Leader</MenuItem>
                    <MenuItem component={<Link to="/executive" />} className={isActive('/executive') ? 'active' : ''}>Sale Executive</MenuItem>
                </SubMenu>
                <SubMenu label="CHANNEL PARTNER">
                    <MenuItem component={<Link to="/addchannelpartner" />} className={isActive('/addchannelpartner') ? 'active' : ''}>
                        Add Channel Partner
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
                </SubMenu> */}




                {/* /////////////////TM Leader/////////////// */}

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
                                 {/* /////////////////TM Leader/////////////// */}


            </Menu>
        </Sidebar >
    )
}

export default CityAdminSidebar
