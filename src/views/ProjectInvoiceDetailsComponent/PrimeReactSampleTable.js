import React, { useState } from "react";
import { FilterMatchMode, FilterOperator } from "primereact/api";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import "primeicons/primeicons.css";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.css";
import "primeflex/primeflex.css";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
// import "./DemoTable.scss";

function PrimeReactSampleTable(props) {
  const { data } = props;

  const [filters1, setFilters1] = useState({
    //   invoiceName: { value: null, matchMode: FilterMatchMode.CONTAINS },
    invoiceName: { value: null, matchMode: FilterMatchMode.CONTAINS },
    grossMargin: { value: null, matchMode: FilterMatchMode.CONTAINS },
    project: { value: null, matchMode: FilterMatchMode.CONTAINS },
    customer: { value: null, matchMode: FilterMatchMode.CONTAINS },
    invMonth: { value: null, matchMode: FilterMatchMode.CONTAINS },
    netInv: { value: null, matchMode: FilterMatchMode.CONTAINS },
  });
  const [globalFilterValue1, setGlobalFilterValue1] = useState("");

  const clearFilter1 = () => {
    initFilters1();
  };

  const initFilters1 = () => {
    setFilters1({
      //   invoiceName: { value: null, matchMode: FilterMatchMode.CONTAINS },
      invoiceName: { value: null, matchMode: FilterMatchMode.CONTAINS },
      grossMargin: { value: null, matchMode: FilterMatchMode.CONTAINS },
      project: { value: null, matchMode: FilterMatchMode.CONTAINS },
      customer: { value: null, matchMode: FilterMatchMode.CONTAINS },
      invMonth: { value: null, matchMode: FilterMatchMode.CONTAINS },
      netInv: { value: null, matchMode: FilterMatchMode.CONTAINS },
      //   project: {
      //     operator: FilterOperator.AND,
      //     constraints: [],
      //   },
      //   customer: {
      //     operator: FilterOperator.AND,
      //     constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
      //   },
      //   invMonth: {
      //     operator: FilterOperator.AND,
      //     constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
      //   },
      //   netInv: {
      //     operator: FilterOperator.AND,
      //     constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
      //   },
      //   representative: { value: null, matchMode: FilterMatchMode.IN },
      //   date: {
      //     operator: FilterOperator.AND,
      //     constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }],
      //   },
      //   balance: {
      //     operator: FilterOperator.AND,
      //     constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }],
      //   },
      //   status: {
      //     operator: FilterOperator.OR,
      //     constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }],
      //   },
      //   activity: { value: null, matchMode: FilterMatchMode.BETWEEN },
      //   verified: { value: null, matchMode: FilterMatchMode.EQUALS },
    });
    setGlobalFilterValue1("");
  };

  const onGlobalFilterChange1 = (e) => {
    const value = e.target.value;
    let _filters1 = { ...filters1 };

    console.log(_filters1);

    _filters1["invoiceName"].value = value;

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
        {/* <Button
          type="button"
          icon="pi pi-filter-slash"
          label="Clear"
          className="p-button-outlined tableClear"
          onClick={clearFilter1}
        /> */}
      </div>
    );
  };

  const header1 = renderHeader1();
  return (
    <div>
      <div className="card">
        {/* <h5>Filter Menu</h5>
        <p>Filters are displayed in an overlay.</p> */}
        <DataTable
          value={data}
          paginator
          //   className="p-datatable-customers"
          showGridlines
          rows={10}
          dataKey="id"
          //   scrollable
          //   scrollDirection="both"
          //   header="Small Table"
          //   size="small"
          filters={filters1}
          //   loading={loading1}
          responsiveLayout="scroll"
          header={header1}
          emptyMessage="No Data found."
        >
          <Column
            field="grossMargin"
            header="Gross Margin"
            // filter
            // filterPlaceholder="Search by name"
            // style={{ minWidth: "12rem" }}
            style={{ width: "160px" }}
            sortable
            frozen
          />

          <Column
            field="invoiceName"
            header="Invoice Name"
            // style={{ minWidth: "8rem" }}
            // body={verifiedBodyTemplate}
            // filter
            style={{ width: "200px" }}
            sortable
            frozen
            // filterElement={verifiedFilterTemplate}
          />
          <Column field="project" header="Project" sortable />
          <Column field="customer" header="Customer" sortable />
          <Column field="invMonth" header="Inv Month" sortable />
          <Column field="netInv" header="Net Inv" sortable />
          <Column field="project" header="Project" sortable />
          <Column field="customer" header="Customer" sortable />
          <Column field="invMonth" header="Inv Month" sortable />
          <Column field="netInv" header="Net Inv" sortable />
          {/* <Column field="project" header="Project" sortable />
          <Column field="customer" header="Customer" sortable />
          <Column field="invMonth" header="Inv Month" sortable />
          <Column field="netInv" header="Net Inv" sortable />
          <Column field="project" header="Project" sortable />
          <Column field="customer" header="Customer" sortable />
          <Column field="invMonth" header="Inv Month" sortable />
          <Column field="netInv" header="Net Inv" sortable /> */}
        </DataTable>
      </div>
    </div>
  );
}

export default PrimeReactSampleTable;
