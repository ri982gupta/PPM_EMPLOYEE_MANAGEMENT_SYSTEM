import React, { useEffect, useState } from "react";
import { FilterMatchMode } from "primereact/api";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import "primeicons/primeicons.css";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.css";
import "primeflex/primeflex.css";
import { InputText } from "primereact/inputtext";
import "./QMSTable.scss"

require("jspdf-autotable");

function QMSTable(props) {
  const {
    data,
    rows,
    value,
    dataAccess,
    dynamicColumns,
    headerData,
    setHeaderData,
    setSelectedIds,
    setCheckedData,
    maxHeight1
  } = props;
  console.log(data);
  const [mainData, setMainData] = useState([]);
  const [bodyData, setBodyData] = useState([]);
  const [exportColumns, setExportColumns] = useState([]);
  const [checkboxSelect, setCheckboxSelect] = useState();

  document.documentElement.style.setProperty(
    "--dynamic-value",
    String(maxHeight1 - 139) + "px"
  );

  useEffect(() => {
    if (checkboxSelect && checkboxSelect.length > 0) {
      const selectedIds = checkboxSelect.map((item) => item.id);
    }
  }, [checkboxSelect]);

  const handleChange = (e) => {
    const selectedRows = e.value;
    if (selectedRows.length > 0) {
      setCheckboxSelect(selectedRows);
    }
    let data = e.value;
    let fData = data.map((d) => d.id);
    {
      value == "trackerscreensadder"
        ? setCheckedData(data)
        : setCheckedData(fData[0]);
    }

    let b = String(data.map((f) => f.id));
    console.log(b);
    let c = b.replace(/,/g, ";");
    console.log(c);
    setCheckedData(c);
    setCheckboxSelect(e.value);
  };

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
  console.log(dataAccess);
  useEffect(() => {
    setFilters1({
      global: filtersData["contains"],
    });
  }, [headerData]);
  const [globalFilterValue1, setGlobalFilterValue1] = useState("");

  const onGlobalFilterChange1 = (e) => {
    const value = e.target.value;
    let _filters1 = { ...filters1 };
    _filters1["global"].value = value;
    setFilters1(_filters1);
    setGlobalFilterValue1(value);
  };

  const renderHeader1 = () => {
    return (
      <div className="flex  flex-row-reverse">
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
  const emptyMessage = "No Records found.";
  const isCheckboxDisabled =
    emptyMessage !== "" && checkboxSelect?.length === 0;

  return (
    <div className="darkHeader governanceQmsTable">
      {Object.keys(headerData).length > 0 && (
        <DataTable
          paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
          currentPageReportTemplate="{first} to {last} of {totalRecords}"
          rowsPerPageOptions={[10, 25, 50]}
          paginationcomponentoptions={{
            rowsPerPageText: "Records per page:",
            rangeSeparatorText: "out of",
          }}
          selection={checkboxSelect}
          selectAll={true}
          value={bodyData}
          paginator
          showGridlines
          rows={rows}
          filters={filters1}
          selectionMode="checkbox"
          responsiveLayout="scroll"
          header={header1}
          onSelectionChange={(e) => handleChange(e)}
          className=" primeReactDataTable checkboxSelect "
        >
          {/* {dataAccess != 908 && ( */}
          {dataAccess == 919 && (
            <Column
              alignHeader={"center"}
              style={{ textAlign: "center" }}
              disabled={isCheckboxDisabled}
              selectionMode={data?.length > 0 ? "multiple" : ""}
            />
          )}
          {dataAccess == 561 && (
            <Column
              alignHeader={"center"}
              style={{ textAlign: "center" }}
              disabled={isCheckboxDisabled}
              selectionMode={data?.length > 0 ? "multiple" : ""}
            />
          )}
          {/* )} */}
          {dynamicColumns}
        </DataTable>
      )}
    </div>
  );
}

export default QMSTable;
