import { React, useEffect, useState } from "react";
import axios from "axios";
import { environment } from "../../environments/environment";
import { VscSave } from "react-icons/vsc";
import "primeicons/primeicons.css";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.css";
import "primeflex/primeflex.css";
import DeliveryCreate from "../DeliveryComponent/DeliveryCreate";
import CellRendererPrimeReactDataTable from "../PrimeReactTableComponent/CellRendererPrimeReactDataTable";
import { Column } from "primereact/column";
import { Link } from "react-router-dom";
import ScreenBreadcrumbs from "../Common/ScreenBreadcrumbs";
import { FaSave } from "react-icons/fa";
import useDynamicMaxHeight from "../PrimeReactTableComponent/useDynamicMaxHeight"; 
// import Loader from "../Loader/Loader";

function CustomersEngagement(props) {
  const {
    customerId,
    buttonState,
    setButtonState,
    setUrlState,
    grp1Items,
    grp2Items,
    grp3Items,
    grp4Items,
    urlState,
    mainMenu,
    // , setLoader, loader
  } = props;

  const dataObject = mainMenu.find(
    (item) => item.display_name === "Engagement"
  );

  const [data, setData] = useState([{}]);
  const [isShow, setIsShow] = useState(false);
  const [headerData, setHeaderData] = useState([]);
  const [linkColumns, setLinkColumns] = useState([]);
  const [linkColumnsRoutes, setLinkColumnsRoutes] = useState([]);
  const [customaername, setcustomername] = useState([]);
  const [cus, setCusName] = useState([]);
  const baseUrl = environment.baseUrl;
  let flag = 1;

  const loggedUserId = localStorage.getItem("resId");
  const materialTableElement = document.getElementsByClassName(
    "childTwo"
  );

  const custEngDyMaxHeight =
    useDynamicMaxHeight(materialTableElement, "fixedcreate") -46;

    console.log(custEngDyMaxHeight, "maxHeight1");
  const handleClick = () => {
    setIsShow(true);
    const setIsShowButton = document.getElementById("isShow"); // Replace "setIsShowButton" with the actual ID of your button
    const setIsShowButtonOffset = setIsShowButton.offsetTop - 80;

    setTimeout(() => {
      window.scrollTo({
        top: setIsShowButtonOffset,
        behavior: "smooth",
      });
    }, 100);
  };

  const getCustomerName = () => {
    axios({
      method: "get",
      url: baseUrl + `/customersms/Customers/getCustomerName?cid=${customerId}`,
    }).then(function (response) {
      let resp = response.data;
      setCusName(resp);
    });
  };

  const getData = () => {
    // setLoader(true);

    axios
      .get(
        baseUrl +
          `/customersms/Customers/getEngagementDetails?cid=${customerId}`
      )

      .then((res) => {
        const GetData = res.data;
        let Headercustomer = [
          {
            EngagementName: "Engagement Name",
            BusinessUnit: "Business Unit",
            division: "Division",
            CostCenter: "Cost Center",
            Manager: "Manager",
            SalesExecutive: "Sales Executive",
            ContractTerms: "Contract Terms",
            StartDate: "Start Date",
            EndDate: "End Date",
            Status: "Status",
          },
        ];

        let fdata = ["EngagementName"];
        let linkRoutes = ["/engagement/Dashboard/:engagementId"];

        setLinkColumns(fdata);
        setLinkColumnsRoutes(linkRoutes);

        setData(Headercustomer.concat(GetData));

        setcustomername(GetData);
        // setLoader(false);
      });
  };
  useEffect(() => {
    getData();
    getCustomerName();
  }, [customerId, customaername[0]?.customerName]);

  const LinkTemplate = (data) => {
    let rou = linkColumnsRoutes[0]?.split(":");
    return (
      <>
        <Link
          style={{
            align: "center",
            whiteSpace: "nowrap !important",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
          data-toggle="tooltip"
          to={rou[0] + ":" + data[rou[1]]}
          title={data[linkColumns]}
          target="_blank"
        >
          {data[linkColumns]}
        </Link>
      </>
    );
  };

  const Businessemplate = (data) => {
    return (
      <div
        className="ellipsis"
        align="left"
        data-toggle="tooltip"
        title={data.BusinessUnit}
      >
        {data.BusinessUnit}
      </div>
    );
  };

  const dpToolip = (data) => {
    return (
      <div
        className="ellipsis"
        align="left"
        data-toggle="tooltip"
        title={data.CostCenter}
      >
        {data.CostCenter}
      </div>
    );
  };
  const engNameToolip = (data) => {
    return (
      <div
        className="ellipsis"
        align="left"
        data-toggle="tooltip"
        title={data.Manager}
      >
        {data.Manager}
      </div>
    );
  };
  const projectToolip = (data) => {
    return (
      <div
        className="ellipsis"
        align="left"
        data-toggle="tooltip"
        title={data.SalesExecutive}
      >
        {data.SalesExecutive}
      </div>
    );
  };

  const emailToolip = (data) => {
    const centerAlignStyle = {
      textAlign: "center",
    };

    return (
      <div
        style={centerAlignStyle}
        className="ellipsis"
        data-toggle="tooltip"
        title={data.StartDate}
      >
        {data.StartDate}
      </div>
    );
  };

  const resStDtAlign = (data) => {
    return (
      <div align="left" data-toggle="tooltip" title={data.ContractTerms}>
        {data.ContractTerms}
      </div>
    );
  };
  const resEndDtAlign = (data) => {
    const centerAlignStyle = {
      textAlign: "center",
    };

    return (
      <div
        style={centerAlignStyle}
        align="left"
        data-toggle="tooltip"
        title={data.EndDate}
      >
        {data.EndDate}
      </div>
    );
  };

  const monthDtAlign = (data) => {
    return (
      <div align="left" data-toggle="tooltip" title={data.Status}>
        {data.Status}
      </div>
    );
  };
  const revenueAlign = (data) => {
    return (
      <div align="left" data-toggle="tooltip" title={data.division}>
        {data.division}
      </div>
    );
  };

  const dynamicColumns = Object.keys(headerData)?.map((col, i) => {
    return (
      <Column
        sortable
        key={col}
        body={
          col == "EngagementName"
            ? LinkTemplate
            : col == "BusinessUnit"
            ? Businessemplate
            : col == "division"
            ? revenueAlign
            : col == "CostCenter"
            ? dpToolip
            : col == "Manager"
            ? engNameToolip
            : col == "SalesExecutive"
            ? projectToolip
            : col == "ContractTerms"
            ? resStDtAlign
            : col == "StartDate"
            ? emailToolip
            : col == "EndDate"
            ? resEndDtAlign
            : col == "Status" && monthDtAlign
        }
        field={col}
        header={headerData[col]}
      />
    );
  });

  useEffect(() => {
    data[0] && setHeaderData(JSON.parse(JSON.stringify(data[0])));
  }, [data]);

  const [routes, setRoutes] = useState([]);
  let textContent = "Customers";
  let currentScreenName = ["Planning", "Engagements"];
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
        `/CommonMS/security/authorize?url=${urlState}&userId=${loggedUserId}`,
    }).then((res) => {
      console.log(res, "urlResponse");
    });
  };

  return (
    <div className="engagement-screen-margin">
      {/* {loader ? (
        <div className="loaderBlock">
          <Loader />
        </div>
      ) : (
        ""
      )} */}
      <div className="col-md-12">
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
            <h2>Engagements</h2>
          </div>
          <div className="childThree"></div>
        </div>
      </div>

      <div className="mb-2 ">
        <CellRendererPrimeReactDataTable
          CustomersFileName = "CustomersEngagement"
          custEngDyMaxHeight = {custEngDyMaxHeight}
          data={data}
          rows={25}
          linkColumns={linkColumns}
          linkColumnsRoutes={linkColumnsRoutes}
          dynamicColumns={dynamicColumns}
          headerData={headerData}
          setHeaderData={setHeaderData}
        />
      </div>

      <div>
        {dataObject?.is_write == true ? (
          <button
            id="isShow"
            onClick={handleClick}
            className="btn btn-primary"
            type="submit"
          >
            <FaSave /> New Engagement
          </button>
        ) : (
          ""
        )}
      </div>

      {isShow == true ? (
        <DeliveryCreate
          flag={flag}
          getData={getData}
          customerName={customaername[0]?.customerName}
          customerId={customerId}
          isShow={isShow}
          setIsShow={setIsShow}
        />
      ) : (
        ""
      )}
    </div>
  );
}
export default CustomersEngagement;
