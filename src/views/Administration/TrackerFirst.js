import React, { useState, useEffect, useRef } from "react";
import DatePicker from "react-datepicker";
import axios from "axios";
import MaterialReactTable from "material-react-table";

import moment from "moment";
import { environment } from "../../environments/environment";
import { MultiSelect } from "react-multi-select-component";
import CellRendererPrimeReactDataTable from "../PrimeReactTableComponent/CellRendererPrimeReactDataTable";
import { ReactSearchAutocomplete } from "react-search-autocomplete";
import { IoWarningOutline } from "react-icons/io5";
import GlobalValidation from "../ValidationComponent/GlobalValidation";
import { AiOutlineLeftSquare, AiOutlineRightSquare } from "react-icons/ai";
import Trackerfirstlink from "./Trackerfirstlink";
import { Column } from "primereact/column";
function Tracker(props) {
  const [openhtml, setOpenhtml] = useState(false)
  const [departments, setDepartments] = useState([]);
  const [headerData, setHeaderData] = useState([]);
  const [selectedDepartments, setSelectedDepartments] = useState([]);
  const [userid, setUserid] = useState()
  const [data, setData] = useState([{}]);
  const [isShow, setIsShow] = useState(false);
  const [issueDetails, setIssueDetails] = useState([])
  const [selectType, setSelectType] = useState("All Reportees")
  const baseUrl = environment.baseUrl;
  const loggedUserId = localStorage.getItem('resId');
  var date = new Date();
  var firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
  var firstDays = moment(new Date(firstDay)).format('YYYY-MM-DD')
  console.log(firstDays)
  var todaydate = moment(new Date(date)).format('YYYY-MM-DD')
  console.log(todaydate)
  const [details, setDetails] = useState({ assignedto: "" })
  const [message, setMessage] = useState(false);
  const [depData, setDepData] = useState('')
  console.log(loggedUserId)
  const ref = useRef([]);
  const handleClick = () => {
    // let valid = GlobalValidation(ref);
    // if (valid == true) {
    //   setMessage(true);
    // }
    // if (valid) {
    //   return;
    // }
    if (selectType == "Resource Search") {
      console.log("inline-----------Resource search");
      getseconddata();
      setIsShow(true);
    } else {
      console.log("inline-----------All Reportees");
      getData1();
      setIsShow(true);
    }
  };
  let srep = details;
  console.log(srep);
  const [ToDate, setToDate] = useState(new Date());
  //////////first table date
  const dates = {
    fromDate: moment().format("YYYY-MM-DD"),
    toDate: moment().add("days", 0).format("YYYY-MM-DD"),
  };
  const [dt, setDt] = useState(dates);
  const addHandler = () => {
    setDt((prev) => ({
      ...prev,
      ["fromDate"]: moment(dt.fromDate).add("days", 1).format("YYYY-MM-DD"),
    }));
    setDt((prev) => ({
      ...prev,
      ["toDate"]: moment(dt.toDate).add("days", 1).format("YYYY-MM-DD"),
    }));
  };
  const subtracHandler = () => {
    setDt((prev) => ({
      ...prev,
      ["fromDate"]: moment(dt.fromDate)
        .subtract("days", 1)
        .format("YYYY-MM-DD"),
    }));
    setDt((prev) => ({
      ...prev,
      ["toDate"]: moment(dt.toDate).subtract("days", 1).format("YYYY-MM-DD"),
    }));
  };
  /////second table date
  const datess = {
    fromDate: moment().format("YYYY-MM-DD"),
    toDate: moment().add("days", 30).format("YYYY-MM-DD"),
  };
  const [dts, setDts] = useState(datess);
  var date = new Date(dts.toDate);
  var FromDate = new Date(date.getFullYear(), date.getMonth(), 1);
  const FDate = moment(FromDate).format("yyyy-MM-DD");
  const addHandlers = () => {
    setDts((prev) => ({
      ...prev,
      ["fromDate"]: moment(dts.fromDate).add("days", 30).format("YYYY-MM-DD"),
    }));
    setDts((prev) => ({
      ...prev,
      ["toDate"]: moment(dts.toDate).add("days", 30).format("YYYY-MM-DD"),
    }));
  };
  const subtracHandlers = () => {
    setDts((prev) => ({
      ...prev, ["fromDate"]: moment(dts.fromDate).subtract("days", 30).format("YYYY-MM-DD"),
    }));
    setDts((prev) => ({
      ...prev,
      ["toDate"]: moment(dts.toDate).subtract("days", 30).format("YYYY-MM-DD"),
    }));
  };
  const handleChangedata = (e) => {
    const { id, value } = e.target;
    // console.log(id + "-----" + value);
    setSelectType(value)
  }
  console.log(selectType)
  useEffect(() => {
    if (selectType == "All Reportees" || selectType == "Direct Reportees" || selectType == "Indirect Reportees") {
      let deptData = selectedDepartments.map(d => d.label).reduce(
        (accumulator, currentValue, index) => index == 0 ? ("'" + currentValue + "'") : (accumulator + ",'" + currentValue + "'"),
        initialValue
      );
      setDepData(deptData);
    }
  }, [selectType])
  const initialValue = {
    "BU": ''
  };
  const [linkColumns, setLinkColumns] = useState([]);
  const [searchdata, setSearchdata] = useState([]);
  // console.log(searchdata)
  const [searchdates, setSearchdates] = useState(initialValue);
  // console.log(searchdates)
  const getDepartments = async () => {
    const resp = await axios({
      url: baseUrl + `/administrationms/tracker/getnames`,
    });
    let departments = resp.data;
    // console.log(resp.data)
    setDepartments(departments);
    setSelectedDepartments(departments.filter(ele => ele.value != 0));
    let filteredDeptData = [];
    // departments.forEach((data) => {
    //   if (data.value != 0) {
    //     filteredDeptData.push(data.value);
    //   }
    // });
    setSearchdata((prevVal) => ({
      ...prevVal,
      ["BU"]: filteredDeptData,
    }));
  };
  const getData = () => {
    axios({
      method: "get",
      url: baseUrl + `/ProjectMS/Issues/getAssignedData`
    }).then(function (response) {
      var res = response.data
      setIssueDetails(res)
      // console.log("assigned data")
      // console.log(res);
    })
  }
  // console.log(details.assignedto)
  const getuserId = () => {
    axios({
      method: "get",
      url: baseUrl + `/administrationms/tracker/getuserId?Id=${loggedUserId}`
    }).then(function (response) {
      var res = response.data
      setUserid(response.data)
    })
  }
  console.log(userid)
  const [stabledata, setStabledata] = useState([{}]);
  const [deptsData, setDeptsData] = useState('')
  useEffect(() => {
    if (selectType == "Resource Search") {
      let deptData = selectedDepartments.map(d => d.label).reduce(
        (accumulator, currentValue, index) => index == 0 ? ("'" + currentValue + "'") : (accumulator + ",'" + currentValue + "'"), initialValue);
      setDeptsData(deptData);
    }
  }, [selectType])
  console.log(details.assignedto);
  const getseconddata = () => {
    axios({
      method: "post",
      url: baseUrl + `/administrationms/tracker/getresourcedata`,
      data: {
        selectedDate: "[" + deptsData.toString() + "]",
        screen_name: FDate,
        resId: details.assignedto,
      },
      headers: { "Content-Type": "application/json" },
    })
      .then(res => {
        const GetData = res.data;
        console.log(GetData)
        for (let i = 0; i < GetData.length; i++) {
          GetData[i] = GetData[i] == null ? "0" : GetData[i]
        }
        setStabledata(GetData)
      })
      .catch(error => {
        console.log("Error :" + error);
      })
  }
  console.log(stabledata)
  //--------------------first table link
  const [tabledata, setTabledata] = useState([{}]);
  useEffect(() => {
    data[0] && setHeaderData(JSON.parse(JSON.stringify(data[0])));
  }, [data]);
  const getDetailsInfo = () => {
    axios({
      method: "post",
      url: baseUrl + `/administrationms/tracker/getpagenamedata`,
      data: {
        page_name: data[Columns],
        toDt: dt.toDate,
        resId: loggedUserId,
      },
      headers: { "Content-Type": "application/json" },
    })
      .then(res => {
        const GetData = res.data;
        setTabledata(GetData)
      })
      .catch(error => {
        console.log("Error :" + error);
      })
    setOpenhtml(true);
  }
  console.log(tabledata)
  ///--------------second table link 
  const [Opensecondhtml, setOpensecondhtml] = useState(false)
  const getDetailsInfos = () => {
    axios({
      method: "post",
      url: baseUrl + `/administrationms/tracker/getpagenamedata`,
      data: {
        page_name: "MRF",
        toDt: dts.toDate,
        resId: loggedUserId,
      },
      headers: { "Content-Type": "application/json" },
    })
      .then(res => {
        const GetData = res.data;
        setTabledata(GetData)
      })
      .catch(error => {
        console.log("Error :" + error);
      })
    setOpensecondhtml(true);
  }
  const LinkTemplate = (data) => {
    return (
      <>
        <div align="center">
          <button onClick={getDetailsInfo} style={{ border: "none", background: "white", color: "blue" }}>{data[linkColumns[0]]}</button>
        </div>
      </>
    );
  };
  const LinkTemplateAction = (data) => {
    return (
      <>
        <div align="center">
          <button onClick={getDetailsInfo} style={{ border: "none", background: "white", color: "blue" }}>{data[linkColumns[1]]}</button>
        </div>
      </>
    );
  };
  const LinkTemplateActionRma = (data) => {
    return (
      <>
        <div align="center">
          <button onClick={getDetailsInfo} style={{ border: "none", background: "white", color: "blue" }}>{data[linkColumns[2]]}</button>
        </div>
      </>
    );
  };
  const LinkTemplateActionCP = (data) => {
    return (
      <>
        <div align="center">
          <button onClick={getDetailsInfo} style={{ border: "none", background: "white", color: "blue" }}>{data[linkColumns[3]]}</button>
        </div>
      </>
    );
  };
  const LinkTemplateActionTP = (data) => {
    return (
      <>
        <div align="center">
          <button onClick={getDetailsInfo} style={{ border: "none", background: "white", color: "blue" }}>{data[linkColumns[4]]}</button>
        </div>
      </>
    );
  };
  const LinkTemplateActionBA = (data) => {
    return (
      <>
        <div align="center">
          <button onClick={getDetailsInfo} style={{ border: "none", background: "white", color: "blue" }}>{data[linkColumns[5]]}</button>
        </div>
      </>
    );
  };
  const LinkTemplateActionPCQA = (data) => {
    return (
      <>
        <div align="center">
          <button onClick={getDetailsInfo} style={{ border: "none", background: "white", color: "blue" }}>{data[linkColumns[6]]}</button>
        </div>
      </>
    );
  };
  const LinkTemplateActionGD = (data) => {
    return (
      <>
        <div align="center">
          <button onClick={getDetailsInfo} style={{ border: "none", background: "white", color: "blue" }}>{data[linkColumns[7]]}</button>
        </div>
      </>
    );
  };
  const LinkTemplateActionBTTM = (data) => {
    return (
      <>
        <div align="center">
          <button onClick={getDetailsInfo} style={{ border: "none", background: "white", color: "blue" }}>{data[linkColumns[8]]}</button>
        </div>
      </>
    );
  };
  const LinkTemplateActionCompD = (data) => {
    return (
      <>
        <div align="center">
          <button onClick={getDetailsInfo} style={{ border: "none", background: "white", color: "blue" }}>{data[linkColumns[9]]}</button>
        </div>
      </>
    );
  };
  const LinkTemplateActionPrjHealth = (data) => {
    return (
      <>
        <div align="center">
          <button onClick={getDetailsInfo} style={{ border: "none", background: "white", color: "blue" }}>{data[linkColumns[10]]}</button>
        </div>
      </>
    );
  };
  const LinkTemplateActionAllocDB = (data) => {
    return (
      <>
        <div align="center">
          <button onClick={getDetailsInfo} style={{ border: "none", background: "white", color: "blue" }}>{data[linkColumns[11]]}</button>
        </div>
      </>
    );
  };
  const LinkTemplateActionRO = (data) => {
    return (
      <>
        <div align="center">
          <button onClick={getDetailsInfo} style={{ border: "none", background: "white", color: "blue" }}>{data[linkColumns[12]]}</button>
        </div>
      </>
    );
  };
  const LinkTemplateActionRT = (data) => {
    return (
      <>
        <div align="center">
          <button onClick={getDetailsInfo} style={{ border: "none", background: "white", color: "blue" }}>{data[linkColumns[13]]}</button>
        </div>
      </>
    );
  };
  const LinkTemplateActionForecast = (data) => {
    return (
      <>
        <div align="center">
          <button onClick={getDetailsInfo} style={{ border: "none", background: "white", color: "blue" }}>{data[linkColumns[14]]}</button>
        </div>
      </>
    );
  };
  const LinkTemplateActionServicePR = (data) => {
    return (
      <>
        <div align="center">
          <button onClick={getDetailsInfo} style={{ border: "none", background: "white", color: "blue" }}>{data[linkColumns[15]]}</button>
        </div>
      </>
    );
  };
  const LinkTemplateActionWPP = (data) => {
    return (
      <>
        <div align="center">
          <button onClick={getDetailsInfo} style={{ border: "none", background: "white", color: "blue" }}>{data[linkColumns[16]]}</button>
        </div>
      </>
    );
  };
  const LinkTemplateActionRAM = (data) => {
    return (
      <>
        <div align="center">
          <button onClick={getDetailsInfo} style={{ border: "none", background: "white", color: "blue" }}>{data[linkColumns[17]]}</button>
        </div>
      </>
    );
  };
  const LinkTemplateActionRMV = (data) => {
    return (
      <>
        <div align="center">
          <button onClick={getDetailsInfo} style={{ border: "none", background: "white", color: "blue" }}>{data[linkColumns[18]]}</button>
        </div>
      </>
    );
  };
  const LinkTemplateActionRP = (data) => {
    return (
      <>
        <div align="center">
          <button onClick={getDetailsInfo} style={{ border: "none", background: "white", color: "blue" }}>{data[linkColumns[19]]}</button>
        </div>
      </>
    );
  };
  const LinkTemplateActionUF = (data) => {
    return (
      <>
        <div align="center">
          <button onClick={getDetailsInfo} style={{ border: "none", background: "white", color: "blue" }}>{data[linkColumns[20]]}</button>
        </div>
      </>
    );
  };
  const LinkTemplateActionNBW = (data) => {
    return (
      <>
        <div align="center">
          <button onClick={getDetailsInfo} style={{ border: "none", background: "white", color: "blue" }}>{data[linkColumns[21]]}</button>
        </div>
      </>
    );
  };
  const LinkTemplateActionDS = (data) => {
    return (
      <>
        <div align="center">
          <button onClick={getDetailsInfo} style={{ border: "none", background: "white", color: "blue" }}>{data[linkColumns[22]]}</button>
        </div>
      </>
    );
  };
  const LinkTemplateActionIS = (data) => {
    return (
      <>
        <div align="center">
          <button onClick={getDetailsInfo} style={{ border: "none", background: "white", color: "blue" }}>{data[linkColumns[23]]}</button>
        </div>
      </>
    );
  };
  const LinkTemplateActionSSO = (data) => {
    return (
      <>
        <div align="center">
          <button onClick={getDetailsInfo} style={{ border: "none", background: "white", color: "blue" }}>{data[linkColumns[24]]}</button>
        </div>
      </>
    );
  };
  const LinkTemplateActionSPM = (data) => {
    return (
      <>
        <div align="center">
          <button onClick={getDetailsInfo} style={{ border: "none", background: "white", color: "blue" }}>{data[linkColumns[25]]}</button>
        </div>
      </>
    );
  };
  const LinkTemplateActionSSC = (data) => {
    return (
      <>
        <div align="center">
          <button onClick={getDetailsInfo} style={{ border: "none", background: "white", color: "blue" }}>{data[linkColumns[26]]}</button>
        </div>
      </>
    );
  };
  const LinkTemplateActionSPT = (data) => {
    return (
      <>
        <div align="center">
          <button onClick={getDetailsInfo} style={{ border: "none", background: "white", color: "blue" }}>{data[linkColumns[27]]}</button>
        </div>
      </>
    );
  };
  const LinkTemplateActionFPR = (data) => {
    return (
      <>
        <div align="center">
          <button onClick={getDetailsInfo} style={{ border: "none", background: "white", color: "blue" }}>{data[linkColumns[28]]}</button>
        </div>
      </>
    );
  };
  const LinkTemplateActionOppt = (data) => {
    return (
      <>
        <div align="center">
          <button onClick={getDetailsInfo} style={{ border: "none", background: "white", color: "blue" }}>{data[linkColumns[29]]}</button>
        </div>
      </>
    );
  };
  const LinkTemplateActionPC = (data) => {
    return (
      <>
        <div align="center">
          <button onClick={getDetailsInfo} style={{ border: "none", background: "white", color: "blue" }}>{data[linkColumns[30]]}</button>
        </div>
      </>
    );
  };
  const LinkTemplateActionFS = (data) => {
    return (
      <>
        <div align="center">
          <button onClick={getDetailsInfo} style={{ border: "none", background: "white", color: "blue" }}>{data[linkColumns[31]]}</button>
        </div>
      </>
    );
  };
  const LinkTemplateActionPI = (data) => {
    return (
      <>
        <div align="center">
          <button onClick={getDetailsInfo} style={{ border: "none", background: "white", color: "blue" }}>{data[linkColumns[32]]}</button>
        </div>
      </>
    );
  };
  const LinkTemplateActionSA = (data) => {
    return (
      <>
        <div align="center">
          <button onClick={getDetailsInfo} style={{ border: "none", background: "white", color: "blue" }}>{data[linkColumns[33]]}</button>
        </div>
      </>
    );
  }; const LinkTemplateActionMPRChanges = (data) => {
    return (
      <>
        <div align="center">
          <button onClick={getDetailsInfo} style={{ border: "none", background: "white", color: "blue" }}>{data[linkColumns[34]]}</button>
        </div>
      </>
    );
  }; const LinkTemplateActionCustDB = (data) => {
    return (
      <>
        <div align="center">
          <button onClick={getDetailsInfo} style={{ border: "none", background: "white", color: "blue" }}>{data[linkColumns[35]]}</button>
        </div>
      </>
    );
  };
  const LinkTemplateActionHCMT = (data) => {
    return (
      <>
        <div align="center">
          <button onClick={getDetailsInfo} style={{ border: "none", background: "white", color: "blue" }}>{data[linkColumns[36]]}</button>
        </div>
      </>
    );
  };
  const LinkTemplateActionPerformance = (data) => {
    return (
      <>
        <div align="center">
          <button onClick={getDetailsInfo} style={{ border: "none", background: "white", color: "blue" }}>{data[linkColumns[37]]}</button>
        </div>
      </>
    );
  }; const LinkTemplateActionManagement = (data) => {
    return (
      <>
        <div align="center">
          <button onClick={getDetailsInfo} style={{ border: "none", background: "white", color: "blue" }}>{data[linkColumns[38]]}</button>
        </div>
      </>
    );
  };
  const LinkTemplateActionSubkCT = (data) => {
    return (
      <>
        <div align="center">
          <button onClick={getDetailsInfo} style={{ border: "none", background: "white", color: "blue" }}>{data[linkColumns[39]]}</button>
        </div>
      </>
    );
  };
  const LinkTemplateActionVU = (data) => {
    return (
      <>
        <div align="center">
          <button onClick={getDetailsInfo} style={{ border: "none", background: "white", color: "blue" }}>{data[linkColumns[40]]}</button>
        </div>
      </>
    );
  };
  const LinkTemplateActionroleView = (data) => {
    return (
      <>
        <div align="center">
          <button onClick={getDetailsInfo} style={{ border: "none", background: "white", color: "blue" }}>{data[linkColumns[41]]}</button>
        </div>
      </>
    );
  };
  const LinkTemplateActionroleAppr = (data) => {
    return (
      <>
        <div align="center">
          <button onClick={getDetailsInfo} style={{ border: "none", background: "white", color: "blue" }}>{data[linkColumns[42]]}</button>
        </div>
      </>
    );
  };
  const LinkTemplateActionroleGrid = (data) => {
    return (
      <>
        <div align="center">
          <button onClick={getDetailsInfo} style={{ border: "none", background: "white", color: "blue" }}>{data[linkColumns[43]]}</button>
        </div>
      </>
    );
  };
  const LinkTemplateActionSWPR = (data) => {
    return (
      <>
        <div align="center">
          <button onClick={getDetailsInfo} style={{ border: "none", background: "white", color: "blue" }}>{data[linkColumns[44]]}</button>
        </div>
      </>
    );
  };
  const dynamicColumns = Object.keys(headerData)?.map((col) => {
    return (
      <Column
        sortable
        key={col}
        body={
          col == "MRF" ? LinkTemplate :
            col == "RMA" ? LinkTemplateAction :
              col == "RD" ? LinkTemplateActionRma :
                col == "CP" ? LinkTemplateActionCP :
                  col == "TP" ? LinkTemplateActionTP :
                    col == "BA" ? LinkTemplateActionBA :
                      col == "PCQA" ? LinkTemplateActionPCQA :
                        col == "GD" ? LinkTemplateActionGD :
                          col == "BT-T&M" ? LinkTemplateActionBTTM :
                            col == "Comp.D" ? LinkTemplateActionCompD :
                              col == "PrjHealth" ? LinkTemplateActionPrjHealth :
                                col == "Alloc DB" ? LinkTemplateActionAllocDB :
                                  col == "RO" ? LinkTemplateActionRO :
                                    col == "RT" ? LinkTemplateActionRT :
                                      col == "Forecast" ? LinkTemplateActionForecast :
                                        col == "Service PR" ? LinkTemplateActionServicePR :
                                          col == "S/W- PR" ? LinkTemplateActionSWPR :
                                            col == "WPP" ? LinkTemplateActionWPP :
                                              col == "RAM" ? LinkTemplateActionRAM :
                                                col == "RMV" ? LinkTemplateActionRMV :
                                                  col == "RP" ? LinkTemplateActionRP :
                                                    col == "UF" ? LinkTemplateActionUF :
                                                      col == "NBW" ? LinkTemplateActionNBW :
                                                        col == "DS" ? LinkTemplateActionDS :
                                                          col == "IS" ? LinkTemplateActionIS :
                                                            col == "SSO" ? LinkTemplateActionSSO :
                                                              col == "SPM" ? LinkTemplateActionSPM :
                                                                col == "SSC" ? LinkTemplateActionSSC :
                                                                  col == "SPT" ? LinkTemplateActionSPT :
                                                                    col == "FPR" ? LinkTemplateActionFPR :
                                                                      col == "Oppt" ? LinkTemplateActionOppt :
                                                                        col == "PC" ? LinkTemplateActionPC :
                                                                          col == "FS" ? LinkTemplateActionFS :
                                                                            col == "PI" ? LinkTemplateActionPI :
                                                                              col == "SA" ? LinkTemplateActionSA :
                                                                                col == "MPR Changes" ? LinkTemplateActionMPRChanges :
                                                                                  col == "Cust DB" ? LinkTemplateActionCustDB :
                                                                                    col == "HC&MT" ? LinkTemplateActionHCMT :
                                                                                      col == "Performance" ? LinkTemplateActionPerformance :
                                                                                        col == "Management" ? LinkTemplateActionManagement :
                                                                                          col == "Subk-CT" ? LinkTemplateActionSubkCT :
                                                                                            col == "V&U" ? LinkTemplateActionVU :
                                                                                              col == "roleView" ? LinkTemplateActionroleView :
                                                                                                col == "roleAppr" ? LinkTemplateActionroleAppr :
                                                                                                  col == "roleGrid" && LinkTemplateActionroleGrid

        }
        field={col}
        header={headerData[col]}
      />
    );
  });
  console.log(userid)
  const getData1 = () => {
    axios({
      method: "post",
      url:`http://localhost:8090/administrationms/tracker/getdata`,
      data: {
        screen_nameIds: "[" + depData.toString() + "]",
        toDt: dt.toDate,
        user_id: parseInt(userid),
        reportType: selectType,
      },
      headers: { "Content-Type": "application/json" },
    })
      .then(res => {
        let tabData = res.data.data;
        console.log(tabData)
        setData(tabData);
      })
      .catch(error => {
        console.log("Error :" + error);
      })
  }
  const [tabHeaders, setTabHeaders] = useState([]);
  console.log(data)
  useEffect(() => {
    if (data.length > 0) {
      let headers = (Object.keys(data[0])).filter(d => d != "id" && d != "lvl");
      console.log(headers)
      setTabHeaders(headers)
      console.log(tabHeaders)
    }
  }, [data])
  console.log(tabHeaders)
  useEffect(() => { }, [data]);
  //---
  
  useEffect(() => { }, [issueDetails])
  useEffect(() => {
    getDepartments();
    getData();
    getuserId();

  }, []);
  return (
    <div>
      <div>
        {message ? (<div className="errMsg" style={{ backgroundColor: "#F2DEDE", color: " #B94A48", }}>
          <span>
            <IoWarningOutline /> Please select the valid values for highlighted fields
          </span>
        </div>
        ) : ("")}
        <div className="group mb-3 customCard">
          <h2>Tracker</h2>
          <div className="group-content row">
            <div className=" col-md-3 mb-2">
              <div className="form-group row">
                <label className="col-5" htmlFor="SelectType">
                  Resource Type<span className="required">*</span>
                </label>
                <span className="col-1 p-0">:</span>
                <div className="col-6">
                  <select id="SelectType" name="SelectType" onChange={handleChangedata}>
                    <option value="All Reportees">All Reportees</option>
                    <option value="Direct Reportees">Direct Reportees</option>
                    <option value="Indirect Reportees">Indirect Reportees</option>
                    <option value="Resource Search">Resource Search</option>
                  </select>
                </div>
              </div>
            </div>
            {selectType == "Resource Search" ?
              <div className=" col-md-3 mb-2">
                <div className="form-group row">
                  <label className="col-5" value="Resource Search">
                    Resource<span className="required">*</span>
                  </label>
                  <span className="col-1 p-0">:</span>
                  <div className="col-6">
                    <div className='autocomplete'
                      ref={(ele) => {
                        ref.current[1] = ele;
                      }}
                    >
                      <div className='autoComplete-container' >
                        <ReactSearchAutocomplete
                          items={issueDetails}
                          type="Text"
                          name="assignedto"
                          id="assignedto"
                          issueDetails={issueDetails}
                          getData={getData}
                          className="AutoComplete"
                          onSelect={(e) => {
                            setDetails((prevProps) => ({
                              ...prevProps,
                              "assignedto": e.id,
                            }));
                            // console.log(e.id)
                          }}
                          showIcon={false}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              :
              <div className=" col-md-3 mb-2">
                <div className="form-group row">
                  <label className="col-5" htmlFor="Date">
                    Date<span className="required">*</span>
                  </label>
                  <span className="col-1 p-0">:</span>
                  <div className="col-6">
                    <DatePicker
                      name="Date"
                      selected={ToDate}
                      id="Date"
                      dateFormat='dd-MMM-yyyy'
                      onChange={(e) => {
                        setSearchdates(prev => ({ ...prev, ["ToDate"]: (moment(e).format("yyyy-MM-DD")) }));
                        setToDate(e);
                      }}
                      onKeyDown={(e) => {
                        e.preventDefault();
                      }}
                    />
                  </div>
                </div>
              </div>
            }
            <div className=" col-md-3 mb-2">
              <div className="form-group row">
                <label className="col-5" htmlFor="Screen">
                  Screen<span className="required">*</span>
                </label>
                <span className="col-1 p-0">:</span>
                <div className="col-6"
                >
                  <div
                    className="multiselect"
                    ref={(ele) => {
                      ref.current[0] = ele;
                    }}
                  >
                    <MultiSelect
                      id="BU"
                      options={departments}
                      hasSelectAll={true}
                      isLoading={false}
                      shouldToggleOnHover={false}
                      disableSearch={false}
                      value={selectedDepartments}
                      disabled={false}
                      onChange={(s) => {
                        // setSelectedDepartments(s);
                        // let filteredValues = [];
                        // s.forEach((d) => {
                        //   filteredValues.push(d.label);
                        // });
                        // setSearchdata((prevVal) => ({
                        //   ...prevVal,
                        //   ["BU"]: filteredValues,
                        // }));
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className=" col-md-3 mb-2">
              <div className="form-group row">
                <label className="col-5" htmlFor="Threshold">
                  Threshold
                </label>
                <span className="col-1 p-0">:</span>
                <div className="col-6">
                  <input
                    type="text"
                    className="form-control"
                    id="Threshold"
                    placeholder=""
                  />
                </div>
              </div>
            </div>{" "}
            <div className="col-md-12 col-sm-12 col-xs-12 btn-container center my-3">
              <button type="submit" className="btn btn-primary" onClick={handleClick}>
                Search{" "}
              </button>
            </div>
          </div>
        </div>
      </div>
      {isShow == true ?
        <div className="col-12 text-center">
          {selectType == "Resource Search" ?
            <>
              <span style={{ float: "center" }}>
                <AiOutlineLeftSquare
                  cursor="pointer"
                  size={"2em"}
                  onClick={subtracHandlers}
                ></AiOutlineLeftSquare>
                <span style={{ fontWeight: "600" }}>
                  {moment(dts.toDate).format("MMM-YYYY")}
                </span>
                <AiOutlineRightSquare
                  cursor="pointer"
                  size={"2em"}
                  onClick={addHandlers}
                ></AiOutlineRightSquare>
              </span>
              <Trackerfirstlink stabledata={stabledata} todaydate={todaydate} loggedUserId={loggedUserId} dts={dts} datess={datess} getDetailsInfos={getDetailsInfos} />
              <div>
                <span class="titleclr">Alloc DB</span><span>:Allocation Dashboard</span><span class="titleclr">BA</span><span>: Bench Analysis</span><span class="titleclr">CP</span><span>:Capacity Plan</span><span class="titleclr">Comp.D</span><span>: Competency Dashboard</span><span class="titleclr">Cust DB </span><span>: Custom Dashboard</span>
                <span class="titleclr">DS</span><span>:Demand & Supply</span><span class="titleclr">FPR</span><span>: Financial Plan and Review </span><span class="titleclr">FS</span><span>: Forecast and Supply</span><span class="titleclr">HC&MT</span><span> : Headcount & Margins Trend</span> <span class="titleclr">IS</span><span>: Inside Sales</span>
                <span class="titleclr">MPR Changes</span><span> : Monthly PR Changes by Day</span><span class="titleclr">MRF</span><span>:Monthly Revenue Forecast</span><span class="titleclr">RD</span><span>: My Dashboard</span><span class="titleclr">NBW</span><span>: NB Work - 4 Prev. Weeks</span><span class="titleclr">PCQA</span><span>:PCQA</span><span class="titleclr">PC</span><span>:Practice Calls</span>
                <span class="titleclr">PrjHealth</span><span> : Project Health </span><span class="titleclr">GD</span><span>: Project Status Report</span><span class="titleclr">PI</span><span>:Pyramid Index</span><span class="titleclr">RO</span><span>:Resource Overview</span><span class="titleclr">RT</span><span>:Resource Trending</span><span class="titleclr">RMA</span><span>: Revenue & Margin Analysis</span><span class="titleclr">RMV</span><span>:Revenue And Margin Variance</span>
                <span class="titleclr">RAM</span><span>: Revenue Attainment Metrics </span><span class="titleclr">RP</span><span>:Revenue Projections</span><span class="titleclr">Forecast</span><span>: RMG Forecast</span><span class="titleclr">roleAppr</span><span>:Role Approvals</span><span class="titleclr">roleGrid</span><span>:Role Grid </span><span class="titleclr">roleView</span><span>: Role View</span><span class="titleclr">Roles Permissions</span><span>:Roles Permissions</span><span class="titleclr">S/W- PR</span><span>:S/W Plan and Review </span>
                <span class="titleclr">Oppt</span><span>:Sales - Opportunities </span><span class="titleclr">SPM</span><span>:Sales Performance </span><span class="titleclr">SPT</span><span>:Sales Pipeline Trending </span><span class="titleclr">SSC</span><span>:Sales ScoreCard </span><span class="titleclr">SSO</span><span>:Sales Solutions </span><span class="titleclr">Service PR</span><span>:Services Plan and Review </span>
                <span class="titleclr">SA</span><span>:Shift Allownaces </span><span class="titleclr">Subk-CT</span><span>:Subk Conversion Trend </span><span class="titleclr">BT-T&M</span><span>: T&M - Open </span><span class="titleclr">TP</span><span>:Task Plan</span><span class="titleclr">UF</span><span>:Subk Conversion Trend </span><span class="titleclr">Subk-CT</span><span>:Subk Conversion Trend </span>
                <span class="titleclr">UF</span><span>:Utilisation - FY </span><span class="titleclr">Vendors</span><span>:Vendors</span><span class="titleclr"> V&U</span><span>:View And Upload</span><span class="titleclr"> Management</span><span>:VMG-Management </span><span class="titleclr"> Performance</span><span>:VMG-Performance</span><span class="titleclr"> WPP</span><span>:Weekly Pipeline Progress</span>
              </div>
              {Opensecondhtml == true ?
                <div className="col-14" style={{ position: "relative", bottom: "-2px" }}>
                  <table className="table table-bordered  " style={{ border: "1px solid #ddd", width: "40%" }}  >
                    <thead style={{ backgroundColor: "#eeeeee" }}>
                      <tr >
                        <th className="text-center" >First Hint</th>
                        <th className="text-center" >Last Hint</th>
                      </tr>
                    </thead>
                    {tabledata.map((data) => (
                      <tbody class="context-menu" >
                        <tr>
                          <td className="text-center" >{data.startTime} </td>
                          <td className="text-center" >{data.endTime}</td>
                        </tr>
                      </tbody>
                    ))}
                  </table>
                </div>
                : ""}
            </>
            :
            <>
              <span style={{ float: "center" }}>
                <AiOutlineLeftSquare
                  cursor="pointer"
                  size={"2em"}
                  onClick={subtracHandler}
                ></AiOutlineLeftSquare>
                <span style={{ fontWeight: "600" }}>
                  {moment(dt.toDate).format("DD-MMM-YYYY")}
                </span>
                <AiOutlineRightSquare
                  cursor="pointer"
                  size={"2em"}
                  onClick={addHandler}
                ></AiOutlineRightSquare>
              </span>
              <div>
                <div className="group mb-3 customCard">
                <MaterialReactTable
                    data={data}
                    enableExpandAll={false}
                    enableExpanding={false}
                    enablePagination={false}
                    enableRowVirtualization
                    enableBottomToolbar={false}
                    enableTopToolbar={false}
                    enableColumnActions={false}
                    enableSorting={false}
                    filterFromLeafRows 
                  />
                </div>
              </div>
              <div>
                <span class="titleclr">Alloc DB</span><span>:Allocation Dashboard</span><span class="titleclr">BA</span><span>: Bench Analysis</span><span class="titleclr">CP</span><span>:Capacity Plan</span><span class="titleclr">Comp.D</span><span>: Competency Dashboard</span><span class="titleclr">Cust DB </span><span>: Custom Dashboard</span>
                <span class="titleclr">DS</span><span>:Demand & Supply</span><span class="titleclr">FPR</span><span>: Financial Plan and Review </span><span class="titleclr">FS</span><span>: Forecast and Supply</span><span class="titleclr">HC&MT</span><span> : Headcount & Margins Trend</span> <span class="titleclr">IS</span><span>: Inside Sales</span>
                <span class="titleclr">MPR Changes</span><span> : Monthly PR Changes by Day</span><span class="titleclr">MRF</span><span>:Monthly Revenue Forecast</span><span class="titleclr">RD</span><span>: My Dashboard</span><span class="titleclr">NBW</span><span>: NB Work - 4 Prev. Weeks</span><span class="titleclr">PCQA</span><span>:PCQA</span><span class="titleclr">PC</span><span>:Practice Calls</span>
                <span class="titleclr">PrjHealth</span><span> : Project Health </span><span class="titleclr">GD</span><span>: Project Status Report</span><span class="titleclr">PI</span><span>:Pyramid Index</span><span class="titleclr">RO</span><span>:Resource Overview</span><span class="titleclr">RT</span><span>:Resource Trending</span><span class="titleclr">RMA</span><span>: Revenue & Margin Analysis</span><span class="titleclr">RMV</span><span>:Revenue And Margin Variance</span>
                <span class="titleclr">RAM</span><span>: Revenue Attainment Metrics </span><span class="titleclr">RP</span><span>:Revenue Projections</span><span class="titleclr">Forecast</span><span>: RMG Forecast</span><span class="titleclr">roleAppr</span><span>:Role Approvals</span><span class="titleclr">roleGrid</span><span>:Role Grid </span><span class="titleclr">roleView</span><span>: Role View</span><span class="titleclr">Roles Permissions</span><span>:Roles Permissions</span><span class="titleclr">S/W- PR</span><span>:S/W Plan and Review </span>
                <span class="titleclr">Oppt</span><span>:Sales - Opportunities </span><span class="titleclr">SPM</span><span>:Sales Performance </span><span class="titleclr">SPT</span><span>:Sales Pipeline Trending </span><span class="titleclr">SSC</span><span>:Sales ScoreCard </span><span class="titleclr">SSO</span><span>:Sales Solutions </span><span class="titleclr">Service PR</span><span>:Services Plan and Review </span>
                <span class="titleclr">SA</span><span>:Shift Allownaces </span><span class="titleclr">Subk-CT</span><span>:Subk Conversion Trend </span><span class="titleclr">BT-T&M</span><span>: T&M - Open </span><span class="titleclr">TP</span><span>:Task Plan</span><span class="titleclr">UF</span><span>:Subk Conversion Trend </span><span class="titleclr">Subk-CT</span><span>:Subk Conversion Trend </span>
                <span class="titleclr">UF</span><span>:Utilisation - FY </span><span class="titleclr">Vendors</span><span>:Vendors</span><span class="titleclr"> V&U</span><span>:View And Upload</span><span class="titleclr"> Management</span><span>:VMG-Management </span><span class="titleclr"> Performance</span><span>:VMG-Performance</span><span class="titleclr"> WPP</span><span>:Weekly Pipeline Progress</span>
              </div>
              {openhtml == true ?
                <div className="col-14" style={{ position: "relative", bottom: "-2px" }}>
                  <table className="table table-bordered  " style={{ border: "1px solid #ddd", width: "40%" }}  >
                    <thead style={{ backgroundColor: "#eeeeee" }}>
                      <tr >
                        <th className="text-center" >First Hint</th>
                        <th className="text-center" >Last Hint</th>
                      </tr>
                    </thead>
                    {tabledata.map((data) => (
                      <tbody class="context-menu" >
                        <tr>
                          <td className="text-center" >{data.startTime} </td>
                          <td className="text-center" >{data.endTime}</td>
                        </tr>
                      </tbody>
                    ))}
                  </table>
                </div>
                : ""}
            </>
          }
        </div> : <></>}
      {/* <div className="col-12" style={{ width: "41%", position: "relative", bottom: "16px" }}>
      {data.length == 0 ?
        <div>
          <div className="exampleCls3" style={{ textAlign: "center", border: "1px solid #ddd" }}>
            <div>No Data Found</div>
          </div>
        </div>
        : ""}
    </div> */}
    </div>
  );
}
export default Tracker;
