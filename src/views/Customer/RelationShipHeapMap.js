import axios from "axios";
import React from "react";
import { useState, useEffect } from "react";
import CellRendererPrimeReactDataTable from "../PrimeReactTableComponent/CellRendererPrimeReactDataTable";
import { AiFillDelete, AiFillEdit } from "react-icons/ai";
import { Column } from "ag-grid-community";
import RelationshipHeatmapPopUp from "./RelationshipHeatmapPopUp";
import { CModal } from "@coreui/react";
import { CModalHeader } from "@coreui/react";
import { CModalBody } from "@coreui/react";
import { CModalTitle } from "@coreui/react";
import { BiCheck } from "react-icons/bi";
import { environment } from "../../environments/environment";
import { FaPlus, FaTimes } from "react-icons/fa";
import ScreenBreadcrumbs from "../Common/ScreenBreadcrumbs";

function RelationshipHeatmap(props) {
  const {
    customerId,
    id,
    filteredData,
    mainMenu,
    urlState,
    setButtonState,
    buttonState,
    setUrlState,
    grp1Items,
    grp2Items,
    grp3Items,
    grp4Items,
  } = props;
  const dataObject = mainMenu.find(
    (item) => item.display_name === "Relationship Heatmap"
  );

  const [data, setData] = useState([{}]);
  const [headerData, setHeaderData] = useState([]);
  const [linkColumns, setLinkColumns] = useState([]);
  const [linkColumnsRoutes, setLinkColumnsRoutes] = useState([]);
  const [buttonPopup, setButtonPopup] = useState(false);
  const [editId, setEditId] = useState();
  const [editedData, setEditedData] = useState([]);
  const [type, setType] = useState("add");
  const [addmsg, setAddmsg] = useState(false);
  const [editmsg, setEditAddmsg] = useState(false);
  const [deletePopup, setDeletePopup] = useState(false);
  const [deleteMessage, setDeleteMessage] = useState(false);
  const [deleteid, setDeleteId] = useState("");
  const baseUrl = environment.baseUrl;
  const [custName, setCustName] = useState([]);
  let rows = 10;

  const loggedUserId = localStorage.getItem("resId");

  const data1 = {
    id: null,
    name: "",
    title: "",
    department: "",
    priority: "",
    relationship_strength: "",
    engagement_level: "",
    role_description: "",
    fy_mandate: "",
  };

  const [formData, setFormData] = useState(data1);
  useEffect(() => {}, [editedData]);
  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const getData = () => {
    axios
      .get(baseUrl + `/customersms/getRelationHeatMap?customerId=${customerId}`)
      .then((res) => {
        const GetData = res.data;
        for (let i = 0; i < GetData.length; i++) {
          GetData[i] == "null" ? "" : null;
          GetData[i]["SNo"] = i + 1;
        }

        let dataHeaders = [
          {
            SNo: "S.No",
            name: "Name",
            title: "Title",
            department: "Department",
            priority: "Priority",
            relationship_strength: "Relationship Strength",
            engagement_level: "Engagement Level",
            role_description: "Role Description",
            fy_mandate: "FY Mandate",
            Action: "Action",
          },
        ];

        setData(dataHeaders.concat(GetData));
      });
  };

  useEffect(() => {
    getData();
  }, []);

  const LinkTemplate = (data) => {
    let rou = linkColumns[0];
    return (
      <div align="center">
        <>
          <AiFillEdit
            title="edit"
            color="orange"
            cursor="pointer"
            type="edit"
            size="1.2em"
            onClick={() => {
              setEditedData(data);
              setEditId(data.id);
              setButtonPopup(true);
              setType("edit");
            }}
          />
          &nbsp;
          <AiFillDelete
            title="delete"
            color="orange"
            cursor="pointer"
            type="delete"
            onClick={() => {
              setDeletePopup(true);
              setType("delete");
              setDeleteId(data.id);
            }}
          />
        </>
      </div>
    );
  };

  const CellColor = (data) => {
    return (
      <>
        {data.relationshipid == 1316 ? (
          <div style={{ backgroundColor: "#d7ae09", padding: "0px" }}>
            {data.relationship_strength}
          </div>
        ) : data.relationshipid == 1315 ? (
          <div style={{ backgroundColor: "#e41b1b", padding: "0px" }}>
            {data.relationship_strength}
          </div>
        ) : data.relationshipid == 1317 ? (
          <div style={{ backgroundColor: "#3fb141", padding: "0px" }}>
            {data.relationship_strength}
          </div>
        ) : data.relationshipid == 1318 ? (
          <div style={{ backgroundColor: "#187fde", padding: "0px" }}>
            {data.relationship_strength}
          </div>
        ) : (
          ""
        )}
      </>
    );
  };

  const NameEdit = (data) => {
    const tooltipStyle = {
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis",
      maxWidth: "150px",
    };

    return (
      <div style={tooltipStyle} data-toggle="tooltip" title={data.name}>
        {data.name}
      </div>
    );
  };

  const titleEdit = (data) => {
    const tooltipStyle = {
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis",
      maxWidth: "150px",
    };

    return (
      <div style={tooltipStyle} data-toggle="tooltip" title={data.title}>
        {data.title}
      </div>
    );
  };

  const departmentEdit = (data) => {
    const tooltipStyle = {
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis",
      maxWidth: "150px",
    };

    return (
      <div style={tooltipStyle} data-toggle="tooltip" title={data.department}>
        {data.department}
      </div>
    );
  };

  const roleDescriptionEdit = (data) => {
    const tooltipStyle = {
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis",
      maxWidth: "150px",
    };

    return (
      <div
        style={tooltipStyle}
        data-toggle="tooltip"
        title={data.role_description}
      >
        {data.role_description}
      </div>
    );
  };

  const fyMandate = (data) => {
    const tooltipStyle = {
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis",
      maxWidth: "150px",
    };

    return (
      <div style={tooltipStyle} data-toggle="tooltip" title={data.fy_mandate}>
        {data.fy_mandate}
      </div>
    );
  };
  const SNo = (data) => {
    const tooltipStyle = {
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis",
      textAlign: "center",
    };

    return (
      <div style={tooltipStyle} data-toggle="tooltip" title={data.SNo}>
        {data.SNo}
      </div>
    );
  };

  const dynamicColumns = Object.keys(headerData)?.map((col, i) => {
    if (dataObject.is_write) {
      return (
        <Column
          sortable
          key={col}
          body={
            col === "Action"
              ? LinkTemplate
              : col === "relationship_strength"
              ? CellColor
              : col === "name"
              ? NameEdit
              : col === "title"
              ? titleEdit
              : col === "department"
              ? departmentEdit
              : col === "role_description"
              ? roleDescriptionEdit
              : col === "fy_mandate"
              ? fyMandate
              : col === "SNo" && SNo
          }
          field={col}
          header={headerData[col]}
        />
      );
    } else {
      if (
        col === "relationship_strength" ||
        col === "name" ||
        col === "title" ||
        col === "department" ||
        col === "role_description" ||
        col === "fy_mandate" ||
        (col === "SNo" && SNo)
      ) {
        return (
          <Column
            sortable
            key={col}
            body={
              col === "Action"
                ? LinkTemplate
                : col === "relationship_strength"
                ? CellColor
                : col === "name"
                ? NameEdit
                : col === "title"
                ? titleEdit
                : col === "department"
                ? departmentEdit
                : col === "role_description"
                ? roleDescriptionEdit
                : col === "fy_mandate"
                ? fyMandate
                : col === "SNo" && SNo
            }
            field={col}
            header={headerData[col]}
          />
        );
      } else {
        return null;
      }
    }
  });

  useEffect(() => {
    data[0] && setHeaderData(JSON.parse(JSON.stringify(data[0])));
  }, [data]);

  const deleteInitiative = () => {
    axios({
      method: "delete",
      url: baseUrl + `/customersms/deleteRelationHeatMap?id=${deleteid}`,
    }).then((error) => {
      getData();
      setDeletePopup(false);
      setDeleteMessage(true);
      setTimeout(() => {
        setDeleteMessage(false);
      }, 3000);
    });
  };

  function DeletePopup(props) {
    const { deletePopup, setDeletePopup, editId, deleteid } = props;
    return (
      <div>
        <CModal
          visible={deletePopup}
          size="m"
          className=" ui-dialog"
          onClose={() => setDeletePopup(false)}
        >
          <CModalHeader className="hgt22">
            <CModalTitle>
              <span className="ft16">Delete Relationship Heatmap</span>
            </CModalTitle>
          </CModalHeader>
          <CModalBody>
            <h7>Are you sure you want to delete Relationship Heatmap?</h7>
            &nbsp;
            <div className="btn-container center my-2">
              <button
                type="delete"
                className="btn btn-primary"
                onClick={() => {
                  deleteInitiative();
                }}
              >
                <AiFillDelete /> Delete
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => {
                  setDeletePopup(false);
                }}
              >
                <FaTimes /> Cancel
              </button>
            </div>
          </CModalBody>
        </CModal>
      </div>
    );
  }
  const getCustomer = () => {
    axios({
      method: "get",
      url: baseUrl + `/customersms/Customers/getProjectName?cid=${customerId}`,
    }).then(function (response) {
      var resp = response.data;
      setCustName(resp);
    });
  };
  useEffect(() => {
    getCustomer();
  }, []);

  const [routes, setRoutes] = useState([]);
  let textContent = "Customers";
  let currentScreenName = ["Monitoring", "Relationship Heatmap"];
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
        `/CommonMS/security/authorize?url=/customer/relationship/&userId=${loggedUserId}`,
    }).then((res) => {
      console.log(res, "urlResponse");
    });
  };
  return (
    <div>
      {deleteMessage ? (
        <div className="statusMsg success">
          <span className="errMsg">
            <BiCheck size="1.4em" strokeWidth={{ width: "100px" }} /> &nbsp;
            Relationship Heatmap Deleted Successfully
          </span>
        </div>
      ) : (
        ""
      )}
      {addmsg ? (
        <div className="statusMsg success">
          <span className="errMsg">
            <BiCheck size="1.4em" strokeWidth={{ width: "100px" }} /> &nbsp;
            Relationship Heatmap Saved Successfully
          </span>
        </div>
      ) : (
        ""
      )}
      {editmsg ? (
        <div className="statusMsg success">
          <span className="errMsg">
            <BiCheck size="1.4em" strokeWidth={{ width: "100px" }} /> &nbsp;
            Relationship Heatmap Updated Successfully
          </span>
        </div>
      ) : (
        ""
      )}
      <div className="col-md-12">
        <div className="pageTitle">
          <div className="childOne">
            {/* <h2>{custName[0]?.full_name}</h2> */}
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
            <h2>Relationship Heatmap</h2>
          </div>
          <div className="childThree"></div>
        </div>
      </div>

      <div className="group mb-3 customCard">
        <div className="row">
          <div className="col-md-11">
            <div className="legendContainer">
              <div className="legend red">
                <div className="legendCircle"></div>
                <div className="legendTxt">Negative</div>
              </div>
              <div className="legend amber">
                <div className="legendCircle"></div>
                <div className="legendTxt">Neutral</div>
              </div>
              <div className="legend green">
                <div className="legendCircle"></div>
                <div className="legendTxt">Advocate</div>
              </div>
              <div className="legend blue">
                <div className="legendCircle"></div>
                <div className="legendTxt">Champion</div>
              </div>
            </div>
          </div>

          {dataObject.is_write == true ? (
            <div className="col-md-1">
              <button
                onClick={() => {
                  setButtonPopup(true);
                  setType("add");
                }}
                className="btn btn-primary mt-2 mb-2"
              >
                <FaPlus />
                Add
              </button>
            </div>
          ) : (
            ""
          )}
        </div>
        <CellRendererPrimeReactDataTable
          data={data}
          linkColumns={linkColumns}
          linkColumnsRoutes={linkColumnsRoutes}
          dynamicColumns={dynamicColumns}
          headerData={headerData}
          setHeaderData={setHeaderData}
          rows={rows}
        />

        {buttonPopup ? (
          <RelationshipHeatmapPopUp
            handleChange={handleChange}
            formData={formData}
            setFormData={formData}
            editId={editId}
            setEditedData={setEditedData}
            editedData={editedData}
            type={type}
            getData={getData}
            data1={data1}
            setAddmsg={setAddmsg}
            setEditAddmsg={setEditAddmsg}
            customerId={customerId}
            data={data}
            buttonPopup={buttonPopup}
            setButtonPopup={setButtonPopup}
          />
        ) : (
          ""
        )}
      </div>

      {deletePopup ? (
        <DeletePopup
          editId={editId}
          deletePopup={deletePopup}
          setDeletePopup={setDeletePopup}
        />
      ) : (
        ""
      )}
      <br />
    </div>
  );
}
export default RelationshipHeatmap;
