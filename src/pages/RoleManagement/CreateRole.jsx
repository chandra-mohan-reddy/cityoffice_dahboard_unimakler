import React from 'react';
import { Button } from 'react-bootstrap';


const CreateRole = () => {
    return (
        <div className="main-content">
          <div className="page-content">
            <div className="container-fluid">
              <div className="row">
                <div className="col-12">
                  <div className="page-title-box d-flex align-items-center justify-content-between">
                    <div className="page-title-right">
                     <h3>Add Create Role</h3>
                    </div>
                    {/* <div className="page-title-right">
                    <button onClick={() => setShow(true)} className="btn btn-info">
                      Add Project Type
                    </button>
                  </div> */}
                  </div>
                </div>
              </div>
              <div className="card mb-4">
              <div class="card-header"><h4 class="card-title">Create Role</h4></div>
              <div className="card-body p-4">
                <form className="custom-validation row">
                  <div className="col-md-8">
                  <div className="row">
                  <div className="col-md-6">
                      <div className="form-floating mb-3">
                        <select
                          className="form-select"
                          name="property_sub_type_id"
                          id="property_sub_type_id"
                          required="">
                            <option value="default"> Select Role		</option>
                          <option value="default"> Super Admin	</option>
                          <option value="default"> Country Admin	</option>
                          <option value="default"> City Admin	</option>
                          <option value="default"> Project Approval Manager		</option>
                          <option value="default"> Country Franchise	</option>
                          <option value="default"> Master Franchise	</option>
                          <option value="default"> Super Franchise		</option>
                          <option value="default"> Franchise	</option>
                          <option value="default"> Channel Partner</option>
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
                          <option value="default"> Select Admin		</option>
                          <option value="default"> Master Admin		</option>
                          <option value="default"> Super Admin	</option>
                          <option value="default"> Country Admin	</option>
                          <option value="default"> City Admin	</option>
                          <option value="default"> Project Approval Manager		</option>
                          <option value="default"> Country Franchise	</option>
                          <option value="default"> Master Franchise	</option>
                          <option value="default"> Super Franchise		</option>
                          <option value="default"> Franchise	</option>
                          <option value="default"> Channel Partner</option>
                        </select>
                        <label for="property_sub_type_id" className="fw-normal">
                          Assigned To <span className="req">*</span>
                        </label>
                      </div>
                    </div>
                 
                    <div class="col-md-12"><h5 class="asint mb-3">Details</h5></div>
                   
                    <div className="col-md-6">
                      <div className="form-floating mb-3">
                        <input
                          type="text"
                          id="corner"
                          className="form-control"
                          name="enter"
                          placeholder=""
                          required
                        />
                        <label htmlFor="corner" className="fw-normal">
                           Enter Name: *
                        </label>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-floating mb-3">
                        <input
                          type="tel"
                          id="corner"
                          className="form-control"
                          name="enter"
                          placeholder=""
                          required
                        />
                        <label htmlFor="corner" className="fw-normal">
                           Phone Number: *
                        </label>
                      </div>
                    </div>
                  
                    <div className="col-md-6">
                      <div className="form-floating mb-3">
                        <input
                          type="text"
                          id="corner"
                          className="form-control"
                          name="enter"
                          placeholder=""
                          required
                        />
                        <label htmlFor="corner" className="fw-normal">
                           Email : *
                        </label>
                      </div>
                    </div>
                   
                    <div class="col-md-12"><h5 class="asint mb-3">Present Address</h5></div>
                    <div className="col-md-4">
                      <div className="form-floating">
                        <select
                          className="form-select"
                          name="property_sub_type_id"
                          id="property_sub_type_id"
                          required="">
                          <option value="default">India </option>
                          <option value="default">Australia </option>
                        </select>
                        <label for="property_sub_type_id" className="fw-normal">
                          Select Country <span className="req">*</span>
                        </label>
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="form-floating">
                        <select
                          className="form-select"
                          name="property_sub_type_id"
                          id="property_sub_type_id"
                          required="">
                          <option value="default">India </option>
                          <option value="default">Australia </option>
                        </select>
                        <label for="property_sub_type_id" className="fw-normal">
                          Select State <span className="req">*</span>
                        </label>
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="form-floating">
                        <select
                          className="form-select"
                          name="property_sub_type_id"
                          id="property_sub_type_id"
                          required="">
                          <option value="default">India </option>
                          <option value="default">Australia </option>
                        </select>
                        <label for="property_sub_type_id" className="fw-normal">
                          Select City <span className="req">*</span>
                        </label>
                      </div>
                    </div>
                    <div className="col-md-12 mt-3">
                      <div className="form-floating mb-3">
                        <input
                          type="text"
                          id="corner"
                          className="form-control"
                          name="enter"
                          placeholder=""
                          height={200}
                          required
                        />
                        <label htmlFor="corner" className="fw-normal">
                          Address
                        </label>
                      </div>
                    </div>
                    <div class="col-md-12"><h5 class="asint mb-3">Login Credentials</h5></div>
                    <div className="col-md-4">
                      <div className="form-floating mb-3">
                        <input
                          type="text"
                          id="corner"
                          className="form-control"
                          name="enter"
                          placeholder=""
                          required
                        />
                        <label htmlFor="corner" className="fw-normal">
                        Login User Name : *
                        </label>
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="form-floating mb-3">
                        <input
                          type="text"
                          id="corner"
                          className="form-control"
                          name="enter"
                          placeholder=""
                          required
                        />
                        <label htmlFor="corner" className="fw-normal">
                        Password : *
                        </label>
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="form-floating mb-3">
                        <input
                          type="text"
                          id="corner"
                          className="form-control"
                          name="enter"
                          placeholder=""
                          required
                        />
                        <label htmlFor="corner" className="fw-normal">
                        Re-Type Password : *
                        </label>
                      </div>
                    </div>
                    <div class="col-md-12"><h5 class="asint mb-3">Upload Document</h5></div>
                    <div className="col-md-6 ">
                    <div className="form-floating mb-4">
                      <input
                        type="file"
                        id="corner"
                        className="form-control"
                        name="enter"
                        placeholder=""
                        required
                      />
                      <label htmlFor="corner" className="fw-normal">
                        Profile Pic
                      </label>
                    </div>
                  </div>

                  <div className="col-md-6 ">
                    <div className="form-floating mb-4">
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

                  <div className="col-md-6 mb-3">
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
                        Aadhar Card
                      </label>
                    </div>
                  </div>
    
                  <div className="col-md-6 mb-3">
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
                        Pan Card
                      </label>
                    </div>
                  </div>
    
                  </div>
                  </div>
                </form>
                </div>
              </div>
             
            
              
       <Button type="submit">Submit</Button>
            </div>
          </div>
        </div>
      );
}

export default CreateRole