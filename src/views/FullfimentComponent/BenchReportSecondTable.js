import React, { useEffect, useRef, useState } from "react";
import { FilterMatchMode, FilterOperator } from "primereact/api";
import { DataTable } from "primereact/datatable";
import { InputText } from "primereact/inputtext";
import ExcelJS from "exceljs";

function BenchReportSecondtTable(props) {
  const {
    data,
    rows,
    excelData,
    col,
    headerdatagroup,
    linkColumns,
    linkColumnsRoutes,
    dynamicColumns,
    headerData,
    setHeaderData,
    exportData,
    customFilters,
    customFilterValue,
    setCustomFilterValue,
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

      Object.keys(headDt).forEach((d) => {
        dtt.push({ title: d, dataKey: headDt[d] });
      });

      setExportColumns(dtt);
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

  // const clearFilter1 = () => {
  //   initFilters1();
  // };

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

  // const exportExcel = () => {
  //   import("xlsx").then((xlsx) => {
  //     const headers = Object.keys(data[0]);
  //     const uniqueHeaders = [...new Set(headers)];
  //     const headerOrder = [
  //       "empId",
  //       "resource",
  //       "designation",
  //       "department",
  //       "LoB",
  //       "cadre_code",
  //       "skillGrps",
  //       "Skill",
  //       "emp_citizenship",
  //       "projected",
  //       "status",
  //       "resAllocType",
  //       "actionDt",
  //       "actionEffDt",
  //       "actionItem",
  //       "supervisor",
  //       "aging",
  //       "customer",
  //       "nectCap",
  //       "billHrs",
  //       "availHrs",
  //       "nbHrs",
  //     ];
  //     const customHeadersMap = {
  //       empId: "Emp Id",
  //       LoB: "LoB Category",
  //       cadre_code: "Cadre",
  //       skillGrps: "SkillGroup",
  //       Skill: "Skills",
  //       emp_citizenship: "Citizenship",
  //       projected: "Availability %",
  //       actionDt: "Action Item Date",
  //       actionEffDt: "Action Item Effort Date",
  //       customer: "Customer",
  //       nectCap: "Net Capacity Hrs",
  //       billHrs: "Billable Hrs",
  //       availHrs: "Available Hrs",
  //       nbHrs: "Non Billable Hrs",
  //     };
  //     const worksheetData = data.map((item) =>
  //       headerOrder.map((header) => {
  //         const value = item[header];
  //         const headerLabel = customHeadersMap[header] || header;
  //         if (header === "revenue" && typeof value === "string") {
  //           const floatValue = parseFloat(value);
  //           return isNaN(floatValue) ? value : floatValue.toLocaleString();
  //         }
  //         if (header === "scheduledDate" && moment(value).isValid()) {
  //           return moment(value).format("DD-MMM-YYYY");
  //         } else {
  //           return value;
  //         }
  //       })
  //     );
  //     const dataRows = worksheetData.map((item) => Object.values(item));
  //     const workbook = new ExcelJS.Workbook();
  //     const worksheet = workbook.addWorksheet(fileName);
  //     // Set custom headers in the worksheet
  //     headerOrder.forEach((header, index) => {
  //       const headerLabel = customHeadersMap[header] || header;
  //       worksheet.getCell(1, index + 1).value = headerLabel;
  //     });
  //     for (let i = 0; i < dataRows.length; i++) {
  //       const row = worksheet.addRow(dataRows[i]);
  //     }

  //     const boldRow = [1];
  //     boldRow.forEach((index) => {
  //       const row = worksheet.getRow(index);
  //       row.font = { bold: true };
  //     });
  //     workbook.xlsx.writeBuffer().then((buffer) => {
  //       const blob = new Blob([buffer], {
  //         type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  //       });
  //       saveAs(blob, fileName);
  //     });
  //   });
  // };
  const exportExcel = () => {
    import("xlsx").then((xlsx) => {
      const headers = Object.keys(excelData[0]);
      const uniqueHeaders = [...new Set(headers)];
      const headerOrder = [
        "empId",
        "resource",
        "designation",
        "department",
        "LoB",
        "cadre_code",
        "skillGrps",
        "Skill",
        "emp_citizenship",
        "projected",
        "status", // Ensure "status" is in the headerOrder array
        "resAllocType",
        "actionDt",
        "actionEffDt",
        "actionItem",
        "supervisor",
        "aging",
        "customer",
        "nectCap",
        "billHrs",
        "availHrs",
        "nbHrs",
      ];

      const customHeadersMap = {
        empId: "Emp Id",
        LoB: "LoB Category",
        cadre_code: "Cadre",
        skillGrps: "SkillGroup",
        Skill: "Skills",
        emp_citizenship: "Citizenship",
        projected: "Availability %",
        status: "Status",
        resAllocType: "Resource Allocation type",
        actionDt: "Action Item Date",
        actionEffDt: "Action Item Effort Date",
        customer: "Customer",
        nectCap: "Net Capacity Hrs",
        billHrs: "Billable Hrs",
        availHrs: "Available Hrs",
        nbHrs: "Non Billable Hrs",
      };
      const worksheetData = excelData.map((item) =>
        headerOrder.map((header) => {
          const value = item[header];
          const headerLabel = customHeadersMap[header] || header;

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

      // Skip the initial header row
      for (let i = 0; i < dataRows.length; i++) {
        const row = worksheet.addRow(dataRows[i]);
      }

      const boldRow = [1]; // Bold the new header row (2)
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

  const exportPdf = () => {
    import("jspdf").then((jsPDF) => {
      import("jspdf-autotable").then(() => {
        const doc = new jsPDF.default(0, 0);
        doc.autoTable(exportColumns, data);
        doc.save(fileName + ".pdf");
      });
    });
  };
  // ... Your existing code

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
    // Use the 'products' state or any other data you want to print
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

  // ... Your existing code

  const header = (
    <div className="flex align-items-center justify-content-end gap-2">
      {/* ... Your existing export options ... */}
      {exportData?.includes("PRINT") && (
        <span
          className="pi pi-print print"
          onClick={printTable}
          title="Print"
        />
      )}
    </div>
  );

  // ... Your existing code

  const renderHeader1 = () => {
    return (
      <div className="flex  flex-row-reverse">
        {customFilters != undefined && (
          <span>
            <RenderCustomFilters />
          </span>
        )}

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
  const header1 = renderHeader1();
  return (
    <div>
      <div className="card darkHeader">
        {Object.keys(headerData).length > 0 && (
          <DataTable
            paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
            currentPageReportTemplate="{first} to {last} of {totalRecords}"
            rowsPerPageOptions={[10, 25, 50]} //------------->
            value={bodyData}
            paginator
            showGridlines
            rows={rows}
            dataKey="id"
            filters={filters1}
            responsiveLayout="scroll"
            header={header1}
            emptyMessage={<center>No Records found.</center>}
            ref={(el) => {
              dt.current = el;
            }}
            className="primeReactDataTable " //// customerEngament
          >
            {/* <Column header={headerdatagroup} colSpan={col} /> */}

            {dynamicColumns}
          </DataTable>
        )}
      </div>
    </div>
  );
}

export default BenchReportSecondtTable;
