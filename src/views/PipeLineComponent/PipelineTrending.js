import TableRenderer from "./TableRenderer";
import SearchFilters from "./SearchFilters";
import { useState, useEffect } from "react";
import { environment } from "../../environments/environment";
import axios from "axios";
import "./PipelineTrending.scss";

export default function PipelineTrending() {
  const baseUrl = environment.baseUrl;
  const [pipeLineTrendingData, setpipeLineTrendingData] = useState([]);
  const [reportRunId, setreportRunId] = useState(0);
  const [monthlyResourceData, setmonthlyResourceData] = useState([]);
  const [progressReportData, setProgressReportData] = useState("");
  const loggedUserId = localStorage.getItem("resId");
  const [pipelinePermission, setPipelinePermission] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [popDate, setPopDate] = useState("2023-05-01");
  const [viewDataNew, setViewDataNew] = useState("se");

  let typeSelector = "";


  return (
    <>
      <div className="col-lg-12 col-md-12 col-sm-12 no-padding">
        <SearchFilters
          setpipeLineTrendingData={setpipeLineTrendingData}
          setreportRunId={setreportRunId}
          setmonthlyResourceData={setmonthlyResourceData}
          monthlyResourceData={monthlyResourceData}
          typeSelector={typeSelector}
          setProgressReportData={setProgressReportData}
          pipelinePermission={pipelinePermission}
          progressReportData={progressReportData}
          popDate={popDate}
          setPopDate={setPopDate}
          refresh={refresh}
          setRefresh={setRefresh}
          viewDataNew={viewDataNew}
          // searching={searching}
          // setsearching={setsearching}
          // controller={controller}
        />
        <TableRenderer
          pipeLineTrendingData={pipeLineTrendingData}
          reportRunId={reportRunId}
          setmonthlyResourceData={setmonthlyResourceData}
          monthlyResourceData={monthlyResourceData}
          pipelinePermission={pipelinePermission}
          typeSelector={typeSelector}
          setProgressReportData={setProgressReportData}
          progressReportData={progressReportData}
          popDate={popDate}
          refresh={refresh}
          setRefresh={setRefresh}
          viewDataNew={viewDataNew}
          setPopDate={setPopDate}
        />
      </div>
    </>
  );
}
