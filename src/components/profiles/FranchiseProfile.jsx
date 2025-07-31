import React from 'react'
import { Link } from 'react-router-dom';
import Offcanvas from 'react-bootstrap/Offcanvas';

import { GoEye } from "react-icons/go";
import { FaRegEdit } from "react-icons/fa";
import { FaBarsStaggered } from "react-icons/fa6";

const FranchiseProfile = () => {
    const [show, setShow] = useState(false);
    return (
        <div className="main-content">
            <div className="page-content profile-page">
                <div className="row">
                    <div className="col-12">
                        <div className="page-title-box d-flex align-items-center justify-content-between">
                            <div className="page-title-right">
                                <ol className="breadcrumb m-0">
                                    <li className="breadcrumb-item">
                                        <a href="/">Home</a>
                                    </li>
                                    <li className="breadcrumb-item active">Profile</li>
                                </ol>
                            </div>
                            <div className="page-title-right">
                                <button className="btn btn-info" onClick={() => setShow(true)}>
                                    Edit Profile
                                </button>
                            </div>
                        </div>
                    </div>
                </div>



                <div className="container">
                    <div className='mt-3'>
                        <div className='row justify-content-center'>
                            <div className='col-md-12'>
                                <div className='builder_data'>
                                    <div className='builder-hdr'>
                                        <h4 className='sect-title mb-4 mt-0'>Super Franchise Profile</h4>
                                        <div className='row align-items-center '>
                                            <div className='col-md-6 mb-3'>
                                                <div className='d-flex'>
                                                    <label>Franchise Name :</label> <span><b>Unimakler</b></span>
                                                </div>
                                            </div>
                                            <div className='col-md-6 mb-3 text-right d-flex justify-content-end'>
                                                <div className='companylogo '>
                                                    <img src="/assets/images/logo.png" alt="logos" width={100} />
                                                </div>
                                            </div>

                                            <div className='col-md-6 mb-3'>
                                                <div className='d-flex'>
                                                    <label>Primary Phone :</label> <span><b>9876543212</b></span>
                                                </div>
                                            </div>
                                            <div className='col-md-6 mb-3'>
                                                <div className='d-flex'>
                                                    <label>Secondary Phone :</label> <span><b>9876543212</b></span>
                                                </div>
                                            </div>
                                            <div className='col-md-6 mb-3'>
                                                <div className='d-flex'>
                                                    <label>Primary Email :</label> <span><b>unimaker@gmail.com</b></span>
                                                </div>
                                            </div>
                                            <div className='col-md-6 mb-3'>
                                                <div className='d-flex'>
                                                    <label>Secondary Email :</label> <span><b>unimaker@gmail.com</b></span>
                                                </div>
                                            </div>
                                            <div className='col-md-12 mb-3'>
                                                <h5>Franchise Address</h5>
                                            </div>
                                            <div className='col-md-4 mb-3'>
                                                <div className='d-flex'>
                                                    <label>Country :</label> <span><b>India</b></span>
                                                </div>
                                            </div>
                                            <div className='col-md-4 mb-3'>
                                                <div className='d-flex'>
                                                    <label>State :</label> <span><b>Telangana</b></span>
                                                </div>
                                            </div>
                                            <div className='col-md-4 mb-3'>
                                                <div className='d-flex'>
                                                    <label>City :</label> <span><b>Hyderabad</b></span>
                                                </div>
                                            </div>
                                            <div className='col-md-12 mb-3'>
                                                <div className='d-flex'>
                                                    <label>Address :</label> <span><b>India</b></span>
                                                </div>
                                            </div>
                                            <div className='col-md-12 mb-3'>
                                                <h5>Login Credentials</h5>
                                            </div>
                                            <div className='col-md-6 mb-3'>
                                                <div className='d-flex'>
                                                    <label>User Name :</label> <span><b>Rangeshunimakler</b></span>
                                                </div>
                                            </div>
                                            <div className='col-md-6 mb-3'>
                                                <div className='d-flex'>
                                                    <label>Password :</label> <span><b>Pass@12345</b></span>
                                                </div>
                                            </div>


                                        </div>
                                    </div>
                                    <div className='builder-hdr'>
                                        <h4 className='sect-title mb-4 mt-0'>Owner Details </h4>
                                        <div className='row align-items-center '>
                                            <div className='col-md-6 mb-3'>

                                                {/* <div className='d-flex'>
                     <span><b>Srinivas Kamadi</b></span>
                      </div> */}

                                                <div className='d-flex'>
                                                    <label>Owner Name :</label> <span><b>Unimakler</b></span>
                                                </div>

                                            </div>
                                            <div className='col-md-6 mb-3 text-right d-flex justify-content-end'>
                                                {/* <div className='companylogo '>
                
                      <img src="/assets/images/logo.png" alt="logos" width={100} />
                    </div> */}
                                            </div>

                                            <div className='col-md-6 mb-3'>
                                                <div className='d-flex'>
                                                    <label>Primary Phone :</label> <span><b>9876543212</b></span>
                                                </div>
                                            </div>
                                            <div className='col-md-6 mb-3'>
                                                <div className='d-flex'>
                                                    <label>Secondary Phone :</label> <span><b>9876543212</b></span>
                                                </div>
                                            </div>
                                            <div className='col-md-6 mb-3'>
                                                <div className='d-flex'>
                                                    <label>Primary Email :</label> <span><b>unimaker@gmail.com</b></span>
                                                </div>
                                            </div>
                                            <div className='col-md-6 mb-3'>
                                                <div className='d-flex'>
                                                    <label>Secondary Email :</label> <span><b>unimaker@gmail.com</b></span>
                                                </div>
                                            </div>
                                            <div className='col-md-6 mb-3'>
                                                <div className='d-flex'>
                                                    <label>Date Brith :</label> <span><b>unimaker@gmail.com</b></span>
                                                </div>
                                            </div>
                                            <div className='col-md-6 mb-3'>
                                                <div className='d-flex'>
                                                    <label>Photo Upload :</label> <span>  <img src="/assets/images/logo.png" alt="logos" width={100} /></span>


                                                </div>
                                            </div>


                                        </div>
                                    </div>
                                    <div className='builder-hdr'>
                                        <h4 className='sect-title mb-4 mt-0'>Assigned Locations</h4>
                                        <div className='row align-items-center '>
                                            <div className='col-md-4 mb-3'>
                                                <div className='d-flex'>
                                                    <label>Country :</label> <span><b>India</b></span>
                                                </div>
                                            </div>
                                            <div className='col-md-4 mb-3'>
                                                <div className='d-flex'>
                                                    <label>State :</label> <span><b>Telangana</b></span>
                                                </div>
                                            </div>
                                            <div className='col-md-4 mb-3'>
                                                <div className='d-flex'>
                                                    <label>City :</label> <span><b>Hyderabad</b></span>
                                                </div>
                                            </div>
                                            <div className='col-md-12 mb-3'>
                                                <div className='d-flex'>
                                                    <label>Assigned Locations :</label> <span><b> Miyapur</b><br></br><b> Beramguda</b><br></br><b> Ameenpur</b></span>
                                                </div>
                                            </div>

                                        </div>
                                    </div>
                                    <div className='builder-hdr'>
                                        <h4 className='sect-title mb-4 mt-0'>Assigned Projects</h4>
                                        <div className='row align-items-center '>
                                            <div className='col-md-6 mb-3'>
                                                <div className='d-flex'>
                                                    <label>Projects :</label> <span><b>Urban Rise</b></span>
                                                </div>
                                            </div>


                                        </div>
                                    </div>


                                </div>
                            </div>

                        </div>
                    </div>
                </div>


                <Offcanvas show={show} onHide={() => setShow(false)} placement="end" className="prifile_edit">
                    <Offcanvas.Header closeButton></Offcanvas.Header>
                    <Offcanvas.Body>
                        <div className='card'>
                            <div class="card-header"><h3 class="card-title">Edit Profile</h3></div>

                            <div class="card-body">
                                <h5 className='sect-title mb-3'>Please Enter Details Below</h5>
                                <form>
                                    <div className="row">
                                        <div className="col-md-6">
                                            <div class="form-floating">
                                                <input type="text" className="form-control" placeholder="Company Name" />
                                                <label for="size-representation" class="fw-normal">Company Name :</label>
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div class="form-floating">
                                                <input type="file" className="form-control" placeholder="Company Name" />
                                                <label for="size-representation" class="fw-normal">Upload Logo :</label>
                                            </div>
                                        </div>
                                    </div>
                                    <h6 className="BuildNameCom mb-3 mt-4">Office Address :</h6>

                                    <div className="row mb-4">

                                        <div className="col-md-12">
                                            <div class="form-floating">
                                                <textarea
                                                    type="text"
                                                    placeholder="Enter Complete Address"
                                                    className="form-control"
                                                ></textarea>
                                                <label for="size-representation" class="fw-normal">Enter Complete Address</label>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row mb-4">
                                        <div class="col-md-4">
                                            <div class="form-floating">
                                                <input type="text" className="form-control" placeholder="Company Name" />
                                                <label for="size-representation" class="fw-normal">Customer Contact Number</label>
                                            </div>
                                        </div>
                                        <div class="col-md-4">
                                            <div class="form-floating">
                                                <input type="text" className="form-control" placeholder="Company Name" />
                                                <label for="size-representation" class="fw-normal">Company Email Id</label>
                                            </div>
                                        </div>
                                        <div class="col-md-4">
                                            <div class="form-floating">
                                                <input type="text" className="form-control" placeholder="Company Name" />
                                                <label for="size-representation" class="fw-normal">Company Contact Number</label>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="row mb-4">
                                        <div class="col-md-4">
                                            <div class="form-floating">
                                                <input type="text" className="form-control" placeholder="Company Name" />
                                                <label for="size-representation" class="fw-normal">Enter MD Name</label>
                                            </div>
                                        </div>
                                        <div class="col-md-4">
                                            <div class="form-floating">
                                                <input type="text" className="form-control" placeholder="Company Name" />
                                                <label for="size-representation" class="fw-normal">Enter MD Number</label>
                                            </div>
                                        </div>
                                        <div class="col-md-4">
                                            <div class="form-floating">
                                                <input type="text" className="form-control" placeholder="Company Name" />
                                                <label for="size-representation" class="fw-normal">Enter MD Email </label>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row mb-4">
                                        <div class="col-md-4">
                                            <div class="form-floating">
                                                <input type="text" className="form-control" placeholder="Company Name" />
                                                <label for="size-representation" class="fw-normal">Enter Manager Name</label>
                                            </div>
                                        </div>
                                        <div class="col-md-4">
                                            <div class="form-floating">
                                                <input type="text" className="form-control" placeholder="Company Name" />
                                                <label for="size-representation" class="fw-normal">Enter Manager Number</label>
                                            </div>
                                        </div>
                                        <div class="col-md-4">
                                            <div class="form-floating">
                                                <input type="text" className="form-control" placeholder="Company Name" />
                                                <label for="size-representation" class="fw-normal">Enter Manager Email </label>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="row mb-4">
                                        <div class="col-md-4">
                                            <div class="form-floating">
                                                <input type="text" className="form-control" placeholder="Company Name" />
                                                <label for="size-representation" class="fw-normal">Enter Company PAN</label>
                                            </div>
                                        </div>
                                        <div class="col-md-4">
                                            <div class="form-floating">
                                                <input type="text" className="form-control" placeholder="Company Name" />
                                                <label for="size-representation" class="fw-normal">Enter GST Number</label>
                                            </div>
                                        </div>

                                    </div>




                                    <div className="button-subb mt-0">
                                        <button type="submit" className="sub-btn1">
                                            Submit
                                        </button>
                                    </div>

                                </form>
                            </div>
                        </div>
                    </Offcanvas.Body>
                </Offcanvas>

            </div>

        </div>
    )
}

export default FranchiseProfile
