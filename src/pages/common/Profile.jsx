import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import FranchiseProfile from '../../components/profiles/FranchiseProfile';
import CityOfficeProfile from '../../components/profiles/CityOfficeProfile';
const Profile = () => {

  const userData = useSelector((state) => state.user.userData);
  const role = useSelector((state) => state.user.role);

  let profile;
  switch (role) {
    case 'City Admin':
      profile = <CityOfficeProfile user={userData} />
      break;
    default:
      profile = <></>
      break;
  }

  return profile;
}

export default Profile