import React from 'react'

const DeletedLeads = () => {
  return (
     <div className="main-content">
            <div className="page-content">
              <div className="container-fluid">
                <div className="row">
                  <div className="col-12">
                    <div className="page-title-box d-flex align-items-center justify-content-between">
                      <div className="page-title-right">
                        <h3 className="m-0 font-bold">Deleted List</h3>
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
                            <div class="form-floating mb-3">
                                <input type="text"  class="form-control" name="name" />
                                <label class="fw-normal">Customer Name</label>
                            </div>
                            </div>
                            <div className="col-md-3">
                            <div class="form-floating mb-3">
                                <input type="tel"  class="form-control" name="name" />
                                <label class="fw-normal">Mobile</label>
                            </div>
                            </div>
                            <div className="col-md-3">
                              <div className="form-floating mb-3">
                                <select className="form-select" name="subProperty" required>
                                  <option value="default">Select Project</option>
                                 
                                </select>
                                <label class="fw-normal">Project</label>
                              </div>
                            </div>
                            <div className="col-md-3">
                              <div className="form-floating mb-3">
                                <select className="form-select" name="subProperty" required>
                                  <option value="default">Select Franchise</option>
                                 
                                </select>
                                <label class="fw-normal">Franchise</label>
                              </div>
                            </div>
                            <div className="col-md-3">
                              <div className="form-floating">
                                <select className="form-select" name="subProperty" required>
                                  <option value="default">Select Source</option>
                                 
                                </select>
                                <label class="fw-normal">Source</label>
                              </div>
                            </div>
                            <div className="col-md-3 mt-3">
                              </div>
                            <div className="col-md-3 mt-3">
                              <div className="">
                                <div className="form-floating">
                                  <input type="date" id="from-date" className="form-control" name="fromdate" placeholder="Insert your lastname" required />
                                  <label htmlFor="from-date" className="fw-normal">From Date</label>
                                </div>
                              </div>
                            </div>
                            <div className="col-md-3 mt-3">
                              <div className="">
                                <div className="form-floating">
                                  <input type="date" id="from-date" className="form-control" name="fromdate" placeholder="Insert your lastname" required />
                                  <label htmlFor="from-date" className="fw-normal">To Date</label>
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
                        <h3 className="card-title">Deleted List</h3>
                      </div>
                      <div className="card-body">
                        <div className="table-responsive-md">
                          <table className="table text-nowrap mb-0">
                            <thead>
                              <tr>
                                <th>S.No</th>
                                <th>Customer Name</th>
                                <th>Mobile Number</th>
                                <th>Source</th>
                                <th>Project</th>
                                <th>Deleted On</th>
                                {/* <th>Received By</th> */}
                                <th>Deleted Ratio</th>
                              </tr>
                            </thead>
                            <tbody>
                        <tr>
                            <td>1</td>
                            <td>2</td>
                            <td>3</td>
                            <td>4</td>
                            <td>5</td>
                            <td>6</td>
                            <td>7</td>
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
  )
}

export default DeletedLeads