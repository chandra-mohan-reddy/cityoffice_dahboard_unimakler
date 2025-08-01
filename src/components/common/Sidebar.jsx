import React from 'react';
import { useSelector } from 'react-redux';
import CityAdminSidebar from '../sidebars/CityAdminSidebar';
import TeamLederSidebar from '../sidebars/TeamLeaderSidebar'
const Sidebars = () => {

  const userData = useSelector((state) => state.user.userData)
  const role = useSelector((state) => state.user.role);

  let SideBar;
  switch (role) {
    case 'City Admin':
      SideBar = <CityAdminSidebar user={userData} />
      break;
    case 'Team Leader':
      SideBar = <TeamLederSidebar user={userData} role={role} />
      break;
    default:
      SideBar = null;
      break;
  }
  return SideBar
};

export default Sidebars;

