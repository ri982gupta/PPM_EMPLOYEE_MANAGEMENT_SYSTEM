import React, { useEffect, useRef } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Link } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import { FaPlus } from "react-icons/fa";
import { environment } from "../../environments/environment";
import "./TeamsHierarchyTable.scss";
import TeamsProjectHierarchyTree from "./TeamsProjectHierarchyTree";
import Loader from "../Loader/Loader";
function ProjectHierarchy(props) {
  const {
    projectHierarchy,
    searchProjecthierarchy,
    setShowprojectHie,
    showprojectHie,
  } = props;
  const projectHierarchy1 = projectHierarchy.data;
  const [searchinghierarchy, setSearchingHierarchy] = useState(false);
  const [hierarchyCount, setHierarchyCount] = useState(0);
  const [hierarchydata, setHierarchyData] = useState([]);
  const [state, setState] = useState("All");
  const [loader1, setLoader1] = useState(false);

  const baseUrl = environment.baseUrl;
  const [projectId, setProjectId] = useState([]);
  const getPrjRolesTree = (id) => {
    const loaderTime = setTimeout(() => {
      setLoader1(true);
    }, 2000);
    axios({
      method: "post",
      url: baseUrl + `/teamms/Hierarchy/prjRolesTree`,
      data: {
        typ: "roles",
        prjId: projectId == "" ? id : projectId,
        dat: "0000-00-00",
        status: state,
      },
      headers: { "Content-Type": "application/json" },
    }).then((resp) => {
      const getData = resp.data;
      setHierarchyCount((prev) => prev + 1);
      setHierarchyData(getData);
      setSearchingHierarchy(true);
      clearTimeout(loaderTime);
      setLoader1(false);
    });
  };
  useEffect(() => {
    getPrjRolesTree();
  }, [state, projectId]);

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
          }}
        >
          {formattedValue}
        </Link>

        <FaPlus
          style={{
            cursor: "pointer",
          }}
          onClick={(e) => {
            getPrjRolesTree(rowData.pId);
            setProjectId(rowData.pId);
            setShowprojectHie(true);
          }}
        />
      </div>
    );
  };
  const [globalFilter, setGlobalFilter] = useState("");

  const onGlobalFilter = (e) => {
    const value = e.target.value.toLowerCase();
    setGlobalFilter(value);
  };

  const filteredData = projectHierarchy1
    ? Object.values(projectHierarchy1).filter(
        (item) =>
          item.cName.toLowerCase().includes(globalFilter) ||
          item.pName.toLowerCase().includes(globalFilter)
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

              <div className="col-md-6 mt-2 darkHeader">
                <DataTable
                  value={filteredData}
                  editMode="row"
                  showGridlines
                  stripedRows
                  scrollHeight="calc(100vh - 145px)"
                  responsiveLayout="scroll"
                >
                  <Column field="cName" header="Customer"></Column>
                  <Column header="Projects" body={projectLinks}></Column>
                </DataTable>
              </div>
            </>
          ) : (
            ""
          )}
          {!visi && showprojectHie == true && hierarchydata.length > 0 ? (
            <div className="col-md-6 mt-2">
              <div
                className="col-md-6 group mb-3 "
                style={{ backgroundColor: "#eeeeee38" }}
              >
                <div
                  className="col-md-12"
                  style={{
                    borderBottom: "1px solid grey",
                    background: "#f1eeee",
                    height: "36px",
                  }}
                >
                  <label style={{ float: "right", paddingTop: "7px" }}>
                    <select
                      style={{ marginLeft: "10px" }}
                      id="status"
                      onChange={(e) => {
                        setState(e.target.value);
                        getPrjRolesTree();
                      }}
                    >
                      <option value="All">All</option>
                      <option value="Active">Active</option>
                    </select>
                  </label>
                  <div className="childTwo">
                    <h2
                      style={{
                        textAlign: "center",
                        color: "#297AB0",
                        fontSize: "14px",
                        paddingTop: "7px",
                      }}
                    >
                      Project Hierarchy
                    </h2>
                  </div>
                </div>

                {searchinghierarchy == true ? (
                  <TeamsProjectHierarchyTree
                    defaultExpandedRows={String(-1)}
                    data={hierarchydata}
                    hierarchyCount={hierarchyCount}
                  />
                ) : (
                  ""
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
export default ProjectHierarchy;
