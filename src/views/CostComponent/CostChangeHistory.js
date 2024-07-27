import React, { useEffect, useRef, useState } from "react";
import { CModal } from "@coreui/react";
import { CModalBody } from "@coreui/react";
import { CModalHeader } from "@coreui/react";
import { CModalTitle } from "@coreui/react";
import "./CostCss.scss";
import { GrFormView } from "react-icons/gr";
import { IconButton } from "@mui/material";
import moment from "moment";

function CostChangeHistory(props) {
  const {
    costChangeHistoryPopUp,
    setCostChangeHistoryPopUp,
    costHistoryChangeData,
  } = props;

  const [displayData, setDisplayData] = useState(null);

  const costId = useRef(null);
  const viewAllState = useRef(false);

  useEffect(() => {
    handleDisplayData();
  }, []);

  const [seconds, setSeconds] = useState(30);
  const [minutes, setMinutes] = useState(0);
  const [displayTimer, setDisplayTimer] = useState("hide");

  var timer;

  useEffect(() => {
    timer = setInterval(() => {
      setSeconds((prevVal) => prevVal - 1);
      if (seconds === 0) {
        setMinutes((prevVal) => prevVal + 1);
      }
    }, 1000);

    if (seconds === 0) {
      setDisplayTimer("hide");
      costId.current = null;
      viewAllState.current = false;
      handleDisplayData();
      return () => clearInterval(timer);
    }

    return () => clearInterval(timer);
  }, [seconds]);

  const restart = () => {
    setDisplayTimer("show");
    setSeconds(30);
    setMinutes(0);
  };

  const stop = () => {
    setDisplayTimer("hide");
    clearInterval(timer);
  };

  const showCostHandler = (index) => {
    if (costId.current == index) {
      costId.current = null;
      stop();
    } else {
      costId.current = index;
      restart();
    }
    handleDisplayData();
  };

  const handleDisplayData = () => {
    setDisplayData(() => {
      let headers = [
        "updated_emp",
        "created_by_name",
        "created_dt",
        "cost_value",
      ];
      return costHistoryChangeData.length !== 0 ? (
        costHistoryChangeData.map((data, index) => {
          let dat = [];
          headers.forEach((ele, innerIndex) => {
            if (innerIndex == 0) {
              dat.push(
                <td>
                  <span className="serail-num center">{index + 1}</span>
                </td>
              );
              dat.push(<td>{data[ele]}</td>);
            } else if (innerIndex == headers.length - 2) {
              dat.push(
                <td id={innerIndex}>
                  <span className="date center">
                    {moment(data[ele]).format("DD-MM-YYYY")}
                  </span>
                </td>
              );
            } else if (innerIndex == headers.length - 1) {
              dat.push(
                <td id={innerIndex}>
                  <span className="amount">
                    {" "}
                    {costId.current == null && viewAllState.current == false
                      ? "******"
                      : costId.current == index || viewAllState.current == true
                      ? data[ele]
                      : "******"}
                  </span>
                  <span>$</span>
                </td>
              );
              dat.push(
                <td>
                  {
                    <span className="view-icon-btn center">
                      {" "}
                      <IconButton
                        title="View"
                        style={{ height: "1px" }}
                        onClick={() => {
                          showCostHandler(index);
                        }}
                      >
                        <GrFormView />
                      </IconButton>
                    </span>
                  }
                </td>
              );
            } else {
              dat.push(<td>{data[ele]}</td>);
            }
          });
          return <tr key={index}>{dat}</tr>;
        })
      ) : (
        <tr>
          <td colSpan={"5"} align="center">
            No Data Found
          </td>
        </tr>
      );
    });
  };

  const viewAllHandler = () => {
    if (viewAllState.current == true) {
      viewAllState.current = false;
      stop();
    } else {
      viewAllState.current = true;
      restart();
    }
    handleDisplayData();
  };

  return (
    <div>
      <CModal
        size="xl"
        visible={costChangeHistoryPopUp}
        onClose={() => setCostChangeHistoryPopUp(false)}
      >
        <CModalHeader className="hgt22">
          <CModalTitle>
            <span className="ft16">Cost History</span>
          </CModalTitle>
        </CModalHeader>
        <CModalBody>
          <div className="col-md-12 maskTimer-showall-btn-container">
            <>
              {" "}
              {displayTimer == "show" ? (
                <div className="maskTimer">
                  <label>Mask Time :</label>
                  <span>
                    {minutes < 10 ? "0" + minutes : minutes}:
                    {seconds < 10 ? "0" + seconds : seconds}
                  </span>
                </div>
              ) : (
                ""
              )}
            </>
            {costHistoryChangeData.length > 0 ? (
              <div>
                <button
                  className="btn btn-primary"
                  onClick={() => {
                    viewAllHandler();
                  }}
                >
                  Show All
                </button>
              </div>
            ) : (
              ""
            )}
          </div>
          <div className="col-md-12">
            <table
              className="table table-bordered table-striped cost-history-pop-table darkHeader"
              style={{ width: "100%" }}
            >
              <thead>
                <tr className="headerSticky " align="center">
                  <th>S.No</th>
                  <th>Resource Name</th>
                  <th>Changed By</th>
                  <th>Created Date</th>
                  <th>Cost Value</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>{displayData}</tbody>
            </table>
          </div>
        </CModalBody>
      </CModal>
    </div>
  );
}

export default CostChangeHistory;
