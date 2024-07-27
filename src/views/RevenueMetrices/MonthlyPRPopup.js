import React, { useEffect, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import Tooltip from "@mui/material/Tooltip";

export default function MonthlyPRPopup(props) {
  const { actionItems, Pname, close, setOpenPopup } = props;
  const [filteredData, setFilteredData] = useState([]);
  const [headers, setHeaders] = useState([]);
  console.log("actionItems................", actionItems);
  const closeHandler = () => {
    setOpenPopup(false);
  };

  useEffect(() => {
    setHeaders(actionItems);
    if (actionItems.length > 1) {
      setFilteredData(actionItems);
    } else {
      setFilteredData([]);
    }
  }, [actionItems]);

  const open = Boolean(close);
  const id = open ? "simple-popover" : undefined;
  const h = actionItems[0];
  console.log(h);
  const obj = [];
  const orderedKeys = [
    "project",
    "customer",
    "itemdate",
    "entryDt",
    "entryBy",
    "comments",
  ];

  for (let key of orderedKeys) {
    if (h && h.hasOwnProperty(key)) {
      obj.push({ field: key, header: h[key] });
    }
  }

  const renderTooltip = (rowData, column) => {
    const value = rowData[column.field];
    console.log("value>>>>>>>>>>>>>>>", value);
    return (
      <Tooltip title={value} arrow>
        <div
          style={{
            overflow: "hidden",
            whiteSpace: "nowrap",
            textOverflow: "ellipsis",
          }}
        >
          {value}
        </div>
      </Tooltip>
    );
  };
  const columns = [
    { field: "project", header: "Project" },
    { field: "customer", header: "Customer" },
    { field: "itemdate", header: "Itemdate" },
    { field: "entryBy", header: "EntryBy" },
    { field: "entryDt", header: "EntryDt" },
    { field: "comments", header: "Comments" },
    // { field: 'id', header: 'id' },
  ];

  return (
    <div className="col-8 mt-5">
      {
        <div style={{ width: "810px", height: "115px" }}>
          <div
            className="col-md-12 header padding"
            style={{ border: "1px solid #ddd", marginTop: "10px" }}
          >
            <span
              align="center"
              style={{ fontSize: "13px", top: "250px", color: "#2E88C5" }}
            >
              {Pname}
            </span>
            <button
              title="Close"
              style={{
                float: "right",
                height: "33px",
                width: "23px",
              }}
              className="button1"
              onClick={closeHandler}
            >
              x
            </button>
          </div>
          <div className="darkHeader">
            <DataTable
              showGridlines
              style={{ fontSize: "12px" }}
              value={actionItems}
              emptyMessage="No Records found."
            >
              {/* {obj.map((col, i) => (
                            <Column key={col.field} field={col.field} header={col.header} body={renderTooltip} />
                        ))} */}

              {columns.map((col, i) => (
                <Column key={col.field} field={col.field} header={col.header} />
              ))}
            </DataTable>
          </div>
        </div>
      }
    </div>
  );
}
