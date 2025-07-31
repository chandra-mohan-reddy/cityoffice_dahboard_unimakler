import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Offcanvas from 'react-bootstrap/Offcanvas';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import axios from 'axios';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import moment from 'moment';
import Loader from '../components/common/Loader';

const BookaStall = () => {
  const [show, setShow] = useState(false);
  const [expos, setExpos] = useState([]);
  const [filteredExpos, setFilteredExpos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [showSlots, setShowSlots] = useState(false);
  const [filteredDates, setFilteredDates] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedExpo, setSelectedExpo] = useState(null);
  const [selectedStall, setSelectedStall] = useState('Diamond');
  const [stallPrice, setStallPrice] = useState('')
  const handleClose = () => {
    setShow(false);
  };

  const handleShow = () => setShow(true);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);

    script.onload = () => {
      // Razorpay script loaded
    };

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const HandleIntiatePayment = async () => {
    const data = new FormData();
    data.append('amount', 100);

    try {
      const response = await axios.post(
        'https://expoadminapi.terraterri.com/tt-expo-builder-be/stallBooking/initiatePayment.php',
        data
      );
      const { id, amount } = response.data;

      const options = {
        key: 'rzp_test_tm4DP29BcGGzff',
        amount: amount,
        currency: 'INR',
        name: 'Your Company Name',
        description: 'Test Transaction',
        order_id: id,
        handler: async function (response) {
          alert('Payment successful!');
          await verifyPayment(response);
        },
        prefill: {
          name: 'Your Name',
          email: 'srinivas.email@gmail.com',
          contact: '9999999999'
        },
        theme: {
          color: '#F37254'
        }
      };

      const rzp1 = new window.Razorpay(options);
      rzp1.open();
    } catch (error) {
      console.error('Error creating order:', error);
    }
  };

  const verifyPayment = async (response) => {
    const verifyUrl = 'http://localhost/tt-expo-builder-be/stallBooking/verifyPayment.php';
    console.log(response)
    try {
      await axios.post(verifyUrl, response);
    } catch (error) {
      console.error('Error verifying payment:', error);
      alert('Payment verification failed!');
    }
  };



  const completedExpo = async () => {
    try {
      setLoading(true);
      const config = { headers: { 'Content-Type': 'application/json' } };
      const res = await axios.get(
        'https://expoadminapi.terraterri.com/NewExpo/get.php?type=future&limit=40&skip=0',
        config
      );
      const exposData = res.data.data;
      setExpos(exposData);
    } catch (err) {
      console.error("Error fetching expo data:", err);
      toastError('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    completedExpo();
  }, []);

  useEffect(() => {
    const applyFilters = () => {
      let filteredExposData = expos;

      if (selectedCountry) {
        filteredExposData = filteredExposData.filter((expo) => expo.expoCountry === selectedCountry);
      }

      if (selectedCity) {
        filteredExposData = filteredExposData.filter((expo) => expo.expoCity === selectedCity);
      }

      if (selectedType) {
        filteredExposData = filteredExposData.filter((expo) => expo.expoType === selectedType);
      }

      setFilteredExpos(filteredExposData);
    };

    applyFilters();
  }, [selectedCountry, selectedCity, selectedType, expos]);

  useEffect(() => {
    // Filter dates based on the selected Expo type and City
    const applyDateFilter = () => {
      let filteredDates = filteredExpos;
      if (selectedType && selectedCity) {
        filteredDates = filteredDates.filter(
          (expo) => expo.expoType === selectedType && expo.expoCity === selectedCity
        );
      }
      setFilteredDates(filteredDates);
    };

    applyDateFilter();
  }, [selectedType, selectedCity, filteredExpos]);


  useEffect(() => {
    if (selectedCity && selectedType && selectedStall) {
      getStallPrices();
    }
  }, [selectedCity, selectedType, selectedStall])

  const selectExpo = (expo, value) => {
    setSelectedDate(value);
    setSelectedExpo(expo)
  }


  const getStallPrices = async () => {
    let res;
    try {
      setLoading(true)
      let body = {
        city: selectedCity,
        expoType: selectedType,
        stall: selectedStall
      }
      const config = { headers: { 'Content-Type': 'application/json' } };
      const res = await axios.post(
        'https://expoadminapi.terraterri.com/packages/getByType.php',
        body,
        config
      );
      if (res?.data?.status) {
        if (res?.data?.data != null) {
          setStallPrice(res?.data?.data?.amount)
        }
      }

    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false)
    }
  }

  const Stalltabs = [
    { tab: 'D', name: 'Diamond', className: 'daimond-clr' },
    { tab: 'P', name: 'Platinum', className: 'platinum-clr' },
    { tab: 'G', name: 'Gold', className: 'gold-clr' },
    { tab: 'S', name: 'Standard', className: 'standrd-clr' },
  ];

  const selectTab = (stall) => {
    setSelectedStall(stall)
  }


  return (
    <>
      {loading && <Loader />}
      <div className="main-content">
        <div className="page-content">
          <div className="container">
            <div className="cardd metavrse_out">
              <div className="container">
                <div className="titles_lne  text-center mb-4">
                  <h4>THE METAVERSE REALESTATE EXPO</h4>
                  <p>Showcase Your Projects at the Premier Metaverse Realestate Expo</p>
                </div>
                <div className="row slet_out">
                  <div className="col-md-3 stateBox">
                    <div className="d-flex sel_blo">
                      <span>Select Country:</span>
                      <select className="form-select formcontrol" name="country" value={selectedCountry}
                        onChange={(e) => setSelectedCountry(e.target.value)}>
                        <option value="" >
                          Select
                        </option>
                        {[...new Set(expos.map((cExpo) => cExpo.expoCountry))].map((expoCountry, index) => (
                          <option key={index} value={expoCountry}>
                            {expoCountry}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="col-md-3 stateBox">
                    <div className="d-flex sel_blo">
                      <span>Select City:</span>
                      <select className="form-select formcontrol" name="city" value={selectedCity}
                        onChange={(e) => setSelectedCity(e.target.value)}>
                        <option value="">
                          Select
                        </option>
                        {[...new Set(expos
                          .filter((cExpo) => cExpo.expoCountry === selectedCountry)
                          .map((cExpo) => cExpo.expoCity))].map((expoCity, index) => (
                            <option key={index} value={expoCity}>
                              {expoCity}
                            </option>
                          ))}
                      </select>
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="d-flex sel_blo sel_bloo">
                      <span>Expo Type:</span>
                      <select className="form-select formcontrol" name="type" value={selectedType}
                        onChange={(e) => setSelectedType(e.target.value)}>
                        <option >
                          Select
                        </option>
                        {[...new Set(expos.map((cExpo) => cExpo.expoType))].map((expoType, index) => (
                          <option key={index} value={expoType}>
                            {expoType}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="d-flex sel_blo sel_bloo">
                      <span>Expo Date:</span>
                      <select
                        className="form-select formcontrol"
                        name="date"
                        value={selectedDate}
                        onChange={(e) => selectExpo(filteredDates[e.target.value], e.target.value)}
                      >
                        <option value="">Select</option>
                        {filteredDates.map((cExpo, index) => (
                          <option key={index} value={index}>
                            {moment(cExpo.fromDate).format("Do MMM YYYY")}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>


                <Tabs>
                  <div className='row align-items-center'>
                    <div className='col-md-3'><h3 className='mb-0'>Choose the Expo Stall </h3></div>
                    <div className='col-md-9'>
                      <TabList>
                        {Stalltabs.map((item, index) => (
                          <Tab onClick={() => selectTab(item.name)} className={item.className} key={index}>{item.name}</Tab>
                        ))}
                      </TabList>
                    </div>
                  </div>

                  {selectedExpo != null ?
                    <>
                      <div class="row mt-5 airprx_ot">
                        <div class="col-md-3"></div>
                        <div class="col-md-6">
                          <div class="bg-color1 bg-color-pnk bg-color-dmd">
                            <h4>{selectedStall}  Stall</h4>
                            <div class="pricing-item text-center">
                              <h2 class="gold">AIRPROPX - {selectedExpo.expoCity}</h2>
                              <h6>
                                THE METAVERSE <span>{selectedType}</span> REALESTATE EXPO
                              </h6>
                              <h6 class="vald-ot">10 &amp; 11 - March-2024</h6>
                              <h3>₹ {stallPrice ? stallPrice : '-'} / 1 Expo </h3>
                              <button class="purchage-btn" onClick={handleShow} href="#" role="button">
                                BOOK NOW
                              </button>
                            </div>
                          </div>
                        </div>
                        <div class="col-md-3"></div>
                      </div>
                    </>
                    :
                    <>
                      <TabPanel>
                        <div class="row mt-5 airprx_ot">
                          <div class="col-md-3"></div>
                          <div class="col-md-6">
                            <div class="pricing-item text-center">
                              <h6>
                                Please Select expo date
                              </h6>
                            </div>
                          </div>
                        </div>
                      </TabPanel>
                    </>
                  }

                </Tabs>

                <div className="text-center">
                  <h4>
                    Want to learn more about AirPropx and its sponsorships? <Link to="#">View</Link>
                  </h4>
                </div>

                <Modal show={show} onHide={handleClose} className="stall_popup">
                  <Modal.Header closeButton>
                    <div className='row w-100 '>
                      <div className='col-md-6'><h3>Expo Layout-Plan</h3></div>
                      <div className='col-md-6'><div className='paymet_bloo'><h3>Selected Package Details</h3></div></div>
                    </div>
                    {/* <h3>Selected Package Details</h3> */}
                  </Modal.Header>
                  <div className="py-3 px-5">
                    <div className="row">
                      <div className="col-md-6">


                        <div className='text-center map_outt'>
                          <img src="/assets/images/routemap.png" />
                          <div className='d-stall'>
                            <button>D</button>
                          </div>
                          <div className='p-stall'>
                            <button className='p1'>P1</button>
                            <button className='p2'>P2</button>

                          </div>
                          <div className='g-stall'>
                            <button className='g1'>G1</button>
                            <button className='g2'>G2</button>
                            <button className='g3'>G3</button>
                            <button className='g4'>G4</button>

                          </div>
                          <div className='s-stall'>
                            <button className='s1 selected'>S1</button>
                            <button className='s2 booked'>S2</button>
                            <button className='s3'>S3</button>
                            <button className='s4'>S4</button>
                            <button className='s5'>S5</button>
                            <button className='s6'>S6</button>
                            <button className='s7'>S7</button>
                            <button className='s8'>S8</button>
                            <button className='s9'>S9</button>
                            <button className='s10'>S10</button>
                            <button className='s11'>S11</button>
                            <button className='s12'>S12</button>
                            <button className='s13'>S13</button>
                            <button className='s14'>S14</button>
                            <button className='s15'>S15</button>
                            <button className='s16'>S16</button>
                            <button className='s17'>S17</button>
                            <button className='s18'>S18</button>
                            <button className='s19'>S19</button>
                            <button className='s20'>S20</button>
                          </div>
                        </div>
                        <div className='clr_bars row mt-2 align-items-center'>
                          <div className='col-md-4'>
                            <ul className='mb-0 p-0'>
                              <li><span className='avlb'></span> Available</li>
                              <li><span className='selt'></span> Selected</li>
                              <li><span className='bookd'></span> Booked</li>
                            </ul>
                          </div>
                          <div className='col-md-4'>
                            <ul className='mb-0 p-0'>
                              <li className='dimnr-clr'> <me className='mr-3'>D </me> : Daimond Stall</li>
                              <li className='pltnm-clr'> P1 & P2 : Platinum Stall</li>

                            </ul>
                          </div>
                          <div className='col-md-4'>
                            <ul className='mb-0 p-0'>

                              <li className='gld-clr'> G1 - G4 : Gold Stall</li>
                              <li className='stnd-clr'> S1 - S20 : Standard Stall</li>
                            </ul>
                          </div>

                        </div>
                      </div>
                      <div class="col-md-6">
                        <div className='paymet_blo'>

                          {/* <div className="col-md-12">
                                          <div class="heds">
                                            <h6>Selected Package Details</h6>
                                          </div>
                                      </div> */}
                          <div className='pay-card1 mb-2'>
                            <div className="row">
                              <div className='col-md-6'>
                                <div className='icn-paymts'>
                                  <svg
                                    stroke="currentColor"
                                    fill="currentColor"
                                    stroke-width="0"
                                    viewBox="0 0 384 512"
                                    height="1em"
                                    width="1em"
                                    xmlns="http://www.w3.org/2000/svg">
                                    <path d="M215.7 499.2C267 435 384 279.4 384 192C384 86 298 0 192 0S0 86 0 192c0 87.4 117 243 168.3 307.2c12.3 15.3 35.1 15.3 47.4 0zM192 128a64 64 0 1 1 0 128 64 64 0 1 1 0-128z"></path>
                                  </svg>
                                  <span>City : Hyderabad</span>
                                </div>
                              </div>
                              <div className='col-md-6'>
                                <div className='icn-paymts'>
                                  <svg
                                    stroke="currentColor"
                                    fill="currentColor"
                                    stroke-width="0"
                                    role="img"
                                    viewBox="0 0 24 24"
                                    height="1em"
                                    width="1em"
                                    xmlns="http://www.w3.org/2000/svg">
                                    <title></title>
                                    <path d="M0 20.084c.043.53.23 1.063.718 1.778.58.849 1.576 1.315 2.303.567.49-.505 5.794-9.776 8.35-13.29a.761.761 0 011.248 0c2.556 3.514 7.86 12.785 8.35 13.29.727.748 1.723.282 2.303-.567.57-.835.728-1.42.728-2.046 0-.426-8.26-15.798-9.092-17.078-.8-1.23-1.044-1.498-2.397-1.542h-1.032c-1.353.044-1.597.311-2.398 1.542C8.267 3.991.33 18.758 0 19.77Z"></path>
                                  </svg>
                                  <span>Expo Type : </span> <span>Residential</span>
                                </div>
                              </div>
                              <div className='col-md-6'>
                                <div className='icn-paymts'>
                                  <svg
                                    stroke="currentColor"
                                    fill="currentColor"
                                    stroke-width="0"
                                    viewBox="0 0 24 24"
                                    height="1em"
                                    width="1em"
                                    xmlns="http://www.w3.org/2000/svg">
                                    <path d="M14 6v15H3v-2h2V3h9v1h5v15h2v2h-4V6h-3zm-4 5v2h2v-2h-2z"></path>
                                  </svg>
                                  <span>Stall Type : </span> <span>Daimond</span>
                                </div>
                              </div>
                              <div className='col-md-6'>
                                <div className='icn-paymts'>
                                  <svg
                                    stroke="currentColor"
                                    fill="currentColor"
                                    stroke-width="0"
                                    viewBox="0 0 24 24"
                                    height="1em"
                                    width="1em"
                                    xmlns="http://www.w3.org/2000/svg">
                                    <path d="M14 6v15H3v-2h2V3h9v1h5v15h2v2h-4V6h-3zm-4 5v2h2v-2h-2z"></path>
                                  </svg>
                                  <span>Stall No :</span> <span>2</span>
                                </div>
                              </div>
                              <div class="stall-price mt-1 mb-0 d-flex">
                                Your Selected Package <span class="sle_blo"> : 2 Expos</span>
                              </div>
                            </div>
                          </div>
                          <div className='pay-card1 b_dates mb-2'>
                            <div className="row">
                              <div className='col-md-12'>
                                <div className='icn-paymts'>
                                  <svg
                                    stroke="currentColor"
                                    fill="currentColor"
                                    stroke-width="0"
                                    viewBox="0 0 24 24"
                                    height="1em"
                                    width="1em"
                                    xmlns="http://www.w3.org/2000/svg">
                                    <path fill="none" d="M0 0h24v24H0z"></path>
                                    <path d="M9 11H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2zm2-7h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20a2 2 0 002 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V9h14v11z"></path>
                                  </svg>
                                  <span> S3 Stall Available Expo Dates:-</span>
                                </div>
                              </div>
                              <div class="col-md-4">
                                <div class="w-100 s_date mb-3 selected">16-08-2024</div>
                              </div>
                              <div class="col-md-4">
                                <div class="w-100 s_date selected">16-09-2024</div>
                              </div>
                              <div class="col-md-4">
                                <div class="w-100 s_date">31-08-2024</div>
                              </div>
                              <div class="col-md-4">
                                <div class="w-100 s_date">31-12-2024</div>
                              </div>
                              <div class="col-md-4">
                                <div class="w-100 s_date">31-10-2024</div>
                              </div>

                            </div>
                          </div>
                          <div className='pay-card1'>
                            <div class="row btns-p">
                              <div class="col-md-12 text-right">
                                <div>
                                  <p className="rate_out d-flex align-items-center justify-content-end mb-0">Package Amout : <span class="pric_blo"> ₹ 108000</span></p>
                                  <p className="rate_out d-flex align-items-center justify-content-end mb-0">Estimated Gst : <span class="pric_blo"> ₹ 19440</span></p>
                                  <p className="total-amt d-flex align-items-center justify-content-end mb-0 br-top">Total Payable Amount : <span class="pric_blo">  ₹ 127440</span></p>
                                </div>
                              </div>
                              <div class="col-md-12 text-right">

                                <button
                                  class="grn"
                                  fdprocessedid="jbxtud"
                                  onClick={HandleIntiatePayment}>
                                  Buy Now
                                </button>
                              </div>
                            </div>
                          </div>
                          <div class="card-data">
                            <ul class="row m-0">
                              {/* <li className='col-md-12'>
                                          <div class="heds">
                                            <h6>Selected Package Details</h6>
                                          </div>
                                          </li>
                                          <li class="col-md-6">
                                            <svg
                                              stroke="currentColor"
                                              fill="currentColor"
                                              stroke-width="0"
                                              viewBox="0 0 384 512"
                                              height="1em"
                                              width="1em"
                                              xmlns="http://www.w3.org/2000/svg">
                                              <path d="M215.7 499.2C267 435 384 279.4 384 192C384 86 298 0 192 0S0 86 0 192c0 87.4 117 243 168.3 307.2c12.3 15.3 35.1 15.3 47.4 0zM192 128a64 64 0 1 1 0 128 64 64 0 1 1 0-128z"></path>
                                            </svg>
                                            <span>HYD</span>
                                          </li>
                                          <li class="col-md-6">
                                            <svg
                                              stroke="currentColor"
                                              fill="currentColor"
                                              stroke-width="0"
                                              role="img"
                                              viewBox="0 0 24 24"
                                              height="1em"
                                              width="1em"
                                              xmlns="http://www.w3.org/2000/svg">
                                              <title></title>
                                              <path d="M0 20.084c.043.53.23 1.063.718 1.778.58.849 1.576 1.315 2.303.567.49-.505 5.794-9.776 8.35-13.29a.761.761 0 011.248 0c2.556 3.514 7.86 12.785 8.35 13.29.727.748 1.723.282 2.303-.567.57-.835.728-1.42.728-2.046 0-.426-8.26-15.798-9.092-17.078-.8-1.23-1.044-1.498-2.397-1.542h-1.032c-1.353.044-1.597.311-2.398 1.542C8.267 3.991.33 18.758 0 19.77Z"></path>
                                            </svg>
                                            <span>Expo Type : </span> <span>Residential</span>
                                          </li>
                                          <li class="col-md-6">
                                            <svg
                                              stroke="currentColor"
                                              fill="currentColor"
                                              stroke-width="0"
                                              viewBox="0 0 24 24"
                                              height="1em"
                                              width="1em"
                                              xmlns="http://www.w3.org/2000/svg">
                                              <path d="M14 6v15H3v-2h2V3h9v1h5v15h2v2h-4V6h-3zm-4 5v2h2v-2h-2z"></path>
                                            </svg>
                                            <span>Stall Type: </span> <span>Daimond</span>
                                          </li>
                                          <li class="col-md-6">
                                            <svg
                                              stroke="currentColor"
                                              fill="currentColor"
                                              stroke-width="0"
                                              viewBox="0 0 24 24"
                                              height="1em"
                                              width="1em"
                                              xmlns="http://www.w3.org/2000/svg">
                                              <path fill="none" d="M0 0h24v24H0z"></path>
                                              <path d="M4 10h3v7H4zM10.5 10h3v7h-3zM2 19h20v3H2zM17 10h3v7h-3zM12 1L2 6v2h20V6z"></path>
                                            </svg>
                                            <span>Stall No : </span><span>3</span>
                                            <span class="stallbg"></span>
                                          </li>
                                          <li className='d-flex'>
                                          <div class="month_ot d-flex justifi-content-center">
                                            <div className='mr-2 mnths-ot'>
                                              <label class="custom-radio">
                                                <input type="radio" name="standardPrice" value="1000" />
                                                <span class="radio-icon">1 Month</span>
                                              </label>
                                            </div>
                                            <div className='mr-2 mnths-ot'>
                                              <label class="custom-radio">
                                                <input type="radio" name="standardPrice" value="3000" />
                                                <span class="radio-icon">3 Months</span>
                                              </label>
                                            </div>
                                            <div className='mr-2 mnths-ot'>
                                              <label class="custom-radio">
                                                <input type="radio" name="standardPrice" value="6000" />
                                                <span class="radio-icon">6 Months</span>
                                              </label>
                                            </div>
                                      </div>
                                          </li>
                                          <li class="stall-price mt-3 mb-2 d-flex">
                                            Your Selected Package  
                                            <span class="sle_blo">: 3Expos</span>
                                          </li>
                                          <li class="mb-3">
                                            <svg
                                              stroke="currentColor"
                                              fill="currentColor"
                                              stroke-width="0"
                                              viewBox="0 0 24 24"
                                              height="1em"
                                              width="1em"
                                              xmlns="http://www.w3.org/2000/svg">
                                              <path fill="none" d="M0 0h24v24H0z"></path>
                                              <path d="M9 11H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2zm2-7h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20a2 2 0 002 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V9h14v11z"></path>
                                            </svg>
                                            <span> S3 Stall Available Dates:-</span>
                                          </li>
                                          <li>
                                            <div class="row b_dates">
                                              <div class="col-md-4 px-1">
                                                <div class="w-100 s_date">16-08-2024</div>
                                              </div>
                                              <div class="col-md-4 px-1">
                                                <div class="w-100 s_date">16-09-2024</div>
                                              </div>
                                              <div class="col-md-4 px-1">
                                                <div class="w-100 s_date">31-08-2024</div>
                                              </div>
                                              <div class="col-md-4 px-1">
                                                <div class="w-100 s_date">31-12-2024</div>
                                              </div>
                                              <div class="col-md-4 px-1">
                                                <div class="w-100 s_date">31-10-2024</div>
                                              </div>
                                            </div>
                                          </li>
                                          <li>
                                            <div class="row b_dates"></div>
                                            <div class="row btns-p">
                                              <div class="col-md-12 text-right">
                                              <div> 
                                              <p  className="rate_out d-flex align-items-center justify-content-end mb-0">Package Amout : <span class="pric_blo">₹ 108000</span></p>
                                              <p  className="rate_out d-flex align-items-center justify-content-end mb-0">Estimated Gst : <span class="pric_blo">₹ 19440</span></p>
                                              <p  className="total-amt d-flex align-items-center justify-content-end mb-0 br-top">Total Payable Amount : <span class="pric_blo">₹ 127440</span></p>
                                              </div> 
                                              </div>
                                              <div class="col-md-12 text-right">
                                                
                                                <button
                                                  class="grn"
                                                  fdprocessedid="jbxtud"
                                                  onClick={HandleIntiatePayment}>
                                                  Buy Now
                                                </button>
                                              </div>
                                            </div>
                                          </li> */}
                              <li class="col-md-12 px-0">
                                <div className="stall-price clrs d-flex align-items-start pack-avabl">
                                  <span> Other Available Packages :</span>
                                  <span class="other_opt">
                                    <input type="radio" name="standardPrice" value="1000" /> 1 Expo : ₹ 40000
                                    <br />
                                    <input type="radio" name="standardPrice" value="3000" /> 3 Expos : ₹ 204000
                                  </span>
                                </div>
                              </li>
                              {/* <li class="stall-price clrs"></li> */}
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Modal>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default BookaStall;