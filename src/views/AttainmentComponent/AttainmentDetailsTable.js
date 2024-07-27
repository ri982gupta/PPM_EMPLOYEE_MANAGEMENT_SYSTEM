import AttainmentDetails from "./AttainmentDetails.json";
import axios from "axios";
import { useEffect, useState, Fragment, useRef } from "react";
import { environment } from "../../environments/environment";
import Loader from "../Loader/Loader";

export default function AttainmentDetailsTable({
  attinmentDtlsData,
  reportRunId,
  execName,
  type,
}) {
  const baseUrl = environment.baseUrl;
  const [attainmentDetailsData, setAttainmentDetailsData] = useState({});

  const attainDetailsDataPayload = {
    executiveId: attinmentDtlsData,
    type: type,
    reportRunId: "" + reportRunId,
  };
  const [open, setOpen] = useState(false);
  const [searching, setSearching] = useState(false);
  const abortController = useRef(null);
  //----------------------call-----------------------------------

  const getAttainmentDetailsData = () => {
    setOpen(false);
    const loaderTime = setTimeout(() => {
      setSearching(true);
    }, 2000);
    abortController.current = new AbortController();

    axios({
      method: "post",
      url: baseUrl + `/SalesMS/attainment/getAttainmentDetails`,
      data: {
        executiveId: attinmentDtlsData,
        type: type,
        reportRunId: "" + reportRunId,
      },
      signal: abortController.current.signal,
    })
      .then((resp) => {
        const data = resp.data;
        setSearching(false);
        clearTimeout(loaderTime);
        setAttainmentDetailsData(data);
        setOpen(false);
        window.scrollTo({ top: 1500, behavior: "smooth" }); // Scroll to the bottom of the page
      })
      .catch((err) => {
        console.log(err);
      });
  };

  //----------------------useEffect----------------------

  useEffect(() => {
    getAttainmentDetailsData();
  }, [type, attinmentDtlsData, reportRunId]);

  const handleAbort = () => {
    abortController.current && abortController.current.abort();
    setOpen(false);
    setSearching(false);
  };
  //---------------------------logic-----------------------------

  const attainmentDtlsTableData = attainmentDetailsData.data?.map((data) => {
    const conditions = ["id"];

    if (data.name === "No Data Found^&1^&16") {
      return (
        <tr>
          <td colSpan={20} className="noTableData">
            No Data Found
          </td>
        </tr>
      );
    }
    let header = [];
    let checks = attainmentDetailsData.attainmentDtlsData;
    const keyArr = checks.split(",");

    for (let ia = 0; ia < keyArr.length; ia++) {
      let keys = keyArr[ia];

      data[keys] !== null &&
        !conditions.some((el) => keys.includes(el)) &&
        header.push(
          data.id < 0 ? (
            <th
              className={keys.split("_")[0] + " attainth"}
              key={keys}
              colSpan={data[keys].split("^&")[2]}
              rowSpan={data[keys].split("^&")[1]}
              title={data[keys].split("^&")[0]}
            >
              {data[keys].split("^&")[0]}
            </th>
          ) : (
            <td
              className={keys.split("_")[0] + " attaintd " + keys.split("_")[1]}
              key={keys}
              colSpan={data[keys].split("^&")[2]}
              rowSpan={data[keys].split("^&")[1]}
              title={data[keys]}
            >
              {keys !== "name" ? (
                <Fragment>
                  <span title={parseInt(data[keys]).toLocaleString("en-US")}>
                    {parseInt(data[keys]).toLocaleString("en-US")}
                  </span>
                </Fragment>
              ) : (
                <Fragment>
                  <span></span>
                  <span className="" title={data[keys].split("^&")[0]}>
                    {data[keys].split("^&")[0]}
                  </span>
                </Fragment>
              )}
              {keys.includes("total_service_attainPer") ||
              keys.includes("2024_Q4_service_attainPer") ||
              keys.includes("2024_Q3_service_attainPer") ||
              keys.includes("2024_Q2_service_attainPer") ||
              keys.includes("2024_Q1_service_attainPer") ? (
                <Fragment>
                  <span> %</span>
                </Fragment>
              ) : (
                ""
              )}
            </td>
          )
        );
    }
    return <tr key={data.id}>{header}</tr>;
  });

  return (
    <div className="col-lg-12 col-md-12 col-sm-12 mt10 no-padding">
      <div className="col-lg-12 col-md-12 col-sm-12 no-padding ">
        <b>
          {type == "country" ? "Country" : "Practice"} wise Attainments of{" "}
          <span style={{ color: "#297ab0" }}>{execName}</span> for Services
        </b>
      </div>
      {open ? <Loader handleAbort={handleAbort} /> : ""}
      {searching ? <Loader handleAbort={handleAbort} /> : ""}
      <div className="darkHeader">
        <table className="table table-bordered table-striped attainprogresstable ">
          <thead>{attainmentDtlsTableData}</thead>
        </table>
      </div>
    </div>
  );
}
