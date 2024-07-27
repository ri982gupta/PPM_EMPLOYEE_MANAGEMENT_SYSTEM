import React, { useState, useEffect } from 'react'
// import "../FullfimentComponent/ResourceTrending.scss"
import ResourceOverviewPopover from './ResourceOverviewPopover';
import { FaInfoCircle } from 'react-icons/fa';
import './ResourceTrending.scss'


export default function ResourceTrendingDisplayTable(props) {
  const { tableData, column, maxHeight1 } = props;
  const [infoMessage, setInfoMessage] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const [totaldata, setTotaldata] = useState(null);


  const filteredData = tableData?.data?.map((element) => {
    const { kpi_id, ...rest } = element;
    if (kpi_id !== -1 && kpi_id !== '#') {
      return { ...rest };
    }
    return element;
  });
  document.documentElement.style.setProperty(
    "--dynamic-value",
    String(maxHeight1 -33) + "px"
  );


  const handleInfoClick = (kpi) => {
    console.log(kpi);
    const cleanedKpi = kpi.replace(/<\/?span.*?>/gi, "");
    console.log(cleanedKpi);
    let message = "";
    if (cleanedKpi.includes("Total Resources")) {
      message = "=Sum(Employee+Contractors)";
    } else if (cleanedKpi.includes("Total Overhead")) {
      message = "=Sum(Org Overhead+Delivery Overhead)";
    } else if (cleanedKpi.includes("Total Billable Resources ")) {
      message = "=Total resources-(Total Overhead+Gardening leave)";
    } else if (cleanedKpi.includes("Enablement")) {
      message =
        "*Head Count  is combination of Billable & Non Billable Resources";
    } else if (cleanedKpi.includes("Serving Notice Period")) {
      message =
        "=Billable+NBL on projects+Bench (Zero Allocation)+Gardening Leave+Org Overhead+Delivery Overhead";
    } else if (
      cleanedKpi.includes("Deployable Bench - Actual") ||
      cleanedKpi.includes("Deployable Bench (Resource Type)")
    ) {
      message =
        "= NBL on projects+Bench (Zero Allocation)+Innovation+Partial Bench";
    } else {
      message = "No information available for this KPI.";
    }
    setInfoMessage(message);
  };

  const handleClose = () => {
    setAnchorEl(false);
  };
  return (
    <div>
      <b style={{ color: "#297ab0", fontSize: "15px" }}> HC Overview </b>
      <div className="darkHeaders ResourceTrendingDisplayTable">

        <table  className="table table-bordered table-striped col-6 htmlTable RTHeading">
          <tbody>
            {column.length > 0 && filteredData?.map((element, index) => {
              let tabData = []
              column.forEach((inEle, columnIndex) => {
                let temp = element[inEle];
                let data = null;
                if (temp != -1 && element.kpi_id == -1 && temp?.includes("^&")) {
                  data = (element[inEle]).split("^&");
                } else if ((temp == "#")) {
                  (element[inEle]) = "";
                } else if ((element.kpi_id === 0 && temp === 0)) {
                  (element[inEle]) = "";
                }
                else {
                  data = element[index];

                }
                if (element.kpi_id === -1) {
                  tabData.push(
                    data?.length > 0 ? <th className='monthClassName' style={{
                      verticalAlign: "middle", textAlign: "center", minWidth: columnIndex != 1 && "90px"
                    }}
                      colspan={columnIndex === 1 ? 1 : 2} rowspan={temp === "Resource Category^&0^&2" ? "2" : ""}> {data?.length > 0 ? (data[0]) : data}</th> : null
                  );
                } else if (element.kpi === "" && element[inEle] !== "") {
                  tabData.push(
                    <th className='FteCntClsName' title={element[inEle]}>{element[inEle]}</th>
                  );
                }

                else
                  if (element[inEle]) {

                    const backgroundColor =
                      index > 1 && columnIndex > 1 &&
                      (Math.floor(columnIndex / 2) % 2 === 0
                        ? columnIndex % 2 === 0
                          ? "#F3D6D6 "
                          : "#F3D6D6"
                        : columnIndex % 2 === 0
                          ? "#BFF5F5"
                          : "#BFF5F5");
                    // parseInt(data[keys]).toLocaleString("en-US")}
                    tabData.push(
                      <td style={{ backgroundColor, textAlign: index > 1 && columnIndex > 1 ? "right" : "left" }} ><span dangerouslySetInnerHTML={{ __html: parseInt(element[inEle]).toLocaleString("en-US") == "NaN" ? element[inEle] : parseInt(element[inEle]).toLocaleString("en-US") }} />
                        {(element.kpi.includes("Total Resources") ||
                          element.kpi.includes("Total Overhead") ||
                          element.kpi.includes("Total Billable Resources") ||
                          element.kpi.includes("Enablement") ||
                          element.kpi.includes("Serving Notice Period") ||
                          element.kpi.includes("Deployable Bench - Actual") ||
                          element.kpi.includes(
                            "Deployable Bench (Resource Type)"
                          )) &&
                          columnIndex === 1 && (
                            <FaInfoCircle
                              className="tableInfoIcon"
                              onClick={(e) => {
                                handleInfoClick(element.kpi);
                                setTotaldata(element.kpi);
                                setAnchorEl(e.currentTarget);
                              }}
                            />
                          )}



                      </td>
                    );
                  }
              }
              );

              return <tr key={index} >{tabData}</tr>
            })}
          </tbody>
        </table>
      </div>
      {anchorEl && (
        <ResourceOverviewPopover
          handleClose={handleClose}
          anchorEl={anchorEl}
          infoMessage={infoMessage}
        />
      )}
    </div>

  );

}
