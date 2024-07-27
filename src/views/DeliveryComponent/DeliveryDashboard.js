import React, { useState, useEffect } from "react";
import axios from "axios";
import { environment } from "../../environments/environment";
import { RiProfileLine } from "react-icons/ri";
import moment from "moment";
import ScreenBreadcrumbs from "../Common/ScreenBreadcrumbs";

function DeliveryDashboard(props) {
  const loggedUserId = localStorage.getItem("resId");
  const { engagementId } = props;
  const [data, setdata] = useState([{}]);
  const [data1, setdata1] = useState([{}]);
  let url = window.location.href;
  let customerArr = url.split(":");
  console.log(customerArr[customerArr.length - 1], "*******");
  const baseUrl = environment.baseUrl;
  const getdata = () => {
    axios
      .get(
        baseUrl +
          `/ProjectMS/DeliveryDashboard/dashboardinfo?engagementId=${engagementId}`
      )
      .then((res) => {
        const Getdata = res.data;
        setdata(Getdata);
      })
      .catch((res) => {});
  };
  const tabAccess = () => {
    axios
      .get(
        baseUrl +
          `/CommonMS/master/getTabMenus?ProjectId=${engagementId}&loggedUserId=${loggedUserId}&type=Customer`
      )
      .then((res) => {
        const Getdata = res.data;
        setdata1(Getdata);
      })
      .catch((res) => {});
  };
  useEffect(() => {
    getdata();
    tabAccess();
  }, [engagementId]);

  const [routes, setRoutes] = useState([]);
  let textContent = "Delivery";
  let currentScreenName = ["Engagement Search", "Engagements"];

  useEffect(() => {
    getMenus();
  }, []);

  const getMenus = () => {
    // setMenusData

    axios({
      method: "GET",
      url: baseUrl + `/CommonMS/master/getMenus?loggedUserId=${loggedUserId}`,
    }).then((resp) => {
      let data = resp.data;

      data.forEach((item) => {
        if (item.display_name === textContent) {
          setRoutes([item]);
        }
      });
    });
  };

  return (
    <div>
      <div className="pageTitle">
        <div className="childOne"></div>
        <div className="childTwo">
          <h2>Engagements</h2>
        </div>
        <div className="childThree"></div>
      </div>
      <ScreenBreadcrumbs
        routes={routes}
        currentScreenName={currentScreenName}
      />
      {data.map((Details) => (
        <div className="customCard  mt-2 mb-2">
          <div className="group mb-1 customCard ">
            <div
              className="col-md-12  collapseHeader px-3"
              style={{ backgroundColor: "#f4f4f4" }}
            >
              <h2 style={{ backgroundColor: "#f4f4f4" }}>
                <RiProfileLine /> Basic Information
              </h2>
            </div>
          </div>
          <div className="group-content row mx-2">
            <div className=" col-md-4 mb-2">
              <div className="form-group row ellipsis">
                <label className="col-5" htmlFor="name-input-inline">
                  Engagement Code
                </label>
                <span className="col-1 p-0">: </span>
                <p className="col-6 ellipsis" title={Details.code}>
                  {Details.code}
                </p>
              </div>
            </div>
            <div className=" col-md-4 mb-2">
              <div className="form-group row ellipsis">
                <label className="col-5" htmlFor="name-input-inline">
                  Name
                </label>
                <span className="col-1 p-0">:</span>
                <p className="col-6 ellipsis" title={Details.tname}>
                  {Details.tname}
                </p>
              </div>
            </div>
            <div className=" col-md-4 mb-2">
              <div className="form-group row">
                <label className="col-5" htmlFor="name-input-inline">
                  Customer
                </label>
                <span className="col-1 p-0">:</span>
                <p className="col-6 ellipsis" title={Details.Customer}>
                  {" "}
                  {Details.Customer}
                </p>
              </div>
            </div>
            <div className=" col-md-4 mb-2">
              <div className="form-group row">
                <label className="col-5" htmlFor="name-input-inline">
                  Division
                </label>
                <span className="col-1 p-0">:</span>
                <p className="col-6 ellipsis" title={Details.division}>
                  {" "}
                  {Details.division}
                </p>
              </div>
            </div>
            <div className=" col-md-4 mb-2">
              <div className="form-group row ellipsis">
                <label className="col-5" htmlFor="name-input-inline">
                  Engagement Type
                </label>
                <span className="col-1 p-0">:</span>
                <p className="col-6 ellipsis" title={Details.engagementType}>
                  {Details.engagementType}
                </p>
              </div>
            </div>
            <div className=" col-md-4 mb-2">
              <div className="form-group row ">
                <label className="col-5 " htmlFor="name-input-inline">
                  Start Date
                </label>
                <span className="col-1 p-0">:</span>
                <p
                  className="col-6 "
                  title={moment(Details.startDt).format("DD-MMM-YYYY")}
                >
                  {Details.startDt == null
                    ? "NA"
                    : moment(Details.startDt).format("DD-MMM-YYYY")}
                </p>
              </div>
            </div>
            <div className=" col-md-4 mb-2">
              <div className="form-group row">
                <label className="col-5" htmlFor="name-input-inline">
                  End Date
                </label>
                <span className="col-1 p-0">:</span>
                <p
                  className="col-6"
                  title={moment(Details.endDt).format("DD-MMM-YYYY")}
                >
                  {Details.endDt == null
                    ? "NA"
                    : moment(Details.endDt).format("DD-MMM-YYYY")}
                </p>
              </div>
            </div>
            <div className=" col-md-4 mb-2">
              <div className="form-group row ellipsis">
                <label className="col-5" htmlFor="name-input-inline">
                  Manager
                </label>
                <span className="col-1 p-0">:</span>
                <p className="col-6 ellipsis" title={Details.firstName}>
                  {Details.firstName}
                </p>
              </div>
            </div>
            <div className=" col-md-4 mb-2">
              <div className="form-group row">
                <label className="col-5" htmlFor="name-input-inline">
                  Sales Executive
                </label>
                <span className="col-1 p-0">:</span>
                <p className="col-6 ellipsis" title={Details.execFirstName}>
                  {Details.execFirstName}
                </p>
              </div>
            </div>
            <div className=" col-md-4 mb-2">
              <div className="form-group row">
                <label className="col-5" htmlFor="name-input-inline">
                  Cost Center
                </label>
                <span className="col-1 p-0">:</span>
                <p
                  className="col-6 ellipsis"
                  title={Details.costCenterId || "NA"}
                >
                  {Details.costCenterId || "NA"}
                </p>
              </div>
            </div>
            <div className=" col-md-4 mb-2">
              <div className="form-group row">
                <label className="col-5" htmlFor="name-input-inline">
                  Currency
                </label>
                <span className="col-1 p-0">:</span>
                <p className="col-6 ellipsis" title={Details.currency || "NA"}>
                  {Details.currency || "NA"}
                </p>
              </div>
            </div>
            <div className=" col-md-4 mb-2">
              <div className="form-group row">
                <label className="col-5" htmlFor="name-input-inline">
                  Status
                </label>
                <span className="col-1 p-0">:</span>
                <p
                  className="col-6 ellipsis"
                  title={Details.Status == false ? "Inactive" : "Active"}
                >
                  {Details.Status == false ? "Inactive" : "Active"}
                </p>
              </div>
            </div>
            <div className="col-md-4 mb-2">
              <div className="form-group row">
                <label className="col-5" htmlFor="name-input-inline">
                  Salesforce Link
                </label>
                <span className="col-1 p-0">:</span>
                <p
                  className="col-6 ellipsis"
                  title={Details.sfopportunityLink || "NA"}
                >
                  {Details.sfopportunityLink || "NA"}
                </p>
              </div>
            </div>

            <div className=" col-md-4 mb-2">
              <div className="form-group row">
                <label className="col-5" htmlFor="name-input-inline">
                  PO Number
                </label>
                <span className="col-1 p-0">:</span>
                <p className="col-6 ellipsis" title={Details.poNumber || "NA"}>
                  {Details?.poNumber || "NA"}
                </p>
              </div>
            </div>
            <div className=" col-md-4 mb-2">
              <div className="form-group row">
                <label className="col-5" htmlFor="name-input-inline">
                  Eng.Company
                </label>
                <span className="col-1 p-0">:</span>
                <p
                  className="col-6 ellipsis"
                  title={Details.engCompanyName || "NA"}
                >
                  {Details.engCompanyName || "NA"}
                </p>
              </div>
            </div>
          </div>
        </div>
      ))}

      {data.map((Details) => (
        <div className="customCard   mt-2 mb-2">
          <div className="group mb-1 customCard">
            <div
              className="col-md-12  collapseHeader px-3"
              style={{ backgroundColor: "#f4f4f4" }}
            >
              <h2 style={{ backgroundColor: "#f4f4f4" }}>
                <RiProfileLine /> Industry and Capability Compliance
              </h2>
            </div>
          </div>
          <div className="group-content row mx-2">
            <div className=" col-md-4 mb-2">
              <div className="form-group row">
                <label className="col-5" htmlFor="name-input-inline">
                  Industry Solution
                </label>
                <span className="col-1 p-0">:</span>
                <p
                  className="col-6 ellipsis"
                  title={Details.industrySolutionsVal || "NA"}
                >
                  {Details.industrySolutionsVal || "NA"}
                </p>
              </div>
            </div>
            <div className=" col-md-4 mb-2">
              <div className="form-group row">
                <label className="col-5" htmlFor="name-input-inline">
                  Value Add Tasks
                </label>
                <span className="col-1 p-0">:</span>
                <p
                  className="col-6 ellipsis"
                  title={Details.valueAddedTasks || "NA"}
                >
                  {Details.valueAddedTasks || "NA"}
                </p>
              </div>
            </div>
          </div>
        </div>
      ))}

      <div className="col-md-12 customCard   mt-2 mb-2">
        <div className="group mb-1 customCard">
          <div
            className="col-md-12  collapseHeader px-3"
            style={{ backgroundColor: "#f4f4f4" }}
          >
            <h2 style={{ backgroundColor: "#f4f4f4" }}>
              <RiProfileLine /> Billing Information
            </h2>
          </div>
        </div>
        {data.map((Details) => (
          <div className="row">
            {/* <div className="row "> */}
            <div className="col-md-4 ">
              <div className="customCard   mt-2 mb-2 ml-2">
                <div className="group mb-1 customCard">
                  <div
                    className="col-md-12  collapseHeader px-3"
                    style={{ backgroundColor: "#f4f4f4" }}
                  >
                    <h2 style={{ backgroundColor: "#f4f4f4" }}>
                      Bill to Details
                    </h2>
                  </div>
                </div>
                <div className="group-content row mx-2">
                  <div className="mb-2 col-md-12">
                    <div className="form-group row ">
                      <label className="col-5" htmlFor="name-input-inline">
                        Attn.
                      </label>
                      <span className="col-1 p-0 mx-2">:</span>
                      <p
                        className="col-4 ellipsis"
                        title={Details.attn || "NA"}
                      >
                        {Details.attn || "NA"}
                      </p>
                    </div>
                  </div>
                  <div className="mb-2 col-md-12">
                    <div className="form-group row ">
                      <label className="col-5" htmlFor="name-input-inline">
                        Address Line
                      </label>
                      <span className="col-1 p-0 mx-2">:</span>
                      <p
                        className="col-5 ellipsis"
                        title={Details.addressLine || "NA"}
                      >
                        {Details.addressLine || "NA"}
                      </p>
                    </div>
                  </div>
                  <div className="mb-2 col-md-12">
                    <div className="form-group row">
                      <label className="col-5" htmlFor="name-input-inline">
                        City
                      </label>
                      <span className="col-1 p-0 mx-2">:</span>
                      <p
                        className="col-5 ellipsis"
                        title={Details.city || "NA"}
                      >
                        {Details.city || "NA"}
                      </p>
                    </div>
                  </div>
                  <div className="mb-2 col-md-12">
                    <div className="form-group row ellipsis">
                      <label className="col-5" for="name-input-inline">
                        State/Province
                      </label>
                      <span className="col-1 p-0 mx-2">:</span>
                      <p
                        className="col-5 ellipsis"
                        title={Details.state || "NA"}
                      >
                        {Details.state || "NA"}
                      </p>
                    </div>
                  </div>
                  <div className="mb-2 col-md-12">
                    <div className="form-group row ellipsis">
                      <label className="col-5" for="name-input-inline">
                        ZIP/Postal Code
                      </label>
                      <span className="col-1 p-0 mx-2">:</span>
                      <p
                        className="col-5 ellipsis"
                        title={Details.zipCode || "NA"}
                      >
                        {Details.zipCode || "NA"}
                      </p>
                    </div>
                  </div>
                  <div className="mb-2 col-md-12">
                    <div className="form-group row ">
                      <label className="col-5" for="name-input-inline">
                        Country
                      </label>
                      <span className="col-1 p-0 mx-2">:</span>
                      <p
                        className="col-5 ellipsis"
                        title={Details.country || "NA"}
                      >
                        {Details.country || "NA"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* <div className="row"> */}
            <div className="col-md-8">
              <div className="customCard   mt-2 mb-2 mr-2">
                <div className="group mb-1 customCard">
                  <div
                    className="col-md-12  collapseHeader px-3"
                    style={{ backgroundColor: "#f4f4f4" }}
                  >
                    <h2 style={{ backgroundColor: "#f4f4f4" }}>
                      Invoicing Details
                    </h2>
                  </div>
                </div>
                {/* <h2 style={{ backgroundColor: "#f4f4f4" }}>Invoice Details</h2> */}
                <div className="row">
                  <div className="col-md-6 mt-1">
                    <div className=" form-group row mx-2 mb-2">
                      <div className="col-md-12">
                        <div className="form-group row mt-1">
                          <label className="col-5" htmlFor="name-input-inline">
                            Payment Terms
                          </label>
                          <span className="col-1 p-0">:</span>
                          <p
                            className="col-5 ellipsis"
                            title={Details.paymentTerms || "NA"}
                          >
                            {Details.paymentTerms || "NA"}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="form-group row mx-2 mb-2">
                      <div className="col-md-12">
                        <div className="form-group row mt-1">
                          <label className="col-5" htmlFor="name-input-inline">
                            Invoice Cycle
                          </label>
                          <span className="col-1 p-0">:</span>
                          <p
                            className="col-5 ellipsis"
                            title={Details.invoiceCycle || "NA"}
                          >
                            {Details.invoiceCycle || "NA"}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="form-group row mx-2 mb-2">
                      <div className="col-md-12 ">
                        <div className="form-group row mt-1">
                          <label className="col-5" htmlFor="name-input-inline">
                            Invoice Culture
                          </label>
                          <span className="col-1 p-0">:</span>
                          <p
                            className="col-5 ellipsis"
                            title={Details.invoiceCultureId || "NA"}
                          >
                            {Details.invoiceCulture || "NA"}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="form-group row mx-2 mb-2">
                      <div className="col-md-12 ">
                        <div className="form-group row ellipsis mt-1">
                          <label className="col-5" htmlFor="name-input-inline">
                            Invoice Template
                          </label>
                          <span className="col-1 p-0">:</span>
                          <p
                            className="col-5 ellipsis"
                            title={Details.invoiceTemplate || "NA"}
                          >
                            {Details.invoiceTemplate || "NA"}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="form-group row mx-2 mb-2">
                      <div className="col-md-12 ">
                        <div className="form-group row mb-4 mt-1">
                          <label className="col-5" htmlFor="name-input-inline">
                            Invoice Time
                          </label>
                          <span className="col-1 p-0">:</span>
                          <p
                            className="col-5 ellipsis"
                            title={Details.invoiceTime || "NA"}
                          >
                            {Details.invoiceTime || "NA"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6 mt-2">
                    <div className="mb-2 row col-md-12 ">
                      <div className="form-group row ellipsis">
                        <label className="col-5 " htmlFor="name-input-inline">
                          Billing Instructions
                        </label>
                        <span className="col-1 p-0 mx-1">:</span>
                        <p
                          className="col-5 ellipsis"
                          title={Details.billingInstructions || "NA"}
                        >
                          {Details.billingInstructions || "NA"}
                        </p>
                      </div>
                    </div>
                    <div className="mb-2 row col-md-12 ">
                      <div className="form-group row ellipsis">
                        <label className="col-5" htmlFor="name-input-inline">
                          Client Message
                        </label>
                        <span className="col-1 p-0 mx-1">:</span>
                        <p
                          className="col-5 ellipsis"
                          title={Details.clientMessage || "NA"}
                        >
                          {Details.clientMessage || "NA"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* </div> */}
            {/* </div> */}
          </div>
        ))}

        <div className="row">
          {data.map((Details) => (
            <div className="col-md-4 ">
              <div className="customCard   mt-2 mb-2 ml-2">
                <div className="group mb-1 customCard">
                  <div
                    className="col-md-12  collapseHeader px-3"
                    style={{ backgroundColor: "#f4f4f4" }}
                  >
                    <h2 style={{ backgroundColor: "#f4f4f4" }}>Contract</h2>
                  </div>
                </div>
                {/* <h2 style={{ backgroundColor: "#f4f4f4" }}>Contract</h2> */}
                <div className="group-content row mx-2">
                  <div className="col-md-12 mb-2">
                    <div className="form-group row">
                      <label className="col-5" htmlFor="name-input-inline">
                        Contract Terms
                      </label>
                      <span className="col-1 p-0 mx-2">:</span>
                      <p
                        className="col-5 ellipsis"
                        title={Details.contractTerms || "NA"}
                      >
                        {Details.contractTerms || "NA"}
                      </p>
                    </div>
                  </div>
                  <div className="col-md-12 mb-2">
                    <div className="form-group row mb-7">
                      <label className="col-5" htmlFor="name-input-inline">
                        Cost Contract Terms
                      </label>
                      <span className="col-1 p-0 mx-2">:</span>
                      <p
                        className="col-5 ellipsis"
                        title={Details.costContractTerms || "NA"}
                      >
                        {Details.costContractTerms || "NA"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
          {data.map((Details) => (
            <div className="col-md-4 ">
              <div className="customCard   mt-2 mb-2 mr-2">
                <div className="group mb-1 customCard">
                  <div
                    className="col-md-12  collapseHeader px-3"
                    style={{ backgroundColor: "#f4f4f4" }}
                  >
                    <h2 style={{ backgroundColor: "#f4f4f4" }}>
                      Tax Structure
                    </h2>
                  </div>
                </div>
                <div className="group-content row mx-2">
                  <div className="col-md-12 mb-2">
                    <div className="form-group row ">
                      <label className="col-5" htmlFor="name-input-inline">
                        Tax Type 1
                      </label>
                      <span className="col-1 p-0">:</span>
                      <p
                        className="col-5 ellipsis"
                        title={Details.percentage || "NA"}
                      >
                        {Details.percentage || "NA"}
                      </p>
                    </div>
                  </div>
                  <div className="col-md-12 mb-2">
                    <div className="form-group row">
                      <label className="col-5" htmlFor="name-input-inline">
                        Tax Type 2
                      </label>
                      <span className="col-1 p-0">:</span>
                      {/* <p
                        className="col-5 ellipsis"
                        title={Details.percentage || "NA"}
                      >
                        {Details.percentage || "NA"}
                      </p> */}
                    </div>
                  </div>
                  <div className="col-md-12 mb-2">
                    <div className="form-group row mb-5">
                      <label className="col-5" htmlFor="name-input-inline">
                        Tax Type 3
                      </label>
                      <span className="col-1 p-0">:</span>
                      {/* <p
                        className="col-5 ellipsis"
                        title={Details.percentage || "NA"}
                      >
                        {Details.percentage || "NA"}
                      </p> */}
                    </div>
                  </div>
                </div>
                {/* </div> */}
              </div>
            </div>
          ))}
          {data.map((Details) => (
            <div className="col-md-4">
              <div className=" customCard   mt-2 mb-3 mr-2">
                {/* <div className="group-content row "> */}
                {/* <h2 style={{ backgroundColor: "#f4f4f4" }}>
                    Mailing Details
                  </h2> */}
                <div className="group mb-1 customCard">
                  <div
                    className="col-md-12  collapseHeader px-1"
                    style={{ backgroundColor: "#f4f4f4" }}
                  >
                    <h2 style={{ backgroundColor: "#f4f4f4" }}>
                      Mailing Details
                    </h2>
                  </div>
                </div>
                <div className="group-content row">
                  <div className="col-md-12 mb-2">
                    <div className="form-group row">
                      <label className="col-4" htmlFor="name-input-inline">
                        To
                      </label>
                      <span className="col-1 ml-3">:</span>
                      <p
                        className="col-5 ml-2 ellipsis"
                        title={Details.toEmails || "NA"}
                      >
                        {Details.toEmails || "NA"}
                      </p>
                    </div>
                  </div>
                  <div className="col-md-12 mb-2">
                    <div className="form-group row">
                      <label className="col-4" htmlFor="name-input-inline">
                        CC
                      </label>
                      <span className="col-1 ml-3">:</span>
                      <p
                        className="col-5 ml-2 ellipsis"
                        title={Details.ccEmails || "NA"}
                      >
                        {Details.ccEmails || "NA"}
                      </p>
                    </div>
                  </div>
                  <div className="col-md-12 mb-2">
                    <div className="form-group row">
                      <label className="col-4" htmlFor="name-input-inline">
                        BCC
                      </label>
                      <span className="col-1 ml-3">:</span>
                      <p
                        className="col-5 ml-2 ellipsis"
                        title={Details.bccEmails || "NA"}
                      >
                        {Details.bccEmails || "NA"}
                      </p>
                    </div>
                  </div>
                  <div className="col-md-12 mb-2">
                    <div className="form-group row">
                      <label className="col-4" htmlFor="name-input-inline">
                        Email Template
                      </label>
                      <span className="col-1 ml-3">:</span>
                      <p
                        className="col-5 ml-2 ellipsis"
                        title={Details.emailTemplate || "NA"}
                      >
                        {Details.emailTemplate || "NA"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
export default DeliveryDashboard;
