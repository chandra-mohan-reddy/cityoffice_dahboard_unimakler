'use-strict';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import { useEffect, useState } from 'react';
import { PiBuildings } from 'react-icons/pi';
import { AiOutlineUser } from 'react-icons/ai';
import { IoIosMail } from 'react-icons/io';
import { FaMobileAlt } from 'react-icons/fa';
import { RiLockPasswordLine } from 'react-icons/ri';
import { GiModernCity } from 'react-icons/gi';
import { TbBuildingEstate } from 'react-icons/tb';
import { PiGlobeLight } from 'react-icons/pi';
import { Link, Navigate } from 'react-router-dom';

import { Carousel } from 'react-bootstrap';

import { toastError, toastSuccess } from '../utils/toast';
import { authClient, masterClient } from '../utils/httpClient';
import Loader from '../components/common/Loader';
import { useNavigate } from 'react-router-dom';

import { IoChevronBackOutline } from "react-icons/io5";


const Advertise = () => {
  const navigate = useNavigate();

  const [signUp, setSignUp] = useState(true);
  const [form, setForm] = useState({ role_id: 'Builder' });
  const [formError, setFormError] = useState({});
  const [formType, setFormType] = useState('Builder');
  const [loading, setLoading] = useState(false)
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);

  const handleTabs = async (e) => {
    if (formType !== e.target.innerHTML) {
      setFormType(e.target.innerHTML)
      setForm({})
      setFormError({})
      const registerAs = e.target.innerHTML;
      setFormType(registerAs);
      setForm((prev) => ({ ...prev, role_id: e.target.innerHTML }));
    }
  }

  useEffect(() => {
    console.log('form =====>', form);
  }, [form])

  const validate = () => {
    let isValid = true;
    const error = {};
    if (!form.company_name && formType !== 'Owner') {
      error.company_name = 'Company is required';
      isValid = false
    }
    // if (!form.username) {
    //   error.username = 'Name is required';
    //   isValid = false
    // }
    if (!form.mobile) {
      error.mobile = 'Mobile is required';
      isValid = false
    }
    if (!form.email) {
      error.email = 'Email is required';
      isValid = false
    }
    // if (!form.password) {
    //   error.password = 'Password is required';
    //   isValid = false
    // }
    // if (!form.cnf_password) {
    //   error.cnf_password = 'Confirm Password is required';
    //   isValid = false
    // }
    if (!form.country_code) {
      error.country_code = 'Country is required';
      isValid = false
    }
    if (!form.city_code) {
      error.city_code = 'City is required';
      isValid = false
    }
    if (!form.state_code) {
      error.state_code = 'State is required';
      isValid = false
    }
    setFormError(error);
    return isValid;
  }

  const handleForm = async (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }))

    if (name === 'country_code') {
      getStatesByCountry(value)
    }
    if (name === 'state_code') {
      getCitiesByState(value)
    }
  }

  const handleSubmit = async () => {
    if (validate()) {
      let res;
      setLoading(true)
      try {
        res = await authClient.post('register', form);
        console.log('result', res);
        if (res?.data?.status) {
          navigate('/login')
          toastSuccess('Registered Successfully! Please Login to coninue');
        } else {
          toastError('Please Try Again')
        }
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false)
      }
    } else {
      toastError('Please Enter Mandatory Fields');
      console.log('errors =====>', formError);
    }
  }

  useEffect(() => {
    getCountries()
  }, [])

  const getCountries = async () => {
    let res;
    setLoading(true)
    try {
      res = await masterClient.get('/country');
      if (res?.data.status) {
        setCountries(res?.data?.data)
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false)
    }
  }

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
  return (
    <>
      {loading && <Loader />}
      <main className="main advrt_out">

      <div className='bg_logns'><img src="/assets/images//houseBg.webp" /></div>
      
        <div className="login-bg login-area pt-120 pb-120">

          <Link to="https://terraterri.com/"><img src="/assets/images/logo.png" alt="logos" className='advt-logo' width={180} /></Link>
          <div className="container">
            <div className="row align-items-center">

              <div className="col-md-7">
                <div className='text-center advt-ads'>
                  {/* <p className='slide metclr1'>"Maximize Your Property's Exposure <br></br><span className='small-txt'>– Register and List Now!</span>"</p>
                        <p className='slide metclr2'>"List Your Property in the Metaverse <br></br><span className='small-txt'>– Let Buyers Immerse, Explore, and Connect Directly!</span>"</p>
                        <p className='slide metclr3'>"Discover the NextGen property Marketplace. <br></br><span className='small-txt'> – Innovative Listings, Immersive Experiences!</span>"</p> */}

                  {/* <div class="sliding-text">Fading in and out</div> */}


                  <Carousel>
                    <Carousel.Item>
                      <p className='slide metclr1'>"Maximize Your Property's Exposure <br></br><span className='small-txt'>– Register and List Now!</span>"</p>
                    </Carousel.Item>

                    <Carousel.Item>
                      <p className='slide metclr2'>"List Your Property in the Metaverse <br></br><span className='small-txt'>– Let Buyers Immerse, Explore, and Connect Directly!</span>"</p>
                    </Carousel.Item>

                    <Carousel.Item>
                      <p className='slide metclr3'>"Discover the NextGen property Marketplace. <br></br><span className='small-txt'> – Innovative Listings, Immersive Experiences!</span>"</p>
                    </Carousel.Item>
                  </Carousel>

                </div>
              </div>

              <div className="col-md-5 tabHome">
                <div className='titls-log'>
                   {/* <span>Before</span>  */}
                {/* <h4>Before Listing your properties. Please register Here</h4> */}
                <h4 className='formhed'>Listing your properties <span>or</span> <span className='bookyousl'>Booking your expo stall</span> </h4>
                <h4>Register here.</h4>
                <p>Are You a</p>
                </div>
                <Tabs>
                  <TabList onClick={handleTabs} className="tablistRegister">
                    <Tab className="tablists">Builder</Tab>
                    <Tab className="tablists">Exclusive Sales Partner</Tab>
                    <Tab className="tablists">Agent</Tab>
                    <Tab className="tablists">Owner</Tab>
                  </TabList>
                  <div className="registr_out">
                    {signUp && (
                      
                      <TabPanel className="tabpanelRegister">
                        <div className="row">
                          <div className="form-group col-md-12">
                            <input
                              type="text"
                              className="form-control formContoler"
                              placeholder="Company Name"
                              name='company_name'
                              onChange={handleForm}
                            />
                            <PiBuildings className="pibuilding" />
                            {formError.company_name && <p className="err">{formError.company_name}</p>}

                          </div>
                          {/* <div className="form-group col-md-12">
                            <input
                              type="text"
                              className="form-control formContoler"
                              placeholder="User name"
                              name='username'
                              onChange={handleForm}
                            />
                            <AiOutlineUser className="pibuilding" />
                            {formError.username && <p className="err">{formError.username}</p>}

                          </div> */}
                          <div className="form-group col-md-4 pr-0">
                            <span className='down-arw'></span>
                            <select
                              type="text"
                              className="form-control formContoler"
                              placeholder="Country"
                              name='country_code'
                              onChange={handleForm}
                            >
                              <option value="default">Country</option>
                              {countries.map((country, index) => (
                                <option key={index + 1} value={country.country_code}>
                                  {country.country_name}
                                </option>
                              ))}
                            </select>
                            <TbBuildingEstate className="pibuilding" />
                            {formError.country_code && <p className="err">{formError.country_code}</p>}
                          </div>
                          <div className="form-group col-md-4 pr-0">
                          <span className='down-arw'></span>
                            <select
                              type="text"
                              className="form-control formContoler"
                              placeholder="State"
                              name='state_code'
                              onChange={handleForm}
                            >
                              <option value="default">State</option>
                              {states.map((state, index) => (
                                <option key={index + 1} value={state.state_code}>
                                  {state.state_name}
                                </option>
                              ))}
                            </select>
                            <TbBuildingEstate className="pibuilding" />
                            {formError.state_code && <p className="err">{formError.state_code}</p>}

                          </div>
                          <div className="form-group col-md-4">
                          <span className='down-arw'></span>
                            <select
                              className="form-select"
                              name="city_code"
                              id="city_code"
                              required
                              onChange={handleForm}
                            >
                              <option value="default">City / Town</option>
                              {cities.map((city, index) => (
                                <option key={index + 1} value={city.city_code}>
                                  {city.city_name}
                                </option>
                              ))}
                            </select>
                            <GiModernCity className="pibuilding" />
                            {formError.city_code && <p className="err">{formError.city_code}</p>}
                          </div>


                          <div className="form-group col-md-12">
                            <input
                              type="email"
                              className="form-control formContoler"
                              placeholder="Email"
                              name='email'
                              onChange={handleForm}
                            />
                            <IoIosMail className="pibuilding" />
                            {formError.email && <p className="err">{formError.email}</p>}

                          </div>

                          
                          
                          <div className="form-group col-md-12">
                            <div className='d-flex'>
                              <input
                                type="text"
                                className="form-control formContoler"
                                placeholder="Mobile"
                                name='mobile'
                                onChange={handleForm}
                              />
                              <button className='gt-otp '>Get OTP</button>
                            </div>
                            <FaMobileAlt className="pibuilding" />
                            {formError.mobile && <p className="err">{formError.mobile}</p>}

                          </div>
                          <div className="form-group col-md-12">
                            <input
                              type="number"
                              className="form-control formContoler"
                              placeholder="Enter OTP"
                              name='otp'
                              onChange={handleForm}
                            />
                            <FaMobileAlt className="pibuilding" />
                            {formError.mobile && <p className="err">{formError.mobile}</p>}

                          </div>

                          {/* <div className="form-group col-md-6">
                            <input
                              type="password"
                              className="form-control formContoler"
                              placeholder="Password"
                              name='password'
                              onChange={handleForm}
                            />
                            <RiLockPasswordLine className="pibuilding" />
                            {formError.password && <p className="err">{formError.password}</p>}

                          </div>
                          <div className="form-group col-md-6">
                            <input
                              type="password"
                              className="form-control formContoler"
                              placeholder="Confirm Password"
                              name='cnf_password'
                              onChange={handleForm}
                            />
                            <RiLockPasswordLine className="pibuilding" />
                            {formError.cnf_password && <p className="err">{formError.cnf_password}</p>}

                          </div> */}
                      

                          <div className="mb-3">
                            <div className="chk-notification">
                              <input type="checkbox" id="chk-whatsapp" />{' '}
                              <label htmlFor="chk-whatsapp" className="ml-10">
                                {' '}
                                I Agree to Terrateri' <a href="/">T&amp;C</a> ,{' '}
                                <a href="/">Privacy Policy</a> &amp; <a href="/">Cookie Policy</a>
                              </label>
                            </div>
                          </div>

                          <div className="d-flex align-items-center col-md-12 m-auto">
                            <button name="submit" className="theme-btn" onClick={handleSubmit}>
                              Register
                            </button>
                          </div>
                          <p className="text-center mt-3 alreadyaccount">
                            Have an account already? <Link to="/login">Sign in</Link>
                          </p>
                        </div>
                      </TabPanel>
                    )}

                    {signUp && (
                      <TabPanel className="tabpanelRegister">
                       <div className="row">
                          <div className="form-group col-md-12">
                            <input
                              type="text"
                              className="form-control formContoler"
                              placeholder="Company Name"
                              name='company_name'
                              onChange={handleForm}
                            />
                            <PiBuildings className="pibuilding" />
                            {formError.company_name && <p className="err">{formError.company_name}</p>}

                          </div>
                          {/* <div className="form-group col-md-12">
                            <input
                              type="text"
                              className="form-control formContoler"
                              placeholder="User name"
                              name='username'
                              onChange={handleForm}
                            />
                            <AiOutlineUser className="pibuilding" />
                            {formError.username && <p className="err">{formError.username}</p>}

                          </div> */}
                          <div className="form-group col-md-4 pr-0">
                            <span className='down-arw'></span>
                            <select
                              type="text"
                              className="form-control formContoler"
                              placeholder="Country"
                              name='country_code'
                              onChange={handleForm}
                            >
                              <option value="default">Country</option>
                              {countries.map((country, index) => (
                                <option key={index + 1} value={country.country_code}>
                                  {country.country_name}
                                </option>
                              ))}
                            </select>
                            <TbBuildingEstate className="pibuilding" />
                            {formError.country_code && <p className="err">{formError.country_code}</p>}
                          </div>
                          <div className="form-group col-md-4 pr-0">
                          <span className='down-arw'></span>
                            <select
                              type="text"
                              className="form-control formContoler"
                              placeholder="State"
                              name='state_code'
                              onChange={handleForm}
                            >
                              <option value="default">State</option>
                              {states.map((state, index) => (
                                <option key={index + 1} value={state.state_code}>
                                  {state.state_name}
                                </option>
                              ))}
                            </select>
                            <TbBuildingEstate className="pibuilding" />
                            {formError.state_code && <p className="err">{formError.state_code}</p>}

                          </div>
                          <div className="form-group col-md-4">
                          <span className='down-arw'></span>
                            <select
                              className="form-select"
                              name="city_code"
                              id="city_code"
                              required
                              onChange={handleForm}
                            >
                              <option value="default">City / Town</option>
                              {cities.map((city, index) => (
                                <option key={index + 1} value={city.city_code}>
                                  {city.city_name}
                                </option>
                              ))}
                            </select>
                            <GiModernCity className="pibuilding" />
                            {formError.city_code && <p className="err">{formError.city_code}</p>}
                          </div>


                          <div className="form-group col-md-12">
                            <input
                              type="email"
                              className="form-control formContoler"
                              placeholder="Email"
                              name='email'
                              onChange={handleForm}
                            />
                            <IoIosMail className="pibuilding" />
                            {formError.email && <p className="err">{formError.email}</p>}

                          </div>

                          
                          
                          <div className="form-group col-md-12">
                            <div className='d-flex'>
                              <input
                                type="text"
                                className="form-control formContoler"
                                placeholder="Mobile"
                                name='mobile'
                                onChange={handleForm}
                              />
                              <button className='gt-otp '>Get OTP</button>
                            </div>
                            <FaMobileAlt className="pibuilding" />
                            {formError.mobile && <p className="err">{formError.mobile}</p>}

                          </div>
                          <div className="form-group col-md-12">
                            <input
                              type="number"
                              className="form-control formContoler"
                              placeholder="Enter OTP"
                              name='otp'
                              onChange={handleForm}
                            />
                            <FaMobileAlt className="pibuilding" />
                            {formError.mobile && <p className="err">{formError.mobile}</p>}

                          </div>

                          {/* <div className="form-group col-md-6">
                            <input
                              type="password"
                              className="form-control formContoler"
                              placeholder="Password"
                              name='password'
                              onChange={handleForm}
                            />
                            <RiLockPasswordLine className="pibuilding" />
                            {formError.password && <p className="err">{formError.password}</p>}

                          </div>
                          <div className="form-group col-md-6">
                            <input
                              type="password"
                              className="form-control formContoler"
                              placeholder="Confirm Password"
                              name='cnf_password'
                              onChange={handleForm}
                            />
                            <RiLockPasswordLine className="pibuilding" />
                            {formError.cnf_password && <p className="err">{formError.cnf_password}</p>}

                          </div> */}
                      

                          <div className="mb-3">
                            <div className="chk-notification">
                              <input type="checkbox" id="chk-whatsapp" />{' '}
                              <label htmlFor="chk-whatsapp" className="ml-10">
                                {' '}
                                I Agree to Terrateri' <a href="/">T&amp;C</a> ,{' '}
                                <a href="/">Privacy Policy</a> &amp; <a href="/">Cookie Policy</a>
                              </label>
                            </div>
                          </div>

                          <div className="d-flex align-items-center col-md-12 m-auto">
                            <button name="submit" className="theme-btn" onClick={handleSubmit}>
                              Register
                            </button>
                          </div>
                          <p className="text-center mt-3 alreadyaccount">
                            Have an account already? <Link to="/login">Sign in</Link>
                          </p>
                        </div>
                      </TabPanel>
                    )}

                    {signUp && (
                      <TabPanel className="tabpanelRegister">
                        <div className="row">
                          <div className="form-group col-md-12">
                            <input
                              type="text"
                              className="form-control formContoler"
                              placeholder="Company Name"
                              name='company_name'
                              onChange={handleForm}
                            />
                            <PiBuildings className="pibuilding" />
                            {formError.company_name && <p className="err">{formError.company_name}</p>}

                          </div>
                          {/* <div className="form-group col-md-12">
                            <input
                              type="text"
                              className="form-control formContoler"
                              placeholder="User name"
                              name='username'
                              onChange={handleForm}
                            />
                            <AiOutlineUser className="pibuilding" />
                            {formError.username && <p className="err">{formError.username}</p>}

                          </div> */}
                          <div className="form-group col-md-4 pr-0">
                            <span className='down-arw'></span>
                            <select
                              type="text"
                              className="form-control formContoler"
                              placeholder="Country"
                              name='country_code'
                              onChange={handleForm}
                            >
                              <option value="default">Country</option>
                              {countries.map((country, index) => (
                                <option key={index + 1} value={country.country_code}>
                                  {country.country_name}
                                </option>
                              ))}
                            </select>
                            <TbBuildingEstate className="pibuilding" />
                            {formError.country_code && <p className="err">{formError.country_code}</p>}
                          </div>
                          <div className="form-group col-md-4 pr-0">
                          <span className='down-arw'></span>
                            <select
                              type="text"
                              className="form-control formContoler"
                              placeholder="State"
                              name='state_code'
                              onChange={handleForm}
                            >
                              <option value="default">State</option>
                              {states.map((state, index) => (
                                <option key={index + 1} value={state.state_code}>
                                  {state.state_name}
                                </option>
                              ))}
                            </select>
                            <TbBuildingEstate className="pibuilding" />
                            {formError.state_code && <p className="err">{formError.state_code}</p>}

                          </div>
                          <div className="form-group col-md-4">
                          <span className='down-arw'></span>
                            <select
                              className="form-select"
                              name="city_code"
                              id="city_code"
                              required
                              onChange={handleForm}
                            >
                              <option value="default">City / Town</option>
                              {cities.map((city, index) => (
                                <option key={index + 1} value={city.city_code}>
                                  {city.city_name}
                                </option>
                              ))}
                            </select>
                            <GiModernCity className="pibuilding" />
                            {formError.city_code && <p className="err">{formError.city_code}</p>}
                          </div>


                          <div className="form-group col-md-12">
                            <input
                              type="email"
                              className="form-control formContoler"
                              placeholder="Email"
                              name='email'
                              onChange={handleForm}
                            />
                            <IoIosMail className="pibuilding" />
                            {formError.email && <p className="err">{formError.email}</p>}

                          </div>

                          
                          
                          <div className="form-group col-md-12">
                            <div className='d-flex'>
                              <input
                                type="text"
                                className="form-control formContoler"
                                placeholder="Mobile"
                                name='mobile'
                                onChange={handleForm}
                              />
                              <button className='gt-otp '>Get OTP</button>
                            </div>
                            <FaMobileAlt className="pibuilding" />
                            {formError.mobile && <p className="err">{formError.mobile}</p>}

                          </div>
                          <div className="form-group col-md-12">
                            <input
                              type="number"
                              className="form-control formContoler"
                              placeholder="Enter OTP"
                              name='otp'
                              onChange={handleForm}
                            />
                            <FaMobileAlt className="pibuilding" />
                            {formError.mobile && <p className="err">{formError.mobile}</p>}

                          </div>

                          {/* <div className="form-group col-md-6">
                            <input
                              type="password"
                              className="form-control formContoler"
                              placeholder="Password"
                              name='password'
                              onChange={handleForm}
                            />
                            <RiLockPasswordLine className="pibuilding" />
                            {formError.password && <p className="err">{formError.password}</p>}

                          </div>
                          <div className="form-group col-md-6">
                            <input
                              type="password"
                              className="form-control formContoler"
                              placeholder="Confirm Password"
                              name='cnf_password'
                              onChange={handleForm}
                            />
                            <RiLockPasswordLine className="pibuilding" />
                            {formError.cnf_password && <p className="err">{formError.cnf_password}</p>}

                          </div> */}
                      

                          <div className="mb-3">
                            <div className="chk-notification">
                              <input type="checkbox" id="chk-whatsapp" />{' '}
                              <label htmlFor="chk-whatsapp" className="ml-10">
                                {' '}
                                I Agree to Terrateri' <a href="/">T&amp;C</a> ,{' '}
                                <a href="/">Privacy Policy</a> &amp; <a href="/">Cookie Policy</a>
                              </label>
                            </div>
                          </div>

                          <div className="d-flex align-items-center col-md-12 m-auto">
                            <button name="submit" className="theme-btn" onClick={handleSubmit}>
                              Register
                            </button>
                          </div>
                          <p className="text-center mt-3 alreadyaccount">
                            Have an account already? <Link to="/login">Sign in</Link>
                          </p>
                        </div>
                      </TabPanel>
                    )}

                    {signUp && (
                      <TabPanel className="tabpanelRegister">
                       <div className="row">
                          <div className="form-group col-md-12">
                            <input
                              type="text"
                              className="form-control formContoler"
                              placeholder="Company Name"
                              name='company_name'
                              onChange={handleForm}
                            />
                            <PiBuildings className="pibuilding" />
                            {formError.company_name && <p className="err">{formError.company_name}</p>}

                          </div>
                          {/* <div className="form-group col-md-12">
                            <input
                              type="text"
                              className="form-control formContoler"
                              placeholder="User name"
                              name='username'
                              onChange={handleForm}
                            />
                            <AiOutlineUser className="pibuilding" />
                            {formError.username && <p className="err">{formError.username}</p>}

                          </div> */}
                          <div className="form-group col-md-4 pr-0">
                            <span className='down-arw'></span>
                            <select
                              type="text"
                              className="form-control formContoler"
                              placeholder="Country"
                              name='country_code'
                              onChange={handleForm}
                            >
                              <option value="default">Country</option>
                              {countries.map((country, index) => (
                                <option key={index + 1} value={country.country_code}>
                                  {country.country_name}
                                </option>
                              ))}
                            </select>
                            <TbBuildingEstate className="pibuilding" />
                            {formError.country_code && <p className="err">{formError.country_code}</p>}
                          </div>
                          <div className="form-group col-md-4 pr-0">
                          <span className='down-arw'></span>
                            <select
                              type="text"
                              className="form-control formContoler"
                              placeholder="State"
                              name='state_code'
                              onChange={handleForm}
                            >
                              <option value="default">State</option>
                              {states.map((state, index) => (
                                <option key={index + 1} value={state.state_code}>
                                  {state.state_name}
                                </option>
                              ))}
                            </select>
                            <TbBuildingEstate className="pibuilding" />
                            {formError.state_code && <p className="err">{formError.state_code}</p>}

                          </div>
                          <div className="form-group col-md-4">
                          <span className='down-arw'></span>
                            <select
                              className="form-select"
                              name="city_code"
                              id="city_code"
                              required
                              onChange={handleForm}
                            >
                              <option value="default">City / Town</option>
                              {cities.map((city, index) => (
                                <option key={index + 1} value={city.city_code}>
                                  {city.city_name}
                                </option>
                              ))}
                            </select>
                            <GiModernCity className="pibuilding" />
                            {formError.city_code && <p className="err">{formError.city_code}</p>}
                          </div>


                          <div className="form-group col-md-12">
                            <input
                              type="email"
                              className="form-control formContoler"
                              placeholder="Email"
                              name='email'
                              onChange={handleForm}
                            />
                            <IoIosMail className="pibuilding" />
                            {formError.email && <p className="err">{formError.email}</p>}

                          </div>

                          
                          
                          <div className="form-group col-md-12">
                            <div className='d-flex'>
                              <input
                                type="text"
                                className="form-control formContoler"
                                placeholder="Mobile"
                                name='mobile'
                                onChange={handleForm}
                              />
                              <button className='gt-otp '>Get OTP</button>
                            </div>
                            <FaMobileAlt className="pibuilding" />
                            {formError.mobile && <p className="err">{formError.mobile}</p>}

                          </div>
                          <div className="form-group col-md-12">
                            <input
                              type="number"
                              className="form-control formContoler"
                              placeholder="Enter OTP"
                              name='otp'
                              onChange={handleForm}
                            />
                            <FaMobileAlt className="pibuilding" />
                            {formError.mobile && <p className="err">{formError.mobile}</p>}

                          </div>

                          {/* <div className="form-group col-md-6">
                            <input
                              type="password"
                              className="form-control formContoler"
                              placeholder="Password"
                              name='password'
                              onChange={handleForm}
                            />
                            <RiLockPasswordLine className="pibuilding" />
                            {formError.password && <p className="err">{formError.password}</p>}

                          </div>
                          <div className="form-group col-md-6">
                            <input
                              type="password"
                              className="form-control formContoler"
                              placeholder="Confirm Password"
                              name='cnf_password'
                              onChange={handleForm}
                            />
                            <RiLockPasswordLine className="pibuilding" />
                            {formError.cnf_password && <p className="err">{formError.cnf_password}</p>}

                          </div> */}
                      

                          <div className="mb-3">
                            <div className="chk-notification">
                              <input type="checkbox" id="chk-whatsapp" />{' '}
                              <label htmlFor="chk-whatsapp" className="ml-10">
                                {' '}
                                I Agree to Terrateri' <a href="/">T&amp;C</a> ,{' '}
                                <a href="/">Privacy Policy</a> &amp; <a href="/">Cookie Policy</a>
                              </label>
                            </div>
                          </div>

                          <div className="d-flex align-items-center col-md-12 m-auto">
                            <button name="submit" className="theme-btn" onClick={handleSubmit}>
                              Register
                            </button>
                          </div>
                          <p className="text-center mt-3 alreadyaccount">
                            Have an account already? <Link to="/login">Sign in</Link>
                          </p>
                        </div>
                      </TabPanel>
                    )}
                  </div>
                </Tabs>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default Advertise;
