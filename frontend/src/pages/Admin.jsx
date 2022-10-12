import React from "react";
import { Link } from "react-router-dom";
import Navbar from "./component/Navbar";
import Navbutton from "./component/Navbutton";

export default function Admin() {
  return (
    <section className="main_container">
      <Navbar />

      <div className="main_section_wrapper">
        <Navbutton />

        <div className="main_section colm">
          <div className="search_section cards br shadow half_width">
            <h2 className="header_text my-2 ">Register student</h2>
            <div>
              <input
                type="file"
                // name="studentName"
                // placeholder="Enter student name here"
                className="form-control"
                // value=""
                onChange={() => {}}
              />
              <button className="btn btn-success w-100 mt-3">Register</button>
            </div>
          </div>

          <div className="search_section cards br shadow half_width">
            <h2 className="header_text my-2 ">Delete student</h2>
            <div>
              <input
                type="text"
                name="studentName"
                placeholder="Enter student name here"
                className="form-control"
                value=""
                onChange={() => {}}
              />
              <button className="btn btn-primary w-100 mt-3">Search</button>
            </div>

            <div className="search_result_section mt-4">
                <h2 className="header_text my-2 border-top py-2">Result</h2>

                <div className="student_profile mb-3">
                    <div className="student_tag shadow-sm">
                        EB
                    </div>
                    <div className="student_details">
                        <div>
                        <span className="text-muted small_text">Name:</span> <span className="bb">Eso Bode</span>
                        </div>
                        <div>
                        <span className="text-muted small_text">Gender:</span> <span className="bb">Male</span>
                        </div>
                    </div>
                    <div className="delete_button ml-auto">
                        <button className="btn btn-danger">
                            Delete
                        </button>
                    </div>
                </div>

                <div className="header_text text-center">
                  No result found
                </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
