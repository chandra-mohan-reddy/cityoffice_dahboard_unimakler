import { useEffect, useState } from 'react';
import { masterClient } from '../../utils/httpClient';
import Loader from '../common/Loader';
const Projects = ({ data }) => {

  const [loading, setLoading] = useState(false);
  const [assignedProjects, setAssignedProjects] = useState([]);

  const getAssignedProjects = async () => {
    setLoading(true)

    const user_data = {
      id: data?.franchise_id,
      user_type: 24
    }

    try {
      let res = await masterClient.post(`/get-user-projects`, user_data)

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
    if (data && Object.keys(data).length > 0 && data.franchise_id) {
      getAssignedProjects();
    }
  }, [data])

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

  if (loading) return <Loader />
  return (
    <>
      <div className="p-4">
        <div className="row justify-content-center">
          <div className="col-md-12">
            <div className="card">
              <div className="card-header py-3">
                <h3 className="card-title">Assigned Project List</h3>
              </div>
              <div className="card-body">
                <div className="table-responsive-md">
                  <table className="table text-nowrap mb-0">
                    <thead>
                      <tr>
                        <th>S.No</th>
                        <th>Project Name </th>
                        <th>Bulider Name</th>
                        <th>City</th>
                        <th>Assigned By </th>
                        <th>Assigned On</th>
                      </tr>
                    </thead>
                    <tbody>
                      {assignedProjects.length > 0 ?
                        assignedProjects.map((each, index) => (
                          <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{each.projectName}</td>
                            <td>{each.builderName}</td>
                            <td>Hyderabad</td>
                            <td>H.O</td>
                            <td>{formatDate(each.assigned_date)}</td>
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
    </>
  );
};

export default Projects;
