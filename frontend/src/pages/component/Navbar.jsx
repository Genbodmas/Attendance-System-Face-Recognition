import React from "react";
import "../../pages/style.css";
import { Link } from "react-router-dom";
// import { Link } from "react-router-dom";

export default function Navbar() {
  const currentRoute = window.location.pathname;

  return (
    <nav className="nav_section shadow-sm">
      <div className="nav_title">
        Attendance System With Facial Recognition
      </div>
      <div className="nav_menu_wrapper">
        <Link to="/">
          <button
            className={`nav_menu_btn ${currentRoute === "/" && "isActive"}`}
          >
            Home
          </button>
        </Link>
        <Link to="/admin">
          <button
            className={`nav_menu_btn ${
              currentRoute === "/admin" && "isActive"
            }`}
          >
            Administrator
          </button>
        </Link>
      </div>
    </nav>
  );
}
