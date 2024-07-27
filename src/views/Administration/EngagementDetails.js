import React from "react";
import {
  FaCaretDown,
  FaSearch,
  FaChevronCircleUp,
  FaChevronCircleDown,
} from "react-icons/fa";
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { environment } from "../../environments/environment";
import Loader from "../Loader/Loader";
import CellRendererPrimeReactDataTable from "../PrimeReactTableComponent/CellRendererPrimeReactDataTable";
import { MultiSelect } from "react-multi-select-component";
import { Column } from "primereact/column";
import GlobalValidation from "../ValidationComponent/GlobalValidation";
import { IoWarningOutline } from "react-icons/io5";

import { CCollapse, CListGroup } from "@coreui/react";
import ScreenBreadcrumbs from "../Common/ScreenBreadcrumbs";

const DisplayTable = (props) => {
  const { data, headerData, setHeaderData, maxHeight1 } = props;
  const [exportData, setExportData] = useState([]);

  useEffect(() => {
    data[0] && setHeaderData(JSON.parse(JSON.stringify(data[0])));
    let imp = ["XLS"];
    setExportData(imp);
  }, [data]);
  const Toggletooltip = (data) => {
    return (
      <div
        data-toggle="tooltip"
        className="ellipsis"
        title={data["Engagement Name"]}
      >
        {data["Engagement Name"]}
      </div>
    );
  };
  const Toggletooltip2 = (data) => {
    return (
      <div data-toggle="tooltip" className="ellipsis" title={data["customer"]}>
        {data["customer"]}
      </div>
    );
  };
  const Toggletooltip3 = (data) => {
    return (
      <div
        data-toggle="tooltip"
        className="ellipsis"
        title={data["Engagement Company"]}
      >
        {data["Engagement Company"]}
      </div>
    );
  };
  const Toggletooltip4 = (data) => {
    return (
      <div
        data-toggle="tooltip"
        className="ellipsis"
        title={data["Sales Executive"]}
      >
        {data["Sales Executive"]}
      </div>
    );
  };
  const Toggletooltip5 = (data) => {
    return (
      <div data-toggle="tooltip" className="ellipsis" title={data["CSL"]}>
        {data["CSL"]}
      </div>
    );
  };
  const Toggletooltip6 = (data) => {
    return (
      <div data-toggle="tooltip" className="ellipsis" title={data["DP"]}>
        {data["DP"]}
      </div>
    );
  };
  const Toggletooltip7 = (data) => {
    const tooltipStyle = {
      textAlign: "center",
    };

    return (
      <div
        data-toggle="tooltip"
        className="ellipsis"
        title={data["Start Date"]}
        style={tooltipStyle}
      >
        {data["Start Date"]}
      </div>
    );
  };


  const Toggletooltip8 = (data) => {
    const tooltipStyle = {
      textAlign: "center",
    };

    return (
      <div
        data-toggle="tooltip"
        className="ellipsis"
        title={data["End Date"]}
        style={tooltipStyle}
      >
        {data["End Date"]}
      </div>
    );
  };


  const dynamicColumns = Object.keys(headerData)?.map((col, i) => {
    return (
      <Column
        sortable
        key={col}
        body={
          col == "Engagement Name"
            ? Toggletooltip
            : col == "customer"
              ? Toggletooltip2
              : col == "Engagement Company"
                ? Toggletooltip3
                : col == "Sales Executive"
                  ? Toggletooltip4
                  : col == "CSL"
                    ? Toggletooltip5
                    : col == "DP"
                      ? Toggletooltip6
                      : col == "Start Date"
                        ? Toggletooltip7
                        : col == "End Date" && Toggletooltip8
        }
        field={col}
        header={headerData[col]}
      />
    );
  });
  useEffect(() => {
    data[0] && setHeaderData(JSON.parse(JSON.stringify(data[0])));
  }, [data]);

  return (
    <div>
      {/* <FlatPrimeReactTable
             data={data}
             rows={rows}     
             /> */}
      <CellRendererPrimeReactDataTable
        CustomersFileName = "AdministrationEnagagementDetails"
        AdministrationEngDyMaxHt = {maxHeight1}
        fileName={"EngagementDetailsData"}
        exportData={exportData}
        data={data}
        dynamicColumns={dynamicColumns}
        headerData={headerData}
        setHeaderData={setHeaderData}
        rows={25}
      />
    </div>
  );
};

function EngagementDetails({ urlPath, visible, setVisible, setCheveronIcon, maxHeight1 }) {
  console.log(urlPath)
  const [headerData, setHeaderData] = useState([]);
  const [data, setData] = useState([{}]);
  const baseUrl = environment.baseUrl;
  const [customer, setCustomer] = useState([]);

  const [selectedCustomer, setSelectedCustomer] = useState([]);
  const [csl, setCsl] = useState([]);
  const [selectedCsl, setSelectedCsl] = useState([]);
  const [dp, setDp] = useState([]);
  const [selectedDp, setSelectedDp] = useState([]);
  const [searching, setSearching] = useState(false);
  const [loader, setLoader] = useState(false);
  const intialValue = { customers: "-1", csl: "-1", Dp: "-1" };
  const [formData, setFormData] = useState(intialValue);
  const ref = useRef([]);
  const [validationmessage, setValidationMessage] = useState(false);


  // const [details, setDetails] = useState({ customers: "",  csl: "",Dp: "" })
  const abortController = useRef(null);
  const loggedUserId = localStorage.getItem("resId");
  const [routes, setRoutes] = useState([]);
  let currentScreenName = ["Hammer Tool","Report", "Engagements Details"];
  let textContent = "Administration";



  sessionStorage.setItem(
    "breadCrumbs",
    JSON.stringify({ routes: routes, currentScreenName: currentScreenName, textContent: textContent })
  );

  const handleCustomer = () => {
    axios({
      method: "get",
      url: baseUrl + `/ProjectMS/Engagement/getCustomerName`,
    }).then((res) => {
      let custom = [];

      let data = res.data;
      data.length > 0 &&
        data.forEach((e) => {
          let customerObj = {
            label: e.full_name,
            value: e.id,
          };
          custom.push(customerObj);
        });

      setCustomer(custom);
      setSelectedCustomer(custom);
    });
  };
  useEffect(() => { }, [formData?.customers]);

  const handleCsl = () => {
    const loggedUser = "0";
    axios({
      method: "get",
      url:
        baseUrl +
        `/SalesMS/MasterController/getCslDropDownData?userId=${loggedUser}`,
    }).then((res) => {
      let custom = [];

      let data = res.data;
      data.length > 0 &&
        data.forEach((e) => {
          let cslObj = {
            label: e.PersonName,
            value: e.id,
          };
          custom.push(cslObj);
        });

      setCsl(custom);
      setSelectedCsl(custom);
    });
  };
  const handleDp = () => {
    const loggedUser = "0";
    axios({
      method: "get",
      url: baseUrl + `/CommonMS/master/getDPDropDownData?userId=${loggedUser}`,
    }).then((res) => {
      let custom = [];

      let data = res.data;
      data.length > 0 &&
        data.forEach((e) => {
          let dpObj = {
            label: e.PersonName,
            value: e.id,
          };
          custom.push(dpObj);
        });

      setDp(custom);
      setSelectedDp(custom);
    });
  };

  useEffect(() => {
    handleCustomer();
    handleCsl();
    handleDp();
    getMenus();
    getUrlPath();
  }, []);

  const getMenus = () => {
    axios({
      method: "GET",
      url: baseUrl + `/CommonMS/master/getMenus?loggedUserId=${loggedUserId}`,
    }).then((resp) => {
      let getData = resp.data.map((menu) => {
        if (menu.subMenus) {
          menu.subMenus = menu.subMenus.filter(
            (subMenu) =>
              subMenu.display_name !== "Roles Permissions" &&
              subMenu.display_name !== "Sales Permissions" &&
              subMenu.display_name !== "Jobs Daily Status" &&
              subMenu.display_name !== "Error Logs" &&
              subMenu.id != 27 &&
              subMenu.display_name !== "Tracker" &&
              subMenu.display_name !== "Role Costs" &&
              subMenu.display_name !== "Upload Role Costs" &&
              subMenu.display_name !== "Contract Documents"
          );
        }
        return menu;
      });

      getData.forEach((item) => {
        if (item.display_name === textContent) {
          setRoutes([item]);
          sessionStorage.setItem("displayName", item.display_name)

        }
      });
    });
  };
  const getUrlPath = () => {
    axios({
      method: "get",
      url:
        baseUrl +
        `/CommonMS/security/authorize?url=/admin/engagementDetails&userId=${loggedUserId}`,
    }).then((res) => {
      console.log(res, "urlResponse");
    });
  };

  console.log(formData.csl?.length);
  console.log(formData.Dp?.length);
  const onSearchClick = () => {
    let valid = GlobalValidation(ref);
    if (valid == true) {
      setValidationMessage(true);
    }
    // setValidationMessage(false)
    if (valid) {
      return;
    }
    setLoader(true);
    axios({
      method: "post",
      url:
        baseUrl +
        `/administrationms/getEngagementDetails?customers=${formData.customers?.length > 2304 || formData.customers == undefined
          ? -1
          : formData.customers
        }&csl=${formData.csl?.length > 217 || formData.csl == undefined
          ? -1
          : formData.csl
        }&Dp=${formData.Dp?.length > 248 || formData.Dp == undefined
          ? -1
          : formData.Dp
        }`,
    }).then((res) => {
      const GetData = res.data;
      const Headerdata = [
        {
          customer: "Customer",
          "Engagement Name": "Engagement Name",
          "Engagement Company": "Engagement Company",
          "Sales Executive": "Sales Executive",
          CSL: "CSL",
          DP: " DP",
          "Start Date": "Start Date",
          "End Date": "End Date",
        },
      ];
      setData(Headerdata.concat(GetData));
      setTimeout(() => {
        setLoader(false);
        setSearching(true);
        setValidationMessage(false);
        setVisible(!visible);
        visible
          ? setCheveronIcon(FaChevronCircleUp)
          : setCheveronIcon(FaChevronCircleDown);
      }, 1000);
    });
  };
  const generateDropdownLabel = (selectedOptions, allOptions) => {
    const selectedValues = selectedOptions.map((option) => option.value);
    const allValues = allOptions.map((item) => item.value);

    if (selectedValues.length === allValues.length) {
      return "<< ALL >>";
    } else {
      return selectedOptions.map((option) => option.label).join(", ");
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
  const handleAbort = () => {
    abortController.current && abortController.current.abort();
    setLoader(false);
  };
  return (
    <div>
      <div className="col-md-12  mt-2">
        {validationmessage ? (
          <div className="statusMsg error">
            {" "}
            <span>
              {" "}
              <IoWarningOutline /> Please select the valid values for
              highlighted fields{" "}
            </span>
          </div>
        ) : (
          ""
        )}
      </div>
      <div className="group mb-3 customCard">
      <div className="col-md-12 collapseHeader"></div>
        <CCollapse visible={!visible}>
          <div className="group-content row">
            <div className=" col-md-4 mb-2">
              <div className="form-group row">
                <label className="col-5" htmlFor="Customers">
                  Customers&nbsp;<span className="col-1 p-0 error-text">*</span>
                </label>
                <span className="col-1">:</span>
                <div
                  className="col-6 multiselect"
                  ref={(ele) => {
                    ref.current[0] = ele;
                  }}
                >
                  {/* fordropdown */}
                  {/* <select
                                name="customers"
                                id="customers"
                                onChange={handleChange}
                            >
                                <option value="-1"> &lt;&lt;ALL&gt;&gt;</option>
                                {customer?.map((Item) => (
                                    <option key={Item.id} value={Item.id}>
                                        {Item.name}
                                    </option>
                                ))}
                            </select> */}

                  <MultiSelect
                    ArrowRenderer={ArrowRenderer}
                    valueRenderer={generateDropdownLabel}
                    id="customers"
                    options={customer}
                    hasSelectAll={true}
                    value={selectedCustomer}
                    shouldToggleOnHover={false}
                    selected={selectedCustomer}
                    onChange={(e) => {
                      setSelectedCustomer(e);
                      let filteredCustomer = [];
                      e.forEach((d) => {
                        filteredCustomer.push(d.value);
                      });
                      console.log(filteredCustomer.length);
                      setFormData((prevVal) => ({
                        ...prevVal,
                        ["customers"]: filteredCustomer.toString(),
                      }));

                      console.log(formData?.customers);
                    }}
                  />
                </div>
              </div>
            </div>
            <div className="col-md-4 mb-2">
              <div className="form-group row">
                <label className="col-5" htmlFor="csl">
                  CSL&nbsp;<span className="col-1 p-0 error-text">*</span>
                </label>
                <span className="col-1">:</span>
                <div
                  className="col-6 multiselect"
                  ref={(ele) => {
                    ref.current[1] = ele;
                  }}
                >
                  <MultiSelect
                    ArrowRenderer={ArrowRenderer}
                    valueRenderer={generateDropdownLabel}
                    id="csl"
                    options={csl}
                    hasSelectAll={true}
                    value={selectedCsl}
                    shouldToggleOnHover={false}
                    disableSearch={false}
                    selected={selectedCsl}
                    disabled={false}
                    onChange={(e) => {
                      setSelectedCsl(e);
                      let filteredCustomer = [];
                      e.forEach((d) => {
                        filteredCustomer.push(d.value);
                      });
                      setFormData((prevVal) => ({
                        ...prevVal,
                        ["csl"]: filteredCustomer.toString(),
                      }));
                    }}
                  />
                </div>
              </div>
            </div>
            <div className="col-md-4 mb-2">
              <div className="form-group row">
                <label className="col-5" htmlFor="Dp">
                  DP&nbsp;<span className="col-1 p-0 error-text">*</span>
                </label>
                <span className="col-1">:</span>
                <div
                  className="col-6 multiselect"
                  ref={(ele) => {
                    ref.current[2] = ele;
                  }}
                >
                  <MultiSelect
                    ArrowRenderer={ArrowRenderer}
                    valueRenderer={generateDropdownLabel}
                    id="Dp"
                    options={dp}
                    hasSelectAll={true}
                    value={selectedDp}
                    shouldToggleOnHover={false}
                    disableSearch={false}
                    selected={selectedDp}
                    disabled={false}
                    onChange={(e) => {
                      setSelectedDp(e);
                      let filteredCustomer = [];
                      e.forEach((d) => {
                        filteredCustomer.push(d.value);
                      });
                      setFormData((prevVal) => ({
                        ...prevVal,
                        ["Dp"]: filteredCustomer.toString(),
                      }));
                    }}
                  />
                </div>
              </div>
            </div>
            <div className="col-md-12 col-sm-12 col-xs-12 mt-2 btn-container center ">
              <button
                type="submit"
                className="btn btn-primary"
                title="Search"
                onClick={onSearchClick}
              >
                <FaSearch />
                Search
              </button>
            </div>
          </div>
        </CCollapse>
      </div>
      &nbsp;
      {loader ? <Loader handleAbort={handleAbort} /> : ""}
      {searching ? (
        <DisplayTable
        maxHeight1 = {maxHeight1}
          data={data}
          headerData={headerData}
          setHeaderData={setHeaderData}
        />
      ) : (
        " "
      )}
    </div>
  );
}

export default EngagementDetails;
