import React, { useEffect, useRef, useState } from "react";
import "./Login.scss";
import { ReactComponent as LoginImg } from "./LoginImg.svg";
import { gsap } from "gsap";
import { Link, useNavigate } from "react-router-dom";
import {
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { cilLockLocked, cilUser } from "@coreui/icons";
import axios from "axios";
import { IoWarningOutline } from "react-icons/io5";
import { environment } from "../../../environments/environment";
import { BiCheck, BiCheckCircle } from "react-icons/bi";
import moment from "moment";
import { useDispatch } from "react-redux";
import { resetSidebarShow } from "../../../reducers/AppHeaderReducer.js";
import { DateTime } from "luxon";

const ErrorBoundary = ({ children }) => {
  const [error, setError] = useState(null);

  // This function is called when an error occurs in the children components
  const componentDidCatch = (error, errorInfo) => {
    // You can log the error or handle it in any way you prefer
    console.error(error, errorInfo);
    setError(error);
  };

  return error ? (
    <div>
      <p>Something went wrong.</p>
    </div>
  ) : (
    children
  );
};

const Login = () => {
  const baseUrl = environment.baseUrl;
  const [loginData, setLoginData] = useState({
    userName: "",
    password: "",
    inputCaptcha: "",
  });

  const navigate = useNavigate();
  const ref = useRef();
  const dispatch = useDispatch();

  const [loginState, setLoginState] = useState(false);
  const [loginValue, setLoginValue] = useState("");
  const [disableLogin, setDisableLogin] = useState(false);
  const [showCaptcha, setShowCaptcha] = useState(false);
  const [captchaCode, setCaptchaCode] = useState([]);
  const [enableClock,setenableClock]=useState(false);
  const [lockTimeStart,setLockTimeStart]=useState();
  const [lockTimeEnd,setLockTimeEnd]=useState();
  const [isAccountLock,setIsAccountLock]=useState(false);

  const currentDatetime = DateTime.local();
  // const offsetHours = currentDatetime.toFormat('Z');
  const offsetMinutes = currentDatetime.toFormat("ZZ");

  // Format the offset as "UTC�HH:MM"
  const currentZone = `UTC${offsetMinutes}`;
  // const currentZone = currentDatetime.zoneName;

  const [timeZonePayload, setTimeZonePayload] = useState({
    userName: "",
    password: "",
    timeZone: currentZone,
  });
  useEffect(() => {
    const isAuthenticated = localStorage.getItem("token") === "true";
    if (isAuthenticated) {
      const path = localStorage.getItem("path");
      const isAuth = localStorage.getItem("isAuth");
      if (path && isAuth == "true") {
        navigate(path);
        sessionStorage.setItem("userIn", "true");
      }
    }
  }, []);

  useEffect(() => {
    if (typeof caches !== "undefined") {
      caches.keys().then((names) => {
        names.forEach((name) => {
          caches.delete(name);
        });
      });
    }
  }, []);

  useEffect(() => {
    // Your GSAP animation code here
    gsap.from("#floor", {
      x: -10,
      opacity: 0,
      duration: 1,
      ease: "power2.inOut",
    });
    gsap.from("#floor3-desk1, #floor3-desk3", {
      opacity: 0,
      duration: 1.2,
      ease: "power2.inOut",
    });
    gsap.from("#floor3-desk2,#floor3-desk4", {
      opacity: 0,
      duration: 1.5,
      ease: "power2.inOut",
    });
    gsap.from("#shelf1", {
      y: -10,
      opacity: 0,
      duration: 1.4,
      ease: "power2.inOut",
    });
    gsap.from("#shelf2", {
      y: -10,
      opacity: 0,
      duration: 1.6,
      ease: "power2.inOut",
    });
    gsap.from("#shelf3", {
      y: -10,
      opacity: 0,
      duration: 1.8,
      ease: "power2.inOut",
    });
    gsap.from("#shelf4", {
      y: -10,
      opacity: 0,
      duration: 2,
      ease: "power2.inOut",
    });
    gsap.from("#floor2-chair1", {
      y: -20,
      opacity: 0,
      duration: 1.5,
      ease: "power2.inOut",
    });
    gsap.from("#floor2-chair2", {
      y: -20,
      opacity: 0,
      duration: 1.6,
      ease: "power2.inOut",
    });
    gsap.from("#floor2-chair3", {
      y: -20,
      opacity: 0,
      duration: 1.7,
      ease: "power2.inOut",
    });
    gsap.from("#floor2-chair4", {
      y: -20,
      opacity: 0,
      duration: 1.8,
      ease: "power2.inOut",
    });
    gsap.from("#floor2-chair5", {
      y: -20,
      opacity: 0,
      duration: 1.9,
      ease: "power2.inOut",
    });
    gsap.from("#floor2-chair6", {
      y: -20,
      opacity: 0,
      duration: 2,
      ease: "power2.inOut",
    });
    gsap.from("#floor2-chair7", {
      y: -20,
      opacity: 0,
      duration: 2.1,
      ease: "power2.inOut",
    });
    gsap.from("#floor2-chair8", {
      y: -20,
      opacity: 0,
      duration: 2.2,
      ease: "power2.inOut",
    });
    gsap.from("#floor2-chair9", {
      y: -20,
      opacity: 0,
      duration: 2.3,
      ease: "power2.inOut",
    });
    gsap.from("#step1-3", {
      y: -10,
      opacity: 0,
      duration: 1.2,
      ease: "power2.inOut",
    });
    gsap.from("#step1-2", {
      y: -10,
      opacity: 0,
      duration: 1.3,
      ease: "power2.inOut",
    });
    gsap.from("#step1-1", {
      y: -10,
      opacity: 0,
      duration: 1.4,
      ease: "power2.inOut",
    });
    gsap.from("#step2-4", {
      y: -10,
      opacity: 0,
      duration: 1.1,
      ease: "power2.inOut",
    });
    gsap.from("#step2-3", {
      y: -10,
      opacity: 0,
      duration: 1.2,
      ease: "power2.inOut",
    });
    gsap.from("#step2-2", {
      y: -10,
      opacity: 0,
      duration: 1.3,
      ease: "power2.inOut",
    });
    gsap.from("#step2-1", {
      y: -10,
      opacity: 0,
      duration: 1.4,
      ease: "power2.inOut",
    });
    gsap.from("#board", {
      y: -10,
      opacity: 0,
      duration: 2,
      ease: "elastic.out(1,0.5)",
    });
  }, []);

  const onFilterChange = ({ id, value }) => {
    setLoginData((prevState) => {
      return { ...prevState, [id]: value };
    });
    setTimeZonePayload((prevState) => {
      return { ...prevState, [id]: value };
    });
  };

  const updateExpireTime = () => {
    if (localStorage.getItem("expireTime") == undefined) {
      const expireTime = moment().add(20, "minutes");
      localStorage.setItem("expireTime", expireTime);
      localStorage.setItem("loggedIn", true);
    }
  };

  const captchaInputRef = useRef(null);

  const reloadCaptcha = () => {
    axios
      .get(baseUrl + `/LayoutMS/captcha/captcha`)
      .then(function (captchaResponse) {
        const base64ImageString = captchaResponse.data.encodedString;
        setCaptchaCode(captchaResponse.data.code);
        const imgElement = document.createElement("img");
        imgElement.src = `data:image/png;base64,${base64ImageString}`;

        const imageContainer = document.getElementById("captchaImageContainer");
        imageContainer.innerHTML = "";
        imageContainer.appendChild(imgElement);

        if (captchaInputRef.current) {
          captchaInputRef.current.value = "";
        }
      })
      .catch(function (captchaError) {
        console.error("Error fetching captcha:", captchaError);
      });
  };

  const getLoginDtls = () => {
    setDisableLogin(true);
    if (showCaptcha) {
      //Condition For Empty Captcha
      if (!loginData.inputCaptcha) {
        setLoginState(true);
        setLoginValue(
          <div className="statusMsg error">
            <IoWarningOutline /> {"Please enter the captcha value."}
          </div>
        );
        setDisableLogin(false);
        return;
      }

      // Condition for Captcha Matching
      if (loginData.inputCaptcha !== captchaCode) {
        setLoginState(true);
        setLoginValue(
          <div className="statusMsg error">
            <IoWarningOutline /> {"Please provide valid captcha."}
          </div>
        );
        reloadCaptcha();
        setShowCaptcha(true);
        setDisableLogin(false);
        return;
      }
    }
    axios({
      method: "post",
      url: baseUrl + `/LayoutMS/auth/login`,
      data: JSON.stringify(loginData),
      headers: { "Content-Type": "application/json" },
    })
      .then(function (response) {
        const path = response.data.path;

        if (response.data.success === true && response.data.jwtToken != null) {
          setDisableLogin(true);

          axios({
            method: "post",
            url: baseUrl + `/LayoutMS/auth/getloginCount`,
            data: JSON.stringify(timeZonePayload),
            headers: { "Content-Type": "application/json" },
          }).then(function (resp) {
            localStorage.setItem(
              "lastUpdatedDt",
              resp.data.last_updated_login_dt
            );
            localStorage.setItem("loginCount7Days", resp.data.loginCount7Days);
            localStorage.setItem(
              "loginCount30Days",
              resp.data.loginCount30Days
            );
          });
          setLoginState(true);

          setLoginValue(
            <div className="statusMsg success">
              <BiCheckCircle size="1.4em" /> {"Login Successful!"}
            </div>
          );

          {
            path == null
              ? setTimeout(() => {
                  setLoginState(false);
                  setLoginValue("");
                  localStorage.setItem("path", "/resource/dashboard");
                  navigate("/resource/dashboard");
                }, 1500)
              : setTimeout(() => {
                  setLoginState(false);
                  setLoginValue("");
                  localStorage.setItem("path", path);
                  navigate(path);
                }, 1500);
          }
          sessionStorage.setItem("userIn", "true");
          localStorage.setItem("expiry", Date.now() + 1800000);
          localStorage.setItem("resId", response.data.id);
          localStorage.setItem("resName", response.data.resourceName);
          localStorage.setItem("token", response.data.success);
          localStorage.setItem("jwtToken", response.data.jwtToken);

          updateExpireTime();
          dispatch(resetSidebarShow());
        } else if (loginData.userName == "" || loginData.password == "") {
          setLoginState(true);
          setDisableLogin(false);
          setLoginValue(
            <div className="statusMsg error">
              <IoWarningOutline /> {"Please provide username or password!!"}
            </div>
          );
          reloadCaptcha();
          setShowCaptcha(false);
        } else {
          setLoginState(true);
          setDisableLogin(false);
          setLoginValue(
            <div className="statusMsg error">
              <IoWarningOutline /> {"Incorrect Credentials!"}
            </div>
          );
          reloadCaptcha();
          setShowCaptcha(true);
          if(response.data?.isAccountLock === true)
          {
            setenableClock(true);
            setShowCaptcha(false);
            setLockTimeStart(response.data.accountLockStartTime)
            setLockTimeEnd(response.data.accountLockRealeseTime)
            setDisableLogin(true)
          }
        }
      })
      .catch(function (response) {
        setLoginState(true);
        setLoginValue(
          <div className="statusMsg error">
            <IoWarningOutline /> {"Login Failed!"}
          </div>
        );
      });
    setDisableLogin(false);
  };

  // Calculate the remaining lock time
const calculateRemainingLockTime = () => {
  if (!lockTimeEnd) return 0; // If lock end time is not set, lock is expired
  const currentTime = new Date();
  const lockTimeEndString = new Date(lockTimeEnd);
  const remainingTimeMillis = lockTimeEndString - currentTime;
  return Math.max(0, remainingTimeMillis);
};

// State to hold remaining lock time
const [remainingLockTime, setRemainingLockTime] = useState(calculateRemainingLockTime());

// Update remaining lock time every second
useEffect(() => {
  const timer = setInterval(() => {
    setRemainingLockTime(calculateRemainingLockTime());
  }, 1000);

  return () => clearInterval(timer);
}, [lockTimeEnd]); // Re-run effect when lock end time changes

// Calculate remaining days, hours, minutes, and seconds
const days = Math.floor(remainingLockTime / (1000 * 60 * 60 * 24));
const hours = Math.floor((remainingLockTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
const minutes = Math.floor((remainingLockTime % (1000 * 60 * 60)) / (1000 * 60));
const seconds = Math.floor((remainingLockTime % (1000 * 60)) / 1000);

  return (
    <div className="loginContainer">
      <div className="leftContent">
        <LoginImg />
      </div>
      <div className="rightContent">
        <div className="formArea">
          <img
            ref={ref}
            src="ppm-logo-dark.svg"
            className="loginLogo"
            alt="PPM Logo"
          />
          <CForm>
            <h1 className="mb-1">Login</h1>
            <p className="mb-3">Sign In to your account</p>
            {loginState ? <div>{loginValue}</div> : ""}
            <div className="mb-3">
              <label htmlFor="password">Email address</label>
              <input
                id="userName"
                type="email"
                className="form-control "
                placeholder="name@example.com"
                required
                onChange={(e) => {
                  onFilterChange(e.target);
                }}
              />
            </div>
            <div className="">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                className="form-control "
                id="password"
                placeholder="Password"
                required
                onChange={(e) => {
                  onFilterChange(e.target);
                }}
              />
            </div>
            {showCaptcha && (
              <div>
                <div className="row">
                  <div className="col-md-6">
                    <div className="mt-2">
                      <label htmlFor="captcha">Captcha</label>
                      <input
                        type="text"
                        className="form-control"
                        id="inputCaptcha"
                        placeholder="Captcha Value"
                        required
                        onChange={(e) => {
                          onFilterChange(e.target);
                        }}
                        ref={captchaInputRef}
                      />
                    </div>
                  </div>

                  <div
                    className="col-md-2 mt-5"
                    id="captchaImageContainer"
                  ></div>
                </div>

                <div className="mt-3 reloadLink">
                  <a href="#" onClick={reloadCaptcha}>
                    Reload Captcha Image
                  </a>
                </div>
              </div>
            )}
            {
             enableClock && 
             <div style={{ textAlign: 'center' }}>
                {remainingLockTime > 0 ? (
                    <div style={{ color: 'red' }}>
                                Account locked. Please try again in: 
                                <br />
                                <b>
                                  {days > 0 && `${days}d`}
                                  {hours > 0 && `${days > 0 ? ':' : ''}${hours}h`}
                                  {minutes > 0 && `${days > 0 || hours > 0 ? ':' : ''}${minutes}m`}
                                  {seconds > 0 && `${days > 0 || hours > 0 || minutes > 0 ? ':' : ''}${seconds}s`}
                                </b>
                              </div>
                            ) : (
                              <div>
                                Refresh the page to try again.
                              </div>
                            )}
             </div>
            }
            <CButton
              className={
                disableLogin ? "disableField loginBtn mt-4" : "loginBtn mt-4"
              }
              id="loginButton"
              disabled={disableLogin}
              style={{ cursor: disableLogin ? "not-allowed" : "" }}
              onClick={() => {
                setDisableLogin(true), getLoginDtls();
              }}
            >
              Login
            </CButton>
          </CForm>
        </div>
      </div>
    </div>
  );
};

export default Login;
