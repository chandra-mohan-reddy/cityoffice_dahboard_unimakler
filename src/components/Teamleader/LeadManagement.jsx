import { useEffect, useState } from 'react';
import { Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { masterClient } from '../../utils/httpClient';

const LeadManagement = ({ data }) => {

  const [loading, setLoading] = useState(false);
  const [assignedProjects, setAssignedProjects] = useState([]);

  const [leads, setLeads] = useState([]);
  const [filteredLeads, setFilteredLeads] = useState([])
  const [monthlyLeadStats, setMonthlyLeadsStats] = useState([]);
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
    if (data && Object.keys(data).length > 0 && data.id) {
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
        "id": data?.id,
        "user_type": data?.role_id,
        "page": page,
        "limit": limit,
        "search": searchFilters
      };

      let res = await masterClient.post(`/leads/user-leads`, payload);

      if (res?.data?.status) {
        const data = res?.data?.data;
        setLeads(data.leads || []);
        setFilteredLeads(data.leads || []);
        setTotalRecords(data?.pagination?.totalRecords || 0);
        setTotalPages(data?.pagination?.totalPages || 0);
        setCurrentPage(data?.pagination?.currentPage || page);
        setError('');
        setMonthlyLeadsStats(data?.monthlyLeadStats)
      } else {
        // Handle case where status is false or no data
        setLeads([]);
        setFilteredLeads([]);
        setTotalRecords(0);
        setTotalPages(0);
        setCurrentPage(1);
        setError('No leads found for the selected criteria');
        setMonthlyLeadsStats([
          { "month": "January", "count": 0 },
          { "month": "February", "count": 0 },
          { "month": "March", "count": 0 },
          { "month": "April", "count": 0 },
          { "month": "May", "count": 0 },
          { "month": "June", "count": 0 },
          { "month": "July", "count": 0 },
          { "month": "August", "count": 0 },
          { "month": "September", "count": 0 },
          { "month": "October", "count": 0 },
          { "month": "November", "count": 0 },
          { "month": "December", "count": 0 }
        ])
      }
    } catch (err) {
      console.error(`Error getting leads =>`, err);
      setLeads([]);
      setFilteredLeads([]);
      setTotalRecords(0);
      setTotalPages(0);
      setCurrentPage(1);
      setMonthlyLeadsStats([
        { "month": "January", "count": 0 },
        { "month": "February", "count": 0 },
        { "month": "March", "count": 0 },
        { "month": "April", "count": 0 },
        { "month": "May", "count": 0 },
        { "month": "June", "count": 0 },
        { "month": "July", "count": 0 },
        { "month": "August", "count": 0 },
        { "month": "September", "count": 0 },
        { "month": "October", "count": 0 },
        { "month": "November", "count": 0 },
        { "month": "December", "count": 0 }
      ])

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

  function getYearMonthString(monthName, year = 2025) {
    const monthNumber = new Date(`${monthName} 1, ${year}`).getMonth() + 1;
    if (isNaN(monthNumber)) return null;
    const paddedMonth = monthNumber.toString().padStart(2, '0');
    return `${year}-${paddedMonth}`;
  }


  return (
    <div className="p-4">
      <div className="row justify-content-center">
        <div className="col-md-12">
          <div className="card">
            <div className="card-header py-3">
              <h3 className="card-title">Leads Management</h3>
              <div>
                <div className="form-floating">
                  <select class="form-select" onChange={(e) => setSearch((prev) => ({ ...prev, project: e.target.value }))}>
                    <option value="default">Projects</option>
                    {assignedProjects.map((ele, idx) =>
                      <option key={idx} value={ele.project_id}>{ele.projectName}</option>
                    )}
                  </select>
                </div>
              </div>
              <button class="btn color-white">Lead Received: {totalRecords}</button>
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
                          <td>{((currentPage - 1) * itemsPerPage) + index + 1}</td>
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
                              >
                                <i className="mdi mdi-eye"></i>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={7} className="text-center py-4">
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
        <br />
        <div className="col-md-6">
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

              <button class="btn color-white">Lead Count: {totalRecords}</button>
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
                    {monthlyLeadStats.map((leadCount, idx) => (
                      <tr key={idx}>
                        <td>{idx + 1}</td>
                        <td>
                          <span class="fw-medium">{leadCount.month}</span>
                        </td>
                        <td>
                          <span class="text-dark">
                            <Link to={`/teamLeader/${data?.id}/leads/${getYearMonthString(leadCount.month)}`}>{leadCount.count}</Link>
                          </span>
                        </td>
                      </tr>
                    ))}
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

export default LeadManagement;
