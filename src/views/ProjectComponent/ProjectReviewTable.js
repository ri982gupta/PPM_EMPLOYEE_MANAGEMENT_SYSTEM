import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import { CModal } from "@coreui/react";
import { CModalBody } from "@coreui/react";
import { CModalHeader } from "@coreui/react";
import { CModalTitle } from "@coreui/react";
import { Popover, makeStyles } from "@material-ui/core";
import { Link } from "react-router-dom";
// import ReviewLogPopup from "../ProjectComponent/ReviewLogPopup";
import ProjectReviewPopUp from "./ProjectReviewPopUp";
import { MdOutlinePlaylistAdd } from "react-icons/md";
import { environment } from "../../environments/environment";
import FlatPrimeReactTable from "../PrimeReactTableComponent/FlatPrimeReactTable";
import CellRendererPrimeReactDataTable from "../PrimeReactTableComponent/CellRendererPrimeReactDataTable";
import "primeicons/primeicons.css";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.css";
import "primeflex/primeflex.css";
import { Dialog } from "primereact/dialog";
import { Column } from "primereact/column";
import Item from "antd/lib/list/Item";
import * as XLSX from "xlsx";
import Draggable from "react-draggable";
import { Typography } from "antd";
import { ImCross, ImCrying } from "react-icons/im";

function ProjectReviewLog(props) {
  const [openPopup, setOpenPopup] = useState(false);
  const [docId, setDocId] = useState([]);
  const [updateId, setUpdateId] = useState("");
  const [reviewerId, setReviewerId] = useState("");
  const [projectData, setProjectData] = useState([]);
  const [statusId, setStatusId] = useState("");
  const baseUrl = environment.baseUrl;
  const [headerdata, setHeaderdata] = useState([]);
  const [deletePopup, setDeletePopup] = useState(false);
  const { view, setView, projectId, projectName, selectedCustomer } = props;
  const [data, setData] = useState([{}]);
  const [countData, setCountData] = useState([{}]);
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClose = () => {
    setAnchorEl(false);
  };
  //
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
  //   const classes = useStyles();

  const rows = 10;
  const [dataDoc, setDataDoc] = useState([]);
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
      })
      .catch(function (response) {});
  };

  const getData = () => {
    axios
      .get(baseUrl + `/ProjectMS/project/reviewHistory?projectId=${projectId}`)

      .then((res) => {
        const GetData = res.data;

        let headerdata = [
          {
            sno: "S.No",
            review_dt: "Review Date",
            review_st: "Status",
            rev_type: "Type",
            reviewer: "Reviewer",
            actItems: "Action Items",
            docCount: "Report",
            comments: "Comments",
          },
        ];
        for (let i = 0; i < GetData.length; i++) {
          GetData[i]["docCount"] =
            GetData[i]["docCount"] == 0 ? "" : GetData[i]["docCount"];
        }
        setData(headerdata.concat(GetData));
      })
      .catch((error) => {});
  };
  const LinkTemplate = (data) => {
    setReviewerId(data.reviewer);
    setStatusId(data.review_st);
    return (
      <>
        <span
          // className=" ellipsis tooltip-ex"
          // data-toggle="tooltip"
          title={data.actItems}
          style={{ cursor: "pointer", textAlign: "center", color: "#2E88C5" }}
          onClick={() => {
            setOpenPopup(true);
            getCountData(data?.prhId);
            setUpdateId(data.prhId);
            setReviewerId(data.reviewer);
            setStatusId(data.review_st);
          }}
        >
          <div style={{ textAlign: "center" }}>
            {data.actItems !== 0 ? data.actItems : ""}
          </div>
        </span>
      </>
    );
  };
  const getCountData = (id) => {
    if (id !== undefined) {
      axios
        .get(
          baseUrl +
            `/ProjectMS/project/projectreviewlogTableInfo?ProjectId=${id}`
        )

        .then((res) => {
          const GetData = res.data;
          let custom = [];
          GetData.forEach((element) => {
            let obj = {
              value: element.id,
            };
            custom.push(obj);
            // setRowId(custom);
          });

          for (let i = 0; i < GetData.length; i++) {
            GetData[i]["SNo"] = i + 1;
          }
          let headerdata = [
            {
              SNo: "S.No",
              action: "Action",
              date_created: "Created Date",
              due_date: "Due Date",
              completed_date: "Completed Date",
              reviewer_comments: "Reviewer Comments",
              action_statuss: "Created By",
              action_status: "Status",
              id: "Action",
            },
          ];
          // setSelect(GetData[0]?.action_status);
          setCountData(headerdata.concat(GetData));
          // setCount(GetData);
          // setEditedData(GetData);
          setCountData(
            headerdata.concat(
              GetData.map((item) => ({ ...item, modified: false }))
            )
          );
        });
    }
  };
  useEffect(() => {
    getData();
    getProjectOverviewData();
    getCountData();
  }, []);

  const LinkTemplateAction = (data) => {
    return (
      <>
        <span
          className=" ellipsis tooltip-ex"
          data-toggle="tooltip"
          title={data.docCount}
          style={{ cursor: "pointer", textAlign: "center", color: "#2E88C5" }}
          onClick={(e) => {
            issueDeleteHandler();
            setDocId(data.docId);
            setAnchorEl(e.currentTarget);
          }}
        >
          <div style={{ textAlign: "center" }}>{data.docCount}</div>
        </span>
      </>
    );
  };

  const SerialNo = (data) => {
    return <div style={{ textAlign: "center" }}>{data.sno}</div>;
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
  const Reviewer = (data) => {
    return (
      <span
        className=" ellipsis tooltip-ex"
        data-toggle="tooltip"
        title={data.reviewer}
      >
        {data.reviewer}
      </span>
    );
  };
  const RevType = (data) => {
    return (
      <span
        className=" ellipsis tooltip-ex"
        data-toggle="tooltip"
        title={data.rev_type}
      >
        {data.rev_type}
      </span>
    );
  };
  const Status = (data) => {
    return (
      <span
        className=" ellipsis tooltip-ex"
        data-toggle="tooltip"
        title={data.review_st}
      >
        {data.review_st}
      </span>
    );
  };
  const RevDate = (data) => {
    return (
      <div
        className=" ellipsis tooltip-ex"
        data-toggle="tooltip"
        title={data.review_dt}
        style={{ textAlign: "center" }}
      >
        {data.review_dt}
      </div>
    );
  };
  const loggedUserId = localStorage.getItem("resId");
  const initialValue1 = {};
  const [tabledata, settabledata] = useState(initialValue1);
  const [validationmessage, setvalidationmessage] = useState(false);
  const [successfullymsg, setSuccessfullymsg] = useState(false);
  const loggedResourceId = Number(loggedUserId) + 1;

  const updateStatus = () => {
    if (tabledata === null || tabledata === undefined) {
      setvalidationmessage(true);
    } else if (Object.keys(tabledata).length === 0) {
      setvalidationmessage(true);
    } else {
      setSuccessfullymsg(false);

      // Filter the array to include only modified rows
      const modifiedRows = countData.filter((item) => item?.modified);

      let data = [];
      Object?.keys(tabledata)?.forEach((ele) => {
        const obj = {};
        obj["id"] = +ele;
        obj["action_status"] = +tabledata[ele];
        obj["updated_by_id"] = +loggedResourceId;

        data.push(obj);
      });

      axios
        .post(baseUrl + `/ProjectMS/project/updateActionItemStatus`, data)
        .then((res) => {
          const responseData = res.data; // Avoid naming conflict with 'data'

          // Update other states here...
          setvalidationmessage(false);

          setSuccessfullymsg(true);
          setTimeout(() => {
            setSuccessfullymsg(false);
          }, 3000);

          getCountData(updateId);
          settabledata(null); // You may want to reset the tabledata after the update
        })
        .catch((error) => {
          console.error("An error occurred:", error);
        });
    }
  };
  // const LinkTemplate = (data) => {
  //   console.log(data);
  //   return (
  //     <>
  //       <span
  //         className=" ellipsis tooltip-ex"
  //         data-toggle="tooltip"
  //         title={data.actItems}
  //         style={{ cursor: "pointer", textAlign: "center", color: "#2E88C5" }}
  //         onClick={() => {
  //           consoledData();
  //           setUpdateId(data.prhId);
  //           setReviewerId(data.reviewer);
  //           setStatusId(data.review_st);
  //         }}
  //       >
  //         <div style={{ textAlign: "center" }}>
  //           {data.actItems != 0 ? data.actItems : ""}
  //         </div>
  //       </span>
  //     </>
  //   );
  // };

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
            : col == "comments"
            ? Comments
            : col == "reviewer"
            ? Reviewer
            : col == "rev_type"
            ? RevType
            : col == "review_dt"
            ? RevDate
            : col == "review_st" && Status
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

    // const classes = useStyles();

    const { deletePopup, setDeletePopup, docId } = props;

    const dataArray = docId?.split(",")?.map((item) => item?.split(":"));

    dataArray?.map((e) => {});

    const downloadEmployeeData1 = (id, filename) => {
      const docUrl =
        baseUrl + `/CommonMS/document/downloadFile?documentId=${id}`;

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

    const open = Boolean(anchorEl);
    const id = open ? "my-popover" : undefined;
    return (
      <div>
        <Popover
          // className="ResourceOverviewPopover"
          disablePortal={true}
          arrow={true}
          open={Boolean(anchorEl)}
          id={id}
          maxWidth={"lg"}
          // open={open}
          anchorEl={anchorEl}
          onClose={handleClose}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "left",
          }}
          transformOrigin={{
            vertical: "bottom",
            horizontal: "left",
          }}
          className="primeReactPopover"
        >
          <div>
            <div className="popoverHeader">
              <div>
                <b>Documents</b>
              </div>

              <span onClick={handleClose} cursor="pointer">
                ✕
              </span>
            </div>
            <ul className="popoverLinks">
              {dataArray == null ? (
                <li>
                  <a
                    data-toggle="tooltip"
                    // to={`/document/downloadFile?docume`}
                    target="_blank"
                  >
                    undefined
                  </a>
                </li>
              ) : (
                dataArray?.map((e) => (
                  <li>
                    <a
                      className="linkSty"
                      onClick={() => downloadEmployeeData1(e[0], e[1])}
                    >
                      {e[1]}
                    </a>
                  </li>
                ))
              )}
            </ul>
          </div>
        </Popover>
      </div>
    );
  }
  return (
    <CModal
      visible={view}
      size="xl"
      //   className="reviewLogDeletePopUp"
      onClose={() => setView(false)}
      backdrop={"static"}
      maxWidth={"md"}
      classes={{
        paper: classes.dialog,
      }}
    >
      <CModalHeader className="hgt22" style={{ cursor: "all-scroll" }}>
        <CModalTitle>
          <span className="ft16">
            Review History:{selectedCustomer?.projectName}
          </span>
        </CModalTitle>
      </CModalHeader>
      <CModalBody>
        {/* <FlatPrimeReactTable data={data} rows={rows} /> */}

        <CellRendererPrimeReactDataTable
          data={data}
          rows={rows}
          dynamicColumns={dynamicColumns}
          headerData={headerdata}
          setHeaderData={setHeaderdata}
          // exportData={exportData}
          fileName="Project Reviews"
        />
        {anchorEl ? (
          <ReviewReport
            deletePopup={deletePopup}
            setDeletePopup={setDeletePopup}
            docId={docId}
            handleClose={handleClose}
          />
        ) : (
          ""
        )}
        {openPopup && (
          <ProjectReviewPopUp
            // openPopup={openPopup}
            //  setOpenPopup={setOpenPopup}
            updateStatus={updateStatus}
            tabledata={tabledata}
            settabledata={settabledata}
            validationmessage={validationmessage}
            successfullymsg={successfullymsg}
            getCountData={getCountData}
            headerdata={headerdata}
            setHeaderdata={setHeaderdata}
            data={data}
            updateId={updateId}
            reviewerId={reviewerId}
            statusId={statusId}
            countData={countData}
          />
        )}
      </CModalBody>
    </CModal>

    // </div>
  );
}
export default ProjectReviewLog;
