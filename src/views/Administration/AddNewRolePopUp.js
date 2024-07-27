import axios from "axios";
import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { environment } from "../../environments/environment";
import { CModal } from "@coreui/react";
import { CModalBody } from "@coreui/react";
import CellRendererPrimeReactDataTable from "../PrimeReactTableComponent/CellRendererPrimeReactDataTable";
import { Column } from "primereact/column";
import { CModalHeader } from "@coreui/react";
import { CModalTitle } from "@coreui/react";
import CheckFlatPrimeReactTable from "../PrimeReactTableComponent/CheckFlatPrimeReactTable";
import { AiFillWarning } from "react-icons/ai";
import GlobalValidation from "../ValidationComponent/GlobalValidation";
import { VscChromeClose } from "react-icons/vsc";
import FlatPrimeReactTable from "../PrimeReactTableComponent/FlatPrimeReactTable";
import { ImCross } from "react-icons/im";

function AddNewRolePopUp(props) {
  const {
    buttonPopup,
    setButtonPopup,
    formData,
    setFormData,
    checkValidation,
    defaultRole,
    setCheckValidation,
    openState,
    setOpenState,
    handleRoles,
    setSuccessfullymsg,
    successfullymsg,
  } = props;

  let rows = 10;
  const [displayDefaultRole, setDisplayDefaultRole] = useState([]);
  const [checkedData, setCheckedData] = useState([]);
  console.log(checkedData);
  const [popuproles, setPopupRoles] = useState([]);
  const [validationMessage, setValidationMessage] = useState(false);
  const [popupsubmenus, setPopupSubmenus] = useState([]);
  const [checkedData1, setCheckedData1] = useState([]);
  console.log(defaultRole);
  const [defaultRoleState, setDefaultRoleState] = useState(true);
  const [defaultPopUpRow, setDefaultPopUpRow] = useState([]);
  console.log(checkedData1);
  const [headerdata, setHeaderdata] = useState([]);
  const [roleDisplayName, setRoleDisplayName] = useState([]);
  const [roleDisplayId, setRoleDisplayId] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [def, setdef] = useState([]);
  const baseUrl = environment.baseUrl;
  console.log(displayDefaultRole, defaultRole, roleDisplayName);
  console.log(roleDisplayName);
  const PopupRoles = () => {
    axios({
      method: "post",
      url: baseUrl + `/administrationms/updatetask/roles`,

      data: {
        res_id: formData.assigned_to,
      },
    }).then((response) => {
      let respData = response.data;
      console.log(respData);
      const filteredEntries = respData.filter((entry) => {
        return (
          entry.display_name === "Finance Admin" ||
          entry.display_name === "Acc Executive" ||
          entry.display_name === "Project Coordinator" ||
          entry.display_name === "Executive Management" ||
          entry.display_name === "RMG Full Access" ||
          entry.display_name === "Finance" ||
          entry.display_name === "Vendor Manager" ||
          entry.display_name === "Project Manager" ||
          entry.display_name === "CSL" ||
          entry.display_name === "Competency Lead" ||
          entry.display_name === "Sales Hierarchy Access" ||
          entry.display_name === "PCQA Admin" ||
          (entry.display_name === "DP,CL,CSL Access" && "DP") ||
          entry.display_name === "PPM Admin access" ||
          entry.display_name === "Software Engineer"
        );
      });
      console.log(filteredEntries[0].display_name);
      setDisplayDefaultRole(filteredEntries[0].display_name);
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
      let headerData = [{ SNO: "S.No", display_name: "Profiles" }];
      let finalDataa = [...headerData, ...updatedEntries];
      console.log(respData);
      // setPopupRoles(finalDataa);
      console.log(finalDataa);

      console.log(updatedEntries);
      setPopupRoles(finalDataa);
    });
  };
  console.log(displayDefaultRole, defaultRole);
  useEffect(() => {
    PopupRoles();
  }, [formData.assigned_to]);
  //-----
  console.log(checkedData);

  const getPopupMenussubmenus = (e) => {
    // formData["resRolesID"] = checkedData;
    console.log(checkedData);
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
      console.log(response);
      let resp = response.data;
      for (let i = 0; i < resp?.length; i++) {
        {
          console.log(resp[i].mainmenu);
        }
        resp[i]["mainmenu"] =
          resp[i]["mainmenu"] == null ? "Reports" : resp[i]["mainmenu"];
        resp[i]["submenu"] =
          resp[i]["submenu"] == "Reports" ? "" : resp[i]["submenu"];
      }

      let headerData = [{ mainmenu: "Menus", submenu: "Sub Menus" }];
      setPopupSubmenus(headerData.concat(resp));
      setDefaultPopUpRow(resp[0]);
      console.log(response.data);
    });
  };
  useEffect(() => {
    // getPopupMenussubmenus();
  }, [checkedData]);
  const defaultSubMemus = (e) => {
    // formData["resRolesID"] = checkedData;
    console.log(checkedData);
    axios({
      method: "post",
      url:
        baseUrl +
        //  `http://localhost:8096/administrationms/updatetask/assignnewroles?resId=${formData.assigned_to}&roleId=91`,
        `/administrationms/updatetask/menusandsubmenus`,
      data: {
        res_id: formData.assigned_to,
      },
    }).then((response) => {
      console.log(response);
      let resp = response.data;
      console.log(resp);
      let headerData = [{ mainmenu: "Menus", submenu: "Sub Menus" }];
      //   setdef(headerData.concat(resp));
      console.log(headerData.concat(resp));
      setDefaultPopUpRow(headerData.concat(resp));
      console.log(response.data);
    });
  };
  useEffect(() => {
    defaultSubMemus();
  }, []);
  //----------------Post Assign Roles-----------------
  console.log(def);
  const handleConfirm = (e) => {
    axios({
      method: "post",
      url:
        baseUrl +
        `/administrationms/updatetask/assignnewroles?resId=${formData.assigned_to}&roleId=${roleDisplayId}`,
    }).then((response) => {
      handleRoles();
      //   handleRoles();
      //   setValidationMessage(true);
      setSuccessfullymsg(true);
      setTimeout(() => {
        setSuccessfullymsg(false);
      }, 3000);
    });
  };

  useEffect(() => {
    // handleConfirm();
  }, []);
  const Profiles = (data) => {
    return (
      <div
        style={{
          color: "#15a7ea",
          textDecoration: "underLine",
          cursor: "pointer",
          textAlign: "left",
        }}
        onClick={() => {
          console.log(data.id);
          //   setRoleId(data.id);
          getPopupMenussubmenus(data.id);
          setRoleDisplayName(data.display_name);
          setRoleDisplayId(data.id);
          setOpenState(false);
          setDefaultRoleState(false);
        }}
      >
        {data.display_name}
      </div>
    );
  };
  const serial = (data) => {
    return <div style={{ textAlign: "center" }}>{data.SNO}</div>;
  };
  const dynamicColumns = Object.keys(headerdata)?.map((col, i) => {
    return (
      <Column
        sortable
        key={col}
        body={col == "display_name" ? Profiles : col == "SNO" && serial}
        field={col}
        header={headerdata[col]}
      />
    );
  });
  console.log(defaultRole, roleDisplayName);
  return (
    <div className="col-md-12 ">
      <CModal
        size="lg"
        visible={buttonPopup}
        onClose={() => setButtonPopup(false)}
      >
        <CModalHeader className="hgt22" style={{ cursor: "all-scroll" }}>
          <CModalTitle>
            <span className="ft16">List Of Profiles</span>
          </CModalTitle>
        </CModalHeader>
        <CModalBody>
          {defaultPopUpRow?.length == 1 ? (
            <div className="col-md-6 mt-4">
              {openState && (
                <div className=" col-md-12">
                  <b
                    className="changing1"
                    style={{ color: "#317fb3", fontSize: "14px" }}
                  >
                    Menus and Sub Menus for {displayDefaultRole}
                  </b>
                </div>
              )}

              <CellRendererPrimeReactDataTable
                data={popuproles}
                rows={rows}
                dynamicColumns={dynamicColumns}
                headerData={headerdata}
                setHeaderData={setHeaderdata}
              />
            </div>
          ) : (
            <div className="profilesListPopUp">
              <div className="col-md-6">
                <div className=" col-md-12">
                  <b
                    className="changing1"
                    style={{ color: "#317fb3", fontSize: "14px" }}
                  >
                    Roles to Assign
                  </b>
                </div>
                <CellRendererPrimeReactDataTable
                  data={popuproles}
                  rows={rows}
                  dynamicColumns={dynamicColumns}
                  headerData={headerdata}
                  setHeaderData={setHeaderdata}
                />
              </div>
              {/* <p>Menus and Sub Menus for {defaultRole}</p> */}

              {defaultRoleState && (
                <div className="col-md-6">
                  <div className="col-md-12">
                    <b
                      className="changing2"
                      style={{ color: "#317fb3", fontSize: "14px" }}
                    >
                      Menus and Sub Menus for {defaultRole}
                    </b>
                  </div>
                  <div
                    className="default"
                    style={{
                      height: "400px",
                      overflowY: "auto",
                    }}
                  >
                    <FlatPrimeReactTable
                      data={defaultPopUpRow}
                      rows={100}
                      rowGroupMode={"rowspan"}
                      groupRowsBy={"mainmenu"}
                    />
                  </div>
                </div>
              )}

              {popupsubmenus?.length == 1 ? (
                ""
              ) : (
                <div className="col-md-6">
                  <div>
                    {defaultRoleState == false ? (
                      <div className="col-md-12">
                        <b
                          className="changing3"
                          style={{ color: "#317fb3", fontSize: "14px" }}
                        >
                          Menus and Sub Menus for {roleDisplayName}
                        </b>
                      </div>
                    ) : (
                      ""
                    )}
                    <div
                      style={{
                        width: "calc(100% - 13px)",
                        height: "400px",
                        overflowY: "auto",
                      }}
                    >
                      <FlatPrimeReactTable
                        data={popupsubmenus}
                        rows={100}
                        rowGroupMode={"rowspan"}
                        groupRowsBy={"mainmenu"}
                        setCheckedData={setCheckedData}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          <div className='className="col-md-12 col-sm-12 col-xs-12 btn-container center my-3'>
            <button
              type="button"
              className="btn btn-primary"
              onClick={(e) => {
                console.log("in line 331");
                console.log(checkValidation);
                handleConfirm(e);
                setButtonPopup(false);
                // setFormData(prev => ({ ...prev, [e.target.id]: e.target.value }));
                // setValidationMessage(true);
              }}
            >
              Confirm
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => {
                setButtonPopup(false);
              }}
            >
              <ImCross />
              &nbsp; Cancel
            </button>
          </div>
        </CModalBody>
      </CModal>
    </div>
  );
}

export default AddNewRolePopUp;
