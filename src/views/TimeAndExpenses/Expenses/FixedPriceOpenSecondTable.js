import React from "react";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import FixedPriceOpenDataTable from "./FixedPriceOpenDataTable";
import moment from "moment";

export default function FixedPriceOpenSecondTable(props) {
  const {
    firstTableData,
    PMReview,
    setProjectinfoTab,
    projectInfoTab,
    linkId,
    formData,
    DMReview,
    storegrpahname,
    setLoader,
    FMReview,
    getGraph,
    getDataBsedGrpah,
    setAddmsg,
    setValidationMessage,
    resourceInfo,
    setResourceInfo,
    billDetailsCount,
    reviewerAction,
    getResourceInfo,
    projectInfo,
    headerData,
    initailSumOfBillingAmount,
    totalApprovedHrs,
    setTotalApprovedHrs,
  } = props;
  const billingMonth1 = formData.billingMonth;
  const lastDateOfMonth2 = moment(billingMonth1)
    .endOf("month")
    .format("YYYY-MM-DD");
  const arr = [];

  const initialValues = {
    id: linkId,
    project_id: linkId,
    billing_schedule_id: "",
    status: "",
    bill_action: "",
    billing_amount: "",
    has_discount: "",
    discount_type: "",
    allocFte: 0.0,
    discount_amount: "",
    comments: "",
    from_date: "",
    to_date: "",
    billing_month: "",
    billing_ts_id: "",
    resourceId: "",
    allocType: 187,
    billOtHours: "",
    finalBillRate: "",
    billAmount: "",
    comments: "",
  };
  const [updateddata, setUpdatedata] = useState(initialValues);

  function myFunctions(e) {
    const { value, id } = e.target;
    setUpdatedata((prev) => ({ ...prev, [id]: value }));
    setProjectinfoTab((prevProjectInfoTab) => {
      const updatedProjectInfoTab = [...prevProjectInfoTab];
      updatedProjectInfoTab[0].status = value;
      return updatedProjectInfoTab;
    });
  }
  const loggedUserId = localStorage.getItem("resId");
  const [hideWholetables, setHidewholetables] = useState(true);

  //////////////    PM Review Disabled
  const [isMatchedId, setIsMatchedId] = useState(false);
  let isMatched = false;
  for (const review of PMReview) {
    const prgMgrIds = review.prgMgrId.split(",");
    if (prgMgrIds.includes(loggedUserId.toString())) {
      isMatched = true;
      break;
    }
  }
  useEffect(() => {
    if (isMatched) {
      setIsMatchedId(isMatched);
    } else {
      setIsMatchedId(isMatched);
    }
  }, [isMatched]);

  /////////    DM Review Disabled
  const [isMatchedDMId, setIsMatchedDMId] = useState(false);
  let isMatchedDM = false;

  for (const review of DMReview) {
    const deliveryMgrIds = review.deliveryMgrId.split(",");
    for (const dmreview of deliveryMgrIds) {
      if (dmreview && dmreview === loggedUserId.toString()) {
        isMatchedDM = true;
        break;
      }
    }
  }

  // Now update the state based on whether there is a match or not
  // setIsMatchedDMId(isMatchedDM);

  useEffect(() => {
    if (isMatchedDM) {
      setIsMatchedDMId(isMatchedDM);
    } else {
      setIsMatchedDMId(isMatchedDM);
    }
  }, [isMatchedDM]);

  /////// FM Review Disable and enable
  const [isMatchedFMId, setIsMatchedFMId] = useState(false);

  useEffect(() => {
    if (FMReview.some((item) => item.role_type_id === 126)) {
      if (FMReview.some((item) => [82, 157, 158].includes(item.role_type_id))) {
        setIsMatchedFMId(false);
      } else {
        setIsMatchedFMId(true);
      }
    } else {
      setIsMatchedFMId(false);
    }
  }, []);

  return (
    <>
      <div className="customCard card graph mt-2 mb-2 darkHeader">
        <div className="group mb-1 customCard">
          <div
            className="col-md-12  collapseHeader px-3"
            style={{ backgroundColor: "#f4f4f4" }}
          >
            <h2 style={{ backgroundColor: "#f4f4f4" }}>Project Information</h2>
          </div>
        </div>
        <div className="group-content row mx-2">
          <div className=" col-md-12 mb-2">
            {projectInfoTab.map((list) => (
              <div className="group-content row">
                <div className=" col-md-4 mb-2">
                  <div className="form-group row">
                    <label className="col-5" htmlFor="text-input-inline">
                      Project
                    </label>
                    <span className="col-1">:</span>
                    <div className="col-6">
                      <p
                        className=" ellipsis tooltip-ex"
                        data-toggle="tooltip"
                        title={list.project}
                      >
                        {list.project == null ? "NA" : list.project}
                      </p>
                    </div>
                  </div>
                </div>

                <div className=" col-md-4 mb-2 ">
                  <div className="form-group row">
                    <label className="col-5" htmlFor="text-input-inline">
                      Practice
                    </label>
                    <span className="col-1">:</span>
                    <div className="col-6">
                      <p
                        className=" ellipsis tooltip-ex"
                        data-toggle="tooltip"
                        title={projectInfo[0]?.practiceName}
                      >
                        {projectInfo[0]?.practiceName == null
                          ? "NA"
                          : projectInfo[0]?.practiceName}
                      </p>
                    </div>
                  </div>
                </div>
                <div className=" col-md-4 mb-2">
                  <div className="form-group row">
                    <label className="col-5" htmlFor="text-input-inline">
                      Planned Dates
                    </label>
                    <span className="col-1">:</span>
                    <div className="col-6">
                      <p
                        className=" ellipsis tooltip-ex"
                        data-toggle="tooltip"
                        title={list.planned_dates}
                      >
                        {list.planned_dates == null ? "NA" : list.planned_dates}
                      </p>
                    </div>
                  </div>
                </div>
                <div className=" col-md-4 mb-2">
                  <div className="form-group row">
                    <label className="col-5" htmlFor="text-input-inline">
                      Is Billable
                    </label>
                    <span className="col-1">:</span>
                    <div className="col-6">
                      <p
                        className=" ellipsis tooltip-ex"
                        data-toggle="tooltip"
                        title={list.is_billable}
                      >
                        {list.is_billable == null ? "NA" : list.is_billable}
                      </p>
                    </div>
                  </div>
                </div>
                <div className=" col-md-4 mb-2">
                  <div className="form-group row">
                    <label className="col-5" htmlFor="text-input-inline">
                      Primary PM
                    </label>
                    <span className="col-1">:</span>
                    <div className="col-6">
                      <p
                        className=" ellipsis tooltip-ex"
                        data-toggle="tooltip"
                        title={list.primary_manager}
                      >
                        {list.primary_manager == null
                          ? "NA"
                          : list.primary_manager}{" "}
                      </p>
                    </div>
                  </div>
                </div>
                <div className=" col-md-4 mb-2">
                  <div className="form-group row">
                    <label className="col-5" htmlFor="text-input-inline">
                      Customer
                    </label>
                    <span className="col-1">:</span>
                    <div className="col-6">
                      <p
                        className=" ellipsis tooltip-ex"
                        data-toggle="tooltip"
                        title={list.customer}
                      >
                        {list.customer == null ? "NA" : list.customer}
                        {""}
                      </p>
                    </div>
                  </div>
                </div>
                <div className=" col-md-4 mb-2">
                  <div className="form-group row">
                    <label className="col-5" htmlFor="text-input-inline">
                      Contract Terms:
                    </label>
                    <span className="col-1">:</span>
                    <div className="col-6">
                      <p
                        className=" ellipsis tooltip-ex"
                        data-toggle="tooltip"
                        title={list.contract_terms}
                      >
                        {list.contract_terms == null
                          ? "NA"
                          : list.contract_terms}
                      </p>
                    </div>
                  </div>
                </div>
                {/* change statues  */}

                <div className=" col-md-4 mb-2">
                  {storegrpahname == "In DM Review" ? (
                    <div className="form-group row">
                      <label className="col-5" htmlFor="text-input-inline">
                        Status
                      </label>
                      <span className="col-1">:</span>
                      <div className="col-6">
                        <select
                          id="status"
                          onChange={(e) => myFunctions(e)}
                          value={projectInfoTab[0]?.status}
                          disabled={isMatchedDMId == false}
                        >
                          <option value="In DM Review">In DM Review</option>
                          <option value="DM Rejected">DM Rejected</option>
                          <option value="In Finance Review">
                            In Finance Review
                          </option>
                        </select>
                      </div>
                    </div>
                  ) : storegrpahname == "DM Rejected" ? (
                    <div className="form-group row">
                      <label className="col-5" htmlFor="text-input-inline">
                        Status
                      </label>
                      <span className="col-1">:</span>
                      <div className="col-6">
                        <select
                          id="status"
                          onChange={(e) => myFunctions(e)}
                          value={projectInfoTab[0]?.status}
                          disabled={isMatchedId == false}
                        >
                          <option value="In DM Review">In DM Review</option>
                          <option value="DM Rejected">DM Rejected</option>
                        </select>
                      </div>
                    </div>
                  ) : storegrpahname === "In PM Review" ? (
                    <div className="form-group row">
                      <label className="col-5" htmlFor="text-input-inline">
                        Status
                      </label>
                      <span className="col-1">:</span>
                      <div className="col-6">
                        <select
                          id="status"
                          onChange={(e) => myFunctions(e)}
                          value={projectInfoTab[0]?.status}
                          disabled={isMatchedId == false}
                        >
                          <option value="In PM Review">In PM Review</option>
                          <option value="In DM Review">In DM Review</option>
                        </select>
                      </div>
                    </div>
                  ) : // (isMatchedFMId === true &&
                  storegrpahname === "In Finance Review" ? (
                    <div className="form-group row">
                      <label className="col-5" htmlFor="text-input-inline">
                        Status
                      </label>
                      <span className="col-1">:</span>
                      <div className="col-6">
                        <select
                          id="status"
                          onChange={(e) => myFunctions(e)}
                          value={projectInfoTab[0]?.status}
                          disabled={isMatchedFMId == false}
                        >
                          <option value="In Finance Review">
                            In Finance Review
                          </option>
                          <option value="Finance Rejected">
                            Finance Rejected
                          </option>
                          <option value="Finance Accepted">
                            Finance Accepted
                          </option>
                        </select>
                      </div>
                    </div>
                  ) : // ) : storegrpahname === "In Finance Review" ? (
                  //   <div className="form-group row">
                  //     <label className="col-5" htmlFor="text-input-inline">
                  //       Status
                  //     </label>
                  //     <span className="col-1">:</span>
                  //     <div className="col-6">
                  //       <select
                  //         id="status"
                  //         onChange={(e) => myFunctions(e)}
                  //         value={projectInfoTab[0]?.status}
                  //         disabled
                  //       >
                  //         <option value="In Finance Review">
                  //           In Finance Review
                  //         </option>
                  //         <option value="Finance Rejected">
                  //           Finance Rejected
                  //         </option>
                  //         <option value="Finance Accepted">
                  //           Finance Accept
                  //         </option>
                  //       </select>
                  //     </div>
                  //   </div>
                  storegrpahname === "Finance Accepted" ? (
                    <div className="form-group row">
                      <label className="col-5" htmlFor="text-input-inline">
                        Status
                      </label>
                      <span className="col-1">:</span>
                      <div className="col-6">
                        <select
                          id="status"
                          onChange={(e) => myFunctions(e)}
                          value={projectInfoTab[0]?.status}
                          disabled
                        >
                          <option value="In Finance Review">
                            In Finance Review
                          </option>
                          <option value="Finance Rejected">
                            Finance Rejected
                          </option>
                          <option value="Finance Accepted">
                            Finance Accepted
                          </option>
                        </select>
                      </div>
                    </div>
                  ) : storegrpahname === "Finance Rejected" ? (
                    <div className="form-group row">
                      <label className="col-5" htmlFor="text-input-inline">
                        Status
                      </label>
                      <span className="col-1">:</span>
                      <div className="col-6">
                        <select
                          id="status"
                          onChange={(e) => myFunctions(e)}
                          value={projectInfoTab[0]?.status}
                          disabled={
                            !(isMatchedDMId == true || isMatchedId == true)
                          }
                        >
                          <option value="In Finance Review">
                            In Finance Review
                          </option>
                          <option value="Finance Rejected">
                            Finance Rejected
                          </option>
                          {/* <option value="Finance Accepted">
                            In Finance Accept
                          </option> */}
                        </select>
                      </div>
                    </div>
                  ) : isMatchedFMId === false ? (
                    <div className="form-group row">
                      <label className="col-5" htmlFor="text-input-inline">
                        Status
                      </label>
                      <span className="col-1">:</span>
                      <div className="col-6">
                        <select
                          id="status"
                          onChange={(e) => myFunctions(e)}
                          value={projectInfoTab[0]?.status}
                          disabled
                        >
                          <option value="In Finance Review">
                            In Finance Review
                          </option>
                          <option value="Finance Rejected">
                            Finance Rejected
                          </option>
                          <option value="Finance Accepted">
                            Finance Accepted
                          </option>
                        </select>
                      </div>
                    </div>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* </>:""} */}
      </div>
      <FixedPriceOpenDataTable
        linkId={linkId}
        firstTableData={firstTableData}
        projectInfoTab={projectInfoTab}
        setUpdatedata={setUpdatedata}
        formData={formData}
        updateddata={updateddata}
        setProjectinfoTab={setProjectinfoTab}
        setLoader={setLoader}
        setHidewholetables={setHidewholetables}
        isMatchedId={isMatchedId}
        isMatchedDMId={isMatchedDMId}
        isMatchedFMId={isMatchedFMId}
        getGraph={getGraph}
        getDataBsedGrpah={getDataBsedGrpah}
        setAddmsg={setAddmsg}
        setValidationMessage={setValidationMessage}
        storegrpahname={storegrpahname}
        resourceInfo={resourceInfo}
        setResourceInfo={setResourceInfo}
        billDetailsCount={billDetailsCount}
        reviewerAction={reviewerAction}
        getResourceInfo={getResourceInfo}
        headerData={headerData}
        initailSumOfBillingAmount={initailSumOfBillingAmount}
        totalApprovedHrs={totalApprovedHrs}
        setTotalApprovedHrs={setTotalApprovedHrs}
      />
    </>
  );
}
