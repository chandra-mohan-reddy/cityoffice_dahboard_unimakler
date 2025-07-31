import React,{useState,useEffect} from 'react';  
import { FaShareSquare } from "react-icons/fa";
import { TiArrowBackOutline } from "react-icons/ti";
import { FaEye } from "react-icons/fa";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

const OutBox = () => {
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
                 <h3><b>Out Box</b> <span>(Lead Sent to other Franchise)</span></h3>
                </div>
              </div>
            </div>
          </div>



          <div className="row justify-content-center ">
            <div className="col-md-10">
              <div className="mb-4 cardd-input">
                {/* <div className="card-header">
                  <h3 className="card-title">Search Projects</h3>
                </div> */}
                <div className="card-body">
                  <h3 className="card-title mb-3">Outbox List</h3>
                  <form className="custom-validation" action="#">
                    <div className="row align-items-center">
                      <div className="col-md-2">
                        <div className="">
                        <lable>Country</lable>
                          <select className="form-select" name="subProperty" required>
                            <option value="default">Select Country</option>
                            <option value="">India</option>
                            <option value="">Dubai</option>
                          </select>
                        </div>
                      </div>
                      <div className="col-md-2">
                        <div className="">
                        <lable>State</lable>
                          <select className="form-select" name="subProperty" required>
                            <option value="default">Select State</option>
                            <option value="">India</option>
                            <option value="">Dubai</option>
                          </select>
                        </div>
                      </div>
                      <div className="col-md-2">
                        <div className="">
                        <lable>City</lable>
                          <select className="form-select" name="subProperty" required>
                            <option value="default">Select City</option>
                            <option value="">Hyderabad</option>
                            <option value="">Dubai</option>
                          </select>
                        </div>
                      </div>
                      <div className="col-md-3">
                        <div className="">
                        <lable>Franchise</lable>
                          <select className="form-select" name="subProperty" required>
                            <option value="default">Select Franchise</option>
                          
                          </select>
                        </div>
                      </div>
                      {/* <div className="col-md-2">
                        <div className="">
                          <select className="form-select" name="subProperty" required>
                            <option value="default">Select Source</option>
                            <option value="">Hyderabad</option>
                            <option value="">Dubai</option>
                          </select>
                        </div>
                      </div> */}




                      <div className="col-md-1">
                        <button className="btn btn-primary" type="submit">
                          Search
                        </button>
                      </div>
                      {/* <div className="col-12 text-center">
                      <button className="btn btn-primary" type="submit">
                        Save
                      </button>
                    </div> */}
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
                  <h3 className="card-title">Leads Transfer Inbox</h3>
                  {/* <div className="mb-3">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Search by location"
                    />
                  </div> */}
                </div>
                <div className="card-body">
                  <div className="table-responsive-md">
                    <table className="table text-nowrap mb-0">
                      <thead>
                        <tr>
                          <th>S.No</th>
                          <th>Customer Name</th>
                          <th>Mobile</th>
                          <th>Requested Project</th>
                          <th>Received Franchise</th>
                          <th>Franchise Mobile</th>
                          <th>Sent On</th>
                          <th>Status</th>
                          <th>Action</th>
                          {/* <th>Action</th> */}
                        </tr>
                      </thead>
                      <tbody>

                        <tr >
                          <td>1</td>
                          <td>Ravi Kiran</td>
                          <td>987654321</td>
                          <td>Whisting Wood</td>
                          <td>Markproperties</td>
                          <td>987654321</td>
                          <td>987654321</td>
                          <td><button>Accept / Reject</button></td>
                          <td>
                          <Button variant="primary" onClick={handleShow} className='listin_btn'><FaEye /></Button>
                          </td>
                          {/* <td className='arr_blk'>
                              <TiArrowBackOutline />
                            
                                                        <FaShareSquare />
                          </td> */}
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

export default OutBox


