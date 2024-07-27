import React, { useEffect, useState } from "react";
import moment from "moment";
import { FaCheck } from "react-icons/fa";
import { AiFillWarning } from "react-icons/ai";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { environment } from "../../environments/environment";
import ParentVendorTabs from "./ParentVendorTabs";
function Dashboard(props) {
  const baseUrl = environment.baseUrl;
  const loggedUserId = localStorage.getItem("resId");
  const [overAlldaata, setOverAlldaata] = useState([]);
  const {
    Data,
    confirmationMessage,
    urlState,
    btnState,
    setbtnState,
    setUrlState,
  } = props;
  const location = useLocation();

  const getNewVendorDetailsforRating = () => {
    // setMenusData

    axios({
      method: "GET",
      url: baseUrl + `/VendorMS/vendor/newvendorDataDetails`,
    }).then((resp) => {
      let data = resp.data;
      console.log(data);
      setOverAlldaata(data[0].over_all_rating);
      console.log(data[0].over_all_rating);
    });
  };
  useEffect(() => {
    getNewVendorDetailsforRating();
  }, []);
  const [successMessage, setSuccessMessage] = useState();
  const [nextRvDt, setNextRvDt] = useState([]);
  useEffect(() => {
    const timer = setTimeout(() => {
      setSuccessMessage(null);
    }, 3000);

    return () => {
      setSuccessMessage(null); // clear the success message when unmounting
      clearTimeout(timer);
    };
  }, [Data]);

  const [routes, setRoutes] = useState([]);
  let textContent = "Vendors";
  let currentScreenName = ["Vendors", "Overview"];

  sessionStorage.setItem(
    "breadCrumbs",
    JSON.stringify({
      routes: routes,
      currentScreenName: currentScreenName,
      textContent: textContent,
    })
  );

  const getMenus = () => {
    axios({
      method: "GET",
      url: baseUrl + `/CommonMS/master/getMenus?loggedUserId=${loggedUserId}`,
    }).then((resp) => {
      let data = resp.data;
      const updatedMenuData = data.map((category) => ({
        ...category,
        subMenus: category.subMenus.map((submenu) => {
          if (submenu.display_name === "Management") {
            return {
              ...submenu,
              display_name: "Subk Management",
            };
          }
          if (submenu.display_name === "Performance") {
            return {
              ...submenu,
              display_name: "Subk GM Analysis",
            };
          }
          return submenu;
        }),
      }));
      updatedMenuData.forEach((item) => {
        if (item.display_name === textContent) {
          setRoutes([item]);
          sessionStorage.setItem("displayName", item.display_name);
        }
      });
    });
  };
  console.log(Data);

  const getNextReviewDate = () => {
    axios({
      method: "get",
      url: baseUrl + `/VendorMS/vendor/updatedVendorData`,
    }).then(function (response) {
      var response = response.data;
      setNextRvDt(response);
    });
  };
  useEffect(() => {
    getMenus();
    getNextReviewDate();
    getUrlPath();
  }, []);
  const getUrlPath = () => {
    axios({
      method: "get",
      url:
        baseUrl +
        `/CommonMS/security/authorize?url=${urlState}&userId=${loggedUserId}`,
    }).then((res) => {
      console.log(res, "urlResponse");
    });
  };
  return (
    <div>
      {successMessage && !confirmationMessage ? (
        <div className="statusMsg success">
          <FaCheck /> {successMessage}
        </div>
      ) : (
        <></>
      )}
      {confirmationMessage && (
        <div className="statusMsg success">
          <FaCheck /> Vendor {Data[0]?.vendorName} Updated successfully
        </div>
      )}
      <div className="pageTitle">
        <div className="childOne">
          <ParentVendorTabs
            btnState={btnState}
            setbtnState={setbtnState}
            setUrlState={setUrlState}
          />
        </div>
        <div className="childTwo">
          <h2>Overview</h2>
        </div>
        <div className="childThree"></div>
      </div>

      {Data.map((Details) => (

        < div className="group mb-1 customCard" >
          <div>
            <h2>Vendor Info</h2>

            <div className="group-content row">
              <div className="col-md-4 mb-2">
                <div className="form-group row">
                  <label className="col-5 ">Vendor Id </label>
                  <span className="col-1 p-0">:</span>
                  <p
                    className="col-6 ellipsis"
                    data-toggle="tooltip"
                    title={Details.vendorId}
                  >
                    {Details.vendorId === ""
                      ? "N/A"
                      : Details.vendorId === null
                        ? "-"
                        : Details.vendorId}
                  </p>
                </div>
              </div>
              <div className="col-md-4 mb-2">
                <div className="form-group row">
                  <label className="col-5 ">Vendor Name</label>
                  <span className="col-1 p-0">:</span>
                  <p
                    div
                    className="col-6 ellipsis"
                    data-toggle="tooltip"
                    title={Details.vendorName}
                  >
                    {Details.vendorName === ""
                      ? "N/A"
                      : Details.vendorName === null
                        ? "-"
                        : Details.vendorName}
                  </p>
                </div>
              </div>

              <div className="col-md-4 mb-2">
                <div className="form-group row">
                  <label className="col-5">Contact Name </label>
                  <span className="col-1 p-0">:</span>
                  <p
                    className="col-6 ellipsis"
                    data-toggle="tooltip"
                    title={Details.contactName}
                  >
                    {Details.contactName === ""
                      ? "N/A"
                      : Details.contactName === null
                        ? "-"
                        : Details.contactName}
                  </p>
                </div>
              </div>

              <div className="col-md-4 mb-2">
                <div className="form-group row">
                  <label className="col-5">Phone </label>
                  <span className="col-1 p-0">:</span>
                  <p
                    className="col-6 ellipsis"
                    data-toggle="tooltip"
                    title={Details.phone}
                  >
                    {Details.phone === ""
                      ? "N/A"
                      : Details.phone === null
                        ? "-"
                        : Details.phone}
                  </p>
                </div>
              </div>
              <div className="col-md-4 mb-2">
                <div className="form-group row">
                  <label className="col-5"> Email </label>
                  <span className="col-1 p-0">:</span>
                  <p
                    className="col-6 ellipsis"
                    data-toggle="tooltip"
                    title={Details.email}
                  >
                    {Details.email === ""
                      ? "N/A"
                      : Details.email === null
                        ? "-"
                        : Details.email}
                  </p>
                </div>
              </div>
              <div className="col-md-4 mb-2">
                <div className="form-group row">
                  <label className="col-5">Country</label>
                  <span className="col-1 p-0">:</span>
                  <p className="col-6 ellipsis">
                    {Details.countryName === ""
                      ? "N/A"
                      : Details.countryName === null
                        ? "-"
                        : Details.countryName}
                  </p>
                </div>
              </div>

              <div className="col-md-4 mb-2">
                <div className="form-group row">
                  <label className="col-5"> State </label>
                  <span className="col-1 p-0">:</span>
                  <p className="col-6 ellipsis">
                    {Details.state === ""
                      ? "N/A"
                      : Details.state === null
                        ? "-"
                        : Details.state}
                  </p>
                </div>
              </div>
              <div className="col-md-4 mb-2">
                <div className="form-group row">
                  <label className="col-5"> City </label>
                  <span className="col-1 p-0">:</span>
                  <p className="col-6 ellipsis">
                    {Details.city === ""
                      ? "N/A"
                      : Details.city === null
                        ? "-"
                        : Details.city}
                  </p>
                </div>
              </div>
              <div className="col-md-4 mb-2">
                <div className="form-group row">
                  <label className="col-5"> ZIP Code </label>
                  <span className="col-1 p-0">:</span>
                  <p
                    className="col-6 ellipsis"
                    data-toggle="tooltip"
                    title={Details.zipCode}
                  >
                    {Details.zipCode === ""
                      ? "N/A"
                      : Details.zipCode === null
                        ? "-"
                        : Details.zipCode}
                  </p>
                </div>
              </div>

              <div className="col-md-4 mb-2">
                <div className="form-group row">
                  <label className="col-5">OverAll Rating </label>
                  <span className="col-1 p-0">:</span>
                  <p
                    className="col-6 ellipsis"
                    data-toggle="tooltip"
                    title={Data.overAllRating}
                  >
                    {/* {nextRvDt[0]?.rating === ""
                      ? "N/A"
                      : nextRvDt[0]?.rating === null
                      ? "-"
                      : nextRvDt[0]?.rating} */}
                    {Data[0].overAllRating == null
                      ? overAlldaata
                      : Data[0].overAllRating}
                  </p>
                </div>
              </div>
              <div className="col-md-4 mb-2">
                <div className="form-group row">
                  <label className="col-5"> Last Review Date </label>
                  <span className="col-1 p-0">:</span>
                  <p className="col-6 ellipsis">
                    {" -"}
                    {/* {nextRvDt[0]?.last_review_dt === ""
                      ? "N/A"
                      : nextRvDt[0]?.last_review_dt === null
                      ? "-"
                      : moment(nextRvDt[0]?.last_review_dt).format(
                          "DD-MMM-yyyy"
                        )} */}
                  </p>
                </div>
              </div>
              <div className="col-md-4 mb-2">
                <div className="form-group row">
                  <label className="col-5"> Next Review Date </label>
                  <span className="col-1 p-0">:</span>
                  <p className="col-6 ellipsis">
                    {Details.nextReviewDt === ""
                      ? "N/A"
                      : Details.nextReviewDt === null
                        ? "-"
                        : moment(Details.nextReviewDt).format("DD-MMM-yyyy")}
                  </p>
                </div>
              </div>

              <div className="col-md-4 mb-2">
                <div className="form-group row">
                  <label className="col-5"> Contract Signed Date </label>
                  <span className="col-1 p-0">:</span>
                  <p className="col-6 ellipsis">
                    {Details.contractSignedDt === ""
                      ? "N/A"
                      : Details.contractSignedDt === null
                        ? "-"
                        : moment(Details.contractSignedDt).format("DD-MMM-yyyy")}
                  </p>
                </div>
              </div>
              <div className="col-md-4 mb-2">
                <div className="form-group row">
                  <label className="col-5"> Contract Expire Date </label>
                  <span className="col-1 p-0">:</span>
                  <p className="col-6 ellipsis">
                    {Details.contractExpireDt === ""
                      ? "N/A"
                      : Details.contractExpireDt === null
                        ? "-"
                        : moment(Details.contractExpireDt).format("DD-MMM-yyyy")}
                  </p>
                </div>
              </div>
              <div className="col-md-4 mb-2">
                <div className="form-group row">
                  <label className="col-5"> Contract Review Date </label>
                  <span className="col-1 p-0">:</span>
                  <p className="col-6 ellipsis">
                    {Details.contractReviewDt === ""
                      ? "N/A"
                      : Details.contractReviewDt === null
                        ? "-"
                        : moment(Details.contractReviewDt).format("DD-MMM-yyyy")}
                  </p>
                </div>
              </div>

              <div className="col-md-4 mb-2">
                <div className="form-group row">
                  <label className="col-5"> Approval Date </label>
                  <span className="col-1 p-0">:</span>
                  <p className="col-6 ellipsis">
                    {Details.approvalDt === ""
                      ? "N/A"
                      : Details.approvalDt === null
                        ? "-"
                        : moment(Details.approvalDt).format("DD-MMM-yyyy")}
                  </p>
                </div>
              </div>
              <div className="col-md-4 mb-2">
                <div className="form-group row">
                  <label className="col-5"> Website </label>
                  <span className="col-1 p-0">:</span>
                  <p
                    className="col-6 ellipsis"
                    data-toggle="tooltip"
                    title={Details.website}
                  >
                    {Details.website === ""
                      ? "N/A"
                      : Details.website === null
                        ? "-"
                        : Details.website}
                  </p>
                </div>
              </div>
              <div className="col-md-4 mb-2">
                <div className="form-group row">
                  <label className="col-5"> Sponsor Name </label>
                  <span className="col-1 p-0">:</span>
                  <p
                    className="col-6 ellipsis"
                    data-toggle="tooltip"
                    title={Details.sponsoreName}
                  >
                    {Details.sponsoreName === ""
                      ? "N/A"
                      : Details.sponsoreName === null
                        ? "-"
                        : Details.sponsoreName}
                  </p>
                </div>
              </div>

              <div className="col-md-4 mb-2">
                <div className="form-group row">
                  <label className="col-5"> Fax Number </label>
                  <span className="col-1 p-0">:</span>
                  <p
                    className="col-6 ellipsis"
                    data-toggle="tooltip"
                    title={Details.fax}
                  >
                    {Details.fax === ""
                      ? "-"
                      : Details.fax === null
                        ? "-"
                        : Details.fax}
                  </p>
                </div>
              </div>
              <div className="col-md-4 mb-2">
                <div className="form-group row">
                  <label className="col-5"> Mailing Address </label>
                  <span className="col-1 p-0">:</span>
                  <p
                    className="col-6 ellipsis tooltip-ex"
                    title={Details.mailingAddress}
                  >
                    {Details.mailingAddress === ""
                      ? "-"
                      : Details.mailingAddress === null
                        ? "-"
                        : Details.mailingAddress}
                  </p>
                </div>
              </div>
              <div className="col-md-4 mb-2">
                <div className="form-group row">
                  <label className="col-5"> Description & Notes </label>
                  <span className="col-1 p-0">:</span>
                  <p
                    className=" col-6 ellipsis"
                    data-toggle="tooltip"
                    title={Details.descriptionNote}
                  >
                    {Details.descriptionNote === ""
                      ? "-"
                      : Details.descriptionNote === null
                        ? "-"
                        : Details.descriptionNote}
                  </p>
                </div>
              </div>

              <div className="col-md-4 mb-2">
                <div className="form-group row">
                  <label className="col-5"> Vendor Status </label>
                  <span className="col-1 p-0">:</span>
                  <p
                    className=" col-6 ellipsis"
                    data-toggle="tooltip"
                    title={
                      Details.vendorStatus === 1444
                        ? "Active"
                        : Details.vendorStatus === 1445
                          ? "InActive"
                          : Details.vendorStatus === 1446
                            ? "BlackList"
                            : ""
                    }
                  >
                    {Details.vendorStatus === 1444
                      ? "Active"
                      : Details.vendorStatus === 1445
                        ? "InActive"
                        : Details.vendorStatus === 1446
                          ? "BlackList"
                          : ""}
                  </p>
                </div>



              </div>
              {/* 
              <div className="col-md-4 mb-2">
                <div className="form-group row">
                  <label className="col-5"> Conversion Eligibility </label>
                  <span className="col-1 p-0">:</span>
                  <div className="col-6">
                    <p>{Details.conversion_eligibility}</p>
                  </div>
                </div>
              </div>

              <div className="col-md-4 mb-2">
                <div className="form-group row">
                  <label className="col-5"> Comments </label>
                  <span className="col-1 p-0">:</span>
                  <div className="col-6">
                    <p>{Details.comments}</p>
                  </div>
                </div>
              </div> */}

              <div className="col-md-4 mb-2">
                <div className="form-group row">
                  <label className="col-5"> Conversion Eligibility </label>
                  <span className="col-1 p-0">:</span>
                  <div className="col-6">
                    {Details.conversionEligibility === "" ? (
                      <p>N/A</p>
                    ) : Details.conversionEligibility === null ? (
                      <p>-</p>
                    ) : Details.conversionEligibility === "Yes" ? (
                      <p>{Details.conversionEligibility}</p>
                    ) : (
                      <p>{Details.conversionEligibility}</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="col-md-4 mb-2">
                <div className="form-group row">
                  <label className="col-5"> Comments </label>
                  <span className="col-1 p-0">:</span>
                  <div className="col-6">
                    {Details.conversionEligibility === "Yes" ? (
                      <p>{Details.comments}</p>
                    ) : (
                      <p>-</p>
                    )}
                  </div>
                </div>
              </div>




            </div>
          </div>
        </div>
      ))
      }
      <div></div>
      {
        Data.map((Details) => (
          <div className="group mb-1 customCard">
            <h2>Company Details</h2>

            <div className="group-content row">
              <div className="col-md-4 mb-2">
                <div className="form-group row">
                  <label className="col-5">Location </label>
                  <span className="col-1 p-0">:</span>
                  <p
                    className="col-6 ellipsis"
                    data-toggle="tooltip"
                    title={Details.location}
                  >
                    {Details.location === ""
                      ? "N/A"
                      : Details.location === null
                        ? "-"
                        : Details.location}
                  </p>
                </div>
              </div>
              <div className="col-md-4 mb-2">
                <div className="form-group row">
                  <label className="col-5"> Company Established Date </label>
                  <span className="col-1 p-0">:</span>
                  <p className="col-6 ellipsis">
                    {Details.companyEstablishedDt === ""
                      ? "N/A"
                      : Details.companyEstablishedDt === null
                        ? "-"
                        : moment(Details.companyEstablishedDt).format(
                          "DD-MMM-yyyy"
                        )}
                  </p>
                </div>
              </div>
              <div className="col-md-4 mb-2">
                <div className="form-group row">
                  <label className="col-5">Business Type </label>
                  <span className="col-1 p-0">:</span>
                  <p className="col-6 ellipsis">
                    {Details.lkup_name === ""
                      ? "N/A"
                      : Details.lkup_name === null
                        ? "-"
                        : Details.lkup_name}
                  </p>
                </div>
              </div>

              <div className="col-md-4 mb-2">
                <div className="form-group row">
                  <label className="col-5"> Is Insured </label>
                  <span className="col-1 p-0">:</span>
                  <p className="col-6 ellipsis">
                    {Details.isInsured === true
                      ? "Yes"
                      : Details.isInsured === false
                        ? "No"
                        : Details.isInsured === ""
                          ? "N/A"
                          : Details.isInsured === null
                            ? "-"
                            : Details.isInsured === 1
                              ? "Yes"
                              : Details.isInsured === 0
                                ? "No"
                                : Details.isInsured}
                  </p>
                </div>
              </div>
              <div className="col-md-4 mb-2">
                <div className="form-group row">
                  <label className="col-5"> Is Licensed </label>
                  <span className="col-1 p-0">:</span>
                  <p className="col-6 ellipsis">
                    {Details.isLicensed === true
                      ? "Yes"
                      : Details.isLicensed === false
                        ? "No"
                        : Details.isLicensed === ""
                          ? "N/A"
                          : Details.isLicensed === null
                            ? "-"
                            : Details.isLicensed == 1
                              ? "Yes"
                              : Details.isLicensed == 0
                                ? "No"
                                : Details.isLicensed}
                  </p>
                </div>
              </div>
              <div className="col-md-4 mb-2">
                <div className="form-group row">
                  <label className="col-5"> License No </label>
                  <span className="col-1 p-0">:</span>
                  <p
                    className="col-6 ellipsis"
                    data-toggle="tooltip"
                    title={Details.licenseNum}
                  >
                    {Details.licenseNum === ""
                      ? "N/A"
                      : Details.licenseNum === null
                        ? "-"
                        : Details.licenseNum}
                  </p>
                </div>
              </div>

              <div className="col-md-4 mb-2">
                <div className="form-group row">
                  <label className="col-5"> GST No </label>
                  <span className="col-1 p-0">:</span>
                  <p
                    className="col-6 ellipsis"
                    data-toggle="tooltip"
                    title={Details.gstNum}
                  >
                    {Details.gstNum === ""
                      ? "N/A"
                      : Details.gstNum === null
                        ? "-"
                        : Details.gstNum}
                  </p>
                </div>
              </div>
              <div className="col-md-4 mb-2">
                <div className="form-group row">
                  <label className="col-5"> Services/Goods Details </label>
                  <span className="col-1 p-0">:</span>
                  <p
                    className="col-6 ellipsis"
                    data-toggle="tooltip"
                    title={Details.serviceDtls}
                  >
                    {Details.serviceDtls === ""
                      ? "N/A"
                      : Details.serviceDtls === null
                        ? "-"
                        : Details.serviceDtls}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))
      }
      {
        Data.map((Details) => (
          <div className="group mb-1 customCard">
            <h2>Bank Details</h2>

            <div className="group-content row">
              <div className="col-md-4 mb-2">
                <div className="form-group row">
                  <label className="col-5">Bank Name </label>
                  <span className="col-1 p-0">:</span>
                  <p
                    className="col-6 ellipsis"
                    data-toggle="tooltip"
                    title={Details.bankName}
                  >
                    {Details.bankName === ""
                      ? "N/A"
                      : Details.bankName === null
                        ? "-"
                        : Details.bankName}
                  </p>
                </div>
              </div>
              <div className="col-md-4 mb-2">
                <div className="form-group row">
                  <label className="col-5"> Benefeciary Name </label>
                  <span className="col-1 p-0">:</span>
                  <p
                    className="col-6 ellipsis"
                    data-toggle="tooltip"
                    title={Details.beneficiaryName}
                  >
                    {Details.beneficiaryName === ""
                      ? "N/A"
                      : Details.beneficiaryName === null
                        ? "-"
                        : Details.beneficiaryName}
                  </p>
                </div>
              </div>
              <div className="col-md-4 mb-2">
                <div className="form-group row">
                  <label className="col-5"> Account Number </label>
                  <span className="col-1 p-0">:</span>
                  <p
                    className="col-6 ellipsis"
                    data-toggle="tooltip"
                    title={Details.accountNumber}
                  >
                    {Details.accountNumber === ""
                      ? "N/A"
                      : Details.accountNumber === null
                        ? "-"
                        : Details.accountNumber}
                  </p>
                </div>
              </div>

              <div className="col-md-4 mb-2">
                <div className="form-group row">
                  <label className="col-5"> IFSC Code </label>
                  <span className="col-1 p-0">:</span>
                  <p
                    className="col-6 ellipsis"
                    data-toggle="tooltip"
                    title={Details.ifscCode}
                  >
                    {Details.ifscCode === ""
                      ? "N/A"
                      : Details.ifscCode === null
                        ? "-"
                        : Details.ifscCode}
                  </p>
                </div>
              </div>
              <div className="col-md-4 mb-2">
                <div className="form-group row">
                  <label className="col-5"> Bank Address </label>
                  <span className="col-1 p-0">:</span>
                  <p className=" col-6 ellipsis" title={Details.bankAddress}>
                    {Details.bankAddress === ""
                      ? "N/A"
                      : Details.bankAddress === null
                        ? "-"
                        : Details.bankAddress}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))
      }
    </div >
  );
}

export default Dashboard;
