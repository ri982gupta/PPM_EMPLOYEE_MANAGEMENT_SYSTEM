import React from "react";
import "../../App.scss";
import { useState, useEffect } from "react";
import axios from "axios";
import { environment } from "../../environments/environment";
import FlatPrimeReactTable from "../PrimeReactTableComponent/FlatPrimeReactTable";
import { FaUpload } from "react-icons/fa";
import CellRendererPrimeReactDataTable from "../PrimeReactTableComponent/CellRendererPrimeReactDataTable";
import { Column } from "primereact/column";
import { Link } from "react-router-dom";
import moment from "moment";
import ReleaseNotesUpdatePopup from "./ReleaseNotesUpdatePopup";
import { AiFillDelete, AiFillWarning } from "react-icons/ai";
import Loader from "../Loader/Loader";
import { AiOutlineCheck } from "react-icons/ai";
import { AiOutlineClose } from "react-icons/ai";
import { CModal, CModalBody, CModalHeader, CModalTitle } from "@coreui/react";
import { BiError } from "react-icons/bi";
import useDynamicMaxHeight from "../PrimeReactTableComponent/useDynamicMaxHeight";


function ReleaseNotes(props) {
  const [data, setData] = useState([{}]);
  const baseUrl = environment.baseUrl;
  const [custName, setCustName] = useState(false);
  const [loader, setLoader] = useState(false);
  const [deletePopup, setDeletePopup] = useState(false);
  const [deletedId, setDeletedId] = useState([]);
  const [deleteMsg, setDeleteMsg] = useState(false);

  let rows = 20;
  const [headerData, setHeaderData] = useState([]);
  const [linkColumns, setLinkColumns] = useState([]);
  const [folder, setFolder] = useState();
  const [errorMsg, setErrorMsg] = useState(false);

  const materialTableElement = document.getElementsByClassName(
    "childOne"
  );

  const maxHeight1 = useDynamicMaxHeight(materialTableElement, "fixedcreate") -46;
  document.documentElement.style.setProperty(
    "--dynamic-value",
    String(maxHeight1 -79) + "px"
  );

  const LinkTemplate = (data) => {
    setFolder(data.doc_folder_id);
    return (
      <>
        <Link
          style={{ cursor: "pointer" }}
          onClick={() => {
            downloadEmployeeData(data);
          }}
          title={data.file_name}
          data-toggle="tooltip"
        >
          {" "}
          {data[linkColumns[0]]}
        </Link>
      </>
    );
  };
  const Align = (data) => {
    return <div Align="center">{data.S_No}</div>;
  };
  const AlignRight = (data) => {
    return <div Align="right">{data.version_number}</div>;
  };

  const Toggletooltip = (data) => {
    return (
      <div
        data-toggle="tooltip"
        style={{ textAlign: "center" }}
        title={moment(data.release_date).format("DD-MMM-yyyy")}
      >
        {moment(data.release_date).format("DD-MMM-yyyy")}
      </div>
    );
  };

  const [routes, setRoutes] = useState([]);
  let textContent = "Release Notes";
  let currentScreenName = ["Release Notes"];

  sessionStorage.setItem(
    "breadCrumbs",
    JSON.stringify({
      routes: routes,
      currentScreenName: currentScreenName,
      textContent: textContent,
    })
  );

  // const getBreadCrumbs = () => {
  //   axios({
  //     method: "GET",
  //     url: baseUrl + `/CommonMS/master/getMenus?loggedUserId=${loggedUserId}`,
  //   }).then((resp) => {
  //     let data = resp.data;

  //     data.forEach((item) => {
  //       if (item.display_name === textContent) {
  //         setRoutes([item]);
  //         sessionStorage.setItem("displayName", "Release Notes");
  //       }
  //     });
  //   });
  // };

  useEffect(() => {
    let breadCrumbsData = [
      {
        display_name: "Help",
        icon_name: "",
        subMenus: [
          {
            url_path: "::help::ReleaseNotes",
            display_name: "Release Notes",
          },
          {
            url_path: "::help::helpContents",
            display_name: "Help Contents",
          },
        ],
      },
    ];
    setRoutes(breadCrumbsData);
    sessionStorage.setItem("displayName", "Release Notes");
  }, []);

  const DateCreated = (data) => {
    return (
      <div
        data-toggle="tooltip"
        style={{ textAlign: "center" }}
        title={
          data.date_created == null
            ? ""
            : moment(data.date_created).format("DD-MMM-yyyy")
        }
      >
        {data.date_created == null
          ? ""
          : moment(data.date_created).format("DD-MMM-yyyy")}
      </div>
    );
  };

  const ActionIcons = (data) => {
    return (
      <div style={{ textAlign: "center" }}>
        {" "}
        <AiFillDelete
          color="orange"
          style={{ cursor: "pointer" }}
          title={"Delete Row"}
          onClick={() => {
            issueDeleteHandler(data);
          }}
        />
      </div>
    );
  };
  const dynamicColumns = Object.keys(headerData)?.map((col, i) => {
    return (
      <Column
        sortable
        key={col}
        body={
          col == "file_name"
            ? LinkTemplate
            : col == "S_No"
            ? Align
            : col == "version_number"
            ? AlignRight
            : col == "release_date"
            ? Toggletooltip
            : col == "date_created"
            ? DateCreated
            : col == "action" && ActionIcons
        }
        field={col}
        header={headerData[col]}
      />
    );
  });
  const [dataAccess, setDataAccess] = useState([]);
  const loggedUserId = localStorage.getItem("resId");
  const getMenus = () => {
    axios
      .get(
        baseUrl +
          `/ProjectMS/project/getuserRoleTypes?loggedUserId=${loggedUserId}`
      )
      .then((resp) => {
        const data = resp.data;
        setDataAccess(data[+1]?.role_type_id);
      });
  };

  useEffect(() => {
    getMenus();
  }, [dataAccess]);
  const downloadEmployeeData = async (data) => {
    try {
      const response = await axios.get(
        baseUrl +
          `/CommonMS/document/downloadFile?documentId=${data?.document_id}&svnRevision=${data.svn_revision}`,
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
      link.download = data.file_name;

      document.body.appendChild(link);
      link.click();

      window.URL.revokeObjectURL(url);
      document.body.removeChild(link);
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };

  useEffect(() => {
    data[0] && setHeaderData(JSON.parse(JSON.stringify(data[0])));
  }, [data]);

  const getData = () => {
    axios
      .get(baseUrl + `/supportms/support/getHelpReleseNotes`)
      // axios.get(``)
      .then((res) => {
        const GetData = res.data;
        GetData.forEach((GetData, index) => {
          GetData["S_No"] = index + 1;
          GetData["id"] = index;
        });
        let dataHeader = [
          {
            S_No: "S.No",
            version_number: "Version Number",
            created_by: "Created By",
            date_created: "Created Date",
            file_name: "Release Notes",
            release_date: "Release Date",
            //  ...dataAccess==908? action: "Action":"",
            ...(dataAccess == 908 && { action: "Action" }),
          },
        ];

        let data = ["file_name"];

        setLinkColumns(data);

        let fData = [...dataHeader, ...GetData];
        setData(fData);
      })
      .catch((error) => {});
  };

  useEffect(() => {
    getData();
    // getCustomer();
  }, []);
  const issueDeleteHandler = (data) => {
    setDeletePopup(true);
    setDeletedId(data.ID);
  };
  const deleteAction = () => {
    axios
      .delete(baseUrl + `/supportms/support/deleteReleaseNotes?id=${deletedId}`)
      .then((res) => {
        const del = res.data;
        getData();

        setDeleteMsg(true);
        setTimeout(() => {
          setDeleteMsg(false);
        }, 3000);
      });
  };
  const handleClick = () => {
    setErrorMsg(false);
    setCustName(true);
  };
  const handleAbort = () => {
    abortController.current && abortController.current.abort();
    setLoader(false);
  };
  function ReleaseNotesDeletePopup(props) {
    const { deletePopup, setDeletePopup, deleteAction } = props;
    return (
      <div className="deletePopUpReviewLog">
        {/* <Draggable> */}
        <CModal
          visible={deletePopup}
          size="sm"
          className="ui-dialog"
          onClose={() => setDeletePopup(false)}
        >
          <CModalHeader style={{ cursor: "all-scroll" }}>
            <CModalTitle>
              <span className="">Delete Confirmation</span>
            </CModalTitle>
          </CModalHeader>
          <CModalBody>
            <span style={{ textAlign: "center" }}>
              Are you sure you want to delete the Action Item ?
            </span>
            <div className="col-md-12 col-sm-12 col-xs-12 btn-container center my-3">
              <button
                // style={{ border: "1px solid black" }}
                type="delete"
                className="btn btn-primary" // onClick={deleteAction}
                onClick={() => {
                  deleteAction();
                  setDeletePopup(false);
                }}
              >
                <AiOutlineCheck />
                Yes{" "}
              </button>
              <button
                // style={{ border: "1px solid black" }}
                type="button"
                className="btn btn-primary"
                onClick={() => {
                  setDeletePopup(false);
                }}
              >
                <AiOutlineClose />
                No{" "}
              </button>
            </div>
          </CModalBody>
        </CModal>
        {/* </Draggable> */}
      </div>
    );
  }
  return (
    <div>
      {loader ? (
        <div className="loaderBlock">
          <Loader handleAbort={handleAbort} />
        </div>
      ) : (
        ""
      )}
      <div className="col-md-12 mb-2">
        <div className="pageTitle">
          <div className="childOne"></div>
          <div className="childTwo">
            <h2>Release Notes </h2>
          </div>
          <div className="childThree"></div>
        </div>
      </div>

      <div className="customCard">
        {deleteMsg ? (
          <div className="statusMsg success">
            <span className="errMsg">
              <BiError />
              &nbsp; Deleted successfully
            </span>
          </div>
        ) : (
          ""
        )}
        {dataAccess == 908 && (
          <div className="col-md-12">
            <div className="col-2 mb-2">
              <button
                id="upload"
                name="upload"
                className="btn btn-primary"
                onClick={() => handleClick()}
              >
                <FaUpload />
                Upload
              </button>
            </div>
          </div>
        )}
        {errorMsg == true ? (
          <div className="statusMsg error">
            <AiFillWarning /> Document is not available
          </div>
        ) : (
          ""
        )}
        <CellRendererPrimeReactDataTable
          data={data}
          linkColumns={linkColumns}
          // linkColumnsRoutes={linkColumnsRoutes}
          dynamicColumns={dynamicColumns}
          headerData={headerData}
          setHeaderData={setHeaderData}
          rows={25}
          CustomersFileName = "Help RelaseNotes"
          HelpReleaseNotesDynamicMaxHgt = {maxHeight1}
        />
      </div>
      {custName ? (
        <ReleaseNotesUpdatePopup
          custName={custName}
          setCustName={setCustName}
          getData={getData}
          // document={document}
          folder={folder}
          data={data}
          setLoader={setLoader}
          loader={loader}
        />
      ) : (
        ""
      )}
      {deletePopup ? (
        <ReleaseNotesDeletePopup
          deletePopup={deletePopup}
          setDeletePopup={setDeletePopup}
          deleteAction={deleteAction}
        />
      ) : (
        ""
      )}
    </div>
  );
}

export default ReleaseNotes;
