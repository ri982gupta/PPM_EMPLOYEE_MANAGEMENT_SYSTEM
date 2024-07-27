import React from "react";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import moment from "moment";
import { Column } from "primereact/column";
import { AiFillEdit } from "react-icons/ai";
import CellRendererPrimeReactDataTable from "../PrimeReactTableComponent/CellRendererPrimeReactDataTable";
import { MdOutlinePlaylistAdd } from "react-icons/md";
import { BiCheck } from "react-icons/bi";
import { environment } from "../../environments/environment";
import "primeicons/primeicons.css";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.css";
import "primeflex/primeflex.css";
import DownloadForOfflineRoundedIcon from "@mui/icons-material/DownloadForOfflineRounded";

import QbrUpdate from "./QbrUpdate";
import ScreenBreadcrumbs from "../Common/ScreenBreadcrumbs";
import { FaPlus } from "react-icons/fa";
import useDynamicMaxHeight from "../PrimeReactTableComponent/useDynamicMaxHeight"; 

function QBR(props) {
  const {
    customerId,
    filteredData,
    mainMenu,
    urlState,
    setUrlState,
    setButtonState,
    buttonState,
    grp1Items,
    grp2Items,
    grp3Items,
    grp4Items,
  } = props;
  const dataObject = mainMenu.find((item) => item.display_name === "QBR");
  const [data, setData] = useState([{}]);

  const loggedUserId = localStorage.getItem("resId");

  let rows = 25;
  const baseUrl = environment.baseUrl;
  const [issueDetails, setIssueDetails] = useState([]);
  const initialValue = {
    ToDate: "",
  };
  const [addmsg, setAddmsg] = useState(false);
  const initialValues = {
    customer_id: customerId,
    qbr_dt: "",
    lead_presenter: "",
    prolifics_participants: "",
    customer_participants: "",
    presentation_dt: "",
    doc_id: "",
    meeting_notes: "",
  };

  const [editedData, setEditedData] = useState(initialValues);
  const [docId, setDocId] = useState([]);

  const [searchdates, setSearchdates] = useState(initialValue);
  const [editId, setEditId] = useState();
  const [buttonPopups, setButtonPopups] = useState(false);
  const [headerData, setHeaderData] = useState([]);
  const [linkColumns, setLinkColumns] = useState([]);
  const [linkColumnsRoutes, setLinkColumnsRoutes] = useState([]);
  useEffect(() => {}, [customerId]);

  const materialTableElement = document.getElementsByClassName(
    "childTwo"
  );
  const custQBRDyMaxHeight =
    useDynamicMaxHeight(materialTableElement, "fixedcreate") -46;
    console.log(custQBRDyMaxHeight, "maxHeight1");

  const getData = () => {
    axios
      .get(baseUrl + `/customersms/Qbr/getQbrDetails?cid=${customerId}`)

      .then((res) => {
        const GetData = res.data;
        for (let i = 0; i < GetData.length; i++) {
          GetData[i]["SNo"] = i + 1;
        }
        for (let i = 0; i < GetData.length; i++) {
          GetData[i]["qbr_dt"] =
            GetData[i]["qbr_dt"] == null
              ? ""
              : moment(GetData[i]["qbr_dt"]).format("DD-MMM-YYYY");

          GetData[i]["presentation_dt"] =
            GetData[i]["presentation_dt"] == null
              ? ""
              : moment(GetData[i]["presentation_dt"]).format("DD-MMM-YYYY");

          GetData[i]["customerParticipants"] =
            GetData[i]["customerParticipants"] == null
              ? ""
              : GetData[i]["customerParticipants"];

          GetData[i]["customer_participants"] =
            GetData[i]["customer_participants"] == null
              ? ""
              : GetData[i]["customer_participants"];

          GetData[i]["prolificsParticipants"] =
            GetData[i]["prolificsParticipants"] == null
              ? ""
              : GetData[i]["prolificsParticipants"];

          GetData[i]["prolifics_participants"] =
            GetData[i]["prolifics_participants"] == null
              ? ""
              : GetData[i]["prolifics_participants"];
        }
        let dataHeader = [
          {
            SNo: "S.No",
            qbr_dt: "QBR Date",
            leadPresenter: "Lead Presenter",
            prolificsParticipants: "Prolifics Participants",
            customerParticipants: "Customer Participant",
            presentation_dt: "Presentation Date",
            meeting_notes: "Metting Notes & Next Steps",
            doc_id: "Presentation File",
            Action: "Action",
          },
        ];
        let dataHeader1 = [
          {
            SNo: "S.No",
            qbr_dt: "QBR Date",
            leadPresenter: "Lead Presenter",
            prolificsParticipants: "Prolifics Participants",
            customerParticipants: "Customer Participant",
            presentation_dt: "Presentation Date",
            meeting_notes: "Metting Notes & Next Steps",
            doc_id: "Presentation File",
          },
        ];
        let data = ["Action"];
        setLinkColumns(data);
        setData(dataHeader.concat(GetData));
        //  setData(dataHeader1.concat(GetData));
      })
      .catch((error) => {});
  };
  const getDatas = () => {
    axios({
      method: "get",
      url: baseUrl + `/ProjectMS/Issues/getAssignedData`,
    }).then(function (response) {
      var res = response.data;
      setIssueDetails(res);
    });
  };
  const [editmsg, setEditAddmsg] = useState(false);
  useEffect(() => {
    getData();
    getDatas();
  }, [customerId]);
  const [type, setType] = useState("add");
  useEffect(() => {}, [editedData]);
  const LinkTemplate = (data) => {
    for (let key in data) {
      if (data[key] === null) {
        data[key] = "";
      }
    }

    let rou = linkColumns[0];
    return (
      <>
        <div align="center">
          {
            <AiFillEdit
              type="edit"
              title="Edit"
              size="1.2em"
              color="orange"
              cursor="pointer"
              onClick={() => {
                setEditedData(data);
                setEditId(data.SNo);
                setButtonPopups(true);
                setType("edit");
              }}
            />
          }
        </div>
      </>
    );
  };
  const downloadEmployeeData = (data) => {
    const docUrl =
      baseUrl + `/customersms/Qbr/downloadFile?documentId=${data.doc_id}`;

    axios({
      url: docUrl,
      method: "GET",
      responseType: "blob",
    }).then((response) => {
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", data.file_name); //or any other extension
      document.body.appendChild(link);
      link.click();
    });
  };
  const [documentId, setDcoumentId] = useState([]);
  useEffect(() => {}, []);
  const presentationFile = (data) => {
    return (
      <div align="center" data-toggle="tooltip" title="Download Document">
        {data.doc_id != "" ? (
          <DownloadForOfflineRoundedIcon
            style={{ cursor: "pointer", color: "#86b558" }}
            onClick={() => {
              downloadEmployeeData(data);
            }}
          />
        ) : (
          ""
        )}
      </div>
    );
  };
  const SNoCenter = (data) => {
    return (
      <div align="center" data-toggle="tooltip" title={data.SNo}>
        {data.SNo}
      </div>
    );
  };
  const prolificPart = (data) => {
    return (
      <div
        data-toggle="tooltip"
        className="ellipsis"
        title={data.prolificsParticipants}
      >
        {data.prolificsParticipants}
      </div>
    );
  };
  const leadPrese = (data) => {
    return (
      <div
        data-toggle="tooltip"
        className="ellipsis"
        title={data.leadPresenter}
      >
        {data.leadPresenter}
      </div>
    );
  };
  const qbrDates = (data) => {
    return (
      <div
        data-toggle="tooltip"
        title={data.qbr_dt}
        style={{ textAlign: "center" }}
      >
        {data.qbr_dt}
      </div>
    );
  };
  const customerParti = (data) => {
    return (
      <div
        data-toggle="tooltip"
        className="ellipsis"
        title={data.customerParticipants}
      >
        {data.customerParticipants}
      </div>
    );
  };
  const presentationDates = (data) => {
    return (
      <div
        data-toggle="tooltip"
        title={data.presentation_dt}
        style={{ textAlign: "center" }}
      >
        {data.presentation_dt}
      </div>
    );
  };
  const meetingNotes = (data) => {
    return (
      <div
        data-toggle="tooltip"
        className="ellipsis"
        title={data.meeting_notes}
      >
        {data.meeting_notes}
      </div>
    );
  };
  const dynamicColumns = Object.keys(headerData)?.map((col, i) => {
    if (dataObject.is_write) {
      return (
        <Column
          sortable
          key={col}
          body={
            col === "Action"
              ? LinkTemplate
              : col === "doc_id"
              ? presentationFile
              : col === "SNo"
              ? SNoCenter
              : col === "prolificsParticipants"
              ? prolificPart
              : col === "leadPresenter"
              ? leadPrese
              : col === "qbr_dt"
              ? qbrDates
              : col === "customerParticipants"
              ? customerParti
              : col === "presentation_dt"
              ? presentationDates
              : col === "meeting_notes"
              ? meetingNotes
              : ""
          }
          field={col}
          header={headerData[col]}
        />
      );
    } else {
      // Include only specific columns when dataObject.is_write is false
      if (
        col === "doc_id" ||
        col === "SNo" ||
        col === "prolificsParticipants" ||
        col === "leadPresenter" ||
        col === "qbr_dt" ||
        col === "customerParticipants" ||
        col === "presentation_dt" ||
        col === "meeting_notes"
      ) {
        return (
          <Column
            sortable
            key={col}
            body={
              col === "Action"
                ? LinkTemplate
                : col === "doc_id"
                ? presentationFile
                : col === "SNo"
                ? SNoCenter
                : col === "prolificsParticipants"
                ? prolificPart
                : col === "leadPresenter"
                ? leadPrese
                : col === "qbr_dt"
                ? qbrDates
                : col === "customerParticipants"
                ? customerParti
                : col === "presentation_dt"
                ? presentationDates
                : col === "meeting_notes"
                ? meetingNotes
                : ""
            }
            field={col}
            header={headerData[col]}
          />
        );
      } else {
        return null; // Exclude other columns
      }
    }
  });

  useEffect(() => {
    data[0] && setHeaderData(JSON.parse(JSON.stringify(data[0])));
  }, [data]);

  const [custName, setCustName] = useState([]);

  const getCustomer = () => {
    axios({
      method: "get",
      url: baseUrl + `/customersms/Customers/getProjectName?cid=${customerId}`,
    }).then(function (response) {
      var resp = response.data;
      setCustName(resp);
    });
  };
  useEffect(() => {
    getCustomer();
  }, []);
  const [cus, setCusName] = useState([]);

  const getCustomerName = () => {
    axios({
      method: "get",
      url: baseUrl + `/customersms/Customers/getCustomerName?cid=${customerId}`,
    }).then(function (response) {
      let resp = response.data;
      setCusName(resp);
    });
  };
  useEffect(() => {
    getCustomerName();
  }, [customerId]);

  const [routes, setRoutes] = useState([]);
  let textContent = "Customers";
  let currentScreenName = ["Monitoring", "QBR"];
  sessionStorage.setItem(
    "breadCrumbs",
    JSON.stringify({
      routes: routes,
      currentScreenName: currentScreenName,
      textContent: textContent,
    })
  );

  useEffect(() => {
    getMenus();
    getUrlPath();
  }, []);

  const getMenus = () => {
    // setMenusData

    axios({
      method: "GET",
      url: baseUrl + `/CommonMS/master/getMenus?loggedUserId=${loggedUserId}`,
    }).then((resp) => {
      let data = resp.data;
      const updatedMenuData = data.map((category) => ({
        ...category,
        subMenus: category.subMenus.filter(
          (submenu) => submenu.display_name !== "Financial Plan & Review"
        ),
      }));

      updatedMenuData.forEach((item) => {
        if (item.display_name === textContent) {
          setRoutes([item]);
          sessionStorage.setItem("displayName", item.display_name);
        }
      });
    });
  };
  const getUrlPath = () => {
    axios({
      method: "get",
      url:
        baseUrl +
        `/CommonMS/security/authorize?url=/customer/customerQBR/&userId=${loggedUserId}`,
    }).then((res) => {});
  };
  return (
    <div className="QBR_screen-margin">
      {addmsg ? (
        <div className="statusMsg success">
          <span className="errMsg">
            <BiCheck /> &nbsp; QBR Saved successfully
          </span>
        </div>
      ) : (
        ""
      )}
      {editmsg ? (
        <div className="statusMsg success">
          <span className="errMsg">
            <BiCheck /> &nbsp; Update successfully
          </span>
        </div>
      ) : (
        ""
      )}
      <div className="col-md-12">
        <div className="pageTitle">
          <div className="childOne">
            {/* <h2>{cus}</h2> */}
            <ul className="tabsContainer">
              <li>
                {/* {grp1Items[0]?.display_name != undefined ? (
                  <span>{grp1Items[0]?.display_name}</span>
                ) : (
                  ""
                )} */}
                {grp1Items[0]?.display_name != undefined ? (
                  <span>{grp1Items[0]?.display_name}</span>
                ) : (
                  ""
                )}
                <ul>
                  {grp1Items.slice(1).map((button) => (
                    <li
                      className={
                        buttonState === button.display_name
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
                {/* <span>Planning</span> */}
                <ul>
                  {grp2Items.slice(1).map((button) => (
                    <li
                      className={
                        buttonState === button.display_name
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
                {/* <span>Monitoring</span> */}
                <ul>
                  {grp3Items.slice(1).map((button) => (
                    <li
                      className={
                        buttonState === button.display_name
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
                {/* <span>Financials</span> */}
                <ul>
                  {grp4Items.slice(1).map((button) => (
                    <li
                      className={
                        buttonState === button.display_name
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
            <h2>QBR</h2>
          </div>
          <div className="childThree"></div>
        </div>
      </div>

      <div className="row">
        
        <div className="add-QBR-btn">
          {dataObject.is_write == true ? (
            <button
              onClick={() => {
                setButtonPopups(true);
                setType("add");
              }}
              className="btn btn-primary mt-2 mb-2"
              style={{ width: "100px" }}
              title="Add QBR"
            >
              <FaPlus />
              Add QBR
            </button>
          ) : (
            ""
          )}
        </div>
      </div>
      <div className="group customCard">
        <CellRendererPrimeReactDataTable
        custQBRDyMaxHeight = {custQBRDyMaxHeight}
        CustomersFileName = "QBR"
          data={data}
          linkColumns={linkColumns}
          linkColumnsRoutes={linkColumnsRoutes}
          dynamicColumns={dynamicColumns}
          headerData={headerData}
          setHeaderData={setHeaderData}
          rows={rows}
        />
      </div>
      {buttonPopups ? (
        <QbrUpdate
          setSearchdates={setSearchdates}
          issueDetails={issueDetails}
          type={type}
          setData={setData}
          data={data}
          customerId={customerId}
          setEditedData={setEditedData}
          editId={editId}
          editedData={editedData}
          setAddmsg={setAddmsg}
          setEditAddmsg={setEditAddmsg}
          buttonPopups={buttonPopups}
          setButtonPopups={setButtonPopups}
          setDcoumentId={setDcoumentId}
          documentId={documentId}
        />
      ) : (
        ""
      )}
    </div>
  );
}
export default QBR;
