import React, { useState, useEffect, useRef } from "react";
import DatePicker from "react-datepicker";
import { MultiSelect } from "react-multi-select-component";
import axios from "axios";
import { environment } from "../../environments/environment";
import CellRendererPrimeReactDataTable from "../PrimeReactTableComponent/CellRendererPrimeReactDataTable";
import Column from "antd/lib/table/Column";
import moment from "moment";
import { CCollapse } from "@coreui/react";
import GlobalValidation from "../ValidationComponent/GlobalValidation";
import {
  FaChevronCircleDown,
  FaChevronCircleUp,
  FaSearch,
} from "react-icons/fa";
import { AiFillWarning } from "react-icons/ai";
import Loader from "../Loader/Loader";
import GlobalHelp from "../PrimeReactTableComponent/GlobalHelp";
function JobsDailyStatus() {
  const [visible, setVisible] = useState(false);
  const ref = useRef([]);
  const [loader, setLoader] = useState(false);
  const [validationmessage, setValidationMessage] = useState(false);
  let rows = 10;
  const HelpPDFName = "JobdailystatusAdministration.pdf";
  const HelpHeader = "Job Daily Status Help";
  const [startDate, setStartDate] = useState(new Date());
  let date1 = moment(startDate).format("yyyy-MM-DD");
  const [endDate, setEndDate] = useState(new Date());
  let date2 = moment(endDate).format("yyyy-MM-DD");
  const [jobtit, setJobtit] = useState([]);
  const [headerData, setHeaderData] = useState([]);
  const [selectedjobtit, setSelectedjobtit] = useState([]);
  const [searchDataB, setSearchDataB] = useState(
    "3,4,37,38,17,18,19,8,9,10,11,13,14,15,16,32,36"
  );
  const baseUrl = environment.baseUrl;
  const [data, setData] = useState([]);
  const [status, setStatus] = useState("0,1");
  const [cheveronIcon, setCheveronIcon] = useState(FaChevronCircleUp);

  console.log("axios multiselect--------------------", searchDataB);
  const JobTitle = () => {
    axios
      .get(baseUrl + `/reportms/report/getJobTitle`)
      .then((res) => {
        let data = res.data;
        let jobtitlelist = [];
        console.log(data);
        data.length > 0 &&
          data.forEach((e) => {
            let dpObj = {
              label: e.jobTitle,
              value: e.id,
            };
            jobtitlelist.push(dpObj);
          });

        setJobtit(jobtitlelist);
        setSelectedjobtit(jobtitlelist);
      })
      .catch((error) => console.log(error));
  };

  useEffect(() => {
    JobTitle();
  }, []);

  const getData = () => {
    let valid = GlobalValidation(ref);
    console.log(valid);
    if (valid == true) {
      setValidationMessage(true);
    } else {
      setLoader(true);

      // // setValidationMessage(false)
      // if (valid) {
      //   return;
      // }
      console.log(selectedjobtit);
      console.log(status);
      axios
        .get(
          `${baseUrl}/reportms/report/getjobsDailyStatus?status=${status}&fromdate=${date1}&todate=${date2}&jobid=${searchDataB}`
        )

        .then((res) => {
          const GetData = res.data;
          let headerdata = [
            {
              job_name: "Job Name",
              run_date: "Run Date",
              run_time: "Run Time",
              duration: "Duration",
              status: " Status",
            },
          ];
          for (let i = 0; i < GetData.length; i++) {
            GetData[i]["run_date"] =
              GetData[i]["run_date"] == null
                ? ""
                : moment(GetData[i]["run_date"]).format("DD-MMM-yyyy");
          }

          setData(headerdata.concat(GetData));
          setValidationMessage(false);
          console.log(GetData);
          setTimeout(() => {
            setLoader(false);
          }, 300);
        })
        .catch((error) => {
          console.log("Error :" + error);
        });
    }
  };

  const LinkTemplate = (data) => {
    return <span>{data.status === 0 ? "Failure" : "Success"}</span>;
  };

  const dynamicColumns = Object.keys(headerData)?.map((col, i) => {
    return (
      <Column
        sortable
        key={col}
        body={col == "status" && LinkTemplate}
        field={col}
        header={headerData[col]}
      />
    );
  });

  console.log(data);

  return (
    <div>
      <div>
        <div className="col-md-12">
          <div className="pageTitle">
            <div className="childOne"></div>
            <div className="childTwo">
              <h2>Jenkins Jobs Daily Status</h2>
            </div>
            <div className="childThree"></div>
          </div>
        </div>
        {validationmessage ? (
          <div className=" ml-3 mr-4 statusMsg error">
            <AiFillWarning /> Please Select Mandatory Fields
          </div>
        ) : (
          ""
        )}
        <div className="group mb-3 customCard">
          <div className="col-md-12 collapseHeader">
            <h2>Search Filters</h2>
            <div className="helpBtn">
              <GlobalHelp pdfname={HelpPDFName} name={HelpHeader} />
            </div>
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
          <CCollapse visible={!visible}>
            <div className="group-content row">
              <div className=" col-md-3 mb-2">
                <div className="form-group row">
                  <label className="col-5" htmlFor="From Date">
                    From Date<span className="col-1 p-0 error-text">*</span>
                  </label>
                  <span className="col-1 p-0">:</span>
                  <div className="col-6">
                    <DatePicker
                      selected={startDate}
                      maxDate={new Date()}
                      onChange={(date) => {
                        setStartDate(moment(date)._d);
                      }}
                      onKeyDown={(e) => {
                        e.preventDefault();
                      }}
                      dateFormat="dd-MMM-yyyy"
                    />
                  </div>
                </div>
              </div>
              <div className=" col-md-3 mb-2">
                <div className="form-group row">
                  <label className="col-5" htmlFor="To Date">
                    To Date<span className="col-1 p-0 error-text">*</span>
                  </label>
                  <span className="col-1 p-0">:</span>
                  <div className="col-6">
                    <DatePicker
                      selected={endDate}
                      minDate={startDate}
                      maxDate={new Date()}
                      onChange={(date) => setEndDate(moment(date)._d)}
                      dateFormat="dd-MMM-yyyy"
                      onKeyDown={(e) => {
                        e.preventDefault();
                      }}
                    />
                  </div>
                </div>
              </div>
              <div className=" col-md-3 mb-2">
                <div className="form-group row">
                  <label className="col-5" htmlFor="Job Title">
                    Job Title<span className="col-1 p-0 error-text">*</span>
                  </label>
                  <span className="col-1 p-0">:</span>
                  <div
                    className="col-6 multiselect"
                    ref={(ele) => {
                      ref.current[0] = ele;
                    }}
                  >
                    <MultiSelect
                      id="buId"
                      options={jobtit}
                      hasSelectAll={true}
                      value={selectedjobtit}
                      disabled={false}
                      onChange={(e) => {
                        setSelectedjobtit(e);
                        let filterB = [];
                        e.forEach((d) => {
                          filterB.push(d.value);
                        });
                        setSearchDataB(filterB.toString());
                      }}
                    />
                  </div>
                </div>
              </div>
              <div className=" col-md-3 mb-2">
                <div className="form-group row">
                  <label className="col-5" htmlFor="Job Status">
                    Job Status
                  </label>
                  <span className="col-1 p-0">:</span>
                  <div className="col-6">
                    <select
                      id="Job Status"
                      onChange={(e) => {
                        console.log(e.target.value);
                        setStatus(e.target.value);
                      }}
                    >
                      <option value="0,1">{"<<Please Select>>"}</option>
                      <option value="1">Success</option>
                      <option value="0">Failure</option>
                    </select>
                  </div>
                </div>
              </div>{" "}
              <div className="col-md-12 col-sm-12 col-xs-12 btn-container center my-3">
                <button
                  type="submit"
                  className="btn btn-primary"
                  onClick={getData}
                >
                  <FaSearch /> Search{""}
                </button>
              </div>
            </div>
          </CCollapse>
        </div>
      </div>
      {loader ? <Loader /> : ""}
      {/* {refresh ? <Loader /> : ""} */}
      <div>
        <CellRendererPrimeReactDataTable
          data={data}
          dynamicColumns={dynamicColumns}
          headerData={headerData}
          setHeaderData={setHeaderData}
          rows={rows}
        />
      </div>
    </div>
  );
}

export default JobsDailyStatus;
