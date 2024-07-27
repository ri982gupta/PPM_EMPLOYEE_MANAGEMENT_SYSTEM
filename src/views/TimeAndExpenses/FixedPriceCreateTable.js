import React, { useEffect, useState } from "react";
import { FilterMatchMode } from "primereact/api";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import "primeicons/primeicons.css";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.css";
import "primeflex/primeflex.css";
import { InputText } from "primereact/inputtext";
import "../PrimeReactTableComponent/PrimeReactTable.scss";
import useDynamicMaxHeight from "../PrimeReactTableComponent/useDynamicMaxHeight";
import "../TimeAndExpenses/FixedPriceCreateTable.scss"

function FixedPriceCreateTable(props) {
  const {
    data,
    rows,
    checkedData,
    setCheckedData,
    setSelectedData,
    checkboxSelect,
    selectedData,
    setCheckboxSelect,
    dataAccess,
    fileName,
    maxHeight
  } = props;
  const [mainData, setMainData] = useState([]);
  const [headerData, setHeaderData] = useState([]);
  const [bodyData, setBodyData] = useState([]);
  const [rowClick, setRowClick] = useState(true);


  if(fileName == "FixedPriceCreate"){
    document.documentElement.style.setProperty(
      "--dynamic-value",
      String(maxHeight -181) + "px"
    );
  }
  
  const handleChange = (e) => {
    let data = e.value;

    let fData = data.map((d) => d.id);
    let SData = data.map((d) => d.status);
    setSelectedData(SData);
    setCheckedData(fData);
    setCheckboxSelect(e.value);
  };

  useEffect(() => {
    setMainData(JSON.parse(JSON.stringify(data)));
  }, [data]);

  useEffect(() => {
    if (mainData.length > 0) {
      setHeaderData(mainData[0]);
      setBodyData(mainData.splice(1));
    }
  }, [mainData]);

  useEffect(() => {}, [headerData]);

  useEffect(() => {}, [bodyData]);

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

    _filters1["global"].value = value;

    setFilters1(_filters1);
    setGlobalFilterValue1(value);
  };
  const generateBodyWithTooltip = (field) => (data) =>
  (
    <div className="ellipsis" title={`${data[field]}`}>
      {data[field] == "" || data[field] == null ? "NA" : data[field]}
    </div>
  );

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
            style={{ textAlign: "center", verticalAlign: "middle" }}
          />
        </span>
      </div>
    );
  };

  const header1 = renderHeader1();

  const dynamicColumns = Object.keys(headerData)?.map((col, i) => {
    let body;

    body = generateBodyWithTooltip(col);

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
  const isCheckboxDisabled = (rowData) => {
    const acceptedStatuses = [
      "DM Accepted",
      "In Finance Review",
      "Finance Accepted",
    ];
    return acceptedStatuses.includes(rowData.status);
  };

  const headerCheckbox = (
    <input
      type="checkbox"
      onChange={(e) => {
        setCheckedData((prevcheckedData) => {
          const allProductIds = data
            .filter((product) => !isCheckboxDisabled(product))
            .map((product) => product.id)
            .filter((id) => id !== undefined);

          return e.target.checked ? allProductIds : [];
        });
        setSelectedData(
          e.target.checked
            ? data
                .filter((product) => !isCheckboxDisabled(product))
                .map((product) => product.status)
            : []
        );
      }}
      checked={
        checkedData.length > 0 &&
        checkedData.length ===
          data
            .filter((product) => !isCheckboxDisabled(product))
            .map((product) => product.id)
            .filter((id) => id !== undefined).length
      }
      disabled={data.length === 0}
    />
  );

  const checkboxBodyTemplate = (rowData) => {
    return (
      <input
        type="checkbox"
        onChange={(e) => {
          if (!isCheckboxDisabled(rowData)) {
            setCheckedData((prevcheckedData) => {
              const isSelected = prevcheckedData.includes(rowData.id);

              let updatedSelection;

              if (isSelected) {
                updatedSelection = prevcheckedData.filter(
                  (id) => id !== rowData.id
                );
              } else {
                updatedSelection = [...prevcheckedData, rowData.id];
              }

              setSelectedData(
                data
                  .filter((row) => updatedSelection.includes(row.id))
                  .map((row) => row.status)
              );

              return updatedSelection;
            });
          }
        }}
        checked={
          checkedData.includes(rowData.id) && !isCheckboxDisabled(rowData)
        }
        disabled={isCheckboxDisabled(rowData)}
      />
    );
  };

  return (
    <div className="darkHeader  generate-billing-timesheet-table">
      {Object.keys(headerData).length > 0 && (
        <DataTable
          className=" primeReactDataTable"
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
          emptyMessage="No Data found."
          selection={checkboxSelect}
          selectionMode={rowClick ? null : "checkbox"}
          onSelectionChange={(e) => handleChange(e)}
          disabled
        >
          <Column
            header={headerCheckbox}
            body={checkboxBodyTemplate}
            headerStyle={{ width: "3rem" }}
            style={{ textAlign: "center" }}
          ></Column>
          {dynamicColumns}
        </DataTable>
      )}
    </div>
  );
}
export default FixedPriceCreateTable;
