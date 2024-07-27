import React, { useEffect, useState, useRef, useMemo } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Dropdown } from "primereact/dropdown";
import { Tag } from "primereact/tag";
import axios from "axios";
import { MdOutlineAdd } from "react-icons/md";
import { TfiSave } from "react-icons/tfi";
import { ImCross } from "react-icons/im";
import Loader from "../Loader/Loader";
import { classNames } from "primereact/utils";
import { FilterMatchMode, FilterOperator } from "primereact/api";
import { TriStateCheckbox } from "primereact/tristatecheckbox";
import { BiCheck } from "react-icons/bi";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { environment } from "../../environments/environment";
import moment from "moment";
import { AiFillWarning } from "react-icons/ai";
import { Calendar } from "primereact/calendar";
import { FaPlus, FaSave } from "react-icons/fa";
import { FaInfoCircle } from "react-icons/fa";
import useDynamicMaxHeight from "../PrimeReactTableComponent/useDynamicMaxHeight";
import './ProjectMilestones.scss'

export default function ProjectMilestones(props) {
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
  const dataObject = grp4Items.find(
    (item) => item.display_name === "Milestones"
  );
  const baseUrl = environment.baseUrl;
  const [products, setProducts] = useState([]);
  const [editmsg, setEditAddmsg] = useState(false);
  const [addmsg, setAddmsg] = useState(false);
  const [editId, setEditId] = useState([]);
  const [loader, setLoader] = useState(false);

  const [validateproject, setValidateproject] = useState(false);
  const ref = useRef([]);
  const componentRef = useRef(null);

  const materialTableElement = document.getElementsByClassName(
    "childOne"
  );

  const maxHeight1 = useDynamicMaxHeight(materialTableElement, "fixedcreate") -46;
  document.documentElement.style.setProperty(
    "--dynamic-value",
    String(maxHeight1 -83) + "px"
  );

  useEffect(() => {
    getData();
  }, []);
  const [buttonDisabled, setButtonDisabled] = useState(true);

  const [filters, setFilters] = useState({
    filters: {
      global: { value: null, matchMode: FilterMatchMode.CONTAINS },
      project_milestone: {
        value: null,
        matchMode: FilterMatchMode.CONTAINS,
      },
      due_date: { value: null, matchMode: FilterMatchMode.CONTAINS },
      lkup_name: { value: null, matchMode: FilterMatchMode.CONTAINS },
      is_invoiceable: { value: null, matchMode: FilterMatchMode.CONTAINS },
      amount: { value: null, matchMode: FilterMatchMode.CONTAINS },
      comments: { value: null, matchMode: FilterMatchMode.CONTAINS },
      completed_date: { value: null, matchMode: FilterMatchMode.CONTAINS },
      invoice_id: { value: null, matchMode: FilterMatchMode.CONTAINS },
      invoice_status: { value: null, matchMode: FilterMatchMode.CONTAINS },
    },
  });

  const initialValues = {
    id: "",
    project_id: projectId,
    project_milestone: "",
    Status: 588,
    due_date: "",
    comments: "",
    is_invoiceable: 1,
    completed_date: "",
    amount: 0.0,
  };

  //// -------breadcrumbs-----

  const loggedUserId = localStorage.getItem("resId");

  const [routes, setRoutes] = useState([]);
  let textContent = "Delivery";
  let currentScreenName = ["Projects", "Monitoring", "Milestones"];
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
      console.log(sortedSubMenus);
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
        `/CommonMS/security/authorize?url=/projectMilestones/list/&userId=${loggedUserId}`,
    }).then((res) => {
      console.log(res, "urlResponse");
    });
  };
  const [formEditData, setFormEditData] = useState(initialValues);
  useEffect(() => {}, [formEditData]);
  let sideArrow = document.getElementsByClassName(
    "p-paginator-next p-paginator-element p-link"
  );
  let sideDoubleArrow = document.getElementsByClassName(
    "p-paginator-last p-paginator-element p-link"
  );
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

    if (products[0]?.project_milestone == "") {
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
            if (products[0]?.project_milestone == "") {
              setProducts(products.slice(1, products.length));
              setButtonDisabled(true);
              setValid(false);
              setValidateproject(false);
              componentRef.current.forceUpdate();
            }
          },
          true
        );
      }, 200);
    }
  }, [products]);
  const abortController = useRef(null);

  const getData = () => {
    setLoader(false);
    abortController.current = new AbortController();

    axios({
      url:
        baseUrl +
        `/ProjectMS/stakeholders/getMilestonedata?project_id=${projectId}`,
      signal: abortController.current.signal,
    }).then((resp) => {
      let GetData = resp.data;

      for (let i = 0; i < GetData.length; i++) {
        GetData[i]["due_date"] =
          GetData[i]["due_date"] == null
            ? ""
            : moment(GetData[i]["due_date"]).format("DD-MMM-YYYY");

        GetData[i]["amount"] =
          GetData[i]["amount"] == null
            ? ""
            : GetData[i]["amount"]
                .toFixed(2)
                .replace(/\d(?=(\d{3})+\.)/g, "$&,");

        GetData[i]["completed_date"] =
          GetData[i]["completed_date"] == null
            ? ""
            : moment(GetData[i]["completed_date"]).format("DD-MMM-YYYY");
      }
      for (let i = 0; i < GetData.length; i++) {
        GetData[i] == "null" ? "" : GetData[i];
        GetData[i]["SNo"] = i + 1;
      }

      setProducts(() => GetData);
      setLoader(false);
      setTimeout(() => {
        setLoader(false);
      }, 1000);
    });
  };
  const handleAbort = () => {
    abortController.current && abortController.current.abort();
    setLoader(false);
  };
  const [status, setStatus] = useState([]);

  const statusfunc = async () => {
    await axios({
      method: "get",
      url: baseUrl + `/ProjectMS/stakeholders/getStatus`,
    })
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
  useEffect(() => {
    statusfunc();
  }, []);

  const onRowEditComplete = (e) => {
    let _products = [...products];
    let { newData, index } = e;
    _products[index] = newData;
    setProducts(_products);
    postData(e.newData);
  };
  const [storecomdate, setStorecomdate] = useState([]);

  ///=======================================post API

  const postData = (rowData) => {
    if (rowData.project_milestone === "" || rowData.due_date === "") {
      setValidateproject(true);
    } else {
      const DueDate = moment(rowData.due_date).format("yyyy-MM-DD");
      const CompleDate = moment(rowData.completed_date).format("yyyy-MM-DD");

      const storecompletedate = moment(storecomdate).format("yyyy-MM-DD");

      axios({
        method: "post",
        url: baseUrl + `/ProjectMS/stakeholders/postMilestones`,
        data: {
          id: rowData.id,
          project_id: rowData.project_id,
          project_milestone: rowData.project_milestone,
          due_date: DueDate,
          statusId:
            rowData.status_id == "" ||
            rowData.status_id == undefined ||
            rowData.status_id == null
              ? 559
              : rowData.status_id,
          comments:
            rowData.comments == "" || null || undefined ? "" : rowData.comments,
          is_invoiceable: rowData.is_invoiceable == true ? 1 : 0,
          completed_date:
            rowData.status_id == 560
              ? moment(storecomdate).format("YYYY-MM-DD")
              : moment(CompleDate).isValid()
              ? CompleDate !== "Invalid date"
                ? CompleDate
                : ""
              : "",

          amount: rowData.amount,
        },
      }).then((error) => {
        // console.log("success", error);
        getData();
        setValidateproject(false);
        setAddmsg(true);
        setTimeout(() => {
          setAddmsg(false);
        }, 3000);

        setTimeout(() => {
          setLoader(false);
        }, 1000);
      });
      setButtonDisabled(true);
      setValid(false);
    }
  };

  const Save = () => {
    document
      .getElementsByClassName("p-row-editor-save-icon pi pi-fw pi-check")[0]
      ?.click();
  };

  const Reset = () => {
    setValidateproject(false);
    document.getElementsByClassName("p-row-editor-cancel p-link")[0]?.click();
  };

  const [prjName, setPrjName] = useState([]);
  const [projectData, setProjectData] = useState([]);

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

  const [dueDate, setdueDate] = useState();
  const [valid, setValid] = useState(false);
  useEffect(() => {}, [storecomdate]);

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
      project_id: projectId,
      project_milestone: "",
      Status: "",
      due_date: "",
      comments: "",
      is_invoiceable: 1,
      completed_date: "",
      amount: 0.0,
    };

    let dt = [];
    dt.push(data);
    setProducts([...dt, ...products]);
  };
  useEffect(() => {}, [formEditData]);

  const [rowId, setRowId] = useState([]);

  const textEditorMileStone = (products) => {
    setRowId(products.rowData.id);

    return (
      <>
        <input
          type="text"
          id="project_milestone"
          className={`error ${
            validateproject && !products.rowData.project_milestone
              ? "error-block"
              : ""
          }`}
          value={products.rowData.project_milestone}
          onChange={(e) => {
            products.editorCallback(e.target.value);
          }}
        />
      </>
    );
  };

  const statusbodyMilestone = (rowData) => {
    return (
      <>
        <input
          id="project_milestone"
          title={rowData.project_milestone}
          value={rowData.project_milestone}
          type="text"
          autoComplete="off"
          required
          disabled
          className="ellipsis"
        />
      </>
    );
  };

  const statusbodyDueDate = (rowData) => {
    return (
      <>
        <input
          id="due_date"
          value={rowData.due_date}
          type="text"
          title={rowData.due_date}
          autoComplete="off"
          // className="form-control"
          required
          disabled
        />
      </>
    );
  };

  const [dateDue, setDateDue] = useState();
  const setDatePicker = (products, options) => {
    return (
      <DatePicker
        name="due_date"
        selected={dueDate}
        id="due_date"
        className={`error ${
          validateproject && !products.rowData.due_date ? "error-block" : ""
        }`}
        value={products.rowData.due_date}
        dateFormat="dd-MMM-yyyy"
        autoComplete="off"
        showMonthDropdown
        showYearDropdown
        onChange={(e) => {
          products.editorCallback(moment(e).format("DD-MMM-yyyy")),
            setFormEditData((prev) => ({
              ...prev,
              ["due_date"]: moment(e).format("yyyy-MM-DD"),
            }));
        }}
        onKeyDown={(e) => {
          e.preventDefault();
        }}
      />
    );
  };

  const companyBodyTemplate = (products, rowData) => {
    return (
      <select
        id="status_id"
        name="Status"
        className="cancel"
        onChange={(e) => {
          products.editorCallback(e.target.value);

          setStorecomdate(
            e.target.value == 560
              ? moment(new Date()).format("DD-MMM-YYYY")
              : ""
          );

          status.map((a) => {
            if (a.id == e.target.value) {
              products["rowData"]["Status"] = a.lkup_name;
              products["rowData"]["status_id"] = e.target.value;
            }
          });
        }}
      >
        <option value="558">{"<<Please Select>>"}</option>
        {status?.map((Item, index) => (
          <option
            key={index}
            value={Item.id}
            selected={Item.id == products.rowData.status_id ? true : false}
          >
            {Item.lkup_name}
          </option>
        ))}
      </select>
    );
  };

  const priceEditor = (products) => {
    const isInvoiceable = products.rowData.is_invoiceable == true ? 1 : 0;

    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <input
          type="checkbox"
          id="is_invoiceable"
          name="is_invoiceable"
          defaultChecked={isInvoiceable}
          onChange={(e) => products.editorCallback(e.target.checked ? 1 : 0)}
        />
      </div>
    );
  };

  const statusbodyAmount = (rowData) => {
    const Storeamount = rowData.amount;
    return (
      <>
        <input
          id="amount"
          value={Storeamount}
          type="text"
          title={Storeamount}
          required
          disabled
        />
      </>
    );
  };

  const statusbodyStatus_Id = (rowData) => {
    const Storestatus = rowData.Status;

    if (filterValue === null || filterValue === "[All]") {
      return (
        <>
          <input
            id="Status"
            value={Storestatus}
            type="text"
            title={Storestatus}
            required
            disabled
          />
        </>
      );
    } else if (Storestatus === filterValue) {
      const filteredData = products.filter((item) => {
        return item.Status === filterValue;
      });
      return (
        <>
          <input
            id="Status"
            value={filterValue}
            type="text"
            title={filterValue}
            required
            disabled
          />
        </>
      );
    } else {
      return null;
    }
  };

  const textEditorAmount = (products) => {
    const Storeamount = products.rowData.amount;

    const handleKeyPress = (e) => {
      const keyCode = e.keyCode || e.which;
      const keyValue = String.fromCharCode(keyCode);
      const regex = /^[0-9]*$/; // only allow digits
      if (!regex.test(keyValue)) {
        e.preventDefault();
      }
    };
    return (
      <>
        <input
          type="text"
          id="amount"
          autoComplete="off"
          value={Storeamount}
          onChange={(e) => products.editorCallback(e.target.value)}
          onKeyPress={handleKeyPress}
        />
      </>
    );
  };

  const statusbodyInvoiceId = (rowData) => {
    return (
      <>
        <input
          id="invoice_id"
          value={rowData.invoice_id}
          type="text"
          autoComplete="off"
          // className="form-control"
          required
          disabled
        />
      </>
    );
  };

  const statusbodyInvoiceStatus = (rowData) => {
    setEditId(rowData.id);
    return (
      <>
        <input
          id="invoice_status"
          value={rowData.invoice_status}
          type="text"
          title={rowData.invoice_status}
          autoComplete="off"
          // className="form-control"
          required
          disabled
        />
      </>
    );
  };

  const statusBodyComDate = (rowData) => {
    setEditId(rowData.id);
    return (
      <>
        <input
          id="completed_date"
          value={rowData.completed_date}
          type="text"
          title={rowData.completed_date}
          autoComplete="off"
          // className="form-control"
          required
          disabled
        />
      </>
    );
  };

  const bodyComments = (rowData) => {
    setEditId(rowData.id);
    return (
      <>
        <input
          id="comments"
          value={rowData.comments}
          type="text"
          title={rowData.comments}
          autoComplete="off"
          required
          disabled
          className="ellipsis"
        />
      </>
    );
  };

  const [completeDate, setCompleteDate] = useState();
  const textEditorCompleteDate = (products, options) => {
    return (
      <DatePicker
        name="completed_date"
        selected={completeDate}
        id="completed_date"
        value={
          storecomdate.length > 0
            ? storecomdate
            : products.rowData.completed_date
        }
        dateFormat="dd-MMM-yyyy"
        onChange={(e) => {
          products.editorCallback(moment(e).format("DD-MMM-yyyy")),
            setFormEditData((prev) => ({
              ...prev,
              ["completed_date"]: moment(e).format("yyyy-MM-DD"),
            }));
        }}
        onKeyDown={(e) => {
          e.preventDefault();
        }}
      />
    );
  };

  const textEditorComments = (products) => {
    return (
      <>
        <textarea
          type="text"
          id="comments"
          value={products.rowData.comments}
          onChange={(e) => products.editorCallback(e.target.value)}
        ></textarea>
      </>
    );
  };
  const getSeverity = (status) => {
    switch (status) {
      case "In Progress":
        return "In Progress";
      case "On Hold":
        return "On Hold";
      case "Completed":
        return "Completed";
      default:
        return "";
    }
  };
  const statusItemTemplate = (option) => {
    return (
      <Tag
        value={option}
        style={{ backgroundColor: "white", color: "black" }}
        severity={getSeverity(option)}
      />
    );
  };
  const [filterValue, setFilterValue] = useState("[All]");
  const [statuses] = useState(["[All]", "In Progress", "Completed", "On Hold"]);
  const [filteredData, setFilteredData] = useState(products);
  const statusRowFilterTemplate = (options) => {
    return (
      <Dropdown
        value={filterValue}
        options={statuses}
        onChange={(e) => {
          const selectedValue = e.value;
          setFilterValue(selectedValue);
          if (selectedValue === "[All]") {
            setFilteredData(products);
          } else {
            const filteredItems = products.filter(
              (item) => item.Status === selectedValue
            );
            setFilteredData(filteredItems);
          }
        }}
        itemTemplate={statusItemTemplate}
        className="p-column-filter"
        showClear={false}
      >
        <span className="p-dropdown-trigger-icon"></span>
      </Dropdown>
    );
  };

  const verifiedBodyTemplate = (rowData) => {
    return (
      <>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <i
            className={classNames("pi", {
              "true-icon pi-check-circle disableField": rowData.is_invoiceable,
              "false-icon pi-times-circle  disableField":
                !rowData.is_invoiceable,
            })}
          ></i>
        </div>
      </>
    );
  };
  const verifiedRowFilterTemplate = (options) => {
    return (
      <TriStateCheckbox
        value={options.value}
        onChange={(e) => options.filterApplyCallback(e.value)}
      />
    );
  };
  const [filterValue1, setFilterValue1] = useState({
    filters: {
      global: { value: null, matchMode: FilterMatchMode.CONTAINS },
      due_date: { value: null, matchMode: FilterMatchMode.CONTAINS },
    },
  });
  const handleFilterChange = (e) => {
    setFilteredDueDate(e.value);
  };
  const [filteredDueDate, setFilteredDueDate] = useState("");

  const filteredItems = useMemo(() => {
    if (filteredDueDate) {
      return products.filter(
        (item) =>
          new Date(item.due_date).getTime() ===
          new Date(filteredDueDate).getTime()
      );
    } else {
      return [];
    }
  }, [filteredDueDate]);

  const filteredData1 = useMemo(() => {
    return filteredDueDate ? filteredItems : [];
  }, [filteredDueDate, filteredItems]);

  const [matchingStatus, setMatchingStatus] = useState("");

  useEffect(() => {
    if (filteredDueDate && filteredData1.length === 0) {
      setMatchingStatus("not matched");
    } else if (
      filteredData1.length > 0 &&
      filteredData1[0]?.due_date !== undefined
    ) {
      setMatchingStatus("matched");
    } else {
      setMatchingStatus("");
    }
  }, [filteredDueDate, filteredData1]);
  const [filterValue2, setFilterValue2] = useState({
    filters: {
      global: { value: null, matchMode: FilterMatchMode.CONTAINS },
      completed_date: { value: null, matchMode: FilterMatchMode.CONTAINS },
    },
  });
  const [filteredCompleteDate, setFilteredCompleteDate] = useState("");
  const handleFilterChange2 = (e) => {
    setFilteredCompleteDate(e.value);
  };

  const filteredItemsCompletDate = useMemo(() => {
    if (filteredCompleteDate) {
      return products.filter(
        (item) =>
          new Date(item.completed_date).getTime() ===
          new Date(filteredCompleteDate).getTime()
      );
    } else {
      return [];
    }
  }, [filteredCompleteDate]);

  const filteredData2 = useMemo(() => {
    return filteredCompleteDate ? filteredItemsCompletDate : [];
  }, [filteredCompleteDate, filteredItemsCompletDate]);
  const [matchingStatusComDate, setMatchingStatusComDate] = useState("");

  useEffect(() => {
    if (filteredCompleteDate && filteredData2.length === 0) {
      setMatchingStatusComDate("not matched ComDate");
    } else if (
      filteredData2.length > 0 &&
      filteredData2[0]?.completed_date !== undefined
    ) {
      setMatchingStatusComDate("matched ComDate");
    } else {
      setMatchingStatusComDate("");
    }
  }, [filteredCompleteDate, filteredData2]);
  return (
    <>
      {addmsg ? (
        <div className="statusMsg success">
          <span className="errMsg">
            <BiCheck size="1.4em" strokeWidth={{ width: "100px" }} />{" "}
            &nbsp;Milestone saved successfully
          </span>
        </div>
      ) : (
        ""
      )}{" "}
      {editmsg ? (
        <div className="statusMsg success">
          <span className="errMsg">
            <BiCheck size="1.4em" strokeWidth={{ width: "100px" }} /> &nbsp;
            Milestone saved successfully
          </span>
        </div>
      ) : (
        ""
      )}
      {validateproject ? (
        <div className="statusMsg error">
          <span>
            <AiFillWarning /> &nbsp;Please provide valid values for highlighted
            values
          </span>
        </div>
      ) : (
        ""
      )}
      <div className="col-md-12 ">
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
            <h2>Milestones</h2>
          </div>
          <div className="childThree"></div>
        </div>
      </div>
      <div className="p-fluid delivery-monitoring-milestones-screen-table  darkHeader">
        <DataTable
          className="primeReactDataTable eventsTable "  /// customerEngament
          value={
            filteredData.length > 0
              ? filteredData
              : matchingStatus === "matched" ||
                matchingStatus === "not matched" ||
                matchingStatus.length < 0
              ? filteredData1
              : matchingStatusComDate === "matched ComDate" ||
                matchingStatusComDate === "not matched ComDate" ||
                matchingStatusComDate.length < 0
              ? filteredData2
              : products
          }
          editMode="row"
          onRowEditComplete={onRowEditComplete}
          showGridlines
          emptyMessage="No Data Found"
          scrollDirection="both"
          paginator
          rows={25}
          tableStyle={{ minWidth: "auto", width: "auto" }}
          rowHover
          dataKey="id"
          filters={filters.filters}
          paginationPerPage={5}
          rowsPerPageOptions={[10, 25, 50]}
          paginationRowsPerPageOptions={[5, 15, 25, 50]}
          filterDisplay="row"
          globalFilterFields={[
            "project_milestone",
            "status_id",
            "amount",
            "comments",
            "completed_date",
            "due_date",
          ]}
          paginationComponentOptions={{
            rowsPerPageText: "Records per page:",
            rangeSeparatorText: "out of",
          }}
          paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
          currentPageReportTemplate="View {first} - {last} of {totalRecords} "
        >
          <Column header="S.No" field="SNo" body={renderSNo}></Column>
          <Column
            field="project_milestone"
            header={
              <span>
                Milestone <span className="error-text">*</span>
                <FaInfoCircle className="tableInfoIcon" />
              </span>
            }
            sortable
            body={statusbodyMilestone}
            editor={(options) => textEditorMileStone(options)}
            alignHeader={"center"}
            filter
            filterMatchMode="contains"
          ></Column>
          <Column
            field="due_date"
            header={
              <span>
                Due Date <span className="error-text">*</span>
              </span>
            }
            sortable
            alignHeader={"center"}
            filter
            filterMatchMode="contains"
            body={statusbodyDueDate}
            editor={(options) => setDatePicker(options)}
          ></Column>
          <Column
            field="status"
            header="Status"
            filter={true}
            alignHeader="center"
            showFilterMenu={false}
            filterValue={filterValue}
            sortable
            editor={(options) => companyBodyTemplate(options)}
            body={statusbodyStatus_Id}
            filterMenuStyle={{ width: "14rem" }}
            filterElement={statusRowFilterTemplate}
            value={filteredData}
          ></Column>

          <Column
            field="is_invoiceable"
            header="Invoiceable"
            sortable
            alignHeader={"center"}
            dataType="boolean"
            body={verifiedBodyTemplate}
            filter
            filterElement={verifiedRowFilterTemplate}
            editor={(options) => priceEditor(options)}
            // style={{ width: "25%" }}
          ></Column>

          <Column
            field="amount"
            header="Amount *"
            sortable
            alignHeader={"center"}
            body={statusbodyAmount}
            editor={(options) => textEditorAmount(options)}
            // style={{ width: "40%" }}
            filter={true}
            filterFunction={(value, filter) => {
              if (!filter) {
                return true;
              }

              const filterOptions = filter.split(" ");
              return filterOptions.every((option) => {
                if (option.startsWith && !value.startsWith(option.startsWith)) {
                  return false;
                }

                if (option.endsWith && !value.endsWith(option.endsWith)) {
                  return false;
                }

                if (option.contains && !value.includes(option.contains)) {
                  return false;
                }

                return true;
              });
            }}
          ></Column>

          <Column
            field="invoice_id"
            header="Invoice"
            sortable
            alignHeader={"center"}
            body={statusbodyInvoiceId}
            // style={{ width: "25%" }}
            filter={true}
            filterFunction={(value, filter) => {
              if (!filter) {
                return true;
              }

              const filterOptions = filter.split(" ");
              return filterOptions.every((option) => {
                if (option.startsWith && !value.startsWith(option.startsWith)) {
                  return false;
                }

                if (option.endsWith && !value.endsWith(option.endsWith)) {
                  return false;
                }

                if (option.contains && !value.includes(option.contains)) {
                  return false;
                }

                return true;
              });
            }}
          ></Column>

          <Column
            field="invoice_status"
            header="Invoice Status"
            sortable
            alignHeader={"center"}
            body={statusbodyInvoiceStatus}
            // style={{ width: "25%" }}
            filter={true}
            filterFunction={(value, filter) => {
              if (!filter) {
                return true;
              }

              const filterOptions = filter.split(" ");
              return filterOptions.every((option) => {
                if (option.startsWith && !value.startsWith(option.startsWith)) {
                  return false;
                }

                if (option.endsWith && !value.endsWith(option.endsWith)) {
                  return false;
                }

                if (option.contains && !value.includes(option.contains)) {
                  return false;
                }

                return true;
              });
            }}
          ></Column>

          <Column
            field="completed_date"
            header="Completed Date"
            sortable
            alignHeader={"center"}
            filter
            filterMatchMode="contains"
            body={statusBodyComDate}
            editor={(options) => textEditorCompleteDate(options)}
            // style={{ width: "40%" }}
            // filterElement={
            //   <div style={{ position: "relative" }}>
            //     <Calendar
            //       value={filterValue2}
            //       onChange={handleFilterChange2}
            //       dateFormat="dd-M-yy"
            //     />
            //   </div>
            // }
          ></Column>

          <Column
            field="comments"
            header="Comments"
            sortable
            alignHeader={"center"}
            body={bodyComments}
            editor={(options) => textEditorComments(options)}
            // style={{ width: "40%" }}
            filter={true}
            filterFunction={(value, filter) => {
              if (!filter) {
                return true;
              }

              const filterOptions = filter.split(" ");
              return filterOptions.every((option) => {
                if (option.startsWith && !value.startsWith(option.startsWith)) {
                  return false;
                }

                if (option.endsWith && !value.endsWith(option.endsWith)) {
                  return false;
                }

                if (option.contains && !value.includes(option.contains)) {
                  return false;
                }

                return true;
              });
            }}
          ></Column>
          {/* 
          <Column
            rowEditor={() => {
              return <div>{"Edit"}</div>;
            }}
            header="Action"
            bodyStyle={{ textAlign: "center" }}
            style={{ width: "40px" }}
            title="Edit selected item"
          ></Column> */}
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
      {loader ? <Loader handleAbort={handleAbort} /> : ""}
    </>
  );
}
