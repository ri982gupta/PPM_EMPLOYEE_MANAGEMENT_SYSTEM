import React, { useState, useEffect } from "react";
import { FaSearch } from "react-icons/fa";
import { IoWarningOutline } from "react-icons/io5";
import { ReactSearchAutocomplete } from "react-search-autocomplete";
import axios from "axios";
import { environment } from "../../environments/environment";
import { Link } from "react-router-dom";
import { BiSearch } from "react-icons/bi";
import ScreenBreadcrumbs from "../Common/ScreenBreadcrumbs";
import GlobalHelp from "../PrimeReactTableComponent/GlobalHelp";



function InnerOpen(props) {
  const { setButtonState } = props;
  const [empDetails, setEmpDetails] = useState([]);
  const [autoCompleteValidation, setAutoCompleteValidation] = useState("");
  const [validationmessage, setValidationMessage] = useState(false);
  const baseUrl = environment.baseUrl;
  const [formEditData, setFormEditData] = useState([{}]);
  //console.log(formEditData);
  const loggedUserId = localStorage.getItem("resId");
  //console.log(loggedUserId);

  const [routes, setRoutes] = useState([]);
  let textContent = "Teams";
  let currentScreenName = ["Insights", "Teams Search History"];
  sessionStorage.setItem(
    "breadCrumbs",
    JSON.stringify({ routes: routes, currentScreenName: currentScreenName, textContent: textContent })
  );

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
      const urlPathValue = "/search/userSearchHistory";
      getUrlPath(urlPathValue);
      const updatedMenuData = data.map((category) => ({
        ...category,
        subMenus: category.subMenus.map((submenu) => {
          if (submenu.display_name === "Profile") {
            return {
              ...submenu,
              display_name: "Insights",
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
  const getUrlPath = (urlPathValue) => {
    console.log(urlPathValue);
    axios({
      method: "get",
      url:
        baseUrl +
        `/CommonMS/security/authorize?url=${urlPathValue}&userId=${loggedUserId}`,
    })
      .then((res) => {

      })
      .catch((error) => { });
  };
  const getData = () => {
    //console.log("line no 106");
    axios({
      method: "get",
      url: baseUrl + `/ProjectMS/Issues/getAssignedData`,
    }).then(function (response) {
      var res = response.data;
      setEmpDetails(res);
      //console.log("assigned data");
      //console.log(res);
    });
  };
  const [profiledata, setProfiledata] = useState([]);
  const getprofileopen = () => {
    axios({
      method: "get",
      url:
        baseUrl +
        `/ProjectMS/stakeholders/getprofileopen?user_id=${loggedUserId}`,
    })
      .then((res) => {
        setProfiledata(res.data);
      })
      .then((error) => {
        //console.log("success", error);
      });
  };
  console.log(profiledata);
  useEffect(() => { }, [empDetails]);
  useEffect(() => {
    getData();
    getprofileopen();
  }, []);
  //console.log(formEditData.id);
  //-----only link direct
  const handleProjectSelect = (object_id) => {
    //console.log("inline-------------------------10");
    //console.log(object_id);
    {
      <Link
        title="Search"
        to={`/resource/profile/:${object_id}`}
        target="_blank"
      ></Link>;
    }
    axios({
      method: "post",
      url: baseUrl + `/ProjectMS/stakeholders/updateUserSearchHistorypo`,
      data: {
        user_id: loggedUserId,
        object_id: object_id,
      },
      headers: { "Content-Type": "application/json" },
    }).then((success) => {
      //console.log(success);
      //console.log(data);
    });
  };
  //----select Team link direct
  const handleTeamsSelect = () => {
    //console.log("inline-------------------------10");
    //console.log(formEditData.id);
    if (formEditData.id == null) {
      setAutoCompleteValidation("1px solid rgb(183 1 1) !important");
      setValidationMessage(true);
      // return;
    } else {
      setValidationMessage(false);
      {
        <Link
          title="Search"
          to={`/resource/profile/:${formEditData.id}`}
          target="_blank"
        ></Link>;
      }

      //console.log(formEditData.id);
      axios({
        method: "post",
        url: baseUrl + `/ProjectMS/stakeholders/updateUserSearchHistorteamsel`,
        data: {
          user_id: loggedUserId,
          object_id: formEditData.id,
        },
        headers: { "Content-Type": "application/json" },
      }).then((success) => {
        //console.log(success);
        //console.log(data);
      });
    }
    // //console.log(object_id)
  };
  const handleClear = () => {
    setFormEditData((prevProps) => ({ ...prevProps, id: null }));
  };

  return (
    <div>
      <div>
        <div className="body body-bg col-xs-12 col-sm-12 col-md-12 col-lg-12 customCard ">
          <div className="col-md-12 collapseHeader"></div>
          <div className="form-group cvu darkHeader">
            <div className="col-6 my-2 no-padding">
              <table
                id="details"
                className="col-12 table table-bordered  openTable " /////customerEngament
              >
                <thead>
                  <tr>
                    <th
                      colSpan={4}
                      className="tableheading"
                      style={{ backgroundColor: "#eeeeee" }}
                    >
                      <h6
                        className="text-center m-0"
                        style={{ color: "#187fde", fontSize: "15px" }}
                      >
                        {`Recent Teams Searches`}
                      </h6>
                    </th>
                  </tr>

                  <tr>
                    <th
                      className="tableheading"
                      style={{ backgroundColor: "#eeeeee" }}
                    >
                      <h6
                        className="text-center m-0 "
                        style={{ fontSize: "13px" }}
                      >
                        Teams
                      </h6>
                    </th>
                    <th
                      className="tableheading"
                      style={{ backgroundColor: "#eeeeee" }}
                    >
                      <h6
                        className="text-center m-0"
                        style={{ fontSize: "13px" }}
                      >
                        Departments
                      </h6>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {profiledata.map((item, index) => (
                    <tr key={item.object_id}>
                      <td>
                        <Link
                          data-toggle="tooltip"
                          title="Go To Resource Profile"
                          onClick={() => {
                            setButtonState("Profile");
                            handleProjectSelect(item.object_id);
                          }}
                          to={`/resource/profile/:${item.object_id}`} // Use template literals here
                          target="_blank"
                        >
                          {item.Empname}
                        </Link>
                      </td>
                      <td>{profiledata[index]?.name}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div>
              <div className="col-md-6">
                {validationmessage ? (
                  <div
                    className="statusMsg error "
                    style={{ display: "block" }}
                  >
                    <span>
                      <IoWarningOutline />
                      &nbsp;{`Please select any Teams`}
                    </span>
                  </div>
                ) : (
                  ""
                )}
              </div>
              <div className="row ">
                <div className="col-1 ">
                  <h6>
                    Teams <span style={{ color: "red" }}>*</span>
                    &nbsp;&nbsp;&nbsp;&nbsp;:
                  </h6>
                </div>
                <div className="col-4 autoComplete-container" id="autoComplete">
                  <ReactSearchAutocomplete
                    items={empDetails}
                    type="Text"
                    name="Teams"
                    id="Teams"
                    className="AutoComplete"
                    onSelect={(e) => {
                      setFormEditData(e);
                    }}
                    showIcon={false}
                    onClear={handleClear}
                    placeholder="Type minimum 4 characters"
                  />{" "}
                </div>
                <div className="err col-2">
                  {formEditData.id == undefined ? (
                    <button
                      title="Search"
                      className="btn btn-primary"
                      onClick={() => {
                        // setButtonState("Profile");
                        handleTeamsSelect();
                      }}
                    >
                      <BiSearch /> Search
                    </button>
                  ) : (
                    <Link
                      title="Search"
                      to={`/resource/profile/:${formEditData.id}`}
                      target="_blank"
                    >
                      <button
                        title="Search"
                        className="btn btn-primary "
                        onClick={() => {
                          setButtonState("Profile");
                          handleTeamsSelect();
                        }}
                      >
                        <BiSearch /> Search
                      </button>
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default InnerOpen;
