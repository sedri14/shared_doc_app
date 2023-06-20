import React from "react";
import { Link } from "react-router-dom";
import { useGlobalContext } from "../context";

const Nav = () => {
  const { isLoggedin, currentUserEmail, logoutUser } = useGlobalContext();

  const handleLogout = () => {
    logoutUser();
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <ul className="navbar-nav me-auto mb-2 mb-lg-0">
        <li className="nav-item">
          <Link className="nav-link" to="/">
            Home
          </Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link" to="/dashboard">
            Dashboard
          </Link>
        </li>

        {isLoggedin ? (
          <li className="nav-item">
            <Link className="nav-link" to="/shared-with-me">
              Shared With Me
            </Link>
          </li>
        ) : (
          <></>
        )}
      </ul>
      <ul className="navbar-nav ms-auto mb-2 mb-lg-0 d-flex">
        {isLoggedin ? (
          <>
            <li className="nav-item">
              <Link className="nav-link">{`Hi ${currentUserEmail}`}</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/" onClick={handleLogout}>
                Logout
              </Link>
            </li>
          </>
        ) : (
          <>
            <li className="nav-item">
              <Link className="nav-link" to="/register">
                Register
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/login">
                Login
              </Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Nav;
