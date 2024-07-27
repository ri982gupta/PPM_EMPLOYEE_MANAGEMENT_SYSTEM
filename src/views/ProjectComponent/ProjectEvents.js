import React, { useEffect, useRef, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import axios from "axios";
import { environment } from "../../environments/environment";
import moment from "moment";
import { AiFillWarning } from "react-icons/ai";
import { BiCheck } from "react-icons/bi";
import DatePicker from "react-datepicker";
import Loader from "../Loader/Loader";
import "./ProjectEvents.scss";
import { ImCross } from "react-icons/im";
import { FilterMatchMode } from "primereact/api";
import { InputTextarea } from "primereact/inputtextarea";
import { FaPlus, FaSave } from "react-icons/fa";

function projectEvents(props) {
  const {
    projectId,
    grp4Items,
    urlState,
    btnState,
    setbtnState,
    setUrlState,
    grp1Items,
    grp2Items,
    grp3Items,
    grp6Items,
  } = props;
  const dataObject = grp4Items.find((item) => item.display_name === "Events");
  const loggedUserId = localStorage.getItem("resId");
  const [products, setProducts] = useState([]);
  const [projectName, setProjectName] = useState([]);
  const [addMessage, setAddMessage] = useState(false);
  const [StartDt, setStartDt] = useState(null);
  const [rowId, setRowId] = useState([]);
  const [validateproject, setValidateproject] = useState(false);
  const [loader, setLoader] = useState(false);
  const [buttonDisabled, setButtonDisabled] = useState(true);
  const [valid, setValid] = useState(false);
  const baseUrl = environment.baseUrl;
  const abortController = useRef(null);
  const componentRef = useRef(null);

  const [lazyState, setLazyState] = useState({
    filters: {
      global: { value: null, matchMode: FilterMatchMode.CONTAINS },
      event_name: { value: null, matchMode: FilterMatchMode.CONTAINS },
      event_date: { value: null, matchMode: FilterMatchMode.CONTAINS },
      comments: { value: null, matchMode: FilterMatchMode.CONTAINS },
    },
  });
  const initialValue = {
    project_id: projectId,
    event_name: "",
    event_date: "",
    comments: "",
  };
  const [formData, setFormData] = useState(initialValue);

  // breadcrumbs --

  const [routes, setRoutes] = useState([]);
  let textContent = "Delivery";
  let currentScreenName = ["Projects", "Monitoring", "Events"];
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
      console.log(sortedSubMenus);
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
        `/CommonMS/security/authorize?url=/projectEvent/list/&userId=${loggedUserId}`,
    }).then((res) => {
      console.log(res, "urlResponse");
    });
  };

  let sideArrow = document.getElementsByClassName(
    "p-paginator-next p-paginator-element p-link"
  );
  let sideDoubleArrow = document.getElementsByClassName(
    "p-paginator-last p-paginator-element p-link"
  );

  useEffect(() => {}, [formData]);
  const onRowEditComplete = (e) => {
    let _products = [...products];
    let { newData, index } = e;
    _products[index] = newData;
    setProducts(_products);
    handleAddClick(e.newData);
  };

  const renderSNo = (rowData, column) => {
    const index = products.indexOf(rowData);
    const sNo = index + 1;
    return <span>{sNo}</span>;
  };

  const removeFirstRowIfEmpty = (prod) => {
    Object.keys(prod).forEach((d) => {
      if (["", null, undefined, " "].includes(prod[d])) {
        setProducts(products.slice(1));
        setValid((prev) => !prev);
        return;
      }
    });
  };

  useEffect(() => {
    let prod = products[0];
    sideArrow[0]?.addEventListener("click", function () {
      removeFirstRowIfEmpty(prod);
    });

    sideDoubleArrow[0]?.addEventListener("click", function () {
      removeFirstRowIfEmpty(prod);
    });

    if (products[0]?.event_name == "") {
      const icon = document.getElementsByClassName(
        "p-row-editor-init p-link"
      )[0];
      icon.setAttribute("title", "Edit selected row");
      icon.click();
      setTimeout(() => {
        const saveIcon = document.getElementsByClassName(
          "p-row-editor-save p-link"
        )[0];
        saveIcon.setAttribute("title", "Save row");
        const cancelIcon = document.getElementsByClassName(
          "p-row-editor-cancel p-link"
        )[0];
        cancelIcon.setAttribute("title", "Cancel row editing");
        cancelIcon?.addEventListener(
          "click",
          function (e) {
            if (products[0]?.event_name == "") {
              setProducts(products.slice(1, products.length));
              setButtonDisabled(true);
              setValidateproject(false);
              setValid(false);
              componentRef.current.forceUpdate();
            }
          },
          true
        );
      }, 200);
    }
  }, [products]);

  const Save = () => {
    document
      .getElementsByClassName("p-row-editor-save-icon pi pi-fw pi-check")[0]
      ?.click();
  };

  const Reset = () => {
    document.getElementsByClassName("p-row-editor-cancel p-link")[0]?.click();
    setValidateproject(false);
  };

  const textEditorEventName = (products) => {
    setRowId(products.rowData.id);
    return (
      <>
        <input
          className={`error ${
            validateproject && !products.rowData.event_name ? "error-block" : ""
          }`}
          id="event_name"
          type="text"
          value={products.rowData.event_name}
          onChange={(e) => {
            products.editorCallback(e.target.value);
          }}
        />
      </>
    );
  };

  const statusbodyEvents = (rowData) => {
    return (
      <>
        <input
          className="ellipsis"
          id="event_name"
          title={rowData.event_name}
          value={rowData.event_name}
          type="text"
          autoComplete="off"
          required
          disabled
        />
      </>
    );
  };

  const textEditorComments = (products) => {
    return (
      <>
        <InputTextarea
          id="comments"
          value={products.rowData.comments}
          onChange={(e) => products.editorCallback(e.target.value)}
          rows={4}
          cols={20}
        />
      </>
    );
  };

  const statusbodyComments = (rowData) => {
    return (
      <>
        <input
          className="ellipsis"
          id="comments"
          title={rowData.comments}
          value={rowData.comments}
          type="text"
          autoComplete="off"
          required
          disabled
        />
      </>
    );
  };

  const textEditorDate = (products) => {
    const today = new Date();

    return (
      <DatePicker
        className={`error ${
          validateproject && !products.rowData.event_date ? "error-block" : ""
        }`}
        name="event_date"
        id="event_date"
        selected={StartDt}
        showMonthDropdown
        showYearDropdown
        dropdownMode="select"
        value={products.rowData.event_date}
        dateFormat="dd-MMM-yyyy"
        onChange={(e) => {
          const selectedDate = moment(e).format("DD-MMM-yyyy");
          products.editorCallback(selectedDate);
          setFormData((prev) => ({
            ...prev,
            ["event_date"]: moment(e).format("yyyy-MM-DD"),
          }));
        }}
        onKeyDown={(e) => {
          e.preventDefault();
        }}
        maxDate={today}
      />
    );
  };

  const statusbodyDate = (rowData) => {
    return (
      <>
        <input
          id="event_date"
          title={rowData.event_date}
          value={rowData.event_date}
          type="text"
          autoComplete="off"
          required
          disabled
        />
      </>
    );
  };

  const getProjectName = () => {
    axios({
      method: "get",
      url: baseUrl + `/ProjectMS/Audit/getProjectName?projectId=${projectId}`,
    }).then(function (response) {
      let resp = response.data;
      setProjectName(resp);
    });
  };

  const getData = () => {
    setLoader(false);
    abortController.current = new AbortController();
    axios({
      url:
        baseUrl + `/ProjectMS/ProjectEvents/getProjectEvents?pid=${projectId}`,
      signal: abortController.current.signal,
    }).then((resp) => {
      let GetData = resp.data;
      for (const item of GetData) {
        item["event_date"] =
          item["event_date"] == null
            ? ""
            : moment(item["event_date"]).format("DD-MMM-YYYY");
      }

      setProducts(() => GetData);
      setLoader(false);
      setTimeout(() => {
        setLoader(false);
      }, 1000);
    });
  };
  /////////////////----------------Permission----------//////////////////////

  const handleAbort = () => {
    abortController.current && abortController.current.abort();
    setLoader(false);
  };

  const handleAddClick = (rowData) => {
    if (rowData.event_name.trim() === "" || rowData.event_date.trim() === "") {
      setValidateproject(true);
    } else {
      const DueDate = moment(rowData.event_date).format("yyyy-MM-DD");
      axios({
        method: "post",
        url: baseUrl + `/ProjectMS/ProjectEvents/postProjectEvents`,
        data: {
          id: rowData.id,
          projectId: projectId,
          eventName: rowData.event_name,
          eventDate: DueDate,
          comments: rowData.comments,
        },
      }).then(() => {
        getData();
        setValidateproject(false);
        setAddMessage(true);
        setTimeout(() => {
          setAddMessage(false);
        }, 1000);
      });
      setButtonDisabled(true);
      setValid(false);
    }
  };

  const addHandler = () => {
    let daa = document.getElementsByClassName(
      "p-paginator-first p-paginator-element p-link"
    )[0];

    daa.click();

    if (!valid) {
      setValid(true);
      setButtonDisabled(false);
    }
    const data = {
      event_name: "",
      event_date: "",
      comments: "",
    };
    let dt = [];
    dt.push(data);
    setProducts([...dt, ...products]);
  };

  useEffect(() => {
    getData();
    getProjectName();
  }, []);

  return (
    <>
      {validateproject ? (
        <div className="statusMsg error">
          <span>
            <AiFillWarning />
            &nbsp;
            {"Please provide valid values for highlighted values"}
          </span>
        </div>
      ) : (
        ""
      )}
      {addMessage ? (
        <div className="statusMsg success">
          <BiCheck />
          {"Event saved successfully."}
        </div>
      ) : (
        ""
      )}

      <div className="col-md-12 mb-4 ">
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
            <h2>Events</h2>
          </div>
          <div className="childThree"></div>
        </div>
      </div>

      <div className=" p-fluid darkHeader mb-2">
        <DataTable
          className="primeReactDataTable eventsTable " ////customerEngament
          value={products}
          editMode="row"
          rows={25}
          showGridlines
          paginator
          rowHover
          filters={lazyState.filters}
          onRowEditComplete={onRowEditComplete}
          tableStyle={{ minWidth: "auto", width: "auto" }}
          filterDisplay="row"
          globalFilterFields={["event_name", "event_date", "comments"]}
          currentPageReportTemplate="View {first} - {last} of {totalRecords} "
          paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
          rowsPerPageOptions={[10, 25, 50]}
          paginationComponentOptions={{
            rowsPerPageText: "Records per page:",
            rangeSeparatorText: "out of",
          }}
        >
          <Column
            field="sNo"
            header="S.No"
            body={renderSNo}
            headerStyle={{ width: "50px", backgroundColor: "#eeecec" }}
            bodyStyle={{ textAlign: "center" }}
          />
          <Column
            field="event_name"
            header={
              <span>
                Event <span className="error-text">*</span>
              </span>
            }
            sortable
            style={{ minWidth: "300px" }}
            body={statusbodyEvents}
            editor={(options) => textEditorEventName(options)}
            filter
            filterMatchMode="contains"
          ></Column>

          <Column
            field="event_date"
            header={
              <span>
                Date <span className="error-text">*</span>
              </span>
            }
            sortable
            style={{ minWidth: "200px", textAlign: "center" }}
            body={statusbodyDate}
            editor={(options) => textEditorDate(options)}
            filter
            filterMatchMode="contains"
          />

          <Column
            field="comments"
            header="Comments"
            sortable
            style={{ minWidth: "400px" }}
            body={statusbodyComments}
            editor={(options) => textEditorComments(options)}
            filter
            filterMatchMode="notEquals"
          ></Column>
          {/* {grp4Items[8].is_write == true && (
            <Column
              field="Actions"
              header="Actions"
              rowEditor
              headerStyle={{ width: "100px", backgroundColor: "#eeecec" }}
              bodyStyle={{ textAlign: "center" }}
            ></Column>
          )} */}
          {grp4Items[2].is_write == true && (
            <Column
              rowEditor={() => {
                return <div>{"Edit"}</div>;
              }}
              header="Action"
              bodyStyle={{ textAlign: "center" }}
              style={{ width: "40px" }}
              title="Edit selected item"
            />
          )}
        </DataTable>
      </div>
      {dataObject?.is_write == true ? (
        <div className="d-flex justify-content-center gap-2 btn-container-events  my-3">
          <button
            className="btn btn-primary"
            disabled={valid}
            title={"Add new row"}
            onClick={addHandler}
          >
            <FaPlus /> Add
          </button>
          <button
            className="btn btn-primary"
            disabled={buttonDisabled}
            title={"Save row"}
            onClick={() => {
              Save();
            }}
          >
            <FaSave />
            Save
          </button>
          <button
            className="btn btn-secondary"
            disabled={buttonDisabled}
            title={"Cancel row editing"}
            onClick={() => {
              Reset();
            }}
          >
            <ImCross fontSize={"11px"} /> Cancel
          </button>
        </div>
      ) : (
        ""
      )}
      {loader ? <Loader handleAbort={handleAbort} /> : ""}
    </>
  );
}
export default projectEvents;
