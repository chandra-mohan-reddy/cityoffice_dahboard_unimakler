import React from 'react'

const FranchiseeFormm = () => {
  return (
    <>
     <div className="card mb-4">
              <div class="card-header"><h3 class="card-title"> Franchise Details</h3></div>
              <div className='card-body p-4'>
              <form className="custom-validation">
                <div className="row ">
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
                  <div className="col-md-4 mb-3"></div>
                  <div className="col-md-8 mb-3">
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
                        Company Name
                      </label>
                    </div>
                  </div>
                  <div className="col-md-4 mb-3"></div>
                  <div className="col-md-12 mb-3">
                    <div className="form-floating">
                      <textarea
                        type="text"
                        id="corner"
                        className="form-control"
                        name="enter"
                        placeholder=""
                        required

                      >
                      </textarea>

                      <label htmlFor="corner" className="fw-normal">
                        Address
                      </label>
                    </div>
                  </div>
                
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
    
                </div>
              </form>
              </div>
            </div>
            <div className="card mb-4">
              <div class="card-header"><h3 class="card-title">Contact Details</h3></div>
              <div className='card-body p-4'>
              <form className="custom-validation">
                <div className="row ">
                
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
                
      
                </div>
              </form>
              </div>
            </div>
            <div className="card mb-4">
              <div class="card-header"><h3 class="card-title">Franchise Tenure</h3></div>
              <div className='card-body p-4'>
              <form className="custom-validation">
                <div className="row ">
                
              
                  <div className="col-md-6 mb-3">
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
                        Start Date
                      </label>
                    </div>
                  </div>
                  <div className="col-md-6 mb-3">
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
                        End Date
                      </label>
                    </div>
                  </div> 
               
                </div>
              </form>
              </div>
            </div>
            <div className="card mb-4">
              <div class="card-header"><h3 class="card-title">Assign Projects</h3></div>
              <div className='card-body p-4'>
              <form className="custom-validation">
                <div className="row ">
                
              
            
                  <div className="col-md-6 mb-1 bg-gray">
                
                    <div className="form-floating">
                      <select className="form-select" name="amenities" required>
                        <option value="default">Select Projects</option>
                        <option value="">Club House</option>
                        <option value="">Fitness</option>
                        <option value="">Convinience</option>
                        <option value="">Saftey & Security</option>
                        <option value="">Others</option>
                        <option value="">Landscaping</option>
                        <option value="">Network & Connectivity</option>
                      </select>
                    </div>

                  </div>
                </div>
              </form>
              </div>
            </div>
            <div className="card mb-4">
              <div class="card-header"><h3 class="card-title">Upload Documents</h3></div>
              <div className='card-body p-4'>
              <form className="custom-validation">
                <div className="row ">
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
                        RERA Registration Number
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
                        GST Certificate
                      </label>
                    </div>
                  </div>


            
    
                </div>
              </form>
              </div>
            </div>

            <div className="card mb-4">
    <div class="card-header"><h4 class="card-title">Role Assign to</h4></div>
    <div className="card-body p-4 row">
    <div className="col-md-4">
                <div className="form-floating mb-3">
                  <select
                    className="form-select"
                    name="property_sub_type_id"
                    id="property_sub_type_id"
                    required="">
                      <option value="default"> Select Country Franchisee </option>
               
                    <option value="default"> Country Franchisee </option>
                
                  </select>
                  <label for="property_sub_type_id" className="fw-normal">
                    Select Role <span className="req">*</span>
                  </label>
                </div>
              </div>
    <div className="col-md-4">
                <div className="form-floating mb-3">
                  <select
                    className="form-select"
                    name="property_sub_type_id"
                    id="property_sub_type_id"
                    required="">
                      <option value="default"> Select Master Franchisee </option>
               
                    {/* <option value="default"> Country Franchisee </option> */}
                
                  </select>
                  <label for="property_sub_type_id" className="fw-normal">
                    Select Master Franchisee <span className="req">*</span>
                  </label>
                </div>
              </div>
    <div className="col-md-4">
                <div className="form-floating mb-3">
                  <select
                    className="form-select"
                    name="property_sub_type_id"
                    id="property_sub_type_id"
                    required="">
                      <option value="default"> Select Super Franchisee </option>
               
                    {/* <option value="default"> Country Franchisee </option> */}
                
                  </select>
                  <label for="property_sub_type_id" className="fw-normal">
                    Select Super Franchisee <span className="req">*</span>
                  </label>
                </div>
              </div>
      </div>
    </div>
    <div className="col-md-12 text-end">
                    <button className='btn btn-primary'>Submit</button>
                  </div>
    </>
  )
}

export default FranchiseeFormm