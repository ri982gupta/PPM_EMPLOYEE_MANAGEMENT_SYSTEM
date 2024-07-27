import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";

import {
  CSidebar,
  CSidebarBrand,
  CSidebarNav,
  CSidebarToggler,
} from "@coreui/react";

import { AppSidebarNav } from "./AppSidebarNav";
import { CNavGroup, CNavItem } from "@coreui/react";

import SimpleBar from "simplebar-react";
import "simplebar/dist/simplebar.min.css";
import CIcon from "@coreui/icons-react";
import { cilChartPie, cilPuzzle, cilStar, cilMoney } from "@coreui/icons";
import axios from "axios";
import { environment } from "../environments/environment";
import { set } from "../reducers/AppHeaderReducer";
import {
  FaFileInvoiceDollar,
  FaHandHoldingUsd,
  FaMoneyCheckAlt,
} from "react-icons/fa";

import { GiCoins } from "react-icons/gi";
import { BsCashCoin, BsCoin } from "react-icons/bs";
import { AiOutlineLogin } from "react-icons/ai";
// sidebar nav config
// import navigation from "../_nav";
// import { SubdirectoryArrowLeftTwoTone } from "@mui/icons-material";

const AppSidebar = () => {
  const loggedUserId = localStorage.getItem("resId");
  console.log(loggedUserId, "loggedUserId");
  // const baseUrl = environment.commonbaseUrl;
  const baseUrl = environment.baseUrl;

  const dispatch = useDispatch();
  const unfoldable = useSelector(
    (state) => state.appHeaderState.sidebarUnfoldable
  );
  console.log(unfoldable);
  const sidebarShow = useSelector((state) => state.appHeaderState.sidebarShow);
  const [menusData, setMenusData] = useState([]);

  let top = document.getElementsByClassName("sidebar sidebar-fixed")[0];

  useEffect(() => {
    getMenus();
    removingHideClass();
  }, []);

  const removingHideClass = () => {
    // let top = document.getElementsByClassName("sidebar sidebar-fixed")[0];

    if (top != undefined) {
      setTimeout(() => {
        top.addEventListener(
          "click",
          function (params) {
            if (top != undefined) {
              if (top.classList.contains("hide")) {
                top.classList.remove("hide");
              }
            }
          },
          true
        );
      }, 1000);
    }
  };

  const getMenus = () => {
    // setMenusData

    axios({
      method: "GET",
      url: baseUrl + `/CommonMS/master/getMenus?loggedUserId=${loggedUserId}`,
    }).then((resp) => {
      const hammerToolMenu = resp.data.find(
        (item) => item.display_name === "Administration"
      );
      console.log(hammerToolMenu?.userRoles);
      console.log(resp.data);
      const accessLevel = hammerToolMenu?.userRoles.includes("932")
        ? 932
        : hammerToolMenu?.userRoles.includes("126")
        ? 126
        : hammerToolMenu?.userRoles.includes("686")
        ? 686
        : hammerToolMenu?.userRoles.includes("931")
        ? 931
        : "";
      let data1 =
        accessLevel == 932 ||
        accessLevel == 931 ||
        accessLevel == 126 ||
        accessLevel == 686
          ? resp.data
          : resp.data.filter((item) => item.display_name != "Administration");
      console.log(data1);

      let getData = data1.map((menu) => {
        if (
          menu.subMenus &&
          loggedUserId != 4452475 &&
          loggedUserId != 131110803
        ) {
          menu.subMenus = menu.subMenus.filter(
            (subMenu) =>
              // subMenu.display_name !== "Revenue & Margin Variance" &&
              // subMenu.display_name !== "Rev. Projections" &&
              // subMenu.display_name !== "Project Timesheet (Deprecated)" &&
              subMenu.display_name !== "Financial Plan & Review"
          );
        }
        return menu;
      });
      console.log(getData);
      let data = getData.map((menu) => {
        // let data = resp.data.map((menu) => {

        for (let i = 0; i < getData.length; i++) {
          const menus = getData[i].subMenus;
          if (menus) {
            for (let j = 0; j < menus.length; j++) {
              if (menus[j].display_name === "Revenue By Industry") {
                // Update the display_name
                menus[j].display_name = "Recognized Rev By Industry";
              }
              if (menus[j].display_name === "Profile") {
                // Update the display_name
                menus[j].display_name = "Insights";
              }
              if (menus[j].display_name === "Management") {
                // Update the display_name
                menus[j].display_name = "Subk Management";
              }
              if (menus[j].display_name === "Performance") {
                menus[j].display_name = "Subk GM Analysis";
              }
              if (menus[j].display_name === "Staffing GM %[Deprecated]") {
                menus[j].display_name = "Subk GM% Trend";
              }
            }
          }
        }
        if (menu.subMenus) {
          menu.subMenus = menu.subMenus.filter(
            (subMenu) =>
              // subMenu.display_name !== "Revenue & Margin Variance" &&
              subMenu.display_name !== "Custom Dashboard" &&
              // subMenu.display_name !== "Saved Searches" &&
              subMenu.display_name !== "Rev. Projections" &&
              // subMenu.display_name !== "Fill Timesheets" &&
              subMenu.display_name !== "Project Timesheet (Deprecated)" &&
              // subMenu.display_name !== "Financial Plan & Review" &&
              // subMenu.display_name !== "Billable Utilization Trend" &&
              // subMenu.display_name !== "Utilisation - FY" &&
              // subMenu.display_name !== "NB Work - 4  Prev. Weeks" &&
              subMenu.display_name !== "Practice Calls [Deprecated]" &&
              // subMenu.display_name !== "Shift Allownaces" &&
              subMenu.display_name !== "Invoice Details" &&
              // subMenu.display_name !== "CSAT" &&
              // subMenu.display_name !== "Accounting" &&
              subMenu.display_name !== "Roles Permissions" &&
              subMenu.display_name !== "Sales Permissions" &&
              subMenu.display_name !== "Jobs Daily Status" &&
              subMenu.display_name !== "Error Logs" &&
              subMenu.id != 27 &&
              // subMenu.display_name !== "Role Costs" &&
              subMenu.display_name !== "Upload Role Costs" &&
              subMenu.display_name !== "Contract Documents" &&
              subMenu.display_name !== "Calendars" &&
              subMenu.display_name !== "Metric Log Viewer" &&
              subMenu.display_name !== "Forecast/Supply" &&
              // subMenu.display_name !== "Resource Request" &&
              subMenu.display_name !== "Demand And Supply"
            // &&
            // subMenu.display_name !== "Staffing GM %[Deprecated]" &&
            // subMenu.display_name !== "PCQA" &&
            //subMenu.display_name !== "CSAT" &&
            //subMenu.display_name !== "NPS"
            //  &&subMenu.display_name !== "NPS Survey Questions" &&
            // subMenu.display_name !== "CSAT Survey Questions"
          );
        }

        return menu;
      });
      // console.log("in line 46----");
      console.log(data);
      let mainContentMenu = [];

      for (let i = 0; i < data.length; i++) {
        const subMenusData = {
          component: CNavGroup,
          name: "Project",
          icon: "",
          items: [],
        };

        const objData = {};
        let subMenuDtt =
          data[i]["subMenus"].length > 0 ? data[i]["subMenus"] : [data[i]];
        if (subMenuDtt.length > 0) {
          subMenusData["name"] = data[i]["display_name"];
          let subMenusDttt = formattingSubMenus(subMenuDtt);
          console.log(subMenusDttt, "aaaaaaa-------");
          console.log(data[i]);
          switch (
            subMenusData["name"]
            // case "Fullfilment":
            //   subMenusDttt.push({
            //     component: CNavItem,
            //     name: "Subk Conversion Trend",
            //     to: "/fulfilment/SubkConversionTrend",
            //   });

            //   subMenusDttt.push(
            //     {
            //       component: CNavItem,
            //       name: "Forecast/Supply",
            //       to: "/fulfilment/ForecastAndSupply",
            //     }
            //   );
            //   break;

            // default:
            //   break;
          ) {
          }

          if (
            // subMenusData.name !== "Vendors" &&
            // subMenusData.name !== "Reports" &&
            // subMenusData.name !== "Governance" &&
            subMenusData.name !== "Innovation" &&
            subMenusData.name !== "Invoicing" &&
            // subMenusData.name !== "Administration" &&
            subMenusData.name !== "Uploads"
          ) {
            subMenusData["items"] = subMenusDttt;
            subMenusData["id"] = data[i]["id"];

            (subMenusData["icon"] = (
              <img src={"/mainmenu/" + data[i]["icon_name"]} alt="" />
            )),
              mainContentMenu.push(subMenusData);
          }
        } else {
          mainContentMenu.push(formattingSubMenus(subMenuDtt));
        }
        console.log(mainContentMenu);
      }

      // mainContentMenu.push({
      //   component: CNavItem,
      //   name: "Project Invoice Details",
      //   to: "/projectInvoiceDetails",
      //   icon: <CIcon icon={cilStar} customClassName="nav-icon" />,
      // });

      if (loggedUserId == 16068650) {
        mainContentMenu.push({
          component: CNavGroup,
          name: "Cost",
          icon: (
            <BsCashCoin
              icon={BsCashCoin}
              customClassName="nav-icon"
              className="mr-2"
            />
          ),
          items: [
            {
              icon: (
                <FaHandHoldingUsd
                  icon={FaHandHoldingUsd}
                  customClassName="nav-icon"
                  className="mr-2"
                />
              ),
              component: CNavItem,
              name: "Salary Band",
              to: "/salaryBand",
            },
            {
              icon: (
                <FaFileInvoiceDollar
                  icon={FaFileInvoiceDollar}
                  customClassName="nav-icon"
                  className="mr-2"
                />
              ),
              component: CNavItem,
              name: "View / Upload",
              to: "/cost/viewUpload",
            },
            // {
            //   icon: (
            //     <FaMoneyCheckAlt
            //       icon={FaMoneyCheckAlt}
            //       customClassName="nav-icon"
            //       className="mr-2"
            //     />
            //   ),
            //   component: CNavItem,
            //   name: "Role View",
            //   to: "/cost/roleView",
            // },
            // {
            //   icon: (
            //     <BsCoin
            //       icon={BsCoin}
            //       customClassName="nav-icon"
            //       className="mr-2"
            //     />
            //   ),
            //   component: CNavItem,
            //   name: "Role Approvals",
            //   to: "/cost/roleApprovals",
            // },
            // {
            //   icon: (
            //     <GiCoins
            //       icon={GiCoins}
            //       customClassName="nav-icon"
            //       className="mr-2"
            //     />
            //   ),
            //   component: CNavItem,
            //   name: "Role Grid",
            //   to: "/cost/roleGrid",
            // },
            // {
            //   icon: (
            //     <AiOutlineLogin
            //       icon={AiOutlineLogin}
            //       customClassName="nav-icon"
            //       className="mr-2"
            //     />
            //   ),
            //   component: CNavItem,
            //   name: "Login History",
            //   to: "/cost/loginHistory",
            // },
          ],
        });
      }
      mainContentMenu.push({
        component: CNavGroup,
        name: "Help",
        icon: <img src="ia_support_icons/help.png" />,
        items: [
          {
            component: CNavItem,
            name: "Release Notes",
            to: "/help/ReleaseNotes",
            icon: <img src="ia_support_icons/release_notes.png" />,
          },
          {
            component: CNavItem,
            name: "Help Contents",
            to: "/help/helpContents",
            icon: <img src="ia_support_icons/help_contents.png" />,
          },
          {
            component: CNavItem,
            name: "Support",
            href: "https://pep.prolifics.com/login",
            icon: <img src="ia_support_icons/support.png" />,
          },
          // {
          //   component: CNavItem,
          //   name: "Feedback",
          //   to: "/help/feedback",
          //   icon: <img src="ia_support_icons/feedback.png" />,
          // },
        ],
      });

      const customOrder = [
        "Engagements",
        "Projects",
        "Engagement Allocations",
        "Project Health",
        "Project Status Report",
      ];
      const sortedMainContentMenu = mainContentMenu.map((menu) => {
        if (menu.items) {
          return {
            ...menu,
            items: menu.items.sort(
              (a, b) =>
                customOrder.indexOf(a.name) - customOrder.indexOf(b.name)
            ),
          };
        }
        return menu;
      });
      console.log(sortedMainContentMenu);
      setMenusData(sortedMainContentMenu);

      // mainContentMenu.push({
      //   component: CNavItem,
      //   name: "Accounting",
      //   to: "/accounting",
      //   icon: <CIcon icon={cilStar} customClassName="nav-icon" />,
      // });

      // const salesIndex = mainContentMenu.findIndex(
      //   (menu) => menu.name === "Sales"
      // );
      // console.log(salesIndex, "salesindex");
      // console.log(mainContentMenu[salesIndex].items, "mainContentMenu");

      // mainContentMenu[salesIndex].items.push({
      //   component: CNavItem,
      //   name: "Opportunity Edit",
      //   to: "/pmo/OpportunityEdit",
      //   // icon: <CIcon icon={cilStar} customClassName="nav-icon" />,
      // });
      // mainContentMenu[salesIndex].items.push({
      //   component: CNavItem,
      //   name: "Salesforce Reports",
      //   to: "/pmo/SalesforceReports",
      //   // icon: <CIcon icon={cilStar} customClassName="nav-icon" />,
      // });
      console.log(mainContentMenu);
      // setMenusData(mainContentMenu);
    });
  };

  const formattingSubMenus = (subMenuDtt) => {
    console.log(subMenuDtt);

    let subMenusDt = [];
    for (let j = 0; j < subMenuDtt.length; j++) {
      const singleMenu = {
        component: CNavItem,
        name: "Delivery",
        to: "/delivery",
        icon: "",
        // submenus
      };
      singleMenu["name"] = subMenuDtt[j]["display_name"];
      singleMenu["id"] = subMenuDtt[j]["id"];
      singleMenu["to"] = subMenuDtt[j]["url_path"].replaceAll("::", "/");
      singleMenu["icon"] = (
        <img src={"/submenus/" + subMenuDtt[j]["icon_name"]} alt="" />
      );
      subMenusDt.push(singleMenu);
    }
    return subMenusDt.length > 0 ? subMenusDt : subMenusDt[0];
  };
  console.log(menusData);
  console.log(sidebarShow);
  // console.log(mainContentMenu);
  // console.log(subMenusData);
  return (
    // <span
    //   onClick={() => {
    //     console.log("helo");
    //   }}
    // >
    <CSidebar
      position="fixed"
      unfoldable={unfoldable}
      visible={sidebarShow}
      onClick={() => {
        console.log("working");
      }}
      onVisibleChange={(visible) => {
        dispatch(set({ sidebarShow: visible }));
      }}
    >
      <CSidebarBrand to="/">
        <div className="logo">
          <img src="ppm.png" alt="" /> <span class="logoTxt">PPM</span>
        </div>
      </CSidebarBrand>
      <CSidebarNav>
        <SimpleBar>
          <AppSidebarNav items={menusData} />
        </SimpleBar>
      </CSidebarNav>
      {/* <CSidebarToggler
        className="d-none d-lg-flex"
        onClick={() => dispatch(set({ sidebarUnfoldable: !unfoldable }))}
      /> */}
    </CSidebar>
    // </span>
  );
};

export default React.memo(AppSidebar);
