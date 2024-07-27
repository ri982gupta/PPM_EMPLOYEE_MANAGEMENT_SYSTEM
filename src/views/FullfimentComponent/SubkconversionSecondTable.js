import React, { useEffect, useState } from "react";
import { FilterMatchMode } from "primereact/api";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import "primeicons/primeicons.css";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.css";
import "primeflex/primeflex.css";
import "../PrimeReactTableComponent/PrimeReactTable.scss";
import { InputText } from "primereact/inputtext";
import "../FullfimentComponent/SubkConversionTrend.scss";

function SubkconversionSecondTable(props) {
  const { data, rows } = props;
  const [mainData, setMainData] = useState([]);
  const [headerData, setHeaderData] = useState([]);
  const [bodyData, setBodyData] = useState([]);

  useEffect(() => {
    setMainData(JSON.parse(JSON.stringify(data)));
  }, [data]);

  // console.log(mainData);
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

  // console.log("in line 61");
  // console.log(filters1);
  // console.log("in line 45");
  // console.log(data);

  const financialImpactTT = (data) => {
    return (
      <div className="ellipsis" data-toggle="tooltip" title={data.customer}>
        {data.customer}
      </div>
    );
  };
  const ChangeDept = (data) => {
    return (
      <div className="ellipsis" data-toggle="tooltip" title={data.department}>
        {data.department}
      </div>
    );
  };
  const ChangeDp = (data) => {
    return (
      <div className="ellipsis" data-toggle="tooltip" title={data.dp}>
        {data.dp}
      </div>
    );
  };
  const ChangeCsl = (data) => {
    return (
      <div className="ellipsis" data-toggle="tooltip" title={data.csl}>
        {data.csl}
      </div>
    );
  };
  const ChangeEmpNumber = (data) => {
    return (
      <div
        className="ellipsis"
        data-toggle="tooltip"
        title={data.employee_number}
      >
        {data.employee_number}
      </div>
    );
  };
  const ChangeprjMgr = (data) => {
    return (
      <div className="ellipsis" data-toggle="tooltip" title={data.prjMgr}>
        {data.prjMgr}
      </div>
    );
  };
  const ChangeStrtDate = (data) => {
    return (
      <div
        className="ellipsis"
        data-toggle="tooltip"
        title={data.allocation_start_dt}
      >
        {data.allocation_start_dt}
      </div>
    );
  };
  const ChangeEndDate = (data) => {
    return (
      <div
        className="ellipsis"
        data-toggle="tooltip"
        title={data.allocation_end_dt}
      >
        {data.allocation_end_dt}
      </div>
    );
  };
  const ChangeProjects = (data) => {
    return (
      <div className="ellipsis" data-toggle="tooltip" title={data.projects}>
        {data.projects}
      </div>
    );
  };
  const ChangeName = (data) => {
    return (
      <div
        className="ellipsis"
        data-toggle="tooltip"
        title={data.resource_name}
      >
        {data.resource_name}
      </div>
    );
  };
  const ChangeDate = (data) => {
    return (
      <div className="ellipsis" data-toggle="tooltip" title={data.start_date}>
        {data.start_date}
      </div>
    );
  };
  const ChangeSuper = (data) => {
    return (
      <div className="ellipsis" data-toggle="tooltip" title={data.supervisor}>
        {data.supervisor}
      </div>
    );
  };

  // console.log(headerData);
  const dynamicColumns = Object.keys(headerData)?.map((col, i) => {
    return (
      <Column
        key={col}
        body={
          (col == "customer" && financialImpactTT) ||
          (col == "department" && ChangeDept) ||
          (col == "dp" && ChangeDp) ||
          (col == "csl" && ChangeCsl) ||
          (col == "employee_number" && ChangeEmpNumber) ||
          (col == "prjMgr" && ChangeprjMgr) ||
          (col == "allocation_start_dt" && ChangeStrtDate) ||
          (col == "allocation_end_dt" && ChangeEndDate) ||
          (col == "projects" && ChangeProjects) ||
          (col == "resource_name" && ChangeName) ||
          (col == "start_date" && ChangeDate) ||
          (col == "supervisor" && ChangeSuper)
        }
        field={col}
        header={headerData[col]}
      ></Column>
    );
  });

  const [globalFilterValue1, setGlobalFilterValue1] = useState("");

  const onGlobalFilterChange1 = (e) => {
    const value = e.target.value;
    let _filters1 = { ...filters1 };

    // console.log(_filters1);

    // console.log(_filters1);

    _filters1["global"].value = value;

    setFilters1(_filters1);
    setGlobalFilterValue1(value);
  };

  const renderHeader1 = () => {
    return (
      <div className="flex  flex-row-reverse">
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

  const header1 = renderHeader1();

  return (
    <div>
      <div
        className=" customCard card graph my-4 darkHeader"
        style={{ width: "100%", float: "left" }}
      >
        {Object.keys(headerData).length > 0 && (
          <DataTable
            paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
            currentPageReportTemplate="{first} - {last} of {totalRecords}"
            rowsPerPageOptions={[10, 25, 50]}
            value={bodyData}
            paginator
            showGridlines
            rows={rows}
            dataKey="id"
            filters={filters1}
            header={header1}
            responsiveLayout="scroll"
            emptyMessage="No Records found."
            className="customerEngament primeReactDataTable subkcelltab"
          >
            {dynamicColumns}
          </DataTable>
        )}
      </div>
    </div>
  );
}

export default SubkconversionSecondTable;
