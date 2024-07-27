import React, { useEffect, useState, useRef } from "react";
import "./Reports.scss";
import { FaMinus, FaPlus } from "react-icons/fa";
import { CCollapse } from "@coreui/react";
import { environment } from "../../environments/environment";
import { Link } from "react-router-dom";
import axios from "axios";
import GlobalReportHeader from "./GlobalReportHeader";

function Report() {
  const [visible1, setVisible1] = useState([]);
  const [cheveronIcon1, setCheveronIcon1] = useState([]);
  const loggedUserId = localStorage.getItem("resId");
  const baseUrl = environment.baseUrl;
  const [mainMenuData, setMainMenuData] = useState([]);

  const [allMenus, setAllMenus] = useState([]);

  const [renderData, setRenderData] = useState(null);

  const [renderSubmenuData, setRenderSubmenuData] = useState([]);
  const [routes, setRoutes] = useState([]);

  const [getFilters, setGetFilters] = useState([]);
  useEffect(() => {
    getReportData();
    getFilterData();
  }, []);
  
  let textContent = "Reports";
 
  let currentScreenName = ["Reports"];
  sessionStorage.setItem(
    "breadCrumbs",
    JSON.stringify({
      routes: routes,
      currentScreenName: currentScreenName,
      textContent: textContent,
    })
  );
  const getMenus = () => {
    axios({
      method: "GET",
      url: baseUrl + `/CommonMS/master/getMenus?loggedUserId=${loggedUserId}`,
    }).then((resp) => {
      let data = resp.data;
      const modifiedUrlPath = "/report/listing";
      getUrlPath(modifiedUrlPath);
 
      data.forEach((item) => {
        if (item.display_name === textContent) {
          setRoutes([item]);
          sessionStorage.setItem("displayName", item.display_name);
        }
      });
    });
  };
  const getUrlPath = (modifiedUrlPath) => {
    axios({
      method: "get",
      url:
        baseUrl +
        `/CommonMS/security/authorize?url=${modifiedUrlPath}&userId=${loggedUserId}`,
    })
      .then((res) => {})
      .catch((error) => {});
  };
  useEffect(() => {
    getMenus();
  }, []);
  

  useEffect(() => {
    allMenus.length > 0 && displayData();
  }, [mainMenuData, allMenus]);
  console.log(">>>>>>>>>> in line 31" + mainMenuData); // Timesheets,Finance,Resource,PCQA,Allocation Reports,Expenses
  console.log(">>>>>>>>>> in line 32" + allMenus); // object
  // console.log(">>>>>>>>in line 33" + data);

  // to display the list of reports(submenus,mainmenus)
  const renderDisplaySubmenu = (data) => {
    let spareData = JSON.parse(JSON.stringify(allMenus));
    console.log(">>>>>>>>in line 37" + data); //
    let filterdData = spareData.filter((ele) => data == ele.mainManu);

    setRenderSubmenuData(() => {
      return allMenus.map((d) => {
        return <li>{d.name}</li>;
      });
    });
  };

  const displayData = () => {
    setRenderData(() => {
      return mainMenuData.map((data, index) => {
        renderDisplaySubmenu(data);
        return (
          <div key={index} className="box-in-between-margin">
            <div
              key={index}
              className="borderClass box-header-design reportsmainFile"
              onClick={() => {
                let visibleArr = visible1;
                visibleArr[index] = !visibleArr[index];

                setVisible1(visibleArr);

                let iconVal = cheveronIcon1;
                iconVal[index] = visibleArr[index] ? FaPlus : FaMinus;

                setCheveronIcon1(iconVal);

                displayData();
              }}
            >
              <span>{cheveronIcon1[index]}</span>
              {data}
              {console.log(">>>>>>>>>>Data" + data)}
            </div>
            <CCollapse visible={!visible1[index]}>
              {allMenus.map((inData, inIndex) => {
                return (
                  data == inData.mainManu && (
                    <div
                      className={`borderClass paddingLeft ${inIndex % 2 == 0 ? "backgroundColorClass" : ""
                        }`}
                    >
                      <Link
                        onClick={() => {
                          GlobalReportHeader(inData.name);
                        }}
                        to={`/report/getReport/reportId/${inData.report_id}`}
                        target="_blank"
                      >
                        {inData.name}
                        {console.log(inData, "indata???????????????????")}
                      </Link>
                    </div>
                  )
                );
              })}
            </CCollapse>
          </div>
        );
      });
    });
  };

  const getReportData = () => {
    axios
      .get(baseUrl + `/reportms/report/getReportListing?userId=${loggedUserId}`)
      .then((resp) => {
        let data = resp.data;
        setAllMenus(data);

        let visibleArr = [];
        let icon = [];
        let mainMenuDt = data.map((d) => {
          visibleArr.push(false);
          icon.push(FaMinus);
          return d.mainManu;
        });
        let FinalMainMenu = Array.from(new Set([...mainMenuDt]));
        let FinalvisibleArr = visibleArr.slice(0, FinalMainMenu.length);

        let finalIcon = icon.slice(0, FinalMainMenu.length);
        setVisible1(FinalvisibleArr);

        setCheveronIcon1(finalIcon);

        setMainMenuData(FinalMainMenu);
        console.log(data, "in line 128------------ data");
      });
  };
  const getFilterData = () => {
    axios({
      method: "post",
      url: baseUrl + `/reportms/report/getfiltersData`,
      data: {
        notifyReportId: "",
        userId: loggedUserId,
      },
    }).then((response) => {
      setGetFilters(response.data);
    });
  };

  return (
    <>
      <div className="col-md-12">
        <div className="pageTitle">
          <div className="childOne"></div>
          <div className="childTwo">
            <h2>Reports</h2>
          </div>
          <div className="childThree"></div>
        </div>
      </div>

      <div className="group customCard">
        <div className="group-content row">
          <div className="col-md-12">
            <div>
              <div
                className="borderClass head-header-design"
                style={{ textAlign: "center" }}
              >
                Folder/Reports
              </div>

              {renderData}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Report;
