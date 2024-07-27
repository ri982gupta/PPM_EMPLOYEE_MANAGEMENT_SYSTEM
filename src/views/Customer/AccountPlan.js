import React, { useEffect, useState, useRef } from "react";
import DatePicker from "react-datepicker";
import {
  FaChevronCircleDown,
  FaChevronCircleUp,
  FaSearch,
} from "react-icons/fa";
import {
  CCollapse,
  CModal,
  CModalBody,
  CModalHeader,
  CModalTitle,
} from "@coreui/react";
import ReactQuill from "react-quill";
import axios from "axios";
import moment from "moment";
import { environment } from "../../environments/environment";
import Accountplantable from "./Accountplantable";
import Loader from "../Loader/Loader";
import "react-datepicker/dist/react-datepicker.css";
import ScreenBreadcrumbs from "../Common/ScreenBreadcrumbs";

function AccountPlan(props) {
  const {
    customerId,
    urlState,
    setUrlState,
    setButtonState,
    buttonState,
    grp1Items,
    grp2Items,
    grp3Items,
    grp4Items,
  } = props;
  const [custData, setcustData] = useState([]);
  const loggedUserId = localStorage.getItem("resId");

  const [loader, setLoader] = useState(false);
  const abortController = useRef(null);
  const [startDate, setStartDate] = useState(() => {
    const selectedDate = new Date();
    const nextYear = new Date(selectedDate.getFullYear(), 3, 1); // Set the nextYear to start from the 4th month
    nextYear.setFullYear(selectedDate.getFullYear() + 1);

    return nextYear;
  });
  const [defaultD, setdefaultD] = useState(() => {
    const selectedDate = new Date();
    const nextYear = new Date(selectedDate.getFullYear(), 2, 0); // Set the nextYear to start from the 4th month
    nextYear.setFullYear(selectedDate.getFullYear() + 1);

    return nextYear;
  });

  const [formDate, setFormDate] = useState();
  let prescription = {
    prescriptionDate: new Date(), // Today
    prescriptionExpirationDate: -120, // Days to add
  };

  const getcustData = () => {
    axios
      .get(
        baseUrl +
          `/customersms/Customers/getCustomersdashboard?cid=${customerId}`
      )
      .then((resp) => {
        const data = resp.data;
        setcustData(data);
      })
      .catch((resp) => {});
  };

  useEffect(() => {
    getcustData();
  }, []);

  const [value, onChange] = useState(new Date());
  const defaultDate = () => {
    const now = new Date();
    const quarter = Math.floor(now.getMonth() / 3);
    const firstDate = new Date(now.getFullYear(), quarter * 3, 1);
    return firstDate.toLocaleDateString("en-CA");
  };
  const [visible, setVisible] = useState(false);
  const [cheveronIcon, setCheveronIcon] = useState(FaChevronCircleUp);
  const [selectType, setSelectType] = useState("plan");
  const [buttonPopup, setButtonPopup] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [actual, setActual] = useState([]);
  const [compare, setcompare] = useState([]);
  const [tableState, setTableState] = useState(false);
  const [showTable, setshowTable] = useState(true);
  useEffect(() => {
    handleSearch();
    setshowTable(true);
  }, []);
  const [header, setHeader] = useState();
  const [header1, setHeader1] = useState();
  const [header2, setHeader2] = useState();
  const baseUrl = environment.baseUrl;
  let a = "";
  useEffect(() => {}, []);
  useEffect(() => {}, []);

  const handleChange = (e) => {
    setshowTable(true);
    const { value } = e.target;

    setSelectType(value);
    setStartDate(() => {
      const selectedDate = new Date();
      const nextYear = new Date(selectedDate.getFullYear(), 3, 1); // Set the nextYear to start from the 4th month
      nextYear.setFullYear(selectedDate.getFullYear() + 1);

      return nextYear;
    });
  };

  // useEffect(() => {
  // }, [selectType])
  const [displayData, setDisplayData] = useState(null);
  const [displayData1, setDisplayData1] = useState(null);

  useEffect(() => {
    displayDataFnc();
  }, []);

  useEffect(() => {
    displayDataFnc1();
  }, [actual]);
  const displayDataFnc = () => {
    setDisplayData(() => {
      return tableData.data?.map((element, index) => {
        let tabData = [];
        column.forEach((inEle, inInd) => {
          tabData.push(<td align="right">{element[inEle]}</td>);
        });
        return <tr key={index}>{tabData}</tr>;
      });
    });
  };

  const displayDataFnc1 = () => {
    setDisplayData1(() => {
      return actual.data?.map((element, index) => {
        let tabData = [];
        column.forEach((inEle, inInd) => {
          tabData.push(<td align="right">{element[inEle]}</td>);
        });
        return <tr key={index}>{tabData}</tr>;
      });
    });
  };
  const [column, setColumn] = useState([]);
  const handleSearch = () => {
    setshowTable(true);
    setLoader(false);

    abortController.current = new AbortController();
    if (selectType == "plan") {
      const adjustedStartDate = moment(startDate)
        .subtract(1, "year")
        .add(0, "days")
        .format("YYYY-MM-DD");
      axios({
        method: "post",
        url:
          baseUrl +
          `/customersms/Accountplan/getaccountplanGoals?SrcType=plan&CustomerId=${customerId}&CountryId=1&FromDate=${adjustedStartDate}&Duration=4&reqPage=customer&isProspect=1&UserId=${loggedUserId}`,
        // `http://localhost:8095/customersms/Accountplan/getaccountplanGoals?SrcType=${selectType}&CustomerId=${customerId}&CountryId=1&FromDate=2023-04-01&Duration=4&reqPage=customer&isProspect=4&UserId=${loggedUserId}`,
      }).then(function (response) {
        let resp = response.data;
        let a = resp.columns;
        let columnArray = a.split(",");
        let colArr = columnArray.map((d) => d.replaceAll("'", ""));
        let b = resp.tableData;
        setHeader(colArr);
        setTableData(resp);
        setTableState(true);
        setLoader(false);
        setVisible(!visible);
        visible
          ? setCheveronIcon(FaChevronCircleUp)
          : setCheveronIcon(FaChevronCircleDown);
      });
    } else if (selectType == "actual") {
      setLoader(false);
      const newStartDate = moment(startDate)
        .subtract(1, "year")
        .add(3, "month")
        .format("YYYY-MM-DD");
      axios({
        method: "post",
        url:
          baseUrl +
          `/customersms/Accountplan/getaccountplanning?CustomerId=${customerId}&FromDate=${moment(
            newStartDate
          ).format("yyyy-MM-DD")}&UserId=${loggedUserId}`,
      }).then(function (response) {
        var response = response.data;

        let a = response.columns;
        let columnArray = a.split(",");
        let colArr1 = columnArray.map((d) => d.replaceAll("'", ""));
        setHeader1(colArr1);
        setActual(response);
        setLoader(false);
        setVisible(!visible);
        visible
          ? setCheveronIcon(FaChevronCircleUp)
          : setCheveronIcon(FaChevronCircleDown);
      });
    }
    if (selectType == "compare") {
      const newStartDate = moment(startDate)
        .subtract(1, "year")
        .add(3, "month")
        .format("YYYY-MM-DD");
      setLoader(false);
      axios({
        method: "post",
        url:
          baseUrl +
          `/customersms/Accountplan/getaccountplanCompare?CustomerId=${customerId}&FromDate=${moment(
            newStartDate
          ).format("yyyy-MM-DD")}&Duration=4&UserId=${loggedUserId}`,
      }).then(function (response) {
        var response = response.data;
        let a = response.columns;
        let columnArray = a.split(",");
        let colArr2 = columnArray.map((d) => d.replaceAll("'", ""));
        setLoader(false);
        setHeader2(colArr2);
        setcompare(response);
      });
    }
  };
  const handleAbort = () => {
    abortController.current && abortController.current.abort();
    setLoader(false);
  };
  function NotesPopup(props) {
    const { buttonPopup, setButtonPopup } = props;
    const editorToolBar = {
      toolbar: [
        [
          { header: [false, 1, 2, 3, 4, 5, 6] },
          // { size: []},
          { color: [] },
          "bold",
          "italic",
          "underline",
          { list: "ordered" },
          { list: "bullet" },
          { script: "sub" },
          { script: "super" },
          { indent: "-1" },
          { indent: "+1" },
          { align: null },
          { align: "center" },
          { align: "right" },
          "strike",
          "link",
          "image",
          "code-block",
          "clean",
        ],
      ],
    };

    return (
      <div className="col-md-12 mb-2 ">
        <CModal
          size="lg"
          visible={buttonPopup}
          className=" u"
          onClose={() => setButtonPopup(false)}
        >
          <CModalHeader className="hgt22" style={{ cursor: "all-scroll" }}>
            <CModalTitle>
              <span className="ft16">
                Notes of{" "}
                <span>
                  {" "}
                  {custData.map((item) => (
                    <span>{item.customerName}</span>
                  ))}
                </span>
              </span>
            </CModalTitle>
          </CModalHeader>
          <CModalBody>
            <div className="col-md-12">
              <ReactQuill
                className="err"
                theme="snow"
                name="description"
                id="description"
                modules={editorToolBar}
                readOnly
              />
            </div>
          </CModalBody>
        </CModal>
      </div>
    );
  }

  const [routes, setRoutes] = useState([]);
  let textContent = "Customers";
  let currentScreenName = ["Financials", "Account Plan"];
  sessionStorage.setItem(
    "breadCrumbs",
    JSON.stringify({
      routes: routes,
      currentScreenName: currentScreenName,
      textContent: textContent,
    })
  );

  useEffect(() => {
    getMenus();
    getUrlPath();
  }, []);

  const getMenus = () => {
    // setMenusData

    axios({
      method: "GET",
      url: baseUrl + `/CommonMS/master/getMenus?loggedUserId=${loggedUserId}`,
    }).then((resp) => {
      let data = resp.data;
      const updatedMenuData = data.map((category) => ({
        ...category,
        subMenus: category.subMenus.filter(
          (submenu) => submenu.display_name !== "Financial Plan & Review"
        ),
      }));
      updatedMenuData.forEach((item) => {
        if (item.display_name === textContent) {
          setRoutes([item]);
          sessionStorage.setItem("displayName", item.display_name);
        }
      });
    });
  };
  const getUrlPath = () => {
    axios({
      method: "get",
      url:
        baseUrl +
        `/CommonMS/security/authorize?url=/customer/accountplan/&userId=${loggedUserId}`,
    }).then((res) => {
      console.log(res, "urlResponse");
    });
  };
  return (
    <div>
      <div className="col-md-12">
        <div className="pageTitle">
          <div className="childOne">
            {" "}
            {/* <h2>
              {custData.map((item) => (
                <span>{item.customerName}</span>
              ))}
            </h2> */}
            <ul className="tabsContainer">
              <li>
                {/* {grp1Items[0]?.display_name != undefined ? (
                  <span>{grp1Items[0]?.display_name}</span>
                ) : (
                  ""
                )} */}
                {grp1Items[0]?.display_name != undefined ? (
                  <span>{grp1Items[0]?.display_name}</span>
                ) : (
                  ""
                )}
                <ul>
                  {grp1Items.slice(1).map((button) => (
                    <li
                      className={
                        buttonState === button.display_name
                          ? "buttonDisplayClick"
                          : "buttonDisplay"
                      }
                      onClick={() => {
                        setButtonState(button.display_name);
                        setUrlState(
                          button.url_path.toString().replace(/::/g, "/")
                        );
                      }}
                    >
                      {button.display_name}
                    </li>
                  ))}
                </ul>
              </li>{" "}
              <li>
                {grp2Items[0]?.display_name != undefined ? (
                  <span>{grp2Items[0]?.display_name}</span>
                ) : (
                  ""
                )}
                {/* <span>Planning</span> */}
                <ul>
                  {grp2Items.slice(1).map((button) => (
                    <li
                      className={
                        buttonState === button.display_name
                          ? "buttonDisplayClick"
                          : "buttonDisplay"
                      }
                      onClick={() => {
                        setButtonState(button.display_name);
                        setUrlState(
                          button.url_path.toString().replace(/::/g, "/")
                        );
                      }}
                    >
                      {button.display_name}
                    </li>
                  ))}
                </ul>
              </li>{" "}
              <li>
                {grp3Items[0]?.display_name != undefined ? (
                  <span>{grp3Items[0]?.display_name}</span>
                ) : (
                  ""
                )}
                {/* <span>Monitoring</span> */}
                <ul>
                  {grp3Items.slice(1).map((button) => (
                    <li
                      className={
                        buttonState === button.display_name
                          ? "buttonDisplayClick"
                          : "buttonDisplay"
                      }
                      onClick={() => {
                        setButtonState(button.display_name);
                        setUrlState(
                          button.url_path.toString().replace(/::/g, "/")
                        );
                      }}
                    >
                      {button.display_name}
                    </li>
                  ))}
                </ul>
              </li>{" "}
              <li>
                {grp4Items[0]?.display_name != undefined ? (
                  <span>{grp4Items[0]?.display_name}</span>
                ) : (
                  ""
                )}
                {/* <span>Financials</span> */}
                <ul>
                  {grp4Items.slice(1).map((button) => (
                    <li
                      className={
                        buttonState === button.display_name
                          ? "buttonDisplayClick"
                          : "buttonDisplay"
                      }
                      onClick={() => {
                        setButtonState(button.display_name);
                        setUrlState(
                          button.url_path.toString().replace(/::/g, "/")
                        );
                      }}
                    >
                      {button.display_name}
                    </li>
                  ))}
                </ul>
              </li>
            </ul>
          </div>
          <div className="childTwo">
            <h2>Account Plan</h2>
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
          <div className="group-content row">
            <div className=" col-md-3 mb-2">
              <div className="form-group row">
                <label className="col-5" htmlFor="viewtype">
                  View Type
                </label>
                <span className="col-1 p-0">:</span>
                <div className="col-6">
                  <select
                    id="select"
                    defaultValue={"plan"}
                    name="SelectType"
                    onChange={handleChange}
                  >
                    <option value="plan">Planning</option>
                    <option value="actual">Actuals</option>
                    <option value="compare">Compare</option>
                  </select>
                </div>
              </div>
            </div>
            {selectType == "plan" ? (
              <>
                <div className=" col-md-3 mb-2">
                  <div className="form-group row">
                    <label className="col-5" htmlFor="fy">
                      Quarter
                    </label>
                    <span className="col-1 p-0">:</span>
                    <div className="col-6">
                      <DatePicker
                        id="FY"
                        selected={startDate}
                        placeholderText="Please select a date"
                        onChange={(date) => {
                          const selectedDate = new Date(date);
                          const nextYear = new Date(
                            selectedDate.getFullYear(),
                            3,
                            1
                          ); // Set the nextYear to start from the 4th month
                          nextYear.setFullYear(selectedDate.getFullYear() + 1);
                          setStartDate(nextYear);
                        }}
                        showYearPicker
                        dateFormat="'FY' yyyy"
                      />
                    </div>
                  </div>
                </div>
              </>
            ) : selectType == "actual" ? (
              <>
                <div className=" col-md-3 mb-2">
                  <div className="form-group row">
                    <label className="col-5" htmlFor="fy">
                      Quarter
                    </label>
                    <span className="col-1 p-0">:</span>
                    <div className="col-6">
                      <DatePicker
                        id="FY"
                        selected={startDate}
                        onChange={(e) => {
                          setStartDate(e);
                          const quarterStartMonth = 3;
                          const quarterStartDate = new Date(
                            e.getFullYear(),
                            quarterStartMonth,
                            1
                          );
                          quarterStartDate.setFullYear(
                            quarterStartDate.getFullYear() - 1
                          );
                          // handleChange;
                        }}
                        dateFormat=" 'FY' yyyy-QQQ"
                        showQuarterYearPicker
                      />
                    </div>
                  </div>
                </div>
              </>
            ) : selectType == "compare" ? (
              <>
                <div className=" col-md-3 mb-2">
                  <div className="form-group row">
                    <label className="col-5" htmlFor="fy">
                      Quarter
                    </label>
                    <span className="col-1 p-0">:</span>
                    <div className="col-6">
                      <DatePicker
                        id="FY"
                        selected={startDate}
                        onChange={(e) => {
                          setStartDate(e);
                          const date = new Date(e.getTime());
                          date.setFullYear(date.getFullYear() - 1);
                          date.setMonth(date.getMonth() + 3);
                          // handleChange
                        }}
                        showQuarterYearPicker
                        dateFormat="'FY' yyyy-QQQ"
                      />
                    </div>
                  </div>
                </div>
              </>
            ) : (
              ""
            )}
            <div className="col-md-12 col-sm-12 col-xs-12 btn-container center my-2">
              <button
                type="submit"
                className="btn btn-primary"
                onClick={handleSearch}
              >
                <FaSearch /> Search{" "}
              </button>
            </div>
            {loader ? <Loader handleAbort={handleAbort} /> : ""}
          </div>
        </CCollapse>
      </div>
      <button
        className="btn btn-primary"
        onClick={() => {
          setButtonPopup(true);
        }}
      >
        Notes
      </button>
      {buttonPopup ? (
        <NotesPopup
          buttonPopup={buttonPopup}
          setButtonPopup={setButtonPopup}
          custData={custData}
        />
      ) : (
        " "
      )}
      <br />
      {showTable && (
        <div>
          <Accountplantable
            tableData={tableData}
            column={header}
            column1={header1}
            actual={actual}
            compare={compare}
            column2={header2}
            selectType={selectType}
          />
        </div>
      )}
    </div>
  );
}

export default AccountPlan;
