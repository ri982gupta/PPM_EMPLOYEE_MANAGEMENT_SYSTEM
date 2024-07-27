import React, { useState, useEffect, useRef } from "react";
import { FilterMatchMode, FilterOperator } from "primereact/api";
import { DataTable } from "primereact/datatable";
import { BiCheck } from "react-icons/bi";
import { Link } from "react-router-dom";
import CustomerDialogBox from "./CustomerDialogBox";
import { InputText } from "primereact/inputtext";
import { IoWarningOutline } from "react-icons/io5";
import GlobalCancel from "../ValidationComponent/GlobalCancel";
import GlobalValidation from "../ValidationComponent/GlobalValidation";
import { Column } from "primereact/column";
import ExcelJS from "exceljs";

import {
  FaChevronCircleDown,
  FaChevronCircleUp,
  FaSearch,
  FaPlus,
  FaHistory,
  FaSave,
  FaCaretDown,
} from "react-icons/fa";

import moment from "moment/moment";
import ProjectReviewTable from "./ProjectReviewTable";
import { CCollapse } from "@coreui/react";
import Loader from "../Loader/Loader";
import { ColumnGroup } from "primereact/columngroup";
import { Row } from "primereact/row";
import ReviewLogAdd from "./ReviewLogAdd";
import "../../App.scss";
import { ReactSearchAutocomplete } from "react-search-autocomplete";
import axios from "axios";
import { environment } from "../../environments/environment";
import { MultiSelect } from "react-multi-select-component";
import SelectCustDialogBox from "../Customer/SelectCustDialogBox";
import GlobalHelp from "../PrimeReactTableComponent/GlobalHelp";
import DatePicker from "react-datepicker";
import ProjectReviewDatePicker from "./ProjectReviewDateComponent";
import "./ProjectReviews.scss"

const stateSelectItems = [
  { label: "Design Review", value: "1021" },
  { label: "Code Review", value: "1022" },
  { label: "Management Review", value: "1023" },
];

function ProjectReviews({ urlState, setVisible, visible, setCheveronIcon, maxHeight1}) {
  const HelpPDFName = "ReviewProject.pdf";
  const Headername = "Project Review Help";
  const [routes, setRoutes] = useState([]);
  let textContent = "Delivery";
  let currentScreenName = ["Projects", "Project Reviews"];
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
  }, []);

  document.documentElement.style.setProperty(
    "--dynamic-value",
    String(maxHeight1 -132) + "px"
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
      
      data.forEach((item) => {
        if (item.display_name === textContent) {
          setRoutes([item]);
          sessionStorage.setItem("displayName", item.display_name);
        }
      });
    });
  };
  const [globalFilterValue1, setGlobalFilterValue1] = useState("");

  const headerGroup = (
    <ColumnGroup>
      <Row>
        <Column header="Status" rowSpan={2} />
        <Column
          header="Project Details"
          colSpan={4}
          style={{ textAlign: "center" }}
        />
        <Column header="Last Review" rowSpan={2} />
        <Column header="Scheduled Date" colSpan={3} />
        <Column header="Action" rowSpan={2} />
      </Row>

      <Row>
        <Column header="Project Name" field="projectName" title="projectName" />
        <Column header="Project Start Date" field="prjStartDate" />
        <Column header="Customer" field="customer" />
        <Column header="Project Stage" field="prjStatus" />
        <Column header="Review Type" field="reviewType" />
        <Column header="Review Status" field="revStatusDtl" />
        <Column header="Review Date" field="scheduledDate" />
      </Row>
    </ColumnGroup>
  );
  const reviewheaderGroup = (
    <ColumnGroup>
      <Row>
        <Column
          header="Project Details"
          colSpan={4}
          style={{ textAlign: "center" }}
        />
        <Column header="Review Details" colSpan={5} />
        <Column header="Action" rowSpan={2} />
      </Row>

      <Row>
        <Column header="Project Name" field="projectName" title="projectName" />
        <Column header="Project Start Date" field="prjStartDate" />
        <Column header="Customer" field="customer" />
        <Column header="Project Stage" field="prjStatus" />
        <Column header="Review Type" field="reviewType" />
        {/* <Column header="Review Status" field="revStatusDtl" /> */}
        <Column header="Scheduled Date" field="scheduledDate" />
        <Column header="Completed Date" field="lastReviewDate" />
        <Column header="Reviewer" field="reviewer" />
        <Column header="Comments" field="comments" />
      </Row>
    </ColumnGroup>
  );
  let variance = 1;

  const now = new Date();
  const [updateMsg, setUpdateMsg] = useState(false);
  const [visiblepopup, setVisiblepopup] = useState(false);
  const [newMemberDropdown, setnewMemberDropdown] = useState([]);
  const loggedUserId = localStorage.getItem("resId");
  const [cid, setCid] = useState(-1);
  const [linkColumns, setLinkColumns] = useState([]);
  const [linkColumnsRoutes, setLinkColumnsRoutes] = useState([]);
  const [historyId, setHistoryId] = useState([]);
  const [status, setStatus] = useState([]);
  const [custVisible, setCustVisible] = useState(false);

  const [selectedRowsData, setSelectedRowsData] = useState("");
  const [exportData, setExportData] = useState([]);
  const [validationMessage, setValidationMessage] = useState(false);
  const [validateproject, setValidateproject] = useState(false);
  const [reviewdatevalid, setreviewdatevalid] = useState("");
  const [validproject, setValidProject] = useState(false);
  const [state, setState] = useState(stateSelectItems);
  const [revStatusvalue, setRevStatusvalue] = useState("");

  const initialValue = {
    scheduled_date: "",
    review_status_id: "",
  };
  const [formData, setFormData] = useState(initialValue);

  const [selectedItems, setSelectedItems] = useState([{}]);

  const Customer = selectedItems?.map((d) => d?.id).toString();

  useEffect(() => {}, [Customer], [formData.serarchVals]);

  const [open, setOpen] = useState(false);
  const [projectName, setProjectname] = useState(-1);
  const [projectStage, setProjectStage] = useState(1);
  const [projectSource, setProjectSource] = useState(-1);
  const [reviewStatus, setReviewStatus] = useState(-1);
  const [view, setView] = useState(false);
  // const [visible, setVisible] = useState(false);
  // const [cheveronIcon, setCheveronIcon] = useState(FaChevronCircleUp);
  const [fromdate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const ref = useRef([]);
  const abortController = useRef(null);

  // const [scheduledDateValidation, setScheduleDateValidation] = useState(false);
  const [summaryDatagetPayload, setsummaryDatagetPayload] = useState({
    executives: -2,
  });

  const [loader, setLoader] = useState(false);
  const [searching, setSearching] = useState(false);
  const [reviewSatussearch, setReviewStatussearch] = useState(false);

  const [tableData, setTableData] = useState([]);
  const [history, setHistory] = useState(FaHistory);
  const [plus, setPlus] = useState(FaPlus);
  const [manager, setManager] = useState([]);
  const [scheduledDateval, setscheduledDate] = useState();
  const [projectId, setProjectId] = useState([]);
  const [customer, setCustomer] = useState([]);
  const baseUrl = environment.baseUrl;
  const initialV = {
    userId: "",
  };
  const [customerSelect, setCustomerSelect] = useState(initialV);
  const [business, setBusiness] = useState([]);
  const [selectedBusiness, setSelectedBusiness] = useState([]);
  const [searchDepartment, setSearchDepartment] = useState(-1);
  const [data, setData] = useState([]);
  const [reviewType, setReviewType] = useState(1021);
  const [customerId, setcustomerId] = useState(-1);
  const [reviewTypevalue, setReviewTypevalue] = useState();
  const [totaldata, settotalData] = useState();

  const [headerData, setHeaderData] = useState([]);
  const [revDate, setRevDate] = useState();

  const [selectedCustomer, setSelectedCustomer] = useState(null);

  useEffect(() => {
    data[0] && setHeaderData(JSON.parse(JSON.stringify(data[0])));
    let imp = ["XLS"];
    setExportData(imp);
  }, [data]);
  const onChangeHandler = (e) => {
    const inputValue = e.target.value;

    const { id, value } = e.target;
    const regex = /^[0-9.]*$/;

    // Use a regular expression to validate the input as a number with optional decimal point
    if (!regex.test(inputValue)) {
      e.target.value = "";
    }
    setCustomerSelect((prev) => ({ ...prev, [e.target.id]: value }));
  };
  const getBusinessUnit = () => {
    axios
      .get(baseUrl + `/CostMS/cost/getDepartments`)
      .then((Response) => {
        let countries = [];
        let data = Response.data;
        data.length > 0 &&
          data.forEach((e) => {
            let countryObj = {
              label: e.label,
              value: e.value,
            };
            countries.push(countryObj);
          });
        setBusiness(countries);
        setSelectedBusiness(countries);
      })
      .catch((error) => console.log(error));
  };

  const selectedCust = JSON.parse(localStorage.getItem("selectedCust"))
    ?.map((d) => d.id)
    ?.toString();

  const getcustData = () => {
    axios
      .get(baseUrl + `/CommonMS/master/geActiveCustomerList`)
      .then((resp) => {
        let customers = [];

        let data = resp.data;

        data.length > 0 &&
          data.forEach((e) => {
            let countryObj = {
              label: e.fullName,
              value: e.id,
            };

            customers.push(countryObj);
          });
        setCustomer(customers);
        // setSelectCustomer(customers);
      })
      .catch((error) => console.log(error));
  };

  const exportExcel = () => {
    import("xlsx").then((xlsx) => {
      const headers = Object.keys(data[0]);

      const uniqueHeaders = [...new Set(headers)]; // Remove duplicates

      uniqueHeaders.shift(); // Remove the first element (1st column header)

      const worksheetData = data.map((item) =>
        uniqueHeaders.map((header) => {
          const value = item[header];

          if (header === "scheduledDate" && moment(value).isValid()) {
            return moment(value).format("DD-MMM-YYYY");
          } else {
            return value;
          }
        })
      );

      const dataRows = worksheetData.map((item) => Object.values(item));

      const workbook = new ExcelJS.Workbook();

      const worksheet = workbook.addWorksheet("ProjectSearchResultsData");

      for (let i = 0; i < dataRows.length; i++) {
        const row = worksheet.addRow(dataRows[i]);
      }

      const boldRow = [1];

      boldRow.forEach((index) => {
        const row = worksheet.getRow(index);

        row.font = { bold: true };
      });

      workbook.xlsx.writeBuffer().then((buffer) => {
        const blob = new Blob([buffer], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });

        saveAs(blob, "ProjectSearchResultsData");
      });
    });
  };
  const clearFilter1 = () => {
    initFilters1();
  };
  // has context menu
  const initFilters1 = () => {
    setGlobalFilterValue1("");
  };
  const filtersData = {
    contains: { value: null, matchMode: FilterMatchMode.CONTAINS },
  };

  const [filters1, setFilters1] = useState({
    global: filtersData["contains"],
  });

  useEffect(() => {
    setFilters1({
      global: filtersData["contains"],
    });
  }, [headerData]);

  const onGlobalFilterChange1 = (e) => {
    const value = e.target.value;
    let _filters1 = { ...filters1 };
    _filters1["global"].value = value;
    setFilters1(_filters1);
    setGlobalFilterValue1(value);
  };
  const renderHeader = () => {
    const value = filters1["global"] ? filters1["global"].value : "";

    return (
      <div className="flex  flex-row-reverse">
        <div className="exportBtn ml-3">
          {exportData?.includes("XLS") && (
            <span
              className="pi pi-file-excel excel"
              onClick={exportExcel}
              title="Export to Excel"
            />
          )}
        </div>

        <span className="p-input-icon-left tableGsearch">
          <i className="pi pi-search" />
          <InputText
            defaultValue={globalFilterValue1}
            onChange={onGlobalFilterChange1}
            placeholder="Keyword Search"
          />
        </span>
      </div>
    );
  };

  const header = renderHeader();

  const getManagerdata = () => {
    axios({
      method: "get",
      url: baseUrl + `/dashboardsms/allocationDashboard/getManagers`,
    }).then(function (response) {
      var resp = response.data;
      setManager(resp);
    });
  };
  const handleAbort = () => {
    abortController.current && abortController.current.abort();
    setLoader(false);
  };
  const handleClick = () => {
    if (reviewStatus === "1019") {
      if (fromdate === "" || toDate === "") {
        setValidProject(true);
      } else {
        // Both fromdate and toDate are filled, validation passes

        setValidProject(false);
        setReviewStatussearch(false);
        // setLoader(true);
        setTimeout(() => {
          setLoader(true);
          // Use another setTimeout to fetch data after 2 seconds
          setTimeout(() => {
            getData(); // Fetch data after 2 seconds
            setLoader(false); // Hide the loader when data is loaded
          }, 1000); // 2-second delay for data fetching
        }, 1000);
        // getData();
        setValidateproject(false);
        initFilters1();
      }
    } else if (fromdate !== "" || toDate !== "" || reviewStatus != "1019") {
      setValidationMessage(false);
      setSearching(false);

      // setLoader(true);
      setTimeout(() => {
        setLoader(true);
        // Use another setTimeout to fetch data after 2 seconds
        setTimeout(() => {
          getData(); // Fetch data after 2 seconds
          setLoader(false); // Hide the loader when data is loaded
        }, 1000); // 2-second delay for data fetching
      }, 1000);
      // getData();
      setValidateproject(false);
      initFilters1();
    } else {
      setValidationMessage(false);
      setSearching(false);
      // setLoader(true);
      setTimeout(() => {
        setLoader(true);
        // Use another setTimeout to fetch data after 2 seconds
        setTimeout(() => {
          getData(); // Fetch data after 2 seconds
          setLoader(false); // Hide the loader when data is loaded
        }, 1000); // 2-second delay for data fetching
      }, 1000);
      // getData();
      setValidateproject(false);
      initFilters1();
    }
    setCustomerSelect(initialV);
  };

  const getData = () => {
    // = async () => {
    //   await

    axios({
      method: "post",
      url: baseUrl + `/governancems/pcqa/getreviews`,
      data: {
        prjStr: cid,
        buIds: searchDepartment,
        custIds: customerId == "select" ? selectedCust : +customerId,
        prjStage: +projectStage,
        reviewType:
          reviewStatus == "1019"
            ? resultString
            : reviewType == ""
            ? 1021
            : reviewType,
        reviewStatus: reviewStatus,
        prjSource: projectSource,
        fromDt: fromdate == "" ? -1 : moment(fromdate).format("YYYY-MM-DD"),
        toDt: toDate == "" ? -1 : moment(toDate).format("YYYY-MM-DD"),
        prjManager: customerSelect.userId == "" ? -1 : customerSelect.userId,
      },
    }).then((response) => {
      let GetData = response.data.data;

      // setData(response.data.data)
      let headerdata = [
        {
          sno: "S.No",
          projectName: "Project Name",
          prjStartDate: "Project Start Date",
          customer: "Customer",
          prjStatus: "Project Stage",
          lastReviewDate: "Last Review",
          reviewType: "Review Type",
          revStatusDtl: "Review Status",
          scheduledDate: "Review Date",
          Risk_status: "",
        },
      ];

      for (let i = 0; i < GetData.length; i++) {
        GetData[i]["prjStartDate"] =
          GetData[i]["prjStartDate"] == null
            ? ""
            : moment(GetData[i]["prjStartDate"]).format("DD-MMM-yyyy");
        GetData[i]["lastReviewDate"] =
          GetData[i]["lastReviewDate"] == null
            ? " "
            : moment(GetData[i]["lastReviewDate"]).format("DD-MMM-yyyy");
      }

      setData(headerdata.concat(GetData));
      let data1 = ["projectName"];
      let linkRoutes = [`/project/Overview/`];
      setLinkColumns(data1);
      setLinkColumnsRoutes(linkRoutes);
      setTableData(GetData);
      // setTimeout(() => {
      setLoader(false);

      // }, 5000);
      setVisible(!visible);
      visible
        ? setCheveronIcon(FaChevronCircleUp)
        : setCheveronIcon(FaChevronCircleDown);
      setSearching(true);
      //   setTableData(data);
    });
  };
  useEffect(() => {
    data[0] && setHeaderData(JSON.parse(JSON.stringify(data[0])));
  }, [data]);

  useEffect(() => {
    getcustData();
    getManagerdata();
    getBusinessUnit();
    getnewMemberDropdown();
    getUrlPath();
  }, []);
  const getUrlPath = () => {
    axios({
      method: "get",
      url:
        baseUrl +
        `/CommonMS/security/authorize?url=${urlState}&userId=${loggedUserId}`,
    }).then((res) => {
      console.log(res, "urlResponse");
    });
  };
  const getnewMemberDropdown = () => {
    axios
      .get(baseUrl + "/ProjectMS/Engagement/getCustomerName")
      .then((resp) => {
        const data = resp.data;
        data.sort((a, b) => a.name > b.name);
        const dropdownOptions = data.map((item) => {
          return (
            <option key={item.userId} value={item.resourcesId}>
              {item.name}
            </option>
          );
        });
        setnewMemberDropdown(dropdownOptions);
      })
      .catch((err) => {});
  };

  const initialValue1 = {};
  const [postData, setpostData] = useState(initialValue1);

  const initialValue2 = {};
  const [dateData, setDateData] = useState(initialValue2);
  const [selectedvalidation, setselectedValidation] = useState("");
  const [selecteddatevalidation, setselecteddatevalidation] = useState("");
  const [isDateValid, setIsDateValid] = useState();
  const [changedRows, setChangedRows] = useState(new Map());
  const ArrowRenderer = ({ expanded }) => (
    <>
      {expanded ? (
        <FaCaretDown className="chevronIcon" />
      ) : (
        <FaCaretDown className="chevronIcon" />
      )}
    </>
  );
  const selectedValues = state.map((selectedItem) =>
    selectedItem.value.toString()
  );

  // Join the array elements into a single string with double quotes
  const resultString = selectedValues.join(",");

  const updateStatus = () => {
    let data = [];

    if (
      (selectedRowsData === "" && selecteddatevalidation == "") ||
      selecteddatevalidation == undefined ||
      selecteddatevalidation == null
    ) {
      setValidationMessage(true);
      setTimeout(() => {
        setValidationMessage(false);
      }, 3000);

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    } else {
      setValidationMessage(false);
      Object?.keys(postData)?.forEach((ele) => {
        if (postData[ele].projectId !== undefined) {
          const matchingItem = tableData.find(
            (item) => item.reviewId === postData[ele].reviewId
          );
          setselectedValidation(postData[ele].date);
          const obj = {};
          obj["id"] = +ele;
          obj["projectId"] = postData[ele]?.projectId;
          // obj["completed_date"] = "2023-12-01";
          obj["scheduledDate"] =
            postData[ele]?.selectedDate == undefined
              ? matchingItem?.scheduledDate
              : moment(postData[ele]?.selectedDate).format("YYYY-MM-DD");
          (obj["revType"] = +reviewType),
            (obj["statusId"] =
              postData[ele]?.revStatus == null ||
              postData[ele]?.revStatus == undefined
                ? matchingItem?.revStatus
                : +postData[ele]?.revStatus),
            (obj["loggedId"] = +loggedUserId),
            data.push(obj);
        }
      });

      let isDateValidTemp = true;
      changedRows.forEach((value, key) => {
        const updatedScheduledDate = value.scheduledDate;
        setreviewdatevalid(value.scheduledDate);

        if (
          updatedScheduledDate === null ||
          updatedScheduledDate === "" ||
          updatedScheduledDate === undefined
        ) {
          isDateValidTemp = false;
        }
      });

      if (!isDateValidTemp) {
        setValidateproject(true);
        window.scrollTo({
          top: 0,
          behavior: "smooth",
        });
      } else {
        axios({
          method: "post",
          url: baseUrl + `/ProjectMS/project/updateReviewProjects`,
          data: data,
        })
          .then((res) => {
            const responseData = res.data;

            setSelectedRowsData("");
            setselecteddatevalidation("");
            setValidateproject(false);
            setUpdateMsg(true);
            setSearching(false);
            setLoader(true);

            // setpostData({});
            window.scrollTo({
              top: 0,
              behavior: "smooth", // Use "auto" for instant scrolling
            });
            getData();
            setpostData(initialValue1);
            setTimeout(() => {
              setUpdateMsg(false);
              setSearching(true);
              setLoader(false);
            }, 2000);
          })
          .catch((error) => {
            console.log("Response Data:", error); // Log the response data
          });
      }
      //Else default will be true
    }
  };

  const LinkTemplate = (data) => {
    let legendElement = null;

    if (
      data.scheduledDate < moment(new Date()).format("YYYY-MM-DD") &&
      (data.revStatus == "1018" || data.revStatus == "1017")
    ) {
      legendElement = (
        <div className="legendContainer align center">
          <div className="legend red">
            <div className="legendCircle" title="Risk">
              {" "}
            </div>
            {/* <div className="legendCircle" align="center"></div> */}
            <div className="legendTxt"></div>
          </div>
        </div>
      );
    } else if (
      data.scheduledDate == moment(new Date()).format("YYYY-MM-DD") &&
      (data.revStatus == "1018" || data.revStatus == "1017")
    ) {
      legendElement = (
        <div className="legendContainer align center">
          <div className="legend amber">
            <div className="legendCircle" title="Risk">
              <div className="legendTxt"></div>
            </div>
          </div>
        </div>
      );
    } else {
      legendElement = (
        <div className="legendContainer align center">
          <div className="legend green">
            <div className="legendCircle" title="Risk"></div>
            <div className="legendTxt"></div>
          </div>
        </div>
      );
    }
    return <div className="ellipsis">{legendElement}</div>;
  };
  const Customerbody = (rowData) => {
    return (
      <div title={rowData.customer} className="ellipsis">
        {rowData.customer}
      </div>
    );
  };
  const ScheduledDate = (rowData) => {
    return (
      <div
        style={{ textAlign: "center" }}
        title={rowData.scheduledDate}
        className="ellipsis"
      >
        {moment(rowData.scheduledDate).format("DD-MMM-YYYY")}
      </div>
    );
  };
  const CompletedDate = (rowData) => {
    return (
      <div
        style={{ textAlign: "center" }}
        title={rowData.lastReviewDate}
        className="ellipsis"
      >
        {moment(rowData.lastReviewDate).format("DD-MMM-YYYY")}
      </div>
    );
  };
  const onchangeStatus = (statusValue, reviewId, projectId) => {
    setSelectedRowsData(statusValue);
    setpostData((prevData) => ({
      ...prevData,
      [reviewId]: {
        revStatus: statusValue,
        reviewId: reviewId,
        projectId: projectId,
      },
    }));

    const newMap = new Map(changedRows);
    const updatedSelectedCustomer = {
      ...selectedCustomer,
      revStatus: statusValue,
    };
    newMap.set(updatedSelectedCustomer.id, updatedSelectedCustomer);
    setChangedRows(newMap);
  };
  useEffect(() => {}, [postData]);

  const selecttag = (data) => {
    setStatus(data.revStatus);
    setscheduledDate(data.scheduledDate);
    setProjectname(data.projectName);
    setHistoryId(data.reviewId);

    return (
      <>
        <select
          id="review_status_id"
          onChange={(e) => {
            const review_status_id = e?.target?.value;
            const reviewId = data?.reviewId;
            onchangeStatus(review_status_id, reviewId, data?.id);
          }}
          defaultValue={data?.revStatus}
        >
          <option value="1016">To be Scheduled</option>
          <option value="1017">Scheduled</option>
          <option value="1018">Delayed</option>
          <option value="1019">Completed</option>
        </select>
      </>
    );
  };

  const selectedDate = (rowData) => {
    return (
      <div className="datepicker">
        <ProjectReviewDatePicker
          setValidateproject={setValidateproject}
          selectedvalidation={selectedvalidation}
          validateproject={validateproject}
          setselecteddatevalidation={setselecteddatevalidation}
          selectedCustomer={selectedCustomer}
          changedRows={changedRows}
          setChangedRows={setChangedRows}
          reviewdatevalid={reviewdatevalid}
          // reviewStatusChangedMap={reviewStatusChangedMap}
          setFormData={setFormData}
          formData={formData}
          postData={postData}
          setpostData={setpostData}
          rowData={rowData}
          id="scheduledDate"
          // className="cancel"
          className={rowData.className}
          // setDisable={setDisable}
          // setIsModified={setIsModified}
          setDateData={setDateData}
          dateFormat="dd-MMM-yyyy"
          placeholderText="Select Month"
          showYearDropdown
          showMonthDropdown
        />
      </div>
    );
  };
  const redirectLink = (data) => {
    let rou = linkColumnsRoutes[0]?.split(":");
    return (
      <>
        <Link
          target="_blank"
          to={rou[0] + ":" + data.id}
          data-toggle="tooltip"
          title={data.projectName}
        >
          {data[linkColumns[0]]}
        </Link>
      </>
    );
  };

  const popUpIcons = (data) => {
    return (
      <div className="col-md-12">
        <div style={{ display: "flex", cursor: "pointer" }}>
          <div style={{ minWidth: "20px" }}>
            {data.revStatus == "1018" || data.revStatus == "1017" ? (
              <div
                onClick={() => {
                  setPlus(FaPlus);
                  settotalData(data);
                  setProjectId(data.id);

                  setOpen(true);
                }}
                title="Add Action Items"
              >
                {plus}
              </div>
            ) : null}
          </div>
          <div
            onClick={() => {
              setHistory(FaHistory);
              setProjectId(data.id);
              setView(true);
            }}
            title="Show History"
          >
            {history}
          </div>
        </div>
      </div>
    );
  };

  const generateDropdownLabel = (selectedOptions, allOptions) => {
    const selectedValues = selectedOptions.map((option) => option.value);
    const allValues = allOptions.map((item) => item.value);

    if (selectedValues.length === allValues.length) {
      return "<< ALL >>";
    } else {
      return selectedOptions.map((option) => option.label).join(", ");
    }
  };
  const handleChange1 = (e) => {
    const { id, name, value } = e.target;
    if (name == "Customer" && value === "select") {
      setCustVisible(true);
    }
    setcustomerId(e.target.value);
  };
  return (
    <div className="Project-Reviews-screen-Margin">
      {updateMsg ? (
        <div className="statusMsg success">
          <span className="errMsg">
            <BiCheck />
            &nbsp; Data Saved Successfully
          </span>
        </div>
      ) : (
        ""
      )}
      {validproject ? (
        <div className="statusMsg error">
          {" "}
          <span>
            {" "}
            <IoWarningOutline /> Please select valid values for highlighted
            fields
          </span>
        </div>
      ) : (
        ""
      )}
      {validationMessage ? (
        <div className="statusMsg error">
          {" "}
          <span>
            {" "}
            <IoWarningOutline /> No modifications to save
          </span>
        </div>
      ) : (
        ""
      )}
      {validateproject ? (
        <div className="statusMsg error">
          {" "}
          <span>
            {" "}
            <IoWarningOutline /> Please select Review Date
          </span>
        </div>
      ) : (
        ""
      )}
      <div className="col-md-12">
        {/* <div className="pageTitle">
          <div className="childOne"></div>
          <div className="childTwo">
            <h2>Project Reviews</h2>
          </div>
          <div className="childThree"></div>
        </div> */}
      </div>
      <div className="form-group customCard">
        <div className="col-md-12 collapseHeader">
        </div>
        <CCollapse visible={!visible}>
          <div className="group-content row">
            <div className=" col-md-3 mb-2">
              <div className="form-group row">
                <label className="col-5" htmlFor="projectname">
                  Project Name
                </label>
                <span className="col-1 p-0">:</span>
                <div className="col-6">
                  <input
                    type="text"
                    className="form-control"
                    id="prjStr"
                    placeholder
                    onChange={(e) => {
                      setCid(e.target.value);
                    }}
                  />
                </div>
              </div>
            </div>
            <div className=" col-md-3 mb-2">
              <div className="form-group row">
                <label className="col-5" htmlFor="projectmanager">
                  Project Manager
                </label>
                <span className="col-1 p-0">:</span>

                <div className="col-6">
                  <div className="autoComplete-container ">
                    <span className="auto" id="auto">
                      <div className="autoComplete-container">
                        <ReactSearchAutocomplete
                          items={manager}
                          type="Text"
                          name="assignedto"
                          id="assignedto"
                          manager={manager}
                          onChange={(e) => {
                            onChangeHandler(e);
                          }}
                          getManagerdata={getManagerdata}
                          className="AutoComplete"
                          placeholder="Type minimum 3 Characters"
                          // onSelect={(e) => {
                          //   setCustomerSelect(e.id);
                          // }}
                          showIcon={false}
                          onSelect={(e) => {
                            setCustomerSelect((prevProps) => ({
                              ...prevProps,
                              userId: e.id,
                            }));
                          }}
                        />
                      </div>
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className=" col-md-3 mb-2">
              <div className="form-group row">
                <label className="col-5" htmlFor="bu">
                  BU
                </label>
                <span className="col-1 p-0">:</span>

                <div className="col-6 multiselect">
                  <MultiSelect
                    ArrowRenderer={ArrowRenderer}
                    id="businessUnit"
                    options={business}
                    hasSelectAll={true}
                    valueRenderer={generateDropdownLabel}
                    value={selectedBusiness}
                    disabled={false}
                    onChange={(s) => {
                      setSelectedBusiness(s);
                      let filteredValues = [];
                      s.forEach((d) => {
                        filteredValues.push(d.value);
                      });
                      console.log(filteredValues);
                      setSearchDepartment(
                        filteredValues.length >= 13
                          ? -1
                          : filteredValues.toString()
                      );
                    }}
                  />
                </div>
              </div>
            </div>

            <div className=" col-md-3 mb-2">
              <div className="form-group row">
                <label className="col-5" htmlFor="customer">
                  Customer&nbsp;<span className="error-text">*</span>
                </label>
                <span className="col-1 p-0">:</span>
                <div className="col-6">
                  <select
                    name="Customer"
                    id="Customer"
                    onChange={handleChange1}
                  >
                    {selectedItems.length + "selected"}
                    <option value="-1">&lt;&lt;ALL&gt;&gt;</option>
                    <option value="-1">BU Customer</option>
                    <option value="select">Select</option>
                  </select>
                </div>
              </div>
            </div>
            <div className=" col-md-3 mb-2">
              <div className="form-group row">
                <label className="col-5" htmlFor="projectstage">
                  Project Stage
                </label>
                <span className="col-1 p-0">:</span>
                <div className="col-6">
                  <select
                    id="projectstage"
                    onChange={(e) => {
                      setProjectStage(e.target.value);
                    }}
                  >
                    <option value="null">{"<<ALL>>"}</option>
                    <option value="1" selected>
                      In Progress
                    </option>
                    <option value="2">Completed</option>
                    <option value="4">On Hold</option>
                  </select>
                </div>
              </div>
            </div>
            <div className=" col-md-3 mb-2">
              <div className="form-group row">
                <label className="col-5" htmlFor="projectsource">
                  Project Source
                </label>
                <span className="col-1 p-0">:</span>
                <div className="col-6">
                  <select
                    id="projectsource"
                    onChange={(e) => {
                      setProjectSource(e.target.value);
                    }}
                  >
                    <option value="-1">&lt;&lt;ALL&gt;&gt;</option>
                    <option value="PPM">PPM</option>
                    <option value="Projector">Projector</option>
                  </select>
                </div>
              </div>
            </div>
            <div className=" col-md-3 mb-2">
              <div className="form-group row">
                <label className="col-5" htmlFor="reviewstatus">
                  Review Status
                </label>
                <span className="col-1 p-0">:</span>
                <div className="col-6">
                  <select
                    id="reviewstatus"
                    onChange={(e) => {
                      setReviewStatus(e.target.value);
                    }}
                  >
                    <option value="-1"> &lt;&lt;ALL&gt;&gt;</option>
                    <option value="1016">To be Scheduled</option>
                    <option value="1017">Scheduled</option>
                    <option value="1018">Delayed</option>
                    <option value="1019">Completed</option>
                  </select>
                </div>
              </div>
            </div>
            {reviewStatus == "1019" ? (
              <>
                <div className=" col-md-3 mb-2">
                  <div className="form-group row">
                    <label className="col-5" htmlFor="reviewtype">
                      From Date&nbsp;<span className="error-text">*</span>
                    </label>
                    <span className="col-1 p-0">:</span>
                    <div className="col-6">
                      <div>
                        <DatePicker
                          name="fromdate"
                          autoComplete="off"
                          id="fromdate"
                          dropdownMode="select"
                          selected={fromdate}
                          className={` ${validproject ? "error-block" : ""}`}
                          dateFormat="dd-MMM-yyyy"
                          maxDate={new Date()}
                          onKeyDown={(e) => {
                            e.preventDefault();
                          }}
                          onChange={(e) => {
                            setFromDate(e);
                          }}
                          showMonthDropdown
                          showYearDropdown
                        />{" "}
                      </div>
                    </div>
                  </div>
                </div>
                <div className=" col-md-3 mb-2">
                  <div className="form-group row">
                    <label className="col-5" htmlFor="reviewtype">
                      To Date&nbsp;<span className="error-text">*</span>
                    </label>
                    <span className="col-1 p-0">:</span>
                    <div className="col-6">
                      <div>
                        <DatePicker
                          name="todate"
                          id="todate"
                          dropdownMode="select"
                          autoComplete="off"
                          selected={toDate}
                          className={` ${validproject ? "error-block" : ""}`}
                          dateFormat="dd-MMM-yyyy"
                          minDate={fromdate}
                          maxDate={new Date()}
                          onKeyDown={(e) => {
                            e.preventDefault();
                          }}
                          onChange={(e) => {
                            setToDate(e);
                          }}
                          showYearDropdown
                          showMonthDropdown
                        />{" "}
                      </div>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              ""
            )}

            {reviewStatus == "1019" ? (
              <div className=" col-md-3 mb-2">
                <div className="form-group row">
                  <label className="col-5" htmlFor="reviewtype">
                    {" "}
                    Review Type
                  </label>
                  <span className="col-1 p-0">:</span>

                  <div className="col-6 multiselect">
                    <MultiSelect
                      value={state}
                      options={stateSelectItems}
                      placeholder="Select state..."
                      display="chip"
                      valueRenderer={generateDropdownLabel}
                      ArrowRenderer={ArrowRenderer}
                      onChange={(s) => {
                        setState(s);
                        let filteredValues = [];
                        s.forEach((d) => {
                          filteredValues.push(d.value);
                        });
                      }}
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className=" col-md-3 mb-2">
                <div className="form-group row">
                  <label className="col-5" htmlFor="reviewtype">
                    Review Type
                  </label>
                  <span className="col-1 p-0">:</span>
                  <div className="col-6">
                    <select
                      id="reviewtype"
                      onChange={(e) => {
                        setReviewType(e.target.value);
                      }}
                    >
                      <option value="1021">Design Review</option>
                      <option value="1022">Code Review</option>
                      <option value="1023">Management Review</option>
                    </select>
                  </div>
                </div>
              </div>
            )}
            <div className="col-md-12 col-sm-12 col-xs-12 my-2 btn-container center">
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleClick}
              >
                <FaSearch /> Search{" "}
              </button>
            </div>
          </div>

          {loader ? <Loader handleAbort={handleAbort} /> : ""}
        </CCollapse>
      </div>
      {searching && reviewStatus !== "1019" ? (
        <div className="darkHeader DeliveryProjectReviews">
          <DataTable
            className="primeReactDataTable invoicingSearchTable" ////customerEngament
            paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
            currentPageReportTemplate="{first} to {last} of {totalRecords}"
            rowsPerPageOptions={[10,25, 50]}
            value={tableData}
            paginator
            rows={25}
            header={header}
            filters={filters1}
            selection={selectedCustomer}
            onSelectionChange={(e) => setSelectedCustomer(e?.value)}
            selectionMode="single"
            dataKey="id"
            showGridlines
            // stateStorage="session"
            // stateKey="dt-state-demo-local"
            emptyMessage="No Records To View."
            // tableStyle={{ minWidth: "50rem" }}
            // tableStyle={{ minWidth: "auto", width: "auto" }}
            headerColumnGroup={headerGroup}
          >
            <Column field="product" body={LinkTemplate} />
            <Column field="projectName" body={redirectLink} />
            <Column field="prjStartDate" style={{ textAlign: "center" }} />
            <Column field="customer" body={Customerbody} />
            <Column field="prjStatus" />
            <Column field="lastReviewDate" style={{ textAlign: "center" }} />
            <Column field="reviewType" />
            <Column field="revStatusDtl" body={selecttag} />
            <Column field="scheduledDate" body={selectedDate} />
            <Column
              body={popUpIcons}
              style={{ textAlign: "center", minWidth: "30px" }}
            />
          </DataTable>

          <div className="card"></div>
          <div className="col-md-12 col-sm-12 col-xs-12 mt-2  btn-container center">
            <button
              type="button"
              className="btn btn-primary"
              onClick={updateStatus}
            >
              <FaSave /> Save{" "}
            </button>
          </div>
        </div>
      ) : (
        ""
      )}
      {reviewStatus == "1019" ? (
        <div className="darkHeader">
          <DataTable
            className="primeReactDataTable invoicingSearchTable" ////customerEngament
            paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
            currentPageReportTemplate="{first} to {last} of {totalRecords}"
            rowsPerPageOptions={[10,25, 50]}
            value={tableData}
            paginator
            rows={25}
            header={header}
            filters={filters1}
            selection={selectedCustomer}
            onSelectionChange={(e) => setSelectedCustomer(e?.value)}
            selectionMode="single"
            dataKey="id"
            showGridlines
            // stateStorage="session"
            // stateKey="dt-state-demo-local"
            emptyMessage="No Records To View."
            // tableStyle={{ minWidth: "50rem" }}
            // tableStyle={{ minWidth: "auto", width: "auto" }}
            headerColumnGroup={reviewheaderGroup}
          >
            {/* <Column field="product" body={LinkTemplate} /> */}
            <Column field="projectName" body={redirectLink} />
            <Column field="prjStartDate" style={{ textAlign: "center" }} />
            <Column field="customer" body={Customerbody} />
            <Column field="prjStatus" />
            <Column field="reviewType" />
            <Column
              header="Reviewer"
              field="scheduledDate"
              body={ScheduledDate}
            />
            <Column field="lastReviewDate" body={CompletedDate} />
            <Column header="Reviewer" field="reviewer" />
            <Column header="Comments" field="comments" />
            {/* <Column field="revStatusDtl" body={selecttag} /> */}

            <Column
              body={popUpIcons}
              style={{ textAlign: "center", minWidth: "30px" }}
            />
          </DataTable>
        </div>
      ) : (
        ""
      )}
      {view ? (
        <ProjectReviewTable
          view={view}
          setView={setView}
          setProjectId={setProjectId}
          projectId={projectId}
          projectName={projectName}
          historyId={historyId}
          selectedCustomer={selectedCustomer}
        />
      ) : (
        ""
      )}
      {open ? (
        <ReviewLogAdd
          totaldata={totaldata}
          revStatusvalue={revStatusvalue}
          reviewTypevalue={reviewTypevalue}
          reviewType={reviewType}
          open={open}
          setOpen={setOpen}
          setProjectId={setProjectId}
          projectId={projectId}
          projectName={projectName}
          historyId={historyId}
          selectedCustomer={selectedCustomer}
          revDate={revDate}
          setLoader={setLoader}
        />
      ) : (
        ""
      )}
      <CustomerDialogBox
        visible={visiblepopup}
        setVisible={setVisiblepopup}
        newMemberDropdown={newMemberDropdown}
      />{" "}
      <SelectCustDialogBox
        variance={variance}
        visible={custVisible}
        setVisible={setCustVisible}
        setSelectedItems={setSelectedItems}
        selectedItems={selectedItems}
      />
    </div>
  );
}
export default ProjectReviews;
