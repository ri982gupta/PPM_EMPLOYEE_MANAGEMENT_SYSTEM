import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { environment } from "../../environments/environment";
import { AiFillDelete, AiFillEdit } from "react-icons/ai";
import ProjectScopeChangesAddAndEditPopUP from "./ProjectScopeChangesAddAndEditPopUP";
import CellRendererPrimeReactDataTable from "../PrimeReactTableComponent/CellRendererPrimeReactDataTable";
import { Column } from "ag-grid-community";
import Draggable from "react-draggable";
import { CModal, CModalBody, CModalHeader, CModalTitle } from "@coreui/react";
import { BiCheck } from "react-icons/bi";
import { TfiSave } from "react-icons/tfi";
import { ImCross } from "react-icons/im";
import moment from "moment";
import Loader from "../Loader/Loader";
import { FaPlus } from "react-icons/fa";
import ScreenBreadcrumbs from "../Common/ScreenBreadcrumbs";

function ProjectScopeChanges(props) {
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
  const dataObject = grp4Items.find(
    (item) => item.display_name === "Scope Changes"
  );

  const [data, SetData] = useState([]);
  const [headerData, setHeaderData] = useState([]);
  const [linkColumns, setLinkColumns] = useState([]);
  const baseUrl = environment.baseUrl;
  const [deletePopup, setDeletePopup] = useState(false);
  const [uid, setUid] = useState(" ");
  const [deleteMessage, setDeleteMessage] = useState(false);
  const [addAndEditPopup, setaddAndEditPopup] = useState(false);
  const [editedData, setEditedData] = useState([]);
  const [type, setType] = useState("add");
  const [addmsg, setAddmsg] = useState(false);
  const [editmsg, setEditAddmsg] = useState(false);
  const [editId, setEditId] = useState();
  const [prjName, setPrjName] = useState([]);
  const [update, setUpdate] = useState(false);
  const [loader, setLoader] = useState(false);
  const abortController = useRef(null);
  const loggedUserId = localStorage.getItem("resId");
  const [data2, setData2] = useState([]);
  // breadcrumbs --

  const [routes, setRoutes] = useState([]);
  let textContent = "Delivery";
  let currentScreenName = ["Projects", "Monitoring", "Scope Changes"];
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
  const getUrlPath = () => {
    axios({
      method: "get",
      url:
        baseUrl +
        `/CommonMS/security/authorize?url=/project/scopeChanges/&userId=${loggedUserId}`,
    }).then((res) => {
      console.log(res, "urlResponse");
    });
  };
  const data1 = {
    id: null,
    description: "",
    change_req_date: "",
    financial_impact: "",
  };
  const [color, setColor] = useState();
  const [formData, setFormData] = useState(data1);
  useEffect(() => {}, [editedData]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const [selectedValue, setSelectedValue] = useState(
    localStorage.getItem("selectedValue") || ""
  );

  const handleChange1 = (e) => {
    const value = e.target.value;
    setSelectedValue(value);
    localStorage.setItem("selectedValue", value);
    setColor(e.target.value);
    setLoader(false);
    setTimeout(() => {
      setLoader(false);
      setUpdate(true);
    }, 1000);
    setTimeout(() => {
      setUpdate(false);
    }, 2000);
  };

  //// Getting the project Scopechanages ///////
  const getScopeChanges = () => {
    setLoader(false);
    abortController.current = new AbortController();

    axios({
      method: "get",
      url:
        baseUrl +
        `/ProjectMS/ProjectScopeChange/getProjectScopeChanges?pid=${projectId}`,
      signal: abortController.current.signal,
    }).then((res) => {
      const GetData = res.data;
      for (let i = 0; i < GetData.length; i++) {
        GetData[i]["SNo"] = i + 1;
        GetData[i]["change_req_date"] =
          GetData[i]["change_req_date"] == null
            ? " "
            : moment(GetData[i]["change_req_date"]).format("DD-MMM-yyyy");
      }
      let Headerdata = [
        {
          description: "Description Of Change",
          change_req_date: "Date",
          financial_impact: "Financial Impact",
          Actions: "Actions",
        },
      ];
      let Headerdata1 = [
        {
          description: "Description Of Change",
          change_req_date: "Date",
          financial_impact: "Financial Impact",
        },
      ];
      let data = ["Actions"];
      setLinkColumns(data);
      setLoader(false);

      {
        grp4Items[12].is_write == true
          ? SetData(Headerdata.concat(GetData))
          : SetData(Headerdata1.concat(GetData));
      }

      setTimeout(() => {
        setLoader(false);
      }, 1000);
    });
  };

  useEffect(() => {
    getScopeChanges();
  }, []);

  const handleAbort = () => {
    abortController.current && abortController.current.abort();
    setLoader(false);
  };

  const LinkTemplate = (data) => {
    let rou = linkColumns[0];
    return (
      <div align="center">
        <>
          {grp4Items[12].is_write == true ? (
            <AiFillEdit
              className="disabled ellipsis"
              data-toggle="tooltip"
              title="Edit Scope"
              color="orange"
              type="edit"
              style={{ pointerEvents: "none" }}
              size="1.2em"
              onClick={() => {
                setEditedData(data);
                setEditId(data.id);
                setaddAndEditPopup(true);
                setType("edit");
              }}
            />
          ) : (
            ""
          )}{" "}
          &nbsp;
          {grp4Items[12].is_write == true ? (
            <AiFillDelete
              className="ellipsis "
              data-toggle="tooltip"
              title="Delete Scope"
              color="orange"
              type="delete"
              cursor="pointer"
              onClick={() => {
                setDeletePopup(true);
                setUid(data.id);
                setType("delete");
              }}
            />
          ) : (
            ""
          )}
        </>
      </div>
    );
  };

  const changeReqDateTT = (data) => {
    return (
      <div data-toggle="tooltip" title={data.change_req_date}>
        {data.change_req_date}
      </div>
    );
  };
  const descriptionTT = (data) => {
    return (
      <div data-toggle="tooltip" title={data.description}>
        {data.description}
      </div>
    );
  };
  const financialImpactTT = (data) => {
    return (
      <div data-toggle="tooltip" title={data.financial_impact}>
        {data.financial_impact}
      </div>
    );
  };

  const dynamicColumns = Object.keys(headerData)?.map((col, i) => {
    return (
      <Column
        sortable
        key={col}
        body={
          col == "Actions"
            ? LinkTemplate
            : (col == "change_req_date" && changeReqDateTT) ||
              (col == "description" && descriptionTT) ||
              (col == "financial_impact" && financialImpactTT)
        }
        field={col}
        header={headerData[col]}
      />
    );
  });

  useEffect(() => {
    data[0] && setHeaderData(JSON.parse(JSON.stringify(data[0])));
  }, [data]);

  ///----------Deleting the record -----------///
  const deleteIssue = () => {
    axios({
      method: "delete",
      url:
        baseUrl +
        `/ProjectMS/ProjectScopeChange/deleteProjectScopeChanges?id=${uid}`,
    }).then((error) => {
      getScopeChanges();
      setDeletePopup(false);
      setDeleteMessage(true);
      setTimeout(() => {
        setDeleteMessage(false);
      }, 1000);
    });
  };

  const getProjectName = () => {
    axios({
      method: "get",
      url: baseUrl + `/ProjectMS/Audit/getProjectName?projectId=${projectId}`,
    }).then(function (response) {
      let resp = response.data;
      setPrjName(resp);
    });
  };

  useEffect(() => {
    getProjectName();
  }, []);

  function ProjectScopeChangesDeletePopUP(props) {
    const { deletePopup, setDeletePopup } = props;

    return (
      <div>
        <Draggable>
          <CModal
            alignment="center"
            backdrop="static"
            visible={deletePopup}
            size="xs"
            className="ui-dialog"
            onClose={() => setDeletePopup(false)}
          >
            <CModalHeader className="">
              <CModalTitle>
                <span className="">Delete Scope</span>
              </CModalTitle>
            </CModalHeader>
            <CModalBody>
              Are you sure to delete Scope Change ?
              <div className="btn-container center my-2">
                <button
                  className="btn btn-primary"
                  title="Delete"
                  onClick={() => {
                    deleteIssue();
                  }}
                >
                  <TfiSave /> Delete
                </button>
                <button
                  className="btn btn-secondary"
                  title="Cancel"
                  onClick={() => {
                    setDeletePopup(false);
                  }}
                >
                  <ImCross fontSize={"11px"} /> Cancel{" "}
                </button>
              </div>
            </CModalBody>
          </CModal>
        </Draggable>
      </div>
    );
  }

  return (
    <div>
      {loader ? <Loader handleAbort={handleAbort} /> : ""}

      {deleteMessage ? (
        <div className="statusMsg success">
          <BiCheck /> Project Scope Deleted successfully
        </div>
      ) : (
        ""
      )}

      {addmsg ? (
        <div className="statusMsg success">
          <BiCheck /> Project Scope Saved successfully
        </div>
      ) : (
        ""
      )}

      {editmsg ? (
        <div className="statusMsg success">
          <BiCheck /> Project Scope Updated successfully
        </div>
      ) : (
        ""
      )}

      {update ? (
        <div className="statusMsg success">
          <BiCheck /> Project Scope Updated successfully
        </div>
      ) : (
        ""
      )}

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
            <h2>
              Scope Change and History Indicator
            </h2>
          </div>
          <div className="childThree"></div>
        </div>
      </div>

      <div className="group mb-3 customCard">
        <div className="group-content row">
          <div className="form-group col-md-2 mb-2">
            <label htmlFor="name">Project Scope Indicator</label>
            <select value={selectedValue} onChange={handleChange1}>
              <option value=""> &lt;&lt;Please Select&gt;&gt;</option>
              <option value="Green">Green</option>
              <option value="Orange">Orange</option>
              <option value="Red">Red</option>
            </select>
          </div>
        </div>
      </div>

      <div className="group mb-3 customCard">
        <CellRendererPrimeReactDataTable
          data={data}
          linkColumns={linkColumns}
          dynamicColumns={dynamicColumns}
          headerData={headerData}
          setHeaderData={setHeaderData}
          rows={10}
        />
        <div className="col-md-12 col-sm-12 col-xs-12 my-2 btn-container center">
          {dataObject?.is_write == true ? (
            <button
              type="Add"
              title="Add"
              className="btn btn-primary"
              onClick={() => {
                setaddAndEditPopup(true);
                setType("add");
              }}
            >
              <FaPlus />
              Add
            </button>
          ) : (
            ""
          )}
        </div>

        {addAndEditPopup ? (
          <ProjectScopeChangesAddAndEditPopUP
            addAndEditPopup={addAndEditPopup}
            handleChange={handleChange}
            setaddAndEditPopup={setaddAndEditPopup}
            type={type}
            editedData={editedData}
            setEditedData={setEditedData}
            getScopeChanges={getScopeChanges}
            editId={editId}
            data1={data1}
            data={data}
            setAddmsg={setAddmsg}
            setEditAddmsg={setEditAddmsg}
            formData={formData}
            setFormData={formData}
            projectId={projectId}
          />
        ) : (
          ""
        )}

        {deletePopup ? (
          <ProjectScopeChangesDeletePopUP
            deletePopup={deletePopup}
            setDeletePopup={setDeletePopup}
            editId={editId}
          />
        ) : (
          ""
        )}
      </div>
    </div>
  );
}

export default ProjectScopeChanges;
