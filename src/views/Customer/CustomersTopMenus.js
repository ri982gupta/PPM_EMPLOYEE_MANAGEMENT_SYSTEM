// ******************** This code is for when we are refresh at a particular Tab, it should be with in that Tab ***********************
import React, { useState, useEffect } from "react";
import AccountPlan from "./AccountPlan";
import Financials from "./Financials";
import QBR from "./QBR";
import Projects from "./Projects";
import Initiatives from "./Initiatives";
import CustomerRisks from "./CustomerRisks";
import RelationshipHeatmap from "./RelationShipHeapMap";
import CustomersEngagement from "./CustomersEngagement";
import Documents from "./Documents";
import DataTable from "react-data-table-component";
import CustomerTechnology from "./CustomerTechnology";
import { Column } from "primereact/column";
import { AiFillWarning } from "react-icons/ai";
import Customerdashboard from "./Customerdashboard";
import axios from "axios";
import CellRendererPrimeReactDataTable from "../PrimeReactTableComponent/CellRendererPrimeReactDataTable";
import { environment } from "../../environments/environment";
import CustomerEdit from "./CustomerEdit";

function CustomersTopMenus() {
  let topMenus = [
    "Dashboard",
    "Edit",
    "Documents",
    "Engagement",
    "Projects",
    "Financials",
    "Account Plan",
    "Technology",
    "Risks",
    "Initiatives",
    "Relationship Heatmap",
    "QBR",
  ];

  const [customerId, setCustomerId] = useState(0);
  // const [customerData, setCustomerData] = useState([]);
  const baseUrl = environment.baseUrl;
  const [mainMenu, setMainMenu] = useState([]);
  const [grp1Items, setGrp1Items] = useState([]);
  const [grp2Items, setGrp2Items] = useState([]);
  const [grp3Items, setGrp3Items] = useState([]);
  const [grp4Items, setGrp4Items] = useState([]);
  const loggedUserId = localStorage.getItem("resId");
  let url = window.location.href;

  let customerArr1 = url.split(":");
  let projectId = customerArr1[customerArr1.length - 1];

  const [buttonState, setButtonState] = useState(topMenus[0]);
  console.log(buttonState);
  const [filteredData1, setFilteredData1] = useState([]);
  // const [buttonState, setButtonState] = useState(() => {
  //   // Retrieve the last selected button state from localStorage on component mount
  //   return localStorage.getItem("customerButtonState")?.split("+")[1] === customerArr[customerArr.length - 1] ? localStorage.getItem("customerButtonState").split("+")[0] : topMenus[0] ?? topMenus[0];
  // });

  const tabMenus = () => {
    axios
      .get(
        baseUrl +
          `/CommonMS/master/getTabMenus?ProjectId=${projectId}&loggedUserId=${loggedUserId}&type=Customer&subType=customer`
      )
      .then((resp) => {
        const dataNew = resp.data;
        const filteredArray = dataNew.filter(
          (item) => item.display_name !== "Activity"
        );
        console.log(resp.data);
        setGrp1Items(
          dataNew.filter(
            (item) =>
              item.grp === 1 &&
              item.display_name != "Activity" &&
              item.display_name != "Roles"
          )
        );
        setGrp2Items(
          dataNew.filter((item) => item.grp === 2 && item != "Services")
        );
        setGrp3Items(dataNew.filter((item) => item.grp === 3));
        setGrp4Items(dataNew.filter((item) => item.grp === 4));
        // const filteredArray = grp1Items.filter(
        //   (item) => item.display_name !== "Activity"
        // );

        // Update the state with the filtered data
        setFilteredData1(filteredArray);
        const data = resp.data.filter((menu) => {
          return !["Roles", "Activity", "Services", "Create"].includes(
            menu.display_name
          );
        });
        console.log(data);
        setMainMenu(data);
      });
  };
  console.log(grp1Items);
  console.log(grp2Items);
  console.log(grp3Items);
  console.log(grp4Items);
  console.log(filteredData1);
  useEffect(() => {
    tabMenus();
    if (url.includes("dashboard")) {
      setButtonState("Dashboard");
    }

    // if (url.includes("engagement")) {
    //   setButtonState("Engagement");
    // }
    let customerArr = url.split(":");
    setCustomerId(customerArr[customerArr.length - 1]);
    let projectId = customerArr[customerArr.length - 1];
  }, []);

  const filterDuplicates = (mainMenu) => {
    const seenDisplayNames = new Set();
    return mainMenu.filter((item) => {
      if (seenDisplayNames.has(item.display_name)) {
        return false; // Duplicate display_name, exclude this item
      }
      seenDisplayNames.add(item.display_name);
      return true; // Unique display_name, include this item
    });
  };

  // useEffect(() => {
  //   // Save the selected tab to localStorage whenever it changes
  //   localStorage.setItem("customerButtonState", buttonState + "+" +customerArr[customerArr.length - 1]);
  // }, [buttonState]);

  const getCustomererviewData = () => {
    axios({
      method: "get",
      url:
        baseUrl +
        `/customersms/Customers/getCustomersdashboard?cid=${customerId}`,
    }).then(function (response) {
      let resp = response.data;
      setCustomerData(resp);
    });
  };
  useEffect(() => {
    getCustomererviewData();
  }, [customerId]);

  const filteredData = filterDuplicates(mainMenu);
  const [urlState, setUrlState] = useState("/customer/dashboard");
  // const { customerId, urlState } = props;

  // const baseUrl = environment.baseUrl;
  const [currency, setCurrency] = useState([]);
  // const [mainMenu, setMainMenu] = useState([]);
  const [customerData, setCustomerData] = useState([]);
  const [customerDataDivision, setCustomerDataDivision] = useState([]);
  const [customerDatainterstake, setCustomerDatainterstake] = useState([]);
  const [customerDatarole, setCustomerDatarole] = useState([]);
  const [customerDataextstake, setCustomerDataextstake] = useState([]);
  const [data, setData] = useState([]);
  const [headerData, setHeaderData] = useState([]);
  const [headerDatastakeHolders, setHeaderDatastakeholders] = useState([]);
  const [headerDataInternal, setHeaderDataInternal] = useState([]);
  // let url = window.location.href;
  let customerArr = url.split(":");
  const tabMenus1 = () => {
    axios
      .get(
        baseUrl +
          `/CommonMS/master/getTabMenus?ProjectId=${
            customerArr[customerArr.length - 1]
          }&loggedUserId=${loggedUserId}&type=Customer&subType=customer`
      )
      .then((resp) => {
        const data = resp.data;

        setMainMenu(data);
      })
      .catch((err) => {});
  };
  useEffect(() => {
    tabMenus1();
  }, []);
  const addressstake = (data) => {
    return (
      <div
        className="ellipsis"
        align="left"
        data-toggle="tooltip"
        title={data.address}
      >
        {data.address}
      </div>
    );
  };
  const cityoolipstake = (data) => {
    return (
      <div
        className="ellipsis"
        align="left"
        data-toggle="tooltip"
        title={data.name}
      >
        {data.name}
      </div>
    );
  };
  const country_nameeAlignstake = (data) => {
    return (
      <div
        className="ellipsis"
        align="left"
        data-toggle="tooltip"
        title={data.type}
      >
        {data.type}
      </div>
    );
  };
  const stateToolipstake = (data) => {
    return (
      <div
        className="ellipsis"
        align="left"
        data-toggle="tooltip"
        title={data.email}
      >
        {data.email}
      </div>
    );
  };
  const customer_idToolipstake = (data) => {
    return (
      <div
        className="ellipsis"
        align="left"
        data-toggle="tooltip"
        title={data.division}
      >
        {data.division}
      </div>
    );
  };
  const contactAlignstake = (data) => {
    return (
      <div
        className="ellipsis"
        align="left"
        data-toggle="tooltip"
        title={data.phone}
      >
        {data.phone}
      </div>
    );
  };
  const dynamicColumnsstakeholders = Object.keys(headerDatastakeHolders)?.map(
    (col, i) => {
      return (
        <Column
          sortable
          key={col}
          field={col}
          header={headerDatastakeHolders[col]}
          body={
            col == "address"
              ? addressstake
              : col == "name"
              ? cityoolipstake
              : col == "type"
              ? country_nameeAlignstake
              : col == "email"
              ? stateToolipstake
              : col == "division"
              ? customer_idToolipstake
              : col == "phone" && contactAlignstake
          }
        />
      );
    }
  );
  const Internalid = (data) => {
    return (
      <div
        className="ellipsis"
        align="left"
        data-toggle="tooltip"
        title={data.id3}
      >
        {data.id3}
      </div>
    );
  };
  const typeIDFunction = (data) => {
    return (
      <div
        className="ellipsis"
        align="left"
        data-toggle="tooltip"
        title={data.type_id}
      >
        {data.type_id}
      </div>
    );
  };
  const phoneAlignstake = (data) => {
    return (
      <div
        className="ellipsis"
        align="left"
        data-toggle="tooltip"
        title={data.phone}
      >
        {data.phone}
      </div>
    );
  };
  const businessunitToolipstake = (data) => {
    return (
      <div
        className="ellipsis"
        align="left"
        data-toggle="tooltip"
        title={data.businessunit}
      >
        {data.businessunit}
      </div>
    );
  };
  const sresourceIdToolipstake = (data) => {
    return (
      <div
        className="ellipsis"
        align="left"
        data-toggle="tooltip"
        title={data.resource_id}
      >
        {data.resource_id}
      </div>
    );
  };
  const firstNameNTERNAL = (data) => {
    return (
      <div
        className="ellipsis"
        align="left"
        data-toggle="tooltip"
        title={data.firstName}
      >
        {data.firstName}
      </div>
    );
  };
  const addressnternL = (data) => {
    return (
      <div
        className="ellipsis"
        align="left"
        data-toggle="tooltip"
        title={data.address}
      >
        {data.address}
      </div>
    );
  };
  const aemailinternal = (data) => {
    return (
      <div
        className="ellipsis"
        align="left"
        data-toggle="tooltip"
        title={data.email}
      >
        {data.email}
      </div>
    );
  };
  const dynamicColumnsInternal = Object.keys(headerDataInternal)?.map(
    (col, i) => {
      return (
        <Column
          sortable
          key={col}
          field={col}
          header={headerDataInternal[col]}
          body={
            col == "email"
              ? aemailinternal
              : col == "address"
              ? addressnternL
              : col == "firstName"
              ? firstNameNTERNAL
              : col == "resource_id"
              ? sresourceIdToolipstake
              : col == "businessunit"
              ? businessunitToolipstake
              : col == "id3"
              ? Internalid
              : col == "phone"
              ? phoneAlignstake
              : col == "type_id" && typeIDFunction
          }
        />
      );
    }
  );
  const getCustomersRoles = () => {
    if (customerId != 0) {
      axios({
        method: "get",
        url:
          baseUrl +
          `/customersms/Customers/getCustomersroles?cid=${customerId}`,
      }).then(function (response) {
        let resp = response.data;

        let desp = [...new Set(resp.map((d) => d.display_name))];

        let dt = [];

        for (let i = 0; i < desp.length; i++) {
          let obj = {};
          obj["display_name"] = desp[i];

          let countriesData = JSON.parse(JSON.stringify(resp)).filter(
            (d) => d.display_name == desp[i]
          );

          let countriesNames = [
            "",
            "Canada",
            "Germany",
            "India",
            "Jordan",
            "UAE",
            "UK",
            "US",
          ];

          let sortedData = [];

          for (let j = 0; j < countriesNames.length; j++) {
            let obj = {
              display_name: "",
              cost: "",
              rate: "",
              country_name: "",
              countryid: "",
            };

            if (
              countriesData.some(
                (d) => d["country_name"] == countriesNames[j]
              ) == false
            ) {
              obj["country_name"] = countriesNames[j];
              sortedData.push(obj);
            } else {
              for (let k = 0; k < countriesData.length; k++) {
                if (
                  countriesNames[j].includes(countriesData[k]["country_name"])
                ) {
                  sortedData.push(countriesData[k]);
                }
              }
            }
          }

          obj["data"] = sortedData;
          dt.push(obj);
        }

        setCustomerDatarole(dt);
      });
    }
  };

  const getCustomersinternalStakeHOLDER = () => {
    if (customerId != 0) {
      axios({
        method: "get",
        url:
          baseUrl +
          `/customersms/Customers/getCustomersinternalstakeholders?cid=${customerId}`,
      }).then(function (response) {
        let tabledata = response.data;
        let header = [
          {
            firstName: "Name",
            businessunit: "BU ",
            type_id: "Type",
            address: "Address",
            phone: "Phone",
            email: "Email",
          },
        ];
        let data = [...header, ...tabledata];
        setCustomerDatainterstake(data);
      });
    }
  };

  useEffect(() => {
    customerDatainterstake[0] &&
      setHeaderDataInternal(
        JSON.parse(JSON.stringify(customerDatainterstake[0]))
      );
  }, [customerDatainterstake]);
  const getCustomersExtStakeHOLDER = () => {
    if (customerId != 0) {
      axios({
        method: "get",
        url:
          baseUrl +
          `/customersms/Customers/getCustomersextstakeholders?cid=${customerId}`,
      }).then(function (response) {
        let tabledata = response.data;
        let header = [
          {
            name: "Name",
            division: "Division",
            type: "Type",
            address: "Address",
            phone: "Phone",
            email: "Email",
          },
        ];
        let data = [...header, ...tabledata];
        setCustomerDataextstake(data);
      });
    }
  };

  useEffect(() => {
    customerDataextstake[0] &&
      setHeaderDatastakeholders(
        JSON.parse(JSON.stringify(customerDataextstake[0]))
      );
  }, [customerDataextstake]);

  const address = (data) => {
    return (
      <div
        className="ellipsis"
        align="left"
        data-toggle="tooltip"
        title={data.address}
      >
        {data.address}
      </div>
    );
  };
  const cityoolip = (data) => {
    return (
      <div
        className="ellipsis"
        align="left"
        data-toggle="tooltip"
        title={data.city}
      >
        {data.city}
      </div>
    );
  };
  const country_nameeAlign = (data) => {
    return (
      <div
        className="ellipsis"
        align="left"
        data-toggle="tooltip"
        title={data.country_name}
      >
        {data.country_name}
      </div>
    );
  };
  const stateToolip = (data) => {
    return (
      <div
        className="ellipsis"
        align="left"
        data-toggle="tooltip"
        title={data.state}
      >
        {data.state}
      </div>
    );
  };
  const customer_idToolip = (data) => {
    return (
      <div
        className="ellipsis"
        align="left"
        data-toggle="tooltip"
        title={data.customer_id}
      >
        {data.customer_id}
      </div>
    );
  };
  const contactAlign = (data) => {
    return (
      <div
        className="ellipsis"
        align="left"
        data-toggle="tooltip"
        title={data.contact}
      >
        {data.contact}
      </div>
    );
  };
  const zip_codeToolip = (data) => {
    return (
      <div
        className="ellipsis"
        align="left"
        data-toggle="tooltip"
        title={data.zip_code}
      >
        {data.zip_code}
      </div>
    );
  };
  const nameAlign = (data) => {
    return (
      <div
        className="ellipsis"
        align="left"
        data-toggle="tooltip"
        title={data.name}
      >
        {data.name}
      </div>
    );
  };
  const dynamicColumns = Object.keys(headerData)?.map((col, i) => {
    return (
      <Column
        sortable
        key={col}
        field={col}
        header={headerData[col]}
        body={
          col == "address"
            ? address
            : col == "city"
            ? cityoolip
            : col == "country_name"
            ? country_nameeAlign
            : col == "state"
            ? stateToolip
            : col == "customer_id"
            ? customer_idToolip
            : col == "contact"
            ? contactAlign
            : col == "zip_code "
            ? zip_codeToolip
            : col == "name" && nameAlign
        }
      />
    );
  });
  const getCustomersDivisionData = () => {
    axios
      .get(
        baseUrl +
          `/customersms/Customers/getCustomersdashboarddivision?cid=${customerId}`
      )
      .then((response) => {
        const data = response.data;
        const Headerdata = [
          {
            name: "Name",
            address: "Address Line",
            country_name: "Country",
            state: "State/Province",
            city: "City",
            zip_code: "ZIP/Postal Code",
            contact: "Contact Number",
          },
        ];
        let hData = [];
        let bData = [];
        data.map((element, index) => {
          if (index < 0) {
            hData.push(response.data[index]);
          } else {
            bData.push(response.data[index]);
          }
        });
        setData(Headerdata.concat(bData));
        setCustomerDataDivision(data);
      });
    // setTimeout(() => {
    //   setLoaderState(false);
    // }, 1000);
  };
  useEffect(() => {
    data[0] && setHeaderData(JSON.parse(JSON.stringify(data[0])));
    // let imp = ["XLS"];
    // setExportData(imp);
  }, [data]);
  // const getCustomererviewData = () => {
  //   if (props.customerId != 0) {
  //     axios({
  //       method: "get",
  //       url:
  //         baseUrl +
  //         `/customersms/Customers/getCustomersdashboard?cid=${props.customerId}`,
  //     }).then(function (response) {
  //       let resp = response.data;
  //       setCustomerData(resp);
  //     });
  //   }
  // };

  const handleCurrency = () => {
    axios({
      method: "get",
      url: baseUrl + `/ProjectMS/Engagement/getCurrency`,
    }).then((res) => {
      let curre = res.data;
      setCurrency(curre);
    });
  };
  useEffect(() => {
    getCustomersDivisionData();
    getCustomererviewData();
    getCustomersinternalStakeHOLDER();
    getCustomersExtStakeHOLDER();
    getCustomersRoles();
    handleCurrency();
  }, [customerId]);

  const representativeBodyTemplate = (rowData) => {
    return <span>{rowData.display_name}</span>;
  };
  const tooltipText = data.length;

  const representativeBody = (rowData) => {
    return (
      <span>
        <table class="table table-bordered table-striped">
          <tbody>
            <tr>
              {rowData?.data?.map((ele, index) => {
                return <th className="antiquewhite"> {ele.country_name}</th>;
              })}
            </tr>

            <tr>
              {rowData?.data?.map((ele, index) => {
                return (
                  <>
                    {index === 0 ? (
                      <td>
                        <b>Billing</b>
                        <br />
                        <b>Rate/Hr</b>
                      </td>
                    ) : (
                      <td>{ele.rate}</td>
                    )}
                  </>
                );
              })}
            </tr>
            <tr>
              {rowData?.data?.map((ele, index) => {
                return (
                  <>
                    {index === 0 ? (
                      <td>
                        <b>Cost/Hr</b>
                      </td>
                    ) : (
                      <td>{ele.cost}</td>
                    )}
                  </>
                );
              })}
            </tr>
          </tbody>
        </table>
      </span>
    );
  };

  // const loggedUserId = localStorage.getItem("resId");

  const [routes, setRoutes] = useState([]);
  let textContent = "Customers";
  let currentScreenName = ["Overview"];
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
    <div>
      {mainMenu.length > 0 ? (
        <div>
          <div className=" tabs">
            {/* {mainMenu.map((button) => (
              <button
                key={button.id}
                className={
                  buttonState === button.display_name?.toString()
                    ? "buttonDisplayClick"
                    : "buttonDisplay"
                }
                onClick={() => {
                  // window.location.reload();
                  setButtonState(button.display_name?.toString());
                  setUrlState(button.url_path?.toString().replace(/::/g, "/"));
                }}
              >
                {/* clg */}

            {/* {button.display_name}
              </button>
            ))} */}
          </div>
          {buttonState === "Documents" && (
            <Documents
              customerId={customerId}
              mainMenu={mainMenu}
              urlState={urlState}
              setUrlState={setUrlState}
              buttonState={buttonState}
              setButtonState={setButtonState}
              grp1Items={grp1Items}
              grp2Items={grp2Items}
              grp3Items={grp3Items}
              grp4Items={grp4Items}
            />
          )}
          {buttonState === "Edit" && (
            <CustomerEdit
              customerId={customerId}
              customerData={customerData}
              getCustomererviewData={getCustomererviewData}
              mainMenu={mainMenu}
              setButtonState={setButtonState}
              urlState={urlState}
              setUrlState={setUrlState}
              buttonState={buttonState}
              grp1Items={grp1Items}
              grp2Items={grp2Items}
              grp3Items={grp3Items}
              grp4Items={grp4Items}
            />
          )}
          {buttonState === "Operations" && (
            <Financials
              customerId={customerId}
              mainMenu={mainMenu}
              urlState={urlState}
              setUrlState={setUrlState}
              buttonState={buttonState}
              grp1Items={grp1Items}
              setButtonState={setButtonState}
              grp2Items={grp2Items}
              grp3Items={grp3Items}
              grp4Items={grp4Items}
            />
          )}
          {buttonState === "Account Plan" && (
            <AccountPlan
              customerId={customerId}
              mainMenu={mainMenu}
              urlState={urlState}
              setUrlState={setUrlState}
              buttonState={buttonState}
              grp1Items={grp1Items}
              setButtonState={setButtonState}
              grp2Items={grp2Items}
              grp3Items={grp3Items}
              grp4Items={grp4Items}
            />
          )}
          {buttonState === "QBR" && (
            <QBR
              customerId={customerId}
              filteredData={filteredData}
              mainMenu={mainMenu}
              urlState={urlState}
              setUrlState={setUrlState}
              buttonState={buttonState}
              grp1Items={grp1Items}
              setButtonState={setButtonState}
              grp2Items={grp2Items}
              grp3Items={grp3Items}
              grp4Items={grp4Items}
            />
          )}
          {buttonState === "Risks" && (
            <CustomerRisks
              customerId={customerId}
              mainMenu={mainMenu}
              urlState={urlState}
              setUrlState={setUrlState}
              buttonState={buttonState}
              setButtonState={setButtonState}
              grp1Items={grp1Items}
              grp2Items={grp2Items}
              grp3Items={grp3Items}
              grp4Items={grp4Items}
            />
          )}
          {buttonState === "Projects" && (
            <Projects
              customerId={customerId}
              mainMenu={mainMenu}
              urlState={urlState}
              setUrlState={setUrlState}
              setButtonState={setButtonState}
              buttonState={buttonState}
              grp1Items={grp1Items}
              grp2Items={grp2Items}
              grp3Items={grp3Items}
              grp4Items={grp4Items}
            />
          )}
          {buttonState === "Initiatives" && (
            <Initiatives
              customerId={customerId}
              mainMenu={mainMenu}
              urlState={urlState}
              setUrlState={setUrlState}
              buttonState={buttonState}
              setButtonState={setButtonState}
              grp1Items={grp1Items}
              grp2Items={grp2Items}
              grp3Items={grp3Items}
              grp4Items={grp4Items}
            />
          )}
          {buttonState === "Relationship Heatmap" && (
            <RelationshipHeatmap
              customerId={customerId}
              mainMenu={mainMenu}
              urlState={urlState}
              setUrlState={setUrlState}
              buttonState={buttonState}
              grp1Items={grp1Items}
              setButtonState={setButtonState}
              grp2Items={grp2Items}
              grp3Items={grp3Items}
              grp4Items={grp4Items}
            />
          )}
          {buttonState === "Engagement" && (
            <CustomersEngagement
              customerId={customerId}
              mainMenu={mainMenu}
              // loader={loader}
              // setLoader={setLoader}
              urlState={urlState}
              setUrlState={setUrlState}
              buttonState={buttonState}
              setButtonState={setButtonState}
              grp1Items={grp1Items}
              grp2Items={grp2Items}
              grp3Items={grp3Items}
              grp4Items={grp4Items}
            />
          )}
          {buttonState === "Engagements" && (
            <CustomersEngagement
              customerId={customerId}
              mainMenu={mainMenu}
              // loader={loader}
              // setLoader={setLoader}
              urlState={urlState}
              setUrlState={setUrlState}
              buttonState={buttonState}
              setButtonState={setButtonState}
              grp1Items={grp1Items}
              grp2Items={grp2Items}
              grp3Items={grp3Items}
              grp4Items={grp4Items}
            />
          )}
          {buttonState === "Technology" && (
            <CustomerTechnology
              customerId={customerId}
              mainMenu={mainMenu}
              urlState={urlState}
              setUrlState={setUrlState}
              buttonState={buttonState}
              setButtonState={setButtonState}
              grp1Items={grp1Items}
              grp2Items={grp2Items}
              grp3Items={grp3Items}
              grp4Items={grp4Items}
            />
          )}
          {buttonState === "Dashboard" && (
            // <Customerdashboard
            //   customerId={customerId}
            //   mainMenu={mainMenu}
            //   urlState={urlState}
            // />
            <div>
              {/* <div className="group mb-5 customCard"> */}
              {/* <div className="col-md-12"> */}
              {/* <div className="pageTitle" align="center"> */}
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
                    <h2>Overview</h2>
                  </div>
                  <div className="childThree"></div>
                </div>
              </div>
              {/* </div> */}
              <div className="customCard card graph mt-2 mb-2">
                <div className="group-content row">
                  <div className=" col-md-12 mb-2">
                    {customerData.map((list) => (
                      <div className="group-content row mx-2 mt-2">
                        <div className=" col-md-4 mb-2">
                          <div className="form-group row">
                            <label
                              className="col-5"
                              htmlFor="text-input-inline"
                            >
                              Customer Name
                            </label>
                            <span className="col-1">:</span>
                            <div className="col-6">
                              <p
                                className=" calenderTable"
                                data-toggle="tooltip"
                                title={list.customerName}
                              >
                                {list.customerName == null
                                  ? "NA"
                                  : list.customerName}
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className=" col-md-4 mb-2">
                          <div className="form-group row">
                            <label
                              className="col-5"
                              htmlFor="text-input-inline"
                            >
                              Project Category
                            </label>
                            <span className="col-1">:</span>
                            <div className="col-6">
                              <p
                                className=" ellipsis tooltip-ex"
                                data-toggle="tooltip"
                                title={list.projectcategory}
                              >
                                {list.projectcategory === null
                                  ? "NA"
                                  : list.projectcategory}
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className=" col-md-4 mb-2">
                          <div className="form-group row">
                            <label
                              className="col-5"
                              htmlFor="text-input-inline"
                            >
                              Industry type
                            </label>
                            <span className="col-1">:</span>
                            <div className="col-6">
                              <p
                                className=" ellipsis tooltip-ex"
                                data-toggle="tooltip"
                                title={list.IndustryType}
                              >
                                {list.IndustryType === null
                                  ? "NA"
                                  : list.IndustryType}
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className=" col-md-4 mb-2">
                          <div className="form-group row">
                            <label
                              className="col-5"
                              htmlFor="text-input-inline"
                            >
                              Phone
                            </label>
                            <span className="col-1">:</span>
                            <div className="col-6">
                              <p
                                className=" ellipsis tooltip-ex"
                                data-toggle="tooltip"
                                title={list.phone}
                              >
                                {list.phone === null ? "NA" : list.phone}
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className=" col-md-4 mb-2">
                          <div className="form-group row">
                            <label
                              className="col-5"
                              htmlFor="text-input-inline"
                            >
                              Website
                            </label>
                            <span className="col-1">:</span>
                            <div className="col-6">
                              <p
                                className=" ellipsis tooltip-ex"
                                data-toggle="tooltip"
                                title={list.website}
                              >
                                {list.website === null ? "NA" : list.website}
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className=" col-md-4 mb-2">
                          <div className="form-group row">
                            <label
                              className="col-5"
                              htmlFor="text-input-inline"
                            >
                              Customer Status
                            </label>
                            <span className="col-1">:</span>
                            <div className="col-6">
                              <p
                                className=" ellipsis tooltip-ex"
                                data-toggle="tooltip"
                                title={list.customerstatus}
                              >
                                {list.customerstatus == null
                                  ? "NA"
                                  : list.customerstatus}
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className=" col-md-4 mb-2">
                          <div className="form-group row">
                            <label
                              className="col-5"
                              htmlFor="text-input-inline"
                            >
                              Sales Territory
                            </label>
                            <span className="col-1">:</span>
                            <div className="col-6">
                              <p
                                className=" ellipsis tooltip-ex"
                                data-toggle="tooltip"
                                title={list.salesterritory}
                              >
                                {list.salesterritory == null
                                  ? "NA"
                                  : list.salesterritory}
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className=" col-md-4 mb-2">
                          <div className="form-group row">
                            <label
                              className="col-5"
                              htmlFor="text-input-inline"
                            >
                              Sales Executive
                            </label>
                            <span className="col-1">:</span>
                            <div className="col-6">
                              <p
                                className=" ellipsis tooltip-ex"
                                data-toggle="tooltip"
                                title={list.name}
                              >
                                {list.name == null ? "-" : list.name}
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className=" col-md-4 mb-2">
                          <div className="form-group row">
                            <label
                              className="col-5"
                              htmlFor="text-input-inline"
                            >
                              Client Partner
                            </label>
                            <span className="col-1">:</span>
                            <div className="col-6">
                              <p
                                className=" ellipsis tooltip-ex"
                                data-toggle="tooltip"
                                title={list.clientpartner}
                              >
                                {list.clientpartner == null
                                  ? "-"
                                  : list.clientpartner}
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className=" col-md-4 mb-2">
                          <div className="form-group row">
                            <label
                              className="col-5"
                              htmlFor="text-input-inline"
                            >
                              Engagement Partner
                            </label>
                            <span className="col-1">:</span>
                            <div className="col-6">
                              <p
                                className=" ellipsis tooltip-ex"
                                data-toggle="tooltip"
                                title={list.engagementpartner}
                              >
                                {list.engagementpartner === null
                                  ? "-"
                                  : list.engagementpartner}
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className=" col-md-4 mb-2">
                          <div className="form-group row">
                            <label
                              className="col-5"
                              htmlFor="text-input-inline"
                            >
                              Country
                            </label>
                            <span className="col-1">:</span>
                            <div className="col-6">
                              <p
                                className=" ellipsis tooltip-ex"
                                data-toggle="tooltip"
                                title={list.country_name}
                              >
                                {list.country_name == null
                                  ? "-"
                                  : list.country_name}
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className=" col-md-4 mb-2">
                          <div className="form-group row">
                            <label
                              className="col-5"
                              htmlFor="text-input-inline"
                            >
                              Customer Email
                            </label>
                            <span className="col-1">:</span>
                            <div className="col-6">
                              <p
                                className=" ellipsis tooltip-ex"
                                data-toggle="tooltip"
                                title={list.customeremail}
                              >
                                {list.customeremail == null
                                  ? "NA"
                                  : list.customeremail}
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className=" col-md-4 mb-2">
                          <div className="form-group row">
                            <label
                              className="col-5"
                              htmlFor="text-input-inline"
                            >
                              Classification
                            </label>
                            <span className="col-1">:</span>
                            <div className="col-6">
                              <p
                                className=" ellipsis tooltip-ex"
                                data-toggle="tooltip"
                                title={list.classification}
                              >
                                {list.classification == null
                                  ? "NA"
                                  : list.classification}
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className=" col-md-4 mb-2">
                          <div className="form-group row">
                            <label
                              className="col-5"
                              htmlFor="text-input-inline"
                            >
                              SF Account Link
                            </label>
                            <span className="col-1">:</span>
                            <div className="col-6">
                              <p className=" ellipsis tooltip-ex">
                                {/* {list.sf_account_link == null ? (
                                "NA"
                              ) : (
                                <Link
                                  to={`/customer/dashboard/:${list.customer_id}`}
                                  target="_blank"
                                > */}{" "}
                                {list.sfAccountLink}
                                {/* </Link>
                              )} */}
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className=" col-md-4 mb-2">
                          <div className="form-group row">
                            <label
                              className="col-5"
                              htmlFor="text-input-inline"
                            >
                              CSL Head
                            </label>
                            <span className="col-1">:</span>
                            <div className="col-6">
                              <p
                                className=" ellipsis tooltip-ex"
                                data-toggle="tooltip"
                                title={list.cslHead}
                              >
                                {list.cslHead == null ? "-" : list.cslHead}
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className=" col-md-4 mb-2">
                          <div className="form-group row">
                            <label
                              className="col-5"
                              htmlFor="text-input-inline"
                            >
                              CSL
                            </label>
                            <span className="col-1">:</span>
                            <div className="col-6">
                              <p
                                className=" ellipsis tooltip-ex"
                                data-toggle="tooltip"
                                title={list.cslName}
                              >
                                {list.cslName == null ? "-" : list.cslName}
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className=" col-md-4 mb-2">
                          <div className="form-group row">
                            <label
                              className="col-5"
                              htmlFor="text-input-inline"
                            >
                              Associate CSL
                            </label>
                            <span className="col-1">:</span>
                            <div className="col-6">
                              <p
                                className=" ellipsis tooltip-ex"
                                data-toggle="tooltip"
                                title={list.AssociateCSL}
                              >
                                {list.AssociateCSL == null
                                  ? "-"
                                  : list.AssociateCSL}
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className=" col-md-4 mb-2">
                          <div className="form-group row">
                            <label
                              className="col-5"
                              htmlFor="text-input-inline"
                            >
                              Delivery Partner Head
                            </label>
                            <span className="col-1">:</span>
                            <div className="col-6">
                              <p
                                className=" ellipsis tooltip-ex"
                                data-toggle="tooltip"
                                title={list.deliverypartnerHead}
                              >
                                {list.deliverypartnerHead == null
                                  ? "-"
                                  : list.deliverypartnerHead}
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className=" col-md-4 mb-2">
                          <div className="form-group row">
                            <label
                              className="col-5"
                              htmlFor="text-input-inline"
                            >
                              Delivery Partner
                            </label>
                            <span className="col-1">:</span>
                            <div className="col-6">
                              <p
                                className=" ellipsis tooltip-ex"
                                data-toggle="tooltip"
                                title={list.deliverypartner}
                              >
                                {list.deliverypartner == null
                                  ? "-"
                                  : list.deliverypartner}
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className=" col-md-4 mb-2">
                          <div className="form-group row">
                            <label
                              className="col-5"
                              htmlFor="text-input-inline"
                            >
                              Talent Partner
                            </label>
                            <span className="col-1">:</span>
                            <div className="col-6">
                              <p
                                className=" ellipsis tooltip-ex"
                                data-toggle="tooltip"
                                title={list.TalentPartner}
                              >
                                {list.TalentPartner == null
                                  ? "-"
                                  : list.TalentPartner}
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className=" col-md-4 mb-2">
                          <div className="form-group row">
                            <label
                              className="col-5"
                              htmlFor="text-input-inline"
                            >
                              Project Coordinator
                            </label>
                            <span className="col-1">:</span>
                            <div className="col-6">
                              <p
                                className=" ellipsis tooltip-ex"
                                data-toggle="tooltip"
                                title={list.projectCoordinator}
                              >
                                {list.projectCoordinator == null
                                  ? "-"
                                  : list.projectCoordinator}
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className=" col-md-4 mb-2">
                          <div className="form-group row">
                            <label
                              className="col-5"
                              htmlFor="text-input-inline"
                            >
                              SQA
                            </label>
                            <span className="col-1">:</span>
                            <div className="col-6">
                              <p
                                className=" ellipsis tooltip-ex"
                                data-toggle="tooltip"
                                title={list.SQA}
                              >
                                {list.SQA == null ? "-" : list.SQA}
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className=" col-md-4 mb-2">
                          <div className="form-group row">
                            <label
                              className="col-5"
                              htmlFor="text-input-inline"
                            >
                              Competency Lead
                            </label>
                            <span className="col-1">:</span>
                            <div className="col-6">
                              <p
                                className=" ellipsis tooltip-ex"
                                data-toggle="tooltip"
                                title={list.competencyLead}
                              >
                                {list.competencyLead == null
                                  ? "-"
                                  : list.competencyLead}
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className=" col-md-4 mb-2">
                          <div className="form-group row">
                            <label
                              className="col-5"
                              htmlFor="text-input-inline"
                            >
                              Account Owner
                            </label>
                            <span className="col-1">:</span>
                            <div className="col-6">
                              <p
                                className=" ellipsis tooltip-ex"
                                data-toggle="tooltip"
                                title={list.accountowner}
                              >
                                {list.accountowner == null
                                  ? "-"
                                  : list.accountowner}
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className=" col-md-4 mb-2">
                          <div className="form-group row">
                            <label
                              className="col-5"
                              htmlFor="text-input-inline"
                            >
                              New Customer
                            </label>
                            <span className="col-1">:</span>
                            <div className="col-6">
                              <p
                                className=" ellipsis tooltip-ex"
                                data-toggle="tooltip"
                                title={list.newCustomer}
                              >
                                {list.newCustomer == null
                                  ? "-"
                                  : list.newCustomer}
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className=" col-md-4 mb-2">
                          <div className="form-group row">
                            <label
                              className="col-5"
                              htmlFor="text-input-inline"
                            >
                              Is QBR required?
                            </label>
                            <span className="col-1">:</span>
                            <div className="col-6">
                              <p
                                className=" ellipsis tooltip-ex"
                                data-toggle="tooltip"
                                title={list.isQbr == 1 ? "Quarter" : "NA"}
                              >
                                {list.isQbr == 1 ? "Quarter" : "NA"}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <>
                <div className="customCard card graph mt-2 mb-2">
                  <div className="group mb-1 customCard">
                    <div
                      className="col-md-12  collapseHeader px-3"
                      style={{ backgroundColor: "#f4f4f4" }}
                    >
                      <h2 style={{ backgroundColor: "#f4f4f4" }}>
                        Invoicing Details
                      </h2>
                    </div>
                  </div>
                  <div className="group-content row mx-2">
                    <div className=" col-md-12 mb-2">
                      {customerData.map((list) => (
                        <div className="group-content row">
                          <div className=" col-md-4 mb-2">
                            <div className="form-group row">
                              <label
                                className="col-5"
                                htmlFor="text-input-inline"
                              >
                                Invoice For
                              </label>
                              <span className="col-1">:</span>
                              <div className="col-6">
                                <p
                                  className=" ellipsis tooltip-ex"
                                  data-toggle="tooltip"
                                  title={list.invoiceFor}
                                >
                                  {list.invoiceFor == null
                                    ? "NA"
                                    : list.invoiceFor}
                                </p>
                              </div>
                            </div>
                          </div>

                          <div className=" col-md-4 mb-2 ">
                            <div className="form-group row">
                              <label
                                className="col-5"
                                htmlFor="text-input-inline"
                              >
                                Invoice Cycle
                              </label>
                              <span className="col-1">:</span>
                              <div className="col-6">
                                <p
                                  className=" ellipsis tooltip-ex"
                                  data-toggle="tooltip"
                                  title={list.invoiceCycle}
                                >
                                  {list.invoiceCycle == null
                                    ? "NA"
                                    : list.invoiceCycle}
                                </p>
                              </div>
                            </div>
                          </div>
                          <div className=" col-md-4 mb-2">
                            <div className="form-group row">
                              <label
                                className="col-5"
                                htmlFor="text-input-inline"
                              >
                                Payment Terms
                              </label>
                              <span className="col-1">:</span>
                              <div className="col-6">
                                <p
                                  className=" ellipsis tooltip-ex"
                                  data-toggle="tooltip"
                                  title={list.paymentTerms}
                                >
                                  {list.paymentTerms == null
                                    ? "NA"
                                    : list.paymentTerms}
                                </p>
                              </div>
                            </div>
                          </div>
                          <div className=" col-md-4 mb-2">
                            <div className="form-group row">
                              <label
                                className="col-5"
                                htmlFor="text-input-inline"
                              >
                                Invoice Time
                              </label>
                              <span className="col-1">:</span>
                              <div className="col-6">
                                <p
                                  className=" ellipsis tooltip-ex"
                                  data-toggle="tooltip"
                                  title={list.invoiceTime}
                                >
                                  {list.invoiceTime == null
                                    ? "NA"
                                    : list.invoiceTime}
                                </p>
                              </div>
                            </div>
                          </div>
                          <div className=" col-md-4 mb-2">
                            <div className="form-group row">
                              <label
                                className="col-5"
                                htmlFor="text-input-inline"
                              >
                                Expense Billable
                              </label>
                              <span className="col-1">:</span>
                              <div className="col-6">
                                <p
                                  className=" ellipsis tooltip-ex"
                                  data-toggle="tooltip"
                                  title={list.expenseBillable}
                                >
                                  {list.expenseBillable == null
                                    ? "NA"
                                    : list.expenseBillable}{" "}
                                </p>
                              </div>
                            </div>
                          </div>
                          <div className=" col-md-4 mb-2">
                            <div className="form-group row">
                              <label
                                className="col-5"
                                htmlFor="text-input-inline"
                              >
                                Discount (%)
                              </label>
                              <span className="col-1">:</span>
                              <div className="col-6">
                                <p
                                  className=" ellipsis tooltip-ex"
                                  data-toggle="tooltip"
                                  title={list.discountPercent}
                                >
                                  {list.discountPercent == null
                                    ? "NA"
                                    : list.discountPercent + "." + "00"}
                                </p>
                              </div>
                            </div>
                          </div>
                          <div className=" col-md-4 mb-2">
                            <div className="form-group row">
                              <label
                                className="col-5"
                                htmlFor="text-input-inline"
                              >
                                Customer Currency
                              </label>
                              <span className="col-1">:</span>
                              <div className="col-6">
                                <p
                                  className=" ellipsis tooltip-ex"
                                  data-toggle="tooltip"
                                  title={list.description}
                                >
                                  {list.description == null
                                    ? "NA"
                                    : list.description}
                                </p>
                              </div>
                            </div>
                          </div>
                          <div className=" col-md-4 mb-2">
                            <div className="form-group row">
                              <label
                                className="col-5"
                                htmlFor="text-input-inline"
                              >
                                Invoice Culture
                              </label>
                              <span className="col-1">:</span>
                              <div className="col-6">
                                <p
                                  className=" ellipsis tooltip-ex"
                                  data-toggle="tooltip"
                                  title={list.invoiceCulture}
                                >
                                  {list.invoiceCulture == null
                                    ? "NA"
                                    : list.invoiceCulture}
                                </p>
                              </div>
                            </div>
                          </div>
                          <div className=" col-md-4 mb-2">
                            <div className="form-group row">
                              <label
                                className="col-5"
                                htmlFor="text-input-inline"
                              >
                                Invoice Template
                              </label>
                              <span className="col-1">:</span>
                              <div className="col-6">
                                <p
                                  className=" ellipsis tooltip-ex"
                                  data-toggle="tooltip"
                                  title={list.invoiceTemplate}
                                >
                                  {list.invoiceTemplate == null
                                    ? "NA"
                                    : list.invoiceTemplate}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </>
              <div className="customCard card graph mt-2 mb-2">
                <div className="group mb-1 customCard">
                  <div
                    className="col-md-12  collapseHeader px-3"
                    style={{ backgroundColor: "#f4f4f4" }}
                  >
                    <h2 style={{ backgroundColor: "#f4f4f4" }}> Divisions</h2>
                  </div>
                </div>
                <CellRendererPrimeReactDataTable
                  rows={25}
                  data={data}
                  dynamicColumns={dynamicColumns}
                  headerData={headerData}
                  setHeaderData={setHeaderData}
                />
                {/* <FlatPrimeReactTable rows={10} data={customerDataDivision} /> */}
              </div>
              <div className="ccustomCard card graph mt-2 mb-2">
                <div className="group mb-1 customCard">
                  <div
                    className="col-md-12  collapseHeader px-3"
                    style={{ backgroundColor: "#f4f4f4" }}
                  >
                    <h2 style={{ backgroundColor: "#f4f4f4" }}>
                      Customer Stakeholders
                    </h2>
                  </div>
                </div>
                <CellRendererPrimeReactDataTable
                  rows={25}
                  data={customerDataextstake}
                  dynamicColumns={dynamicColumnsstakeholders}
                  headerData={headerDatastakeHolders}
                  setHeaderData={setHeaderDatastakeholders}
                />
              </div>
              <div className="card datatable-rowgroup-demo  mt-2">
                <div className="group mb-1 customCard">
                  <div
                    className="col-md-12  collapseHeader px-3"
                    style={{ backgroundColor: "#f4f4f4" }}
                  >
                    <h2 style={{ backgroundColor: "#f4f4f4" }}>
                      Internal Stakeholders
                    </h2>
                  </div>{" "}
                </div>
                <CellRendererPrimeReactDataTable
                  rows={25}
                  data={customerDatainterstake}
                  dynamicColumns={dynamicColumnsInternal}
                  headerData={headerDataInternal}
                  setHeaderData={setHeaderDataInternal}
                />
              </div>{" "}
              <div className="customCard card graph mt-2 mb-2 darkHeader">
                <div className="group mb-1 customCard">
                  <div
                    className="col-md-12  collapseHeader px-3"
                    style={{ backgroundColor: "#f4f4f4" }}
                  >
                    <h2 style={{ backgroundColor: "#f4f4f4" }}>Roles</h2>
                  </div>
                </div>

                <DataTable
                  className="primeReactDataTable "
                  paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
                  currentPageReportTemplate="{first} to {last} of {totalRecords}"
                  rowsPerPageOptions={[10, 25, 50]} //------------->
                  value={customerDatarole}
                  paginator
                  rows={25}
                  showGridlines
                  highlightOnHover
                  pagination
                  paginationPerPage={5}
                  paginationRowsPerPageOptions={[5, 15, 25, 50]}
                  paginationComponentOptions={{
                    rowsPerPageText: "Records per page:",
                    rangeSeparatorText: "out of",
                  }}
                  rowGroupMode="rowspan"
                  // groupRowsBy="role"
                  sortOrder={2}
                  responsiveLayout="scroll"
                >
                  <Column
                    field="Role"
                    header="Role"
                    alignHeader={"center"}
                    body={representativeBodyTemplate}
                    style={{ width: "40%" }}
                  ></Column>
                  <Column
                    field="Country"
                    header="Country"
                    body={representativeBody}
                    alignHeader={"center"}
                  >
                    country
                  </Column>
                </DataTable>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="statusMsg error">
          <span className="error-block">
            <AiFillWarning /> &nbsp; You dont have Permission to View this
            Customer Data
          </span>
        </div>
      )}
    </div>
  );
}

export default CustomersTopMenus;
