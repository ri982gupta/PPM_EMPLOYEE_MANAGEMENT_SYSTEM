import React, { useRef } from "react";
import { useState } from "react";
import { useEffect } from "react";
import { environment } from "../../environments/environment";
import Popup from "./Popup";
import "./Resources.scss";
import axios from "axios";
import CellRendererPrimeReactDataTable from "../PrimeReactTableComponent/CellRendererPrimeReactDataTable";
import { Column } from "primereact/column";
import { Popover } from "@coreui/coreui";
import DatePicker from "react-datepicker";
import moment from "moment";
import ForecastProjectPopUp from "../RevenueMetrices/ForecastProjectPopUp";
import { AiOutlineLeftSquare, AiOutlineRightSquare } from "react-icons/ai";
import { BiChevronLeft, BiChevronRight, BiX } from "react-icons/bi";
import { ReactSearchAutocomplete } from "react-search-autocomplete";
import { VscSave } from "react-icons/vsc";
import SearchDefaultTable from "./SearchDefaultTable";
import VendorSearchTable from "./VendorSearchTable";
import "./VendorManagement.scss";
import { useLocation } from "react-router-dom";
import { IconButton } from "@material-ui/core";
import Loader from "../Loader/Loader";
import { FaSave } from "react-icons/fa";
// import { ToggleButton } from "primereact/togglebutton";

function Resources(props) {
  const [popup, setPopup] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [name, setName] = useState("");
  const [searchapidata, setSearchApiData] = useState([]);
  const [data, setData] = useState([]);
  const [backupdata, setBackUpData] = useState([]);
  const [backupdataNw, setBackUpDataNw] = useState([]);
  const [contractEndDate, setContractEndDate] = useState([]);

  const {
    bodyDataa,
    flag,
    vendorId,
    tableTitle,
    colorFilter,
    summaryData,
    validationMsg,
    contractIds,
    searchHandle,
    setLoader,
    loader,
    checked,
    setChecked,
    maxHeight1,
    fileName,
  } = props;

  const [exportData, setExportData] = useState([]);
  const [headerData, setHeaderData] = useState([]);
  const [bodyData, setBodyData] = useState([]);
  const [colorsState, setColorsState] = useState([]);
  const [resourceTable, setResourceTable] = useState([]);
  const [LinkId, setLinkId] = useState();
  const [allocationtable, setAllocationTable] = useState(false);
  const graphRef1 = useRef(null);
  const [graphKey1, setGraphKey1] = useState(0);
  const [vendor, setVendor] = useState([]);
  const [searchValue, setSearchValue] = useState({});
  const [open, setOpen] = useState(false);
  const [validColor, setValidColor] = useState([]);
  const [value, setValue] = useState("");
  const location = useLocation();
  const [expanded, setExpanded] = useState(false);

  const currentURL = location.pathname.toString();
  // const [checked, setChecked] = useState(false);
  //var color = [];
  let firstColor = colorFilter[0];
  let secondColor = colorFilter[1];
  let thirdColor = colorFilter[2];
  let contractType = [
    "<<Please Select>>",
    "On Exit Path",
    "Conv in Prog",
    "Fixed Bid",
    "awaiting Conv - DP/CL",
    "Contract 2 Hire",
    "Contract",
    "Freelancer",
    "Offered",
    // summaryData[0].contract,
    // summaryData[0].contract_hire,
    // summaryData[0].freelancer,
    // summaryData[0].fixed_bid,
    // summaryData[0].offered,
    // summaryData[0].on_exit_path,
    // summaryData[0].conv_in_prog,
    // summaryData[0].awaiting_conv,
  ];
  let skillType = [
    "<<Please Select>>",
    "Core",
    "Non Core",
    // summaryData[2].name,
    // summaryData[3].name,
  ];

  let lapAlloc = ["<<Please Select>>", "Yes", "No"];
  let convElig = ["<<Please Select>>", "Yes", "No"];

  const getVendors = () => {
    axios
      .get(baseUrl + `/VendorMS/vendor/getVendorsNameandId`)

      .then((Response) => {
        let vendors = [];
        let data = Response.data;
        data.length > 0 &&
          data.forEach((e) => {
            let vendorObj = {
              label: e.name,
              value: e.id,
            };
            vendors.push(vendorObj);
          });
        setVendor(vendors);
        //setSelectedVendor(vendors);
      })
      .catch((error) => console.log(error));
  };
  useEffect(() => {
    getVendors();
  }, []);

  useEffect(() => {
    if (graphKey1 && graphRef1.current) {
      graphRef1.current.scrollIntoView({ behavior: "smooth" });
    }
    // window.scrollTo({ top: 3500, behavior: "smooth" });
  }, [graphKey1]);
  var d = new Date();
  var year = d.getFullYear();
  var month1 = d.getMonth();
  var day = d.getDate();
  var c = new Date(year, month1, day - 7);

  var date = moment(d).format("yyyy-MM-DD");
  var prev = moment(c).format("yyyy-MM-DD");

  const initialData = {
    buIds: "-1",
    country: "-1",
    fromDate: prev,
    toDate: date,
    lkKey: "total_hc",
    skillId: "0",
    isExport: "0",
    vendorId: vendorId,
    page: "",
    custId: "0",
    projId: "0",
    buId: "0",
  };
  const abortController = useRef(null);

  const fetchdata = () => {
    axios({
      method: "post",
      url: baseUrl + "/VendorMS/management/getVendManagementResourceDtls",
      //url: `http://localhost:8093/VendorMS/management/getVendManagementResourceDtls`,
      data: initialData,
    })
      .then(function (response) {
        var response = response.data;

        let Headerdata = [
          {
            employee_number: "Emp ID",
            resource_name: "Name",
            start_date: "DOJ",
            department: "Dept",
            supervisor: "Supervisor",
            skills: "Skill",
            projects: "Projects",
            bill_allocs: "Billable Allocs",
            bill_rate: "Bill Rate($)",
            bill_rate_at_CB: "Bill Rate at CB",
            pay_rate: "Pay Rate($)",
            cost_rate_at_CB: "Cost Rate at CB",
            gm_perc: "GM%",
            gm_perc_on_CB: "GM% on CB",
            laptop_allocated: "Laptop Allocated",
            conversion_eligibility: "Conversion Eligibility",
            LinkedIN_Id: "LinkedIn Id",
            alloc_end_date: "Alloc End Date",
            contract_end_date: "Contract End Date",
            ad_contract_end_date: "AD Expiry Date",
            vendor_name: "Vendor Name",
            contract_type: "Contract Type",
            skill_type: "Skill Type",
          },
        ];
        let hData = [];
        let bData = [];
        for (let index = 0; index < response.length; index++) {
          if (index == 0) {
            hData.push(response[index]);
          } else {
            bData.push(response[index]);
          }
        }
        if (flag == 1) {
          setData(Headerdata.concat(bodyDataa));
          setBackUpData(Headerdata.concat(bodyDataa));
          setBackUpDataNw(Headerdata.concat(bodyDataa));
          setBodyData(bodyDataa);
          setSearchApiData(bodyDataa);
        } else {
          setData(Headerdata.concat(bData));
          setBackUpData(Headerdata.concat(bData));
          setBackUpDataNw(Headerdata.concat(bData));
          setBodyData(bData);
          setSearchApiData(bData);
        }
      })
      .catch(function (response) {});
  };
  let Headerdata = [
    {
      employee_number: "Emp ID",
      resource_name: "Name",
      start_date: "DOJ",
      department: "Dept",
      supervisor: "Supervisor",
      skills: "Skill",
      projects: "Projects",
      bill_allocs: "Billable Allocs",
      bill_rate: "Bill Rate",
      bill_rate_at_CB: "Bill Rate at CB",
      pay_rate: "Pay Rate",
      cost_rate_at_CB: "Cost Rate at CB",
      gm_perc: "GM%",
      gm_perc_on_CB: "GM% on CB",
      laptop_allocated: "Laptop Allocated",
      conversion_eligibility: "Conversion Eligibility",
      LinkedIN_Id: "LinkedIn Id",
      alloc_end_date: "Alloc End Date",
      contract_end_date: "Contract End Date",
      ad_contract_end_date: "AD Expiry Date",
      vendor_name: "Vendor Name",
      contract_type: "Contract Type",
      skill_type: "Skill Type",
    },
  ];
  const colorsData = {
    "#FF0": "Alloc End Date < Contract End Dt",
    "#da4832": "Alloc End Date = Contract End Dt",
    "#3dbb49": "Alloc End Date > Contract End Dt",
  };

  const handleClose = () => {
    setAnchorEl(false);
  };

  const baseUrl = environment.baseUrl;

  useEffect(() => {
    // data[0] && setHeaderData(JSON.parse(JSON.stringify(data[0])));
    let imp = ["XLS"];
    setExportData(imp);
  }, []);
  // useEffect(() => {
  //   let imp = ["XLS"];
  //   setExportData(imp);
  // }, []);
  const Table =
    tableTitle == "total_hc"
      ? "Total HC Details"
      : tableTitle == "contract"
      ? "Contract Details"
      : tableTitle == "contract_hire"
      ? "Contract 2 Hire Details"
      : tableTitle == "freelancer"
      ? "Freelancer Details"
      : tableTitle == "fixed_bid"
      ? "Fixed Bid Details"
      : tableTitle == "offered"
      ? "Offered Details"
      : tableTitle == "on_exit_path"
      ? "On Exit Path Details"
      : tableTitle == "conv_in_prog"
      ? "Conv in Prog Details"
      : "awaiting Conv - DP/CL Details";

  useEffect(() => {
    fetchdata();
  }, [vendorId]);
  useEffect(() => {
    if (flag === 1) {
      setData(Headerdata.concat(bodyDataa));
      setBackUpData(Headerdata.concat(bodyDataa));
      setBackUpDataNw(Headerdata.concat(bodyDataa));
    }
  }, [bodyDataa, Table]);

  const filteringColors = () => {
    let colors = null;
    if (bodyDataa?.length > 0) {
      colors = bodyDataa.map(
        (element) => element.alloc_contract_date_icon?.split("~")[0]
      );
      let finalColors = [...new Set(colors)];
      setColorsState(finalColors);
    }
  };

  useEffect(() => {
    filteringColors();
  }, [bodyDataa]);

  const handleClick = (event, name) => {
    setName(name);
    // window.scrollTo({ top: 1500, behavior: "smooth" });
    // setAnchorEl(true);
    // setAnchorEl(e.currentTarget);
  };

  //color sorting

  let table1 = (
    <div className="legend red">
      <div className="legendCircle "></div>
      <div className="legendTxt">Alloc End Date &gt; Contract End Dt </div>
    </div>
  );

  let table2 = (
    <div className="legend green">
      <div className="legendCircle"></div>
      <div className="legendTxt"> Alloc End Date = Contract End Dt </div>
    </div>
  );

  const table3 = (
    <div className="legend amber">
      <div className="legendCircle"></div>
      <div className="legendTxt"> Alloc End Date &lt; Contract End Dt </div>
    </div>
  );

  const tableNew = (
    <div className="row">
      <div className="legendContainer">
        {firstColor == "#da4832"
          ? table1
          : firstColor == "#3dbb49"
          ? table2
          : firstColor == "#FF0"
          ? table3
          : ""}
        {secondColor == "#da4832"
          ? table1
          : secondColor == "#3dbb49"
          ? table2
          : secondColor == "#FF0"
          ? table3
          : ""}
        {thirdColor === "#da4832"
          ? table1
          : thirdColor == "#3dbb49"
          ? table2
          : thirdColor == "#FF0"
          ? table3
          : ""}
      </div>
    </div>
  );

  const [access, setAccess] = useState([]);

  const url = window.location.href;
  const projectArr = url.split(":");
  // /CommonMS/master/getTabMenus?ProjectId=117&loggedUserId=4452475&type=vendor&subType=vmg
  const getAccess = (a) => {
    axios({
      method: "get",
      url:
        baseUrl +
        `/CommonMS/master/getTabMenus?ProjectId=${projectArr[3]}&loggedUserId=${loggedUserId}&type=vendor&subType=vmg`,
    })
      .then(function (response) {
        var resp = response.data;
        // resp.push({ id: "-1", name: "<<ALL>>" });
        const respData = resp.find((item) => item.display_name === "Resources");
        const accessLevel = respData.userRoles.includes("908")
          ? 908
          : respData.userRoles.includes("911")
          ? 911
          : null;
        setAccess(accessLevel);
      })
      .catch(function (response) {});
  };
  useEffect(() => {
    // getAccess();
  }, []);

  const tooltipDept = (data) => {
    return (
      <div className="ellipsis" data-toggle="tooltip" title={data.department}>
        {data.department}
      </div>
    );
  };
  const tooltipSupervisor = (data) => {
    return (
      <div className="ellipsis" data-toggle="tooltip" title={data.supervisor}>
        {data.supervisor}
      </div>
    );
  };
  const tooltipProject = (data) => {
    return (
      <div className="ellipsis" data-toggle="tooltip" title={data.projects}>
        {data.projects}
      </div>
    );
  };
  const tooltipSkills = (data) => {
    return (
      <div className="ellipsis" data-toggle="tooltip" title={data.skills}>
        {data.skills}
      </div>
    );
  };
  const allocDtAlign = (data) => {
    return (
      <div className="align center ellipsis" data-toggle="tooltip">
        {data.alloc_end_date}
      </div>
    );
  };
  const contractDtAlign = (data) => {
    return (
      <div className="align center ellipsis" data-toggle="tooltip">
        {data.alloc_contract_date_icon}
      </div>
    );
  };

  const empNumber = (data) => {
    return (
      <div
        className=" ellipsis"
        data-toggle="tooltip"
        title={data.employee_number}
        style={{ textAlign: "Center" }}
      >
        {data.employee_number}
      </div>
    );
  };

  const billAllocs = (data) => {
    const roundedBillAllocs = parseFloat(data.bill_allocs).toFixed(2);

    return (
      <div className="ellipsis" data-toggle="tooltip" title={roundedBillAllocs}>
        <div className="align right">{roundedBillAllocs}</div>
      </div>
    );
  };

  const billRate = (data) => {
    const roundedBillAllocs = parseFloat(data.bill_rate).toFixed(2);
    return (
      <div className="ellipsis" data-toggle="tooltip" title={roundedBillAllocs}>
        <div className="align right">{roundedBillAllocs}</div>
      </div>
    );
  };

  const billRateAtCB = (rowData) => {
    let rId = rowData.resource_id;
    const isvNameInItems = validColor.some((item) => item.resource_id == rId);
    let indexWhereMatched = validColor.findIndex(
      (item) => item.resource_id === rId
    );
    return (
      <div
        className="ellipsis colWidth"
        data-toggle="tooltip"
        title={rowData.bill_rate_at_CB}
      >
        <div>
          <input
            className={
              isvNameInItems == true &&
              (validColor[indexWhereMatched].bill_rate_at_CB == "" ||
                validColor[indexWhereMatched].bill_rate_at_CB == null) &&
              backupdata[indexWhereMatched + 1].bill_rate_at_CB != ""
                ? "error-block"
                : ""
            }
            type="number"
            value={rowData.bill_rate_at_CB}
            onChange={(e) =>
              handleChange(rowData, "bill_rate_at_CB", e.target.value)
            }
          />
        </div>
      </div>
    );
  };
  const payRate = (data) => {
    const roundedBillAllocs = parseFloat(data.pay_rate).toFixed(2);

    return (
      <div className="ellipsis" data-toggle="tooltip" title={roundedBillAllocs}>
        <div className="align right">{roundedBillAllocs}</div>
      </div>
    );
  };

  const costRateAtCB = (rowData) => {
    let rId = rowData.resource_id;
    const isvNameInItems = validColor.some((item) => item.resource_id == rId);
    let indexWhereMatched = validColor.findIndex(
      (item) => item.resource_id === rId
    );
    return (
      <div
        className="ellipsis colWidth"
        data-toggle="tooltip"
        title={rowData.cost_rate_at_CB}
      >
        <div>
          <input
            className={
              isvNameInItems == true &&
              (validColor[indexWhereMatched].cost_rate_at_CB == "" ||
                validColor[indexWhereMatched].cost_rate_at_CB == null) &&
              backupdata[indexWhereMatched + 1].cost_rate_at_CB != ""
                ? "error-block"
                : ""
            }
            type="number"
            value={rowData.cost_rate_at_CB}
            onChange={(e) =>
              handleChange(rowData, "cost_rate_at_CB", e.target.value)
            }
          />
        </div>
      </div>
    );
  };

  const gmPerc = (data) => {
    const roundedBillAllocs = parseFloat(data.gm_perc).toFixed(2);

    return (
      <div className="ellipsis" data-toggle="tooltip" title={roundedBillAllocs}>
        <div className="align right">{roundedBillAllocs}</div>
      </div>
    );
  };

  const gmPercOnCB = (rowData) => {
    let rId = rowData.resource_id;
    const isvNameInItems = validColor.some((item) => item.resource_id == rId);
    let indexWhereMatched = validColor.findIndex(
      (item) => item.resource_id === rId
    );
    return (
      <div
        className=" ellipsis colWidth"
        data-toggle="tooltip"
        title={rowData.gm_perc_on_CB}
      >
        <div>
          <input 
            className={
              isvNameInItems == true &&
              (validColor[indexWhereMatched].gm_perc_on_CB == "" ||
                validColor[indexWhereMatched].gm_perc_on_CB == null) &&
              backupdata[indexWhereMatched + 1].gm_perc_on_CB != ""
                ? "error-block"
                : ""
            }
            type="number"
            value={rowData.gm_perc_on_CB}
            onChange={(e) =>
              handleChange(rowData, "gm_perc_on_CB", e.target.value)
            }
          />
        </div>
      </div>
    );
  };

  const laptopAlloc = (rowData, col) => {
    let rId = rowData.resource_id;
    const isvNameInItems = validColor.some((item) => item.resource_id == rId);
    let indexWhereMatched = validColor.findIndex(
      (item) => item.resource_id === rId
    );
    return (
      <>
        <select
          className={
            isvNameInItems == true &&
            (validColor[indexWhereMatched].laptop_allocated == "" ||
              validColor[indexWhereMatched].laptop_allocated == null ||
              validColor[indexWhereMatched].laptop_allocated ==
                "<<Please Select>>") &&
            backupdata[indexWhereMatched + 1].laptop_allocated != ""
              ? "error-block"
              : ""
          }
          onChange={(e) =>
            handleChange(rowData, "laptop_allocated", e.target.value)
          }
        >
          {lapAlloc.map((item) => (
            <option
              key={item}
              value={item}
              selected={item == rowData.laptop_allocated}
            >
              {item}
            </option>
          ))}
        </select>
      </>
    );
  };

  const convEligibility = (rowData, col) => {
    let rId = rowData.resource_id;
    const isvNameInItems = validColor.some((item) => item.resource_id === rId);
    let indexWhereMatched = validColor.findIndex(
      (item) => item.resource_id === rId
    );

    return (
      <>
        <select
          className={
            isvNameInItems === true &&
            (validColor[indexWhereMatched].conversion_eligibility === "" ||
              validColor[indexWhereMatched].conversion_eligibility === null ||
              validColor[indexWhereMatched].conversion_eligibility ===
                "<<Please Select>>") &&
            backupdata[indexWhereMatched + 1].conversion_eligibility !== ""
              ? "error-block"
              : ""
          }
          onChange={(e) =>
            handleChange(rowData, "conversion_eligibility", e.target.value)
          }
        >
          {convElig.map((item) => (
            <option
              key={item}
              value={item}
              selected={item == rowData.conversion_eligibility}
            >
              {item}
            </option>
          ))}
        </select>
      </>
    );
  };

  const linkedIn = (data) => {
    return (
      <div className=" ellipsis" data-toggle="tooltip" title={data.LinkedIN_Id}>
        {data.LinkedIN_Id}
      </div>
    );
  };

  const allocEndDate = (data) => {
    return (
      <div
        className=" ellipsis"
        data-toggle="tooltip"
        title={data.alloc_end_date}
      >
        {data.alloc_end_date}
      </div>
    );
  };
  const VendorName = (data) => {
    return (
      <div className=" ellipsis" data-toggle="tooltip" title={data.vendor_name}>
        {data.vendor_name}
      </div>
    );
  };
  const contractTypes = (data) => {
    return (
      <div
        className=" ellipsis"
        data-toggle="tooltip"
        title={data.contract_type}
      >
        {data.contract_type}
      </div>
    );
  };

  const expDtAlign = (data) => {
    return <div className="align center">{data.ad_contract_end_date}</div>;
  };

  const LinkTemplate = (data) => {
    const ellipsisStyle = {
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis",
      color: "#15a7ea",
      cursor: "pointer",
    };
    return (
      <>
        {access == 908 || access == 911 ? (
          <div>
            {" "}
            {data.alloc_contract_date_icon ==
            "#da4832~^Alloc End Date > Contract End Dt" ? (
              <div className="legend red" style={ellipsisStyle}>
                <div
                  className="legendCircle "
                  data-toggle="tooltip"
                  title={"Alloc End Date > Contract End Dt"}
                ></div>
                <div
                  className="ellipsis"
                  title={data.resource_name}
                  style={ellipsisStyle}
                >
                  {data.resource_name}
                </div>
              </div>
            ) : data.alloc_contract_date_icon ==
                "#3dbb49~^Alloc End Date = Contract End Dt" ||
              data.alloc_contract_date_icon == "#3dbb49~^No Contract End Dt" ? (
              <div
                className="legend green"
                style={ellipsisStyle}
                title={data.resource_name}
                // style={{ color: "#15a7ea", cursor: "pointer" }}
              >
                <div
                  className="legendCircle "
                  data-toggle="tooltip"
                  title={"Alloc End Date = Contract End Dt"}
                ></div>
                <div
                  className="ellipsis"
                  data-toggle="popoverLink"
                  title={data.resource_name}
                  // style={{ color: "#15a7ea", cursor: "pointer" }}
                  style={ellipsisStyle}
                >
                  {data.resource_name}
                </div>
              </div>
            ) : data.alloc_contract_date_icon ==
              "#FF0~^Alloc End Date < Contract End Dt" ? (
              <div
                className="legend amber"
                style={ellipsisStyle}

                // style={{ color: "#15a7ea", cursor: "pointer" }}
              >
                <div
                  className="legendCircle "
                  data-toggle="tooltip"
                  title={"Alloc End Date < Contract End Dt"}
                ></div>
                <div
                  className="ellipsis "
                  data-toggle="popoverLink"
                  title={data.resource_name}
                  // style={{ color: "#15a7ea", cursor: "pointer" }}
                  style={ellipsisStyle}
                >
                  {data.resource_name}
                </div>
              </div>
            ) : (
              ""
            )}{" "}
          </div>
        ) : (
          <div
            className="legendContainer  ellipsis"
            onClick={(e) => {
              handleClick(e, data.resource_name);
              setLinkId(data.resource_id);
              // getResourceTable(data.resource_id);
              setAnchorEl(e.currentTarget);
              setAllocationTable(false);
            }}
          >
            {" "}
            {data.alloc_contract_date_icon ==
            "#da4832~^Alloc End Date > Contract End Dt" ? (
              <div className="legend red" style={ellipsisStyle}>
                <div
                  className="legendCircle "
                  data-toggle="tooltip"
                  title={"Alloc End Date > Contract End Dt"}
                ></div>
                <div
                  className="ellipsis"
                  data-toggle="popoverLink"
                  to={Popover}
                  title={data.resource_name}
                  style={ellipsisStyle}
                >
                  {data.resource_name}
                </div>
              </div>
            ) : data.alloc_contract_date_icon ==
                "#3dbb49~^Alloc End Date = Contract End Dt" ||
              data.alloc_contract_date_icon == "#3dbb49~^No Contract End Dt" ? (
              <div
                className="legend green"
                style={ellipsisStyle}
                to={Popover}
                title={data.resource_name}
                // style={{ color: "#15a7ea", cursor: "pointer" }}
              >
                <div
                  className="legendCircle "
                  data-toggle="tooltip"
                  title={"Alloc End Date = Contract End Dt"}
                ></div>
                <div
                  className="ellipsis"
                  data-toggle="popoverLink"
                  title={data.resource_name}
                  // style={{ color: "#15a7ea", cursor: "pointer" }}
                  style={ellipsisStyle}
                >
                  {data.resource_name}
                </div>
              </div>
            ) : data.alloc_contract_date_icon ==
              "#FF0~^Alloc End Date < Contract End Dt" ? (
              <div
                className="legend amber"
                style={ellipsisStyle}
                to={Popover}
                // style={{ color: "#15a7ea", cursor: "pointer" }}
              >
                <div
                  className="legendCircle "
                  data-toggle="tooltip"
                  title={"Alloc End Date < Contract End Dt"}
                ></div>
                <div
                  className="ellipsis "
                  data-toggle="popoverLink"
                  title={data.resource_name}
                  to={Popover}
                  // style={{ color: "#15a7ea", cursor: "pointer" }}
                  style={ellipsisStyle}
                >
                  {data.resource_name}
                </div>
              </div>
            ) : (
              ""
            )}{" "}
          </div>
        )}
      </>
    );
  };

  const handleChange1 = (rowData, vendor) => {
    setOpen(false);
    const updatedData = [...data];
    const rowIndex = updatedData.findIndex(
      (item) => item.employee_number === rowData.employee_number
    );
    updatedData[rowIndex] = { ...rowData, ...vendor };
    setData(updatedData);
  };
  const handleVendorSelect = (rowData, selectedVendor) => {
    handleChange1(rowData, {
      vendor_id: selectedVendor.value,
      vendor_name: selectedVendor.label,
    });
  };
  const handleChange = (rowData, field, value) => {
    setOpen(false);
    const updatedData = [...data];
    const rowIndex = updatedData.findIndex(
      (item) => item.employee_number === rowData.employee_number
    );
    updatedData[rowIndex] = { ...rowData, [field]: value };
    setData(updatedData);
  };

  const handleSearch = (rowData, field, value, result) => {
    setContractEndDate(rowData.contract_end_date);
    setValue(value);
    const isTextInItems = vendor.some(
      (item) => item.label.toLowerCase() == value.toLowerCase()
    );
    if (!isTextInItems) {
      setSearchValue(rowData);
      setOpen(true);
    }
  };
  useEffect(() => {
    if (open == true && value != "") {
      document.addEventListener("click", handleOutsideClick);
      return () => {
        document.removeEventListener("click", handleOutsideClick);
      };
    } else if (open == true && value == "") {
      handleOutsideClick();
    }
  }, [open][value]);
  const handleOutsideClick = () => {
    const updatedData = [...data];
    const rowIndex = updatedData.findIndex(
      (item) => item.resource_id === searchValue.resource_id
    );
    updatedData[rowIndex] = { ...data[rowIndex], ["vendor_id"]: "" };
    setData(updatedData);
    setOpen(false);
  };

  const inputTwo = (rowData, col) => {
    let rId = rowData.resource_id;
    const isvNameInItems = validColor.some((item) => item.resource_id == rId);
    let indexWhereMatched = validColor.findIndex(
      (item) => item.resource_id === rId
    );

    return (
      <div className="autoComplete-container cancel">
        <div
          className={
            (isvNameInItems == true &&
              validColor[indexWhereMatched]?.vendor_id === "") ||
            (validColor[indexWhereMatched]?.vendor_id === "0" &&
              backupdata[indexWhereMatched + 1].vendor_id != "")
              ? "error-block"
              : ""
          }
        >
          <ReactSearchAutocomplete
            //className="cancelNw"
            items={vendor}
            id="VendorNameId"
            name="VendorNameId"
            type="text"
            inputSearchString={
              rowData.vendor_name == ""
                ? ""
                : rowData.vendor_name == null
                ? ""
                : rowData.vendor_name
            }
            onSearch={(value, result) => {
              handleSearch(rowData, "vendor_name", value, result);
            }}
            onSelect={(e) => {
              handleVendorSelect(rowData, e);
            }}
            fuseOptions={{ keys: ["label", "value"] }}
            resultStringKeyName="label"
            showNoResults={false}
            showClear={false}
            placeholder="Type to Search"
            showIcon={false}
          />
        </div>
      </div>
    );
  };
  const inputThere = (rowData, col) => {
    let rId = rowData.resource_id;
    const isvNameInItems = validColor.some((item) => item.resource_id == rId);
    let indexWhereMatched = validColor.findIndex(
      (item) => item.resource_id === rId
    );
    return (
      <>
        <select
          onChange={(e) =>
            handleChange(rowData, "contract_type", e.target.value)
          }
          className={
            isvNameInItems == true &&
            (validColor[indexWhereMatched].contract_type == "" ||
              validColor[indexWhereMatched].contract_type ==
                "<<Please Select>>") &&
            backupdata[indexWhereMatched + 1].contract_type != ""
              ? "error-block"
              : ""
          }
        >
          {contractType.map((item) => (
            <option
              key={item}
              value={item}
              selected={item == rowData.contract_type}
            >
              {item}
            </option>
          ))}
        </select>
      </>
    );
  };

  const inputFour = (rowData, col) => {
    let rId = rowData.resource_id;
    const isvNameInItems = validColor.some((item) => item.resource_id == rId);
    let indexWhereMatched = validColor.findIndex(
      (item) => item.resource_id === rId
    );
    return (
      <>
        <select
          className={
            isvNameInItems == true &&
            (validColor[indexWhereMatched].skill_type == "" ||
              validColor[indexWhereMatched].skill_type ==
                "<<Please Select>>") &&
            backupdata[indexWhereMatched + 1].skill_type != ""
              ? "error-block"
              : ""
          }
          onChange={(e) => handleChange(rowData, "skill_type", e.target.value)}
        >
          {skillType.map((item) => (
            <option
              key={item}
              value={item}
              selected={item == rowData.skill_type}
            >
              {item}
            </option>
          ))}
        </select>
      </>
    );
  };
  const inputFive = (rowData, col) => {
    const resourceId = rowData.resource_id; // Replace with the actual resource_id
    const row = data.find((item) => item.resource_id === resourceId);

    let rId = rowData.resource_id;
    const isvNameInItems = validColor.some((item) => item.resource_id == rId);
    let indexWhereMatched = validColor.findIndex(
      (item) => item.resource_id === rId
    );

    return (
      <div>
        <span>
          {rowData.contract_end_date ? (
            <DatePicker
              className={
                isvNameInItems == true &&
                validColor[indexWhereMatched].contract_end_date == "" &&
                backupdata[indexWhereMatched + 1].contract_end_date != ""
                  ? "error-block"
                  : ""
              }
              dateFormat="dd-MMM-yyyy"
              onKeyDown={(e) => {
                e.preventDefault();
              }}
              selected={moment(rowData.contract_end_date).toDate()}
              showYearDropdown
              showMonthDropdown
              dropdownMode="select"
              style={{ textAlign: "center" }}
              onChange={(date) =>
                handleChange(
                  rowData,
                  "contract_end_date",
                  moment(date).format("YYYY-MM-DD")
                )
              }
            />
          ) : (
            <DatePicker
              className={
                isvNameInItems == true &&
                validColor[indexWhereMatched].contract_end_date == "" &&
                backupdata[indexWhereMatched + 1].contract_end_date != ""
                  ? "error-block"
                  : ""
              }
              dateFormat="dd-MMM-yyyy"
              onKeyDown={(e) => {
                e.preventDefault();
              }}
              // selected={moment(rowData.contract_end_date).toDate()}
              placeholderText="Select Date"
              showYearDropdown
              showMonthDropdown
              dropdownMode="select"
              style={{ textAlign: "center" }}
              onChange={(date) =>
                handleChange(
                  rowData,
                  "contract_end_date",
                  moment(date).format("YYYY-MM-DD")
                )
              }
            />
          )}
        </span>
      </div>
    );
  };

  const nameHeader = (
    <div className="shiftAllowanceExpandIcon">
      <span>Name</span>
      <IconButton onClick={() => setExpanded(!expanded)}>
        {expanded ? <BiChevronLeft /> : <BiChevronRight />}
      </IconButton>
    </div>
  );

  const dynamicColumns = Object.keys(headerData)?.map((col, i) => {
    // var color = [];
    return col == "vendor_name" ? (
      <Column
        sortable
        key={col}
        field={col}
        header={headerData[col]}
        style={{ width: "10rem" }}
        body={inputTwo}
      />
    ) : col == "contract_type" ? (
      <Column
        sortable
        key={col}
        field={col}
        header={headerData[col]}
        style={{ width: "10rem" }}
        body={inputThere}
      />
    ) : col == "skill_type" ? (
      <Column
        sortable
        key={col}
        field={col}
        header={headerData[col]}
        style={{ width: "10rem", alignContent: "left" }}
        body={inputFour}
      />
    ) : col == "laptop_allocated" ? (
      <Column
        sortable
        key={col}
        field={col}
        header={headerData[col]}
        style={{ width: "10rem", alignContent: "left" }}
        body={laptopAlloc}
      />
    ) : col == "conversion_eligibility" ? (
      <Column
        sortable
        key={col}
        field={col}
        header={headerData[col]}
        style={{ width: "10rem", alignContent: "left" }}
        body={convEligibility}
      />
    ) : col == "LinkedIN_Id" ? (
      <Column
        sortable
        key={col}
        field={col}
        header={headerData[col]}
        style={{ width: "10rem", alignContent: "left" }}
        body={linkedIn}
      />
    ) : col == "contract_end_date" ? (
      <Column
        sortable
        key={col}
        field={col}
        header={headerData[col]}
        style={{ width: "10rem" }}
        body={inputFive}
      />
    ) : ["start_date", "department", "supervisor", "skills"].includes(col) ? (
      <Column
        sortable
        key={col}
        body={
          col == "ad_contract_end_date"
            ? expDtAlign
            : col == "alloc_contract_date_icon"
            ? contractDtAlign
            : col == "alloc_end_date"
            ? allocDtAlign
            : col == "employee_number"
            ? empNumber
            : col == "skills"
            ? tooltipSkills
            : col == "projects"
            ? tooltipProject
            : col == "department"
            ? tooltipDept
            : col == "supervisor"
            ? tooltipSupervisor
            : col == "bill_allocs"
            ? billAllocs
            : col == "bill_rate"
            ? billRate
            : col == "bill_rate_at_CB"
            ? billRateAtCB
            : col == "pay_rate"
            ? payRate
            : col == "cost_rate_at_CB"
            ? costRateAtCB
            : col == "gm_perc"
            ? gmPerc
            : col == "gm_perc_on_CB"
            ? gmPercOnCB
            : col == "alloc_end_date"
            ? allocEndDate
            : col == "vendor_name"
            ? VendorName
            : col == "contract_type"
            ? contractTypes
            : col == "resource_name" && LinkTemplate
        }
        field={col}
        header={col == "resource_name" ? nameHeader : headerData[col]}
        style={{
          display:
            ["start_date", "department", "supervisor", "skills"].includes(
              col
            ) && expanded
              ? "table-cell"
              : "none",
        }}
      />
    ) : (
      <Column
        sortable
        key={col}
        body={
          col == "ad_contract_end_date"
            ? expDtAlign
            : col == "alloc_contract_date_icon"
            ? contractDtAlign
            : col == "alloc_end_date"
            ? allocDtAlign
            : col == "employee_number"
            ? empNumber
            : col == "skills"
            ? tooltipSkills
            : col == "projects"
            ? tooltipProject
            : col == "department"
            ? tooltipDept
            : col == "supervisor"
            ? tooltipSupervisor
            : col == "bill_allocs"
            ? billAllocs
            : col == "bill_rate"
            ? billRate
            : col == "bill_rate_at_CB"
            ? billRateAtCB
            : col == "pay_rate"
            ? payRate
            : col == "cost_rate_at_CB"
            ? costRateAtCB
            : col == "gm_perc"
            ? gmPerc
            : col == "gm_perc_on_CB"
            ? gmPercOnCB
            : col == "alloc_end_date"
            ? allocEndDate
            : col == "vendor_name"
            ? VendorName
            : col == "contract_type"
            ? contractTypes
            : col == "resource_name" && LinkTemplate
        }
        field={col}
        header={col == "resource_name" ? nameHeader : headerData[col]}
      />
    );
  });

  const areArraysOfObjectsEqual = (arr1, arr2) => {
    let postData = [];
    let color = [];
    let resource = [];
    let valid = false;
    let validNw = true;
    let count = 0;

    for (let i = 0; i < arr1.length; i++) {
      let changedRow = false;
      const obj1 = arr1[i];
      const obj2 = arr2[i];

      resource.push(bodyData[i]);
      // Compare each property of the objects
      for (const key in obj1) {
        if (obj1.hasOwnProperty(key)) {
          if (obj1[key] !== obj2[key]) {
            changedRow = true;
          }
        }
      }
      if (changedRow == true) {
        valid = true;

        let obj = {};
        let vendorName = arr1[i].vendor_id;
        let contractDate = arr1[i].contract_end_date;
        let skillTypes = arr1[i].skill_type;
        let contractTypes = arr1[i].contract_type;
        let conversionElig = arr1[i].conversion_eligibility;
        let laptopAllocated = arr1[i].laptop_allocated;
        let billRate = arr1[i].bill_rate_at_CB;
        let costRate = arr1[i].cost_rate_at_CB;
        let gmPercentage = arr1[i].gm_perc_on_CB;
        if (
          contractTypes == "<<Please Select>>" ||
          contractTypes == "" ||
          skillTypes == "<<Please Select>>" ||
          skillTypes == "" ||
          conversionElig == "<<Please Select>>" ||
          conversionElig == "" ||
          conversionElig == null ||
          laptopAllocated == "<<Please Select>>" ||
          laptopAllocated == "" ||
          laptopAllocated == null ||
          vendorName == "" ||
          contractDate == "" ||
          billRate == "" ||
          billRate == null ||
          costRate == "" ||
          costRate == null ||
          gmPercentage == "" ||
          gmPercentage == null
        ) {
          count++;
          color.push(data[i]);

          if (count == 1) {
            setValidation("notValid");
            validNw = false;
          }
        } else {
          {
            contractEndDate == "" && (obj["resourceId"] = arr1[i].resource_id);
          }
          {
            contractEndDate !== "" && (obj["id"] = arr1[i].resource_id);
          }

          obj["ContractEndDate"] = moment(arr1[i].contract_end_date).format(
            "YYYY-MM-DD"
          );
          obj["VendorId"] = arr1[i].vendor_id;
          Object?.keys(contractIds)?.forEach((ele) => {
            if (contractIds[ele].lkup_name == arr1[i].contract_type) {
              obj["ContractTypeId"] = contractIds[ele].id;
            }
          });
          obj["resourceId"] = arr1[i].resource_id;
          obj["SkillTypeId"] = arr1[i].skill_type == "Core" ? 1310 : 1311;
          obj["conversionEligibility"] =
            arr1[i].conversion_eligibility == "Yes" ? 1 : "No" ? 0 : null;
          obj["laptopAllocated"] =
            arr1[i].laptop_allocated == "Yes" ? 1 : "No" ? 0 : null;
          obj["billRate"] = arr1[i].bill_rate_at_CB;
          obj["costRate"] = arr1[i].cost_rate_at_CB;
          obj["gmPercentage"] = arr1[i].gm_perc_on_CB;
          postData.push(obj);
        }
        setValidColor(color);
      }
    }
    if (valid == false) {
      setValidation("noChange");
      setTimeout(() => {
        setValidation(false);
      }, 1000);
    } else {
      if (validNw) {
        axios({
          method: "post",
          url:
            baseUrl + `/VendorMS/management/updateVendManagementResourceDtls`,
          data: postData,
        })
          .then((res) => {
            setValidation("save");
            setTimeout(() => {
              setValidation(false);
            }, 3000);
          })
          .catch((error) => {});

        searchHandle();
        // fetchdata();
        setTimeout(() => {
          setLoader(true);
          setTimeout(() => {
            setLoader(false);
          }, 1000);
        }, 1000);
      }
    }
  };
  const setValidation = (v) => {
    validationMsg(v);
  };

  const handleSubmit = (e) => {
    areArraysOfObjectsEqual(data, backupdata);
  };

  //===========Resource Allocation API=======

  const [resourcedate, setResourceDate] = useState(new Date());

  // Calculate the first day of the current month based on resourcedate
  const firstDayOfMonth = new Date(
    resourcedate.getFullYear(),
    resourcedate.getMonth(),
    1
  );

  const loggedUserId = localStorage.getItem("resId");

  useEffect(() => {
    getResourceTable();
  }, [LinkId]);
  let formattedMonth = moment(resourcedate).format("yyyy-MM-DD");

  const dates = {
    fromDate: moment(formattedMonth).startOf("month").format("YYYY-MM-DD"),
    toDate: moment(formattedMonth)
      .startOf("month")
      .add("month", 0)
      .format("YYYY-MM-DD"),
  };
  const [dt, setDt] = useState(dates);

  const addHandler = () => {
    setDt((prev) => ({
      ...prev,
      ["fromDate"]: moment(dt.fromDate).add("month", 1).format("YYYY-MM-DD"),
    }));
    setDt((prev) => ({
      ...prev,
      ["toDate"]: moment(dt.toDate).add("month", 1).format("YYYY-MM-DD"),
    }));
  };

  const subtractHandler = () => {
    setDt((prev) => ({
      ...prev,
      ["fromDate"]: moment(dt.fromDate)
        .subtract("month", 1)
        .format("YYYY-MM-DD"),
    }));
    setDt((prev) => ({
      ...prev,
      ["toDate"]: moment(dt.toDate).subtract("month", 1).format("YYYY-MM-DD"),
    }));
  };

  const getResourceTable = (e, id) => {
    setResourceTable([]);
    axios({
      method: "post",
      url: baseUrl + `/revenuemetricsms/metrics/getResourceTable`,
      data: {
        Src: "project",
        Typ: "allocations",
        ObjectId: LinkId,
        FromDt: dt.toDate,
        AllocType: "billable",
        PrjSource: "-1",
        contTerms: "28,27,752,606,26,25,1024,612,608,609,610,611,750",
        engComps: "-1",
        cslIds: "-1",
        dpIds: "-1",
        UserId: loggedUserId,
      },
    }).then(function (res) {
      setResourceTable(res.data);
    });
  };
  const [componentMounted, setComponentMounted] = useState(false);

  useEffect(() => {
    if (componentMounted) {
      getResourceTable();
    } else {
      setComponentMounted(true);
    }
  }, [dt.toDate, componentMounted]);

  // const toggleButtonHandler = (e) => {
  //   setChecked(!checked);
  // };

  return (
    <>
      {/* <p className="font-weight-bold Vendor-sub-heading pb-0">{Table}:</p> */}
      {currentURL.includes("/vmg/vmg") ? (
        ""
      ) : (
        <div>
          <p
            className="font-weight-bold Vendor-sub-heading pb-0"
            style={{ marginBottom: "10px" }}
          >
            {Table}
          </p>
        </div>
      )}
      <div className="totalHeadCountTable total-headcount-details">
        <VendorSearchTable
          maxHeight1={maxHeight1}
          data={data}
          rows={25}
          dynamicColumns={dynamicColumns}
          tableNew={tableNew}
          headerData={headerData}
          setHeaderData={setHeaderData}
          exportData={exportData}
          fileName={fileName}
          checked={checked}
          setChecked={setChecked}
          resourceTableCurrent="currentVendorResoirce"
        />
        {bodyDataa && !loader ? (
          <div className="col-md-12" align="center">
            <button
              className="btn btn-primary subk-save-btn"
              onClick={() => {
                handleSubmit();
              }}
            >
              <VscSave />
              Save
            </button>
          </div>
        ) : (
          ""
        )}
        {anchorEl && (
          <Popup
            // className="p"
            handleClose={handleClose}
            anchorEl={anchorEl}
            name={name}
            LinkId={LinkId}
            setAllocationTable={setAllocationTable}
            setAnchorEl={setAnchorEl}
            setGraphKey1={setGraphKey1}
            setLoader={setLoader}
          />
        )}
        {allocationtable && (
          <>
            <div className="col-md-12 mt-2">
              <div className="collapseHeader revForcast">
                <div className="leftSection">
                  <span>{name}</span>
                </div>
                <div className="rightSection" style={{ paddingLeft: "865px" }}>
                  <span
                    className="ml-2 chevronContainer"
                    ref={graphRef1}
                    key={graphKey1}
                  >
                    <AiOutlineLeftSquare
                      cursor="pointer"
                      size={"2em"}
                      onClick={subtractHandler}
                    />
                    <span>{moment(dt.toDate).format("MMM-YYYY")}</span>
                    <AiOutlineRightSquare
                      cursor="pointer"
                      size={"2em"}
                      onClick={addHandler}
                    />
                  </span>
                </div>
                <BiX
                  fontSize={"20px"}
                  style={{ backgroundColor: "#c6c0c0", cursor: "pointer" }}
                  onClick={() => {
                    setAllocationTable(false);
                  }}
                />
              </div>
            </div>

            <ForecastProjectPopUp
              linkId={LinkId}
              data={resourceTable}
              expandedCols={[]}
              colExpandState={[]}
              // month={month}
              // setMonth={setMonth}
              // resourcedata={resourcedata}
            />
          </>
        )}
      </div>
    </>
  );
}

export default Resources;
