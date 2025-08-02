import React from 'react';

const LeadTransfer = () => {
  return (
    <div className="p-4">
      {/* <div className="row">
        <div className="col-12">
          <div className="page-title-box d-flex align-items-center justify-content-between">
            <div className="page-title-right">
              <h3>Assigned Project List</h3>
            </div>
          </div>
        </div>
      </div> */}
      {/* 
      <div className="row justify-content-center ">
        <div className="col-md-10">
          <div className="cardd mb-4 cardd-input">
         
            <div className="card-body">
              <h3 className="card-title mb-3">Search List</h3>
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
                      <lable>Status</lable>
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
            <div className="card-header py-3">
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
                      <th>Request On</th>
                      <th>Requested Fran</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>1</td>
                      <td>Harsha .K</td>
                      <td>9876543212</td>
                      <td>Magic Bricks</td>
                      <td>RNR Developers</td>
                      <td>21/05/2025</td>
                      <td>Unimakler</td>
                      <td>
                        <button
                          type="button"
                          class="listin_btn btn btn-primary"
                          fdprocessedid="ttqflr">
                          <svg
                            stroke="currentColor"
                            fill="currentColor"
                            stroke-width="0"
                            viewBox="0 0 576 512"
                            height="1em"
                            width="1em"
                            xmlns="http://www.w3.org/2000/svg">
                            <path d="M572.52 241.4C518.29 135.59 410.93 64 288 64S57.68 135.64 3.48 241.41a32.35 32.35 0 0 0 0 29.19C57.71 376.41 165.07 448 288 448s230.32-71.64 284.52-177.41a32.35 32.35 0 0 0 0-29.19zM288 400a144 144 0 1 1 144-144 143.93 143.93 0 0 1-144 144zm0-240a95.31 95.31 0 0 0-25.31 3.79 47.85 47.85 0 0 1-66.9 66.9A95.78 95.78 0 1 0 288 160z"></path>
                          </svg>
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
      <br />
      <div className="row justify-content-center">
        <div className="col-md-12">
          <div className="card">
            <div className="card-header py-3">
              <h3 className="card-title">External Transfer</h3>
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
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>1</td>
                      <td>Ravi Kiran</td>
                      <td>987654321</td>
                      <td>Whisting Wood</td>
                      <td>Markproperties</td>
                      <td>987654321</td>
                      <td>987654321</td>
                      <td>
                        <button fdprocessedid="brergg">Accept / Reject</button>
                      </td>
                      <td>
                        <button
                          type="button"
                          class="listin_btn btn btn-primary"
                          fdprocessedid="6lthc9">
                          <svg
                            stroke="currentColor"
                            fill="currentColor"
                            stroke-width="0"
                            viewBox="0 0 576 512"
                            height="1em"
                            width="1em"
                            xmlns="http://www.w3.org/2000/svg">
                            <path d="M572.52 241.4C518.29 135.59 410.93 64 288 64S57.68 135.64 3.48 241.41a32.35 32.35 0 0 0 0 29.19C57.71 376.41 165.07 448 288 448s230.32-71.64 284.52-177.41a32.35 32.35 0 0 0 0-29.19zM288 400a144 144 0 1 1 144-144 143.93 143.93 0 0 1-144 144zm0-240a95.31 95.31 0 0 0-25.31 3.79 47.85 47.85 0 0 1-66.9 66.9A95.78 95.78 0 1 0 288 160z"></path>
                          </svg>
                        </button>
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
  );
};

export default LeadTransfer;
