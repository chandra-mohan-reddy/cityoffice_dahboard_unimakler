import React, { useState, useEffect } from 'react';
import MonthlyLeads from '../../components/Franchise/MonthlyLeads';
import Loader from '../../components/common/Loader';
import { masterClient } from '../../utils/httpClient'
import { useParams } from 'react-router-dom'

const AllFranchisesmonthList = () => {
  const { id, month } = useParams();

  const [loading, setLoading] = useState(false)
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
  }, [])

  if (loading) return <Loader />

  return (
    <div className="main-content">
      <div className="page-content">
        <div className="container-fluid">
          <div className='card p-3'>
            <div className="row">
              <div className="col-12">
                <div className="page-title-box d-flex align-items-center justify-content-between">
                  <div className="page-title-right row w-100">
                    <div className="col-md-6">
                      {franchise.franchiseTire}
                    </div>
                    <div className="col-md-6 text-right">
                      <h3 className='text-right'>Franchise : <b>{franchise.franchise_name}</b></h3>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <MonthlyLeads data={franchise} id={id} month={month} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllFranchisesmonthList;
