import React, { useEffect, useRef, useState } from "react";
import { FilterMatchMode, FilterOperator } from "primereact/api";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";

import { InputText } from "primereact/inputtext";
import { ColumnGroup } from "primereact/columngroup";
import { Row } from "primereact/row";

import { Link } from "react-router-dom";
import { Button } from "primereact/button";
import jsPDF from "jspdf";

require("jspdf-autotable");

function ProjectSearchCellRender(props) {
  const {
    data,
    rows,
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
        d != "StatusId" &&
          // ? dtt.push({ title: "cus", dataKey: d })
          dtt.push({ title: headDt[d], dataKey: d });
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
  const saveAsExcelFile = (buffer, fileName) => {
    import("file-saver").then((module) => {
      if (module && module.default) {
        let EXCEL_TYPE =
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
        let EXCEL_EXTENSION = ".xlsx";
        const data1 = new Blob([buffer], { type: EXCEL_TYPE });

        module.default.saveAs(data1, fileName + EXCEL_EXTENSION);
      }
    });
  };

  const exportExcel = () => {
    import("xlsx").then((xlsx) => {
      const headers = Object.keys(data[0]);
      const uniqueHeaders = [...new Set(headers)]; // Remove duplicates
      const worksheetData = data.map((item) =>
        uniqueHeaders.map((header) => item[header])
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

  const exportPdf = () => {
    print();
    // import("jspdf").then((jsPDF) => {
    //   import("jspdf-autotable").then(() => {
    //     const doc = new jsPDF.default(0, 0);
    //     console.log("in line 187-------");
    //     console.log(data);
    //     console.log(exportColumns);
    //     doc.autoTable(exportColumns, data);
    //     doc.save("Data.pdf");
    //   });
    // });
  };

  const print = () => {
    const pdf = new jsPDF("p", "pt", "a4");
    const columns = exportColumns.map((d) => d.title);
    let rows = [];

    for (let i = 1; i < data.length; i++) {
      /*for (var key in json[i]) {
              var temp = [key, json[i][key]];
              rows.push(temp);
            }*/
      // let temp = [
      //   json[i].id,
      //   json[i].start.split("T")[0],
      //   json[i].duration,
      //   json[i].name,
      //   json[i].project,
      //   json[i].task,
      //   json[i].comment,
      // ];

      let temp = exportColumns.map((d) => data[i][d["dataKey"]]);

      rows.push(temp);
    }
    const columnWidths = [90, 90, 90, 100, 130]; // Set the widths of the columns here
    pdf.text(235, 40, "Tabla de Prestamo");
    pdf.autoTable(columns, rows, {
      startY: 65,
      theme: "grid",
      styles: {
        font: "times",
        halign: "center",
        cellPadding: 3.5,
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
      columnStyles: {
        0: { cellWidth: columnWidths[0] },
        1: { cellWidth: columnWidths[1] },
        2: { cellWidth: columnWidths[2] },
        3: { cellWidth: columnWidths[3] },
        4: { cellWidth: columnWidths[4] },
      },
    });
    pdf.save("pdf");
  };

  const renderHeader1 = () => {
    return (
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
  let headerGroup;
  if (data[0].team_size) {
    headerGroup = (
      <ColumnGroup>
        <Row>
          <Column header="" colSpan={12} />
          <Column header="Contractor(FTE)" colSpan={2} />
          <Column header="Employee(FTE)" colSpan={2} />
          <Column header="" colSpan={1} />
        </Row>
        <Row>
          <Column header="Code" sortable field="project_code" />
          <Column header="Project Name" sortable field="project_name" />
          <Column header="Project Manager" sortable field="lastYearProfit" />
          <Column header="Sales Executive" sortable field="sales_executive" />
          <Column header="Project Stage" sortable field="prj_stage" />
          <Column header="Primary BU" sortable field="business_unit" />
          <Column header="PO#" sortable field="po_number" />
          <Column header="Customer" sortable field="customer" />
          <Column header="Pln St Dt" sortable field="planned_start_dt" />
          <Column header="Pln End Dt" sortable field="planned_end_dt" />
          <Column header="Act St Dt" sortable field="actual_start_dt" />
          <Column header="Act End Dt" sortable field="actual_end_dt" />
          <Column header="Onsite" sortable field="contractor_onsite" />
          <Column header="Offshore" sortable field="contractor_offshore" />
          <Column header="Onsite" sortable field="employee_onsite" />
          <Column header="Offshore" sortable field="employee_offshore" />
          <Column header="Team Size" sortable field="team_size" />
        </Row>
      </ColumnGroup>
    );
  } else {
    headerGroup = (
      <ColumnGroup>
        <Row>
          <Column header="" colSpan={12} />
          <Column header="Contractor(FTE)" colSpan={2} />
          <Column header="Employee(FTE)" colSpan={2} />
          <Column header="" colSpan={1} />
        </Row>
        <Row>
          <Column header="Code" sortable field="project_code" />
          <Column header="Project Name" sortable field="project_name" />
          <Column header="Project Manager" sortable field="lastYearProfit" />
          <Column header="Sales Executive" sortable field="sales_executive" />
          <Column header="Project Stage" sortable field="prj_stage" />
          <Column header="Primary BU" sortable field="business_unit" />
          <Column header="PO#" sortable field="po_number" />
          <Column header="Customer" sortable field="customer" />
          <Column header="Pln St Dt" sortable field="planned_start_dt" />
          <Column header="Pln End Dt" sortable field="planned_end_dt" />
          <Column header="Act St Dt" sortable field="actual_start_dt" />
          <Column header="Act End Dt" sortable field="actual_end_dt" />
          <Column header="Onsite" sortable field="contractor_onsite" />
          <Column header="Offshore" sortable field="contractor_offshore" />
          <Column header="Onsite" sortable field="employee_onsite" />
          <Column header="Offshore" sortable field="employee_offshore" />
          {/* <Column header="Team Size" sortable field="team_size" /> */}
        </Row>
      </ColumnGroup>
    );
  }
  return (
    <div className="darkHeader">
      {Object.keys(headerData).length > 0 && (
        <DataTable
          stripedRows
          paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
          currentPageReportTemplate="{first} to {last} of {totalRecords}"
          rowsPerPageOptions={[10, 25, 50]}
          headerColumnGroup={headerGroup}
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
          className="primeReactDataTable projectSearchTable"
        >
          {/* <Column header={headerdatagroup} colSpan={col} /> */}

          {dynamicColumns}
        </DataTable>
      )}
    </div>
  );
}

export default ProjectSearchCellRender;
