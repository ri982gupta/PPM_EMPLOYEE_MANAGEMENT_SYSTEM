import React, { useState } from "react";
import { MultiSelect } from "react-multi-select-component";
import DatePicker from "react-datepicker";
import {
  FaChevronCircleDown,
  FaChevronCircleUp,
  FaSearch,
  FaCheck,
} from "react-icons/fa";
import { CCollapse } from "@coreui/react";
import GlobalHelp from "../PrimeReactTableComponent/GlobalHelp";
import { useEffect } from "react";
import axios from "axios";
import { environment } from "../../environments/environment";
function DemandAndSupply() {
  const [startDate, setStartDate] = useState(new Date());
  const [visible, setVisible] = useState(false);
  const [cheveronIcon, setCheveronIcon] = useState(FaChevronCircleUp);
  const HelpPDFName = "DemandSupplyRMG.pdf";
  const Headername = "Demand and Supply Help";
  const loggedUserId = localStorage.getItem("resId");
  const [routes, setRoutes] = useState([]);
  let textContent = "Fullfilment";
  let currentScreenName = ["Demand And Supply"];
  sessionStorage.setItem(
    "breadCrumbs",
    JSON.stringify({
      routes: routes,
      currentScreenName: currentScreenName,
      textContent: textContent,
    })
  );
  const ArrowRenderer = ({ expanded }) => (
    <>
      {expanded ? (
        <FaCaretDown className="chevronIcon" />
      ) : (
        <FaCaretDown className="chevronIcon" />
      )}
    </>
  );

  const generateDropdownLabel = (selectedOptions, allOptions) => {
    const selectedValues = selectedOptions.map((option) => option.value);
    const allValues = allOptions.map((item) => item.value);

    if (selectedValues.length === allValues.length) {
      return "<< ALL >>";
    } else {
      return selectedOptions.map((option) => option.label).join(", ");
    }
  };

  const getCountries = () => {
    axios
      .get(baseUrl + `/CostMS/cost/getCountries`)
      .then((Response) => {
        let countries = [];
        let data = Response.data;
        console.log(data);
        data.push({ id: 0, country_name: "<<Others>>" });
        data.length > 0 &&
          data.forEach((e) => {
            let countryObj = {
              label: e.country_name,
              value: e.id,
            };
            countries.push(countryObj);
          });
        setCountry(countries);
        if (id == null) {
          setSelectedCountry(countries);
        }
      })
      .catch((error) => console.log(error));
  };

  const getBusinessUnit = () => {
    axios
      .get(baseUrl + `/CostMS/cost/getDepartments`)
      .then((Response) => {
        let countries = [];
        let data = Response.data;
        console.log(data);
        data.push({ value: 0, label: "Non-Revenue Units" });
        data.length > 0 &&
          data.forEach((e) => {
            let countryObj = {
              label: e.label,
              value: e.value,
            };
            countries.push(countryObj);
          });
        setBusiness(countries);
        if (id == null) {
          setSelectedBusiness(countries);
        }
      })
      .catch((error) => console.log(error));
  };

  const getRoles = () => {
    axios
      .get(baseUrl + `/fullfilmentms/rmg/getRoles`)
      .then((Response) => {
        let roles = [];
        let data = Response.data;
        console.log(data);

        data.length > 0 &&
          data.forEach((e) => {
            let rolesObj = {
              label: e.name,
              value: e.id,
            };
            roles.push(rolesObj);
          });
        setRoles(roles);
        if (id == null) {
          setSelectedRoles(roles);
        }
      })
      .catch((error) => console.log(error));
  };

  useEffect(() => {
    getMenus();
  }, []);
  const baseUrl = environment.baseUrl;
  const getMenus = () => {
    // setMenusData

    axios({
      method: "GET",
      url: baseUrl + `/CommonMS/master/getMenus?loggedUserId=${loggedUserId}`,
    }).then((resp) => {
      let data = resp.data;

      data.forEach((item) => {
        if (item.display_name === textContent) {
          setRoutes([item]);
          sessionStorage.setItem("displayName", item.display_name);
        }
      });
    });
  };
  return (
    <div>
      <div className="col-md-12">
        <div className="pageTitle">
          <div className="childOne"></div>
          <div className="childTwo">
            <h2>Demand And Supply</h2>
          </div>
          <div className="childThree toggleBtns">
            <div>
              <p className="searchFilterHeading">Search Filters</p>
              <span
                onClick={() => {
                  setVisible(!visible);

                  visible
                    ? setCheveronIcon(FaChevronCircleUp)
                    : setCheveronIcon(FaChevronCircleDown);
                }}
              >
                {cheveronIcon}
              </span>
            </div>
            <GlobalHelp pdfname={HelpPDFName} name={Headername} />
          </div>{" "}
        </div>
      </div>

      <div className="group mb-3 customCard">
      <div className="col-md-12 collapseHeader"></div>
        <CCollapse visible={!visible}>
          <div className="group-content row">
            <div className=" col-md-3 mb-2">
              <div className="form-group row">
                <label className="col-5" htmlFor="action">
                  Action
                </label>
                <span className="col-1 p-0">:</span>
                <div className="col-6">
                  <select className="form-control" id="action"></select>
                </div>
              </div>
            </div>
            <div className=" col-md-3 mb-2">
              <div className="form-group row">
                <label className="col-5" htmlFor="bu">
                  BU
                </label>
                <span className="col-1 p-0">:</span>
                <div className="col-6">
                  <MultiSelect
                    id="roles"
                    options={[]}
                    hasSelectAll={true}
                    isLoading={false}
                    shouldToggleOnHover={false}
                    disableSearch={false}
                    //   valueRenderer={customValueRenderer}

                    //   value={selectedRoleTypes}

                    disabled={false}
                  />
                </div>
              </div>
            </div>
            <div className=" col-md-3 mb-2">
              <div className="form-group row">
                <label className="col-5" htmlFor="country">
                  country
                </label>
                <span className="col-1 p-0">:</span>
                <div className="col-6">
                  <MultiSelect
                    id="roles"
                    options={[]}
                    hasSelectAll={true}
                    isLoading={false}
                    shouldToggleOnHover={false}
                    disableSearch={false}
                    //   valueRenderer={customValueRenderer}

                    //   value={selectedRoleTypes}

                    disabled={false}
                  />
                </div>
              </div>
            </div>
            <div className=" col-md-3 mb-2">
              <div className="form-group row">
                <label className="col-5" htmlFor="roles">
                  Roles
                </label>
                <span className="col-1 p-0">:</span>
                <div className="col-6">
                  <MultiSelect
                    id="roles"
                    options={[]}
                    hasSelectAll={true}
                    isLoading={false}
                    shouldToggleOnHover={false}
                    disableSearch={false}
                    //   valueRenderer={customValueRenderer}

                    //   value={selectedRoleTypes}

                    disabled={false}
                  />
                </div>
              </div>
            </div>
            <div className=" col-md-3 mb-2">
              <div className="form-group row">
                <label className="col-5" htmlFor="month">
                  Month
                </label>
                <span className="col-1 p-0">:</span>
                <div className="col-6">
                  <DatePicker
                    selected={startDate}
                    onChange={(date) => setStartDate(date)}
                    dateFormat="MM/yyyy"
                    showMonthYearPicker
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
                  <select className="form-control" id="duration"></select>
                </div>
              </div>
            </div>
            <div className="col-md-12 col-sm-12 col-xs-12 btn-container center my-3 mb-2">
              <button className="btn btn-primary ">Search</button>
            </div>
          </div>
        </CCollapse>
      </div>
    </div>
  );
}

export default DemandAndSupply;
