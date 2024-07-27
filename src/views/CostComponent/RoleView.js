import React, { useEffect, useRef, useState } from "react";
import SecretKeyVerification from "./SecretKeyVerification";

import CostApproval from "./CostApproval";
import axios from "axios";
import { environment } from "../../environments/environment";
import CostApprovalFilters from "./CostApprovalFilters";
import Loader from "../Loader/Loader";

function RoleView(props) {
  let url = window.location.href;

  // const viewRef = useRef(null)
  const [country, setCountry] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [selectedDepartments, setSelectedDepartments] = useState([]);
  const [roleTypes, setRoleTypes] = useState([]);
  const [selectedRoleTypes, setSelectedRoleTypes] = useState([]);
  const [roleWiseViewState, setRoleWiseViewState] = useState([]);
  const [columnData, setColumnData] = useState([]);

  const [loaderState, setLoaderState] = useState(false);

  const initialValue = {
    roleType: "",
    country: 3,
    departments: "",
  };

  const [formData, setFormData] = useState(initialValue);
  const [validator, setValidator] = useState(false);

  const baseUrl = environment.baseUrl;

  const loggedUserId = localStorage.getItem("resId");

  const getCountries = () => {
    axios({
      url: baseUrl + `/CostMS/cost/getCountries`,
    }).then((resp) => {
      setCountry(resp.data);
    });
  };

  const getRoleTypes = () => {
    axios({
      url: baseUrl + "/CostMS/cost/getRoleTypes",
    }).then((resp) => {
      const data = resp.data;
      setRoleTypes(data);
      setSelectedRoleTypes(data);
    });
  };

  const getDepartments = async () => {
    const resp = await axios({
      url: baseUrl + `/CostMS/cost/getDepartments`,
    });
    // .then(resp => {
    let departments = resp.data;
    departments.push({ value: 999, label: "Non-Revenue Units" });
    setDepartments(departments);
    setSelectedDepartments(departments);
    let filteredDeptData = [];
    departments.forEach((data) => {
      filteredDeptData.push(data.value);
    });
    setFormData((prevVal) => ({
      ...prevVal,
      ["departments"]: filteredDeptData.toString(),
    }));
    roleWiseViewAxios(filteredDeptData.toString());
  };

  useEffect(() => {
    getCountries();
    getDepartments();
    getRoleTypes();
    getIpAddress();
  }, []);

  useEffect(() => {}, [country, roleTypes, departments]);

  const getIpAddress = async () => {
    await fetch("https://geolocation-db.com/json/")
      .then((response) => {
        return response.json();
      }, "jsonp")
      .then((res) => {
        loginHistoryTracks(res.IPv4);
      })
      .catch((err) => console.log(err));
  };

  const loginHistoryTracks = (ipAddress) => {
    const loginTrackData = {};

    let urlData = url.split("#");

    loginTrackData["ipAddress"] = ipAddress;
    loginTrackData["userId"] = loggedUserId;
    loginTrackData["url"] = urlData[1];

    axios({
      method: "POST",
      url: baseUrl + "/CostMS/cost/saveLoginTracks",
      data: loginTrackData,
    }).then((resp) => {});
  };

  const roleWiseViewAxios = (initialFilterDeptData) => {
    // let buDm = document.getElementById("businessUnit").children[0].children[0];
    // let buDmCls = buDm.classList;

    initialFilterDeptData !== undefined
      ? (formData["departments"] = initialFilterDeptData)
      : "";
    formData["roleType"] = "0";

    // if(formData.departments.length === 0 && (buDmCls.contains("txtBoxBorderColor") == false)){
    //   buDmCls.add("txtBoxBorderColor");
    //   setValidator(true);
    //   return;
    // }else if(formData.departments.length > 0 && (buDmCls.contains("txtBoxBorderColor") == true)){
    //   buDmCls.remove("txtBoxBorderColor");
    //   setValidator(false);
    // }

    setLoaderState(true);

    axios({
      method: "POST",
      url: baseUrl + "/CostMS/cost/roleWiseView",
      data: formData,
    }).then((resp) => {
      let data = resp.data.roleWiseComputedCost;
      let columnsData = resp.data.computedCostColumns.split(",");

      let finalColumnData = [];

      const objFirst = {};
      const objSec = {};

      for (let i = 0; i < columnsData.length - 1; i++) {
        if (columnsData[i].includes("id") === false) {
          objFirst[columnsData[i]] = columnsData[i]
            ?.replaceAll("_ComputedCost", "")
            .replaceAll("_", " ");
          objSec[columnsData[i]] = "ComputedCost";
        }
      }

      finalColumnData.push(objFirst);
      finalColumnData.push(objSec);

      setColumnData(finalColumnData);

      let orderedData = [];

      for (let i = 0; i < data.length; i++) {
        let innerObj = data[i];
        const objData = {};
        for (let j = 0; j < columnsData.length - 1; j++) {
          objData[columnsData[j]] = data[i][columnsData[j]];
        }
        orderedData.push(objData);
      }
      setRoleWiseViewState(orderedData);
      setLoaderState(false);
    });
  };

  return (
    <div>
      <div className="col-md-12 pageHeading ">Cost</div>
      {loaderState ? <Loader /> : ""}
      <div className="col-md-12 p0"></div>
      {url.includes("roleView") ? (
        <div>
          <CostApprovalFilters
            country={country}
            departments={departments}
            selectedDepartments={selectedDepartments}
            setSelectedDepartments={setSelectedDepartments}
            roleTypes={roleTypes}
            selectedRoleTypes={selectedRoleTypes}
            setSelectedRoleTypes={setSelectedRoleTypes}
            formData={formData}
            setFormData={setFormData}
            type={"roleWiseView"}
            roleWiseViewAxios={roleWiseViewAxios}
            roleWiseViewState={roleWiseViewState}
            columnData={columnData}
            validator={validator}
          />
        </div>
      ) : (
        ""
      )}
    </div>
  );
}

export default RoleView;
