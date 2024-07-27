import React, { useState, useEffect, Ref, useRef } from "react";
import RiskAutoComplete from "../ProjectComponent/RiskAutocomplete";
import axios from "axios";
import { environment } from "../../environments/environment";
import FlatPrimeReactTable from "../PrimeReactTableComponent/FlatPrimeReactTable";

import CellRendererPrimeReactDataTable from "../PrimeReactTableComponent/CellRendererPrimeReactDataTable";

import { CCollapse, CListGroup } from "@coreui/react";
import {
  FaChevronCircleUp,
  FaChevronCircleDown,
  FaSearch,
} from "react-icons/fa";
import { MdPersonAddAlt1 } from "react-icons/md";
import moment from "moment";
import { BiCheck } from "react-icons/bi";
import { AiFillDelete } from "react-icons/ai";

import AddNewRolePopUp from "./AddNewRolePopUp";
import { Column } from "primereact/column";
import ScreenBreadcrumbs from "../Common/ScreenBreadcrumbs";

function AddUserRole({ urlPath, visible, setVisible, setCheveronIcon }) {
  // const admmsbaseUrl = environment.admmsbaseUrl
  const baseUrl = environment.baseUrl;
  // const baseUrl = environment.admmsbaseUrl;
  let rows = 10;
  const [riskDetails, setRiskDetails] = useState([]);
  const [formData, setFormData] = useState({
    assigned_to: null,
    resRolesID: "",
  });
  const [roles, setRoles] = useState([]);
  const [menus, setMenus] = useState([]);

  const [headerdata, setHeaderdata] = useState([]);
  const [listdata, setListdata] = useState([]);
  const [addVisisble, setAddVisible] = useState(false);
  const [buttonPopup, setButtonPopup] = useState(false);
  const [successfullymsg, setSuccessfullymsg] = useState(false);
  const [checkValidation, setCheckValidation] = useState([]);
  const [usersId, setUsersId] = useState([]);
  const [openState, setOpenState] = useState(false);
  const [tableState, setTableState] = useState(false);
  const [deleteMsg, setDeleteMsg] = useState(false);
  const [roleDisplayName, setRoleDisplayName] = useState([]);
  const [defaultRoleState, setDefaultRoleState] = useState(true);
  const [openMenus, setOpenMenus] = useState(false);
  const [username, setUsername] = useState([]);
  const [defaultRole, setDefaultRole] = useState([]);

  const loggedUserId = localStorage.getItem("resId");
  const [routes, setRoutes] = useState([]);
  let currentScreenName = ["Hammer Tool", "Add User Role"];
  let textContent = "Administration";
  sessionStorage.setItem(
    "breadCrumbs",
    JSON.stringify({
      routes: routes,
      currentScreenName: currentScreenName,
      textContent: textContent,
    })
  );

  console.log(roles);
  const getData = () => {
    axios({
      method: "get",
      url: baseUrl + `/ProjectMS/risks/getAssignedData`,
    }).then(function (response) {
      var res = response.data;
      setRiskDetails(res);
    });
  };
  useEffect(() => {
    getMenus();
    getUrlPath();
  }, []);

  useEffect(() => {
    getData();
  }, []);

  // const [isVisible, setIsVisible] = useState(false)
  // const handlevisible = ()=>(
  //   setIsVisible(true)
  // )
  const onChangeHandler = (e) => {
    const { id, value } = e.target;
    // setIsVisible(true);
    console.log("on Change Handler");
    setFormData((prev) => ({ ...prev, [e.target.id]: id }));
    console.log("fck");
    console.log(formData);
    setUsersId(formData);
    setOpenMenus(false);
  };
  //-----------------Table Data List of roles-----------------
  console.log(username);
  const [data, setData] = useState([]);
  // console.log(roles)
  const handleRoles = (e) => {
    axios({
      method: "post",
      url: baseUrl + `/administrationms/updatetask/listofroles`,
      // headers: { "Content-Type": "application/json" },
      data: {
        res_id: formData.assigned_to,
      },
    }).then((response) => {
      let tabledata = response.data;
      console.log(tabledata);
      const filteredEntries = tabledata.filter((entry) => {
        return (
          entry.display_name === "Finance Admin" ||
          entry.display_name === "Acc Executive" ||
          entry.display_name === "Project Coordinator" ||
          entry.display_name === "Executive Management" ||
          entry.display_name === "RMG Full Access" ||
          entry.display_name === "Finance" ||
          entry.display_name === "Vendor Manager" ||
          entry.display_name === " Project Manager" ||
          entry.display_name === "CSL" ||
          entry.display_name === "Competency Lead" ||
          entry.display_name === "DP,CL,CSL Access" ||
          entry.display_name === "Sales Hierarchy Access" ||
          entry.display_name === "PPM Admin access" ||
          entry.display_name === "Software Engineer" ||
          entry.display_name === "Project Manager" ||
          entry.display_name === "PCQA Admin"
        );
      });
      const updatedEntries = filteredEntries.map((entry) => {
        if (entry.display_name === "DP,CL,CSL Access") {
          entry.display_name = "DP";
        } else if (entry.display_name === "RMG Full Access") {
          entry.display_name = "RMG";
        } else if (entry.display_name === "PPM Admin access") {
          entry.display_name = "Admin";
        } else if (entry.display_name === "Acc Executive") {
          entry.display_name = "Account Executive";
        } else if (entry.display_name === "Vendor Manager") {
          entry.display_name = "VMG";
        }
        return entry;
      });
      for (let i = 0; i < updatedEntries?.length; i++) {
        updatedEntries[i]["SNO"] = i + 1;
      }
      console.log(updatedEntries);

      let headerData = [
        {
          SNO: "S.No",
          display_name: "Profiles",
          // date_created: "Created Date",
          Action: "Action",
        },
      ];

      setMenus(headerData.concat(updatedEntries));
      setDefaultRole(updatedEntries[0]?.display_name);
      console.log(response.data);
      setButtonPopup(false);
      // setSuccessfullymsg(true);
      // setTimeout(() => {
      //   setSuccessfullymsg(false);
      // }, 3000);
    });
  };
  console.log(menus);
  useEffect(() => {
    handleRoles();

    console.log("in line 98---");
    console.log(formData.assigned_to);
    console.log(formData);
    if (formData.assigned_to != null) {
      setTableState(true);
    }
    // handleChange();
  }, [formData.assigned_to]);

  ///----
  console.log(formData.assigned_to);
  const handleMenus = (e) => {
    axios({
      method: "post",
      url: baseUrl + "/administrationms/updatetask/menusandsubmenus",
      data: {
        res_id: formData.assigned_to,
      },
    }).then((response) => {
      let resp = response.data;

      for (let i = 0; i < resp?.length; i++) {
        {
          console.log(resp[i].mainmenu);
        }
        resp[i]["mainmenu"] =
          resp[i]["mainmenu"] == null ? "Reports" : resp[i]["mainmenu"];
        resp[i]["mainmenu"] =
          resp[i]["mainmenu"] == resp[i]["mainmenu"]
            ? resp[i]["mainmenu"]
            : resp[i]["mainmenu"];
        // resp[i]["submenu"] = resp[i]["submenu"] == "Reports" ? "" : resp[i]["submenu"];
      }

      let headerData = [{ mainmenu: "Menus", submenu: "Sub Menus" }];
      setRoles(headerData.concat(resp));
      console.log(resp);
    });
  };

  const getMenus = () => {
    axios({
      method: "GET",
      url: baseUrl + `/CommonMS/master/getMenus?loggedUserId=${loggedUserId}`,
    }).then((resp) => {
      let getData = resp.data.map((menu) => {
        if (menu.subMenus) {
          menu.subMenus = menu.subMenus.filter(
            (subMenu) =>
              subMenu.display_name !== "Roles Permissions" &&
              subMenu.display_name !== "Sales Permissions" &&
              subMenu.display_name !== "Jobs Daily Status" &&
              subMenu.display_name !== "Error Logs" &&
              subMenu.id != 27 &&
              subMenu.display_name !== "Tracker" &&
              subMenu.display_name !== "Role Costs" &&
              subMenu.display_name !== "Upload Role Costs" &&
              subMenu.display_name !== "Contract Documents"
          );
        }
        return menu;
      });

      getData.forEach((item) => {
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
        `/CommonMS/security/authorize?url=/admin/addUserRole&userId=${loggedUserId}`,
    }).then((res) => {
      console.log(res, "urlResponse");
    });
  };
  //===========

  //===========

  useEffect(() => {
    handleMenus();
  }, [formData.assigned_to]);
  // http://10.11.12.149:8090/administrationms/updatetask/getmenuroles
  const menusList = (e) => {
    axios({
      method: "post",
      url:
        baseUrl +
        //  `http://localhost:8096/administrationms/updatetask/assignnewroles?resId=${formData.assigned_to}&roleId=91`,
        `/administrationms/updatetask/getmenuroles`,
      data: {
        roleId: e,
      },
    }).then((response) => {
      let tabledata = response.data;
      // setListdata(tabledata);
      // console.log(tabledata);
      let headerData = [{ mainmenu: "Menus", submenu: "Sub Menus" }];
      setRoles(headerData.concat(tabledata));
      setOpenMenus(true);
      // console.log(resp);
    });
  };

  console.log(roleDisplayName);

  const DeleteRole = (e) => {
    console.log();
    axios({
      method: "delete",
      url:
        baseUrl +
        `/customersms/Customers/deleteRoleId?userId=${
          Number(formData.assigned_to) - 1
        }&roleId=${e}`,
    }).then((error) => {
      console.log("success", error);
      let data = error.data;
      // setDeleteMsg(true);{=}
      setDeleteMsg(true);
      setOpenMenus(false);
      setDefaultRoleState(true);
      setTimeout(() => {
        setDeleteMsg(false);
      }, 3000);
      handleRoles();
    });
  };

  console.log(riskDetails, "123456");
  const roleName = (data) => {
    console.log(data);

    return (
      <div
        style={{
          color: "#15a7ea",
          textDecoration: "underLine",
          cursor: "pointer",
        }}
        onClick={() => {
          console.log(data);
          menusList(data.id);
          setRoleDisplayName(data.display_name);
          setDefaultRoleState(false);

          console.log("bandhai---");
        }}
      >
        {data.display_name}
      </div>
    );
  };
  const action = (data) => {
    console.log(data);

    return (
      <div style={{ color: "orange", textAlign: "center", tittle: "delete" }}>
        {data.display_name == "Software Engineer" ? (
          <div style={{ cursor: "not-allowed" }}>
            <AiFillDelete />
          </div>
        ) : (
          <AiFillDelete
            onClick={() => {
              DeleteRole(data.id);
              console.log(data.id);
            }}
          />
        )}
      </div>
    );
  };
  const Serial = (data) => {
    return <div style={{ textAlign: "center" }}>{data.SNO}</div>;
  };
  // const createdDate = (data) => {
  //   return (
  //     <div style={{ textAlign: "center" }}>
  //       {moment(data.date_created).format("DD-MMM-YYYY")}
  //     </div>
  //   );
  // };
  const [checkedData, setCheckedData] = useState([]);
  const dynamicColumns = Object.keys(headerdata)?.map((col, i) => {
    return (
      <Column
        sortable
        key={col}
        body={
          col == "display_name"
            ? roleName
            : col == "Action"
            ? action
            : col == "SNO" && Serial
        }
        field={col}
        header={headerdata[col]}
      />
    );
  });
  console.log(roles);
  return (
    <div>
      {successfullymsg ? (
        <div className="statusMsg success">
          <span className="errMsg">
            <BiCheck />
            &nbsp; Role(s) Saved Successfully
          </span>
        </div>
      ) : (
        ""
      )}
      {deleteMsg ? (
        <div className="statusMsg success">
          <span className="errMsg">
            <BiCheck />
            &nbsp; Role(s) Deleted Successfully
          </span>
        </div>
      ) : (
        ""
      )}
      <div>
        <div className="col-md-12"></div>
        &nbsp;
        <div className="group mb-3 customCard">
          <CCollapse visible={!visible}>
            <div className=" col-md-6 mb-2">
              <div className="form-group row">
                <label className="col-3" htmlFor="Resources">
                  Resources *
                </label>
                <span className="col-1 p-0">:</span>
                <div className="col-6">
                  <div className="autoComplete-container">
                    <RiskAutoComplete
                      id="assigned_to"
                      name="assigned_to"
                      riskDetails={riskDetails}
                      // setState={setState}
                      setFormData={setFormData}
                      // onChange={setDefaultRoleState}
                      setUsername={setUsername}
                      onChange={() => {
                        setDefaultRoleState;
                        setOpenMenus(false);
                        onChangeHandler();
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </CCollapse>
        </div>
        {/* {/* </div> */}
      </div>
      {tableState ? (
        <div>
          <div className="row">
            <div className="col-md-6">
              <div
                className="d-flex justify-content-between align-items-center mb-2"
                style={{ minHeight: "28px" }}
              >
                <b style={{ color: "#317fb3", fontSize: "14px" }}>
                  List of Profiles for {username}
                </b>
                <button
                  className="btn btn-primary"
                  onClick={() => {
                    setButtonPopup(true);
                    setOpenState(true);
                  }}
                >
                  <MdPersonAddAlt1 /> Assign New Profile
                </button>
              </div>

              {/* <FlatPrimeReactTable data={menus} rows={rows} /> */}
              <div className="UserProfileTable">
                <CellRendererPrimeReactDataTable
                  data={menus}
                  rows={rows}
                  dynamicColumns={dynamicColumns}
                  headerData={headerdata}
                  setHeaderData={setHeaderdata}
                />
              </div>
            </div>
            {openMenus && (
              <div className="col-md-6">
                <div
                  className="d-flex justify-content-between align-items-center mb-2"
                  style={{ minHeight: "28px" }}
                >
                  <b style={{ color: "#317fb3", fontSize: "14px" }}>
                    Menus and Sub Menus for {roleDisplayName}
                  </b>
                </div>
                <div style={{ height: "400px", overflowY: "auto" }}>
                  {roles?.length > 0 ? (
                    <FlatPrimeReactTable
                      data={roles}
                      rows={100}
                      rowGroupMode={"rowspan"}
                      groupRowsBy={"mainmenu"}
                    />
                  ) : (
                    ""
                  )}
                </div>
              </div>
            )}
            {defaultRoleState && (
              <div className="col-md-6">
                {roles?.length == 1 ? (
                  ""
                ) : (
                  <div
                    className="d-flex justify-content-between align-items-center mb-2"
                    style={{ minHeight: "28px" }}
                  >
                    <b style={{ color: "#317fb3", fontSize: "14px" }}>
                      Menus and Sub Menus for {defaultRole}
                    </b>
                  </div>
                )}
                {roles?.length == 1 ? (
                  ""
                ) : (
                  <div style={{ height: "400px", overflowY: "auto" }}>
                    <FlatPrimeReactTable
                      data={roles}
                      rows={100}
                      rowGroupMode={"rowspan"}
                      groupRowsBy={"mainmenu"}
                    />
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      ) : (
        ""
      )}
      {buttonPopup ? (
        <AddNewRolePopUp
          buttonPopup={buttonPopup}
          setButtonPopup={setButtonPopup}
          defaultRole={defaultRole}
          successfullymsg={successfullymsg}
          setSuccessfullymsg={setSuccessfullymsg}
          formData={formData}
          setFormData={setFormData}
          checkValidation={checkValidation}
          setCheckValidation={setCheckValidation}
          handleRoles={handleRoles}
          setOpenState={setOpenState}
          openState={openState}
        />
      ) : (
        " "
      )}
    </div>
  );
}

export default AddUserRole;
