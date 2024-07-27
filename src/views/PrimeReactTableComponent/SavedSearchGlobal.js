import React, { useEffect, useRef } from "react";
import { FaSave } from "react-icons/fa";
import { useState } from "react";
import { environment } from "../../environments/environment";
import axios from "axios";
import SaveIcon from "@mui/icons-material/Save";
import GlobalValidation from "../ValidationComponent/GlobalValidation";
import { AiFillDelete, AiFillWarning } from "react-icons/ai";

import { CModal, CModalBody, CModalHeader, CModalTitle } from "@coreui/react";
import { ImCross } from "react-icons/im";
import { IoMdSave } from "react-icons/io";
import { useSelector } from "react-redux";
// import Autosuggest from "react-autosuggest";

export default function SavedSearchGlobal(props) {
  const { setEditAddmsg, pageurl, page_Name, payload, activeCustomers } = props;
  const [openPopup, setOpenPopup] = useState(false);
  const baseUrl = environment.baseUrl;
  const loggedUserId = localStorage.getItem("resId");
  const payloadString = JSON.stringify(payload);
  const ref = useRef([]);
  const [section, setSection] = useState([]);
  const [type, setType] = useState("1417");
  const [comments, setComments] = useState("");
  const [dashboardType, setDashboardType] = useState("1417");
  const [pageName, setPagename] = useState("");
  const [validationMessage, setValidationMessage] = useState(false);
  const SelectSEData = useSelector(
    (state) => state.selectedSEState.directSETreeData
  );

  //------------------To Save Filters Data--------------//
  const handleSaveclick = () => {
    let valid = GlobalValidation(ref);
    if (valid) {
      setValidationMessage(true);
      return;
    }
    const data = {
      searchName: comments,
      pageName: page_Name,
      pageUrl: pageurl,
      dashboardType: dashboardType,
      otherExecs: "0 : 0 ",
      userId: loggedUserId,
      section: pageName,
      savedSections: true,
      ...payload,
    };
    if (payload?.executives === "1") {
      data.executives = SelectSEData;
    }
    if (payload?.Customer === "0") {
      data.Customer = activeCustomers.toString();
    }
    setValidationMessage(false);
    axios({
      method: "post",
      url:
        baseUrl +
        `/dashboardsms/savedsearch/savedSearchData?userId=${loggedUserId}`,
      data: data,
    }).then(function (response) {
      setEditAddmsg(true);
      setOpenPopup(false);
      setComments("");
      setPagename("");
      setTimeout(() => {
        setEditAddmsg(false);
      }, 3000);
    });
  };
  //---Get Sections Based on DashboardType and User Id------//
  const getDatas = () => {
    let apiUrl;
    if (type === "1417") {
      apiUrl =
        baseUrl +
        `/ProjectMS/stakeholders/getSavesearchMyDashboard?user_id=${loggedUserId}&dashboard_type=1417`;
    } else if (type === "1418") {
      apiUrl =
        baseUrl + `/ProjectMS/stakeholders/getSavesearch?dashboard_type=1418`;
    }
    axios
      .get(apiUrl)
      .then((response) => {
        const res = response.data;
        setSection(res);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  useEffect(() => {
    getDatas();
  }, [type]);
  //-------------------------------//
  return (
    <>
      <IoMdSave
        className="globalSave"
        title="Save Search Filters"
        style={{ cursor: "pointer" }}
        onClick={() => {
          setOpenPopup(true), setValidationMessage(false);
        }}
      />
      <>
        <CModal
          visible={openPopup}
          size="Default"
          onClose={() => setOpenPopup(false)}
          backdrop={"static"}
        >
          <CModalHeader className="SavedSearchGlobalPopup"></CModalHeader>
          {validationMessage ? (
            <div className="statusMsg error">
              <span className="error-block">
                <AiFillWarning /> &nbsp;Please select valid values for
                highlighted fields
              </span>
            </div>
          ) : (
            ""
          )}
          <CModalBody>
            <div className="col-md-12">
              <div className="form-group row mb-2">
                <label className="col-4">
                  Enter Search Name &nbsp;&nbsp;
                  <span className="error-text">*</span>
                </label>
                <span className="col-1 p-0">:</span>
                <div className="col-6">
                  <div
                    className="textfield"
                    ref={(ele) => {
                      ref.current[0] = ele;
                    }}
                  >
                    <input
                      type="text"
                      name="search_name"
                      id="search_name"
                      value={comments}
                      onChange={(e) => {
                        const inputValue = e.target.value;
                        setComments(inputValue);
                      }}
                    />
                  </div>
                </div>
              </div>
              <div className="form-group row mb-2">
                <label className="col-4" htmlFor="">
                  Dashboard
                </label>
                <span className="col-1 p-0">:</span>
                <div className="col-6">
                  <select
                    id="dashboard_type"
                    name="dashboard_type"
                    value={dashboardType}
                    onChange={(e) => {
                      setDashboardType(e.target.value);
                      setType(e.target.value);
                    }}
                  >
                    <option value="1417">My Dashboard </option>
                    <option value="1418">Org Dashboard</option>
                  </select>
                </div>
              </div>
              <div className="form-group row mb-2">
                <label className="col-4" htmlFor="">
                  Section &nbsp;&nbsp;
                  <span className="error-text">*</span>
                </label>
                <span className="col-1 p-0">:</span>
                <div className="col-6">
                  <div
                    className="textfield"
                    ref={(ele) => {
                      ref.current[1] = ele;
                    }}
                  >
                    <input
                      className="textfield"
                      id="page_name"
                      onChange={(e) => {
                        setPagename(e.target.value);
                      }}
                      value={pageName}
                      list="sectionList"
                      // onChange={onSelectionChange}
                      placeholder="Search or Enter & Press to save"
                      style={{
                        padding: "0 5px",
                        width: "100% ",
                        borderRadius: "5px",
                        backgroundColor: validationMessage
                          ? "rgba(228, 27, 27, 0.2)"
                          : "#fff",
                        border: validationMessage
                          ? "1px solid #e41b1b"
                          : "1px solid #ddd",
                        height: "23px",
                        fontSize: "13px",
                      }}
                    />
                    <datalist id="sectionList" className="text">
                      {section.map((section) => (
                        <option key={section.id} value={section.section} />
                      ))}
                    </datalist>
                  </div>
                </div>
              </div>
            </div>
            <div className='className="col-md-12 col-sm-12 col-xs-12 btn-container center my-3'>
              <button className="btn btn-primary " onClick={handleSaveclick}>
                <SaveIcon />
                Save
              </button>
            </div>
          </CModalBody>
        </CModal>
      </>
    </>
  );
}
