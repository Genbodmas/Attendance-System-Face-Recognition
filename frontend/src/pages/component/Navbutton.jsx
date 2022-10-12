import React from "react";
import "../../pages/style.css";
import { Link } from "react-router-dom";

export default function Navbutton() {
    
  const currentRoute = window.location.pathname;

  return (
    <div className="nav_menu_section ml-auto">
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
    </div>
  );
}
