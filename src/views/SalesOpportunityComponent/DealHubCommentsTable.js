import React, { useEffect, useRef, useState } from "react";
import { FilterMatchMode } from "primereact/api";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import "primeicons/primeicons.css";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.css";
import "primeflex/primeflex.css";
import { InputText } from "primereact/inputtext";
import "./DealhubOpportunityPopUp.scss";
require("jspdf-autotable");

function DealHubCommentsTable(props) {
  const {
    data,
    rows,
    value,
    dynamicColumns,
    headerData,
    setHeaderData,
    setCheckedData,
    setSelectedIds,
    checkboxSelect,
    setCheckboxSelect,
    selectedIds,
    dataObject,
  } = props;

  const [mainData, setMainData] = useState([]);
  const [bodyData, setBodyData] = useState([]);
  const [exportColumns, setExportColumns] = useState([]);

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
    let c = b.replace(/,/g, ";");
    setCheckedData(c);
    setCheckboxSelect(e.value);

    let ids = e.value.map((val) => val.id);
    setSelectedIds(ids);
  };

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
        <span className="p-input-icon-left tableGsearch" style={{ top }}>
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
    <div className="darkHeader dealhubDetailTable mt-3">
      <div className="dealHubHeading">
        <h2>DealHub Comments</h2>
      </div>
      {Object.keys(headerData).length > 0 && (
        <>
          <DataTable
            paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink "
            currentPageReportTemplate="{first} to {last} of {totalRecords}"
            rowsPerPageOptions={[10, 25, 50]}
            paginationrowsperpageoptions={[5, 15, 25, 50]}
            paginationcomponentoptions={{
              rowsPerPageText: "Records per page:",
              rangeSeparatorText: "out of",
            }}
            value={bodyData}
            paginator
            showGridlines
            rows={rows}
            dataKey="id"
            filters={filters1}
            selectionMode="checkbox"
            selection={checkboxSelect}
            responsiveLayout="scroll"
            header={header1}
            onSelectionChange={(e) => handleChange(e)}
            className=" primeReactDataTable checkboxselect Deal-Hub-Detail-Table" ////customerEngament
          >
            {dynamicColumns}
          </DataTable>
        </>
      )}
    </div>
  );
}

export default DealHubCommentsTable;
