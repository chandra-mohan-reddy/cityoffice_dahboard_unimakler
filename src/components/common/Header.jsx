import { useState } from 'react';
import { AiOutlineLogout } from "react-icons/ai";
import { Link, useNavigate } from 'react-router-dom';
import Sidebar from "./Sidebar";
import { HiMiniBars3 } from "react-icons/hi2";
import Offcanvas from "react-bootstrap/Offcanvas";
import Dropdown from 'react-bootstrap/Dropdown';
import { FaUserCircle } from 'react-icons/fa';
import { useSelector } from 'react-redux';
const Header = () => {
  const role = useSelector((state) => state.user.role)
  const userData = useSelector((state) => state.user.userData)
  const [show, setShow] = useState(false);
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/');
  }
  return (
    <>
      <header id="page-topbar">
        <div className="navbar-header d-flex justify-content-between align-items-center pr-3">
          <div className='hed_title'><h4>Channel Partner</h4></div>
          {/* <div className='hed_title'><h4>{role == 'City Admin' ? 'City Office' : role}</h4></div> */}
          <div className='d-flex align-items-center'>
            <Dropdown align="end">
              <Dropdown.Toggle variant="link" id="dropdown-profile" className="p-0 border-0 shadow-none">
                <FaUserCircle size={32} />
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item as={Link} to="/profile">Profile</Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Item onClick={handleLogout}>Logout <AiOutlineLogout /></Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
            <div className="mobile-toggle d-none">
              <HiMiniBars3 onClick={() => setShow(true)} />
            </div>
          </div>
        </div>
      </header>
      <Offcanvas show={show} onHide={() => setShow(false)}>
        <Offcanvas.Header closeButton>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <div className='side_out'>
            <Sidebar />
          </div>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
};

export default Header;
