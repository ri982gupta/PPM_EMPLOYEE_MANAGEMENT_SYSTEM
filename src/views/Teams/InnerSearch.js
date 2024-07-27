import React, { useState, useEffect, useRef } from "react";
import { MultiSelect } from "react-multi-select-component";
import { Column } from "primereact/column";
import {
  FaChevronCircleDown,
  FaChevronCircleUp,
  FaSearch,
  FaCaretDown,
} from "react-icons/fa";
import { CCollapse } from "@coreui/react";
import CellRendererPrimeReactDataTable from "../PrimeReactTableComponent/CellRendererPrimeReactDataTable";
import { getTableData } from "./InnerSearchTable";
import axios from "axios";
import { environment } from "../../environments/environment";
import "primeicons/primeicons.css";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.css";
import GlobalCancel from "../ValidationComponent/GlobalCancel";
import { IoWarningOutline } from "react-icons/io5";
import GlobalValidation from "../ValidationComponent/GlobalValidation";
import "primeflex/primeflex.css";
import Loader from "../Loader/Loader";
import GlobalHelp from "../PrimeReactTableComponent/GlobalHelp";
import ScreenBreadcrumbs from "../Common/ScreenBreadcrumbs";
import { Link } from "react-router-dom";
import { DataTable } from "primereact/datatable";
import moment from "moment";

const DisplayTable = (props) => {
  const { data, loaderState, setLoaderState, setShowVisaDtl, showVisaDtl, maxHeight1 } =
    props;
  const [headerData, setHeaderData] = useState([]);
  const [exportData, setExportData] = useState([]);
  const abortController = useRef(null);
  const baseUrl = environment.baseUrl;

  useEffect(() => {
    data[0] && setHeaderData(JSON.parse(JSON.stringify(data[0])));
    let imp = ["XLS"];
    setExportData(imp);
  }, [data]);
  const [visaDetails, setVisaDetails] = useState([]);
  const [storevisaDetails, setStroreVisaDetails] = useState([]);
  const [resorceName, setResourcename] = useState([]);
  const handleClick = (resUserId, resName) => {
    setVisaDetails(resUserId);
    setResourcename(resName);
    getVisaDetails();
  };

  const getVisaDetails = () => {
    axios
      .get(baseUrl + `/ProjectMS/Audit/getUserid?userId=${visaDetails}`)
      .then((Response) => {
        let GetData = Response.data;

        for (let i = 0; i < GetData.length; i++) {
          GetData[i]["issuedDate"] =
            GetData[i]["issuedDate"] == null
              ? ""
              : moment(GetData[i]["issuedDate"]).format("DD-MMM-YYYY");

          GetData[i]["validUpto"] =
            GetData[i]["validUpto"] == null
              ? ""
              : moment(GetData[i]["validUpto"]).format("DD-MMM-YYYY");
        }

        setStroreVisaDetails(GetData);
        setShowVisaDtl(true);
      })
      .catch((error) => console.log(error));
  };

  useEffect(() => {
    getVisaDetails();
  }, [visaDetails]);
  const phoneAlign = (data) => {
    return (
      <div className="align right  ellipsis ">
        {data.resVisaStat === 1 ? (
          <Link onClick={() => handleClick(data.resUserId, data.resName)}>
            {data.resVisaStat}
          </Link>
        ) : (
          data.resVisaStat
        )}
      </div>
    );
  };

  const resNameToolip = (data) => {
    return (
      <div
        align="left"
        data-toggle="tooltip"
        className="ellipsis"
        title={data.resName}
      >
        {data.resName}
      </div>
    );
  };
  const resSupNameAlign = (data) => {
    return (
      <div
        align="left"
        data-toggle="tooltip"
        className="ellipsis"
        title={data.resSupName}
      >
        {data.resSupName}
      </div>
    );
  };
  const resDeptToolip = (data) => {
    return (
      <div
        align="left"
        data-toggle="tooltip"
        className="ellipsis"
        title={data.resDept}
      >
        {data.resDept}
      </div>
    );
  };
  const resLobToolip = (data) => {
    return (
      <div
        align="left"
        data-toggle="tooltip"
        className="ellipsis"
        title={data.resLob}
      >
        {data.resLob}
      </div>
    );
  };
  const resTitleToolip = (data) => {
    return (
      <div
        align="left"
        data-toggle="tooltip"
        className="ellipsis"
        title={data.resTitle}
      >
        {data.resTitle}
      </div>
    );
  };
  const citizenshipAlign = (data) => {
    return (
      <div
        align="left"
        data-toggle="tooltip"
        className="ellipsis"
        title={data.resCitizenship}
      >
        {data.resCitizenship}
      </div>
    );
  };
  const resLocationToolip = (data) => {
    return (
      <div
        align="left"
        data-toggle="tooltip"
        className="ellipsis"
        title={data.resLocation}
      >
        {data.resLocation}
      </div>
    );
  };
  const resRoleAlign = (data) => {
    return (
      <div
        align="left"
        data-toggle="tooltip"
        className="ellipsis"
        title={data.resRole}
      >
        {data.resRole}
      </div>
    );
  };
  const resNotesAlign = (data) => {
    return (
      <div
        align="left"
        data-toggle="tooltip"
        className="ellipsis"
        title={data.resNotes}
      >
        {data.resNotes}
      </div>
    );
  };
  const countryName = (data) => {
    return (
      <div
        align="left"
        data-toggle="tooltip"
        className="ellipsis"
        title={data.countryName}
      >
        {data.countryName}
      </div>
    );
  };
  const visaType = (data) => {
    return (
      <div
        align="left"
        data-toggle="tooltip"
        className="ellipsis"
        title={data.visaType}
      >
        {data.visaType}
      </div>
    );
  };
  const visaNumber = (data) => {
    return (
      <div
        align="left"
        data-toggle="tooltip"
        className="ellipsis"
        title={data.visaNumber}
      >
        {data.visaNumber}
      </div>
    );
  };
  const issuedDate = (data) => {
    return (
      <div
        align="left"
        data-toggle="tooltip"
        className="ellipsis"
        title={data.issuedDate}
      >
        {data.issuedDate}
      </div>
    );
  };
  const validUpto = (data) => {
    return (
      <div
        align="left"
        data-toggle="tooltip"
        className="ellipsis"
        title={data.validUpto}
      >
        {data.validUpto}
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
          col == "resVisaStat"
            ? phoneAlign
            : col == "resName"
              ? resNameToolip
              : col == "resSupName"
                ? resSupNameAlign
                : col == "resDept"
                  ? resDeptToolip
                  : col == "resLob"
                    ? resLobToolip
                    : col == "resTitle"
                      ? resTitleToolip
                      : col == "resCitizenship"
                        ? citizenshipAlign
                        : col == "resLocation"
                          ? resLocationToolip
                          : col == "resRole"
                            ? resRoleAlign
                            : col == "resNotes" && resNotesAlign
        }
      />
    );
  });
  const handleAbort = () => {
    abortController.current && abortController.current.abort();
    setLoaderState(false);
  };
  return (
    <div>
      <div className="">
        {loaderState ? (
          <div className="loaderBlock">
            <Loader handleAbort={handleAbort} />
          </div>
        ) : (
          ""
        )}

        <CellRendererPrimeReactDataTable /////customerEngament
          rows={25}
          data={data}
          dynamicColumns={dynamicColumns}
          headerData={headerData}
          setHeaderData={setHeaderData}
          exportData={exportData}
          CustomersFileName = "timeAndExpensesResourceViewList"
          timeAndExpensesResourceViewListMaxHgt = {maxHeight1}
        />
      </div>
      <div className="col-md-12  darkHeader">
        {showVisaDtl === true ? (
          <>
            <h5>{resorceName} - Visa Details</h5>
            <DataTable
              className="primeReactDataTable eventsTable" ////customerEngament
              value={storevisaDetails}
              showGridlines
              paginator
              rows={10}
              emptyMessage="No Data Found"
              paginationPerPage={5}
              rowsPerPageOptions={[10, 25, 50]}
              paginationRowsPerPageOptions={[5, 15, 25, 50]}
            >
              <Column header="Country Name" body={countryName}></Column>
              <Column header="Visa Type" body={visaType}></Column>
              <Column header="Visa Number" body={visaNumber}></Column>
              <Column header="Issued Date" body={issuedDate}></Column>
              <Column header="Valid Upto" body={validUpto}></Column>
            </DataTable>
          </>
        ) : (
          ""
        )}
      </div>
    </div>
  );
};

function InnerSearch({
  visibleProp,
  searchCheveronIcon,
  setSearchCheveronIcon,
  buttonState,
  setSearchVisible,
  maxHeight1
}) {
  const loggedUserId = localStorage.getItem("resId");
  const [tableData, setTableData] = useState([]);
  const abortController = useRef(null);

  const [resourcelobcategory, setresourcelobcategory] = useState([
    { value: "11", label: "Employee" },
    { value: "12", label: "Contractors" },
  ]);
  const [selectedReslobcategory, setSelectedReslobcategory] =
    useState(resourcelobcategory);
  const [showVisaDtl, setShowVisaDtl] = useState(false);

  const [country, setCountry] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState([]);
  const [business, setBusiness] = useState([]);
  const [selectedBusiness, setSelectedBusiness] = useState([]);
  const [logged, setlogged] = useState([]);
  const [loaderState, setLoaderState] = useState(false);
  const [display, setDisplay] = useState(false);
  const baseUrl = environment.baseUrl;
  const [validationMessage, setValidationMessage] = useState(false);
  // const [cheveronIcon, setCheveronIcon] = useState(FaChevronCircleUp);
  const [data, setData] = useState([]);
  const [visible, setVisible] = useState(visibleProp);

  const ref = useRef([]);
  const initialValue = {
    resBusinessUnit: "170,211,123,82,168,207,212,18,213,49,149,208,243,999",
    resType: "-1",
    country: "6,5,3,8,4,7,1,2",
    resStatus: "-1",
    resBillableType: "0,1,2",
    resLobType: "11,12",
    loggedUser: loggedUserId,
  };

  useEffect(() => {
    setVisible(visibleProp);
  }, [visibleProp]);

  useEffect(() => {
    if (buttonState === "Search") {
      setSearchVisible(false);
      setSearchCheveronIcon(FaChevronCircleUp);
    }
  }, [buttonState]);

  const [formData, setFormData] = useState(initialValue);

  const [resourcebillableType, setresourcebillableType] = useState([
    { value: "0", label: "Billable" },
    { value: "1", label: "Partial Billable" },
    { value: "2", label: "Not Billable" },
  ]);
  const [selectedResbillable, setSelectedResBillable] =
    useState(resourcebillableType);

  const [routes, setRoutes] = useState([]);
  let textContent = "Teams";
  let currentScreenName = ["Insights", "Resource View List"];

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
  }, []);

  const getMenus = () => {
    // setMenusData

    axios({
      method: "GET",
      url: baseUrl + `/CommonMS/master/getMenus?loggedUserId=${loggedUserId}`,
    }).then((resp) => {
      let data = resp.data;
      const urlPathValue = "/resource/resourceSearch";
      getUrlPath(urlPathValue);
      const updatedMenuData = data.map((category) => ({
        ...category,
        subMenus: category.subMenus.map((submenu) => {
          if (submenu.display_name === "Profile") {
            return {
              ...submenu,
              display_name: "Insights",
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
  const getUrlPath = (modifiedUrlPath) => {
    axios({
      method: "get",
      url:
        baseUrl +
        `/CommonMS/security/authorize?url=${modifiedUrlPath}&userId=${loggedUserId}`,
    })
      .then((res) => { })
      .catch((error) => { });
  };
  useEffect(() => {
    getTableData();
    getloggeduser();
    getCountries();
    getBusinessUnit();
  }, []);
  const saveAsExcelFile = (buffer, fileName) => {
    import("file-saver").then((module) => {
      if (module && module.default) {
        let EXCEL_TYPE =
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
        let EXCEL_EXTENSION = ".xlsx";
        const data1 = new Blob([buffer], { type: EXCEL_TYPE });

        module.default.saveAs(
          data1,
          fileName + "_export_" + new Date().getTime() + EXCEL_EXTENSION
        );
      }
    });
  };
  const exportExcel = () => {
    import("xlsx").then((xlsx) => {
      let wantedCols = Object.keys(data[0]);

      let wantedValues = [];

      let dd = JSON.parse(JSON.stringify(data)).slice(1);

      for (let i = 0; i < dd.length; i++) {
        const obj = {};

        Object.keys(data[i]).forEach((d) => {
          if (wantedCols.includes(d)) {
            obj[data[0][d]] = data[i][d];
          }
        });
        wantedValues.push(obj);
      }

      const worksheet = xlsx.utils.json_to_sheet(wantedValues.slice(1));
      const workbook = { Sheets: { data: worksheet }, SheetNames: ["data"] };
      const excelBuffer = xlsx.write(workbook, {
        bookType: "xlsx",
        type: "array",
      });

      saveAsExcelFile(excelBuffer, "data");
    });
  };
  const getCountries = () => {
    axios
      .get(baseUrl + `/CostMS/cost/getCountries`)
      .then((Response) => {
        let countries = [];
        let data = Response.data;
        data.length > 0 &&
          data.forEach((e) => {
            let countryObj = {
              label: e.country_name,
              value: e.id,
            };
            countries.push(countryObj);
          });
        setCountry(countries);
        setSelectedCountry(countries);
      })
      .catch((error) => console.log(error));
  };
  useEffect(() => {
    let countryList = [];
    country.forEach((d) => {
      countryList.push(d.value);
    });
    setFormData((prevVal) => ({
      ...prevVal,
      ["country"]: countryList.toString(),
    }));
  }, [country]);

  const getloggeduser = () => {
    axios
      .get(baseUrl + `/ProjectMS/Audit/getloggeduser?loggedId=${loggedUserId}`)
      .then((Response) => {
        let data = Response.data;
        setlogged(data);
      })
      .catch((error) => console.log(error));
  };
  const getBusinessUnit = async () => {
    const resp = await axios({
      url: baseUrl + `/CostMS/cost/getDepartments`,
    });

    let departments = resp.data;
    departments.push({ value: 0, label: "Non-Revenue Units" });
    setBusiness(departments);
    setSelectedBusiness(departments.filter((ele) => ele.value != 0));
    let filteredDeptData = [];
    departments.forEach((data) => {
      if (data.value != 0) {
        filteredDeptData.push(data.value);
      }
    });
  };
  let allCountry;

  const handleClick = () => {
    GlobalCancel(ref);
    if (
      formData.resBillableType == "" ||
      formData.resBusinessUnit == "" ||
      formData.country == "" ||
      formData.resLobType == ""
    ) {
      let valid = GlobalValidation(ref);

      if (valid) {
        {
          setValidationMessage(true);
        }
        return;
      }
    } else {
      setDisplay(true);
      const loaderTime = setTimeout(() => {
        setLoaderState(true);
      }, 2000);
      abortController.current = new AbortController();
      setValidationMessage(false);
      allCountry =
        selectedCountry.length === country.length
          ? "6,5,3,8,4,7,1,2"
          : formData.country;
      axios
        .get(
          baseUrl +
          `/ProjectMS/Audit/getTeamsSearch?resBusinessUnit=${formData.resBusinessUnit
          }&resType=${formData.resType}&resCountry=${allCountry}&resStatus=${formData.resStatus
          }&resBillableType=${formData.resBillableType}&resLobType=${formData.resLobType.length > 2 ? "11,12" : formData.resLobType
          }&loggedUser=${logged}`
        )
        .then((response) => {
          const data = response.data;
          const Headerdata = [
            {
              resName: "Resource Name",
              resSupName: "Supervisor",
              resDept: "Business Unit",
              resLob: "LOB Category",
              resTitle: "Title",
              resCitizenship: "Citizenship",
              resLocation: "Location",
              resRole: "Role Type",
              resNotes: "Notes",
              resVisaStat: "Visa status",
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
          // setTableData(data);
          const sortedcities = data.sort(function (a, b) {
            var nameA = a.resName.toUpperCase();

            var nameB = b.resName.toUpperCase();

            if (nameA < nameB) {
              return -1; //nameA comes first
            }

            if (nameA > nameB) {
              return 1; // nameB comes first
            }

            return 0; // names must be equal
          }); //////////------------------------//////////
          setTableData(Headerdata.concat(sortedcities));
          setShowVisaDtl(false);
        });
      clearTimeout(loaderTime);
      setLoaderState(false);
      setVisible(!visible);
      visible
        ? setSearchCheveronIcon(FaChevronCircleUp)
        : setSearchCheveronIcon(FaChevronCircleDown);
    }
  };

  const ArrowRenderer = ({ expanded }) => (
    <>
      {expanded ? (
        <FaCaretDown className="chevronIcon" />
      ) : (
        <FaCaretDown className="chevronIcon" />
      )}
    </>
  );
  const customValueRenderer = (selected, _options) => {
    return selected.length === country.length
      ? "<< ALL >>"
      : selected.length === 0
        ? "<< Please Select >>"
        : selected.map((label) => {
          return selected.length > 1 ? label.label + "," : label.label;
        });
  };
  const businessValueRenderer = (selected, _options) => {
    return selected.length === business.length
      ? "<< ALL >>"
      : selected.length === 0
        ? "<< Please Select >>"
        : selected.map((label) => {
          return selected.length > 1 ? label.label + "," : label.label;
        });
  };
  const resourcebillableTypeValueRenderer = (selected, _options) => {
    return selected.length === resourcebillableType.length
      ? "<< ALL >>"
      : selected.length === 0
        ? "<< Please Select >>"
        : selected.map((label) => {
          return selected.length > 1 ? label.label + "," : label.label;
        });
  };
  const resourcelobcategoryValueRenderer = (selected, _options) => {
    return selected.length == resourcelobcategory.length
      ? "<< ALL >>"
      : selected.length === 0
        ? "<< Please Select >>"
        : selected.map((label) => {
          return selected.length > 1 ? label.label + "," : label.label;
        });
  };
  return (
    <div>
      <div className="col-md-12 ">
        {validationMessage ? (
          <div className="statusMsg error">
            {" "}
            <span>
              {" "}
              <IoWarningOutline /> Please select highlighted field values{" "}
            </span>
          </div>
        ) : (
          ""
        )}
      </div>
      <div className="group mb-3 customCard">
        <div className="col-md-12 collapseHeader"></div>
        <CCollapse visible={!visible} setVisible="false">
          <div className="group-content row">
            <div className=" col-md-3 mb-2">
              <div className="form-group row">
                <label className="col-5" htmlFor="resType">
                  Resource Type&nbsp;<span className="error-text">*</span>
                </label>
                <span className="col-1 p-0">:</span>
                <div className="col-6">
                  <select
                    id="resType"
                    onChange={(e) => {
                      setFormData((prevVal) => ({
                        ...prevVal,
                        ["resType"]: e.target.value,
                      }));
                    }}
                  >
                    <option value="-1">All Reportees</option>
                    <option value="0">Direct Reportees</option>
                    <option value="1">InDirect Reportees</option>
                  </select>
                </div>
              </div>
            </div>
            <div className=" col-md-3 mb-2">
              <div className="form-group row">
                <label className="col-5" htmlFor="resourcebillable">
                  Res. Billable
                  <span className="error-text mx-2">*</span>
                </label>
                <span className="col-1 p-0">:</span>
                <div
                  className="col-6 multiselect"
                  ref={(ele) => {
                    ref.current[0] = ele;
                  }}
                >
                  <MultiSelect
                    id="resBillableType"
                    options={resourcebillableType}
                    ArrowRenderer={ArrowRenderer}
                    hasSelectAll={true}
                    valueRenderer={resourcebillableTypeValueRenderer}
                    value={selectedResbillable}
                    onChange={(e) => {
                      setSelectedResBillable(e);
                      let filteredresBillableType = [];
                      e.forEach((d) => {
                        filteredresBillableType.push(d.value);
                      });
                      setFormData((prevVal) => ({
                        ...prevVal,
                        ["resBillableType"]: filteredresBillableType.toString(),
                      }));
                    }}
                  />
                </div>
              </div>
            </div>
            <div className=" col-md-3 mb-2">
              <div className="form-group row">
                <label className="col-5" htmlFor="resBusinessUnit">
                  Business Unit&nbsp;<span className="error-text">*</span>
                </label>
                <span className="col-1 p-0">:</span>
                <div
                  className="col-6 multiselect"
                  ref={(ele) => {
                    ref.current[1] = ele;
                  }}
                >
                  <MultiSelect
                    id="resBusinessUnit"
                    ArrowRenderer={ArrowRenderer}
                    options={business}
                    hasSelectAll={true}
                    // isLoading={false}
                    // shouldToggleOnHover={false}
                    disableSearch={false}
                    value={selectedBusiness}
                    valueRenderer={businessValueRenderer}
                    disabled={false}
                    onChange={(s) => {
                      setSelectedBusiness(s);
                      let filteredValues = [];
                      s.forEach((d) => {
                        filteredValues.push(d.value);
                      });

                      setFormData((prevVal) => ({
                        ...prevVal,
                        ["resBusinessUnit"]: filteredValues.toString(),
                      }));
                    }}
                  />
                </div>
              </div>
            </div>
            <div className=" col-md-3 mb-2">
              <div className="form-group row">
                <label className="col-5" htmlFor="resStatus">
                  Resource Status&nbsp;<span className="error-text">*</span>
                </label>
                <span className="col-1 p-0">:</span>
                <div className="col-6">
                  <select
                    id="resStatus"
                    onChange={(e) => {
                      setFormData((prevVal) => ({
                        ...prevVal,
                        ["resStatus"]: e.target.value,
                      }));
                    }}
                  >
                    <option value="-1">{"<<All>>"}</option>
                    <option value="1">Active</option>
                    <option value="0">InActive</option>
                  </select>
                </div>
              </div>
            </div>
            <div className=" col-md-3 mb-2">
              <div className="form-group row">
                <label className="col-5">
                  Res.Location&nbsp;<span className="error-text">*</span>
                </label>
                <span className="col-1 p-0">:</span>
                <div
                  className="col-6 multiselect"
                  ref={(ele) => {
                    ref.current[2] = ele;
                  }}
                >
                  <MultiSelect
                    id="country"
                    ArrowRenderer={ArrowRenderer}
                    options={country}
                    hasSelectAll={true}
                    value={selectedCountry}
                    valueRenderer={customValueRenderer}
                    disabled={false}
                    onChange={(e) => {
                      setSelectedCountry(e);
                      let filteredCountry = [];
                      e.forEach((d) => {
                        filteredCountry.push(d.value);
                      });
                      setFormData((prevVal) => ({
                        ...prevVal,
                        ["country"]: filteredCountry.toString(),
                      }));
                    }}
                  />
                </div>
              </div>
            </div>
            <div className=" col-md-3 mb-2">
              <div className="form-group row">
                <label className="col-5">
                  Res.LOB Category&nbsp;<span className="error-text">*</span>
                </label>
                <span className="col-1 p-0">:</span>
                <div
                  className="col-6 multiselect"
                  ref={(ele) => {
                    ref.current[3] = ele;
                  }}
                >
                  <MultiSelect
                    id="resLobType"
                    options={resourcelobcategory}
                    ArrowRenderer={ArrowRenderer}
                    hasSelectAll={true}
                    value={selectedReslobcategory}
                    valueRenderer={resourcelobcategoryValueRenderer}
                    overrideStrings={{
                      selectAllFiltered: "Select All",
                      selectSomeItems: "<< All>>",
                    }}
                    onChange={(e) => {
                      setSelectedReslobcategory(e);
                      let filteredReslobcategory = [];
                      e.forEach((d) => {
                        filteredReslobcategory.push(d.value);
                      });
                      setFormData((prevVal) => ({
                        ...prevVal,
                        ["resLobType"]: filteredReslobcategory.toString(),
                      }));
                    }}
                  />
                </div>
              </div>
            </div>
            <div className="col-md-12 col-sm-12 col-xs-12  btn-container center my-0">
              <button
                type="submit"
                className="btn btn-primary"
                title="Search"
                onClick={() => handleClick()}
              >
                <FaSearch />
                Search{" "}
              </button>
            </div>
          </div>
        </CCollapse>
      </div>
      <div className="col-md-12">
        {/* {loaderState ? (
          <div className="loaderBlock">
            <Loader />
          </div>
        ) : (
          ""
        )} */}
        {/* <span
          className="pi pi-file-excel excel"
          onClick={exportExcel}
          title="XLS"
        /> */}
        {display === true ? (
          <DisplayTable
            data={tableData}
            setShowVisaDtl={setShowVisaDtl}
            loaderState={loaderState}
            setLoaderState={setLoaderState}
            showVisaDtl={showVisaDtl}
            maxHeight1 = {maxHeight1}
          />
        ) : (
          ""
        )}
      </div>
    </div>
  );
}

export default InnerSearch;
