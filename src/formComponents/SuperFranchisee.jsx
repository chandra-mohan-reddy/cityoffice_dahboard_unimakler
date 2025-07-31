import React, { useState, useEffect } from 'react';
// import Loader from '../components/Loader';
// import { authClient, masterClient, projectClient } from './utils/httpClient'
// import { handleImages3 } from './utils/S3Handler';
// import { MdDelete } from "react-icons/md";
// import { toastError, toastSuccess } from './utils/toast';
// import { Button } from 'react-bootstrap'
  


const SuperFranchisee = () => {

    const [loading, setLoading] = useState(false)
    const [form, setForm] = useState({
      assignedLocations: [],
      assignedProjects: [],
    });
    const [projects, setProjects] = useState([]);
    const [filteredProjects, setFilteredProjects] = useState([]);
    const [countries, setCountries] = useState([]);
    const [states, setStates] = useState([]);
    const [cities, setCities] = useState([]);
    const [assignedStates, setAssignedStates] = useState([]);
    const [assignedCities, setAssignedCities] = useState([]);
    const [localities, setLocalities] = useState([]);
    const [formErr, setFormErrs] = useState({});
    const [franchiseTypes, setFranchiseTypes] = useState([])
    const [franchiseClass, setFranchiseClass] = useState([])
    const [filteredFranchiseClass, setFilteredFranchiseClass] = useState([])
  
    const handleForm = async (e) => {
      const { name, value } = e.target
  
      if (name == 'franchise_type') {
        let franchiseClasses = franchiseClass.filter((fclass) => fclass.franchise_type == value);
        setFilteredFranchiseClass(franchiseClasses)
      }
  
      if (name == 'franchise_country') {
        getStatesByCountry(value);
      }
      if (name == 'franchise_state') {
        getCitiesByState(value);
      }
  
      // ? assigned locations
  
      if (name === 'assigned_country') {
        getAssignedStatesByCountry(value)
      }
  
      if (name === 'assigned_state') {
        getAssignedCitiesByState(value)
      }
  
      if (name == 'assigned_city') {
        getLocalityByCity(value);
      }
  
      setForm((prev) => {
        // Temporarily store the updated field
        const updatedForm = { ...prev, [name]: value };
  
        // Check if all fields are filled
        if (
          updatedForm.assigned_country &&
          updatedForm.assigned_state &&
          updatedForm.assigned_city &&
          updatedForm.locality
        ) {
          // Add the location to the assignedLocations array
          const newLocation = {
            country: updatedForm.assigned_country,
            state: updatedForm.assigned_state,
            city: updatedForm.assigned_city,
            locality: updatedForm.locality,
          };
  
          // Ensure the project exists
          if (newLocation.locality) {
  
            const isDuplicate = prev.assignedLocations.some(
              (loc) => loc.locality === newLocation.locality
            );
  
            if (!isDuplicate) {
              return {
                ...updatedForm,
                assignedLocations: [...prev.assignedLocations, newLocation],
                // Clear fields for the next entry
                locality: '',
              };
            } else {
              toastError('Location Exists');
              return {
                ...updatedForm,
                locality: ''
              }
            }
          }
        }
  
        // Check if project_id is selected
        if (name === "project_id") {
  
  
          const selectedProject = filteredProjects.find((project) => project.id == value);
  
          // Ensure the project exists
          if (selectedProject) {
  
            const isDuplicate = prev.assignedProjects.some(
              (project) => project.project_id === selectedProject.id
            );
  
            if (!isDuplicate) {
              const newProject = {
                project_id: selectedProject.id,
                project_name: selectedProject.name,
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
  
    const removeLocation = (index) => {
      setForm((prev) => ({
        ...prev,
        assignedLocations: prev.assignedLocations.filter((_, i) => i !== index),
      }));
    };
  
    const handleSubmit = async () => {
  
      if (validate()) {
        setLoading(true)
        try {
          let payload = {
            ...form,
            franchise_tier: 2
          }
          let res = await masterClient.post('franchise', payload)
          if (res?.data?.status) {
            await createLogin(res?.data?.data?.franchise_id)
            await addAssignedLocations(res?.data?.data?.franchise_id);
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
          franchise_id: franchiseId,
          company_name: form.franchise_brand_name,
          mobile: form.franchise_primary_phoneno,
          username: form.username,
          password: form.password,
          email: form.franchise_primary_email,
          role_id: 13,
          country_code: form.franchise_country,
          state_code: form.franchise_state,
          city_code: form.franchise_city,
          Address: form.franchise_address
        }
        let createUser = await authClient.post('register', body)
        if (createUser?.data?.status) {
          toastSuccess('Added Successfully');
          allCountries();
          getProjects();
          setForm({
            assignedLocations: [],
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
  
    const addAssignedLocations = async (franchiseId) => {
      setLoading(true)
      try {
        let payload = {
          franchise_id: franchiseId,
          locations: form.assignedLocations
        }
        let res = await masterClient.post('assignLocations', payload)
        if (res?.data?.status) {
          toastSuccess('Locations Assigned Successfully');
        }
      } catch (err) {
        console.error(`error creating the Assigned Locations ${err}`)
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
          franchise_id: franchiseId,
          projectIds: projectIds
        }
        let res = await masterClient.post('assignProjects', payload)
        if (res?.data?.status) {
          toastSuccess('Projects Assigned Successfully');
        }
      } catch (err) {
        console.error(`Error Assigning Projects => ${err}`);
      } finally {
        setLoading(false)
      }
    }
  
    const getFranchiseTypes = async () => {
      setLoading(true);
      try {
        let res = await masterClient.get('franchise-type');
        if (res?.data.status && res?.data?.data.length > 0) {
          const types = res?.data?.data.filter((type) => type.franchise_tier === 2);
          setFranchiseTypes(types)
        }
      } catch (e) {
        console.error('get franchise-tire error => ', e)
      } finally {
        setLoading(false)
      }
    }
  
  
    const getFranchiseClass = async () => {
      setLoading(true);
      try {
        let res = await masterClient.get('franchise-class');
        if (res?.data.status) {
          const classes = res?.data?.data.filter((type) => type.franchise_tier === 2);
          setFranchiseClass(classes)
        }
      } catch (e) {
        console.error('get franchise-class error => ', e)
      } finally {
        setLoading(false)
      }
    }
  
  
    useEffect(() => {
      allCountries();
      getProjects();
      getFranchiseTypes();
      getFranchiseClass();
    }, [])
  
    // get countries
    const allCountries = async () => {
      setLoading(true);
      try {
        const res = await masterClient.get('country');
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
        if (res?.data?.status) {
          setCities(res?.data?.data);
        }
      } catch (e) {
        console.log(e);
      } finally {
        setLoading(false);
      }
    };
  
    // ? assigned locations api
  
    const getAssignedStatesByCountry = async (param) => {
      setLoading(true);
      try {
        const res = await masterClient.get(`state/${param}`);
        if (res?.data?.status) {
          setAssignedStates(res?.data?.data);
        }
      } catch (e) {
        console.log(e);
      } finally {
        setLoading(false);
      }
    };
  
    //   get Assigned Cities
    const getAssignedCitiesByState = async (param) => {
      setLoading(true);
      try {
        const res = await masterClient.get(`city/${param}`);
        if (res?.data?.status) {
          setAssignedCities(res?.data?.data);
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
  
    useEffect(() => {
      if (!form.assignedLocations.length || !projects.length) return;
      const assignedLocalities = form.assignedLocations.map((l) => l.locality);
      const filteredProjects = projects.filter((project) =>
        assignedLocalities.includes(project.locality)
      );
      setFilteredProjects(filteredProjects);
    }, [form.assignedLocations])
  
  
    const getProjects = async () => {
      setLoading(true)
      try {
        let res = await masterClient.get('projectname');
        if (res?.data?.status && res?.data?.data?.length > 0) {
          setProjects(res?.data?.data)
        } else {
          toastError('Something went wrong! please try again')
        }
      } catch (err) {
        console.error('error getting projects =>', err)
      } finally {
        setLoading(false)
      }
    }
  
    const removeProject = (index) => {
      setForm((prev) => ({
        ...prev,
        assignedProjects: prev.assignedProjects.filter((_, i) => i !== index),
      }));
    };
  
    const validate = () => {
      let isValid = true;
      let errors = {};
  
      if (!form.franchise_type?.trim()) {
        errors.franchise_type = 'Franchise Type is Required';
        isValid = false;
      }
  
      if (!form.franchise_class?.trim()) {
        errors.franchise_class = 'Franchise Class is Required';
        isValid = false;
      }
  
      if (!form.franchise_brand_name?.trim()) {
        errors.franchise_brand_name = 'Franchise Brand Name is Required';
        isValid = false;
      }
  
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
  
      if (!form.franchise_country?.trim()) {
        isValid = false;
        errors.franchise_country = 'Franchise Country is Required';
      }
  
      if (!form.franchise_state?.trim()) {
        isValid = false;
        errors.franchise_state = 'Franchise State is Required';
      }
  
      if (!form.franchise_city?.trim()) {
        isValid = false;
        errors.franchise_city = 'Franchise City is Required';
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
  
      if (!form.contact_primary_phone?.trim()) {
        isValid = false;
        errors.contact_primary_phone = 'Franchise Promary Phone is Required';
      }
  
      if (!form.owner_email?.trim()) {
        isValid = false;
        errors.owner_email = 'Franchise Email is Required';
      }
  
      if (form?.assignedLocations.length === 0) {
        isValid = false
        errors.locations = 'Please Assign Locations to Franchise';
      }
  
      if (form?.assignedProjects.length === 0) {
        isValid = false;
        errors.projects = 'Please Assign Projects to Franchise'
      }
  
      setFormErrs(errors);
  
      return isValid
    }
  
    return (
      <>
        {loading && <Loader />}
              <div className="card mb-4">
                <div className="card-header"><h4 className="card-title">Super Franchise Details</h4></div>
                <div className="card-body p-4">
                  <form className="custom-validation row">
                    <div className="col-md-8">
                      <div className="row">
                        <div className="col-md-12">
                          <h5 className="asint mb-3">Super Franchise Type</h5>
                        </div>
  
                        <div className="col-md-6">
                          <div className="form-floating mb-3">
                            <select
                              className="form-select"
                              name="franchise_type"
                              id="franchise_type"
                              onChange={handleForm}
                              value={form?.franchise_type || ''}
                            >
                              <option value="default">Select</option>
                              {franchiseTypes.map((type, index) => (
                                <option key={index} value={type.id}>
                                  {type.franchise_type}
                                </option>
                              ))}
                            </select>
                            <label htmlFor="state_code" className="fw-normal">
                              Select Franchise Type <span className="req">*</span>
                            </label>
                            {formErr.franchise_type && <p className="err">{formErr.franchise_type}</p>}
                          </div>
                        </div>
  
                        <div className="col-md-6">
                          <div className="form-floating mb-3">
                            <select
                              id="franchise_class"
                              className="form-select"
                              name="franchise_class"
                              value={form.franchise_class || ''}
                              onChange={handleForm}
                            >
                              <option value>Select </option>
                              {filteredFranchiseClass.map((fclass, index) => (
                                <option key={index + 1} value={fclass.id}>
                                  {fclass.franchise_class}
                                </option>
                              ))}
                            </select>
                            <label htmlFor="franchise_class" className="fw-normal">
                              Select Class <span className="req">*</span>
                            </label>
                            {formErr.franchise_class &&
                              <p className="err">{formErr.franchise_class}</p>}
                          </div>
                        </div>
  
                        <div className="col-md-12">
                          <div className="form-floating mb-3">
                            <input
                              type="text"
                              className="form-control"
                              id="franchise_brand_name"
                              name="franchise_brand_name"
                              placeholder=""
                              value={form.franchise_brand_name || ''}
                              onChange={handleForm}
                            />
                            <label htmlFor="franchise_brand_name" className="fw-normal">
                              Franchise Brand Name <span className="req">*</span>
                            </label>
                            {formErr.franchise_brand_name && <p className="err">{formErr.franchise_brand_name}</p>}
                          </div>
                        </div>
  
                        <div className="col-md-12">
                          <div className="form-floating mb-3">
                            <input
                              type="text"
                              className="form-control"
                              id="franchise_name"
                              name="franchise_name"
                              placeholder=""
                              value={form.franchise_name || ''}
                              onChange={handleForm}
                            />
                            <label htmlFor="franchise_name" className="fw-normal">
                              Franchise Company Name <span className="req">*</span>
                            </label>
                            {formErr.franchise_name && <p className="err">{formErr.franchise_name}</p>}
                          </div>
                        </div>
  
                        <div className="col-md-6">
                          <div className="form-floating mb-3">
                            <input
                              type="number"
                              className="form-control"
                              id="franchise_primary_phoneno"
                              placeholder=""
                              name="franchise_primary_phoneno"
                              value={form.franchise_primary_phoneno || ''}
                              onChange={handleForm}
                            />
                            <label htmlFor="franchise_primary_phoneno" className="fw-normal">
                              Primary Phone: <span className="req">*</span>
                            </label>
                            {formErr.franchise_primary_phoneno &&
                              <p className="err">{formErr.franchise_primary_phoneno}</p>}
                          </div>
                        </div>
  
                        <div className="col-md-6">
                          <div className="form-floating mb-3">
                            <input
                              className="form-control"
                              type="text"
                              id="secondary_phone"
                              placeholder=""
                              name="secondary_phone"
                              value={form.secondary_phone || ''}
                              onChange={handleForm}
                            />
                            <label htmlFor="secondary_phone" className="fw-normal">
                              Secondary Phone :
                            </label>
                          </div>
                        </div>
  
                        <div className="col-md-6">
                          <div className="form-floating mb-3">
                            <input
                              className="form-control"
                              type="email"
                              id="franchise_primary_email"
                              placeholder=""
                              name="franchise_primary_email"
                              value={form.franchise_primary_email || ''}
                              onChange={handleForm}
                            />
                            <label htmlFor="franchise_primary_email" className="fw-normal">
                              Primary Email : <span className="req">*</span>
                            </label>
                            {formErr.franchise_primary_email &&
                              <p className="err">{formErr.franchise_primary_email}</p>}
                          </div>
                        </div>
  
                        <div className="col-md-6">
                          <div className="form-floating mb-3">
                            <input
                              className="form-control"
                              type="email"
                              id="secondary_email"
                              placeholder=""
                              name="secondary_email"
                              value={form.secondary_email || ''}
                              onChange={handleForm}
                            />
                            <label htmlFor="secondary_email" className="fw-normal">
                              Secondary Email :
                            </label>
                          </div>
                        </div>
  
                        <div className="col-md-12"><h5 className="asint mb-3">Super Franchise Address</h5></div>
                        <div className="col-md-4">
                          <div className="form-floating">
                            <select
                              id="property_sub_type_id"
                              className="form-select"
                              name="franchise_country"
                              value={form.franchise_country || ''}
                              onChange={handleForm}
                            >
                              <option value>Select </option>
                              {countries.map((country, index) => (
                                <option key={index + 1} value={country.country_code}>
                                  {country.country_name}
                                </option>
                              ))}
                            </select>
                            <label htmlFor="property_sub_type_id" className="fw-normal">
                              Select Country <span className="req">*</span>
                            </label>
                            {formErr.franchise_country &&
                              <p className="err">{formErr.franchise_country}</p>}
                          </div>
                        </div>
  
                        <div className="col-md-4">
                          <div className="form-floating">
                            <select
                              className="form-select"
                              name="franchise_state"
                              id="franchise_state"
                              onChange={handleForm}
                              value={form?.franchise_state || ''}
                            >
                              <option value="default">State</option>
                              {states.map((state, index) => (
                                <option key={index} value={state.state_code}>
                                  {state.state_name}
                                </option>
                              ))}
                            </select>
                            <label htmlFor="state_code" className="fw-normal">
                              Select State <span className="req">*</span>
                            </label>
                            {formErr.franchise_state && <p className="err">{formErr.franchise_state}</p>}
                          </div>
                        </div>
  
                        <div className="col-md-4">
                          <div className="form-floating">
                            <select
                              className="form-select"
                              name="franchise_city"
                              id="franchise_city"
                              onChange={handleForm}
                              value={form?.franchise_city || ''}
                            >
                              <option value="default">Select</option>
                              {cities.map((city, index) => (
                                <option key={index + 1} value={city.city_code}>
                                  {city.city_name}
                                </option>
                              ))}
                            </select>
                            <label htmlFor="city_code" className="fw-normal">
                              Select City <span className="req">*</span>
                            </label>
                            {formErr.franchise_city && <p className="err">{formErr.franchise_city}</p>}
                          </div>
                        </div>
                        <div className="col-md-12 mt-3">
                          <div className="form-floating mb-3">
                            <input
                              className="form-control"
                              type="text"
                              id="franchise_address"
                              placeholder=""
                              name="franchise_address"
                              height={200}
                              value={form.franchise_address || ''}
                              onChange={handleForm}
                            />
                            <label htmlFor="franchise_address" className="fw-normal">
                              Address
                            </label>
                            {formErr.franchise_address && <p className="err">{formErr.franchise_address}</p>}
                          </div>
                        </div>
                        <div className="col-md-12"><h5 className="asint mb-3">Login Credentials</h5></div>
                        <div className="col-md-4">
                          <div className="form-floating mb-3">
                            <input
                              className="form-control"
                              type="text"
                              id="username"
                              placeholder=""
                              name="username"
                              value={form.username || ''}
                              onChange={handleForm}
                            />
                            <label htmlFor="username" className="fw-normal">
                              Login User Name : <span className="req">*</span>
                            </label>
                            {formErr.username && <p className="err">{formErr.username}</p>}
                          </div>
                        </div>
                        <div className="col-md-4">
                          <div className="form-floating mb-3">
                            <input
                              className="form-control"
                              type="password"
                              id="password"
                              name="password"
                              placeholder=""
                              value={form.password || ''}
                              onChange={handleForm}
                            />
                            <label htmlFor="password" className="fw-normal">
                              Password : <span className="req">*</span>
                            </label>
                            {formErr.password && <p className="err">{formErr.password}</p>}
                          </div>
                        </div>
                        <div className="col-md-4">
                          <div className="form-floating mb-3">
                            <input
                              className="form-control"
                              type="password"
                              id="login_Re_Password"
                              name="login_Re_Password"
                              placeholder=""
                              value={form.login_Re_Password || ''}
                              onChange={handleForm}
                            />
                            <label htmlFor="login_Re_Password" className="fw-normal">
                              Re-Type Password : <span className="req">*</span>
                            </label>
                            {formErr.login_Re_Password && <p className="err">{formErr.login_Re_Password}</p>}
                          </div>
                        </div>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
  
              <div className="card mb-4">
                <div className="card-header"><h4 className="card-title">Owner Details</h4></div>
                <div className="card-body p-4">
                  <form className="custom-validation row">
                    <div className="col-md-8">
                      <div className="row">
                        <div className="col-md-12">
                          <div className="form-floating mb-3">
                            <input
                              className="form-control"
                              type="text"
                              id="contact_person"
                              name="contact_person"
                              placeholder=""
                              value={form.contact_person || ''}
                              onChange={handleForm}
                            />
                            <label htmlFor="contact_person" className="fw-normal">
                              Owner Name : <span className="req">*</span>
                            </label>
                            {formErr.contact_person && <p className="err">{formErr.contact_person}</p>}
                          </div>
                        </div>
  
                        <div className="col-md-6">
                          <div className="form-floating mb-3">
                            <input
                              className="form-control"
                              type="number"
                              id="contact_primary_phone"
                              name="contact_primary_phone"
                              placeholder=""
                              value={form.contact_primary_phone || ''}
                              onChange={handleForm}
                            />
                            <label htmlFor="contact_primary_phone" className="fw-normal">
                              Primary Phone: <span className="req">*</span>
                            </label>
                            {formErr.contact_primary_phone &&
                              <p className="err">{formErr.contact_primary_phone}</p>}
                          </div>
                        </div>
  
                        <div className="col-md-6">
                          <div className="form-floating mb-3">
                            <input
                              className="form-control"
                              type="number"
                              id="owner_sec_phone"
                              name="owner_sec_phone"
                              placeholder=""
                              value={form.owner_sec_phone || ''}
                              onChange={handleForm}
                            />
                            <label htmlFor="owner_sec_phone" className="fw-normal">
                              Secondary Phone :
                            </label>
                          </div>
                        </div>
  
                        <div className="col-md-6">
                          <div className="form-floating mb-3">
                            <input
                              className="form-control"
                              type="email"
                              id="owner_email"
                              name="owner_email"
                              placeholder=""
                              onChange={handleForm}
                              value={form.owner_email || ''}
                            />
                            <label htmlFor="owner_email" className="fw-normal">
                              Primary Email : <span className="req">*</span>
                            </label>
                            {formErr.owner_email && <p className="err">{formErr.owner_email}</p>}
                          </div>
                        </div>
  
                        <div className="col-md-6">
                          <div className="form-floating mb-3">
                            <input
                              className="form-control"
                              type="email"
                              id="owner_sec_email"
                              placeholder=""
                              name="owner_sec_email"
                              value={form.owner_sec_email || ''}
                              onChange={handleForm}
                            />
                            <label htmlFor="owner_sec_email" className="fw-normal">
                              Secondary Email :
                            </label>
                          </div>
                        </div>
  
                        <div className="col-md-6 mt-3">
                          <div className="form-floating">
                            <input
                              type="date"
                              id="contact_dob"
                              className="form-control"
                              name="contact_dob"
                              value={form.contact_dob || ''}
                              onChange={handleForm}
                            />
                            <label htmlFor="contact_dob" className="fw-normal">Date of Birth</label>
                          </div>
                        </div>
  
                        <div className="col-md-6 mt-3">
                          {form.photo === undefined ?
                            <div className="form-floating">
                              <input
                                type="file"
                                id="bank-logo"
                                className="form-control"
                                name="photo"
                                accept="image/*"
                                onChange={handleImage}
                              />
                              <label htmlFor="project-type" className="fw-normal">Photo Upload </label>
                            </div>
                            :
                            <>
                              <div className="col-md-12 imgclass">
                                <img src={form?.photo || ''} width="150" height="80" />
                                <button className="btn btn-danger removebtn"
                                  onClick={() => setForm((prev) => ({
                                    ...prev,
                                    photo: undefined
                                  }))}
                                >Delete Image</button>
                              </div>
                            </>
                          }
                        </div>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
  
              <div className="card mb-4">
                <div className="card-header"><h4 className="card-title">Assigned Locations</h4></div>
                <div className="card-body p-4">
                  <form className="custom-validation row">
                    <div className="col-md-8">
                      <div className="row">
                        <div className="col-md-6">
                          <div className="form-floating mb-3">
                            <select
                              className="form-select"
                              name="assigned_country"
                              id="assigned_country"
                              value={form.assigned_country || ''}
                              onChange={handleForm}
                              disabled={form.assigned_country != undefined}
                            >
                              <option value>Select</option>
                              {countries.map((country, index) => (
                                <option key={index + 1} value={country.country_code}>
                                  {country.country_name}
                                </option>
                              ))}
                            </select>
                            <label htmlFor="assigned_country" className="fw-normal">
                              Select Country <span className="req">*</span>
                            </label>
                          </div>
                        </div>
  
                        <div className="col-md-6">
                          <div className="form-floating mb-3">
                            <select
                              className="form-select"
                              name="assigned_state"
                              id="assigned_state"
                              value={form.assigned_state || ''}
                              onChange={handleForm}
                              disabled={form.assigned_state != undefined}
                            >
                              <option value>Select </option>
                              {assignedStates.map((state, index) => (
                                <option key={index} value={state.state_code}>
                                  {state.state_name}
                                </option>
                              ))}
                            </select>
                            <label htmlFor="assigned_state" className="fw-normal">
                              Select State <span className="req">*</span>
                            </label>
                          </div>
                        </div>
  
                        <div className="col-md-6">
                          <div className="form-floating">
                            <select
                              className="form-select"
                              name="assigned_city"
                              id="assigned_city"
                              value={form.assigned_city || ''}
                              onChange={handleForm}
                              disabled={form.assigned_city != undefined}
                            >
                              <option value>Select </option>
                              {assignedCities.map((city, index) => (
                                <option key={index + 1} value={city.city_code}>
                                  {city.city_name}
                                </option>
                              ))}
                            </select>
                            <label htmlFor="assigned_city" className="fw-normal">
                              Select City <span className="req">*</span>
                            </label>
                          </div>
                        </div>
  
                        <div className="col-md-6">
                          <div className="form-floating mb-3">
                            <select
                              className="form-select"
                              name="locality"
                              id="locality"
                              onChange={handleForm}
                              autoComplete="off"
                              value={form?.locality || ''}>
                              <option value>Locality</option>
                              {localities.map((locality, index) => (
                                <option key={index} value={locality.locality_name}>
                                  {locality.locality_name}
                                </option>
                              ))}
                            </select>
                            <label htmlFor="locality" className="fw-normal">
                              Select Location <span className="req">*</span>
                            </label>
                          </div>
                        </div>
  
                        <div className="col-md-12">
                          <h5 className="asint mb-3">Select Locations List</h5>
                        </div>
  
                        <div className="table-responsive-md">
                          <table className="table text-nowrap mb-0">
                            <thead>
                              <tr>
                                <th>S.No</th>
                                <th>Country</th>
                                <th>state</th>
                                <th>city</th>
                                <th>Location </th>
                                <th>Action</th>
                              </tr>
                            </thead>
                            <tbody>
                              {form.assignedLocations.length > 0 ?
                                form.assignedLocations.map((each, index) => (
                                  <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td>{each.country}</td>
                                    <td>{each.state}</td>
                                    <td>{each.city}</td>
                                    <td>{each.locality}</td>
                                    <td onClick={() => removeLocation(index)}><MdDelete /></td>
                                  </tr>
                                ))
                                :
                                <tr>
                                  <td colSpan={5} className='text-center'>
                                    {formErr.locations ?
                                      <p className="err">{formErr.locations}</p>
                                      :
                                      <>
                                        Assign Locations
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
                  </form>
                </div>
              </div>
              <div className="card mb-4">
  <div class="card-header"><h4 class="card-title">Upload Documnets</h4></div>
  <div className="card-body row p-4">
          
                    <div className="col-md-4 mb-3">
                      <div className="form-floating">
                        <input
                          type="file"
                          id="corner"
                          className="form-control"
                          name="enter"
                          placeholder=""
                          required
                        />
                        <label htmlFor="corner" className="fw-normal">
                          Profile Picture
                        </label>
                      </div>
                    </div>
                    <div className="col-md-4 mb-3">
                      <div className="form-floating">
                        <input
                          type="file"
                          id="corner"
                          className="form-control"
                          name="enter"
                          placeholder=""
                          required
                        />
                        <label htmlFor="corner" className="fw-normal">
                          Bank Details
                        </label>
                      </div>
                    </div>
                    <div className="col-md-4 mb-3"></div>
                    <div className="col-md-4 mb-3">
                      <div className="form-floating">
                        <input
                          type="file"
                          id="corner"
                          className="form-control"
                          name="enter"
                          placeholder=""
                          required
                        />
                        <label htmlFor="corner" className="fw-normal">
                          RERA Registration Number
                        </label>
                      </div>
                    </div>
                    <div className="col-md-4 mb-3">
                      <div className="form-floating">
                        <input
                          type="file"
                          id="corner"
                          className="form-control"
                          name="enter"
                          placeholder=""
                          required
                        />
                        <label htmlFor="corner" className="fw-normal">
                          AADHAR CARD
                        </label>
                      </div>
                    </div>
                    <div className="col-md-4 mb-3"></div>
                    <div className="col-md-4 mb-3">
                      <div className="form-floating">
                        <input
                          type="file"
                          id="corner"
                          className="form-control"
                          name="enter"
                          placeholder=""
                          required
                        />
                        <label htmlFor="corner" className="fw-normal">
                          PAN CARD
                        </label>
                      </div>
                    </div>
                    <div className="col-md-4 mb-3">
                      <div className="form-floating">
                        <input
                          type="file"
                          id="corner"
                          className="form-control"
                          name="enter"
                          placeholder=""
                          required
                        />
                        <label htmlFor="corner" className="fw-normal">
                          GST Certificate
                        </label>
                      </div>
                    </div>
                    </div>
                    </div>
                    <div className="card mb-4">
                <div class="card-header"><h3 class="card-title">Franchise Tenure</h3></div>
                <div className='card-body p-4'>
                <form className="custom-validation">
                  <div className="row ">
                  
                
                    <div className="col-md-6 mb-3">
                      <div className="form-floating">
                        <input
                          type="date"
                          id="corner"
                          className="form-control"
                          name="enter"
                          placeholder=""
                          required
                        />
                        <label htmlFor="corner" className="fw-normal">
                          Start Date
                        </label>
                      </div>
                    </div>
                    <div className="col-md-6 mb-3">
                      <div className="form-floating">
                        <input
                          type="date"
                          id="corner"
                          className="form-control"
                          name="enter"
                          placeholder=""
                          required
                        />
                        <label htmlFor="corner" className="fw-normal">
                          End Date
                        </label>
                      </div>
                    </div> 
                 
                  </div>
                </form>
                </div>
              </div>
              <div className="card mb-4">
                <div className="card-header"><h4 className="card-title">Assign Projects</h4></div>
                <div className="card-body p-4">
                  <form className="custom-validation row">
                    <div className="col-md-8">
                      <div className="row">
                        <div className="col-md-12">
                          <div className="form-floating mb-3">
                            <select
                              className="form-select"
                              name="project_id"
                              id="project_id"
                              value={form.project_id || ''}
                              onChange={handleForm}
                            >
                              <option value>Select </option>
                              {filteredProjects.map((each, index) => (
                                <option key={index} value={each.id}>{each.name}</option>
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
                  </form>
                </div>
              </div>
              <div className="card mb-4">
      <div class="card-header"><h4 class="card-title">Role Assign to</h4></div>
      <div className="card-body p-4 row">
      <div className="col-md-6">
                  <div className="form-floating mb-3">
                    <select
                      className="form-select"
                      name="property_sub_type_id"
                      id="property_sub_type_id"
                      required="">
                        <option value="default"> Select Country Franchisee </option>
                 
                      <option value="default"> Country Franchisee </option>
                  
                    </select>
                    <label for="property_sub_type_id" className="fw-normal">
                      Select Role <span className="req">*</span>
                    </label>
                  </div>
                </div>
      <div className="col-md-6">
                  <div className="form-floating mb-3">
                    <select
                      className="form-select"
                      name="property_sub_type_id"
                      id="property_sub_type_id"
                      required="">
                        <option value="default"> Select Master Franchisee </option>
                 
                      {/* <option value="default"> Country Franchisee </option> */}
                  
                    </select>
                    <label for="property_sub_type_id" className="fw-normal">
                      Select Master Franchisee <span className="req">*</span>
                    </label>
                  </div>
                </div>
        </div>
      </div>
              <button onClick={handleSubmit}>Submit</button>
  
      </>
    );
  };
export default SuperFranchisee





