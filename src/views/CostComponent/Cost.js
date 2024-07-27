import React, { useEffect, useRef, useState } from "react";
import SecretKeyVerification from "./SecretKeyVerification";

import CostApproval from "./CostApproval";
import axios from "axios";
import { environment } from "../../environments/environment";
import CostApprovalFilters from "./CostApprovalFilters";
import Loader from "../Loader/Loader";
import CostViewAndUpload from "./CostViewAndUpload";

function Cost(props) {
  let url = window.location.href;

  // const viewRef = useRef(null)
  //comments
  const [country, setCountry] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [selectedDepartments, setSelectedDepartments] = useState([]);
  const [roleTypes, setRoleTypes] = useState([]);
  const [selectedRoleTypes, setSelectedRoleTypes] = useState([]);
  const [screenData, setScreenData] = useState("1");
  const roleWiseRef = useRef(null);
  const uploadRef = useRef(null);
  const [roleWiseComputedCostView, setRoleWiseComputedCostView] = useState([]);
  const [roleWiseViewState, setRoleWiseViewState] = useState([]);
  const [columnData, setColumnData] = useState([]);

  const initialValue = {
    roleType: "",
    country: 3,
    departments: "",
  };

  const [formData, setFormData] = useState(initialValue);

  const [loaderState, setLoaderState] = useState(false);

  const baseUrl = environment.baseUrl;

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
    departmentsInitialHandler.value = filteredDeptData.toString();
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
  }, []);

  useEffect(() => {}, [country, roleTypes, departments]);

  const roleWiseViewAxios = (initialFilterDeptData) => {
    setLoaderState(true);

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
      setLoaderState(false);
    });
  };

  return (
    <div>
      <div className="col-md-12 pageHeading ">Cost</div>

      {loaderState ? <Loader /> : ""}

      <div className="col-md-12 p0"></div>
      {url.includes("viewUpload") ? (
        <div>
          {/* <SecretKeyVerification
            country={country}
            departments={departments}
            selectedDepartments={selectedDepartments}
            setSelectedDepartments={setSelectedDepartments}
          /> */}
          <CostViewAndUpload
            formData={formData}
            country={country}
            departments={departments}
            selectedDepartments={selectedDepartments}
            filtersData={filtersData}
            setfiltersData={setfiltersData}
            date={date}
            setDate={setDate}
            setSelectedDepartments={setSelectedDepartments}
          />
        </div>
      ) : (
        ""
      )}
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
          />
        </div>
      ) : (
        ""
      )}
      {url.includes("roleApprovals") ? (
        <div>
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
          />
        </div>
      ) : (
        ""
      )}
    </div>
  );
}

export default Cost;
