import React from "react";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { MdOutlinePlaylistAdd } from "react-icons/md";
import { AiFillDelete } from "react-icons/ai";
import { ImCross } from "react-icons/im";
import { BiCheck } from "react-icons/bi";
import CustomerTechnologyPopUp from "./CustomerTechnologyPopUp.";
import { CModal, CModalHeader, CModalBody, CModalTitle } from "@coreui/react";
import CellRendererPrimeReactDataTable from "../PrimeReactTableComponent/CellRendererPrimeReactDataTable";
import { Column } from "primereact/column";
import Draggable from "react-draggable";
import { environment } from "../../environments/environment";
import Loader from "../Loader/Loader";
import ScreenBreadcrumbs from "../Common/ScreenBreadcrumbs";
import { FaPlus } from "react-icons/fa";

function CustomerTechnology(props) {
  const {
    customerId,
    mainMenu,
    urlState,
    buttonState,
    setUrlState,
    setButtonState,
    grp1Items,
    grp2Items,
    grp3Items,
    grp4Items,
  } = props;
  const dataObject = mainMenu.find(
    (item) => item.display_name === "Technology"
  );

  const [data, setData] = useState([]);
  const [buttonPopup, setButtonPopup] = useState(false);
  const [deletePopup, setDeletePopup] = useState(false);
  const [headerData, setHeaderData] = useState([]);
  const [linkColumns, setLinkColumns] = useState([]);
  const [linkColumnsRoutes, setLinkColumnsRoutes] = useState([]);
  const [addmsg, setAddmsg] = useState(false);
  const [deleteMessage, setDeleteMessage] = useState(false);
  const [deleteid, setDeleteId] = useState("");
  const [searching, setsearching] = useState(false);
  const [custName, setCustName] = useState([]);

  const abortController = useRef(null);

  const baseUrl = environment.baseUrl;
  let rows = 10;
  const handleAbort = () => {
    abortController.current && abortController.current.abort();
    setsearching(false);
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

  const system_function = (data) => {
    return (
      <div
        className="ellipsis"
        data-toggle="tooltip"
        title={data.system_function}
      >
        {data.system_function}
      </div>
    );
  };
  const software = (data) => {
    return (
      <div className="ellipsis" data-toggle="tooltip" title={data.software}>
        {data.software}
      </div>
    );
  };
  const platform = (data) => {
    return (
      <div className="ellipsis" data-toggle="tooltip" title={data.platform}>
        {data.platform}
      </div>
    );
  };
  const service_vendor = (data) => {
    return (
      <div
        className="ellipsis"
        data-toggle="tooltip"
        title={data.service_vendor}
      >
        {data.service_vendor}
      </div>
    );
  };
  const future_plans = (data) => {
    return (
      <div className="ellipsis" data-toggle="tooltip" title={data.future_plans}>
        {data.future_plans}
      </div>
    );
  };
  const competitor_notes = (data) => {
    return (
      <div
        className="ellipsis"
        data-toggle="tooltip"
        title={data.competitor_notes}
      >
        {data.competitor_notes}
      </div>
    );
  };

  const gettabledata = () => {
    setsearching(false);
    abortController.current = new AbortController();

    axios({
      url:
        baseUrl +
        `/customersms/Customers/getCustomerTechnology?cid=${customerId}`,
      signal: abortController.current.signal,
    }).then((resp) => {
      let tabledata = resp.data;
      for (let i = 0; i < tabledata.length; i++) {
        tabledata[i]["SNo"] = i + 1;
      }
      let header = [
        {
          SNo: "S.No ",
          system_function: "System or Function",
          software: "Software",
          platform: "Platform",
          service_vendor: "Service Vendor",
          future_plans: "Future Plans",
          competitor_notes: "Competitor Notes",
          Action: "Action",
        },
      ];
      setData(header.concat(tabledata));
      setTimeout(() => {
        setsearching(false);
      }, 1000);
    });
  };

  useEffect(() => {
    gettabledata();
  }, []);

  const getCustomer = () => {
    axios({
      method: "get",
      url: baseUrl + `/customersms/Customers/getProjectName?cid=${customerId}`,
    }).then(function (response) {
      var resp = response.data;
      setCustName(resp);
    });
  };
  useEffect(() => {
    getCustomer();
  }, []);
  const LeftAlign = (data) => {
    return <div align="center">{data.SNo}</div>;
  };

  const LinkTemplate = (data) => {
    return (
      <>
        <div align="center">
          <AiFillDelete
            color="orange"
            cursor="pointer"
            onClick={() => {
              setDeletePopup(true);
              setDeleteId(data.id);
            }}
            style={{ align: "Center" }}
          />
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
            (col === "system_function" && system_function) ||
            (col === "software" && software) ||
            (col === "platform" && platform) ||
            (col === "service_vendor" && service_vendor) ||
            (col === "future_plans" && future_plans) ||
            (col === "competitor_notes" && competitor_notes)
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
        col === "system_function" ||
        col === "software" ||
        col === "platform" ||
        col === "service_vendor" ||
        col === "future_plans" ||
        col === "competitor_notes"
      ) {
        return (
          <Column
            sortable
            key={col}
            body={
              (col === "SNo" && SNo) ||
              (col === "Action" && LinkTemplate) ||
              (col === "system_function" && system_function) ||
              (col === "software" && software) ||
              (col === "platform" && platform) ||
              (col === "service_vendor" && service_vendor) ||
              (col === "future_plans" && future_plans) ||
              (col === "competitor_notes" && competitor_notes)
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

  const deleteTechnology = () => {
    axios({
      method: "delete",
      url:
        baseUrl +
        `/customersms/Customers/deleteCustomerTechnology?id=${deleteid}`,
    }).then((error) => {
      setDeletePopup(false);
      gettabledata();
      setDeleteMessage(true);
      setTimeout(() => {
        setDeleteMessage(false);
      }, 3000);
    });
  };

  function DeletePopup(props) {
    const { deletePopup, setDeletePopup } = props;

    return (
      <div>
        <Draggable>
          <CModal
            visible={deletePopup}
            size="m"
            className="ui-dialog "
            backdrop="static"
            onClose={() => setDeletePopup(false)}
          >
            <CModalHeader className="hgt22">
              <CModalTitle>
                <span className="ft16">Delete Technology</span>
              </CModalTitle>
            </CModalHeader>
            <CModalBody>
              <h6>Are you sure you want to delete Technology ?</h6>
              <div className="btn-container center my-2">
                <button
                  type="delete"
                  className="btn btn-primary"
                  onClick={() => {
                    deleteTechnology();
                  }}
                >
                  <AiFillDelete />
                  Delete
                </button>

                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => {
                    setDeletePopup(false);
                  }}
                >
                  <ImCross />
                  Cancel
                </button>
              </div>
            </CModalBody>
          </CModal>
        </Draggable>
      </div>
    );
  }
  const [routes, setRoutes] = useState([]);
  let textContent = "Customers";
  let currentScreenName = ["Monitoring", "Technology"];
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
        `/CommonMS/security/authorize?url=/customer/customerTechnology/&userId=${loggedUserId}`,
    }).then((res) => {
      console.log(res, "urlResponse");
    });
  };
  return (
    <div>
      {deleteMessage ? (
        <div className="statusMsg success">
          <span className="errMsg">
            <BiCheck /> &nbsp;Technology Deleted successfully
          </span>
        </div>
      ) : (
        ""
      )}

      {addmsg ? (
        <div className="statusMsg success">
          <span>
            <BiCheck /> &nbsp;Technology Saved successfully
          </span>
        </div>
      ) : (
        ""
      )}
      <div className="pageTitle">
        <div className="childOne">
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
          <h2>Technology</h2>
        </div>
        <div className="childThree"></div>
      </div>

      <div className="group mb-5 customCard">
        {dataObject.is_write == true ? (
          <div className="row">
            <div className="col-md-11 mt-2 mb-2"></div>
            <div className="col-md-1">
              <button
                onClick={() => {
                  setButtonPopup(true);
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
        <CellRendererPrimeReactDataTable
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
        <CustomerTechnologyPopUp
          buttonPopup={buttonPopup}
          setButtonPopup={setButtonPopup}
          gettabledata={gettabledata}
          setAddmsg={setAddmsg}
          customerId={customerId}
        />
      ) : (
        ""
      )}
      {searching ? <Loader handleAbort={handleAbort} /> : ""}

      {deletePopup ? (
        <DeletePopup
          deletePopup={deletePopup}
          setDeletePopup={setDeletePopup}
        />
      ) : (
        ""
      )}
    </div>
  );
}

export default CustomerTechnology;
