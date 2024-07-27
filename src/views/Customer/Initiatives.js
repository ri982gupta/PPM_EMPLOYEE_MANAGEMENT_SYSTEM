import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import {
  AiFillDelete,
  AiFillEdit,
  AiFillWarning,
  AiOutlineFileSearch,
} from "react-icons/ai";
import { MdOutlinePlaylistAdd } from "react-icons/md";
import { environment } from "../../environments/environment";
import "primeicons/primeicons.css";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.css";
import "primeflex/primeflex.css";
import { Column } from "primereact/column";
import CellRendererPrimeReactDataTable from "../PrimeReactTableComponent/CellRendererPrimeReactDataTable";
import InitiativePopup from "./InitiativePopup";
import { CModalHeader } from "@coreui/react";
import { CModalBody } from "@coreui/react";
import { CButton } from "@coreui/react";
import { CModal } from "@coreui/react";
import Draggable from "react-draggable";
import { CModalTitle } from "@coreui/react";
import { BiCheck } from "react-icons/bi";
import { color, Pointer } from "highcharts";
import { ImCross } from "react-icons/im";
import ErrorLogTable from "../Administration/ErrorLogsTable";
import ScreenBreadcrumbs from "../Common/ScreenBreadcrumbs";
import { FaPlus } from "react-icons/fa";

function Initiatives(props) {
  let rows = 25;
  const {
    customerId,
    mainMenu,
    filteredData,
    urlState,
    setUrlState,
    setButtonState,
    buttonState,
    grp1Items,
    grp2Items,
    grp3Items,
    grp4Items,
  } = props;
  const dataObject = mainMenu.find(
    (item) => item.display_name === "Initiatives"
  );

  const [data, setData] = useState([{}]);
  //const rows=10;
  const [addmsg, setAddmsg] = useState(false);
  const [editmsg, setEditAddmsg] = useState(false);
  const [value, setValue] = useState("");
  const baseUrl = environment.baseUrl;
  const [buttonPopups, setButtonPopups] = useState(false);
  const [buttonPopup, setButtonPopup] = useState(false);
  const [headerData, setHeaderData] = useState([]);
  const [linkColumns, setLinkColumns] = useState([]);
  const [linkColumnsRoutes, setLinkColumnsRoutes] = useState([]);
  const [type, setType] = useState("add");
  const [editedData, setEditedData] = useState([]);
  const [editId, setEditId] = useState();
  const [deletePopup, setDeletePopup] = useState(false);
  const [deleteMessage, setDeleteMessage] = useState(false);
  const [deleteid, setDeleteId] = useState("");
  const data1 = {
    id: null,
    initiative: "",
    functionArea: "",
    curStatus: "",
    innTech: "",
    cusStake: "",
    primObj: "",
    des: "",
  };
  const [formData, setFormData] = useState(data1);
  useEffect(() => {}, [editedData]);
  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const loggedUserId = localStorage.getItem("resId");

  const SNo = (data) => {
    return (
      <div
        className="ellipsis"
        align="center"
        data-toggle="tooltip"
        title={data.SNo}
      >
        {data.SNo}
      </div>
    );
  };

  const initiatives = (data) => {
    return (
      <div className="ellipsis" data-toggle="tooltip" title={data.Initiative}>
        {data.Initiative}
      </div>
    );
  };
  const functionArea = (data) => {
    return (
      <div className="ellipsis" data-toggle="tooltip" title={data.FunctionArea}>
        {data.FunctionArea}
      </div>
    );
  };
  const curStatus = (data) => {
    return (
      <div className="ellipsis" data-toggle="tooltip" title={data.CurStatus}>
        {data.CurStatus}
      </div>
    );
  };
  const innTech = (data) => {
    return (
      <div className="ellipsis" data-toggle="tooltip" title={data.InnTech}>
        {data.InnTech}
      </div>
    );
  };
  const cusStake = (data) => {
    return (
      <div className="ellipsis" data-toggle="tooltip" title={data.CusStake}>
        {data.CusStake}
      </div>
    );
  };
  const primObj = (data) => {
    return (
      <div className="ellipsis" data-toggle="tooltip" title={data.PrimObj}>
        {data.PrimObj}
      </div>
    );
  };
  const des = (data) => {
    return (
      <div className="ellipsis" data-toggle="tooltip" title={data.Des}>
        {data.Des}
      </div>
    );
  };

  const getData = () => {
    axios
      .get(
        baseUrl +
          `/customersms/initiatives/getInitiativesDetails?Iid=${customerId}`
      )
      // axios.get(``)
      .then((res) => {
        const GetData = res.data;
        for (let i = 0; i < GetData.length; i++) {
          GetData[i]["SNo"] = i + 1;
        }

        let dataHeaders = [
          {
            SNo: "S.No",
            Initiative: "Initiatives",
            FunctionArea: "Function Area",
            CurStatus: "Current Status",
            InnTech: "Innovative Technology",
            CusStake: "Customer Stakeholders",
            PrimObj: "Primary Objective",
            Des: "Description",
            Action: "Action",
          },
        ];

        let data = ["Action"];
        setLinkColumns(data);

        setData(dataHeaders.concat(GetData));
      })
      .catch((error) => {});
  };
  useEffect(() => {
    getData();
  }, []);

  //-----------
  const LinkTemplate = (data) => {
    let rou = linkColumns[0];
    return (
      <>
        <div align="center">
          <>
            <AiFillEdit
              color="orange"
              cursor="pointer"
              type="edit"
              size="1.2em"
              title="Edit"
              onClick={() => {
                setEditedData(data);
                setEditId(data.id);
                setButtonPopup(true);
                setType("edit");
              }}
              align="center"
            />
            &nbsp;
            <AiFillDelete
              color="orange"
              cursor="pointer"
              type="delete"
              title="Delete"
              onClick={() => {
                setDeletePopup(true);
                setType("delete");
                setDeleteId(data.id);
              }}
              align="center"
            />
          </>
        </div>
      </>
    );
  };
  const dynamicColumns = Object.keys(headerData)?.map((col, i) => {
    // Check the value of dataObject.is_write
    if (dataObject.is_write) {
      // Include all columns if dataObject.is_write is true
      return (
        <Column
          sortable
          key={col}
          body={
            (col === "SNo" && SNo) ||
            (col === "Action" && LinkTemplate) ||
            (col === "Initiative" && initiatives) ||
            (col === "FunctionArea" && functionArea) ||
            (col === "CurStatus" && curStatus) ||
            (col === "InnTech" && innTech) ||
            (col === "CusStake" && cusStake) ||
            (col === "PrimObj" && primObj) ||
            (col === "Des" && des)
          }
          field={col}
          header={headerData[col]}
        />
      );
    } else {
      // Include only certain columns if dataObject.is_write is false
      // You can modify this condition to include the columns you want
      if (
        col === "SNo" ||
        col === "Initiative" ||
        col === "FunctionArea" ||
        col === "CurStatus" ||
        col === "InnTech" ||
        col === "CusStake" ||
        col === "PrimObj" ||
        col === "Des"
      ) {
        return (
          <Column
            sortable
            key={col}
            body={
              (col === "SNo" && SNo) ||
              (col === "Action" && LinkTemplate) ||
              (col === "Initiative" && initiatives) ||
              (col === "FunctionArea" && functionArea) ||
              (col === "CurStatus" && curStatus) ||
              (col === "InnTech" && innTech) ||
              (col === "CusStake" && cusStake) ||
              (col === "PrimObj" && primObj) ||
              (col === "Des" && des)
            }
            field={col}
            header={headerData[col]}
          />
        );
      } else {
        return null; // Exclude other columns
      }
    }
  });

  useEffect(() => {
    data[0] && setHeaderData(JSON.parse(JSON.stringify(data[0])));
  }, [data]);

  //-------------------------
  const deleteInitiative = () => {
    axios({
      method: "delete",
      url:
        baseUrl + `/customersms/initiatives/deleteintiativedata?id=${deleteid}`,
      // data: id
    }).then((error) => {
      // setid(0);
      getData();
      setDeletePopup(false);
      setDeleteMessage(true);
      setTimeout(() => {
        setDeleteMessage(false);
      }, 3000);
    });
  };

  //-----------------
  function DeletePopup(props) {
    const { deletePopup, setDeletePopup, editId, deleteid } = props;
    return (
      <div>
        {/* <Draggable> */}
        <CModal
          visible={deletePopup}
          size="m"
          className=" ui-dialog"
          onClose={() => setDeletePopup(false)}
          backdrop={"static"}
        >
          <CModalHeader className="hgt22">
            <CModalTitle>
              <span className="ft16">Delete Initiative</span>
            </CModalTitle>
          </CModalHeader>
          <CModalBody>
            <h6>Are you sure you want to Delete Initiative ?</h6>
            <div className="btn-container center my-2">
              <button
                type="delete"
                className="btn btn-primary"
                onClick={() => {
                  deleteInitiative();
                }}
              >
                <AiFillDelete /> Delete{" "}
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => {
                  setDeletePopup(false);
                }}
              >
                <ImCross /> Cancel{" "}
              </button>
            </div>
          </CModalBody>
        </CModal>
        {/* </Draggable> */}
      </div>
    );
  }

  const [routes, setRoutes] = useState([]);
  let textContent = "Customers";
  let currentScreenName = ["Monitoring", "Initiatives"];
  sessionStorage.setItem(
    "breadCrumbs",
    JSON.stringify({
      routes: routes,
      currentScreenName: currentScreenName,
      textContent: textContent,
    })
  );

  useEffect(() => {
    getMenus();
    getUrlPath();
  }, []);

  const getMenus = () => {
    // setMenusData

    axios({
      method: "GET",
      url: baseUrl + `/CommonMS/master/getMenus?loggedUserId=${loggedUserId}`,
    }).then((resp) => {
      let data = resp.data;
      const updatedMenuData = data.map((category) => ({
        ...category,
        subMenus: category.subMenus.filter(
          (submenu) => submenu.display_name !== "Financial Plan & Review"
        ),
      }));
      updatedMenuData.forEach((item) => {
        if (item.display_name === textContent) {
          setRoutes([item]);
          sessionStorage.setItem("displayName", item.display_name);
        }
      });
    });
  };
  const getUrlPath = () => {
    axios({
      method: "get",
      url:
        baseUrl +
        `/CommonMS/security/authorize?url=/customer/custInitiatives/&userId=${loggedUserId}`,
    }).then((res) => {
      console.log(res, "urlResponse");
    });
  };
  return (
    <div>
      {deleteMessage ? (
        <div className="statusMsg success">
          <span className="errMsg">
            <BiCheck size="1.4em" strokeWidth={{ width: "100px" }} />{" "}
            &nbsp;Initiative deleted successfully
          </span>
        </div>
      ) : (
        ""
      )}

      {addmsg ? (
        <div className="statusMsg success">
          <span className="errMsg">
            <BiCheck size="1.4em" strokeWidth={{ width: "100px" }} /> &nbsp;
            Initiative saved successfully
          </span>
        </div>
      ) : (
        ""
      )}

      {editmsg ? (
        <div className="statusMsg success">
          <span className="errMsg">
            <BiCheck size="1.4em" strokeWidth={{ width: "100px" }} /> &nbsp;
            Initiative upadated successfully
          </span>
        </div>
      ) : (
        ""
      )}
      <div className="col-md-12">
        <div className="pageTitle">
          <div className="childOne">
            {/* <h2>Prolifics</h2> */}
            <ul className="tabsContainer">
              <li>
                {/* {grp1Items[0]?.display_name != undefined ? (
                  <span>{grp1Items[0]?.display_name}</span>
                ) : (
                  ""
                )} */}
                {grp1Items[0]?.display_name != undefined ? (
                  <span>{grp1Items[0]?.display_name}</span>
                ) : (
                  ""
                )}
                <ul>
                  {grp1Items.slice(1).map((button) => (
                    <li
                      className={
                        buttonState === button.display_name
                          ? "buttonDisplayClick"
                          : "buttonDisplay"
                      }
                      onClick={() => {
                        setButtonState(button.display_name);
                        setUrlState(
                          button.url_path.toString().replace(/::/g, "/")
                        );
                      }}
                    >
                      {button.display_name}
                    </li>
                  ))}
                </ul>
              </li>{" "}
              <li>
                {grp2Items[0]?.display_name != undefined ? (
                  <span>{grp2Items[0]?.display_name}</span>
                ) : (
                  ""
                )}
                {/* <span>Planning</span> */}
                <ul>
                  {grp2Items.slice(1).map((button) => (
                    <li
                      className={
                        buttonState === button.display_name
                          ? "buttonDisplayClick"
                          : "buttonDisplay"
                      }
                      onClick={() => {
                        setButtonState(button.display_name);
                        setUrlState(
                          button.url_path.toString().replace(/::/g, "/")
                        );
                      }}
                    >
                      {button.display_name}
                    </li>
                  ))}
                </ul>
              </li>{" "}
              <li>
                {grp3Items[0]?.display_name != undefined ? (
                  <span>{grp3Items[0]?.display_name}</span>
                ) : (
                  ""
                )}
                {/* <span>Monitoring</span> */}
                <ul>
                  {grp3Items.slice(1).map((button) => (
                    <li
                      className={
                        buttonState === button.display_name
                          ? "buttonDisplayClick"
                          : "buttonDisplay"
                      }
                      onClick={() => {
                        setButtonState(button.display_name);
                        setUrlState(
                          button.url_path.toString().replace(/::/g, "/")
                        );
                      }}
                    >
                      {button.display_name}
                    </li>
                  ))}
                </ul>
              </li>{" "}
              <li>
                {grp4Items[0]?.display_name != undefined ? (
                  <span>{grp4Items[0]?.display_name}</span>
                ) : (
                  ""
                )}
                {/* <span>Financials</span> */}
                <ul>
                  {grp4Items.slice(1).map((button) => (
                    <li
                      className={
                        buttonState === button.display_name
                          ? "buttonDisplayClick"
                          : "buttonDisplay"
                      }
                      onClick={() => {
                        setButtonState(button.display_name);
                        setUrlState(
                          button.url_path.toString().replace(/::/g, "/")
                        );
                      }}
                    >
                      {button.display_name}
                    </li>
                  ))}
                </ul>
              </li>
            </ul>
          </div>
          <div className="childTwo">
            <h2>Initiatives</h2>
          </div>
          <div className="childThree"></div>
        </div>

        {dataObject.is_write == true ? (
          <div className="row">
            <div className="col-md-11"></div>
            <div className="col-md-1">
              <button
                onClick={() => {
                  setButtonPopup(true);
                  setType("add");
                }}
                className="btn btn-primary mt-2 mb-2"
              >
                <FaPlus />
                Add
              </button>
            </div>
          </div>
        ) : (
          ""
        )}

        {/* <FlatPrimeReactTable data={data} rows={rows} /> */}
        <ErrorLogTable
          data={data}
          linkColumns={linkColumns}
          linkColumnsRoutes={linkColumnsRoutes}
          dynamicColumns={dynamicColumns}
          headerData={headerData}
          setHeaderData={setHeaderData}
          rows={rows}
        />
      </div>

      {buttonPopup ? (
        <InitiativePopup
          // handleSaveClick={handleSaveClick}
          handleChange={handleChange}
          formData={formData}
          setFormData={formData}
          editId={editId}
          setEditedData={setEditedData}
          editedData={editedData}
          type={type}
          getData={getData}
          data1={data1}
          setAddmsg={setAddmsg}
          setEditAddmsg={setEditAddmsg}
          customerId={customerId}
          data={data}
          buttonPopup={buttonPopup}
          setButtonPopup={setButtonPopup}
        />
      ) : (
        ""
      )}

      {deletePopup ? (
        <DeletePopup
          editId={editId}
          deletePopup={deletePopup}
          setDeletePopup={setDeletePopup}
        />
      ) : (
        ""
      )}
      <br />
    </div>
  );
}
export default Initiatives;
