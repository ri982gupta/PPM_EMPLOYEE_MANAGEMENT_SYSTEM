import React from "react";
import { ReactSearchAutocomplete } from "react-search-autocomplete";
import { useState, useEffect } from "react";
import axios from "axios";
import { environment } from "../../environments/environment";

function AutoComplete(props) {
  const {
    vendorListData,
    setExpensesLength,
    setVendorListData,
    setAutoCompleteData,
    projectData,
    customerData,
    setAccess,
    buttonValue,
    setFilteredData,
    access,
    filteredData,
    setAutoId,
    setAid,
    aid,
    setMainAccessData,
    engagementData,
    expenseData,
  } = props;
  const [item, setItem] = useState([]);
  const baseUrl = environment.baseUrl;
  const loggedUserId = localStorage.getItem("resId");

  console.log(buttonValue);

  const handleClear = () => {
    setAutoCompleteData((prevProps) => ({ ...prevProps, id: null }));
  };

  console.log(aid, "auto id's-------");
  const getAccess = (a) => {
    axios({
      method: "get",
      url:
        baseUrl +
        `/CommonMS/master/getTabMenus?ProjectId=${a}&loggedUserId=${loggedUserId}&type=Project&subType=project`,
    })
      .then(function (response) {
        var resp = response.data;
        // resp.push({ id: "-1", name: "<<ALL>>" });
        setAccess(resp);
      })
      .catch(function (response) {});
  };
  // const [filteredData, setFilteredData] = useState([]);
  const getMenus = () => {
    // setMenusData

    axios({
      method: "GET",
      url: baseUrl + `/CommonMS/master/getMenus?loggedUserId=${loggedUserId}`,
    }).then((resp) => {
      let data = resp.data;
      console.log(data);
      const projectStatusReportSubMenu = data
        .find((item) => item.display_name === "Time & Expenses")
        .subMenus.find((subMenu) => subMenu.display_name === "Expenses");
      console.log(projectStatusReportSubMenu);
      setFilteredData(projectStatusReportSubMenu.userRoles);
      // Store the filtered objects in the state
      // if (filteredObjects.length > 0) {
      //   filteredData(filteredObjects);
      // }
    });
  };
  // useEffect(() => {
  //   getMenus();
  // }, []);
  console.log(filteredData);
  const getCustomerAccess = (b) => {
    axios({
      method: "get",
      url:
        baseUrl +
        `/CommonMS/master/getTabMenus?ProjectId=${b}&loggedUserId=${loggedUserId}&type=Customer&subType=customer`,
    })
      .then(function (response) {
        var resp = response.data;
        // resp.push({ id: "-1", name: "<<ALL>>" });
        setAccess(resp);
      })
      .catch(function (response) {});
  };
  const getVendorAccess = (v) => {
    axios({
      method: "get",
      url:
        baseUrl +
        `/CommonMS/master/getTabMenus?ProjectId=${v}&loggedUserId=${loggedUserId}&type=vendor&subType=vmg`,
    })
      .then(function (response) {
        var resp = response.data;
        // resp.push({ id: "-1", name: "<<ALL>>" });
        setAccess(resp);
        setAid(resp.length);
      })
      .catch(function (response) {});
  };
  const getEngagementAccess = (c) => {
    axios({
      method: "get",
      url:
        baseUrl +
        `/CommonMS/master/getTabMenus?ProjectId=${c}&loggedUserId=${loggedUserId}&type=Customer&subType=engagement`,
    })
      .then(function (response) {
        var resp = response.data;
        // resp.push({ id: "-1", name: "<<ALL>>" });
        setAccess(resp);
      })
      .catch(function (response) {});
  };
  const getExpenseAccess = (c) => {
    axios({
      method: "get",
      url:
        baseUrl +
        `/timeandexpensesms/ExpenseOpen/getExpenseAuthorized?userid=${
          Number(loggedUserId) + 1
        }&expenseId=${c}`,
      // `/CommonMS/master/getTabMenus?ProjectId=${c}&loggedUserId=${loggedUserId}&type=Expense&subType=Expense`,
    })
      .then(function (response) {
        var resp = response.data;
        // resp.push({ id: "-1", name: "<<ALL>>" });
        setAccess(resp);
        console.log(resp.length);
        setExpensesLength(resp.length);
      })
      .catch(function (response) {});
  };
  useEffect(() => {}, [item]);
  useEffect(() => {}, [vendorListData]);
  useEffect(() => {}, [aid]);

  // console.log(aid, "-------id----------");

  {
    return (
      <>
        <div className="autoComplete-container">
          {buttonValue == "Project" ? (
            <>
              <ReactSearchAutocomplete
                items={projectData}
                type="Text"
                name="reviewedBy"
                id="reviewedBy"
                className="error AutoComplete"
                onSelect={(e) => {
                  setAutoCompleteData(e);
                  // setAid(e.id);
                  getAccess(e.id);
                }}
                showIcon={false}
                onClear={handleClear}
                placeholder="Type minimum 4 characters"
              />{" "}
            </>
          ) : buttonValue == "Engagement" ? (
            <>
              <ReactSearchAutocomplete
                items={engagementData}
                type="Text"
                name="reviewedBy"
                id="reviewedBy"
                className="error AutoComplete"
                onSelect={(e) => {
                  setAutoCompleteData(e);
                  getEngagementAccess(e.id);
                }}
                showIcon={false}
                onClear={handleClear}
                placeholder="Type minimum 4 characters"
              />
            </>
          ) : buttonValue == "Customer" ? (
            <>
              <ReactSearchAutocomplete
                items={customerData}
                type="Text"
                name="reviewedBy"
                id="reviewedBy"
                className="error AutoComplete"
                onSelect={(e) => {
                  setAutoCompleteData(e);
                  getCustomerAccess(e.id);
                }}
                showIcon={false}
                onClear={handleClear}
                placeholder="Type minimum 4 characters"
              />
            </>
          ) : buttonValue == "Expense" ? (
            <>
              <ReactSearchAutocomplete
                items={expenseData}
                type="Text"
                name="reviewedBy"
                id="reviewedBy"
                className="error AutoComplete"
                onSelect={(e) => {
                  setAutoCompleteData(e);
                  getExpenseAccess(e.id);
                  getMenus();
                }}
                showIcon={false}
                onClear={handleClear}
                placeholder="Type minimum 4 characters"
              />
            </>
          ) : (
            <ReactSearchAutocomplete
              items={vendorListData}
              type="Text"
              name="reviewedBy"
              id="reviewedBy"
              className="error AutoComplete"
              setVendorListData={setVendorListData}
              onSelect={(e) => {
                setAutoCompleteData(e);
                getVendorAccess(e.id);
                console.log(e);
              }}
              showIcon={false}
              onClear={handleClear}
              placeholder="Type minimum 4 characters"
            />
          )}
        </div>

        <span> {item.name}</span>
      </>
    );
  }
}

export default AutoComplete;
