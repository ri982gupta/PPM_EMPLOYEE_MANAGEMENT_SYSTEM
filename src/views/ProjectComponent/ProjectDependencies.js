import React, { useEffect, useState } from "react";
import axios from "axios";
import { DataTable } from "primereact/datatable";
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";
import { environment } from "../../environments/environment";
import { Column } from "primereact/column";
import { ReactSearchAutocomplete } from "react-search-autocomplete";
import moment from "moment";
import { AiFillWarning } from "react-icons/ai";
import { ImCross } from "react-icons/im";
import { BiCheck } from "react-icons/bi";
import { InputTextarea } from "primereact/inputtextarea";
import { FaPlus, FaSave } from "react-icons/fa";
import useDynamicMaxHeight from "../PrimeReactTableComponent/useDynamicMaxHeight";
import "./ProjectDependencies.scss";
function ProjectDependencies(props) {
  const {
    projectId,
    grp4Items,
    urlState,
    grp1Items,
    grp2Items,
    grp3Items,
    grp6Items,
    btnState,
    setbtnState,
    setUrlState,
  } = props;
  const dataObject = grp4Items.find(
    (item) => item.display_name === "Dependencies"
  );

  const baseUrl = environment.baseUrl;
  const [products, setProducts] = useState([]);
  const [resource, setResource] = useState([]);
  const [RaisedBy, setRaisedBy] = useState([]);
  const [raisedDate, setRaisedDate] = useState();
  const [targetDate, setTargetDate] = useState();
  const [AssingedTo, setAssingedTo] = useState("");
  const [rowId, setRowId] = useState([]);
  const [prjName, setPrjName] = useState([]);
  const [projectData, setProjectData] = useState([]);

  const [status, setStatus] = useState([]);
  const [priority, setPriority] = useState([]);
  const [type, setType] = useState([]);
  const [buttonDisabled, setButtonDisabled] = useState(true);
  const [valid, setValid] = useState(false);
  const [validateproject, setValidateproject] = useState(false);
  const [addMessage, setAddMessage] = useState(false);
  const [editmsg, setEditAddmsg] = useState(false);

  const loggedUserId = localStorage.getItem("resId");
  const initialValue1 = {
    id: "",
    dependency_name: "",
    Type: "",
    Priority: "",
    RaisedBy: "",
    raised_date: "",
    target_date: "",
    AssingedTo: "",
    phase_affected: "",
    Status: "",
  };
  const [formEditData, setFormEditData] = useState(initialValue1);
  const [routes, setRoutes] = useState([]);
  let textContent = "Delivery";
  let currentScreenName = ["Projects", "Monitoring", "Dependencies"];
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
        `/CommonMS/security/authorize?url=/projectDependency/list/&userId=${loggedUserId}`,
    }).then((res) => {
      console.log(res, "urlResponse");
    });
  };

  // ---------------------dropDownApi's---------------------

  const getStatus = () => {
    axios
      .get(baseUrl + `/ProjectMS/getAllStatus`)

      .then((Response) => {
        let status = [];
        let data = Response.data;
        data.length > 0 &&
          data.forEach((e) => {
            let StatusObj = {
              label: e.lkup_name,
              value: e.id,
            };
            status.push(StatusObj);
          });
        setStatus(data);
      })
      .catch((error) => console.log(error));
  };

  const getPriority = () => {
    axios
      .get(baseUrl + `/ProjectMS/getAllPriority`)

      .then((Response) => {
        let priority = [];
        let data = Response.data;
        data.length > 0 &&
          data.forEach((e) => {
            let PriorityObj = {
              label: e.lkup_name,
              value: e.id,
            };
            priority.push(PriorityObj);
          });
        setPriority(data);
      })
      .catch((error) => console.log(error));
  };

  const getType = () => {
    axios
      .get(baseUrl + `/ProjectMS/getAllType`)

      .then((Response) => {
        let type = [];
        let data = Response.data;
        data.length > 0 &&
          data.forEach((e) => {
            let TypeObj = {
              label: e.lkup_name,
              value: e.id,
            };
            type.push(TypeObj);
          });
        setType(data);
      })
      .catch((error) => console.log(error));
  };

  // -------------------api for autocomplete
  const resourceFnc = async () => {
    await axios({
      method: "get",
      url: baseUrl + `/ProjectMS/risks/getAssignedData`,
    })
      .then((res) => {
        let manger = res.data;
        setResource(manger);
      })
      .catch((error) => {
        console.log("error :" + error);
      });
  };
  useEffect(() => {
    resourceFnc();
    getStatus();
    getPriority();
    getType();
  }, []);

  // ========================================Get API for displaying Data===========================================

  const getData = () => {
    axios({
      url: baseUrl + `/ProjectMS/getDependencyData?projectId=${projectId}`,
    }).then((resp) => {
      let GetData = resp.data;
      for (let i = 0; i < GetData.length; i++) {
        GetData[i]["raised_date"] =
          GetData[i]["raised_date"] == null
            ? ""
            : moment(GetData[i]["raised_date"]).format("DD-MMM-YYYY");
        GetData[i]["target_date"] =
          GetData[i]["target_date"] == null
            ? ""
            : moment(GetData[i]["target_date"]).format("DD-MMM-YYYY");
      }
      setProducts(() => GetData);
    });
  };
  useEffect(() => {
    getData();
  }, []);

  const materialTableElement = document.getElementsByClassName("childOne");

  const maxHeight1 =
    useDynamicMaxHeight(materialTableElement, "fixedcreate") - 46;
  document.documentElement.style.setProperty(
    "--dynamic-value",
    String(maxHeight1 - 79) + "px"
  );
  // ==================================================================================================================

  const onRowEditComplete = (e) => {
    let _products = [...products];
    let { newData, index } = e;
    _products[index] = newData;
    setProducts(_products);
    postData(e.newData);
  };

  // ========================================POST API for PUT,POST===========================================
  let raisedby = moment(new Date()).format("YYYY-MM-DD");
  const postData = (rowData) => {
    rowData["AssingedTo"] =
      AssingedTo.name == undefined ? rowData["AssingedTo"] : AssingedTo.name;
    rowData["assigned_to_id"] =
      AssingedTo.id == undefined ? rowData["assigned_to_id"] : AssingedTo.id;

    rowData["RaisedBy"] =
      RaisedBy.name == undefined ? rowData["RaisedBy"] : RaisedBy.name;
    rowData["raised_by_id"] =
      RaisedBy.id == undefined ? rowData["raised_by_id"] : RaisedBy.id;

    if (
      rowData.dependency_name == "" ||
      rowData.Type == "" ||
      rowData.Priority == ""
    ) {
      setValidateproject(true);
    } else {
      axios({
        method: "post",
        url: baseUrl + `/ProjectMS/postDependencyData`,

        data: {
          id: rowData.id,
          projectId: projectId,
          isActive: 1,
          dependencyName: rowData.dependency_name,
          typeId: rowData.type_id,
          priorityId: rowData.priority_id,
          createdById: loggedUserId,
          createdByIdEdit: rowData.created_by_id,
          dateCreated: rowData.date_created,
          raisedById:
            rowData.raised_by_id == undefined ||
            rowData.raised_by_id == "" ||
            rowData.raised_by_id == null
              ? parseInt(loggedUserId) + parseInt(1)
              : rowData.raised_by_id,
          raisedDate:
            rowData.raised_date == undefined ||
            rowData.raised_date == "" ||
            rowData.raised_date == null
              ? raisedby
              : moment(rowData.raised_date).format("YYYY-MM-DD"),
          targetDate:
            rowData.target_date == undefined || rowData.target_date == ""
              ? ""
              : moment(rowData.target_date).format("YYYY-MM-DD"),
          assignedToId:
            rowData.assigned_to_id == undefined || rowData.assigned_to_id == ""
              ? ""
              : rowData.assigned_to_id,
          phaseAffected: rowData.phase_affected,
          statusId: rowData.status_id == null ? 576 : rowData.status_id,
        },
      }).then((response) => {
        response.data.status == "Saved Successfully"
          ? setAddMessage(true)
          : setEditAddmsg(true);
        getData();
        setValidateproject(false);
        setTimeout(() => {
          setAddMessage(false);
          setEditAddmsg(false);
        }, 1000);
      });

      setButtonDisabled(true);
      setValid(false);
    }
  };

  // ==================================================================================================================
  let sideArrow = document.getElementsByClassName(
    "p-paginator-next p-paginator-element p-link"
  );
  let sideDoubleArrow = document.getElementsByClassName(
    "p-paginator-last p-paginator-element p-link"
  );

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

    if (products[0]?.dependency_name == "") {
      document.getElementsByClassName("p-row-editor-init p-link")[0].click();

      setTimeout(() => {
        document

          .getElementsByClassName("p-row-editor-cancel p-link")[0]
          ?.addEventListener(
            "click",

            function (e) {
              if (products[0]?.dependency_name == "") {
                setProducts(products.slice(1, products.length));
                setButtonDisabled(true);
                setValid(false);
                setValidateproject(false);
              }
            },

            true
          );
      }, 200);
    }
  }, [products]);

  // ========================================Getting ProjectName for the project we choose===========================================

  const getProjectName = () => {
    axios({
      method: "get",
      url: baseUrl + `/ProjectMS/Audit/getProjectName?projectId=${projectId}`,
    })
      .then(function (response) {
        let resp = response.data;
        setPrjName(resp);
      })
      .catch(function (response) {});
  };

  // ========================================Getting projectCode for the project we choose===========================================

  const getProjectOverviewData = () => {
    axios({
      method: "get",
      url:
        baseUrl +
        `/ProjectMS/Audit/projectOverviewDetails?projectId=${projectId}`,
    })
      .then(function (response) {
        let resp = response.data;
        setProjectData(resp);
      })
      .catch(function (response) {});
  };

  useEffect(() => {
    getProjectOverviewData();
    getProjectName();
  }, []);

  const handleChange1 = (e) => {
    const { id, name, value } = e.target;
    setFormEditData((prev) => ({ ...prev, [id]: value }));
  };

  useEffect(() => {}, [formEditData]);

  // ------------------------------for column body -----------------------------

  const handleBodyDependency = (data) => {
    return (
      <>
        <input
          id="dependency_name"
          title={data.dependency_name}
          value={data.dependency_name}
          type="text"
          autoComplete="off"
          required
          disabled
          className="ellipsis"
        />
      </>
    );
  };
  const handleBodyType = (data) => {
    return (
      <>
        <input
          id="Type"
          title={data.Type}
          value={data.Type}
          type="text"
          autoComplete="off"
          required
          disabled
          className="ellipsis"
        />
      </>
    );
  };

  const handleBodyPriority = (data) => {
    return (
      <>
        <input
          id="Priority"
          title={data.Priority}
          value={data.Priority}
          type="text"
          autoComplete="off"
          required
          disabled
          className="ellipsis"
        />
      </>
    );
  };
  const handleBodyRaisedBy = (data) => {
    return (
      <>
        <input
          id="RaisedBy"
          title={data.RaisedBy}
          value={data.RaisedBy}
          type="text"
          autoComplete="off"
          required
          disabled
          className="ellipsis"
        />
      </>
    );
  };
  const handleBodyRaisedDate = (data) => {
    return (
      <>
        <input
          id="raised_date"
          title={data.raised_date}
          value={data.raised_date}
          type="text"
          autoComplete="off"
          required
          disabled
          className="ellipsis"
        />
      </>
    );
  };
  const handleBodyTargetDate = (data) => {
    return (
      <>
        <input
          id="target_date"
          title={data.target_date}
          value={data.target_date}
          type="text"
          autoComplete="off"
          required
          disabled
          className="ellipsis"
        />
      </>
    );
  };
  const handleBodyAssignedTo = (data) => {
    return (
      <>
        <input
          id="AssingedTo"
          title={data.AssingedTo}
          value={data.AssingedTo}
          type="text"
          autoComplete="off"
          required
          disabled
          className="ellipsis"
        />
      </>
    );
  };
  const handleBodyPhaseEffected = (data) => {
    return (
      <>
        <input
          id="phase_affected"
          title={data.phase_affected}
          value={data.phase_affected}
          type="text"
          autoComplete="off"
          required
          disabled
          className="ellipsis"
        />
      </>
    );
  };
  const handleBodyStatus = (data) => {
    return (
      <>
        <input
          id="Status"
          title={data.Status}
          value={data.Status}
          type="text"
          autoComplete="off"
          required
          disabled
          className="ellipsis"
        />
      </>
    );
  };

  // ------------------------------for columns functions-----------------------------

  const textEditorDependency = (products) => {
    setRowId(products.rowData.id);
    return (
      <>
        <input
          className={`error ${
            validateproject && !products.rowData.dependency_name
              ? "error-block"
              : ""
          }`}
          type="text"
          value={products.rowData.dependency_name}
          id="dependency_name"
          onChange={(e) => {
            products.editorCallback(e.target.value);
          }}
        />
      </>
    );
  };

  const DropdownType = (rowData) => {
    return (
      <>
        <select
          id="type_id"
          className={`error${
            validateproject && !rowData.type_id ? " error-block" : ""
          }`}
          name="Type"
          onChange={(e) => {
            rowData.editorCallback(e.target.value);

            type.map((a) => {
              if (a.id == e.target.value) {
                rowData["rowData"]["Type"] = a.lkup_name;
                rowData["rowData"]["type_id"] = e.target.value;
              }
            });
          }}
        >
          <option value="">{"<<Please Select>>"}</option>
          {type?.map((Item, index) => (
            <option
              key={index}
              value={Item.id}
              selected={Item.id == rowData.rowData.type_id ? true : false}
            >
              {Item.lkup_name}
            </option>
          ))}
        </select>
      </>
    );
  };

  const DropdownPriority = (rowData) => {
    return (
      <>
        <select
          id="priority_id"
          className={`error${
            validateproject && !rowData.priority_id ? " error-block" : ""
          }`}
          name="Priority"
          onChange={(e) => {
            rowData.editorCallback(e.target.value);
            priority.map((a) => {
              if (a.id == e.target.value) {
                rowData["rowData"]["Priority"] = a.lkup_name;
                rowData["rowData"]["priority_id"] = e.target.value;
              }
            });
          }}
        >
          <option value="">{"<<Please Select>>"}</option>
          {priority?.map((Item, index) => (
            <option
              key={index}
              value={Item.id}
              selected={Item.id == rowData.rowData.priority_id ? true : false}
            >
              {Item.lkup_name}
            </option>
          ))}
        </select>
      </>
    );
  };

  const textEditor = (products) => {
    return (
      <div className="autoComplete-container">
        <ReactSearchAutocomplete
          items={resource}
          id="raised_by_id"
          name="Raised By"
          inputSearchString={
            products.rowData.RaisedBy == null ? "" : products.rowData.RaisedBy
          }
          onSelect={(selectedItem) => {
            setRaisedBy(selectedItem);
          }}
          showIcon={false}
        />
      </div>
    );
  };

  const setDatePicker = (products, options) => {
    return (
      <DatePicker
        name="raised_date"
        selected={raisedDate}
        id="raised_date"
        value={products.rowData.raised_date}
        dateFormat="dd-MMM-yyyy"
        onChange={(e) => {
          products.editorCallback(moment(e).format("DD-MMM-yyyy")),
            setFormEditData((prev) => ({
              ...prev,
              ["raised_date"]: moment(e).format("yyyy-MM-DD"),
            }));
        }}
        onKeyDown={(e) => {
          e.preventDefault();
        }}
      />
    );
  };

  const setDatePicker2 = (products, options) => {
    return (
      <DatePicker
        name="target_date"
        selected={targetDate}
        id="target_date"
        value={products.rowData.target_date}
        dateFormat="dd-MMM-yyyy"
        onChange={(e) => {
          products.editorCallback(moment(e).format("DD-MMM-yyyy")),
            setFormEditData((prev) => ({
              ...prev,
              ["target_date"]: moment(e).format("yyyy-MM-DD"),
            }));
        }}
        onKeyDown={(e) => {
          e.preventDefault();
        }}
      />
    );
  };

  const textEditor1 = (products) => {
    return (
      <div className="autoComplete-container">
        <ReactSearchAutocomplete
          items={resource}
          id="assigned_to_id"
          name="AssingedTo"
          inputSearchString={
            products.rowData.AssingedTo == null
              ? ""
              : products.rowData.AssingedTo
          }
          onSelect={(selectedItem) => {
            setAssingedTo(selectedItem);
          }}
          showIcon={false}
        />
      </div>
    );
  };

  const textEditorPhaseAffected = (products) => {
    return (
      <>
        <InputTextarea
          value={products.rowData.phase_affected}
          id="phase_affected"
          onChange={(e) => products.editorCallback(e.target.value)}
          rows={4}
          cols={30}
        />
      </>
    );
  };

  const DropDownStatus = (rowData) => {
    return (
      <>
        <select
          id="status_id"
          className="cancel"
          name="Status"
          onChange={(e) => {
            rowData.editorCallback(e.target.value);

            status.map((a) => {
              if (a.id == e.target.value) {
                rowData["rowData"]["Status"] = a.lkup_name;
                rowData["rowData"]["status_id"] = e.target.value;
              }
            });
          }}
        >
          <option value="">{"<<Please Select>>"}</option>
          {status?.map((Item, index) => (
            <option
              key={index}
              value={Item.id}
              selected={Item.id == rowData.rowData.status_id ? true : false}
            >
              {Item.lkup_name}
            </option>
          ))}
        </select>
      </>
    );
  };

  const addHandler = () => {
    if (!valid) {
      setValid(true);
      setButtonDisabled(false);
    }
    const data = {
      dependency_name: "",
      Type: "",
      Priority: "",
      RaisedBy: "",
      raised_date: "",
      target_date: "",
      AssingedTo: "",
      phase_affected: "",
      Status: "",
    };
    let dt = [];
    dt.push(data);
    setProducts([...dt, ...products]);
  };
  const renderSNo = (rowData, column) => {
    const index = products.indexOf(rowData);
    const sNo = index + 1;
    return <span>{sNo}</span>;
  };
  const Save = () => {
    document
      .getElementsByClassName("p-row-editor-save-icon pi pi-fw pi-check")[0]
      ?.click();
  };
  const Reset = () => {
    document.getElementsByClassName("p-row-editor-cancel p-link")[0]?.click();
    setValidateproject(false);
  };

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
          {"Dependency saved successfully."}
        </div>
      ) : (
        ""
      )}
      {editmsg ? (
        <div className="statusMsg success">
          <span className="errMsg">
            <BiCheck size="1.4em" strokeWidth={{ width: "100px" }} />
            {"Dependency updated successfully."}
          </span>
        </div>
      ) : (
        ""
      )}
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
          <h2>Dependencies</h2>
        </div>
        <div className="childThree"></div>
      </div>
      &nbsp;
      <div className=" p-fluid darkHeader  mb-2 DeliveryProjectsMonitoringDependencies">
        <DataTable
          className="primeReactDataTable projDependenciesTable"
          paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
          value={products}
          editMode="row"
          onRowEditComplete={onRowEditComplete}
          tableStyle={{ minWidth: "auto", width: "auto" }}
          showGridlines
          emptyMessage="No Data Found"
          paginator
          rows={25}
          rowHover
          dataKey="id"
          rowsPerPageOptions={[10, 25, 50]}
          filterDisplay="row"
          globalFilterFields={[
            "dependency_name",
            "Type",
            "Priority",
            "RaisedBy",
            "raised_date",
            "target_date",
            "AssingedTo",
            "phase_affected",
            "Status",
          ]}
          paginationComponentOptions={{
            rowsPerPageText: "Records per page:",
            rangeSeparatorText: "out of",
          }}
          currentPageReportTemplate="View {first} - {last} of {totalRecords} "
        >
          <Column
            field="sNo"
            header="S.No"
            body={renderSNo}
            style={{
              textAlign: "center",
            }}
          />

          {/* ----------------------InputText------------------------------- */}

          <Column
            field="dependency_name"
            header={
              <span>
                Dependency/Constraint<span className="error-text">*</span>
              </span>
            }
            body={handleBodyDependency}
            editor={(options) => textEditorDependency(options)}
            sortable
            filter
          ></Column>

          {/* ---------------------DropDown----------------------------------*/}
          <Column
            field="Type"
            header={
              <span>
                Type<span className="error-text">*</span>
              </span>
            }
            body={handleBodyType}
            editor={(options) => DropdownType(options)}
            sortable
            filter
            filterMatchMode="contains"
          />

          {/* ---------------------DropDown----------------------------------*/}
          <Column
            field="Priority"
            header={
              <span>
                Priority<span className="error-text">*</span>
              </span>
            }
            body={handleBodyPriority}
            editor={(options) => DropdownPriority(options)}
            sortable
            filter
            filterMatchMode="contains"
          ></Column>
          {/* --------------------AutoComplete------------------------------- */}
          <Column
            field="RaisedBy"
            header="Raised By"
            sortable
            body={handleBodyRaisedBy}
            editor={(options) => textEditor(options)}
            filter
            filterMatchMode="contains"
          ></Column>
          {/*--------------------DatePicker--------------------------------  */}
          <Column
            field="raised_date"
            header="Raised Date"
            body={handleBodyRaisedDate}
            editor={(options) => setDatePicker(options)}
            sortable
            filterMatchMode="contains"
            filter
          />
          {/*--------------------DatePicker--------------------------------  */}
          <Column
            field="target_date"
            header="Target Date"
            body={handleBodyTargetDate}
            editor={(options) => setDatePicker2(options)}
            sortable
            filter
            filterMatchMode="contains"
          />
          {/* --------------------AutoComplete------------------------------- */}
          <Column
            field="AssingedTo"
            header="Assinged To"
            body={handleBodyAssignedTo}
            sortable
            editor={(options) => textEditor1(options)}
            filter
            filterMatchMode="contains"
          ></Column>
          {/* ----------------------InputText------------------------------- */}

          <Column
            field="phase_affected"
            header="Phase/Area affected"
            body={handleBodyPhaseEffected}
            editor={(options) => textEditorPhaseAffected(options)}
            sortable
            style={{ width: "150px" }}
            filter
          ></Column>
          {/* ----------------------DropDown------------------------------- */}

          <Column
            field="Status"
            header="Status"
            body={handleBodyStatus}
            editor={(options) => DropDownStatus(options)}
            sortable
            filter
          ></Column>
          {/* ----------------------Actions------------------------------- */}
          {grp4Items[4].is_write == true && (
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
        <div className="form-group col-md-2 btn-container-events center my-3">
          <button
            className="btn btn-primary"
            disabled={valid}
            title={"Add new row"}
            onClick={() => {
              addHandler();
            }}
          >
            <FaPlus />
            Add
          </button>

          <button
            className="btn btn-primary"
            disabled={buttonDisabled}
            title={"Save row"}
            onClick={() => {
              Save();
            }}
          >
            <FaSave /> Save
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
    </>
  );
}
export default ProjectDependencies;
