import React, { useEffect, useState, useRef } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Link } from "react-router-dom";
import { ReactSearchAutocomplete } from "react-search-autocomplete";
import {
  AiFillCloseCircle,
  AiFillDelete,
  AiFillEdit,
  AiFillSave,
  AiFillWarning,
} from "react-icons/ai";
import { FilterMatchMode, FilterOperator } from "primereact/api";
import { InputText } from "primereact/inputtext";
import { BiCheck } from "react-icons/bi";
import Loader from "../Loader/Loader";

import { FiCheckSquare } from "react-icons/fi";
import axios from "axios";
import NpsHistory from "./NpsHistory";
import {
  CCollapse,
  CModal,
  CModalBody,
  CModalHeader,
  CModalTitle,
} from "@coreui/react";
import { MultiSelect } from "react-multi-select-component";
import GlobalValidation from "../ValidationComponent/GlobalValidation";
import { DialogContent, Popover, Typography } from "@material-ui/core";
import {
  FaChevronCircleDown,
  FaChevronCircleUp,
  FaSearch,
  FaHistory,
  FaCaretDown,
  FaInfoCircle,
  FaPencilAlt,
  FaRegEnvelope,
  FaRegPlusSquare,
  FaSave,
} from "react-icons/fa";
import { environment } from "../../environments/environment";
import moment from "moment";
import GlobalHelp from "../PrimeReactTableComponent/GlobalHelp";
import { IoWarningOutline } from "react-icons/io5";
import { IoIosPaperPlane } from "react-icons/io";
import { FaCheckCircle } from "react-icons/fa";
import { TbFileText } from "react-icons/tb";
import { ImCross } from "react-icons/im";
import { RiFileExcel2Line } from "react-icons/ri";
import useDynamicMaxHeight from "../PrimeReactTableComponent/useDynamicMaxHeight";
import './NPS.scss'


export default function RowEditingDemo(props) {
  const { projectId } = props;
  const now = new Date();
  const [resourceId, setResourceId] = useState([]);
  const [updateMsg, setUpdateMsg] = useState(false);
  const [updatedData, setupdatedData] = useState([]);
  const [clickButtonPopUp, setClickButtonPopUp] = useState(false);
  const [addList1, setAddList1] = useState([{}]);
  const [displayTextEmails, setDisplayTextEmails] = useState([]);
  const [prolificsparticipantdata, setProlificsparticipantdata] = useState([]);

  const [details, setDetails] = useState({ customerEmails: "" });
  const [countData, setCountData] = useState([]);
  const [autocomplete, setAutocomplete] = useState([]);
  console.log(autocomplete);
  const [finalState1, setFinalState1] = useState({});
  const [customerId, setCustomerId] = useState([]);
  const [linkColumns, setLinkColumns] = useState([]);
  const [linkColumnsRoutes, setLinkColumnsRoutes] = useState([]);
  const [bussinessUnitSeelect, setBussinessUnitSeelect] = useState(-1);
  const [searchdata1, setSearchdata1] = useState(-1);
  const [searchCountry, setSearchCountry] = useState(-1);
  const [searchStatus, setSearchStatus] = useState("-1");
  const [division, setDivision] = useState([]);
  const [SelectdDivision, setSelectdDivision] = useState([]);
  const [businessUnit, setBussinessUnit] = useState([]);
  const loggedUserId = localStorage.getItem("resId");
  const [cid, setCId] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [loader, setLoader] = useState(false);
  const [openPopup, setOpenPopup] = useState(false);
  const [visible, setVisible] = useState(false);
  const [cheveronIcon, setCheveronIcon] = useState(FaChevronCircleUp);
  const [diaplayState, setDisplayState] = useState(false);
  const [id, setId] = useState([]);
  const ref = useRef([]);
  const HelpPDFName = "NPSGovernance.pdf";
  const Header = "NPS Help";
  const [validationmessage, setValidationMessage] = useState(false);
  const searchdata = {
    projectId: projectId,
    criticality: null,
    source: null,
    status: null,
    name: null,
    rca: null,
    assignedto: null,
    createdby: null,
  };
  const [editedData, setEditedData] = useState([]);
  const [formData, setFormData] = useState(searchdata);
  const [products, setProducts] = useState([]);
  const [globalFilterValue, setGlobalFilterValue] = useState("");
  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  });
  const allocTypes = [
    { value: "161", label: "Active" },
    { value: "162", label: "InActive" },
    { value: "160", label: "New" },
  ];
  const [selectedDepartments, setSelectedDepartments] = useState(allocTypes);
  const [isPCQA, setIsPCQA] = useState(false);
  const statuses = [
    { value: "1175", label: "Verification Requested" },
    { value: "1176", label: "Verified" },
    { value: "1177", label: "Sent for Survey" },
  ];
  if (isPCQA) {
    statuses.unshift({ value: "1174", label: "New" });
  }

  const [selectedStatus, SetSelectedStatus] = useState(statuses);
  useEffect(() => {
    SetSelectedStatus(statuses);
  }, [isPCQA]);
  const [surveyData, setSurveyData] = useState({});

  const intialOnChangeState1 = {
    customerEmails: "",
  };
  const [onChangeState1, setOnChangeState1] = useState(intialOnChangeState1);
  const [projectSurveyPopup, setProjectSurveyPopup] = useState(false);
  const [projectSurveyDetailsPopUp, setProjectSurveyDetailsPopUp] =
    useState(false);

  const [discardPopUp, setDiscardPopUp] = useState(false);
  const [discardCsatId, setDiscardCsatId] = useState({});

  const baseUrl = environment.baseUrl;

  const [routes, setRoutes] = useState([]);
  let textContent = "Governance";
  let currentScreenName = ["Net Promoter Score"];

  sessionStorage.setItem(
    "breadCrumbs",
    JSON.stringify({
      routes: routes,
      currentScreenName: currentScreenName,
      textContent: textContent,
    })
  );

  const isPCQAorCSATAdmin = () => {
    axios
      .get(
        baseUrl + `/governancems/Csat/isPCQAorCSATAdmin?userId=${loggedUserId}`
      )
      .then((res) => {
        setIsPCQA(res.data);
      })
      .catch((error) => console.log(error));
  };

  const getMenus = () => {
    axios({
      method: "GET",
      url: baseUrl + `/CommonMS/master/getMenus?loggedUserId=${loggedUserId}`,
    }).then((resp) => {
      let data = resp.data;

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
        `/CommonMS/security/authorize?url=/pcqa/npv&userId=${loggedUserId}`,
    }).then((res) => {
      console.log(res, "urlResponse");
    });
  };
  useEffect(() => {
    getMenus();
    getUrlPath();
    isPCQAorCSATAdmin();
  }, []);

  const getCountries = () => {
    axios
      .get(baseUrl + `/CostMS/cost/getCountries`)
      .then((Response) => {
        let countries = [];
        let data = Response.data;
        data.length > 0 &&
          data.forEach((e) => {
            let countryObj = {
              label: e.country_name,
              value: e.id,
            };
            e.country_name == "NM" ? "" : countries.push(countryObj);
          });
        setDivision(countries);
        setSelectdDivision(countries);
      })
      .catch((error) => console.log(error));
  };

  const [projectMgr, setProjectMgr] = useState([]);
  const [valueID, setValueID] = useState([]);

  const materialTableElement = document.getElementsByClassName(
    "childOne"
  );

  const maxHeight1 = useDynamicMaxHeight(materialTableElement, "fixedcreate") -46;
  document.documentElement.style.setProperty(
    "--dynamic-value",
    String(maxHeight1 -72) + "px"
  );

  var combinedIds =
    projectMgr.npsClientEmail == null
      ? "" + valueID
      : projectMgr.npsClientEmail + "," + valueID;
  const handleAddClick = (rowData) => {
    if (rowData.custMgr == null) {
      setValidateproject(true);
    } else {
      axios({
        method: "post",
        url: baseUrl + `/governancems/pcqa/updateNpsActions`,
        data: {
          id: id,
          customer_id: customerId,
          project_manager_id:
            formData.AeId == undefined ? projectMgr.resource_id : formData.AeId,
          Client_email: combinedIds,
          Status: projectMgr.npv_status,
          is_discarded: projectMgr.canBeDiscarded,
          comments: "abcxyz",
          created_on: moment(now).format("YYYY-MM-DD"),
          modified_on: moment(now).format("YYYY-MM-DD"),
        },
      }).then((res) => {
        setupdatedData(res.data);
        setTimeout(() => {
          setUpdateMsg(false);
        }, 3000);
        // setUpdateMsg(true);
        GetData();
        setValidateproject(false);
      });
    }
  };

  const getCountData = (id) => {
    axios({
      method: "get",
      url: baseUrl + `/governancems/pcqa/getHistoryNps?CustId=${id}`,

      headers: { "Content-Type": "application/json" },
    }).then((res) => {
      const GetData = res.data;
      setCountData(GetData);
      setEditedData(GetData);
    });
  };

  const bussinessUnit = () => {
    axios({
      method: "get",
      url: baseUrl + `/CostMS/cost/getDepartments`,
    }).then((res) => {
      var bunit = res.data;
      setBussinessUnit(bunit);
    });
  };
  useEffect(() => {
    bussinessUnit();
    getCountries();
  }, [customerId]);

  const initFilters = () => {
    setFilters({
      global: { value: null, matchMode: FilterMatchMode.CONTAINS },
      name: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
      },
      "country.name": {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
      },
      representative: { value: null, matchMode: FilterMatchMode.IN },
      date: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }],
      },
      balance: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }],
      },
      status: {
        operator: FilterOperator.OR,
        constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }],
      },
      activity: { value: null, matchMode: FilterMatchMode.BETWEEN },
      verified: { value: null, matchMode: FilterMatchMode.EQUALS },
    });
    setGlobalFilterValue("");
  };
  const clearFilter = () => {
    initFilters();
  };

  const onGlobalFilterChange = (e) => {
    const value = e.target.value;

    let _filters = { ...filters };

    _filters["global"].value = value;

    setFilters(_filters);

    setGlobalFilterValue(value);
  };

  const renderHeader = () => {
    return (
      <div className="flex justify-content-end">
        <span className="p-input-icon-left">
          <i className="pi pi-search" />
          <InputText
            value={globalFilterValue}
            onChange={onGlobalFilterChange}
            placeholder="Keyword Search"
          />
        </span>
      </div>
    );
  };

  const [searchStr, setSearchStr] = useState("");

  const getAutocomplete = async (searchStr, custId) => {
    await axios({
      method: "post",
      url: baseUrl + "/governancems/pcqa/listProjectManagers",
      data: {
        customerId: custId,
        searchStr: searchStr,
      },
    })
      .then((res) => {
        const GetData = res.data?.map((item) => ({
          id: item.id,
          label: item.user,
        }));
        setAutocomplete(GetData);
      })
      .catch((error) => {
        console.error("Error fetching autocomplete data:", error);
      });
  };

  const [editIconIds, setEditIconIds] = useState([]);

  const [clientEmailList, setClientEmailList] = useState([]);

  const toggleIcons = (rowData) => {
    if (editIconIds.includes(rowData.id)) {
      setEditIconIds((prev) => prev.filter((id) => id !== rowData.id));
    } else {
      setEditIconIds((prev) => [...prev, rowData.id]);
    }
  };

  const sendPcqaNPVMgrVerificaftion = (rowData) => {
    const requestBody = {
      loggedUser: loggedUserId,
      csatId: rowData.csat_id,
      CustomerId: rowData.id,
      month: moment().startOf("month").format("YYYY-MM-DD"),
    };

    axios
      .post(baseUrl + `/governancems/pcqa/isSentVerify`, requestBody)
      .then((res) => {
        setProducts((prevData) => {
          const updatedData = prevData.map((item) => {
            if (item.id === rowData.id) {
              item.npv_stat_txt = "Verification Requested";
            }
            return item;
          });
          return updatedData;
        });
        //GetData();
      })
      .catch((error) => console.log(error));
  };

  const [prjMngHighlight, setPrjMngHighlight] = useState(false);
  const [clientEmailNull, setClientEmailNull] = useState(false);

  const [prjMngHighlightMsg, setPrjMngHighlightMsg] = useState(false);

  const [saveMsg, setSaveMsg] = useState(false);

  const savePcqaNPVProjectDetails = (rowData) => {
    const requestBody = {
      csatId: rowData.csat_id,
      clientEmail: rowData.customer_emails,
      projMgr: rowData.resource_id !== null ? rowData.resource_id : 0,
      CustomerId: rowData.id,
      prjClientEmails: rowData.npsClientEmail,
      userId: loggedUserId,
    };
    if (rowData.resource_id == null) {
      setPrjMngHighlight(true);
      setPrjMngHighlightMsg(true);
      setTimeout(() => {
        setPrjMngHighlightMsg(false);
      }, 3000);
      return;
    }
    if (
      requestBody.prjClientEmails == null ||
      requestBody.prjClientEmails == "" ||
      requestBody.prjClientEmails == undefined
    ) {
      setClientEmailNull(true);
      setPrjMngHighlightMsg(true);
      setTimeout(() => {
        setPrjMngHighlightMsg(false);
      }, 3000);
      return;
    }
    if (rowData.resource_id !== null) {
      setPrjMngHighlight(false);
      setClientEmailNull(false);
      axios
        .post(baseUrl + `/governancems/pcqa/isSaveEmailMgr`, requestBody)
        .then((resp) => {
          console.log(resp.data);
          toggleIcons(editRowData);
          setSaveMsg(true);
          setTimeout(() => {
            setSaveMsg(false);
          }, 3000);
          GetData();
        })
        .catch((error) => console.log(error));
    }
  };

  const [editRowData, setEditRowData] = useState({});
  const [confirmDetailsMsg, setConfirmDetailsMsg] = useState(false);
  const confirmNPVMgrVerificaftion = (csatId) => {
    axios
      .get(baseUrl + `/governancems/pcqa/isConfirm?csatId=${csatId}`)
      .then((res) => {
        setProducts((prevData) => {
          const updatedData = prevData.map((item) => {
            if (item.csat_id === csatId) {
              item.npv_stat_txt = "Verified";
            }
            return item;
          });
          return updatedData;
        });
        setConfirmDetailsMsg(true);
        setTimeout(() => {
          setConfirmDetailsMsg(false);
        }, 3000);
        //GetData();
      })
      .catch((error) => console.log(error));
  };

  const editingEnable = (rowData) => {
    return (
      <div>
        {(rowData.npv_stat_txt == "New" ||
          rowData.npv_status == 1174 ||
          (rowData.npv_status == 1175 && rowData.isPrjMngr == 1)) && (
          <FaPencilAlt
            title="Edit"
            cursor="pointer"
            onClick={() => {
              toggleIcons(rowData);
              setEditRowData(rowData);
              getAutocomplete(" ", rowData.id);
              const emailList =
                rowData.customer_emails?.length > 0
                  ? rowData.customer_emails?.split(",")
                  : [];
              const emailObj = emailList?.map((it) => ({
                checked: it == rowData.npsClientEmail,
                email: it,
              }));
              setClientEmailList(emailObj);
            }}
          />
        )}
      </div>
    );
  };

  const [newSurveyMessage, setNewSurveyMessage] = useState("");
  const [surveyMsg, setSurveyMsg] = useState(false);

  const checNUpdatekForNewSurvey = (csatId) => {
    axios
      .post(baseUrl + `/governancems/pcqa/isNewSurvey?csatId=${csatId}`)
      .then((res) => {
        let msg = res.data?.message;
        setNewSurveyMessage(msg);
        setSurveyMsg(true);
        setTimeout(() => {
          window.scrollTo({
            top: 0,
            behavior: "smooth",
          });
        }, 100);
        setTimeout(() => {
          setSurveyMsg(false);
        }, 6000);
      })
      .catch((error) => console.log(error));
  };

  const actionField = (rowData) => {
    const isPencilVisible = !editIconIds.includes(rowData.id);

    return (
      <div className="d-flex justify-content-center">
        {isPencilVisible ? (
          <>
            {editingEnable(rowData)}
            {rowData.npv_status == 1177 && (
              <div title="Survey Results">
                <TbFileText
                  size={14}
                  cursor={"pointer"}
                  className="ms-1"
                  onMouseEnter={() => getClientSurveydetails(rowData.csat_id)}
                  onClick={() => {
                    setProjectSurveyDetailsPopUp(true);
                  }}
                />
              </div>
            )}
            {rowData.npv_status == 1177 && isPCQA == true && (
              <div title="New Survey">
                <FaRegPlusSquare
                  size={14}
                  cursor={"pointer"}
                  className="ms-1"
                  onClick={() => checNUpdatekForNewSurvey(rowData.csat_id)}
                />
              </div>
            )}
            {(rowData.npv_stat_txt == "New" || rowData.npv_status == 1174) && (
              <FiCheckSquare
                title="Verify Details"
                cursor="pointer"
                className="ms-2 mt-1"
                onClick={() => sendPcqaNPVMgrVerificaftion(rowData)}
              />
            )}
          </>
        ) : (
          <>
            <AiFillSave
              title="Save"
              cursor="pointer"
              onClick={() => {
                savePcqaNPVProjectDetails(rowData);
              }}
            />
            <AiFillCloseCircle
              title="Cancel"
              cursor="pointer"
              className="ms-2"
              onClick={() => {
                toggleIcons(rowData);
                setEditIconIds(() =>
                  editIconIds.filter((it) => it !== rowData.id)
                );
                setProducts((prevData) => {
                  const updatedData = prevData.map((item) => {
                    if (item.id === rowData.id) {
                      item.npsClientEmail = "";
                    }
                    return item;
                  });
                  return updatedData;
                });
                setAutocomplete([]);
              }}
            />
          </>
        )}
        {rowData.npv_status == 1176 && (
          <div title="Send Survey">
            <IoIosPaperPlane
              cursor={"pointer"}
              className="ms-2"
              onClick={() => {
                setProjectSurveyPopup(true);
                setSurveyData(rowData);
              }}
            />
          </div>
        )}
        {rowData.npv_status == 1175 && rowData.isPrjMngr == 1 && (
          <div title="Confirm Details">
            <FaCheckCircle
              cursor={"pointer"}
              className="ms-2"
              onClick={() => confirmNPVMgrVerificaftion(rowData.csat_id)}
            />
          </div>
        )}
        {rowData.canBeDiscarded == 1 && (
          <ImCross
            className="ms-2"
            title="Discard Survey"
            style={{ marginTop: "6px" }}
            cursor={"pointer"}
            size={12}
            onClick={() => {
              setDiscardCsatId(rowData);
              setDiscardPopUp(true);
            }}
          />
        )}
      </div>
    );
  };

  const GetData = async () => {
    setGlobalFilterValue("");
    let _filters = { ...filters };
    _filters["global"].value = "";
    setFilters(_filters);
    setEditIconIds([]);

    let valid = GlobalValidation(ref);
    if (valid == true) {
      setValidationMessage(true);
    }
    // setValidationMessage(false)
    if (valid) {
      return;
    }
    const loaderTime = setTimeout(() => {
      setLoader(true);
    }, 2000);
    setDisplayState(false);
    await axios({
      method: "post",
      url: baseUrl + `/governancems/pcqa/isSearch`,
      data: {
        units: +bussinessUnitSeelect,
        customerStatus: +searchdata1,
        countries: +searchCountry,
        custStatus: searchStatus?.split(",").lenght > 3 ? "-1" : searchStatus,
        loggedUser: +loggedUserId,
        isPCQA: isPCQA,
      },

      headers: { "Content-Type": "application/json" },
    }).then((response) => {
      let data = response.data.data;
      clearTimeout(loaderTime);
      setLoader(false);
      setProducts([...response.data.data]);
      setValidationMessage(false);
      let headerdata = [
        {
          full_name: "Customer",
          custMgr: "Project Manager",
          customer_emails: "Client Email",
          npv: "Nps",
          npv_stat_txt: "Status",
          lastReviewDate: "Action",
        },
      ];
      let data1 = ["full_name", ""];
      let linkRoutes = ["/customer/dashboard/id", ""];
      setLinkColumns(data1);
      setLinkColumnsRoutes(linkRoutes);
      setTableData(headerdata.concat(data));
      setDisplayState(true);
      // setTableData(data);
      setVisible(!visible);
      visible
        ? setCheveronIcon(FaChevronCircleUp)
        : setCheveronIcon(FaChevronCircleDown);
    });
  };

  const clientEmailEditor = (rowData) => {
    return editIconIds.includes(rowData.id) ? (
      <div className="d-flex">
        <div
          className={clientEmailNull ? "error-block" : ""}
          style={{ width: "90%" }}
        >
          <input
            type="text"
            title={rowData.npsClientEmail}
            value={rowData.npsClientEmail}
            readOnly
          />
        </div>
        &nbsp;&nbsp;&nbsp;
        <div>
          <AiFillEdit
            size={14}
            cursor={"pointer"}
            onClick={() => {
              setClickButtonPopUp(true);
            }}
          />
        </div>
      </div>
    ) : (
      <div title={rowData.npsClientEmail} className="ellipsis">
        {rowData.npsClientEmail}
      </div>
    );
  };

  const projectManagerEditor = (rowData) => {
    const handleSearch = (searchStr) => {
      setSearchStr(searchStr);
      getAutocomplete(searchStr, rowData.id);
    };

    return editIconIds?.includes(rowData.id) ? (
      <div className="autoComplete-container">
        <div className={prjMngHighlight ? "error-block" : ""}>
          <ReactSearchAutocomplete
            type="text"
            items={autocomplete}
            fuseOptions={{ keys: ["id", "label"] }}
            resultStringKeyName="label"
            placeholder="Type/Press space to get the list"
            showIcon={false}
            onSearch={handleSearch}
            inputSearchString={
              rowData?.custMgr == null
                ? ""
                : rowData?.custMgr == ""
                ? ""
                : rowData?.custMgr
            }
            onSelect={(selectedItem) => {
              setProducts((prevData) => {
                const updatedData = prevData.map((item) => {
                  if (item.id === editRowData.id) {
                    (item.resource_id = selectedItem.id),
                      (item.custMgr = selectedItem.label);
                  }
                  return item;
                });
                return updatedData;
              });
            }}
          />
        </div>
      </div>
    ) : (
      <div title={rowData.custMgr}>{rowData.custMgr}</div>
    );
  };

  const represent = (products) => {
    setCId(products.id);
    return (
      <div style={{ display: "flex", alignItems: "center" }}>
        <Link
          title={products.full_name}
          to={`/search/customerSearch/customer/dashboard/:${products.id}`}
          target="_blank"
          className="ellipsis"
          style={{
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            flexGrow: 1,
          }}
        >
          {products.full_name}
        </Link>
        <FaHistory
          style={{
            cursor: "pointer",
          }}
          title="Survey History"
          onClick={() => {
            getCountData(products.id);
            setOpenPopup(true);
          }}
        />
      </div>
    );
  };

  const ArrowRenderer = ({ expanded }) => (
    <>
      {expanded ? (
        <FaCaretDown className="chevronIcon" />
      ) : (
        <FaCaretDown className="chevronIcon" />
      )}
    </>
  );
  const generateDropdownLabel = (selectedOptions, allOptions) => {
    const selectedValues = selectedOptions.map((option) => option.value);
    const allValues = allOptions.map((item) => item.value);

    if (selectedValues.length === allValues.length) {
      return "<< ALL >>";
    } else {
      return selectedOptions.map((option) => option.label).join(", ");
    }
  };
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClose = () => {
    setAnchorEl(false);
  };

  function NpsPopup() {
    const handlePopoverOpen = (event) => {
      setAnchorEl(event.currentTarget);
    };

    const handlePopoverClose = () => {
      setAnchorEl(null);
    };

    const open = Boolean(anchorEl);
    return (
      <div>
        <Typography
          aria-owns={open ? "mouse-over-popover" : undefined}
          aria-haspopup="true"
          onMouseEnter={handlePopoverOpen}
          onMouseLeave={handlePopoverClose}
        ></Typography>
        <Popover
          open={open}
          id="mouse-over-popover"
          sx={{
            pointerEvents: "none",
            position: "absolute",
          }}
          anchorEl={anchorEl}
          onClose={handlePopoverClose}
          disableRestoreFocus
          anchorOrigin={{
            vertical: "top",
            horizontal: "left",
          }}
          transformOrigin={{
            vertical: "bottom",
            horizontal: "left",
          }}
        >
          <DialogContent>
            Calculation formula :(Number of Promoters-Number of
            Detractors/(Total no.of Number of Respondents )x 100)
          </DialogContent>
        </Popover>
      </div>
    );
  }

  const [surveyOptions, setSurveyOptions] = useState([]);

  useEffect(() => {
    axios
      .get(baseUrl + `/governancems/pcqa/npsSurveyOptions?type=${"NPV"}`)
      .then((res) => {
        setSurveyOptions(res.data);
      })
      .catch((error) => console.log(error));
  }, []);

  const ProjectSurveyPopUp = () => {
    const [surveyOptionsSelected, setSurveyOptionsSelected] = useState(-1);
    const [mailSubject, setMailSubject] = useState(
      `NPV For ${surveyData.full_name}`
    );

    const [surveyOptMsg, setSurveyOptMsg] = useState(false);

    const sendSurveyToClient = () => {
      if (surveyOptionsSelected == -1) {
        setSurveyOptMsg(true);
        setTimeout(() => {
          setSurveyOptMsg(false);
        }, 3000);
        return;
      }

      const requestBody = {
        csatId: surveyData.csat_id,
        survey: surveyOptionsSelected,
        subject: mailSubject,
        isWhat: "isSurveySend",
      };
      console.log(requestBody);

      axios
        .post(baseUrl + `/governancems/pcqa/isSurveySend`, requestBody)
        .then((resp) => {
          console.log(resp.data);
          setProjectSurveyPopup(false);
          GetData();
        })
        .catch((error) => console.log(error));
    };

    return (
      <>
        <CModal
          visible={projectSurveyPopup}
          onClose={() => setProjectSurveyPopup(false)}
          backdrop={"static"}
          size="lg"
        >
          <CModalHeader>
            <CModalTitle>Send Project Survey</CModalTitle>
          </CModalHeader>
          <CModalBody>
            {surveyOptMsg ? (
              <div className="statusMsg error">
                <span>
                  <IoWarningOutline style={{ marginTop: "-2px" }} /> Please
                  select the Survey Option
                </span>
              </div>
            ) : (
              ""
            )}
            <div className="col-md-6 mb-2">
              <div className="row ms-1">
                <label className="col-4">NPV Survey</label>
                <span className="col-1">:</span>
                <div className="col-6">
                  <select
                    onChange={(e) => setSurveyOptionsSelected(e.target.value)}
                    // style={{
                    //   backgroundColor:
                    //     surveyOptionsSelected == -1 ? "#F2DEDE" : "",
                    // }}
                  >
                    <option value={-1}>Select Survey</option>
                    {surveyOptions.map((item) => (
                      <option value={item.id}>{item.surveyName}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            <hr />
            <div className="row mt-2 mb-2 mx-1">
              <div className="col-md-2 text-center border">
                <button
                  className="btn col-12 d-inline border-0"
                  title="Send Survey"
                  onClick={() => sendSurveyToClient()}
                >
                  <FaRegEnvelope size={19} color="#A4A4A4" />
                  <br />
                  Send Survey
                </button>
              </div>
              <div className="col-md-10">
                <div className="row mb-2">
                  <label className="col-md-1 col-form-label">To</label>
                  <label className="col-md-1">:</label>
                  <div className="col-md-10">
                    <input
                      type="text"
                      className="form-control"
                      readOnly
                      value={surveyData.npsClientEmail}
                    />
                  </div>
                </div>
                <div className="row">
                  <label className="col-md-1 col-form-label">Subject</label>
                  <label className="col-md-1">:</label>
                  <div className="col-md-10">
                    <input
                      type="text"
                      className="form-control"
                      defaultValue={mailSubject}
                      onChange={(e) => setMailSubject(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="border border-dark p-1">
              <p className="mt-2">Dear Customer,</p>
              <p className="mt-2">
                As a valued Prolifics client, you have an impact on the quality
                of our service delivery. We are dedicated to understanding your
                growing needs and improving our ability to satisfy those needs.
                With your help, we would like to evaluate the services we
                provide to you and identify areas we can improve upon.
              </p>
              <p className="mt-2">
                We are requesting your input through a brief Q&A in the attached
                form. Your input can help us immensely in improving our
                services. We estimate that it will take you approximately 5
                minutes to complete. The project we are requesting feedback on
                is shown below.
              </p>
              <p className="mt-2">
                Please complete this survey for the project: %SURVEY_URL%{" "}
              </p>
              <p className="mt-2">
                We would be glad if you can respond back with the filled in
                customer survey form within 48 hours.
              </p>
              <p className="mt-4 mb-2">
                Thank you in advance for your time and cooperation in completing
                this survey. Please be assured that your answers will be kept
                strictly confidential and only used for Prolifics internal
                purposes
              </p>
            </div>
          </CModalBody>
        </CModal>
      </>
    );
  };

  const [surveyDetails, setSurveyDetails] = useState([]);

  const getClientSurveydetails = (csatId) => {
    axios
      .get(
        baseUrl +
          `/governancems/pcqa/getClientNPVSurveydetails?CustId=${csatId}&exclLvl1=${0}`
      )
      .then((res) => {
        let ApiData = res.data;
        const groupedData = [];
        let currentGroup = [];

        ApiData.forEach((item) => {
          if (item.lvl === 1) {
            if (currentGroup.length > 0) {
              groupedData.push([...currentGroup]);
            }
            currentGroup = [item];
          } else {
            currentGroup.push(item);
          }
        });

        if (currentGroup.length > 0) {
          groupedData.push([...currentGroup]);
        }
        setSurveyDetails(groupedData);
      })
      .catch((error) => console.log(error));
  };

  const ProjectSurveyDetailsPopUp = () => {
    return (
      <CModal
        visible={projectSurveyDetailsPopUp}
        onClose={() => setProjectSurveyDetailsPopUp(false)}
        backdrop={"static"}
        size="lg"
      >
        <CModalHeader>
          <CModalTitle>Project Survey Details</CModalTitle>
        </CModalHeader>
        <CModalBody>
          {surveyDetails.length > 0 ? (
            <>
              {surveyDetails.map((data, index) => (
                <div className={index > 0 ? "mt-3" : ""}>
                  <div>
                    <strong>Client Email</strong>&nbsp; : {data[0]?.email}
                  </div>
                  <div className="mt-1">
                    <DataTable
                      value={data.slice(1)}
                      showGridlines
                      className="primeReactDataTable darkHeader"
                    >
                      <Column
                        field="question"
                        style={{ width: "60%" }}
                        header="Question"
                        body={(rowData) => (
                          <div className="ellipsis" title={rowData.question}>
                            {rowData.question}
                          </div>
                        )}
                      />
                      <Column
                        field="answer"
                        style={{ width: "40%" }}
                        header="Answer"
                        className="ellipsis"
                        body={(rowData) => (
                          <div className="ellipsis" title={rowData.answer}>
                            {rowData.answer}
                          </div>
                        )}
                      />
                    </DataTable>
                  </div>
                </div>
              ))}
            </>
          ) : (
            <div
              style={{
                textAlign: "center",
                fontSize: "20px",
                lineHeight: "50px",
                backgroundColor: "#dbf5ff",
                fontFamily: "initial",
              }}
            >
              Responses For This Survey Has Not Been Submitted Yet.
            </div>
          )}
        </CModalBody>
      </CModal>
    );
  };

  const DiscardCommentsPopUp = () => {
    const [discardComments, setDiscardComments] = useState("");
    const [emptyCmntMsg, setEmptyCmntMsg] = useState(false);
    const requestBody = {
      csatId: discardCsatId.csat_id,
      comments: discardComments,
    };

    const discardCustomerLastSurvey = () => {
      if (discardComments.length > 0) {
        axios
          .post(baseUrl + `/governancems/pcqa/discardLastSurvey`, requestBody)
          .then((res) => {
            console.log(res.data);
            setDiscardPopUp(false);
          })
          .catch((error) => console.log(error));
      } else {
        setEmptyCmntMsg(true);
        setTimeout(() => {
          setEmptyCmntMsg(false);
        }, 4000);
      }
    };

    return (
      <CModal
        visible={discardPopUp}
        onClose={() => setDiscardPopUp(false)}
        backdrop={"static"}
        size="md"
        alignment="center"
      >
        <CModalHeader>
          <CModalTitle>Close Survey</CModalTitle>
        </CModalHeader>
        <CModalBody>
          {emptyCmntMsg && (
            <div className="statusMsg error">
              <span>
                <IoWarningOutline style={{ marginTop: "-2px" }} /> Please Enter
                Comments For Cancelling this Survey
              </span>
            </div>
          )}
          <div className="row">
            <div className="col-md-4">
              <label>
                Comments <span style={{ color: "red" }}>*</span>
              </label>
            </div>
            <div className="col-md-1">
              <span>:</span>
            </div>
            <div className="col-md-7">
              <textarea
                style={{
                  height: "100px",
                }}
                placeholder="Please Enter Comments For Cancelling this Survey.."
                onChange={(e) => setDiscardComments(e.target.value)}
              />
            </div>
          </div>
          <button
            className="btn btn-primary mx-auto mt-2"
            onClick={() => discardCustomerLastSurvey()}
          >
            <FaSave />
            Save
          </button>
        </CModalBody>
      </CModal>
    );
  };

  const header = renderHeader();

  return (
    <div>
      {prjMngHighlightMsg ? (
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

      {saveMsg ? (
        <div className="statusMsg success">
          <span>
            <BiCheck style={{ marginTop: "-2px" }} />
            Saved Successfully
          </span>
        </div>
      ) : (
        ""
      )}

      {confirmDetailsMsg && (
        <div className="statusMsg success">
          <span>
            <BiCheck style={{ marginTop: "-2px" }} />
            Details Confirmed
          </span>
        </div>
      )}

      {surveyMsg ? (
        <>
          {newSurveyMessage == "" && (
            <div className="statusMsg success">
              <span>
                <BiCheck style={{ marginTop: "-2px" }} />
                {newSurveyMessage}
              </span>
            </div>
          )}
          {newSurveyMessage?.includes("Last Survey for") && (
            <div className="statusMsg error">
              <span>
                <AiFillWarning />
                {newSurveyMessage}
              </span>
            </div>
          )}
        </>
      ) : (
        ""
      )}

      {updateMsg ? (
        <div className="statusMsg success">
          <span className="errMsg">
            <BiCheck />
            &nbsp; saved successfully
          </span>
        </div>
      ) : (
        ""
      )}
      {loader ? <Loader handleAbort={() => setLoader(false)} /> : ""}
      {validationmessage ? (
        <div className="statusMsg error">
          <AiFillWarning />
          Please select valid values for highlighted fields
        </div>
      ) : (
        ""
      )}

      <div className="col-md-12">
        <div className="pageTitle">
          <div className="childOne">
            {/* <h2>IA Support(IA Support)</h2> */}
          </div>
          <div className="childTwo">
            <h2>Net Promoter Score</h2>
          </div>
          <div className="childThree toggleBtns">
          <button
                className="searchFilterButton btn btn-primary"
                onClick={() => {
                  setVisible(!visible);
 
                  visible
                    ? setCheveronIcon(FaChevronCircleUp)
                    : setCheveronIcon(FaChevronCircleDown);
                }}
              >
                Search Filters
                <span className="serchFilterText">{cheveronIcon}</span>
              </button>
            <GlobalHelp pdfname={HelpPDFName} name={Header} />
          </div>
        </div>
      </div>
      <div className="col-md-12   customCard">
        <div className="col-md-12 collapseHeader"></div>
        <CCollapse visible={!visible}>
          <div className="group-content row">
            <div className=" col-md-3 mb-2">
              <div className="form-group row">
                <label className="col-5">
                  Business Unit
                  <span className=" error-text"> *</span>
                </label>
                <label className="col-1 p-0">:</label>
                <label className="col-6">
                  <select
                    id="businessunit"
                    onChange={(e) => {
                      setBussinessUnitSeelect(e.target.value);
                    }}
                  >
                    <option value="null"> &lt;&lt;ALL&gt;&gt;</option>
                    {businessUnit.map((Item) => (
                      <option value={Item.value}> {Item.label}</option>
                    ))}
                  </select>
                </label>
              </div>
            </div>

            <div className=" col-md-3 mb-2">
              <div className="form-group row">
                <label className="col-5" htmlFor="country">
                  Customer Status <span className=" error-text"> *</span>
                </label>
                <span className="col-1 p-0">:</span>
                <div
                  className=" multiselect col-6"
                  ref={(ele) => {
                    ref.current[0] = ele;
                  }}
                >
                  <MultiSelect
                    id="projectStatus"
                    options={allocTypes}
                    ArrowRenderer={ArrowRenderer}
                    valueRenderer={generateDropdownLabel}
                    hasSelectAll={true}
                    isLoading={false}
                    shouldToggleOnHover={false}
                    disableSearch={false}
                    value={selectedDepartments}
                    // disabled={false}
                    onChange={(e) => {
                      setSelectedDepartments(e);
                      let filteredCountry = [];
                      e.forEach((d) => {
                        filteredCountry.push(d.value);
                      });

                      setSearchdata1(filteredCountry.toString());
                    }}
                  />
                </div>
              </div>
            </div>
            <div className=" col-md-3 mb-2">
              <div className="form-group row">
                <label className="col-5" htmlFor="country">
                  Country <span className=" error-text"> *</span>
                </label>
                <span className="col-1 p-0">:</span>
                <div
                  className="multiselect col-6"
                  ref={(ele) => {
                    ref.current[1] = ele;
                  }}
                >
                  <MultiSelect
                    id="Divisions"
                    options={division}
                    valueRenderer={generateDropdownLabel}
                    ArrowRenderer={ArrowRenderer}
                    hasSelectAll={true}
                    value={SelectdDivision}
                    disabled={false}
                    onChange={(e) => {
                      setSelectdDivision(e);
                      let filteredCountry = [];
                      e.forEach((d) => {
                        filteredCountry.push(d.value);
                      });

                      setSearchCountry(filteredCountry.toString());
                    }}
                  />
                </div>
              </div>
            </div>

            <div className=" col-md-3 mb-2">
              <div className="form-group row">
                <label className="col-5" htmlFor="country">
                  Status <span className=" error-text"> *</span>
                </label>
                <span className="col-1 p-0">:</span>
                <div
                  className="multiselect col-6"
                  ref={(ele) => {
                    ref.current[2] = ele;
                  }}
                >
                  <MultiSelect
                    id="projectStatus"
                    options={statuses}
                    hasSelectAll={true}
                    valueRenderer={generateDropdownLabel}
                    ArrowRenderer={ArrowRenderer}
                    isLoading={false}
                    shouldToggleOnHover={false}
                    disableSearch={false}
                    value={selectedStatus}
                    disabled={false}
                    onChange={(e) => {
                      SetSelectedStatus(e);
                      let filteredCountry = [];
                      e.forEach((d) => {
                        filteredCountry.push(d.value);
                      });
                      let searchStatu = filteredCountry.toString();
                      console.log(searchStatu);
                      setSearchStatus(searchStatu);
                    }}
                  />
                </div>
              </div>

              <div className="col-6 autoComplete-container"> </div>
            </div>

            <div className=" form-group col-md-12 col-sm-12 col-xs-12 btn-container center my-3">
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => {
                  GetData();
                  setDisplayState(false);
                  setEditIconIds([]);
                }}
              >
                <FaSearch /> Search{" "}
              </button>
            </div>
          </div>
        </CCollapse>
      </div>
      {diaplayState ? (
        <div className="darkHeader NetPromoterScore">
          <DataTable
            className="primeReactDataTable eventsTable "
            value={products}
            filters={filters}
            tableStyle={{ minWidth: "50rem" }}
            showGridlines
            header={header}
            paginator
            rows={25}
            paginationPerPage={5}
            paginationRowsPerPageOptions={[10, 25, 50]}
            paginationComponentOptions={{
              rowsPerPageText: "Records per page:",
              rangeSeparatorText: "out of",
            }}
            currentPageReportTemplate="View {first} - {last} of {totalRecords} "
            paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
            rowsPerPageOptions={[10, 25, 50]}
          >
            <Column
              field="full_name"
              header="Customer"
              style={{ width: "30%" }}
              sortable
              body={represent}
            />
            <Column
              field="custMgr"
              header="Project Manager"
              style={{ width: "20%" }}
              sortable
              body={(rowData) => projectManagerEditor(rowData)}
            />
            <Column
              field="npsClientEmail"
              header=" Client Email"
              sortable
              style={{ width: "30%" }}
              body={(rowData) => clientEmailEditor(rowData)}
            />
            <Column
              field="npv"
              align={"right"}
              style={{ width: "8%" }}
              header={() => (
                <div
                  style={{
                    position: "relative",
                  }}
                >
                  NPS{" "}
                  <FaInfoCircle
                    cursor={"pointer"}
                    onMouseOver={(e) => {
                      setAnchorEl(e?.currentTarget);
                    }}
                    onMouseOut={() => handleClose}
                  />
                </div>
              )}
              alignHeader={"center"}
            />
            <Column
              field="npv_stat_txt"
              header="Status"
              align={"center"}
              style={{ width: "22%" }}
              sortable
            ></Column>
            <Column
              header="Action"
              headerStyle={{ width: "10%", minWidth: "8rem" }}
              bodyStyle={{ textAlign: "center" }}
              body={(rowData) => actionField(rowData)}
            />
          </DataTable>
        </div>
      ) : (
        ""
      )}
      {openPopup && (
        <NpsHistory
          openPopup={openPopup}
          setOpenPopup={setOpenPopup}
          id={id}
          countData={countData}
        />
      )}
      {clickButtonPopUp ? <NpsEmailPopUp /> : ""}
      {anchorEl && <NpsPopup />}
      {projectSurveyPopup && <ProjectSurveyPopUp />}
      {projectSurveyDetailsPopUp && <ProjectSurveyDetailsPopUp />}
      {discardPopUp && <DiscardCommentsPopUp />}
    </div>
  );

  function NpsEmailPopUp() {
    const [mailCheck, setMailCheck] = useState(false);
    const [selectionCheck, setSelectionCheck] = useState(false);
    const [emailExist, setEmailExist] = useState(false);
    var newEmail = "";

    return (
      <CModal
        visible={clickButtonPopUp}
        onClose={() => setClickButtonPopUp(false)}
        backdrop={"static"}
        size="sm"
        alignment="center"
      >
        <CModalHeader>
          <CModalTitle>Client Email</CModalTitle>
        </CModalHeader>
        <CModalBody>
          {mailCheck ? (
            <div className="statusMsg error">
              <span>
                <IoWarningOutline style={{ marginTop: "-2px" }} /> Please
                Provide Proper Email
              </span>
            </div>
          ) : (
            ""
          )}
          {selectionCheck ? (
            <div className="statusMsg error">
              <span>
                <IoWarningOutline style={{ marginTop: "-2px" }} />
                Please select one email
              </span>
            </div>
          ) : (
            ""
          )}
          {emailExist ? (
            <div className="statusMsg error">
              <span>
                <IoWarningOutline style={{ marginTop: "-2px" }} />
                Email already exists
              </span>
            </div>
          ) : (
            ""
          )}
          <div className="d-flex">
            <div>
              <input
                type="email"
                onChange={(e) => (newEmail = e.target.value)}
              />
            </div>
            &nbsp;&nbsp;&nbsp;
            <button
              className="btn btn-primary mx-3"
              onClick={() => {
                const emailRegex =
                  /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/;
                if (newEmail.match(emailRegex)) {
                  if (
                    !clientEmailList.map((it) => it.email).includes(newEmail)
                  ) {
                    setClientEmailList((prev) => [
                      ...prev,
                      { checked: false, delete: true, email: newEmail },
                    ]);
                  } else {
                    setEmailExist(true);
                    setTimeout(() => {
                      setEmailExist(false);
                    }, 3000);
                  }
                } else {
                  setMailCheck(true);
                  setTimeout(() => setMailCheck(false), 3000);
                }
              }}
            >
              Add
            </button>
          </div>
          <div className="mt-2">
            {clientEmailList?.map((it) => {
              return (
                <div key={it.email} className="d-flex">
                  <input
                    type="checkbox"
                    checked={it.checked}
                    onChange={(e) => {
                      setClientEmailList((prevList) => {
                        return prevList.map((item) =>
                          item.email === it.email
                            ? { ...item, checked: e.target.checked }
                            : item
                        );
                      });
                    }}
                  />
                  &nbsp;&nbsp;&nbsp;
                  <span>{it.email}</span>
                  {it?.delete === true && (
                    <AiFillDelete
                      className="mt-1 ms-1"
                      cursor={"pointer"}
                      onClick={() =>
                        setClientEmailList(() =>
                          clientEmailList.filter(
                            (item) => item.email !== it.email
                          )
                        )
                      }
                    />
                  )}
                </div>
              );
            })}
          </div>
          <div>
            <button
              className="btn btn-primary"
              onClick={() => {
                if (clientEmailList.some((item) => item.checked === true)) {
                  setProducts((prevData) => {
                    const updatedData = prevData.map((item) => {
                      if (item.id === editRowData.id) {
                        const newEmails = clientEmailList
                          ?.filter((it) => it.checked === true)
                          ?.map((it) => it.email)
                          .join(",");
                        item.npsClientEmail = newEmails;

                        if (item.customer_emails) {
                          const existingEmails =
                            item.customer_emails.split(",");
                          const uniqueEmails = Array.from(
                            new Set(existingEmails.concat(newEmails.split(",")))
                          );
                          item.customer_emails = uniqueEmails.join(",");
                        } else {
                          item.customer_emails = newEmails;
                        }
                      }
                      return item;
                    });
                    return updatedData;
                  });

                  setClickButtonPopUp(false);
                } else {
                  setSelectionCheck(true);
                  setTimeout(() => {
                    setSelectionCheck(false);
                  }, 3000);
                }
              }}
            >
              <AiFillSave />
              Select
            </button>
          </div>
        </CModalBody>
      </CModal>
    );
  }
}
