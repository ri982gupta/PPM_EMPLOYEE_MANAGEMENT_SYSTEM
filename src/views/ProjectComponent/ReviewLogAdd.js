import React, { useEffect, useState, useRef } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import axios from "axios";
import { environment } from "../../environments/environment";
import moment from "moment";
import DatePicker from "react-datepicker";
import { TextField, makeStyles } from "@material-ui/core";
import { CModal } from "@coreui/react";
import { CModalBody } from "@coreui/react";
import { CModalHeader } from "@coreui/react";
import ReviewsAutocomplete from "./ReviewsAutocomplete";
import { CModalTitle } from "@coreui/react";
import { FaPlus, FaSave } from "react-icons/fa";
import { AiFillDelete, AiFillWarning } from "react-icons/ai";
import GlobalValidation from "../ValidationComponent/GlobalValidation";
import "./ProjectReviews.scss";

const now = new Date();

function ReviewLogAdd(props) {
  const useStyles = makeStyles({
    dialog: {
      position: "absolute",
      top: "250px",
      minHeight: "18%",
    },
    textField: {
      border: "1px solid rgb(159 13 13)",
    },
  });
  const classes = useStyles();
  const value = "UpdateBillingRate";
  const {
    open,
    setOpen,
    projectId,

    selectedCustomer,

    revDate,
    totaldata,
  } = props;

  const [products, setProducts] = useState([]);

  const [formData, setFormData] = useState([{}]);
  const [riskDetails, setRiskDetails] = useState([]);
  const loggedUserId = localStorage.getItem("resId");
  const [startDate, setStartDate] = useState([]);
  const baseUrl = environment.baseUrl;
  const [action, setAction] = useState("");
  const [commnets, setCommnets] = useState("");
  const [data, setData] = useState();
  const [selected, setSelected] = useState([]);
  const [selectedFile1, setSelectedFile1] = useState([]);
  const [filName, setFilName] = useState([]);
  const [valid, setValid] = useState(false);
  const [projecthistoryid, setprojecthistoryid] = useState("");
  const [validateproject, setValidateproject] = useState(false);
  const [reviewhistory, setreviewhistory] = useState([]);

  const loggedResourceId = Number(loggedUserId) + 1;
  const ref = useRef([]);

  const [rowData, setRowData] = useState([]); // State to store row data'

  const getCountData = () => {
    axios
      .get(baseUrl + `/ProjectMS/project/reviewHistory?projectId=${projectId}`)

      .then((res) => {
        const GetData = res.data;

        setData(GetData);
      })
      .catch((error) => {});
  };

  useEffect(() => {
    getCountData();
  }, []);

  const SubmitData = () => {
    let valid = GlobalValidation(ref);

    if (valid) {
      setValidateproject(true);
      setTimeout(() => {
        setValidateproject(false);
      }, 3000);
      return;
    }
    const dynamicActions = rowData.map((row) => ({
      action: row.action,
      date: moment(row.date).format("YYYY-MM-DD"),
      revComments: row.revComments,
      // ... Other properties ...
    }));
    const payload = {
      projectId: totaldata.id,
      revType: totaldata.reviewTypeId,
      statusId: +totaldata.revStatus,
      curRevHisId: totaldata.curRevHisId,
      curRevId: loggedResourceId,
      revDate: moment(totaldata.scheduledDate).format("YYYY-MM-DD"),
      reviewerId: selectedCustomer?.reviewerId,
      comments: commnets,
      loggedUser: loggedUserId,
      actions: dynamicActions,
      reviewerId: loggedResourceId,
    };

    axios
      .postForm(
        baseUrl + `/ProjectMS/project/saveReviews`,
        {
          files: selectedFile1,
          model: JSON.stringify(payload),
        },
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      )
      .then((res) => {
        const data = res.data;

        getCountData();
        // getReviewHistoryData();
        setOpen(false);
        setTaskStatus(data.action_status);
        setUpdateData(data);
        setValid(false);
        setSuccessfullymsg(true);

        setTimeout(() => {
          setSuccessfullymsg(false);
        }, 2000);
      })
      .catch((error) => {
        // Handle error
      });
  };

  useEffect(() => {
    if (products[0]?.event_name == "") {
      document.getElementsByClassName("p-row-editor-init p-link")[0].click();
      setTimeout(() => {
        document
          .getElementsByClassName("p-row-editor-cancel p-link")[0]
          ?.addEventListener(
            "click",
            function (e) {
              if (products[0]?.event_name == "") {
                setProducts(products.slice(1, products.length));
              }
            },
            true
          );
      }, 200);
      setAction;
    }
  }, [products]);

  const textEditorEventName = (products, rowIndex) => {
    return (
      <input
        type="text"
        id={`action-${rowIndex}`}
        className={`error${validateproject && !products?.action ? "" : ""}`}
        onChange={(e) => {
          const updatedRowData = [...rowData];
          updatedRowData[rowIndex.rowIndex] = {
            ...updatedRowData[rowIndex.rowIndex],
            action: e.target.value,
          };
          setRowData(updatedRowData);
          setAction(updatedRowData);
        }}
      />
    );
  };
  const textEditorComments = (products, rowIndex) => {
    return (
      <input
        type="text"
        id={`reviewComments-${rowIndex}`}
        onChange={(e) => {
          const updatedRowData = [...rowData];
          updatedRowData[rowIndex.rowIndex] = {
            ...updatedRowData[rowIndex.rowIndex],
            revComments: e.target.value,
          };
          setRowData(updatedRowData);
        }}
      />
    );
  };
  const textEditorDate = (options, rowIndex) => {
    const selectedDate = rowData[rowIndex.rowIndex]?.date;

    return (
      <div className="ReviewLogDatepicker">
        <DatePicker
          showYearDropdown
          showMonthDropdown
          dropdownMode="select"
          className={`error${validateproject && !selectedDate ? "" : ""}`}
          minDate={new Date()}
          dateFormat="dd-MMM-yyyy"
          selected={selectedDate ? new Date(selectedDate) : null}
          onKeyDown={(e) => e.preventDefault()}
          onChange={(date) => {
            const updatedRowData = [...rowData];
            updatedRowData[rowIndex.rowIndex] = {
              ...updatedRowData[rowIndex.rowIndex],
              date: date,
            };
            setRowData(updatedRowData);
            setStartDate(updatedRowData);
          }}
          locale="en-GB"
          placeholderText="From Date"
        />
      </div>
    );
  };

  const getDataRisks = () => {
    axios({
      method: "get",
      url: baseUrl + `/ProjectMS/risks/getAssignedData`,
    }).then(function (response) {
      var res = response.data;
      setRiskDetails(res);
    });
  };

  useEffect(() => {}, []);

  useEffect(() => {
    getDataRisks();
  }, []);

  const onChangeHandler = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [e.target.id]: id }));
  };

  const addHandler = (rowData) => {
    if (!valid) {
      setValid(true);
    }
    const data = {
      action: "",
      date: "",
      Reviewercomments: "",
      id: Date.now(), // Assign a unique identifier to the row
    };

    let dt = [];
    dt.push(data);

    if (
      action == [] ||
      action == undefined ||
      (action == "" && startDate == "") ||
      startDate == undefined ||
      startDate == []
    ) {
      // setValidateproject(true);
      setProducts([...dt]);
    } else {
      // setValidateproject(false);
      setProducts((prevProducts) => [...prevProducts, dt]);
    }
  };

  const onFileChangeHandler1 = (e) => {
    setSelectedFile1(e.target.files[0]);
    setFilName(e.target.files[0].name);
  };

  const deleteRow = (index) => {
    const updatedProducts = [...products];
    updatedProducts.splice(index, 1);
    setProducts(updatedProducts);
  };

  const deleteicon = (data, rowIndex) => {
    return (
      <AiFillDelete
        color="orange"
        align="center"
        title={"Delete Action"}
        onClick={() => {
          deleteRow(rowIndex.rowIndex);
        }}
      />
    );
  };

  return (
    <div>
      <div>
        <CModal
          visible={open}
          size="lg"
          //   className="reviewLogDeletePopUp"
          onClose={() => setOpen(false)}
          backdrop={"static"}
          maxWidth={"lg"}
          classes={{
            paper: classes.dialog,
          }}
        >
          <CModalHeader className="">
            <CModalTitle>
              <span className="">
                Design Review :{selectedCustomer?.projectName}
              </span>
            </CModalTitle>
          </CModalHeader>
          <CModalBody>
            <div className="col-md-12">
              {validateproject ? (
                <div className="statusMsg error p0">
                  <span>
                    <AiFillWarning />
                    &nbsp;
                    {"Please provide the valid values for highlighted fields"}
                  </span>
                </div>
              ) : (
                ""
              )}
              <div className="group-content row">
                <div className=" col-md-6 mb-2">
                  <div className="form-group row">
                    <label className="col-4" htmlFor="projectmanager">
                      Reviewer Name&nbsp;
                      <span className="required error-text">*</span>
                    </label>
                    <span className="col-1 p-0">:</span>
                    <span className="col-7 ">
                      <div
                        className="autoComplete-container cancel error autocomplete reactautocomplete"
                        id="autocomplete reactautocomplete"
                        ref={(ele) => {
                          ref.current[0] = ele;
                        }}
                      >
                        <ReviewsAutocomplete
                          name="assigned_to"
                          id="assigned_to"
                          value={value}
                          riskDetails={riskDetails}
                          getDataRisks={getDataRisks}
                          setFormData={setFormData}
                          onChangeHandler={onChangeHandler}
                          inputSearchString={loggedUserId}
                        />
                      </div>
                    </span>
                  </div>
                </div>
                <div className=" col-md-6 mb-2">
                  <div className="form-group row">
                    <label className="col-4" htmlFor="projectmanager">
                      Report
                    </label>
                    <span className="col-1 p-0">:</span>
                    <span className="col-7 ">
                      <input
                        type="file"
                        name="docId"
                        // id="docId"
                        className="fileUpload form-control cancel"
                        id="file"
                        onChange={onFileChangeHandler1}
                      />
                    </span>
                  </div>
                </div>
                <div className="row">
                  <div className="form-group row">
                    <div className="col-md-2">
                      <label>Comments </label>
                    </div>
                    <span className="col-1" style={{ width: "41px" }}>
                      :
                    </span>
                    <div className="col-7">
                      <textarea
                        type="text"
                        placeholder="Type Comments here"
                        onChange={(e) => {
                          setCommnets(e.target.value);
                        }}
                      ></textarea>
                    </div>
                  </div>
                </div>
              </div>
              <>
                <span
                  className="ft16 mt-3 "
                  style={{ color: "#297AB0", fontWeight: "bold" }}
                >
                  Action Items:
                </span>

                <div className="card p-fluid  mb-2">
                  <div className="customercard  darkHeader mt-2">
                    <DataTable
                      className="primeReactDataTable invoicingSearchTable    reportsPrimeTable"
                      value={products}
                      editMode="row"
                      rows={1500}
                      selection={selected}
                      onSelectionChange={(e) => setSelected(e.value)}
                      dataKey="id"
                      showGridlines
                      stripedRows
                      scrollHeight="400px"
                      responsiveLayout="scroll"
                      emptyMessage="No Records found."
                    >
                      <Column
                        field="action"
                        header="Action"
                        body={(rowData, rowIndex) =>
                          textEditorEventName(rowData, rowIndex)
                        }
                        style={{ width: "20%" }}
                      ></Column>
                      <Column
                        field="date"
                        header="Due Date"
                        body={(rowData, rowIndex) =>
                          textEditorDate(rowData, rowIndex)
                        }
                        style={{ width: "20%" }}
                      />

                      <Column
                        field="Reviewercomments"
                        header=" Reviewer Comments"
                        body={(rowData, rowIndex) =>
                          textEditorComments(rowData, rowIndex)
                        }
                        // editor={(options) => textEditorComments(options)}
                        style={{ width: "20%" }}
                      ></Column>
                      <Column
                        field="delete"
                        header="Action"
                        body={deleteicon}
                        style={{ width: "15%", textAlign: "center" }}
                      ></Column>
                    </DataTable>
                  </div>
                </div>

                <div className="form-group col-md-2 btn-container-events center my-3">
                  <button
                    className="btn btn-primary"
                    // disabled={valid}
                    title={"Add new row"}
                    onClick={addHandler}
                  >
                    <FaPlus /> Add
                  </button>

                  <button
                    id="submit"
                    className="btn btn-primary"
                    onClick={() => {
                      SubmitData();
                    }}
                  >
                    <FaSave /> Submit
                  </button>
                </div>
              </>
            </div>
          </CModalBody>
        </CModal>
      </div>
    </div>
  );
}

export default ReviewLogAdd;
