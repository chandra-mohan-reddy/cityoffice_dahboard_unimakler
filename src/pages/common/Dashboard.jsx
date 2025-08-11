import React from 'react'
import { useSelector } from 'react-redux';
import CityOfficeDashboard from '../../components/dashboards/CityOfficeDashboard';
import TeamLeaderDashboard from '../../components/dashboards/TeamLeaderDashboard';
import SalesExecutiveDashboard from '../../components/dashboards/SalesExecutiveDashboard';
import ChannelPartnerDashboard from '../../components/dashboards/ChannelPartnerDashboard';

const Dashboard = () => {
    const userData = useSelector((state) => state.user.userData);
    const role = useSelector((state) => state.user.role)

    let dashboard;
    switch (role) {
        case 'City Admin':
            dashboard = <CityOfficeDashboard user={userData} />
            break;
        case 'Team Leader':
            dashboard = <TeamLeaderDashboard user={userData} />
            break;
        case 'Sales Executive':
            dashboard = <SalesExecutiveDashboard userData={userData} />
            break;
        case 'Channel Partner':
            dashboard = <ChannelPartnerDashboard userData={userData} />
            break;
        default:
            dashboard = null;
            break
    }

    return dashboard
}

export default Dashboard
