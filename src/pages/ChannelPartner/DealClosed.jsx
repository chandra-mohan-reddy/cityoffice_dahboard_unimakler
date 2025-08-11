import React from 'react'

const DealClosed = () => {
  return (
     <div className="main-content">
        <div className="page-content">
          <div className="container-fluid">
            <div className="row justify-content-center mt-3">
              <div className="col-md-12">
                <div className="card">
                  <div className="card-header">
                    <h3 className="card-title">Deal Closed</h3>
                  
                  </div>
                  <div className="card-body">
                    <div className="table-responsive-md">
                      <table className="table text-nowrap mb-0">
                        <thead>
                          <tr>
                            <th>S.No</th>
                            <th>Customer Number </th>
                            <th>Mobile Number</th>
                            <th>Project Name</th>
                            <th>Closed By</th>
                            <th>Closed Date</th>
                            <th>Action</th>
                        </tr>
                        </thead>
                        <tbody className="block5-franchise-performance">
                          <tr>
                            <td>1</td>
                            <td>Eshwar Kumar</td>
                            <td>9876543212</td>
                            <td>Signature Fortius</td>
                            <td>24 Feb 2025</td>
                            <td>24 Feb 2025</td>
                            <td>
                              <button className="btn btn-primary mt-0" fdprocessedid="ykuw">
                                <svg
                                  stroke="currentColor"
                                  fill="currentColor"
                                  stroke-width="0"
                                  viewBox="0 0 576 512"
                                  height="1em"
                                  width="1em"
                                  xmlns="http://www.w3.org/2000/svg">
                                  <path d="M572.52 241.4C518.29 135.59 410.93 64 288 64S57.68 135.64 3.48 241.41a32.35 32.35 0 0 0 0 29.19C57.71 376.41 165.07 448 288 448s230.32-71.64 284.52-177.41a32.35 32.35 0 0 0 0-29.19zM288 400a144 144 0 1 1 144-144 143.93 143.93 0 0 1-144 144zm0-240a95.31 95.31 0 0 0-25.31 3.79 47.85 47.85 0 0 1-66.9 66.9A95.78 95.78 0 1 0 288 160z"></path>
                                </svg>{' '}
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
        </div>
      </div>
  )
}

export default DealClosed