import React from "react";
import { environment } from "../../environments/environment";
import { useState, useEffect } from "react";
import axios from "axios";
import "./Project.scss";
import Loader from "../Loader/Loader";
import moment from "moment/moment";

function StatusKpi(props) {
  ////////----------------------------Getting KPI data--------------------------////////
  const [Data, setData] = useState([{}]);
  const { pid, sd, ed } = props;
  const [loader, setLoader] = useState(false);
  const [legend, setLegend] = useState(true);
  const baseUrl = environment.baseUrl;
  console.log(moment(sd).format("yyyy-MM-DD"));
  console.log(ed);
  let container = document.createElement("div");

  const getData = () => {
    setLoader(false);
    axios
      .get(baseUrl + `/ProjectMS/project/kpidata?ProjectId=${pid}`)
      .then((res) => {
        const GetData = res.data;
        setData(GetData);
        setLoader(false);
      })
      .catch((error) => {
        setLoader(false);
      });
  };
  container.innerHTML = Data[0]?.currency_id;

  useEffect(() => {
    getData();
  }, [sd]);
  useEffect(() => {
    getData();
  }, [ed]);
  ////////--------------------------Getting KPI data END------------------------////////

  return (
    <div className="darkHeader">
      {loader ? <Loader /> : ""}
      <table className="table  table-bordered  display">
        <thead className="grayBg">
          <tr>
            <th width="5%" height="10px">
              {Data.map((Details) =>
                Details.var_dc < -6 ||
                Details.var_dur < -6 ||
                Details.var_efforts < -6 ||
                Details.var_margin < -6 ||
                Details.var_oc < -6 ||
                Details.var_rev < -6 ? (
                  <div className="projectStatus">
                    <span
                      className="circle red"
                      title="Atleast one indicator is red"
                    ></span>
                    <span className="circle"></span>
                    <span className="circle"></span>
                  </div>
                ) : (
                  <div className="projectStatus">
                    <span className="circle"></span>
                    <span className="circle"></span>
                    <span
                      className="circle green"
                      title="All indicators are green or Just one indicator is yellow and others are being green"
                    ></span>
                  </div>
                )
              )}
            </th>
            <th
              width="15%"
              style={{ textAlign: "center", verticalAlign: "middle" }}
            >
              KPI
            </th>
            <th
              width="8%"
              style={{ textAlign: "center", verticalAlign: "middle" }}
            >
              Contracted Value
            </th>
            <th
              width="13%"
              style={{ textAlign: "center", verticalAlign: "middle" }}
            >
              Latest Total Planned (LTP)
            </th>
            <th
              width="11%"
              style={{ textAlign: "center", verticalAlign: "middle" }}
            >
              Planned to Date (PTD)
            </th>
            <th
              width="11%"
              style={{ textAlign: "center", verticalAlign: "middle" }}
            >
              Actual to Date (ATD)
            </th>
            <th
              width="13%"
              style={{ textAlign: "center", verticalAlign: "middle" }}
            >
              Estimate To Complete (ETC)
            </th>
            <th
              width="13%"
              style={{ textAlign: "center", verticalAlign: "middle" }}
            >
              Estimate At Completion (EAC)
            </th>
            <th
              width="12%"
              style={{ textAlign: "center", verticalAlign: "middle" }}
            >
              Variance At Completion(%)
            </th>
          </tr>
        </thead>
        <tbody className="openTable">
          <tr>
            {Data.map((Details) => (
              <>
                <td height="10px">
                  {Details.var_efforts < -6 ? (
                    <div className="projectStatus">
                      <span
                        className="circle red"
                        title="variance < -6 %"
                      ></span>
                      <span className="circle"></span>
                      <span className="circle"></span>
                    </div>
                  ) : (
                    ""
                  )}
                  {Details.var_efforts <= -4 && Details.var_efforts >= -6 ? (
                    <div className="projectStatus">
                      <span className="circle"></span>
                      <span
                        className="circle amber"
                        title="variance lies between -4 to -6 %"
                      ></span>
                      <span className="circle"></span>
                    </div>
                  ) : (
                    ""
                  )}
                  {Details.var_efforts > -4 ? (
                    <div className="projectStatus">
                      <span className="circle"></span>
                      <span className="circle"></span>
                      <span
                        className="circle green"
                        title="variance > -4 %"
                      ></span>
                    </div>
                  ) : (
                    ""
                  )}
                </td>
                <td width="8%">Efforts (Hrs)</td>
                <td width="13%" id="cont_efforts">
                  <span style={{ float: "right" }}>
                    {Details.cont_efforts?.toLocaleString("en-IN")}
                  </span>
                </td>
                <td width="13%" id="pln_efforts">
                  <span style={{ float: "right" }}>
                    {Details.pln_efforts?.toLocaleString("en-IN")}
                  </span>
                </td>
                <td width="11%" id="ptd_efforts">
                  <span style={{ float: "right" }}>
                    {Details.ptd_efforts?.toLocaleString("en-IN")}
                  </span>
                </td>
                <td width="11%" id="atd_efforts">
                  <span style={{ float: "right" }}>
                    {Details.atd_efforts?.toLocaleString("en-IN")}
                  </span>
                </td>
                <td width="13%" id="etc_efforts">
                  <span style={{ float: "right" }}>
                    {Details.etc_efforts?.toLocaleString("en-IN")}
                  </span>
                </td>
                <td width="13%" id="eac_efforts">
                  <span style={{ float: "right" }}>
                    {Details.eac_efforts?.toLocaleString("en-IN")}
                  </span>
                </td>
                <td width="12%" id="var_efforts">
                  <span style={{ float: "right" }}>{Details.var_efforts}</span>
                </td>
              </>
            ))}
          </tr>
          <tr>
            {Data.map((Details) => (
              <>
                <td height="10px">
                  {Details.var_rev < -6 ? (
                    <div className="projectStatus">
                      <span
                        className="circle red"
                        title="variance < -6 %"
                      ></span>
                      <span className="circle"></span>
                      <span className="circle"></span>
                    </div>
                  ) : (
                    ""
                  )}
                  {Details.var_rev <= -4 && Details.var_rev >= -6 ? (
                    <div className="projectStatus">
                      <span className="circle"></span>
                      <span
                        className="circle amber"
                        title="variance lies between -4 to -6 %"
                      ></span>
                      <span className="circle"></span>
                    </div>
                  ) : (
                    ""
                  )}
                  {Details.var_rev > -4 ? (
                    <div className="projectStatus" title="variance > -4 %">
                      <span className="circle"></span>
                      <span className="circle"></span>
                      <span className="circle green"></span>
                    </div>
                  ) : (
                    ""
                  )}
                </td>
                <td>Revenue</td>
                <td id="cont_rev">
                  <span style={{ float: "right" }}>
                    {container.textContent == "undefined"
                      ? ""
                      : container.textContent}{" "}
                    {Details.cont_rev?.toLocaleString("en-IN")}
                  </span>
                </td>
                <td id="pln_rev">
                  <span style={{ float: "right" }}>
                    {container.textContent == "undefined"
                      ? ""
                      : container.textContent}
                    {Details.pln_rev?.toLocaleString("en-IN")}
                  </span>
                </td>
                <td id="ptd_rev">
                  <span style={{ float: "right" }}>
                    {" "}
                    {container.textContent == "undefined"
                      ? ""
                      : container.textContent}{" "}
                    {Details.ptd_rev?.toLocaleString("en-IN")}
                  </span>
                </td>
                <td id="atd_rev">
                  <span style={{ float: "right" }}>
                    {" "}
                    {container.textContent == "undefined"
                      ? ""
                      : container.textContent}{" "}
                    {Details.atd_rev?.toLocaleString("en-IN")}
                  </span>
                </td>
                <td id="etc_rev">
                  <span style={{ float: "right" }}>
                    {" "}
                    {container.textContent == "undefined"
                      ? ""
                      : container.textContent}{" "}
                    {Details.etc_rev?.toLocaleString("en-IN")}
                  </span>
                </td>
                <td id="eac_rev">
                  <span style={{ float: "right" }}>
                    {" "}
                    {container.textContent == "undefined"
                      ? ""
                      : container.textContent}{" "}
                    {Details.eac_rev}
                  </span>
                </td>
                <td id="var_rev">
                  <span style={{ float: "right" }}>{Details.var_rev}</span>
                </td>
              </>
            ))}
          </tr>
          <tr>
            {Data.map((Details) => (
              <>
                <td height="10px">
                  {Details.var_dc < -6 ? (
                    <div className="projectStatus">
                      <span
                        className="circle red"
                        title="variance < -6 %"
                      ></span>
                      <span className="circle"></span>
                      <span className="circle"></span>
                    </div>
                  ) : (
                    ""
                  )}
                  {Details.var_dc <= -4 && Details.var_dc >= -6 ? (
                    <div className="projectStatus">
                      <span className="circle"></span>
                      <span
                        className="circle amber"
                        title="variance lies between -4 to -6 %"
                      ></span>
                      <span className="circle"></span>
                    </div>
                  ) : (
                    ""
                  )}
                  {Details.var_dc > -4 ? (
                    <div className="projectStatus">
                      <span className="circle"></span>
                      <span className="circle"></span>
                      <span
                        className="circle green"
                        title="variance > -4 %"
                      ></span>
                    </div>
                  ) : (
                    ""
                  )}
                </td>
                <td>Resource Direct Cost</td>
                <td id="cont_dc">
                  <span style={{ float: "right" }}>
                    {" "}
                    {container.textContent == "undefined"
                      ? ""
                      : container.textContent}{" "}
                    {Details.cont_dc?.toLocaleString("en-IN")}
                  </span>
                </td>
                <td id="pln_dc">
                  <span style={{ float: "right" }}>
                    {" "}
                    {container.textContent == "undefined"
                      ? ""
                      : container.textContent}{" "}
                    {Details.pln_dc?.toLocaleString("en-IN")}
                  </span>
                </td>
                <td id="ptd_dc">
                  <span style={{ float: "right" }}>
                    {" "}
                    {container.textContent == "undefined"
                      ? ""
                      : container.textContent}{" "}
                    {Details.ptd_dc?.toLocaleString("en-IN")}
                  </span>
                </td>
                <td id="atd_dc">
                  <span style={{ float: "right" }}>
                    {" "}
                    {container.textContent == "undefined"
                      ? ""
                      : container.textContent}{" "}
                    {Details.atd_dc?.toLocaleString("en-IN")}
                  </span>
                </td>
                <td id="etc_dc">
                  <span style={{ float: "right" }}>
                    {" "}
                    {container.textContent == "undefined"
                      ? ""
                      : container.textContent}{" "}
                    {Details.etc_dc?.toLocaleString("en-IN")}
                  </span>
                </td>
                <td id="eac_dc">
                  <span style={{ float: "right" }}>
                    {" "}
                    {container.textContent == "undefined"
                      ? ""
                      : container.textContent}{" "}
                    {Details.eac_dc?.toLocaleString("en-IN")}
                  </span>
                </td>
                <td id="var_dc">
                  <span style={{ float: "right" }}> {Details.var_dc}</span>
                </td>
              </>
            ))}
          </tr>
          <tr>
            {Data.map((Details) => (
              <>
                <td height="10px">
                  {Details.var_oc < -6 ? (
                    <div className="projectStatus">
                      <span
                        className="circle red"
                        title="variance < -6 %"
                      ></span>
                      <span className="circle"></span>
                      <span className="circle"></span>
                    </div>
                  ) : (
                    ""
                  )}
                  {Details.var_oc <= -4 && Details.var_oc >= -6 ? (
                    <div className="projectStatus">
                      <span className="circle"></span>
                      <span
                        className="circle amber"
                        title="variance lies between -4 to -6 %"
                      ></span>
                      <span className="circle"></span>
                    </div>
                  ) : (
                    ""
                  )}
                  {Details.var_oc > -4 ? (
                    <div className="projectStatus">
                      <span className="circle"></span>
                      <span className="circle"></span>
                      <span
                        className="circle green"
                        title="variance > -4 %"
                      ></span>
                    </div>
                  ) : (
                    ""
                  )}
                </td>
                <td>Other Direct Cost</td>
                <td id="cont_oc">
                  {" "}
                  <span style={{ float: "right" }}>
                    {" "}
                    {container.textContent == "undefined"
                      ? ""
                      : container.textContent}{" "}
                    {Details.cont_oc?.toLocaleString("en-IN")}
                  </span>
                </td>
                <td id="pln_oc">
                  {" "}
                  <span style={{ float: "right" }}>
                    {" "}
                    {container.textContent == "undefined"
                      ? ""
                      : container.textContent}{" "}
                    {Details.pln_oc?.toLocaleString("en-IN")}
                  </span>
                </td>
                <td id="ptd_oc">
                  {" "}
                  <span style={{ float: "right" }}>
                    {" "}
                    {container.textContent == "undefined"
                      ? ""
                      : container.textContent}{" "}
                    {Details.ptd_oc?.toLocaleString("en-IN")}
                  </span>
                </td>
                <td id="atd_oc">
                  <span style={{ float: "right" }}>
                    {" "}
                    {container.textContent == "undefined"
                      ? ""
                      : container.textContent}{" "}
                    {Details.atd_oc?.toLocaleString("en-IN")}
                  </span>
                </td>
                <td id="etc_oc">
                  <span style={{ float: "right" }}>
                    {" "}
                    {container.textContent == "undefined"
                      ? ""
                      : container.textContent}{" "}
                    {Details.etc_oc?.toLocaleString("en-IN")}
                  </span>
                </td>
                <td id="eac_oc">
                  <span style={{ float: "right" }}>
                    {" "}
                    {container.textContent == "undefined"
                      ? ""
                      : container.textContent}{" "}
                    {Details.eac_oc?.toLocaleString("en-IN")}
                  </span>
                </td>
                <td id="var_oc">
                  <span style={{ float: "right" }}>{Details.var_oc}</span>
                </td>
              </>
            ))}
          </tr>
          <tr>
            {Data.map((Details) => (
              <>
                <td height="10px">
                  {Details.var_margin < -6 ? (
                    <div className="projectStatus">
                      <span
                        className="circle red"
                        title="variance < -6 %"
                      ></span>
                      <span className="circle"></span>
                      <span className="circle"></span>
                    </div>
                  ) : (
                    ""
                  )}
                  {Details.var_margin <= -4 && Details.var_margin >= -6 ? (
                    <div className="projectStatus">
                      <span className="circle"></span>
                      <span
                        className="circle amber"
                        title="variance lies between -4 to -6 %"
                      ></span>
                      <span className="circle"></span>
                    </div>
                  ) : (
                    ""
                  )}
                  {Details.var_margin > -4 ? (
                    <div className="projectStatus">
                      <span className="circle"></span>
                      <span className="circle"></span>
                      <span
                        className="circle green"
                        title="variance > -4 %"
                      ></span>
                    </div>
                  ) : (
                    ""
                  )}
                </td>
                <td>Project Margin (%)</td>
                <td id="cont_margin">
                  <span style={{ float: "right" }}>
                    {Details.cont_margin?.toLocaleString("en-IN")}
                  </span>
                </td>
                <td id="pln_margin">
                  <span style={{ float: "right" }}>
                    {Details.pln_margin?.toLocaleString("en-IN")}
                  </span>
                </td>
                <td id="ptd_margin">
                  <span style={{ float: "right" }}>
                    {Details.ptd_margin?.toLocaleString("en-IN")}
                  </span>
                </td>
                <td id="atd_margin">
                  <span style={{ float: "right" }}>
                    {Details.atd_margin?.toLocaleString("en-IN")}
                  </span>
                </td>
                <td id="etc_margin">
                  <span style={{ float: "right" }}>
                    {Details.etc_margin?.toLocaleString("en-IN")}
                  </span>
                </td>
                <td id="eac_margin">
                  <span style={{ float: "right" }}>
                    {Details.eac_margin?.toLocaleString("en-IN")}
                  </span>
                </td>
                <td id="var_margin">
                  <span style={{ float: "right" }}>{Details.var_margin}</span>
                </td>
              </>
            ))}
          </tr>
          <tr>
            {Data.map((Details) => (
              <>
                <td height="10px">
                  {Details.var_dur < -6 ? (
                    <div className="projectStatus">
                      <span
                        className="circle red"
                        title="variance < -6 %"
                      ></span>
                      <span className="circle"></span>
                      <span className="circle"></span>
                    </div>
                  ) : (
                    ""
                  )}
                  {Details.var_dur <= -4 && Details.var_dur >= -6 ? (
                    <div className="projectStatus">
                      <span className="circle"></span>
                      <span
                        className="circle amber"
                        title="variance lies between -4 to -6 %"
                      ></span>
                      <span className="circle"></span>
                    </div>
                  ) : (
                    ""
                  )}
                  {Details.var_dur > -4 ? (
                    <div className="projectStatus">
                      <span className="circle"></span>
                      <span className="circle"></span>
                      <span
                        className="circle green"
                        title="variance > -4 %"
                      ></span>
                    </div>
                  ) : (
                    ""
                  )}
                </td>
                <td>Duration (Days)</td>
                <td id="cont_dur">
                  <span style={{ float: "right" }}>
                    {Details.cont_dur?.toLocaleString("en-IN")}
                  </span>
                </td>
                <td id="pln_dur">
                  <span style={{ float: "right" }}>
                    {Details.pln_dur?.toLocaleString("en-IN")}
                  </span>
                </td>
                <td id="ptd_dur">
                  <span style={{ float: "right" }}>
                    {Details.ptd_dur?.toLocaleString("en-IN")}
                  </span>
                </td>
                <td id="atd_dur">
                  <span style={{ float: "right" }}>
                    {Details.atd_dur?.toLocaleString("en-IN")}
                  </span>
                </td>
                <td id="etc_dur">
                  <span style={{ float: "right" }}>
                    {Details.etc_dur?.toLocaleString("en-IN")}
                  </span>
                </td>
                <td id="eac_dur">
                  <span style={{ float: "right" }}>
                    {Details.eac_dur?.toLocaleString("en-IN")}
                  </span>
                </td>
                <td id="var_dur">
                  <span style={{ float: "right" }}>{Details.var_dur}</span>
                </td>
              </>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
}
export default StatusKpi;
