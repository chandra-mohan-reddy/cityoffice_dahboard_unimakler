import { useState, useEffect, useCallback } from 'react';
import Button from 'react-bootstrap/Button';
import Offcanvas from 'react-bootstrap/Offcanvas';
import { FaEdit } from 'react-icons/fa';
import { MdDelete } from 'react-icons/md';
import { handleImages3 } from '../../utils/S3Handler';
import { useSelector } from 'react-redux';
import Loader from '../../components/common/Loader';
import { masterClient, authClient } from '../../utils/httpClient';
import { toastError, toastSuccess } from '../../utils/toast';
import { IoCloseSharp } from "react-icons/io5";
import DateModal from '../../components/reusable/DateModal';
import { Link } from 'react-router-dom';

function AddTeamleader() {
  const userData = useSelector((state) => state.user.userData);

  // handling date model
  const [showDate, setShowDate] = useState(false)
  const [selectedProject, setSelectedProject] = useState(null);
  const [dateValue, setDateValue] = useState('');

  // Modal handlers
  const handleDateModelClose = useCallback(() => {
    setShowDate(false);
    setSelectedProject(null);
    setDateValue('');
  }, []);

  // project assignment
  const handleProjectAssignment = useCallback(() => {
    if (!selectedProject || !dateValue) {
      toastError('Please select a date');
      return;
    }
    const newProject = {
      project_id: selectedProject.project_id,
      projectName: selectedProject.projectName,
      leads_start_date: dateValue
    };
    setForm(prev => ({
      ...prev,
      projects: [...prev.projects, newProject],
      project_id: "",
    }));

    handleDateModelClose();
  }, [selectedProject, dateValue, handleDateModelClose]);



  const [formState, setFormState] = useState(0);
  const [show, setShow] = useState(false);
  const [form, setForm] = useState({
    projects: []
  });
  const [formErrors, setFormErrors] = useState({});
  // ? projects Variables 
  const [assignedProjects, setAssignedProjects] = useState([]);
  const [unAssignedProjects, setUnAssignedProjects] = useState([]);
  // ? sales executive variables
  const [teamLeaders, setTeamLeaders] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleClose = () => setShow(false);

  const handleShow = (id = null, state) => {
    setShow(true);
    setFormState(state);
    if (state === 1) {
      getTeamLeadersById(id);
    } else {
      setForm({ projects: [] });
    }
  };

  const hanldeForm = (e) => {
    const { name, value } = e.target;

    // Handle project selection
    if (name === 'project') {
      const selectedProject = unAssignedProjects.find((project) => project.project_id == value);

      // Ensure the project exists
      if (selectedProject) {
        const isDuplicate = form.projects.some(
          (project) => project.project_id === selectedProject.project_id
        );

        if (!isDuplicate) {
          setUnAssignedProjects((prev) =>
            prev.filter((project) => project.project_id !== selectedProject.project_id)
          );
          setSelectedProject(selectedProject);
          setShowDate(true);
        }
      }
    }

    setForm((prev) => {
      // Temporarily store the updated field
      const updatedForm = { ...prev, [name]: value };

      return updatedForm;
    });
  };


  const handleImage = async (e) => {
    setLoading(true);
    let resFromMiddleware = await handleImages3(e);
    setLoading(false);
    if (resFromMiddleware.clientStatus) {
      if (
        e.target.name === 'pan_card' ||
        e.target.name === 'aadhar_card' ||
        e.target.name === 'resume' ||
        e.target.name === 'bank_details'
      ) {
        setForm((prevState) => ({
          ...prevState,
          [e.target.name]: resFromMiddleware.data.original_file_url
        }));
      } else {
        setForm((prevState) => ({
          ...prevState,
          [e.target.name]: resFromMiddleware.data.original_image_url
        }));
      }
    }
  };

  const getTeamLeaders = async () => {
    setLoading(true);
    try {
      let res = await masterClient.get(`/city-office/${userData?.id}/team-leaders`);
      if (res?.data?.status && res?.data?.data.length > 0) {
        setTeamLeaders(res?.data?.data);
      } else {
        setTeamLeaders([]);
      }
    } catch (err) {
      console.error('Error getting Team Leader', err);
      toastError('No Team Leader Found');
    } finally {
      setLoading(false);
    }
  };

  const getAssignedProjects = async () => {
    setLoading(true);
    try {
      let res = await masterClient.get(`/users-projects-mapping/${userData.id}`);
      if (res?.data?.status && res?.data?.data.length > 0) {
        setAssignedProjects(res?.data?.data);
        const projects = res?.data?.data.filter((project) => project.executive === null);
        setUnAssignedProjects(projects);
      }
    } catch (err) {
      console.error(`Error getting Projects ${err}`);
    } finally {
      setLoading(false);
    }
  };



  useEffect(() => {
    if (userData) getAssignedProjects();
    getTeamLeaders();
  }, []);

  const validateForm = () => {
    const errors = [];
    let isValid = true;
    if (!form.full_name) {
      errors.full_name = 'Full Name is required';
      isValid = false;
    }
    if (!form.date_of_birth) {
      errors.date_of_birth = 'Date of Birth is required';
      isValid = false;
    }
    if (!form.date_of_joining) {
      errors.date_of_joining = 'Date of Joining is required';
      isValid = false;
    }
    if (!form.username) {
      errors.username = 'Username is required';
      isValid = false;
    }
    if (!form.password) {
      errors.password = 'Password is required';
      isValid = false;
    }
    if (!form.re_type_password) {
      errors.re_type_password = 'Re-Type Password is required';
      isValid = false;
    }
    if (form.password !== form.re_type_password) {
      errors.password = 'Passwords do not match';
      isValid = false;
    }
    if (!form.primary_email) {
      errors.primary_email = 'Primary Email is required';
      isValid = false;
    }
    if (!form.secondary_email) {
      errors.secondary_email = 'Secondary Email is required';
      isValid = false;
    }
    if (!form.primary_mobile) {
      errors.primary_mobile = 'Primary Mobile is required';
      isValid = false;
    }
    if (!form.secondary_mobile) {
      errors.secondary_mobile = 'Secondary Mobile is required';
      isValid = false;
    }
    if (form.projects.length === 0) {
      errors.project = 'At least one project must be assigned';
      isValid = false;
    }
    if (!form.profile) {
      errors.profile = 'Profile is required';
      isValid = false;
    }
    if (!form.bank_details) {
      errors.bank_details = 'Bank Details are required';
      isValid = false;
    }
    if (!form.resume) {
      errors.resume = 'Resume is required';
      isValid = false;
    }
    if (!form.aadhar_card) {
      errors.aadhar_card = 'Aadhar Card is required';
      isValid = false;
    }
    if (!form.pan_card) {
      errors.pan_card = 'Pan Card is required';
      isValid = false;
    }


    setFormErrors(errors);
    return isValid;
  }

  //? password helper funtions

  const isPasswordValid = (pass) => {
    const errors = [];

    if (pass.length < 8) errors.push("Minimum 8 characters required.");
    if (!/[a-z]/.test(pass)) errors.push("At least one lowercase letter required.");
    if (!/[A-Z]/.test(pass)) errors.push("At least one uppercase letter required.");
    if (!/[0-9]/.test(pass)) errors.push("At least one digit required.");
    if (!/[@$!%*#?&]/.test(pass)) errors.push("At least one special character required.");

    return {
      status: errors.length === 0,
      errors
    };
  };

  const doPasswordsMatch = (password, confirmPassword) => {
    if (password === confirmPassword) {
      return {
        status: true,
        message: "Passwords match."
      };
    } else {
      return {
        status: false,
        message: "Passwords do not match."
      };
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formState === 0) {
      if (!validateForm()) {
        toastError('Please fill all required fields');
        return;
      }

      const passwordValidation = isPasswordValid(form.password);
      if (!passwordValidation.status) {
        for (let i = 0; i < passwordValidation.errors.length; i++) {
          toastError(passwordValidation.errors[i]);
        }
        return;
      }

      const passwordMatch = doPasswordsMatch(form?.login_password, form?.login_re_entered_password);

      if (!passwordMatch.status) {
        toastError(passwordMatch.message);
        return;
      }
    }



    setLoading(true);
    let payload = {
      ...form,
      role_id: 35,
      city_office_id: userData?.id,

      // User Login Details
      user: {
        role_id: 35,
        entity_type: 'team_leader',
        firstname: form.full_name,
        company_name: userData?.city_office_name,
        username: form.username,
        password: form.password,
        email: form.primary_email,
        mobile: form.primary_mobile,
        created_by: userData?.id
      },
      // Projects Mapping
      projects: form.projects.map((each) => ({
        project_id: each.project_id,
        leads_start_date: each.leads_start_date
      })),
    };

    try {
      let res;
      if (formState === 0) {
        res = await masterClient.post('/city-office/team-leaders', payload);
      } else {
        res = await masterClient.put(`/city-office/team-leaders/${form.id}`, payload);
      }

      if (res?.data?.status) {
        if (formState !== 0) {
          addAssignedProjects(res?.data?.data)
        }
        getAssignedProjects()
        toastSuccess(formState == 0 ? 'Created' : 'Updated' + 'SuccessFully');
        setForm({ projects: [] });
        setShow(false);
      }
    } catch (err) {
      console.error(`Error Posting Sales Executive =>`, err);
      if (err?.response?.data?.data) {
        const errors = err?.response?.data?.data;
        let errorMessages = [];

        for (let key in errors) {
          if (Array.isArray(errors[key])) {
            errorMessages.push(...errors[key]);
          } else {
            errorMessages.push(errors[key]);
          }
        }

        errorMessages.forEach((error) => { toastError(error) });
      }
    } finally {
      setLoading(false);
    }
  };

  const addAssignedProjects = async (id) => {
    let projectIds = form.projects.map((each) => {
      return each.project_id;
    });
    let payload = {
      user_id: id,
      user_type: 34,
      projectIds: projectIds
    };
    setLoading(true);
    try {
      let res = await masterClient.post('updateProjectAssigns', payload);
      if (res?.data?.status) {
        toastSuccess(formState == 0 ? 'Projects Assigned' : 'Projects Updated' + 'SuccessFully');
      }
    } catch (err) {
      console.error(`Error Assigning Projects => ${err}`);
      toastError('Projects already assigned!');
    } finally {
      setLoading(false);
    }
  };


  // ?  get sales executive by id
  const getTeamLeadersById = async (id) => {
    setLoading(true);
    try {
      let res = await masterClient.get(`/city-office/team-leaders/${id}`);
      if (res?.data?.status) {
        const projects = res?.data?.data?.projects || [];

        const projectsData = projects
          .map((proj) => {
            const match = assignedProjects.find(
              (p) => String(p.project_id) === String(proj.project_id)
            );
            if (match) {
              return {
                ...match,
                id: proj.id
              };
            }
            return null;
          })
          .filter(Boolean);

        const updatedData = { ...res.data.data, projects: projectsData };

        setForm(updatedData);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const RemoveTeamlead = async (id) => {
    setLoading(true);
    try {
      let res = await masterClient.delete(`/city-office/team-leaders/${id}`);
      if (res?.data?.status) {
        toastSuccess('Deleted Successfully');
        getTeamLeaders();
      }
    } catch (err) {
      console.error(`Error deleting Team leaders =>`, err);
      toastError('Error Try Again');
    } finally {
      setLoading(false);
    }
  }

  const removeProject = async (projectId, execId) => {
    const payload = {
      project_id: projectId,
      user_id: execId,
      user_type: 35,
      updated_by: userData?.id,
    }

    setLoading(true);
    try {
      const response = await masterClient.post('/removeProjects', payload);
      if (response?.data?.status) {
        getAssignedProjects();
        handleShow(execId, 1);
        toastSuccess('Project Removed Successfully');
        setForm((prev) => {
          const updatedProjects = prev.projects.filter((project) => project.id !== projectId);
          return {
            ...prev,
            projects: updatedProjects
          };
        });
      }
    } catch (err) {
      console.error(`Error removing project => ${err}`);

      const errors = err?.response?.data?.errors
      const errorMessages = [];

      if (Array.isArray(errors)) {
        errors.forEach((error) => {
          errorMessages.push(error.message);
        });
      }
      errorMessages.forEach((message) => { toastError(message) });
    }
  }

  return (
    <>
      {loading && <Loader />}
      <div className="main-content">
        <div className="page-content">
          <div className="container-fluid">
            <div className="card p-3">
              <div className="row align-items-center">
                <div className="col-md-12">
                  <div className="white-box block5-franchise-performance">
                    <div className="widget-header d-flex justify-content-between mb-3">
                      <h4 className="box-title">Team Leader</h4>
                      <Button
                        variant="primary"
                        onClick={() => handleShow(null, 0)}
                        className="me-2 mt-0">
                        + Add
                      </Button>
                    </div>

                    <div className="row">
                      <div className="col-sm-12">
                        <div className="table-responsive">
                          <table className="table color-table dark-table table-bordered">
                            <thead>
                              <tr className="text-center">
                                <th>Name</th>
                                <th>Phone</th>
                                <th>Date of birth</th>
                                <th>Details</th>
                                <th>Action</th>
                              </tr>
                            </thead>
                            <tbody className="tbody-franchise-performance">
                              {teamLeaders.length > 0 ? (
                                teamLeaders.map((ele, index) => (
                                  <tr className="text-center" key={index}>
                                    <td>
                                      <span className="text-info">{ele.full_name} </span>
                                    </td>
                                    <td>{ele.primary_mobile}</td>
                                    <td>{ele.date_of_birth}</td>
                                    <td><Link to={`/team-leader/${ele.id}`}>View</Link></td>
                                    <td>
                                      <button
                                        onClick={() => handleShow(ele.id, 1)}
                                        className="btn btn-primary mt-0">
                                        <FaEdit />
                                      </button>
                                      <button className="btn-danger btn mt-0">
                                        <MdDelete onClick={() => RemoveTeamlead(ele.id)} />
                                      </button>
                                    </td>
                                  </tr>
                                ))
                              ) : (
                                <tr>
                                  <td colSpan={4}>No Executives Found</td>
                                </tr>
                              )}
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
      </div>

      <Offcanvas show={show} onHide={handleClose} placement="end" className="prifile_edit">
        <Offcanvas.Header closeButton></Offcanvas.Header>
        <Offcanvas.Body>
          <div className="card p-4">
            <div className="card-header">
              <h3 className="card-title">{formState === 1 ? 'Edit' : 'Add'} Sales Executive</h3>
            </div>
            <form className="custom-validation">
              <div className="row mt-4">
                <div className="col-md-12">
                  <h5 className="asint">Personal Details</h5>
                </div>

                <div className="col-md-4 mb-3">
                  <div className="form-floating">
                    <input
                      className="form-control"
                      type="text"
                      id="full_name"
                      name="full_name"
                      placeholder=""
                      onChange={hanldeForm}
                      value={form?.full_name || ''}
                    />
                    <label htmlFor="full_name" className="fw-normal">
                      Full Name <span className="req">*</span>
                    </label>
                    {formErrors.full_name && (<span className="text-danger">{formErrors.full_name}</span>)}
                  </div>
                </div>

                <div className="col-md-4 mb-3">
                  <div className="form-floating">
                    <input
                      type="date"
                      id="date_of_birth"
                      className="form-control"
                      name="date_of_birth"
                      placeholder=""
                      onChange={hanldeForm}
                      value={form.date_of_birth || ''}
                    />
                    <label htmlFor="date_of_birth" className="fw-normal">
                      DOB <span className="req">*</span>
                    </label>
                    {formErrors.date_of_birth && (<span className="text-danger">{formErrors.date_of_birth}</span>)}
                  </div>
                </div>

                <div className="col-md-4 mb-3">
                  <div className="form-floating">
                    <input
                      type="date"
                      id="date_of_joining"
                      className="form-control"
                      name="date_of_joining"
                      placeholder=""
                      onChange={hanldeForm}
                      value={form.date_of_joining || ''}
                    />
                    <label htmlFor="date_of_joining" className="fw-normal">
                      Date of Joining <span className="req">*</span>
                    </label>
                    {formErrors.date_of_joining && (<span className="text-danger">{formErrors.date_of_joining}</span>)}
                  </div>
                </div>

                <div className="col-md-4 mb-3"></div>
                {formState === 0 && (
                  <>
                    <div className="col-md-12">
                      <h5 className="asint">Credentials</h5>
                    </div>
                    <div className="col-md-4 mb-3">
                      <div className="form-floating">
                        <input
                          type="text"
                          id="username"
                          className="form-control"
                          name="username"
                          placeholder=""
                          onChange={hanldeForm}
                          value={form.username || ''}
                        />
                        <label htmlFor="username" className="fw-normal">
                          User Name <span className="req">*</span>
                        </label>
                        {formErrors.username && (<span className="text-danger">{formErrors.username}</span>)}
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
                          onChange={hanldeForm}
                          value={form.password || ''}
                        />
                        <label htmlFor="password" className="fw-normal">
                          Password <span className="req">*</span>
                        </label>
                        {formErrors.password && (<span className="text-danger">{formErrors.password}</span>)}
                      </div>
                    </div>

                    <div className="col-md-4 mb-3">
                      <div className="form-floating">
                        <input
                          type="password"
                          id="re_type_password"
                          className="form-control"
                          name="re_type_password"
                          placeholder=""
                          onChange={hanldeForm}
                          value={form.re_type_password || ''}
                        />
                        <label htmlFor="re_type_password" className="fw-normal">
                          Re-Type Password <span className="req">*</span>
                        </label>
                        {formErrors.re_type_password && (<span className="text-danger">{formErrors.re_type_password}</span>)}
                      </div>
                    </div>
                  </>
                )}

                <div className="col-md-12">
                  <h5 className="asint">Contact Details</h5>
                </div>
                <div className="col-md-6 mb-3">
                  <div className="form-floating">
                    <input
                      type="email"
                      id="primary_email"
                      className="form-control"
                      name="primary_email"
                      placeholder=""
                      onChange={hanldeForm}
                      value={form?.primary_email || ' '}
                    />
                    <label htmlFor="primary_email" className="fw-normal">
                      Primary Email <span className="req">*</span>
                    </label>
                    {formErrors.primary_email && (<span className="text-danger">{formErrors.primary_email}</span>)}
                  </div>
                </div>

                <div className="col-md-6 mb-3">
                  <div className="form-floating">
                    <input
                      type="email"
                      id="secondary_email"
                      className="form-control"
                      name="secondary_email"
                      placeholder=""
                      onChange={hanldeForm}
                      value={form.secondary_email || ''}
                    />
                    <label htmlFor="corner" className="fw-normal">
                      Secondary Email <span className="req">*</span>
                    </label>
                    {formErrors.secondary_email && (<span className="text-danger">{formErrors.secondary_email}</span>)}
                  </div>
                </div>

                <div className="col-md-6 mb-3">
                  <div className="form-floating">
                    <input
                      type="number"
                      id="primary_mobile"
                      className="form-control"
                      name="primary_mobile"
                      placeholder=""
                      onChange={hanldeForm}
                      value={form?.primary_mobile || ''}
                    />
                    <label htmlFor="primary_mobile" className="fw-normal">
                      Primary Phone <span className="req">*</span>
                    </label>
                    {formErrors.primary_mobile && (<span className="text-danger">{formErrors.primary_mobile}</span>)}
                  </div>
                </div>

                <div className="col-md-6 mb-3">
                  <div className="form-floating">
                    <input
                      type="number"
                      id="secondary_mobile"
                      className="form-control"
                      name="secondary_mobile"
                      placeholder=""
                      value={form?.secondary_mobile || ''}
                      onChange={hanldeForm}
                    />
                    <label htmlFor="secondary_mobile" className="fw-normal">
                      Secondary Phone <span className="req">*</span>
                    </label>
                    {formErrors.secondary_mobile && (<span className="text-danger">{formErrors.secondary_mobile}</span>)}
                  </div>
                </div>

                {/* <div className="col-md-12">
                  <h5 className="asint">Assign To <span className="req">*</span></h5>
                </div>

                <div className="col-md-6 mb-3">
                  <div class="form-floating">
                    <select class="form-select" name="project" >
                      <option value="default">Select</option>
                      <option value="default">General Manager</option>
                      <option value="138">City Office Manager</option>
                    </select>
                  </div>
                </div>

                <div className="col-md-6 mb-3">
                  <div class="form-floating">
                    <select class="form-select" name="project" >
                      <option value="default">Select General Manager</option>
                      <option value="138">Mohan Reddy</option>
                    </select>
                  </div>
                </div> */}


                <div className="col-md-12">
                  <h5 className="asint">{formState === 1 ? 'Edit' : 'Assign'} Projects <span className="req">*</span></h5>
                </div>
                <div className="col-md-12 mb-3">
                  <div className="form-floating">
                    <select
                      className="form-select"
                      name="project"
                      value={form.project || ''}
                      onChange={hanldeForm}>
                      <option value="default">Select Project</option>
                      {unAssignedProjects.length > 0 &&
                        unAssignedProjects.map((ele, index) => (
                          <option key={index} value={ele.project_id}>
                            {ele.projectName}
                          </option>
                        ))}
                    </select>
                    {formErrors.project && (<span className="text-danger">{formErrors.project}</span>)}
                  </div>
                  <div className="d-flex asign_lists">
                    {form.projects.length > 0 &&
                      form.projects.map((ele, index) =>
                        <h6 key={index}>{ele.projectName}
                          <IoCloseSharp onClick={() => removeProject(ele.project_id, form?.id)} /> </h6>
                      )}
                  </div>
                </div>

                <div className="col-md-12 mt-4 mb-3">
                  <h5 className="asint">{formState === 1 ? 'Edit' : 'Upload'} Documnets</h5>
                </div>
                <div className="col-md-4 mb-5">
                  <div className="form-floating">
                    {form.profile === undefined ? (
                      <>
                        <input
                          type="file"
                          id="profile"
                          className="form-control"
                          name="profile"
                          placeholder=""
                          accept='image/*'
                          onChange={handleImage}
                        />
                        <label htmlFor="corner" className="fw-normal">
                          Profile <span className="req">*</span>
                        </label>
                        {formErrors.profile && (<span className="text-danger">{formErrors.profile}</span>)}
                      </>
                    ) : (
                      <>
                        <span className="upld_data">
                          <FaEdit onClick={() => setForm((prev) => ({ ...prev, profile: undefined }))} />
                          <h5>Profile Pic</h5>
                          <div className="img-box">
                            <img src={form.profile} />
                          </div>
                        </span>
                      </>
                    )}
                  </div>
                </div>

                <div className="col-md-4 mb-3">
                  <div className="form-floating">
                    {form.bank_details === undefined ? (
                      <>
                        <input
                          type="file"
                          id="bank_details"
                          className="form-control"
                          name="bank_details"
                          placeholder=""
                          onChange={handleImage}
                          accept="application/pdf"
                        />
                        <label htmlFor="bank_details" className="fw-normal">
                          Bank Details Upload PDF<span className="req">*</span>
                        </label>
                        {formErrors.bank_details && (<span className="text-danger">{formErrors.bank_details}</span>)}
                      </>
                    ) : (
                      <>
                        <span className="upld_data">
                          <FaEdit
                            onClick={() =>
                              setForm((prev) => ({
                                ...prev,
                                bank_details: undefined
                              }))
                            }
                          />
                          <h5>Bank Details</h5>
                          <a target="_blank" className="btn btn-primary" href={form.bank_details}>
                            {' '}
                            View
                          </a>
                        </span>
                      </>
                    )}
                  </div>
                </div>

                <div className="col-md-4 mb-3">
                  <div className="form-floating">
                    {form.resume === undefined ? (
                      <>
                        <input
                          type="file"
                          id="resume"
                          className="form-control"
                          name="resume"
                          onChange={handleImage}
                          accept="application/pdf"
                        />
                        <label htmlFor="corner" className="fw-normal">
                          Resume Upload PDF <span className="req">*</span>
                        </label>
                        {formErrors.resume && (<span className="text-danger">{formErrors.resume}</span>)}
                      </>
                    ) : (
                      <span className="upld_data">
                        <FaEdit />
                        <h5>Resume</h5>
                        <a target="_blank" className="btn btn-primary" href={form.resume}>
                          {' '}
                          View
                        </a>
                      </span>
                    )}
                  </div>
                </div>

                <div className="col-md-4 mb-3">
                  <div className="form-floating">
                    {form?.aadhar_card === undefined ? (
                      <>
                        <input
                          type="file"
                          id="aadhar_card"
                          className="form-control"
                          name="aadhar_card"
                          placeholder=""
                          onChange={handleImage}
                          accept="application/pdf"
                        />
                        <label htmlFor="aadhar_card" className="fw-normal">
                          Aadhar Card PDF<span className="req">*</span>
                        </label>
                        {formErrors.aadhar_card && (<span className="text-danger">{formErrors.aadhar_card}</span>)}
                      </>
                    ) : (
                      <span className="upld_data">
                        <FaEdit />
                        <h5>Aadhar Card</h5>
                        <a target="_blank" className="btn btn-primary" href={form.aadhar_card}>
                          {' '}
                          View
                        </a>
                      </span>
                    )}
                  </div>
                </div>

                <div className="col-md-4 mb-3">
                  {form?.pan_card === undefined ? (
                    <div className="form-floating">
                      <input
                        type="file"
                        id="pan_card"
                        className="form-control"
                        name="pan_card"
                        onChange={handleImage}
                        accept="application/pdf"
                      />
                      <label htmlFor="pan_card" className="fw-normal">
                        Pan Card PDF <span className="req">*</span>
                      </label>
                      {formErrors.pan_card && (<span className="text-danger">{formErrors.pan_card}</span>)}
                    </div>
                  ) : (
                    <span className="upld_data">
                      <FaEdit />
                      <h5>Pan Card</h5>
                      <a target="_blank" className="btn btn-primary" href={form.pan_card}>
                        {' '}
                        View
                      </a>
                    </span>
                  )}
                </div>

                <div className="col-md-12 text-end">
                  <button className="btn btn-primary" onClick={handleSubmit}>
                    Submit
                  </button>
                </div>
              </div>
            </form>
          </div>
        </Offcanvas.Body>
      </Offcanvas>

      <DateModal
        show={showDate}
        onClose={handleDateModelClose}
        date={dateValue}
        setDate={setDateValue}
        onAccept={handleProjectAssignment}
      />
    </>
  );
}

export default AddTeamleader;
