import React, { useState, useEffect } from "react";
import axios from "axios";
import { CModal, CModalTitle } from "@coreui/react";
import { CModalBody } from "@coreui/react";
import { CModalHeader } from "@coreui/react";
import { environment } from "../../environments/environment";
import PlannedActivities from "./PlannedActivities";
import { AiOutlineLeftSquare, AiOutlineRightSquare } from "react-icons/ai";
import moment from "moment";
import Draggable from "react-draggable";
import { BiCheck } from "react-icons/bi";
import { AiFillEdit } from "react-icons/ai";
import { DataTable } from "primereact/datatable";
import { Column } from "ag-grid-community";
import { MdOutlineAdd } from "react-icons/md";
import { TfiSave } from "react-icons/tfi";
import { ImCross } from "react-icons/im";
import { AiFillDelete } from "react-icons/ai";
import { AiFillWarning } from "react-icons/ai";
import { FaPlus, FaSave } from "react-icons/fa";
function ProjectAccomplishments(props) {
  const {
    projectId,
    grp4Items,
    urlState,
    setUrlState,
    grp1Items,
    grp2Items,
    btnState,
    setbtnState,
    grp3Items,
    grp6Items,
  } = props;
  console.log(grp4Items[1].is_write);
  const dataObject = grp4Items.find(
    (item) => item.display_name === "Accomplishments"
  );

  const loggedUserId = localStorage.getItem("resId");
  const [category, setCategory] = useState([]);
  const [accomplishment, setAccomplishment] = useState("");
  const [buttonPopup, setButtonPopup] = useState(false);
  const [uid, setUid] = useState(0);
  const [updateMessage, setUpdateMessage] = useState(false);
  const [addMessage, setAddMessage] = useState(false);
  const [prjName, setPrjName] = useState([]);
  const [message, setMessage] = useState(false);
  const [plannedAddMessage, setPlannedAddMessage] = useState(false);
  const [clicked, setClicked] = useState(false);
  const [saveCliked, setSaveClicked] = useState(true);
  const [cancelClicked, setCancelClicked] = useState(true);
  const [inputValue, setInputValue] = useState("");
  const [editEnabled, setEditEnabled] = useState(false);
  const [valid, setvalid] = useState(false);
  const [validation, setValidation] = useState(false);
  const [actiondisable, setActiondisable] = useState(false);
  ///////////////////Add and Subtract Dates in top of the Table////////////////////////

  const dates = {
    fromDate: moment().startOf("week").add("days", 1).format("YYYY-MM-DD"),
    toDate: moment().startOf("week").add("days", 7).format("YYYY-MM-DD"),
  };
  const [dt, setDt] = useState(dates);

  const addHandler = () => {
    setDt((prev) => ({
      ...prev,
      ["fromDate"]: moment(dt.fromDate).add("days", 7).format("YYYY-MM-DD"),
    }));

    setDt((prev) => ({
      ...prev,
      ["toDate"]: moment(dt.toDate).add("days", 7).format("YYYY-MM-DD"),
    }));
    setCancelClicked(true);
    setSaveClicked(true);
    setClicked(false);
  };

  const subtracHandler = () => {
    setDt((prev) => ({
      ...prev,
      ["fromDate"]: moment(dt.fromDate)
        .subtract("days", 7)
        .format("YYYY-MM-DD"),
    }));

    setDt((prev) => ({
      ...prev,
      ["toDate"]: moment(dt.toDate).subtract("days", 7).format("YYYY-MM-DD"),
    }));
    setCancelClicked(true);
    setSaveClicked(true);
    setClicked(false);
  };

  //// -------breadcrumbs-----

  const [routes, setRoutes] = useState([]);
  let textContent = "Delivery";
  let currentScreenName = [
    "Projects",
    "Open",
    "Monitoring",
    "Accomplishments and Planned Activities",
  ];
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
      const deliveryItem = data[7]; // Assuming "Delivery" item is at index 7

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
     //  setData2(sortedSubMenus);
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
        `/CommonMS/security/authorize?url=/ProjectAccomplishment/createPrjAccomplishment/&userId=${loggedUserId}`,
    }).then((res) => {
      console.log(res, "urlResponse");
    });
  };
  //////axios for getting the details in to the table////////

  const baseUrl = environment.baseUrl;
  const getAccomplishmentData = () => {
    axios({
      url:
        baseUrl +
        `/ProjectMS/Accomplishments/getProjectDateAccomplishments?fromDate=${dt.fromDate}&toDate=${dt.toDate}&pid=${projectId}`,
    }).then((res) => {
      setCategory(res.data);
    });
  };
  useEffect(() => {
    getAccomplishmentData();
  }, [dt]);

  //////axios for saving the details in to the table////////

  const handleSave = () => {
    if (accomplishment === "") {
      setvalid(true);

      setCancelClicked(true);
      setSaveClicked(true);
      setClicked(false);
    } else {
      setCancelClicked(false);
      setSaveClicked(false);
      setClicked(true);
      let data;
      if (category.find((item) => item.id === inputValue)) {
        data = {
          id: inputValue,
          projectId: projectId,
          accomplishment: accomplishment,
          createdDate: moment(dt.fromDate).format("YYYY-MM-DD"),
        };
      } else {
        data = {
          projectId: projectId,
          accomplishment: accomplishment,
          createdDate: moment(dt.fromDate).format("YYYY-MM-DD"),
        };
      }
      axios({
        method: "post",
        url: baseUrl + `/ProjectMS/Accomplishments/postAccomplishmentsDetails`,
        data: data,
      }).then((error) => {
        getAccomplishmentData();
        setAddMessage(true);
        setClicked(false);
        setSaveClicked(true);
        setCancelClicked(true);
        setvalid(false);
        setTimeout(() => {
          setAddMessage(false);
        }, 3000);
        setAccomplishment("");
      });
      setEditEnabled(false);
    }
  };

  //////axios for deleting the details from the table////////

  const accomplishmentDelete = () => {
    axios({
      method: "delete",
      url:
        baseUrl +
        `/ProjectMS/Accomplishments/deleteAccomplishmentsDetails?id=${uid}`,
      data: uid,
    }).then((error) => {
      setUid(0);
      getAccomplishmentData();
      setButtonPopup(false);
      setUpdateMessage(true);
      setTimeout(() => {
        setUpdateMessage(false);
      }, 3000);
    });
  };
  /////////----------Axios for projectName------------///////////////
  const getProjectOverviewData = () => {
    axios({
      method: "get",
      url:
        baseUrl +
        `/ProjectMS/Audit/projectOverviewDetails?projectId=${projectId}`,
    })
      .then(function (response) {
        let resp = response.data;
        setPrjName(resp);
      })
      .catch(function (response) {});
  };

  useEffect(() => {
    getProjectOverviewData();
  }, []);

  ////////////////Delete PopUp///////////////////////////////
  function AccomplishmentsDelete(props) {
    const { accomplishmentDelete, buttonPopup, setButtonPopup } = props;
    return (
      <div>
        <Draggable>
          <CModal
            alignment="center"
            backdrop="static"
            size="default"
            visible={buttonPopup}
            className="ui-dialog"
            onClose={() => setButtonPopup(false)}
          >
            <CModalHeader style={{ cursor: "all-scroll" }}>
              <CModalTitle>
                <span className="">Delete Accomplishments</span>
              </CModalTitle>
            </CModalHeader>
            <CModalBody>
              <h6>Are you sure to delete Accomplishments ?</h6>
              <div className="btn-container center my-2">
                <button
                  type="button"
                  title="Delete"
                  className="btn btn-primary"
                  onClick={() => {
                    accomplishmentDelete();
                  }}
                >
                  <TfiSave />
                  Delete
                </button>

                <button
                  type="button"
                  title="Cancel"
                  className="btn btn-primary"
                  onClick={() => {
                    setButtonPopup(false);
                  }}
                >
                  <ImCross />
                  Cancel
                </button>
              </div>
            </CModalBody>
          </CModal>
        </Draggable>
      </div>
    );
  }

  /////////////////Functions OF Data Table////////////////////
  const renderRowActions = (rowData) => {
    return (
      <div style={{ paddingLeft: "40px" }}>
        {grp4Items[1].is_write == true ? (
          <label cursor="pointer">
            <AiFillEdit
              title="Edit"
              style={{
                backgroundColor: actiondisable ? "#eee" : "",
                cursor: actiondisable ? "not-allowed" : "pointer",
                opacity: actiondisable ? ".7" : "",
              }}
              disabled={actiondisable}
              className="mr-1"
              color="orange"
              onClick={() => {
                setSaveClicked(false);
                setCancelClicked(false);
                setClicked(true);
                accomplishmentstextfiled();
                setEditEnabled(true);
                setInputValue(rowData.id);
              }}
            />
            &nbsp;
            <AiFillDelete
              title="Delete"
              style={{
                backgroundColor: actiondisable ? "#eee" : "",
                cursor: actiondisable ? "not-allowed" : "pointer",
                opacity: actiondisable ? ".7" : "",
              }}
              color="orange"
              onClick={() => {
                setButtonPopup(true);
                setUid(rowData.id);
              }}
            />
          </label>
        ) : (
          ""
        )}
      </div>
    );
  };

  const accomplishmentstextfiled = (category, rowData) => {
    const handleChange = (e) => {
      setAccomplishment(e.target.value);
      setClicked(true);
    };
    const handleKeyDown = (event) => {
      if (event.keyCode === 32) {
        // Check if the key pressed is the space key
        const value = event.target.value;
        const selectionStart = event.target.selectionStart;

        // Prevent space if it's at the beginning of the input
        if (selectionStart === 0) {
          event.preventDefault();
          return;
        }

        // Allow the space if it follows a non-space character
        if (value[selectionStart - 1] !== " ") {
          return;
        }

        event.preventDefault(); // Prevent the space from being entered
      }
    };

    return (
      <>
        {category?.id === inputValue && editEnabled === true ? (
          <input
            className={valid === true ? "error-block ellipsis" : "ellipsis"}
            type="text"
            id="accomplishment"
            name="accomplishment"
            title={category.accomplishment}
            defaultValue={category?.accomplishment}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
          />
        ) : (
          category?.accomplishment !== "" && (
            <p className="ellipsis" title={category?.accomplishment}>
              {category?.accomplishment}
            </p>
          )
        )}
        {category?.accomplishment === "" && (
          <input
            className={`error ${
              valid && !category?.rowData?.accomplishment
                ? "error-block ellipsis"
                : "ellipsis"
            }`}
            type="text"
            id="accomplishment"
            name="accomplishment"
            title={category.accomplishment}
            value={category.rowData?.accomplishment}
            onChange={(e) => setAccomplishment(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        )}
      </>
    );
  };

  useEffect(() => {
    if (category[0]?.accomplishment == "") {
      document.getElementsByClassName("p-row-editor-init p-link")[0]?.click();
      setTimeout(() => {
        document
          .getElementsByClassName("p-row-editor-cancel p-link")[0]
          ?.addEventListener(
            "click",
            function (e) {
              if (category[0]?.accomplishment == "") {
                setAccomplishment(category.slice(2, category.length));
                setvalid(false);
              }
            },
            true
          );
      }, 200);
    }
  }, [category]);

  const addRow = () => {
    let daa = document.getElementsByClassName(
      "p-paginator-first p-paginator-element p-link"
    )[0];

    daa.click();
    const data = {
      accomplishment: "",
      Actions: "",
    };
    let dt = [];
    dt.push(data);
    setCategory([...dt, ...category]);
    if (valid === true) {
      setCancelClicked(true);
      setSaveClicked(true);
      setClicked(false);
    } else {
      setCancelClicked(false);
      setSaveClicked(false);
      setClicked(true);
    }
  };

  const Reset = () => {
    document.getElementsByClassName("p-row-editor-cancel p-link")[0]?.click();
    getAccomplishmentData();
    setEditEnabled(false);
    setClicked(false);
    setCancelClicked(true);
    setSaveClicked(true);
    setvalid(false);
    setActiondisable(false);
  };

  const Save = () => {
    document
      .getElementsByClassName("p-row-editor-save-icon pi pi-fw pi-check")[0]
      ?.click();
    handleSave();
    if (valid === true) {
      setCancelClicked(true);
      setSaveClicked(true);
      setClicked(false);
    } else {
      setCancelClicked(false);
      setSaveClicked(false);
      setClicked(true);
    }
  };
  const onRowEditComplete = (e) => {
    let _category = [category];
    let { newData, index } = e;
    _category[index] = newData;
    setCategory(_category);
    postData(e.newData);
    setClicked(true);
  };

  return (
    <div>
      {prjName.map((list) => (
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
            {/* <h2>
              {list.projectName}({list.projectCode})
            </h2> */}
          </div>
          <div className="childTwo">
            <h2>Accomplishments and Planned Activities</h2>
          </div>
          <div className="childThree"></div>
        </div>
      ))}

      <div className="customCard">
        {updateMessage ? (
          <div className="statusMsg success">
            <BiCheck />
            {"Accomplishment Deleted Successfully"}
          </div>
        ) : (
          ""
        )}
        {addMessage ? (
          <div className="statusMsg success">
            <BiCheck />
            {"Accomplishment saved successfully."}
          </div>
        ) : (
          ""
        )}
        {message ? (
          <div className="statusMsg success">
            <BiCheck />
            {"Planned Activity Deleted successfully"}
          </div>
        ) : (
          ""
        )}
        {plannedAddMessage ? (
          <div className="statusMsg success">
            <BiCheck />
            {"Planned Activity saved successfully."}
          </div>
        ) : (
          ""
        )}
        {valid ? (
          <div className="statusMsg error">
            <AiFillWarning /> {"Please Enter the highlighted field"}
          </div>
        ) : (
          " "
        )}
        {validation ? (
          <div className="statusMsg error">
            <AiFillWarning /> {"Please Enter the highlighted field"}
          </div>
        ) : (
          " "
        )}
        <div className="row mt-2">
          <div className="col-md-6">
            <div>
              <span style={{ fontWeight: "600" }}>
                {moment(dt.fromDate).format("DD-MMM-YYYY")} to &nbsp;
                {moment(dt.toDate).format("DD-MMM-YYYY")}
              </span>
              <span className="float-end">
                <AiOutlineLeftSquare
                  cursor="pointer"
                  size={"2em"}
                  onClick={subtracHandler}
                ></AiOutlineLeftSquare>
                <AiOutlineRightSquare
                  cursor="pointer"
                  size={"2em"}
                  onClick={addHandler}
                ></AiOutlineRightSquare>
              </span>
            </div>
            <br />

            <div div className="darkHeader">
              <DataTable
                value={category}
                editMode="row"
                showGridlines
                emptyMessage="No Records To View"
                scrollDirection="both"
                paginator
                stripedRows
                rows={25}
                onRowEditComplete={onRowEditComplete}
                className="primeReactDataTable "
                paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
                currentPageReportTemplate="{first} to {last} of {totalRecords}"
                rowsPerPageOptions={[10, 25, 50]} // //------------->
              >
                <Column
                  body={accomplishmentstextfiled}
                  field="accomplishment"
                  header="Accomplishments"
                  title={accomplishment}
                  editor={(options) => accomplishmentstextfiled(options)}
                  sortable
                />
                {grp4Items[1].is_write == true && (
                  <Column
                    body={renderRowActions}
                    header="Action"
                    bodyStyle={{ textAlign: "align center" }}
                    sortable
                    style={{ width: " 135px" }}
                  ></Column>
                )}
              </DataTable>
              {dataObject?.is_write == true ? (
                <div className="form-group col-md-2 btn-container-events center my-3">
                  <button
                    className="btn btn-primary"
                    disabled={clicked}
                    onClick={() => {
                      addRow();
                      setActiondisable(true);
                    }}
                    variant="contained"
                  >
                    <FaPlus /> Add
                  </button>
                  <button
                    className="btn btn-primary"
                    disabled={saveCliked}
                    variant="contained"
                    onClick={() => {
                      Save();
                      if (valid == true) {
                        setClicked(true);
                        setCancelClicked(false);
                        setSaveClicked(false);
                      }
                      setActiondisable(false);
                    }}
                  >
                    <FaSave /> Save
                  </button>
                  <button
                    className="btn btn-primary"
                    disabled={cancelClicked}
                    onClick={() => {
                      Reset();
                      setClicked(false);
                      setAccomplishment("");
                    }}
                    variant="contained"
                  >
                    <ImCross fontSize={"11px"} /> Cancel
                  </button>
                </div>
              ) : (
                ""
              )}
            </div>

            {buttonPopup ? (
              <AccomplishmentsDelete
                accomplishmentDelete={accomplishmentDelete}
                buttonPopup={buttonPopup}
                setButtonPopup={setButtonPopup}
              />
            ) : (
              ""
            )}
          </div>

          <div className="col-md-6">
            <PlannedActivities
              setMessage={setMessage}
              setPlannedAddMessage={setPlannedAddMessage}
              projectId={projectId}
              validation={validation}
              setValidation={setValidation}
              grp4Items={grp4Items}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
export default ProjectAccomplishments;
