// import React, { useState } from "react";
// import CustomMyDashboard from "./CustomMyDashboard";
// import CustomOrgDashboard from "./CustomOrgDashboard";
// import { environment } from "../../environments/environment";

// import axios from "axios";
// import ScreenBreadcrumbs from "../Common/ScreenBreadcrumbs";
// import { useEffect } from "react";
// import GlobalHelp from "../PrimeReactTableComponent/GlobalHelp";
// function CustomDashboard() {
//   const [buttonState, setButtonState] = useState("MyDashboard");

//   const baseUrl = environment.baseUrl;

//   const loggedUserId = localStorage.getItem("resId");
//   const [routes, setRoutes] = useState([]);
//   let textContent = "Dashboards";
//   let currentScreenName = ["Custom Dashboard"]

//   const HelpPDFName = "CustomDashboard.pdf";
//   const Headername = "Custom Dashboard Help";
//   const getMenus = () => {
//     // setMenusData

//     axios({
//       method: "GET",
//       url: baseUrl + `/CommonMS/master/getMenus?loggedUserId=${loggedUserId}`,
//     }).then((resp) => {
//       let data = resp.data;

//       data.forEach((item) => {
//         if (item.display_name === textContent) {
//           setRoutes([item]);
//         }
//       });
//     });
//   };

//   useEffect(() => {
//     getMenus();
//   }, []);
//   return (
//     <div>
//       <div className="pageTitle">
//         <div className="childOne"></div>
//         <div className="childTwo">
//           <h2>Custom Dashboard</h2>
//         </div>
//         <div className="childThree"></div>
//       </div>
//       <div className="helpBtn" style={{ float: "right", paddingTop: "5px" }}>
//         <GlobalHelp pdfname={HelpPDFName} name={Headername} />
//       </div>
//       <ScreenBreadcrumbs
//         routes={routes}
//         currentScreenName={currentScreenName}
//       />

//       <div className="tabs">
//         <button
//           className={
//             buttonState === "MyDashboard"
//               ? "buttonDisplayClick"
//               : "buttonDisplay"
//           }
//           onClick={() => {
//             setButtonState("MyDashboard");
//           }}
//         >
//           My Dashboard
//         </button>
//         <button
//           className={
//             buttonState === "OrgDashboard"
//               ? "buttonDisplayClick"
//               : "buttonDisplay"
//           }
//           onClick={() => {
//             setButtonState("OrgDashboard");
//           }}
//         >
//           Open
//         </button>
//       </div>

//       {buttonState === "MyDashboard" && <CustomMyDashboard />}
//       {buttonState === "OrgDashboard" && <CustomOrgDashboard />}
//     </div>
//   );
// }

// export default CustomDashboard;

// ******************** This code is for when we are refresh at a particular page, it should be with in that page ***********************

import React, { useState, useEffect } from "react";
import CustomMyDashboard from "./CustomMyDashboard";
import CustomOrgDashboard from "./CustomOrgDashboard";
import { environment } from "../../environments/environment";
import axios from "axios";
import ScreenBreadcrumbs from "../Common/ScreenBreadcrumbs";
import GlobalHelp from "../PrimeReactTableComponent/GlobalHelp";
import { BiCheck } from "react-icons/bi";

function CustomDashboard() {
  // const [buttonState, setButtonState] = useState(() => {
  //   // Retrieve the last selected tab from localStorage on component mount
  //   return localStorage.getItem("selectedDashboardTab") || "MyDashboard";
  // });
  const [buttonState, setButtonState] = useState("MyDashboard");
  const [addmsg, setAddmsg] = useState(false);
  const baseUrl = environment.baseUrl;

  const loggedUserId = localStorage.getItem("resId");
  const [routes, setRoutes] = useState([]);
  let textContent = "Dashboards";
  let currentScreenName = ["Custom Dashboard"];
  sessionStorage.setItem(
    "breadCrumbs",
    JSON.stringify({
      routes: routes,
      currentScreenName: currentScreenName,
      textContent: textContent,
    })
  );
  const HelpPDFName = "CustomDashboard.pdf";
  const Headername = "Custom Dashboard Help";

  const getMenus = () => {
    axios({
      method: "GET",
      url: baseUrl + `/CommonMS/master/getMenus?loggedUserId=${loggedUserId}`,
    }).then((resp) => {
      let data = resp.data;

      data.forEach((item) => {
        if (item.display_name === textContent) {
          setRoutes([item]);
          sessionStorage.setItem("displayName", item.display_name);
        }
      });
    });
  };

  useEffect(() => {
    getMenus();
  }, []);

  // useEffect(() => {
  //   // Save the selected tab to localStorage whenever it changes
  //   localStorage.setItem("selectedDashboardTab", buttonState);
  // }, [buttonState]);

  return (
    <div>
      {addmsg ? (
        <div className="statusMsg success">
          <span className="errMsg">
            <BiCheck size="1.4em" /> &nbsp; Search Name deleted successfully
          </span>
        </div>
      ) : (
        ""
      )}

      <div className="pageTitle">
        <div className="childOne">
          <div className="tabsProject">
            <button
              className={
                buttonState === "MyDashboard"
                  ? "buttonDisplayClick"
                  : "buttonDisplay"
              }
              onClick={() => {
                setButtonState("MyDashboard");
              }}
            >
              My DashBoard
            </button>
            <button
              className={
                buttonState === "OrgDashboard"
                  ? "buttonDisplayClick"
                  : "buttonDisplay"
              }
              onClick={() => {
                setButtonState("OrgDashboard");
              }}
            >
              Org DashBoard
            </button>
          </div>
        </div>
        <div className="childTwo">
          <h2>Custom Dashboard</h2>
        </div>
        <div className="childThree">
          <div
            className="helpBtn"
            style={{ float: "right", paddingTop: "5px" }}
          >
            <GlobalHelp pdfname={HelpPDFName} name={Headername} />
          </div>
        </div>
      </div>

      {buttonState === "MyDashboard" && (
        <CustomMyDashboard setAddmsg={setAddmsg} />
      )}
      {buttonState === "OrgDashboard" && (
        <CustomOrgDashboard setAddmsg={setAddmsg} />
      )}
    </div>
  );
}

export default CustomDashboard;
