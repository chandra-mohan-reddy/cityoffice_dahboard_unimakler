import { useState, useEffect } from "react";
import "./App.css";
import Header from "./components/common/Header";
import Footer from "./components/common/Footer";
import Sidebar from "./components/common/Sidebar";
import LazyLoad from "./routes/LazyLoad";
import Loader from "./components/common/Loader";
import { authClient, masterClient } from "./utils/httpClient";
import { useNavigate, useLocation } from "react-router-dom";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { IpInfoContext } from "./utils/context";
import { Provider } from "react-redux";
import Store from "./store/Store";
import { useDispatch } from "react-redux";
import { setUserRole, setUserData } from "./store/slices/UserSlice";
import { toastError } from "./utils/toast";

const accessRoles = ['City Admin', 'Team Leader', 'Sales Executive', 'Channel Partner']

export const ValidateToken = async (dispatch, navigate, location, setLoader) => {
  const token = localStorage.getItem('adminToken');
  if (token == null) {
    setLoader(false);
    navigate('/')
    return;
  }
  try {
    const response = await authClient.post('/validate-token');
    if (response.status) {
      if (accessRoles.includes(response.data.data?.role)) {
        dispatch(setUserRole(response.data.data?.role));
        dispatch(setUserData(response.data?.data?.userData));
        if (location.pathname == '/') {
          navigate('/home')
        } else {
          navigate(location.pathname);
        }
      } else {
        toastError("You don't have access to this Application.");
        handleInvalidToken(navigate, dispatch);
      }
    }
  }
  catch (err) {
    console.error("Token validation failed:", err);
    handleInvalidToken(navigate, dispatch);
  }
  finally {
    setLoader(false);
  }
}


const handleInvalidToken = async (navigate, dispatch) => {
  navigate('/')
  dispatch(setUserRole(null));
  dispatch(setUserData(null));
  localStorage.removeItem('adminToken');
}


function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const [loader, setLoader] = useState(true);
  const [ipInfo, setIpInfo] = useState({});

  const dispatch = useDispatch();
  const token = localStorage.getItem('adminToken');

  /////////////////// Validating Existing Token   ///////////////////////

  // const getIpInfo = async () => {
  //   try {
  //     const response = await authClient.get('http://ip-api.com/json');
  //     if (response.data) {
  //       setIpInfo(response?.data?.query);
  //     }
  //   } catch (err) {
  //     console.log("Failed to fetch IP info:", err);
  //   }
  // };

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    token == (null || undefined) ? navigate('/') : '';
    if (token != null) {
      ValidateToken(dispatch, navigate, location, setLoader);
      // getIpInfo();
    } else {
      setLoader(false);
    }
  }, [token]);

  if (loader) return <Loader />;

  return (
    <>
      <Provider store={Store}>
        <IpInfoContext.Provider value={{ ipInfo }}>
          <div id="layout-wrapper">
            <ToastContainer />
            {loader && <Loader />}
            {token && (
              <div className="sidebar-fixed">
                <Sidebar />
              </div>
            )}
            <div className="main-content-area">
              {token && <Header />}
              <LazyLoad />
              {token && <Footer />}
            </div>
          </div>
        </IpInfoContext.Provider>
      </Provider>
    </>
  );
}

export default App;
