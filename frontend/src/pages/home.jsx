import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "./component/Navbar";
import Navbutton from "./component/Navbutton";
import { Apiservice } from "../service";

export default function Home() {

  const [latestArrivals, setlatestArrivals] = useState(null);
  const [searchstudent, setsearchstudent] = useState(null);
  const [searchstudentvalue, setsearchstudentvalue] = useState("");
  const [loading1, setLoading1] = useState(false);
  const [loading2, setLoading2] = useState(false);
  const [loading3, setLoading3] = useState(false);

  function getInitials(params) {
    const a = params.split(' ')[0][0].toUpperCase();
    const b = params.split(' ')[1][0].toUpperCase();

    return a+b;
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

  async function handleDelete(params) {
    if(!params) return;

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
        {/* <Navbutton /> */}

        <div className="main_section d-flex">
          {/* video feed section */}
          <div className="video_section">
            <div className="cards shadow rounded-lg  w-100 br">
              <h2 className="header_text">Video Feed - Classroom </h2>
              <iframe
                allowFullScreen="true"
                title="camera feed"
                webkitallowfullscreen="true"
                mozallowfullscreen="true"
                // !!! CHANGE HERE !!!
                src="http://127.0.0.1:5000/camera"
                frameBorder="0"
                width="100%"
                height="450"
              />
            </div>
          </div>

          {/* search and latest arrivals section */}
          <div className="side_section">
            <div className="search_section cards br shadow">
              <h2 className="header_text my-2 ">Search for student</h2>
              <div>
                <input
                  type="search"
                  name="studentName"
                  placeholder="Enter student name here"
                  className="form-control"
                  value={searchstudentvalue}
                  onChange={(e) => {
                    setsearchstudentvalue(e.target.value);
                  }}
                />
                <button className="btn btn-primary w-100 mt-3"
                onClick={() => {
                  if(!searchstudentvalue) return;
                  searchStudentByName(searchstudentvalue);
                }}
                >Search</button>
              </div>

              <div className="search_result_section mt-4">
                <h2 className="header_text my-2 border-top py-2">Result</h2>

                { searchstudent && <>
                    <div className="student_profile mb-3">
                      <div className="student_tag shadow-sm">{getInitials(searchstudent.name)}</div>
                      <div className="student_details">
                        <div>
                          <span className="text-muted small_text">Name:</span>{" "}
                          <span className="bb">{searchstudent.name}</span>
                        </div>
                        <div>
                          <span className="text-muted small_text">Gender:</span>{" "}
                          <span className="bb">{searchstudent.name}</span>
                        </div>
                      </div>
                      <div className="delete_button ml-auto">
                        <button className="btn btn-danger"
                        onClick={()=>{handleDelete(searchstudent.name)}}
                        >Delete</button>
                      </div>
                    </div>
                  </>
                }

                { !searchstudent && <div className="header_text text-center">No result found</div>}
              </div>
            </div>

            <div className="search_section cards br shadow mt-4">
              <h2 className="header_text my-2">Latest arrivals</h2>

              <div className="student_profile_container">

                {
                  (latestArrivals || []).map(student => {
                    return <>
                    <div className="student_profile mb-3">
                      <div className="student_tag shadow-sm">{getInitials(student.name)}</div>
                      <div className="student_details">
                        <div>
                          <span className="text-muted small_text">Name:</span>{" "}
                          <span className="bb">{student.name}</span>
                        </div>
                        <div>
                          <span className="text-muted small_text">Gender:</span>{" "}
                          <span className="bb">{student.gender}</span>
                        </div>
                      </div>
                    </div>
                    </>
                  })
                }

                {(!latestArrivals || latestArrivals?.length === 0) && <div className="header_text text-center">
                  No current arrivals
                </div>}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
