import { CCollapse } from "@coreui/react";
import axios from "axios";
import moment from "moment";
import React, { useEffect, useRef, useState } from "react";
import DatePicker from "react-datepicker";
import { AiFillEdit, AiFillWarning } from "react-icons/ai";
import {
  FaChevronCircleDown,
  FaChevronCircleUp,
  FaSearch,
} from "react-icons/fa";
import { Column } from "primereact/column";

import { environment } from "../../environments/environment";
import Loader from "../Loader/Loader";
import UpdateBillingPopUp from "./UpdateBillingPopUp";
import GlobalValidation from "../ValidationComponent/GlobalValidation";
import CellRendererPrimeReactDataTable from "../PrimeReactTableComponent/CellRendererPrimeReactDataTable";
import { BiCheck } from "react-icons/bi";
import ScreenBreadcrumbs from "../Common/ScreenBreadcrumbs";

function UpdateBillingStatus({
  urlPath,
  visible,
  setVisible,
  setCheveronIcon,
}) {
  const [customer, setCustomer] = useState([]);
  const baseUrl = environment.baseUrl;
  const [project, setProject] = useState([{}]);
  const [addVisisble, setAddVisible] = useState(false);
  const [projectSpare, setProjectSpare] = useState([]);
  const [projectspar, setProjectspar] = useState([]);
  const [month, setMonth] = useState(new Date());
  const [loader, setLoader] = useState(false);
  const [openPopup, setOpenPopup] = useState(false);
  const [editdata, setEditData] = useState([]);
  const [addmsg, setAddmsg] = useState(false);
  const abortController = useRef(null);

  const [details, setDetails] = useState({
    customer: "",
    project: "",
    month: "",
  });

  const [data, SetData] = useState([]);
  const [headerData, setHeaderData] = useState([]);
  const [linkColumns, setLinkColumns] = useState([]);
  const [linkColumnsRoutes, setLinkColumnsRoutes] = useState([]);

  let projectId = details.project;
  const [validationmessage, setValidationMessage] = useState(false);

  const ref = useRef([]);

  let myDate = details.month;
  const Dates = details.month.split("-");
  const [StartDt, setStartDt] = useState();
  const [EndDt, setEndDt] = useState();

  var date = new Date();
  var FromDate = new Date(Dates[0], Dates[1] - 1, 1);
  const FDate = moment(FromDate).format("yyyy-MM-DD");
  let StartDate = StartDt == null ? FDate : moment(StartDt).format("MM-yyyy");
  var lastDay = new Date(Dates[0], Dates[1], 0);
  const lDate = moment(lastDay).format("yyyy-MM-DD");
  let EndDate = EndDt == null ? lDate : EndDt;
  const loggedUserId = localStorage.getItem("resId");
  const [routes, setRoutes] = useState([]);
  let currentScreenName = ["Hammer Tool", "Timesheet", "Update Billing Status"];
  let textContent = "Administration";
  sessionStorage.setItem(
    "breadCrumbs",
    JSON.stringify({
      routes: routes,
      currentScreenName: currentScreenName,
      textContent: textContent,
    })
  );

  let customerid = details.customer;

  const handleChange = (e) => {
    const { name, value } = e.target;
    let data = projectSpare;
    setProject(data);
    setProjectSpare(data);
    setDetails((prev) => {
      return { ...prev, [name]: value };
    });
  };

  const handleChange1 = (e) => {
    const { name, value } = e.target;
    setDetails((prev) => {
      return { ...prev, [name]: value };
    });
  };

  const handleCustomer = () => {
    axios({
      method: "get",
      url: baseUrl + `/ProjectMS/Engagement/getCustomerName`,
    }).then((res) => {
      let custom = res.data;
      setCustomer(custom);
    });
  };

  const handleProject = () => {
    axios({
      method: "get",
      url:
        baseUrl +
        `/administrationms/updatetask/getProjectName?cid=${customerid}`,
    }).then((res) => {
      let projet = res.data;
      setProject(projet);
      setProjectspar(projet);
    });
  };

  useEffect(() => {
    handleProject();
  }, [customerid]);

  const handleTableData = () => {
    let valid = GlobalValidation(ref);
    if (valid === true) {
      setValidationMessage(true);
    }
    if (valid) {
      return;
    }
    setVisible(!visible);
    setValidationMessage(false);
    setLoader(true);
    abortController.current = new AbortController();
    axios({
      method: "get",
      url:
        baseUrl +
        `/administrationms/updatetask/getFilteredData?cid=${customerid}&prjid=${projectId}&fromDate=${StartDate}&toDate=${EndDate}`,
      signal: abortController.current.signal,
    }).then((res) => {
      const GetData = res.data;
      for (let i = 0; i < GetData.length; i++) {
        GetData[i]["SNo"] = i + 1;
        GetData[i]["from_date"] =
          GetData[i]["from_date"] == null
            ? " "
            : moment(GetData[i]["from_date"]).format("DD-MMM-yyyy");
        GetData[i]["to_date"] =
          GetData[i]["to_date"] == null
            ? " "
            : moment(GetData[i]["to_date"]).format("DD-MMM-yyyy");
      }
      let Headerdata = [
        {
          full_name: "Customer",
          project_name: "Project",
          status: "Current Status",
          from_date: "From Date",
          to_date: "To Date",
          Actions: "Actions",
        },
      ];
      let data = ["Actions"];
      setLinkColumns(data);
      setAddVisible(true);
      setLoader(false);
      SetData(Headerdata.concat(GetData));
      setTimeout(() => {
        setLoader(false);
      }, 1000);
      setVisible(!visible);
      visible
        ? setCheveronIcon(FaChevronCircleUp)
        : setCheveronIcon(FaChevronCircleDown);
    });
  };

  useEffect(() => {
    data[0] && setHeaderData(JSON.parse(JSON.stringify(data[0])));
  }, [data]);

  useEffect(() => {
    handleCustomer();
    getMenus();
    getUrlPath();
  }, []);

  const handleAbort = () => {
    abortController.current && abortController.current.abort();
    setLoader(false);
  };

  const LinkTemplate = (data) => {
    let rou = linkColumns[0];
    return (
      <div align="center">
        <>
          {
            <AiFillEdit
              data-toggle="tooltip"
              title="Edit"
              color="orange"
              cursor="pointer"
              type="edit"
              size="1.2em"
              onClick={() => {
                setEditData(data);
                setOpenPopup(true);
              }}
            />
          }{" "}
          &nbsp;
        </>
      </div>
    );
  };

  const changeReqDateTT = (data) => {
    return (
      <div data-toggle="tooltip" title={data.status}>
        {data.status}
      </div>
    );
  };
  const descriptionTT = (data) => {
    return (
      <div className="ellipsis" data-toggle="tooltip" title={data.project_name}>
        {data.project_name}
      </div>
    );
  };
  const fullnameTT = (data) => {
    return (
      <div className="custName ellipsis" title={data.full_name}>
        {data.full_name}
      </div>
    );
  };
  const centerAlignStyle = {
    textAlign: "center",
  };

  const FromdateTT = (data) => {
    return (
      <div
        className="custName ellipsis"
        title={data.from_date}
        style={centerAlignStyle}
      >
        {data.from_date}
      </div>
    );
  };

  const TodateTT = (data) => {
    return (
      <div
        className="custName ellipsis"
        title={data.to_date}
        style={centerAlignStyle}
      >
        {data.to_date}
      </div>
    );
  };

  const getUrlPath = () => {
    axios({
      method: "get",
      url:
        baseUrl +
        `/CommonMS/security/authorize?url=/admin/updateBillingStatus&userId=${loggedUserId}`,
    }).then((res) => {});
  };
  const getMenus = () => {
    axios({
      method: "GET",
      url: baseUrl + `/CommonMS/master/getMenus?loggedUserId=${loggedUserId}`,
    }).then((resp) => {
      let getData = resp.data.map((menu) => {
        if (menu.subMenus) {
          menu.subMenus = menu.subMenus.filter(
            (subMenu) =>
              subMenu.display_name !== "Roles Permissions" &&
              subMenu.display_name !== "Sales Permissions" &&
              subMenu.display_name !== "Jobs Daily Status" &&
              subMenu.display_name !== "Error Logs" &&
              subMenu.id != 27 &&
              subMenu.display_name !== "Tracker" &&
              subMenu.display_name !== "Role Costs" &&
              subMenu.display_name !== "Upload Role Costs" &&
              subMenu.display_name !== "Contract Documents"
          );
        }
        return menu;
      });

      getData.forEach((item) => {
        if (item.display_name === textContent) {
          setRoutes([item]);
          sessionStorage.setItem("displayName", item.display_name);
        }
      });
    });
  };
  const dynamicColumns = Object.keys(headerData)?.map((col, i) => {
    return (
      <Column
        sortable
        key={col}
        body={
          col == "Actions"
            ? LinkTemplate
            : (col == "status" && changeReqDateTT) ||
              (col == "project_name" && descriptionTT) ||
              (col == "full_name" && fullnameTT) ||
              (col == "from_date" && FromdateTT) ||
              (col == "to_date" && TodateTT)
        }
        field={col}
        header={headerData[col]}
      />
    );
  });

  return (
    <div>
      {addmsg ? (
        <div className="statusMsg success">
          <BiCheck />
          {"Billing Status Updated Successfully."}
        </div>
      ) : (
        ""
      )}

      {validationmessage ? (
        <div className="  statusMsg error">
          {" "}
          &nbsp;
          <span className="error-block">
            <AiFillWarning size="1.4em" strokeWidth={{ width: "100px" }} />{" "}
            &nbsp; Please select the valid values for highlighted fields.
          </span>
        </div>
      ) : (
        ""
      )}

      <div className="group my-3 customCard">
        <div className="col-md-12 collapseHeader"></div>

        <CCollapse visible={!visible}>
          <div className="group-content row ">
            <div className=" col-md-4 mb-2">
              <div className="form-group row">
                <label className="col-5" htmlFor="Customer">
                  Customer <span className="error-text ml-1">*</span>
                </label>
                <span className="col-1">:</span>
                <div className="col-6">
                  <select
                    ref={(ele) => {
                      ref.current[0] = ele;
                    }}
                    className="error enteredDetails cancel text"
                    name="customer"
                    id="customer_id"
                    onChange={handleChange}
                  >
                    <option value=""> &lt;&lt;Please Select&gt;&gt;</option>
                    {customer?.map((Item) => (
                      <option key={Item.id} value={Item.id}>
                        {Item.full_name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            <div className=" col-md-4 mb-2">
              <div className="form-group row">
                <label className="col-5" htmlFor="Project">
                  Projects <span className="error-text ml-1">*</span>
                </label>
                <span className="col-1">:</span>
                <div className="col-6">
                  <select
                    className="error enteredDetails cancel text ellipsis"
                    name="project"
                    id="project_id"
                    onChange={handleChange1}
                    ref={(ele) => {
                      ref.current[1] = ele;
                    }}
                  >
                    <option value=""> &lt;&lt;Please Select&gt;&gt;</option>
                    {project?.map((Item) => (
                      <option key={Item.id} value={Item.id}>
                        {Item.project_name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            <div className=" col-md-4 mb-3">
              <div className="form-group row">
                <label className="col-5" htmlFor="Month">
                  Month <span className="error-text ml-1">*</span>
                </label>
                <span className="col-1">:</span>
                <div className="col-6">
                  <DatePicker
                    name="month"
                    id="StartDt"
                    selected={month}
                    onChange={(e) => {
                      setDetails((prev) => ({
                        ...prev,
                        ["month"]: moment(e).format("yyyy-MM"),
                      }));
                      setMonth(e);
                    }}
                    dateFormat="MMM-yyyy"
                    showMonthYearPicker
                  />
                </div>
              </div>
            </div>

            <div className="col-md-12 col-sm-12 col-xs-12 btn-container center ">
              <button
                type="submit"
                className="btn btn-primary"
                title="Search"
                onClick={() => {
                  handleTableData();
                }}
              >
                <FaSearch />
                Search
              </button>
            </div>
          </div>
          {loader ? <Loader handleAbort={handleAbort} /> : ""}
        </CCollapse>
      </div>
      {addVisisble && (
        <div
          className="group my-3 customCard updateBillingStatus card graph"
          style={{ width: "100%", float: "left" }}
        >
          <CellRendererPrimeReactDataTable
            data={data}
            linkColumns={linkColumns}
            linkColumnsRoutes={linkColumnsRoutes}
            dynamicColumns={dynamicColumns}
            headerData={headerData}
            setHeaderData={setHeaderData}
            rows={10}
          />
          {openPopup ? (
            <UpdateBillingPopUp
              openPopup={openPopup}
              setOpenPopup={setOpenPopup}
              editdata={editdata}
              handleTableData={handleTableData}
              addmsg={addmsg}
              setAddmsg={setAddmsg}
            />
          ) : (
            ""
          )}
        </div>
      )}
    </div>
  );
}

export default UpdateBillingStatus;
