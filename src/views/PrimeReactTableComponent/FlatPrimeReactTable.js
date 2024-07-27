import React, { useEffect, useState } from "react";
import { FilterMatchMode, FilterOperator } from "primereact/api";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import "primeicons/primeicons.css";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.css";
import "primeflex/primeflex.css";
import { InputText } from "primereact/inputtext";
import "./PrimeReactTable.scss";
import { Link } from "react-router-dom";

function FlatPrimeReactTable(props) {
  const { data, rows, col, headerdatagroup, linkColumns, linkColumnsRoutes, rowGroupMode, groupRowsBy } = props;
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

  const dynamicColumns = Object.keys(headerData)?.map((col, i) => {
    return (
      <Column
        sortable
        key={col}
        body={linkColumns?.includes(col) && LinkTemplate}
        field={col}
        header={headerData[col]}
      />
    );
  });
  const [checkboxSelect, setCheckboxSelect] = useState([]);

  const handleChange = (e) => {
    console.log(e);

    setCheckboxSelect(e.value);
  };
  return (
    <>
      {Object.keys(headerData).length > 0 && (
        <div className="darkHeader">
          <DataTable
            value={bodyData}
            paginator
            showGridlines
            rows={rows}
            dataKey="id"
            filters={filters1}
            responsiveLayout="scroll"
            header={header1}
            selection={checkboxSelect}
            emptyMessage="No Records found."
            className=" primeReactDataTable" //// customerEngament
            rowGroupMode={rowGroupMode}
            groupRowsBy={groupRowsBy}
            onSelectionChange={(e) => handleChange(e)}
          >
            {/* <Column header={headerdatagroup} colSpan={col} /> */}

            {dynamicColumns}
          </DataTable>
        </div>
      )}
    </>
  );
}

export default FlatPrimeReactTable;
