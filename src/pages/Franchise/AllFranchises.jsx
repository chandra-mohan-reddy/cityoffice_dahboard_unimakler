import React, { useCallback, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { masterClient } from '../../utils/httpClient';
import { useSelector } from 'react-redux';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Loader from '../../components/common/Loader';
const AllFranchises = () => {
    const userData = useSelector((state) => state.user.userData);
    const { id } = useParams();
    const [loading, setLoading] = useState(false)
    const [franchiseList, setFranchiseList] = useState([]);
    const [show, setShow] = useState(false);

    const handleClose = () => {
        setShow(false);
    }

    const handleShow = () => setShow(true);

    const getAllFranchsies = useCallback(async () => {
        setLoading(true)
        try {
            const res = await masterClient.get(`/admin/franchises/${id}`)
            if (res?.data?.status) {
                setFranchiseList(res?.data?.data)
            }
        } catch (error) {
            console.error(`Error fetching franchsies => ${error}`)
        } finally {
            setLoading(false)
        }
    }, [id])

    useEffect(() => {
        getAllFranchsies();
    }, [])

    return (
        <>
            {loading && <Loader />}
            <div className="main-content">
                <div className="page-content">
                    <div className="container-fluid">
                        <div className="row">
                            <div className="col-12">
                                <div className="page-title-box d-flex align-items-center justify-content-between">
                                    <div className="page-title-right row w-100">
                                        <div className="col-md-6">
                                            <h3>Executive List</h3>
                                        </div>
                                        <div className="col-md-6 text-right">
                                            <h3 className='text-right'>Team Leader : <b>SRINIVAS RAO</b></h3>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* <div className="row justify-content-center ">
                            <div className="col-md-10">
                                <div className="cardd mb-4 cardd-input">
                                    <div className="card-body">
                                        <h3 className="card-title mb-3">Search List</h3>
                                        <form className="custom-validation" action="#">
                                            <div className="row align-items-center">
                                                <div className="col-md-2">
                                                    <div className="">
                                                        <label>Country</label>
                                                        <select className="form-select" name="subProperty" required>
                                                            <option value="default">Select Country</option>
                                                            <option value="">India</option>
                                                            <option value="">Dubai</option>
                                                        </select>
                                                    </div>
                                                </div>
                                                <div className="col-md-2">
                                                    <div className="">
                                                        <label>State</label>
                                                        <select className="form-select" name="subProperty" required>
                                                            <option value="default">Select State</option>
                                                            <option value="">India</option>
                                                            <option value="">Dubai</option>
                                                        </select>
                                                    </div>
                                                </div>
                                                <div className="col-md-2">
                                                    <div className="">
                                                        <label>City</label>
                                                        <select className="form-select" name="subProperty" required>
                                                            <option value="default">Select City</option>
                                                            <option value="">Hyderabad</option>
                                                            <option value="">Dubai</option>
                                                        </select>
                                                    </div>
                                                </div>
                                                <div className="col-md-3">
                                                    <div className="">
                                                        <label>Status</label>
                                                        <select className="form-select" name="subProperty" required>
                                                            <option value="default">Active</option>
                                                            <option value="default">In sActive</option>

                                                        </select>
                                                    </div>
                                                </div>
                                                <div className="col-md-1">
                                                    <button className="btn btn-primary" type="submit">
                                                        Search
                                                    </button>
                                                </div>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div> */}


                        <div className="row justify-content-center">
                            <div className="col-md-12">
                                <div className="card">
                                    <div className="card-header">
                                        <h3 className="card-title">Executive List</h3>
                                    </div>
                                    <div className="card-body">
                                        <div className="table-responsive-md">
                                            <table className="table text-nowrap mb-0">
                                                <thead>
                                                    <tr>
                                                        <th>S.No</th>
                                                        <th>Franchise Name</th>
                                                        <th>Email</th>
                                                        <th>Mobile</th>
                                                        <th>Start Date</th>
                                                        <th>View</th>
                                                    </tr>
                                                </thead>
                                                <tbody className='block5-franchise-performance'>
                                                    <tr>
                                                        <td>01</td>
                                                        <td>Vamsi</td>
                                                        <td>srinivas@gmail.com</td>
                                                        <td>9999999999</td>
                                                        <td>26-07-2025</td>
                                                        {/* <td><link to="/franchisefranchisesList" >View</link></td> */}
                                                        <td><Link to="/franchise/details"><button>View</button></Link></td>

                                                    </tr>
                                                </tbody>
                                                {/* <tbody className='block5-franchise-performance'>
                                                    {franchiseList.length > 0 ?
                                                        franchiseList.map((each, index) => (
                                                            <tr key={index}>
                                                                <td>{index + 1}</td>
                                                                <td>{each.franchise_name}</td>
                                                                <td>{each.franchise_primary_email}</td>
                                                                <td>{each.franchise_primary_phoneno}</td>
                                                                <td>{each.contact_person}</td>
                                                                <td>{each.franchise_tenure_start_date}</td>
                                                                <td>{each.franchise_tenure_end_date}</td>
                                                                <td><Link to="/super-franchise/franchises/list"><button>View</button></Link></td>
                                                            </tr>
                                                        ))
                                                        :
                                                        <tr>
                                                            <td colSpan={3}>No Franchises Found</td>
                                                        </tr>
                                                    }
                                                </tbody> */}
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <Modal show={show} onHide={handleClose}>
                            <Modal.Header closeButton>

                            </Modal.Header>

                            <div className='popup px-4'>
                                <div className="row justify-content-center">
                                    <div className="col-md-6 p-3">
                                        <div className="card p-3 m-0">
                                            <div className="table-responsive-md">
                                                <table className="table text-nowrap mb-0">
                                                    <thead>
                                                        {/* <tr>
                   
                          <th>Customer Name</th>
                          <th>Mobile</th>
                          <th>Super Franchise/Office</th>
                          <th>Present Project</th>
                          <th>Requested Project</th>
                          <th>Request  On</th>
                          <th>Requested Executive Fran</th>
                          
                        </tr> */}
                                                    </thead>
                                                    <tbody>
                                                        <tr>
                                                            <td colSpan={2}>Personal Details</td>
                                                        </tr>
                                                        <tr>
                                                            <td><b>Franchise Name</b></td>
                                                            <td>Customer Name</td>

                                                        </tr>
                                                        <tr>
                                                            <td><b>City</b></td>
                                                            <td>Hyderabad</td>

                                                        </tr>
                                                        <tr>
                                                            <td><b>Country</b></td>
                                                            <td>India</td>

                                                        </tr>
                                                        <tr>
                                                            <td><b>Transfer Comment</b></td>
                                                            <td><p>sfjsvfjfv fiwgfwifgwfwfw ofywfogwfwfwfgwfg</p></td>

                                                        </tr>
                                                        {/* <td>Mobile</td>
                          <td>Super Franchise/Office</td>
                          <td>Present Project</td>
                          <td>Requested Project</td>
                          <td>Request  On</td>
                          <td>Requested Executive Fran</td>
                          <td>Harsha .K</td>
                          <td>9876543212</td>
                          <td>Kondapur</td>
                          <td>Magic Bricks</td>
                          <td>RNR Developers</td>
                          <td>21/05/2025</td>
                          <td>Unimakler</td> */}



                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-6 p-3">
                                        <div className="card p-3 m-0">
                                            <div className="table-responsive-md">
                                                <table className="table text-nowrap mb-0">
                                                    <thead>
                                                        {/* <tr>
                   
                          <th>Customer Name</th>
                          <th>Mobile</th>
                          <th>Super Franchise/Office</th>
                          <th>Present Project</th>
                          <th>Requested Project</th>
                          <th>Request  On</th>
                          <th>Requested Executive Fran</th>
                          
                        </tr> */}
                                                    </thead>
                                                    <tbody>
                                                        <tr>
                                                            <td colSpan={2}>Personal Details</td>
                                                        </tr>
                                                        <tr>
                                                            <td><b>Franchise Name</b></td>
                                                            <td>Customer Name</td>

                                                        </tr>
                                                        <tr>
                                                            <td><b>City</b></td>
                                                            <td>Hyderabad</td>

                                                        </tr>
                                                        <tr>
                                                            <td><b>Country</b></td>
                                                            <td>India</td>

                                                        </tr>
                                                        <tr>
                                                            <td><b>Transfer Comment</b></td>
                                                            <td><p>sfjsvfjfv fiwgfwifgwfwfw ofywfogwfwfwfgwfg</p></td>

                                                        </tr>
                                                        {/* <td>Mobile</td>
                          <td>Super Franchise/Office</td>
                          <td>Present Project</td>
                          <td>Requested Project</td>
                          <td>Request  On</td>
                          <td>Requested Executive Fran</td>
                          <td>Harsha .K</td>
                          <td>9876543212</td>
                          <td>Kondapur</td>
                          <td>Magic Bricks</td>
                          <td>RNR Developers</td>
                          <td>21/05/2025</td>
                          <td>Unimakler</td> */}



                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </Modal>



                    </div>
                </div>
            </div>
        </>
    )
}

export default AllFranchises
