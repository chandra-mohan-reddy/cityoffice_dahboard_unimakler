import React, { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { masterClient } from '../../utils/httpClient';
import { useSelector } from 'react-redux';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Dashboard from '../../components/SalesExecutive/Dashboard';
import Projects from '../../components/SalesExecutive/Projects';
import LeadTransfer from '../../components/SalesExecutive/LeadTransfer';
import LeadManagement from '../../components/SalesExecutive/LeadManagement';

import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';

const SalesExecutivedetails = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [salesExecutive, setSalesExecutive] = useState({})

  const getSalesExecutive = async () => {
    setLoading(true)
    try {
      const response = await masterClient.get(`admin/sales-executive/${id}`)
      if (response?.data?.status) {
        setSalesExecutive(response?.data?.data)
      }
    } catch (error) {
      console.error(`Error fetching franchsies => ${error}`);
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getSalesExecutive();
  }, [id])

  return (
    <>
      <div className="main-content franchise_out">
        <div className="page-content">
          <div className="container-fluid">
            <div className='card p-3'>
              <div className="row">
                <div className="col-12">
                  <div className="page-title-box d-flex align-items-center justify-content-between">
                    <div className="page-title-right row w-100">
                      <div className="col-md-4 text-left" >
                        <h3 className='text-left'>Sales Executive: <b>{salesExecutive?.full_name}</b></h3>
                      </div>
                      <div className="col-md-4 text-right">
                        <h3 className='text-center'>Team Leader : <b>{salesExecutive?.tl_name}</b></h3>
                      </div>
                      <div className="col-md-4 text-right">
                        <h3 className='text-right'>City Office : <b>{salesExecutive?.city_office_name}</b></h3>
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
                  <Dashboard data={salesExecutive} />
                </TabPanel>
                <TabPanel>
                  <Projects data={salesExecutive} />
                </TabPanel>
                <TabPanel>
                  <LeadTransfer data={salesExecutive} />
                </TabPanel>
                <TabPanel>
                  <LeadManagement data={salesExecutive} />
                </TabPanel>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SalesExecutivedetails;
