import axios from "axios";
import React, { useEffect, useState } from "react";
import { environment } from "../../environments/environment";
import Loader from "../Loader/Loader";
import CostApproval from "./CostApproval";
import "./CostCss.scss";

function RoleApprovals() {
  let url = window.location.href;

  const [country, setCountry] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [selectedDepartments, setSelectedDepartments] = useState([]);
  const [columnData, setColumnData] = useState([]);
  const [roleWiseViewState, setRoleWiseViewState] = useState([]);
  const [selectedRoleTypes, setSelectedRoleTypes] = useState([]);
  const [roleTypes, setRoleTypes] = useState([]);
  const [roleWiseComputedCostData, setRoleWiseComputedCostData] = useState([]);
  const [loader, setLoader] = useState(false);

  let head = document.getElementsByClassName("container-fluid");

  const initialValue = {
    roleType: "",
    country: 3,
    departments: "",
  };

  const [formData, setFormData] = useState(initialValue);

  const [validator, setValidator] = useState(false);

  const loggedUserId = localStorage.getItem("resId");

  const baseUrl = environment.baseUrl;

  const getCountries = () => {
    axios({
      url: baseUrl + `/CostMS/cost/getCountries`,
    }).then((resp) => {
      setCountry(resp.data);
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
    formData["departments"] = filteredDeptData.toString();
    // })
  };

  useEffect(() => {
    // let header = document.getElementsByClassName("container-fluid")[0].children;

    // let headerTag = document.createElement("span");
    // <span>Vendor</span>

    // console.log("in line 74-----");
    // console.log(headerTag)
    // console.log(header);
    // console.log(header[0]);
    // console.log(header[1]);

    // console.log(header.lastChild);

    // header.add(headerTag);
    // console.log(header);
    // .add("<span>Vendor</span>");

    initialCalls();
    getIpAddress();
  }, []);

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

  const initialCalls = async () => {
    await getRoleTypes();
    await getDepartments();
    await getCountries();
    url.includes("roleApprovals")
      ? await getRoleWiseComputedCost()
      : await roleWiseViewAxios();
  };

  const getRoleWiseComputedCost = () => {
    // let buDm = document.getElementById("businessUnit").children[0].children[0];
    // let buDmCls = buDm.classList;

    // let rtDm = document.getElementById("roleTypes").children[0].children[0];
    // let rtDmCls = rtDm.classList;

    //   if(formData.departments.length === 0){
    //     buDmCls.contains("txtBoxBorderColor")===false && buDmCls.add("txtBoxBorderColor");
    //   }
    //   if(formData.roleType.length === 0){
    //     rtDmCls.contains("txtBoxBorderColor")===false && rtDmCls.add("txtBoxBorderColor");
    //   }

    //   if(formData.departments.length > 0){
    //     buDmCls.contains("txtBoxBorderColor") && buDmCls.remove("txtBoxBorderColor");
    //   }
    //   if(formData.roleType.length > 0){
    //     rtDmCls.contains("txtBoxBorderColor") && rtDmCls.remove("txtBoxBorderColor");
    //   }

    //   if(formData.departments.length === 0 || formData.roleType.length === 0){
    //     setValidator(true);
    //     return;
    //   }

    setValidator(false);

    setLoader(true);

    axios({
      method: "POST",
      url: baseUrl + `/CostMS/cost/getRoleWiseComputedCost`,
      data: formData,
    }).then((resp) => {
      setRoleWiseComputedCostData(resp.data);
      setLoader(false);
    });
  };

  useEffect(() => {}, [roleWiseComputedCostData]);

  const getRoleTypes = async () => {
    const resp = await axios({
      url: baseUrl + "/CostMS/cost/getRoleTypes",
    });
    // .then(resp => {
    const data = resp.data;
    setRoleTypes(data);
    setSelectedRoleTypes(data);
    let selectedRoleTypesArr = [];
    data.forEach((element) => {
      selectedRoleTypesArr.push(element.value);
    });

    formData["roleType"] = selectedRoleTypesArr.toString();
    // })
  };

  const roleWiseViewAxios = (initialFilterDeptData) => {
    initialFilterDeptData !== undefined
      ? (formData["departments"] = initialFilterDeptData)
      : "";
    formData["roleType"] = "0";
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
    });
  };

  return (
    <div>
      {loader ? <Loader /> : ""}
      <CostApproval
        country={country}
        departments={departments}
        selectedDepartments={selectedDepartments}
        setSelectedDepartments={setSelectedDepartments}
        roleTypes={roleTypes}
        selectedRoleTypes={selectedRoleTypes}
        setSelectedRoleTypes={setSelectedRoleTypes}
        formData={formData}
        setFormData={setFormData}
        getRoleWiseComputedCost={getRoleWiseComputedCost}
        roleWiseComputedCostData={roleWiseComputedCostData}
        validator={validator}
        setLoader={setLoader}
      />
    </div>
  );
}

export default RoleApprovals;
