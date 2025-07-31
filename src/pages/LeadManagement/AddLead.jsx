import React, { useState, useEffect } from 'react'
import { masterClient } from '../../utils/httpClient';
import Loader from '../../components/common/Loader';
import { useSelector } from 'react-redux';
import { toastError, toastSuccess } from '../../utils/toast'
const AddLead = () => {

  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({})
  const [sourseTypes, setSourceTypes] = useState([]);
  const [sources, setSources] = useState([]);
  const [assignedProjects, setAssignedProjects] = useState([]);
  const [formErr, setFormErr] = useState({})

  const userData = useSelector((state) => state.user.userData);
  const role = useSelector((state) => state.user.role);

  const getSourceTypes = async () => {
    setLoading(true)
    try {
      let res = await masterClient.get('sourceType')
      if (res?.data?.status && res?.data?.data.length > 0) {
        setSourceTypes(res?.data?.data)
      }
    } catch (err) {
      console.error('error getting source types =>', err);
    } finally {
      setLoading(false)
    }
  }

  const getSourcesByType = async (id) => {
    try {
      let res = await masterClient.get(`sources/by-type/${id}`)
      if (res?.data?.status && res?.data?.data.length > 0) {
        setSources(res?.data?.data)
      }
    } catch (err) {
      console.error('error getting source types =>', err);
    } finally {
      setLoading(false)
    }
  }

  const handleForm = async (e) => {
    const { name, value } = e.target

    if (name === 'sourceType') {
      getSourcesByType(value)
    }

    setForm((prev) => ({
      ...prev,
      [name]: value
    }))
  }

  const getAssignedProjects = async () => {
    setLoading(true)
    try {
      let res;
      if (role === "franchise" || role === "Super Franchise") {
        res = await masterClient.get(`/users-projects-mapping/${userData.franchise_id}`)
      } else {
        res = await masterClient.get(`/users-projects-mapping/${userData.id}`)
      }

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
    if (userData) getAssignedProjects();
    getSourceTypes();
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (validate()) {

      try {
        let res = await masterClient.post('addLead', form);
        if (res?.data?.status) {
          toastSuccess("Lead Added Successfully")
          setForm({})
        }
      } catch (err) {
        console.error("Error creating role", err);

        if (err.response?.data?.data) {

          const errors = err.response.data.data;
          let errorMessages = [];

          for (const key in errors) {
            if (Array.isArray(errors[key])) {
              errorMessages.push(...errors[key]);
            } else {
              errorMessages.push(errors[key]);
            }
          }

          errorMessages.forEach((message) => toastError(message));
        } else {
          toastError(err.response?.data?.message)
        }
      }
    } else {
      toastError('Please Enter Mandatory Fields')
    }
  }

  ``
  const validate = () => {
    let errors = {};
    let isValid = true;

    if (!form.sourceType) {
      errors.sourceType = 'Source Type is required';
      isValid = false;
    }
    if (!form.source_id) {
      errors.source_id = 'Source is required';
      isValid = false;
    }
    if (!form.customerName) {
      errors.customerName = 'Customer name is required';
      isValid = false;
    }
    if (!form.mobileNumber) {
      errors.mobileNumber = 'mobile Number is required';
      isValid = false;
    }
    if (!form.email) {
      errors.email = 'email is required';
      isValid = false;
    }
    if (!form.project) {
      errors.project = 'Project is required';
      isValid = false;
    }
    if (!form.comments) {
      errors.comments = 'Comments is required';
      isValid = false;
    }

    setFormErr(errors);
    return isValid;
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
                    <h3>Add Lead</h3>
                  </div>
                </div>
              </div>
            </div>

            <div className="row justify-content-center">
              <div className='col-md-6'>
                <div className="card">
                  <div className="card-header">
                    <h3 className="card-title"> Add Lead</h3>
                  </div>
                  <div className="card-body">
                    <form className="custom-validation" onSubmit={handleSubmit}>
                      <div className="form-floating mb-3">
                        <select
                          className="form-select"
                          id='sourceType'
                          name="sourceType"
                          value={form.sourceType || ''}
                          onChange={handleForm}
                        >
                          <option>Select</option>
                          {sourseTypes.length > 0 &&
                            sourseTypes.map((ele, index) => (
                              <option key={index} value={ele.id}>{ele.source_type}</option>
                            ))
                          }
                        </select>
                        <label htmlFor="sourceType" className="fw-normal">
                          Source Type <span className='req'>*</span>
                        </label>
                      </div>

                      <div className="form-floating mb-3">
                        <select
                          className="form-select"
                          name="source_id"
                          value={form?.source_id || ''}
                          onChange={handleForm}
                        >
                          <option>Select Source</option>
                          {sources.length > 0 &&
                            sources.map((ele, index) => (
                              <option key={index} value={ele.id}>{ele.source_name}</option>
                            ))
                          }
                        </select>
                        <label htmlFor="customerName" className="fw-normal">
                          Sources <span className='req'>*</span>
                        </label>
                      </div>

                      <div className="form-floating mb-3">
                        <input
                          type='text'
                          className="form-control"
                          id='customerName'
                          placeholder=''
                          name='customerName'
                          value={form.customerName || ''}
                          onChange={handleForm}
                        />
                        <label htmlFor="customerName" className="fw-normal">
                          Customer Name <span className='req'>*</span>
                        </label>
                      </div>

                      <div className="form-floating mb-3">
                        <input
                          type='number'
                          className='form-control'
                          id='mobile'
                          name='mobileNumber'
                          placeholder='mobileNumber'
                          value={form?.mobileNumber || ''}
                          onChange={handleForm}
                        />
                        <label htmlFor="customerName" className="fw-normal">
                          Mobile No <span className='req'>*</span>
                        </label>
                      </div>

                      <div className="form-floating mb-3">
                        <input
                          type='email'
                          className='form-control'
                          id='email'
                          name='email'
                          placeholder=''
                          value={form?.email || ''}
                          onChange={handleForm}
                        />
                        <label htmlFor='email' className='fw-normal'>
                          Email <span className='req'>*</span>
                        </label>
                      </div>

                      <div className="form-floating mb-3">
                        <select
                          className="form-select"
                          id='project'
                          name="project"
                          value={form?.project || ''}
                          onChange={handleForm}
                        >
                          <option value="default">Select Project </option>
                          {assignedProjects.length > 0 &&
                            assignedProjects.map((ele) => (
                              <option key={ele.project_id} value={ele.project_id}>
                                {ele.projectName}
                              </option>
                            ))
                          }
                        </select>
                        <label htmlFor="project" className="fw-normal">
                          Project <span className='req'>*</span>
                        </label>
                      </div>

                      <div className="form-floating mb-3">
                        <textarea
                          id='comments'
                          placeholder=''
                          className='form-control'
                          name='comments'
                          value={form.comments || ''}
                          onChange={handleForm}
                        ></textarea>
                        <label htmlFor="customerName" className="fw-normal">
                          Comment <span className='req'>*</span>
                        </label>
                      </div>

                      <div className="col-12">
                        <button className="btn btn-primary" type="submit">Submit</button>
                      </div>
                    </form>
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

export default AddLead