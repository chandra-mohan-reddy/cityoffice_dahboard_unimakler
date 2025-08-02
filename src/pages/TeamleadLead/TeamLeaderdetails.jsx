import React, { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { masterClient } from '../../utils/httpClient';
import { useSelector } from 'react-redux';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import Dashboard from '../../components/Teamleader/Dashboard';
import Projects from '../../components/Teamleader/Projects';
import LeadManagement from '../../components/Teamleader/LeadManagement';
import LeadTransfer from '../../components/Teamleader/LeadTransfer';
// import Dashboard from '../../components/Teamleader/Projects';

const TeamLeaderdetails = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [franchise, setFranchise] = useState({})

  const getFranchiseDetails = async () => {
    setLoading(true)
    try {
      const response = await masterClient.get(`super-franchise/franchise/${id}`)
      if (response?.data?.status) {
        setFranchise(response?.data?.data)
      }
    } catch (error) {
      console.error(`Error fetching franchsies => ${error}`);
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getFranchiseDetails();
  }, [id])

  return (
    <>
      {/* {loading && <Loader />} */}
      <div className="main-content franchise_out">
        <div className="page-content">
          <div className="container-fluid">
            <div className='card p-3'>
              <div className="row">
                <div className="col-12">
                  <div className="page-title-box d-flex align-items-center justify-content-between">
                    <div className="page-title-right row w-100">
                      <div className="col-md-6 text-left" >
                        <h3 className='text-left'>Team Leader: <b>MOHAN</b></h3>
                      </div>
                      <div className="col-md-6 text-right">
                        <h3 className='text-right'>City Office : <b>HYDERABAD</b></h3>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <Tabs>
                <TabList>
                  <Tab>Dashboard</Tab>
                  <Tab>Assigned Projects</Tab>
                  <Tab>Lead Transfer</Tab>
                  <Tab>Lead Management</Tab>
                </TabList>

                <TabPanel>
                  <Dashboard/>
                </TabPanel>
                <TabPanel>
                  <Projects/>
                </TabPanel>
                <TabPanel>
                  <LeadTransfer />
                </TabPanel>
                <TabPanel>
                  <LeadManagement />
                </TabPanel>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TeamLeaderdetails;
