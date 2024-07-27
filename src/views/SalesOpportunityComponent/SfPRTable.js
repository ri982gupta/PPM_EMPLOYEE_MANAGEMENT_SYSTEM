import axios from "axios";
import { useEffect, useState, Fragment, useRef } from "react";
import { environment } from "../../environments/environment";
import Loader from "../Loader/Loader";

export default function SfPRTable({ salesOppoId, type, reportRunId }) {
  const [sfData, setSfData] = useState([]);
  const abortController = useRef(null);
  const [open, setOpen] = useState(false);
  const [displayTable, setDisplayTable] = useState(null);

  const baseUrl = environment.baseUrl;

  const getSfData = () => {
    const loaderTime = setTimeout(() => {
      setOpen(true);
    }, 2000);
    abortController.current = new AbortController();

    axios({
      method: "post",
      url: baseUrl + `/SalesMS/sales/getSFOppPRs`,
      data: {
        oppId: type,
        reportRunId: reportRunId,
      },
    }).then((resp) => {
      const data = resp.data;
      setSfData(data);
      clearTimeout(loaderTime);
      setOpen(false);
      window.scrollTo({ top: 1500, behavior: "smooth" });
    });
  };

  useEffect(() => {
    getSfData();
  }, [type, reportRunId]);

  const handleAbort = () => {
    abortController.current && abortController.current.abort();
    setOpen(false);
  };
  useEffect(() => {
    displayTableData();
  }, [sfData]);

  const array = [
    "pr_id",
    "startDate",
    "closedDate",
    "prLocation",
    "amount",
    "isProspect",
    "lvl",
    "id",
  ];
  const newArray = sfData?.sfBuckets?.map((item) => {
    let k = JSON.parse(JSON.stringify(item, array, 4));
    return k;
  });

  const displayTableData = () => {
    setDisplayTable(() => {
      return newArray?.map((objData, index) => {
        let tabData = [];
        let noRecord = ["No Record Found"];

        Object.keys(objData).forEach((key, nestedIndex) => {
          let unWantedCols = ["id", "lvl", "isProspect"];
          if (parseInt(objData.id) === -2 && unWantedCols.indexOf(key) === -1) {
            let val = objData[key].split("^&");
            tabData.push(
              <th
                style={{
                  textAlign: "center",
                  position: "sticky",
                  top: 0,
                  background: "white",
                  zIndex: 1,
                }}
                className="fs10"
              >
                <div style={{ fontSize: "12px", textAlign: "left" }}></div>
                <span
                  className="ellipsistd"
                  style={{ fontSize: "12px" }}
                  title={val[0]}
                >
                  {val[0]}
                </span>
              </th>
            );
          } else if (
            parseInt(objData.id) === -1 &&
            unWantedCols.indexOf(key) === -1
          ) {
            objData[key] &&
              tabData.push(
                <th className="fs10" style={{ fontSize: "12px" }}>
                  {objData[key]}
                </th>
              );
          } else if (
            parseInt(objData.id) > 0 &&
            unWantedCols.indexOf(key) === -1 &&
            key.includes("amount")
          ) {
            tabData.push(
              <td>
                <div
                  className="fs10 ellipsistd"
                  style={{ fontSize: "12px", textAlign: "center" }}
                  title={Math.floor(objData[key]).toLocaleString()}
                >
                  {Math.floor(objData[key]).toLocaleString()}
                </div>
              </td>
            );
          } else if (
            parseInt(objData.id) > 0 &&
            unWantedCols.indexOf(key) === -1
          ) {
            tabData.push(
              <td>
                <div
                  className="fs10 ellipsistd"
                  style={{ fontSize: "12px", textAlign: "center" }}
                  title={objData[key]}
                >
                  {objData[key]}
                </div>
              </td>
            );
          } else if (
            index == 1 &&
            newArray.length == 2 &&
            unWantedCols.indexOf(key) === -1
          )
            if (tabData.length === 0) {
              tabData.push(
                <td style={{ textAlign: "center" }} colSpan={5}>
                  No Data Found
                </td>
              );
            }
        });
        return (
          <>
            <tr key={index}>{tabData}</tr>
          </>
        );
      });
    });
  };
  return (
    <div className="col-lg-12 col-md-12 col-sm-12 mt10 no-padding">
      {open ? <Loader handleAbort={handleAbort} /> : ""}
      <div
        className="col-lg-12 col-md-12 col-sm-12 no-padding attainTablePrnt scrollit darkHeader"
        style={{ overflow: "auto", maxHeight: "300px", width: "50%" }}
      >
        <table className="table table-bordered table-striped attainTable ">
          <thead>{displayTable}</thead>
        </table>
      </div>
    </div>
  );
}
