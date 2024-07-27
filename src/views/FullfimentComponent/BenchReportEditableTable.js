import React, { useEffect, useRef } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "ag-grid-community";
import { Button } from "@mui/material";
import { useState } from "react";
import axios from "axios";
import DatePicker from "react-datepicker";
import { Calendar } from "primereact/calendar";
import moment from "moment";
import { options } from "preact";
import { InputText } from "primereact/inputtext";
import { environment } from "../../environments/environment";
import { FaPlus, FaSave } from "react-icons/fa";
import { ImCancelCircle, ImCross } from "react-icons/im";
import { AiFillDelete, AiOutlinePlusSquare } from "react-icons/ai";
import { MdOutlineAdd } from "react-icons/md";
import { TfiSave } from "react-icons/tfi";
import { CheckBox } from "@mui/icons-material";
import { CModal, CModalBody, CModalHeader, CModalTitle } from "@coreui/react";
import GlobalValidation from "../ValidationComponent/GlobalValidation";

function BenchReportEditableTable(props) {
  const baseUrl = environment.baseUrl;
  const {
    resid,
    resourcedata,
    setResourcedata,
    setValidationMessage,
    validationmessage,
    setSaveActionMessage,
    setDeleteMessage,
    handleClick1,
    employeeid,
    setAddmsg,
    setLoader,
  } = props;
  const [categorytype, setcategoryType] = useState([]);
  const [buttonDisabled, setButtonDisabled] = useState(true);

  const [effectivedate, setEffectiveDate] = useState();
  const [entrydate, setEntryDate] = useState(new Date());
  let entrydate1 = moment(entrydate).format("YYYY-MM-DD");
  const loggedUserId = localStorage.getItem("resId");
  const loggedUserName = localStorage.getItem("resName");
  const [clicked, setClicked] = useState(false);
  const [saveCliked, setSaveClicked] = useState(true);
  const [cancelClicked, setCancelClicked] = useState(true);
  const [deletePopup, setDeletePopup] = useState(false);
  const [checkboxenable, setCheckboxEnable] = useState(false);
  const [deleteid, setDeleteId] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [editeddata, setEditedData] = useState({});
  const [check, setCheck] = useState(false);
  const today = new Date();
  const lastFriday = new Date(
    today.getTime() - ((today.getDay() + 2) % 7) * 24 * 60 * 60 * 1000
  );
  const previousFriday = new Date(
    lastFriday.getTime() - 7 * 24 * 60 * 60 * 1000
  );
  let minDate = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);

  for (let i = 1; i < 7; i++) {
    const date = new Date(today.getTime() - i * 24 * 60 * 60 * 1000);
    if (date < minDate) {
      minDate = date;
    }
  }
  const initialValues = {
    created_dt: "",
    entryby: "",
    completed_dt: "",
    effective_dt: "",
    comments: "",
    lkup_name: "",
  };
  const [formData, setFormData] = useState(initialValues);
  useEffect(() => {}, [formData]);
  const getcategorytype = () => {
    setLoader(true);
    axios
      .get(baseUrl + `/fullfilmentms/resourceoverview/actiontypesbillable`)
      .then((Response) => {
        let type = [];
        let data = Response.data;
        data.length > 0 &&
          data.forEach((e) => {
            let TypeObj = {
              label: e.lkup_name,
              value: e.id,
            };
            type.push(TypeObj);
          });
        setcategoryType(data);
        setLoader(false);
      })
      .catch((error) => console.log(error));
  };
  useEffect(() => {
    getcategorytype();
  }, []);
  const removeFirstRowIfEmpty = (prod) => {
    Object.keys(prod).forEach((d) => {
      if (["", null, undefined, " "].includes(prod[d])) {
        setResourcedata(resourcedata.slice(1));
        setClicked((prev) => !prev);
        return;
      }
    });
  };
  let sideArrow = document.getElementsByClassName(
    "p-paginator-next p-paginator-element p-link"
  );
  let sideDoubleArrow = document.getElementsByClassName(
    "p-paginator-last p-paginator-element p-link"
  );
  const componentRef = useRef(null);

  useEffect(() => {
    let prod = resourcedata[0];
    sideArrow[0]?.addEventListener("click", function () {
      removeFirstRowIfEmpty(prod);
    });

    sideDoubleArrow[0]?.addEventListener("click", function () {
      removeFirstRowIfEmpty(prod);
    });
    if (resourcedata[0]?.comments == "") {
      const icon = document.getElementsByClassName(
        "p-row-editor-init p-link"
      )[0];
      icon.setAttribute("title", "Edit selected row");
      icon.click();
      setTimeout(() => {
        const saveIcon = document.getElementsByClassName(
          "p-row-editor-save p-link"
        )[0];
        saveIcon.setAttribute("title", "Save row");
        const cancelIcon = document.getElementsByClassName(
          "p-row-editor-cancel p-link"
        )[0];
        cancelIcon.setAttribute("title", "Cancel row editing");
        cancelIcon?.addEventListener(
          "click",
          function (e) {
            if (resourcedata[0]?.comments == "") {
              setResourcedata(resourcedata.slice(1, resourcedata.length));
              setButtonDisabled(true);
              setClicked(false);
              setValidationMessage(false);
              componentRef.current.forceUpdate();
            }
          },
          true
        );
      }, 200);
    }
  }, [resourcedata]);

  const Reset = () => {
    setValidationMessage(false);

    document.getElementsByClassName("p-row-editor-cancel p-link")[0]?.click();
    setClicked(false);
    setCancelClicked(true);
    setSaveClicked(true);
  };
  const Save = () => {
    document
      .getElementsByClassName("p-row-editor-save-icon pi pi-fw pi-check")[0]
      ?.click();
    EditedData();
    setCancelClicked(true);
    setSaveClicked(true);
    setClicked(false);
    if (check == true) {
      EditedData(editeddata);
    }
  };

  const CategoryBodyTemplate = (rowData) => {
    return (
      <>
        <select
          id="lkup_name"
          className="cancel"
          name="lkup_name"
          onChange={(e) => {
            rowData.editorCallback(e.target.value);
            categorytype.map((a) => {
              if (a.id == e.target.value) {
                rowData["rowData"]["lkup_name"] = a.lkup_name;
                rowData["rowData"]["type_id"] = e.target.value;
              }
            });
          }}
        >
          {categorytype?.map((Item, index) => (
            <option
              key={index}
              value={Item.id}
              selected={Item.id == rowData.rowData.type_id ? true : false}
            >
              {Item.lkup_name}
            </option>
          ))}
        </select>
      </>
    );
  };
  const onRowEditComplete = (e) => {
    let _resourcedata = [...resourcedata]; // Make a copy of the current state variable
    let { newData, index } = e;
    _resourcedata[index] = newData;
    setResourcedata(_resourcedata);
    postData(e.newData);
    setClicked(true);
  };

  const postData = (rowData, e) => {
    // console.log("inline179-----------------------");
    // let adddata = document.getElementsByClassName("error");
    // for (let i = 0; i < adddata.length; i++) {
    //   if (
    //     rowData.comments == "" ||
    //     rowData.comments == null ||
    //     rowData.effective_dt == "" ||
    //     adddata[i].value === "" ||
    //     adddata[i].value === "null" ||
    //     adddata[i].value === "All" ||
    //     adddata[i].value === undefined
    //   ) {
    //  var today=new Date()
    // const lastFriday = new Date(today.getTime() - (today.getDay() + 2) % 7 * 24 * 60 * 60 * 1000);
    // console.log(lastFriday,today)

    // const today = new Date();
    //   } else {
    //     adddata[i].classList.remove("error-block");
    //     // classList.remove("error-block")
    //     console.log("inline199-----------------------");
    //   }
    // }

    if (
      rowData.comments == "" ||
      rowData.effective_dt == "Invalid date" ||
      rowData.effective_dt == ""
    ) {
      console.log("inline208-----------------------");

      setValidationMessage(true);
    } else {
      console.log(rowData.comments == "" + "inline-210-----------------------");

      axios({
        method: "post",
        url: baseUrl + `/fullfilmentms/resourceoverview/UpdateActiontableitems`,
        data: {
          id: null,
          created_dt: rowData.created_dt,
          created_by: parseInt(loggedUserId),
          resource_id: resid,
          typ_category_id: parseInt(
            rowData.type_id == null ? 831 : rowData.type_id
          ),
          effective_dt: moment(rowData.effective_dt).format("YYYY-MM-DD"),
          completed_dt: null,
          comments: rowData.comments,
        },
      })
        .then((response) => {
          setSaveActionMessage(true);
          setTimeout(() => {
            setSaveActionMessage(false);
          }, 3000);
          setAddmsg(true);
          setTimeout(() => {
            setAddmsg(false);
          }, 3000);
          setTimeout(() => {
            setLoader(false);
          }, 1000);

          handleClick1(employeeid);
          setCancelClicked(true);
          setSaveClicked(true);
          setButtonDisabled(true);
          setClicked(false);
          setValidationMessage(false);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };
  const EditedData = (rowData) => {
    if (
      rowData.comments == "" ||
      rowData.effective_dt == "Invalid date" ||
      rowData.effective_dt == ""
    ) {
      console.log("inline208-----------------------");

      setValidationMessage(true);
    } else {
      axios({
        method: "post",
        url: baseUrl + `/fullfilmentms/resourceoverview/UpdateActiontableitems`,
        data: {
          id: rowData?.id,
          created_dt: moment(rowData?.created_dt).format("DD-MMM-YYYY"),
          created_by: parseInt(loggedUserId),
          resource_id: resid,
          typ_category_id:
            parseInt(rowData?.lkup_id) == null
              ? 831
              : parseInt(rowData?.lkup_id),
          effective_dt: moment(rowData?.effective_dt).format("DD-MMM-YYYY"),
          completed_dt: entrydate1,
          comments: rowData?.comments,
        },
      })
        .then((res) => {
          handleClick1(employeeid);
          setValidationMessage(false);
          setCancelClicked(false);
        })
        .catch((error) => console.log(error));
    }
  };
  const addHandler = () => {
    let daa = document.getElementsByClassName(
      "p-paginator-first p-paginator-element p-link"
    )[0];

    daa.click();

    if (!clicked) {
      setClicked(true);
      setButtonDisabled(false);
    }
    const data = {
      completed_dt: "",
      created_dt: moment(new Date()).format("DD-MMM-YYYY"),
      // created_dt: "",
      entryby: loggedUserName,
      effective_dt: "",
      lkup_name: "",
      comments: "",
    };
    let dt = [];
    dt.push(data);
    setResourcedata([...dt, ...resourcedata]);
    setClicked(true);
    setCancelClicked(false);
    setSaveClicked(false);
  };

  const setDatePicker = (resourcedata, options, rowData) => {
    return (
      // <div title={resourcedata.effective_dt}>
      <DatePicker
        className={`error ${
          validationmessage && !resourcedata.rowData.effective_dt
            ? "error-block"
            : ""
        }`}
        name="effective_dt"
        selected={effectivedate}
        id="effective_dt"
        value={resourcedata.effective_dt}
        minDate={minDate}
        showMonthDropdown
        showYearDropdown
        dropdownMode="select"
        dateFormat="dd-MMM-yyyy"
        onChange={(e) => {
          resourcedata.editorCallback(moment(e).format("DD-MMM-yyyy")),
            setFormData((prev) => ({
              ...prev,
              ["effective_dt"]: moment(e).format("yyyy-MM-DD"),
            }));
          setEffectiveDate(e);
        }}
        onKeyDown={(e) => {
          e.preventDefault();
        }}
      />
      // </div>
    );
  };

  const commentstextfiled = (resourcedata) => {
    return (
      <>
        <div>
          <input
            className={`error ${
              validationmessage && !resourcedata.rowData.comments
                ? "error-block"
                : ""
            }`}
            type="text"
            id="comments"
            name="comments"
            value={resourcedata.comments}
            onChange={(e) => {
              resourcedata.editorCallback(e.target.value);
            }}
          />
        </div>
      </>
    );
  };

  const renderRowActions = (rowData) => {
    const cleanedEntryBy = rowData.entryby.split(/\s+/).join(" ");
    console.log(loggedUserName == cleanedEntryBy);
    return (
      <div>
        {loggedUserName == cleanedEntryBy &&
        rowData.completed_dt == "" &&
        rowData.effective_dt !== "" ? (
          <label cursor="pointer">
            <input
              type="checkbox"
              cursor="pointer"
              onClick={(e) => {
                const isChecked = e.target.checked;
                setCheck(isChecked);
                setSaveClicked(check ? true : false);
                setEditedData(rowData);
                setCancelClicked(check ? true : false);
                setClicked(check ? false : true);
              }}
              selection={rowData}
              onSelectionChange={(e) => rowData(e.value)}
            />{" "}
            &nbsp;
            <AiFillDelete
              color="orange"
              cursor="pointer"
              onClick={() => {
                setDeletePopup(true);
                setDeleteId(rowData.id);
              }}
            />
          </label>
        ) : (
          ""
        )}
      </div>
    );
  };

  const DeleteItems = () => {
    axios({
      method: "delete",
      url:
        baseUrl +
        `/fullfilmentms/resourceoverview/deleteActionDetails?id=${deleteid}`,
    }).then((error) => {
      setDeletePopup(false);
      setDeleteMessage(true);
      setTimeout(() => {
        setDeleteMessage(false);
      }, 3000);
      handleClick1(employeeid);
    });
  };

  function ResourceOverviewDeletePopup(props) {
    const { deletePopup, setDeletePopup } = props;
    return (
      <div>
        <CModal
          visible={deletePopup}
          size="xs"
          className="ui-dialog"
          onClose={() => setDeletePopup(false)}
        >
          <CModalHeader className="">
            <CModalTitle>
              <span className="">Delete Action Item</span>
            </CModalTitle>
          </CModalHeader>
          <CModalBody>
            <h6>Are you sure you want to delete Action Item ?</h6>
            <div className="btn-container center my-2">
              <button
                type="delete"
                className="btn btn-primary"
                onClick={() => {
                  DeleteItems();
                }}
              >
                <AiFillDelete /> Delete{" "}
              </button>{" "}
              &nbsp; &nbsp;
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => {
                  setDeletePopup(false);
                }}
              >
                {" "}
                <ImCross fontSize={"11px"} /> Cancel{" "}
              </button>
            </div>
          </CModalBody>
        </CModal>
      </div>
    );
  }
  return (
    <div className="p-fluid  mb-2 darkHeader">
      <DataTable
        className="primeReactDataTable eventsTable"
        value={resourcedata}
        editMode="row"
        showGridlines
        emptyMessage="No Records To View"
        scrollDirection="both"
        paginator
        rows={10}
        tableStyle={{ minWidth: "auto", width: "auto" }}
        onRowEditComplete={onRowEditComplete}
        paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
        currentPageReportTemplate="{first} to {last} of {totalRecords}"
        rowsPerPageOptions={[10, 25, 50]} //------------->
      >
        <Column
          field="created_dt"
          title="created_dt"
          header="Entry Date"
          sortable
          style={{ width: "30px" }}
          body={(rowData) => (
            <div style={{ textAlign: "center" }}>
              {moment(rowData.created_dt).format("DD-MMM-YYYY")}
            </div>
          )}
        />
        <Column field="entryby" header="Entry By" sortable />
        <Column
          field="lkup_name"
          header="Category"
          sortable
          filter={true}
          editor={(options) => CategoryBodyTemplate(options)}
        />
        <Column
          field="effective_dt"
          id="effective_dt"
          header="Effective Date"
          editor={(options) => setDatePicker(options)}
          sortable
          style={{ width: "10px" }}
          filter={true}
          body={(rowData) => (
            <div style={{ textAlign: "center" }}>
              {moment(rowData.effective_dt).format("DD-MMM-YYYY")}
            </div>
          )}
          filterMatchMode="custom"
          filterFunction={(value, filter) => {
            if (filter === null || filter === undefined) {
              return true;
            }
            if (filter.operator === "lte") {
              return new Date(value) <= new Date(filter.value);
            } else if (filter.operator === "gte") {
              return new Date(value) >= new Date(filter.value);
            } else if (value === "equals") {
              return (
                new Date(value).getTime() === new Date(filter.value).getTime()
              );
            } else {
              return true;
            }
          }}
          filterElement={
            <div className="p-field p-grid">
              <div className="p-col-12 p-md-10">
                <Calendar
                  id="event_date"
                  placeholder="Select a date"
                  showIcon={true}
                  inputClassName="p-ml-2"
                  selectionMode="range"
                  dateFormat="mm/dd/yy"
                  monthNavigator={true}
                  yearNavigator={true}
                  yearRange="2000:2030"
                  showButtonBar={true}
                  className="p-datepicker"
                />
              </div>
            </div>
          }
        />
        <Column
          field="completed_dt"
          header="Completed Date"
          sortable
          style={{ width: "30px" }}
          body={(rowData) => (
            <div style={{ textAlign: "center" }}>
              {rowData.completed_dt
                ? moment(rowData.completed_dt).format("DD-MMM-YYYY")
                : ""}
            </div>
          )}

          // Decrease the width here
        />
        <Column
          field="comments"
          sortable
          header="Comments"
          editor={(options) => commentstextfiled(options)}
          filter={true}
          style={{ width: "270px" }}
          body={(rowData) => (
            <span
              title={rowData.comments}
              style={{ textAlign: "left", display: "block" }}
              className="ellipsis"
            >
              {rowData.comments}
            </span>
          )}
          filterFunction={(value, filter) => {
            if (!filter) {
              return true;
            }
            const filterOptions = filter.split(" ");
            return filterOptions.every((option) => {
              if (option.startsWith && !value.startsWith(option.startsWith)) {
                return false;
              }
              if (option.endsWith && !value.endsWith(option.endsWith)) {
                return false;
              }
              if (option.contains && !value.includes(option.contains)) {
                return false;
              }
              return true;
            });
          }}
        />
        <Column
          style={{ display: "none", width: "10px" }}
          rowEditor
          header="Action"
          headerStyle={{ width: "10%", minWidth: "8rem" }}
          bodyStyle={{ textAlign: "center" }}
          sortable
        />
        <Column
          body={renderRowActions}
          header="Action"
          bodyStyle={{ textAlign: "center" }}
          sortable
        ></Column>
        {/* // )} */}
      </DataTable>
      <div className="form-group col-md-2 btn-container-events center my-3">
        <button
          className="btn btn-primary"
          disabled={clicked}
          onClick={() => {
            addHandler();
          }}
        >
          {" "}
          <FaPlus /> Add
        </button>{" "}
        <button
          className="btn btn-primary"
          disabled={buttonDisabled}
          variant="contained"
          onClick={() => {
            Save();
            setEffectiveDate();
          }}
        >
          <FaSave /> Save
        </button>{" "}
        <button
          className="btn btn-primary"
          disabled={buttonDisabled}
          onClick={() => {
            Reset();
          }}
          title={"Cancel"}
          size={"1.4em"}
        >
          <ImCross fontSize={"11px"} /> Cancel
        </button>
      </div>

      {deletePopup ? (
        <ResourceOverviewDeletePopup
          deletePopup={deletePopup}
          setDeletePopup={setDeletePopup}
        />
      ) : (
        ""
      )}
    </div>
  );
}
export default BenchReportEditableTable;
