import React, { useState, useEffect } from "react";
import { RiFileExcel2Line } from "react-icons/ri";
import * as XLSX from "xlsx";
import { AiOutlineFileSearch } from "react-icons/ai";
import { Link } from "react-router-dom";
// import "./Search.scss";
import ReactPaginate from "react-paginate";
import moment from "moment/moment";
import { Column } from "primereact/column";
import CellRendererPrimeReactDataTable from "../PrimeReactTableComponent/CellRendererPrimeReactDataTable";
import { selectClasses } from "@mui/material";
import Loader from "../Loader/Loader";
import ErrorLogTable from "../Administration/ErrorLogsTable";
import VendorSearchTable from "./VendorSearchTable";
import "../VendorComponent/Search.scss";

function SearchDefaultTable(props) {
  const {
    data,
    SetData,
    tableDataView,
    searchapidata,
    linkColumns,
    linkColumnsRoutes,
    loaderState,
    handleAbort,
    setButtonState,
    maxHeight,
  } = props;

  const [headerData, setHeaderData] = useState([]);
  const [exportData, setExportData] = useState([]);
  const [customFilters, setcustomFilters] = useState({});
  const [customFilterValue, setCustomFilterValue] = useState("");
  useEffect(() => {
    let imp = ["XLS", "PDF", "PRINT"];
    setExportData(imp);

    let ctmFlts = {
      id: "filterTable",
      type: "select",
      data: {
        0: "All",
        1: "Active",
      },
      align: "right",
      filterTable: "",
    };
    setcustomFilters(ctmFlts);
  }, []);

  document.documentElement.style.setProperty("--dynamic-value", "200px");
  useEffect(() => {
    console.log(customFilterValue);
  }, [customFilterValue]);

  useEffect(() => {
    data[0] && setHeaderData(JSON.parse(JSON.stringify(data[0])));
  }, [data]);

  const ActionAlign = (data) => {
    return <div align="center">{data.Action}</div>;
  };
  const ExpireDtAlign = (data) => {
    return (
      <div align="center" title={data.expireDt}>
        {data.expireDt}
      </div>
    );
  };
  const WebsiteToolTip = (data) => {
    return (
      <div className="ellipsis">
        {data.website === "N/A" ||
        data.website === "na" ||
        data.website === "n/a" ? (
          <span>{data.website}</span>
        ) : (
          <a
            href={data.website}
            target="_blank"
            rel="noopener noreferrer"
            title={data.website}
          >
            <span>{data.website}</span>
          </a>
        )}
      </div>
    );
  };

  const NxtRvwDtDtAlign = (data) => {
    return (
      <div
        align="center"
        title={
          moment(data.nxtRvwDt).format("DD-MMM-yyyy") == "Invalid date"
            ? "-"
            : moment(data.nxtRvwDt).format("DD-MMM-yyyy")
        }
      >
        {moment(data.nxtRvwDt).format("DD-MMM-yyyy") == "Invalid date"
          ? "-"
          : moment(data.nxtRvwDt).format("DD-MMM-yyyy")}
      </div>
    );
  };
  const SignedDtDtAlign = (data) => {
    return (
      <div align="center" title={data.signedDt}>
        {data.signedDt}
      </div>
    );
  };
  const phoneAlign = (data) => {
    return (
      <div align="right" title={data.phone}>
        {data.phone}
      </div>
    );
  };

  const VendorId = (data) => {
    return (
      <div className="ellipsis" title={data.vendorId}>
        {data.vendorId}
      </div>
    );
  };
  const contactName = (data) => {
    return (
      <div className="ellipsis" title={data.contactName}>
        {data.contactName}
      </div>
    );
  };
  const email = (data) => {
    return (
      <div className="ellipsis" title={data.email}>
        {data.email}
      </div>
    );
  };
  const contryName = (data) => {
    return (
      <div
        className="ellipsis"
        style={{ textAlign: data.contryName == "NA" ? "center" : "" }}
        title={data.contryName}
      >
        {data.contryName}
      </div>
    );
  };

  const LinkTemplate = (data) => {
    let rou = linkColumnsRoutes[0]?.split(":");
    return (
      <>
        <Link
          target="_blank"
          to={rou[0] + ":" + data[rou[1]]}
          data-toggle="tooltip"
          title={data.vendor_name}
        >
          {data[linkColumns[0]]}
        </Link>
      </>
    );
  };

  const LinkTemplateAction = (data) => {
    // setButtonState("Reviews");
    let rou = linkColumnsRoutes[1]?.split(":");
    return (
      <>
        <div align="center">
          <Link target="_blank" to={rou[0] + ":" + data[rou[1]]} ele="reviews">
            {
              <AiOutlineFileSearch
                size="14px"
                data-toggle="tooltip"
                title="Reviews"
                style={{ align: "center" }}
              />
            }
            {data[linkColumnsRoutes[1]]}
          </Link>
        </div>
      </>
    );
  };

  const dynamicColumns = Object.keys(headerData)?.map((col, i) => {
    return (
      <Column
        key={col}
        body={
          col == "phone"
            ? phoneAlign
            : col == "vendor_name"
            ? LinkTemplate
            : col == "nxtRvwDt"
            ? NxtRvwDtDtAlign
            : col == "website"
            ? WebsiteToolTip
            : col == "signedDt"
            ? SignedDtDtAlign
            : col == "vendorId"
            ? VendorId
            : col == "contactName"
            ? contactName
            : col == "email"
            ? email
            : col == "contryName"
            ? contryName
            : col == "expireDt" && ExpireDtAlign
        }
        field={col}
        header={headerData[col]}
      />
    );
  });

  return (
    <div className="Helllo">
      {loaderState ? <Loader handleAbort={handleAbort} /> : ""}
      <div className="group mb-3 customCard ">
        <VendorSearchTable
          maxHeight={maxHeight}
          data={data}
          tableDataView={tableDataView}
          linkColumns={linkColumns}
          linkColumnsRoutes={linkColumnsRoutes}
          dynamicColumns={dynamicColumns}
          headerData={headerData}
          setHeaderData={setHeaderData}
          exportData={exportData}
          rows={25}
          fileName="Vendor Search"
          //customFilters = { customFilters }
          //customFilterValue = { customFilterValue }
          //setCustomFilterValue = {setCustomFilterValue}
        />
      </div>
    </div>
  );
}

export default SearchDefaultTable;
