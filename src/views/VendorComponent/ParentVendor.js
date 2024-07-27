import React, { useState } from "react";
import Dashboard from "./Dashboard";
import Documents from "./Documents";
import Resources from "./Resources";
import Reviews from "./Reviews";
import VendorReviews from "./VendorReviews";
import Performance from "./Performance";
import { useEffect } from "react";
import { IoWarningOutline } from "react-icons/io5";
//import dashboard from "./Dashboard.scss"
import VendorCreate from "./VendorCreate";
import axios from "axios";
import { AiFillWarning } from "react-icons/ai";
import { environment } from "../../environments/environment";
import VendorResource from "./VendorResource";
import VendorTrend from "./VendorTrend";

function ParentVendor() {
  const [btnState, setbtnState] = useState("Dashboard");
  const [urlState, setUrlState] = useState("/vmg/dashboard/");
  const [access, setAccess] = useState([]);
  const [vendorId, setVendorId] = useState(0);
  const [vId, setVId] = useState();
  const loggedUserId = localStorage.getItem("resId");

  const [searchapidata, setSearchApiData] = useState([]);
  const [data, setData] = useState([]);

  const [headerData, setHeaderData] = useState([]);
  const [bodyData, setBodyData] = useState([]);
  const url = window.location.href;
  const projectArr = url.split(":");
  const projectsId = projectArr[projectArr.length - 1];
  console.log(projectsId);
  // const initialData = {
  //   "buIds": "-1",
  //   "country": "-1",
  //   "fromDate": "2022-12-26",
  //   "toDate": "2023-01-02",
  //   "lkKey": "total_hc",
  //   "skillId": "0",
  //   "isExport": "0",
  //   "vendorId": vendorId,
  //   "page": "vmg",
  //   "custId": "0",
  //   "projId": "0",
  //   "buId": "0"
  // }

  const baseUrl = environment.baseUrl;
  console.log(access.length);
  useEffect(() => {
    // fetchdata();
  }, [vendorId]);

  const getVendorAccess = () => {
    axios({
      method: "get",
      url:
        baseUrl +
        `/CommonMS/master/getTabMenus?ProjectId=${projectsId}&loggedUserId=${loggedUserId}&type=vendor&subType=vmg`,
    })
      .then(function (response) {
        var resp = response.data;
        // resp.push({ id: "-1", name: "<<ALL>>" });
        console.log(resp);
        setAccess(resp);
      })
      .catch(function (response) {});
  };
  useEffect(() => {
    getVendorAccess();
    setTimeout(() => {
      getVendorData();
    }, 1500);
  }, [vendorId]);

  useEffect(() => {}, [bodyData]);
  ///////////////---------EDIT----------///////////////
  const [vendorData, setVendorData] = useState([]);
  const [confirmationMessage, setConfirmationMessage] = useState(false);
  const [vendorSponser, setVendorSponser] = useState([]);
  useEffect(() => {
    if (url.includes("reviews")) {
      setbtnState("reviews");
    }
    let vendorArr = url.split(":");
    setVId(vendorArr[vendorArr.length - 1]);
  }, []);

  useEffect(() => {
    let url = window.location.href;

    if (url.includes("reviews")) {
      setbtnState("Reviews");
    }
  }, []);
  const getVendorData = () => {
    axios({
      method: "get",
      url:
        baseUrl +
        `/VendorMS/vendor/getVendoreDetails?vid=${projectsId}&objecttypeid=15`,
    })
      .then(function (response) {
        let respData = response.data;
        const respDataModified = respData.map((item) => {
          // Create a new object with the modified key
          return {
            ...item,
            sponsoreName: item.sponserName,
            sponserName: undefined,
            serviceDtls: item.serviceDetls,
            serviceDetls: item.sponserName,
            overAllRating: item.overAllRating,
          };
        });

        // Now respDataModified contains the modified data

        respDataModified[0]["isInsured"] = respDataModified[0]["isInsured"]
          ? 1
          : 0;
        respDataModified[0]["isLicensed"] = respDataModified[0]["isLicensed"]
          ? 1
          : 0;

        setVendorData(respDataModified);
      })
      .catch(function (response) {});
  };
  useEffect(() => {}, [vendorData]);
  //////////////---------EDIT-END---------//////////////

  //////////////---------Reviews Start----//////////////

  useEffect(() => {}, [vId]);
  useEffect(() => {}, [btnState, vendorId, vId]);

  ////////////////------Reviews End-------//////////////////

  const [Data, setData1] = useState([{}]);
  const getData = () => {
    axios
      .get(baseUrl + `/VendorMS/vendor/getVendoreDetails?vid=${projectsId}`)
      .then((res) => {
        const GetData = res.data;
        setData1(GetData);
      })
      .catch((res) => {});
  };
  useEffect(() => {
    // setTimeout(() => {
    getData();
    // },
    //   100)
  }, [vendorId]);

  return (
    <>
      {access.length > 0 ? (
        <div>
          {btnState === "Dashboard" ? (
            <Dashboard
              vendorId={projectsId}
              confirmationMessage={confirmationMessage}
              Data={vendorData}
              urlState={urlState}
              btnState={btnState}
              setbtnState={setbtnState}
              setUrlState={setUrlState}
            />
          ) : (
            ""
          )}
          {btnState === "Edit" ? (
            <VendorCreate
              vendorId={projectsId}
              Data={Data}
              vendorData={vendorData}
              vendorSponser={vendorSponser}
              getVendorData={getVendorData}
              setbtnState={setbtnState}
              setConfirmationMessage={setConfirmationMessage}
              getData={getVendorData}
              urlState={urlState}
              btnState={btnState}
              setUrlState={setUrlState}
            />
          ) : (
            ""
          )}
          {btnState === "Documents" ? (
            <Documents
              vendorId={projectsId}
              vendorData={vendorData}
              vId={vId}
              urlState={urlState}
              btnState={btnState}
              setbtnState={setbtnState}
              setUrlState={setUrlState}
            />
          ) : (
            ""
          )}
          {btnState === "Resources" ||
          btnState === "Current Resources" ||
          btnState === "DateRange Resources" ||
          btnState === "viewAll Resources" ? (
            <VendorResource
              vendorId={projectsId}
              data={data}
              setData={setData}
              searchapidata={searchapidata}
              headerData={headerData}
              vendorData={vendorData}
              bodyData={bodyData}
              setBodyData={setBodyData}
              urlState={urlState}
              btnState={btnState}
              setbtnState={setbtnState}
              setUrlState={setUrlState}
            />
          ) : (
            ""
          )}
          {btnState === "Reviews" ? (
            <VendorReviews
              vendorId={projectsId}
              setbtnState={setbtnState}
              urlState={urlState}
              btnState={btnState}
              setUrlState={setUrlState}
            />
          ) : (
            ""
          )}
          {btnState === "Subk GM Analysis" ? (
            <Performance
              vendorId={projectsId}
              urlState={urlState}
              btnState={btnState}
              setbtnState={setbtnState}
              setUrlState={setUrlState}
            />
          ) : (
            ""
          )}
          {btnState === "Trend" ? (
            <VendorTrend
              vendorId={projectsId}
              urlState={urlState}
              btnState={btnState}
              setbtnState={setbtnState}
              setUrlState={setUrlState}
            />
          ) : (
            ""
          )}
        </div>
      ) : (
        <div className="statusMsg error col-12 mb-2">
          <span>
            <IoWarningOutline />
            &nbsp;
            {`Sorry! You don't have permission to view the Vendor`}
          </span>
        </div>
      )}
    </>
  );
}

export default ParentVendor;
