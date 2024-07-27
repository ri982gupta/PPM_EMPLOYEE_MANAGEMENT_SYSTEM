import React, { useEffect, useRef, useState } from "react";
import { AiOutlinePlusCircle } from "react-icons/ai";
import { AiFillEdit } from "react-icons/ai";
import { AiFillDelete } from "react-icons/ai";
import { AiFillSave } from "react-icons/ai";
import { AiFillCloseCircle } from "react-icons/ai";
import { BiError } from "react-icons/bi";
import axios from "axios";
import { environment } from "../../environments/environment";
import { IconButton } from "@mui/material";
import RoleCostGridDelete from "./RoleCostGridDelete";

function AddRoleGrid(props) {
  const {
    addRoleGridData,
    countries,
    practices,
    cadres,
    roleGridCostData,
    getCostRoleGrid,
    addRoleGrid,
    setAddRoleGrid,
    setLoaderState,
  } = props;

  const [displayTable, setDisplayTable] = useState(null);
  const [displayRowEdit, setDisplayRowEdit] = useState(false);

  const initialValue = {};
  const [validationMsg, setValidationMsg] = useState(null);
  const [succesMsg, setSuccesMsg] = useState(false);

  const editableRow = useRef(null);

  const [editedValue, setEditedValue] = useState(-1);
  const [roleGridDeleteState, setRoleGridDeleteState] = useState(false);
  const [deleteGridValue, setDeleteGridValue] = useState(-1);
  const [deleteStatus, setDeleteStatus] = useState(false);
  const salaryDiffRef = useRef(null);

  const baseUrl = environment.baseUrl;

  let headers = [
    "Practice",
    "Cadre",
    "Country",
    "Min. Exp.",
    "Max. Exp",
    "Min. Salary",
    "Max. Salary",
    "Difference Max-Min(L)",
    "GM%",
    "Revenue Influence",
    "Action",
  ];

  let tabHeaders = [
    "group_name",
    "cadre",
    "country_name",
    "min_experience",
    "max_experience",
    "min_salary",
    "max_salary",
    "salary_diff",
    "gm_perc",
    "revenue_influence",
    "total_count",
    "below_min_sal",
    "above_max_salary",
    "less_than_median",
    "greater_than_median",
    "equal_to_median",
    "action",
  ];

  let nonEditableRows = [
    "total_count",
    "below_min_sal",
    "above_max_salary",
    "less_than_median",
    "greater_than_median",
    "equal_to_median",
  ];

  useEffect(() => {
    displayTableFnc();
  }, []);

  const saveCostRoleGrid = () => {
    setLoaderState(true);

    if (editedValue !== -1) {
      initialValue["country_name"] = initialValue.country_id;
      initialValue["group_name"] = initialValue.practice_id;
    }

    axios({
      method: "POST",
      url: baseUrl + `/CostMS/cost/saveRoleGridCost`,
      data: initialValue,
    }).then((resp) => {
      if (resp.data.status) {
        setAddRoleGrid(false);
        Object.keys(initialValue).forEach((key) => {
          delete initialValue[key];
        });
        setLoaderState(false);
        setSuccesMsg(true);
        setTimeout(() => {
          setSuccesMsg(false);
        }, 5000);
        getCostRoleGrid();
        setDisplayRowEdit(false);
        displayTableFnc();
      }
    });
  };

  const onChangeRowEdit = (e) => {
    const { id, value } = e.target;
    initialValue[id] = value;

    if (
      initialValue.min_salary !== undefined &&
      initialValue.max_salary !== undefined
    ) {
      initialValue["salary_diff"] =
        initialValue.max_salary - initialValue.min_salary;
      salaryDiffRef.current.value = initialValue["salary_diff"];
    }
  };

  const onKeyPress = (e) => {
    var code = e.which ? e.which : e.keyCode;
    if (code == 8 || code == 46 || code == 37 || code == 39) {
      return e.key;
    } else if (code < 48 || code > 57) {
      return e.preventDefault();
    } else return e.key;
  };

  const displayTableFnc = () => {
    setDisplayTable(() => {
      let data = roleGridCostData;
      let fData = [];
      if (displayRowEdit) {
        fData = [{ ...tabHeaders }, ...data];
      } else {
        fData = roleGridCostData;
      }

      return fData.length === 0 ? (
        <tr>
          <td colSpan={17} align="center">
            No Records Found
          </td>
        </tr>
      ) : (
        fData.map((element, index) => {
          let tabData = [];
          if (
            (displayRowEdit && index === 0) ||
            (editedValue !== -1 && editedValue === index)
          ) {
            if (editedValue !== -1) {
              Object.assign(initialValue, element);
            }
            tabHeaders.forEach((inEle, inInd) => {
              if (inEle === "action") {
                tabData.push(
                  <td>
                    <AiFillSave
                      title={"Save"}
                      className="pointerCursor"
                      onClick={(e) => {
                        validateValues();
                      }}
                    />
                    <AiFillCloseCircle
                      title={"Cancel"}
                      className="pointerCursor"
                      onClick={(e) => {
                        closeEditedRowFnc();
                      }}
                    />
                  </td>
                );
              } else if (inEle === "group_name") {
                tabData.push(
                  <td>
                    <select
                      id={inEle}
                      className="textBxBrdrRd inputCss editableSelectHeight validateErr"
                      defaultValue={element["practice_id"]}
                      disabled={editedValue !== -1 ? true : false}
                      onChange={(e) => {
                        onChangeRowEdit(e);
                      }}
                    >
                      <option key="">{"<<Please Select>>"}</option>
                      {practices.map((data) => (
                        <option key={data.id} value={data.id}>
                          {data.groupName}
                        </option>
                      ))}
                    </select>
                  </td>
                );
              } else if (inEle === "cadre") {
                tabData.push(
                  <td>
                    <select
                      id={inEle}
                      className="textBxBrdrRd inputCss editableSelectHeight validateErr"
                      defaultValue={element[inEle]}
                      disabled={editedValue !== -1 ? true : false}
                      onChange={(e) => {
                        onChangeRowEdit(e);
                      }}
                    >
                      <option key="">{"<<Please Select>>"}</option>
                      {cadres.map((data) => (
                        <option key={data.id} value={data.cadre_code}>
                          {data.cadre_code}
                        </option>
                      ))}
                    </select>
                  </td>
                );
              } else if (inEle === "country_name") {
                tabData.push(
                  <td>
                    <select
                      id={inEle}
                      className="textBxBrdrRd inputCss editableSelectHeight validateErr"
                      defaultValue={element["country_id"]}
                      disabled={editedValue !== -1 ? true : false}
                      onChange={(e) => {
                        onChangeRowEdit(e);
                      }}
                    >
                      <option key="">{"<<Please Select>>"}</option>
                      {countries.map((data) => (
                        <option key={data.id} value={data.id}>
                          {data.country_name}
                        </option>
                      ))}
                    </select>
                  </td>
                );
              } else if (inEle === "salary_diff") {
                tabData.push(
                  <td id={inEle}>
                    <input
                      id={inEle}
                      ref={salaryDiffRef}
                      disabled="disabled"
                      defaultValue={0}
                      onKeyPress={(e) => {
                        return onKeyPress(e);
                      }}
                      type="text"
                      className="textBxBrdrRd inputCss validateErr disabledIcon"
                      onChange={(e) => {
                        onChangeRowEdit(e);
                      }}
                    />
                  </td>
                );
              } else if (nonEditableRows.includes(inEle) == false) {
                tabData.push(
                  <td id={inEle}>
                    <input
                      id={inEle}
                      defaultValue={element[inEle]}
                      onKeyPress={(e) => {
                        return onKeyPress(e);
                      }}
                      type="text"
                      className="textBxBrdrRd inputCss validateErr"
                      onChange={(e) => {
                        onChangeRowEdit(e);
                      }}
                    />
                  </td>
                );
              } else {
                tabData.push(<td id={inEle}>{element[inEle]}</td>);
              }
            });
          } else {
            tabHeaders.forEach((inEle, inInd) => {
              if (inEle == "action") {
                tabData.push(
                  <td>
                    <div align="center">
                      <span>
                        <AiFillEdit
                          title={"Edit"}
                          className="pointerCursor"
                          onClick={(e) => {
                            editHandler(element, index);
                          }}
                        />
                      </span>
                      <span>
                        <AiFillDelete
                          title={"Delete"}
                          className="pointerCursor"
                          onClick={(e) => {
                            roleGridCostDeleteHandler(element);
                          }}
                        />
                      </span>
                    </div>
                  </td>
                );
              } else {
                tabData.push(
                  <td align={inInd > 2 ? "right" : "left"}>{element[inEle]}</td>
                );
              }
            });
          }
          return <tr key={index}>{tabData}</tr>;
        })
      );
    });
  };

  const roleGridCostDeleteHandler = (element) => {
    setRoleGridDeleteState(true);
    setDeleteGridValue(element.id);
  };

  const gridCostDeleter = () => {
    const url =
      baseUrl + `/CostMS/cost/deleteRoleCostGrid?id=${deleteGridValue}`;

    axios
      .delete(url)
      .then((res) => {
        let resp = res.data;
        resp.status && setRoleGridDeleteState(false);
        setDeleteStatus(true);
        getCostRoleGrid();
        setDisplayTable(null);
        displayTableFnc();
        setTimeout(() => {
          setDeleteStatus(false);
        }, 2000);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const editHandler = (element, index) => {
    setEditedValue(index);
  };

  useEffect(() => {
    displayTableFnc();
  }, [editedValue]);

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

    saveCostRoleGrid();
  };

  useEffect(() => {
    displayTableFnc();
  }, [displayRowEdit]);

  const addRowEditFnc = () => {
    setDisplayRowEdit((prev) => (prev ? prev : !prev));
  };

  const closeEditedRowFnc = () => {
    setDisplayRowEdit((prev) => false);
    setValidationMsg(false);
    setEditedValue(-1);
    // initialValue = {};
    for (const prop of Object.getOwnPropertyNames(initialValue)) {
      delete initialValue[prop];
    }
  };

  return (
    <div>
      {validationMsg ? (
        <div className="col-md-12 statusMsg error">
          <BiError />
          {"Please Provide Mandatory Fields"}
        </div>
      ) : (
        ""
      )}
      {deleteStatus ? (
        <div className="successMsg">{"Deleted Grid Cost Successfully"}</div>
      ) : (
        ""
      )}
      <table
        className="table table-bordered table-striped"
        style={{ width: "100%" }}
      >
        <tbody>
          <tr>
            <th>Practice</th>
            <th>Cadre</th>
            <th>Country</th>
            <th>Min. Exp.</th>
            <th>Max. Exp</th>
            <th>Min. Salary</th>
            <th>Max. Salary</th>
            <th>Difference Max-Min(L)</th>
            <th>GM%</th>
            <th>Revenue Influence</th>
            <th>Total Count</th>
            <th>Below Min</th>
            <th>Above Max</th>
            <th>{"< Median"}</th>
            <th>{"> Median"}</th>
            <th>{" Median"}</th>
            <th>Action</th>
          </tr>
          {displayTable}
        </tbody>
      </table>
      <button
        className="btn btn-primary"
        title={"Add"}
        onClick={(e) => {
          addRowEditFnc();
        }}
      >
        <AiOutlinePlusCircle style={{ marginRight: "3px" }} />
        Add
      </button>

      {roleGridDeleteState ? (
        <>
          <RoleCostGridDelete
            roleGridDeleteState={roleGridDeleteState}
            setRoleGridDeleteState={setRoleGridDeleteState}
            gridCostDeleter={gridCostDeleter}
          />
        </>
      ) : (
        ""
      )}
    </div>
  );
}

export default AddRoleGrid;
