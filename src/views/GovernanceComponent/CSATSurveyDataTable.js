import React, { useEffect, useState } from "react";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
// import { getTableData } from "./CSATSurveyQuestionsData";
import { ColumnGroup } from "primereact/columngroup";
import { Row } from "primereact/row";
// import "primeflex/primeflex.css";
import { Button } from "primereact/button";
import { FaSave } from "react-icons/fa";
import DatePicker from "react-datepicker";
import { TiCancel } from "react-icons/ti";
import { environment } from "../../environments/environment";
import { BiCheck } from "react-icons/bi";

import axios from "axios";
import moment from "moment";
import { MdOutlineAdd, MdOutlinePlaylistAdd } from "react-icons/md";
import { AiFillWarning, AiOutlinePlusSquare } from "react-icons/ai";
import { ImCross } from "react-icons/im";
import "./CSATSurveyDataTable.scss";
import { TfiSave } from "react-icons/tfi";

function CSATSurveyDataTable({maxHeight1}) {
  const [Data, setData] = useState([]);
  const [subRowData, setSubRowData] = useState([]);
  const [expandedRows, setExpandedRows] = useState(null);
  const [flag, setFlag] = useState(false);
  const [neastedFlag, setNeastedflag] = useState(false);
  const [quesType, setQuesType] = useState([]);
  const [addmsg, setAddmsg] = useState(false);
  const [addinnermsg, setAddinnermsg] = useState(false);
  const [surveyquesArr, setSurveyquesArr] = useState();
  const [emptyMessage, setEmptyMessage] = useState(false);
  const [clicked, setClicked] = useState(false);
  const [saveCliked, setSaveClicked] = useState(true);
  const [cancelClicked, setCancelClicked] = useState(true);
  const [click, setClick] = useState(false);
  const [saveClik, setSaveClick] = useState(true);
  const [cancelClick, setCancelClick] = useState(true);
  // const [surveyinnerquesArr, setSurveyinnerquesArr] = useState();
  const [saveQue, setSaveQue] = useState("");
  const [saveInnerQue, setSaveInnerQue] = useState("");

  const [uniqueMessage, setUniqueMessage] = useState(false);
  const [isModified, setIsModified] = useState(false);
  const [isinnerModified, setIsinnerModified] = useState(false);

  const [addFormData, setAadFormData] = useState({
    survey_name: "",
    type: "CSAT",
  });

  const [addNestedFormData, setAddNeastedFormData] = useState({
    pcqa_csat_survey_id: "",
    question: "",
    question_code: "",
    // response_type: "160",
    // status: 1,
    // question: "",
    // type: "",
  });
  const baseUrl = environment.baseUrl;

  document.documentElement.style.setProperty(
    "--dynamic-value",
    String(maxHeight1 - 61) + "px"
  );

  useEffect(() => {
    getTableData();
    getQuestionType();
    getSurveyquesArr();
  }, []);

  const Reset = () => {
    document.getElementsByClassName("p-row-editor-cancel p-link")[0]?.click();
    setAddNeastedFormData({});
    setClicked(false);
    setCancelClicked(true);
    setSaveClicked(true);
  };
  const Reset1 = () => {
    document.getElementsByClassName("p-row-editor-cancel p-link")[0]?.click();
    setCancelClick(true);
    setClick(false);
    setSaveClick(true);
  };
  const Save = () => {
    document
      .getElementsByClassName("p-row-editor-save-icon pi pi-fw pi-check")[0]
      ?.click();
    // EditedData();
    // setCancelClicked(true);
    // setSaveClicked(true);
    // setClicked(false);
    // EditedData(editeddata);
  };
  const getSurveyquesArr = () => {
    axios({
      method: "get",
      url: baseUrl + `/governancems/Csat/getCsatsurvey`,
    })
      .then(function (response) {
        let resp = response.data;
        setSurveyquesArr(resp);
      })
      .catch(function (error) {});
  };

  const getTableData = () => {
    axios({
      method: "get",
      url: baseUrl + `/governancems/Csat/getCsatques`,
    })
      .then(function (response) {
        var resp = response.data;
        setData(resp);
      })
      .catch(function (response) {});
  };

  const getQuestionType = () => {
    axios({
      method: "get",
      url: baseUrl + `/governancems/Csat/getQuestionType`,
    })
      .then(function (response) {
        var resp = response.data;
        setQuesType(resp);
      })
      .catch(function (response) {});
  };

  const saveSurveyQuestion = () => {
    let someDataa = surveyquesArr.some(
      (d) => d.survey_name == addFormData.survey_name
    );
    if (Data != undefined) {
      if (someDataa) {
        let ele = document.getElementsByName("survey_name");
        for (let index = 0; index < ele.length; index++) {
          ele[index].classList.add("error-block");
        }

        setUniqueMessage(true);
        setSaveClick(false);
        setCancelClick(false);
        setClick(true);

        setTimeout(() => {
          setUniqueMessage(false);
        }, 3000);
        return;
      }
    }
    if (addFormData.survey_name == "" || addFormData.survey_name == " ") {
      let ele = document.getElementsByName("survey_name");
      for (let index = 0; index < ele.length; index++) {
        ele[index].classList.add("error-block");
      }
      setEmptyMessage(true);
      setTimeout(() => {
        setEmptyMessage(false);
      }, 3000);
      return;
    }

    axios({
      method: "post",
      url: baseUrl + `/governancems/Csat/saveSurvey`,
      data: addFormData,
    }).then((error) => {
      getTableData();
      getSurveyquesArr();
      setFlag(false);
      setSaveQue(addFormData?.survey_name);
      setAddmsg(true);
      setTimeout(() => {
        setAddmsg(false);
      }, 3000);
      setSaveClick(true);
      setCancelClick(true);
      setClick(false);
    });
  };
  const saveInnerSurveyQue = () => {
    // let someDataa = surveyquesArr.some(d => d.subrows?.question == addNestedFormData?.question);
    // let someDataa = surveyquesArr.some((d) => {
    //   return d.subrows.some((a) => {
    //     if (addNestedFormData.pcqa_csat_survey_id === a.pcqa_csat_survey_id)
    //       return a.question == addNestedFormData?.question;
    //   });
    // });
    // if (Data != undefined) {
    //   if (someDataa) {
    //     let ele = document.getElementsByName("question");
    //     for (let index = 0; index < ele.length; index++) {
    //       ele[index].classList.add("error-block");
    //     }

    //     setUniqueMessage(true);
    //     setClicked(true);
    //     setCancelClicked(true);
    //     setSaveClicked(true);

    //     // setValidationMessage(false);
    //     setTimeout(() => {
    //       setUniqueMessage(false);
    //     }, 3000);
    //     return;
    //   }
    // }
    if (
      addNestedFormData.question == "" ||
      addNestedFormData.question == " " ||
      addNestedFormData.question == undefined
    ) {
      let ele = document.getElementsByName("question");
      for (let index = 0; index < ele.length; index++) {
        ele[index].classList.add("error-block");
      }
      // addFormData.survey_name;
      setEmptyMessage(true);
      setSaveClicked(false);
      setCancelClicked(false);
      setClicked(true);
      setTimeout(() => {
        setEmptyMessage(false);
        //
      }, 3000);
      return;
    }

    axios({
      method: "post",
      url: baseUrl + `/governancems/Csat/saveInnerSurveyQue`,
      data: {
        pcqa_csat_survey_id: addNestedFormData.pcqa_csat_survey_id,
        question: addNestedFormData.question,
        question_code: "",
        response_type:
          addNestedFormData?.response_type == undefined
            ? "160"
            : addNestedFormData?.response_type,
        status: 1,
      },
    }).then((error) => {
      getTableData();
      setSaveInnerQue(addNestedFormData?.question);
      getSurveyquesArr();
      setNeastedflag(false);
      setAddNeastedFormData((prev) => ({ ...prev, ["response_type"]: "160" }));
      setAddinnermsg(true);
      setTimeout(() => {
        setAddinnermsg(false);
      }, 3000);
      setSaveClicked(true);
      setClicked(false);
      setCancelClicked(true);
      setAddNeastedFormData({});
    });
  };

  const addHandler = () => {
    // setIsAdding(true);

    setClicked(true);
    setCancelClicked(false);
    setSaveClicked(false);
  };
  const addHandler1 = () => {
    // setIsAdding(true);

    setClick(true);
    setCancelClick(false);
    setSaveClick(false);
  };
  let count = Data.length;

  const handleAddFormChange = (event) => {
    event.preventDefault();

    const fieldName = event.target.getAttribute("name");
    const fieldValue = event.target.value.trim();

    const newFormData = { ...addFormData };
    newFormData[fieldName] = fieldValue;

    setAadFormData(newFormData);
    setIsModified(true);
  };
  const handleIsModifiedChange = () => {
    setIsModified(false);
    setClick(true);
    setCancelClick(false);
    setSaveClick(false);
  };
  const handleIsModified = () => {
    setIsinnerModified(false);
    setClicked(true);
    setCancelClicked(false);
    setSaveClicked(false);
  };
  const handleAddNestedFormChange = (event) => {
    event.preventDefault();

    const fieldName = event.target.getAttribute("name");
    const fieldValue = event.target.value.trim();

    const newFormData = { ...addNestedFormData };
    newFormData[fieldName] = fieldValue;

    setAddNeastedFormData(newFormData);
    setIsinnerModified(true);
  };

  const allowExpansion = (rowData) => {
    return (
      // <span className="col-2">
      rowData.subrows?.length >= 0
      // </span>
    );
  };

  // let headerGroup = (
  //   <ColumnGroup>
  //     <Row>
  //       <Column />
  //       <Column header="Survey/Question" alignHeader={"center"} />
  //       <Column header="Created On/Question type" alignHeader={"center"} />
  //       {/* <Column header="Question type" /> */}
  //     </Row>
  //   </ColumnGroup>
  // );
  const questionTooltip = (data) => {
    return (
      <div data-toggle="tooltip" title={data.survey_name}>
        {data.survey_name}
      </div>
    );
  };

  const question = (data) => {
    return (
      <div data-toggle="tooltip" title={data.question}>
        {data.question}
      </div>
    );
  };

  const questionRange = (data) => {
    return (
      <div data-toggle="tooltip" title={data.lkup_name}>
        {data.lkup_name}
      </div>
    );
  };

  const handleForm = (
    <div className="newEntryFields">
      <form className="col-md-12">
        <div className="row px-1 py-2">
          <div className="col-9">
            <input
              type="text"
              name="survey_name"
              required
              onChange={handleAddFormChange}
              placeholder="Enter Survey Question"
            />
          </div>
          <div className="col-3">
            <DatePicker
              name="date"
              id="date"
              className="disableField"
              selected={new Date()}
              // selected={editedData?.Due_Date}
              // selected={editedData && 'Due_Date' in editedData && editedData.Due_Date}
              dateFormat="dd-MMM-yyyy"
              showMonthDropdown
              disabled
              showYearDropdown
            />
          </div>
        </div>
      </form>
    </div>
  );
  const representDate = (data) => {
    return (
      <div title={moment(data.date).format("DD-MMM-YYYY")}>
        {moment(data.date).format("DD-MMM-YYYY")}
      </div>
    );
  };

  const handleNestedForm = (
    <div className="newEntryFields">
      <form className="col-md-12">
        <div className="row px-1 py-2">
          <div className="col-9">
            <input
              type="text"
              name="question"
              required
              onChange={handleAddNestedFormChange}
              placeholder="Enter Survey Question"
            />
          </div>
          <div className="col-3">
            <select
              name="response_type"
              id="response_type"
              onChange={handleAddNestedFormChange}
            >
              {quesType.map((Item) => (
                <option value={Item.val}> {Item.lkup_name}</option>
              ))}
            </select>
          </div>
        </div>
      </form>
    </div>
  );

  let rowExpansionTemplate = (data) => {
    return (
      <div className=" darkHeader p-2 bodyStyle">
        <DataTable
          value={data.subrows}
          responsiveLayout="scroll"
          header={null}
          className="p-grid innercsat customerEngament"
          pagination={data.subrows.length > 0}
          paginator={data.subrows.length > 0}
          rows={10}
          paginationPerPage={5}
          paginationRowsPerPageOptions={[5, 15, 25, 50]}
          paginationComponentOptions={{
            rowsPerPageText: "Records per page:",
            rangeSeparatorText: "out of",
          }}
        >
          <Column field="question" body={question} />

          <Column field="lkup_name" body={questionRange} />
        </DataTable>
        <>{setSubRowData(data.subrows)}</>
        <div className="newTableEntry">
          <div>{neastedFlag === true && <span>{handleNestedForm}</span>}</div>
        </div>
        <div className="tableBottomButtons btn-container-events center">
          <button
            className="btn btn-primary p-1"
            data-toggle="tooltip"
            disabled={clicked}
            title="Add new row"
            onClick={() => {
              setNeastedflag(true);
              addHandler();
              setAddNeastedFormData((prev) => ({
                ...prev,
                ["pcqa_csat_survey_id"]: data.id,
              }));
            }}
          >
            <MdOutlineAdd size={"1.2em"} /> Add
          </button>
          <button
            className="btn btn-primary p-1"
            disabled={saveCliked}
            onClick={() => {
              saveInnerSurveyQue();
              Save();
            }}
            data-toggle="tooltip"
            title="Save row"
          >
            <TfiSave size="0.7em" />
            <span className="ml-1"> Save </span>
          </button>
          <button
            className="btn btn-primary p-1"
            disabled={cancelClicked}
            onClick={() => {
              setNeastedflag(false);
              Reset();
            }}
            data-toggle="tooltip"
            title="Cancel row editing"
          >
            <ImCross size={"0.6em"} />
            <span className="ml-1">Cancel</span>
          </button>
        </div>
      </div>
    );
  };
  return (
    <React.Fragment>
      <div className="col-md-12">
        {uniqueMessage ? (
          <div className="statusMsg error">
            {" "}
            <AiFillWarning /> Please give Unique Name
          </div>
        ) : (
          ""
        )}
      </div>
      {isModified && handleIsModifiedChange()}
      {isinnerModified && handleIsModified()}

      <div className="col-md-12">
        {emptyMessage ? (
          <div className="statusMsg error">
            {" "}
            <AiFillWarning /> Please select the valid values for highlighted
            fields
          </div>
        ) : (
          ""
        )}
      </div>
      <div className="col-md-12">
        {addmsg ? (
          <div className="statusMsg success">
            {" "}
            <BiCheck />
            {/* {saveQue} survey question saved successfully */}
            CSAT Survey {saveQue} created successfully
          </div>
        ) : (
          ""
        )}
      </div>
      <div className="col-md-12">
        {addinnermsg ? (
          <div className="statusMsg success">
            {" "}
            <BiCheck />
            {/* {saveInnerQue} survey question saved successfully */}
            Survey Question {saveInnerQue} created successfully.
          </div>
        ) : (
          ""
        )}
      </div>

      <div className="csatTable darkHeader toHead">
        <DataTable
          value={Data}
          showGridlines
          // headerColumnGroup={headerGroup}

          expandedRows={expandedRows}
          onRowToggle={(e) => setExpandedRows(e.data)}
          rowExpansionTemplate={rowExpansionTemplate}
          pagination
          paginator
          rows={25}
          className="primeReactDataTable " ////customerEngament
          paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
          currentPageReportTemplate="{first} to {last} of {totalRecords}"
          rowsPerPageOptions={[15, 25, 50]}
          // paginationPerPage={5}
          // paginationRowsPerPageOptions={[5, 15, 25, 50]}
          // paginationComponentOptions={{
          //   rowsPerPageText: "Records per page:",
          //   rangeSeparatorText: "out of",
          // }}
        >
          <Column expander={allowExpansion} />
          <Column
            field="survey_name"
            header="Survey/Question"
            sortable
            // header={Data.survey_name}
            body={questionTooltip}
            alignHeader={"center"}
          />
          <Column
            sortable
            field="date"
            header="Created On/Question type"
            // header={Data.date}
            body={representDate}
            alignHeader={"center"}
          />
        </DataTable>
        <div className="newTableEntry">
          {flag === true && <span>{handleForm}</span>}
        </div>
        <div className="tableBottomButtons btn-container-events center">
          <button
            className="btn btn-primary p-1"
            data-toggle="tooltip"
            disabled={click}
            title="Add new row"
            onClick={() => {
              setFlag(true);
              addHandler1();
            }}
            variant="contained"
          >
            <MdOutlineAdd size="1.2em" /> Add
          </button>
          <button
            className="btn btn-primary p-1"
            disabled={saveClik}
            onClick={() => {
              saveSurveyQuestion();
              Save();
            }}
            data-toggle="tooltip"
            title="Save row"
            // variant="contained"
          >
            <TfiSave size={"0.7em"} />
            <span className="ml-1"> Save </span>
          </button>
          <button
            className="btn btn-primary p-1"
            disabled={cancelClick}
            onClick={() => {
              setFlag(false);
              Reset1();
            }}
            data-toggle="tooltip"
            title="Cancel row editing"
            variant="contained"
          >
            <ImCross size={"0.6em"} />
            <span className="ml-1">Cancel</span>
          </button>
        </div>
      </div>
    </React.Fragment>
  );
}

export default CSATSurveyDataTable;
