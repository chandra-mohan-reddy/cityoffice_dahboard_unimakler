import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { masterClient } from '../../utils/httpClient';
import Loader from '../common/Loader';
const Dashboard = ({ data }) => {

  const [loader, setLoader] = useState(false);
  const [dashboardCounts, setDashboardCounts] = useState({
    projectsCount: 0,
    soldCount: 0,
    leadsCount: 0,
    franchiseCount: 0,
    salesExecutiveCount: 0
  });

  const getDashboardCounts = async () => {
    if (!data?.franchise_id) {
      console.log('No franchise_id available yet');
      return;
    }
    setLoader(true);
    try {
      const res = await masterClient.post('/dashboard', {
        id: data?.franchise_id,
        user_type: 24
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
    if (data && Object.keys(data).length > 0 && data.franchise_id) {
      getDashboardCounts();
    }
  }, [data]);

  const dashboardItems = [
    { title: 'Assigned Projects', count: dashboardCounts.projectsCount, route: '/projects' },
    { title: 'Site Visits', count: dashboardCounts.franchiseCount, route: '' },
    { title: 'Lead List', count: dashboardCounts.leadsCount, route: '/leads/list' },
    { title: 'Deals Closed', count: dashboardCounts.soldCount, route: '' },
  ];

  if (loader) return <Loader />;

  return (
    <div className='p-4'>
      <h4 className="PremiumAccount1 mb-3 pb-0 dt text-right">
        {data?.franchise_name}
      </h4>

      <div className="ad-v2-hom-info">
        <div className="ad-v2-hom-info-inn mt-0">
          <ul className="p-0">
       

            <div className="row justify-content-center w-80 m-auto">
              {dashboardItems.map((item, index) => (
                <div key={index} className={`col-md-6 ${item.className || ''}`}>
                  <div className="ad-hom-box ad-hom-box-1 mb-3">
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
  )
}

export default Dashboard