import React, { useEffect, useRef, useState } from "react";
import { MultiSelect } from "react-multi-select-component";
import {
  FaCaretDown,
  FaChevronCircleDown,
  FaChevronCircleUp,
  FaCircle,
  FaGithub,
  FaSearch,
} from "react-icons/fa";
import fte_active from "../../assets/images/empstatusIcon/fte_active.png";
import fte_inactive from "../../assets/images/empstatusIcon/fte_inactive.png";
import fte_notice from "../../assets/images/empstatusIcon/fte_notice.png";
import subk_active from "../../assets/images/empstatusIcon/subk_active.png";
import subk_inactive from "../../assets/images/empstatusIcon/subk_inactive.png";
import subk_notice from "../../assets/images/empstatusIcon/subk_notice.png";
import { CCollapse } from "@coreui/react";
import { environment } from "../../environments/environment";
import DatePicker from "react-datepicker";
import Loader from "../Loader/Loader";
import axios from "axios";
import "../Innovation/InnovationRevenue.scss";
import moment from "moment";
import SelectSEDialogBox from "../SelectSE/SelectSEDialogBox";
import GlobalValidation from "../ValidationComponent/GlobalValidation";
import { AiFillWarning } from "react-icons/ai";
import InnovationRevenueMaterialTbale from "./InnovationRevenueMaterialTbale";
import { useSelector } from "react-redux";

export default function InnovationRevenue() {
  const [visible, setVisible] = useState(false);
  const [visiblese, setVisibleSe] = useState(false);
  const [counter, setCounter] = useState(0);
  const [displayTable, setDisplayTable] = useState(false);
  const [loaderState, setLoaderState] = useState(false);
  const [cheveronIcon, setCheveronIcon] = useState(FaChevronCircleUp);
  const [results, setResults] = useState([]);
  const [themes, setThemes] = useState([]);
  const [selectedThemes, setSelectedThemes] = useState([]);
  const [themesId, setThemesId] = useState("1,4,2,5,3,6");
  const [solutions, setSolutions] = useState([]);
  const ref = useRef([]);
  const [selectedSolutions, setselectedSolutions] = useState([]);
  const [validationmessage, setValidationMessage] = useState(false);
  const [columns, setColumns] = useState([]);
  const [themeslength, setThemesLength] = useState(0);
  const [solutionId, setSolutionId] = useState(
    "1,2,24,13,12,11,32,10,33,14,38,43,46,40,39,42,44,48,47,45,41,31,4,5,3,8,9,7,6,17,16,15,23,30,26,25,49,34,18,19,20,21,22,37,35,36,28,29,27"
  );
  const [startDate, setStartDate] = useState(() => {
    const date = new Date();
    date.setFullYear(date.getFullYear() + 1);
    date.setMonth(date.getMonth() - 3);
    return date;
  });
  const [quarterdate, setQuarterDate] = useState(() => {
    const today = new Date();
    const year = today.getFullYear();
    const quarter = Math.floor((today.getMonth() + 3) / 3); // Calculate current quarter
    const startMonth = (quarter - 1) * 3; // Start month of the quarter
    const startDate = new Date(year, startMonth, 1); // Start date of the quarter
    return startDate;
  });
  const [stages, setStages] = useState([
    { value: "Closed Dead", label: "Closed Dead" },
    { value: "Closed Lost", label: "Closed Lost" },
    { value: "Closed Won", label: "Closed Won" },
    { value: "Closing", label: "Closing" },
    { value: "Conditional Agreement", label: "Conditional Agreement" },
    { value: "Conditional AgreementSW", label: "Conditional Agreement SW" },
    { value: "Draft Proposal Delivered", label: "Draft Proposal Delivered" },
    { value: "Duplicate Record", label: "Duplicate Record" },
    { value: "On Hold", label: "On Hold" },
    { value: "Proposal Delivered", label: "Proposal Delivered" },
    { value: "Proposal Draft", label: "Proposal Draft" },
    { value: "Qualified", label: "Qualified" },
    { value: "Registration Duplicate", label: "Registration Duplicate" },
    { value: "SOW Delivered", label: "SOW Delivered" },
    { value: "SOW ProposalDelivered", label: "SOW Proposal Delivered" },
    { value: "SVI Duplicate", label: "SVI Duplicate" },
    { value: "Validated", label: "Validated" },
  ]);
  const [stagesdata, setStagesData] = useState([
    { value: "Closed Dead", label: "Closed Dead" },
    { value: "Closed Lost", label: "Closed Lost" },
    { value: "Closed Won", label: "Closed Won" },
    { value: "Closing", label: "Closing" },
    { value: "Conditional Agreement", label: "Conditional Agreement" },
    { value: "Conditional AgreementSW", label: "Conditional Agreement SW" },
    { value: "Draft Proposal Delivered", label: "Draft Proposal Delivered" },
    { value: "Duplicate Record", label: "Duplicate Record" },
    { value: "On Hold", label: "On Hold" },
    { value: "Proposal Delivered", label: "Proposal Delivered" },
    { value: "Proposal Draft", label: "Proposal Draft" },
    { value: "Qualified", label: "Qualified" },
    { value: "Registration Duplicate", label: "Registration Duplicate" },
    { value: "SOW Delivered", label: "SOW Delivered" },
    { value: "SOW ProposalDelivered", label: "SOW Proposal Delivered" },
    { value: "SVI Duplicate", label: "SVI Duplicate" },
    { value: "Validated", label: "Validated" },
  ]);
  const SelectSEData = useSelector(
    (state) => state.selectedSEState.directSETreeData
  );
  const [formdata, setFormdata] = useState({
    themesId: "1,4,2,5,3,6",
    solutionId:
      "1,2,24,13,12,11,32,10,33,14,38,43,46,40,39,42,44,48,47,45,41,31,4,5,3,8,9,7,6,17,16,15,23,30,26,25,49,34,18,19,20,21,22,37,35,36,28,29,27",
    quarter: "2024-04-01",
    stages: "-1",
    executives: "-1",
    isExport: "0",
    userId: "4452476",
  });
  const [salesExecutiveDropdown, setsalesExecutiveDropdown] = useState([]);
  const [selectedSEVal, setSelectedSEVal] = useState(-1);
  const [accessData, setAccessData] = useState(1000);
  useEffect(() => {
    if (selectedSEVal === "1") {
      setVisibleSe(true);
    }
  }, [selectedSEVal]);
  const baseUrl = environment.baseUrl;
  const loggedUserId = localStorage.getItem("resId");
  const [cols, setCols] = useState([
    { field: "name", header: "Theme / Solution / Project", expander: true },
    { field: "amount", header: "Amount($)" },
  ]);
  useEffect(() => {
    getMenus();
  }, []);
  const [routes, setRoutes] = useState([]);
  let textContent = "Innovation";
  let currentScreenName = ["Innovation Revenue"];
  sessionStorage.setItem(
    "breadCrumbs",
    JSON.stringify({
      routes: routes,
      currentScreenName: currentScreenName,
      textContent: textContent,
    })
  );
  const getMenus = () => {
    axios({
      method: "GET",
      url: baseUrl + `/CommonMS/master/getMenus?loggedUserId=${loggedUserId}`,
    }).then((resp) => {
      const urlPathValue = resp.data[5].subMenus[1].url_path;
      const modifiedUrlPath = urlPathValue.replace(/::/g, "/");
      getUrlPath(modifiedUrlPath);

      let data = resp.data.map((menu) => {
        if (menu.subMenus) {
          menu.subMenus = menu.subMenus.filter(
            (subMenu) =>
              subMenu.display_name !== "Project Timesheet (Deprecated)" &&
              subMenu.display_name !== "Invoice Details" &&
              subMenu.display_name !== "Accounting" &&
              subMenu.display_name !== "Upload" &&
              subMenu.display_name !== "Practice Calls [Deprecated]"
          );
        }
        return menu;
      });

      data.forEach((item) => {
        if (item.display_name === textContent) {
          setRoutes([item]);
          sessionStorage.setItem("displayName", item.display_name);
        }
      });
      // const projectStatusReportSubMenu = data
      //   .find((item) => item.display_name === "Innovation")
      //   .subMenus.find((subMenu) => subMenu.display_name === "Revenue");
      // setAccessData(projectStatusReportSubMenu.access_level);
    });
  };
  const getUrlPath = (modifiedUrlPath) => {
    axios({
      method: "get",
      url:
        baseUrl +
        `/CommonMS/security/authorize?url=${modifiedUrlPath}&userId=${loggedUserId}`,
    })
      .then((res) => {})
      .catch((error) => {});
  };
  const icons = {
    fte0: (
      <img
        src={fte_inactive}
        alt="(fte_inactive_icon)"
        style={{ height: "12px" }}
        title="Ex-Employee"
      />
    ),
    fte1: (
      <img
        src={fte_active}
        alt="(fte_active_icon)"
        style={{ height: "12px" }}
        title="Active Employee"
      />
    ),
    fte2: (
      <img
        src={fte_notice}
        alt="(fte_notice_icon)"
        style={{ height: "12px" }}
        title="Employee in notice period"
      />
    ),
    subk0: (
      <img
        src={subk_inactive}
        alt="(subk_inactive_icon)"
        style={{ height: "12px" }}
        title="Ex-Contractor"
      />
    ),
    subk1: (
      <img
        src={subk_active}
        alt="(subk_active_icon)"
        style={{ height: "12px" }}
        title="Active Contractor"
      />
    ),
    subk2: (
      <img
        src={subk_notice}
        alt="(subk_notice_icon)"
        style={{ height: "12px" }}
        title="Contractor in notice period"
      />
    ),
  };
  const getSolutions = () => {
    axios({
      method: "get",
      url:
        baseUrl +
        `/innovationms/innovation/getSolutions?salesforce_opportunity_theme_id=${themesId}`,
    })
      .then((res) => {
        let data = res.data;
        let solution = [];
        data.length > 0 &&
          data.forEach((e) => {
            let solutionObj = {
              label: e.solution_name,
              value: e.id,
            };
            solution.push(solutionObj);
          });
        solution.sort((a, b) => a.label.localeCompare(b.label));
        const allIds = Array.from({ length: 49 }, (_, i) => i + 1);
        const solutionIds = solution.map((item) => item.value);
        const commaSeparatedIds = solutionIds.join(",");
        const allIdsPresent = allIds.every((id) => solutionIds.includes(id));
        const finalIds =
          themeslength == 7 ? commaSeparatedIds + ",0" : commaSeparatedIds;
        setFormdata((prevVal) => ({
          ...prevVal,
          ["solutionId"]: finalIds,
        }));

        setSolutions(solution);
        setselectedSolutions(solution);
      })
      .catch();
  };

  const getThemes = () => {
    axios({
      method: "get",
      url: baseUrl + `/innovationms/innovation/getThemes`,
    })
      .then((res) => {
        let data = res.data;
        let theme = [];

        data.length > 0 &&
          data.forEach((e) => {
            let themeObj = {
              label: e.full_name,
              value: e.id,
            };
            theme.push(themeObj);
          });
        theme.push({ label: "UnAssigned", value: 0 });
        theme.sort((a, b) => a.label.localeCompare(b.label));
        setThemes(theme);
        setSelectedThemes(theme.filter((option) => option.value !== 0));
      })
      .catch();
  };

  useEffect(() => {
    getThemes();
  }, []);
  useEffect(() => {
    getSolutions();
  }, [themesId]);
  const [seenNames, setSeenNames] = useState({});
  const handleSearch = (e) => {
    let valid = GlobalValidation(ref);

    if (valid) {
      {
        setValidationMessage(true);
      }
      return;
    }
    setValidationMessage(false);

    axios({
      method: "post",
      url: baseUrl + `/innovationms/innovation/innovationRevenue`,

      data: {
        themesId:
          formdata.themesId === "1,4,2,5,3,6,0" ? "-1" : formdata.themesId,
        solutionId: formdata.solutionId,
        quarter: moment(quarterdate).format("YYYY-MM-DD"),
        stages: formdata.stages,
        executives:
          formdata.executives == 1 ? SelectSEData : formdata.executives,
        isExport: "0",
        userId: +loggedUserId,
      },
    })
      .then((res) => {
        setResults(res.data.tableData);
        setColumns(res.data.columns);
        setDisplayTable(true);
        const valuesArray = res.data.columns.replace(/'/g, "").split(",");
        const col = valuesArray.map((value) => ({
          accessorKey: value,
          header: value.charAt(0).toUpperCase() + value.slice(1), // Capitalize the first letter
        }));
        setVisible(!visible);
        visible
          ? setCheveronIcon(FaChevronCircleUp)
          : setCheveronIcon(FaChevronCircleDown);
      })
      .catch((e) => {});
  };
  const [tablestate, settableState] = useState(false);
  const formattedData = [];
  let keyCounters = {};

  const processedData = results.reduce((result, current, index, array) => {
    if (index === 0 || current.parentId !== array[index - 1].parentId) {
      // If it's the first element or parentId is different from the previous index
      result.push(current);
    } else {
      // If parentId is the same as the previous index and parentId is not null,
      // set specific key names to empty strings
      result.push({
        ...current,
        name: current.parentId !== null ? "" : current.name,
        // Add more key names as needed
      });
    }
    return result;
  }, []);

  const getsalesExecutiveDropdown = () => {
    axios
      .get(baseUrl + "/SalesMS/MasterController/salesExecutiveData")
      .then((resp) => {
        const data = resp.data;
        const dropdownOptions = data
          .filter((item) => item.isActive === 1)
          .map((item) => {
            return (
              <option key={item.id} value={item.val}>
                {item.lkupName}
              </option>
            );
          });
        setsalesExecutiveDropdown(dropdownOptions);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  useEffect(() => {
    getsalesExecutiveDropdown();
  }, []);
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
  return (
    <div>
      {validationmessage ? (
        <div className="statusMsg error">
          {" "}
          <AiFillWarning /> Please select valid values for highlighted fields
        </div>
      ) : (
        ""
      )}
      <div className="col-md-12">
        <div className="pageTitle">
          <div className="childOne"></div>
          <div className="childTwo">
            <h2>Innovation Revenue</h2>
          </div>
          <div className="childThree toggleBtns">
            <div>
              <p className="searchFilterHeading">Search Filters</p>
              <span
                onClick={() => {
                  setVisible(!visible);
                  visible
                    ? setCheveronIcon(FaChevronCircleUp)
                    : setCheveronIcon(FaChevronCircleDown);
                }}
              >
                {cheveronIcon}
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className="group mb-3 customCard">
        <div className="col-md-12 collapseHeader"></div>
        <CCollapse visible={!visible}>
          <div className="group-content row">
            <div className=" col-md-3 mb-2">
              <div className="form-group row">
                <label className="col-5" htmlFor="customers">
                  Themes<span className="error-text">*</span>
                </label>
                <span className="col-1 p-0">:</span>
                <div className="col-6">
                  <div
                    className="multiselect"
                    ref={(ele) => {
                      ref.current[0] = ele;
                    }}
                  >
                    <MultiSelect
                      ArrowRenderer={ArrowRenderer}
                      valueRenderer={generateDropdownLabel}
                      id="themesId"
                      options={themes}
                      hasSelectAll={true}
                      value={selectedThemes}
                      isLoading={false}
                      shouldToggleOnHover={false}
                      disableSearch={false}
                      overrideStrings={{
                        selectAllFiltered: "Select All",
                        selectSomeItems: "<<Please Select>>",
                      }}
                      disabled={false}
                      onChange={(e) => {
                        setSelectedThemes(e);
                        let filteredTheme = [];
                        e.forEach((d) => {
                          filteredTheme.push(d.value);
                        });
                        setThemesLength(filteredTheme.length);
                        setThemesId(filteredTheme.toString());
                        setFormdata((prevVal) => ({
                          ...prevVal,
                          ["themesId"]: filteredTheme.toString(),
                        }));
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className=" col-md-3 mb-2">
              <div className="form-group row">
                <label className="col-5" htmlFor="custstatus">
                  Solutions<span className="error-text">*</span>
                </label>
                <span className="col-1 p-0">:</span>
                <div className="col-6">
                  <div
                    className="multiselect"
                    ref={(ele) => {
                      ref.current[1] = ele;
                    }}
                  >
                    <MultiSelect
                      id="solutionId"
                      options={solutions}
                      hasSelectAll={true}
                      isLoading={false}
                      shouldToggleOnHover={false}
                      disableSearch={false}
                      value={selectedSolutions}
                      valueRenderer={generateDropdownLabel}
                      ArrowRenderer={ArrowRenderer}
                      disabled={false}
                      overrideStrings={{
                        selectAllFiltered: "Select All",
                        selectSomeItems: "<<Please Select>>",
                      }}
                      onChange={(e) => {
                        setselectedSolutions(e);
                        let filteredSolution = [];
                        e.forEach((d) => {
                          filteredSolution.push(d.value);
                        });
                        setSolutionId(filteredSolution.toString());
                        setFormdata((prevVal) => ({
                          ...prevVal,
                          ["solutionId"]: filteredSolution.toString(),
                        }));
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className=" col-md-3 mb-2">
              <div className="form-group row">
                <label className="col-5" htmlFor="accountexecutive">
                  Quarter<span className="error-text">*</span>
                </label>
                <span className="col-1 p-0">:</span>
                <div
                  className="col-6 datepicker"
                  ref={(ele) => {
                    ref.current[2] = ele;
                  }}
                >
                  <DatePicker
                    id="quarter"
                    selected={startDate}
                    onChange={(e) => {
                      setStartDate(e);
                      const quarterStartMonth = 3;
                      const quarterStartDate = new Date(
                        e.getFullYear(),
                        quarterStartMonth,
                        1
                      );
                      quarterStartDate.setFullYear(
                        quarterStartDate.getFullYear() - 1
                      );
                      const date = new Date(e.getTime());
                      date.setFullYear(date.getFullYear() - 1);
                      date.setMonth(date.getMonth() + 3);
                      setQuarterDate(date);
                      setFormdata((prevVal) => ({
                        ...prevVal,
                        ["quarter"]: e,
                      }));
                    }}
                    dateFormat=" 'FY' yyyy-QQQ"
                    showQuarterYearPicker
                  />
                </div>
              </div>
            </div>

            <div className=" col-md-3 mb-2">
              <div className="form-group row">
                <label className="col-5" htmlFor="csl">
                  Stage<span className="error-text">*</span>
                </label>
                <span className="col-1 p-0">:</span>
                <div className="col-6">
                  <div
                    className="multiselect"
                    ref={(ele) => {
                      ref.current[3] = ele;
                    }}
                  >
                    <MultiSelect
                      id="stages"
                      options={stagesdata}
                      hasSelectAll={true}
                      isLoading={false}
                      shouldToggleOnHover={false}
                      disableSearch={false}
                      value={stages}
                      selected={stages}
                      valueRenderer={generateDropdownLabel}
                      ArrowRenderer={ArrowRenderer}
                      disabled={false}
                      onChange={(e) => {
                        setStages(e);
                        let filteredSolution = [];
                        e.forEach((d) => {
                          filteredSolution.push(d.value);
                        });
                        setFormdata((prevVal) => ({
                          ...prevVal,
                          ["stages"]: filteredSolution.toString(),
                        }));
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className=" col-md-3 mb-2">
              <div className="form-group row">
                <label className="col-5" htmlFor="deliverypartner">
                  Sales Executive<span className="error-text">*</span>
                </label>
                <span className="col-1 p-0">:</span>
                <div className="col-6">
                  <select
                    id="executives"
                    className="text"
                    value={selectedSEVal}
                    onChange={(e) => {
                      setSelectedSEVal(e.target.value);
                      setFormdata((prevVal) => ({
                        ...prevVal,
                        ["executives"]: e.target.value,
                      }));
                    }}
                    ref={(ele) => {
                      ref.current[4] = ele;
                    }}
                  >
                    <option value={""}>{"<< Please select>> "}</option>
                    <option value="-1">{"<< ALL >> "}</option>
                    <option value="1">{"Select"}</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="col-md-12 col-sm-12 col-xs-12 btn-container center my-1">
              {loaderState ? (
                <div className="loaderBlock">
                  <Loader />
                </div>
              ) : (
                <button
                  type="submit"
                  className="btn btn-primary"
                  title="Search"
                  onClick={() => {
                    handleSearch();
                    setDisplayTable(false);
                  }}
                >
                  <FaSearch />
                  Search
                </button>
              )}
            </div>
          </div>
          <SelectSEDialogBox
            visible={visiblese}
            setVisible={setVisibleSe}
            accessData={accessData}
          />
        </CCollapse>
      </div>
      {displayTable && (
        <>
          <div className="InnovationRevenue primeReactTable darkHeader toHead ">
            <InnovationRevenueMaterialTbale
              results={processedData}
              expandedCols={[
                "",
                "customer",
                "opportunity",
                "director",
                "oppStage",
                "probability",
                "executive",
              ]}
              colExpandState={["0", "0", "name"]}
              cols={columns}
            />
          </div>
        </>
      )}
      <div></div>
    </div>
  );
}
