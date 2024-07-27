import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import moment from "moment";
import { MdOutlineSettingsSuggest } from "react-icons/md";
import { AiOutlineAppstoreAdd } from "react-icons/ai";
import { MdOutlineCompare } from "react-icons/md";
import { environment } from "../../environments/environment";
import FlatPrimeReactTable from "../PrimeReactTableComponent/FlatPrimeReactTable";
import CheckFlatPrimeReactTable from "../PrimeReactTableComponent/CheckFlatPrimeReactTable";
import ProjectCompareBaseline from "./ProjectCompareBaseline";
import { Link, Route, Router, useNavigate } from "react-router-dom";
import { BiCheck } from "react-icons/bi";
import Loader from "../Loader/Loader";
import ProjectCompareBaselineTable from "./ProjectCompareBaselineTable";
import BaselineCheckBoxtable from "./BaselineCheckboxtable";
import { Column } from "ag-grid-community";
import useDynamicMaxHeight from "../PrimeReactTableComponent/useDynamicMaxHeight";

function ProjectBaselines(props) {
  const {
    projectId,
    grp4Items,
    urlState,
    setUrlState,
    setbtnState,
    btnState,
    grp1Items,
    grp2Items,
    grp3Items,
    grp6Items,
  } = props;
  console.log(grp4Items[7].is_write);
  const [data, setData] = useState([]);
  const baseUrl = environment.baseUrl;
  const [checkedData, setCheckedData] = useState([]);
  const loggedUserId = localStorage.getItem("resId");
  const loggedUserName = localStorage.getItem("resName");
  console.log(loggedUserName);
  console.log(loggedUserId);
  const [tabledata, setTableData] = useState([]);
  const [checkedData1, setCheckedData1] = useState([]);
  console.log(checkedData1);
  const [addmsg, setAddmsg] = useState(false);
  const [projectData, setProjectData] = useState([]);
  const [loader, setLoader] = useState(false);
  const [baselineVersion, setBaselineVersion] = useState([]);
  const [baselineheader, setBaselineHeader] = useState([]);
  const [baselineheader1, setBaselineHeader1] = useState([]);
  const [displayTable, setDisplayTable] = useState(null);
  const [tabHeaders, setTabHeaders] = useState([]);
  const [headerData, setHeaderData] = useState([]);
  const ref = useRef([]);
  const abortController = useRef(null);
  console.log(baselineVersion[0]);
  const rows = 25;
  const [excludedCols, setExcludedCols] = useState(["col"]);
  const [displayColumns, setDisplayColums] = useState([""]);
  const [columns, setColumns] = useState([]);
  const [iconState, setIconState] = useState([]);
  const [details, setDetails] = useState([]);

  // breadcrumbs --

  const [routes, setRoutes] = useState([]);
  let textContent = "Delivery";
  let currentScreenName = ["Projects", "Monitoring", "Baselines"];
  sessionStorage.setItem(
    "breadCrumbs",
    JSON.stringify({
      routes: routes,
      currentScreenName: currentScreenName,
      textContent: textContent,
    })
  );
  const materialTableElement = document.getElementsByClassName(
    "childOne"
  );

  const maxHeight1 = useDynamicMaxHeight(materialTableElement, "fixedcreate") ;
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
      const getData1 = resp.data;
      const deliveryItem = getData1[7]; // Assuming "Delivery" item is at index 7

      const desiredOrder = [
        "Engagements",
        "Projects",
        "Engagement Allocations",
        "Project Health",
        "Project Status Report",
      ];

      const sortedSubMenus = deliveryItem.subMenus.sort((a, b) => {
        const indexA = desiredOrder.indexOf(a.display_name);
        const indexB = desiredOrder.indexOf(b.display_name);
        return indexA - indexB;
      });
      deliveryItem.subMenus = sortedSubMenus;
      console.log(sortedSubMenus);
   //   setData2(sortedSubMenus);
      data.forEach((item) => {
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
        `/CommonMS/security/authorize?url=/project/projectCompareBaseline/&userId=${loggedUserId}`,
    }).then((res) => {
      console.log(res, "urlResponse");
    });
  };

  const dataObject = grp4Items.find(
    (item) => item.display_name === "Baselines"
  );
  console.log(dataObject.is_write, "****");

  const navigate = useNavigate();
  const getData = () => {
    axios
      .get(
        baseUrl +
          `/ProjectMS/Baselines/getBaselinesDetails?object_id=${projectId}`
      )
      .then((res) => {
        const GetData = res.data;
        for (let i = 0; i < GetData.length; i++) {
          GetData[i]["date_created"] =
            GetData[i]["date_created"] == null
              ? ""
              : moment(GetData[i]["date_created"]).format("DD-MMM-YYYY");
        }
        const Headerdata = [
          {
            // Select: " Select",
            version_number: "Version No.",
            version_name: "Version Name",
            date_created: "Created Date",
            created_by: "Created By",
          },
        ];
        setData(Headerdata.concat(GetData));
        setData(Headerdata.concat(res.data));

        setTimeout(() => {
          setLoader(false);
        }, 100);
      });
  };
  useEffect(() => {
    getData();
    getProjectOverviewData();
  }, []);

  const versionnumber = (data) => {
    return (
      <div
        className="ellipsis"
        data-toggle="tooltip"
        style={{ width: "108px" }}
        title={data.version_number}
      >
        {data.version_number}
      </div>
    );
  };
  const versionname = (data) => {
    return (
      <div className="ellipsis" data-toggle="tooltip" title={data.version_name}>
        {data.version_name}
      </div>
    );
  };
  const datecreated = (data) => {
    return (
      <div className="ellipsis" data-toggle="tooltip" title={data.date_created}>
        {data.date_created}
      </div>
    );
  };
  const createdby = (data) => {
    return (
      <div className="ellipsis" data-toggle="tooltip" title={data.created_by}>
        {data.created_by}
      </div>
    );
  };

  const dynamicColumns = Object.keys(headerData)?.map((col, i) => {
    return (
      <Column
        sortable
        key={col}
        body={
          // col == "SNo" ? SnoAlign :
          (col == "version_number" && versionnumber) ||
          (col == "version_name" && versionname) ||
          (col == "date_created" && datecreated) ||
          (col == "created_by" && createdby)
        }
        field={col}
        header={headerData[col]}
      />
    );
  });
  useEffect(() => {
    data[0] && setHeaderData(JSON.parse(JSON.stringify(data[0])));
  }, [data]);
  ///-------------------------to post---------------
  const handleAddClick = () => {
    const loaderTime = setTimeout(() => {
      setLoader(true);
    }, 2000);

    axios({
      method: "post",
      url: baseUrl + `/ProjectMS/Baselines/CreateBaseline`,
      data: {
        ObjectId: projectId,
        CreatedById: loggedUserId,
      },
    }).then((response) => {
      console.log(response.data);
      setBaselineVersion(response.data);
      clearTimeout(loaderTime);
      setLoader(false);
      getData();
      setAddmsg(true);
      setTimeout(() => {
        setAddmsg(false);
      }, 3000);
    });
  };

  //-------------------
  const handleCompareClick = () => {
    const loaderTime = setTimeout(() => {
      setLoader(true);
    }, 2000);

    axios({
      method: "post",
      url:
        baseUrl +
        `/ProjectMS/Baselines/CompareBaseline?objectId=${projectId}&versionIds=${checkedData1}&UserId=${loggedUserId}&isUnVerSel=0`,
    }).then((res) => {
      let resp = res.data;
      console.log(res.data);
      const GetData = res.data;
      //             let Headerdata = [{
      console.log(resp.tableData[0].level);

      let detail = res.data.tableData;
      console.log(detail[0].level);
      for (let i = 0; i < detail.length; i++) {
        console.log(detail[i]);
        //  detail[i]["name"] = detail[i]["col"];
        detail[i]["lvl"] = detail[i]["level"];
        detail[i]["id"] = detail[i]["id"] - 2;

        Object.keys(detail[i]).forEach((d) => {
          if (
            d.includes("baseline") &&
            ["", null].includes(detail[i][d]) == false &&
            detail[i]["type"] == "string"
          ) {
            console.log(detail[i][d]);
            if (moment(detail[i][d]).isValid()) {
              detail[i][d] = moment(detail[i][d]).format("DD-MMM-yyyy");
              console.log(detail[i][d]);
            } else {
              detail[i][d] = "0.00";
            }
          }
        });
        console.log(detail[i]);
      }
      let cols = res.data.columns.replaceAll("'", "").split(",");

      setDetails(detail);

      {
        detail[0]["col"] = "Baseline Data";
      }
      setTableData(detail);
      setColumns(cols);
      navigate("/project/compareBaseline", {
        state: {
          // "checkedData": checkedData,
          tabledata: detail,
          projectData: projectData,
          excludedCols: excludedCols,
          displayColumns: displayColumns,
          columns: cols,
          iconState: iconState,
          projectId: projectId,
        },
      });

      clearTimeout(loaderTime);
      setLoader(false);
    });
  };
  //0------------------------ Project Headline data------------------------
  const getProjectOverviewData = () => {
    axios({
      method: "get",
      url:
        baseUrl +
        `/ProjectMS/Audit/projectOverviewDetails?projectId=${projectId}`,
    })
      .then(function (response) {
        let resp = response.data;
        console.log(resp);
        setProjectData(resp);
        //    setPrjName(resp)
      })
      .catch(function (response) {
        console.log(response);
      });
  };

  const handleAbort = () => {
    abortController.current && abortController.current.abort();
    setLoader(false);
  };
  return (
    <div>
      {addmsg ? (
        <div className="statusMsg success">
          {" "}
          {projectData.map((list) => (
            <span className="">
              <BiCheck size="1.4em" />
              {list.projectName} is baselined successfully with Version:
              {baselineVersion.map((list) => (
                <> {list.baselineVer}</>
              ))}{" "}
            </span>
          ))}
        </div>
      ) : (
        ""
      )}
      {/* {loader ? <Loader /> : ""} */}
      <div className="col-md-12">
        <div className="pageTitle">
          <div className="childOne">
            <ul className="tabsContainer">
              <li>
                {grp1Items[0]?.display_name != undefined ? (
                  <span>{grp1Items[0]?.display_name}</span>
                ) : (
                  ""
                )}
                <ul>
                  {grp1Items.slice(1).map((button) => (
                    <li
                      className={
                        btnState === button.display_name
                          ? "buttonDisplayClick"
                          : "buttonDisplay"
                      }
                      onClick={() => {
                        setbtnState(button.display_name);
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
                <ul>
                  {grp2Items.slice(1).map((button) => (
                    <li
                      className={
                        btnState === button.display_name
                          ? "buttonDisplayClick"
                          : "buttonDisplay"
                      }
                      onClick={() => {
                        setbtnState(button.display_name);
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
                <ul>
                  {grp3Items.slice(1).map((button) => (
                    <li
                      className={
                        btnState === button.display_name
                          ? "buttonDisplayClick"
                          : "buttonDisplay"
                      }
                      onClick={() => {
                        setbtnState(button.display_name);
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
                <ul>
                  {grp4Items.slice(1).map((button) => (
                    <li
                      className={
                        btnState === button.display_name
                          ? "buttonDisplayClick"
                          : "buttonDisplay"
                      }
                      onClick={() => {
                        setbtnState(button.display_name);
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
                {grp6Items[0]?.display_name != undefined ? (
                  <span>{grp6Items[0]?.display_name}</span>
                ) : (
                  ""
                )}
                <ul>
                  {grp6Items.slice(1).map((button) => (
                    <li
                      className={
                        btnState === button.display_name
                          ? "buttonDisplayClick"
                          : "buttonDisplay"
                      }
                      onClick={() => {
                        setbtnState(button.display_name);
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
            <h2>Baselines</h2>
          </div>
          <div className="childThree"></div>
        </div>
      </div>

      
      <div>
        <div className="form-group mt-2">
          <div
            className="col-md-12 no-padding baselINEtABLE primeReactDataTable"
            style={{ paddingLeft: "100px", paddingRight: "100px" }}
          >
            <BaselineCheckBoxtable
              maxHeight1 = {maxHeight1}
              grp4Items={grp4Items}
              data={data}
              rows={rows}
              setCheckedData={setCheckedData}
              setCheckedData1={setCheckedData1}
              dynamicColumns={dynamicColumns}
              headerData={headerData}
              setHeaderData={setHeaderData}
            />
          </div>
        </div>
      </div>
      
      {console.log(checkedData1.length)}
      {grp4Items[7].is_write == true ? (
        <div class=" btn-container center mt-3 mb-3">
          {dataObject.is_write === true ? (
            checkedData1.length > 0 ? (
              <button
                type="submit"
                style={{ cursor: "no-drop" }}
                onKeyDown={(e) => {
                  e.preventDefault;
                }}
                className="btn btn-primary"
              >
                {" "}
                <AiOutlineAppstoreAdd />
                Create Baseline
              </button>
            ) : (
              <button
                type="submit"
                className="btn btn-primary"
                onClick={handleAddClick}
              >
                {" "}
                <AiOutlineAppstoreAdd />
                Create Baseline
              </button>
            )
          ) : checkedData1.length > 0 ? (
            <button
              type="submit"
              style={{ cursor: "not-allowed" }}
              className="btn btn-primary"
            >
              {" "}
              <AiOutlineAppstoreAdd />
              Create Baseline
            </button>
          ) : (
            <button
              type="submit"
              className="btn btn-primary"
              style={{ cursor: "not-allowed" }}
            >
              {" "}
              <AiOutlineAppstoreAdd />
              Create Baseline
            </button>
          )}
          {dataObject.is_write === true ? (
            checkedData1.length == 9 ||
            checkedData1.length == 8 ||
            checkedData1.length == 0 ? (
              <button
                type="submit"
                style={{ cursor: "no-drop" }}
                onKeyDown={(e) => {
                  e.preventDefault;
                }}
                className="btn btn-primary"
              >
                {" "}
                <MdOutlineCompare />
                Compare Baseline
              </button>
            ) : (
              <button
                type="submit"
                className="btn btn-primary"
                onClick={handleCompareClick}
              >
                {" "}
                <MdOutlineCompare />
                Compare Baseline
              </button>
            )
          ) : checkedData1.length == 9 ||
            checkedData1.length == 8 ||
            checkedData1.length == 0 ? (
            <button
              type="submit"
              style={{ cursor: "not-allowed" }}
              className="btn btn-primary"
            >
              {" "}
              <MdOutlineCompare />
              Compare Baseline
            </button>
          ) : (
            <button
              type="submit"
              className="btn btn-primary"
              style={{ cursor: "not-allowed" }}
            >
              {" "}
              <MdOutlineCompare />
              Compare Baseline
            </button>
          )}
        </div>
      ) : (
        ""
      )}
      

      {loader ? <Loader handleAbort={handleAbort} /> : ""}
    </div>
  );
}
export default ProjectBaselines;
