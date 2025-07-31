import { useState, useEffect } from 'react';
import { masterClient } from '../../utils/httpClient';
import Loader from '../../components/common/Loader';
import { useSelector } from 'react-redux';
import { toastError, toastSuccess } from '../../utils/toast';
import confirmAction from '../../components/reusable/ConfirmToast'
import { AiOutlineStop } from "react-icons/ai";
import { FaEye } from "react-icons/fa";
import { Link } from 'react-router-dom';

const FranchiseList = () => {
    const userData = useSelector((state) => state.user.userData)
    const [loading, setLoading] = useState(false);
    const [franchisesList, setFranchisesList] = useState([]);

    useEffect(() => {
        if (userData) getFranchises();
    }, [userData])

    const getFranchises = async () => {
        setLoading(true)
        try {
            let res = await masterClient.get(`/super-franchise/franchises/${userData.franchise_id}`)
            if (res?.data?.status) {
                setFranchisesList(res?.data?.data)
            }
        } catch (err) {
            console.error(`Error getting franchises => ${err}`)
        } finally {
            setLoading(false)
        }
    }

    const deactiveFranchise = async (id) => {
        if (await confirmAction("Deactivate the selected franchise ?")) {
            try {
                setLoading(true)
                let res = await masterClient.delete(`/super-franchise/franchise/${id}`)
                if (res?.data?.status) {
                    toastSuccess("Deactivated Successfully")
                    await getFranchises()
                } else {
                    toastError("Failed please try again")
                }
            } catch (error) {
                toastError("Failed please try again")
                console.error(`Error Deactivating Franchise ${error}`)
            } finally {
                setLoading(false)
            }
        }
    }


    return (
        <>
            {loading && <Loader />}
            <div className="main-content">
                <div className="page-content">
                    <div className="container-fluid">
                        <div className="row">
                            <div className="col-12">
                                <div className="page-title-box d-flex align-items-center justify-content-between">
                                    <div className="page-title-right">
                                        <ol className="breadcrumb m-0">
                                            <li className="breadcrumb-item">
                                                <a href="/">Terraterri</a>
                                            </li>
                                            <li className="breadcrumb-item active">Franchise Lists</li>
                                        </ol>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="row justify-content-center">
                            <div className="col-md-12">
                                <div className="card">
                                    <div className="card-header">
                                        <h3 className="card-title">Franchise Lists</h3>
                                        <div className="">
                                            <input type="text" className="form-control" placeholder="Search by name" />
                                        </div>
                                    </div>
                                    <div className="card-body">
                                        <div className="table-responsive-md">
                                            <table className="table text-nowrap mb-0">
                                                <thead>
                                                    <tr>
                                                        <th>ID</th>
                                                        <th>Name</th>
                                                        <th>Company Name</th>
                                                        <th>Email</th>
                                                        <th>Number</th>
                                                        <th>Franchise</th>
                                                        <th>Address</th>
                                                        <th>Details</th>
                                                        <th>Action</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {franchisesList.length > 0 ?
                                                        franchisesList.map((el, index) => (
                                                            <tr key={index}>
                                                                <td>{index + 1}</td>
                                                                <td>{el.contact_person}</td>
                                                                <td>{el.franchise_name}</td>
                                                                <td>{el.franchise_primary_email}</td>
                                                                <td>{el.franchise_primary_phoneno}</td>
                                                                <td>{el.franchiseTier}</td>
                                                                <td>{el.franchise_address}</td>
                                                                <td>
                                                                    <Link to={`/franchise/details/${el.franchise_id}`}>
                                                                        <button>View</button>
                                                                    </Link>
                                                                </td>
                                                                <td>
                                                                    <i className="far fa-edit"></i>
                                                                    <AiOutlineStop />
                                                                    <Link to="/franchise/franchisesList" ><FaEye /></Link>
                                                                    <i className="fa fa-trash" onClick={() => deactiveFranchise(el.franchise_id)}></i>
                                                                </td>
                                                            </tr>
                                                        ))
                                                        :
                                                        <tr>
                                                            <td colSpan={8}>No Franchises Found</td>
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
        </>
    );
};

export default FranchiseList;
