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
import { BiX } from "react-icons/bi";
import SearchDefaultTable from "./SearchDefaultTable";
import VendorSearchTable from "./VendorSearchTable";

function Resources(props) {
  const [popup, setPopup] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [name, setName] = useState("");
  const [searchapidata, setSearchApiData] = useState([]);
  const [data, setData] = useState([]);
  const { resourceData, colorFilter, rFormData } = props;
  const [exportData, setExportData] = useState([]);
  const [headerData, setHeaderData] = useState([]);
  const [bodyData, setBodyData] = useState([]);
  const [colorsState, setColorsState] = useState([]);
  const [resourceTable, setResourceTable] = useState([]);
  const [LinkId, setLinkId] = useState();
  const [allocationtable, setAllocationTable] = useState(false);
  const graphRef1 = useRef(null);
  const [graphKey1, setGraphKey1] = useState(0);

  console.log(resourceData);
  console.log(colorsState);
  let hData = [];
  let bData = [];
  for (let index = 0; index < resourceData.length; index++) {
    if (index == 0) {
      hData.push(resourceData[index]);
    } else {
      bData.push(resourceData[index]);
    }
  }

  // console.log(colorFilter, 'colors22>>');
  let firstColor = colorFilter[0];
  let secondColor = colorFilter[1];
  let thirdColor = colorFilter[2];
  //console.log(firstColor, secondColor, thirdColor, '1st 2nd third color')

  useEffect(() => {
    if (graphKey1 && graphRef1.current) {
      graphRef1.current.scrollIntoView({ behavior: "instant" });
    }
  }, [graphKey1]);
  //var d = new Date();
  //console.log(colorsState);
  // const abortController = useRef(null);

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
    resourceData[0] &&
      setHeaderData(JSON.parse(JSON.stringify(resourceData[0])));
    let imp = ["XLS"];
    setExportData(imp);
    setSearchApiData(bData);
  }, [resourceData]);

  const handleClick = (event, name) => {
    setName(name);
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

  //console.log(table1, 'table1');
  let table2 = (
    <div className="legend green">
      <div className="legendCircle"></div>
      <div className="legendTxt">No Contract End Dt </div>
    </div>
  );

  const table3 = (
    <div className="legend amber">
      <div className="legendCircle"></div>
      <div className="legendTxt"> Alloc End Date &lt; Contract End Dt </div>
    </div>
  );

  // console.log(firstColor, 'red');
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

  //console.log(tableNew, 'tablesahid>>');

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
      >
        {data.employee_number}
      </div>
    );
  };

  const billAllocs = (data) => {
    return (
      <div className=" ellipsis" data-toggle="tooltip" title={data.bill_allocs}>
        <div className="align right">{data.bill_allocs}</div>
      </div>
    );
  };

  const billRate = (data) => {
    return (
      <div className=" ellipsis" data-toggle="tooltip" title={data.bill_rate}>
        <div className="align right">{data.bill_rate}</div>
      </div>
    );
  };
  const payRate = (data) => {
    return (
      <div className=" ellipsis" data-toggle="tooltip" title={data.pay_rate}>
        <div className="align right">{data.pay_rate}</div>
      </div>
    );
  };
  const gmPerc = (data) => {
    return (
      <div className=" ellipsis" data-toggle="tooltip" title={data.gm_perc}>
        <div className="align right">{data.gm_perc}</div>
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
        {/* {data.vendor_name} */}
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
  const expDtAlign = (data) => {
    return <div className="align center">{data.ad_contract_end_date}</div>;
  };
  const LinkTemplate = (data) => {
    // console.log("in line 91------------");
    // console.log(data);
    return (
      <div
        className="legendContainer  ellipsis"
        onClick={(e) => {
          // console.log(data);
          handleClick(e, data.resource_name);
          setLinkId(data.resource_id);
          setTimeout(() => {
            window.scroll({
              top: 700,
              left: 0,
              behavior: "smooth",
            });
          }, 3000);
          // getResourceTable(data.resource_id);
          setAnchorEl(e.currentTarget);
          setAllocationTable(false);
        }}
      >
        {" "}
        {data.alloc_contract_date_icon ==
        "#da4832~^Alloc End Date > Contract End Dt" ? (
          <div className="legend red">
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
              style={{ color: "#15a7ea", cursor: "pointer" }}
            >
              {data.resource_name}
            </div>
          </div>
        ) : data.alloc_contract_date_icon ==
            "#3dbb49~^Alloc End Date = Contract End Dt" ||
          data.alloc_contract_date_icon == "#3dbb49~^No Contract End Dt" ? (
          <div
            className="legend green"
            to={Popover}
            title={data.resource_name}
            style={{ color: "#15a7ea", cursor: "pointer" }}
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
              style={{ color: "#15a7ea", cursor: "pointer" }}
            >
              {data.resource_name}
            </div>
          </div>
        ) : data.alloc_contract_date_icon ==
          "#FF0~^Alloc End Date < Contract End Dt" ? (
          <div
            className="legend amber"
            to={Popover}
            style={{ color: "#15a7ea", cursor: "pointer" }}
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
              style={{ color: "#15a7ea", cursor: "pointer" }}
            >
              {data.resource_name}
            </div>
          </div>
        ) : (
          ""
        )}{" "}
      </div>
    );
  };

  const dynamicColumns = Object.keys(headerData)?.map((col, i) => {
    return (
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
            : col == "pay_rate"
            ? payRate
            : col == "gm_perc"
            ? gmPerc
            : col == "alloc_end_date"
            ? allocEndDate
            : col == "vendor_name"
            ? VendorName
            : col == "contract_type"
            ? contractType
            : col == "resource_name" && LinkTemplate
        }
        field={col}
        header={headerData[col]}
      />
    );
  });
  //===========Resource Allocation API=======

  const [resourcedate, setResourceDate] = useState(rFormData.month);
  console.log(rFormData.month, "rFormData >>>>>>>>>>>>>>>");
  // Calculate the first day of the current month based on resourcedate
  // const firstDayOfMonth = new Date(
  //   resourcedate.getFullYear(),
  //   resourcedate.getMonth(),
  //   1
  // );

  const loggedUserId = localStorage.getItem("resId");
  // console.log(firstDayOfMonth);

  useEffect(() => {
    getResourceTable();
  }, [LinkId]);
  // let formattedMonth = resourcedate;
  let formattedMonth = moment(resourcedate).format("yyyy-MM-DD");
  //console.log(formattedMonth, "formattedMonth");

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
      setResourceTable([]);
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
  return (
    <div>
      <p className="font-weight-bold Vendor-sub-heading pb-0">
        Resource Details
      </p>
      <div className="mb-2">{tableNew}</div>
      <VendorSearchTable
        data={resourceData}
        rows={10}
        dynamicColumns={dynamicColumns}
        headerData={headerData}
        setHeaderData={setHeaderData}
        exportData={exportData}
        fileName="ResourceVendorPerformance"
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
          <div className="resourceAllocationTable">
            <ForecastProjectPopUp
              linkId={LinkId}
              data={resourceTable}
              expandedCols={[]}
              colExpandState={[]}
              // month={month}
              // setMonth={setMonth}
              // resourcedata={resourcedata}
            />
          </div>
        </>
      )}
    </div>
  );
}

export default Resources;
