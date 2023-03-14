import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "./component/Navbar";
import Navbutton from "./component/Navbutton";
import { Apiservice } from "../service";

export default function Admin() {

  const [latestArrivals, setlatestArrivals] = useState(null);
  const [allstudents, setAllstudents] = useState(null);
  const [searchstudent, setsearchstudent] = useState(null);
  const [searchstudentvalue, setsearchstudentvalue] = useState("");
  const [newstudent, setnewstudent] = useState({
    name: "",
    image: ""
  });
  const [loading, setLoading] = useState(0);
  const [loading1, setLoading1] = useState(false);
  const [loading2, setLoading2] = useState(false);
  const [loading3, setLoading3] = useState(false);
  const [ModalType, setModalType] = useState(0);
  const [deletename, setDeletename] = useState("");
  const [activetab, setActivetab] = useState("");
  const [reportdata, setReportdata] = useState({
    email: "",
    frequency: ""
  });
  const [searchname, setSearchname] = useState("");

  const frequency = ["daily", "weekly"]

  const tabs = [
    {
      name: "All students",
      action: fetchAllStudents
    },
    {
      name: "Latest Arrivals",
      action: fetchLatestArrivals
    },
  ]

  function getInitials(params) {
    const a = params.split(' ')[0][0].toUpperCase();
    const b = params.split(' ')[1][0].toUpperCase();

    return a + b;
  }

  async function handleRegister() {
    if (!newstudent.image || !newstudent.name) {
      alert('Error: Please a provide the required fields');
      return;
    };

    setLoading(3);
    try {
      await Apiservice.addStudent(newstudent)
      setModalType(0)
      setnewstudent(
        {
          name: "",
          image: ""
        }
      )
      alert('Success: student registered successfully');
    } catch (error) {
      console.log(error);
      alert('Error: oops, something went wrong');
    }
    setLoading(0);
  }

  async function fetchLatestArrivals() {
    setLoading(1);
    try {
      const data = await Apiservice.getLatestEntries();
      setlatestArrivals(data);
    } catch (error) {
      console.log(error);
    }
    setLoading(0);
  }

  async function fetchAllStudents() {
    setLoading(1);
    try {
      const data = await Apiservice.getAllStudents();
      setlatestArrivals(data);
    } catch (error) {
      console.log(error);
    }
    setLoading(0);
  }

  async function GenerateReport() {
    if (reportdata.email) {
      alert("Error: please provide the required fields");
      return;
    }
    setLoading(5);
    try {
      await Apiservice.sendReportViaEmail(reportdata);
      setModalType(0)
      setReportdata({
        email: "",
        frequency: ""
      });
      alert(
        "Success: email sent successfully."
      )
    } catch (error) {
      console.log(error);
      alert(
        "Error: an error occurred."
      )
    }
    setLoading(0);
  }

  async function searchStudentByName() {
    if (!searchname) {
      alert("Error: please provide a valid name")
    }
    setLoading(2);
    try {
      const data = await Apiservice.getStudent(searchname);
      setsearchstudent(data);
    } catch (error) {
      console.log(error);
    }
    setLoading(0);
  }

  async function handleDelete() {
    if (!deletename) {
      alert('Error: Please a provide a valid student name');
      return;
    };

    setLoading(4);
    try {
      await Apiservice.deleteStudent(deletename);
      setModalType(0);
      alert('Success: student deleted successfully');
    } catch (error) {
      console.log(error);
      alert('Error: oops, something went wrong');
    }
    setLoading(0);
  }

  return (
    <section className="main_container">
      <Navbar />

      <div className="main_section_wrapper">

        <div className="nav_menu_section ml-auto">
          <div className="d-flex gap-2 text-right justify-content-end">
            <button
              className="register_btn btn btn-outline-primary"
              onClick={() => setModalType(1)}
            >
              Register student
            </button>
            <button
              className="delete_btn btn btn-outline-danger"
              onClick={() => setModalType(2)}
            >
              Delete student
            </button>
          </div>
        </div>

        {ModalType !== 0 && <Modal>
          {
            ModalType === 1 && <>
              <div className="search_section cards br shadow half_width">
                <div className="d-flex justify-content-between mb-2">
                  <h2 className="header_text my-2 ">Register student</h2>
                  <button className="modal_close_btn border"
                    onClick={() => setModalType(0)}
                  >x</button>
                </div>
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
                    className="form-control d-block mt-2"
                    value={
                      newstudent.name
                    }
                    onChange={(e) => {
                      setnewstudent({
                        ...newstudent,
                        name: e.target.value
                      });
                    }}
                  />
                  <button className="btn btn-success w-100 mt-3"
                    onClick={handleRegister}
                  >
                    {loading === 3 ? "Processing..." : "Register"}

                  </button>
                </div>
              </div>
            </>
          }
          {
            ModalType === 2 && <>
              <div className="search_section cards br shadow half_width">
                <div className="d-flex justify-content-between mb-2">
                  <h2 className="header_text my-2 ">Delete student</h2>
                  <button className="modal_close_btn border"
                    onClick={() => setModalType(0)}
                  >x</button>
                </div>
                <div>
                  <input
                    type="text"
                    name="studentName"
                    placeholder="Enter student name here"
                    className="form-control"
                    value=""
                    onChange={(e) => setDeletename(e.target.value)}
                  />
                  <button className="btn btn-danger w-100 mt-3"
                    onClick={handleDelete}
                  >
                    {loading === 4 ? "Processing..." : "Delete"}
                  </button>
                </div>
              </div>
            </>
          }
          {
            ModalType === 3 && <>
              <div className="search_section cards br shadow half_width">
                <div className="d-flex justify-content-between mb-2">
                  <h2 className="header_text my-2 ">Report Details</h2>
                  <button className="modal_close_btn border"
                    onClick={() => setModalType(0)}
                  >x</button>
                </div>
                <div>
                  <input
                    type="email"
                    name="studentName"
                    placeholder="Enter student name here"
                    className="form-control d-block mt-2"
                    value={
                      reportdata.email
                    }
                    onChange={(e) => {
                      setReportdata({
                        ...reportdata,
                        email: e.target.value
                      });
                    }}
                  />
                  <select
                    className="form-control mt-2"
                    value={reportdata.frequency}
                    onChange={(e) => {
                      setReportdata({
                        ...reportdata,
                        email: e.target.value
                      });
                    }}
                  >
                    <option value="">Select timeframe</option>
                    {
                      frequency.map(f => {
                        return <option value="f" key="f">f</option>
                      })
                    }
                  </select>
                  <button className="btn btn-success w-100 mt-3"
                    onClick={GenerateReport}
                  >
                    {loading === 3 ? "Processing..." : "Submit"}
                  </button>
                </div>
              </div>
            </>
          }
        </Modal>}

        <div className="main_section">

          <div className="tab_section_wrapper shadow">

            <div className="section_tabs">
              {
                tabs.map((t,i) => {
                  return (
                    <div className="tab_btn border rounded" role="button"
                    onClick={()=>{
                      setActivetab(i)
                      t.action()
                    }}
                    >
                      {t.name}
                    </div>
                  )
                })
              }

              <div className="search_tab border d-flex rounded">
                <input type="search"
                className="form-control border-0 outline-0 shadow-0"
                value={searchname}
                onChange={(e)=>{setSearchname(e.target.value)}}
                />
                <button className="btn btn-light"
                onClick={searchStudentByName}
                >
                  search
                </button>
              </div>

              <div className="btn btn-outline-dark rounded"
              onClick={()=>setModalType(3)}
              >
                Generate Report
              </div>
            </div>

            <div className="tab_contents_wrapper">
              <AdminTable />
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}

function Modal({
  children
}) {

  return (
    <>
      <div className="modal_wrapper">
        {children}
      </div>

    </>
  )
}

function AdminTable({

}) {

  return (
    <>
      <table className="table table-hover">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">Name</th>
            <th scope="col">Matric No</th>
            <th scope="col">Arrival Time</th>
            <th scope="col">Date</th>
          </tr>
        </thead>
        <tbody className="">
          <tr>
            <th scope="row">1</th>
            <td>Mark</td>
            <td>Otto</td>
            <td>@mdo</td>
            <td>@mdo</td>
          </tr>
          <tr>
            <th scope="row">2</th>
            <td>Jacob</td>
            <td>Thornton</td>
            <td>@fat</td>
          </tr>
          <tr>
            <th scope="row">3</th>
            <td colSpan={2}>Larry the Bird</td>
            <td>@twitter</td>
          </tr>
        </tbody>
      </table>

    </>
  )
}
