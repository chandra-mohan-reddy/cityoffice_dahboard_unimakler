import React, { useState, useEffect } from 'react';
import Loader from '../../components/common/Loader';
import { toastError } from '../../utils/toast';
import { masterClient } from '../../utils/httpClient';
const Leadregistration = () => {
  // Loader state
  const [loading, setLoading] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    customerName: '',
    mobileNo: '',
    email: '',
    project: '',
    comment: '',
  });
  const [formErr, setFormErrs] = useState({});

  // Lead registrations state
  const [leads, setLeads] = useState([]);
  const [projects, setProjects] = useState({});


  const fetchData = async (apiCall, onSuccess) => {
    setLoading(false)
    try {
      let res = await apiCall();
      if (res?.data?.status) onSuccess(res?.data?.data)
    } catch (error) {
      console.error(`Error api call ${error}`)
    } finally {
      setLoading(false)
    }
  }

  // Fetch leads from API when component mounts
  useEffect(() => {
    fetchData(() => masterClient.post('/user-projects'), setProjects)
  }, []);

  // Form field change handler
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormErrs((prev) => ({
      ...prev,
      [name]: ''
    }))

    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  // Submit form handler
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) {
      toastError(`Please fix validation errors`)
    }
    setLoading(true);
    try {
      console.log(formData)
    } catch (err) {
      console.log(`Error Registering lead ${err}`)
    } finally {
      setLoading(false)
    }
  };


  const validate = () => {
    let errors = {};
    let isValid = true;

    if (!formData.customerName.trim()) {
      errors.customerName = 'Customer Name required';
      isValid = false;
    }
    if (!formData.mobileNo.trim()) {
      errors.mobileNo = 'Mobile required';
      isValid = false;
    }
    if (!formData.email.trim()) {
      errors.email = 'email required';
      isValid = false;
    }
    if (!formData.project.trim()) {
      errors.project = 'Please select Project';
      isValid = false;
    }
    if (!formData.comment.trim()) {
      errors.comment = 'Comments required';
      isValid = false;
    }
    setFormErrs(errors)
    return isValid;
  }

  return (
    <>
      {loading && <Loader />}
      <div className="main-content">
        <div className="page-content">
          <div className="container-fluid">
            <div className="row justify-content-center">
              <div className="col-md-6">
                <div className="card">
                  <div className="card-header">
                    <h3 className="card-title"> Add Lead Registration</h3>
                  </div>
                  <div className="card-body">
                    <form className="custom-validation" onSubmit={handleSubmit}>
                      <div className="mb-3 form-floating">
                        <input
                          type="text"
                          name="customerName"
                          value={formData.customerName}
                          onChange={handleChange}
                          className="form-control"
                          placeholder=''
                        />
                        <label htmlFor="customerName" className="fw-normal">
                          Customer Name <span className="req">*</span>
                        </label>
                        {formErr.customerName && (<span className="text-danger">
                          {formErr.customerName}</span>)}
                      </div>
                      <div className="mb-3 form-floating">
                        <input
                          type="text"
                          name="mobileNo"
                          value={formData.mobileNo}
                          onChange={handleChange}
                          className="form-control"
                          placeholder=''
                        />
                        <label htmlFor="mobileNo" className="fw-normal">
                          Mobile No
                          <span className="req">*</span>
                        </label>
                        {formErr.mobileNo && (<span className="text-danger">
                          {formErr.mobileNo}</span>)}
                      </div>
                      <div className="mb-3 form-floating">
                        <input
                          type="text"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          className="form-control"
                          placeholder=''
                        />
                        <label htmlFor="email" className="fw-normal">Email Address
                          <span className="req">*</span>
                        </label>
                        {formErr.email && (<span className="text-danger">
                          {formErr.email}</span>)}
                      </div>
                      <div className="mb-3 form-floating">
                        <select
                          className="form-select"
                          name="project"
                          value={formData.project}
                          onChange={handleChange}
                        >
                          <option value="">Select Project</option>
                          {projects.map((p, idx) => (
                            <option key={idx} value={p.project_id}>{p.projectName}</option>
                          ))}
                        </select>
                        <label htmlFor="project" className="fw-normal">
                          Project <span className="req">*</span>
                        </label>
                        {formErr.project && (<span className="text-danger">
                          {formErr.project}</span>)}
                      </div>
                      <div className="mb-3 form-floating">
                        <textarea
                          className="form-control"
                          name="comment"
                          value={formData.comment}
                          onChange={handleChange}
                          placeholder=''
                        />
                        <label htmlFor="comment" className="fw-normal">
                          Comment <span className="req">*</span>
                        </label>
                        {formErr.comment && (<span className="text-danger">
                          {formErr.comment}</span>)}
                      </div>
                      <div className="col-12">
                        <button className="btn btn-primary" type="submit">
                          Submit
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
            <div className="row justify-content-center mt-3">
              <div className="col-md-12">
                <div className="card">
                  <div className="card-header">
                    <h3 className="card-title">Lead Registration List</h3>
                  </div>
                  <div className="card-body">
                    <div className="table-responsive-md">
                      <table className="table text-nowrap mb-0">
                        <thead>
                          <tr>
                            <th>S.No</th>
                            <th>Customer Name</th>
                            <th>Mobile Number</th>
                            <th>Project Name</th>
                            <th>Register Date</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody className="block5-franchise-performance">
                          {leads.length > 0 ?
                            leads.map((lead, idx) => (
                              <tr key={idx}>
                                <td>{idx + 1}</td>
                                <td>{lead.customerName}</td>
                                <td>{lead.mobileNo}</td>
                                <td>{lead.project}</td>
                                <td>{lead.registerDate}</td>
                                <td>
                                  <button className="btn btn-primary mt-0">
                                    {/* Your SVG icon goes here */}
                                  </button>
                                </td>
                              </tr>
                            )) :
                            <tr>
                              <td colSpan={6}>No lead registrations found.</td>
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
        </div>
      </div>
    </>
  );
};

export default Leadregistration;
