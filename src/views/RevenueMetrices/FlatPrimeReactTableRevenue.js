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
import moment from "moment";

function FlatPrimeReactTableRevenue(props) {
  const {
    data,
    rows,
    col,
    headerdatagroup,
    linkColumns,
    linkColumnsRoutes,
    rowGroupMode,
    groupRowsBy,
  } = props;
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

  console.log("in line 61");
  console.log(filters1);
  console.log("in line 45");
  console.log(data);

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

  const header1 = renderHeader1();
  const generateBodyWithTooltip = (field) => (data) =>
    (
      <div className="ellipsis" title={`${data[field]}`}>
        {data[field]}
      </div>
    );

  const numberwithcommas = (field) => (data) => {
    const Value = data[field];
    const formattedValue = Value.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

    return (
      <div data-toggle="tooltip" title={formattedValue}>
        <span
          style={{
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          $ <span className="align right">{formattedValue}</span>
        </span>
      </div>
    );
  };

  const updatedDateBody = (field) => (data) => {
    const formattedValue = moment(data[field].split("T")[0]).format(
      "DD-MMM-YYYY"
    );
    return (
      <div data-toggle="tooltip" title={formattedValue}>
        {formattedValue}
      </div>
    );
  };
  const dynamicColumns = Object.keys(headerData)?.map((col, i) => {
    console.log(col);
    let body;
    if (linkColumns?.includes(col)) {
      body = LinkTemplate;
    }
    // if (["comments"].includes(col))
    else if (col.includes("min_salary") || col.includes("max_salary")) {
      body = numberwithcommas(col);
    } else if (col.includes("updated_date") || col.includes("month")) {
      body = updatedDateBody(col);
    } else {
      body = generateBodyWithTooltip(col);
    }
    return (
      <Column
        sortable
        key={col}
        body={body}
        field={col}
        header={headerData[col]}
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
            className=" primeReactDataTable"   ////customerEngament
          >
            {dynamicColumns}
          </DataTable>
        )}
      </div>
    </div>
  );
}

export default FlatPrimeReactTableRevenue;
