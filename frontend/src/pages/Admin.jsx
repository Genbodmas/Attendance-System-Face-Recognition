import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "./component/Navbar";
import Navbutton from "./component/Navbutton";
import { Apiservice } from "../service";

export default function Admin() {

  const [latestArrivals, setlatestArrivals] = useState(null);
  const [searchstudent, setsearchstudent] = useState(null);
  const [searchstudentvalue, setsearchstudentvalue] = useState("");
  const [newstudent, setnewstudent] = useState({
    name: "",
    image: ""
  });
  const [loading1, setLoading1] = useState(false);
  const [loading2, setLoading2] = useState(false);
  const [loading3, setLoading3] = useState(false);

  function getInitials(params) {
    const a = params.split(' ')[0][0].toUpperCase();
    const b = params.split(' ')[1][0].toUpperCase();

    return a+b;
  }

  async function handleRegister() {
    setLoading3(true);
    try {
      await Apiservice.addStudent(newstudent)
      setnewstudent(
        {
          name: "",
          image: ""
        }
      )
      setLoading3(false);
    } catch (error) {
      console.log(error);
      setLoading3(false);
    }
  }

  async function fetchLatestArrivals() {
    setLoading1(true);
    try {
      const data = await Apiservice.getLatestEntries();
      setlatestArrivals(data);
      setLoading1(false);
    } catch (error) {
      console.log(error);
      setLoading1(false);
    }
  }

  async function searchStudentByName(params) {
    setLoading2(true);
    try {
      const data = await Apiservice.getStudent(params);
      setsearchstudent(data);
      setLoading2(false);
    } catch (error) {
      console.log(error);
      setLoading2(false);
    }
  }

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
                className="form-control d-block"
                // value=""
                onChange={(e) => {
                  setnewstudent({
                    ...newstudent,
                    image: e.target.files[0]
                  });
                }}
              />
              <input
                  type="search"
                  name="studentName"
                  placeholder="Enter student name here"
                  className="form-control d-block"
                  value={searchstudentvalue}
                  onChange={(e) => {
                    setnewstudent({
                      ...newstudent,
                      name: e.target.value
                    });
                  }}
                />
              <button className="btn btn-success w-100 mt-3"
              onClick={handleRegister}
              >Register</button>
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
