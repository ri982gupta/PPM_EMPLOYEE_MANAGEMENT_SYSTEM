import React, { useEffect, useRef, useState } from "react";
import { FilterMatchMode, FilterOperator } from "primereact/api";
import { DataTable } from "primereact/datatable";
import { InputText } from "primereact/inputtext";
import jsPDF from "jspdf";
import "./CellRendererPrimeReactDataTable.scss";
import ExcelJS from "exceljs";
import { Column } from "ag-grid-community";

require("jspdf-autotable");

function CellRendererPrimeReactDataTable(props) {
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
    columnStyle,
    fileName,
    reportsHeader,
    reportId,
    setLoader,
    permission,
    emptyData,
    maxHeight,
    custEngDyMaxHeight,
    custQBRDyMaxHeight,
    CustomersFileName,
    custRiskDyMaxHeight,
    projectRsikMaxHeight,
    competencyMaxDynaHeigjht,
    rollOffDynaMaxHgt,
    AuditCpSetupMaxHeight,
    AdministrationEngDyMaxHt,
    AdministrationGMADyMaxHt,
    administrationContractorCostDyMxHt,
    reportsMaxHeight,
    TeamsInsightsMaxHgt,
    timeAndExpensesResourceViewListMaxHgt,
    TeamsInsightsTrainingMaxHgt,
    TeamsInsightsSkillDetMaxHgt,
    TeamsInsightsReporteeDetMaxHgt,
    DeliveryProjMonitoringProjRevLog,
    HelpReleaseNotesDynamicMaxHgt
  } = props;

  const [mainData, setMainData] = useState([]);
  const [bodyData, setBodyData] = useState([]);
  const [exportColumns, setExportColumns] = useState([]);
  const dt = useRef(null);
  useEffect(() => {
    setMainData(JSON.parse(JSON.stringify(data)));
  }, [data]);

  if (CustomersFileName == "CustomersEngagement") {
    document.documentElement.style.setProperty(
      "--dynamic-value",
      `${custEngDyMaxHeight - 77}px`
    );

  }else if(CustomersFileName == "ProjectRisk"){
    document.documentElement.style.setProperty(
      "--dynamic-value",
      `${projectRsikMaxHeight - 164}px`
    );
  }
  else if(CustomersFileName == "CompetencyDashboard"){
    document.documentElement.style.setProperty(
      "--dynamic-value",
      `${competencyMaxDynaHeigjht - 116}px`
    );
  }
  else if(CustomersFileName == "timeAndExpensesResourceViewList"){
    document.documentElement.style.setProperty(
      "--dynamic-value",
      `${timeAndExpensesResourceViewListMaxHgt - 91}px`
    );
  }
  else if(CustomersFileName == "Teams insights Resource Allocation"){
    document.documentElement.style.setProperty(
      "--dynamic-value",
      `${TeamsInsightsMaxHgt - 118}px`
    );
  } 
  else if(CustomersFileName == "Teams insights Training Details"){
    document.documentElement.style.setProperty(
      "--dynamic-value",
      `${TeamsInsightsTrainingMaxHgt - 118}px`
    );
  } 
  else if(CustomersFileName == "Teams insights Skill Details"){
    document.documentElement.style.setProperty(
      "--dynamic-value",
      `${TeamsInsightsSkillDetMaxHgt - 78}px`
    );
  }
  else if(CustomersFileName == "Teams insights Reportee Details"){
    document.documentElement.style.setProperty(
      "--dynamic-value",
      `${TeamsInsightsReporteeDetMaxHgt - 78}px`
    );
  } 
  else if(CustomersFileName == "Delivery Projects Monitoring ProjectReviewLog"){
    document.documentElement.style.setProperty(
      "--dynamic-value",
      `${DeliveryProjMonitoringProjRevLog - 79}px`
    );
  } 
  else if(CustomersFileName == "QBR"){
    document.documentElement.style.setProperty(
      "--dynamic-value",
      `${custQBRDyMaxHeight - 113}px`
    );
  } 
  else if(CustomersFileName == "RollOffs"){
    document.documentElement.style.setProperty(
      "--dynamic-value",
      `${rollOffDynaMaxHgt - 116}px`
    );
  }
  else if(CustomersFileName == "AuditCpSetup"){
    document.documentElement.style.setProperty(
      "--dynamic-value",
      `${AuditCpSetupMaxHeight - 106}px`
    );
  }
  else if(CustomersFileName == "AdministrationEnagagementDetails"){
    document.documentElement.style.setProperty(
      "--dynamic-value",
      `${AdministrationEngDyMaxHt - 124}px`
    );
  }
  else if(CustomersFileName == "AdministrationGMAReport"){
    document.documentElement.style.setProperty(
      "--dynamic-value",
      `${AdministrationGMADyMaxHt - 99}px`
    );
  }
  else if(CustomersFileName == "Allocated and Billed hours Report"){
    document.documentElement.style.setProperty(
      "--dynamic-value",
      `${reportsMaxHeight - 71}px`
    );
  }
  else if(CustomersFileName == "Reportee Report"){
    document.documentElement.style.setProperty(
      "--dynamic-value",
      `${reportsMaxHeight - 71}px`
    );
  }
  else if(CustomersFileName == "Resource Entry Report"){
    document.documentElement.style.setProperty(
      "--dynamic-value",
      `${reportsMaxHeight - 71}px`
    );
  }
  else if(CustomersFileName == "Unapproved Time"){
    document.documentElement.style.setProperty(
      "--dynamic-value",
      `${reportsMaxHeight - 71}px`
    );
  }
  else if(CustomersFileName == "Finance Billing Timesheet Report"){
    document.documentElement.style.setProperty(
      "--dynamic-value",
      `${reportsMaxHeight - 71}px`
    );
  }
  else if(CustomersFileName == "Revenue Report"){
    document.documentElement.style.setProperty(
      "--dynamic-value",
      `${reportsMaxHeight - 71}px`
    );
  }
  else if(CustomersFileName == "Billing Report"){
    document.documentElement.style.setProperty(
      "--dynamic-value",
      `${reportsMaxHeight - 71}px`
    );
  }
  else if(CustomersFileName == "Project Resource Report"){
    document.documentElement.style.setProperty(
      "--dynamic-value",
      `${reportsMaxHeight - 71}px`
    );
  }
  else if(CustomersFileName == "Resource List"){
    document.documentElement.style.setProperty(
      "--dynamic-value",
      `${reportsMaxHeight - 71}px`
    );
  }
  else if(CustomersFileName == "Finance Report"){
    document.documentElement.style.setProperty(
      "--dynamic-value",
      `${reportsMaxHeight - 71}px`
    );
  }
  else if(CustomersFileName == "Project List for CSAT"){
    document.documentElement.style.setProperty(
      "--dynamic-value",
      `${reportsMaxHeight - 71}px`
    );
  }
  else if(CustomersFileName == "BU Allocation Report"){
    document.documentElement.style.setProperty(
      "--dynamic-value",
      `${reportsMaxHeight - 71}px`
    );
  }
  else if(CustomersFileName == "Resource Allocation Report"){
    document.documentElement.style.setProperty(
      "--dynamic-value",
      `${reportsMaxHeight - 71}px`
    );
  }
  else if(CustomersFileName == "Expense Report"){
    document.documentElement.style.setProperty(
      "--dynamic-value",
      `${reportsMaxHeight - 71}px`
    );
  }
  else if(CustomersFileName == "Resource Utilization Report"){
    document.documentElement.style.setProperty(
      "--dynamic-value",
      `${reportsMaxHeight - 129}px`
    );
  }
  else if(CustomersFileName == "administrationContractorCost"){
    document.documentElement.style.setProperty(
      "--dynamic-value",
      `${administrationContractorCostDyMxHt - 99}px`
    );
  }
  else if(CustomersFileName == "Help RelaseNotes"){
    document.documentElement.style.setProperty(
      "--dynamic-value",
      `${HelpReleaseNotesDynamicMaxHgt - 61}px`
    );
  }
   else if (CustomersFileName == "customerRisks") {

    document.documentElement.style.setProperty(
      "--dynamic-value",
      `${custRiskDyMaxHeight - 89}px`
    );
  }
  else {
    document.documentElement.style.setProperty(
      "--dynamic-value",
      `${maxHeight - 86}px`
    );
  }

  console.log("cell Render Prime");
  useEffect(() => {
    if (mainData.length > 0) {
      setHeaderData(mainData[0]);
      setBodyData(mainData.splice(1));
      reportId != undefined ? setLoader(false) : "";

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
          if (header === "revenue" && typeof value === "string" && reportId == undefined) {
            const floatValue = parseFloat(value);
            return isNaN(floatValue) ? value : floatValue.toLocaleString();
          }
          let isOnlyDigits = /^-?[0-9]*\.?[0-9]*$/.test(value);
          if (isOnlyDigits == true && reportId != undefined && header != "Emp ID" && header != "Emp Id" && header != "S.No") {
            const floatValue = (value != "" && value != "-") ? parseFloat(value) : value;
            return floatValue.toLocaleString("en-US");
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
      // let temp = exportColumns.map((d) => data[i][d["dataKey"]]);
      let temp = exportColumns.map((d) => {
        const value = data[i][d["dataKey"]];
        let isOnlyDigits = /^-?[0-9]*\.?[0-9]*$/.test(value);
        const floatValue = (isOnlyDigits == true && reportId != undefined && value != "" && value != "-") ? parseFloat(value) : value;
        return (isOnlyDigits == true && reportId != undefined && d["dataKey"] != "Emp ID" && d["dataKey"] != "Emp Id" && d["dataKey"] != "S.No") ? floatValue.toLocaleString('en-US') : value;
      });

      rows.push(temp);
    }
    const columnWidths = [30, 30, 30, 30, 30, 30,];
    const columnWidthsReports = [35, 35, 35, 35, 35, 35, 35, 35];
    pdf.text(15, 30, fileName);
    const colStyles = {
      0: { cellWidth: columnWidths[0] },
      1: { cellWidth: columnWidths[1] },
      2: { cellWidth: columnWidths[2] },
      3: { cellWidth: columnWidths[3] },
      4: { cellWidth: columnWidths[4] },
      5: { cellWidth: columnWidths[5] },
    };
    const colStylesReport = {
      0: { cellWidth: columnWidthsReports[0] },
      1: { cellWidth: columnWidthsReports[1] },
      2: { cellWidth: columnWidthsReports[2] },
      3: { cellWidth: columnWidthsReports[3] },
      4: { cellWidth: columnWidthsReports[4] },
      5: { cellWidth: columnWidthsReports[5] },
      6: { cellWidth: columnWidthsReports[6] },
      7: { cellWidth: columnWidthsReports[7] },
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
      columnStyles: reportId == undefined ? colStyles : colStylesReport,
    });
    pdf.save(fileName);
  };

  const renderHeader1 = () => {
    return (
      <div>
        {reportsHeader}
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
                title="Export to PDF"
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
  console.log(bodyData, 'bodyDataaa');
  return (
    <div className="darkHeader vendor-document-table">
      {(Object.keys(headerData).length > 0 && reportId == undefined) || (reportId != undefined && (bodyData.length > 0 || emptyData)) ? (
        <DataTable
          paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
          currentPageReportTemplate="{first} to {last} of {totalRecords}"
          rowsPerPageOptions={[10, 25, 50]}
          value={bodyData}
          paginator
          showGridlines
          rows={rows}
          columnStyle={columnStyle}
          dataKey="id"
          filters={filters1}
          responsiveLayout="scroll"
          header={header1}
          emptyMessage="No Records found."
          ref={(el) => {
            dt.current = el;
          }}
          className="primeReactDataTable reportsPrimeTable "  ////customerEngament
        >
          {dynamicColumns}
        </DataTable>
      ) : ""}
    </div>
  );
}

export default CellRendererPrimeReactDataTable;
