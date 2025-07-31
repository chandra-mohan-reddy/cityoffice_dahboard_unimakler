import React from 'react';
import { useSelector } from 'react-redux';
import SuperFranchiseSidebar from '../sidebars/SuperFranchiseSidebar';
import CityAdminSidebar from '../sidebars/CityAdminSidebar';
import FranchiseSidebar from '../sidebars/FranchiseSidebar'
const Sidebars = () => {

  const userData = useSelector((state) => state.user.userData)
  const role = useSelector((state) => state.user.role);

  let SideBar;
  switch (role) {
    case 'City Admin':
      SideBar = <CityAdminSidebar user={userData} />
      break;
    case 'Franchise':
      SideBar = <FranchiseSidebar user={userData} role={role} />
      break;
    case 'Super Franchise':
      SideBar = <SuperFranchiseSidebar user={userData} role={role} />
      break;
    default:
      SideBar = null;
      break;
  }
  return SideBar
};

export default Sidebars;

