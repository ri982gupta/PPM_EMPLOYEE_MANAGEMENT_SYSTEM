import React, { useEffect, useRef, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { CContainer, CHeader, CHeaderNav, CHeaderToggler } from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { FiLogOut } from "react-icons/fi";
import { cilMenu } from "@coreui/icons";
import { set } from "../reducers/AppHeaderReducer";
import { BiCheck } from "react-icons/bi";
import axios from "axios";
import { Avatar } from "@mui/material";
import { environment } from "../environments/environment";
import moment from "moment";
import "../scss/_variables.scss";
import blueTheme from "../assets/theme-preview/blue.jpg";
import orangeTheme from "../assets/theme-preview/orange.jpg";
import greenTheme from "../assets/theme-preview/green.jpg";
import grayTheme from "../assets/theme-preview/gray.jpg";
import ScreenBreadcrumbs from "../views/Common/ScreenBreadcrumbs";
import DarkModeToggle from "./DarkMode";
import { FaInfoCircle } from "react-icons/fa";

const AppHeader = () => {
  const [disp, setDisp] = useState(false);
  const [loginCount7Days, setLoginCount7Days] = useState(
    localStorage.getItem("loginCount7Days")
  );
  const [loginCount30Days, setLoginCount30Days] = useState(
    localStorage.getItem("loginCount30Days")
  );

  const dispatch = useDispatch();
  const sidebarShow = useSelector((state) => state.appHeaderState.sidebarShow);
  const userName = localStorage.getItem("resName");
  const userId = localStorage.getItem("resId");
  const lastUpdatedDt = localStorage.getItem("lastUpdatedDt");
  // const loginCount7Days = localStorage.getItem("loginCount7Days");
  // const loginCount30Days = localStorage.getItem("loginCount30Days");

  window.addEventListener("storage", (e) => {
    console.log("hi event");
    console.log(e, "storage e");
    if (e.key == "loginCount7Days" || e.key == "loginCount30Days") {
      // Handle the event, update your UI or variables as needed
      const newLoginCount7Days = localStorage.getItem("loginCount7Days");
      const newLoginCount30Days = localStorage.getItem("loginCount30Days");
      // Update your UI or variables here by setting them in state
      setLoginCount7Days(newLoginCount7Days);
      setLoginCount30Days(newLoginCount30Days);
    }
    // const triggerStorageEvent = () => {
    //   console.log("on eventhandler");
    //   localStorage.setItem("loginCount7Days", "new value for loginCount7Days");
    //   localStorage.setItem(
    //     "loginCount30Days",
    //     "new value for loginCount30Days"
    //   );
    // };
    // // Call the test event trigger function to see if the event listener works
    // triggerStorageEvent();
  });

  // console.log(lastUpdatedDt, "updateddt")
  const navigate = useNavigate();
  const baseUrl = environment.baseUrl;
  const dropdownRef = useRef(null);
  const [profileImgSrc, setProfileImgSrc] = useState([]);

  const crumbData = JSON.parse(sessionStorage.getItem("breadCrumbs"));
  const displayName = sessionStorage.getItem("displayName");
  const getProfile = () => {
    axios({
      method: "get",
      url:
        baseUrl +
        // `/LayoutMS/auth/displayImage?userId=${userId}`,
        `/LayoutMS/auth/displayImage?type=PROFILE_IMAGE&empId=${userId}`,
    }).then((res) => {
      let data = res.data;
      const profileImgSrc = "data:image/jpeg;charset=utf-8;base64," + data;
      setProfileImgSrc(profileImgSrc);
    });
  };

  const [activeTheme, setActiveTheme] = useState("_theme1");

  const handleThemeChange = (theme) => {
    if (theme !== activeTheme) {
      setActiveTheme(theme);
      localStorage.setItem("selectedTheme", theme);

      if (theme === "_theme1") {
        document.documentElement.style.setProperty("--primary", "#02277f");
        document.documentElement.style.setProperty(
          "--primary-light",
          "#4e68a5"
        );
        document.documentElement.style.setProperty("--accent", "#15a7ea");
      } else if (theme === "theme2") {
        document.documentElement.style.setProperty("--primary", "#030e4f");
        document.documentElement.style.setProperty(
          "--primary-light",
          "#4f5684"
        );
        document.documentElement.style.setProperty("--accent", "#f6ae1f");
      } else if (theme === "theme3") {
        document.documentElement.style.setProperty("--primary", "#222538");
        document.documentElement.style.setProperty(
          "--primary-light",
          "#646674"
        );
        document.documentElement.style.setProperty("--accent", "#73C9B7");
      } else if (theme === "theme4") {
        document.documentElement.style.setProperty("--primary", "#202020");
        document.documentElement.style.setProperty(
          "--primary-light",
          "#606060"
        );
        document.documentElement.style.setProperty("--accent", "#707070");
      }
    }
  };
  const storedMainTheme = () => {
    const storedTheme = localStorage.getItem("selectedTheme");
    if (storedTheme) {
      handleThemeChange(storedTheme);
    }
    console.log(storedTheme);
  };
  useEffect(() => {
    storedMainTheme();
  }, []);

  const logout = () => {
    localStorage.clear();
    sessionStorage.clear();

    // document.documentElement.style.setProperty("--primary", "#02277f");
    // document.documentElement.style.setProperty("--accent", "#15a7ea");

    navigate("/");
  };

  useEffect(() => {
    getProfile();
  }, []);

  const homeScreenmsg = useSelector(
    (state) => state.selectedSEState.homeScreenMessage
  );

  const homeScreenSubmenuName = useSelector(
    (state) => state.selectedSEState.homeScreenSubmenu
  );

  const toggleDropdown = () => {
    setDisp(!disp);
  };

  useEffect(() => {
    // Function to handle clicks outside of the dropdown
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        // Clicked outside the dropdown, so close it
        setDisp(false);
      }
    }

    // Add event listener when the component mounts
    document.addEventListener("mousedown", handleClickOutside);

    // Clean up the event listener when the component unmounts
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div>
      <CHeader position="sticky">
        <CContainer fluid>
          <CHeaderToggler
            className="ps-1"
            onClick={() => dispatch(set({ sidebarShow: !sidebarShow }))}
          >
            <CIcon icon={cilMenu} size="lg" />
          </CHeaderToggler>
          {displayName === crumbData?.textContent ? (
            <ScreenBreadcrumbs
              routes={crumbData?.routes}
              currentScreenName={crumbData?.currentScreenName}
            />
          ) : null}
          <CHeaderNav className="headerRight">
            {/* <DarkModeToggle /> */}

            <img src="prolifics-logo.png" alt="" className="headerLogo" />

            <div className="loggedinUserDetails" onClick={toggleDropdown}>
              <div
                className={
                  // profileImgSrc.length <= 37
                  //   ? "loggedinUserTopSection noProfileImg":
                  "loggedinUserTopSection"
                }
              >
                <div className="imgContainer">
                  <div class="lds-ripple">
                    <div></div>
                    <div></div>
                  </div>
                  <Avatar
                    src={
                      `${profileImgSrc}` == ""
                        ? `profiles/emp_007.png`
                        : `${profileImgSrc}`
                    }
                    className="userProfileImg"
                  />
                  {/* <FaInfoCircle className="infoIcon" />
                  <div className="message">
                    Please upload your Profile picture in PeP
                  </div> */}
                </div>
                <div className="loggedinUser">
                  <span className="loggedinUserName">{userName}</span>
                  {/* <div className="userLastLogin">
                    <span>Last login :</span>
                    <span className="loginTime">
                      {
                        moment(lastUpdatedDt).format("DD/MM/YYYY") ==
                        "Invalid date"
                          ? "--"
                          : moment(lastUpdatedDt).format("DD/MM/YYYY , hh:mm A")
                        // moment(lastUpdatedDt).format("hh:mm A")
                      }
                    </span>
                    <br />
                    <span>Last login Time:</span>
                    <span className="loginTime">
                      {moment(lastUpdatedDt).format("HH:mm") == "Invalid date"
                        ? "--"
                        : moment(lastUpdatedDt).format("HH:mm")}
                    </span>
                  </div> */}
                </div>
              </div>
              {disp && (
                <div className="userDetailsDropdown" ref={dropdownRef}>
                  <div className="lastLogins">
                    <div>
                      Last login:
                      <span className="loginTime">
                        {moment(lastUpdatedDt, "YYYY-MM-DDTHH:mm:ssZ").isValid()
                          ? moment(
                              lastUpdatedDt,
                              "YYYY-MM-DDTHH:mm:ssZ"
                            ).format(" DD/MM/YYYY ,hh:mm A ")
                          : "--"}
                      </span>
                    </div>
                    <div>
                      Last 7 days count:<span>{loginCount7Days}</span>
                    </div>
                    <div>
                      Last 30 days count:<span>{loginCount30Days}</span>
                    </div>
                  </div>
                  <div className="blackout"></div>
                  <div className="userThemes">
                    <div className="themeTitle">Choose Theme</div>
                    <div className={`themeOptions ${activeTheme}`}>
                      <div
                        onClick={() => handleThemeChange("_theme1")}
                        title="Blue"
                        className="themePreview"
                      >
                        <img src={blueTheme} alt="" />
                      </div>
                      <div
                        onClick={() => handleThemeChange("theme2")}
                        title="Orange"
                        className="themePreview"
                      >
                        <img src={orangeTheme} alt="" />
                      </div>
                      <div
                        onClick={() => handleThemeChange("theme3")}
                        title="Green"
                        className="themePreview"
                      >
                        <img src={greenTheme} alt="" />
                      </div>
                      <div
                        onClick={() => handleThemeChange("theme4")}
                        title="Grey"
                        className="themePreview"
                      >
                        <img src={grayTheme} alt="" />
                      </div>
                    </div>
                  </div>
                  <div className="userLogoutBtn" onClick={logout}>
                    <span>Logout</span>
                    <FiLogOut />
                  </div>
                </div>
              )}
            </div>
          </CHeaderNav>
        </CContainer>
      </CHeader>
      {homeScreenmsg ? (
        <div>
          <div className="statusMsg success">
            <span className="errMsg">
              <BiCheck size="1.4em" /> &nbsp; Home Page has been set to{" "}
              {homeScreenSubmenuName} successfully
            </span>
          </div>
        </div>
      ) : (
        ""
      )}
    </div>
  );
};
export default AppHeader;
