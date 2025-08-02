import { useState, useEffect, useCallback } from 'react';
import Loader from '../../components/common/Loader';
import Offcanvas from 'react-bootstrap/Offcanvas';
import { authClient, masterClient } from '../../utils/httpClient';
import { toastError, toastSuccess } from '../../utils/toast';
import { handleImages3 } from '../../utils/S3Handler';
import { MdDelete } from 'react-icons/md';
import { Button } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
// import {
//     fetchCountries,
//     fetchStates,
//     fetchCities,
//     fetchLocalities
// } from '../../helpers/apiHelpers'
// import DateModal from '../../components/reusable/DateModal'

const TeamLeaderList = () => {
    const userData = useSelector((state) => state.user.userData);

    // modal state
    const [showModal, setShowModal] = useState(false);
    const [selectedProject, setSelectedProject] = useState(null);
    const [dateValue, setDateValue] = useState('');

    const [loading, setLoading] = useState(false);
    const [show, setShow] = useState(false);
    const [cityOfficeList, setCityOfficeList] = useState([]);
    const [form, setForm] = useState({
        projects: [],
        locations: [],
    });

    const [countries, setCountries] = useState([]);
    const [states, setStates] = useState([]);
    const [cities, setCities] = useState([]);
    const [localities, setLocalities] = useState([]);
    const [projects, setProjects] = useState([]);
    const [filteredProjects, setFilteredProjects] = useState([]);
    const [formErr, setFormErrs] = useState({});

    const [assignedStates, setAssignedStates] = useState([]);
    const [assignedCities, setAssignedCities] = useState([]);

    // Modal handlers
    const handleClose = useCallback(() => {
        setShowModal(false);
        setSelectedProject(null);
        setDateValue('');
    }, []);

    const getCityOffices = async () => {
        setLoading(true);
        try {
            const res = await masterClient.get('cityOffice')
            if (res?.data?.status) {
                setCityOfficeList(res?.data?.data)
            }
        } catch (error) {
            toastError('Error getting Countries');
            console.log('Error while getting countries', error);
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        (async () => {
            setCountries(await fetchCountries());
        })()
        getCityOffices();
        getUnMappedProjects()
    }, [])

    const openEdit = async (id) => {
        const editData = cityOfficeList.find((office) => office.id === id)
        if (editData?.locations && editData?.locations.length > 0) {
            setLocalities(await fetchLocalities(editData?.locations[0]?.city))
            editData.assigned_country = editData?.locations[0]?.country;
            editData.assigned_state = editData?.locations[0]?.state;
            editData.assigned_city = editData?.locations[0]?.city;
        }
        setShow(true)
        setForm(editData)
        if (editData != null && editData != undefined) {
            setStates(await fetchStates(editData?.country))
            setCities(await fetchCities(editData?.state))
            setAssignedStates(await fetchStates(editData?.assigned_country))
            setAssignedCities(await fetchCities(editData?.assigned_state))
        }
    }

    useEffect(() => {
        console.log(form)
    }, [form])

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


    const handleForm = async (e) => {

        const { name, value } = e.target

        // ? assigned locations
        if (name === 'assigned_country') {
            setAssignedStates(await fetchStates(value))
        }

        if (name === 'assigned_state') {
            setAssignedCities(await fetchCities(value))
        }

        if (name == 'assigned_city') {
            setLocalities(await fetchLocalities(value))
        }

        // ? locations
        if (name === 'country') {
            setStates(await fetchStates(value))
        }

        if (name === 'state') {
            setCities(await fetchCities(value))
        }

        if (name == 'city') {
            setLocalities(await fetchLocalities(value))
        }

        // Check if project_id is selected
        if (name === "project_id") {


            const selectedProject = filteredProjects.find((project) => project.id == value);

            const filterProjects = filteredProjects.filter((project) => project.id != value)

            setFilteredProjects(filterProjects)

            // Ensure the project exists
            if (selectedProject) {

                const isDuplicate = form.projects.some(
                    (project) => project.id === selectedProject.id
                );

                if (!isDuplicate) {
                    setSelectedProject(selectedProject);
                    setShowModal(true);
                } else {
                    toastError('Project already assigned');
                }
            }
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

                    const isDuplicate = prev.locations.some(
                        (loc) => loc.locality === newLocation.locality
                    );

                    if (!isDuplicate) {
                        return {
                            ...updatedForm,
                            locations: [...prev.locations, newLocation],
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

            return updatedForm;
        });
    }

    const handleProjectAssignment = useCallback(() => {
        if (!selectedProject || !dateValue) {
            toastError('Please select a date');
            return;
        }

        const newProject = {
            id: selectedProject.id,
            project_name: selectedProject.name,
            leads_start_date: dateValue
        };

        setForm((prev) => ({
            ...prev,
            projects: [...prev.projects, newProject],
            project_id: "",
        }));

        handleClose();
    }, [selectedProject, dateValue, handleClose]);


    const handleSubmit = async (e) => {
        setLoading(true);
        try {
            let res = await masterClient.put(`cityOffice/${form.id}`, form);
            if (res?.data?.status) {
                toastSuccess(res?.data?.message);
                setShow(false);
                updateProjects();
                getCityOffices();
                updateLocations();
                updateLoginCredentials();
            }
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    }

    const updateProjects = async () => {
        setLoading(true)
     
        let payload = {
            user_id: form?.id,
            user_type: 19,
            projectIds: form.projects
        };
        try {
            let res = await masterClient.post(`updateProjectAssigns`, payload)
            if (res?.data?.status) {
                toastSuccess('Projects Assigned Successfully');
            }
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false)
        }
    }

    const updateLocations = async () => {
        setLoading(true)
        let location = form.locations
        let payload = {
            user_id: form?.id,
            user_type: 19,
            locationIds: location,
            updated_by: userData?.id,
        };
        try {
            let res = await masterClient.post(`update-locations`, payload)
            if (res?.data?.status) {
                toastSuccess('Locations Assigned Successfully');
            }
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false)
        }
    }

    const updateLoginCredentials = async () => {
        setLoading(true);
        const payload = {
            role_id: 19,
            entity_id: form?.id,
            entity_type: 'city_office_admin',
            mobile: form?.city_office_primary_phone,
            email: form?.city_office_primary_email,
            user_name: form?.user_name,
            company_name: form?.city_office_name,
            address: form?.city_office_address,
            country: form?.country,
            state: form?.state,
            city: form?.city,
            updated_by: userData?.id,
        };
        try {
            const res = await authClient.post('updateUser', payload);
            if (res?.data?.status) {
                toastSuccess('Login Credentials Updated Successfully');
            }
        } catch (err) {
            console.log(err);
            toastError('Error while updating login credentials');
        } finally {
            setLoading(false);
        }
    }

    const getUnMappedProjects = async () => {
        setLoading(true);
        try {
            const res = await masterClient.get('projectname')
            if (res?.data?.status) {
                setProjects(res?.data?.data)
                setFilteredProjects(res?.data?.data)
            }
        } catch (error) {
            toastError('Error getting Countries');
            console.log('Error while getting countries', error);
        } finally {
            setLoading(false)
        }
    }

    const removeCityOffice = async (id) => {
        setLoading(true);
        try {
            const res = await masterClient.delete(`cityOffice/${id}`)
            if (res?.data?.status) {
                toastSuccess(res?.data?.message);
                getCityOffices();
            }
        } catch (error) {
            toastError('Error getting Countries');
            console.log('Error while getting countries', error);
        } finally {
            setLoading(false)
        }
    }

    const removeProject = async (id, user_id) => {
        const payload = {
            project_id: id,
            user_id: user_id,
            user_type: 19,
            updated_by: userData?.id,
        }
        setLoading(true);
        try {
            const res = await masterClient.post('removeProjects', payload)
            if (res?.data?.status) {
                toastSuccess(res?.data?.message);
                // getCityOffices();
                const formProjects = form.projects.filter((ele) => ele.id !== id)
                console.log('formProjects', formProjects)
                setForm((prev) => ({ ...prev, projects: formProjects }))
                getUnMappedProjects()
            }
        } catch (err) {
            console.log(err);
            toastError('Error while removing project')
        } finally {
            setLoading(false);
        }
    }

    const removeLocation = async (id = null, index = null) => {
        if (id) {
            setLoading(true);
            try {
                const res = await masterClient.delete(`assignLocations/${id}`)
                if (res?.data?.status) {
                    toastSuccess(res?.data?.message);
                    const updatedLocations = form.locations.filter((location) => location.id !== id);
                    setForm((prev) => ({
                        ...prev,
                        locations: updatedLocations,
                    }));
                    getCityOffices();
                }
            } catch (err) {
                console.log(err);
                toastError('Error while removing location')
            }

        } else {
            setForm((prev) => ({
                ...prev,
                locations: prev.locations.filter((_, i) => i !== index),
            }));
        }
    };

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
                                        <ol className="breadcrumb m-0">
                                            <li className="breadcrumb-item">
                                                <a href="/">Terraterri</a>
                                            </li>
                                            <li className="breadcrumb-item active">Team Leader List</li>
                                        </ol>
                                    </div>
                                    <div className="page-title-right">
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="row justify-content-center">
                            <div className="col-md-12">
                                <div className="card">
                                    <div className="card-header">
                                        <h3 className="card-title">Team Leader List</h3>
                                        <div className="">
                                            <input type="text" className="form-control" placeholder="Search by name" />
                                        </div>
                                    </div>
                                    <div className="card-body">
                                        <div className="table-responsive-md">
                                            <table className="table text-nowrap mb-0">
                                                <thead>
                                                    <tr>
                                                        <th>S.no</th>
                                                        <th>Name</th>
                                                        <th>City</th>
                                                        <th>Email</th>
                                                        <th>Number</th>
                                                        {/* <th>Address</th> */}
                                                        <th>View</th>
                                                        <th>Action</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {cityOfficeList.length > 0 ?
                                                        cityOfficeList.map((ele, index) => (
                                                            <tr key={index}>
                                                                <td>{index + 1}</td>
                                                                <td>{ele.office_head_name}</td>
                                                                <td>{ele.city_office_name}</td>
                                                                <td>{ele.city_office_primary_email}</td>
                                                                <td>{ele.city_office_primary_phone}</td>
                                                                {/* <td>{ele.city_office_address}</td> */}
                                                                <td><Link to='/teamleaderdetails'>View</Link></td>
                                                                <td>
                                                                    <i
                                                                        className="far fa-edit"
                                                                        onClick={() => openEdit(ele.id)}
                                                                    ></i>
                                                                    <i
                                                                        className="fa fa-trash"
                                                                        onClick={() => removeCityOffice(ele.id)}
                                                                    >

                                                                    </i>
                                                                </td>
                                                            </tr>
                                                        ))
                                                        :
                                                        <tr>
                                                            <td colSpan={8}>No Offices Found</td>
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

            {/* <Offcanvas show={show} onHide={() => setShow(false)} placement="end" className="prifile_edit">
                <Offcanvas.Header closeButton></Offcanvas.Header>
                <Offcanvas.Body>
                    <div className='card'>
                        <div className="card-header">
                            <h3 className="card-title">Edit Profile</h3>
                        </div>
                        <div className="card-body">
                            <div className="card mb-4">
                                <div className="card-header"><h4 className="card-title">City Office Details</h4></div>
                                <div className="card-body p-4">
                                    <form className="custom-validation row">
                                        <div className="col-md-8">
                                            <div className="row">
                                                <div className="col-md-12">
                                                    <div className="form-floating mb-3">
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            id="city_office_name"
                                                            name="city_office_name"
                                                            placeholder=""
                                                            onChange={handleForm}
                                                            value={form.city_office_name || ''}
                                                        />
                                                        <label htmlFor="city_office_name" className="fw-normal">
                                                            City Office Name : *
                                                        </label>
                                                    </div>
                                                </div>

                                                <div className="col-md-6">
                                                    <div className="form-floating mb-3">
                                                        <input
                                                            type="text"
                                                            id="city_office_primary_phone"
                                                            className="form-control"
                                                            name="city_office_primary_phone"
                                                            placeholder=""
                                                            onChange={handleForm}
                                                            value={form.city_office_primary_phone || ''}
                                                        />
                                                        <label htmlFor="city_office_primary_phone" className="fw-normal">
                                                            Primary Phone: *
                                                        </label>
                                                    </div>
                                                </div>

                                                <div className="col-md-6">
                                                    <div className="form-floating mb-3">
                                                        <input
                                                            type="text"
                                                            id="city_office_secondary_phone"
                                                            className="form-control"
                                                            name="city_office_secondary_phone"
                                                            placeholder=""
                                                            onChange={handleForm}
                                                            value={form.city_office_secondary_phone || ''}
                                                        />
                                                        <label htmlFor="city_office_secondary_phone" className="fw-normal">
                                                            Secondary Phone :
                                                        </label>
                                                    </div>
                                                </div>

                                                <div className="col-md-6">
                                                    <div className="form-floating mb-3">
                                                        <input
                                                            type="text"
                                                            id="city_office_primary_email"
                                                            className="form-control"
                                                            name="city_office_primary_email"
                                                            placeholder=""
                                                            onChange={handleForm}
                                                            value={form.city_office_primary_email || ''}
                                                        />
                                                        <label htmlFor="city_office_primary_email" className="fw-normal">
                                                            Primary Email : *
                                                        </label>
                                                    </div>
                                                </div>

                                                <div className="col-md-6">
                                                    <div className="form-floating mb-3">
                                                        <input
                                                            type="text"
                                                            id="city_office_secondary_email"
                                                            className="form-control"
                                                            name="city_office_secondary_email"
                                                            placeholder=""
                                                            onChange={handleForm}
                                                            value={form.city_office_secondary_email || ''}
                                                        />
                                                        <label htmlFor="city_office_secondary_email" className="fw-normal">
                                                            Secondary Email :
                                                        </label>
                                                    </div>
                                                </div>

                                                <div className="col-md-12"><h5 className="asint mb-3">Office Address</h5></div>
                                                <div className="col-md-4">
                                                    <div className="form-floating">
                                                        <select
                                                            className="form-select"
                                                            name="country"
                                                            id="country"
                                                            onChange={handleForm}
                                                            value={form.country || ''}
                                                        >
                                                            <option value="default">Select </option>
                                                            {countries.length > 0 &&
                                                                countries.map((ele, index) => (
                                                                    <option key={index} value={ele.country_code}>
                                                                        {ele.country_name}
                                                                    </option>
                                                                ))
                                                            }
                                                        </select>
                                                        <label htmlFor="country" className="fw-normal">
                                                            Select Country <span className="req">*</span>
                                                        </label>
                                                    </div>
                                                </div>

                                                <div className="col-md-4">
                                                    <div className="form-floating">
                                                        <select
                                                            className="form-select"
                                                            name="state"
                                                            id="state"
                                                            onChange={handleForm}
                                                            value={form.state || ''}
                                                        >
                                                            <option value="default">Select </option>
                                                            {states.length > 0 &&
                                                                states.map((ele, index) => (
                                                                    <option key={index} value={ele.state_code}>{ele.state_name}</option>
                                                                ))
                                                            }
                                                        </select>
                                                        <label htmlFor="state" className="fw-normal">
                                                            Select State <span className="req">*</span>
                                                        </label>
                                                    </div>
                                                </div>

                                                <div className="col-md-4">
                                                    <div className="form-floating">
                                                        <select
                                                            className="form-select"
                                                            name="city"
                                                            id="city"
                                                            value={form.city || ''}
                                                            onChange={handleForm}
                                                        >
                                                            <option value="default">Select </option>
                                                            {cities.length > 0 &&
                                                                cities.map((ele, index) => (
                                                                    <option key={index} value={ele.city_code}>
                                                                        {ele.city_name}
                                                                    </option>
                                                                ))
                                                            }
                                                        </select>
                                                        <label htmlFor="city" className="fw-normal">
                                                            Select City <span className="req">*</span>
                                                        </label>
                                                    </div>
                                                </div>

                                                <div className="col-md-12 mt-3">
                                                    <div className="form-floating mb-3">
                                                        <input
                                                            type="text"
                                                            id="city_office_address"
                                                            className="form-control"
                                                            name="city_office_address"
                                                            placeholder=""
                                                            height={200}
                                                            onChange={handleForm}
                                                            value={form.city_office_address || ''}
                                                        />
                                                        <label htmlFor="city_office_address" className="fw-normal">
                                                            Address
                                                        </label>
                                                    </div>
                                                </div>

                                                <div className="col-md-12">
                                                    <h5 className="asint mb-3">Login Credentials</h5>
                                                </div>

                                                <div className="col-md-4">
                                                    <div className="form-floating mb-3">
                                                        <input
                                                            type="text"
                                                            id="user_name"
                                                            className="form-control"
                                                            name="user_name"
                                                            placeholder=""
                                                            onChange={handleForm}
                                                            value={form.user_name || ''}
                                                        />
                                                        <label htmlFor="user_name" className="fw-normal">
                                                            Login User Name : <span className="req">*</span>
                                                        </label>
                                                    </div>
                                                </div>

                                                <div className="col-md-4">
                                                    <div className="form-floating mb-3">
                                                        <input
                                                            type="password"
                                                            id="password"
                                                            className="form-control"
                                                            name="password"
                                                            placeholder=""
                                                            value={form.password || ''}
                                                            onChange={handleForm}
                                                        />
                                                        <label htmlFor="password" className="fw-normal">
                                                            Password : <span className="req">*</span>
                                                        </label>
                                                    </div>
                                                </div>

                                                <div className="col-md-4">
                                                    <div className="form-floating mb-3">
                                                        <input
                                                            type="password"
                                                            id="login_re_entered_password"
                                                            name="login_re_entered_password"
                                                            className="form-control"
                                                            value={form.login_re_entered_password || ''}
                                                            onChange={handleForm}
                                                            placeholder=""

                                                        />
                                                        <label htmlFor="corner" className="fw-normal">
                                                            Re-Type Password : <span className="req">*</span>
                                                        </label>
                                                    </div>
                                                </div>

                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </div>

                            <div className="card mb-4">
                                <div className="card-header"><h4 className="card-title">Office Head</h4></div>
                                <div className="card-body p-4">
                                    <form className="custom-validation row">
                                        <div className="col-md-8">
                                            <div className="row">
                                                <div className="col-md-12">
                                                    <div className="form-floating mb-3">
                                                        <input
                                                            type="text"
                                                            id="office_head_name"
                                                            className="form-control"
                                                            name="office_head_name"
                                                            placeholder=""
                                                            onChange={handleForm}
                                                            value={form.office_head_name || ''}
                                                        />
                                                        <label htmlFor="office_head_name" className="fw-normal">
                                                            Name : <span className="req">*</span>
                                                        </label>
                                                    </div>
                                                </div>

                                                <div className="col-md-6">
                                                    <div className="form-floating mb-3">
                                                        <input
                                                            type="text"
                                                            id="office_head_primary_phone"
                                                            className="form-control"
                                                            name="office_head_primary_phone"
                                                            placeholder=""
                                                            onChange={handleForm}
                                                            value={form.office_head_primary_phone || ''}
                                                        />
                                                        <label htmlFor="office_head_primary_phone" className="fw-normal">
                                                            Primary Phone: <span className="req">*</span>
                                                        </label>
                                                    </div>
                                                </div>

                                                <div className="col-md-6">
                                                    <div className="form-floating mb-3">
                                                        <input
                                                            type="text"
                                                            id="office_head_secondary_phone"
                                                            className="form-control"
                                                            name="office_head_secondary_phone"
                                                            placeholder=""
                                                            value={form.office_head_secondary_phone || ''}
                                                            onChange={handleForm}
                                                        />
                                                        <label htmlFor="office_head_secondary_phone" className="fw-normal">
                                                            Secondary Phone :
                                                        </label>
                                                    </div>
                                                </div>
                                                <div className="col-md-6">
                                                    <div className="form-floating mb-3">
                                                        <input
                                                            type="text"
                                                            id="office_head_primary_email"
                                                            className="form-control"
                                                            name="office_head_primary_email"
                                                            placeholder=""
                                                            onChange={handleForm}
                                                            value={form.office_head_primary_email || ''}
                                                        />
                                                        <label htmlFor="office_head_primary_email" className="fw-normal">
                                                            Primary Email : *
                                                        </label>
                                                    </div>
                                                </div>

                                                <div className="col-md-6">
                                                    <div className="form-floating mb-3">
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            placeholder=""
                                                            id="office_head_secondary_email"
                                                            name="office_head_secondary_email"
                                                            value={form.office_head_secondary_email || ''}
                                                            onChange={handleForm}
                                                        />
                                                        <label htmlFor="office_head_secondary_email" className="fw-normal">
                                                            Secondary Email :
                                                        </label>
                                                    </div>
                                                </div>

                                                <div className="col-md-6 mt-3">
                                                    <div className="form-floating">
                                                        <input
                                                            type="date"
                                                            id="office_head_date_of_birth"
                                                            className="form-control"
                                                            name="office_head_date_of_birth"
                                                            placeholder=""
                                                            value={form.office_head_date_of_birth || ''}
                                                            onChange={handleForm}
                                                        />
                                                        <label htmlFor="office_head_date_of_birth" className="fw-normal">
                                                            Date of Birth
                                                        </label>
                                                    </div>
                                                </div>

                                                <div className="col-md-6 mt-3">
                                                    <div className="form-floating">
                                                        {form.office_head_profile === undefined ?
                                                            <>
                                                                <input
                                                                    type="file"
                                                                    id="office_head_profile"
                                                                    name="office_head_profile"
                                                                    className="form-control"
                                                                    accept="image/*"
                                                                    onChange={handleImage}
                                                                />
                                                                <label htmlFor="office_head_profile" className="fw-normal">
                                                                    Photo Upload
                                                                </label>
                                                            </>
                                                            :
                                                            <>
                                                                <div className="col-md-12 imgclass">
                                                                    <img className="object-fit-cover" src={form?.office_head_profile || ''} width="150" height="80" />
                                                                    <button className="btn btn-danger removebtn"
                                                                        onClick={() => setForm((prev) => ({
                                                                            ...prev,
                                                                            office_head_profile: undefined
                                                                        }))}
                                                                    >Delete Image</button>
                                                                </div>
                                                            </>
                                                        }
                                                    </div>
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
                                                            disabled={form.locations.length > 0}
                                                        >
                                                            <option value>Select</option>
                                                            {countries.map((country, index) => (
                                                                <option key={index + 1} value={country.country_code}>
                                                                    {country.country_name}
                                                                </option>
                                                            ))}
                                                        </select>
                                                        <label htmlFor="property_sub_type_id" className="fw-normal">
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
                                                            disabled={form.locations.length > 0}
                                                        >
                                                            <option value>Select </option>
                                                            {assignedStates.map((state, index) => (
                                                                <option key={index} value={state.state_code}>
                                                                    {state.state_name}
                                                                </option>
                                                            ))}
                                                        </select>
                                                        <label htmlFor="property_sub_type_id" className="fw-normal">
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
                                                            disabled={form.locations.length > 0}
                                                        >
                                                            <option value>Select </option>
                                                            {assignedCities.map((city, index) => (
                                                                <option key={index + 1} value={city.city_code}>
                                                                    {city.city_name}
                                                                </option>
                                                            ))}
                                                        </select>
                                                        <label htmlFor="property_sub_type_id" className="fw-normal">
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
                                                            {form.locations.length > 0 ?
                                                                form.locations.map((each, index) => (
                                                                    <tr key={index}>
                                                                        <td>{index + 1}</td>
                                                                        <td>{each.country}</td>
                                                                        <td>{each.state}</td>
                                                                        <td>{each.city}</td>
                                                                        <td>{each.locality}</td>
                                                                        <td onClick={() => removeLocation(each.id, index)}><MdDelete /></td>
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
                                <div className="card-header"><h4 className="card-title">Assigned Projects</h4></div>
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
                                                            value={form?.project_id || ''}
                                                            onChange={handleForm}
                                                        >
                                                            <option value>Select </option>
                                                            {filteredProjects.length > 0 &&

                                                                filteredProjects.map((each, index) => (
                                                                    <option key={index} value={each.id}>{each.name}</option>
                                                                ))

                                                            }
                                                        </select>
                                                        <label htmlFor="property_sub_type_id" className="fw-normal">
                                                            Select Projects <span className="req">*</span>
                                                        </label>
                                                    </div>
                                                </div>
                                                <div className="col-md-12">
                                                    <h5 className="asint mb-3">Assigned Projects List</h5>
                                                </div>

                                                <div className="table-responsive-md">
                                                    <table className="table text-nowrap mb-0">
                                                        <thead>
                                                            <tr>
                                                                <th>S.No</th>
                                                                <th>Projects </th>
                                                                <th>Leads Start date </th>
                                                                <th>Action</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {form.projects.length > 0 ?
                                                                form.projects.map((each, index) => (
                                                                    <tr key={index + 1}>
                                                                        <td>{index + 1}</td>
                                                                        <td>{each.project_name}</td>
                                                                        <td>{each.leads_start_date}</td>
                                                                        <td onClick={() => removeProject(each.id, form?.id)}><MdDelete /></td>
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
                            <Button type="submit" onClick={handleSubmit}>Submit</Button>
                        </div>
                    </div>
                </Offcanvas.Body>
            </Offcanvas> */}

            {/* <DateModal
                show={showModal}
                onClose={handleClose}
                date={dateValue}
                setDate={setDateValue}
                onAccept={handleProjectAssignment}
            /> */}
        </>
    );
};

export default TeamLeaderList;
