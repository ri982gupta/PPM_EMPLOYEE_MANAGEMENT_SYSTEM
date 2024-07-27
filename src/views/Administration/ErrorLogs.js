import moment from "moment";
import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { Column } from "ag-grid-community";
import CellRendererPrimeReactDataTable from "../PrimeReactTableComponent/CellRendererPrimeReactDataTable";
import { AiFillEdit, AiFillWarning } from "react-icons/ai";
import Loader from "../Loader/Loader";
import FlatPrimeReactTable from "../PrimeReactTableComponent/FlatPrimeReactTable";
import { MdOutlinePlaylistAdd } from "react-icons/md";
import GlobalCancel from "../ValidationComponent/GlobalCancel";
import { VscSave } from "react-icons/vsc";
import { ImCross } from "react-icons/im";
import GlobalValidation from "../ValidationComponent/GlobalValidation";
import { BiCheck } from "react-icons/bi";
import { environment } from "../../environments/environment";
import ErrorLogGlobalValidation from "./Errorlogvalidation";
import ErrorLogTable from "./ErrorLogsTable";

function ErrorLogs() {
  const ref = useRef([]);
  const baseUrl = environment.baseUrl;
  const [unreaddata, setUnreadData] = useState([{}]);
  const [readdata, setReadData] = useState([{}]);
  const [headerData, setHeaderData] = useState([]);
  const [headerData1, setHeaderData1] = useState([]);
  const [linkColumns, setLinkColumns] = useState([]);
  const [linkColumnsRoutes, setLinkColumnsRoutes] = useState([]);
  const [linkColumns1, setLinkColumns1] = useState([]);
  const [linkColumnsRoutes1, setLinkColumnsRoutes1] = useState([]);
  const [loader, setLoader] = useState(false);
  const [searching, setsearching] = useState(false);
  const [read, setRead] = useState("0");
  const [id, setId] = useState([]);
  const [validationMessage, setValidationMessage] = useState(false);
  const [addmsg, setAddmsg] = useState(false);
  console.log(id);
  let rows = 10;
  // console.log(unreaddata)
  const loggedUserId = localStorage.getItem("resId");
  const [date, setDate] = useState(new Date());
  console.log(date);
  let date1 = moment(date).format("yyyy-MM-DD");
  const data = {
    comments: "",
    reviewed_by: loggedUserId,
    reviewed_date: date1,
  };
  console.log(data);
  const [message, setMessage] = useState("");

  const [formData, setFormData] = useState(data);

  console.log(formData);
  const initialValue1 = {};
  const [tabledata, settabledata] = useState(initialValue1);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };
  const abortController = useRef(null);

  const getData = () => {
    setLoader(true);
    abortController.current = new AbortController();
    axios
      .get(baseUrl + `/accountingms/ErrorLogs/getErrorLogsUnread`)
      .then((res) => {
        const GetData = res.data;
        for (let i = 0; i < GetData.length; i++) {
          GetData[i]["SNo"] = i + 1;
          GetData[i]["createdAt"] =
            GetData[i]["createdAt"] == null
              ? ""
              : moment(GetData[i]["createdAt"]).format("YYYY-MM-DD HH:mm:ss");
        }
        let dataHeaders = [
          {
            // SNo: "S.No",
            procName: "Procedure",
            errorDesc: "Error Description",
            createdAt: "Created Date",
            reviewed_by: "Reviewed By",
            reviewed_date: "Reviewed Date",
            comments: "Comments",
          },
        ];
        let data = ["Action"];
        setUnreadData(dataHeaders.concat(GetData));
        setHeaderData(GetData);
        setTimeout(() => {
          setLoader(false);
        }, 3000);

        setsearching(true);
        setTimeout(() => {
          setsearching(false);
        }, 2000);
        settabledata();
      })
      .catch((error) => {});
  };
  const getUrlPath = () => {
    axios({
      method: "get",
      url:
        baseUrl +
        `/CommonMS/security/authorize?url=/admin/errorLog&userId=${loggedUserId}`,
    })
      .then((res) => {})
      .catch((error) => {});
  };
  useEffect(() => {
    getData();
    getUrlPath();
  }, []);

  const error = (unreaddata) => {
    return (
      <div
        className="ellipsis"
        data-toggle="tooltip"
        title={unreaddata.errorDesc}
      >
        {unreaddata.errorDesc}
      </div>
    );
  };
  const procname = (unreaddata) => {
    return (
      <div
        className="ellipsis"
        data-toggle="tooltip"
        title={unreaddata.procName}
      >
        {unreaddata.procName}
      </div>
    );
  };
  const createdAt = (unreaddata) => {
    return (
      <div
        className="ellipsis"
        data-toggle="tooltip"
        title={unreaddata.createdAt}
      >
        {unreaddata.createdAt}
      </div>
    );
  };

  console.log(unreaddata);
  const LinkTemplate = (unreaddata) => {
    let rou = linkColumns[0];

    const onChangeSetDate = (comment, id) => {
      console.log(comment);
      settabledata((prev) => ({
        ...prev,
        [id]: comment,
      }));
    };
    console.log(tabledata);
    return (
      <div
        className="ptTextarea-container"
        ref={(ele) => {
          ref.current[0] = ele;
        }}
      >
        <textarea
          rows={3}
          className="cancel valid"
          id="comments"
          name="comments"
          onChange={(e) => {
            onChangeSetDate(e.target.value, unreaddata.id);
          }}
        ></textarea>
      </div>
    );
  };
  const dynamicColumns = Object.keys(headerData)?.map((col, i) => {
    return (
      <Column
        sortable
        key={col}
        body={
          // col == "SNo" ? SnoAlign :
          (col == "comments" && LinkTemplate) ||
          (col == "errorDesc" && error) ||
          (col == "procName" && procname) ||
          (col == "createdAt" && createdAt)
        }
        field={col}
        header={headerData[col]}
      />
    );
  });
  useEffect(() => {
    unreaddata[0] && setHeaderData(JSON.parse(JSON.stringify(unreaddata[0])));
  }, [unreaddata]);
  //=====================
  const getData1 = () => {
    axios
      .get(baseUrl + `/accountingms/ErrorLogs/getErrorLogsRead`)
      .then((res) => {
        const GetData = res.data;
        console.log(GetData);
        for (let i = 0; i < GetData.length; i++) {
          GetData[i]["SNo"] = i + 1;
          GetData[i]["createdAt"] =
            GetData[i]["createdAt"] == null
              ? ""
              : moment(GetData[i]["createdAt"]).format("DD-MM-YYYY HH:mm:ss");
          GetData[i]["reviewed_date"] =
            GetData[i]["reviewed_date"] == null
              ? ""
              : moment(GetData[i]["reviewed_date"]).format("DD-MM-YYYY");
        }
        let dataHeaders = [
          {
            procName: "Procedure",
            errorDesc: "Error Description",
            createdAt: "Created Date",
            reviewedby: "Reviewed By",
            reviewed_date: "Reviewed Date",
            comments: "Comments",
          },
        ];
        let data = ["Action"];
        setReadData(dataHeaders.concat(GetData));
        setHeaderData1(GetData);
        setsearching(true);
        setTimeout(() => {
          setsearching(false);
        }, 100);
      })
      .catch((error) => {});
  };
  useEffect(() => {
    getData1();
  }, []);
  const error1 = (readdata) => {
    return (
      <div
        className="ellipsis"
        data-toggle="tooltip"
        title={readdata.errorDesc}
      >
        {readdata.errorDesc}
      </div>
    );
  };
  const comments = (readdata) => {
    return (
      <div className="ellipsis" data-toggle="tooltip" title={readdata.comments}>
        {readdata.comments}
      </div>
    );
  };
  const reviewed_by = (readdata) => {
    return (
      <div
        className="ellipsis"
        data-toggle="tooltip"
        title={readdata.reviewedby}
      >
        {readdata.reviewedby}
      </div>
    );
  };
  const reviewed_date = (readdata) => {
    return (
      <div
        className="ellipsis"
        data-toggle="tooltip"
        title={readdata.reviewed_date}
      >
        {readdata.reviewed_date}
      </div>
    );
  };
  const procName = (readdata) => {
    return (
      <div className="ellipsis" data-toggle="tooltip" title={readdata.procName}>
        {readdata.procName}
      </div>
    );
  };
  const createdAt1 = (readdata) => {
    return (
      <div
        className="ellipsis"
        data-toggle="tooltip"
        title={readdata.createdAt}
      >
        {readdata.createdAt}
      </div>
    );
  };

  // console.log(unreaddata)

  const dynamicColumns1 = Object.keys(headerData1)?.map((col, i) => {
    return (
      <Column
        sortable
        key={col}
        body={
          // col == "SNo" ? SnoAlign :

          (col == "errorDesc" && error1) ||
          (col == "comments" && comments) ||
          (col == "reviewedby" && reviewed_by) ||
          (col == "reviewed_date" && reviewed_date) ||
          (col == "procName" && procName) ||
          (col == "createdAt" && createdAt1)
        }
        field={col}
        header={headerData1[col]}
      />
    );
  });
  useEffect(() => {
    readdata[0] && setHeaderData1(JSON.parse(JSON.stringify(readdata[0])));
  }, [readdata]);
  const [inputValue, setInputValue] = useState("");
  //[==========================Post Comments===================]
  console.log(id);

  const handleSaveClick = () => {
    // let valid = ErrorLogGlobalValidation(ref);
    // console.log(valid);

    // if (valid) {
    //     setValidationMessage(true);
    //     return;
    // }
    if (
      tabledata == undefined ||
      tabledata == null ||
      tabledata == {} ||
      tabledata == ""
      // tabledata == ""
    ) {
      setValidationMessage(true);
      // return;
    } else {
      console.log("231.................................");
      setValidationMessage(false);

      let data = [];
      Object.keys(tabledata).forEach((ele) => {
        const obj = {};
        (obj["id"] = +ele),
          (obj["reviewed_date"] = formData.reviewed_date),
          (obj["reviewed_by"] = +formData.reviewed_by),
          (obj["comments"] = tabledata[ele]),
          data.push(obj);
      });

      axios({
        method: "post",
        url: baseUrl + `/accountingms/ErrorLogs/updatecomments`,
        data: data,
      }).then((error) => {
        setValidationMessage(false);
        setAddmsg(true);
        setTimeout(() => {
          setAddmsg(false);
        }, 3000);
        getData();
        settabledata();
        // location.reload();
        console.log("success", error);
        window.location.reload();
      });
    }
  };
  const handleReset = () => {
    let ele = document.getElementsByClassName("cancel");
    for (let index = 0; index < ele.length; index++) {
      console.log(ele[index]);
      console.log(ele[index].id);
      console.log(ele[index].value);
      ele[index].value = null;
      setValidationMessage(false);
      setAddmsg(false);
      settabledata();
    }
  };
  const handleAbort = () => {
    abortController.current && abortController.current.abort();
    setLoader(false);
  };
  return (
    <div className="col-md-12">
      {addmsg ? (
        <div className="statusMsg success">
          {" "}
          <span className="errMsg">
            <BiCheck size="1.4em" /> &nbsp; Comments Saved Successfully
          </span>
        </div>
      ) : (
        ""
      )}
      {validationMessage ? (
        <div className="statusMsg error">
          <span className="error-block">
            <AiFillWarning /> &nbsp; No modifications to save
          </span>
        </div>
      ) : (
        ""
      )}
      <div className="pageTitle">
        <div className="childOne"></div>
        <div className="childTwo">
          <h2>Error Logs</h2>
        </div>
        <div className="childThree"></div>
      </div>
      {/* {searching ? <Loader setsearching={setsearching} /> : ""} */}
      <br />
      <div className="col-md-12">
        <div className="form-check form-check-inline">
          <input
            className="form-check-input"
            type="radio"
            id="read"
            checked={read == 1 ? true : false}
            // value={1}
            onChange={(e) => {
              setRead("1");
            }}
          />
          <label htmlFor="yes">Read</label>
        </div>
        <div className="form-check form-check-inline">
          <input
            type="radio"
            className="form-check-input"
            id="unread"
            checked={read == 0 ? true : false}
            value={read}
            onChange={(e) => {
              setRead("0");
            }}
          />
          <label htmlFor="no">Unread</label>
        </div>
      </div>
      <br />
      {/* {searching ? <Loader setsearching={setsearching} /> : ""} */}
      {loader ? (
        <div className="loaderBlock">
          <Loader handleAbort={handleAbort} />
        </div>
      ) : (
        ""
      )}
      {read == 0 ? (
        <ErrorLogTable
          data={unreaddata}
          linkColumns={linkColumns}
          linkColumnsRoutes={linkColumnsRoutes}
          dynamicColumns={dynamicColumns}
          headerData={headerData}
          setHeaderData={setHeaderData}
          rows={rows}
        />
      ) : searching ? (
        <Loader setsearching={setsearching} />
      ) : (
        <ErrorLogTable
          data={readdata}
          linkColumns={linkColumns1}
          linkColumnsRoutes={linkColumnsRoutes1}
          dynamicColumns={dynamicColumns1}
          headerData={headerData1}
          setHeaderData={setHeaderData1}
          rows={rows}
        />
      )}
      {read == 0 ? (
        <div className="row">
          <div className="col-md-12 btn-container center ">
            <button
              className="btn btn-primary mt-2 mb-2"
              onClick={handleSaveClick}
            >
              <VscSave />
              Save
            </button>
            <button
              className="btn btn-primary mt-2 mb-2"
              onClick={() => handleReset()}
            >
              <ImCross />
              Reset
            </button>
          </div>
        </div>
      ) : (
        ""
      )}
    </div>
  );
}
export default ErrorLogs;
