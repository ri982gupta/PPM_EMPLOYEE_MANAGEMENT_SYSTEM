import { CModal, CModalBody, CModalHeader, CModalTitle } from "@coreui/react";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { AiFillWarning } from "react-icons/ai";
import { BiSave } from "react-icons/bi";
import { ImCross } from "react-icons/im";
import { environment } from "../../environments/environment";
import Loader from "../Loader/Loader";
import GlobalValidation from "../ValidationComponent/GlobalValidation";

function UpdateBillingPopUp(props) {
  const ref = useRef([]);
  const {
    openPopup,
    setOpenPopup,
    type,
    editdata,
    status,
    handleTableData,
    setAddmsg,
  } = props;
  console.log(editdata);
  const baseUrl = environment.baseUrl;
  const [validationmessage, setValidationMessage] = useState(false);
  const [currentStatus, setCurrentStatus] = useState([]);
  const [details, setDetails] = useState({ updateStatus: "" });
  const [loader, setLoader] = useState(false);
  const abortController = useRef(null);
  console.log(currentStatus);
  const loggedUserId = localStorage.getItem("resId");
  let billingId = editdata.id;
  let billingStatus = details.updateStatus;

  const updateStatus = async () => {
    const valid = GlobalValidation(ref);
    if (valid === true) {
      setValidationMessage(true);
      return;
    }

    setLoader(true);
    abortController.current = new AbortController();

    try {
      const resp = await axios({
        method: "put",
        url: `${baseUrl}/administrationms/updatetask/updatingStatus?id=${billingId}&status=${billingStatus}`,
        signal: abortController.current.signal,
      });

      const update = resp.data;
      setCurrentStatus(update);
      handleTableData();
      setOpenPopup(false);
      setAddmsg(true);
      setLoader(false);

      const historyRes = await axios({
        method: "post",
        url: baseUrl + `/timeandexpensesms/billingTsApprovals/saveHistory`,
        data: {
          billingTsId: editdata?.id,
          projectId: editdata?.project_id,
          status: details.updateStatus,
          approverId: loggedUserId,
        },
      });
      console.log("History Added Successfully:", historyRes.data);

      setTimeout(() => {
        setAddmsg(false);
      }, 3000);
    } catch (error) {
      console.log("Error :", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDetails((prev) => {
      return { ...prev, [name]: value };
    });
  };

  const handleCancel = (e) => {
    setValidationMessage(false);
    setOpenPopup(false);
  };
  const handleAbort = () => {
    abortController.current && abortController.current.abort();
    setLoader(false);
  };

  return (
    <div className="col-md-12">
      <CModal
        alignment="center"
        backdrop="static"
        visible={openPopup}
        size="lg"
        className=" ui-dialog"
        onClose={() => setOpenPopup(false)}
      >
        <CModalHeader className="">
          <CModalTitle>
            {type == "add" ? (
              <span className=""></span>
            ) : (
              <span className="">Update Billing Status </span>
            )}
          </CModalTitle>
        </CModalHeader>
        <CModalBody>
          {validationmessage === true ? (
            <div className="group-content row mb-2 ">
              <div className="statusMsg error">
                <span className="error-block">
                  <AiFillWarning /> Please select the valid values for
                  highlighted fields
                </span>
              </div>
            </div>
          ) : (
            ""
          )}

          <div className="group-content row ">
            <div className=" col-md-6 mb-2">
              <div className="form-group row">
                <label className="col-5" htmlFor="Current Status">
                  Current Status
                </label>
                <span className="col-1 ">:</span>
                <div className="col-6">
                  <input
                    type="text"
                    className="disableField"
                    id="status"
                    name="status"
                    defaultValue={editdata.status}
                    disabled
                  />
                </div>
              </div>
            </div>
            <div className=" col-md-6 mb-2">
              <div className="form-group row">
                <label className="col-5" htmlFor="Customer">
                  Update Status <span className="error-text ml-1"> *</span>
                </label>
                <span className="col-1">:</span>
                <div className="col-6">
                  <select
                    ref={(ele) => {
                      ref.current[0] = ele;
                    }}
                    className="cancel text"
                    name="updateStatus"
                    id="updateStatus"
                    onChange={handleChange}
                  >
                    <option value=""> &lt;&lt;Please Select&gt;&gt;</option>
                    <option value="In PM Review">In PM Review</option>
                    <option value="PM Rejected">PM Rejected</option>
                    <option value="In DM Review">In DM Review</option>
                    <option value="DM Rejected">DM Rejected</option>
                    <option value="In Finance Review">In Finance Review</option>
                    <option value="Finance Accepted">Finance Accepted</option>
                    <option value="Finance Rejected">Finance Rejected</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
          <div className=" form-group col-md-12 col-sm-12 col-xs-12 btn-container center mb-2">
            <button
              className="btn btn-primary"
              type="submit"
              onClick={() => {
                updateStatus();
              }}
            >
              <BiSave size={"1.4em"} /> Save
            </button>
            <button
              className="btn btn-secondary"
              onClick={() => {
                handleCancel();
              }}
            >
              <ImCross /> Cancel
            </button>
          </div>
        </CModalBody>
      </CModal>
      {loader ? <Loader handleAbort={handleAbort} /> : ""}
    </div>
  );
}

export default UpdateBillingPopUp;
