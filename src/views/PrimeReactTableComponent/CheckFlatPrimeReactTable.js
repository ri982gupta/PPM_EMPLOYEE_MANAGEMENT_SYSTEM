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

function CheckFlatPrimeReactTable(props) {
  const { data, rows, checkedData, setCheckedData, value, setCheckValidation } = props;
  const [mainData, setMainData] = useState([]);
  const [headerData, setHeaderData] = useState([]);
  const [bodyData, setBodyData] = useState([]);
  const [checkboxSelect, setCheckboxSelect] = useState();
  console.log(value);

  const handleChange = (e) => {
    let data = e.value;
    let fData = data.map(d => d.id)
    {
      value == "trackerscreensadder" ? setCheckedData(data) : setCheckedData(fData[0]);
    }

    console.log(e);

    setCheckboxSelect(e.value);
    // setCheckValidation(e.value);
  }

  useEffect(() => {

    console.log("in line data");
    console.log(data);

    setMainData(JSON.parse(JSON.stringify(data)));
  }, [data]);

  useEffect(() => {
    if (mainData.length > 0) {
      setHeaderData(mainData[0]);
      setBodyData(mainData.splice(1));
    }
  }, [mainData]);

  useEffect(() => {
    console.log("in header data useEffect ");
    console.log(headerData);
  }, [headerData])

  useEffect(() => {
    console.log("in bodyData data useEffect ");
    console.log(bodyData);

  }, [bodyData])

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
  console.log("in line 45")
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
            // style={{ textAlign: "center", verticalAlign: "middle" }}
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
    <>
      {Object.keys(headerData).length > 0 && (
        <div className="card darkHeader">
          <DataTable
            value={bodyData}
            paginator
            showGridlines
            rows={10}
            dataKey="id"
            filters={filters1}
            responsiveLayout="scroll"
            header={header1}
            emptyMessage="No Data found."
            selection={checkboxSelect}
            className="primeReactDataTable"
            onSelectionChange={(e) => handleChange(e)}
          >
            <Column selectionMode="multiple" style={{ textAlign: "center" }} />
            {dynamicColumns}
          </DataTable>
        </div>
      )}
    </>
  );
}

export default CheckFlatPrimeReactTable;
