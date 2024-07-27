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
import moment from "moment";
import ForecastProjectPopUp from "../RevenueMetrices/ForecastProjectPopUp";
import { AiOutlineLeftSquare, AiOutlineRightSquare } from "react-icons/ai";
import { BiChevronLeft, BiChevronRight, BiX } from "react-icons/bi";
import SearchDefaultTable from "./SearchDefaultTable";
import VendorSearchTable from "./VendorSearchTable";
import "./VendorManagement.scss";
import ParentVendorTabs from "./ParentVendorTabs";
import { useLocation } from "react-router-dom";
import { IconButton } from "@material-ui/core";
// import { ToggleButton } from "primereact/togglebutton";

function Resources(props) {
  const [popup, setPopup] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [name, setName] = useState("");
  const [searchapidata, setSearchApiData] = useState([]);
  const [data, setData] = useState([]);
  const {
    bodyDataa,
    flag,
    vendorId,
    tableTitle,
    colorFilterR,
    urlState,
    btnState,
    setbtnState,
    setUrlState,
    setFormData,
    checked,
    flags,
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
  const [colorFilter, setColorFilter] = useState([]);
  const [title, setTitle] = useState("");
  const [routes, setRoutes] = useState([]);
  // let textContent = "Vendors";
  // let currentScreenName = ["Vendors", "Resources"];
  const location = useLocation();
  const [expanded, setExpanded] = useState(false);
  const currentURL = location.pathname.toString();
  // const [checked, setChecked] = useState(false);

  // let textContent = "Vendors";
  // let currentScreenName = [" Subk Management"];
  // sessionStorage.setItem(
  //   "breadCrumbs",
  //   JSON.stringify({
  //     routes: routes,
  //     currentScreenName: currentScreenName,
  //     textContent: textContent,
  //   })
  // );

  const getMenus = () => {
    axios({
      method: "GET",
      url: baseUrl + `/CommonMS/master/getMenus?loggedUserId=${loggedUserId}`,
    }).then((resp) => {
      const modifiedUrlPath = "/vmg/vmg";
      getUrlPath(modifiedUrlPath);

      let data = resp.data;
      const updatedMenuData = data.map((category) => ({
        ...category,
        subMenus: category.subMenus.map((submenu) => {
          if (submenu.display_name === "Management") {
            return {
              ...submenu,
              display_name: "Subk Management",
            };
          }
          if (submenu.display_name === "Performance") {
            return {
              ...submenu,
              display_name: "Subk GM Analysis",
            };
          }
          return submenu;
        }),
      }));
      data.forEach((item) => {
        if (item.display_name === textContent) {
          setRoutes([item]);
          sessionStorage.setItem("displayName", item.display_name);
        }
      });
    });
  };

  useEffect(() => {
    if (graphKey1 && graphRef1.current) {
      graphRef1.current.scrollIntoView({ behavior: "instant" });
    }
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
          setBodyData(bodyDataa);
          setSearchApiData(bodyDataa);
        } else {
          setData(Headerdata.concat(bData));
          setBodyData(bData);
          setSearchApiData(bData);
        }
        // setLoader(false);
        setTitle("Total HC Details:");
        let firstColor,
          secondColor,
          thirdColor = "",
          count = 0;
        firstColor = bData[0].alloc_contract_date_icon?.split("~")[0];
        secondColor = "";
        for (let index = 0; index < bData.length; index++) {
          let colorFind = bData[index].alloc_contract_date_icon?.split("~")[0];
          if (firstColor != colorFind && count == 0) {
            secondColor = colorFind;
            count++;
          } else if (firstColor != colorFind && secondColor != colorFind) {
            thirdColor = colorFind;
            break;
          }
        }
        const colorFilter = [firstColor, secondColor, thirdColor];
        setColorFilter(colorFilter);
      })
      .catch(function (response) {});
  };

  useEffect(() => {
    // getMenus();
    getUrlPath();
  }, []);
  const getUrlPath = () => {
    axios({
      method: "get",
      url:
        baseUrl +
        `/CommonMS/security/authorize?url=${urlState}&userId=${loggedUserId}`,
    }).then((res) => {});
  };

  let firstColor = flag == 1 ? colorFilterR[0] : colorFilter[0];
  let secondColor = flag == 1 ? colorFilterR[1] : colorFilter[1];
  let thirdColor = flag == 1 ? colorFilterR[2] : colorFilter[2];

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
    let imp = ["XLS"];
    setExportData(imp);
  }, []);

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
        // const respData = resp.find((item) => item.display_name === "Resources");
        const respData = resp;
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
  const handleClick = (event, name) => {
    setName(name);
    // setAnchorEl(true);
    // setAnchorEl(e.currentTarget);
  };

  //color sorting

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
      <div
        className="align center ellipsis"
        data-toggle="tooltip"
        title={data.alloc_end_date}
      >
        {data.alloc_end_date}
      </div>
    );
  };
  const contractDtAlign = (data) => {
    return (
      <div
        className="align center ellipsis"
        data-toggle="tooltip"
        title={data.alloc_contract_date_icon}
      >
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

  const billRateAtCB = (data) => {
    return (
      <div
        className="ellipsis colWidth"
        data-toggle="tooltip"
        title={data.bill_rate_at_CB}
      >
        <div className="align right">{data.bill_rate_at_CB}</div>
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

  const costRateAtCB = (data) => {
    return (
      <div
        className="ellipsis colWidth"
        data-toggle="tooltip"
        title={data.cost_rate_at_CB}
      >
        <div className="align right">{data.cost_rate_at_CB}</div>
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

  const gmPercOnCB = (data) => {
    return (
      <div
        className="ellipsis colWidth"
        data-toggle="tooltip"
        title={data.gm_perc_on_CB}
      >
        <div className="align right">{data.gm_perc_on_CB}</div>
      </div>
    );
  };

  const laptopAlloc = (data) => {
    return (
      <div
        className="ellipsis"
        data-toggle="tooltip"
        title={data.laptop_allocated}
      >
        <div >{data.laptop_allocated}</div>
      </div>
    );
  };

  const convEligibility = (data) => {
    return (
      <div
        className="ellipsis"
        data-toggle="tooltip"
        title={data.conversion_eligibility}
      >
        <div>{data.conversion_eligibility}</div>
      </div>
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
  const contractType = (data) => {
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
  const ContractEndDate = (data) => {
    return (
      <div
        className="ellipsis"
        data-toggle="tooltip"
        title={data.contract_end_date}
      >
        {data.contract_end_date}
      </div>
    );
  };
  const expDtAlign = (data) => {
    return (
      <div className="align center" title={data.ad_contract_end_date}>
        {data.ad_contract_end_date}
      </div>
    );
  };
  const StartDate = (data) => {
    return (
      <div className=" ellipsis" data-toggle="tooltip" title={data.start_date}>
        {data.start_date}
      </div>
    );
  };
  const skillType = (data) => {
    return (
      <div className="ellipsis" data-toggle="tooltip" title={data.skill_type}>
        {data.skill_type}
      </div>
    );
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

  const nameHeader = (
    <div className="shiftAllowanceExpandIcon">
      <span>Name</span>
      <IconButton onClick={() => setExpanded(!expanded)}>
        {expanded ? <BiChevronLeft /> : <BiChevronRight />}
      </IconButton>
    </div>
  );

  const dynamicColumns = Object.keys(headerData)?.map((col, i) => {
    return ["start_date", "department", "supervisor", "skills"].includes(
      col
    ) ? (
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
            : col == "laptop_allocated"
            ? laptopAlloc
            : col == "conversion_eligibility"
            ? convEligibility
            : col == "LinkedIN_Id"
            ? linkedIn
            : col == "alloc_end_date"
            ? allocEndDate
            : col == "vendor_name"
            ? VendorName
            : col == "contract_type"
            ? contractType
            : col == "resource_name"
            ? LinkTemplate
            : col == "start_date"
            ? StartDate
            : col == "contract_end_date"
            ? ContractEndDate
            : col == "skill_type" && skillType
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
            : col == "laptop_allocated"
            ? laptopAlloc
            : col == "conversion_eligibility"
            ? convEligibility
            : col == "LinkedIN_Id"
            ? linkedIn
            : col == "alloc_end_date"
            ? allocEndDate
            : col == "vendor_name"
            ? VendorName
            : col == "contract_type"
            ? contractType
            : col == "resource_name"
            ? LinkTemplate
            : col == "start_date"
            ? StartDate
            : col == "contract_end_date"
            ? ContractEndDate
            : col == "skill_type" && skillType
        }
        field={col}
        header={col == "resource_name" ? nameHeader : headerData[col]}
      />
    );
  });
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
    <div className="Val">
      {btnState === "Resources" ? (
        <div className="pageTitle">
          <div className="childOne">
            <ParentVendorTabs
              btnState={btnState}
              setbtnState={setbtnState}
              setUrlState={setUrlState}
            />
          </div>
          <div className="childTwo">
            <h2>Resources</h2>
          </div>
          <div className="childThree"></div>
        </div>
      ) : (
        ""
      )}
      {flag == 1 ? (
        <>
          {currentURL.includes("/vmg/vmg") ? (
            ""
          ) : (
            <div>
              <p
                className="font-weight-bold Vendor-sub-heading pb-0"
                style={{ marginBottom: "10px" }}
              >
                {Table}
                {/* <div className="mb-2">{tableNew}</div> */}
              </p>
            </div>
          )}
        </>
      ) : (
        <>
          {currentURL.includes("/vmg/vmg") ? (
            ""
          ) : (
            <div>
              <p
                className="font-weight-bold Vendor-sub-heading pb-0"
                style={{ marginBottom: "10px" }}
              >
                {title}
              </p>
            </div>
          )}
        </>
      )}
      <VendorSearchTable
        maxHeight1={maxHeight1}
        fileName={fileName}
        data={data}
        rows={25}
        dynamicColumns={dynamicColumns}
        headerData={headerData}
        setHeaderData={setHeaderData}
        tableNew={tableNew}
        flags={flags}
        exportData={exportData}
        checked={checked}
        setChecked={setChecked}
        resourceTableCurrent="currentVendorResoirce"
      />
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
        />
      )}
      {allocationtable && (
        <>
          <div className="col-md-12 mt-6">
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
  );
}

export default Resources;
