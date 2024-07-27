import React, { useEffect, useRef } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Link } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import { FaPlus, FaSitemap } from "react-icons/fa";
import { environment } from "../../environments/environment";
import "./TeamsHierarchyTable.scss";
import TeamsProjectHierarchyTree from "./TeamsProjectHierarchyTree";
import Loader from "../Loader/Loader";
import { VscTypeHierarchySub } from "react-icons/vsc";
function TeamsProjectHierarchy(props) {
  const {
    projectHierarchy,
    searchProjecthierarchy,
    setShowprojectHie,
    showprojectHie,
    visi,
    setState,
    state,
  } = props;
  const projectHierarchy1 = projectHierarchy?.data;
  const [searchinghierarchy, setSearchingHierarchy] = useState(false);
  const [hierarchyCount, setHierarchyCount] = useState(0);
  const [hierarchydata, setHierarchyData] = useState([]);
  // const [state, setState] = useState("All");
  const [loader1, setLoader1] = useState(false);
  const [projRolesTreeId, setProjRolesTreeId] = useState(null);
  const baseUrl = environment.baseUrl;
  const [projectId, setProjectId] = useState([]);
  const getPrjRolesTree = (id, value) => {
    setProjRolesTreeId(id);
    const loaderTime = setTimeout(() => {
      setLoader1(true);
    }, 2000);
    axios({
      method: "post",
      url: baseUrl + `/teamms/Hierarchy/prjRolesTree`,
      data: {
        typ: "roles",
        prjId: id == undefined ? projRolesTreeId : id,
        dat: "0000-00-00",
        status: value == undefined ? state : value,
      },
      headers: { "Content-Type": "application/json" },
    }).then((resp) => {
      const getData = resp.data;
      for (const project of getData) {
        if (project.id === "-1" && project.parent === "#") {
          const cleanedText = project.text.replace(/<\/?[^>]+(>|$)/g, "");
          project.text = cleanedText;
        }
      }
      setHierarchyData(getData);
      setTimeout(() => {
        document.body.click();
      }, 20);
      setHierarchyCount((prev) => prev + 1);
      setSearchingHierarchy(true);
      setShowprojectHie(true);
      clearTimeout(loaderTime);
      setLoader1(false);
    });
  };
  useEffect(() => {
    // Check if projectHierarchy and projectHierarchy.data are defined
    if (
      projectHierarchy &&
      projectHierarchy.data &&
      projectHierarchy.data.length > 0
    ) {
      getPrjRolesTree(projectHierarchy.data[0].pId);
    }
  }, [projectHierarchy]);

  const customer = (rowData) => {
    return (
      <div className="ellipsis" title={rowData.cName}>
        {rowData.cName}
      </div>
    );
  };
  const projectLinks = (rowData) => {
    const formattedValue = `${rowData.project_code} - ${rowData.pName}`;

    return (
      <div style={{ display: "flex", alignItems: "center" }}>
        <Link
          title={formattedValue}
          to={`/project/Overview/:${rowData.pId}`}
          target="_blank"
          className="ellipsis"
          style={{
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            flexGrow: 1,
            width: "90%",
          }}
        >
          {formattedValue}
        </Link>

        <FaSitemap
          style={{
            cursor: "pointer",
          }}
          onClick={(e) => {
            getPrjRolesTree(rowData.pId);
            setProjectId(rowData.pId);
          }}
        />
      </div>
    );
  };
  const [globalFilter, setGlobalFilter] = useState("");

  const onGlobalFilter = (e) => {
    const value = e.target?.value?.toLowerCase();
    setGlobalFilter(value);
  };

  const filteredData = projectHierarchy1
    ? Object.values(projectHierarchy1).filter(
        (item) =>
          item?.cName.toLowerCase().includes(globalFilter) ||
          item?.pName.toLowerCase().includes(globalFilter)
      )
    : [];
  const abortController = useRef(null);

  const handleAbort = () => {
    abortController.current && abortController.current.abort();
    setLoader1(false);
  };
  return (
    // project Hierarchy flow
    <div>
      <div className="col-md-12">
        <div className="row">
          {searchProjecthierarchy ? (
            <>
              <div>
                <div className="col-md-2">
                  <input
                    type="text"
                    placeholder="Search..."
                    value={globalFilter}
                    onChange={onGlobalFilter}
                    style={{ fontWeight: "bold" }}
                  />
                </div>
              </div>

              <div className="col-md-6 mt-2 roleProject-project-hierarchy darkHeader">
                <DataTable
                  value={filteredData}
                  editMode="row"
                  showGridlines
                  stripedRows
                  scrollHeight="calc(100vh - 147px)"
                  responsiveLayout="scroll"
                >
                  <Column
                    field="cName"
                    header="Customer"
                    alignHeader={"center"}
                    body={customer}
                  ></Column>
                  <Column
                    header="Projects"
                    alignHeader={"center"}
                    body={projectLinks}
                  ></Column>
                </DataTable>
              </div>
            </>
          ) : (
            ""
          )}
          {!visi && showprojectHie == true && hierarchydata.length > 0 ? (
            <div style={{ width: "50%" }}>
              <div
                className="col-md-12 mt-2"
                style={{ border: "1px solid #ddd" }}
              >
                <div
                  style={{
                    backgroundColor: "#eeeeee38",
                    border: "1px solid #ddd",
                  }}
                >
                  <div
                    className="col-md-12"
                    style={{
                      borderBottom: "1px solid grey",
                      background: "#4e68a5",
                      height: "32px",
                      padding: "10px",
                    }}
                  >
                    <label style={{ float: "right", paddingTop: "5px" }}>
                      <select
                        style={{ marginLeft: "10px" }}
                        id="status"
                        onChange={(e) => {
                          setState(e.target.value);
                          getPrjRolesTree(projRolesTreeId, e.target.value);
                        }}
                      >
                        <option value="All" selected>
                          All
                        </option>
                        <option value="Active">Active</option>
                      </select>
                    </label>
                    <div className="childTwo ">
                      <h3
                        style={{
                          textAlign: "center",
                          color: "#ffff",
                          fontSize: "14px",
                          paddingTop: "7px",
                        }}
                      >
                        Project Hierarchy
                      </h3>
                    </div>
                  </div>
                </div>

                {searchinghierarchy == true && filteredData.length > 0 ? (
                  // hierarchydata.length > 1
                  <TeamsProjectHierarchyTree
                    defaultExpandedRows={String(-1)}
                    data={hierarchydata}
                    hierarchyCount={hierarchyCount}
                  />
                ) : (
                  "No results found"
                )}
              </div>
            </div>
          ) : (
            ""
          )}
        </div>
      </div>
      {loader1 ? <Loader handleAbort={handleAbort} /> : ""}
    </div>
  );
}
export default TeamsProjectHierarchy;
