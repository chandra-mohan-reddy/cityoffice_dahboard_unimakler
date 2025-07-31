import React, { useEffect, useState } from "react";
import { FaEye } from "react-icons/fa";
import { masterClient } from '../../utils/httpClient';
import Loader from '../../components/common/Loader';
import { useSelector } from "react-redux";
import Modal from 'react-bootstrap/Modal';
import { Button } from 'react-bootstrap';
const Projects = () => {
  const userData = useSelector((state) => state.user.userData);
  const role = useSelector((state) => state.user.role);
  const [loading, setLoading] = useState(false);
  const [assignedProjects, setAssignedProjects] = useState([]);
  const [builder, setBuilder] = useState({});
  const [show, setShow] = useState(false)

  const handleClose = () => setShow(false)

  const getAssignedProjects = async () => {
    setLoading(true)
    try {
      let res;
      if (role === "franchise" || role === "Super Franchise") {
        res = await masterClient.get(`/users-projects-mapping/${userData.franchise_id}`)
      } else {
        res = await masterClient.get(`/users-projects-mapping/${userData.id}`)
      }

      if (res?.data?.status && res?.data?.data.length > 0) {
        setAssignedProjects(res?.data?.data);
      }
    } catch (err) {
      console.error(`Error getting Projects ${err}`)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (userData) getAssignedProjects();
  }, [])

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (error) {
      return 'Invalid Date';
    }
  };

  const getBuilder = async (id) => {
    setLoading(true)
    try {
      setShow(true)
      const res = await masterClient.get(`/builder/${id}`)
      if (res?.data?.status) {
        setBuilder(res?.data?.data || {})
      }
    } catch (error) {
      console.error(`Error fetching builder ${error}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {loading && <Loader />}
      <div className='main-content'>
        <div className="page-content">
          <div className="container-fluid">
            <div className="row">
              <div className="col-12">
                <div className="page-title-box d-flex align-items-center justify-content-between">
                  <div className="page-title-right">
                    <ol className="breadcrumb m-0">
                      <li className="breadcrumb-item active">
                        <h4 className="m-0 font-bold">Assigned Projects</h4>
                      </li>
                    </ol>
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
                    <h3 className="card-title">Assigned Project List</h3>
                    <div className="mb-0">
                      <h6 className='mb-0'>Assigned Branch: </h6>
                      <h5 className='mb-0 clr-white'>Unimakler   Kondapur, Hyderabad.</h5>
                    </div>
                  </div>
                  <div className="card-body">
                    <div className="table-responsive-md">
                      <table className="table text-nowrap mb-0">
                        <thead>
                          <tr>
                            <th>S.No</th>
                            <th>Project Name	</th>
                            <th>Bulider Name</th>
                            <th>City</th>
                            <th>Assigned By	</th>
                            <th>Assigned On</th>
                            <th>Status</th>
                          </tr>
                        </thead>
                        <tbody className='block5-franchise-performance'>
                          {assignedProjects.length > 0 ?
                            assignedProjects.map((each, index) => (
                              <tr key={index}>
                                <td>{index + 1}</td>
                                <td>{each.projectName}</td>
                                <td>{each.builderName}</td>
                                <td>Hyderabad</td>
                                <td>H.O</td>
                                <td>{formatDate(each.assigned_date)}</td>
                                <td>
                                  <button onClick={() => getBuilder(each.builder_id)} className='btn btn-primary mt-0'><FaEye /> </button>
                                </td>
                              </tr>
                            ))
                            :
                            <tr>
                              <td colSpan={6} className="text-center">No Projects</td>
                            </tr>
                          }
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

      <Modal
        show={show}
        onHide={handleClose}
        size="lg"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Builder details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="card shadow-sm border-0">
            <div className="card-body">
              <dl className="row mb-0">
                <dt className="col-sm-3 text-muted small mb-2">Name</dt>
                <dd className="col-sm-9 fw-semibold mb-2">{builder.name}</dd>

                <dt className="col-sm-3 text-muted small mb-2">Md Name</dt>
                <dd className="col-sm-9 fw-semibold mb-2">{builder.md_name}</dd>

                <dt className="col-sm-3 text-muted small mb-2">Md Mobile</dt>
                <dd className="col-sm-9 fw-semibold mb-2">{builder.md_phone_number}</dd>

                <dt className="col-sm-3 text-muted small mb-2">Md Email</dt>
                <dd className="col-sm-9 fw-semibold mb-2">{builder.md_email || 'N/A'}</dd>

                <dt className="col-sm-3 text-muted small mb-2">CP Name</dt>
                <dd className="col-sm-9 fw-semibold mb-2">{builder.cp_manager_name}</dd>

                <dt className="col-sm-3 text-muted small mb-2">CP Phone</dt>
                <dd className="col-sm-9 fw-semibold mb-2">{builder.cp_manager_phone_number}</dd>

                <dt className="col-sm-3 text-muted small mb-2">CP Email</dt>
                <dd className="col-sm-9 fw-semibold mb-2">{builder.cp_manager_email || 'N/A'}</dd>
              </dl>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>Close</Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default Projects