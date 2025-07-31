import React from 'react'
import CityOfficeDashboard from '../../components/dashboards/CityOfficeDashboard';
import TeamLeaderDashboard from '../../components/dashboards/TeamLeaderDashboard';
import { useSelector } from 'react-redux';

const Dashboard = () => {
    const userData = useSelector((state) => state.user.userData);
    const role = useSelector((state) => state.user.role)

    let dashboard;
    switch (role) {
        case 'City Admin':
            dashboard = <CityOfficeDashboard user={userData} />
            break;
        case 'Team Leader':
            dashboard = <TeamLeaderDashboard />
            break;
        default:
            dashboard = null;
            break
    }

    return dashboard
}

export default Dashboard
