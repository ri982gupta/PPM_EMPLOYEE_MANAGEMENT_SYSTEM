import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { environment } from '../../environments/environment';
import SecretKeyVerification from './SecretKeyVerification';
import './CostCss.scss';

function ViewAndUpload() {
  const [country, setCountry] = useState([])
  const [departments, setDepartments] = useState([])
  const [roleTypes, setRoleTypes] = useState([])
  const [selectedDepartments, setSelectedDepartments] = useState([])
  const [selectedRoleTypes, setSelectedRoleTypes] = useState([]);
  const [columnData, setColumnData] = useState([])


  const initialValue = {
    "roleType": "",
    "country": 3,
    "departments": ""
  }


  const [formData, setFormData] = useState(initialValue);



  const baseUrl = environment.baseUrl;

  const getCountries = () => {
    axios({
      url: baseUrl + `/CostMS/cost/getCountries`
    }).then(resp => {
      setCountry(resp.data);
    })
  }

  const roleWiseViewAxios=(initialFilterDeptData)=>{
    initialFilterDeptData !== undefined ? formData["departments"] = initialFilterDeptData : ""
    formData["roleType"] = '0';
    axios({
      method: "POST",
      url:  baseUrl + "/CostMS/cost/roleWiseView",
      data: formData
    }).then(resp => {

      let data = resp.data.roleWiseComputedCost;
      let columnsData = resp.data.computedCostColumns.split(",");
      
      let finalColumnData = [];

      const objFirst = {};
      const objSec = {};

      for (let i = 0; i < columnsData.length-1; i++) {
        if((columnsData[i]).includes("id")===false){
          objFirst[columnsData[i]] = columnsData[i]?.replaceAll("_ComputedCost","").replaceAll("_"," ");
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
        for(let j=0;j<columnsData.length-1;j++){
          objData[columnsData[j]] = data[i][columnsData[j]];
        }
        orderedData.push(objData);
      }
      // setRoleWiseViewState(orderedData);
    })
  }

    const getDepartments = async () => {
    const resp = await axios({
      url: baseUrl + `/CostMS/cost/getDepartments`
    })
    // .then(resp => {
    let departments = resp.data;
    departments.push({ "value": 999, "label": "Non-Revenue Units" });
    setDepartments(departments);
    setSelectedDepartments(departments);
    let filteredDeptData = [];
    departments.forEach(data => {
      filteredDeptData.push(data.value);
    });
    setFormData(prevVal => ({...prevVal,["departments"] : filteredDeptData.toString() }));
    roleWiseViewAxios((filteredDeptData.toString()));
  }

  const getRoleTypes = () => {
    axios({
      url: baseUrl+ '/CostMS/cost/getRoleTypes'
    }).then(resp => {
      const data = resp.data;
      setRoleTypes(data);
      setSelectedRoleTypes(data);
    })
  }

  useEffect(() => {
    getCountries();
    getDepartments();
    getRoleTypes();
  }, [])

  return (
    <div>
         <SecretKeyVerification country={country} departments={departments} selectedDepartments={selectedDepartments} setSelectedDepartments={setSelectedDepartments} />
    </div>
  )
}

export default ViewAndUpload