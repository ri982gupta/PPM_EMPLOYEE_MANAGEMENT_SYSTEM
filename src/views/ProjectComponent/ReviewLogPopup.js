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
import { SecurityUpdateWarning } from "@mui/icons-material";
function ReviewLogPopup({
  openPopup,
  setOpenPopup,
  data,
  updateId,
  reviewerId,
  getData,
  statusId,
  grp4Items,
}) {
  const [rowId, setRowId] = useState([]);
  const [countData, setCountData] = useState([]);
  const [deleteid, setDeleteId] = useState([]);
  const [deletedId, setDeletedId] = useState([]);
  const [headerData, setHeaderData] = useState([]);
  const loggedUserId = localStorage.getItem("resId");
  const [selectedId, setSelectedId] = useState([]);
  const baseUrl = environment.baseUrl;
  const [sameDisplay, setSameDisplay] = useState(false);
  const [dataRowId, setDataRowId] = useState([]);
  const [deletePopup, setDeletePopup] = useState(false);
  const [taskstatus, setTaskStatus] = useState([]);
  const [warning, setWarning] = useState(false);
  const [select, setSelect] = useState([]);
  const rows = 10;
  const searchdata = {
    id: "",
    action_status: "",
    updated_by_id: "",
  };
  const [editedData, setEditedData] = useState(searchdata);
  const [status, setStatus] = useState(editedData);
  const [actionId, setActionId] = useState([]);
  const [reviw, setReview] = useState([]);
  const [updateData, setUpdateData] = useState([]);
  const [successfullymsg, setSuccessfullymsg] = useState(false);
  const [deleteMsg, setDeleteMsg] = useState(false);
  const [count, setCount] = useState([{}]);
  const [update, setUpdate] = useState([]);

  const updateStatus = (count) => {
    setSuccessfullymsg(false);
    axios({
      method: "post",
      url: baseUrl + `/ProjectMS/project/updateActionItemStatus`,
      data: {
        id: selectedId == [] ? setWarning(true) : selectedId,
        action_status:
          parseInt(status) === null ? setWarning(true) : parseInt(status),
        updated_by_id: parseInt(loggedUserId),
      },
    })
      .then((res) => {
        const data = res.data;

        setTaskStatus(data.action_status);

        setUpdateData(data);
        getCountData();
        setSuccessfullymsg(true);
        setTimeout(() => {
          setSuccessfullymsg(false);
          setWarning(false);
        }, 1000);
      })
      .catch((error) => {
        setWarning(true);
      });
  };

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
        getCountData();
        getData();
        setDeleteMsg(true);

        setTimeout(() => {
          setDeleteMsg(false);
        }, 3000);
      });
  };

  const getCountData = () => {
    axios
      .get(
        baseUrl +
          `/ProjectMS/project/projectreviewlogTableInfo?ProjectId=${updateId}`
      )

      .then((res) => {
        const GetData = res.data;
        let custom = [];
        GetData.forEach((element) => {
          let obj = {
            value: element.id,
          };
          custom.push(obj);

          setRowId(custom);
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
            Name: "Created By",
            action_status: "Status",
            id: "Action",
          },
        ];
        let headerdata1 = [
          {
            SNo: "S.No",
            action: "Action",
            date_created: "Created Date",
            due_date: "Due Date",
            completed_date: "Completed Date",
            reviewer_comments: "Reviewer Comments",
            Name: "Created By",
          },
        ];
        setSelect(GetData[0].action_status);
        {
          grp4Items[11].is_write == true
            ? setCountData(headerdata1.concat(GetData))
            : setCountData(headerdata1.concat(GetData));
        }

        setCount(GetData);
        setEditedData(GetData);
      });
  };

  useEffect(() => {
    getCountData();
  }, []);
  const [r, setr] = useState([]);
  useEffect(() => {
    countData[0] && setHeaderData(JSON.parse(JSON.stringify(countData[0])));
  }, [countData]);

  const onchange = (e, data) => {
    const { id, value } = e.target;
    setDataRowId((prev) => ({ ...prev, [data.id]: e.target.value }));
    setStatus(e.target.value);
  };

  const LinkTemplate = (data) => {
    return (
      <>
        {grp4Items[11].is_write == true ? (
          <div style={{ textAlign: "center", cursor: "not-allowed" }}>
            {/* <button>Delete</button> */}
            <AiFillDelete
              data-toggle="tooltip"
              title="Delete"
              // onClick={deleteAction}
              // onClick={() => {
              //   issueDeleteHandler();

              //   setDeletedId(data.id);
              //   getCountData();
              // }}
            />
          </div>
        ) : (
          ""
        )}
      </>
    );
  };

  const LinkTemplateDropdown = (data) => {
    return (
      <>
        {grp4Items[11].is_write == true ? (
          <select
            id="action_status"
            // defaultValue={}

            onChange={(e) => {
              setStatus(e.target.value);

              setSelectedId(data.id);
            }}
            defaultValue={data.action_status}
            disabled
          >
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
        ) : (
          <select id="action_status" defaultValue={data.action_status} disabled>
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
    return <div title={data.Name}>{data.Name}</div>;
  };
  const RevComents = (data) => {
    return (
      <div data-toggle="tooltip" title={data.reviewer_comments}>
        {data.reviewer_comments}
      </div>
    );
  };
  const LinkMoment = (data) => {
    return (
      <div title={moment(data.date_created).format("DD-MMM-YYYY")}>
        {moment(data.date_created).format("DD-MMM-YYYY")}
      </div>
    );
  };
  const LinkMomentDue = (data) => {
    return (
      <div title={moment(data.due_date).format("DD-MMM-YYYY")}>
        {moment(data.due_date).format("DD-MMM-YYYY")}
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
  const SNumber = (data) => {
    return (
      <span style={{ textAlign: "center", marginLeft: "45%" }}>{data.SNo}</span>
    );
  };
  const createdBy = (data) => {
    return (
      <div data-toggle="tooltip" title={data.action_statuss}>
        {data.action_statuss}
      </div>
    );
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
            : col == "Name"
            ? LinkDataProps
            : col == "date_created"
            ? LinkMoment
            : col == "due_date"
            ? LinkMomentDue
            : // : col == "reviewer_comments"
            // ? ReviewerComments
            col == "action"
            ? Action
            : col == "reviewer_comments"
            ? RevComents
            : col == "SNo" && SNumber
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
          size="xs"
          className="ui-dialog"
          onClose={() => setDeletePopup(false)}
        >
          <CModalHeader className="">
            <CModalTitle>
              <span className="">Delete Confirmation</span>
            </CModalTitle>
          </CModalHeader>
          <CModalBody>
            <p>Are you sure you want to delete the Action Item ?</p>

            <div className="btn-container center my-2">
              <button
                style={{ border: "1px solid black" }}
                type="delete"
                className="btn"
                // onClick={deleteAction}
                onClick={() => {
                  deleteAction();
                  setDeletePopup(false);
                }}
              >
                {" "}
                Yes{" "}
              </button>
              <button
                style={{ border: "1px solid black" }}
                type="button"
                className="btn"
                onClick={() => {
                  setDeletePopup(false);
                }}
              >
                {" "}
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
      <CModal
        visible={openPopup}
        size="xl"
        className=" ui-dialog"
        onClose={() => setOpenPopup(false)}
        // rows={rows}
      >
        <CModalHeader className="" style={{ cursor: "all-scroll" }}>
          <CModalTitle>
            <span className=""> Review Details </span>
          </CModalTitle>
        </CModalHeader>
        <CModalBody>
          <div>
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
            {warning === true ? (
              <div className="statusMsg error">
                <span className="errMsg">
                  <AiFillWarning />
                  &nbsp; please change the status before Saving
                </span>
              </div>
            ) : (
              ""
            )}

            {sameDisplay ? (
              <div className="statusMsg success">
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
              {/* {permissions == "ORG_FULL"
                ? ""
                : // <button
                  //   className="btn btn-primary disableField"
                  //   style={{ cursor: "not-allowed" }}
                  // >
                  //   <FaSave /> Save
                  // </button>
                  ""} */}
            </div>
          </div>
        </CModalBody>
      </CModal>
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
