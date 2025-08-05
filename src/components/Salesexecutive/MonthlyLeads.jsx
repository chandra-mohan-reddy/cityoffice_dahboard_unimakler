import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { masterClient } from '../../utils/httpClient';
import Loader from '../common/Loader';
import moment from 'moment';

const MonthLeads = ({ data, id, month }) => {
    const [loading, setLoading] = useState(false)
    const [assignedProjects, setAssignedProjects] = useState([]);
    const [dayWiseStats, setDayWiseStats] = useState([]);
    const [dateWiseleads, setDateWiseLeads] = useState([]);
    const [selectedDate, setSelectedDate] = useState("")

    const [search, setSearch] = useState({
        project: '',
    });
    const [error, setError] = useState('');

    // Pagenation for Leads
    const [currentPage, setCurrentPage] = useState(1);
    const [totalRecords, setTotalRecords] = useState(0);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [totalPages, setTotalPages] = useState(0);

    const getAssignedProjects = async () => {
        setLoading(true)
        const user_data = {
            id: data?.id,
            user_type: data?.role_id
        }
        try {
            let res = await masterClient.post(`/get-user-projects`, user_data)

            if (res?.data?.status && res?.data?.data.length > 0) {
                setAssignedProjects(res?.data?.data);
            }
        } catch (err) {
            console.error(`Error getting Projects ${err}`)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (data && Object.keys(data).length > 0 && data.franchise_id) {
            getAssignedProjects();
            getLeads(1, itemsPerPage, search)
        }
    }, [data])

    useEffect(() => {
        getLeads(1, itemsPerPage, search)
    }, [search])


    const getLeads = async (page = 1, limit = 10, searchParams = {}) => {

        setLoading(true);
        setError('');

        try {
            const searchFilters = {};
            if (searchParams.project && searchParams.project !== 'default') {
                searchFilters.project = searchParams.project;
            }

            let payload = {
                "user_id": id,
                "user_type": 34,
                "month": month,
                "search": searchFilters
            };

            let res = await masterClient.post(`/leads/user-leads/monthly`, payload);

            if (res?.data?.status) {
                const data = res?.data?.data;
                setDayWiseStats(data.dailyStats || []);
                setError('');
            } else {
                // Handle case where status is false or no data
                setDayWiseStats([]);
                setError('No leads found for the selected criteria');
            }
        } catch (err) {
            console.error(`Error getting leads =>`, err);
            setDayWiseStats([]);
            // Set appropriate error message
            if (err.response?.status === 422) {
                setError('Invalid search parameters. Please check your input.');
            } else if (err.response?.status === 500) {
                setError('Server error. Please try again later.');
            } else {
                setError('Error fetching leads. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    // Get project name by ID
    const getProjectName = (projectId) => {
        const project = assignedProjects.find(p => p.project_id === projectId);
        return project ? project.projectName : `Project ID: ${projectId}`;
    };

    // Format date for display
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        try {
            return new Date(dateString).toLocaleDateString('en-IN', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });
        } catch (error) {
            return 'Invalid Date';
        }
    };

    // pagenate funtions
    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages && page !== currentPage) {
            const projectIds = assignedProjects.map(el => el.project_id);
            getLeads(page, itemsPerPage, search);
        }
    };

    const handleItemsPerPageChange = (e) => {
        const newLimit = parseInt(e.target.value);
        setItemsPerPage(newLimit);
        setCurrentPage(1);

        getLeads(1, newLimit, search);
    };

    const getDateLeads = async (date, page = 1, limit = 10, searchParams = {}) => {
        const formatedDate = moment(date).format('DD-MM-YYYY')
        setLoading(true);
        setError('');

        setSelectedDate(formatedDate)

        try {
            const searchFilters = {};
            if (searchParams.project && searchParams.project !== 'default') {
                searchFilters.project = searchParams.project;
            }

            let payload = {
                "user_id": id,
                "user_type": data?.role_id,
                "date": formatedDate,
                "page": page,
                "limit": limit,
                "search": searchFilters
            };

            let res = await masterClient.post(`/leads/user-leads/date`, payload);

            if (res?.data?.status) {
                const data = res?.data?.data;
                setDateWiseLeads(data.leads || []);
                setTotalRecords(data?.pagination?.totalRecords || 0);
                setTotalPages(data?.pagination?.totalPages || 0);
                setCurrentPage(data?.pagination?.currentPage || page);
                setError('');
            } else {
                // Handle case where status is false or no data
                setDateWiseLeads([]);
                setError('No leads found for the selected criteria');
            }
        } catch (err) {
            console.error(`Error getting leads =>`, err);
            setDateWiseLeads([]);
            // Set appropriate error message
            if (err.response?.status === 422) {
                setError('Invalid search parameters. Please check your input.');
            } else if (err.response?.status === 500) {
                setError('Server error. Please try again later.');
            } else {
                setError('Error fetching leads. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    }

    if (loading) return <Loader />

    const formatMonthYear = (dateStr) => {
        const date = new Date(`${dateStr}-01`);
        const options = { year: 'numeric', month: 'long' };
        return date.toLocaleDateString('en-US', options);
    }

    function getDaysInMonth(dateStr) {
        const [year, month] = dateStr.split('-').map(Number);
        return new Date(year, month, 0).getDate();
    }

    return (
        <div className="p-4">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div className="card">
                        <div className="card-header py-3">
                            <h3 className="card-title">Month : {formatMonthYear(month)}</h3>
                            <div>
                                <div className="form-floating">
                                    <select class="form-select"
                                        onChange={(e) => setSearch((prev) => ({ ...prev, project: e.target.value }))}>
                                        <option value="default">Projects</option>
                                        {assignedProjects.map((ele, idx) =>
                                            <option key={idx} value={ele.project_id}>{ele.projectName}</option>
                                        )}
                                    </select>
                                </div>
                            </div>
                            <button class="btn color-white">Days: {getDaysInMonth(month)}</button>
                        </div>
                        <div className="card-body">
                            <div className="table-responsive-md">
                                <table className="table text-nowrap mb-0">
                                    <thead>
                                        <tr>
                                            <th>Date</th>
                                            <th className='text-center'>Lead Received</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {dayWiseStats.map((ele, idx) =>
                                            <tr key={idx}>
                                                <td>{ele.date}</td>
                                                <td className='text-center' onClick={() => getDateLeads(ele.date)}>{ele.count}</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
                <br />
                <div className="col-md-12">
                    <div className="card">
                        <div className="card-header py-3">
                            <h3 className="card-title">{selectedDate}</h3>
                            <button class="btn color-white">Lead Count: {dateWiseleads.length ? dateWiseleads.length : 0}</button>
                        </div>
                        <div className="card-body">
                            <div className="table-responsive-md">
                                <table className="table text-nowrap mb-0">
                                    <thead>
                                        <tr>
                                            <th>S.No</th>
                                            <th>Customer Name</th>
                                            <th>Email ID</th>
                                            <th>Project</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {dateWiseleads.length > 0 ?
                                            dateWiseleads.map((ele, idx) =>
                                                <tr key={idx}>
                                                    <td>{idx + 1}</td>
                                                    <td>
                                                        <span class="fw-medium">{ele.customer_name}</span>
                                                    </td>
                                                    <td>
                                                        <a href="tel:sri.saj499@gmail.com" class="text-decoration-none">
                                                            {ele.email_id}
                                                        </a>
                                                    </td>
                                                    <td>
                                                        <span class="text-dark">{getProjectName(ele.project_id)}</span>
                                                    </td>
                                                </tr>
                                            )
                                            :
                                            <tr>
                                                <td colSpan={4} className='text-center'>No Leads Found </td>
                                            </tr>
                                        }
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MonthLeads;
