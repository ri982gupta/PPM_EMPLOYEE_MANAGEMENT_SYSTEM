import React, { useRef, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { ReactSearchAutocomplete } from "react-search-autocomplete";

import { environment } from "../../environments/environment";
import { GoCalendar } from "react-icons/go";
import { useEffect } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { ColumnGroup } from "primereact/columngroup";
import { Row } from "primereact/row";
import axios from "axios";
import Loader from "../Loader/Loader";

import CapacityPlanDataTable from "./CapacityPlanDataTable";
import moment from "moment";
import { BiCheck } from "react-icons/bi";
import { AiFillWarning } from "react-icons/ai";
import ScreenBreadcrumbs from "../Common/ScreenBreadcrumbs";
// import 'primeicons/primeicons.css';
function CapacityPlan(props) {
  const baseUrl = environment.baseUrl;
  const {
    projectId,
    grp2Items,
    urlState,
    btnState,
    setbtnState,
    grp1Items,
    grp3Items,
    grp4Items,
    grp6Items,
    setUrlState,
  } = props;
  const dataObject = grp2Items?.find(
    (item) => item.display_name === "Capacity Plan"
  );
  const abortController = useRef(null);

  const [projectData, setProjectData] = useState([]);
  const [roleCount, setRoleCount] = useState([]);
  const [item, setItem] = useState([]);
  const [resourceCount, setResourceCount] = useState([]);
  const [isActive, setIsActive] = useState("active");
  const [autocompleteData, setAutocompleteData] = useState([]);
  const [resource, setResource] = useState("null");
  const [tableData, setTableData] = useState([]);
  const loggedUserId = localStorage.getItem("resId");
  const [calenderTableData, setCalenderTableData] = useState([]);
  const [dispCalender, setDispCalender] = useState(false);
  const [products, setProducts] = useState([]);
  const [status, setStatus] = useState("");
  const [deleteMessage, setDeleteMessage] = useState(false);
  const [deleteResourceMessage, setDeleteResourceMessage] = useState(false);
  const [searching, setsearching] = useState(false);
  const [errorMsg, setErrorMsg] = useState(false);
  const [addmsg, setAddMessage] = useState(false);
  const [editmsg, setEditMessage] = useState(false);
  const [addResmsg, setAddResMessage] = useState(false);
  const [editResmsg, setEditResMessage] = useState(false);
  const [addErrMsg, setAddErrMsg] = useState(false);
  const [data2, setData2] = useState([]);
  const [errData, setErrData] = useState({
    resName: "",
    roleType: "",
    fromDate: "",
    toDate: "",
  });
  const [displayTable, setDisplayTable] = useState(false);
  const [validateproject, setValidateproject] = useState(false);
  const [dailyhrsRange, setDailyhrsRange] = useState(false);
  const [dupliRole, setDupliRole] = useState(false);
  const [isReloadedTableData, setIsReloadedTableData] = useState(false);
  const [dupRoleName, setDupRoleName] = useState("");
  const [calenderPayload, setCalenderPayload] = useState({
    Src: "prj",
    Typ: "allocations",
    ObjectId: projectId.toString(),
    FromDt: moment(new Date()).format("yyyy-MM-DD"),
    AllocType: "all",
    PrjSource: "-1",
    contTerms: "-1",
    engComps: "-1",
    cslIds: "-1",
    dpIds: "-1",
    avgtextvalue: "",
    userId: loggedUserId.toString(),
  });
  // useEffect(() => {

  // }, [tableData]);

  const [routes, setRoutes] = useState([]);
  let currentScreenName = ["Projects", "Planning", "Capacity Plan"];
  let textContent = "Delivery";
  sessionStorage.setItem(
    "breadCrumbs",
    JSON.stringify({
      routes: routes,
      currentScreenName: currentScreenName,
      textContent: textContent,
    })
  );
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
    //  console.log(sortedSubMenus);
      setData2(sortedSubMenus);

      data.forEach((item) => {
        if (item.display_name === textContent) {
          setRoutes([item]);
          sessionStorage.setItem("displayName", item.display_name);
        }
      });
    });
  };

  useEffect(() => {
    getMenus();
    getUrlPath();
  }, []);
  const getUrlPath = () => {
    axios({
      method: "get",
      url:
        baseUrl +
        `/CommonMS/security/authorize?url=/projectRoleResource/rolesResources/&userId=${loggedUserId}`,
    }).then((res) => {
      console.log(res, "urlResponse");
    });
  };
  useEffect(() => {
    // { dispCalender == true ?
    handleCalenderClick();
    // : " " }
    // getActionTable();
  }, [calenderPayload]);

  useEffect(() => {
    getRolesCount();
    getResourceCount();
    getTableData();
  }, [isActive, resource, isReloadedTableData]);

  const getProjectOverviewData = () => {
    axios({
      method: "get",
      url:
        baseUrl +
        `/ProjectMS/Audit/projectOverviewDetails?projectId=${projectId}`,
    })
      .then(function (response) {
        let resp = response.data;
        // console.log(resp);
        setProjectData(resp);
      })
      .catch(function (response) {
        console.log(response);
      });
  };
  const handleSearch = (value) => {
    // if (value.length >= 3) {
    getProjectResource(value);
    // }
  };

  const getProjectResource = (e) => {
    axios({
      method: "get",
      url:
        baseUrl +
        `/ProjectMS/CapacityPlan/getProjectResource?pid=${projectId}&resource=${e}`,
    }).then(function (response) {
      var res = response.data;
      setAutocompleteData(res);
    });
  };
  useEffect(() => {}, [autocompleteData, item]);

  useEffect(() => {
    getProjectOverviewData();
    // getProjectResource();
  }, []);

  const getRolesCount = () => {
    axios({
      method: "get",
      url:
        baseUrl +
        `/ProjectMS/CapacityPlan/getRolesCount?pid=${projectId}&isActive=${isActive}`,
    })
      .then(function (response) {
        let resp = response.data;
        // console.log(resp);
        setRoleCount(resp);
      })
      .catch(function (response) {
        console.log(response);
      });
  };

  const getResourceCount = () => {
    axios({
      method: "get",
      url:
        baseUrl +
        `/ProjectMS/CapacityPlan/getResourceCount?pid=${projectId}&isActive=${isActive}`,
    })
      .then(function (response) {
        let resp = response.data;
        // console.log(resp);
        setResourceCount(resp);
      })
      .catch(function (response) {
        console.log(response);
      });
  };

  const handleAbort = () => {
    abortController.current && abortController.current.abort();
    setsearching(false);
  };

  const getTableData = () => {
    setDisplayTable(false);
    setsearching(false);

    axios({
      method: "get",
      url:
        baseUrl +
        `/ProjectMS/CapacityPlan/getProjectRoleList?pid=${projectId}&resource=${resource}&isActive=${isActive}`,
    })
      .then(function (response) {
        let resp = response.data;
        const finalRow = {
          id: "",
          roleName: "",
          roleType: "",
          roleTypeId: "",
          effortHours: "",
          plannedStartDt: "",
          plannedEndDt: "",
          country: "",
          countryId: "",
          hourRate: " ",
          hourCost: null,
          allocHrs: null,
          resIcon: "",
          action: " ",
        };
        // resp.length != 0 && resp.push(finalRow);
        // console.log(resp);
        setTableData(resp);
        setProducts(resp);
        setDisplayTable(true);
        setsearching(false);
      })
      .catch(function (response) {
        console.log(response);
      });
  };

  const handleCalenderClick = (e) => {
    setCalenderTableData([]);
    setsearching(false);

    axios({
      method: "post",
      url: baseUrl + `/ProjectMS/CapacityPlan/getCalenders`,
      data: calenderPayload,
    })
      .then(function (response) {
        let resp = response.data;
        // console.log(resp);
        setCalenderTableData(resp);
        // setDispCalender(true)
        setsearching(false);
      })
      .catch(function (response) {
        console.log(response);
      });
  };

  const handleChange = (e) => {
    setIsActive(e.target.value);
  };
  const handleClear = () => {
    setResource("null");
  };
  return (
    <div>
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
            <h2>Capacity Plan</h2>
          </div>
          <div className="childThree"></div>
        </div>

        {addErrMsg && (
          <div className="statusMsg error">
            <BiCheck />
            {`Resource ${errData.resName} is already booked for role ${errData.roleType},for the period ${moment(errData.fromDate).format("DD-MMM-yyyy")} to ${moment(errData.toDate).format("DD-MMM-yyyy")}`}
          </div>
        )}
        {dupliRole && (
          <div className="statusMsg error">
            <AiFillWarning />
            {`Role Name ${dupRoleName} is already exist for the project ${projectData[0]?.projectName}`}
          </div>
        )}

        {dailyhrsRange && (
          <div className="statusMsg error">
            <BiCheck />
            {"Daily Hours Can't be more than 24"}
          </div>
        )}
        {validateproject && (
          <div className="statusMsg error">
            <AiFillWarning />
            {"Please select the valid values for highlighted fields"}
          </div>
        )}
        {deleteMessage && status == true ? (
          <div className="statusMsg success">
            <BiCheck />
            {"Role Deleted Successfully"}
          </div>
        ) : deleteResourceMessage && status == true ? (
          <div className="statusMsg success">
            <BiCheck />
            {"Resource Deleted Successfully"}
          </div>
        ) : deleteMessage && status == false ? (
          <div className="statusMsg error">
            <AiFillWarning />
            {
              "You cannot delete the role as resources are assigned to this role."
            }
          </div>
        ) : deleteResourceMessage && status == false ? (
          <div className="statusMsg error">
            <AiFillWarning />
            {"You cannot delete resource."}
          </div>
        ) : (
          ""
        )}
        {addmsg && (
          <div className="statusMsg success">
            <BiCheck />
            {"Role added Successfully"}
          </div>
        )}
        {editmsg && (
          <div className="statusMsg success">
            <BiCheck />
            {"Role edited Successfully"}
          </div>
        )}
        {addResmsg && (
          <div className="statusMsg success">
            <BiCheck />
            {"Resource added Successfully"}
          </div>
        )}
        {editResmsg && (
          <div className="statusMsg success">
            <BiCheck />
            {"Resource edited Successfully"}
          </div>
        )}
        {errorMsg && (
          <div className="statusMsg error">
            <AiFillWarning />
            {"Select valid resources before searching."}
          </div>
        )}
        <div className="customCard mt-2 mb-0">
          <div className="group container-fluid ">
            <div className="row">
              <div className=" col-md-3 mb-2 px-0">
                <div className="form-group row">
                  <p className="col-12" htmlFor="name-input-inline">
                    Total No. Of Resources : {resourceCount[0]?.resCount}
                  </p>
                </div>
              </div>
              <div className=" col-md-3 mb-2">
                <div className="form-group row">
                  <p className="col-7" htmlFor="name-input-inline">
                    Total No. Of Roles :{" "}
                    {tableData.length == 0 ? 0 : roleCount[0]?.rolesCount}
                  </p>
                </div>
              </div>
              <div className=" col-md-3 mb-2">
                <div className="form-group row">
                  <p className="col-7" htmlFor="name-input-inline"></p>
                  <div className="col-4">
                    <p className=" ellipsis tooltip-ex"></p>
                  </div>
                </div>
              </div>
              <div className="col-md-3 mb-2 px-0">
                <div className="align right">
                  <div className="legendContainer align right ">
                    <div className="legend green">
                      <div className="legendCircle"></div>
                      <div className="legendTxt">ISMS Certified</div>
                    </div>
                    <div className="legend red">
                      <div className="legendCircle"></div>
                      <div className="legendTxt">ISMS Not Certified</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-12">
          <div className="tableHeader">
            <div className="leftSection">
              <h2>Project Role List</h2>
            </div>
            <div className="rightSection">
              <div className="autoComplete-container capacityPlanAc">
                <ReactSearchAutocomplete
                  items={autocompleteData}
                  type="Text"
                  name="resourceId"
                  id="resourceId"
                  className="error AutoComplete"
                  onSelect={(e) => {
                    setResource(e.id);
                  }}
                  onSearch={handleSearch}
                  // onChange={(e) => { getProjectResource(e.target.value) }}
                  showIcon={false}
                  onClear={handleClear}
                  placeholder="Type minimum 3 characters"
                />
                <span> {item.name}</span>
              </div>
              <span className="calender">
                <GoCalendar
                  color="orange"
                  size={"1.3em"}
                  onClick={() => {
                    setDispCalender(true);
                    setCalenderPayload((prev) => ({
                      ...prev,
                      ["Src"]: "prj",
                      ["ObjectId"]: projectId.toString(),
                    }));
                    handleCalenderClick();
                  }}
                />
              </span>
              <select onChange={(e) => handleChange(e)}>
                <option value="active" id="1">
                  Active
                </option>
                <option value="all" id="0">
                  All
                </option>
              </select>
            </div>
          </div>
          {searching ? <Loader handleAbort={handleAbort} /> : ""}

          {displayTable && (
            <CapacityPlanDataTable
              setErrorMsg={setErrorMsg}
              setAddErrMsg={setAddErrMsg}
              addErrMsg={addErrMsg}
              setErrData={setErrData}
              errorMsg={errorMsg}
              validateproject={validateproject}
              setValidateproject={setValidateproject}
              getTableData={getTableData}
              Data={tableData}
              setCalenderPayload={setCalenderPayload}
              calenderPayload={calenderPayload}
              dispCalender={dispCalender}
              calenderTableData={calenderTableData}
              setDispCalender={setDispCalender}
              projectData={projectData}
              setProducts={setProducts}
              products={products}
              setTableData={setTableData}
              projectId={projectId}
              loggedUserId={loggedUserId}
              setStatus={setStatus}
              setAddMessage={setAddMessage}
              setAddResMessage={setAddResMessage}
              setEditResMessage={setEditResMessage}
              setEditMessage={setEditMessage}
              setDeleteMessage={setDeleteMessage}
              setDeleteResourceMessage={setDeleteResourceMessage}
              dailyhrsRange={dailyhrsRange}
              setDailyhrsRange={setDailyhrsRange}
              setDupliRole={setDupliRole}
              setDupRoleName={setDupRoleName}
              grp2Items={grp2Items}
              setIsReloadedTableData = {setIsReloadedTableData}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default CapacityPlan;
