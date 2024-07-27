import React, { useState } from "react";
import DatePicker from "react-datepicker";
import {
  FaChevronCircleDown,
  FaChevronCircleUp,
  FaSearch,
  FaCheck,
  FaCircle,
} from "react-icons/fa";
import GlobalHelp from "../PrimeReactTableComponent/GlobalHelp";
import { CCollapse } from "@coreui/react";
import { useEffect } from "react";
import { BiCheck } from "react-icons/bi";
import { CModal } from "@coreui/react";
import { CModalBody } from "@coreui/react";
import { CModalHeader } from "@coreui/react";
import { CModalTitle, CModalFooter, CButton } from "@coreui/react";
import { environment } from "../../environments/environment";
import moment from "moment";
import { MultiSelect } from "react-multi-select-component";
import axios from "axios";
import Loader from "../Loader/Loader";
import { Column } from "primereact/column";
import SavedSearchGlobal from "../PrimeReactTableComponent/SavedSearchGlobal";
import { Business } from "@mui/icons-material";
import CellRendererPrimeReactDataTable from "../PrimeReactTableComponent/CellRendererPrimeReactDataTable";
import FlatPrimeReactTable from "../PrimeReactTableComponent/FlatPrimeReactTable";
import ResourceTrendingDisplayTable from "../FullfimentComponent/ResourceTrendingDisplayTable";
import VisibilityIcon from "@material-ui/icons/Visibility";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import EditIcon from "@mui/icons-material/Edit";
import { Pagination } from "@mui/lab";
import ScreenBreadcrumbs from "../Common/ScreenBreadcrumbs";
import { useLocation } from "react-router-dom";
import { useRef } from "react";
import { number } from "prop-types";
import "./OpportunityEdit.scss";
import SelectCustDialogBox from "../Customer/SelectCustDialogBox";

import OpportunityCustomers from "../SalesOpportunityComponent/OpportunityCustomers";
import CompetencyTable from "../SalesOpportunityComponent/CompetencyTable";
import OpportunityConsultant from "../SalesOpportunityComponent/OpportunityConsultant";
import Executive from "../SalesOpportunityComponent/Executive";

function SFOpportunities() {
  const [validationMessage, setValidationMessage] = useState(true);
  const [loaderState, setLoaderState] = useState(false);
  console.log("in line 29.................");
  const [startDate, setStartDate] = useState(new Date());
  const [country, setCountry] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState([]);
  const [date, SetDate] = useState(new Date());
  const [Type, setType] = useState([]);
  const [selectedType, setSelectedType] = useState([]);
  const [searching, setsearching] = useState(false);
  const [visible, setVisible] = useState(false);
  const [data, setData] = useState([]);
  const [headerData, setHeaderData] = useState([]);
  const [linkColumns, setLinkColumns] = useState([]);
  const [linkColumnsRoutes, setLinkColumnsRoutes] = useState([]);
  const [displayTable, setDisplayTable] = useState([]);
  const [tabHeaders, setTabHeaders] = useState([]);
  const [bodyData, setBodyData] = useState([]);
  const [firstDropdownValue, setFirstDropdownValue] = useState("");
  const [secondDropdownOptions, setSecondDropdownOptions] = useState([]);

  const handleFirstDropdownChange = (event) => {
    const selectedOption = event.target.value;
    setFirstDropdownValue(selectedOption);

    // Update options for the second dropdown based on the selected option
    if (selectedOption === "AE") {
      setSecondDropdownOptions(["Account Executive"]);
    } else if (selectedOption === "CSL") {
      setSecondDropdownOptions(["Client Success Leader"]);
    } else if (selectedOption === "DP") {
      setSecondDropdownOptions([
        "Shobhit Gupta",
        "Venkata Maheswara Rao Kotyada Jyothir",
        "Sundar Rajan Srinivasan",
        "Vasavi Raigiri",
        "Sravanthi Chowdary Movva",
        "Amit Kumar",
        "Jagadeeswara Reddy Katamareddy",
        "Debasish Behera",
        "Venkata Chandra Sekhar Burra",
        "Vicky Mehra",
        "Gandhimathi Nathan Ambalavanan",
        "Srinivas Kalyan Chakravarthy Ganjam",
        "Kishan Rao Alwapuram",
        "Stewart Hodges ",
        "Suresh Sakamuri",
        "Varun Sakshi Sharma",
        "Girish Konnur",
        "Suresh Babu Sabbisetti",
        "Rajeev Sharma",
        "Saritha Pilli",
      ]);
    } else if (selectedOption === "cons") {
      setSecondDropdownOptions([
        "Animesh Jain",
        "Arup Data",
        "Chris Isayan",
        "Craig Breakspear",
        "Greg Pochodaj",
        "Harald Smith",
        "Honda Bhyat",
        "Kris Brown",
        "Michael Gonzales",
        "Michael Hahn",
        "Mike Ryan",
        "Minesh Manilal",
        "Prashant",
        "Rama Yenumula",
        "Salem Hadim",
        "Sandeep Chellingi",
        "Timothy Reilly",
        "Varun Maddula",
        "Venu Polineni",
        "Vishnu Pandit",
      ]);
    } else if (selectedOption === "oppname") {
      setSecondDropdownOptions(["Opportunity Name"]);
    } else if (selectedOption === "oppid") {
      setSecondDropdownOptions(["Opportunity ID"]);
    } else if (selectedOption === "oppowner") {
      setSecondDropdownOptions(["Opportunity Owner"]);
    } else {
      setSecondDropdownOptions([]);
    }
  };

  const [updatedValue, setUpdatedValue] = useState([]);
  const [visibleTable, setVisibleTable] = useState(false);


  const defaultDate = () => {
    const now = new Date();
    const quarter = Math.floor(now.getMonth() / 3);
    const firstDate = new Date(now.getFullYear(), quarter * 3, 1);
    return firstDate.toLocaleDateString("en-CA");
  };
  const ref = useRef([]);
  const abortController = useRef(null);
  const handleAbort = () => {
    abortController.current && abortController.current.abort();
    setLoaderState(false);
  };

  const [custVisible, setCustVisible] = useState(false);
  let flag = 2;
  const [rrId, setRrId] = useState("");
  const initialValue = {};
  const baseUrl = environment.baseUrl;
  const pageurl = "http://10.11.12.149:3000/#/sales/sfOpportunities";
  const page_Name = "Sales";
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const id = searchParams.get("id");
  const [editmsg, setEditAddmsg] = useState(false);
  const [filterData, setFilterData] = useState([]);

  //-----------breadcrumbs------------
  const [routes, setRoutes] = useState([]);
  let textContent = "Sales";
  let currentScreenName = ["Opportunity Edit"];

  const FilterData = () => {
    axios({
      method: "get",
      url:
        baseUrl + `/dashboardsms/savedsearch/FiltersData?saved_search_id=${id}`,
    }).then(function (res) {
      const getData = res.data;
      setFilterData(getData);
      console.log(getData + "in line 881...");
    });
  };

  useEffect(() => {
    FilterData();
  }, []);

  const [formData, setFormData] = useState({
    from: moment(defaultDate()).format("yyyy-MM-DD"),
    executives: "0",
    customers: "-1",
    duration: "4",
    tags: "-1",
    probability: ">=50",
    viewBy: "oppt",
    prLoc: "-1",
    countries: "-1",
    oppType: "0",
    consultants: "-1",
  });
  console.log(formData);
  const [cheveronIcon, setCheveronIcon] = useState(FaChevronCircleUp);
  const [business, setBusiness] = useState([]);
  const [selectedBusiness, setSelectedBusiness] = useState([]);
  const [consultant, setConsultant] = useState([]);
  const [selectedConsultant, setSelectedConsultant] = useState([]);
  // console.log(selectedBusiness);
  const [displayTableState, setDisplayTableState] = useState(false);
  console.log(formData);
  console.log(filterData.OpportunityType);

  useEffect(() => {
    setFormData(() => {
      if (id != null) {
        return {
          from: filterData.from,
          customers: filterData.customers,
          duration: filterData.duration,
          tags: filterData.tags,
          probability: filterData.probability,
          viewBy: filterData.viewBy,
          prLoc: filterData.prLoc,
          countries: filterData.countries,
          oppType: filterData.oppType,
          consultants: filterData.consultants,
        };
      } else {
        return {
          from: moment(defaultDate()).format("yyyy-MM-DD"),
          customers: "-1",
          duration: "4",
          tags: "-1",
          resId: "512",
          probability: ">=50",
          viewBy: "oppt",
          prLoc: "-1",
          countries: "-1",
          oppType: "0",
          consultants: "-1",
        };
      }
    });
  }, [filterData]);

  useEffect(() => {
    if (id != null) {
      const updatebusiness = business.filter((values) =>
        formData.tags?.includes(values.label)
      );

      const updatecountry = country.filter((values) =>
        formData.countries?.includes(values.value)
      );

      const updatetype = Type.filter((values) =>
        formData.prLoc?.includes(values.value)
      );

      const updateconsultant = consultant.filter((values) =>
        formData.consultants?.includes(values.value)
      );

      const updateopttype = filterData.oppType;
      setSelectedType(updatetype);
      setSelectedConsultant(updateconsultant);
      setSelectedCountry(updatecountry);
      setSelectedBusiness(updatebusiness);
    }
  }, [
    id,
    business,
    formData.tags,
    country,
    formData.countries,
    consultant,
    formData.consultants,
  ]);

  const [selectedItems, setSelectedItems] = useState([{}]);
  const Customer = selectedItems?.map((d) => d?.id).toString();
  useEffect(() => {}, [Customer], [filterData.customers]);
  const selectedCust = JSON.parse(localStorage.getItem("selectedCust"))
    ?.map((d) => d.id)
    ?.toString();

  // console.log(selectedCust, "selected customers");

  const handleChange1 = (e) => {
    const { name, value, id } = e.target;
    if (name == "Customer" && value === "select") {
      setCustVisible(true);
      setFormData((prev) => {
        return { ...prev, customers: value };
      });
    } else if (name == "Customer") {
      setFormData((prev) => {
        return { ...prev, customers: value };
      });
    } else {
      setFormData((prev) => {
        return { ...prev, [id]: value };
      });
    }
  };
  // console.log(formData);

  const getBusinessUnit = () => {
    axios
      .get(baseUrl + `/SalesMS/sales/getSalesOpportunitiesTags`)
      .then((Response) => {
        let business = [];
        let data = Response.data;
        // console.log(data);
        data.length > 0 &&
          data.forEach((e) => {
            let businessobj = {
              value: e.tag_value,
              label: e.tag_name,
              // value: e.value,
            };
            // console.log(e.label);
            business.push(businessobj);
          });
        setBusiness(business);
        // console.log(business);
        setSelectedBusiness(business);
      })
      .catch((error) => console.log(error));
  };
  const getConsultants = () => {
    axios
      .get(baseUrl + `/SalesMS/sales/getSalesOpportunitiesConsultants`)

      .then((Response) => {
        let consultant = [];
        let data = Response.data;
        console.log(data);
        data.length > 0 &&
          data.forEach((e) => {
            let consultantobj = {
              value: e.consultant_name,
              label: e.consultant_name,
              // value: e.value,
            };
            // console.log(e.label);
            consultant.push(consultantobj);
          });
        setConsultant(consultant);
        // console.log(business);
        setSelectedConsultant(consultant);
      })
      .catch((error) => console.log(error));
  };

  const getCountries = () => {
    axios
      .get(baseUrl + `/CostMS/cost/getCountries`)
      .then((Response) => {
        let countries = [];
        let data = Response.data;
        //console.log(data);
        data.push({ id: 0, country_name: "Others" });
        data.length > 0 &&
          data.forEach((e) => {
            let countryObj = {
              label: e.country_name,
              value: e.id,
            };
            e.country_name == "NM" ? "" : countries.push(countryObj);
          });
        setCountry(countries);
        if (id == null) {
          setSelectedCountry(countries);
        }
      })
      .catch((error) => console.log(error));
  };

  const getType = () => {
    let types = [];
    types.push(
      { value: "Offshore", label: "Offshore" },
      { value: "Onshore", label: "Onshore" },
      { value: "Landed", label: "Landed" }
    );
    setType(types);
    setSelectedType(types.filter((ele) => ele.value >= ""));
    let filteredType = [];
    types.forEach((data) => {
      if (data.value >= "") {
        filteredType.push(data.value);
      }
    });
  };

  const handleClick = async () => {
    setLoaderState(true);
    setVisibleTable(false);
    abortController.current = new AbortController();
    axios({
      method: "post",
      url: baseUrl + `/SalesMS/sales/getSfOppts?loggedUserId=512`,

      data: {
        from: moment(formData.from).format("yyyy-MM-DD"),
        customers: "-1",
        duration: formData.duration,
        tags:
          formData.tags ==
          "AM | Agile Data Science,AM | Data Science in a Box,AppM | Cloud,AppM | Cloud Native Dev,AppM | DevOps,AppM | Healthcare Integration Kit,AppM | Integration Modernization,AppM | Security,AppM | Test Automation,DT | Data Governance,DT | Data Management,DT | Data Privacy (CCPA/GDPR),IA | Blockchain,IA | Enterprise Automation,IA | Hyperautomation,IA | Process Mining,Ind | Energy & Utilities,Ind | Open Banking,Ind | Quick FHIR,Other | Consulting Field Delivery,Other | Consulting Proposal,Other | Consulting Tied to Innovation,Other | Consulting Tied To Workshop,Other | Consulting Workshop,Other | Data Fabric,Other | Deal Hub Completed,Other | GTM,Other | IBM Cloud Paks,Other | JO Influence,Other | Think Suite 2019"
            ? "-1"
            : formData.tags,
        probability: formData.probability,
        viewBy: formData.viewBy,
        prLoc:
          formData.prLoc == "Offshore,Onshore,Landed" ? "-1" : formData.prLoc,
        countries:
          formData.countries == "6,5,3,8,7,1,2,0" ? "-1" : formData.countries,
        oppType: formData.oppType,
        consultants:
          formData.consultants ==
          "Animesh Jain,Arup Data,Chris Isayan,Craig Breakspear,Greg Pochodaj,Harald Smith,Honda Bhyat,Kris Brown,Michael Gonzales,Michael Hahn,Mike Ryan,Minesh Manilal,Prashant,Rama Yenumula,Salem Hadim,Sandeep Chellingi,Timothy Reilly,Varun Maddula,Venu Polineni,Vishnu Pandit"
            ? "-1"
            : formData.consultants,
        opportunity: formData.opportunityName,
      },
      signal: abortController.current.signal,
    }).then(function (response) {
      const responseData = response.data;
      setData(responseData);
      setRrId(responseData.reportrunId);
      console.log(responseData);
      setLoaderState(false);
      setsearching(true);
      setVisibleTable(true);
      setTimeout(() => {
        setLoaderState(false);
      }, 1000);
    });
  };

  useEffect(() => {
    data[0] && setHeaderData(JSON.parse(JSON.stringify(data[0])));
  }, [data]);

  const dynamicColumns = Object.keys(headerData)?.map((col, i) => {
    return <Column sortable key={col} field={col} header={headerData[col]} />;
  });

  function OpportunityTable(props) {
    const { tableData } = props;
    console.log(tableData);
    const [displayData, setDisplayData] = useState([]);
    const [listData, setListData] = useState(null);
    const [open, setOpen] = React.useState(false);
    const [editedData, setEditedData] = useState({});
    const [isEditing, setIsEditing] = useState(false);
    const [showAlert, setShowAlert] = useState(false);
    console.log(tableData.columns);
    const cols = tableData?.columns?.replace(/'|\s/g, "");
    console.log(cols);
    const [displayTable, setDisplayTable] = useState(null);
    const array = cols?.split(",");
    console.log(array);
    // console.log(tableData.sfBuckets.length);

    const newArray = tableData?.sfBuckets?.map((item) => {
      let k = JSON.parse(JSON.stringify(item, array, 4));
      return k;
    });

    useEffect(() => {
      displayDataFnc();
    }, [tableData]);

    const handleView = (element) => {
      console.log(element);
      setListData(element);
      setIsEditing(false);
      setOpen(true);
    };

    const handleClose = () => {
      setOpen(false);
    };

    const handleEdit = (element) => {
      setEditedData(element);
      setIsEditing(true);
      setOpen(true);
      setListData(element);
    };

    const handleSaveButtonClick = () => {
      window.alert("Data saved successfully!");
      setIsEditing(false);
      setOpen(false);
    };

    //Pagination
    const itemsPerPage = 10;
    const [currentPage, setCurrentPage] = useState(1);
    const totalItems = displayData?.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentItems = displayData?.slice(startIndex, endIndex);
    const handlePageChange = (event, value) => {
      setCurrentPage(value);
    };

    const displayDataFnc = () => {
      setDisplayData(() => {
        return newArray?.map((objData, index) => {
          if (
            objData.stage === "Stage^&2^&1" ||
            objData.customer === "Summary" ||
            objData.amount === "" ||
            objData.closedDate === ""
          ) {
            return null;
          }
          let tabData = [];
          Object.keys(objData).forEach((key, nestedIndex) => {
            let unWantedCols = [
              "id",
              "lvl",
              "isProspect",
              "pr_id",
              "opp_id",
              "name",
              "primary_competency",
              "icims_record_id",
              "consultant",
            ];
            if (objData.id === -2 && unWantedCols.indexOf(key) == -1) {
              console.log(objData[key]);
              let val = objData[key].split("^&");
              let dVal = val[0].includes("__") ? val[0].split("__") : [];
              tabData.push(
                <th
                  style={{
                    textAlign: "center",
                    position: "sticky",
                    top: 0,
                    background: "white",
                    zIndex: 1,
                  }}
                  className="fs10"
                >
                  {dVal.length > 0 ? (
                    <div
                      style={{ fontSize: "12px", textAlign: "left" }}
                      title="Customer Prospect"
                    >
                      <span>
                        <FaCircle style={{ color: "green" }} />
                        <span>{dVal[2]}</span>
                      </span>
                      <span>
                        <FaCircle style={{ color: "purple" }} />
                        <span>{dVal[4]}</span>
                      </span>
                    </div>
                  ) : (
                    <span
                      className="ellipsistd"
                      style={{ fontSize: "12px" }}
                      title={val[0]}
                    >
                      {val[0]}
                    </span>
                  )}
                </th>
              );
            } else if (objData.id === -1 && unWantedCols.indexOf(key) == -1) {
              objData[key] &&
                tabData.push(
                  <th className="fs10" style={{ fontSize: "12px" }}>
                    {objData[key]}
                  </th>
                );
            } else if (objData.id === 0 && unWantedCols.indexOf(key) == -1) {
              tabData.push(
                <td
                  className="fs10 trLvl0"
                  title={objData[key]}
                  style={{ fontSize: "12px", backgroundColor: "#f5d5a7" }}
                >
                  {key.includes("amount") ? (
                    <div className="fs10 elipsis">
                      <span
                        style={{ marginLeft: "5px" }}
                        className="fs10 "
                        title={Math.floor(objData[key]).toLocaleString()}
                      >
                        <b> {Math.floor(objData[key]).toLocaleString()}</b>
                      </span>
                    </div>
                  ) : (
                    <b> {objData[key]}</b>
                  )}
                </td>
              );
            } else if (objData.id > 0 && unWantedCols.indexOf(key) == -1) {
              tabData.push(
                <td>
                  {key.includes("customer") ? (
                    <div className="fs10 " style={{ width: "250px" }}>
                      {objData.isProspect === 1 ? (
                        <FaCircle
                          style={{ color: "purple" }}
                          title="Prospect"
                        />
                      ) : (
                        <FaCircle style={{ color: "green" }} title="Customer" />
                      )}
                      <span
                        style={{ marginLeft: "5px", fontSize: "12px" }}
                        className="fs10 "
                        title={objData[key]}
                      >
                        {objData[key]}
                      </span>
                    </div>
                  ) : key.includes("amount") ? (
                    <div className="fs10 elipsis">
                      <span
                        style={{ marginLeft: "5px", fontSize: "12px" }}
                        className="fs10 "
                        title={"$" + Math.floor(objData[key]).toLocaleString()}
                      >
                        {"$" + Math.floor(objData[key]).toLocaleString()}
                      </span>
                    </div>
                  ) : key.includes("probability") ? (
                    <div className="fs10 elipsis">
                      <span
                        style={{ marginLeft: "5px", fontSize: "12px" }}
                        className="fs10 "
                        title={objData[key] + "%"}
                      >
                        {objData[key]}
                        {"%"}
                      </span>
                    </div>
                  ) : key.includes("opportunity") ? (
                    <div className="row" style={{ width: "280px" }}>
                      <div
                        className="col-md-12 ellipsistd"
                        style={{
                          fontSize: "12px",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "inherit",
                          maxWidth: "100%",
                        }}
                      >
                        <a
                          href={`http://d300000000qxieam.my.salesforce.com/?ec=302&startURL=%2Fvisualforce%2Fsession%3Furl%3Dhttp%253A%252F%252Fd300000000qxieam.lightning.force.com%252Flightning%252Fr%252FOpportunity%252F${objData["opp_id"]}%252Fview`}
                          target="_blank"
                          rel="noopener noreferrer"
                          data-toggle="tooltip"
                          title={objData[key]}
                        >
                          {objData[key]}
                        </a>
                      </div>
                    </div>
                  ) : (
                    <div
                      className="fs10 ellipsistd"
                      style={{ fontSize: "12px" }}
                      title={objData[key]}
                    >
                      {objData[key]}
                    </div>
                  )}
                </td>
              );
            }
          });
          if (index === -1) {
            tabData.push(<th></th>);
          } else {
            tabData.push(
              <td>
                <div style={{ display: "flex" }}>
                  <VisibilityIcon
                    variant="outlined"
                    onClick={() => handleView(objData)}
                    style={{ marginRight: "5px" }}
                  />
                  <EditIcon
                    variant="outlined"
                    onClick={() => handleEdit(objData)}
                  />
                </div>
              </td>
            );
            console.log(tabData);
          }
          return <tr key={index}>{tabData}</tr>;
        });
      });
    };

    const handleInputChange = (event) => {
      const { name, value, type, checked } = event.target;

      const inputValue = type === "checkbox" ? checked : value;

      setEditedData((prevData) => ({
        ...prevData,
        [name]: inputValue,
      }));
    };

    return (
      <>
        {searching == true ? (
          <div className="col-lg-12 col-md-12 col-sm-12 no-padding attainTablePrnt scrollit">
            <table className="table table-bordered table-striped attainTable ">
              {searching ? (
                <thead
                  style={{
                    position: "sticky",
                    top: 0,
                    backgroundColor: "#f1f1f1",
                  }}
                >
                  <tr>
                    <th colSpan="1" style={{ textAlign: "center" }}>
                      <FaCircle style={{ color: "green" }} title="Customer" />
                      Customer
                      <FaCircle style={{ color: "purple" }} title="Prospect" />
                      Prospect
                    </th>
                    <th colSpan="1" style={{ textAlign: "center" }}>
                      Account Executive
                    </th>
                    <th colSpan="1" style={{ textAlign: "center" }}>
                      Opportunity Name
                    </th>
                    <th colSpan="1" style={{ textAlign: "center" }}>
                      Type
                    </th>
                    <th colSpan="1" style={{ textAlign: "center" }}>
                      Stage
                    </th>
                    <th colSpan="1" style={{ textAlign: "center" }}>
                      Practice
                    </th>
                    <th colSpan="1" style={{ textAlign: "center" }}>
                      Amount ($)
                    </th>
                    <th colSpan="1" style={{ textAlign: "center" }}>
                      Probability
                    </th>
                    <th colSpan="1" style={{ textAlign: "center" }}>
                      Projected Closed Date
                    </th>
                    <th colSpan="1" style={{ textAlign: "center" }}>
                      Next Step
                    </th>
                    <th colSpan="1" style={{ textAlign: "center" }}>
                      Country
                    </th>
                    <th colSpan="1" style={{ textAlign: "center" }}>
                      Action
                    </th>
                  </tr>
                </thead>
              ) : (
                ""
              )}
              <tbody>
                {currentItems.length === 0 ? (
                  <tr>
                    <td colSpan="12" style={{ textAlign: "center" }}>
                      No Opportunity Found
                    </td>
                  </tr>
                ) : (
                  currentItems
                )}
              </tbody>
            </table>

            <div className="col-md-12 d-flex justify-content-center">
              <label style={{ textAlign: "center" }}>
                <Pagination
                  count={Math.ceil(totalItems / itemsPerPage)}
                  page={currentPage}
                  onChange={handlePageChange}
                  showFirstButton
                  showLastButton
                />
              </label>
            </div>
          </div>
        ) : (
          ""
        )}

        <CModal visible={open} size="lg" onClose={handleClose}>
          <CModalHeader className="hgt22">
            <CModalTitle>
              <span className="ft16">Opportunity View</span>
            </CModalTitle>
          </CModalHeader>
          <CModalBody>
            {listData && (
              <div className="row opportunityViewPopup">
                <div className="col-md-6">
                  <div>
                    <b>Customer/Prospect :</b>
                    <span>{listData.customer}</span>
                  </div>
                  <div>
                    <b>Add to Call :</b>
                    <span>
                      {isEditing ? (
                        <input
                          type="checkbox"
                          name="addToCall"
                          value={listData.addToCall}
                          checked={editedData.addToCall}
                          onChange={handleInputChange}
                        />
                      ) : listData.addToCall ? (
                        "Yes"
                      ) : (
                        "No"
                      )}
                    </span>
                  </div>
                  <div>
                    <b>Stage :</b>
                    <span>
                      {isEditing ? (
                        <input
                          type="text"
                          name="stage"
                          value={listData.stage}
                          onChange={handleInputChange}
                        />
                      ) : (
                        listData.stage
                      )}
                    </span>
                  </div>

                  <div>
                    <b>Amount :</b>
                    <span>
                      {" "}
                      {"$" + Number(listData.amount).toLocaleString()}
                    </span>
                  </div>

                  <div>
                    <b>SOW Proposal DealHub :</b>
                    <span>
                      {isEditing ? (
                        <input
                          type="checkbox"
                          name="sowProposalDealHub"
                          checked={listData.sowProposalDealHub}
                          onChange={handleInputChange}
                        />
                      ) : listData.sowProposalDealHub ? (
                        "Yes"
                      ) : (
                        "No"
                      )}
                    </span>
                  </div>

                  <div>
                    <b>Account Executive :</b>
                    <span>{listData.executive}</span>
                  </div>

                  <div>
                    <b>Probability :</b>
                    <span>
                      {isEditing ? (
                        <input
                          type="text"
                          name="probability"
                          value={listData.probability + "%"}
                          onChange={handleInputChange}
                        />
                      ) : (
                        listData.probability + "%"
                      )}
                    </span>
                  </div>
                  <div>
                    <b>Offering :</b>
                    <span>
                      {isEditing ? (
                        <input
                          type="text"
                          name="offering"
                          value={listData.offering}
                          onChange={handleInputChange}
                        />
                      ) : (
                        listData.offering
                      )}
                    </span>
                  </div>
                  <div>
                    <b>Draft Proposal DealHub :</b>
                    <span>
                      {isEditing ? (
                        <input
                          type="checkbox"
                          name="draftProposalDealHub"
                          checked={listData.draftProposalDealHub}
                          onChange={handleInputChange}
                        />
                      ) : listData.draftProposalDealHub ? (
                        "Yes"
                      ) : (
                        "No"
                      )}
                    </span>
                  </div>
                  <div>
                    <b>Opportunity Name :</b>
                    <span> {listData.name} </span>
                  </div>
                </div>
                <div className="col-md-6">
                  <div>
                    <b>Opportunity Owner :</b>
                    <span> {listData.executive} </span>
                  </div>
                  <div>
                    <b>Lead Source :</b>
                    <span>
                      {isEditing ? (
                        <input
                          type="text"
                          name="leadSource"
                          value={listData.leadSource}
                          onChange={handleInputChange}
                        />
                      ) : (
                        listData.leadSource
                      )}
                    </span>
                  </div>
                  <div>
                    <b>Opportunity Description :</b>
                    <span>{listData.opportunityDescription}</span>
                  </div>
                  <div>
                    <b>Opportunity Team Fulfillment Comments :</b>
                    <span>
                      {isEditing ? (
                        <input
                          type="checkbox"
                          name="opportunityTeamFulfillmentComments"
                          checked={listData.opportunityTeamFulfillmentComments}
                          onChange={handleInputChange}
                        />
                      ) : listData.opportunityTeamFulfillmentComments ? (
                        "Yes"
                      ) : (
                        "No"
                      )}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </CModalBody>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              padding: "16px",
            }}
          >
            {isEditing ? (
              <>
                <CButton onClick={handleSaveButtonClick} color="primary">
                  Save
                </CButton>
                <span style={{ marginLeft: "8px" }}></span>
                <CButton onClick={handleClose} color="secondary">
                  Cancel
                </CButton>
              </>
            ) : (
              <CButton onClick={handleClose} color="primary">
                Close
              </CButton>
            )}
          </div>
        </CModal>
      </>
    );
  }

  const displayTableFnc = () => {
    console.log(tabHeaders);
    setDisplayTable(() => {
      return data.map((element, index) => {
        let tabData = [];
        tabHeaders.forEach((inEle, inInd) => {
          if (index === 0) {
            console.log(element[inEle]);

            let value = ("" + element[inEle]).includes("^&1")
              ? element[inEle].replaceAll("^&1", " ")
              : element[inEle];

            tabData.push(<th key={inInd}>{value}</th>);
          } else {
            if (index === 1) {
              tabData.push(
                <td align={inInd > 0 ? "right" : "left"}>
                  <b>
                    <span
                      style={{
                        cursor:
                          inInd > 0 && element[inEle] != 0 ? "pointer" : "",
                        color:
                          inInd != 0 && element[inEle] != 0 ? "#2e88c5" : "",
                      }}
                      onClick={() => {
                        inInd > 0 && element[inEle] != 0
                          ? onclickHandler(inEle, element.id)
                          : "";
                      }}
                    >
                      {element[inEle]}
                    </span>
                  </b>
                </td>
              );
            } else {
              tabData.push(
                <td align={inInd > 0 ? "center" : "center"}>
                  <span
                    style={{
                      cursor: inInd > 0 && element[inEle] != 0 ? "pointer" : "",
                      color: inInd != 0 && element[inEle] != 0 ? "#2e88c5" : "",
                    }}
                    onClick={() => {
                      inInd > 0 && element[inEle] != 0
                        ? onclickHandler(inEle, element.id)
                        : "";
                    }}
                  >
                    {element[inEle]}
                  </span>
                </td>
              );
            }
          }
        });
        return (
          <tr
            style={{
              backgroundColor: index === 1 ? "#f5d5a7 " : "#d8eaeac4",
            }}
            key={index}
          >
            {tabData}
          </tr>
        );
      });
    });
  };

  const onFilterChange = ({ id, value }) => {
    setFormData((prevState) => {
      return { ...prevState, [id]: value };
    });
  };
  useEffect(() => {
    getBusinessUnit();
    getCountries();
    getType();
    getConsultants();
  }, []);

  return (
    <div>
      <div className="col-md-12">
        <div className="pageTitle">
          <div className="childOne"></div>
          <div className="childTwo">
            <h2>Opportunity Edit</h2>
          </div>

          <div className="childThree"></div>
        </div>
      </div>

      <ScreenBreadcrumbs
        routes={routes}
        currentScreenName={currentScreenName}
      />
      {loaderState ? <Loader handleAbort={handleAbort} /> : ""}

      <div className="group mb-3 customCard">
        {editmsg ? (
          <div className="statusMsg success">
            <span className="errMsg">
              <BiCheck size="1.4em" /> &nbsp; Search created successfully.
            </span>
          </div>
        ) : (
          ""
        )}

        <div className="col-md-12 collapseHeader">
          <h2>Search Filters</h2>
          <div className="helpBtn">
            <GlobalHelp />
          </div>
          <div className="saveBtn">
            <SavedSearchGlobal
              setEditAddmsg={setEditAddmsg}
              pageurl={pageurl}
              page_Name={page_Name}
              payload={formData}
            />
          </div>
          &nbsp;
          <div
            onClick={() => {
              setVisible(!visible);

              visible
                ? setCheveronIcon(FaChevronCircleUp)
                : setCheveronIcon(FaChevronCircleDown);
            }}
          >
            <span>{cheveronIcon}</span>
          </div>
        </div>
        <CCollapse visible={!visible}>
          <div className="group-content row">
            <div className=" col-md-3 mb-2">
              <div className="form-group row">
                <label className="col-5" htmlFor="OpportunityType">
                  Opportunity Type
                </label>
                <span className="col-1 p-0">:</span>
                <div className="col-6">
                  <select
                    className="text"
                    id="oppType"
                    name="oppType"
                    value={formData.oppType}
                    onChange={(e) => {
                      const { value, id } = e.target;
                      setFormData({ ...formData, [id]: value });
                    }}
                  >
                    <option value="-1"> &lt;&lt;ALL&gt;&gt;</option>
                    <option value="0">Services</option>
                    <option value="1">Software + Hardware</option>
                  </select>
                </div>
              </div>
            </div>
            <div className=" col-md-3 mb-2">
              <div className="form-group row">
                <label className="col-5" htmlFor="FromQuarter">
                  From Quarter<span className="required">*</span>
                </label>
                <span className="col-1 p-0">:</span>
                <div className="col-6" style={{ height: "23px" }}>
                  <DatePicker
                    selected={startDate}
                    onChange={(e) => {
                      setStartDate(e);
                      const date = new Date(e.getTime());
                      date.setFullYear(date.getFullYear() - 1);
                      date.setMonth(date.getMonth() + 3);
                      onFilterChange({
                        id: "from",
                        value: date.toLocaleDateString("en-CA"),
                      });
                    }}
                    dateFormat="yyyy-QQQ"
                    showQuarterYearPicker
                  />
                </div>
              </div>
            </div>
            <div className=" col-md-3 mb-2">
              <div className="form-group row">
                <label className="col-5" htmlFor="duration">
                  Duration
                </label>
                <span className="col-1 p-0">:</span>
                <div className="col-6">
                  <select
                    className="text"
                    id="duration"
                    value={formData.duration}
                    onChange={(e) => {
                      const { value, id } = e.target;
                      setFormData({ ...formData, [id]: value });
                    }}
                  >
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4" selected>
                      4
                    </option>
                  </select>
                </div>
              </div>
            </div>
            <div className=" col-md-3 mb-2">
              <div className="form-group row">
                <label className="col-5" htmlFor="Account">
                  Account
                  <span className="required error-text">*</span>
                </label>
                <span className="col-1 p-0">:</span>
                <div className="col-6">
                  <select
                    ref={(ele) => {
                      ref.current[0] = ele;
                    }}
                    defaultValue={"-1"}
                    className="text"
                    id="Customer"
                    name="Customer"
                    onChange={handleChange1}
                  >
                    {selectedItems.length + "selected"}
                    <option value=""> &lt;&lt;Please Select&gt;&gt;</option>
                    <option value={-1}> &lt;&lt;ALL&gt;&gt;</option>
                    <option value="select"> &lt;&lt;Select&gt;&gt;</option>
                  </select>
                </div>
              </div>
            </div>
            <div className=" col-md-3 mb-2">
              <div className="form-group row">
                <label className="col-5" htmlFor="probability">
                  Probability
                </label>
                <span className="col-1 p-0">:</span>
                <div className="col-6">
                  <select
                    className="text"
                    id="probability"
                    name="probability"
                    onChange={(e) => {
                      const { value, id } = e.target;
                      setFormData({ ...formData, [id]: value });
                    }}
                    value={formData.probability}
                  >
                    <option value="-1"> &lt;&lt;ALL&gt;&gt;</option>
                    <option value="<50">&lt;50%</option>
                    <option value=">=50" selected>
                      &gt;=50%
                    </option>
                    <option value=">=75">&gt;=75%</option>
                    <option value="=100">=100%</option>
                  </select>
                </div>
              </div>
            </div>
            <div className=" col-md-3 mb-2">
              <div className="form-group row">
                <label className="col-5" htmlFor="countries">
                  Country
                </label>
                <span className="col-1 p-0">:</span>
                <div className="col-6">
                  <MultiSelect
                    id="countries"
                    options={country}
                    hasSelectAll={true}
                    value={selectedCountry}
                    isLoading={false}
                    shouldToggleOnHover={false}
                    disableSearch={false}
                    disabled={false}
                    overrideStrings={{
                      selectAllFiltered: "Select All",
                      selectSomeItems: "<< All>>",
                    }}
                    onChange={(e) => {
                      setSelectedCountry(e);
                      let filteredCountry = [];
                      e.forEach((d) => {
                        filteredCountry.push(d.value);
                      });
                      setFormData((prevVal) => ({
                        ...prevVal,
                        ["countries"]: filteredCountry.toString(),
                      }));
                    }}
                  />
                </div>
              </div>
            </div>

            <div className=" col-md-3 mb-2">
              <div className="form-group row">
                <label className="col-5" htmlFor="viewBy">
                  View By
                </label>
                <span className="col-1 p-0">:</span>
                <div className="col-6">
                  <select
                    defaultValue={"oppt"}
                    className="text"
                    id="viewBy"
                    name="viewBy"
                    onChange={(e) => {
                      setVisibleTable(false);
                      const { value, id } = e.target;
                      setFormData({ ...formData, [id]: value });
                    }}
                    value={formData.viewBy}
                  >
                    <option value="exec">Executive</option>
                    <option value="oppt">Opportunity</option>
                    <option value="cust">Customer</option>
                    <option value="comp">Competency</option>
                    <option value="consl">Consultant</option>
                  </select>
                </div>
              </div>
            </div>

            <div className=" col-md-3 mb-2">
              <div className="form-group row">
                <label className="col-5" htmlFor="addtocall">
                  Add to Call
                </label>
                <span className="col-1 p-0">:</span>
                <div className="col-6">
                  <select
                    defaultValue={"oppt"}
                    className="text"
                    id="addtocall"
                    name="addtocall"
                    onChange={(e) => {
                      const { value, id } = e.target;
                      setFormData({ ...formData, [id]: value });
                    }}
                  >
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </select>
                </div>
              </div>
            </div>

            <div className=" col-md-3 mb-2">
              <div className="form-group row">
                <label className="col-5" htmlFor="searchBy">
                  Search By
                </label>
                <span className="col-1 p-0">:</span>
                <div className="col-6">
                  <select
                    value={firstDropdownValue}
                    className="text"
                    id="searchBy"
                    name="searchBy"
                    onChange={handleFirstDropdownChange}
                  >
                    <option value="AE">AE</option>
                    <option value="CSL">CSL</option>
                    <option value="DP">DP</option>
                    <option value="cons">Consultant</option>
                    <option value="oppname">Opportunity Name</option>
                    <option value="oppowner">Opportunity Owner</option>
                    <option value="oppid">Opportunity ID</option>
                  </select>
                </div>
              </div>
            </div>

            <div className=" col-md-3 mb-2">
              <div className="form-group row">
                <label className="col-5" htmlFor="searchBy">
                  Search By Selection
                </label>
                <span className="col-1 p-0">:</span>
                <div className="col-6">
                  <select>
                    {secondDropdownOptions.map((option, index) => (
                      <option key={index} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="col-md-3 mb-2">
              <div className="form-group row">
                <label className="col-5" htmlFor="searchText">
                  Name
                </label>
                <span className="col-1 p-0">:</span>
                <div className="col-6">
                  <input
                    type="text"
                    id="opportunityName"
                    name="opportunityName"
                    placeholder="Enter Opportunity Name"
                    onChange={(e) => {
                      const { value, id } = e.target;
                      setFormData({ ...formData, [id]: value });
                      if (value.trim() === "") {
                        setValidationMessage(true);
                        setsearching(false);
                      } else {
                        setValidationMessage(false);
                        setsearching(false);
                      }
                    }}
                    value={formData.opportunityName}
                  />
                </div>
              </div>
            </div>

            <div className="col-md-12 col-sm-12 col-xs-12 btn-container center my-3 mb-2">
              <button
                type="submit"
                className="btn btn-primary"
                title="Search"
                onClick={() => handleClick()}
              >
                <FaSearch />
                Search
              </button>
            </div>
          </div>
        </CCollapse>
      </div>

      <SelectCustDialogBox
        flag={flag}
        visible={custVisible}
        setVisible={setCustVisible}
        setSelectedItems={setSelectedItems}
        selectedItems={selectedItems}
        setUpdatedValue={setUpdatedValue}
      />

      {searching && visibleTable && formData.viewBy == "oppt" ? (
        <div>
          <OpportunityTable
            tableData={data}
            rrId={rrId}
            searching={searching}
            setsearching={setsearching}
          />
        </div>
      ) : searching && visibleTable && formData.viewBy == "comp" ? (
        <CompetencyTable tableData={data} rrId={rrId} searching={searching} />
      ) : searching && visibleTable && formData.viewBy == "cust" ? (
        <OpportunityCustomers tableData={data} rrId={rrId} />
      ) : searching && visibleTable && formData.viewBy == "consl" ? (
        <OpportunityConsultant tableData={data} rrId={rrId} />
      ) : searching && visibleTable && formData.viewBy == "exec" ? (
        <Executive tableData={data} rrId={rrId} />
      ) : (
        ""
      )}
    </div>
  );
}
export default SFOpportunities;
