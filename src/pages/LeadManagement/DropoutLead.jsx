import React, { useState, useEffect, useCallback, useMemo } from 'react'
import Loader from '../../components/common/Loader'
import { masterClient } from '../../utils/httpClient.js'
import { useSelector } from 'react-redux'
import Modal from 'react-bootstrap/Modal';
import { Button } from 'react-bootstrap';
const DropoutLead = () => {
  const userData = useSelector((state) => state.user.userData);
  const [leads, setLeads] = useState([]);
  const [filteredLeads, setFilteredLeads] = useState([])
  const [loading, setLoading] = useState(false);
  const [assignedProjects, setAssignedProjects] = useState([]);
  const [search, setSearch] = useState({
    fromDate: '',
    todate: '',
    customerName: '',
    customerMobile: '',
    city: '',
    location: '',
    franchise: '',
    project: '',
    property: '',
    source: '',
    reason: '',
    budget: '',
    loadEligibility: '',
    customerPreferredCity: '',
    customerPreferredLocation: '',
    customerPreferredProperty: '',
    otherReasons: ''
  });
  const [error, setError] = useState('');

  // dropOut reasons
  const [show, setShow] = useState(false)
  const [openedLead, setOpenedLead] = useState({})

  const openModal = (lead) => {
    setShow(true)
    setOpenedLead(lead)
  }

  const handleClose = () => setShow(false)

  // Pagenation 
  const [currentPage, setCurrentPage] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(0);

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
      if (searchParams.fromDate) {
        searchFilters.fromDate = searchParams.fromDate;
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

      let res = await masterClient.post(`leads/dropout`, payload);

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


  const searchLeads = async (e) => {
    e.preventDefault();

    // Validate date range on frontend
    if (search.fromDate && search.todate) {
      const fromDate = new Date(search.fromDate);
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
      fromDate: '',
      todate: '',
      customerName: '',
      customerMobile: '',
      city: '',
      location: '',
      franchise: '',
      project: '',
      property: '',
      source: '',
      reason: '',
      budget: '',
      loadEligibility: '',
      customerPreferredCity: '',
      customerPreferredLocation: '',
      customerPreferredProperty: '',
      otherReasons: ''
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


  // Updated pagination handler
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      const projectIds = assignedProjects.map(el => el.project_id);
      getLeads(projectIds, page, itemsPerPage, search);
    }
  };

  // Updated items per page handler
  const handleItemsPerPageChange = (e) => {
    const newLimit = parseInt(e.target.value);
    setItemsPerPage(newLimit);
    setCurrentPage(1);

    const projectIds = assignedProjects.map(el => el.project_id);
    getLeads(projectIds, 1, newLimit, search);
  };

  const getDaysBetweenDates = (startDate, endDate) => {
    const start = new Date(startDate)
    const end = new Date(endDate)

    if (isNaN(start) || isNaN(end)) {
      throw new Error("Invalid date(s) provided");
    }

    const timeDiff = Math.abs(end - start);

    const daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));

    return daysDiff
  }

  const performSearch = () => {
    console.log(search)
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
                    <h3 className="m-0 font-bold">Dropout Leads </h3>
                  </div>
                </div>
              </div>
            </div>

            <div className="row justify-content-center ">
              <div className="col-md-11">
                <div className="cardd mb-4 cardd-input">
                  <div className="card-body">
                    <form name="" id="search-form" className="search-form">
                      <div className="col-sm-12">
                        <div className="row">
                          <div className="col-sm-4 mt-4">
                            <div className="form-group">
                              <span className="button-checkbox">
                                <label className='m-3'>Project</label>
                                <input
                                  type="checkbox"
                                  className="hidden searchprojectcheck"
                                  name="searchprojectcheck"
                                  value="Project"
                                />
                              </span>{' '}
                              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                              <span className="button-checkbox">
                                <label className='m-3'>Project</label>
                                <input
                                  type="checkbox"
                                  className="hidden searchpropertycheck"
                                  name="searchprojectcheck"
                                  value="Property"
                                />
                              </span>{' '}
                            </div>
                          </div>
                          <div className="col-sm-4 mt-4">
                            <div className="form-group">
                              <span className="button-checkbox">
                                <button
                                  type="button"
                                  className="btn btn-xs btn-search btn-info active"
                                  data-color="info">
                                  Buy
                                </button>
                                <input
                                  type="checkbox"
                                  className="hidden searchbuy"
                                  name="searchbuy"
                                  value="Buy"
                                  checked=""
                                />
                              </span>{' '}
                              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                              <span className="button-checkbox">
                                <button
                                  type="button"
                                  className="btn btn-xs btn-search btn-warning active"
                                  data-color="warning">
                                  Rent
                                </button>
                                <input
                                  type="checkbox"
                                  className="hidden searchrent"
                                  name="searchrent"
                                  value="Rent"
                                  checked=""
                                />
                              </span>{' '}
                            </div>
                          </div>

                          <div className="col-sm-2">
                            <div className="form-group">
                              <label htmlFor="">From</label>
                              <input
                                type="date"
                                className="form-control searchfromdate"
                                placeholder="From Date"
                                name='formDate'
                                value={search?.formDate || ''}
                                onChange={handleSearch}
                              />
                            </div>
                          </div>
                          <div className="col-sm-2">
                            <div className="form-group">
                              <label htmlFor="">To</label>
                              <input
                                type="date"
                                className="form-control searchtodate"
                                placeholder="To Date"
                                name='todate'
                                value={search.todate || ''}
                                onChange={handleSearch}
                              />
                            </div>
                          </div>
                        </div>
                        <hr />

                        <div className="row mb-4">
                          <div className="col-md-12">
                            <h4 className="mb-4">Search Dropout Leads</h4>
                          </div>
                          <div className="col-sm-2">
                            <label className="control-label">By Person</label>
                          </div>
                          <div className="col-sm-2">
                            <div className="form-group">
                              <input
                                type="text"
                                className="form-control searchcustomername"
                                placeholder="Customer Name"
                                name="customerName"
                                value={search.customerName || ''}
                                onChange={handleSearch}
                              />
                            </div>
                          </div>
                          <div className="col-sm-2">
                            <div className="form-group">
                              <input
                                type="text"
                                className="form-control searchmobilenumber"
                                placeholder="Mobile"
                                name="customerMobile"
                                value={search.customerMobile || ''}
                                onChange={handleSearch}
                              />
                            </div>
                          </div>
                        </div>

                        <div className="row mb-4">
                          <div className="col-sm-2">
                            <label className="control-label">By Location </label>
                          </div>
                          <div className="col-sm-2">
                            <div className="form-group">
                              <select
                                className="form-control searchcity select2 select2-hidden-accessible"
                                data-select2-id="1"
                                tabindex="-1"
                                aria-hidden="true"
                                name="city"
                                onChange={handleSearch}
                              >
                                <option value="" data-select2-id="3">
                                  City
                                </option>
                                <option value="1">Bangalore</option>
                              </select>
                            </div>
                          </div>
                          <div className="col-sm-2">
                            <div className="form-group">
                              <select
                                className="form-control searchlocation select2 select2-hidden-accessible"
                                name="location"
                                data-select2-id="4"
                                tabindex="-1"
                                aria-hidden="true"
                                onClick={handleSearch}
                              >
                                <option value="" data-select2-id="6">
                                  Location
                                </option>
                              </select>
                            </div>
                          </div>
                          <div className="col-sm-2">
                            <div className="form-group">
                              <select
                                className="form-control searchfranchise select2 select2-hidden-accessible"
                                name="franchise"
                                data-select2-id="7"
                                tabindex="-1"
                                aria-hidden="true"
                                onClick={handleSearch}
                              >
                                <option value="" data-select2-id="9">
                                  Franchise
                                </option>
                                <option value="5">Kosher Proctor Head Office</option>
                                <option value="6">Mark Properties</option>
                                <option value="24">Narne Properties</option>
                              </select>
                            </div>
                          </div>
                          <div className="col-sm-2">
                            <div className="form-group">
                              <select
                                className="form-control searchproject select2 select2-hidden-accessible"
                                name="project"
                                data-select2-id="10"
                                tabindex="-1"
                                aria-hidden="true"
                                onClick={handleSearch}
                              >
                                <option value="" data-select2-id="12">
                                  Project
                                </option>
                                <option value="586">New</option>
                              </select>
                            </div>
                          </div>
                        </div>

                        <div className="row mb-4">
                          <div className="col-sm-2">
                            <label className="control-label">By Property type</label>
                          </div>
                          <div className="col-sm-2">
                            <div className="form-group">
                              <select
                                className="form-control searchpropertytype select2 select2-hidden-accessible"
                                name="property"
                                data-select2-id="13"
                                tabindex="-1"
                                aria-hidden="true"
                                onClick={handleSearch}
                              >
                                <option value="" data-select2-id="15">
                                  Property Type
                                </option>
                                <optgroup label="Residential">
                                  <option value="1:1:VILLA">Villa/House</option>
                                  <option value="1:2:APMT">Apartment</option>
                                  <option value="1:3:RPLOT">Residential Plot</option>
                                  <option value="1:5:STDA">Standalone Building</option>
                                  <option value="1:9:RLAND">Residential Land</option>
                                </optgroup>
                                <optgroup label="Commercial">
                                  <option value="2:6:OSPC">Office Space</option>
                                  <option value="2:7:RSPC">Retail Space</option>
                                  <option value="2:15:SIRM">Space In Retail Mall</option>
                                  <option value="2:16:SIIP">Space In IT Park</option>
                                  <option value="2:17:SHOP">Shop</option>
                                  <option value="2:8:SHOW">Showroom</option>
                                  <option value="2:10:HOTL">Hotel/Resort</option>
                                  <option value="2:18:CPLOT">Commercial Plot</option>
                                  <option value="2:12:WRHS">Warehouse</option>
                                  <option value="2:20:TMSR">Time Share</option>
                                  <option value="2:19:BNQH">Banquet Hall</option>
                                  <option value="2:5:STDA">Standalone Building</option>
                                  <option value="2:21:CLAND">Commercial Land</option>
                                </optgroup>
                                <optgroup label="Industrial">
                                  <option value="3:11:INDB">Industrial Building</option>
                                  <option value="3:22:IPLOT">Industrial Plot</option>
                                  <option value="3:23:ILAND">Industrial Land</option>
                                  <option value="3:12:WRHS">Warehouse</option>
                                  <option value="3:13:FACT">Factory</option>
                                </optgroup>
                                <optgroup label="Agriculture">
                                  <option value="4:4:ALAND">Agriculture Land</option>
                                  <option value="4:14:FAHS">Farm House</option>
                                </optgroup>
                              </select>
                            </div>
                          </div>
                        </div>

                        <div className="row mb-4">
                          <div className="col-sm-2">
                            <label className="control-label">By Source</label>
                          </div>
                          <div className="col-sm-2">
                            <div className="form-group">
                              <select
                                className="form-control searchsource select2 select2-hidden-accessible"
                                name="source"
                                data-select2-id="16"
                                tabindex="-1"
                                aria-hidden="true"
                                onClick={handleSearch}
                              >
                                <option value="" data-select2-id="18">
                                  Source
                                </option>
                                <option value="12">Twitter</option>
                              </select>
                            </div>
                          </div>
                        </div>

                        <div className="row mb-4">
                          <div className="col-sm-2">
                            <label className="control-label">By Reason</label>
                          </div>
                          <div className="col-sm-2">
                            <div className="form-group">
                              <select
                                className="form-control searchreason select2 select2-hidden-accessible"
                                name="reason"
                                data-select2-id="19"
                                tabindex="-1"
                                aria-hidden="true"
                                onClick={handleSearch}
                              >
                                <option value="" data-select2-id="21">
                                  Reason
                                </option>
                                <option value="1">Invalid Number</option>
                              </select>
                            </div>
                          </div>
                        </div>

                        <div>
                          <hr />
                          <div className="row">
                            <div className="col-md-12">
                              <h4 className="mb-4">Dropout by Customer Preferences</h4>
                            </div>
                          </div>
                          <h5 className='mb-3'><b>Budget / Loan Eligiblity Reason</b></h5>
                          <div className="row mb-4">
                            <div className="col-sm-3">
                              <label className="control-label">Customers Budget</label>
                            </div>
                            <div className="col-sm-2">
                              <div className="form-group">
                                <select
                                  className="form-control searchcpbudget"
                                  name="budget"
                                  onClick={handleSearch}
                                >
                                  <option value="">Budget</option>
                                  <option value="0-5 Lakhs">0-5 Lakhs</option>
                                </select>
                              </div>
                            </div>
                            <div className="col-sm-1 text-center">
                              <label>OR</label>
                            </div>
                            <div className="col-sm-2">
                              <div className="form-group">
                                <select
                                  className="form-control searchcploaneligibility"
                                  name="loadEligibility"
                                  onClick={handleSearch}
                                >
                                  <option value="">Loan Eligibilty</option>
                                </select>
                              </div>
                            </div>
                          </div>
                          <h5 className='mb-3'><b>Location miss match reason</b></h5>
                          <div className="row mb-4">
                            <div className="col-sm-3">
                              <label className="control-label">Customer's Location Preference</label>
                            </div>
                            <div className="col-sm-2">
                              <div className="form-group">
                                <select
                                  className="form-control searchcpcity select2 select2-hidden-accessible"
                                  name="customerPreferredCity"
                                  data-select2-id="22"
                                  tabindex="-1"
                                  aria-hidden="true"
                                  onClick={handleSearch}
                                >
                                  <option value="" data-select2-id="24">
                                    City
                                  </option>
                                  <option value="1">Bangalore</option>
                                  <option value="2">Vizag</option>
                                </select>
                              </div>
                            </div>
                            <div className="col-sm-2">
                              <div className="form-group">
                                <select
                                  className="form-control searchcplocation select2 select2-hidden-accessible"
                                  name="customerPreferredLocation"
                                  data-select2-id="25"
                                  tabindex="-1"
                                  aria-hidden="true"
                                  onClick={handleSearch}
                                >
                                  <option value="" data-select2-id="27">
                                    Location
                                  </option>
                                </select>
                              </div>
                            </div>
                          </div>
                          <h5 className='mb-3'><b>Possession miss match reason</b></h5>
                          <div className="row mb-4">
                            <div className="col-sm-3">
                              <label className="control-label">Customer's Possession Preferences</label>
                            </div>
                            <div className="col-sm-2">
                              <div className="form-group">
                                <select
                                  className="form-control searchcppossession select2 select2-hidden-accessible"
                                  name="customerPreferredProperty"
                                  data-select2-id="28"
                                  tabindex="-1"
                                  aria-hidden="true"
                                  onClick={handleSearch}
                                >
                                  <option value="" data-select2-id="30">
                                    Possession
                                  </option>
                                  <option value="1">Under Construction</option>
                                  <option value="2">Ready To Move</option>
                                  <option value="3">Launch</option>
                                  <option value="4">Pre Launch</option>
                                </select>
                              </div>
                            </div>
                          </div>
                          <h5 className='mb-3'><b>Propety type miss match</b></h5>
                          <div className="row mb-4">
                            <div className="col-sm-3">
                              <label className="control-label">Customer's Propety Type Preference</label>
                            </div>
                            <div className="col-sm-2">
                              <div className="form-group">
                                <select
                                  className="form-control searchcppropertytype select2 select2-hidden-accessible"
                                  id="searchcppropertytype"
                                  placeholder=""
                                  name="otherReasons"
                                  required=""
                                  data-select2-id="searchcppropertytype"
                                  tabindex="-1"
                                  aria-hidden="true"
                                  onClick={handleSearch}
                                >
                                  <option value="" data-select2-id="32">
                                    Property Type
                                  </option>

                                </select>

                              </div>
                            </div>
                            <div className="col-sm-2">
                              <div className="form-group">
                                <select
                                  className="form-control searchcptransactiontype select2 select2-hidden-accessible"
                                  name="searchcptransactiontype"
                                  data-select2-id="33"
                                  tabindex="-1"
                                  aria-hidden="true">
                                  <option value="" data-select2-id="35">
                                    Transaction Type
                                  </option>
                                  <option value="1"> New Property </option>
                                  <option value="2"> Re Sale </option>
                                </select>

                              </div>
                            </div>
                            <div className="col-sm-2">
                              <div className="form-group">
                                <select
                                  className="form-control searchcpcommunitytype select2 select2-hidden-accessible"
                                  name="searchcpcommunitytype"
                                  data-select2-id="36"
                                  tabindex="-1"
                                  aria-hidden="true">
                                  <option value="" data-select2-id="38">
                                    Community Type
                                  </option>
                                  <option value="1"> Luxury </option>
                                  <option value="2"> Gated </option>
                                  <option value="3"> Semi Gated </option>
                                  <option value="4"> Standalone </option>
                                  <option value="5"> IT Park </option>
                                  <option value="6"> SEZ </option>
                                  <option value="7"> Commercial Complex </option>
                                  <option value="8"> Mall </option>
                                  <option value="9"> Multiplex Mall </option>
                                  <option value="10"> Not Required </option>
                                </select>

                              </div>
                            </div>
                          </div>
                          <div className="row mb-4">
                            <div className="col-sm-3">
                              <h5 className='mb-3'><b>Other Reasons</b></h5>
                            </div>
                            <div className="col-sm-2">
                              <div className="form-group">
                                <select
                                  className="form-control searchcppropertytype select2 select2-hidden-accessible"
                                  id="searchcppropertytype"
                                  placeholder=""
                                  name="searchcppropertytype"
                                  required=""
                                  data-select2-id="searchcppropertytype"
                                  tabindex="-1"
                                  aria-hidden="true">
                                  <option value="" data-select2-id="32">
                                    Select Reason
                                  </option>
                                  <option>
                                    Not Intrested
                                  </option>
                                  <option>
                                    Already Purchased
                                  </option>

                                </select>

                              </div>
                            </div>

                          </div>
                        </div>

                        <div className="row">
                          <div className="col-sm-2 col-sm-offset-10 text-center">
                            <label>&nbsp;</label>
                            <div className="form-group">
                              <button onClick={performSearch} type="button" name="" id="" className="btn btn-success btn-search">
                                Search
                              </button>
                              <button onClick={clearSearch} type="button" name="" id="" className="btn btn-warning btn-reset">
                                Reset
                              </button>
                            </div>
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
                  <div className="card-header">
                    <h3 className="card-title">Dropout Leads</h3>
                  </div>
                  <div className="card-body">
                    <div className="table-responsive-md">
                      <table className="table text-nowrap mb-0">
                        <thead>
                          <tr>
                            <th>S.No</th>
                            <th>Name</th>
                            <th>DO-Days</th>
                            <th>Phone</th>
                            <th>Source</th>
                            <th>Project</th>
                            {/* <th>Executive</th> // moved to view pop up */}
                            <th>Reasons</th>
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
                                  <span className="fw-medium">
                                    {getDaysBetweenDates(lead.created_at, lead.status_updated_at)}
                                  </span>
                                </td>
                                <td>
                                  <a href={`tel:${lead.mobile_number}`} className="text-decoration-none">
                                    {lead.mobile_number || 'N/A'}
                                  </a>
                                </td>
                                <td>
                                  <span className="badge bg-info text-dark">
                                    {getProjectName(lead.project_id)}
                                  </span>
                                </td>
                                <td>{formatDate(lead.created_at || lead.CreatedDate)}</td>
                                <td>
                                  <div className="btn-group" role="group">
                                    <button
                                      className="btn btn-sm btn-outline-primary"
                                      title="View Details"
                                      onClick={() => openModal(lead)}
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
                      <div className="row mt-3">
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
            </div>

          </div>
        </div>
      </div>
      <Modal
        show={show}
        onHide={handleClose}
        size="lg"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Lead Dropout Reasons</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="row justify-content-center">
            <div className="col-md-12">
              <div className="card">
                <div className="card-header d-flex justify-content-between align-items-center">
                  <h3 className="card-title mb-0">Dropout Reasons</h3>
                  <h3 className="card-title mb-0">Project: <span className="badge">
                    {getProjectName(openedLead.project_id)}
                  </span></h3>
                </div>
                <div className="card-body">
                  <div className="table-responsive">
                    <table className="table table-striped table-hover text-nowrap mb-0">
                      <thead className="table-light">
                        <tr>
                          <th>S.No</th>
                          <th>Reason </th>
                          <th>Recieved On</th>
                          <th>Dropout On</th>
                          <th>Executive</th>
                          <th>Comments</th>
                        </tr>
                      </thead>
                      <tbody>
                        {openedLead?.dropout_reasons?.length > 0 ? (
                          openedLead?.dropout_reasons.map((lead, index) => (
                            <tr key={`${lead.id || index}`}>
                              <td>{index + 1}</td>
                              <td>
                                <span className="fw-medium">{lead.dropout_reason || 'N/A'}</span>
                              </td>
                              <td>
                                <span className="fw-medium">{openedLead.created_at || 'N/A'}</span>
                              </td>
                              <td>{formatDate(openedLead.status_updated_at)}</td>
                              <td>
                                <span className="fw-medium">{openedLead?.sales_executive?.name || 'N/A'}</span>
                              </td>
                              <td>
                                <span className="fw-medium">{lead?.comment || 'N/A'}</span>
                              </td>
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
                </div>
              </div>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default DropoutLead;
