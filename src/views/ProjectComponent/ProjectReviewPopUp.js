import React from "react";
import { CModal, CModalBody, CModalHeader, CModalTitle } from "@coreui/react";
import CellRendererPrimeReactDataTable from "../PrimeReactTableComponent/CellRendererPrimeReactDataTable";
import { useState, useEffect } from "react";
import axios from "axios";
import { AiFillDelete } from "react-icons/ai";
import { Column } from "primereact/column";
import { environment } from "../../environments/environment";
import { BiCheck } from "react-icons/bi";
import { BiError } from "react-icons/bi";
import { AiFillWarning } from "react-icons/ai";
import { FaSave } from "react-icons/fa";
import moment from "moment";
// import ProjectReviewLog from "./ProjectReviewTable";
import { IoWarningOutline } from "react-icons/io5";
import { AiOutlineCheck } from "react-icons/ai";
import { AiOutlineClose } from "react-icons/ai";
function ReviewLogPopup({
  openPopup,
  setOpenPopup,
  data,
  updateId,
  reviewerId,
  countData,
  statusId,
  getCountData,
  successfullymsg,
  validationmessage,
  tabledata,
  settabledata,
  updateStatus,
}) {
  const [rowId, setRowId] = useState([]);
  // const [countData, setCountData] = useState([]);
  const [deleteid, setDeleteId] = useState([]);
  const [deletedId, setDeletedId] = useState([]);
  const [headerData, setHeaderData] = useState([]);
  const [selectedId, setSelectedId] = useState([]);
  const baseUrl = environment.baseUrl;
  const [sameDisplay, setSameDisplay] = useState(false);
  const [dataRowId, setDataRowId] = useState([]);
  const [deletePopup, setDeletePopup] = useState(false);
  const [taskstatus, setTaskStatus] = useState([]);
  const [select, setSelect] = useState([]);

  const searchdata = {
    id: "",
    action_status: "",
    updated_by_id: "",
  };
  const [editedData, setEditedData] = useState(searchdata);
  const [status, setStatus] = useState(editedData);

  // const [successfullymsg, setSuccessfullymsg] = useState(false);
  const [deleteMsg, setDeleteMsg] = useState(false);

  let rows = [10];

  // const updateStatus = (count) => {
  //   console.log(count);
  //   setSuccessfullymsg(false);
  // const updateStatus = () => {
  //   console.log(tabledata);
  //   if (
  //     Object.keys(tabledata)?.length === 0 ||
  //     tabledata === null ||
  //     tabledata === undefined
  //   ) {
  //     setvalidationmessage(true);
  //   } else {
  //     setSuccessfullymsg(false);

  //     // Filter the array to include only modified rows
  //     const modifiedRows = countData.filter((item) => item?.modified);
  //     console.log(modifiedRows);

  //     let data = [];
  //     Object?.keys(tabledata)?.forEach((ele) => {
  //       const obj = {};
  //       obj["id"] = +ele;
  //       obj["action_status"] = +tabledata[ele];
  //       obj["updated_by_id"] = +loggedResourceId;
  //       console.log(tabledata);
  //       console.log(tabledata[ele]);
  //       console.log(ele);
  //       data.push(obj);
  //       console.log(data);
  //     });
  //     axios
  //       .post(baseUrl + `/ProjectMS/project/updateActionItemStatus`, data)
  //       .then((res) => {
  //         const data = res.data;

  //         setTaskStatus(data.action_status);

  //         setUpdateData(data);
  //         setvalidationmessage(false);
  //         setSuccessfullymsg(true);
  //         setTimeout(() => {
  //           setSuccessfullymsg(false);
  //         }, 3000);
  //         getCountData();
  //         settabledata();
  //       })
  //       .catch((error) => {});
  //   }
  // };
  // const updateStatus = () => {
  //   console.log(tabledata);

  //   // Check if tabledata is null or undefined
  //   if (tabledata === null || tabledata === undefined) {
  //     setvalidationmessage(true);
  //   } else if (Object.keys(tabledata).length === 0) {
  //     // Check if tabledata is an empty object
  //     setvalidationmessage(true);
  //   } else {
  //     setSuccessfullymsg(false);

  //     // Filter the array to include only modified rows
  //     const modifiedRows = countData.filter((item) => item?.modified);
  //     console.log(modifiedRows);

  //     let data = [];
  //     Object?.keys(tabledata)?.forEach((ele) => {
  //       const obj = {};
  //       obj["id"] = +ele;
  //       obj["action_status"] = +tabledata[ele];
  //       obj["updated_by_id"] = +loggedResourceId;
  //       console.log(tabledata);
  //       console.log(tabledata[ele]);
  //       console.log(ele);
  //       data.push(obj);
  //       console.log(data);
  //     });

  //     axios
  //       .post(baseUrl + `/ProjectMS/project/updateActionItemStatus`, data)
  //       .then((res) => {
  //         const responseData = res.data; // Avoid naming conflict with 'data'

  //         setTaskStatus(responseData.action_status);

  //         // Update other states here...
  //         setvalidationmessage(false);

  //         setSuccessfullymsg(true);
  //         setTimeout(() => {
  //           setSuccessfullymsg(false);
  //         }, 3000);

  //         getCountData(updateId);
  //         settabledata(null); // You may want to reset the tabledata after the update
  //       })
  //       .catch((error) => {
  //         console.error("An error occurred:", error);
  //       });
  //   }
  // };

  const issueDeleteHandler = () => {
    setDeletePopup(true);
  };
  const statusname = [
    {
      value: 1058,
      id: "New",
      label: "85",
    },
    {
      value: 1059,
      id: "In Progress",
      label: "86",
    },
    {
      value: 1060,
      label: "87",
      id: "Completed",
    },
  ];
  const deleteAction = () => {
    setDeleteMsg(false);
    axios
      .delete(baseUrl + `/ProjectMS/project/deleteStatusItem?id=${deletedId}`)
      .then((res) => {
        const del = res.data;
        setDeleteId(del);
        // getCountData();
        setDeleteMsg(true);
        setTimeout(() => {
          setDeleteMsg(false);
        }, 3000);
      });
  };

  // useEffect(() => {
  //   getCountData();
  // }, []);
  const [r, setr] = useState([]);
  useEffect(() => {
    countData[0] && setHeaderData(JSON.parse(JSON.stringify(countData[0])));
  }, [countData]);

  const LinkTemplate = (data) => {
    return (
      <>
        <div
          style={{
            color: "orange",
            textAlign: "center",
            tittle: "delete",
            cursor: "pointer",
          }}
        >
          {/* <button>Delete</button> */}
          <AiFillDelete
            data-toggle="tooltip"
            title="Delete"
            // onClick={deleteAction}
            onClick={() => {
              issueDeleteHandler();

              setDeletedId(data.id);
              // getCountData();
            }}
          />
        </div>
      </>
    );
  };

  const onchange = (e, data) => {
    const { id, value } = e?.target;
    // setDataRowId((prevData) => ({
    //   ...prevData,
    //   [data.id]: e?.target?.value,
    // }));

    // Mark the data as modified
    setDataRowId((prevData) =>
      prevData?.map((item) =>
        item.id === data.id ? { ...item, modified: true } : item
      )
    );

    settabledata((prev) => ({
      ...prev,
      [data.id]: e?.target?.value,
    }));
  };
  const LinkTemplateDropdown = (data) => {
    return (
      <>
        {data.action_status == "1060" ? (
          <div>Completed</div>
        ) : (
          <select
            id="action_status"
            // defaultValue={}
            onChange={(e) => {
              onchange(e, data);
            }}
            // onChange={(e) => {
            //   onchange(e, data); // Call the onchange function with the event and data
            // }}
            defaultValue={data.action_status}
          >
            {/* {statusname.map((Item) => (
          <option
            value={Item.value}
            selected={Item.value == editedData[0]?.action_status ? true : false}
          >
            {Item.id}
          </option>
          
        ))} */}
            <option
              value="1058"
              selected={setStatus.action_status == "1058"}
              // selected={1058 == editedData[0]?.action_status ? true : false}
            >
              New
            </option>
            <option
              value="1059"
              selected={setStatus.action_status == "1059"}

              // selected={status}
            >
              In Progress
            </option>
            <option
              value="1060"
              selected={setStatus.action_status == "1060"}

              // selected={1060 == editedData[2]?.action_status ? true : false}
            >
              Completed
            </option>
          </select>
        )}
      </>
    );
  };

  const LinkDataProps = (data) => {
    return (
      <div title={reviewerId} className="ellipsis tooltip-ex">
        {reviewerId}
      </div>
    );
  };
  const RevComents = (data) => {
    return (
      <div
        data-toggle="tooltip"
        title={data.reviewer_comments}
        className="ellipsis tooltip-ex"
      >
        {data.reviewer_comments}
      </div>
    );
  };
  const LinkMoment = (data) => {
    return (
      <div
        style={{ textAlign: "center" }}
        x
        title={moment(data.date_created).format("DD-MMM-YYYY")}
      >
        {moment(data.date_created).format("DD-MMM-YYYY")}
      </div>
    );
  };
  const LinkMomentDue = (data) => {
    return (
      <div
        style={{ textAlign: "center" }}
        title={moment(data.due_date).format("DD-MMM-YYYY")}
      >
        {moment(data.due_date).format("DD-MMM-YYYY")}
      </div>
    );
  };

  const completedDate = (data) => {
    return (
      <div
        style={{ textAlign: "center" }}
        title={
          data.completed_date == "Invalid date"
            ? ""
            : moment(data.completed_date).format("DD-MMM-YYYY")
        }
      >
        {data.completed_date == null
          ? ""
          : moment(data.completed_date).format("DD-MMM-YYYY")}
      </div>
    );
  };

  const Action = (data) => {
    return (
      <div data-toggle="tooltip" title={data.action}>
        {data.action}
      </div>
    );
  };

  const SerialNo = (data) => {
    return <div style={{ textAlign: "center" }}>{data.SNo}</div>;
  };
  const dynamicColumns = Object.keys(headerData)?.map((col, i) => {
    return (
      <Column
        sortable
        key={col}
        body={
          col == "id"
            ? LinkTemplate
            : col == "action_status"
            ? LinkTemplateDropdown
            : col == "action_statuss"
            ? LinkDataProps
            : col == "date_created"
            ? LinkMoment
            : col == "due_date"
            ? LinkMomentDue
            : col == "completed_date"
            ? completedDate
            : col == "action"
            ? Action
            : col == "SNo"
            ? SerialNo
            : col == "reviewer_comments" && RevComents
        }
        field={col}
        header={headerData[col]}
      />
    );
  });
  function ReviewReport(props) {
    const { deletePopup, setDeletePopup, deleteAction } = props;
    return (
      <div className="deletePopUpReviewLog">
        {/* <Draggable> */}
        <CModal
          visible={deletePopup}
          size="sm"
          className="ui-dialog"
          onClose={() => setDeletePopup(false)}
        >
          <CModalHeader style={{ cursor: "all-scroll" }}>
            <CModalTitle>
              <span className="">Delete Confirmation</span>
            </CModalTitle>
          </CModalHeader>
          <CModalBody>
            <span style={{ textAlign: "center" }}>
              Are you sure you want to delete the Action Item ?
            </span>
            <div className="col-md-12 col-sm-12 col-xs-12 btn-container center my-3">
              <button
                // style={{ border: "1px solid black" }}
                type="delete"
                className="btn btn-primary" // onClick={deleteAction}
                onClick={() => {
                  deleteAction();
                  setDeletePopup(false);
                }}
              >
                <AiOutlineCheck />
                Yes{" "}
              </button>
              <button
                // style={{ border: "1px solid black" }}
                type="button"
                className="btn btn-primary"
                onClick={() => {
                  setDeletePopup(false);
                }}
              >
                <AiOutlineClose />
                No{" "}
              </button>
            </div>
          </CModalBody>
        </CModal>
        {/* </Draggable> */}
      </div>
    );
  }

  return (
    <div>
      <div>
        {validationmessage ? (
          <div className="statusMsg error">
            {" "}
            <span>
              {" "}
              <IoWarningOutline /> Please Change Status Before Saving
            </span>
          </div>
        ) : (
          ""
        )}
        {successfullymsg ? (
          <div className="statusMsg success">
            <span className="errMsg">
              <BiCheck />
              &nbsp; Action status saved successfully
            </span>
          </div>
        ) : (
          ""
        )}
        {sameDisplay ? (
          <div className="statusMsg error">
            <span className="errMsg">
              <AiFillWarning />
              &nbsp; Action status saved successfully
            </span>
          </div>
        ) : (
          ""
        )}

        {deleteMsg ? (
          <div className="statusMsg success">
            <span className="errMsg">
              <BiError />
              &nbsp; Action status Deleted successfully
            </span>
          </div>
        ) : (
          ""
        )}
        <div>
          <span
            className="ft16 mt-3 "
            style={{ color: "#297AB0", fontWeight: "bold" }}
          >
            Action Items:
          </span>
          {/* <FlatPrimeReactTable rows={rows} data={countData} /> */}
          <CellRendererPrimeReactDataTable
            data={countData}
            rows={rows}
            dynamicColumns={dynamicColumns}
            headerData={headerData}
            setHeaderData={setHeaderData}
          />
        </div>
        <div className="col-md-12 col-sm-12 col-xs-12 my-2 btn-container center">
          {" "}
          <button
            className="btn btn-primary"
            onClick={() => {
              // {
              //   status.action_status == "" ||
              //   status.action_status == undefined ||
              //   status.action_status == "null"
              //     ? setSameDisplay(true)
              //     : updateStatus();
              // }
              // setEditedData(data);
              updateStatus();
            }}
          >
            <FaSave /> Save
          </button>
        </div>
      </div>
      {deletePopup ? (
        <ReviewReport
          deletePopup={deletePopup}
          setDeletePopup={setDeletePopup}
          deleteAction={deleteAction}
        />
      ) : (
        ""
      )}
    </div>
  );
}
export default ReviewLogPopup;
