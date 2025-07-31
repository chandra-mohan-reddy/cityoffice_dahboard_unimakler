import React, { useCallback, useEffect, useState } from 'react';
import Loader from '../../components/common/Loader';
import { useParams } from 'react-router-dom';
import { masterClient } from '../../utils/httpClient';
import { useSelector } from 'react-redux';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Dashboard from '../../components/Franchise/Dashboard';
import Projects from '../../components/Franchise/Projects';
import LeadTransfer from '../../components/Franchise/LeadTransfer';
import LeadManagement from '../../components/Franchise/LeadManagement';

import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';

const FranchiseDetails = () => {
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
      {loading && <Loader />}
      <div className="main-content franchise_out">
        <div className="page-content">
          <div className="container-fluid">
            <div className='card p-3'>
              <div className="row">
                <div className="col-12">
                  <div className="page-title-box d-flex align-items-center justify-content-between">
                    <div className="page-title-right row w-100">
                      <div className="col-md-6 text-left" >
                        <h3 className='text-left'>Executive Name : <b>Mohan</b></h3>
                      </div>
                      <div className="col-md-6 text-right">
                        <h3 className='text-right'>Team Leader : <b>Srinivas</b></h3>
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
                  <Dashboard data={franchise} />
                </TabPanel>
                <TabPanel>
                  <Projects data={franchise} />
                </TabPanel>
                <TabPanel>
                  <LeadTransfer data={franchise} />
                </TabPanel>
                <TabPanel>
                  <LeadManagement data={franchise} />
                </TabPanel>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default FranchiseDetails;
