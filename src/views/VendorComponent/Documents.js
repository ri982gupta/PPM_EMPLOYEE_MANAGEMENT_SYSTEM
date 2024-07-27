import React, { useRef } from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import { environment } from "../../environments/environment";
import "primeicons/primeicons.css";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.css";
import "primeflex/primeflex.css";
import DownloadForOfflineRoundedIcon from "@mui/icons-material/DownloadForOfflineRounded";
import { ImCross } from "react-icons/im";
import { BsFileEarmarkPdf, BsFileEarmarkText } from "react-icons/bs";
import {
  AiFillWarning,
  AiOutlineFile,
  AiOutlineFileExcel,
  AiOutlineFileImage,
} from "react-icons/ai";
import { GrDocument } from "react-icons/gr";
import CellRendererPrimeReactDataTable from "../PrimeReactTableComponent/CellRendererPrimeReactDataTable";
import { Column } from "primereact/column";
import moment from "moment";
import { FaPlus, FaRegFileImage, FaRegFileWord, FaSave } from "react-icons/fa";
import { BiCheck } from "react-icons/bi";
import Loader from "../Loader/Loader";
import { IoWarningOutline } from "react-icons/io5";
import { TbFileText } from "react-icons/tb";
import ParentVendorTabs from "./ParentVendorTabs";
import useDynamicMaxHeight from "../PrimeReactTableComponent/useDynamicMaxHeight";

function Documents(props) {
  const { vendorData, vId, urlState, btnState, setbtnState, setUrlState } =
    props;
  const baseUrl = environment.baseUrl;
  const loggedUserId = localStorage.getItem("resId");
  const [data, setData] = useState([{}]);
  const [visible, setVisible] = useState(false);
  const [headerData, setHeaderData] = useState([]);
  const [docId, setDocId] = useState("");
  const [selectedFile, setSelectedFile] = useState([]);
  const [uploadedSucessmessage, setUploadedSucessMessage] = useState(false);
  const [validationMessage, setValidationMessage] = useState(false);
  const [validationMessageempty, setValidationMessageEempty] = useState(false);
  const [showComponent, setShowComponent] = useState(false);
  const [key, setKey] = useState(0);
  const [fileName, setFileName] = useState([]);
  const [access, setAccess] = useState([]);
  const [fileNames, setFileNames] = useState([]);
  const [loader, setLoader] = useState(false);
  const [uniqueMessage1, setUniqueMessage1] = useState(false);
  const [msg, setMsg] = useState();
  const abortController = useRef(null);
  const handleAbort = () => {
    abortController.current && abortController.current.abort();
    setLoader(false);
  };


  
  const materialTableElement = document.getElementsByClassName("pageTitle");
  const maxHeight = useDynamicMaxHeight(materialTableElement, "fixedcreate");
  document.documentElement.style.setProperty(
    "--dynamic-value",
    `${maxHeight-183}px`
  );

  let rows = 25;
  const url = window.location.href;
  const projectArr = url.split(":");
  console.log(projectArr[3]);
  // /CommonMS/master/getTabMenus?ProjectId=117&loggedUserId=4452475&type=vendor&subType=vmg
  const getAccess = (a) => {
    axios({
      method: "get",
      url:
        baseUrl +
        `/CommonMS/master/getTabMenus?ProjectId=${projectArr[3]}&loggedUserId=${loggedUserId}&type=vendor&subType=vmg`,
    })
      .then(function (response) {
        var resp = response.data;
        // resp.push({ id: "-1", name: "<<ALL>>" });
        const respData = resp.find((item) => item.display_name === "Documents");
        console.log(respData);
        const accessLevel = respData.userRoles.includes("561")
          ? 561
          : respData.userRoles.includes("932")
          ? 932
          : respData.userRoles.includes("919")
          ? 919
          : null;
        console.log(accessLevel);
        setAccess(accessLevel);
      })
      .catch(function (response) {});
  };
  useEffect(() => {
    getAccess();
  }, []);
  console.log(access);
  const getData = () => {
    axios
      .get(
         baseUrl +
         `/VendorMS/vendor/getVendorDetails?vid=${vId}&object_type_id=15`
       
      )
      .then((res) => {
        const GetData = res.data;
        const Headerdata = [
          {
            file_name: "File Name",
            file_size: "File Size",
            file_type: "File Type",
            formatted_date_created: "Created On",
            created_by: "Created By",
            formatted_last_updated: "Updated On",
            Action: "Action",
          },
        ];
        setData(Headerdata.concat(GetData));
        for (let i = 0; i < GetData.length; i++) {
          GetData[i]["file_name"] =
            GetData[i]["file_name"] == null
              ? ""
              : GetData[i]["file_name"].split(".")[0];
        }
      })
      .catch((error) => {
        console.log("Error :" + error);
      });
  };
  const [routes, setRoutes] = useState([]);
  let textContent = "Vendors";
  let currentScreenName = ["Vendors", "Documents"];

  sessionStorage.setItem(
    "breadCrumbs",
    JSON.stringify({
      routes: routes,
      currentScreenName: currentScreenName,
      textContent: textContent,
    })
  );

  const getMenus = () => {
    axios({
      method: "GET",
      url: baseUrl + `/CommonMS/master/getMenus?loggedUserId=${loggedUserId}`,
    }).then((resp) => {
      let data = resp.data;
      const updatedMenuData = data.map((category) => ({
        ...category,
        subMenus: category.subMenus.map((submenu) => {
          if (submenu.display_name === "Management") {
            return {
              ...submenu,
              display_name: "Subk Management",
            };
          }
          if (submenu.display_name === "Performance") {
            return {
              ...submenu,
              display_name: "Subk Performanace",
            };
          }
          return submenu;
        }),
      }));

      updatedMenuData.forEach((item) => {
        if (item.display_name === textContent) {
          setRoutes([item]);
          sessionStorage.setItem("displayName", item.display_name);
        }
      });
    });
  };
  useEffect(() => {
    getMenus();
    getData();
    getDocId();
    getUrlPath();
  }, []);

  useEffect(() => {
    setFileName(data.file_name);
  }, [data]);

  const getUrlPath = () => {
    axios({
      method: "get",
      url:
        baseUrl +
        `/CommonMS/security/authorize?url=${urlState}&userId=${loggedUserId}`,
    }).then((res) => {
      console.log(res, "urlResponse");
    });
  };
  const getDocId = () => {
    axios
      .get(baseUrl + `/VendorMS/vendor/getDocumentFolderID?object_id=${vId}`)
      .then((res) => {
        const data = res.data;
        setDocId(data);
      });
  };

  const getVendorFileNames = () => {
    axios
      .get(baseUrl + `/VendorMS/vendor/getVendorFileNames/?VendorId=${vId}`)
      .then((res) => {
        const data = res.data;
        setFileNames(data);
      });
  };

  useEffect(() => {
    getVendorFileNames();
  }, [vId]);

  const Upload = () => {
    setMsg(
      <div className="statusMsg success">
        <BiCheck size="1.4em" /> &nbsp;{fileName} file(s) uploaded successfully
      </div>
    );
    setUploadedSucessMessage(false);
    setValidationMessage(false);
    setValidationMessageEempty(false);
    setUniqueMessage1(false);
    let nonNullVendorNamesArr1 = fileNames?.filter((d) => d !== null);
    let someDataa1 = nonNullVendorNamesArr1?.some(
      (d) => d.file_name == fileName
    );

    if (someDataa1) {
      let ele = document.getElementsByClassName("unique1");
      for (let index = 0; index < ele.length; index++) {
        ele[index].classList.add("error-block");
      }

      setUniqueMessage1(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
      setValidationMessage(false);
      setTimeout(() => {
        setUniqueMessage1(false);
      }, 3000);
      return;
    }

    const fileInputs = document.querySelectorAll('input[type="file"]');
    const selectedFile = [];

    fileInputs.forEach((input) => {
      for (let i = 0; i < input.files.length; i++) {
        selectedFile.push(input.files[i]);
      }
    });

    if (selectedFile.length == 0) {
      setValidationMessageEempty(true);
      setUploadedSucessMessage(false);
      window.scrollTo({ top: 0, behavior: "smooth" });
      setTimeout(() => {
        setValidationMessageEempty(false);
      }, 3000);
      return;
    }

    const formData = new FormData();
    selectedFile?.forEach((file) => {
      formData.append("file", file);
    });
    const loaderTime = setTimeout(() => {
      setLoader(true);
    }, 2000);
    axios
      .post(
        baseUrl +
          `/VendorMS/vendor/updateDocumentDetails?docFolderId=${docId[0]?.id}&loggedUserId=${loggedUserId}&fileRevision=1.0&commitMessage=upload`,
        formData
      )
      .then((res) => {
        setKey((prevKey) => prevKey + 1);
        setSelectedFile([]);
        getVendorFileNames();
        const Data = res.data;
        setVisible(false);
        if (
          Data.statusMessage ===
          "may be the same file exists at the same location"
        ) {
          setValidationMessage(true);
          setUploadedSucessMessage(false);
          clearTimeout(loaderTime);
          setLoader(false);
          window.scrollTo({ top: 0, behavior: "smooth" });
          setTimeout(() => {
            setMsg();
            setValidationMessage(false);
          }, 3000);
        } else {
          setValidationMessage(false);
          setUploadedSucessMessage(true);
          window.scrollTo({ top: 0, behavior: "smooth" });
          setTimeout(() => {
            setUploadedSucessMessage(false);
          }, 3000);
          getData();
          clearTimeout(loaderTime);
          setLoader(false);
        }
      })
      .catch((error) => {});
  };

  const onFileChangeHandler = (e) => {
    setSelectedFile(e.target.files[0]);
    setFileName(e.target.files[0]?.name);
  };
  const Template = (data) => {
    return (
      <>
        <div align="center" data-toggle="tooltip" title={data.file_type}>
          {data.file_type == ".pdf" ? (
            <BsFileEarmarkPdf size={"1.5em"} style={{ color: " #2e88c5" }} />
          ) : data.file_type == ".xlsx" ? (
            <AiOutlineFileExcel size={"1.8em"} style={{ color: " #2e88c5" }} />
          ) : data.file_type == ".htm" ? (
            <GrDocument size={"1.5em"} style={{ color: " #2e88c5" }} />
          ) : data.file_type == ".txt" ? (
            <BsFileEarmarkText size={"1.5em"} style={{ color: " #2e88c5" }} />
          ) : data.file_type == ".jpeg" ? (
            <AiOutlineFileImage size={"1.5em"} style={{ color: " #2e88c5" }} />
          ) : data.file_type == ".docx" ? (
            <FaRegFileWord size={"1.5em"} style={{ color: " #2e88c5" }} />
          ) : data.file_type == ".Docx" ? (
            <AiOutlineFile size={"1.5em"} style={{ color: " #2e88c5" }} />
          ) : data.file_type == ".png" ? (
            <FaRegFileImage size={"1.5em"} style={{ color: " #2e88c5" }} />
          ) : data.file_type == ".html" ? (
            <AiOutlineFile size={"1.5em"} style={{ color: " #2e88c5" }} />
          ) : data.file_type == ".jpg" ? (
            <FaRegFileImage size={"1.5em"} style={{ color: " #2e88c5" }} />
          ) : data.file_type == ".crdownload" ? (
            <TbFileText size={"1.8em"} style={{ color: " #2e88c5" }} />
          ) : data.file_type == ".csv" ? (
            <TbFileText size={"1.8em"} style={{ color: " #2e88c5" }} />
          ) : data.file_type == ".doc" ? (
            <TbFileText size={"1.8em"} style={{ color: " #2e88c5" }} />
          ) : data.file_type == ".xls" ? (
            <TbFileText size={"1.8em"} style={{ color: " #2e88c5" }} />
          ) : (
            ""
          )}
        </div>
      </>
    );
  };

  const Action = (data) => {
    return (
      <div align="center" data-toggle="tooltip" title="Download Document">
        <DownloadForOfflineRoundedIcon
          style={{ color: "#86b558", cursor: "pointer" }}
          onClick={() => {
            handleDownload(data, `${data.file_name}${data.file_type}`);
          }}
        />
      </div>
    );
  };

  const fName = (data) => {
    return (
      <div data-toggle="tooltip" title={data.file_name} className="ellipsis">
        {data.file_name}
      </div>
    );
  };

  const fileSize = (data) => {
    return (
      <div
        data-toggle="tooltip"
        className="ellipsis"
        title={data.file_size}
        style={{ fontStyle: "italic", textAlign: "right" }}
      >
        {data.file_size}
      </div>
    );
  };

  const dateCreated = (data) => {
    return (
      <div
        data-toggle="tooltip"
        className="ellipsis"
        style={{ textAlign: "center" }}
        title={data.formatted_date_created}
      >
        {data.formatted_date_created}
      </div>
    );
  };

  const createdBy = (data) => {
    return (
      <div data-toggle="tooltip" className="ellipsis" title={data.created_by}>
        {data.created_by}
      </div>
    );
  };

  const updatedOn = (data) => {
    return (
      <div
        data-toggle="tooltip"
        className="ellipsis"
        style={{ textAlign: "center" }}
        title={data.formatted_date_created}
      >
        {data.formatted_date_created}
      </div>
    );
  };
  const dynamicColumns = Object.keys(headerData)?.map((col, i) => {
    return (
      <Column
        sortable
        key={col}
        body={
          col == "file_type"
            ? Template
            : col == "file_name"
            ? fName
            : col == "file_size"
            ? fileSize
            : col == "formatted_date_created"
            ? dateCreated
            : col == "created_by"
            ? createdBy
            : col == "formatted_last_updated"
            ? updatedOn
            : col == "Action" && Action
        }
        field={col}
        header={headerData[col]}
      />
    );
  });

  useEffect(() => {
    data[0] && setHeaderData(JSON.parse(JSON.stringify(data[0])));
  }, [data]);
  //==============For Download===========================

  const handleDownload = async (data, file_name) => {
    try {
      const response = await axios.get(
         baseUrl +
         `/VendorMS/vendor/downloadFile?documentId=${data.id}&svnRevision=${data.svn_revision}`,

        {
          responseType: "blob",
        }
      );

      const blob = new Blob([response.data], {
        type: response.headers["content-type"],
      });
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = file_name;

      document.body.appendChild(link);
      link.click();

      window.URL.revokeObjectURL(url);
      document.body.removeChild(link);
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };
  return (
    <div>
      <div className="col-md-12">
        {uniqueMessage1 ? (
          <div className="statusMsg error">
            <AiFillWarning /> {fileName} already exists in &nbsp;
            {vendorData[0]?.vendorName}
          </div>
        ) : (
          ""
        )}

        {uploadedSucessmessage && msg}
        {validationMessage && (
          <div className="statusMsg error">
            <IoWarningOutline /> &nbsp;{selectedFile?.name} &nbsp; file(s)
            already exists in &nbsp;
            {vendorData[0]?.vendorName}
          </div>
        )}
        {validationMessageempty && (
          <div className="statusMsg error">
            <IoWarningOutline /> &nbsp;Please select file(s) to upload
          </div>
        )}
        {loader ? <Loader handleAbort={handleAbort} /> : ""}

        <div className="pageTitle">
          <div className="childOne">
            <ParentVendorTabs
              btnState={btnState}
              setbtnState={setbtnState}
              setUrlState={setUrlState}
            />
          </div>
          <div className="childTwo projectcomQcr">
            <h2>Documents</h2>
          </div>
          <div className="childThree"></div>
        </div>
      </div>
      {showComponent && (
        <div className="group mb-3 customCard">
          <h2>Document Repository</h2>
        </div>
      )}
      {/* <FlatPrimeReactTable data={data} rows={rows} /> */}
      <CellRendererPrimeReactDataTable
        maxHeight = {maxHeight - 183}
        data={data}
        rows={rows}
        dynamicColumns={dynamicColumns}
        headerData={headerData}
        setHeaderData={setHeaderData}
      />
      {access == 932 || access == 919 ? (
        ""
      ) : (
        <div className="col-md-12 col-sm-12 col-xs-12 my-3 btn-container center">
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => {
              setVisible(true);
              setTimeout(function () {
                window.scrollTo({
                  top: document.body.scrollHeight,
                  behavior: "smooth",
                });
              }, 100);
            }}
            style={{ cursor: visible == true ? "not-allowed" : "" }}
          >
            {" "}
            <FaPlus />
            Add
          </button>
        </div>
      )}
      {visible && (
        <div>
          <div>
            <div className="col-md-9 my-1">
              <div
                className="statusMsg warning"
                style={{
                  fontStyle: "italic",
                  color: "#746d26",
                  fontSize: "12px",
                }}
              >
                <b>Note :</b> You can select 10 files at max.
              </div>
            </div>
            <div className="col-9 p-0">
              <table className="table table-bordered table-striped" role="grid">
                <tbody>
                  <tr>
                    <th style={{ color: "#297AB0" }}>Browse Document</th>
                  </tr>
                  <tr>
                    <td>
                      <input
                        className="unique1"
                        key={key}
                        type="file"
                        name="docId"
                        id="docId"
                        multiple
                        accept=".jpg,.jpeg,.xlsx,.pdf,.docx,.txt,.doc,.csv,.html,.png"
                        onChange={onFileChangeHandler}
                      />
                      <label className="documenttypes col-md-12">
                        <p className="error-text">
                          Supported file types
                          .pdf,.doc,.csv,.txt,.xlsx,.html,.png{" "}
                        </p>
                      </label>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className=" form-group col-md-9 col-sm-9 col-xs-9 btn-container center my-3 mb-2">
            <button className="btn btn-primary" type="submit" onClick={Upload}>
              <FaSave />
              Save
            </button>
            <button
              className="btn btn-secondary"
              onClick={() => {
                setVisible(false);
                setValidationMessage(false);
                setValidationMessageEempty(false);
                setKey((prevKey) => prevKey + 1);
                setSelectedFile([]);
                setFileName([]);
              }}
            >
              <ImCross fontSize={"11px"} /> Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
export default Documents;
