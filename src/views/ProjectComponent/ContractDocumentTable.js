import React, { useEffect, useRef, useState } from "react";
import { FilterMatchMode, FilterOperator } from "primereact/api";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import "primeicons/primeicons.css";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.css";
import "primeflex/primeflex.css";
import { InputText } from "primereact/inputtext";
// import "./PrimeReactTable.scss";
import { Link } from "react-router-dom";
import { Button } from "primereact/button";
import jsPDF from "jspdf";
import "../ProjectComponent/ContractDocument.scss";

require("jspdf-autotable");

function ContractDocumentTable(props) {
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

        module.default.saveAs(
          data1,
          fileName + "_export_" + new Date().getTime() + EXCEL_EXTENSION
        );
      }
    });
  };
  const exportExcel = () => {
    import("xlsx").then((xlsx) => {
      // let removingUnwantedData = JSON.parse(JSON.stringify(data)).slice(1);

      // console.log(removingUnwantedData);

      let wantedCols = Object.keys(data[0]);

      let wantedValues = [];

      let dd = JSON.parse(JSON.stringify(data)).slice(1);

      for (let i = 0; i < dd.length; i++) {
        const obj = {};

        Object.keys(data[i]).forEach((d) => {
          if (wantedCols.includes(d)) {
            obj[data[0][d]] = data[i][d];
          }
        });
        wantedValues.push(obj);
      }

      const worksheet = xlsx.utils.json_to_sheet(wantedValues.slice(1));
      const workbook = { Sheets: { data: worksheet }, SheetNames: ["data"] };
      const excelBuffer = xlsx.write(workbook, {
        bookType: "xlsx",
        type: "array",
      });

      saveAsExcelFile(excelBuffer, "data");
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
      let temp = exportColumns.map((d) => data[i][d["dataKey"]]);

      rows.push(temp);
    }

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
    });
    console.log(pdf.output("datauristring"));
    pdf.save("pdf");
  };

  // const renderHeader1 = () => {
  //   return (
  //     <div className="flex  flex-row-reverse">
  //       {customFilters != undefined && (
  //         <span>
  //           <RenderCustomFilters />
  //         </span>
  //       )}

  //       {/* <span className="p-input-icon-left tableGsearch">
  //         <i className="pi pi-search" />
  //         <InputText
  //           defaultValue={globalFilterValue1}
  //           onChange={onGlobalFilterChange1}
  //           placeholder="Keyword Search"
  //         />
  //       </span> */}
  //     </div>
  //   );
  // };

  // const header1 = renderHeader1();

  return (
    <div>
      {Object.keys(headerData).length > 0 && (
        <DataTable
          //   paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
          //   currentPageReportTemplate="{first} to {last} of {totalRecords}"
          //   rowsPerPageOptions={[10, 25, 50]}
          value={bodyData}
          //   paginator
          showGridlines
          rows={rows}
          dataKey="id"
          //   filters={filters1}
          responsiveLayout="scroll"
          // header={header}
          emptyMessage="No Older Versions"
          ref={(el) => {
            dt.current = el;
          }}
          className="customerEngament primeReactDataTable"
        >
          {/* <Column header={headerdatagroup} colSpan={col} /> */}

          {dynamicColumns}
        </DataTable>
      )}
    </div>
  );
}

export default ContractDocumentTable;
