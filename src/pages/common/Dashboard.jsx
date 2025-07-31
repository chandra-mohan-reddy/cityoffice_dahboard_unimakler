import React from 'react'
import SuperFranchiseDashboard from '../../components/dashboards/SuperFranchiseDashboard';
import FranchiseDashboard from '../../components/dashboards/FranchiseDashboard';
import CityOfficeDashboard from '../../components/dashboards/CityOfficeDashboard';
import TeamLeaderDashboard from '../../components/dashboards/TeamLeaderDashboard';
import { useSelector } from 'react-redux';

const Dashboard = () => {

    const userData = useSelector((state) => state.user.userData);
    const role = useSelector((state) => state.user.role)

    let dashboard;
    switch (role) {
        case 'City Admin':
            dashboard = <TeamLeaderDashboard />
            break;
        case 'City Admin':
            dashboard = <CityOfficeDashboard user={userData} />
            break;
        case 'Franchise':
            dashboard = <FranchiseDashboard user={userData} />
            break;
        case 'Super Franchise':
            dashboard = <SuperFranchiseDashboard user={userData} />
            break;
        default:
            dashboard = null;
            break
    }

    return dashboard
}

export default Dashboard
 