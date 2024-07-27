import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaSave } from "react-icons/fa";
import { Close } from "@mui/icons-material";
import { environment } from "../../environments/environment";
import moment from "moment";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { AiFillWarning } from "react-icons/ai";
import Loader from "../Loader/Loader";
import useDynamicMaxHeight from "../PrimeReactTableComponent/useDynamicMaxHeight";
import "./ResourceApprovals.scss"


function ResourceApprovals(props) {
  const {
    grp3Items,
    urlState,
    setUrlState,
    bottonstate,
    setButtonState,
    grp1Items,
    grp2Items,
    grp4Items,
    grp6Items,
    projectId,
  } = props;
  const [data, setData] = useState([]);
  const [customerDatarole, setcustomerDatarole] = useState([]);
  const [prjName, setPrjName] = useState([]);
  const [display, setDisplay] = useState([]);
  const [successfullymsg, setSuccessfullymsg] = useState(false);
  const [state, setState] = useState("Approved");
  const [ValidationMsg, setValidationMsg] = useState(false);
  const [rejectmsg, setrejectMsg] = useState(false);
  const [checkboxSelect, setCheckboxSelect] = useState(false);
  // const [loaderState, setLoaderState] = useState(false);
  const baseUrl = environment.baseUrl;

  const materialTableElement = document.getElementsByClassName(
    "childOne"
  );

  const maxHeight1 = useDynamicMaxHeight(materialTableElement, "fixedcreate") -46;
  document.documentElement.style.setProperty(
    "--dynamic-value",
    String(maxHeight1 -91) + "px"
  );

  const getData = () => {
    axios
      .get(
        baseUrl + `/customersms/Customers/getResourdceApproval?cid=${projectId}`
      )
      .then((res) => {
        const GetData = res.data;
        const Headerdata = [
          {
            employee_number: "Employee ID",
            Resource: "Resource",
            RoleName: "Role Name",
            from_dt: "From Date",
            to_dt: "To Date",
            effort_hours: "Effort  Hours",
            AllocationType: "Allocation Type",
            BookingStatus: "Booking Status",
            comments: "Comments",
          },
        ];
        // for (let i = 0; i < GetData.length; i++) {
        //   GetData[i]["from_dt"] =
        //     GetData[i]["from_dt"] == null
        //       ? ""
        //       : moment(GetData[i]["from_dt"]).format("DD-MMM-yyyy");
        //   GetData[i]["to_dt"] =
        //     GetData[i]["to_dt"] == null
        //       ? ""
        //       : moment(GetData[i]["to_dt"]).format("DD-MMM-yyyy");
        // }
        setData(Headerdata.concat(GetData));
        setcustomerDatarole(GetData);
      });
  };

  //----------------------
  const handleChange = (e) => {
    setCheckboxSelect(e.value);

    let dataresource = e.value.map((d) => {
      setData((prev) => ({ ...prev, [d.id]: "" }));
      return d.id;
    });

    setDisplay(dataresource);
  };
  const handleConfirm = (e) => {
    setState(e.target.value);
    if (checkboxSelect == false) {
      setValidationMsg(true);
    } else {
      setValidationMsg(false);
      let Fdata = [];

      Object.keys(data).forEach((d) => {
        if (typeof data[d] != "object" && d != "undefined") {
          const obj = {};

          obj["id"] = d;
          obj["comments"] = data[d].includes([null, ""]) ? null : data[d];
          obj["status_id"] = e.target.value == "Approved" ? 475 : 476;
          Fdata.push(obj);
        }
      });

      axios({
        method: "post",
        url: baseUrl + `/ProjectMS/Audit/updatecomments`,

        data: Fdata,
      }).then(function (res) {
        var resp = res.data;
        getData();
        setSuccessfullymsg(true);
        setrejectMsg(true);
        // setLoaderState(true);
        setTimeout(() => {
          setSuccessfullymsg(false);
          setrejectMsg(false);
          // setLoaderState(false);
        }, 3000);
      });
      // window.location.reload(false);
    }
  };
  const loggedUserId = localStorage.getItem("resId");

  const getUrlPath = () => {
    axios({
      method: "get",
      url:
        baseUrl +
        `/CommonMS/security/authorize?url=/projectRoleResource/getResFromBookings&userId=${loggedUserId}`,
    }).then((res) => {
      console.log(res, "urlResponse");
    });
  };

  useEffect(() => {
    getData();
    getUrlPath();
    setcustomerDatarole();
    getProjectName();
  }, []);
  const getProjectName = () => {
    axios({
      method: "get",
      url: baseUrl + `/ProjectMS/Audit/getProjectName?projectId=${projectId}`,
    }).then(function (response) {
      let resp = response.data;
      setPrjName(resp);
    });
  };
  const representresource = (rowData) => {
    return (
      <>
        {rowData.rmg_bench_type_id == 1122 ? (
          <span
            className="vertical-align-middle ml-2"
            style={{ color: "red" }}
            title="Overallocated"
          >
            {rowData.Resource}
          </span>
        ) : (
          <span
            className="vertical-align-middle ml-2"
            style={{ color: "black" }}
            title={rowData.Resource}
          >
            {rowData.Resource}
          </span>
        )}
      </>
    );
  };
  const representRolename = (rowData) => {
    return (
      <>
        <span title={rowData.RoleName}>{rowData.RoleName}</span>
      </>
    );
  };
  const representFromDate = (rowData) => {
    console.log(rowData.from_dt);
    return (
      <span title={moment(rowData.from_dt).format("DD-MMM-yyyy")}>
        {moment(rowData.from_dt).format("DD-MMM-yyyy")}
      </span>
    );
  };
  const representTodate = (rowData) => {
    return (
      <span title={moment(rowData.to_dt).format("DD-MMM-yyyy")}>
        {moment(rowData.to_dt).format("DD-MMM-yyyy")}
      </span>
    );
  };
  const representEffort = (rowData) => {
    return <div title={rowData.effort_hours}>{rowData.effort_hours}</div>;
  };
  const representAllocation = (rowData) => {
    return <span title={rowData.AllocationType}>{rowData.AllocationType}</span>;
  };
  const representBokking = (rowData) => {
    return <span title={rowData.BookingStatus}>{rowData.BookingStatus}</span>;
  };
  const representComments = (rowData) => {
    return (
      <>
        {display.includes(rowData.id) ? (
          <input
            type="text"
            id="comments"
            onChange={(e) => {
              onchange(e, rowData);
            }}
          ></input>
        ) : (
          <span title={rowData.comments}>{rowData.comments}</span>
        )}
      </>
    );
  };
  const represent = (rowData) => {
    return (
      <span title={rowData.employee_number}>{rowData.employee_number}</span>
    );
  };

  const onchange = (e, rowData) => {
    setData((prev) => ({ ...prev, [rowData.id]: e.target.value }));
  };
  return (
    <div>
      {successfullymsg && state == "Approved" ? (
        <div className="statusMsg success">
          <span className="errMsg">&nbsp; Successfully booked resources</span>
        </div>
      ) : (
        ""
      )}
      {rejectmsg && state == "Rejected" ? (
        <div className="statusMsg success">
          <span className="errMsg">&nbsp; Rejected booked resources</span>
        </div>
      ) : (
        ""
      )}
      {/* {loaderState ? (
        <div className="loaderBlock">
          <Loader />
        </div>
      ) : (
        ""
      )} */}
      {ValidationMsg ? (
        <div className="statusMsg error">
          <span className="error">
            <AiFillWarning />
            &nbsp; Please Select atleast one resource
          </span>
        </div>
      ) : (
        ""
      )}
      <div className="pageTitle">
        <div className="childOne">
          {/* <h2>{projectName}</h2> */}
          <ul className="tabsContainer">
            <li>
              {grp1Items[0]?.display_name != undefined ? (
                <span>{grp1Items[0]?.display_name}</span>
              ) : (
                ""
              )}
              <ul>
                {grp1Items.slice(1).map((button) => (
                  <li
                    className={
                      bottonstate === button.display_name
                        ? "buttonDisplayClick"
                        : "buttonDisplay"
                    }
                    onClick={() => {
                      setButtonState(button.display_name);
                      setUrlState(
                        button.url_path.toString().replace(/::/g, "/")
                      );
                    }}
                  >
                    {button.display_name}
                  </li>
                ))}
              </ul>
            </li>{" "}
            <li>
              {grp2Items[0]?.display_name != undefined ? (
                <span>{grp2Items[0]?.display_name}</span>
              ) : (
                ""
              )}
              <ul>
                {grp2Items.slice(1).map((button) => (
                  <li
                    className={
                      bottonstate === button.display_name
                        ? "buttonDisplayClick"
                        : "buttonDisplay"
                    }
                    onClick={() => {
                      setButtonState(button.display_name);
                      setUrlState(
                        button.url_path.toString().replace(/::/g, "/")
                      );
                    }}
                  >
                    {button.display_name}
                  </li>
                ))}
              </ul>
            </li>{" "}
            <li>
              {grp3Items[0]?.display_name != undefined ? (
                <span>{grp3Items[0]?.display_name}</span>
              ) : (
                ""
              )}
              <ul>
                {grp3Items.slice(1).map((button) => (
                  <li
                    className={
                      bottonstate === button.display_name
                        ? "buttonDisplayClick"
                        : "buttonDisplay"
                    }
                    onClick={() => {
                      setButtonState(button.display_name);
                      setUrlState(
                        button.url_path.toString().replace(/::/g, "/")
                      );
                    }}
                  >
                    {button.display_name}
                  </li>
                ))}
              </ul>
            </li>{" "}
            <li>
              {grp4Items[0]?.display_name != undefined ? (
                <span>{grp4Items[0]?.display_name}</span>
              ) : (
                ""
              )}
              <ul>
                {grp4Items.slice(1).map((button) => (
                  <li
                    className={
                      bottonstate === button.display_name
                        ? "buttonDisplayClick"
                        : "buttonDisplay"
                    }
                    onClick={() => {
                      setButtonState(button.display_name);
                      setUrlState(
                        button.url_path.toString().replace(/::/g, "/")
                      );
                    }}
                  >
                    {button.display_name}
                  </li>
                ))}
              </ul>
            </li>{" "}
            <li>
              {grp6Items[0]?.display_name != undefined ? (
                <span>{grp6Items[0]?.display_name}</span>
              ) : (
                ""
              )}
              <ul>
                {grp6Items.slice(1).map((button) => (
                  <li
                    className={
                      bottonstate === button.display_name
                        ? "buttonDisplayClick"
                        : "buttonDisplay"
                    }
                    onClick={() => {
                      setButtonState(button.display_name);
                      setUrlState(
                        button.url_path.toString().replace(/::/g, "/")
                      );
                    }}
                  >
                    {button.display_name}
                  </li>
                ))}
              </ul>
            </li>
          </ul>
        </div>
        <div className="childTwo">
          <h2>Resource Approvals</h2>
        </div>
        <div className="childThree"></div>
      </div>

      <br />

      <div className="darkHeader DeliveryProjectsPlaningResourceApproval">
        <DataTable
          // className="customerEngament body"
          className="primeReactDataTable"
          value={customerDatarole}
          paginator
          selection={checkboxSelect}
          selectAll={true}
          removableSort
          rows={25}
          showGridlines
          pagination
          paginationPerPage={5}
          paginationRowsPerPageOptions={[5, 15, 25, 50]}
          paginationComponentOptions={{
            rowsPerPageText: "Records per page:",
            rangeSeparatorText: "out of",
          }}
          responsiveLayout="scroll"
          onSelectionChange={(e) => handleChange(e)}
          rowsPerPageOptions={[5, 10, 15, 20, 25, 30]}
          emptyMessage="No Data Found"
          currentPageReportTemplate="View {first} - {last} of {totalRecords} "
          paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
        >
          <Column
            // selectionMode="multiple"
            alignHeader={"center"}
            style={{ textAlign: "center" }}
            selectionMode={customerDatarole?.length > 0 ? "multiple" : ""}
          />
          <Column
            field="employee_number"
            header=" Employee ID"
            body={represent}
            alignHeader={"center"}
            sortable
            // sortField="EmployeeID"
          ></Column>
          <Column
            field="Resource"
            header="  Resource"
            body={representresource}
            alignHeader={"center"}
            sortable
          ></Column>
          <Column
            field="RoleName"
            header=" Role Name"
            body={representRolename}
            alignHeader={"center"}
            sortable
          ></Column>
          <Column
            field="from_dt"
            header=" From Date"
            body={representFromDate}
            alignHeader={"center"}
            sortable
          ></Column>
          <Column
            field="to_dt"
            header=" To Date"
            body={representTodate}
            alignHeader={"center"}
            sortable
          ></Column>
          <Column
            field="effort_hours"
            header=" Effort  Hours"
            body={representEffort}
            alignHeader={"center"}
            style={{ textAlign: "left" }}
            sortable
          ></Column>
          <Column
            field="AllocationType"
            header=" Allocation Type"
            body={representAllocation}
            alignHeader={"center"}
            sortable
          ></Column>
          <Column
            field="BookingStatus"
            header=" Booking Status"
            body={representBokking}
            alignHeader={"center"}
            sortable
          ></Column>
          <Column
            field="comments"
            id="comments"
            header=" Comments"
            body={representComments}
            alignHeader={"center"}
            sortable
          ></Column>
        </DataTable>
      </div>
      <div class="col-md-12 col-sm-12 col-xs-12 my-2 btn-container center">
        {customerDatarole?.length === 0 ? (
          <button
            type="submit"
            value={"Approved"}
            disabled="disabled"
            className="btn btn-primary"
          >
            {" "}
            <FaSave />
            Approve
          </button>
        ) : (
          <button
            type="submit"
            value={"Approved"}
            onClick={(e) => {
              handleConfirm(e);
            }}
            className="btn btn-primary"
          >
            {" "}
            <FaSave />
            Approve
          </button>
        )}
        {customerDatarole?.length === 0 ? (
          <button
            type="submit"
            className="btn btn-secondary"
            value={"Rejected"}
            disabled
            style={{ cursor: "not - allowed" }}
          >
            {" "}
            <Close />
            Reject
          </button>
        ) : (
          <button
            type="submit"
            className="btn btn-secondary"
            onClick={(e) => {
              handleConfirm(e);
            }}
            value={"Rejected"}
          >
            {" "}
            <Close />
            Reject
          </button>
        )}
      </div>
    </div>
  );
}
export default ResourceApprovals;
