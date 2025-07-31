import React,{useState,useEffect} from 'react';
import { Link } from 'react-router-dom';
import { FaRegEdit } from "react-icons/fa";
import { FaEye } from "react-icons/fa";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';


const InternalTransfer = () => {

      const [show, setShow] = useState(false);

      const handleClose = () => {
        setShow(false); 
        } 
  
      const handleShow = () => setShow(true);

  return (
    <div className="main-content">
      <div className="page-content">
        <div className="container-fluid">
          <div className="row">
            <div className="col-12">
              <div className="page-title-box d-flex align-items-center justify-content-between">
                <div className="page-title-right">
                 <h3>Internal Transfer</h3>
                </div>
              </div>
            </div>
          </div>



              <div className="row justify-content-center ">
              <div className="col-md-11">
                <div className="cardd mb-4 cardd-input">
                  <div className="card-body">
                    <h3 className="card-title mb-3">Search Leads</h3>
                    <form className="custom-validation" action="#">
                      <div className="row align-items-center">
                        
                        <div className="col-md-3">
                          <div className="form-floating mb-3">
                            <select
                              className="form-select"
                              name="project"
                              
                            >
                              <option value="default">Select State</option>

                            </select>
                            <label className="fw-normal">State</label>
                          </div>
                        </div>
                        <div className="col-md-4">
                          <div className="form-floating mb-3">
                            <select
                              className="form-select"
                              name="project"
                              
                            >
                              <option value="default">Select City</option>

                            </select>
                            <label className="fw-normal">City</label>
                          </div>
                        </div>

                        <div className="col-md-4">
                          <div className="form-floating mb-3">
                            <select className="form-select" name="subProperty" required>
                              <option value="default">Select Franchise</option>
                            </select>
                            <label className="fw-normal">Requested Franchise</label>
                          </div>
                        </div>
                      

                        <div className="col-md-3 mt-3">
                          <div className="">
                            <div className="form-floating">
                              <input
                                type="date"
                                id="from-date"
                                className="form-control"
                                name="fromdate"
                           
                              />
                              <label htmlFor="from-date" className="fw-normal">From Date</label>
                            </div>
                          </div>
                        </div>

                        <div className="col-md-3 mt-3">
                          <div className="">
                            <div className="form-floating">
                              <input
                                type="date"
                                id="to-date"
                                className="form-control"
                                name="todate"
                              
                              />
                              <label htmlFor="to-date" className="fw-normal">To Date</label>
                            </div>
                          </div>
                        </div>

                        <div className="col-md-1 mt-3">
                          <button className="btn btn-primary" type="submit">
                            Search
                          </button>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>



          <div className="row justify-content-center">
            <div className="col-md-12">
              <div className="card">
                <div className="card-header">
                  <h3 className="card-title">Internal Transfer</h3>
                                  </div>
                <div className="card-body">
                  <div className="table-responsive-md">
                    <table className="table text-nowrap mb-0">
                      <thead>
                        <tr>
                          <th>S.No</th>
                          <th>Customer Name</th>
                          <th>Mobile</th>
                          <th>Present Project</th>
                          <th>Requested Franchise</th>
                          <th>Request  On</th>
                          <th>Requested Fran</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>

                        <tr >
                          <td>1</td>
                          <td>Harsha .K</td>
                          <td>9876543212</td>
                          <td>Magic Bricks</td>
                          <td>RNR Developers</td>
                          <td>21/05/2025</td>
                          <td>Unimakler</td>
                          <td>
                          <Button variant="primary" onClick={handleShow} className='listin_btn'><FaEye /></Button>
                          </td>
                        </tr>
                       
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>


          
   
<Modal show={show} onHide={handleClose}>
          <Modal.Header closeButton>
           
          </Modal.Header>
         
          <div className='popup'>
          <div className="row justify-content-center">
            <div className="col-md-12">
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
                          <td><b>Super Franchise Name</b></td>
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
  )
}

export default InternalTransfer