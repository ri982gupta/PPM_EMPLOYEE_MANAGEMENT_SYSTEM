import React, { useEffect, useRef, useState } from "react";
import { FilterMatchMode, FilterOperator } from "primereact/api";
import { DataTable } from "primereact/datatable";
import { InputText } from "primereact/inputtext";
import ExcelJS from "exceljs";
import jsPDF from "jspdf";
import { Column } from "ag-grid-community";
import "jspdf-autotable";
import { BiChevronLeft, BiChevronRight, BiX } from "react-icons/bi";
import { IconButton } from "@mui/material";
import { Popover } from "@coreui/coreui";
import "../../App.scss";
import { useLocation } from "react-router-dom";
import moment from "moment";
import { AiOutlineLeftSquare, AiOutlineRightSquare } from "react-icons/ai";
import Popup from "./Popup";

function VendorTrendResourceTable(props) {
  const {
    data,
    tableNew,
    headerData,
    setHeaderData,
    exportData,
    customFilters,
    customFilterValue,
    setCustomFilterValue,
    fileName,
    checked,
    setChecked,
    maxHeight,
  } = props;
  const [mainData, setMainData] = useState([]);
  const [bodyData, setBodyData] = useState([]);
  const [expanded, setExpanded] = useState(false);
  const [LinkId, setLinkId] = useState();
  const [anchorEl, setAnchorEl] = useState(null);
  const [name, setName] = useState("");
  const [toggileView, setToggleView] = useState(false);
  const [allocationtable, setAllocationTable] = useState(false);

  const handleClose = () => {
    setAnchorEl(false);
  };

  useEffect(() => {}, [maxHeight]);

  if (toggileView == true) {
    document.documentElement.style.setProperty(
      "--dynamic-value",
      String(maxHeight - 138) + "px"
    );
  } else {
    document.documentElement.style.setProperty(
      "--dynamic-value",
      String(maxHeight - 104) + "px"
    );
  }
  const dt = useRef(null);
  useEffect(() => {
    setMainData(JSON.parse(JSON.stringify(data)));
  }, [data]);

  useEffect(() => {
    if (checked == true) {
      setChecked(true);
    }
  }, [checked]);

  useEffect(() => {
    if (mainData.length > 0) {
      setHeaderData(mainData[0]);
      setBodyData(mainData.splice(1));

      let dtt = [];
      let headDt = mainData[0];

      Object.keys(headDt).forEach((d) => {
        dtt.push({ title: d, dataKey: headDt[d] });
      });
    }
  }, [mainData]);

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
  const [globalFilterValue1, setGlobalFilterValue1] = useState("");

  const clearFilter1 = () => {
    initFilters1();
  };

  const initFilters1 = () => {
    setGlobalFilterValue1("");
  };

  const onGlobalFilterChange1 = (e) => {
    const value = e.target.value;
    let _filters1 = { ...filters1 };
    _filters1["global"].value = value;
    setFilters1(_filters1);
    setGlobalFilterValue1(value);
  };

  const RenderCustomFilters = () => {
    let cstFtlrs = customFilters;
    switch (cstFtlrs["type"]) {
      case "select":
        return (
          <select
            id={cstFtlrs["id"]}
            onChange={(e) => {
              setCustomFilterValue(e.target.value);
            }}
          >
            {Object.keys(cstFtlrs["data"]).map((d) => {
              return (
                <option
                  selected={customFilterValue == d ? true : false}
                  value={d}
                >
                  {cstFtlrs["data"][d]}
                </option>
              );
            })}
          </select>
        );
        break;

      default:
        break;
    }
  };
  const exportCSV = (selectionOnly) => {
    dt.current.exportCSV({ selectionOnly });
  };

  const exportExcel = () => {
    import("xlsx").then((xlsx) => {
      const headers = Object.keys(data[0]);
      const uniqueHeaders = [...new Set(headers)];
      const worksheetData = data.map((item) =>
        uniqueHeaders.map((header) => {
          return header === "nxtRvwDt"
            ? formatDate1(item[header])
            : item[header];
        })
      );
      const dataRows = worksheetData.map((item) => Object.values(item));
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet(fileName);
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
        saveAs(blob, fileName);
      });
    });
  };
  const [isOn, setOn] = useState(false);

  const handleToggle = () => {
    setOn(!isOn);
  };
  const formatDate1 = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric" };
    const dateObject = new Date(dateString);
    if (isNaN(dateObject.getTime())) {
      return dateString; // Return the original date string if invalid
    }
    const formattedDate = dateObject.toLocaleDateString(undefined, options);
    const hyphenatedDate = formattedDate.replace(/\s+/g, "-");

    return hyphenatedDate;
  };

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric" };
    const formattedDate = new Date(dateString).toLocaleDateString(
      undefined,
      options
    );
    const hyphenatedDate = formattedDate.replace(/\s+/g, "-");
    return hyphenatedDate;
  };

  const exportColumns = [
    { dataKey: "vendorId", title: "Vendor Id" },
    { dataKey: "vendor_name", title: "Vendor Name" },
    { dataKey: "contactName", title: "Contact Name" },
    { dataKey: "phone", title: "Phone" },
    { dataKey: "email", title: "Email" },
    { dataKey: "contryName", title: "Country Name" },
    { dataKey: "nxtRvwDt", title: "Next Review Date" },
    { dataKey: "signedDt", title: "Contract Signed Date" },
  ];

  const exportPdf = () => {
    print();
  };
  const nameHeader = (
    <div className="shiftAllowanceExpandIcon">
      <span>Name</span>
      <IconButton onClick={() => setExpanded(!expanded)}>
        {expanded ? <BiChevronLeft /> : <BiChevronRight />}
      </IconButton>
    </div>
  );
  const print = () => {
    const pdf = new jsPDF("l", "mm", "a3");
    const columns = exportColumns.map((d) => d.title);
    let rows = [];

    for (let i = 1; i < data.length; i++) {
      let temp = exportColumns.map((d) => {
        return d.dataKey === "nxtRvwDt"
          ? formatDate(data[i][d.dataKey])
          : data[i][d.dataKey];
      });
      rows.push(temp);
    }

    const columnWidths = [30, 30, 30, 30, 30, 30];
    pdf.text(15, 30, fileName);
    const colStyles = {
      0: { cellWidth: columnWidths[0] },
      1: { cellWidth: columnWidths[1] },
      2: { cellWidth: columnWidths[2] },
      3: { cellWidth: columnWidths[3] },
      4: { cellWidth: columnWidths[4] },
      5: { cellWidth: columnWidths[5] },
    };
    pdf.autoTable(columns, rows, {
      startY: 34,
      theme: "grid",
      styles: {
        font: "times",
        halign: "center",
        cellPadding: 1,
        lineWidth: 0.5,
        lineColor: [0, 0, 0],
        textColor: [0, 0, 0],
      },
      headStyles: {
        textColor: [0, 0, 0],
        fontStyle: "normal",
        lineWidth: 0.5,
        lineColor: [0, 0, 0],
        fillColor: [166, 204, 247],
      },
      alternateRowStyles: {
        fillColor: [212, 212, 212],
        textColor: [0, 0, 0],
        lineWidth: 0.5,
        lineColor: [0, 0, 0],
      },
      rowStyles: {
        lineWidth: 0.5,
        lineColor: [0, 0, 0],
      },
      tableLineColor: [0, 0, 0],
      columnStyles: colStyles,
    });
    pdf.save(fileName);
  };

  const toggleButtonHandler = (e) => {
    setChecked(e.target.checked);
  };

  const printTable = () => {
    openPrintWindow();
  };
  const openPrintWindow = () => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;
    const tableContent = generatePrintTableContent();
    printWindow.document.write(`
    <html>
      <head>
        <title>Print Table</title>
        <link rel="stylesheet" type="text/css" href="path-to-your-print-styles.css">
      </head>
      <body>
        <h1>PPM :: VMG Search</h1>
        ${tableContent}
      </body>
    </html>
  `);
    printWindow.document.close();
    printWindow.print();
  };
  const generatePrintTableContent = () => {
    const tableRows = data.map(
      (data) =>
        `<tr>
      <td>${data.vendorId}</td>
      <td>${data.vendor_name}</td>
      <td>${data.contactName}</td>
      <td>${data.phone}</td>
      <td>${data.email}</td>
      <td>${data.contryName}</td>
      <td>${data.nxtRvwDt}</td>
      <td>${data.signedDt}</td>
      <td>${data.expireDt}</td>
      <td>${data.website}</td>
    </tr>`
    );
    return `
    <table>
      <thead>
        <tr>
       
        </tr>
      </thead>
      <tbody>
        ${tableRows.join("")}
      </tbody>
    </table>
  `;
  };
  const location = useLocation();
  const currentURL = location.pathname.toString();
  const renderHeader1 = () => {
    return (
      <div className="d-flex justify-content-between align-items-center vendorTopSection">
        <div className="alloc">{tableNew}</div>
        <div className="bgv-btn-search-wrapper">
          <div className="bgv">
            {/* {currentURL.includes("/vendor/vendorDoc/") && (
              <label>BGV: &nbsp; {bgvStatus_header}</label>
            )} */}
          </div>

          <div className="btn-search-excel-wrapper">
            {currentURL.includes("/vmg/vmg") ? (
              <div className="container-toggle">
                <h2 style={{ color: "#2e88c5", fontSize: "14px" }}>View</h2>
                <label className="switch">
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={toggleButtonHandler}
                  />
                  <span className="slider round"></span>
                </label>
                <h2 style={{ color: "#2e88c5", fontSize: "14px" }}>Edit</h2>
              </div>
            ) : (
              <div className="mrTableContainer">
                <div className="tableViewSwitch">
                  <span className="scrollTxt">Scroll</span>
                  <div
                    className={`switch-container ${toggileView ? "on" : "off"}`}
                    // onClick={handleToggle}
                    onClick={() => {
                      setToggleView(!toggileView);
                    }}
                  >
                    <div className="switch-slider"></div>
                  </div>
                  <span className="paginationTxt">Pagination</span>
                </div>
              </div>
            )}
            {customFilters != undefined && (
              <span>
                <RenderCustomFilters />
              </span>
            )}
            <div className="flex flex-row-reverse">
              <div className="exportBtn ml-3">
                {exportData?.includes("CSV") && (
                  <span
                    className="pi pi-file csv"
                    onClick={() => exportCSV(false)}
                    title="CSV"
                  />
                )}
                {exportData?.includes("XLS") && (
                  <span
                    className="pi pi-file-excel excel"
                    onClick={exportExcel}
                    title="Export to Excel"
                  />
                )}
                {exportData?.includes("PDF") && (
                  <span
                    className="pi pi-file-pdf pdf"
                    onClick={exportPdf}
                    title="PDF"
                  />
                )}
                {exportData?.includes("PRINT") && (
                  <span
                    className="pi pi-print print"
                    onClick={printTable}
                    title="Print"
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
          </div>
        </div>
      </div>
    );
  };

  const resourceName = (data) => {
    const ellipsisStyle = {
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis",
      color: "#15a7ea",
    };
    return (
      <>
        <div
          className="legendContainer  ellipsis"
          // onClick={(e) => {
          //   handleClick(e, data.resource_name);
          //   setLinkId(data.resource_id);
          //   // getResourceTable(data.resource_id);
          //   setAnchorEl(e.currentTarget);
          //   setAllocationTable(false);
          // }}
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
      </>
    );
  };
  const empId = (data) => {
    return <div title={data.employee_number}>{data.employee_number}</div>;
  };
  const startDate = (data) => {
    return (
      <div title={moment(data.start_date).format("DD-MMM-YYYY")}>
        {moment(data.start_date).format("DD-MMM-YYYY")}
      </div>
    );
  };
  const department = (data) => {
    return (
      <div title={data.department} className="ellipsis">
        {data.department}
      </div>
    );
  };
  const Supervisor = (data) => {
    return (
      <div title={data.supervisor} className="ellipsis">
        {data.supervisor}
      </div>
    );
  };
  const Skill = (data) => {
    return (
      <div title={data.skills} className="ellipsis">
        {data.skills}
      </div>
    );
  };
  const Vendor = (data) => {
    return (
      <div title={data.vendor_name} className="ellipsis">
        {data.vendor_name}
      </div>
    );
  };
  const contractType = (data) => {
    return (
      <div title={data.contract_type} className="ellipsis">
        {data.contract_type}
      </div>
    );
  };
  const skillType = (data) => {
    return (
      <div title={data.skill_type} className="ellipsis">
        {data.skill_type}
      </div>
    );
  };
  const header1 = renderHeader1();
  return (
    <div>
      <div className="darkHeader">
        {Object.keys(headerData).length > 0 && (
          <DataTable
            paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
            currentPageReportTemplate="{first} to {last} of {totalRecords}"
            rowsPerPageOptions={[10, 25, 50, 100]} //------------->
            value={bodyData}
            paginator={toggileView}
            showGridlines
            rows={25}
            dataKey="id"
            filters={filters1}
            header={header1}
            emptyMessage="No Records found."
            ref={(el) => {
              dt.current = el;
            }}
            className="primeReactDataTable darkHeader toHead"
          >
            <Column
              field="employee_number"
              header="Emp ID"
              body={empId}
              style={{ width: "71px" }}
            ></Column>

            <Column
              field="resource_name"
              // header={nameHeader}
              header="Name"
              body={resourceName}
            />
            <Column
              field="start_date"
              header="DOJ"
              style={{
                // display: expanded ? "table-cell" : "none",
                textAlign: "end",
              }}
              body={startDate}
            ></Column>
            <Column
              field="department"
              header="Dept"
              body={department}
              // style={{ display: expanded ? "table-cell" : "none" }}
            ></Column>
            <Column
              field="supervisor"
              header="Supervisor"
              body={Supervisor}
              // style={{ display: expanded ? "table-cell" : "none" }}
            ></Column>
            <Column
              field="skills"
              header="Skill"
              body={Skill}
              // style={{ display: expanded ? "table-cell" : "none" }}
            ></Column>
            <Column field="vendor_name" header="Vendor" body={Vendor}></Column>
            <Column
              field="contract_type"
              header="Contract Type"
              body={contractType}
            ></Column>
            <Column
              field="skill_type"
              header="Skill Type"
              body={skillType}
            ></Column>
          </DataTable>
        )}
      </div>
      {anchorEl && (
        <Popup
          handleClose={handleClose}
          anchorEl={anchorEl}
          name={name}
          LinkId={LinkId}
          setAllocationTable={setAllocationTable}
          setAnchorEl={setAnchorEl}
          // setGraphKey1={setGraphKey1}
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
                  // ref={graphRef1}
                  // key={graphKey1}
                >
                  <AiOutlineLeftSquare
                    cursor="pointer"
                    size={"2em"}
                    // onClick={subtractHandler}
                  />
                  <span>{moment(dt.toDate).format("MMM-YYYY")}</span>
                  <AiOutlineRightSquare
                    cursor="pointer"
                    size={"2em"}
                    // onClick={addHandler}
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
        </>
      )}
    </div>
  );
}
export default VendorTrendResourceTable;
