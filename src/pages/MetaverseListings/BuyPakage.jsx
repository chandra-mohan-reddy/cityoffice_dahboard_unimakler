import React, { useEffect, useState } from 'react'
import { masterClient } from '../../utils/httpClient'
import Loader from '../../components/common/Loader'
import { useSelector } from 'react-redux';
import { toastError, toastSuccess } from '../../utils/toast';

const BuyPakage = () => {
  const userData = useSelector((state) => state.user.userData)
  const [loading, setLoading] = useState(false);
  const [listingPackages, setListingPackages] = useState([]);
  const [selPackage, setSelPackage] = useState(null)
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [search, setSearch] = useState({ no_of_listings: 1 });

  const getListingPackages = async () => {
    setLoading(true);
    try {
      const role = userData?.role_id === 'Builder' ? 'Builder,Exclusive Sales Partner' : userData.role_id === 'Exclusive Sales Partner' ? 'Builder,Exclusive Sales Partner' : userData?.role_id
      const res = await masterClient.get('packages');
      if (res?.data?.status && res.data?.data.length > 0) {
        const premiumListings = res.data.data.filter(
          (listing) => {
            return listing.listing_type === 'Meta Listing' &&
              listing.package_for === role;
          }
        );

        setListingPackages(premiumListings);

        const selectedPackage = premiumListings.find(
          (packagee) => packagee.no_of_listings == 1 ||
            packagee.no_of_listings == 10
        );

        console.log('selll =====', selectedPackage);


        setSelPackage(selectedPackage);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };


  const handleSearch = async (e) => {
    const { name, value } = e.target

    if (name === 'country_code') {
      getStatesByCountry(value)
    }

    if (name === 'state_code') {
      getCitiesByState(value)
    }

    setSearch((prev) => ({
      ...prev,
      [name]: value
    }))
  }

  useEffect(() => {
    const filterData = () => {
      return listingPackages.filter(item => {
        return (
          (!search.country_code || item.country_code === search.country_code) &&
          (!search.state_code || item.state_code === search.state_code) &&
          (!search.city_code || item.city_code === search.city_code) &&
          (!search.no_of_listings || item.no_of_listings === parseInt(search.no_of_listings, 10))
        );
      });
    };

    const result = filterData();
    setSelPackage(result[0])
  }, [search])


  useEffect(() => {
    getListingPackages();
    getCountries();

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

  const buyPackage = async (planType, price, numberOfDays, listings, package_id) => {
    let activatedDay = new Date().toISOString().split('T')[0];

    let deactivationDate = new Date();
    deactivationDate.setDate(deactivationDate.getDate() + numberOfDays);
    let formattedDate = deactivationDate.toISOString().split('T')[0];

    const body = {
      'package_id': package_id,
      'package_type': planType,
      'price': price,
      'number_of_days': numberOfDays,
      'total_listings': listings,
      'available_listings': listings,
      'activated_date': activatedDay,
      'deactivate_date': formattedDate,
      'user_id': userData?.id,
      'user_role': userData?.role_id
    }

    let res = await masterClient.post('purchaseDetails', body)
    if (res?.data?.status) {
      toastSuccess('Purchased SuccessFully')
    } else {
      toastError('Failed Please Try again')
    }
  }

  return (

    <>
      {loading && <Loader />}
      {selPackage == null ?
        <Loader />
        :
        <div className="main-content">
          <div className="page-content">
            <div className="container">
              <div className="row">
                <div className="col-12">
                  <div className="page-title-box d-flex align-items-center justify-content-between">
                    <div className="page-title-right">
                      <h4 className='mb-0'>Buy Packages</h4>
                    </div>
                  </div>
                </div>
              </div>

              <div className="card cardd">
                <div className="dashbrd_cont">
                  <div className="profile-det-titls">
                    <h3 className="PremiumAccount1"> METAVERSE LISTINGS</h3>
                  </div>
                  {/* <div className="pakcblo_title">
                <h4>Harness the Power of Metaverse Listings on terraterri!"</h4>
                <h3 className="mb-0 mt-0 choosethe">
                  Choose the Right plan for your real estate
                </h3>
              </div> */}


                  {/* <div className="row">
                <div className="col-md-12 text-center mt-3 ">
                  <div className="d-flex sel_blo listing_tbs justify-content-center">
                    <button>Metaverse Listings</button>
                  </div>
                </div>
              </div>

              <div className="pk-nme text-center">
                <span className="choosetheONLY">PLATFORM ONLY</span>
                <p className="showcase1">
                  Connect, Engage, Sell: Leverage Metaverse Listings to Reach New
                  Heights!
                </p>
              </div>
              <div className="row slet_out">
                <div className="col-md-4">
                  <div className="d-flex sel_blo">
                    <span>Select City:</span>
                    <div className='custom-dropdown'>
                      <select className="form-control formcontrol">
                        <option value="575">Hyderabad</option>
                        <option value="579">Vishakapatnam</option>
                        <option value="580">Bengaluru</option>
                        <option value="581">Mumbai</option>
                        <option value="583">Pune</option>
                        <option value="586">Vijayawada</option>
                        <option value="588">Delhi</option>
                        <option value="597">Sangareddy</option>
                        <option value="598">Ahmedabad</option>
                        <option value="599">Kolkata</option>
                        <option value="600">Chennai</option>
                        <option value="601">Surat</option>
                        <option value="602">Kochi</option>
                        <option value="603">Trivendrum</option>
                        <option value="604">Agra</option>
                        <option value="605">Mysore</option>
                        <option value="606">Patna</option>
                        <option value="607">Amritsar</option>
                        <option value="608">Nagpur</option>
                        <option value="609">Bhopal</option>
                        <option value="610">Rajkot</option>
                        <option value="611">Ranchi</option>
                        <option value="612">Goa</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div className="col-md-8  ">
                  <div className="d-flex sel_blo justify-content-end listi-blo">
                    <span>Select No of Listings: </span>
                    <div className='custom-dropdown'>
                      <select className="form-control formcontrol">
                        <option value="575">1</option>
                        <option value="579">2</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
              <div className="row mt-5">
                <div className="col-md-4">
                  <div className="bg-color1">
                    <div className="pricing-item text-center">
                      <h2 className="PARAGON">PARAGON</h2>
                      <h6>Metaverse Model House</h6>
                      <h6 className="vald-ot">Validity: 90 Days</h6>
                      <h3>
                        ₹ 6000 <span>/month</span>
                      </h3>
                      <ul>
                        <li>
                          <b>Paid Quatarly</b>
                        </li>
                        <li>Listings: 1</li>
                      </ul>
                      <button className="purchage-btn">Purchase</button>
                    </div>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="bg-color2">
                    <div className="pricing-item text-center">
                      <h2 className="PARAGON">BUILDER BOX</h2>
                      <h6>Metaverse Builder's Office</h6>
                      <h6 className="vald-ot">Validity: 90 Days</h6>
                      <h3>
                        ₹ 6000 <span>/month</span>
                      </h3>
                      <ul>
                        <li>
                          <b>Paid Quatarly</b>
                        </li>
                        <li>Listings: 1</li>
                      </ul>
                      <button className="purchage-btn">Purchase</button>
                    </div>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="bg-color3">
                    <div className="pricing-item text-center">
                      <h2 className="PARAGON">COMBO</h2>
                      <h6>Paragon + Builder Box</h6>
                      <h6 className="vald-ot">Validity: 90 Days</h6>
                      <h3>
                        ₹ 9,000 <span>/month</span>
                      </h3>
                      <ul>
                        <li>
                          <b>Paid Quatarly</b>
                        </li>
                        <li>Listings: 1+1</li>
                      </ul>
                      <button className="purchage-btn">Purchase</button>
                    </div>
                  </div>
                </div>
              </div>
              <hr></hr> */}

                  <div className="pk-nme text-center">
                    <h2 className="PremiumAccount">Metaverse Listing Packages</h2>
                    <span>PLATFORM + PROMOTION</span>
                    <p className="showcase1">
                      Connect, Engage, Sell: Leverage Metaverse Listings to Reach New
                      Heights!
                    </p>
                  </div>
                  <div className="row slet_out">
                    <div className="col-md-6">
                      <div className="d-flex sel_blo">
                        <span>Select City:</span>
                        <select className="form-control formcontrol">
                          <option value="">City</option>
                          {cities.map((city, index) => (
                            <option key={index + 1} value={city.city_code}>
                              {city.city_name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="col-md-6">
                      <div className="d-flex sel_blo justify-content-end listi-blo">
                        <span>Select No of Listings: </span>
                        <select
                          className="form-control formcontrol"
                          name='no_of_listings'
                          onChange={handleSearch}
                        >
                          {listingPackages.map((item, index) => (
                            <option key={index} value={item.no_of_listings}>{item.no_of_listings}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-12 text-center mt-3">
                      <h6>Package Types</h6>
                      <div className="d-flex sel_blo justify-content-center">
                        <button className="actv">Generator</button>
                        <button>Enhancer</button>
                        <button>Turbo Charger</button>
                      </div>
                      <p>View Details</p>
                    </div>
                  </div>
                  <div className="row mt-5">
                    <div className="col-md-4">
                      <div className="bg-color1">
                        <div className="pricing-item text-center">

                          <h2 className="PARAGON">PARAGON</h2>
                          <h6>Metaverse Model House</h6>
                          <h6 className="vald-ot">Validity: {selPackage.package_one_days} Days</h6>
                          {selPackage.package_one_price != null ?
                            <>
                              <h3>
                                ₹ {selPackage.package_one_price} <span>/month</span>
                              </h3>
                              <ul>
                                <li>
                                  <b>Paid Quatarly</b>
                                </li>
                                <li>Listings: {selPackage.no_of_listings}</li>
                              </ul>
                            </>
                            :
                            <>
                              <h3>₹ -</h3>
                              <ul>
                                <li>Listings: -</li>
                              </ul>
                            </>
                          }
                          <button className="purchage-btn" onClick={() => buyPackage('Paragon', selPackage.package_one_price, selPackage.package_one_days, selPackage.no_of_listings, selPackage.id)}>Purchase</button>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="bg-color2">
                        <div className="pricing-item text-center">
                          <h2 className="PARAGON">BUILDER BOX</h2>
                          <h6>Metaverse Builder's Office</h6>

                          <h6 className="vald-ot">Validity: {selPackage.package_two_days} Days</h6>
                          {selPackage.package_two_price != null ?
                            <>
                              <h3>
                                ₹ {selPackage.package_two_price} <span>/month</span>
                              </h3>
                              <ul>
                                <li>
                                  <b>Paid Quatarly</b>
                                </li>
                                <li>Listings: {selPackage.no_of_listings}</li>
                              </ul>
                            </>
                            :
                            <>
                              <h3>₹ -</h3>
                              <ul>
                                <li>Listings: -</li>
                              </ul>
                            </>
                          }
                          <button className="purchage-btn" onClick={() => buyPackage('Builder Box', selPackage.package_two_price, selPackage.package_two_days, selPackage.no_of_listings, selPackage.id)}>Purchase</button>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="bg-color3">
                        <div className="pricing-item text-center">
                          <h2 className="PARAGON">COMBO</h2>
                          <h6>Paragon + Builder Box</h6>
                          <h6 className="vald-ot">Validity: {selPackage.package_three_days} Days</h6>
                          {selPackage.package_three_price != null ?
                            <>
                              <h3>
                                ₹ {selPackage.package_three_price} <span>/month</span>
                              </h3>
                              <ul>
                                <li>
                                  <b>Paid Quatarly</b>
                                </li>
                                <li>Listings: {selPackage.no_of_listings} + 1</li>
                              </ul>
                            </>
                            :
                            <>
                              <h3>₹ -</h3>
                              <ul>
                                <li>Listings: -</li>
                              </ul>
                            </>
                          }
                          <button className="purchage-btn" onClick={() => buyPackage('Combo', selPackage.package_three_price, selPackage.package_three_days, selPackage.no_of_listings, selPackage.id)}>Purchase</button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* <hr></hr> */}
                </div>
              </div>
            </div>
          </div>
        </div>
      }

    </>

  )
}

export default BuyPakage
