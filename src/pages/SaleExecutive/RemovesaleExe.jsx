import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Offcanvas from 'react-bootstrap/Offcanvas';
import { FiSearch } from "react-icons/fi";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";

function RemovesaleExe ({ ...props }) {
  
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  
  return (
    <>


    <div className="main-content">
    <div className="page-content">
                <div className="container-fluid">
                    <div className="row">
                    <div className="col-12">
                        <div className="page-title-box d-flex align-items-center justify-content-between">
                        <div className="page-title-right">
                           <h3>
                           Franchise Tier
                           </h3>
                        </div>
                        
                        </div>
                    </div>
                    </div>

           
                    <div className='card p-3'>


<div className='row align-items-center'>
    <div className="col-md-12">
    <div class="white-box block5-franchise-performance" >
            <div class="widget-header d-flex justify-content-between mb-3">
              <h4 class="box-title">List</h4>
              <Button variant="primary" onClick={handleShow} className="me-2 mt-0">
        + Add
      </Button>
            </div>


            <div class="row">
              <div class="col-sm-12">
                <div class="table-responsive">
                  <table class="table color-table dark-table table-bordered">
                    <thead>
                      <tr class="text-center">
                        <th>Franchise Tier</th>
                       
                        <th>Create Date</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody class="tbody-franchise-performance">
                        <tr class="text-center ">
                          <td><span class="text-info"> Master Franchise </span></td>
               
                          <td>07-April-2024</td>
                          <td>
                            <button onClick={handleShow} className='btn btn-primary mt-0'><FaEdit /></button>
                            <button className='btn-danger btn mt-0'><MdDelete /></button>
                          </td>
                        </tr>
                        <tr class="text-center ">
                          <td><span class="text-info"> Super Franchise </span></td>
                    
                          <td>07-April-2024</td>
                          <td>
                            <button onClick={handleShow} className='btn btn-primary mt-0'><FaEdit /></button>
                            <button className='btn-danger btn mt-0'><MdDelete /></button>
                          </td>
                        </tr>
                        <tr class="text-center ">
                          <td><span class="text-info"> Franchise  </span></td>
              
                          <td>07-April-2024</td>
                          <td>
                            <button onClick={handleShow} className='btn btn-primary mt-0'><FaEdit /></button>
                            <button className='btn-danger btn mt-0'><MdDelete /></button>
                          </td>
                        </tr>
                      
                        
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
        </div>
    </div>

   
      <Offcanvas show={show} onHide={handleClose} placement="end" className="prifile_edit">
      <Offcanvas.Header closeButton>
        
        </Offcanvas.Header>
        <Offcanvas.Body>
        <div className="card p-4">
              <div class="card-header"><h3 class="card-title">Add Sales Executive</h3></div>
              {/* <hr /> */}
              <form className="custom-validation">
                <div className="row mt-4">
                  <div className="col-md-12">
                    <h5 className='asint'>Personal Details</h5>
                  </div>
                  <div className="col-md-4 mb-3">
                    <div className="form-floating">
                      <input
                        type="text"
                        id="corner"
                        className="form-control"
                        name="enter"
                        placeholder=""
                        required
                      />
                      <label htmlFor="corner" className="fw-normal">
                        Full Name
                      </label>
                    </div>
                  </div>
                  <div className="col-md-4 mb-3">
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
                        DOB
                      </label>
                    </div>
                  </div>
                  <div className="col-md-4 mb-3">
                    </div>
                  <div className="col-md-4 mb-3">
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
                        Date of Joining
                      </label>
                    </div>
                  </div>

                  <div className="col-md-4 mb-3"></div>
               
                  <div className="col-md-12">
                    <h5 className='asint'>Credentials</h5>
                  </div>
                  <div className="col-md-4 mb-3">
                    <div className="form-floating">
                      <input
                        type="text"
                        id="corner"
                        className="form-control"
                        name="enter"
                        placeholder=""
                        required
                      />
                      <label htmlFor="corner" className="fw-normal">
                        User Name
                      </label>
                    </div>
                  </div>
                  <div className="col-md-4 mb-3">
                    <div className="form-floating">
                      <input
                        type="password"
                        id="corner"
                        className="form-control"
                        name="enter"
                        placeholder=""
                        required
                      />
                      <label htmlFor="corner" className="fw-normal">
                        Password
                      </label>
                    </div>
                  </div>
                  <div className="col-md-4 mb-3">
                    <div className="form-floating">
                      <input
                        type="password"
                        id="corner"
                        className="form-control"
                        name="enter"
                        placeholder=""
                        required
                      />
                      <label htmlFor="corner" className="fw-normal">
                        Re-Type Password
                      </label>
                    </div>
                  </div>
                  <div className="col-md-12">
                    <h5 className='asint'>Contact Details</h5>
                  </div>
                  <div className="col-md-6 mb-3">
                    <div className="form-floating">
                      <input
                        type="email"
                        id="corner"
                        className="form-control"
                        name="enter"
                        placeholder=""
                        required
                      />
                      <label htmlFor="corner" className="fw-normal">
                        Primary Email
                      </label>
                    </div>
                  </div>
                  <div className="col-md-6 mb-3">
                    <div className="form-floating">
                      <input
                        type="email"
                        id="corner"
                        className="form-control"
                        name="enter"
                        placeholder=""
                        required
                      />
                      <label htmlFor="corner" className="fw-normal">
                        Secondary  Email
                      </label>
                    </div>
                  </div>
                  <div className="col-md-6 mb-3">
                    <div className="form-floating">
                      <input
                        type="number"
                        id="corner"
                        className="form-control"
                        name="enter"
                        placeholder=""
                        required
                      />
                      <label htmlFor="corner" className="fw-normal">
                        Primary Phone
                      </label>
                    </div>
                  </div>
                  <div className="col-md-6 mb-3">
                    <div className="form-floating">
                      <input
                        type="number"
                        id="corner"
                        className="form-control"
                        name="enter"
                        placeholder=""
                        required
                      />
                      <label htmlFor="corner" className="fw-normal">
                        Secondary Phone
                      </label>
                    </div>
                  </div>
                  <div className="col-md-12">
                    <h5 className='asint'>Assign Projects</h5>
                  </div>
                  <div className="col-md-3 mb-3">
                    <div className="form-floating">
                      <select className="form-select" name="amenities" required>
                        <option value="default">Select Project</option>
                        <option value="">Club House</option>
                       
                      </select>
                    </div>

                  </div>
                

                  
                  <div className="col-md-12 mt-4 mb-3">
                    <h5 className='asint'>Upload Documnets</h5>
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
                        Resume Upload+
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
                 

                  <div className="col-md-12 text-end">
                    <button className='btn btn-primary'>Submit</button>
                  </div>
                </div>
              </form>
            </div>
              </Offcanvas.Body>
      </Offcanvas>

    

    </>
  )
}

export default RemovesaleExe























// import React from 'react';

// const RemovesaleExe = () => {

//     return (
//         <>
//             <div className="main-content">
//                 <div className="page-content">
//                     <div className="container-fluid">
//                         <div className="row">
//                             <div className="col-12">
//                                 <div className="page-title-box d-flex align-items-center justify-content-between">
//                                     <div className="page-title-right">
//                                         <ol className="breadcrumb m-0">
//                                             <li className="breadcrumb-item">
//                                                 <a href="/">Terraterri</a>
//                                             </li>
//                                             <li className="breadcrumb-item active">Remove List</li>
//                                         </ol>
//                                     </div>
//                                     <div className="page-title-right">

//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                         <div className="row justify-content-center">
//                             <div className="col-md-12">
//                                 <div className="card">
//                                     <div className="card-header">
//                                         <h3 className="card-title">Remove List</h3>
//                                         <div className="">
//                                             <input type="text" className="form-control" placeholder="Search by name" />
//                                         </div>
//                                     </div>
//                                     <div className="card-body">
//                                         <div className="table-responsive-md">
//                                             <table className="table text-nowrap mb-0">
//                                                 <thead>
//                                                     <tr>
//                                                         <th>ID</th>
//                                                         <th>Name</th>
//                                                         <th>Company Name</th>
//                                                         <th>Email</th>
//                                                         <th>Number</th>
//                                                         <th>Franchise</th>
//                                                         <th>Address</th>
//                                                         <th>Action</th>
//                                                     </tr>
//                                                 </thead>
//                                                 <tbody>

//                                                     <tr >
//                                                         <td>1</td>
//                                                         <td>Prasanna</td>
//                                                         <td>Terrateri</td>
//                                                         <td>prasu@gmail.com</td>
//                                                         <td>9876543210</td>
//                                                         <td>Franchise</td>
//                                                         <td>Kakinada</td>
//                                                         <td >
                                                
//                                                             Activate
//                                                         </td>

//                                                     </tr>
//                                                     <tr >
//                                                         <td>1</td>
//                                                         <td>Prasanna</td>
//                                                         <td>Terrateri</td>
//                                                         <td>prasu@gmail.com</td>
//                                                         <td>9876543210</td>
//                                                         <td>Franchise</td>
//                                                         <td>Kakinada</td>
//                                                         <td >
                                                         
//                                                             Activate
//                                                         </td>

//                                                     </tr>
//                                                     <tr >
//                                                         <td>1</td>
//                                                         <td>Prasanna</td>
//                                                         <td>Terrateri</td>
//                                                         <td>prasu@gmail.com</td>
//                                                         <td>9876543210</td>
//                                                         <td>Franchise</td>
//                                                         <td>Kakinada</td>
//                                                         <td >
                                                           
//                                                             Activate
//                                                         </td>

//                                                     </tr>
//                                                     <tr >
//                                                         <td>1</td>
//                                                         <td>Prasanna</td>
//                                                         <td>Terrateri</td>
//                                                         <td>prasu@gmail.com</td>
//                                                         <td>9876543210</td>
//                                                         <td>Franchise</td>
//                                                         <td>Kakinada</td>
//                                                         <td >
                                                        
//                                                             Activate
//                                                         </td>

//                                                     </tr>

//                                                 </tbody>
//                                             </table>
//                                         </div>
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>

//                     </div>
//                 </div>
//             </div>
//         </>
//     );
// };

// export default RemovesaleExe;
