import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import { CModal } from "@coreui/react";
import { CModalBody } from "@coreui/react";
import { CModalHeader } from "@coreui/react";
import { CModalTitle } from "@coreui/react";
import { makeStyles } from "@material-ui/core";
import { Link } from "react-router-dom";
import ReviewLogPopup from "../ProjectComponent/ReviewLogPopup";
import { environment } from "../../environments/environment";
import CellRendererPrimeReactDataTable from "../PrimeReactTableComponent/CellRendererPrimeReactDataTable";
import "primeicons/primeicons.css";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.css";
import "primeflex/primeflex.css";
import { Column } from "primereact/column";
import ScreenBreadcrumbs from "../Common/ScreenBreadcrumbs";
import useDynamicMaxHeight from "../PrimeReactTableComponent/useDynamicMaxHeight";

function ProjectReviewLog(props) {
  const [openPopup, setOpenPopup] = useState(false);
  const [openPopReport, setOpenPopUpReport] = useState(false);
  const [docId, setDocId] = useState([]);
  const [svnRevision, setSvnRevision] = useState();
  const [updateId, setUpdateId] = useState([]);
  const [reviewerId, setReviewerId] = useState([]);
  const [projectData, setProjectData] = useState([]);
  const [statusId, setStatusId] = useState([]);
  const baseUrl = environment.baseUrl;
  const [headerdata, setHeaderdata] = useState([]);
  const [deletePopup, setDeletePopup] = useState(false);
  const {
    projectId,
    grp4Items,
    urlState,
    setUrlState,
    btnState,
    setbtnState,
    grp1Items,
    grp2Items,
    grp3Items,
    grp6Items,
  } = props;

  const [data, setData] = useState([{}]);
  const [countData, setCountData] = useState([{}]);
  const rows = 25;
  const [data2, setData2] = useState([]);
  const [dataDoc, setDataDoc] = useState([]);
  const loggedUserId = localStorage.getItem("resId");

  const getProjectOverviewData = () => {
    axios({
      method: "get",
      url:
        baseUrl +
        `/ProjectMS/Audit/projectOverviewDetails?projectId=${projectId}`,
    })
      .then(function (response) {
        let resp = response.data;

        setProjectData(resp);
        //    setPrjName(resp)
      })
      .catch(function (response) {});
  };
  // breadcrumbs --

  const [routes, setRoutes] = useState([]);
  let textContent = "Delivery";
  let currentScreenName = ["Projects", "Monitoring", "Review Log"];
  sessionStorage.setItem(
    "breadCrumbs",
    JSON.stringify({
      routes: routes,
      currentScreenName: currentScreenName,
      textContent: textContent,
    })
  );
  const materialTableElement = document.getElementsByClassName(
    "childOne"
  );
  const maxHeight1 = useDynamicMaxHeight(materialTableElement, "fixedcreate") -46;
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
      const getData1 = resp.data;
      const deliveryItem = getData1[7]; // Assuming "Delivery" item is at index 7

      const desiredOrder = [
        "Engagements",
        "Projects",
        "Engagement Allocations",
        "Project Health",
        "Project Status Report",
      ];

      const sortedSubMenus = deliveryItem.subMenus.sort((a, b) => {
        const indexA = desiredOrder.indexOf(a.display_name);
        const indexB = desiredOrder.indexOf(b.display_name);
        return indexA - indexB;
      });
      deliveryItem.subMenus = sortedSubMenus;
      //   console.log(sortedSubMenus);
      setData2(sortedSubMenus);
      data.forEach((item) => {
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
        `/CommonMS/security/authorize?url=/project/reviewLog/&userId=${loggedUserId}`,
    }).then((res) => {
      console.log(res, "urlResponse");
    });
  };
  const getData = () => {
    axios
      .get(
        baseUrl +
          `/ProjectMS/project/projectreviewloginfo?ProjectId=${projectId}`
      )

      .then((res) => {
        const GetData = res.data;
        GetData.forEach((GetData, index) => {
          GetData["sno"] = index + 1;
          //  GetData["id"] = index;
        });

        // setUpdateId(GetData[0].prhId);
        let headerdata = [
          {
            sno: "S.No",
            review_dt: "Review Date",
            rev_type: "Type",
            reviewer: "Reviewer",
            actItems: "Action Items",
            docCount: "Report",
            comments: "Comments",
          },
        ];

        setData(headerdata.concat(GetData));
      })
      .catch((error) => {
        console.log("Error :" + error);
      });
  };

  useEffect(() => {
    getData();
    getProjectOverviewData();
  }, []);
  const consoledData = () => {
    // getCountData();
    setOpenPopup(true);
  };

  const consoledDataReport = () => {
    setOpenPopUpReport(true);
  };
  // let documents = docId.split();
  const LinkTemplateAction = (data) => {
    return (
      <>
        <span
          className=" ellipsis tooltip-ex"
          data-toggle="tooltip"
          title={data.docCount}
          style={{ cursor: "pointer", textAlign: "center", color: "#2E88C5" }}
          onClick={() => {
            issueDeleteHandler();

            setDocId(data.docId);

            setSvnRevision(data.svn_revision);
          }}
        >
          <div style={{ textAlign: "center", textDecoration: "underLine" }}>
            {data.docCount}
          </div>
        </span>
      </>
    );
  };
  const SerialNo = (data) => {
    return (
      <span style={{ textAlign: "center", marginLeft: "45%", width: "10px" }}>
        {data.sno}
      </span>
    );
  };
  const Comments = (data) => {
    return (
      <span
        className=" ellipsis tooltip-ex"
        data-toggle="tooltip"
        title={data.comments}
      >
        {data.comments}
      </span>
    );
  };
  const LinkTemplate = (data) => {
    return (
      <>
        <span
          className=" ellipsis tooltip-ex"
          data-toggle="tooltip"
          title={data.actItems}
          style={{ cursor: "pointer", textAlign: "center", color: "#2E88C5" }}
          // onClick={consoledData}
          onClick={() => {
            consoledData();
            setUpdateId(data.prhId);
            setReviewerId(data.reviewer);
            setStatusId(data.review_st);
          }}
        >
          <div style={{ textAlign: "center", textDecoration: "underLine" }}>
            {data.actItems != 0 ? data.actItems : ""}
          </div>
        </span>
      </>
    );
  };
  const dynamicColumns = Object.keys(headerdata)?.map((col, i) => {
    return (
      <Column
        sortable
        key={col}
        body={
          col == "actItems"
            ? LinkTemplate
            : col == "docCount"
            ? LinkTemplateAction
            : col == "sno"
            ? SerialNo
            : col == "comments" && Comments
        }
        field={col}
        header={headerdata[col]}
      />
    );
  });
  const issueDeleteHandler = () => {
    setDeletePopup(true);
  };

  function ReviewReport(props) {
    function getAllNames(dataString) {
      const data = dataString?.split(",");
      const names = data?.map((item) => {
        const [, name] = item?.split(":");
        return name?.trim();
      });
      return names;
    }
    console.log();

    const handleClick = (id, filename) => {
      downloadEmployeeData(id, filename);
    };
    const downloadEmployeeData = (id, filename) => {
      const docUrl =
        baseUrl + `/VendorMS/vendor/downloadFile?documentId=${id}&svnRevision=`;
      axios({
        url: docUrl,
        method: "GET",
        responseType: "blob",
      }).then((response) => {
        const url = window.URL.createObjectURL(new Blob([response.data]));

        const link = document.createElement("a");

        link.href = url;
        link.setAttribute("download", filename); //or any other extension
        document.body.appendChild(link);
        link.click();
      });
    };

    useEffect(() => {
      downloadEmployeeData();
    }, []);
    const useStyles = makeStyles({
      dialog: {
        position: "absolute",
        top: "250px",
        minHeight: "18%",
      },
      textField: {
        border: "1px solid rgb(159 13 13)",
      },
    });

    const classes = useStyles();

    const { deletePopup, setDeletePopup, docId } = props;

    // const data1 = docId.split(":");
    const dataArray = docId?.split(",")?.map((item) => item?.split(":"));
    const fileList = dataArray;
    dataArray?.map((e) => {
      setDataDoc(e[1]);
    });

    return (
      <div className="reviewLogDeletePopUp">
        {/* <Draggable> */}
        <CModal
          visible={deletePopup}
          size="xs"
          className="reviewLogDeletePopUp"
          onClose={() => setDeletePopup(false)}
          maxWidth={"md"}
          classes={{
            paper: classes.dialog,
          }}
        >
          <CModalHeader className="">
            <CModalTitle>
              <span className="">Documents</span>
            </CModalTitle>
          </CModalHeader>
          <CModalBody>
            {/* <span>{data1[1]}</span> */}
            {dataArray == null ? (
              <Link
                key={dataArray[0]}
                data-toggle="tooltip"
                to={`/document/downloadFile?docume`}
                target="_blank"
              >
                undefined
              </Link>
            ) : (
              <>
                {fileList?.map((file) => (
                  <div key={file[0]} style={{ textDecoration: "underLine" }}>
                    <Link onClick={() => handleClick(file[0], file[1])}>
                      {file[1]}
                    </Link>
                  </div>
                ))}{" "}
              </>
            )}
          </CModalBody>
        </CModal>
        {/* </Draggable> */}
      </div>
    );
  }
  return (
    <div>
      <div className="pageTitle">
        <div className="childOne">
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
                      btnState === button.display_name
                        ? "buttonDisplayClick"
                        : "buttonDisplay"
                    }
                    onClick={() => {
                      setbtnState(button.display_name);
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
                      btnState === button.display_name
                        ? "buttonDisplayClick"
                        : "buttonDisplay"
                    }
                    onClick={() => {
                      setbtnState(button.display_name);
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
                      btnState === button.display_name
                        ? "buttonDisplayClick"
                        : "buttonDisplay"
                    }
                    onClick={() => {
                      setbtnState(button.display_name);
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
                      btnState === button.display_name
                        ? "buttonDisplayClick"
                        : "buttonDisplay"
                    }
                    onClick={() => {
                      setbtnState(button.display_name);
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
                      btnState === button.display_name
                        ? "buttonDisplayClick"
                        : "buttonDisplay"
                    }
                    onClick={() => {
                      setbtnState(button.display_name);
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
          <h2>Review Log</h2>
        </div>
        <div className="childThree"></div>
      </div>
      {/* <FlatPrimeReactTable data={data} rows={rows} /> */}

      <CellRendererPrimeReactDataTable
        data={data}
        rows={rows}
        dynamicColumns={dynamicColumns}
        headerData={headerdata}
        setHeaderData={setHeaderdata}
        CustomersFileName = "Delivery Projects Monitoring ProjectReviewLog"
        DeliveryProjMonitoringProjRevLog = {maxHeight1}
      />

      {openPopup ? (
        <ReviewLogPopup
          openPopup={openPopup}
          setOpenPopup={setOpenPopup}
          headerdata={headerdata}
          setHeaderdata={setHeaderdata}
          rows={rows}
          getData={getData}
          updateId={updateId}
          reviewerId={reviewerId}
          statusId={statusId}
          grp4Items={grp4Items}
        />
      ) : (
        ""
      )}
      {deletePopup ? (
        <ReviewReport
          deletePopup={deletePopup}
          setDeletePopup={setDeletePopup}
          docId={docId}
        />
      ) : (
        ""
      )}
    </div>
  );
}
export default ProjectReviewLog;
