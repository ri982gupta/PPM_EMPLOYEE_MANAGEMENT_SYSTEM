import React, { useEffect, useState } from "react";
import axios from "axios";
import { environment } from "../../environments/environment";
import { Link } from "react-router-dom";
import moment from "moment";
import { BiCheck, BiX } from "react-icons/bi";
import "react-datepicker/dist/react-datepicker.css";
import {
  AiFillWarning,
  AiOutlineLeftSquare,
  AiOutlineRightSquare,
} from "react-icons/ai";
import ForecastProjectPopUp from "./ForecastProjectPopUp";
import ResourceMRFTable from "../FullfimentComponent/ResourceMRFTable";
import { DialogContent, DialogTitle, Popover } from "@material-ui/core";
import "../FullfimentComponent/ResourceOverviewTable.scss";

function RevenueForecastCalenderPopUp(props) {
  const {
    tabledata,
    formData,
    setFormData,
    linkId,
    setLinkId,
    name,
    setName,
    month,
    setMonth,
    formattedMonth,
    setCapType,
    capType,
    anchorEl,
    handleClose,
    setAnchorEl,
    setActionItemsTable,
    actionItemsTable,
    dataAccess,
  } = props;
  const [resourcePopUp, setResourcePopUp] = useState(false);
  const baseUrl = environment.baseUrl;

  function ActionItemsTable(props) {
    const { linkId, setAnchorEl } = props;
    const [resourcedata, setResourcedata] = useState([]);
    const [employeeid, setEmployeeId] = useState("");
    const [addmsg, setAddmsg] = useState(false);
    const [deleteMessage, setDeleteMessage] = useState(false);
    const [saveactionmessage, setSaveActionMessage] = useState(false);
    const [validationmessage, setValidationMessage] = useState(false);

    const handleClick1 = () => {
      setEmployeeId(linkId);
      axios({
        method: "get",
        url:
          baseUrl +
          `/fullfilmentms/resourceoverview/ActionTable?resource_id=${linkId}`,
      }).then((response) => {
        let GetData = response.data;
        setResourcedata(GetData);
      });
    };
    useEffect(() => {
      handleClick1();
    }, [linkId]);
    return (
      <>
        <div className="col-md-12">
          <div>
            {saveactionmessage ? (
              <div className="statusMsg success">
                <BiCheck />
                {"Action Item Saved Successfully"}
              </div>
            ) : (
              ""
            )}
            {addmsg ? (
              <div className="statusMsg success">
                <BiCheck />
                {"Updated Successfully"}
              </div>
            ) : (
              ""
            )}
            {validationmessage ? (
              <div className="statusMsg error">
                <AiFillWarning />
                {"Please provide valid values for highlighted values"}
              </div>
            ) : (
              ""
            )}
            {deleteMessage ? (
              <div className="statusMsg success">
                <span className="errMsg">
                  <BiCheck size="1.4em" strokeWidth={{ width: "100px" }} />{" "}
                  &nbsp; Action Item Deleted successfully
                </span>
              </div>
            ) : (
              ""
            )}
          </div>
          <div className="col-md-12 mt-2 mb-2">
            <div className="collapseHeader revForcast">
              <div className="leftSection">
                <span style={{ color: "#15a7ea" }}>Action Items ({name})</span>
              </div>
            </div>
          </div>
          <div className="resourceOverviewEmp">
            <ResourceMRFTable
              resid={linkId}
              handleClick1={handleClick1}
              resourcedata={resourcedata}
              setResourcedata={setResourcedata}
              setDeleteMessage={setDeleteMessage}
              setSaveActionMessage={setSaveActionMessage}
              employeeid={employeeid}
              setValidationMessage={setValidationMessage}
              saveactionmessage={saveactionmessage}
              validationmessage={validationmessage}
              addmsg={addmsg}
              setAddmsg={setAddmsg}
              dataAccess={dataAccess}
            />
          </div>
        </div>
      </>
    );
  }
  function ResourceRevenue(props) {
    const { formData, linkId, name, month, setMonth } = props;
    const [resourceTable, setResourceTable] = useState([]);
    const loggedUserId = localStorage.getItem("resId");
    const [capType, setCapType] = useState([
      { value: "allocations", label: "Allocation Hrs" },
      { value: "assigned", label: "Assigned Hrs" },
      { value: "actualHrs", label: "Actual Hrs" },
      { value: "approvedHrs", label: "Approved Hrs" },
      { value: "unapprovedHrs", label: "Unapproved Hrs" },
      { value: "unassigned", label: " Allocation - Assigned Hrs" },
      { value: "allocAct", label: "Allocation - Actual Hrs" },
      { value: "allocAppr", label: " Allocation - Approved Hrs" },
      { value: "assAct", label: " Assigned - Actual Hrs" },
      { value: "assAppr", label: " Assigned - Approved Hrs" },
      { value: "actAppr", label: " Actual - Approved Hrs" },
    ]);
    const initialValue = {
      resourcealloctype: "all",
      resourcecapType: formData?.captype,
      FromDt: moment(month).format("yyyy-MM-DD"),
    };
    const [resourcedata, SetResourceData] = useState(initialValue);
    let formattedMonth = moment(month).format("yyyy-MM-DD");

    const dates = {
      fromDate: moment(formattedMonth).startOf("month").format("YYYY-MM-DD"),
      toDate: moment(formattedMonth)
        .startOf("month")
        .add("month", 0)
        .format("YYYY-MM-DD"),
    };
    const [dt, setDt] = useState(dates);

    const addHandler = () => {
      setDt((prev) => ({
        ...prev,
        ["fromDate"]: moment(dt.fromDate).add("month", 1).format("YYYY-MM-DD"),
      }));
      setDt((prev) => ({
        ...prev,
        ["toDate"]: moment(dt.toDate).add("month", 1).format("YYYY-MM-DD"),
      }));
    };

    const subtractHandler = () => {
      setDt((prev) => ({
        ...prev,
        ["fromDate"]: moment(dt.fromDate)
          .subtract("month", 1)
          .format("YYYY-MM-DD"),
      }));
      setDt((prev) => ({
        ...prev,
        ["toDate"]: moment(dt.toDate).subtract("month", 1).format("YYYY-MM-DD"),
      }));
    };
    const getResourceTable = (e) => {
      setResourceTable([]);
      axios({
        method: "post",
        url:
          baseUrl +
          `/revenuemetricsms/metrics/getResourceTable`,
        data: {
          Src: "project",
          Typ: resourcedata.resourcecapType,
          ObjectId: linkId,
          FromDt: dt.toDate,
          AllocType: resourcedata.resourcealloctype,
          PrjSource: "-1",
          contTerms: formData.ContractTerms,
          engComps: formData.EngCompany,
          cslIds: formData.Csl,
          dpIds: formData.Dp,
          UserId: loggedUserId,
        },
      }).then(function (res) {
        setResourceTable(res.data);
      });
    };

    const [componentMounted, setComponentMounted] = useState(false);

    useEffect(() => {
      if (componentMounted) {
        getResourceTable();
      } else {
        setComponentMounted(true);
      }
    }, [
      resourcedata.resourcealloctype,
      resourcedata.resourcecapType,
      dt.toDate,
      componentMounted,
    ]);

    return (
      <div>
        <div className="">
          <div className="col-md-12 mt-2">
            <div className="collapseHeader revForcast">
              <div className="leftSection">
                <span>{name}</span>
                <select
                  id="resourcecapType"
                  name="resourcecapType"
                  defaultValue={formData.captype}
                  onChange={(e) =>
                    SetResourceData((prev) => ({
                      ...prev,
                      ["resourcecapType"]: e.target.value,
                    }))
                  }
                >
                  {capType?.map((Item) => (
                    <option
                      selected={formData.captype.value}
                      value={Item.value}
                      key={Item.label}
                    >
                      {Item.label}
                    </option>
                  ))}
                </select>
                <select
                  className="resourcealloctype"
                  id="resourcealloctype"
                  onChange={(e) => {
                    SetResourceData((prev) => ({
                      ...prev,
                      ["resourcealloctype"]: e.target.value,
                    }));
                  }}
                >
                  <option value="all">&lt;&lt;ALL&gt;&gt;</option>
                  <option value="billable">Billable</option>
                  <option value="nonBillUtil">Non Billable Utilized</option>
                  <option value="nonBillShad">Non Billable Shadow</option>
                  <option value="nonBillEnb">Non Billable Enabled</option>
                  <option value="nonBillCliPrep">
                    Non Billable Client Prep
                  </option>
                  <option value="nonBillNonUtil">
                    Non Billable Non Utilized
                  </option>
                  <option value="nonBillInnov">Non-billable Innovation</option>
                </select>
              </div>
              <div className="rightSection">
                <span className="ml-2 chevronContainer">
                  <AiOutlineLeftSquare
                    cursor="pointer"
                    size={"2em"}
                    onClick={subtractHandler}
                  />
                  <span>{moment(dt.toDate).format("MMM-YYYY")}</span>
                  <AiOutlineRightSquare
                    cursor="pointer"
                    size={"2em"}
                    onClick={addHandler}
                  />
                </span>
              </div>
            </div>
          </div>
          <div className="col-md-12">
            <ForecastProjectPopUp
              linkId={linkId}
              data={resourceTable}
              expandedCols={[]}
              colExpandState={[]}
              month={month}
              setMonth={setMonth}
              resourcedata={resourcedata}
            />
          </div>
        </div>
      </div>
    );
  }
  const open = Boolean(anchorEl);
  const id = open ? "my-popver" : undefined;

  return (
    <div className="">
      <Popover
        id={id}
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
      >
        <div className="resourcePopup">
          <DialogTitle>
            <span>{name}</span>
            <BiX onClick={handleClose} />
          </DialogTitle>
          <DialogContent>
            <ul>
              <li>
                <Link to={`/resource/profile/:${linkId}`} target="_blank">
                  View Resource's Profile
                </Link>
              </li>
              {props.formData?.captype == "capacity" ? (
                ""
              ) : (
                <li>
                  <Link
                    onClick={() => {
                      setResourcePopUp(true);
                      setAnchorEl(false);
                    }}
                  >
                    View Resource's{" "}
                    {props.formData?.captype == "allocations"
                      ? "Allocation"
                      : props.formData?.captype == "assigned"
                      ? "Assignments"
                      : props.formData?.captype == "actualHrs"
                      ? "Actual Hrs"
                      : props.formData?.captype == "approvedHrs"
                      ? "Approved Hrs"
                      : props.formData?.captype == "unapprovedHrs"
                      ? "Unapproved Hrs"
                      : props.formData?.captype == "unassigned"
                      ? "Allocation - Assigned Hrs"
                      : props.formData?.captype == "allocAct"
                      ? "Allocation - Actual Hrs"
                      : props.formData?.captype == "allocAppr"
                      ? "Allocation - Approved Hrs"
                      : props.formData?.captype == "assAct"
                      ? "Assigned - Actual Hrs"
                      : props.formData?.captype == "assAppr"
                      ? "Assigned - Approved Hrs"
                      : props.formData?.captype == "actAppr"
                      ? "Actual - Approved Hrs"
                      : ""}
                  </Link>
                </li>
              )}
              <li>
                <Link
                  onClick={() => {
                    setActionItemsTable(true);
                    setAnchorEl(false);
                    // handleClick1();
                  }}
                >
                  Action Items
                </Link>
              </li>
            </ul>
          </DialogContent>
        </div>
      </Popover>

      {actionItemsTable ? (
        <ActionItemsTable
          linkId={linkId}
          setLinkId={setLinkId}
          name={name}
          setAnchorEl={setAnchorEl}
        />
      ) : resourcePopUp ? (
        <ResourceRevenue
          resourcePopUp={resourcePopUp}
          setResourcePopUp={setResourcePopUp}
          tabledata={tabledata}
          formData={formData}
          setFormData={setFormData}
          linkId={linkId}
          setLinkId={setLinkId}
          name={name}
          setName={setName}
          month={month}
          setMonth={setMonth}
          formattedMonth={formattedMonth}
          setCapType={setCapType}
          capType={capType}
          setAnchorEl={setAnchorEl}
        />
      ) : (
        ""
      )}
    </div>
  );
}
export default RevenueForecastCalenderPopUp;
