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

function ActionComponent({data, actionBodyTemplate}) {
//   const { data,rows } = props;
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

  // console.log("in line 61");
  // console.log(filters1);
  // console.log("in line 45")
  // console.log(data);

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

  const header1 = renderHeader1();

  const dynamicColumns = Object.keys(headerData)?.map((col, i) => {
    return <Column sortable key={col} field={col} header={headerData[col]} />;
  });

 

  return (
    <div>
      <div className="card">
        {Object.keys(headerData).length > 0 && bodyData.length > 0 && (
          <DataTable 
            value={bodyData}
            paginator
            showGridlines
            rows={10}
            dataKey="id"
            filters={filters1}
            responsiveLayout="scroll"
            header={header1}
            emptyMessage="No customers found."
          >
            {dynamicColumns}
            <Column body={actionBodyTemplate}></Column>
          </DataTable>
        )}
      </div>
    </div>
  );
}

export default ActionComponent;

