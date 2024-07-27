import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { VscSave } from "react-icons/vsc";
import { useState } from "react";
import { environment } from "../../environments/environment";
import { useEffect } from "react";
import axios from "axios";
import moment from "moment";
import AutoComplete from "./ReviewsAutoComplete";
import GlobalValidation from "../ValidationComponent/GlobalValidation";
import { useRef } from "react";
import { IoWarningOutline } from "react-icons/io5";
import { BiCheck } from "react-icons/bi";
import DownloadForOfflineRoundedIcon from "@mui/icons-material/DownloadForOfflineRounded";
import { ImCross } from "react-icons/im";
import CellRendererPrimeReactDataTable from "../PrimeReactTableComponent/CellRendererPrimeReactDataTable";
import { Column } from "primereact/column";
import GlobalCancel from "../ValidationComponent/GlobalCancel";
import { AiOutlineDownload } from "react-icons/ai";
import { FaSave } from "react-icons/fa";
import Loader from "../Loader/Loader";
import RiskAutoComplete from "../ProjectComponent/RiskAutocomplete";
import { json } from "react-router-dom";
import ParentVendorTabs from "./ParentVendorTabs";
function VendorReviews(props) {
  const url = window.location.href;
  const projectArr = url.split(":");
  const projectsId = projectArr[projectArr.length - 1];
  const loggedUserId = localStorage.getItem("resId");
  const [docFolderId, setDocFolderId] = useState([]);
  const {
    vendorId,
    responseData,
    urlState,
    btnState,
    setbtnState,
    setUrlState,
  } = props;
  const [selectedFile, setSelectedFile] = useState([]);
  const [vendorsName, setVendorsName] = useState([]);

  const [reviewDt, setreviewDt] = useState();
  const [nextRvwDt, setnextRvwDt] = useState();
  const [data, setData] = useState([]);
  const [headerData, setHeaderData] = useState([]);
  const [employeesDetails, setEmployeesDetails] = useState([]);
  const [selectEmployee, setSelectEmployee] = useState([]);
  const [vendorDetails, setVendorDetails] = useState([]);
  const [validationmessage, setValidationMessage] = useState(false);
  const [revDtNext, setNextRvDt] = useState([]);
  const [updatedRating, setUpdatedRating] = useState([]);
  const [Successvalidationmessage, setSuccessvalidationmessage] =
    useState(false);
  const [message, setMessage] = useState(false);
  const [loader, setLoader] = useState(false);
  const [key, setKey] = useState(0);
  const [errorMessage, setErrorMessage] = useState(false);
  const [revwDt, setRevwDt] = useState("");
  const [lstRvDt, setLstRvDt] = useState([]);
  const [autoCompleteValidation, setAutoCompleteValidation] = useState("");
  const [name, setName] = useState([]);
  const [state, setState] = useState({
    vendorId: projectsId,
    lastRvwDt: "",
    vendorName: vendorsName,
    lastReviewDt: lstRvDt,
    reviewedBy: "",
    rating: "",
    // reviewedBy: "",
    reviewDt: "",
    nextReviewDt: "",
    note: "",
    isUpdate: false,
  });
  const baseUrl = environment.baseUrl;
  let rows = 10;
  const abortController = useRef(null);
  const handleAbort = () => {
    abortController.current && abortController.current.abort();
    setLoader(false);
  };

  const [routes, setRoutes] = useState([]);
  let textContent = "Vendors";
  let currentScreenName = ["Vendors", "Vendor Reviews"];

  sessionStorage.setItem(
    "breadCrumbs",
    JSON.stringify({
      routes: routes,
      currentScreenName: currentScreenName,
      textContent: textContent,
    })
  );
  const [access, setAccess] = useState([]);

  // const url = window.location.href;
  // const projectArr = url.split(":");
  console.log(projectArr[3]);
  // /CommonMS/master/getTabMenus?ProjectId=117&loggedUserId=4452475&type=vendor&subType=vmg
  const getAccess = (a) => {
    axios({
      method: "get",
      url:
        baseUrl +
        `/CommonMS/master/getTabMenus?ProjectId=${projectsId}&loggedUserId=${loggedUserId}&type=vendor&subType=vmg`,
    })
      .then(function (response) {
        var resp = response.data;
        // resp.push({ id: "-1", name: "<<ALL>>" });
        const respData = resp.find((item) => item.display_name === "Reviews");
        console.log(respData);
        const accessLevel = respData.userRoles.includes("561")
          ? 561
          : respData.userRoles.includes("932")
          ? 932
          : respData.userRoles.includes("919")
          ? 919
          : null;
        console.log(accessLevel);
        setAccess(accessLevel);
      })
      .catch(function (response) {});
  };
  useEffect(() => {
    getAccess();
  }, []);
  console.log(access);
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

  const handleInputchange = (event) => {
    event.preventDefault;
    const { name, value } = event.target;
    setUpdatedRating(event.target.value);
    setState((prevProps) => ({ ...prevProps, [name]: value }));
  };
  useEffect(() => {
    setState((prev) => ({
      ...prev,
      ["lastRvwDt"]:
        vendorDetails.review_dt !== undefined
          ? moment(vendorDetails.review_dt).format("yyyy-MM-DD")
          : null,
    }));
  }, [vendorDetails]);
  const ref = useRef([]);

  useEffect(() => {
    data[0] && setHeaderData(JSON.parse(JSON.stringify(data[0])));
  }, [data]);

  const LeftAlign = (data) => {
    setDocFolderId(data.docId);

    return (
      <div align="right" title={data.rating}>
        {data.rating}
      </div>
    );
  };
  const Download = (data) => {
    return (
      <>
        {data.docId == null ? (
          ""
        ) : (
          <div align="center" data-toggle="tooltip" title="Download Document">
            <DownloadForOfflineRoundedIcon
              style={{ color: "#86b558", cursor: "pointer" }}
              onClick={() => {
                handleDownload(data, vendorDetails);
              }}
            />
          </div>
        )}
      </>
    );
  };

  const ReviewedDate = (data) => {
    return (
      <div
        align="center"
        className="ellipsis"
        data-toggle="tooltip"
        title={data.reviewDt}
      >
        {data.reviewDt}
      </div>
    );
  };

  const ReviewedBy = (data) => {
    return (
      <div className="ellipsis" data-toggle="tooltip" title={data.userName}>
        {data.userName}
      </div>
    );
  };

  const LastReviewDate = (data) => {
    return (
      <div
        align="center"
        className="ellipsis"
        data-toggle="tooltip"
        style={{ textAlign: data.lastRvwDt == "-" ? "center" : "" }}
        title={data.lastRvwDt}
      >
        {data.lastRvwDt}
      </div>
    );
  };
  const NextReviewDate = (data) => {
    return (
      <div
        align="center"
        className="ellipsis"
        data-toggle="tooltip"
        title={data.nextRvwDt}
      >
        {data.nextRvwDt}
      </div>
    );
  };

  const Rating = (data) => {
    return (
      <div className="ellipsis" data-toggle="tooltip" title={data.rating}>
        {data.rating}
      </div>
    );
  };
  const Comments = (data) => {
    return (
      <div className="ellipsis" data-toggle="tooltip" title={data.comments}>
        {data.comments}
      </div>
    );
  };
  const Actionser = (data) => {
    return (
      <div>
        <IoWarningOutline />
        {data.docId == null ? "yes" : "no"}
      </div>
    );
  };
  const dynamicColumns = Object.keys(headerData)?.map((col, i) => {
    return (
      <Column
        // sortable
        key={col}
        body={
          col == "rating"
            ? LeftAlign
            : col == "docId"
            ? Download
            : col == "reviewDt"
            ? ReviewedDate
            : col == "userName"
            ? ReviewedBy
            : col == "lastRvwDt"
            ? LastReviewDate
            : col == "nextRvwDt"
            ? NextReviewDate
            : col == "rating"
            ? Rating
            : col == "comments"
            ? Comments
            : col == "docId"
            ? Actionser
            : ""
        }
        field={col}
        header={headerData[col]}
      />
    );
  });

  // const onFileChangeHandler = (e) => {
  //   setSelectedFile(e.target.files[0]);
  // };
  const onFileChangeHandler = (e) => {
    // const selectedFile = e.target.files[0];
    setSelectedFile(e.target.files[0]);
    // if (selectedFile) {
    //   const fileSizeInMB = selectedFile.size / (1024 * 1024); // Convert to MB
    //   if (fileSizeInMB > 10) {
    //     setErrorMessage(true);
    //     setSelectedFile(null); // Clear the selected file
    //   } else {
    //     setErrorMessage(false);
    //     setSelectedFile(selectedFile);
    //   }
    // }
  };

  const handleClear = () => {
    setState((prevProps) => ({ ...prevProps, reviewedBy: null }));
  };

  const handleDownload = (data, vendorDetails) => {
    const docUrl =
      baseUrl + `/VendorMS/vendor/downloadFile?documentId=${data?.docId}`;
    axios({
      url: docUrl,
      method: "GET",
      responseType: "blob",
    }).then((response) => {
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", data.file_name);
      document.body.appendChild(link);
      link.click();
    });
  };

  useEffect(() => {
    handleDownload();
  }, []);

  ////////axios for posting the details in to the table/////////////

  const handleSave = (e) => {
    let data = {
      vendorId: projectsId,
      vendorName: vendorsName,
      lastReviewDt: moment(vendorDetails.review_dt).format("DD-MMM-YYYY"),
      rating: state.rating,
      user: state.reviewedBy.toString(),
      reviewDt: moment(reviewDt).format("DD-MMM-YYYY"),
      nextReviewDt: moment(nextRvwDt).format("DD-MMM-YYYY"),
      note: state.comments,
      isUpdate: false,
    };
    //     {
    //       vendorId: "16",
    //       vendorName: "LinkageIT",
    //       lastReviewDt: "04-Nov-2023",
    //       rating: "5",
    //       user: "5200",
    //       reviewDt: "15-Dec-2023",
    //       nextReviewDt: "25-Nov-2023",
    //       note: "viewtesting",
    //       isUpdate: false,
    // }
    let valid = GlobalValidation(ref);
    if (valid) {
      setMessage(true);
      // setTimeout(() => {
      //   setMessage(false);
      // }, 3000);
      return;
    }
    setLoader(true);
    const formData = new FormData();
    formData.append("file", selectedFile);
    axios
      .postForm(
        baseUrl +
          `/VendorMS/Reviews/saveVendorReviews?loggedUserId=${loggedUserId}`,
        {
          file: selectedFile,
          data: JSON.stringify({
            vendorId: projectsId,
            vendorName: vendorsName,
            lastReviewDt: moment(vendorDetails.review_dt).format("DD-MMM-YYYY"),
            rating: state.rating,
            user: state.reviewedBy.toString(),
            reviewDt: moment(reviewDt).format("DD-MMM-YYYY"),
            nextReviewDt: moment(nextRvwDt).format("DD-MMM-YYYY"),
            note: state.comments,
            isUpdate: false,
          }),
        },
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      )
      .then((res) => {
        getVendorDetails();
        getVendorData();
        // window.location.reload();

        setLoader(false);
        handleCancel();
      });
  };

  // Function to execute the second API call

  const getVendorData = () => {
    axios({
      url: baseUrl + `/VendorMS/Reviews/getVendorDetails?vid=${projectsId}`,
    }).then((resp) => {
      let tabledata = resp.data;
      let header = [
        {
          reviewDt: "Reviewed Date",
          userName: "Reviewed By",
          lastRvwDt: "Last Review Date",
          nextRvwDt: "Next Review Date",
          rating: "Rating",
          comments: "Comments",
          docId: "Actions",
        },
      ];
      setData(header.concat(tabledata));
    });
  };
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
  ///////axios for getting the VendorName in to the vendorName field////////
  const getvendorName = () => {
    axios({
      method: "get",
      url: baseUrl + `/VendorMS/Reviews/getvendorName?vid=${projectsId}`,
    }).then(function (response) {
      var response = response.data;
      setName(response);
    });
  };
  console.log(vendorsName);

  //////axios for getting the lastReviewDate for the field Last Review Date/////////
  const getVendorDetails = () => {
    axios({
      method: "get",
      url: baseUrl + `/VendorMS/Reviews/getReviewDetails?vid=${projectsId}`,
    })
      .then(function (response) {
        var response = response.data;

        setVendorDetails(response);
        setVendorsName(response.vendor_name);
        setRevwDt(response.review_dt);
        setLstRvDt(response.last_review_dt);
      })
      .catch(function (response) {});
  };
  /////axios for getting the details for ReviewedBy field ,it returns EmployeeName ,EmployeeId,UserId///////////////////
  const EmployeeDetails = () => {
    axios({
      method: "get",
      url: baseUrl + `/VendorMS/Reviews/getEmployeesDetails`,
    })
      .then(function (response) {
        var resp = response.data;
        setEmployeesDetails(resp);
      })
      .catch(function (response) {});
  };

  useEffect(() => {}, [employeesDetails, selectEmployee, vendorDetails, name]);
  useEffect(() => {
    getMenus();
    EmployeeDetails();
    getVendorDetails();
    getVendorData();
    getvendorName();
    getUrlPath();
  }, []);

  const handleCancel = (e) => {
    setMessage(false);
    setErrorMessage(false);
    setKey((prevKey) => prevKey + 1);
    setSelectedFile([]);
    let ele = document.getElementsByClassName("cancel");
    GlobalCancel(ref);
    setnextRvwDt();
    setreviewDt();
    setState((prevState) => ({ ...prevState, note: "" }));

    for (let index = 0; index < ele.length; index++) {
      ele[index].value = "";
      // ele[index].value = null;

      if (ele[index].classList.contains("reactautocomplete")) {
        ele[
          index
        ].children[0].children[0].children[0].children[0].children[0].children[1]?.click();
      }
    }
  };
  return (
    <div>
      <div className="col-md-12">
        <div className="pageTitle">
          <div className="childOne">
            <ParentVendorTabs
              btnState={btnState}
              setbtnState={setbtnState}
              setUrlState={setUrlState}
            />
          </div>
          <div className="childTwo">
            <h2>Vendor Reviews</h2>
          </div>
          <div className="childThree"></div>
        </div>
      </div>
      {access == 932 || access == 919 ? (
        ""
      ) : (
        <div className="group mb-3 customCard">
          {message ? (
            <div className="statusMsg error">
              <span>
                <IoWarningOutline /> Please select the valid values for
                highlighted fields
              </span>
            </div>
          ) : (
            ""
          )}

          {Successvalidationmessage ? (
            <div className="statusMsg success">
              <span>
                <BiCheck
                  size="1.4em"
                  color="green"
                  strokeWidth={{ width: "100px" }}
                />{" "}
                Review saved successfully
              </span>
            </div>
          ) : (
            ""
          )}
          {loader ? <Loader handleAbort={handleAbort} /> : ""}

          <div id="enteredDetails">
            <div className="group-content row">
              <div className=" col-md-3 mb-2" id="VendorName">
                <label>
                  Vendor Name &nbsp;
                  <span className="required error-text">*</span>
                </label>
                <div
                  className="textfield"
                  ref={(ele) => {
                    ref.current[0] = ele;
                  }}
                >
                  <input
                    type="Text"
                    name="VendorName"
                    defaultValue={name.VendorName}
                    disabled
                    readOnly
                    className="error disableField"
                    id="vendorId"
                  ></input>
                </div>
              </div>
              <div className=" col-md-3 mb-2">
                <label>Last Review Date</label>
                <input
                  type="Text"
                  name="Last Review Date"
                  className="disableField"
                  disabled
                  readOnly
                  defaultValue={
                    vendorDetails.review_dt == null
                      ? ""
                      : moment(vendorDetails.review_dt).format("DD-MMM-yyyy")
                  }
                  id="lastRvwDt"
                ></input>
              </div>
              <div className=" col-md-3 mb-2 " id="rating">
                <label>
                  Rating &nbsp;<span className="required error-text">*</span>
                </label>
                <div>
                  <select
                    id="rating"
                    name="rating"
                    // value={state.rating}
                    className="text cancel"
                    onChange={handleInputchange}
                    ref={(ele) => {
                      ref.current[1] = ele;
                    }}
                  >
                    <option value="">&lt;&lt; Please Select &gt;&gt; </option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                  </select>
                </div>
              </div>
              <div
                className=" col-md-3 mb-2 shiftReviewsDate"
                name="reviewedBy"
                id="reviewedBy"
              >
                <label>
                  Reviewed By &nbsp;
                  <span className="required error-text">*</span>
                </label>
                <div
                  className=" autoComplete-container cancel"
                  id="autoComplete"
                >
                  <div
                    // handleClear={handleClear}
                    className="autoComplete-container cancel  reactautocomplete"
                    ref={(ele) => {
                      ref.current[2] = ele;
                    }}
                  >
                    <RiskAutoComplete
                      className="cancel"
                      // handleClear={handleClear}
                      value="0"
                      riskDetails={employeesDetails}
                      setFormData={setState}
                      setSelectEmployee={setSelectEmployee}
                      autoCompleteValidation={autoCompleteValidation}
                      placeholder={"Enter Resource Name"}
                      name="reviewedBy"
                      id="reviewedBy"
                    />
                  </div>
                </div>
              </div>
              <div
                className=" col-md-3 mb-2 shiftReviewsDate"
                type="date"
                id="reviewDt"
              >
                <label>
                  Reviewed Date &nbsp;
                  <span className="required error-text">*</span>{" "}
                </label>
                <div
                  className="datepicker vendorReviews"
                  ref={(ele) => {
                    ref.current[3] = ele;
                  }}
                >
                  {/* <DatePicker
                  name="reviewDt"
                  selected={reviewDt}
                  dateFormat="dd-MMM-yyyy"
                  dropdownMode="select"
                  // className="error "
                  showMonthDropdown
                  showYearDropdown
                  minDate={new Date(state?.lastRvwDt)}
                  onChange={(e) => {
                    setState((prev) => ({
                      ...prev,
                      ["reviewDt"]: moment(e).format("yyyy-MM-DD"),
                    }));
                    setreviewDt(e);
                  }}
                  onKeyDown={(e) => {
                    if (e.keyCode != 8) {
                      e.preventDefault();
                    }
                  }}
                /> */}
                  <DatePicker
                    name="reviewDt"
                    selected={reviewDt}
                    showMonthDropdown
                    showYearDropdown
                    dropdownMode="select"
                    dateFormat="dd-MMM-yyyy"
                    className="error "
                    minDate={new Date(state.lastRvwDt)}
                    onChange={(e) => {
                      setState((prev) => ({
                        ...prev,
                        ["reviewDt"]: moment(e).format("yyyy-MM-DD"),
                      }));
                      setreviewDt(e);
                    }}
                    onKeyDown={(e) => {
                      if (e.keyCode != 8) {
                        e.preventDefault();
                      }
                    }}
                  />
                </div>
              </div>
              <div
                className="col-md-3 mb-2 shiftReviewsDate"
                id="next_review_dt"
              >
                <label>
                  Next Review Date &nbsp;
                  <span className="required error-text">*</span>
                </label>
                <div
                  className="datepicker cancel vendorReviews"
                  ref={(ele) => {
                    ref.current[4] = ele;
                  }}
                >
                  <DatePicker
                    name="next_review_dt"
                    className="error"
                    minDate={new Date(state.reviewDt)}
                    selected={nextRvwDt}
                    showMonthDropdown
                    showYearDropdown
                    dropdownMode="select"
                    dateFormat="dd-MMM-yyyy"
                    onChange={(e) => {
                      setState((prev) => ({
                        ...prev,
                        ["nextRvwDt"]: moment(e).format("yyyy-MM-DD"),
                      }));
                      setnextRvwDt(e);
                    }}
                    autocomplete="false"
                    onKeyDown={(e) => {
                      if (e.keyCode != 8) {
                        e.preventDefault();
                      }
                    }}
                  />
                  {/* <DatePicker
                  name="next_review_dt cancel"
                  selected={nextRvwDt}
                  // minDate={new Date(new Date().getFullYear() + 1, 0, 1)}
                  // yearDropdownItemNumber={5}
                  minDate={
                    new Date(new Date().getFullYear(), new Date().getMonth(), 1)
                  }
                  showMonthDropdown
                  showYearDropdown
                  dropdownMode="select"
                  dateFormat="dd-MMM-yyyy"
                  onChange={(e) => {
                    setState((prev) => ({
                      ...prev,
                      ["nextRvwDt"]: moment(e).format("yyyy-MM-DD"),
                    }));
                    setnextRvwDt(e);
                  }}
                  onKeyDown={(e) => {
                    if (e.keyCode != 8) {
                      e.preventDefault();
                    }
                  }}
                /> */}
                </div>
              </div>
              {/* <div
              className="col-md-3 mb-2 textfield"
              // className="textfield"

              id="comments"
              ref={(ele) => {
                ref.current[5] = ele;
              }}
            >
              <label>Comments</label>

              <input
                name="comments"
                id="comments"
                row="2"
                value={state.comments}
                onChange={handleInputchange}

            </div> */}
              <div className=" col-md-3 mb-2" id="VendorName">
                <label>
                  Comments &nbsp;<span className="required error-text">*</span>
                </label>
                <div
                  className="textfield"
                  ref={(ele) => {
                    ref.current[5] = ele;
                  }}
                >
                  <input
                    className="err text cancel"
                    type="Text"
                    name="comments"
                    id="comments"
                    defaultValue={data?.comments}
                    // className="error disableField"
                    onChange={handleInputchange}
                  ></input>
                </div>
              </div>
              <div className="col-md-3 mb-2" id="UploadDocument">
                {errorMessage ? (
                  <div className="statusMsg error">
                    <span>
                      <IoWarningOutline /> File size is greater than 10 MB
                    </span>
                  </div>
                ) : (
                  ""
                )}
                <label>Upload Documents</label>
                <input
                  style={{ outline: "1px solid #cdcdcd" }}
                  type="file"
                  key={key}
                  name="file"
                  id="file"
                  accept=".jpg,.jpeg,.xlsx,.pdf,.docx,.txt"
                  // value={state.docId}
                  onChange={onFileChangeHandler}
                ></input>
                <label className="documenttypes">
                  <p className="error-text">
                    Supported types jpg,jpeg,xlsx,docx,txt,pdf & Max file size
                    is 10MB
                  </p>
                </label>
              </div>
            </div>
            {/* *************buttons************ */}
            <div
              className="col-lg-12 col-md-12 col-sm-12 col-xs-12 btn-container center "
              style={{ gap: "7px" }}
            >
              <button
                className="btn btn-primary"
                name="save"
                id="save"
                type="save"
                onClick={handleSave}
              >
                <FaSave />
                Save
              </button>
              <button
                className="btn btn-secondary"
                id="cancel"
                type="reset"
                onClick={handleCancel}
              >
                <ImCross fontSize={"11px"} />
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      <div className="vendordetails">
        <b defaultValue={vendorDetails.vendor_name}>Past Review Details : </b>{" "}
        {name.VendorName}
      </div>
      <CellRendererPrimeReactDataTable
        data={data}
        rows={rows}
        // linkColumns={linkColumns}
        // linkColumnsRoutes={linkColumnsRoutes}
        dynamicColumns={dynamicColumns}
        headerData={headerData}
        setHeaderData={setHeaderData}
      />
    </div>
    // </div>
  );
}
export default VendorReviews;
