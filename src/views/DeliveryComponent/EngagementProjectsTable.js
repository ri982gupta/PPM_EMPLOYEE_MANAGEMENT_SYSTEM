import React, { useEffect, useState } from "react";
import { FilterMatchMode, FilterOperator } from "primereact/api";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import "primeicons/primeicons.css";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.css";
import "primeflex/primeflex.css";
import { InputText } from "primereact/inputtext";
import "../PrimeReactTableComponent/PrimeReactTable.scss";
import { Link } from "react-router-dom";

function EngagementProjectsTable(props) {
  const { data, rows, col, headerdatagroup, linkColumns, linkColumnsRoutes } =
    props;
  const [mainData, setMainData] = useState([]);
  const [headerData, setHeaderData] = useState([]);
  const [bodyData, setBodyData] = useState([]);

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
      <div className="ellipsis" title={data[linkColumns]}>
        <Link target="_blank" to={rou[0] + ":" + data[rou[1]]}>
          {data[linkColumns]}
          {console.log(rou[0])}
          {console.log(data[rou[1]])}
        </Link>
      </div>
    );
  };

  const header1 = renderHeader1();

  const generateBodyWithTooltip = (field) => (data) =>
    (
      <div className="ellipsis" title={`${data[field]}`}>
        {data[field] == "" || data[field] == null ? "NA" : data[field]}
      </div>
    );

  const generateBodyforEmptyBox = (field) => (data) =>
    <div>{data[field] == "" || data[field] == null ? "NA" : data[field]}</div>;

  const dynamicColumns = Object.keys(headerData)?.map((col, i) => {
    console.log(col);
    let body;
    if (linkColumns?.includes(col)) {
      body = LinkTemplate;
    } else if (
      [
        "project_code",
        "contract_terms",
        "business_unit",
        "prj_manager",
        "prj_stage",
      ].includes(col)
    ) {
      body = generateBodyWithTooltip(col);
    } else if (
      [
        "planned_start_dt",
        "planned_end_dt",
        "actual_start_dt",
        "actual_end_dt",
      ].includes(col)
    ) {
      body = generateBodyforEmptyBox(col);
    }
    return (
      <Column
        key={col}
        body={body}
        field={col}
        sortable
        header={headerData[col]}
        style={{
          whiteSpace: "nowrap",
          ...(col === "project_name"
            ? { minWidth: "270px" }
            : col === "prj_manager"
            ? { minWidth: "165px" }
            : {}),
        }}
      />
    );
  });

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
            emptyMessage="No Records found."
            className=" primeReactDataTable" /// customerEngament
          >
            {dynamicColumns}
          </DataTable>
        )}
      </div>
    </div>
  );
}

export default EngagementProjectsTable;
