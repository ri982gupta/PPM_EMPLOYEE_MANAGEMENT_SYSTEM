import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  FaChevronCircleDown,
  FaChevronCircleUp,
  FaSearch,
  FaCheck,
  FaPlus,
} from "react-icons/fa";
import FlatPrimeReactTable from "../../PrimeReactTableComponent/FlatPrimeReactTable";

function ExpensesOpen() {
  const [employeeData, setEmployeeData] = useState([]);
  useEffect(() => {
    getapiData();
  }, []);
  const getapiData = async () => {
    const response = await axios.get(
      `https://jsonplaceholder.typicode.com/comments`
    );
    const data = await response.data;
    setEmployeeData(data);
  };
  return (
    <div>
      <div className="col-md-12">
        <div className="pageTitle">
          <div className="childOne"></div>
          <div className="childTwo">
            <h2>Expense Search History</h2>
          </div>
          <div className="childThree"></div>
        </div>
      </div>
      <div>
        <div className="group customCard">
          <h2>Recent Expense Searches</h2>
          <div className="group-content row">
            <div className="col-md-12">
              <FlatPrimeReactTable data={employeeData} />

              {/* <table
                className="table table-hover table-bordered"
                id="data-table"
              >
                <thead>
                  <tr>
                    <th>Expense</th>
                    <th>Created By</th>
                    <th>Net Amount</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>ES17434</td>
                    <td>Doe</td>
                    <td>$ 100.00</td>
                    <td>Pending</td>
                  </tr>
                  <tr>
                    <td>ES17439</td>
                    <td>Doe</td>
                    <td>$ 101.00</td>
                    <td>Pending</td>
                  </tr>
                  <tr>
                    <td>ES17438</td>
                    <td>Smith</td>
                    <td>$ 102.00</td>
                    <td>Pending</td>
                  </tr>
                </tbody>
              </table> */}
            </div>
          </div>
        </div>
      </div>
      <div>
        <div className="group mb-3 customCard">
          <div className="group-content row ">
            <div className="col-md-6 mb-2">
              <div className="form-group row">
                <label className="col-3" htmlFor="email-input">
                  Expense Stack
                </label>
                <span className="col-1 p-0 p-0 ">:</span>
                <div className="col-6">
                  <select id="country-select">
                    <option value="USA"> Please Select</option>
                    <option value="USA">PPM</option>
                    <option value="CAN">Projector</option>
                    <option value="MEX">Mexico</option>
                  </select>
                </div>
                <div className="col-2">
                  <button
                    type="button"
                    className="btn btn-primary"
                    title="Search"
                  >
                    <FaSearch /> Search{" "}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ExpensesOpen;
