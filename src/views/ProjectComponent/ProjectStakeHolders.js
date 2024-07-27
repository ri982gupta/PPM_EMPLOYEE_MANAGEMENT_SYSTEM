import React, { useEffect, useState } from "react";
import "./ProjectStakeHolders.scss";
import axios from "axios";
import { AiOutlinePlusCircle } from "react-icons/ai";
import { AiOutlinePlusSquare, AiOutlineSave } from "react-icons/ai";
import { AiFillEdit } from "react-icons/ai";
import { BiCheck } from "react-icons/bi";
import { AiFillSave } from "react-icons/ai";
import { AiFillCloseCircle } from "react-icons/ai";
import { BiError } from "react-icons/bi";
import { environment } from "../../environments/environment";
import AutoComplete from "./StakeHoldersAutocomplete";
import moment from "moment";
import "./Project.scss";
import ReactPaginate from "react-paginate";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

function ProjectStakeHolders(props) {
  const { projectId } = props;
  const [respData, setRespData] = useState([]);
  const value = "";
  const loggedUserId = localStorage.getItem("resId");
  console.log(loggedUserId);
  const Details = {
    Role: "",
    User: "",
    FromDate: "",
    ToDate: "",
    AssignmentType: "",
    assignedBy: loggedUserId,
    AssignedDate: "",
    IsActive: 1,
  };
  const [state, setState] = useState(Details);
  console.log(state);
  const [order, setOrder] = useState("ASC");
  const [displayTable, setDisplayTable] = useState(null);
  const [editedValue, setEditedValue] = useState(-1);
  const [displayRowEdit, setDisplayRowEdit] = useState(false);
  const [roles, SetRoles] = useState([]);
  const [date, SetDate] = useState([]);
  const [userDetails, setUserDetails] = useState([]);
  const [validationMsg, setValidationMsg] = useState(null);
  const [editId, setEditId] = useState(null);
  const [succesMsg, setSuccesMsg] = useState(false);
  const [selectUser, setSelectUser] = useState([]);
  const [editOption, setEditOption] = useState([]);

  const loggedUserName = localStorage.getItem("resName");
  const baseUrl = environment.baseUrl;

  ///////////axios for getting Details in to the table/////////////////////
  const getStakeHoldersDetails = () => {
    axios({
      url:
        baseUrl +
        `/ProjectMS/stakeholders/getStakeHolderDetails?ObjectId=${projectId}`,
    }).then((resp) => {
      setRespData(resp.data);
    });
  };
  console.log(respData);
  ///////////axios for getting FromDate and ToDate from ProjectTable for Project StartDate and EndDate While creating new Record///////////////
  const getFromDateToDate = () => {
    axios({
      url:
        baseUrl +
        `/ProjectMS/stakeholders/getFromAndToDates?ObjectId=${projectId}`,
    }).then((resp) => {
      SetDate(resp.data);
    });
  };
  console.log(date);
  //////// axios for Getting Roles and id's for changing field Role when adding and editing new row//////////
  const getRoles = () => {
    axios({
      url: baseUrl + `/ProjectMS/stakeholders/getRoles`,
    }).then((resp) => {
      SetRoles(resp.data);
    });
  };
  console.log(roles);
  /////////axios for Getting the EmployeeName and Id when adding and editing new row////////////
  const getUserDetails = () => {
    axios({
      method: "post",
      url: baseUrl + `/ProjectMS/stakeholders/getUserDetails`,
      data: { searchKey: "" },
    }).then((error) => {
      setUserDetails(error.data);
    });
  };
  console.log(userDetails);
  ///////////axios for Edit Option for Action/////////////
  const geteditoption = () => {
    axios({
      method: "get",
      url:
        baseUrl +
        `/ProjectMS/stakeholders/editoption?ObjectId=${projectId}&userid=${loggedUserId}`,
    }).then((response) => {
      setEditOption(response.data);
    });
  };
  console.log(editOption);
  const [addmsg, setAddmsg] = useState(false);
  const [editmsg, setEditAddmsg] = useState(false);
  console.log(projectId);
  const handleSave = () => {
    console.log(respData);
    if (respData.find((item) => item.id === editId)) {
      console.log(respData);
      console.log(editId);
      console.log("inline----put");
      var data = {
        id: editId,
        LastUpdatedBy: loggedUserName,
        LastUpdatedById: loggedUserId,
        Version: "1",
        assignedBy: loggedUserId,
        IsActive: "1",
        CreatedBy: loggedUserName,
        ObjectTypeCode: "Resource",
        IsResolved: "1",
        IsManualAssignment: "1",
        ObjectId: projectId,
        Role: state.Role,
        User: state.User,
        FromDate: state.FromDate,
        ToDate: state.ToDate,
        object_type_id: 2,
        role_type_id: 643,
      };
      axios({
        method: "post",
        url:
          baseUrl +
          `/ProjectMS/stakeholders/postDetailsinBaseDomainobjectroles`,
        data: data,
      }).then((error) => {
        console.log("success", error);
        setDisplayRowEdit(false);
        getStakeHoldersDetails();
        setEditAddmsg(true);
        setTimeout(() => {
          setEditAddmsg(false);
        }, 3000);
      });
    } else {
      console.log("inline-----post");
      var data = {
        LastUpdatedBy: loggedUserName,
        LastUpdatedById: loggedUserId,
        Version: "1",
        assignedBy: loggedUserId,
        IsActive: "1",
        CreatedBy: loggedUserName,
        ObjectTypeCode: "Resource",
        IsResolved: "1",
        IsManualAssignment: "1",
        ObjectId: projectId,
        Role: state.Role,
        User: state.User,
        FromDate: state.FromDate,
        ToDate: state.ToDate,
        object_type_id: 15,
        role_type_id: 659,
      };
      axios({
        method: "post",
        url:
          baseUrl +
          `/ProjectMS/stakeholders/postDetailsinBaseDomainobjectroles`,
        data: data,
      }).then((error) => {
        console.log("success", error);
        setDisplayRowEdit(false);
        getStakeHoldersDetails();
        setAddmsg(true);
        setTimeout(() => {
          setAddmsg(false);
        }, 3000);
      });
    }
  };

  console.log(state.Role);
  console.log(state.User);
  console.log(state.FromDate);
  console.log(state.ToDate);

  /////////////validations///////////////////////////////
  const validateValues = () => {
    let data = document.getElementsByClassName("validateErr");
    let validationArrMsg = [];
    for (let i = 0; i < data.length; i++) {
      let value = data[i].value;
      let clsList = data[i].classList;
      if (value === "" && clsList.contains("txtBoxBorderColor") === false) {
        clsList.add("txtBoxBorderColor");
      } else {
        clsList.remove("txtBoxBorderColor");
      }
      validationArrMsg.push(clsList.contains("txtBoxBorderColor"));
    }
    setValidationMsg(validationArrMsg.includes(true) ? true : false);
    setTimeout(() => {
      setValidationMsg(false);
    }, 3000);
    if (validationArrMsg.includes(true)) {
      return;
    }
    handleSave();
  };
  //////////////sorting the table data/////////////////////////////
  const sorting = (col) => {
    if (order === "ASC") {
      const sorted = [...respData].sort((a, b) =>
        a[col]?.toLowerCase() > b[col]?.toLowerCase() ? 1 : -1
      );
      setRespData(sorted);
      setOrder("DSC");
    }
    if (order === "DSC") {
      const sorted = [...respData].sort((a, b) =>
        a[col]?.toLowerCase() < b[col]?.toLowerCase() ? 1 : -1
      );
      setRespData(sorted);
      setOrder("ASC");
    }
  };
  const sortnum = (col) => {
    if (order === "DSC") {
      const sorted = [...respData].sort((x, y) =>
        // true values first
        x[col] === y[col] ? 0 : x[col] ? -1 : 1
      );
      setRespData(sorted);
      setOrder("ASC");
    }
    // false values first
    if (order === "ASC") {
      const sorted = [...respData].sort((x, y) =>
        x[col] === y[col] ? 0 : x[col] ? 1 : -1
      );
      setRespData(sorted);
      setOrder("DSC");
    }
  };
  //////////////pagination//////////////////
  const [currentItem, setCurrentItem] = useState(0);
  const [pageCount, setpageCount] = useState(1);
  const [itemOffSet, setItemOffSet] = useState(0);
  const itemPerPage = 20;
  const [finalRow, setFinalRow] = useState(itemPerPage);
  const totalRows = respData.length;
  const Firstrow = itemOffSet + 1;

  useEffect(() => {
    const endOffset = itemOffSet + itemPerPage;
    const length = respData.slice(itemOffSet, endOffset);
    if (endOffset > totalRows) {
      setFinalRow(totalRows);
    } else {
      setFinalRow(endOffset);
    }
    setCurrentItem(length);
    setpageCount(Math.ceil(respData.length / itemPerPage));
    displayTableFnc(length);
  }, [respData, itemOffSet, itemPerPage, pageCount]);

  const handlePageClick = (click) => {
    const newOffSet = (click.selected * itemPerPage) % respData.length;
    setItemOffSet(newOffSet);
  };
  ////////////////////////////////////////////

  useEffect(() => {
    getStakeHoldersDetails();
    getFromDateToDate();
    getRoles();
    displayTableFnc();
    getUserDetails();
    geteditoption();
  }, []);

  useEffect(() => {
    displayTableFnc();
  }, [
    displayRowEdit,
    respData,
    userDetails,
    selectUser,
    date,
    editedValue,
    editOption,
  ]);

  const addRowEditFnc = () => {
    console.log("inline-------AddRow");
    setDisplayRowEdit(true);
  };

  const closeEditedRowFnc = () => {
    setDisplayRowEdit((prev) => false);
    setEditedValue(-1);
  };

  const editHandler = (element, index, object) => {
    console.log(element?.id);
    console.log(object);
    setEditedValue(index);
    console.log(editedValue);
    setEditId(element?.id);
    console.log(editId);
  };
  const onChangeRowEdit = (e) => {
    console.log(e);
    const { id, value } = e.target;
    setState((prevProps) => ({ ...prevProps, [id]: value }));
    console.log(state);
  };
  console.log(state.User);

  let tabHeaders = [
    "Role",
    "User",
    "FromDate",
    "ToDate",
    "AssignmentType",
    "assignedBy",
    "date_created",
    "IsActive",
    "Action",
  ];
  const displayTableFnc = () => {
    setDisplayTable(() => {
      let data = respData;
      console.log(data);
      let fData = [];
      if (displayRowEdit) {
        fData = [{ ...tabHeaders }, ...data];
        console.log(fData);
      } else {
        fData = respData;
        console.log(fData);
      }
      return fData.length === 0 ? (
        <tr>
          <td colSpan={11} align="center">
            No Records Found
          </td>
        </tr>
      ) : (
        fData.map((element, index) => {
          let tabData = [];
          if (displayRowEdit && index === 0) {
            tabHeaders.forEach((inEle, inInd) => {
              console.log(inEle);
              if (inEle === "Action") {
                tabData.push(
                  <td>
                    <div>
                      <AiFillEdit
                        title={"Edit"}
                        className="pointerCursor"
                        onClick={(e) => {
                          editHandler(element, index);
                        }}
                      />
                    </div>
                  </td>
                );
              } else if (inEle === "Role") {
                tabData.push(
                  <td>
                    <select
                      id={inEle}
                      name="Role"
                      className="textBxBrdrRd   validateErr"
                      onChange={(e) => {
                        onChangeRowEdit(e);
                        console.log(inEle);
                      }}
                    >
                      <option key="">{"<<Please Select>>"}</option>
                      {roles.map((data) => (
                        <option key={data.id} value={data.id}>
                          {data.display_name}
                        </option>
                      ))}
                    </select>
                  </td>
                );
              } else if (inEle === "User") {
                tabData.push(
                  <td>
                    {" "}
                    <div
                      name="User"
                      id={inEle}
                      className="textBxBrdrRd   validateErr"
                      onChange={(e) => {
                        onChangeRowEdit(e);
                        console.log(e);
                      }}
                    >
                      <div className="AutoComplete">
                        <AutoComplete
                          className="error"
                          userDetails={userDetails}
                          value={setState}
                          setState={setState}
                          setSelectUser={setSelectUser}
                        />
                      </div>
                    </div>
                  </td>
                );
              } else if (inEle === "FromDate") {
                tabData.push(
                  <td id={inEle} name="FromDate">
                    <DatePicker
                      input
                      id={inEle}
                      selected={moment(date[0].planned_start_dt)._d}
                      minDate="01-02-2017"
                      maxDate="31-12-2022"
                      onChange={(e) => {
                        setState((prev) => ({
                          ...prev,
                          ["FromDate"]: moment(e).format("yyyy-MM-DD"),
                        }));
                        console.log(e);
                      }}
                      className="textBxBrdrRd   validateErr"
                      type="text"
                    />
                  </td>
                );
              } else if (inEle === "ToDate") {
                tabData.push(
                  <td id={inEle} name="ToDate">
                    <DatePicker
                      input
                      id={inEle}
                      selected={moment(date[0].planned_end_dt)._d}
                      onChange={(e) => {
                        setState((prev) => ({
                          ...prev,
                          ["ToDate"]: moment(e).format("yyyy-MM-DD"),
                        }));
                        console.log(e);
                      }}
                      className="textBxBrdrRd   validateErr"
                      type="text"
                    />
                  </td>
                );
              } else {
                tabData.push(
                  <td id={inEle} name={inEle}>
                    <div
                      id={inEle}
                      className="textBxBrdrRd   validateErr"
                      defaultValue={element[inEle]}
                      readOnly
                      disabled={editedValue !== -1 ? true : false}
                      onChange={(e) => {
                        onChangeRowEdit(e);
                        console.log(e);
                      }}
                    />
                  </td>
                );
              }
            });
          } else if (editedValue !== -1 && editedValue === index) {
            tabHeaders.forEach((inEle, inInd) => {
              if (inEle === "Action") {
                tabData.push(
                  <td>
                    <div>
                      <AiFillEdit
                        title={"Edit"}
                        className="pointerCursor"
                        onClick={(e) => {
                          editHandler(element, index);
                          console.log(e);
                        }}
                      />
                    </div>
                  </td>
                );
              } else if (inEle === "Role") {
                tabData.push(
                  <td>
                    <select
                      name="Role"
                      id={inEle}
                      className="textBxBrdrRd   validateErr"
                      onChange={(e) => {
                        onChangeRowEdit(e);
                        console.log(e);
                      }}
                    >
                      <option key="">{"<<Please Select>>"}</option>
                      {roles.map((data) => (
                        <option key={data.id} value={data.id}>
                          {data.display_name}
                        </option>
                      ))}
                    </select>
                  </td>
                );
              } else if (inEle === "User") {
                tabData.push(
                  <td>
                    {" "}
                    <div
                      name="User"
                      className="textBxBrdrRd   validateErr"
                      onChange={(e) => {
                        onChangeRowEdit(e);
                        console.log(e);
                      }}
                    >
                      <div className="AutoComplete">
                        <AutoComplete
                          className="error"
                          userDetails={userDetails}
                          value={setState}
                          setState={setState}
                          setSelectUser={setSelectUser}
                        />
                      </div>
                    </div>
                  </td>
                );
              } else if (inEle === "FromDate") {
                tabData.push(
                  <td id={inEle} name="FromDate">
                    <DatePicker
                      input
                      id={inEle}
                      selected={moment(date[0].planned_start_dt)._d}
                      // onChange={(e) => {
                      //   onChangeRowEdit(e);
                      //   console.log(e)

                      // }}
                      onChange={(e) => {
                        setState((prev) => ({
                          ...prev,
                          ["FromDate"]: moment(e).format("yyyy-MM-DD"),
                        }));
                        console.log(e);
                      }}
                      className="textBxBrdrRd   validateErr"
                      type="text"
                    />
                  </td>
                );
              } else if (inEle === "ToDate") {
                tabData.push(
                  <td id={inEle} name="ToDate">
                    <DatePicker
                      input
                      id={inEle}
                      selected={moment(date[0].planned_end_dt)._d}
                      // onChange={(e) => {
                      //   onChangeRowEdit(e);
                      //   console.log(e)

                      // }}'
                      onChange={(e) => {
                        setState((prev) => ({
                          ...prev,
                          ["ToDate"]: moment(e).format("yyyy-MM-DD"),
                        }));
                        console.log(e);
                      }}
                      className="textBxBrdrRd   validateErr"
                      type="text"
                    />
                  </td>
                );
              } else if (inEle === "AssignmentType") {
                tabData.push(
                  <td id={inEle} name="AssignmentType">
                    <input
                      id={inEle}
                      defaultValue={
                        element[inEle] == true ? "Manual" : "System"
                      }
                      disabled={editedValue !== -1 ? true : false}
                      type="text"
                      className="textBxBrdrRd  validateErr"
                      onChange={(e) => {
                        onChangeRowEdit(e);
                        console.log(e);
                      }}
                    />
                  </td>
                );
              } else if (inEle === "IsActive") {
                tabData.push(
                  <td id={inEle} name="IsActive">
                    <input
                      id={inEle}
                      defaultValue={element[inEle] == true ? "Yes" : "No"}
                      disabled={editedValue !== -1 ? true : false}
                      type="text"
                      className="textBxBrdrRd  validateErr"
                      onChange={(e) => {
                        onChangeRowEdit(e);
                        console.log(e);
                      }}
                    />
                  </td>
                );
              } else if (inEle == "date_created") {
                tabData.push(
                  <td>
                    {element[inEle] == ""
                      ? null
                      : moment(element[inEle]).format("DD-MMM-yyyy")}
                  </td>
                );
              } else {
                tabData.push(
                  <td id={inEle} name={inEle}>
                    <input
                      id={inEle}
                      defaultValue={element[inEle]}
                      type="text"
                      className="textBxBrdrRd  validateErr"
                      disabled={editedValue !== -1 ? true : false}
                      onChange={(e) => {
                        onChangeRowEdit(e);
                        console.log(e);
                      }}
                    />
                  </td>
                );
              }
            });
          } else {
            tabHeaders.forEach((inEle, inInd) => {
              if (inEle == "Action") {
                tabData.push(
                  <td>
                    <div>
                      {editOption.length > 0 &&
                      respData[index].AssignmentType === false ? (
                        <AiFillEdit
                          title={"Edit"}
                          className="pointerCursor"
                          onClick={(e) => {
                            editHandler(element, index);
                            console.log(e);
                          }}
                        />
                      ) : (
                        <AiFillEdit
                          title={"Edit"}
                          className="pointerCursor disableField"
                        />
                      )}
                    </div>
                  </td>
                );
              } else if (inEle == "AssignmentType") {
                tabData.push(
                  <td>{element[inEle] == true ? "Manual" : "System"}</td>
                );
              } else if (inEle == "IsActive") {
                tabData.push(<td>{element[inEle] == true ? "Yes" : "No"}</td>);
              } else if (inEle == "date_created") {
                tabData.push(
                  <td>
                    {element[inEle] == ""
                      ? null
                      : moment(element[inEle]).format("DD-MMM-yyyy")}
                  </td>
                );
              } else {
                tabData.push(
                  <td>
                    <div>{element[inEle]}</div>
                  </td>
                );
              }
            });
          }
          return <tr key={index}>{tabData}</tr>;
        })
      );
    });
  };

  return (
    <div>
      <div className="col-md-12">
        {addmsg ? (
          <div className="statusMsg success">
            <span className="errMsg">
              <BiCheck size="1.4em" strokeWidth={{ width: "100px" }} /> &nbsp;
              Saved successfully
            </span>
          </div>
        ) : (
          ""
        )}
        {editmsg ? (
          <div className="statusMsg success">
            <span className="errMsg">
              <BiCheck size="1.4em" strokeWidth={{ width: "100px" }} /> &nbsp;
              Update successfully
            </span>
          </div>
        ) : (
          ""
        )}
        <div className="pageTitle">
          <div className="childOne">
            <h2>IA Support(IA Support)</h2>
          </div>
          <div className="childTwo">
            <h2>Stakeholders</h2>
          </div>
          <div className="childThree"></div>
        </div>
      </div>
      <div className="customCard">
        {validationMsg ? (
          <div className="col-md-12 errMsg">
            <BiError />
            {"Please Provide Mandatory Fields"}
          </div>
        ) : (
          ""
        )}
        <div className="col-md-12"></div>
        <div className="table">
          <table className="table table-bordered table-striped">
            <tbody>
              <tr>
                <th className="pointerCursor" onClick={() => sorting("Role")}>
                  Role
                </th>
                <th className="pointerCursor" onClick={() => sorting("User")}>
                  User
                </th>
                <th
                  className="pointerCursor"
                  onClick={() => sorting("FromDate")}
                >
                  FromDate
                </th>
                <th className="pointerCursor" onClick={() => sorting("ToDate")}>
                  ToDate
                </th>
                <th
                  className="pointerCursor"
                  onClick={() => sortnum("AssignmentType")}
                >
                  Assignment Type
                </th>
                <th
                  className="pointerCursor"
                  onClick={() => sorting("assignedBy")}
                >
                  Assigned By
                </th>
                <th
                  className="pointerCursor"
                  onClick={() => sorting("date_created")}
                >
                  Assigned Date
                </th>
                <th
                  className="pointerCursor"
                  onClick={() => sortnum("IsActive")}
                >
                  IsActive
                </th>
                <th className="pointerCursor" onClick={() => sorting("action")}>
                  Action
                </th>
              </tr>
              {displayTable}{" "}
            </tbody>
          </table>
          <div className="form-group row">
            <div className="col-4">
              <td>
                <tr>
                  <button>
                    <AiOutlinePlusSquare
                      title={"Add"}
                      size={"1.4em"}
                      onClick={(e) => {
                        addRowEditFnc();
                      }}
                    />
                  </button>
                  &nbsp;
                  <button>
                    <AiFillSave
                      title={"Save"}
                      size={"1.4em"}
                      className="pointerCursor"
                      onClick={(e) => {
                        validateValues();
                        console.log(e);
                      }}
                    />
                  </button>
                  &nbsp;
                  <button>
                    <AiFillCloseCircle
                      title={"Cancel"}
                      size={"1.4em"}
                      className="pointerCursor"
                      onClick={(e) => {
                        closeEditedRowFnc();
                        console.log(e);
                      }}
                    />
                  </button>
                </tr>
              </td>
            </div>
            <div className="col-4 pagination justify-content-center">
              <label>
                <ReactPaginate
                  previousLabel={"Previous"}
                  nextLabel={"Next"}
                  pageCount={pageCount}
                  pageRangeDisplayed={5}
                  onPageChange={handlePageClick}
                  containerClassName={"pagination"}
                  pageClassName={"page-item"}
                  pageLinkClassName={"pagination__link"}
                  previousClassName={"pagination__link"}
                  previousLinkClassName={"pagination__link"}
                  disabledClassName={"pagination__link--disabled"}
                  nextClassName={"pagination__link-item"}
                  nextLinkClassName={"papagination__link"}
                  breakClassName={"pagination__link"}
                  breakLinkClassName={"pagination__link"}
                  activeClassName={"pagination__link--active"}
                  renderOnZeroPageCount={null}
                />
              </label>
            </div>
            <div className="col-4">
              <label>
                showing {Firstrow} to {finalRow} of {totalRows} entries
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProjectStakeHolders;
