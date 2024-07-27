import React, { useEffect, useState } from "react";
import { HashRouter, Route, Routes, useNavigate } from "react-router-dom";
import "./scss/style.scss";
import "./App.scss";
import "./scss/_custom.scss";
import moment from "moment";
import { environment } from "./environments/environment";
import SessionExpiryPopup from "./components/SessionExpirationModal";
const loading = (
  <div className="pt-3 text-center">
    <div className="sk-spinner sk-spinner-pulse"></div>
  </div>
);

// Containers
const DefaultLayout = React.lazy(() => import("./layout/DefaultLayout"));

// Pages
const Login = React.lazy(() => import("./views/pages/login/Login"));
const Register = React.lazy(() => import("./views/pages/register/Register"));
const Page404 = React.lazy(() => import("./views/pages/page404/Page404"));
const Page500 = React.lazy(() => import("./views/pages/page500/Page500"));
const CsatSurvey = React.lazy(() =>
  import("./views/pages/survey/CsatSurveyParentComponent")
);
const NpsSurvey = React.lazy(() =>
  import("./views/pages/survey/NpsSurveyParentComponent")
);
const reactBaseUrl = environment.reactBaseUrl;

function App() {
  const navigate = useNavigate();
  const [showSessionExpiryPopup, setShowSessionExpiryPopup] = useState(false);
  const [countdown, setCountdown] = useState(120);

  useEffect(() => {
    const intervalId = setInterval(() => {
      const expireTime = localStorage.getItem("expireTime");
      if (expireTime) {
        const remainingTime = Math.max(
          0,
          moment(expireTime).diff(moment(), "seconds")
        );
        setCountdown(remainingTime);

        if (remainingTime <= 120) {
          setShowSessionExpiryPopup(false);
        } else {
          setShowSessionExpiryPopup(false);
        }
      }
    });

    const updateExpireTime = () => {
      if (!showSessionExpiryPopup) {
        const localStorageIsLoggedIn = localStorage?.getItem("loggedIn");
        const localStorageExpireTime = localStorage?.getItem("expireTime");

        if (
          /true/.test(localStorageIsLoggedIn) &&
          moment().isBefore(moment(localStorageExpireTime)) == true
        ) {
          const expireTime = moment().add(20, "minutes");

          localStorage.setItem("expireTime", expireTime);
          localStorage.setItem("loggedIn", true);
        }
      }
    };

    window.addEventListener("click", updateExpireTime);
    window.addEventListener("keypress", updateExpireTime);
    window.addEventListener("scroll", updateExpireTime);
    window.addEventListener("storage", handleStorageChange);
    return () => {
      clearInterval(intervalId);
      window.removeEventListener("click", updateExpireTime);
      window.removeEventListener("keypress", updateExpireTime);
      window.removeEventListener("scroll", updateExpireTime);
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [countdown, showSessionExpiryPopup]);

  function handleStorageChange(event) {
    if (event.key === "expireTime") {
      const remainingTime = Math.max(
        0,
        moment(event.newValue).diff(moment(), "seconds")
      );
      setCountdown(remainingTime);

      if (remainingTime <= 120) {
        setShowSessionExpiryPopup(false);
      } else {
        setShowSessionExpiryPopup(false);
      }
    }
  }

  const handleLogout = () => {
    setShowSessionExpiryPopup(false);
    localStorage.clear();
    sessionStorage.clear();
    navigate("/");
  };

  const handleContinueSession = () => {
    const newExpireTime = moment().add(20, "minutes");
    localStorage.setItem("expireTime", newExpireTime);
    setShowSessionExpiryPopup(false);
  };

  const isLoggedIn = localStorage.getItem("isAuth") === "true";
  const isLoggedIn2 = sessionStorage.getItem("userIn") === "true";
  return (
    <React.Suspense fallback={loading}>
      <Routes>
        <Route exact path="/" element={<Login />} />
        <Route exact path="/register" element={<Register />} />
        <Route exact path="/404" element={<Page404 />} />
        <Route exact path="/500" element={<Page500 />} />
        <Route path="*" element={<DefaultLayout />} />
        <Route exact path="/survey/doSurvey/:token" element={<CsatSurvey />} />
        <Route
          exact
          path="/survey/doNPVSurvey/:token"
          element={<NpsSurvey />}
        />
      </Routes>
      {isLoggedIn2 && (
        <SessionExpiryPopup
          show={showSessionExpiryPopup}
          onHide={() => setShowSessionExpiryPopup(false)}
          countdown={countdown}
          onContinueSession={handleContinueSession}
          onLogout={handleLogout}
        />
      )}
    </React.Suspense>
  );
}

export default App;
