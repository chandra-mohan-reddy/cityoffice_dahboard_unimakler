import React, { useState, useEffect } from 'react';
import MonthLeads from '../../components/SalesExecutive/MonthlyLeads';
import Loader from '../../components/common/Loader';
import { masterClient } from '../../utils/httpClient'
import { useParams } from 'react-router-dom'

const MonthlyLeads = () => {
    const { id, month } = useParams();

    const [loading, setLoading] = useState(false)
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
            {loading && <Loader />}
            <div className="main-content">
                <div className="page-content">
                    <div className="container-fluid">
                        <div className='card p-3'>
                            <div className="row">
                                <div className="col-12">
                                    <div className="page-title-box d-flex align-items-center justify-content-between">
                                        <div className="page-title-right row w-100">
                                            <div className="col-md-6">
                                                {salesExecutive.full_name}
                                            </div>
                                            <div className="col-md-6 text-right">
                                                <h3 className='text-right'>City Office : <b>{salesExecutive.city_office_name}</b></h3>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <MonthLeads data={salesExecutive} id={id} month={month} />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default MonthlyLeads;
