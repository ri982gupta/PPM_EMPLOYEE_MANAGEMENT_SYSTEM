import React, { useState, useEffect } from "react";

import DatePicker from "react-datepicker";
import FlatPrimeReactTable from "../PrimeReactTableComponent/FlatPrimeReactTable";
import { getTableData } from "./UploadRoleCostTable";

import "primeicons/primeicons.css";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.css";
import "primeflex/primeflex.css";
import axios from "axios";
import { Column } from "primereact/column";

import CellRendererPrimeReactDataTable from "../PrimeReactTableComponent/CellRendererPrimeReactDataTable";
import moment from "moment";
import { ImCross, ImDownload3, ImUpload3 } from "react-icons/im";
import { FaFileAlt } from "react-icons/fa";
import { environment } from "../../environments/environment";

function UploadRoleCost() {
  const [startDate, setStartDate] = useState(new Date());
  const [tableData, setTableData] = useState([]);
  const [dataAr, setDataAr] = useState([]);
  const [data, setData] = useState([]);
  const [headerData, setHeaderData] = useState([]);
  const baseUrl = environment.baseUrl;

  let rows = 10;

  const getData = () => {
    axios
      .get(baseUrl + `/administrationms/roleCosts/getUploadRoleCosts`)
      .then((res) => {
        const GetData = res.data;

        let dataHeader = [
          {
            date_created: "Uploaded Date",
            Name: "Uploaded By",
            file_name: "File",
            typ_status_id: "Status",
          },
        ];
        setData(dataHeader.concat(GetData));
      });
  };

  useEffect(() => {
    data[0] && setHeaderData(JSON.parse(JSON.stringify(data[0])));
  }, [data]);

  const CreatedDate = (data) => {
    return (
      <div
        className="ellipsis"
        align="left"
        data-toggle="tooltip"
        title={moment(data.date_created).format("DD-MM-yyyy HH:mm:ss")}
      >
        {data.date_created == null
          ? ""
          : data.date_created == ""
          ? ""
          : moment(data.date_created).format("DD-MM-yyyy HH:mm:ss")}
      </div>
    );
  };

  const UploadedBy = (data) => {
    return (
      <div
        className="ellipsis"
        align="left"
        data-toggle="tooltip"
        title={data.Name}
      >
        {data.Name == null ? "" : data.Name == "" ? "" : data.Name}
      </div>
    );
  };

  const FileName = (data) => {
    return (
      <div
        className="ellipsis"
        align="left"
        data-toggle="tooltip"
        title={data.file_name}
      >
        {data.file_name == null
          ? ""
          : data.file_name == ""
          ? ""
          : data.file_name}
      </div>
    );
  };

  const Status = (data) => {
    return (
      <div
        className="ellipsis"
        align="left"
        data-toggle="tooltip"
        title={
          data.typ_status_id == null
            ? ""
            : data.typ_status_id == ""
            ? ""
            : data.typ_status_id == 962
            ? "Success"
            : data.typ_status_id == 963
            ? "Failed"
            : data.typ_status_id == 964
            ? "Partial Success"
            : ""
        }
      >
        {data.typ_status_id == null
          ? ""
          : data.typ_status_id == ""
          ? ""
          : data.typ_status_id == 962
          ? "Success"
          : data.typ_status_id == 963
          ? "Failed"
          : data.typ_status_id == 964
          ? "Partial Success"
          : ""}
      </div>
    );
  };

  const dynamicColumns = Object.keys(headerData)?.map((col, i) => {
    return (
      <Column
        sortable
        key={col}
        body={
          col == "date_created"
            ? CreatedDate
            : col == "typ_status_id"
            ? Status
            : col == "Name"
            ? UploadedBy
            : col == "file_name"
            ? FileName
            : ""
        }
        field={col}
        header={headerData[col]}
      />
    );
  });

  const [file, setFile] = useState(null);
  function handleFileChange(event) {
    setFile(event.target.files[0]);
  }

  function handleReset() {
    setFile(null);
    // reset the value of the input element
    document.getElementById("file-input").value = "";
  }

  useEffect(() => {
    getData();
  }, []);

  return (
    <div>
      <div className="col-md-12">
        <div className="pageTitle">
          <div className="childOne"></div>
          <div className="childTwo">
            <h2>Upload Role Costs</h2>
          </div>
          <div className="childThree"></div>
        </div>
      </div>
      <div className="group mb-3 customCard px-2 py-3">
        <div className="row">
          <div className="col-md-4 mb-2">
            <div className="form-group row">
              <label className="col-5" htmlFor="frommonth">
                From Month <span className="required error-text">*</span>
              </label>
              <span className="col-1 p-0">:</span>
              <div className="col-6">
                <DatePicker
                  selected={startDate}
                  onChange={(date) => setStartDate(date)}
                  dateFormat="MMM-yyyy"
                  showMonthYearPicker
                />
              </div>
            </div>
          </div>
          <div className=" col-md-4 mb-2">
            <div className="form-group row">
              <label className="col-4" htmlFor="uploadfile">
                Upload File <span className="required error-text">*</span>
              </label>
              <span className="col-1 p-0">:</span>
              <div className="col-7">
                <input
                  type="file"
                  className="fileUpload form-control"
                  id="uploadfile"
                  placeholder
                  required
                  onChange={handleFileChange}
                />
              </div>
            </div>
          </div>
          <div className="col-md-4 mb-2 ">
            <button type="submit" className="btn btn-primary float-end">
              <ImDownload3 /> Download Template
            </button>
          </div>
        </div>
        <div className="btn-container center mt-2">
          <button type="submit" className="btn btn-primary">
            <FaFileAlt />
            Review
          </button>
          <button type="submit" className="btn btn-primary">
            <ImUpload3 /> Upload
          </button>
          <button type="reset" className="btn btn-light" onClick={handleReset}>
            <ImCross /> Cancel
          </button>
        </div>
      </div>
      <div className="col-md-12">
        <div className="pageTitle">
          <div className="childOne">
            <h2>Uploaded History</h2>
          </div>
          <div className="childTwo"></div>
          <div className="childThree"></div>
        </div>
      </div>
      <div className="col-md-12">
        <CellRendererPrimeReactDataTable
          data={data}
          // linkColumns={linkColumns}
          // linkColumnsRoutes={linkColumnsRoutes}
          dynamicColumns={dynamicColumns}
          headerData={headerData}
          setHeaderData={setHeaderData}
          rows={rows}
        />
      </div>
    </div>
  );
}

export default UploadRoleCost;
