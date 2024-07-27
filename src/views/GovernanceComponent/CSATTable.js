import React, { useEffect, useState } from "react";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import {
  AiFillEdit,
  AiFillSave,
  AiFillCloseCircle,
  AiFillDelete,
} from "react-icons/ai";
import { TbFileText } from "react-icons/tb";
import { IoIosPaperPlane } from "react-icons/io";
import { FaComments, FaInfoCircle, FaPencilAlt } from "react-icons/fa";
import { FaRegEnvelope } from "react-icons/fa";
import { CModal, CModalBody, CModalHeader, CModalTitle } from "@coreui/react";
import axios from "axios";
import moment from "moment";
import { environment } from "../../environments/environment";
import { Link } from "react-router-dom";
import { RiFileExcel2Line } from "react-icons/ri";
import { FilterMatchMode } from "primereact/api";
import Popover from "@mui/material/Popover";
import Typography from "@mui/material/Typography";
import { MdInfoOutline } from "react-icons/md";
import { IoWarningOutline } from "react-icons/io5";
import { BiCheck, BiDownload } from "react-icons/bi";
import { DialogContent, DialogContentText } from "@material-ui/core";
import { style } from "@mui/system";
import { relativeLength } from "highcharts";
import "./CSATSurveyDataTable.scss";

function CSATTable({
  data,
  setData,
  isPCQA,
  loggedUserId,
  setSearchTrigger,
  searchTrigger,
  type,
  displayTable,
  setSaveMsg,
  searchdata,
  maxHeight1
}) {
  const [clientEmailPopup, setClientEmailPopup] = useState(false);
  const [clientEmailList, setClientEmailList] = useState([]);
  const [editIconIds, setEditIconIds] = useState([]);
  const [projectSurveyPopup, setProjectSurveyPopup] = useState(false);

  const [editRowData, setEditRowData] = useState({});

  const [surveyData, setSurveyData] = useState({});
  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    project_name: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    sent_survey_by: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    project_manager: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    full_name: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    client_email: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    initiatedOn: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    actual_start_dt: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    actual_end_dt: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    ver_status: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    survey_res: { value: null, matchMode: FilterMatchMode.CONTAINS },
  });
  const [globalFilterValue, setGlobalFilterValue] = useState("");

  const baseUrl = environment.baseUrl;

  const toggleIcons = (rowData) => {
    if (editIconIds.includes(rowData.id)) {
      setEditIconIds((prev) => prev.filter((id) => id !== rowData.id));
    } else {
      setEditIconIds((prev) => [...prev, rowData.id]);
    }
  };

  const [surveyOptions, setSurveyOptions] = useState([]);

  document.documentElement.style.setProperty(
    "--dynamic-value",
    String(maxHeight1 - 61) + "px"
  );


  useEffect(() => {
    axios
      .get(baseUrl + "/governancems/Csat/getCsatSurveys")
      .then((res) => {
        setSurveyOptions(res.data);
      })
      .catch((error) => console.log(error));
  }, []);

  const savePcqaCsatProjectDetails = (rowData) => {
    const requestBody = {
      csatId: rowData.csat_id,
      csatClientEmail: rowData.client_email,
      clientEmail: `${rowData.client_email_sel},${rowData.client_email}`,
      custName: rowData.full_name,
      ProjectId: rowData.id,
      date: searchdata.csatMonth,
      isWhat: "isSaveEmailMgr",
      prjClientEmails: `${rowData.client_email_sel},${rowData.client_email}`,
      userId: loggedUserId,
    };

    axios
      .post(
        baseUrl + `/governancems/Csat/savePcqaCsatProjectDetails`,
        requestBody
      )
      .then((res) => {
        console.log(res);
        setSaveMsg(true);
        setTimeout(() => {
          setSaveMsg(false);
        }, 3000);
        setSearchTrigger(!searchTrigger);
      })
      .catch((error) => console.log(error));
  };

  const [projectSurveyDetailsPopUp, setProjectSurveyDetailsPopUp] =
    useState(false);

  const [surveyDetails, setSurveyDetails] = useState([]);
  const [surveyFeedbackDocs, setSurveyFeedbackDocs] = useState([]);

  const getClientSurveydetails = (csatId) => {
    const requestBody = {
      csatId: csatId,
      isWhat: "isSurveyResults",
    };

    axios
      .post(baseUrl + `/governancems/Csat/getClientSurveydetails`, requestBody)
      .then((res) => {
        let ApiData = res.data;
        const groupedData = [];
        let currentGroup = [];

        ApiData.forEach((item) => {
          if (item.lvl === 1) {
            if (currentGroup.length > 0) {
              groupedData.push([...currentGroup]);
            }
            currentGroup = [item];
          } else {
            currentGroup.push(item);
          }
        });

        if (currentGroup.length > 0) {
          groupedData.push([...currentGroup]);
        }
        setSurveyDetails(groupedData);
      })
      .catch((error) => console.log(error));
  };

  const setCSatforSurveyFeedback = (csatId) => {
    axios
      .get(baseUrl + `/governancems/Csat/surveyFeedbackDocs?csatId=${csatId}`)
      .then((resp) => {
        const serialData = resp.data?.map((item, index) => ({
          ...item,
          serial: index + 1,
        }));
        setSurveyFeedbackDocs(serialData);
      })
      .catch((error) => console.log(error));
  };

  const onGlobalFilterChange = (e) => {
    const value = e.target.value;
    let _filters = { ...filters };

    _filters["global"].value = value;

    setFilters(_filters);
    setGlobalFilterValue(value);
  };

  const [surveyFeedbackPopup, setSurveyFeedbackPopup] = useState(false);
  const [feedbackProject, setFeedbackProject] = useState("");
  const [feedbackCSATID, setFeedbackCSATID] = useState();

  const actionField = (rowData) => {
    const isPencilVisible = !editIconIds.includes(rowData.id);

    return (
      <>
        {rowData.isPrjMngr == 1 ? (
          <>
            {rowData.csat_id === 0 ? (
              <div>
                {isPencilVisible ? (
                  <FaPencilAlt
                    title="edit"
                    cursor="pointer"
                    onClick={() => {
                      {
                        toggleIcons(rowData);
                      }

                      const emailList =
                        rowData.client_email_sel?.length > 0
                          ? rowData.client_email_sel?.split(",")
                          : [];
                      const emailObj = emailList?.map((it) => ({
                        checked: it == rowData.client_email,
                        email: it,
                      }));
                      {
                        setClientEmailList(emailObj);
                      }
                      {
                        setEditRowData(rowData);
                      }
                    }}
                  />
                ) : (
                  <>
                    <AiFillSave
                      title="Save"
                      cursor="pointer"
                      onClick={() => {
                        savePcqaCsatProjectDetails(rowData);
                        toggleIcons(rowData);
                      }}
                    />
                    <AiFillCloseCircle
                      title="Cancel"
                      cursor="pointer"
                      onClick={() => {
                        toggleIcons(rowData);
                        setData((prevData) => {
                          const updatedData = prevData.map((item) => {
                            if (item.id === rowData.id) {
                              item.client_email = "";
                            }
                            return item;
                          });
                          return updatedData;
                        });
                      }}
                    />
                  </>
                )}
              </div>
            ) : (
              rowData.ver_status === "New" && (
                <div title="Send Survey">
                  <IoIosPaperPlane
                    cursor={"pointer"}
                    onClick={() => {
                      setProjectSurveyPopup(true);
                      setSurveyData(rowData);
                    }}
                  />
                </div>
              )
            )}
          </>
        ) : (
          ""
        )}
        {rowData.ver_status !== "New" ? (
          <div className="d-flex">
            <div className="ms-4" title="Survey Results">
              <TbFileText
                cursor={"pointer"}
                onMouseEnter={() => getClientSurveydetails(rowData.csat_id)}
                onClick={() => {
                  setProjectSurveyDetailsPopUp(true);
                }}
              />
            </div>
            <div className="ms-1">
              {rowData.result_val !== null ? (
                <div title="Survey Feedback">
                  <FaComments
                    cursor={"pointer"}
                    onClick={() => {
                      setFeedbackCSATID(rowData.csat_id);
                      setCSatforSurveyFeedback(rowData.csat_id);
                      setFeedbackProject(rowData.project_name);
                      setSurveyFeedbackPopup(true);
                    }}
                  />
                </div>
              ) : (
                ""
              )}
            </div>
          </div>
        ) : (
          ""
        )}
      </>
    );
  };
  const clientEmailEditor = (rowData) => {
    return editIconIds.includes(rowData.id) ? (
      <div className="d-flex">
        <div title={rowData.client_email}>
          <input type="text" defaultValue={rowData.client_email} readOnly />
        </div>
        &nbsp;&nbsp;&nbsp;
        <div>
          <AiFillEdit
            size={14}
            cursor={"pointer"}
            onClick={() => {
              setClientEmailPopup(true);
            }}
          />
        </div>
      </div>
    ) : (
      <div title={rowData.client_email} className="ellipsis">
        {rowData.client_email}
      </div>
    );
  };

  const ClientEmailPopUp = () => {
    const [mailCheck, setMailCheck] = useState(false);
    const [selectionCheck, setSelectionCheck] = useState(false);
    const [emailExist, setEmailExist] = useState(false);
    var newEmail = "";

    return (
      <CModal
        visible={clientEmailPopup}
        onClose={() => setClientEmailPopup(false)}
        backdrop={"static"}
        size="sm"
        alignment="center"
      >
        <CModalHeader>
          <CModalTitle>Client Email</CModalTitle>
        </CModalHeader>
        <CModalBody>
          {mailCheck ? (
            <div className="statusMsg error">
              <span>
                <IoWarningOutline style={{ marginTop: "-2px" }} /> Please
                Provide Proper Email
              </span>
            </div>
          ) : (
            ""
          )}
          {selectionCheck ? (
            <div className="statusMsg error">
              <span>
                <IoWarningOutline style={{ marginTop: "-2px" }} />
                Please select one email
              </span>
            </div>
          ) : (
            ""
          )}
          {emailExist ? (
            <div className="statusMsg error">
              <span>
                <IoWarningOutline style={{ marginTop: "-2px" }} />
                Email already exists
              </span>
            </div>
          ) : (
            ""
          )}
          <div className="d-flex">
            <div>
              <input
                type="email"
                onChange={(e) => (newEmail = e.target.value)}
                placeholder="Enter Email"
              />
            </div>
            &nbsp;&nbsp;&nbsp;
            <button
              className="btn btn-primary mx-3"
              onClick={() => {
                const emailRegex =
                  /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/;
                if (newEmail.match(emailRegex)) {
                  if (
                    !clientEmailList
                      .map((it) => it.email.toLowerCase())
                      .includes(newEmail.toLowerCase())
                  ) {
                    setClientEmailList((prev) => [
                      ...prev,
                      { checked: false, delete: true, email: newEmail },
                    ]);
                  } else {
                    setEmailExist(true);
                    setTimeout(() => {
                      setEmailExist(false);
                    }, 3000);
                  }
                } else {
                  setMailCheck(true);
                  setTimeout(() => setMailCheck(false), 3000);
                }
              }}
            >
              Add
            </button>
          </div>
          <div className="mt-2">
            {clientEmailList?.map((it) => {
              return (
                <div key={it.email} className="d-flex">
                  <input
                    type="checkbox"
                    checked={it.checked}
                    onChange={(e) => {
                      setClientEmailList((prevList) => {
                        return prevList.map((item) =>
                          item.email === it.email
                            ? { ...item, checked: e.target.checked }
                            : item
                        );
                      });
                    }}
                  />
                  &nbsp;&nbsp;&nbsp;
                  <span>{it.email}</span>
                  {it?.delete === true && (
                    <AiFillDelete
                      className="mt-1 ms-1"
                      cursor={"pointer"}
                      onClick={() =>
                        setClientEmailList(() =>
                          clientEmailList.filter(
                            (item) => item.email !== it.email
                          )
                        )
                      }
                    />
                  )}
                </div>
              );
            })}
          </div>
          <div>
            <button
              className="btn btn-primary"
              onClick={() => {
                if (clientEmailList.some((item) => item.checked === true)) {
                  setData((prevData) => {
                    const updatedData = prevData.map((item) => {
                      if (item.id === editRowData.id) {
                        const newEmails = clientEmailList
                          ?.filter((it) => it.checked === true)
                          ?.map((it) => it.email)
                          .join(",");
                        item.client_email = newEmails;
                      }
                      return item;
                    });
                    return updatedData;
                  });
                  setClientEmailPopup(false);
                } else {
                  setSelectionCheck(true);
                  setTimeout(() => {
                    setSelectionCheck(false);
                  }, 3000);
                }
              }}
            >
              <AiFillSave />
              Select
            </button>
          </div>
        </CModalBody>
      </CModal>
    );
  };

  const ProjectSurveyPopUp = () => {
    const [surveyOptionsSelected, setSurveyOptionsSelected] = useState(-1);
    const [mailSubject, setMailSubject] = useState(
      `CSAT For ${surveyData.project_name}`
    );

    const [surveyOptMsg, setSurveyOptMsg] = useState(false);

    const sendSurveyToClient = () => {
      if (surveyOptionsSelected == -1) {
        setSurveyOptMsg(true);
        setTimeout(() => {
          setSurveyOptMsg(false);
        }, 3000);
        return;
      }

      const requestBody = {
        csatId: surveyData.csat_id,
        survey: surveyOptionsSelected,
        subject: mailSubject,
        isWhat: "isSurveySend",
      };
      console.log(requestBody);

      axios
        .post(baseUrl + `/governancems/Csat/sendSurveyToClient`, requestBody)
        .then((resp) => {
          console.log(resp.data);
          setProjectSurveyPopup(false);
          setSearchTrigger(!searchTrigger);
        })
        .catch((error) => console.log(error));
    };

    return (
      <>
        <CModal
          visible={projectSurveyPopup}
          onClose={() => setProjectSurveyPopup(false)}
          backdrop={"static"}
          size="lg"
        >
          <CModalHeader>
            <CModalTitle>Send Project Survey</CModalTitle>
          </CModalHeader>
          <CModalBody>
            {surveyOptMsg ? (
              <div className="statusMsg error">
                <span>
                  <IoWarningOutline style={{ marginTop: "-2px" }} /> Please
                  select the Survey Option
                </span>
              </div>
            ) : (
              ""
            )}
            <div className="col-md-6 mb-2">
              <div className="row ms-1">
                <label className="col-4">CSAT Survey</label>
                <span className="col-1">:</span>
                <div className="col-6">
                  <select
                    onChange={(e) => setSurveyOptionsSelected(e.target.value)}
                  // style={{
                  //   backgroundColor:
                  //     surveyOptionsSelected == -1 ? "#F2DEDE" : "",
                  // }}
                  >
                    <option value={-1}>Select Survey</option>
                    {surveyOptions.map((item) => (
                      <option value={item.id}>{item.surveyName}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            <hr />
            <div className="row mt-2 mb-2 mx-1">
              <div className="col-md-2 text-center border">
                <button
                  className="btn col-12 d-inline border-0"
                  title="Send Survey"
                  onClick={() => sendSurveyToClient()}
                >
                  <FaRegEnvelope size={19} color="#A4A4A4" />
                  <br />
                  Send Survey
                </button>
              </div>
              <div className="col-md-10">
                <div className="row mb-2">
                  <label className="col-md-1 col-form-label">To</label>
                  <label className="col-md-1">:</label>
                  <div className="col-md-10">
                    <input
                      type="text"
                      className="form-control"
                      readOnly
                      value={surveyData.client_email}
                    />
                  </div>
                </div>
                <div className="row">
                  <label className="col-md-1 col-form-label">Subject</label>
                  <label className="col-md-1">:</label>
                  <div className="col-md-10">
                    <input
                      type="text"
                      className="form-control"
                      defaultValue={mailSubject}
                      onChange={(e) => setMailSubject(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="border border-dark p-1">
              <p className="mt-2">Dear Customer,</p>
              <p className="mt-2">
                As a valued Prolifics client, you have an impact on the quality
                of our service delivery. We are dedicated to understanding your
                growing needs and improving our ability to satisfy those needs.
                With your help, we would like to evaluate the services we
                provide to you and identify areas we can improve upon.
              </p>
              <p className="mt-2">
                We are requesting your input through a brief Q&A in the attached
                form. Your input can help us immensely in improving our
                services. We estimate that it will take you approximately 5
                minutes to complete. The project we are requesting feedback on
                is shown below.
              </p>
              <p className="mt-2">
                Please complete this survey for the project: %SURVEY_URL%{" "}
              </p>
              <p className="mt-2">
                We would be glad if you can respond back with the filled in
                customer survey form within 48 hours.
              </p>
              <p className="mt-4 mb-2">
                Thank you in advance for your time and cooperation in completing
                this survey. Please be assured that your answers will be kept
                strictly confidential and only used for Prolifics internal
                purposes
              </p>
            </div>
          </CModalBody>
        </CModal>
      </>
    );
  };

  const ProjectSurveyDetailsPopUp = () => {
    return (
      <CModal
        visible={projectSurveyDetailsPopUp}
        onClose={() => setProjectSurveyDetailsPopUp(false)}
        backdrop={"static"}
        size="xl"
      >
        <CModalHeader>
          <CModalTitle>Project Survey Details</CModalTitle>
        </CModalHeader>
        <CModalBody>
          {surveyDetails.length > 0 ? (
            <>
              {surveyDetails.map((data, index) => (
                <div className={index > 0 ? "mt-3" : ""}>
                  <div>
                    <strong>Client Email</strong>&nbsp; : {data[0]?.email}
                  </div>
                  <div className="mt-1">
                    <DataTable
                      value={data.slice(1)}
                      showGridlines
                      className="primeReactDataTable darkHeader"
                    >
                      <Column
                        field="question"
                        style={{ width: "75%" }}
                        header="Question"
                        className="ellipsis"
                        body={(rowData) => (
                          <div title={rowData.question}>{rowData.question}</div>
                        )}
                      />
                      <Column
                        field="answer"
                        style={{ width: "25%" }}
                        header="Answer"
                        className="ellipsis"
                        body={(rowData) => (
                          <div title={rowData.answer}>{rowData.answer}</div>
                        )}
                      />
                    </DataTable>
                  </div>
                </div>
              ))}
            </>
          ) : (
            <div
              style={{
                textAlign: "center",
                fontSize: "20px",
                lineHeight: "50px",
                backgroundColor: "#dbf5ff",
                fontFamily: "initial",
              }}
            >
              Responses For This Survey Has Not Been Submitted Yet.
            </div>
          )}
        </CModalBody>
      </CModal>
    );
  };

  const SurveyFeedbackPopUp = () => {
    const [files, setFiles] = useState([]);

    const [fileMissing, setFilemissing] = useState(false);
    const [fileSuccess, setFileSuccess] = useState(false);

    const handleFileChange = (event) => {
      const selectedFile = event.target.files[0];
      setFiles([selectedFile]);
    };

    const handleUpload = async () => {
      if (files.length === 0) {
        setFilemissing(true);
        setTimeout(() => {
          setFilemissing(false);
        }, 3000);
        return;
      }

      const formData = new FormData();
      formData.append("files", files[0]);

      const data = {
        fileDescription: files[0].name,
      };

      Object.keys(data).forEach((key) => {
        formData.append(key, data[key]);
      });

      await axios
        .post(
          baseUrl +
          `/governancems/Csat/csatProjectSurveysFile?csatId=${feedbackCSATID}&loggedUserId=${loggedUserId}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        )
        .then((response) => {
          // col == "S.No."? SnoAlign : col == "Self Rating" && SelfRatingAlign ? col == "Supervisor Rating" && SuperVisorRatingAlign : col == "Exp(In Months)" && ExpAlign
          response.status == 200 ? setFileSuccess(true) : "";
          // console.log("File uploaded successfully:", response.data);
          setTimeout(() => {
            setFileSuccess(false);
            setCSatforSurveyFeedback(feedbackCSATID);
          }, 3000);
        })
        .catch((error) => {
          console.error("Error uploading file:", error);
        });
    };

    const downloadAction = (rowData) => {
      return (
        <BiDownload
          cursor={"pointer"}
          color="#15a7ea"
          title="Download"
          onClick={() => {
            const link = document.createElement("a");
            link.href =
              baseUrl +
              `/CommonMS/document/downloadFile?documentId=${rowData.id
              }&svnRevision=${""}`;
            link.click();
          }}
        />
      );
    };
    return (
      <CModal
        visible={surveyFeedbackPopup}
        onClose={() => setSurveyFeedbackPopup(false)}
        backdrop={"static"}
        size="md"
      >
        <CModalHeader>
          <CModalTitle>
            {feedbackProject}
            {surveyFeedbackDocs[0]?.updatedOn == undefined ||
              surveyFeedbackDocs[0]?.updatedOn == undefined
              ? ""
              : `(${surveyFeedbackDocs[0]?.updatedOn})`}
          </CModalTitle>
        </CModalHeader>
        <CModalBody>
          {fileMissing ? (
            <div className="statusMsg error">
              <span>
                <IoWarningOutline style={{ marginTop: "-2px" }} /> Please Select
                a file to Upload
              </span>
            </div>
          ) : (
            ""
          )}
          {fileSuccess ? (
            <div className="statusMsg success">
              <span>
                <BiCheck style={{ marginTop: "-2px" }} />
                File uploaded successfully
              </span>
            </div>
          ) : (
            ""
          )}
          <div className="d-flex">
            <strong>
              Browse File<span style={{ color: "red" }}>*</span>
            </strong>
            <span className="ms-1">:</span>
            <div className="border border-dark rounded-1 ms-1">
              <input type="file" onChange={handleFileChange} />
            </div>
            <button className="btn btn-primary ms-2" onClick={handleUpload}>
              Upload
            </button>
          </div>
          <div className="mt-4">
            {surveyFeedbackDocs.length > 0 && (
              <DataTable
                value={surveyFeedbackDocs}
                showGridlines
                className="primeReactDataTable darkHeader"
              >
                <Column field="serial" header="S. No" align={"center"} />
                <Column
                  field="fileName"
                  header="Document Name"
                  body={(rowData) => (
                    <div title={rowData.fileName} className="ellipsis">
                      {rowData.fileName}
                    </div>
                  )}
                />
                <Column field="updatedOn" header="Created On" />
                <Column
                  field=""
                  header="Action"
                  align={"center"}
                  body={(rowData) => downloadAction(rowData)}
                />
              </DataTable>
            )}
          </div>
        </CModalBody>
      </CModal>
    );
  };

  const [anchorEl, setAnchorEl] = React.useState(null);
  const handleClose = () => {
    setAnchorEl(false);
  };

  const SurveyResultPopOver = () => {
    const handlePopoverOpen = (event) => {
      setAnchorEl(event.currentTarget);
    };

    const handlePopoverClose = () => {
      setAnchorEl(null);
    };

    const open = Boolean(anchorEl);

    return (
      <div>
        <Typography
          aria-owns={open ? "mouse-over-popover" : undefined}
          aria-haspopup="true"
          onMouseEnter={handlePopoverOpen}
          onMouseLeave={handlePopoverClose}
        ></Typography>
        <Popover
          id="mouse-over-popover"
          sx={{
            pointerEvents: "none",
            position: "absolute",
            top: "50px",
          }}
          open={open}
          anchorEl={anchorEl}
          onClose={handlePopoverClose}
          disableRestoreFocus
        >
          <ul class="list-group">
            <li
              class="list-group-item d-flex justify-content-between align-items-center"
              style={{ fontWeight: "bold" }}
            >
              Calculated As:
              <span class="badge bg-primary rounded-pill"></span>
            </li>
            <li class="list-group-item d-flex justify-content-between align-items-center">
              Strongly Disagree:
              <span class="badge bg-primary surveyBadge rounded-pill ms-1">
                1
              </span>
            </li>
            <li class="list-group-item d-flex justify-content-between align-items-center">
              Disagree:
              <span class="badge bg-primary surveyBadge rounded-pill ms-1">
                2
              </span>
            </li>
            <li class="list-group-item d-flex justify-content-between align-items-center">
              Neutral:
              <span class="badge bg-primary surveyBadge rounded-pill ms-1">
                3
              </span>
            </li>
            <li class="list-group-item d-flex justify-content-between align-items-center">
              Agree:
              <span class="badge bg-primary surveyBadge rounded-pill ms-1">
                4
              </span>
            </li>
            <li class="list-group-item d-flex justify-content-between align-items-center">
              Strongly Agree:
              <span class="badge bg-primary surveyBadge rounded-pill ms-1">
                5
              </span>
            </li>
          </ul>
        </Popover>
      </div>
    );
  };

  const saveAsExcelFile = (buffer, fileName) => {
    const blobData = new Blob([buffer], { type: "application/octet-stream" });
    if (typeof window.navigator.msSaveBlob !== "undefined") {
      window.navigator.msSaveBlob(blobData, fileName);
    } else {
      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blobData);
      link.download = fileName;
      link.click();
      window.URL.revokeObjectURL(link.href);
    }
  };

  const handleOnExport = () => {
    const labels = {
      sno: "SNo.",
      project_name: "Project Name",
      project_manager: "Project Manager",
      sent_survey_by: "Sent Servey By",
      full_name: "Client Name",
      client_email: "Client Email",
      initiatedOn: "Initiated On",
      actual_start_dt: "Prj St Dt",
      actual_end_dt: "Prj End Dt",
      ver_status: "Status",
      survey_res: "Survey Result",
    };

    const dataInTable = data.map((item) => {
      const row = {};
      Object.keys(labels).forEach((key) => {
        row[labels[key]] = item[key];
      });
      return row;
    });

    const ExcelJS = require("exceljs");
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("CSATProjectSurveyData");

    const headerRow = worksheet.addRow(Object.values(labels));
    headerRow.font = { bold: true };

    dataInTable.forEach((rowData) => {
      worksheet.addRow(Object.values(rowData));
    });

    workbook.xlsx.writeBuffer().then((buffer) => {
      saveAsExcelFile(buffer, "CSATProjectSurveyData.xlsx");
    });
  };

  return (
    <div >
      <div className="flex justify-content-end m-2">
        <label>Search &nbsp;:&nbsp; </label>
        <input value={globalFilterValue} onChange={onGlobalFilterChange} />
        <RiFileExcel2Line
          size="1.5em"
          title="Export to Excel"
          cursor="pointer"
          style={{
            color: "green",
            marginLeft: "10px",
            marginRight: "-10px",
          }}
          onClick={handleOnExport}
        />
      </div>
      <div className="governanceCsatTable">
        <DataTable
          value={data}
          showGridlines
          stripedRows
          dataKey="id"
          responsiveLayout="scroll"
          emptyMessage="No Records found."
          className="primeReactDataTable darkHeader"
          filters={filters}
          globalFilterFields={[
            "project_name",
            "project_manager",
            "sent_survey_by",
            "full_name",
            "client_email",
            "initiatedOn",
            "actual_start_dt",
            "actual_end_dt",
            "ver_status",
            "survey_res",
          ]}
          paginator
          rows={25}
          paginationPerPage={5}
          paginationRowsPerPageOptions={[5, 15, 20, 25, 50]}
          paginationComponentOptions={{
            rowsPerPageText: "Records per page:",
            rangeSeparatorText: "out of",
          }}
          currentPageReportTemplate="View {first} - {last} of {totalRecords} "
          paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
          rowsPerPageOptions={[10, 20, 25, 50]}
        >
          <Column
            field="project_name"
            sortable
            header="Project"
            body={(rowData) => (
              <div className="ellipsis">
                <Link
                  title={rowData.project_name}
                  className="linkSty"
                  target="_blank"
                  to={`/project/Overview/:${rowData.id}`}
                >
                  {rowData.project_name}
                </Link>
              </div>
            )}
          />
          <Column
            field="project_manager"
            sortable
            header="Project Manager"
            body={(rowData) => (
              <div title={rowData.project_manager} className="ellipsis">
                {rowData.project_manager}
              </div>
            )}
          />
          <Column
            field="sent_survey_by"
            sortable
            header="Survey Sent By"
            body={(rowData) => (
              <div title={rowData.sent_survey_by} className="ellipsis">
                {rowData.sent_survey_by}
              </div>
            )}
          />
          <Column
            field="full_name"
            sortable
            header="Client Name"
            body={(rowData) => (
              <div title={rowData.full_name} className="ellipsis">
                {rowData.full_name}
              </div>
            )}
          />
          <Column
            field="client_email"
            header="Client Email"
            sortable
            body={(rowData) => clientEmailEditor(rowData)}
          />
          <Column
            field="initiatedOn"
            sortable
            header="Initiated On"
            align={"center"}
            body={(rowData) => (
              <div title={rowData.initiatedOn} className="ellipsis">
                {rowData.initiatedOn !== null ?
                  moment(rowData.initiatedOn).format("DD-MMM-yyyy") : ""}
              </div>
            )}
          />

          <Column
            field="actual_start_dt"
            sortable
            header="Prj St Dt"
            align={"center"}
            body={(rowData) => {
              console.log('rowData:', rowData);
              return (
                <div title={rowData.actual_start_dt} className="ellipsis">
                  {rowData.actual_start_dt}
                </div>
              );
            }}
          />
          <Column
            field="actual_end_dt"
            sortable
            align={"center"}
            header="Prj End Dt"
            body={(rowData) => (
              <div title={rowData.actual_end_dt} className="ellipsis">
                {rowData.actual_end_dt}
              </div>
            )}
          />
          <Column
            field="ver_status"
            sortable
            header="Status"
            align={"center"}
            body={(rowData) => (
              <div title={rowData.ver_status} className="ellipsis">
                {rowData.ver_status}
              </div>
            )}
          />
          <Column
            field="result_val"
            align={"center"}
            header={() => (
              <div style={{ position: "relative" }}>
                Survey Result{" "}
                <FaInfoCircle
                  cursor={"pointer"}
                  onMouseOver={(e) => {
                    setAnchorEl(e?.currentTarget);
                  }}
                  onMouseLeave={handleClose}
                />
              </div>
            )}
            body={(rowData) => <div>{rowData.result_val}</div>}
          />
          {type == 1 && displayTable && (
            <Column
              field=""
              header="Actions"
              align={"center"}
              body={(rowData) => actionField(rowData)}
            />
          )}
        </DataTable>
      </div>
      {clientEmailPopup && <ClientEmailPopUp />}
      {projectSurveyPopup && <ProjectSurveyPopUp />}
      {projectSurveyDetailsPopUp && <ProjectSurveyDetailsPopUp />}
      {surveyFeedbackPopup && <SurveyFeedbackPopUp />}
      {anchorEl && <SurveyResultPopOver />}
    </div>
  );
}

export default CSATTable;
