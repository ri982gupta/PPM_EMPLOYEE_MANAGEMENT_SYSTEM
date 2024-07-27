import React, { useEffect, useState } from "react";
import {
  FaChevronCircleDown,
  FaChevronCircleUp,
  FaSearch,
  FaCheck,
  FaEdit,
  FaSave,
} from "react-icons/fa";

import "react-datepicker/dist/react-datepicker.css";
import { CCollapse } from "@coreui/react";
import axios from "axios";
import Loader from "../Loader/Loader";
import { environment } from "../../environments/environment";
import { BiSave } from "react-icons/bi";
import GlobalValidation from "../ValidationComponent/GlobalValidation";
import { AiFillWarning } from "react-icons/ai";
import { useRef } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";

function LockTimesheets() {
  const baseUrl = environment.baseUrl;
  const [visible, setVisible] = useState(false);
  const [cheveronIcon, setCheveronIcon] = useState(FaChevronCircleUp);
  const [tableValue, setTableValue] = useState([]);
  const [searching, setSearching] = useState(false);
  const [loader, setLoader] = useState(false);
  const [year, setYear] = useState([]);
  const [dataId, setDataId] = useState([]);
  const [saveTab, SetSaveTab] = useState([]);
  const [selectedVal, setSelectedVal] = useState([]);
  const getYear = [
    { id: 2017, value: "2017" },
    { id: 2018, value: "2018" },
  ];

  const loggedUserId = localStorage.getItem("resId");

  const [routes, setRoutes] = useState([]);
  let textContent = "Time & Expenses";
  let currentScreenName = ["Lock Timesheet"];
  sessionStorage.setItem(
    "breadCrumbs",
    JSON.stringify({
      routes: routes,
      currentScreenName: currentScreenName,
      textContent: textContent,
    })
  );
  const [validationmessage, setValidationMessage] = useState(false);
  const ref = useRef([]);

  const [successfulmessage, setSuccessfulmessage] = useState(false);

  const [records, setRecords] = useState([]);
  const [dataAccess, setDataAccess] = useState([]);
  console.log(dataAccess);

  const handleFilter = (e) => {
    console.log("***************************", e.target.value);
    const newRecord = records.filter((item) => {
      return item.Month.toLowerCase().includes(e.target.value.toLowerCase());
    });
    setTableValue(newRecord);
  };

  /////////////////////////////////////////////////////////////////////////////
  const getLockSheet = () => {
    let valid = GlobalValidation(ref);

    if (valid) {
      setValidationMessage(true);
      return;
    }
    !valid && setVisible(!visible);
    visible
      ? setCheveronIcon(FaChevronCircleUp)
      : setCheveronIcon(FaChevronCircleDown);

    // setLoader(true)
    axios
      .get(baseUrl + `/timeandexpensesms/getLockTimesheet?yearValue=${year}`)
      .then((res) => {
        setTableValue(res.data);
        console.log(res.data);
        setRecords(res.data);
        // setSelectedVal(()=>{res?.data?.filter(value=>value.Locked === 1).map(value=>value.Month)})
        setSelectedVal(() =>
          res?.data
            ?.filter((value) => value.Locked === 1)
            .map((value) => value.Month)
        );
      });

    setValidationMessage(false);
    setTimeout(() => {}, 3000);
    setSearching(true);
  };

  const getSaveLock = () => {
    axios
      .post(
        baseUrl +
          `/timeandexpensesms/saveLockTimesheets?yearValue=${year}&lockedMonths=${selectedVal}&userId=${loggedUserId}`
      )
      .then((res) => {
        SetSaveTab(res.data);
      });
    setSuccessfulmessage(true);

    setTimeout(() => {
      setSuccessfulmessage(false);
    }, 3000);
  };

  useEffect(() => {
    // getLockSheet();
    // getSaveLock();
  }, []);

  const representMonth = (rowData) => {
    return (
      <React.Fragment>
        <span className="vertical-align-middle ml-2">{rowData.Month}</span>
      </React.Fragment>
    );
  };

  const getMenus = () => {
    // setMenusData

    axios({
      method: "GET",
      url: baseUrl + `/CommonMS/master/getMenus?loggedUserId=${loggedUserId}`,
    }).then((resp) => {
      let data = resp.data;
      const modifiedUrlPath = "/timesheet/lockTimesheet";
      getUrlPath(modifiedUrlPath);
      const updatedMenuData = data.map((category) => ({
        ...category,
        subMenus: category.subMenus.filter(
          (submenu) =>
            submenu.display_name !== "Shift Allownaces" &&
            submenu.display_name !== "Project Timesheet (Deprecated)"
        ),
      }));
      data.forEach((item) => {
        if (item.display_name === textContent) {
          setRoutes([item]);
          sessionStorage.setItem("displayName", item.display_name);
        }
      });
      const TMExpensesSubMenu = data
        .find((item) => item.display_name === "Time & Expenses")
        .subMenus.find((subMenu) => subMenu.display_name === "Lock Timesheets");

      // Extract the access_level value
      const accessLevel = TMExpensesSubMenu
        ? TMExpensesSubMenu.access_level
        : null;
      console.log("Access Level:", accessLevel);

      setDataAccess(accessLevel);
    });
  };
  const getUrlPath = (modifiedUrlPath) => {
    console.log(modifiedUrlPath);
    axios({
      method: "get",
      url:
        baseUrl +
        `/CommonMS/security/authorize?url=${modifiedUrlPath}&userId=${loggedUserId}`,
    })
      .then((res) => {})
      .catch((error) => {});
  };

  useEffect(() => {
    getMenus();
  }, []);

  const representLocked = (rowData) => {
    return (
      <React.Fragment>
        <span className="vertical-align-middle ml-2">
          <input
            type="checkbox"
            id={rowData.Month}
            onChange={(e) => {
              console.log(e);
              console.log("%%%%%%%%%%%%%%", e.target.id === true ? 1 : 0);
              console.log(rowData);
              monthArray(e.target.id);
              setSelectedVal((ps) => {
                return ps.find((value) => value === e.target.id)
                  ? ps.filter((value) => value !== e.target.id)
                  : [...ps, e.target.id];
              });
            }}
            defaultChecked={rowData.Locked ? true : false}
            disabled={dataAccess === 500 || dataAccess === 250}
          ></input>
        </span>
      </React.Fragment>
    );
  };

  const monthArray = (e) => {
    console.log(e);
    const arr = [e];
    console.log(arr);
    let dt = dataId;

    arr.map((node) => {
      console.log(node);
      dt.push(node);
    });
    setDataId(dt);
  };

  useEffect(() => {
    console.log(selectedVal);
  }, [selectedVal]);
  return (
    <div>
      {validationmessage ? (
        <div className="statusMsg error">
          {" "}
          &nbsp;
          <span className="error-block">
            <AiFillWarning /> &nbsp; Please Select the valid values for
            highlighted fields
          </span>
        </div>
      ) : (
        ""
      )}
      <>
        {successfulmessage ? (
          <div className="statusMsg success">Data Saved Succesfully!!</div>
        ) : (
          ""
        )}
      </>

      <div className="col-md-12">
        <div className="pageTitle">
          <div className="childOne"></div>
          <div className="childTwo">
            <h2>Lock Timesheet</h2>
          </div>
          <div className="childThree toggleBtns">
            <button
              className="searchFilterButton btn btn-primary"
              onClick={() => {
                setVisible(!visible);

                visible
                  ? setCheveronIcon(FaChevronCircleUp)
                  : setCheveronIcon(FaChevronCircleDown);
              }}
            >
              Search Filters
              <span className="serchFilterText">{cheveronIcon}</span>
            </button>
          </div>
        </div>
      </div>

      <div className="group mb-3 customCard">
        <div className="col-md-12 collapseHeader"></div>
        <CCollapse visible={!visible}>
          <div className="group-content row ">
            <div className="col-md-4 mb-2">
              <div className="form-group row">
                <label className="col-5" htmlFor="email-input">
                  Year<span style={{ color: "red" }}>*</span>
                </label>
                <span className="col-1 p-0">:</span>
                <div className="col-6">
                  <select
                    ref={(ele) => {
                      ref.current[0] = ele;
                    }}
                    className="error enteredDetails cancel text"
                    id="year-select"
                    name="year"
                    onChange={(e) => {
                      setYear(e.target.value);
                      setTableValue(null);
                    }}
                  >
                    <option value="">&lt;&lt;Please Select&gt;&gt;</option>
                    {getYear.map((e) => {
                      return <option value={e.id}>{e.value}</option>;
                    })}
                  </select>
                </div>
              </div>
            </div>

            <div className="align center mt-3">
              <button
                type="button"
                className="btn btn-primary"
                title="Search"
                onClick={getLockSheet}
              >
                <FaSearch /> Search{" "}
              </button>
            </div>
          </div>
        </CCollapse>
        {loader ? <Loader /> : ""}
      </div>
      {/* <div className="col-md-12"> */}
      {tableValue?.length > 0 ? (
        <>
          <div
            id="myDatatable_filter"
            class="dataTables_filter"
            style={{ height: "25px", width: "165px", float: "right" }}
          >
            <label>
              Search:&nbsp;
              <input
                type="search"
                className="col-7"
                placeholder
                aria-controls="myDatatable"
                onChange={(e) => handleFilter(e)}
              />
            </label>
          </div>
          <div className="darkHeader">
            <div className="col-md-12 mt-4">
              <DataTable
                className="lockDataTable "
                value={tableValue}
                showGridlines
                highlightOnHover
              >
                <Column
                  field="Month"
                  header="Month"
                  body={representMonth}
                ></Column>

                <Column
                  field="Locked"
                  header="Locked"
                  body={representLocked}
                ></Column>
              </DataTable>
            </div>
          </div>
          <div className="align center mt-3">
            {dataAccess === 1000 && (
              <button
                className="btn btn-primary"
                type="submit"
                onClick={getSaveLock}
              >
                <FaSave /> Save
              </button>
            )}
          </div>
        </>
      ) : (
        ""
      )}
    </div>
    // </div>
  );
}

export default LockTimesheets;
