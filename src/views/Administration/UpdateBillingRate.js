import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { environment } from "../../environments/environment";
import RiskAutoComplete from "../ProjectComponent/RiskAutocomplete";
import GlobalValidation from "../ValidationComponent/GlobalValidation";
import moment from "moment";
import { CModal } from "@coreui/react";
import { CModalBody } from "@coreui/react";
import { CModalHeader, CModalTitle } from "@coreui/react";
import Draggable from "react-draggable";
import { BiCheck } from "react-icons/bi";
import { ImCross } from "react-icons/im";
import { AiFillWarning } from "react-icons/ai";
import GlobalCancel from "../ValidationComponent/GlobalCancel";
import { CCollapse } from "@coreui/react";
import { AiOutlineCheck } from "react-icons/ai";
import { AiOutlineClose } from "react-icons/ai";
import {
  FaChevronCircleDown,
  FaChevronCircleUp,
  FaSearch,
  FaSave,
} from "react-icons/fa";
import ScreenBreadcrumbs from "../Common/ScreenBreadcrumbs";
function UpdateBillingRate({ urlPath }) {
  const value = "UpdateBillingRate";
  const baseUrl = environment.baseUrl;
  const [formData, setFormData] = useState({
    assigned_to: "",
    Projects: "",
    Roles: "",
    Allocations: "",
    CurrentBillingRate: "",
    BillingRate: "",
    fromDT: "",
    todate: "",
    Resname: "",
  });
  const [projects, setProjects] = useState([]);
  const [roles, setRoles] = useState([]);
  const [allocations, setAllocations] = useState([{}]);
  const [currentBillingRate, setCurrentBillingRate] = useState({});
  const [BillingRate, setBillingRate] = useState({});
  const [riskDetails, setRiskDetails] = useState([]);
  const [buttonPopup, setButtonPopup] = useState(false);
  const [addmsg, setAddmsg] = useState(false);
  const [validationMessage, setValidationMessage] = useState(false);
  const [errormessage, SetErrorMessage] = useState(false);
  const [cheveronIcon, setCheveronIcon] = useState(FaChevronCircleUp);
  const [visible, setVisible] = useState(false);
  const ref = useRef([]);
  // const value=

  const loggedUserId = localStorage.getItem("resId");
  const [routes, setRoutes] = useState([]);
  let currentScreenName = ["Hammer Tool", "Update Billing Rate"];
  let textContent = "Administration";
  sessionStorage.setItem(
    "breadCrumbs",
    JSON.stringify({
      routes: routes,
      currentScreenName: currentScreenName,
      textContent: textContent,
    })
  );

  const currentBillingRateRef = useRef([]);
  const BillingRateRef = useRef([]);

  const onChangeHandler = (e) => {
    const inputValue = e.target.value;

    const { id, value } = e.target;
    const regex = /^[0-9.]*$/;

    // Use a regular expression to validate the input as a number with optional decimal point
    if (!regex.test(inputValue)) {
      e.target.value = "";
    }
    setFormData((prev) => ({ ...prev, [e.target.id]: value }));
  };

  const getData = () => {
    axios({
      method: "get",
      url: baseUrl + `/ProjectMS/risks/getAssignedData`,
    }).then(function (response) {
      var res = response.data;
      setRiskDetails(res);
    });
  };
  const getUrlPath = () => {
    axios({
      method: "get",
      url:
        baseUrl +
        `/CommonMS/security/authorize?url=/admin/billRateUpdate&userId=${loggedUserId}`,
    }).then((res) => {});
  };

  const getProjectdata = (e) => {
    axios({
      method: "post",
      url:
        baseUrl +
        `/administrationms/UpdateBillingRate/getProjectdata?ResId=${formData.assigned_to}`,
    }).then(function (response) {
      var res = response.data;
      setProjects(res);
    });
  };

  const getRolesdata = (e) => {
    axios({
      method: "post",
      url:
        baseUrl +
        `/administrationms/UpdateBillingRate/getRolesdata?ResId=${formData.assigned_to}&ProjectId=${formData.Projects}`,
    }).then(function (response) {
      var res = response.data;
      setRoles(res);
    });
  };

  const getAllocationsdata = (e) => {
    axios({
      method: "post",
      url:
        baseUrl +
        `/administrationms/UpdateBillingRate/getAllocationsdata?prjId=${formData.Projects}&roleId=${formData.Roles}&resId=${formData.assigned_to}`,
    })
      .then(function (response) {
        var res = response.data;
        setAllocations(res);
      })
      .catch((error) => {});
  };

  const Dates = formData.Allocations.split("--");
  const fromdate = moment(Dates[1]).format("yyyy-MM-DD"); //Temporary changes
  const todate = moment(Dates[1]).format("yyyy-MM-DD");

  const getCurrentBillingRate = (e) => {
    axios({
      method: "post",
      url:
        baseUrl +
        `/administrationms/UpdateBillingRate/getCurrentBillingRate?resId=${formData.assigned_to}&prjId=${formData.Projects}&roleId=${formData.Roles}&fromDT=${fromdate}&toDt=${todate}`,
    }).then(function (resp) {
      let res = resp.data[0];
      setCurrentBillingRate(res);

      if (res?.hourly_rate == undefined || res?.hourly_rate == null) {
        SetErrorMessage(true);
        setTimeout(() => {
          SetErrorMessage(false);
        }, 3000);
        return;
      } else {
        SetErrorMessage(false);
      }
    });
  };
  const resetFields = () => {
    setFormData((prev) => ({
      ...prev,
      assigned_to: "",
      Projects: "",
      Roles: "",
      Allocations: "",
      CurrentBillingRate: "",
      BillingRate: "",
      fromDT: "",
      todate: "", // Reset the BillingRate field to an empty string or its initial value
      // Add more fields to reset here if needed
    }));
  };
  const postBillingRate = (e) => {
    axios({
      method: "post",
      url:
        baseUrl +
        `/administrationms/UpdateBillingRate/UpdateBillRate?resId=${formData.assigned_to}&prjId=${formData.Projects}&roleId=${formData.Roles}&fromDT=${fromdate}&toDt=${todate}&curbillRate=${currentBillingRate?.hourly_rate}&billRate=${formData.BillingRate}`,
    }).then(function (response) {
      var res = response.data[0];
      setCurrentBillingRate(res);
      setButtonPopup(false);
      setAddmsg(true);
      setTimeout(() => {
        setAddmsg(false);
      }, 3000);
      resetFields(); // Reset the fields after a successful save
      handleCancel();
    });
  };

  useEffect(() => {
    getData();
    getMenus();
    getUrlPath();
  }, []);

  useEffect(() => {
    getProjectdata();
  }, [formData.assigned_to]);

  useEffect(() => {
    getRolesdata();
  }, [formData.Projects]);

  useEffect(() => {
    getAllocationsdata();
  }, [formData.Roles]);

  useEffect(() => {
    getCurrentBillingRate();
  }, [formData.Allocations]);

  const handleCancel = (e) => {
    let ele = document.getElementsByClassName("cancel");
    let valid1 = GlobalCancel(BillingRateRef);
    let valid = GlobalCancel(ref);
    if (valid1 || valid) {
      GlobalCancel(ref);
      setValidationMessage(false);
    }
    setCurrentBillingRate("");
    for (let index = 0; index < ele.length; index++) {
      ele[index].value = "";
      if (ele[index].classList.contains("autocomplete")) {
        ele[
          index
        ].children[0].children[0].children[0].children[0].children[1].click();
      }
    }
  };
  const onChangeResource = () => {
    let ele = document.getElementsByClassName("cancel");
    setCurrentBillingRate("");

    for (let index = 0; index < ele.length; index++) {
      ele[index].value = "";
    }
  };

  const getMenus = () => {
    axios({
      method: "GET",
      url: baseUrl + `/CommonMS/master/getMenus?loggedUserId=${loggedUserId}`,
    }).then((resp) => {
      let getData = resp.data.map((menu) => {
        if (menu.subMenus) {
          menu.subMenus = menu.subMenus.filter(
            (subMenu) =>
              subMenu.display_name !== "Roles Permissions" &&
              subMenu.display_name !== "Sales Permissions" &&
              subMenu.display_name !== "Jobs Daily Status" &&
              subMenu.display_name !== "Error Logs" &&
              subMenu.id != 27 &&
              subMenu.display_name !== "Tracker" &&
              subMenu.display_name !== "Role Costs" &&
              subMenu.display_name !== "Upload Role Costs" &&
              subMenu.display_name !== "Contract Documents"
          );
        }
        return menu;
      });

      getData.forEach((item) => {
        if (item.display_name === textContent) {
          setRoutes([item]);
          sessionStorage.setItem("displayName", item.display_name);
        }
      });
    });
  };

  function UpdateTaskStatusSave(props) {
    const {
      postBillingRate,
      buttonPopup,
      setButtonPopup,
      currentBillingRate,
      BillingRate,
      setBillingRate,
    } = props;

    return (
      <div>
        <Draggable>
          <CModal
            size="sm"
            visible={buttonPopup}
            backdrop="static"
            className="ui-dialog "
            onClose={() => {
              setButtonPopup(false);
            }}
          >
            <CModalHeader style={{ cursor: "all-scroll" }}>
              <CModalTitle>
                <span>Confirmation</span>
              </CModalTitle>
            </CModalHeader>
            <CModalBody>
              <span>{`Are You Sure..you are updating ${
                formData?.Resname
              } bill rate from ${
                currentBillingRate == undefined
                  ? currentBillingRate
                  : currentBillingRate?.hourly_rate
              } to ${
                formData.BillingRate == undefined
                  ? currentBillingRate?.hourly_rate
                  : formData.BillingRate
              } ?.`}</span>
              <div className="col-md-12 col-sm-12 col-xs-12 btn-container center my-3">
                <button
                  type="delete"
                  className="btn btn-primary"
                  onClick={(e) => {
                    postBillingRate(e);
                    setFormData((prev) => ({
                      ...prev,
                      [e.target.id]: e.target.value,
                    }));
                  }}
                >
                  <AiOutlineCheck />
                  Yes
                </button>

                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => {
                    setButtonPopup(false);
                  }}
                >
                  <AiOutlineClose />
                  No
                </button>
              </div>
            </CModalBody>
          </CModal>
        </Draggable>
      </div>
    );
  }
  const handleClick = () => {
    let valid1 = GlobalValidation(BillingRateRef);
    let valid = GlobalValidation(ref);

    if (valid || valid1) {
      setValidationMessage(true);
      setTimeout(() => {
        setValidationMessage(false);
      }, 3000);
      return;
    }
    setButtonPopup(true);
  };
  return (
    <div className="col-md-12">
      {addmsg ? (
        <div className="statusMsg success">
          <BiCheck
            size="1.4em"
            color="green"
            strokeWidth={{ width: "100px" }}
          />
          &nbsp;
          {"Billing Rate per Hour Updated successfully"}
        </div>
      ) : (
        ""
      )}
      {errormessage ? (
        <div className="statusMsg error">
          <AiFillWarning /> {"You are not Billable"}
        </div>
      ) : (
        ""
      )}
      {validationMessage ? (
        <div className="statusMsg error">
          <AiFillWarning />{" "}
          {"Please select the valid values for highlighted fields"}
        </div>
      ) : (
        ""
      )}
      <div>
        <div className="pageTitle">
          <div className="childOne"></div>
          <div className="childTwo">
            <h2>Update Billing Rate</h2>
          </div>
          <div className="childThree toggleBtns">
          <button
                className="searchFilterButton btn btn-primary"
                onClick={() => {
                  setVisible(!visible);
 
                  visible
                    ? setCheveronIcon(FaChevronCircleUp)
                    : setCheveronIcon(FaChevronCircleDown);
                }}
              >
                Search Filters
                <span className="serchFilterText">{cheveronIcon}</span>
              </button>
          </div>{" "}
        </div>

        <div className="group my-3 customCard">
          <div className="col-md-12 collapseHeader"></div>

          <CCollapse visible={!visible}>
            <div className="group-content row">
              <div className=" col-md-6 mb-2">
                <div className=" col-md-8">
                  <div className="form-group row">
                    <label className="col-5" htmlFor="Resource">
                      Resource &nbsp;
                      <span className="required error-text">*</span>
                    </label>
                    <span className="col-1 p-0">:</span>
                    <div className="col-6">
                      <div
                        className="autoComplete-container cancel error autocomplete reactautocomplete"
                        id="autocomplete reactautocomplete"
                        ref={(ele) => {
                          ref.current[0] = ele;
                        }}
                        onChange={onChangeResource}
                      >
                        <RiskAutoComplete
                          name="assigned_to"
                          id="assigned_to"
                          value={value}
                          riskDetails={riskDetails}
                          getData={getData}
                          setFormData={setFormData}
                          onChangeHandler={onChangeHandler}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className=" col-md-6 mb-2">
                <div className=" col-md-8">
                  <div className="form-group row">
                    <label className="col-5" htmlFor="Projects">
                      Projects&nbsp;
                      <span className="required error-text">*</span>
                    </label>
                    <span className="col-1 p-0">:</span>
                    <div className="col-6">
                      <select
                        className="error enteredDetails cancel text"
                        id="Projects"
                        name="Projects"
                        onChange={(e) => {
                          currentBillingRateRef.current[0].value = "";
                          setCurrentBillingRate({});
                          BillingRateRef.current[0].value = "";
                          setBillingRate({});
                          // setAllocations([{}]);
                          setFormData((prev) => ({
                            ...prev,
                            [e.target.id]: e.target.value,
                          }));
                        }}
                        ref={(ele) => {
                          ref.current[1] = ele;
                        }}
                      >
                        <option value=""> &lt;&lt;Please Select&gt;&gt;</option>
                        {projects.map((Item) => (
                          <option value={Item.id} key={Item.id}>
                            {Item.project_name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>{" "}
                </div>
              </div>
              <div className=" col-md-6 mb-2">
                <div className=" col-md-8">
                  <div className="form-group row">
                    <label className="col-5" htmlFor="Roles">
                      Roles&nbsp;<span className="required error-text">*</span>
                    </label>
                    <span className="col-1 p-0">:</span>
                    <div className="col-6">
                      <select
                        className="error enteredDetails cancel text"
                        id="Roles"
                        names="Roles"
                        onChange={(e) => {
                          currentBillingRateRef.current[0].value = "";
                          setCurrentBillingRate({});
                          BillingRateRef.current[0].value = "";
                          setFormData((prev) => ({
                            ...prev,
                            [e.target.id]: e.target.value,
                          }));
                        }}
                        ref={(ele) => {
                          ref.current[2] = ele;
                        }}
                      >
                        <option value=""> &lt;&lt;Please Select&gt;&gt;</option>
                        {roles.map((Item) => (
                          <option value={Item.id} key={Item.id}>
                            {Item.display_name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </div>
              <div className=" col-md-6 mb-2">
                <div className=" col-md-8">
                  <div className="form-group row">
                    <label className="col-5" htmlFor="Allocations">
                      Allocations&nbsp;
                      <span className="required error-text">*</span>
                    </label>
                    <span className="col-1 p-0">:</span>
                    <div className="col-6">
                      <select
                        className="error enteredDetails cancel text"
                        id="Allocations"
                        name="Allocations"
                        onChange={(e) => {
                          BillingRateRef.current[0].value = "";
                          setFormData((prev) => ({
                            ...prev,
                            [e.target.id]: e.target.value,
                          }));
                        }}
                        ref={(ele) => {
                          ref.current[3] = ele;
                        }}
                      >
                        <option value=""> &lt;&lt;Please Select&gt;&gt;</option>
                        {allocations.map((Item) => (
                          <option
                            value={Item.Allocations}
                            key={Item.Allocations}
                          >
                            {Item.Allocations}
                          </option>
                        ))}
                      </select>
                    </div>{" "}
                  </div>
                </div>
              </div>
              {console.log(currentBillingRate?.hourly_rate)}
              <div className=" col-md-6 mb-2">
                <div className=" col-md-8">
                  <div className="form-group row">
                    <label className="col-5" htmlFor="Current Billing Rate">
                      Current Billing Rate &nbsp;
                      <span className="required error-text">*</span>
                    </label>
                    <span className="col-1 p-0">:</span>
                    <div className="col-6">
                      <input
                        type="text"
                        value={currentBillingRate?.hourly_rate}
                        disabled="disabled"
                        className="Current Billing Rate disableField cancel"
                        name="CurrentBillingRate"
                        id="CurrentBillingRate"
                        placeholder=""
                        required
                        ref={(ele) => {
                          currentBillingRateRef.current[0] = ele;
                        }}
                      />
                    </div>
                  </div>{" "}
                </div>
              </div>
              <div className=" col-md-6 mb-2">
                <div className=" col-md-8">
                  <div className="form-group row">
                    <label className="col-5 error-text" htmlFor="Billing Rate">
                      Billing Rate &nbsp;
                      <span className="required error-text">*</span>
                    </label>
                    <span className="col-1 p-0">:</span>
                    <div
                      className="col-6 textfield error enteredDetails cancel"
                      ref={(ele) => {
                        BillingRateRef.current[0] = ele;
                      }}
                    >
                      <input
                        type="text"
                        className="cancel"
                        id="BillingRate"
                        name="BillingRate"
                        placeholder=""
                        required
                        onChange={onChangeHandler}
                      />
                    </div>
                  </div>
                </div>{" "}
              </div>
              <div className="col-md-12 col-sm-12 col-xs-12 btn-container center my-3">
                <button
                  type="submit"
                  className="btn btn-primary"
                  onClick={() => {
                    handleClick();
                  }}
                >
                  <FaSave /> Save{" "}
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  onClick={handleCancel}
                >
                  <ImCross /> Cancel{" "}
                </button>
              </div>
            </div>
          </CCollapse>
        </div>
      </div>
      {buttonPopup ? (
        <UpdateTaskStatusSave
          postBillingRate={postBillingRate}
          buttonPopup={buttonPopup}
          setButtonPopup={setButtonPopup}
          setAddmsg={setAddmsg}
          setValidationMessage={setValidationMessage}
          currentBillingRate={currentBillingRate}
          BillingRate={BillingRate}
          setBillingRate={setBillingRate}
        />
      ) : (
        ""
      )}
    </div>
  );
}

export default UpdateBillingRate;
