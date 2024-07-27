import { DialogContent, DialogTitle, Popover } from "@mui/material";
import React, { useEffect, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import Tooltip from "@mui/material/Tooltip";
import { InputText } from "primereact/inputtext";
import { RiSave3Fill } from "react-icons/ri";
import axios from "axios";
import { environment } from "../../environments/environment";
import { AiFillWarning } from "react-icons/ai";
import moment from "moment/moment";

export default function MonthlyPRPopOver(props) {
  const {
    setOpenPopOver,
    actionItem,
    Pname,
    close,
    handleClose,
    projetId,
    USerId,
    ItemDate,
    dataAccess,
  } = props;

  const [editedComment, setEditedComment] = useState("");
  const [validationmessage, setValidationMessage] = useState(false);
  const [change, setChange] = useState(false);
  const [modidicationmessage, setModidicationMessage] = useState(false);
  const baseUrl = environment.baseUrl;
  useEffect(() => {
    console.log("in line 18---");
    console.log(actionItem);
  }, []);

  const closeHandler = () => {
    setOpenPopOver(false);
  };

  const open = Boolean(close);
  // setOpenPopOver(false);
  const id = open ? "simple-popover" : undefined;
  const renderTooltip = (rowData, column) => {
    const value = rowData[column.field];
    return (
      <Tooltip title={value} arrow>
        <div
          style={{
            overflow: "hidden",
            whiteSpace: "nowrap",
            textOverflow: "ellipsis",
          }}
        >
          {value}
        </div>
      </Tooltip>
    );
  };
  const CommentsEditor = ({ value, onChange }) => {
    const handleChange = (event) => {
      const newValue = event.target.value;
      setEditedComment(newValue); // Update the editedComment state with the new comment value
      onChange(event); // Call the onChange event to update the value in the DataTable
    };

    return <InputText value={value} onChange={handleChange} />;
  };

  const cellEditor = (options) => {
    if (options.field === "comments")
      return (
        <CommentsEditor
          style={{ width: "10px" }}
          value={options.value}
          onChange={(e) => {
            options.editorCallback(e.target.value);
            actionItem[0]["comments"] = e.target.value;
            setChange(true);
          }}
        />
      );
  };

  console.log(editedComment, "------------------------------");
  console.log(actionItem);
  const saveActionItems = () => {
    if (editedComment == "") {
      setValidationMessage(true);
    } else {
      setValidationMessage(false);

      axios({
        method: "post",
        //    url: baseUrl + `/ProjectMS/PlannedActivities/getCustPlRevProgress`,
        url: baseUrl + `/ProjectMS/PlannedActivities/saveActionItemData`,

        data: {
          comments: editedComment,
          project_id: projetId,
          item_date: ItemDate,
          created_by: USerId,
        },
      })
        .then((resp) => {
          setValidationMessage(false);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };
  const onCellEditComplete = (e) => {};

  const onClickHandler = (event) => {
    if (editedComment != "") {
      saveActionItems();
      handleClose();
    } else {
      saveActionItems();
      // handleClose();
    }
  };
  const handleBodyEntryDt = (data) => {
    return (
      <span id="entryDt" title={data.entryDt}>
        {moment(data.entryDt).format("DD-MMM-YYYY")}
      </span>
    );
  };

  const handleBodyEntryBy = (data) => {
    return (
      <span id="entryBy" title={data.entryBy}>
        {data.entryBy}
      </span>
    );
  };

  const handleBodyItemdate = (data) => {
    return (
      <span id="itemdate" title={data.itemdate}>
        {moment(data.itemdate).format("DD-MMM-YYYY")}
      </span>
    );
  };
  const handleBodyComments = (data) => {
    return (
      <span id="comments" title={data.comments}>
        {data.comments}
      </span>
    );
  };
  console.log(dataAccess);
  return (
    <div>
      {actionItem[0] != undefined && (
        <Popover
          id={id}
          open={open}
          onClose={handleClose}
          close={handleClose}
          anchor={{
            top: "257px !important",
            left: "255px !important",
            position: "bottom !important",
          }}
          size="xl"
        >
          <div
            className="montlyPrPopup"
            style={{ width: "810px", height: "115px" }}
          >
            {validationmessage == true ? (
              <div className="statusMsg error">
                <AiFillWarning size="1.4em" />
                <span>
                  Please select the valid values for highlighted fields
                </span>
              </div>
            ) : (
              ""
            )}

            {modidicationmessage == true ? (
              <div className="statusMsg error">
                <AiFillWarning size="1.4em" />
                <span>No Modifications found to save</span>
              </div>
            ) : (
              ""
            )}

            <DialogTitle className="header padding">
              <div
                className="col-md-12"
                style={{ height: "28px", marginTop: "-21px" }}
              >
                <span
                  align="center"
                  style={{ fontSize: "13px", top: "250px", color: "#2E88C5" }}
                >
                  {Pname}
                </span>
                <button
                  title="Close"
                  style={{
                    float: "right",
                    // marginRight: "-10px",
                    height: "33px",
                    width: "23px",
                  }}
                  className="button1"
                  onClick={handleClose}
                >
                  x
                </button>
              </div>
            </DialogTitle>

            <DialogContent>
              <div className="darkHeader">
                <DataTable
                  value={actionItem}
                  tableStyle={{ minWidth: "38rem" }}
                  showGridlines
                  editMode="cell"
                >
                  <Column
                    field="entryDt"
                    header="Entry Date"
                    body={handleBodyEntryDt}
                  ></Column>
                  <Column
                    field="entryBy"
                    header="Entry By"
                    body={handleBodyEntryBy}
                  ></Column>
                  <Column
                    field="itemdate"
                    header="Item Date"
                    body={handleBodyItemdate}
                  ></Column>
                  {
                    <Column
                      field="comments"
                      header="Comments"
                      body={handleBodyComments}
                      editor={(options) => cellEditor(options)}
                      onCellEditComplete={onCellEditComplete}
                    ></Column>
                  }
                  {
                    <Column
                      field=""
                      header="Action Item"
                      body={
                        <center>
                          <a style={{ cursor: "pointer" }}>
                            <RiSave3Fill
                              onClick={onClickHandler}
                              title="Save"
                            />
                          </a>
                        </center>
                      }
                    ></Column>
                  }
                </DataTable>
              </div>
            </DialogContent>
          </div>
        </Popover>
      )}
    </div>
  );
}
