import React, { useEffect, useState } from "react";
import MaterialReactTable from "material-react-table";
import "./VendorSearchTable.scss";
import moment from "moment";
import axios from "axios";
import { environment } from "../../environments/environment";
import VendorTrendResourceTable from "./VendorTrendResourceTable";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Link } from "react-router-dom";
import { InputText } from "primereact/inputtext";
import { FilterMatchMode } from "primereact/api";

export default function VendorTrendTable(props) {
  const { data, formData, abortController, setLoader } = props;
  const baseUrl = environment.baseUrl;
  const [columns, setColumns] = useState(null);
  const [newData, setNewData] = useState([]);
  const [rdata, setRData] = useState([]);
  const [openResource, setOpenResource] = useState(false);
  const [responseData, setResponseData] = useState(false);
  const [openResourceNw, setOpenResourceNw] = useState(false);
  const [openCustomer, setOpenCustomer] = useState(false);
  const [colorFilter, setColorFilter] = useState([]);
  const [headerData, setHeaderData] = useState([]);
  const [customerData, setCustomerData] = useState([]);
  const [linkColumnsRoutes, setLinkColumnsRoutes] = useState([]);
  const [linkColumns, setLinkColumns] = useState([]);

  useEffect(() => {
    const slicedData = data.slice(1);
    setNewData(slicedData);
  }, [data]);
  const getData = () => {
    const headerRow = data.find((row) => row.id === -1);
    if (!headerRow) {
      setColumns(null);
      return;
    }
    const headers = Object.keys(headerRow);
    const filteredHeaders = headers.filter(
      (header) => !["id", "lvl"].includes(header)
    );

    const dateHeaders = filteredHeaders.filter(
      (header) => header !== "name" && header !== "total"
    );
    dateHeaders.sort();
    const sortedHeaders = ["name", ...dateHeaders];
    const newHeaders = sortedHeaders.map((key) => {
      const headerValue = headerRow[key];
      return {
        accessorKey: key,
        header: key,
        Header: () => (
          <div title={headerValue.split("^&")[0]}>
            {headerValue.split("^&")[0]}
          </div>
        ),
        Cell: ({ cell }) => {
          const cellValue = cell.getValue();
          return (
            <div className={cell.column.id !== "name" ? "textright" : ""}>
              {cell.column.id === "name" ? (
                <span title={cell.getValue()}>{cell.getValue()}</span>
              ) : (
                <div>
                  <span
                    onClick={(event) => {
                      if (cell.getValue() !== "0") {
                        resourseDetailsTable(event, cell, key);
                      }
                    }}
                    style={{
                      color: cell.getValue() !== "0" ? "rgb(46, 136, 197)" : "",
                      cursor: cell.getValue() !== "0" ? "pointer" : "",
                    }}
                    title={cell.getValue()}
                  >
                    {cell.getValue()}
                  </span>
                </div>
              )}
            </div>
          );
        },
      };
    });
    newHeaders.sort();
    setColumns(newHeaders);
  };
  //=========Resource Details Table===============
  const resourseDetailsTable = (event, cell, key) => {
    let parts, resultStart, resultEnd;
    parts = key.split("_");
    parts.pop();
    resultStart = parts.join("-");
    resultEnd = moment(resultStart).startOf("month").format("yyyy-MM-DD");
    let end = moment(resultEnd).endOf("month").format("yyyy-MM-DD");
    const skillId = cell.row.original.id;
    console.log(cell.row.original.name);
    const skillType = cell.row.original.name;
    setOpenResourceNw(false);
    setOpenCustomer(false);
    event.preventDefault();
    setOpenResource(true);
    abortController.current = new AbortController();
    const loaderTime = setTimeout(() => {
      setLoader(true);
    }, 2000);
    axios({
      method: "post",
      url: baseUrl + `/VendorMS/vendor/getVendorTrendResourceDetails`,
      signal: abortController.current.signal,
      data: {
        FromDate: resultEnd,
        ToDate: end,
        ResLoc: formData.CountryIds == "-1" ? 0 : formData.CountryIds,
        serType: formData.serType == "DP" ? "Dp_id" : "Csl_id",
        serVal: formData.serValue,
        skillId: skillId == 0 ? -1 : skillId,
        skillType: skillType,
      },
    })
      .then(function (response) {
        var response = response.data;
        setResponseData(response);
        clearTimeout(loaderTime);
        if (skillType == "Total Resources") {
          setOpenResourceNw(true);
          setOpenCustomer(false);
        } else if (skillType == "Core") {
          setOpenResourceNw(true);
          setOpenCustomer(false);
        } else if (skillType == "Non Core") {
          setOpenResourceNw(true);
          setOpenCustomer(false);
        } else if (skillType == "Unclassified") {
          setOpenResourceNw(true);
          setOpenCustomer(false);
        } else if (skillType == "Converted subk") {
          setOpenResourceNw(true);
          setOpenCustomer(false);
        } else if (skillType == "Customer") {
          setOpenCustomer(true);
          setOpenResourceNw(false);
        }
        setLoader(false);
        let Headerdata = [
          {
            employee_number: "Emp ID",
            resource_name: "Name",
            start_date: "DOJ",
            department: "Dept",
            supervisor: "Supervisor",
            vendor_name: "Vendor Name",
            contract_type: "Contract Type",
          },
        ];
        let hData = [];
        let bData = [];
        for (let index = 0; index < response.length; index++) {
          if (index == 0) {
            hData.push(response[index]);
          } else {
            bData.push(response[index]);
          }
        }
        setRData([]);
        setRData(Headerdata.concat(bData));
        setCustomerData(response?.slice(1));

        let data1 = ["Customer_name", ""];
        let linkRoutes = ["/customer/dashboard/:id", ""];
        setLinkColumns(data1);
        setLinkColumnsRoutes(linkRoutes);
        window.scrollTo({
          top: 500,
          behavior: "smooth",
        });
      })
      .catch((e) => {
        console.log(e);
        setLoader(false);
      });
  };
  useEffect(() => {
    rdata[0] && setHeaderData(JSON.parse(JSON.stringify(rdata[0])));
  }, [rdata]);
  useEffect(() => {
    getData();
  }, [data]);
  //====Customer Data table===========================
  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  });
  const [globalFilterValue, setGlobalFilterValue] = useState("");

  const onGlobalFilterChange = (e) => {
    const value = e.target.value;
    let _filters = { ...filters };

    _filters["global"].value = value;

    setFilters(_filters);
    setGlobalFilterValue(value);
  };

  const renderHeader = () => {
    return (
      <div className="primeTableSearch legend-execel-and-search-btn">
        <div className="legend"></div>
        <div className="execel-and-search-btn">
          <InputText
            className="globalFilter"
            value={globalFilterValue}
            onChange={onGlobalFilterChange}
            placeholder="Keyword Search"
          />
        </div>
      </div>
    );
  };
  const header = renderHeader();

  const LinkTemplate = (data) => {
    return (
      <>
        <Link
          to={`/search/customerSearch/customer/dashboard/:${data.Cust_id}`}
          data-toggle="tooltip"
          title={data.Customer_name}
          target="_blank"
        >
          {data.Customer_name}
        </Link>
      </>
    );
  };
  const EngCompany = (data) => {
    console.log(data);
    return (
      <div title={data.Eng_Company} className="ellipsis">
        {data.Eng_Company}
      </div>
    );
  };
  const IndustryType = (data) => {
    return (
      <div title={data.Industry_Type} className="ellipsis">
        {data.Industry_Type}
      </div>
    );
  };
  const SalesTerritory = (data) => {
    return (
      <div title={data.Sales_Territory} className="ellipsis">
        {data.Sales_Territory}
      </div>
    );
  };
  const CustomerStatus = (data) => {
    return (
      <div title={data.Customer_status} className="ellipsis">
        {data.Customer_status}
      </div>
    );
  };
  const Website = (data) => {
    return (
      <div title={data.Website} className="ellipsis">
        <a
          href={data.Website}
          target="_blank"
          rel="noopener noreferrer"
          title={data.Website}
        >
          <span>{data.Website}</span>
        </a>
      </div>
    );
  };
  return (
    <div>
      <div className="darkHeader VendorTrendTable">
        {columns !== null ? (
          <MaterialReactTable
            data={newData}
            columns={columns}
            enablePagination={false}
            paginateExpandedRows={true}
            enableBottomToolbar={false}
            enableTopToolbar={false}
            enableColumnActions={false}
            enableSorting={false}
            enableRowVirtualization={true}
            initialState={{
              expanded: false,
              density: "compact",
              columnPinning: {
                left: ["name"],
              },
            }}
            muiTableContainerProps={{
              sx: {
                "&": {
                  maxHeight: "calc(100vh - 130px)",
                },
              },
            }}
            muiTableBodyProps={{
              sx: {
                "& td": {
                  borderRight: "1px solid #ccc",
                  height: "15px",
                  fontSize: "11px",
                  paddingTop: "0px",
                  paddingBottom: "0px",
                },
              },
            }}
            muiTableHeadProps={{
              sx: {
                "& th": {
                  borderTop: "1px solid #ccc",
                  borderRight: "1px solid #ccc",
                  background: "#f4f4f4 ",
                  fontSize: "11px",
                  padding: "0px 8px",
                },
              },
            }}
          />
        ) : (
          ""
        )}
      </div>
      <br />
      <div></div>
      {openResourceNw && (
        <VendorTrendResourceTable
          data={rdata}
          colorFilter={colorFilter}
          rFormData={formData}
          tableDisplayView={"tableDisplayView"}
          headerData={headerData}
          setHeaderData={setHeaderData}
        />
      )}
      {openCustomer && (
        <DataTable
          className="primeReactDataTable toHead darkHeader"
          showGridlines
          emptyMessage="No Data Found"
          value={customerData}
          header={header}
          filters={filters}
          paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
          currentPageReportTemplate="{first} to {last} of {totalRecords}"
          paginator
          rows={25}
          rowsPerPageOptions={[10, 25, 50]}
        >
          <Column
            header="Customer Name"
            field="Customer_name"
            body={LinkTemplate}
            sortable
          />
          <Column
            header="Eng Company"
            sortable
            field="Eng_Company"
            body={EngCompany}
          />
          <Column
            header="Industry Type"
            field="Industry_Type"
            body={IndustryType}
            sortable
          />
          <Column
            header="Sales Territory"
            field="Sales_Territory"
            body={SalesTerritory}
            sortable
          />
          <Column
            header="Customer Status"
            field="Customer_status"
            body={CustomerStatus}
            sortable
          />
          <Column header="Website" field="Website" body={Website} sortable />
        </DataTable>
      )}
    </div>
  );
}
