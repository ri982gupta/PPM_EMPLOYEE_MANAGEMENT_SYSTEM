import React, { useEffect, useRef, useState } from "react";
import { FilterMatchMode, FilterOperator } from "primereact/api";
import { DataTable } from "primereact/datatable";
import { InputText } from "primereact/inputtext";
import jsPDF from "jspdf";
// import "./CellRendererPrimeReactDataTable.scss";
import ExcelJS from "exceljs";
import { FaCircle } from "react-icons/fa";
import './CustomerSearchTable.scss';


require("jspdf-autotable");

function CustomerSearchTable(props) {
  const {
    data,
    rows,
    dynamicColumns,
    headerData,
    setHeaderData,
    exportData,
    customFilters,
    customFilterValue,
    setCustomFilterValue,
    custSrchDyMaxHeight,
    fileName,
  } = props;
  const [mainData, setMainData] = useState([]);
  const [bodyData, setBodyData] = useState([]);
  const [exportColumns, setExportColumns] = useState([]);
  const dt = useRef(null);
  useEffect(() => {
    setMainData(JSON.parse(JSON.stringify(data)));
  }, [data]);

  useEffect(() => {
    if (mainData.length > 0) {
      setHeaderData(mainData[0]);
      setBodyData(mainData.splice(1));

      let dtt = [];
      let headDt = mainData[0];

      Object?.keys(headDt).forEach((d) => {
        d != "StatusId" && dtt.push({ title: headDt[d], dataKey: d });
      });

      setExportColumns(dtt);
    }
  }, [mainData]);

  const filtersData = {
    contains: { value: null, matchMode: FilterMatchMode.CONTAINS },
  };
  document.documentElement.style.setProperty(
    "--dynamic-value",
    `${custSrchDyMaxHeight - 98}px`
  );
  const [filters1, setFilters1] = useState({
    global: filtersData["contains"],
  });

  useEffect(() => {
    setFilters1({
      global: filtersData["contains"],
    });
  }, [headerData]);
  const [globalFilterValue1, setGlobalFilterValue1] = useState("");

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
          const value = item[header];
          if (header === "revenue" && typeof value === "string") {
            const floatValue = parseFloat(value);
            return isNaN(floatValue) ? value : floatValue.toLocaleString();
          }
          if (header === "scheduledDate" && moment(value).isValid()) {
            return moment(value).format("DD-MMM-YYYY");
          } else {
            return value;
          }
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
      // workbook.xlsx.writeBuffer().then((buffer) => {
      //   saveAs(new Blob([buffer]), fileName.xlsx);
      // });
    });
  };

  const exportPdf = () => {
    print();
  };

  const print = () => {
    const pdf = new jsPDF("l", "mm", "a3");
    const columns = exportColumns.map((d) => d.title);
    let rows = [];

    for (let i = 1; i < data.length; i++) {
      let temp = exportColumns.map((d) => data[i][d["dataKey"]]);

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
        <h1>PPM :: Customer Search</h1>
        ${tableContent}
      </body>
    </html>
  `);
    printWindow.document.close();
    printWindow.print();
  };
  const generatePrintTableContent = () => {
    console.log(data);
    const tableRows = data.map(
      (data) => `
      <tr>
        <td>${data["Customer Name"]}</td>
        <td>${data["Eng Company"]}</td>
        <td>${data["Customer Status"]}</td>
        <td>${data["Industry Type"]}</td>
        <td>${data["Sales Territory"]}</td>
        <td>${data["Website"]}</td>
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
  const renderHeader1 = () => {
    return (
      <div className="flex  flex-row customer-legend-container-export-btn-wrapper">
        <div className="customer-search-legend-containers">
          <div className="customer-search-grey-legend">
            <FaCircle
              
            />
            &nbsp;
            <span style={{ fontSize: "13px" }}>QBR Not Required</span>
          </div>
          <div className="customer-search-green-legend" >
            <FaCircle
              style={{ color: "green", fontSize: "13px", marginTop: "-2px" }}
            />
            &nbsp;
            <span style={{ fontSize: "13px" }}>QBR Completed</span>
          </div>
          <div className="customer-search-red-legend">
            <FaCircle
              style={{ color: "red", fontSize: "13px", marginTop: "-2px" }}
            />
            &nbsp;
            <span style={{ fontSize: "13px" }}>QBR Not Completed</span>
          </div>
        </div>

        <div className="flex  flex-row-reverse">
          {customFilters != undefined && (
            <span>
              <RenderCustomFilters />
            </span>
          )}

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
              id="searchInput"
              defaultValue={globalFilterValue1}
              onChange={onGlobalFilterChange1}
              placeholder="Keyword Search"
            />
          </span>
        </div>
      </div>
    );
  };

  const header1 = renderHeader1();

  return (
    <div className="darkHeader Customer-Search-Table">
      {Object.keys(headerData).length > 0 && (
        <DataTable
          paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
          currentPageReportTemplate="{first} to {last} of {totalRecords}"
          rowsPerPageOptions={[10, 25, 50]}
          value={bodyData}
          paginator
          showGridlines
          rows={rows}
          dataKey="id"
          filters={filters1}
          responsiveLayout="scroll"
          header={header1}
          emptyMessage="No Records found."
          ref={(el) => {
            dt.current = el;
          }}
          className="primeReactDataTable reportsPrimeTable " /////customerEngament
        >
          {dynamicColumns}
        </DataTable>
      )}
    </div>
  );
}

export default CustomerSearchTable;
