import React, { useState, useEffect, useCallback, useMemo } from 'react'
import Loader from '../../components/common/Loader.jsx'
import { masterClient } from '../../utils/httpClient.js'
import { useSelector } from 'react-redux'
import Modal from 'react-bootstrap/Modal';
import { Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const ProjectLeadlistmonth = () => {
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
      let res = await masterClient.get(`/users-projects-mapping/${userData.id}`);

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
     
      <div className="main-content">
        <div className="page-content">
          <div className="container-fluid">
             <div className="p-4">
      {/* <div className="row">
        <div className="col-12">
          <div className="page-title-box d-flex align-items-center justify-content-between">
            <div className="page-title-right">
              <h3>Assigned Project List</h3>
            </div>
          </div>
        </div>
      </div> */}
      {/* 
      <div className="row justify-content-center ">
        <div className="col-md-10">
          <div className="cardd mb-4 cardd-input">
         
            <div className="card-body">
              <h3 className="card-title mb-3">Search List</h3>
              <form className="custom-validation" action="#">
                <div className="row align-items-center">
                  <div className="col-md-2">
                    <div className="">
                      <lable>Country</lable>
                      <select className="form-select" name="subProperty" required>
                        <option value="default">Select Country</option>
                        <option value="">India</option>
                        <option value="">Dubai</option>
                      </select>
                    </div>
                  </div>
                  <div className="col-md-2">
                    <div className="">
                      <lable>State</lable>
                      <select className="form-select" name="subProperty" required>
                        <option value="default">Select State</option>
                        <option value="">India</option>
                        <option value="">Dubai</option>
                      </select>
                    </div>
                  </div>
                  <div className="col-md-2">
                    <div className="">
                      <lable>City</lable>
                      <select className="form-select" name="subProperty" required>
                        <option value="default">Select City</option>
                        <option value="">Hyderabad</option>
                        <option value="">Dubai</option>
                      </select>
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="">
                      <lable>Status</lable>
                      <select className="form-select" name="subProperty" required>
                        <option value="default">Active</option>
                        <option value="default">In sActive</option>
                      </select>
                    </div>
                  </div>
                  <div className="col-md-1">
                    <button className="btn btn-primary" type="submit">
                      Search
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div> */}

      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card">
            <div className="card-header py-3">
              <h3 className="card-title">Month : January 2025</h3>
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
              <button class="btn color-white">Days: 31</button>
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
                    <tr>
                      <td>01</td>
                      <td className='text-center'><Link to="#">30</Link></td>
                    </tr>
                    <tr>
                      <td>01</td>
                      <td className='text-center'><Link to="#">30</Link></td>
                    </tr>
                    <tr>
                      <td>01</td>
                      <td className='text-center'><Link to="#">30</Link></td>
                    </tr>
                    <tr>
                      <td>01</td>
                      <td className='text-center'><Link to="#">30</Link></td>
                    </tr>
                    <tr>
                      <td>01</td>
                      <td className='text-center'><Link to="#">30</Link></td>
                    </tr>
                    <tr>
                      <td>01</td>
                      <td className='text-center'><Link to="#">30</Link></td>
                    </tr>
                    <tr>
                      <td>01</td>
                      <td className='text-center'><Link to="#">30</Link></td>
                    </tr>
                    <tr>
                      <td>01</td>
                      <td className='text-center'><Link to="#">30</Link></td>
                    </tr>
                    <tr>
                      <td>01</td>
                      <td className='text-center'><Link to="#">30</Link></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          </div>
         <br />
         <div className="col-md-12 mt-4">
          <div className="card">
            <div className="card-header py-3">
              <h3 className="card-title">01-Jan-2025</h3>
          
              <button class="btn color-white">Lead Count: 30</button>
            </div>
            <div className="card-body">
              <div className="table-responsive-md">
                <table className="table text-nowrap mb-0">
             <thead>
                    <tr>
                      <th>S.No</th>
                      <th>Customer Name</th>
                      {/* <th>Mobile Number</th> */}
                      <th>Email ID</th>
                      <th>Project</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>1</td>
                      <td>
                        <span class="fw-medium">Srinivas</span>
                      </td>
                      {/* <td>
                        <a href="tel:8297318850" class="text-decoration-none">
                          8297318850
                        </a>
                      </td> */}
                      <td>
                        <a href="tel:sri.saj499@gmail.com" class="text-decoration-none">
                          sri.saj499@gmail.com
                        </a>
                      </td>
                      <td>
                        <span class="text-dark">Green Alpha</span>
                      </td>
                    </tr>
                    <tr>
                      <td>1</td>
                      <td>
                        <span class="fw-medium">Srinivas</span>
                      </td>
                      {/* <td>
                        <a href="tel:8297318850" class="text-decoration-none">
                          8297318850
                        </a>
                      </td> */}
                      <td>
                        <a href="tel:sri.saj499@gmail.com" class="text-decoration-none">
                          sri.saj499@gmail.com
                        </a>
                      </td>
                      <td>
                        <span class="text-dark">Green Alpha</span>
                      </td>
                      
                      
                    </tr>
                    <tr>
                      <td>1</td>
                      <td>
                        <span class="fw-medium">Srinivas</span>
                      </td>
                      {/* <td>
                        <a href="tel:8297318850" class="text-decoration-none">
                          8297318850
                        </a>
                      </td> */}
                      <td>
                        <a href="tel:sri.saj499@gmail.com" class="text-decoration-none">
                          sri.saj499@gmail.com
                        </a>
                      </td>
                      <td>
                        <span class="text-dark">Green Alpha</span>
                      </td>
                      
                      
                    </tr>
                    <tr>
                      <td>1</td>
                      <td>
                        <span class="fw-medium">Srinivas</span>
                      </td>
                      {/* <td>
                        <a href="tel:8297318850" class="text-decoration-none">
                          8297318850
                        </a>
                      </td> */}
                      <td>
                        <a href="tel:sri.saj499@gmail.com" class="text-decoration-none">
                          sri.saj499@gmail.com
                        </a>
                      </td>
                      <td>
                        <span class="text-dark">Green Alpha</span>
                      </td>
                      
                      
                    </tr>
                    <tr>
                      <td>1</td>
                      <td>
                        <span class="fw-medium">Srinivas</span>
                      </td>
                      {/* <td>
                        <a href="tel:8297318850" class="text-decoration-none">
                          8297318850
                        </a>
                      </td> */}
                      <td>
                        <a href="tel:sri.saj499@gmail.com" class="text-decoration-none">
                          sri.saj499@gmail.com
                        </a>
                      </td>
                      <td>
                        <span class="text-dark">Green Alpha</span>
                      </td>
                      
                      
                    </tr>
                    <tr>
                      <td>1</td>
                      <td>
                        <span class="fw-medium">Srinivas</span>
                      </td>
                      {/* <td>
                        <a href="tel:8297318850" class="text-decoration-none">
                          8297318850
                        </a>
                      </td> */}
                      <td>
                        <a href="tel:sri.saj499@gmail.com" class="text-decoration-none">
                          sri.saj499@gmail.com
                        </a>
                      </td>
                      <td>
                        <span class="text-dark">Green Alpha</span>
                      </td>
                      
                      
                    </tr>
                    <tr>
                      <td>1</td>
                      <td>
                        <span class="fw-medium">Srinivas</span>
                      </td>
                      {/* <td>
                        <a href="tel:8297318850" class="text-decoration-none">
                          8297318850
                        </a>
                      </td> */}
                      <td>
                        <a href="tel:sri.saj499@gmail.com" class="text-decoration-none">
                          sri.saj499@gmail.com
                        </a>
                      </td>
                      <td>
                        <span class="text-dark">Green Alpha</span>
                      </td>
                      
                      
                    </tr>
                    <tr>
                      <td>1</td>
                      <td>
                        <span class="fw-medium">Srinivas</span>
                      </td>
                      {/* <td>
                        <a href="tel:8297318850" class="text-decoration-none">
                          8297318850
                        </a>
                      </td> */}
                      <td>
                        <a href="tel:sri.saj499@gmail.com" class="text-decoration-none">
                          sri.saj499@gmail.com
                        </a>
                      </td>
                      <td>
                        <span class="text-dark">Green Alpha</span>
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
      </div>
  
    </>
  )
}

export default ProjectLeadlistmonth