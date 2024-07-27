import React, { useEffect, useState } from "react";

import { CModal, CModalBody, CModalHeader, CModalTitle } from "@coreui/react";

import moment from "moment";

function AddExpensePopup(props) {
  const {
    expenseTypePopupState,
    setExpenseTypePopupState,
    expenseTypeOptions,
    setExpenseTypesValues,
    setSelectedExpenseTypes,
    selectedExpenseTypes,
    setIconState,
    selectAll,
    setSelectAll,
    isValuesChecked,
    setIsValuesChecked,
  } = props;

  const projectData = {
    "Project Name": expenseTypeOptions?.projectDetails?.projectName,
    "Project Manager": expenseTypeOptions?.primaryManager?.name,
    "Start Date":
      expenseTypeOptions?.projectDetails?.actualStartDate !== null
        ? moment(expenseTypeOptions?.projectDetails?.actualStartDate).format(
            "DD-MMM-YYYY"
          )
        : "-",
    "End Date":
      expenseTypeOptions?.projectDetails?.actualEndDate !== null
        ? moment(expenseTypeOptions?.projectDetails?.actualEndDate).format(
            "DD-MMM-YYYY"
          )
        : "-",
  };

  useEffect(() => {
    selectAllExpenseTypeHandler(selectAll);
  }, [selectAll]);

  const selectAllExpenseTypeHandler = (value) => {
    const updatedIsValuesChecked = [];
    Object.keys(isValuesChecked).forEach((element) => {
      updatedIsValuesChecked[element] = value;
    });
    setIsValuesChecked(updatedIsValuesChecked);
  };

  useEffect(() => {
    const idList = selectedExpenseTypes.map((it) => it.id);
    const updatedCheckedList = isValuesChecked;
    idList.forEach((i) => {
      updatedCheckedList[i] = true;
    });
    setIsValuesChecked(updatedCheckedList);
  }, []);

  const onAddHandler = () => {
    setIconState("down");
    let checkValuesArr = Object.values(isValuesChecked);

    if (checkValuesArr.includes(true)) {
      let selectedExpenseype = [];

      Object.keys(isValuesChecked).forEach((ele) => {
        if (isValuesChecked[ele]) {
          selectedExpenseype.push(ele);
        }
      });

      setExpenseTypesValues(selectedExpenseype);

      let selectedExpenseTypesObjs = JSON.parse(
        JSON.stringify(expenseTypeOptions.expenses)
      ).filter((ele) => selectedExpenseype.includes("" + ele.id));

      let newSelectedExpenseTypes = selectedExpenseTypes.concat(
        selectedExpenseTypesObjs.filter(
          (newExpenseType) =>
            !selectedExpenseTypes.some(
              (existingExpenseType) =>
                existingExpenseType.id === newExpenseType.id
            )
        )
      );

      setSelectedExpenseTypes(newSelectedExpenseTypes);
    }
    setExpenseTypePopupState(false);
  };

  return (
    <div>
      <div className="col-md-12">
        <CModal
          visible={expenseTypePopupState}
          size="lg"
          onClose={() => setExpenseTypePopupState(false)}
          backdrop={"static"}
        >
          <CModalHeader className="">
            <CModalTitle>
              <span className="">Expense Types</span>
            </CModalTitle>
          </CModalHeader>
          <CModalBody>
            <div lassName="col-md-12">
              {expenseTypeOptions.hasOwnProperty("projectDetails") && (
                <div
                  className="expTypeDiv"
                  style={{
                    backgroundColor: "#eeeeee",
                    padding: "3px",
                    border: "1px solid #ddd",
                  }}
                >
                  {Object.keys(projectData).map((d, index) => {
                    return (
                      <div className="col-md-12 row" key={index}>
                        <label className="col-md-4">{d}</label>
                        <span className="col-md-1">:</span>
                        <span
                          className="col-md-6 ellipsis"
                          title={projectData[d]}
                        >
                          {projectData[d]}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="my-3">
              <div
                className="col-12"
                style={{
                  backgroundColor: "#ebebeb",
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "5px",
                  padding: "4px 8px",
                }}
              >
                <input
                  type="checkbox"
                  checked={selectAll}
                  onChange={(e) => {
                    setSelectAll((prevSelectAll) => !prevSelectAll);
                  }}
                />
                <strong>&nbsp;{"  " + "Select All"}</strong>
              </div>
              <div className="col-12">
                <div className="row">
                  {expenseTypeOptions?.expenses?.map((d, index) => {
                    return (
                      <div className="col-md-4">
                        <div key={index}>
                          <input
                            id={d.id}
                            type="checkbox"
                            defaultChecked={selectedExpenseTypes.some(
                              (i) => i.id == d.id
                            )}
                            checked={isValuesChecked[d.id]}
                            onChange={(e) => {
                              setIsValuesChecked((prev) => ({
                                ...prev,
                                [d.id]: e.target.checked,
                              }));
                            }}
                          />
                          <span>{"  " + d.lkup_name}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
            <div className=" form-group col-md-12 col-sm-12 col-xs-1 btn-container center my-2">
              <button
                className="btn btn-primary"
                type="Add"
                onClick={() => {
                  onAddHandler();
                }}
              >
                {" "}
                Add
              </button>
            </div>
          </CModalBody>
        </CModal>
      </div>
    </div>
  );
}

export default AddExpensePopup;
