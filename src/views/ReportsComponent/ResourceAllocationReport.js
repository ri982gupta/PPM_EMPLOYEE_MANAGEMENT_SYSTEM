import React, { useState, useEffect } from "react";
import { MultiSelect } from "react-multi-select-component";
import { FaChevronCircleDown, FaChevronCircleUp, FaSearch, FaCheck } from "react-icons/fa";
import { CCollapse } from "@coreui/react";
import { getTableData } from "./ResourceAllocationReportTable";
import FlatPrimeReactTable from "../PrimeReactTableComponent/FlatPrimeReactTable";
import axios from "axios";
import { environment } from "../../environments/environment";


function ResourceAllocationReport() {
  const [visible, setVisible] = useState(false);
  const [cheveronIcon, setCheveronIcon] = useState(FaChevronCircleUp);
  const [dataAr, setDataAr] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [selectedDepartments, setSelectedDepartments] = useState([]);
  const [country, setCountry] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState([]);
  const initialValue = { buIds: "", country: "" };
  const [formData, setFormData] = useState(initialValue);
  const baseUrl = environment.baseUrl;

  const getCountries = () => {
    axios
      .get(baseUrl + `/CostMS/cost/getCountries`)

      .then((Response) => {
        let countries = [];

        let data = Response.data;
        data.length > 0 &&
          data.forEach((e) => {
            let countryObj = {
              label: e.country_name,
              value: e.id,
            };
            countries.push(countryObj);
          });
        setCountry(countries);
        setSelectedCountry(countries);
      })
      .catch((error) => console.log(error));
  };

  const getDepartments = () => {
    axios({
      method: "get",
      url: baseUrl + `/CostMS/cost/getDepartments`,
    })

      .then((Response) => {
        let departments = [];

        let data = Response.data;
        data.length > 0 &&
          data.forEach((e) => {
            let buObj = {
              label: e.label,
              value: e.value,
            };
            departments.push(buObj);
          });
        setDepartments(departments);
        setSelectedDepartments(departments);
        setFormData((prevVal) => ({
          ...prevVal,
          ["buIds"]: departments.toString(),
        }));
      })
  };


  useEffect(() => {

    getCountries();
    getDepartments()
    let tdata = getTableData();

    //console.log('ski1',tdata);
    setDataAr(tdata);

  }, []);
  return (
    <div>
      <div className="col-md-12">
        <div className="pageTitle">
          <div className="childOne"></div>
          <div className="childTwo">
            <h2>Resource Allocation Report</h2>
          </div>
          <div className="childThree"></div>
        </div>
      </div>
      <div className="group mb-3 customCard">
        <div className="col-md-12 collapseHeader">
          <h2>Search Filters</h2>

          <div
            onClick={() => {
              setVisible(!visible);

              visible
                ? setCheveronIcon(FaChevronCircleUp)
                : setCheveronIcon(FaChevronCircleDown);
            }}
          >
            <span>{cheveronIcon}</span>
          </div>
        </div>
        {/* <h2>Resource Allocation Report</h2> */}
        <CCollapse visible={!visible}>
          <div className="group-content row">
            <div className="col-md-3 mb-2 mb-2">
              <div className="form-group row">
                <label className="col-5" htmlFor="businessUnit">
                  Business Unit
                </label>
                <span className="col-1 p-0">:</span>
                <div className="col-6">
                  <MultiSelect
                    id="buIds"
                    options={departments}
                    hasSelectAll={true}
                    isLoading={false}
                    shouldToggleOnHover={false}
                    disableSearch={false}
                    value={selectedDepartments}
                    // valueRenderer={customValueRenderer}
                    disabled={false}
                    onChange={(s) => {
                      setSelectedDepartments(s);
                      let filteredValues = [];
                      s.forEach((d) => {
                        filteredValues.push(d.value);
                      });

                      setFormData((prevVal) => ({
                        ...prevVal,
                        ["buIds"]: filteredValues.toString(),
                      }));
                    }}
                  />
                </div>
              </div>
            </div>
            <div className="col-md-3 mb-2 mb-2">
              <div className="form-group row">
                <label className="col-5" htmlFor="country">
                  Country
                </label>
                <span className="col-1 p-0">:</span>
                <div className="col-6">
                  <MultiSelect
                    id="country"
                    options={country}
                    hasSelectAll={true}
                    value={selectedCountry}
                    disabled={false}
                    // valueRenderer={customValueRenderer}
                    onChange={(e) => {
                      setSelectedCountry(e);
                      let filteredCountry = [];
                      e.forEach((d) => {
                        filteredCountry.push(d.value);
                      });
                      setFormData((prevVal) => ({
                        ...prevVal,
                        ["country"]: filteredCountry.toString(),
                      }));
                    }}
                  />
                </div>
              </div>
            </div>
            <div className="col-md-12 col-sm-12 col-xs-12 btn-container center my-2">
              <button className="btn btn-primary ">Search</button>
            </div>
          </div>
        </CCollapse>
      </div>
      {/* <div className="col-md-12">
          <FlatPrimeReactTable data={dataAr}/>
    </div> */}
    </div>
  );
}

export default ResourceAllocationReport;
