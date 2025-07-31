import { useState, useEffect } from 'react';
import { Link, Route } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { masterClient } from '../../utils/httpClient';
import Loader from '../common/Loader';

const FranchiseDashboard = () => {
  const userData = useSelector((state) => state.user.userData);
  const [loader, setLoader] = useState(false);
  const [dashboardCounts, setDashboardCounts] = useState({
    projectsCount: 0,
    soldCount: 0,
    leadsCount: 0,
    franchiseCount: 0,
    salesExecutiveCount: 0
  });

  const getDashboardCounts = async () => {
    setLoader(true);
    try {
      const res = await masterClient.post('/dashboard', {
        id: userData?.id,
        user_type: 23
      });
      if (res?.data?.status) {
        setDashboardCounts(res.data.data);
      }
    } catch (error) {
      console.error('Error fetching counts:', error);
    } finally {
      setLoader(false);
    }
  };

  useEffect(() => {
    getDashboardCounts();
  }, []);

  const dashboardItems = [
    { title: 'Assigned Projects', count: dashboardCounts.projectsCount, route: '/projects' },
    { title: 'Sale Executives', count: dashboardCounts.salesExecutiveCount, route: '/saleslist' },
    { title: 'Deals Closed', count: dashboardCounts.soldCount, route: '' },
    { title: 'Lead Count', count: dashboardCounts.leadsCount, route: '/leads/list' },
    { title: 'FRANCHISEE', count: dashboardCounts.franchiseCount,  route: '' },
    { title: 'Site Visits', count: dashboardCounts.franchiseCount, route: '' }
  ];

  if (loader) return <Loader />;

  return (
    <div className="main-content">
      <div className="page-content">
        <div className="container-fluid">
          <div className="card">
            <div className="ad-v2-hom-info">
              <div className="ad-v2-hom-info-inn">
                <ul className="Homesb1">
                  <div className="profile-det-titls d-flex justify-content-between align-items-center">
                    <div className="mb-4">
                      <h3 className="PremiumAccount1 mb-1 pb-1">Franchise Type: {userData.franchiseType}</h3>
                      <h3 className="PremiumAccount1 mb-1 pb-1">Franchise Class:{userData.franchiseClass}</h3>
                    </div>
                    <div>
                      <h2 className="PremiumAccount1 mb-0 pb-0 dt">
                        {userData.franchise_tier === 2 ? userData.franchise_brand_name : userData.franchise_name}
                      </h2>
                    </div>
                  </div>

                  <div className="row justify-content-center">
                    {dashboardItems.map((item, index) => (
                      <div key={index} className={`col-md-4 mb-4 ${item.className || ''}`}>
                        <div className="ad-hom-box ad-hom-box-1">
                          <div className="ad-hom-view-com">
                            <Link to={item.route}>
                              <p>{item.title}</p>
                              <h3>{item.count}</h3>
                            </Link>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FranchiseDashboard;