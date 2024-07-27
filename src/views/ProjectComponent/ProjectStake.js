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
import { ImCross } from "react-icons/im";
import { ReactSearchAutocomplete } from "react-search-autocomplete";
import "./ProjectStake.scss";
import { InputText } from "primereact/inputtext";
import { FilterMatchMode, FilterOperator } from "primereact/api";
import { FaPlus, FaSave } from "react-icons/fa";
import ScreenBreadcrumbs from "../Common/ScreenBreadcrumbs";
import useDynamicMaxHeight from "../PrimeReactTableComponent/useDynamicMaxHeight";

function projectStakeholders(props) {
  const [products, setProducts] = useState([{}]);

  const [addMessage, setAddMessage] = useState(false);
  const [validateproject, setValidateproject] = useState(false);
  const [loader, setLoader] = useState(false);
  const [searching, setSearching] = useState(true);
  const [buttonDisabled, setButtonDisabled] = useState(true);
  const [valid, setValid] = useState(false);
  const baseUrl = environment.baseUrl;
  const abortController = useRef(null);
  const componentRef = useRef(null);
  const [issueDetails, setIssueDetails] = useState([]);
  const [roles, SetRoles] = useState([]);
  const [obj, SetObj] = useState("");
  const [UserId, setUserId] = useState();
  const [RoleValue, setRoleValue] = useState();
  const [ObjectRoleTypeIdValue, setObjectRoleTypeIdValue] = useState();
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [projectData, setProjectData] = useState([]);
  const loggedUserName = localStorage.getItem("resName");
  const loggedUserId = localStorage.getItem("resId");
  const [data2, setData2] = useState([]);
  const {
    projectId,
    grp1Items,
    urlState,
    btnState,
    grp2Items,
    grp3Items,
    grp4Items,
    grp6Items,
    setbtnState,
  } = props;
  const dataObject = grp1Items.find(
    (item) => item.display_name === "Stakeholders"
  );

  const [routes, setRoutes] = useState([]);
  let currentScreenName = ["Projects", "Project", "Stakeholders"];
  let textContent = "Delivery";
  sessionStorage.setItem(
    "breadCrumbs",
    JSON.stringify({
      routes: routes,
      currentScreenName: currentScreenName,
      textContent: textContent,
    })
  );

  const materialTableElement = document.getElementsByClassName("childOne");

  const maxHeight1 =
    useDynamicMaxHeight(materialTableElement, "fixedcreate") - 46;
  document.documentElement.style.setProperty(
    "--dynamic-value",
    String(maxHeight1 - 120) + "px"
  );

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
      // console.log(sortedSubMenus);
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
        `/CommonMS/security/authorize?url=/project/roles&userId=${loggedUserId}`,
    }).then((res) => {
      console.log(res, "urlResponse");
    });
  };
  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    name: {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
    },

    representative: { value: null, matchMode: FilterMatchMode.IN },
    status: {
      operator: FilterOperator.OR,
      constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }],
    },
  });

  const initialValue = {
    project_id: projectId,
    Role: "",
    Userid: "",
    FromDate: "",
    ToDate: "",
    comments: "",
  };
  const [formData, setFormData] = useState(initialValue);
  useEffect(() => {}, [
    formData,
    obj,
    formData?.Role,
    formData?.Userid,
    UserId,
  ]);
  const onRowEditComplete = (e) => {
    let _products = [...products];
    let { newData, index } = e;
    _products[index] = newData;

    setProducts(_products);
    handleAddClick(e.newData);
  };
  const [rowid, setRowID] = useState();

  const handleAddClick = (rowData, index) => {
    const putdata = () => {
      var data = {
        id: rowid,
        LastUpdatedBy: loggedUserName,
        LastUpdatedById: loggedUserId,
        Version: "0",
        assignedBy: loggedUserId,
        IsActive: "1",
        CreatedBy: loggedUserName,
        ObjectTypeCode: "ObjectRole",
        IsResolved: "1",
        IsManualAssignment: "0",
        ObjectId: projectId,
        Role: obj == "" ? ObjectRoleTypeIdValue : obj,
        User: formData?.Userid == "" ? UserId : formData?.Userid,
        // ObjectTypeRoleTypeId: 1,

        FromDate:
          formData?.FromDate == ""
            ? moment(rowData?.FromDate).format("yyyy-MM-DD")
            : formData?.FromDate,
        ToDate:
          formData?.ToDate === ""
            ? moment(rowData?.ToDate).format("yyyy-MM-DD")
            : formData?.ToDate,
        object_type_id: 3,
        role_type_id: formData?.Role == "" ? RoleValue : formData?.Role,
      };

      axios({
        method: "post",
        url:
          baseUrl +
          `/ProjectMS/stakeholders/postDetailsinBaseDomainobjectroles`,
        data: data,
      }).then((error) => {
        setLoader(false);
        setAddMessage(true);
        setTimeout(() => {
          setAddMessage(false);
          setLoader(false);
        }, 3000);
        setValidateproject(false);
        getData();

        setFormData(initialValue);
      });
      setButtonDisabled(true);
      setValid(false);
    };

    const postdata = () => {
      var data1 = {
        LastUpdatedBy: loggedUserName,
        LastUpdatedById: loggedUserId,
        Version: "0",
        assignedBy: loggedUserId,
        IsActive: "1",
        CreatedBy: loggedUserName,
        ObjectTypeCode: "ObjectRole",
        IsResolved: "1",
        IsManualAssignment: "0",
        ObjectId: projectId,
        Role: obj,
        User: formData.Userid,
        FromDate:
          formData.FromDate == ""
            ? projectData[0]?.plandStartDate
            : formData.FromDate,
        ToDate:
          formData.ToDate == ""
            ? projectData[0]?.plandEndDate
            : formData?.ToDate,
        object_type_id: 3,
        role_type_id: formData.Role,
        ObjectTypeRoleTypeId: 1,
      };

      if (formData.Role === "" || formData.Userid === "") {
        setValidateproject(true);
      } else {
        if (formData.Role != "" || formData.Userid !== "") {
          axios({
            method: "post",
            url:
              baseUrl +
              `/ProjectMS/stakeholders/postDetailsinBaseDomainobjectroles`,
            data: data1,
          }).then((error) => {
            setValidateproject(false);
            setSearching(false);
            setFormData(initialValue);
            setLoader(false);
            setAddMessage(true);
            setTimeout(() => {
              setAddMessage(false);
              setLoader(false);
              setSearching(true);
              getData();
            }, 1000);
          });

          setButtonDisabled(true);
          setValid(false);
        }
      }
    };
    {
      rowData.id != undefined ? putdata() : postdata();
    }
  };

  const getRoles = () => {
    axios({
      url: baseUrl + `/ProjectMS/stakeholders/getRoles`,
    }).then((resp) => {
      SetRoles(resp.data);
    });
  };
  const getProjectData = () => {
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

  const getObjectTypeId = () => {
    axios({
      url:
        baseUrl +
        `/ProjectMS/stakeholders/getObjectTypeId?id=${formData?.Role}`,
    }).then((resp) => {
      SetObj(resp.data);
    });
  };
  useEffect(() => {
    getProjectData();
    let prod = products[0];

    if (products[0]?.Role == "") {
      const icon = document.getElementsByClassName(
        "p-row-editor-init p-link"
      )[0];
      icon?.setAttribute("title", "Edit selected row");
      icon?.click();
      setTimeout(() => {
        const saveIcon = document.getElementsByClassName(
          "p-row-editor-save p-link"
        )[0];
        saveIcon?.setAttribute("title", "Save row");
        const cancelIcon = document.getElementsByClassName(
          "p-row-editor-cancel p-link"
        )[0];
        cancelIcon?.setAttribute("title", "Cancel row editing");

        cancelIcon?.addEventListener(
          "click",
          function (e) {
            if (products[0]?.Role === "") {
              setProducts(products.slice(1, products.length));
              setButtonDisabled(true);
              setValidateproject(false);
              setValid(false);
              componentRef.current?.forceUpdate();
            }
          },
          true
        );
      }, 200);
    }
  }, [products]);

  useEffect(() => {
    let prnt = document.getElementsByClassName("p-row-editor-init p-link");

    let tempProducts = JSON.parse(
      JSON.stringify(products.filter((d) => d.id != undefined))
    );

    if (!loader && prnt != undefined) {
      setTimeout(() => {
        for (let i = 0; i < prnt.length; i++) {
          if (tempProducts[i]?.AssignmentType == "System") {
            prnt[i].classList.add("disableRow");
          }
          prnt[i].setAttribute("title", "Edit");
        }
      }, 1000);
    }
  }, [products, loader]);

  const Save = () => {
    document
      .getElementsByClassName("p-row-editor-save-icon pi pi-fw pi-check")[0]
      ?.click();
  };

  const Reset = () => {
    document.getElementsByClassName("p-row-editor-cancel p-link")[0]?.click();
    setValidateproject(false);
  };
  useEffect(() => {}, [
    projectData[0]?.plandStartDate,
    projectData[0]?.plandEndDate,
  ]);

  const textEditorUser = (products) => {
    setRowID(products.rowData.id);
    return (
      <div className="autoComplete-container">
        <div
          className={` ${
            validateproject && !products.rowData.User ? "error-block" : ""
          }`}
        >
          <ReactSearchAutocomplete
            items={issueDetails}
            type="Text"
            name="Userid"
            id="Userid"
            value={products.rowData.User}
            fuseOptions={{ keys: ["id", "name", "employee_number"] }}
            resultStringKeyName="name"
            // className="err cancel nochange"
            issueDetails={issueDetails}
            inputSearchString={
              products.rowData.User == null ? "" : products.rowData.User
            }
            getUser={getUser}
            //   onSelect={handleAddFormChange}
            onSelect={(e) => {
              products.editorCallback(e.name);

              {
                setFormData((prevProps) => ({
                  ...prevProps,
                  Userid: e.userId,
                }));
              }
            }}
            showIcon={false}
          />
        </div>
      </div>
    );
  };
  const statusbodyEvents = (rowData) => {
    return <div title={rowData.Role}> {rowData.Role}</div>;
  };
  const UserbodyEvents = (rowData) => {
    return <div title={rowData.User}>{rowData.User}</div>;
  };

  const statusbodyComments = (rowData) => {
    return <div title={rowData.date_created}>{rowData.date_created}</div>;
  };
  const statusassignedBy = (rowData) => {
    setRoleValue(rowData.Roleid);
    return <div title={rowData.assignedBy}>{rowData.assignedBy}</div>;
  };
  const [assignmentType, setAssignmentType] = useState("");

  const statusAssignmentType = (rowData) => {
    let d = rowData.AssignmentType;

    setAssignmentType(d);

    return <div title={rowData.AssignmentType}>{rowData.AssignmentType}</div>;
  };
  useEffect(() => {}, [UserId, assignmentType]);
  const textEditorDate = (products) => {
    setUserId(products.rowData?.user_id);

    const today = new Date();

    return (
      <DatePicker
        className={`error ${
          validateproject && !products.rowData.FromDate ? "error-block" : ""
        }`}
        name="FromDate"
        id="FromDate"
        selected={products.FromDate}
        showMonthDropdown
        showYearDropdown={true}
        autoComplete="off"
        dropdownMode="select"
        value={products.rowData.FromDate}
        dateFormat="DD-MMM-yyyy"
        onChange={(e) => {
          const selectedDate = moment(e).format("DD-MMM-yyyy");
          products.editorCallback(selectedDate);
          setFormData((prev) => ({
            ...prev,
            ["FromDate"]: moment(e).format("yyyy-MM-DD"),
          }));
        }}
        onKeyDown={(e) => {
          e.preventDefault();
        }}
        minDate={moment(projectData[0]?.plandStartDate).toDate()}
        maxDate={moment(projectData[0]?.plandEndDate).toDate()}
      />
    );
  };

  const textToDate = (products) => {
    return (
      <DatePicker
        className={`error ${
          validateproject && !products.rowData.ToDate ? "error-block" : ""
        }`}
        name="ToDate"
        id="ToDate"
        autoComplete="off"
        selected={products.ToDate}
        showMonthDropdown
        showYearDropdown={true}
        dropdownMode="select"
        value={products.rowData.ToDate}
        dateFormat="DD-MMM-yyyy"
        onChange={(e) => {
          const selectedDate = moment(e).format("yyyy-MM-DD");
          products.editorCallback(selectedDate);
          setFormData((prev) => ({
            ...prev,
            ["ToDate"]: moment(e).format("yyyy-MM-DD"),
          }));
        }}
        onKeyDown={(e) => {
          e.preventDefault();
        }}
        minDate={moment(projectData[0]?.plandStartDate).toDate()}
        maxDate={moment(projectData[0]?.plandEndDate).toDate()}
      />
    );
  };

  const statusbodyDate = (rowData) => {
    return <div title={rowData.FromDate}>{rowData.FromDate}</div>;
  };
  const statusToDate = (rowData) => {
    return <div title={rowData.ToDate}>{rowData.ToDate}</div>;
  };

  const getUser = () => {
    axios({
      method: "get",
      url: baseUrl + `/ProjectMS/risks/getAssignedData`,
    }).then(function (response) {
      var res = response.data;
      setIssueDetails(res);
    });
  };
  useEffect(() => {}, [issueDetails]);
  useEffect(
    (rowData) => {
      getUser();
      getRoles();
      getObjectTypeId();
    },
    [formData?.Role]
  );

  const getData = () => {
    setLoader(false);
    abortController.current = new AbortController();
    axios({
      url:
        baseUrl +
        `/ProjectMS/stakeholders/getStakeHolderDetails?ObjectId=${projectId}`,
    }).then((resp) => {
      const GetData = resp.data;
      for (let i = 0; i < GetData.length; i++) {
        GetData[i]["date_created"] =
          GetData[i]["date_created"] == null
            ? ""
            : moment(GetData[i]["date_created"]).format("DD-MMM-YYYY");
        GetData[i]["FromDate"] =
          GetData[i]["FromDate"] == null
            ? ""
            : moment(GetData[i]["FromDate"]).format("DD-MMM-YYYY");
        GetData[i]["ToDate"] =
          GetData[i]["ToDate"] == null
            ? ""
            : moment(GetData[i]["ToDate"]).format("DD-MMM-YYYY");
        GetData[i]["AssignmentType"] =
          GetData[i]["AssignmentType"] == null
            ? ""
            : GetData[i]["AssignmentType"] == true
            ? "System"
            : "Manual";
        GetData[i]["IsActive"] =
          GetData[i]["IsActive"] == null
            ? ""
            : GetData[i]["IsActive"] == 1
            ? "YES"
            : "NO";
        GetData[i]["User"] =
          GetData[i]["User"] === null ? "" : GetData[i]["User"];
      }

      setProducts(GetData);

      setTimeout(() => {
        setLoader(false);
      }, 1000);
    });
  };

  const handleAbort = () => {
    abortController.current && abortController.current.abort();
    setLoader(false);
  };

  useEffect(() => {
    getData();
  }, []);
  const textEditorEventName = (products) => {
    setObjectRoleTypeIdValue(products.rowData?.ObjectRoleTypeId);

    return (
      <div>
        <div>
          <select
            id="Role"
            name="Role"
            className={`error${
              validateproject && !products.rowData.Roleid ? " error-block" : ""
            }`}
            onChange={(e) => {
              setFormData((prevProps) => ({
                ...prevProps,
                Role: e.target.value,
              }));
            }}
          >
            <option value="">{"<<Please Select>>"}</option>
            {roles?.map((item) => (
              <option
                key={item.id}
                value={item.id}
                selected={item.id === products.rowData.Roleid}
              >
                {item.display_name}
              </option>
            ))}
          </select>
        </div>
      </div>
    );
  };

  const addHandler = () => {
    if (!valid) {
      setValid(true);
      setButtonDisabled(false);
    }
    const data = {
      Role: "",
      FromDate: moment(projectData[0]?.plandStartDate).format("DD-MMM-yyyy"),
      ToDate: moment(projectData[0]?.plandEndDate).format("DD-MMM-yyyy"),
      User: "",
    };
    let dt = [];
    dt.push(data);
    setProducts([...dt, ...products]);
  };

  const [globalFilter, setGlobalFilter] = useState("");

  const handleGlobalFilterChange = (event) => {
    setGlobalFilter(event.target.value);
  };
  const renderHeader = () => {
    return (
      <>
        <span className="p-input-icon-left stakeTableSearch">
          <i className="pi pi-search" />
          <InputText
            type="search"
            style={{ float: "right" }}
            value={globalFilter}
            onChange={(e) => handleGlobalFilterChange(e)}
            placeholder="Keyword Search"
          />
        </span>
      </>
    );
  };
  const header = renderHeader();

  const filteredData = products.filter((item) =>
    Object.values(item).some((value) =>
      String(value).toLowerCase().includes(globalFilter.toLowerCase())
    )
  );
  console.log(projectData, "projectData");
  return (
    <>
      {validateproject ? (
        <div className="statusMsg error">
          <span>
            <AiFillWarning />
            &nbsp;
            {"Please provide the valid values for highlighted fields"}
          </span>
        </div>
      ) : (
        ""
      )}
      {addMessage ? (
        <div className="statusMsg success">
          <BiCheck />
          {"Role saved successfully."}
        </div>
      ) : (
        ""
      )}

      {/* {projectData.map((list) => ( */}
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
            <h2>Stakeholders</h2>
          </div>
          <div className="childThree"></div>
        </div>
      </div>
      {/* ))} */}

      {loader ? (
        <div className="loaderBlock">
          <Loader handleAbort={handleAbort} />
        </div>
      ) : (
        ""
      )}
      {searching ? (
        <div className="customercard darkHeader projectStakeHolders">
          <DataTable
            className="primeReactDataTable invoicingSearchTable   projectStakeholderTable"
            value={filteredData}
            onRowEditComplete={onRowEditComplete}
            paginator
            paginationPerPage={5}
            paginationRowsPerPageOptions={[5, 15, 25, 50]}
            paginationComponentOptions={{
              rowsPerPageText: "Records per page:",
              rangeSeparatorText: "out of",
            }}
            paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
            rowsPerPageOptions={[10, 25, 50]}
            editMode="row"
            rows={25}
            header={header}
            filters={filters}
            onFilter={(e) => setFilters(e.filters)}
            selection={selectedCustomer}
            onSelectionChange={(e) => setSelectedCustomer(e.value)}
            dataKey="id"
            showGridlines
            stripedRows
            scrollHeight="480px"
            // stateStorage="session"
            // stateKey="dt-state-demo-local"
            responsiveLayout="scroll"
            emptyMessage="No Records found."
          >
            <Column
              field="Role"
              header="Role"
              sortable
              body={statusbodyEvents}
              editor={(options) => textEditorEventName(options)}
            ></Column>
            <Column
              field="User"
              header="User"
              sortable
              body={UserbodyEvents}
              editor={(options) => textEditorUser(options)}
            ></Column>
            <Column
              field="FromDate"
              header={<span>From Date</span>}
              sortable
              body={statusbodyDate}
              editor={(options) => textEditorDate(options)}
            />
            <Column
              field="ToDate"
              header={<span>To Date</span>}
              sortable
              body={statusToDate}
              editor={(options) => textToDate(options)}
            />

            <Column
              field="AssignmentType"
              header="Assignment Type"
              sortable
              body={statusAssignmentType}
            ></Column>
            <Column
              field="assignedBy"
              header="Assigned By"
              sortable
              body={statusassignedBy}
            ></Column>
            <Column
              field="date_created"
              header="Assigned Date"
              sortable
              body={statusbodyComments}
            ></Column>
            <Column field="IsActive" header="IsActive" sortable></Column>

            {/* {permissions === "HIER_FULL" && (
              <Column
                field="Actions"
                style={{ textAlign: "center" }}
                header="Actions"
                rowEditor
                sortable
              ></Column>
            )} */}
            {dataObject.is_write === true && (
              <Column
                field="Actions"
                style={{ textAlign: "center" }}
                header="Actions"
                rowEditor
                sortable
              ></Column>
            )}
          </DataTable>
        </div>
      ) : (
        ""
      )}
      <div className="form-group col-md-2 btn-container-events center my-1">
        {/* {permissions == "HIER_FULL" ? (
          <button
            className="btn btn-primary"
            disabled={valid}
            title={"Add new row"}
            onClick={addHandler}
          >
            <FaPlus /> Add
          </button>
        ) : (
          ""
        )} */}
        {dataObject?.is_write === true ? (
          <button
            className="btn btn-primary"
            disabled={valid}
            title={"Add new row"}
            onClick={addHandler}
          >
            <FaPlus /> Add
          </button>
        ) : null}

        {/* {permissions == "HIER_FULL" ? (
          <button
            id="isShow"
            className="btn btn-primary"
            disabled={buttonDisabled}
            title={"Save row"}
            onClick={() => {
              Save();
            }}
          >
            <FaSave /> Save
          </button>
        ) : (
          ""
        )} */}
        {dataObject?.is_write === true ? (
          <button
            id="isShow"
            className="btn btn-primary"
            disabled={buttonDisabled}
            title={"Save row"}
            onClick={() => {
              Save();
            }}
          >
            <FaSave /> Save
          </button>
        ) : null}

        {/* {permissions == "HIER_FULL" ? (
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
        ) : (
          ""
        )} */}
        {dataObject?.is_write === true ? (
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
        ) : null}
      </div>
      {/* {loader ? <Loader handleAbort={handleAbort} /> : ""} */}
    </>
  );
}
export default projectStakeholders;
