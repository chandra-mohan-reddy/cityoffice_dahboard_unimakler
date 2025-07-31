import React, { useState, useEffect, useContext, createContext } from 'react';
import Loader from '../../components/common/Loader';
import { masterClient } from '../../utils/httpClient';
import Offcanvas from 'react-bootstrap/Offcanvas';
// import { Offcanvas } from "react-bootstrap"
import { toastSuccess, toastError, toastWarning, date } from '../../utils/toast';
import { IpInfoContext } from '../../utils/context';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setProject } from '../../store/slices/ProjectManagementSlice';
import { Link } from 'react-router-dom';
import AutoComplete from './components/AutoComplete';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

const StepOne = ({ nextStep, prevStep, currentStep, setType, setSubType }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const formState = useSelector((state) => state.projectManagement['project']);

  const [form, setForm] = useState({
    'listing_type_id': 1, position: 1,
    ...formState
  });
  const [show, setShow] = useState(false);



  const [propertyType, setPropertyType] = useState([]);
  const [subProperty, setSubProperty] = useState([]);
  const [projectType, setProjectType] = useState([]);
  const [subProjectType, setSubProjectType] = useState([]);
  const [countries, setCountries] = useState([]);
  const [projects, setProjects] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [localities, setLocalities] = useState([]);
  const [loading, setLoading] = useState(false);
  const { ipInfo } = useContext(IpInfoContext);
  const [filteredProjects, setFilteredProjects] = useState([])

  const [formError, setFormError] = useState({});
  const [builder, setBuilder] = useState({});
  const [listingType, setListingType] = useState([]);
  const [builderId, setBuilderId] = useState('');
  const [formErr, setFormErr] = useState({});
  const [builders, setBuilders] = useState([]);
  const [cordinates, setCordinates] = useState({});
  const [formBuiderErr, setFormBuilderErr] = useState({});
  const [formforBuilder, setBuilderForm] = useState({
    position: 1
  });
  const [showModal, setModalPopup] = useState(false);


  // get Property type
  const getPropertyType = async () => {
    setLoading(true);
    try {
      const res = await masterClient.get('propertytype');
      // console.log('prperty type====', res);
      if (res.data?.status) {
        setPropertyType(res.data?.data);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  // get Sub Property type
  const getSubPropertyType = async (Propid) => {
    setLoading(true);
    try {
      const res = await masterClient.get('propertysubtype');
      // console.log('Sub prperty type====', res);
      if (res.data?.status) {
        const data = res?.data?.data?.filter((id) => id.property_type_id == Propid);
        if (!data.length) {
          toastError('No Sub Projects Type Found');
        }
        setSubProperty(data);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  // get Projects

  const getProjectType = async () => {
    setLoading(true);
    try {
      const res = await masterClient.get('projecttype');
      // console.log('prperty type====', res);
      if (res.data?.status) {
        setProjectType(res.data?.data);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const getSubProjectType = async (Propid) => {
    setLoading(true);
    try {
      const res = await masterClient.get('projectsubtype');
      // console.log('Sub prperty type====', res);
      if (res.data?.status) {
        const data = res?.data?.data?.filter((id) => id.project_type_id == Propid);
        if (!data.length) {
          toastError('No Sub Projects Type Found');
        }
        setSubProjectType(data);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };


  // get countries
  const allCountries = async () => {
    setLoading(true);
    try {
      const res = await masterClient.get('country');
      // console.log('get countries=====', res);
      if (res?.data?.status) {
        setCountries(res?.data?.data);
      }
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  //   getAll States
  const getStatesByCountry = async (param) => {
    setLoading(true);
    try {
      const res = await masterClient.get(`state/${param}`);
      // console.log('get states=====', res);
      if (res?.data?.status) {
        setStates(res?.data?.data);
      }
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  //   getAll Cities
  const getCitiesByState = async (param) => {
    setLoading(true);
    try {
      const res = await masterClient.get(`city/${param}`);
      // console.log('get cities=====', res);
      if (res?.data?.status) {
        setCities(res?.data?.data);
      }
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  //   getAll Localities
  const getLocalityByCity = async (param) => {
    setLoading(true);
    try {
      const res = await masterClient.get(`locality/${param}`);
      // console.log('get cities=====', res);
      if (res?.data?.status) {
        // Sort the localities alphabetically by locality_name
        const sortedLocalities = res?.data?.data.sort((a, b) =>
          a.locality_name.localeCompare(b.locality_name)
        );

        setLocalities(sortedLocalities);
      }
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  // get ProjectName
  const projectNames = async () => {
    setLoading(true);
    try {
      const res = await masterClient.get('projectname');
      // console.log('get filtered Projects=====', res);
      if (res?.data?.status) {
        setProjects(res?.data?.data);
        setFilteredProjects(res?.data?.data)
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const getfilteredProjects = async (param) => {
    try {
      setLoading(true);
      console.log(param, "Target values")

      const data = projects.filter((name) => name.locality == param);
      console.log(data, "project data ====")
      if (data.length) {
        setFilteredProjects(data);
        console.log(data, "Project details")
      } else {
        setFilteredProjects([])
      }
      // setProjects(data);
      // console.log('get filtered Projects=====', data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const getBuilderName = async (param) => {
    const project = projects.filter((name) => name.id == param);
    const builderId = project[0].builder_id;
    const latitude = project[0].latitude;
    const longitude = project[0].longitude;
    try {
      setLoading(true);
      const res = await masterClient.get(`builder/${builderId}`);
      if (res?.data?.status) {
        setBuilder(res?.data?.data);
        setForm(prev => ({ ...prev, builder_id: res?.data?.data?.id, latitude: latitude, longitude: longitude }));
        // setForm({ ...form, builder_id: res?.data?.data?.id });
      }
    } catch {
      toastError(res?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  //get Builders
  const getBuilders = async () => {
    setLoading(true);
    try {
      const res = await masterClient.get('builder');
      console.log('Get Builders====', res);
      if (res?.data?.status) {
        setBuilders(res?.data?.data);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };


  //   handle Change
  const handleChange = async (e) => {

    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    // dispatch(setProject({ [e.target.name]: e.target.value }))

    if (e.target.name == 'property_type_id') {
      if (form.listing_type_id == 1) {
        getSubProjectType(e.target.value);
        setType(e.target.value)
      }
    }
    if (e.target.name == 'property_sub_type_id') {
      setSubType(e.target.value)
    }
    if (e.target.name == 'country_code') {
      getStatesByCountry(e.target.value);
    }
    if (e.target.name == 'state_code') {
      getCitiesByState(e.target.value);
    }
    if (e.target.name == 'city_code') {
      getLocalityByCity(e.target.value);
    }
    if (e.target.name === 'locality') {


      getfilteredProjects(e.target.value);
    }
    if (e.target.name == 'project_name_id') {
      getBuilderName(e.target.value);
    }
  };

  // post
  const validate = () => {
    let isValid = true;
    const error = {};
    if (!form.project_listing_name) {
      error.project_listing_name = 'Title is required';
      isValid = false;
    }
    if (!form.property_type_id) {
      error.property_type_id = 'Property Type is required';
      isValid = false;
    }
    if (!form.property_sub_type_id) {
      error.property_sub_type_id = 'Sub Property Type is required';
      isValid = false;
    }
    if (!form.country_code) {
      error.country_code = 'Country is required';
      isValid = false;
    }
    if (!form.state_code) {
      error.state_code = 'State is required';
      isValid = false;
    }
    if (!form.city_code) {
      error.city_code = 'City is required';
      isValid = false;
    }
    if (!form.locality) {
      error.locality = 'Locality is required';
      isValid = false;
    }

    if (!form.listing_type_id) {
      error.listing_type_id = 'Listing Type is required';
      isValid = false;
    }
    if (!form.project_name_id) {
      error.project_name_id = 'Project Name is required';
      isValid = false;
    }
    setFormError(error);
    return isValid;

    setFormErr(error);
    return isValid;


  };


  //   validation Add Project Form
  const validateAddProjectForm = () => {
    let errors = {};
    let isFormValid = true;
    if (!form.name) {
      isFormValid = false;
      errors.name = 'Please Enter Project Name';
    }
    if (!form.country_code) {
      isFormValid = false;
      errors.country_code = 'Please Select the Country';
    }
    if (!form.state_code) {
      isFormValid = false;
      errors.state_code = 'Please Select the State';
    }
    if (!form.city_code) {
      isFormValid = false;
      errors.city_code = 'Please Select the City';
    }

    if (!form.locality) {
      isFormValid = false;
      errors.locality = 'Please Enter the Locality';
    }

    if (!form.builder_id) {
      isFormValid = false;
      errors.builder_id = 'Please Select the Builder';
    }
    if (!form.mobile_number) {
      isFormValid = false;
      errors.mobile_number = 'Please Enter Phone Number';
    }
    if (!form.email) {
      isFormValid = false;
      errors.email = 'Please Enter Email';
    }

    setFormErr(errors);
    return isFormValid;
  };


  // const handleChange = (e) => {
  //   handleChange(e);
  //   handleFormData(e.target.name)(e);
  // };

  // const handleChange = (e) => {

  // }

  // const getListingType = async () => {
  //   try {
  //     setLoading(true);
  //     const res = await masterClient.get('listingtype');
  //     if (res?.data?.status) {
  //       setListingType(res?.data?.data);
  //     }
  //   } catch (err) {
  //     toastError(res?.data?.message);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const handleSubmit = async () => {

    if (validate()) {
      dispatch(setProject(form));
      nextStep();
    }
    else {
      console.log(formError)
      toastError('Please Enter Mandatory fields');
    }
  };



  // handleSubmitaddprojectForm
  const handleSubmitAddProjectForm = async () => {
    if (validateAddProjectForm()) {
      let res;

      res = await masterClient.post('projectname', form);
      try {
        setLoading(true);
        if (res?.data?.status) {
          toastSuccess(res?.data?.message);
          setFormErr({});

          setShow(false);
          projectNames();
        }
      } catch (error) {
        console.log(error);
        if (error?.response?.data?.type === 'Validation error' && error?.response?.data?.data) {
          setFormErr(error?.response?.data?.data);
        } else {
          toastError(error?.response?.data?.message);
        }
      } finally {
        setLoading(false);
      }
    } else {
      toastError('please fill mandatory fields');
      console.log(formErr);
    }
  };

  //hanndle Builder Form Change
  const handleBuilderChange = (e) => {
    setBuilderForm({ ...formforBuilder, [e.target.name]: e.target.value });
  };


  //validation
  const validateBuilders = () => {
    let errors = {};
    let isFormValid = true;
    if (!formforBuilder.name) {
      isFormValid = false;
      errors.name = 'Please Enter Builder Name';
    }
    if (!formforBuilder.headoffice_location) {
      isFormValid = false;
      errors.headoffice_location = 'Please Enter Location';
    }
    if (!formforBuilder.md_name) {
      isFormValid = false;
      errors.md_name = 'Please Enter MD Name';
    }
    if (!formforBuilder.md_phone_number) {
      isFormValid = false;
      errors.md_phone_number = 'Enter Phone Number';
    }
    if (!formforBuilder.cp_manager_name) {
      isFormValid = false;
      errors.cp_manager_name = 'Please Enter CP Name';
    }
    if (!formforBuilder.cp_manager_phone_number) {
      isFormValid = false;
      errors.cp_manager_phone_number = 'Enter Phone Number';
    }
    if (!formforBuilder.sales_manager_name) {
      isFormValid = false;
      errors.sales_manager_name = 'Please Enter Sale Manager Name';
    }
    if (!formforBuilder.sales_manager_phone_number) {
      isFormValid = false;
      errors.sales_manager_phone_number = ' Enter Phone Number';
    }
    if (!formforBuilder.slug) {
      isFormValid = false;
      errors.slug = 'Please Enter Builder Websiste URL';
    }
    if (!formforBuilder.logo_path) {
      isFormValid = false;
      errors.logo_path = 'Please Choose Logo';
    }
    setFormBuilderErr(errors);
    return isFormValid;
  };

  //handle Builder Submit
  const handleSubmitBuilderForm = async () => {
    if (validateBuilders()) {
      try {
        setLoading(true);
        const res = await masterClient.post('builder', formforBuilder);
        if (res?.data?.status) {
          toastSuccess(res?.data?.message);
          setBuilderForm({});
          setFormBuilderErr({});
          setModalPopup(false);
          getBuilders();
        }
      } catch (error) {
        console.log(error);
        if (error?.response?.data?.type === 'Validation error' && error?.response?.data?.data) {
          setFormErr(error?.response?.data?.data);
        } else {
          toastError(error?.response?.data?.message);
        }
      } finally {
        setLoading(false);
      }
    } else {
      toastWarning('Please fill Mandetory Fields');
    }
  };

  const getLatLongs = (data) => {
    setCordinates(data);
    setForm({ ...form, latitude: data.lat, longitude: data.lng });
  }


  useEffect(() => {
    getPropertyType();
    allCountries();
    projectNames();
    getProjectType();
    if (form?.property_type_id !== undefined) {
      const val = form.property_type_id
      getSubProjectType(val);
    }
    if (form?.property_sub_type_id !== undefined) {
      console.log("form?.property_sub_type_id", form?.property_sub_type_id);
      setSubType(form?.property_sub_type_id)
    }
    getBuilders();

  }, []);

  useEffect(() => {
    setForm(prevState => ({
      ...prevState,
      ...formState,
    }));
  }, [formState]);

  return (
    <div>
      {loading && <Loader />}
      <div className='card'>
        <div className='card-header'>
          <h4 className='card-title'>Project Type</h4>
        </div>
        <div className='card-body'>


          <div className="row">
            {/* htmlFor project listing */}
            <div className="col">
              <div className="form-floating">
                <select
                  className="form-select"
                  name="property_type_id"
                  onChange={handleChange}
                  id="property_type_id"
                  value={form.property_type_id || ''}>
                  <option value="default">select Project Type</option>
                  {projectType.map((project, index) => (
                    <option key={index} value={project.id}>
                      {project.name}
                    </option>
                  ))}
                </select>
                <label htmlFor="property_type_id" className="fw-normal">
                  Select Project type
                  <span className='req'>*</span>
                </label>
                {formError.property_type_id && <p className="err">{formError.property_type_id}</p>}
              </div>
            </div>

            <div className="col">
              <div className="form-floating">
                <select
                  className="form-select"
                  name="property_sub_type_id"
                  id="property_sub_type_id"
                  required
                  onChange={handleChange}
                  value={form.property_sub_type_id || ''}>
                  <option value="default">select sub project type</option>
                  {subProjectType.map((subProject, index) => (
                    <option key={index} value={subProject.id}>
                      {subProject.name}
                    </option>
                  ))}
                </select>
                <label htmlFor="property_sub_type_id" className="fw-normal">
                  Select sub project type
                  <span className='req'>*</span>
                </label>
                {formError.property_sub_type_id && (
                  <p className="err">{formError.property_sub_type_id}</p>
                )}
              </div>
            </div>
          </div>

        </div>
      </div>

      <div className='card'>
        <div className='card-header'>
          <h4 className='card-title'>Project Location</h4>
        </div>
        <div className='card-body'>
          <div className="row mb-3">
            <div className="col">
              <div className="form-floating">
                <select
                  className="form-select"
                  name="country_code"
                  id="country_code"
                  required
                  onChange={handleChange}
                  value={form.country_code || ''}>
                  <option value="default">Country</option>
                  {countries.map((country, index) => (
                    <option key={index + 1} value={country.country_code}>
                      {country.country_name}
                    </option>
                  ))}
                </select>
                <label htmlFor="country_code" className="fw-normal">
                  Select Country
                  <span className='req'>*</span>
                </label>
                {formError.country_code && <p className="err">{formError.country_code}</p>}
              </div>
            </div>
            <div className="col">
              <div className="form-floating">
                <select
                  className="form-select"
                  name="state_code"
                  id="state_code"
                  required
                  onChange={handleChange}
                  value={form?.state_code || ''}>
                  <option value="default">State</option>
                  {states.map((state, index) => (
                    <option key={index} value={state.state_code}>
                      {state.state_name}
                    </option>
                  ))}
                </select>
                <label htmlFor="state_code" className="fw-normal">
                  Select State
                  <span className='req'>*</span>
                </label>
                {formError.state_code && <p className="err">{formError.state_code}</p>}
              </div>
            </div>
            <div className="col">
              <div className="form-floating">
                <select
                  className="form-select"
                  name="city_code"
                  id="city_code"
                  required
                  onChange={handleChange}
                  value={form?.city_code || ''}>
                  <option value="default">City / Town</option>
                  {cities.map((city, index) => (
                    <option key={index + 1} value={city.city_code}>
                      {city.city_name}
                    </option>
                  ))}
                </select>
                <label htmlFor="city_code" className="fw-normal">
                  Select City
                  <span className='req'>*</span>
                </label>
                {formError.city_code && <p className="err">{formError.city_code}</p>}
              </div>
            </div>

          </div>

          <div className="row mb-3">
            <div className="col">
              <div className="form-floating">
                <select
                  className="form-select"
                  name="locality"
                  id="locality"
                  required
                  onChange={handleChange}
                  autoComplete="off"
                  value={form?.locality || ''}>
                  <option value="default">Locality</option>
                  {localities.map((locality, index) => (
                    <option key={index} value={locality.locality_name}>
                      {locality.locality_name}
                    </option>
                  ))}
                </select>
                <label htmlFor="locality" className="fw-normal">
                  Select Locality
                  <span className='req'>*</span>
                </label>
                {formError.locality && <p className="err">{formError.locality}</p>}
              </div>
            </div>
            <div className="col">
              <div className="form-floating">
                <input
                  type="text"
                  id="subLocality"
                  className="form-control"
                  name="sub_locality"
                  placeholder="Enter Title"
                  onChange={handleChange}
                  value={form?.sub_locality || ''}
                />
                <label htmlFor="subLocality" className="fw-normal">
                  Select Sub Locality
                </label>
              </div>
            </div>
            <div className="col">
              <div className="form-floating">
                <input
                  type="text"
                  id="street_name"
                  className="form-control"
                  name="street_name"
                  placeholder="Enter Title"
                  onChange={handleChange}
                  value={form?.street_name || ''}
                />
                <label htmlFor="street_name" className="fw-normal">
                  Street Name
                </label>
              </div>
            </div>

          </div>
        </div>
      </div>


      {/* <div className='row mb-3'>
        <div className="col">
          <div className="form-floating">
            <input type="text" id="first-name" className="form-control" name="firstName" placeholder="Enter Enter" required />
            <label htmlFor="first-name" className="fw-normal">Address</label>
          </div>
        </div>
      </div> */}

      <div className='card'>
        <div className='card-header'>
          <h4 className='card-title'>Project Name</h4>
        </div>
        <div className='card-body'>
          <div className="row mb-3">
            <div className="col-4">
              <div className="form-floating">
                <select
                  className="form-select"
                  name="project_name_id"
                  id="project_name_id"
                  required
                  onChange={handleChange}
                  value={form?.project_name_id || ''}>
                  <option value="default">Select Project</option>
                  {filteredProjects.map((project, index) => (
                    <option key={index} value={project.id}>
                      {project.name}
                    </option>
                  ))}
                </select>
                <label htmlFor="project_name_id" className="fw-normal">
                  Select Project
                  <span className='req'>*</span>
                </label>
                {formError.project_name_id && <p className="err">{formError.project_name_id}</p>}
              </div>
            </div>

            <div className="col-4">
              <div className="form-floating">
                <label htmlFor="builder_id" className="fw-normal builderclass">
                  Builder Name
                </label>
                {builder && <h6 className="builderNameCard nameCardh6">{builder && builder?.name}</h6>}
                <input type="hidden" name="builder_id" id="builder" />

              </div>
            </div>
            <div className="col-4">
              <h6> Can't find the project you're looking htmlFor?</h6>
              <button className="addit" onClick={() => setShow(true)}>
                Add it here!
              </button>
            </div>

            {/* <div>Builder Name</div> */}
            <Offcanvas show={show} style={{ width: '50%' }} onHide={() => setShow(false)} placement="end">
              <Offcanvas.Header closeButton></Offcanvas.Header>
              <Offcanvas.Body>
                <div className="card">
                  <div className="card-header">
                    <h3 className="card-title">Add Project Name</h3>
                  </div>
                  <div className="card-body">
                    <form className="custom-validation">
                      <div className="mb-3">
                        <div className="form-floating">
                          <input
                            type="text"
                            id="project-type"
                            className="form-control"
                            name="name"
                            placeholder="Insert your firstname"
                            value={form?.name || ''}
                            onChange={handleChange}
                          />
                          <label htmlFor="project-type" className="fw-normal">
                            Enter Project Name{' '}
                          </label>
                          {formErr.name && <p className="err">{formErr.name}</p>}
                        </div>
                      </div>
                      <div className="row">
                        <div className="col mb-3">
                          <select
                            className="form-select"
                            name="country_code"
                            value={form?.country_code || ''}
                            onChange={handleChange}>
                            <option value="default">Select Country</option>
                            {countries.map((country, index) => (
                              <option key={index} value={country.country_code}>
                                {country.country_name}
                              </option>
                            ))}
                          </select>
                          {formErr.country_code && <p className="err">{formErr.country_code}</p>}
                        </div>
                        <div className="col mb-3">
                          <select
                            className="form-select"
                            name="state_code"
                            value={form?.state_code || ''}
                            onChange={handleChange}>
                            <option value="default">Select State</option>
                            {states.map((state, index) => (
                              <option key={index} value={state.state_code}>
                                {state.state_name}
                              </option>
                            ))}
                          </select>
                          {formErr.state_code && <p className="err">{formErr.state_code}</p>}
                        </div>
                      </div>
                      <div className="row">
                        <div className="col mb-3">
                          <select
                            className="form-select"
                            name="city_code"
                            value={form?.city_code || ''}
                            onChange={handleChange}>
                            <option value="default">Select City</option>
                            {cities.map((city, index) => (
                              <option key={index} value={city.city_code}>
                                {city.city_name}
                              </option>
                            ))}
                          </select>
                          {formErr.city_code && <p className="err">{formErr.city_code}</p>}
                        </div>
                        <div className="col mb-3">
                          <select
                            className="form-select"
                            name="locality"
                            value={form?.locality || ''}
                            onChange={handleChange}>
                            <option value="default">Locality</option>
                            {localities.map((locality, index) => (
                              <option key={index} value={locality.locality_name}>
                                {locality.locality_name}
                              </option>
                            ))}
                          </select>
                          {formErr.locality && <p className="err">{formErr.locality}</p>}
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-6 mb-3">
                          <select
                            className="form-select"
                            name="builder_id"
                            value={form?.builder_id || ''}
                            onChange={handleChange}>
                            <option value="default">Select Builder</option>
                            {builders.map((builder, index) => (
                              <option key={index} value={builder.id}>
                                {builder.name}
                              </option>
                            ))}
                          </select>
                          {formErr.builder_id && <p className="err">{formErr.builder_id}</p>}
                        </div>
                        <div className='mb-3 col-6 d-flex justify-content-center'>
                          <h6>Builder not listed?</h6>
                          <button type="button" className="add_builder" onClick={() => setModalPopup(true)}>
                            Add New Builder
                          </button>

                        </div>
                      </div>
                      <div className="row">
                        <div className="col mb-3">
                          <div className="form-floating">
                            <input
                              type="text"
                              id="project-type"
                              className="form-control"
                              name="email"
                              placeholder="Insert your firstname"
                              value={form?.email || ''}
                              onChange={handleChange}
                            />
                            <label htmlFor="project-type" className="fw-normal">
                              Enter Email
                            </label>
                            {formErr.email && <p className="err">{formErr.email}</p>}
                          </div>
                        </div>
                        <div className="col mb-3">
                          <div className="form-floating">
                            <input
                              type="number"
                              id="project-type"
                              className="form-control"
                              name="mobile_number"
                              placeholder="Insert your firstname"
                              value={form?.mobile_number || ''}
                              onChange={handleChange}
                            />
                            <label htmlFor="project-type" className="fw-normal">
                              Enter Mobile
                            </label>
                            {formErr.mobile_number && <p className="err">{formErr.mobile_number}</p>}
                          </div>
                        </div>
                      </div>

                      <div className="mb-3">
                        <div className="form-floating">
                          <AutoComplete latLong={getLatLongs} />
                          {/* {formErr.name && <p className="err">{formErr.name}</p>} */}
                        </div>
                      </div>

                      <div className="col-12">
                        <button className="btn btn-primary" type="button" onClick={handleSubmitAddProjectForm}>
                          Save
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </Offcanvas.Body>
            </Offcanvas>

          </div>
          <div className="row mb-3">
            <div className="form-floating">
              <input
                type="text"
                id="title"
                className="form-control"
                name="project_listing_name"
                placeholder="Enter Title"
                onChange={handleChange}
                value={form.project_listing_name || ''}
              />
              <label htmlFor="title" className="fw-normal">
                Title<span className='req'>*</span>
              </label>
              {formError.project_listing_name && (
                <p className="err">{formError.project_listing_name}</p>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className='btnParent'>
        <button className="btn customBtn" onClick={prevStep} disabled={currentStep === 0} >
          Previous
        </button>
        <button className="btn customBtn" onClick={handleSubmit}>
          Next
        </button>
      </div>


      <Modal show={showModal} size="xl">
        <Modal.Header>
          <Modal.Title>Add New Project</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Add Project Type</h3>
            </div>
            <div className="card-body">
              <form className="custom-validation">
                <div className="mb-3">
                  <div className="form-floating">
                    <input
                      type="text"

                      className="form-control"
                      name="name"
                      placeholder="Builder Name"
                      value={formforBuilder?.name || ''}
                      onChange={handleBuilderChange}
                    />
                    <label htmlFor="project-type" className="fw-normal">
                      Enter Builder Name{' '}
                    </label>
                    {formBuiderErr.name && <p className="err">{formBuiderErr.name}</p>}
                  </div>
                </div>
                <div className="mb-3">
                  <div className="form-floating">
                    <input
                      type="text"

                      className="form-control"
                      name="headoffice_location"
                      placeholder="Head Office Location"
                      value={formforBuilder?.headoffice_location || ''}
                      onChange={handleBuilderChange}
                    />
                    <label htmlFor="project-type" className="fw-normal">
                      Head Office Location
                    </label>
                    {formBuiderErr.headoffice_location && (
                      <p className="err">{formBuiderErr.headoffice_location}</p>
                    )}
                  </div>
                </div>
                <div className="mb-3">
                  <div className="form-floating">
                    <input
                      type="text"

                      className="form-control"
                      name="md_name"
                      placeholder="Enter MD Name"
                      value={formforBuilder?.md_name || ''}
                      onChange={handleBuilderChange}
                    />
                    <label htmlFor="project-type" className="fw-normal">
                      Enter MD Name
                    </label>
                    {formBuiderErr.md_name && <p className="err">{formBuiderErr.md_name}</p>}
                  </div>
                </div>
                <div className="mb-3">
                  <div className="form-floating">
                    <input
                      type="number"

                      className="form-control"
                      name="md_phone_number"
                      placeholder="MD Phone Number"
                      value={formforBuilder?.md_phone_number || ''}
                      onChange={handleBuilderChange}
                    />
                    <label htmlFor="project-type" className="fw-normal">
                      Enter Phone Number
                    </label>
                    {formBuiderErr.md_phone_number && (
                      <p className="err">{formBuiderErr.md_phone_number}</p>
                    )}
                  </div>
                </div>
                <div className="mb-3">
                  <div className="form-floating">
                    <input
                      type="text"

                      className="form-control"
                      name="cp_manager_name"
                      placeholder="CP Manager Name"
                      value={formforBuilder?.cp_manager_name || ''}
                      onChange={handleBuilderChange}
                    />
                    <label htmlFor="project-type" className="fw-normal">
                      Channel Partner Manager Name
                    </label>
                    {formBuiderErr.cp_manager_name && (
                      <p className="err">{formBuiderErr.cp_manager_name}</p>
                    )}
                  </div>
                </div>
                <div className="mb-3">
                  <div className="form-floating">
                    <input
                      type="number"

                      className="form-control"
                      name="cp_manager_phone_number"
                      placeholder="Phone Number"
                      value={formforBuilder?.cp_manager_phone_number || ''}
                      onChange={handleBuilderChange}
                    />
                    <label htmlFor="project-type" className="fw-normal">
                      Enter Phone Number
                    </label>
                    {formBuiderErr.cp_manager_phone_number && (
                      <p className="err">{formBuiderErr.cp_manager_phone_number}</p>
                    )}
                  </div>
                </div>
                <div className="mb-3">
                  <div className="form-floating">
                    <input
                      type="text"

                      className="form-control"
                      name="sales_manager_name"
                      placeholder="Sales manager Name"
                      value={formforBuilder?.sales_manager_name || ''}
                      onChange={handleBuilderChange}
                    />
                    <label htmlFor="project-type" className="fw-normal">
                      Sales manager Name
                    </label>
                    {formBuiderErr.sales_manager_name && (
                      <p className="err">{formBuiderErr.sales_manager_name}</p>
                    )}
                  </div>
                </div>
                <div className="mb-3">
                  <div className="form-floating">
                    <input
                      type="number"

                      className="form-control"
                      name="sales_manager_phone_number"
                      placeholder="Phone Number"
                      value={formforBuilder?.sales_manager_phone_number || ''}
                      onChange={handleBuilderChange}
                    />
                    <label htmlFor="project-type" className="fw-normal">
                      Enter Phone Number
                    </label>
                    {formBuiderErr.sales_manager_phone_number && (
                      <p className="err">{formBuiderErr.sales_manager_phone_number}</p>
                    )}
                  </div>
                </div>
                <div className="mb-3">
                  <div className="form-floating">
                    <input
                      type="text"

                      className="form-control"
                      name="slug"
                      placeholder="URL"
                      value={formforBuilder?.slug || ''}
                      onChange={handleBuilderChange}
                    />
                    <label htmlFor="project-type" className="fw-normal">
                      Builder Website URL
                    </label>
                    {formBuiderErr.slug && <p className="err">{formBuiderErr.slug}</p>}
                  </div>
                </div>
                <div className="mb-3">
                  <div className="form-floating">
                    <input
                      type="file"
                      id="build-logo"
                      className="form-control"
                      name="logo_path"
                      accept="image/*"
                      onChange={handleBuilderChange}
                    />
                    <label htmlFor="project-type" className="fw-normal">
                      Logo
                    </label>
                    {formBuiderErr.logo_path && <p className="err">{formBuiderErr.logo_path}</p>}
                  </div>
                </div>

              </form>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setModalPopup(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSubmitBuilderForm}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>


    </div >
  );
};

export default StepOne;
