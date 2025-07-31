import React, { useState, useEffect } from 'react';
import Loader from '../../components/common/Loader';
import { authClient, masterClient } from '../../utils/httpClient'
import { handleImages3 } from '../../utils/S3Handler';
import { MdDelete } from "react-icons/md";
import { toastError, toastSuccess } from '../../utils/toast';
import { FaEdit } from 'react-icons/fa';
import { useSelector } from 'react-redux';

const CreateFranchise = () => {
  const userData = useSelector(state => state.user.userData)
  const [loading, setLoading] = useState(false)
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [form, setForm] = useState({
    assignedProjects: [],
  });
  const [formErr, setFormErrs] = useState({});

  useEffect(() => {
    getAssignedProjects();
  }, [])

  const getAssignedProjects = async () => {
    setLoading(true)
    try {
      let res;

      res = await masterClient.get(`/users-projects-mapping/${userData.id}`)

      if (res?.data?.status && res?.data?.data.length > 0) {
        const filteredProjects = res?.data?.data.filter(project => project.executive == null)
        setProjects(filteredProjects);
        setFilteredProjects(filteredProjects);
      }
    } catch (err) {
      console.error(`Error getting Projects ${err}`)
    } finally {
      setLoading(false)
    }
  }


  const handleForm = async (e) => {
    const { name, value } = e.target


    setForm((prev) => {
      // Temporarily store the updated field
      const updatedForm = { ...prev, [name]: value };

      // Check if project_id is selected
      if (name === "project_id") {
        const selectedProject = filteredProjects.find((project) => project.project_id == value);
        // Ensure the project exists
        if (selectedProject) {
          const isDuplicate = prev.assignedProjects.some(
            (project) => project.project_id === selectedProject.project_id
          );
          if (!isDuplicate) {
            const newProject = {
              project_id: selectedProject.project_id,
              project_name: selectedProject.projectName,
            };

            return {
              ...updatedForm,
              assignedProjects: [...prev.assignedProjects, newProject],
              project_id: "",
            };
          }
        }
      }

      return updatedForm;
    });
  }

  const handleImage = async (e) => {
    setLoading(true);
    let resFromMiddleware = await handleImages3(e);
    setLoading(false);
    if (resFromMiddleware.clientStatus) {
      setForm((prevState) => ({
        ...prevState,
        [e.target.name]: resFromMiddleware.data.original_image_url
      }));
    } else {
      toastError(resFromMiddleware.data);
    }
  };

  const validate = () => {
    let isValid = true;
    let errors = {};

    if (!form.franchise_name?.trim()) {
      errors.franchise_name = 'Franchise Name is Required';
      isValid = false;
    }

    if (!form.franchise_primary_phoneno?.trim()) {
      isValid = false;
      errors.franchise_primary_phoneno = 'Franchise Primary Phone is Required';
    }

    if (!form.franchise_primary_email?.trim()) {
      errors.franchise_primary_email = 'Franchise Primary Email is required';
      isValid = false;
    } else if (!/^\S+@\S+\.\S+$/.test(form.franchise_primary_email)) {
      errors.franchise_primary_email = 'Invalid email format';
      isValid = false;
    }

    if (!form.username?.trim()) {
      isValid = false;
      errors.username = 'Franchise Username is Required';
    }

    if (!form.password?.trim()) {
      isValid = false;
      errors.password = 'Franchise Password is Required';
    }

    if (!form.login_Re_Password?.trim()) {
      isValid = false;
      errors.login_Re_Password = 'Franchise Re-type Password is Required';
    }

    if (!form.contact_person?.trim()) {
      isValid = false;
      errors.contact_person = 'Franchise Owner Name is Required';
    }
    if (!form.contact_dob?.trim()) {
      isValid = false;
      errors.contact_dob = 'Franchise Owner DOB is Required';
    }

    if (form?.assignedProjects.length === 0) {
      isValid = false;
      errors.projects = 'Please Assign Projects to Franchise'
    }

    setFormErrs(errors);

    return isValid
  }

  const handleSubmit = async () => {
    if (validate()) {
      setLoading(true)
      try {
        let payload = {
          ...form,
          franchise_tier: 4,
          super_franchise_id: userData?.id
        }

        let res = await masterClient.post('super-franchise/franchise', payload)
        if (res?.data?.status) {
          await createLogin(res?.data?.data?.franchise_id)
          await addAssignedProjects(res?.data?.data?.franchise_id);
        } else {
          console.error('error from franchise types api', res)
          toastError('Something went wrong! please try again')
        }
      } catch (err) {
        console.error('error Submmiting franchise', err);
      } finally {
        setLoading(false)
      }
    } else {
      toastError('Please Enter Mandatory Fields')
    }
  }

  const createLogin = async (franchiseId) => {
    setLoading(true)
    try {
      let body = {
        entity_id: franchiseId,
        entity_type: 'franchise',
        company_name: form.franchise_name,
        mobile: form.franchise_primary_phoneno,
        username: form.username,
        password: form.password,
        email: form.franchise_primary_email,
        role_id: 24,
        country_code: form.franchise_country,
        state_code: form.franchise_state,
        city_code: form.franchise_city,
        Address: form.franchise_address
      }
      let createUser = await authClient.post('register', body)
      if (createUser?.data?.status) {
        toastSuccess('Franchise Created Successfully');
        getAssignedProjects();
        setForm({
          assignedProjects: [],
        })
        setShow(false)
      }
    } catch (err) {
      console.error(`error creating the login details ${err}`)
      toastError(err)
    } finally {
      setLoading(false)
    }

  }

  const addAssignedProjects = async (franchiseId) => {
    setLoading(true)
    try {
      let projectIds = form.assignedProjects.map((each) => {
        return each.project_id
      })
      let payload = {
        user_id: franchiseId,
        user_type: 24,
        projectIds: projectIds
      }
      let res = await masterClient.post('users-projects-mapping', payload)
      if (res?.data?.status) {
        toastSuccess('Projects Assigned Successfully');
      }
    } catch (err) {
      console.error(`Error Assigning Projects => ${err}`);
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
                    <h3>Add Franchise</h3>
                  </div>
                </div>
              </div>
            </div>
            <div className="card mb-4">
              <div className="card-header"><h3 className="card-title">Add Franchise</h3></div>
              <div className='card-body p-4'>
                <form className="custom-validation">
                  <div className="row ">
                    <div className="col-md-12">
                      <h5 className='asint'>Personal Details</h5>
                    </div>
                    <div className="col-md-4 mb-3">
                      <div className="form-floating">
                        <input
                          type="text"
                          id="fullname"
                          className="form-control"
                          name="contact_person"
                          placeholder=""
                          value={form?.contact_person || ''}
                          onChange={handleForm}
                        />
                        <label htmlFor="corner" className="fw-normal">
                          Full Name
                        </label>
                        {formErr.contact_person && <p className="err">{formErr.contact_person}</p>}
                      </div>
                    </div>
                    <div className="col-md-4 mb-3">
                      <div className="form-floating">
                        <input
                          type="date"
                          id="dob"
                          className="form-control"
                          name="contact_dob"
                          placeholder=""
                          value={form?.contact_dob || ''}
                          onChange={handleForm}
                        />
                        <label htmlFor="corner" className="fw-normal">
                          DOB
                        </label>
                        {formErr.contact_dob && <p className="err">{formErr.contact_dob}</p>}
                      </div>
                    </div>
                    <div className="col-md-4 mb-3"></div>
                    <div className="col-md-8 mb-3">
                      <div className="form-floating">
                        <input
                          type="text"
                          id="franchiseName"
                          className="form-control"
                          value={form?.franchise_name || ''}
                          name="franchise_name"
                          placeholder=""
                          onChange={handleForm}
                        />
                        <label htmlFor="corner" className="fw-normal">
                          Company Name
                        </label>
                        {formErr.franchise_name && <p className="err">{formErr.franchise_name}</p>}
                      </div>
                    </div>
                    <div className="col-md-4 mb-3"></div>
                    <div className="col-md-12 mb-3">
                      <div className="form-floating">
                        <textarea
                          type="text"
                          id="address"
                          className="form-control"
                          placeholder=''
                          name="franchise_address"
                          height={200}
                          value={form?.franchise_address || ''}
                          onChange={handleForm}
                        >
                        </textarea>
                        <label htmlFor="corner" className="fw-normal">
                          Address
                        </label>
                        {formErr.franchise_address && <p className="err">{formErr.franchise_address}</p>}
                      </div>
                    </div>
                    <div className="col-md-12">
                      <h5 className='asint'>Credentials</h5>
                    </div>
                    <div className="col-md-4 mb-3">
                      <div className="form-floating">
                        <input
                          type="text"
                          id="username"
                          className="form-control"
                          placeholder=""
                          name="username"
                          value={form.username || ''}
                          onChange={handleForm}
                        />
                        <label htmlFor="corner" className="fw-normal">
                          User Name
                        </label>
                        {formErr.username && <p className="err">{formErr.username}</p>}
                      </div>
                    </div>
                    <div className="col-md-4 mb-3">
                      <div className="form-floating">
                        <input
                          type="password"
                          id="password"
                          className="form-control"
                          name="password"
                          placeholder=""
                          value={form.password || ''}
                          onChange={handleForm}
                        />
                        <label htmlFor="corner" className="fw-normal">
                          Password
                        </label>
                        {formErr.password && <p className="err">{formErr.password}</p>}
                      </div>
                    </div>
                    <div className="col-md-4 mb-3">
                      <div className="form-floating">
                        <input
                          type="password"
                          id="corner"
                          className="form-control"
                          name="login_Re_Password"
                          placeholder=""
                          value={form.login_Re_Password || ''}
                          onChange={handleForm}
                        />
                        <label htmlFor="corner" className="fw-normal">
                          Re-Type Password
                        </label>
                        {formErr.login_Re_Password && <p className="err">{formErr.login_Re_Password}</p>}
                      </div>
                    </div>

                  </div>
                </form>
              </div>
            </div>
            <div className="card mb-4">
              <div className="card-header"><h3 className="card-title">Contact Details</h3></div>
              <div className='card-body p-4'>
                <form className="custom-validation">
                  <div className="row ">
                    <div className="col-md-6 mb-3">
                      <div className="form-floating">
                        <input
                          className="form-control"
                          type="email"
                          id="franchise_primary_email"
                          placeholder=""
                          name="franchise_primary_email"
                          value={form.franchise_primary_email || ''}
                          onChange={handleForm}
                        />
                        <label htmlFor="corner" className="fw-normal">
                          Primary Email
                        </label>
                        {formErr.franchise_primary_email && <p className="err">{formErr.franchise_primary_email}</p>}
                      </div>
                    </div>
                    <div className="col-md-6 mb-3">
                      <div className="form-floating">
                        <input
                          className="form-control"
                          type="email"
                          id="secondary_email"
                          placeholder=""
                          name="secondary_email"
                          value={form.secondary_email || ''}
                          onChange={handleForm}
                        />
                        <label htmlFor="corner" className="fw-normal">
                          Secondary  Email
                        </label>
                        {formErr.secondary_email && <p className="err">{formErr.secondary_email}</p>}
                      </div>
                    </div>
                    <div className="col-md-6 mb-3">
                      <div className="form-floating">
                        <input
                          type="number"
                          className="form-control"
                          id="franchise_primary_phoneno"
                          placeholder=""
                          name="franchise_primary_phoneno"
                          value={form.franchise_primary_phoneno || ''}
                          onChange={handleForm}
                        />
                        <label htmlFor="corner" className="fw-normal">
                          Primary Phone
                        </label>
                        {formErr.franchise_primary_phoneno && <p className="err">{formErr.franchise_primary_phoneno}</p>}
                      </div>
                    </div>
                    <div className="col-md-6 mb-3">
                      <div className="form-floating">
                        <input
                          className="form-control"
                          type="text"
                          id="secondary_phone"
                          placeholder=""
                          name="secondary_phone"
                          value={form.secondary_phone || ''}
                          onChange={handleForm}
                        />
                        <label htmlFor="corner" className="fw-normal">
                          Secondary Phone
                        </label>
                        {formErr.secondary_phone && <p className="err">{formErr.secondary_phone}</p>}
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>

            <div className="card mb-4">
              <div className="card-header"><h3 className="card-title">Franchise Tenure</h3></div>
              <div className='card-body p-4'>
                <form className="custom-validation">
                  <div className="row ">
                    <div className="col-md-6 mb-3">
                      <div className="form-floating">
                        <input
                          type="date"
                          id="startDate"
                          className="form-control"
                          name="franchise_startdate"
                          placeholder=''
                          onChange={handleForm}
                          value={form?.franchise_startdate || ""}
                        />
                        <label htmlFor="startDate" className="fw-normal">
                          Start Date
                        </label>
                        {formErr.franchise_startdate && <p className="err">{formErr.franchise_startdate}</p>}
                      </div>
                    </div>
                    <div className="col-md-6 mb-3">
                      <div className="form-floating">
                        <input
                          type="date"
                          id="enddate"
                          className="form-control"
                          name="franchise_enddate"
                          placeholder=""
                          onChange={handleForm}
                          value={form?.franchise_enddate || ''}
                        />
                        <label htmlFor="enddate" className="fw-normal">
                          End Date
                        </label>
                        {formErr.franchise_enddate && <p className="err">{formErr.franchise_enddate}</p>}
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>
            <div className="card mb-4">
              <div className="card-header"><h3 className="card-title">Assign Projects</h3></div>
              <div className='card-body p-4'>
                <div className="row ">
                  <div className="col-md-12">
                    <div className="form-floating mb-3">
                      <select
                        className="form-select"
                        name="project_id"
                        id="project_id"
                        value={form.project_id || ''}
                        onChange={handleForm}
                      >
                        <option>Select</option>
                        {filteredProjects.map((each, index) => (
                          <option key={index} value={each.project_id}>{each.projectName}</option>
                        ))}
                      </select>
                      <label htmlFor="project_id" className="fw-normal">
                        Select Projects <span className="req">*</span>
                      </label>
                    </div>
                  </div>
                  <div className="col-md-12">
                    <h5 className="asint mb-3">Select Projects List</h5>
                  </div>

                  <div className="table-responsive-md">
                    <table className="table text-nowrap mb-0">
                      <thead>
                        <tr>
                          <th>S.No</th>
                          <th>Project </th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {form.assignedProjects.length > 0 ?
                          form.assignedProjects.map((each, index) => (
                            <tr key={index + 1}>
                              <td>{index + 1}</td>
                              <td>{each.project_name}</td>
                              <td onClick={() => removeProject(index)}><MdDelete /></td>
                            </tr>
                          ))
                          :
                          <tr>
                            <td className='text-center' colSpan={3}>
                              {formErr.projects ?
                                <p className="err">{formErr.projects}</p>
                                :
                                <>
                                  Assign Projects
                                </>
                              }
                            </td>
                          </tr>
                        }
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
            <div className="card mb-4">
              <div className="card-header"><h3 className="card-title">Upload Documents</h3></div>
              <div className='card-body p-4'>
                <div className="row ">
                  <div className="col-md-4 mb-3">
                    {form?.profilePicture === undefined ?
                      <div className="form-floating">
                        <input
                          type="file"
                          id="pp"
                          className="form-control"
                          name="profilePicture"
                          onChange={handleImage}
                        />
                        <label htmlFor="pp" className="fw-normal">
                          Profile Picture
                        </label>
                      </div>
                      :
                      <>
                        <span className="upld_data">
                          <FaEdit
                            onClick={() =>
                              setForm((prev) => ({
                                ...prev,
                                profilePicture: undefined
                              }))
                            }
                          />
                          <h5>Bank Details</h5>
                          <img src={form.profilePicture} />
                        </span>
                      </>
                    }
                  </div>
                  <div className="col-md-4 mb-3">
                    {form?.bankDetails === undefined ?
                      <div className="form-floating">
                        <input
                          type="file"
                          id="bd"
                          className="form-control"
                          name="bankDetails"
                          onChange={handleImage}
                        />
                        <label htmlFor="bd" className="fw-normal">
                          Bank Details
                        </label>
                      </div>
                      :
                      <>
                        <span className="upld_data">
                          <FaEdit
                            onClick={() =>
                              setForm((prev) => ({
                                ...prev,
                                bankDetails: undefined
                              }))
                            }
                          />
                          <h5>Bank Details</h5>
                          <img src={form.bankDetails} />
                        </span>
                      </>
                    }
                  </div>
                  <div className="col-md-4 mb-3"></div>
                  <div className="col-md-4 mb-3">
                    {form.reraNumber === undefined ?
                      <div className="form-floating">
                        <input
                          type="file"
                          id="rera"
                          className="form-control"
                          name="reraNumber"
                          placeholder=""
                          onChange={handleImage}
                        />
                        <label htmlFor="rera" className="fw-normal">
                          RERA Registration Number
                        </label>
                      </div>
                      :
                      <>
                        <span className="upld_data">
                          <FaEdit
                            onClick={() =>
                              setForm((prev) => ({
                                ...prev,
                                reraNumber: undefined
                              }))
                            }
                          />
                          <h5>RERA Registration Number</h5>
                          <img src={form.reraNumber} />
                        </span>
                      </>
                    }
                  </div>
                  <div className="col-md-4 mb-3">
                    {form.aadharCard === undefined ?
                      <div className="form-floating">
                        <input
                          type="file"
                          id="aadhar"
                          className="form-control"
                          name="aadharCard"
                          onChange={handleImage}
                        />
                        <label htmlFor="aadhar" className="fw-normal">
                          AADHAR CARD
                        </label>
                      </div>
                      :
                      <>
                        <span className="upld_data">
                          <FaEdit
                            onClick={() =>
                              setForm((prev) => ({
                                ...prev,
                                aadharCard: undefined
                              }))
                            }
                          />
                          <h5>Aadhar Card</h5>
                          <img src={form.aadharCard} />
                        </span>
                      </>
                    }
                  </div>
                  <div className="col-md-4 mb-3"></div>
                  <div className="col-md-4 mb-3">
                    {form.panCard === undefined ?
                      <div className="form-floating">
                        <input
                          type="file"
                          id="panCard"
                          className="form-control"
                          name="panCard"
                          onChange={handleImage}
                        />
                        <label htmlFor="panCard" className="fw-normal">
                          PAN CARD
                        </label>
                      </div>
                      :
                      <>
                        <span className="upld_data">
                          <FaEdit
                            onClick={() =>
                              setForm((prev) => ({
                                ...prev,
                                panCard: undefined
                              }))
                            }
                          />
                          <h5>Pan Card</h5>
                          <img src={form.panCard} />
                        </span>
                      </>
                    }
                  </div>
                  <div className="col-md-4 mb-3">
                    {form.gstCertificate === undefined ?
                      <div className="form-floating">
                        <input
                          type="file"
                          id="gst"
                          className="form-control"
                          name="gstCertificate"
                          onChange={handleImage}
                        />
                        <label htmlFor="gst" className="fw-normal">
                          GST Certificate
                        </label>
                      </div>
                      :
                      <>
                        <span className="upld_data">
                          <FaEdit
                            onClick={() =>
                              setForm((prev) => ({
                                ...prev,
                                gstCertificate: undefined
                              }))
                            }
                          />
                          <h5>GST Certificate</h5>
                          <img src={form.gstCertificate} />
                        </span>
                      </>
                    }
                  </div>
                </div>
              </div>
            </div>

            <div className="card mb-4">
              <div className="card-header"><h4 className="card-title">Role Assign to</h4></div>
              <div className="card-body p-4 row">
                <div className="col-md-4">
                  <div className="form-floating mb-3">
                    <select
                      className="form-select"
                      name="property_sub_type_id"
                      id="property_sub_type_id"
                      required="">
                      <option value="default"> Select Country Franchisee </option>
                      <option value="default"> Country Franchisee </option>
                    </select>
                    <label htmlFor="property_sub_type_id" className="fw-normal">
                      Select Role <span className="req">*</span>
                    </label>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="form-floating mb-3">
                    <select
                      className="form-select"
                      name="property_sub_type_id"
                      id="property_sub_type_id"
                      required="">
                      <option value="default"> Select Master Franchisee </option>
                    </select>
                    <label htmlFor="property_sub_type_id" className="fw-normal">
                      Select Master Franchisee <span className="req">*</span>
                    </label>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="form-floating mb-3">
                    <select
                      className="form-select"
                      name="property_sub_type_id"
                      id="property_sub_type_id"
                      required="">
                      <option value="default"> Select Super Franchisee </option>
                    </select>
                    <label htmlFor="property_sub_type_id" className="fw-normal">
                      Select Super Franchisee <span className="req">*</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-12 text-end">
              <button className='btn btn-primary' onClick={handleSubmit}>Submit</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CreateFranchise;