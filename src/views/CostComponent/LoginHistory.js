import moment from "moment";
import React, { useEffect, useState } from "react";
import LoginHistoryFilters from "./LoginHistoryFilters";
import axios from "axios";
import LoginHistoryDisplayData from "./LoginHistoryDisplayData";
import "./CostCss.scss";
import { environment } from "../../environments/environment";
import ResourceLoginHistoryData from "./ResourceLoginHistoryData";
import Loader from "../Loader/Loader";

function LoginHistory() {
  let fromDate = moment().subtract(7, "days")._d;
  let toDate = moment()._d;

  const baseUrl = environment.baseUrl;

  let columns = [
    "user_id",
    "resource_name",
    "View_And_Upload",
    "Role_View",
    "Role_Approvals",
    "Role_Grid",
  ];

  const initialValue = {
    screen: [],
    fromDate: fromDate,
    toDate: toDate,
  };

  const [formData, setFormData] = useState(initialValue);
  const [screenFilters, setScreenFilters] = useState([]);
  const [loginHistoryData, setLoginHistoryData] = useState([]);
  const [resourceLogHisData, setResourceLogHisData] = useState([]);

  const expandInitialValue = {
    state: false,
    rowAndColumnIndex: null,
  };

  const [resourceLoginHisState, setResourceLoginHisState] =
    useState(expandInitialValue);
  const [validator, setValidator] = useState(false);
  const [loaderState, setLoaderState] = useState(false);

  const screenTrackerInitialVal = {
    screen_id: "",
    user_id: "",
  };
  const [screenTracker, setScreenTracker] = useState(screenTrackerInitialVal);

  useEffect(() => {
    screensData();
  }, []);

  useEffect(() => {
    searchHandler(screenFilters);
  }, [screenFilters]);

  useEffect(() => {}, [screenTracker, resourceLoginHisState]);

  const screensData = () => {
    axios({
      url: baseUrl + `/CostMS/cost/getCostScreenNames`,
    }).then((resp) => {
      setScreenFilters(resp.data);
      setFormData((prev) => ({ ...prev, ["screen"]: resp.data }));
    });
  };

  const getResourcesLoginHistory = (data) => {
    axios({
      method: "POST",
      url: baseUrl + "/CostMS/cost/getResourceLoginHistory",
      data: data,
    }).then((resp) => {
      setResourceLogHisData([]);
      setResourceLogHisData(resp.data);
    });
  };

  useEffect(() => {}, [resourceLogHisData, resourceLoginHisState]);

  useEffect(() => {}, [loginHistoryData]);

  // const resourceLoginHis

  const searchHandler = (data) => {
    const finalFormData = {};

    let screenData = data === undefined ? formData.screen : data;
    let screenIds = [];
    for (let index = 0; index < screenData.length; index++) {
      screenIds.push(screenData[index].value);
    }

    finalFormData["screenIds"] = screenIds.toString();

    finalFormData["fromDate"] = moment(formData.fromDate).format("yyyy-MM-DD");
    finalFormData["toDate"] = moment(formData.toDate).format("yyyy-MM-DD");

    // let screenDm = document.getElementById("screenNames").children[0].children[0];
    // let screenDmCls = screenDm.classList;

    // if(formData?.screen?.length === 0 && (screenDmCls.contains("txtBoxBorderColor") === false)){
    //   screenDmCls.add("txtBoxBorderColor");
    //   setValidator(true);
    //   return;
    // }else{
    //   screenDmCls.remove("txtBoxBorderColor");
    //   setValidator(false);
    // }
    setLoaderState(true);
    axios({
      method: "POST",
      url: baseUrl + "/CostMS/cost/getLoginTracks",
      data: finalFormData,
    }).then((resp) => {
      let data = resp.data;
      let finData = [];
      for (let i = 0; i < data.length; i++) {
        let obj = {};
        for (let j = 0; j < columns.length; j++) {
          if (data[i][columns[j]] != undefined) {
            obj[columns[j]] = data[i][columns[j]];
          }
        }
        finData.push(obj);
      }
      setLoginHistoryData(finData);
      setLoaderState(false);
    });
  };

  return (
    <div>
      <LoginHistoryFilters
        formData={formData}
        setFormData={setFormData}
        screenFilters={screenFilters}
        searchHandler={searchHandler}
        validator={validator}
      />

      {loaderState ? <Loader /> : ""}

      <LoginHistoryDisplayData
        loginHistoryData={loginHistoryData}
        setScreenTracker={setScreenTracker}
        getResourcesLoginHistory={getResourcesLoginHistory}
        resourceLoginHisState={resourceLoginHisState}
        setResourceLoginHisState={setResourceLoginHisState}
      />

      {resourceLoginHisState.state && (
        <ResourceLoginHistoryData resourceLogHisData={resourceLogHisData} />
      )}
    </div>
  );
}

export default LoginHistory;
