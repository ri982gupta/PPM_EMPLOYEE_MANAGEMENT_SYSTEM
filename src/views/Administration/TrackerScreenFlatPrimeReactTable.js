import React, { useEffect, useState } from "react";
import { FilterMatchMode, FilterOperator } from "primereact/api";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import "primeicons/primeicons.css";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.css";
import "primeflex/primeflex.css";
import { InputText } from "primereact/inputtext";
import "./TrackerScreenAdder.scss";
import { Link } from "react-router-dom";

// C:\PPM_Rewrite\PPMRewrite_Local\PPMRewrite_React\src\views\Administration\TrackerScreenFlatPrimeReactTable.js

function TrackerScreenFlatPrimeReactTable(props) {
  const {
    data,
    rows,
    col,
    headerdatagroup,
    linkColumns,
    linkColumnsRoutes,
    rowGroupMode,
    groupRowsBy,
    maxHeight1
  } = props;
  const [mainData, setMainData] = useState([]);
  const [headerData, setHeaderData] = useState([]);
  const [bodyData, setBodyData] = useState([]);

  document.documentElement.style.setProperty(
    "--dynamic-value",
    String(maxHeight1 -132) + "px"
  );

  useEffect(() => {
    setMainData(JSON.parse(JSON.stringify(data)));
  }, [data]);

  useEffect(() => {
    if (mainData.length > 0) {
      setHeaderData(mainData[0]);
      setBodyData(mainData.splice(1));
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

    console.log(_filters1);

    console.log(_filters1);

    _filters1["global"].value = value;

    setFilters1(_filters1);
    setGlobalFilterValue1(value);
  };

  const renderHeader1 = () => {
    return (
      <div className="flex justify-content-between">
        <span></span>
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

  const LinkTemplate = (data) => {
    console.log(data);
    let rou = linkColumnsRoutes[0]?.split(":");
    return (
      <>
        <Link target="_blank" to={rou[0] + ":" + data[rou[1]]}>
          {data[linkColumns]}
        </Link>
      </>
    );
  };
  const ScreenName = (data) => {
    return (
      <div className="ellipsis" title={data.screenName}>
        {data.screenName}
      </div>
    );
  };
  const header1 = renderHeader1();

  const dynamicColumns = Object.keys(headerData)?.map((col, i) => {
    console.log(col);
    return (
      <Column
        key={col}
        sortable
        style={col === "S.No" ? { width: "5%", textAlign: "center" } : {}}
        body={
          linkColumns?.includes(col)
            ? LinkTemplate
            : col === "screenName" && ScreenName
        }
        field={col}
        header={headerData[col]}
      />
    );
  });

  return (
    <div>
      <div className="card col-6 primeReactTable darkHeader administrationTrackerAdder">
        {Object.keys(headerData).length > 0 && (
          <DataTable
            rowsPerPageOptions={[10, 25, 30]}
            paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
            currentPageReportTemplate="{first} to {last} of {totalRecords}"
            value={bodyData}
            paginator
            showGridlines
            rows={rows}
            dataKey="id"
            filters={filters1}
            responsiveLayout="scroll"
            header={header1}
            emptyMessage="No Records found."
            className="primeReactDataTable"
            rowGroupMode={rowGroupMode}
            groupRowsBy={groupRowsBy}
          >
            {/* <Column header={headerdatagroup} colSpan={col} /> */}

            {dynamicColumns}
          </DataTable>
        )}
      </div>
    </div>
  );
}

export default TrackerScreenFlatPrimeReactTable;
