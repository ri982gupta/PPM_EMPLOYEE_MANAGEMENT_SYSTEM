import SoftwareSearchFilter from "./SoftwareSearchFilter";
import "./Software.scss";
import { useState } from "react";
// import TargetTable from "./TargetTable.js";
import WoWTable from "./WoWTable.js";
import ViewTable from "./ViewTable";
import { useEffect } from "react";
import axios from "axios";
import { environment } from "../../environments/environment";
import { useSelector } from "react-redux";
export default function Software() {
  const baseUrl = environment.baseUrl;
  const loggedUserId = localStorage.getItem("resId");
  const [softwareData, setSoftwareData] = useState([]);
  const [reportRunId, setreportRunId] = useState(0);
  const [tableFlag, setTableFlag] = useState();
  const [showDetails, setShowDetails] = useState(false);
  const [selector, setSelector] = useState("target");
  const [wowDisplay, setWowDisplay] = useState(false);
  const [reportId, setReportId] = useState([]);
  const [wowDate, setWOwDate] = useState([]);
  const [wowtype, setwowtype] = useState("week");
  const [viewDisplay, setViewDisplay] = useState(false);
  const [targetDataKeys, setTargetDataKeys] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [data, setData] = useState([]);
  const [headerData, setHeaderData] = useState([]);
  const [qdate, setQdate] = useState("2023-04-01");
  const [fdate, setFdate] = useState("2024-04-01");
  const [viewsalesid, setViewSlesId] = useState("");
  const reportRunIdRedux = useSelector(
    (state) => state.selectedSEState.reportRunId
  );

  return (
    <div className="col-lg-12 col-md-12 col-sm-12 no-padding">
      <SoftwareSearchFilter
        setSoftwareData={setSoftwareData}
        setWowDisplay={setWowDisplay}
        setTableFlag={setTableFlag}
        setSelector={setSelector}
        setreportRunId={setreportRunId}
        reportRunId={reportRunId}
        softwareData={softwareData}
        setTableData={setTableData}
        headerData={headerData}
        setHeaderData={setHeaderData}
        data={data}
        setData={setData}
        wowDate={wowDate}
        setWOwDate={setWOwDate}
        tableData={tableData}
        showDetails={showDetails}
        setShowDetails={setShowDetails}
        setwowtype={setwowtype}
        setTargetDataKeys={setTargetDataKeys}
        qdate={qdate}
        // VT={softwareData}
        fdate={fdate}
        setFdate={setFdate}
        setQdate={setQdate}
        setViewDisplay={setViewDisplay}
        viewDisplay={viewDisplay}
        setViewSlesId={setViewSlesId}
      />

      {selector === "wow" && wowDisplay && (
        <WoWTable
          WOW={softwareData}
          wowtype={wowtype}
          wowDate={wowDate}
          setWOwDate={setWOwDate}
        />
      )}
      {selector === "view" &&
      viewDisplay &&
      reportRunIdRedux != 0 &&
      showDetails == true ? (
        <ViewTable
          VT={softwareData}
          qdate={qdate}
          setQdate={setQdate}
          setViewDisplay={setViewDisplay}
          viewDisplay={viewDisplay}
          showDetails={showDetails}
          setShowDetails={setShowDetails}
          reportRunId={reportRunId}
          viewsalesid={viewsalesid}
        />
      ) : (
        ""
      )}
    </div>
  );
}
