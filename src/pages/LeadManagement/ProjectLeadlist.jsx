import React, { useState, useEffect, useCallback, useMemo } from 'react'
import Loader from '../../components/common/Loader'
import { masterClient } from '../../utils/httpClient.js'
import { useSelector } from 'react-redux'
import Modal from 'react-bootstrap/Modal';
import { Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const ProjectLeadlist = () => {
  const userData = useSelector((state) => state.user.userData);
  const [leads, setLeads] = useState([]);
  const [filteredLeads, setFilteredLeads] = useState([])
  const [loading, setLoading] = useState(false);
  const [assignedProjects, setAssignedProjects] = useState([]);
  const [search, setSearch] = useState({
    customerName: '',
    customerMobile: '',
    project: '',
    fromdate: '',
    todate: ''
  });
  const [error, setError] = useState('');
  const [franchises, setFranchises] = useState([]);

  const [showLeadHistory, setShowLeadHistory] = useState(false)
  const [leadHistory, setLeadsHistory] = useState([]);

  // close leads history pop up
  const handleClose = () => setShowLeadHistory(false)

  // pagenation for leads history
  const [leadsHistorycurrentPage, leadsHistorysetCurrentPage] = useState(1);
  const [leadsHistorytotalRecords, leadsHistorysetTotalRecords] = useState(0);
  const [leadsHistoryitemsPerPage, leadsHistorysetItemsPerPage] = useState(10);
  const [leadsHistorytotalPages, leadsHistorysetTotalPages] = useState(0);

  // Pagenation for Leads
  const [currentPage, setCurrentPage] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(0);


  // Memoized project options to prevent unnecessary re-renders
  const projectOptions = useMemo(() => {
    return assignedProjects.map(project => ({
      value: project.project_id,
      label: project.projectName
    }));
  }, [assignedProjects]);

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

  // Get project name by ID
  const getProjectName = (projectId) => {
    const project = assignedProjects.find(p => p.project_id === projectId);
    return project ? project.projectName : `Project ID: ${projectId}`;
  };


  const getLeads = async (projectIds, page = 1, limit = 10, searchParams = {}) => {
    if (!projectIds || projectIds.length === 0) return;

    setLoading(true);
    setError('');

    try {
      // Prepare search object - only include non-empty values
      const searchFilters = {};
      if (searchParams.customerName?.trim()) {
        searchFilters.customerName = searchParams.customerName.trim();
      }
      if (searchParams.customerMobile?.trim()) {
        searchFilters.customerMobile = searchParams.customerMobile.trim();
      }
      if (searchParams.project && searchParams.project !== 'default') {
        searchFilters.project = searchParams.project;
      }
      if (searchParams.fromdate) {
        searchFilters.fromdate = searchParams.fromdate;
      }
      if (searchParams.todate) {
        searchFilters.todate = searchParams.todate;
      }

      let payload = {
        "projectIds": projectIds,
        "page": page,
        "limit": limit,
        "search": searchFilters
      };

      let res = await masterClient.post(`franchiseLeads`, payload);

      if (res?.data?.status) {
        const data = res?.data?.data;
        setLeads(data.leads || []);
        setFilteredLeads(data.leads || []);
        setTotalRecords(data?.pagination?.totalRecords || 0);
        setTotalPages(data?.pagination?.totalPages || 0);
        setCurrentPage(data?.pagination?.currentPage || page);
        setError('');
      } else {
        // Handle case where status is false or no data
        setLeads([]);
        setFilteredLeads([]);
        setTotalRecords(0);
        setTotalPages(0);
        setCurrentPage(1);
        setError('No leads found for the selected criteria');
      }
    } catch (err) {
      console.error(`Error getting leads =>`, err);
      setLeads([]);
      setFilteredLeads([]);
      setTotalRecords(0);
      setTotalPages(0);
      setCurrentPage(1);

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

  // Updated getAssignedProjects function
  const getAssignedProjects = async () => {
    if (!userData?.id) return;

    setLoading(true);
    setError('');

    try {
      let res = await masterClient.post(`/user-projects`);

      if (res?.data?.status) {
        const projectsData = res?.data?.data || [];
        setAssignedProjects(projectsData);

        const projectIds = projectsData.map(el => el.project_id);
        if (projectIds.length > 0) {
          // Load first page with current search params
          await getLeads(projectIds, 1, itemsPerPage, search);
        } else {
          setError('No projects assigned to this user');
        }
      } else {
        setError('No projects assigned to this user');
      }
    } catch (err) {
      console.error(`Error getting Projects ${err}`);
      setError('Error fetching assigned projects. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userData) {
      getAssignedProjects();
    }
  }, [userData])

  const handleSearch = useCallback((e) => {
    const { name, value } = e.target;
    setSearch(prev => ({
      ...prev,
      [name]: value
    }));
  }, []);

  const validateDateRange = (fromDate, toDate) => {
    if (fromDate && toDate) {
      const from = new Date(fromDate);
      const to = new Date(toDate);
      if (from > to) {
        return 'From date cannot be later than To date';
      }
    }
    return null;
  };

  const searchLeads = async (e) => {
    e.preventDefault();

    // Validate date range on frontend
    if (search.fromdate && search.todate) {
      const fromDate = new Date(search.fromdate);
      const toDate = new Date(search.todate);
      if (fromDate > toDate) {
        setError('From date cannot be later than To date');
        return;
      }
    }

    const projectIds = assignedProjects.map(el => el.project_id);
    if (projectIds.length === 0) {
      setError('No projects available for search');
      return;
    }

    // Reset to first page when searching
    setCurrentPage(1);

    // Call backend search with current search params
    await getLeads(projectIds, 1, itemsPerPage, search);
  };

  // Updated clear search function
  const clearSearch = () => {
    const clearedSearch = {
      customerName: '',
      customerMobile: '',
      project: '',
      fromdate: '',
      todate: ''
    };

    setSearch(clearedSearch);
    setError('');
    setCurrentPage(1);

    // Reload with cleared search
    const projectIds = assignedProjects.map(el => el.project_id);
    getLeads(projectIds, 1, itemsPerPage, clearedSearch);
  };

  // Updated refresh function
  const refreshLeads = () => {
    setCurrentPage(1);
    getAssignedProjects();
  };

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.key === 'Enter') {
        searchLeads(e);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [searchLeads]);


  // Updated pagination handler for leads history
  const handlePageChangeleadsHistory = (page) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      getLeadsHistory(1, itemsPerPage)
    }
  };

  // Updated pagination handler for leads
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      const projectIds = assignedProjects.map(el => el.project_id);
      getLeads(projectIds, page, itemsPerPage, search);
    }
  };

  // Updated items per page handler leads history
  const handleItemsPerPageChangeleadsHistory = (e) => {
    const newLimit = parseInt(e.target.value);
    setItemsPerPage(newLimit);
    setCurrentPage(1);
    getLeadsHistory(1, newLimit)
  };

  // Updated items per page handler leads
  const handleItemsPerPageChange = (e) => {
    const newLimit = parseInt(e.target.value);
    setItemsPerPage(newLimit);
    setCurrentPage(1);

    const projectIds = assignedProjects.map(el => el.project_id);
    getLeads(projectIds, 1, newLimit, search);
  };

  const getLeadsHistory = async (leadId, page = 1, limit = 10) => {
    setLoading(true)
    try {
      let payload = {
        "page": page,
        "limit": limit,
      };
      const res = await masterClient.post(`/leads/history/${leadId}`, payload);
      setShowLeadHistory(true)
      if (res?.data?.status) {
        const data = res?.data?.data;
        setLeadsHistory(data?.leads_history)
        leadsHistorysetTotalRecords(data?.pagination?.totalRecords || 0);
        leadsHistorysetTotalPages(data?.pagination?.totalPages || 0);
        leadsHistorysetCurrentPage(data?.pagination?.currentPage || page);
      } else {
        setLeadsHistory([]);
        leadsHistorysetTotalRecords(0);
        leadsHistorysetTotalPages(0);
        leadsHistorysetCurrentPage(1);
      }
    } catch (error) {
      console.error(`Error fetching lead History ${error}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {loading && <Loader />}
      <div className="main-content">
        <div className="page-content">
          <div className="container-fluid">
            <div className="row">
              <div className="col-12">
                <div className="page-title-box d-flex align-items-center justify-content-between">
                  <div className="page-title-right">
                    <h3 className="m-0 font-bold">Leads List</h3>
                  </div>
                  <div className="page-title-right">
                    <button
                      className="btn btn-outline-primary btn-sm"
                      onClick={refreshLeads}
                      disabled={loading}
                    >
                      <i className="mdi mdi-refresh"></i> Refresh
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {error && (
              <div className="row">
                <div className="col-12">
                  <div className="alert alert-danger alert-dismissible fade show" role="alert">
                    {error}
                    <button type="button" className="btn-close" onClick={() => setError('')}></button>
                  </div>
                </div>
              </div>
            )}

            <div className="row justify-content-center">
              <div className="col-md-11">
                <div className="cardd mb-4 cardd-input">
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <h3 className="card-title mb-0">Search Leads</h3>
                      {/* <small className="text-muted">Press Ctrl+Enter to search</small> */}
                    </div>

                    <form className="custom-validation" onSubmit={searchLeads}>
                      <div className="row align-items-center">
                        <div className="col-md-3">
                          <div className="form-floating mb-3">
                            <input
                              type="text"
                              className="form-control"
                              name="customerName"
                              placeholder="Enter customer name"
                              value={search.customerName}
                              onChange={handleSearch}
                              maxLength={50}
                            />
                            <label className="fw-normal">Customer Name</label>
                          </div>
                        </div>

                        <div className="col-md-3">
                          <div className="form-floating mb-3">
                            <input
                              type="tel"
                              className="form-control"
                              name="customerMobile"
                              placeholder="Enter mobile number"
                              value={search.customerMobile}
                              onChange={handleSearch}
                              maxLength={15}
                              pattern="[0-9]*"
                            />
                            <label className="fw-normal">Mobile</label>
                          </div>
                        </div>

                        <div className="col-md-3">
                          <div className="form-floating mb-3">
                            <select
                              className="form-select"
                              name="project"
                              value={search.project}
                              onChange={handleSearch}
                            >
                              <option value="">All Projects</option>
                              {projectOptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                  {option.label}
                                </option>
                              ))}
                            </select>
                            <label className="fw-normal">Project</label>
                          </div>
                        </div>

                        {/* <div className="col-md-3">
                          <div className="form-floating mb-3">
                            <select className="form-select" name="subProperty" disabled>
                              <option value="">Select Franchise</option>
                            </select>
                            <label className="fw-normal">Franchise (Coming Soon)</label>
                          </div>
                        </div> */}

                        <div className="col-md-3 mt-0">
                        </div>
                        <div className="col-md-3 mt-3">
                          <div className="form-floating">
                            <input
                              type="date"
                              id="from-date"
                              className="form-control"
                              name="fromdate"
                              value={search.fromdate}
                              onChange={handleSearch}
                              max={new Date().toISOString().split('T')[0]}
                            />
                            <label htmlFor="from-date" className="fw-normal">From Date</label>
                          </div>
                        </div>

                        <div className="col-md-3 mt-3">
                          <div className="form-floating">
                            <input
                              type="date"
                              id="to-date"
                              className="form-control"
                              name="todate"
                              value={search.todate}
                              onChange={handleSearch}
                              max={new Date().toISOString().split('T')[0]}
                              min={search.fromdate}
                            />
                            <label htmlFor="to-date" className="fw-normal">To Date</label>
                          </div>
                        </div>

                        <div className="col-md-3 mt-3">
                          <div className="d-flex gap-2">
                            <button
                              className="btn btn-primary"
                              type="submit"
                              disabled={loading}
                            >
                              <i className="mdi mdi-magnify"></i> Search
                            </button>
                            {/* <button
                              className="btn btn-outline-secondary"
                              type="button"
                              onClick={clearSearch}
                              disabled={loading}
                            >
                              <i className="mdi mdi-close"></i> Clear
                            </button> */}
                          </div>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>

            <div className="row justify-content-center">
              <div className="col-md-12">
                <div className="card">
                  <div className="card-header d-flex justify-content-between align-items-center">
                    <h3 className="card-title mb-0">Leads List</h3>
                  </div>
                  <div className="card-body">
                    <div className="table-responsive">
                      <table className="table table-striped table-hover text-nowrap mb-0">
                        <thead className="table-light">
                          <tr>
                            <th>S.No</th>
                            <th>Customer Name</th>
                            <th>Mobile Number</th>
                            <th>Email ID</th>
                            <th>Project</th>
                            <th>Received On</th>
                            <th>View</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredLeads.length > 0 ? (
                            filteredLeads.map((lead, index) => (
                              <tr key={`${lead.id || index}-${lead.mobile_number}`}>
                                <td>{index + 1}</td>
                                <td>
                                  <span className="fw-medium">{lead.customer_name || 'N/A'}</span>
                                </td>
                                <td>
                                  <a href={`tel:${lead.mobile_number}`} className="text-decoration-none">
                                    {lead.mobile_number || 'N/A'}
                                  </a>
                                </td>
                                <td>
                                  <a href={`tel:${lead.email_id}`} className="text-decoration-none">
                                    {lead.email_id || 'N/A'}
                                  </a>
                                </td>
                                <td>
                                  <span className="text-dark">
                                    {getProjectName(lead.project_id)}
                                  </span>
                                </td>
                                <td>{formatDate(lead.created_at || lead.CreatedDate)}</td>
                                <td>
                                  <div className="btn-group" role="group">
                                    <button
                                      className="btn btn-sm btn-outline-primary"
                                      title="View Details"
                                      onClick={() => getLeadsHistory(lead.id)}
                                    >
                                      <i className="mdi mdi-eye"></i>
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan={6} className="text-center py-4">
                                <div className="d-flex flex-column align-items-center">
                                  <i className="mdi mdi-database-search mdi-48px text-muted mb-2"></i>
                                  <p className="text-muted mb-0">
                                    {leads.length === 0 ? 'No leads available' : 'No leads match your search criteria'}
                                  </p>
                                </div>
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                    {filteredLeads.length > 0 && (
                      <div className="row mt-5 pt-3">
                        <div className="col-sm-12 col-md-5">
                          <div className="d-flex align-items-center">
                            <span className="me-2">Show</span>
                            <select
                              className="form-select form-select-sm"
                              style={{ width: 'auto' }}
                              value={itemsPerPage}
                              onChange={handleItemsPerPageChange}
                            >
                              <option value={10}>10</option>
                              <option value={25}>25</option>
                              <option value={50}>50</option>
                              <option value={100}>100</option>
                            </select>
                            <span className="ms-2">entries</span>
                          </div>
                        </div>
                        <div className="col-sm-12 col-md-7">
                          <div className="d-flex justify-content-end align-items-center">
                            <span className="me-3">
                              Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage)} of {totalRecords} entries
                            </span>
                            <nav>
                              <ul className="pagination pagination-sm mb-0">
                                <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                                  <button
                                    className="page-link"
                                    onClick={() => handlePageChange(currentPage - 1)}
                                    disabled={currentPage === 1}
                                  >
                                    Previous
                                  </button>
                                </li>

                                {[...Array(totalPages)].map((_, index) => {
                                  const page = index + 1;
                                  if (page === 1 || page === totalPages || (page >= currentPage - 2 && page <= currentPage + 2)) {
                                    return (
                                      <li key={page} className={`page-item ${currentPage === page ? 'active' : ''}`}>
                                        <button
                                          className="page-link"
                                          onClick={() => handlePageChange(page)}
                                        >
                                          {page}
                                        </button>
                                      </li>
                                    );
                                  } else if (page === currentPage - 3 || page === currentPage + 3) {
                                    return <li key={page} className="page-item disabled"><span className="page-link">...</span></li>;
                                  }
                                  return null;
                                })}

                                <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                                  <button
                                    className="page-link"
                                    onClick={() => handlePageChange(currentPage + 1)}
                                    disabled={currentPage === totalPages}
                                  >
                                    Next
                                  </button>
                                </li>
                              </ul>
                            </nav>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="col-md-6 mt-4">
                <div className="card">
                  <div className="card-header py-3">
                    <h3 className="card-title">Monthly</h3>
                    <div>
                      <div className="form-floating">
                        <select class="form-select">
                          <option value="">Projects</option>
                          <option value="31">Vision Arsha</option>
                          <option value="125">Green Alpha</option>
                          <option value="126">Amogha</option>
                        </select>

                      </div>
                    </div>

                    <button class="btn color-white">Lead Count: 50000</button>
                  </div>
                  <div className="card-body">
                    <div className="table-responsive-md">
                      <table className="table text-nowrap mb-0">
                        <thead>
                          <tr>
                            <th>S.No</th>
                            <th>Month</th>
                            <th>Count</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td>1</td>
                            <td>
                              <span class="fw-medium">January</span>
                            </td>
                            {/* <td>
                        <a href="tel:8297318850" class="text-decoration-none">
                          8297318850
                        </a>
                      </td> */}

                            <td>
                              <span class="text-dark"><Link to="/leads/projectleadlistmonth">30</Link></span>
                            </td>

                          </tr>
                          <tr>
                            <td>2</td>
                            <td>
                              <span class="fw-medium">February</span>
                            </td>
                            {/* <td>
                        <a href="tel:8297318850" class="text-decoration-none">
                          8297318850
                        </a>
                      </td> */}

                            <td>
                              <span class="text-dark">30</span>
                            </td>

                          </tr>
                          <tr>
                            <td>3</td>
                            <td>
                              <span class="fw-medium">March</span>
                            </td>
                            {/* <td>
                        <a href="tel:8297318850" class="text-decoration-none">
                          8297318850
                        </a>
                      </td> */}

                            <td>
                              <span class="text-dark">30</span>
                            </td>

                          </tr>
                          <tr>
                            <td>4</td>
                            <td>
                              <span class="fw-medium">April</span>
                            </td>
                            {/* <td>
                        <a href="tel:8297318850" class="text-decoration-none">
                          8297318850
                        </a>
                      </td> */}

                            <td>
                              <span class="text-dark">30</span>
                            </td>
                          </tr>
                          <tr>
                            <td>5</td>
                            <td>
                              <span class="fw-medium">May</span>
                            </td>
                            {/* <td>
                        <a href="tel:8297318850" class="text-decoration-none">
                          8297318850
                        </a>
                      </td> */}

                            <td>
                              <span class="text-dark">30</span>
                            </td>
                          </tr>
                          <tr>
                            <td>6</td>
                            <td>
                              <span class="fw-medium">June</span>
                            </td>
                            {/* <td>
                        <a href="tel:8297318850" class="text-decoration-none">
                          8297318850
                        </a>
                      </td> */}

                            <td>
                              <span class="text-dark">30</span>
                            </td>

                          </tr>
                          <tr>
                            <td>7</td>
                            <td>
                              <span class="fw-medium">July</span>
                            </td>
                            {/* <td>
                        <a href="tel:8297318850" class="text-decoration-none">
                          8297318850
                        </a>
                      </td> */}

                            <td>
                              <span class="text-dark">30</span>
                            </td>


                          </tr>
                          <tr>
                            <td>8</td>
                            <td>
                              <span class="fw-medium">August</span>
                            </td>
                            {/* <td>
                        <a href="tel:8297318850" class="text-decoration-none">
                          8297318850
                        </a>
                      </td> */}

                            <td>
                              <span class="text-dark">30</span>
                            </td>


                          </tr>
                          <tr>
                            <td>8</td>
                            <td>
                              <span class="fw-medium">September</span>
                            </td>
                            {/* <td>
                        <a href="tel:8297318850" class="text-decoration-none">
                          8297318850
                        </a>
                      </td> */}

                            <td>
                              <span class="text-dark">30</span>
                            </td>


                          </tr>
                          <tr>
                            <td>10</td>
                            <td>
                              <span class="fw-medium">October</span>
                            </td>
                            {/* <td>
                        <a href="tel:8297318850" class="text-decoration-none">
                          8297318850
                        </a>
                      </td> */}

                            <td>
                              <span class="text-dark">30</span>
                            </td>

                          </tr>
                          <tr>
                            <td>11</td>
                            <td>
                              <span class="fw-medium">November</span>
                            </td>
                            {/* <td>
                        <a href="tel:8297318850" class="text-decoration-none">
                          8297318850
                        </a>
                      </td> */}

                            <td>
                              <span class="text-dark">30</span>
                            </td>


                          </tr>
                          <tr>
                            <td>12</td>
                            <td>
                              <span class="fw-medium">December</span>
                            </td>
                            {/* <td>
                        <a href="tel:8297318850" class="text-decoration-none">
                          8297318850
                        </a>
                      </td> */}

                            <td>
                              <span class="text-dark">30</span>
                            </td>


                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Modal
        show={showLeadHistory}
        onHide={handleClose}
        size="lg"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Lead History</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="row justify-content-center">
            <div className="col-md-12">
              <div className="card">
                <div className="card-header d-flex justify-content-between align-items-center">
                  <h3 className="card-title mb-0">Lead History</h3>
                  <h3 className="card-title mb-0">Lead History</h3>
                </div>
                <div className="card-body">
                  <div className="table-responsive">
                    <table className="table table-striped table-hover text-nowrap mb-0">
                      <thead className="table-light">
                        <tr>
                          <th>S.No</th>
                          <th>Completed Status</th>
                          <th>Future Status</th>
                          <th>Future Date</th>
                          {/* <th>Project</th> */}
                          <th>Updated On</th>
                          <th>Comments</th>
                        </tr>
                      </thead>
                      <tbody>
                        {leadHistory.length > 0 ? (
                          leadHistory.map((lead, index) => (
                            <tr key={`${lead.id || index}-${lead.mobile_number}`}>
                              <td>{index + 1}</td>
                              <td>
                                <span className="fw-medium">{lead.completedStatus || 'N/A'}</span>
                              </td>
                              <td>
                                <span className="fw-medium">{lead.futureStatus || 'N/A'}</span>
                              </td>
                              <td>{formatDate(lead.FutureStatusDate)}</td>
                              {/* <td>
                                <span className="badge bg-info text-dark">
                                  {getProjectName(lead.ProjectId)}
                                </span>
                              </td> */}
                              <td>{formatDate(lead.CreatedDate)}</td>
                              <td className='tble_last'><p class="mb-0">{(lead.Comments)}</p></td>
                              {/* <td>
                              </td> */}
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={6} className="text-center py-4">
                              <div className="d-flex flex-column align-items-center">
                                <i className="mdi mdi-database-search mdi-48px text-muted mb-2"></i>
                                <p className="text-muted mb-0">
                                  {leads.length === 0 ? 'No History available' : 'No leads match your search criteria'}
                                </p>
                              </div>
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                  {leadHistory.length > 0 && (
                    <div className="row mt-5 pt-3">
                      <div className="col-sm-12 col-md-5">
                        <div className="d-flex align-items-center">
                          <span className="me-2">Show</span>
                          <select
                            className="form-select form-select-sm"
                            style={{ width: 'auto' }}
                            value={itemsPerPage}
                            onChange={handleItemsPerPageChangeleadsHistory}
                          >
                            <option value={10}>10</option>
                            <option value={25}>25</option>
                            <option value={50}>50</option>
                            <option value={100}>100</option>
                          </select>
                          <span className="ms-2">entries</span>
                        </div>
                      </div>
                      <div className="col-sm-12 col-md-7">
                        <div className="d-flex justify-content-end align-items-center">
                          <span className="me-3">
                            Showing {((leadsHistorycurrentPage - 1) * leadsHistoryitemsPerPage) + 1} to {Math.min(leadsHistorycurrentPage * leadsHistoryitemsPerPage)} of {leadsHistorytotalRecords} entries
                          </span>
                          <nav>
                            <ul className="pagination pagination-sm mb-0">
                              <li className={`page-item ${leadsHistorycurrentPage === 1 ? 'disabled' : ''}`}>
                                <button
                                  className="page-link"
                                  onClick={() => handlePageChangeleadsHistory(leadsHistorycurrentPage - 1)}
                                  disabled={leadsHistorycurrentPage === 1}
                                >
                                  Previous
                                </button>
                              </li>

                              {[...Array(leadsHistorytotalPages)].map((_, index) => {
                                const page = index + 1;
                                if (page === 1 || page === leadsHistorytotalPages || (page >= leadsHistorycurrentPage - 2 && page <= currentPage + 2)) {
                                  return (
                                    <li key={page} className={`page-item ${leadsHistorycurrentPage === page ? 'active' : ''}`}>
                                      <button
                                        className="page-link"
                                        onClick={() => handlePageChangeleadsHistory(page)}
                                      >
                                        {page}
                                      </button>
                                    </li>
                                  );
                                } else if (page === leadsHistorycurrentPage - 3 || page === leadsHistorycurrentPage + 3) {
                                  return <li key={page} className="page-item disabled"><span className="page-link">...</span></li>;
                                }
                                return null;
                              })}

                              <li className={`page-item ${leadsHistorycurrentPage === leadsHistorytotalPages ? 'disabled' : ''}`}>
                                <button
                                  className="page-link"
                                  onClick={() => handlePageChangeleadsHistory(leadsHistorycurrentPage + 1)}
                                  disabled={leadsHistorycurrentPage === leadsHistorytotalPages}
                                >
                                  Next
                                </button>
                              </li>
                            </ul>
                          </nav>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  )
}

export default ProjectLeadlist