import React, { useState, useEffect } from "react";
import axios from "axios";
import { environment } from "../../environments/environment";
import "./VendorCss.scss";

function InitialParentVendor({ buttonState, setButtonState, setUrlState }) {
  const [accessData, setAccessData] = useState([]);
  const loggedUserId = localStorage.getItem("resId");
  const baseUrl = environment.baseUrl;
  const getMenus = () => {
    // setMenusData

    axios
      .get(baseUrl + `/CommonMS/master/getMenus?loggedUserId=${loggedUserId}`)
      .then((resp) => {
        // setAccessLevel(revenueForcastSubMenu);
        const vendorData = resp.data
          .find((item) => item.display_name === "Vendors")
          .subMenus.find((subMenu) => subMenu.display_name === "Vendors");
        console.log(vendorData.userRoles);
        setAccessData(vendorData.userRoles);
      });
  };
  useEffect(() => {
    getMenus();
  }, [accessData]);
  console.log(accessData);
  return (
    <div>
      <div className="tabsProject">
        <button
          className={
            buttonState === "Open" ? "buttonDisplayClick" : "buttonDisplay"
          }
          onClick={() => {
            setButtonState("Open");
            setUrlState("/search/userVendorHistory/");
          }}
        >
          Open
        </button>
        <button
          className={
            buttonState === "Search" ? "buttonDisplayClick" : "buttonDisplay"
          }
          onClick={() => {
            setButtonState("Search");
            setUrlState("/vmg/vendorSearch");
          }}
        >
          Search
        </button>
        {accessData == 911 || accessData == 908 ? (
          ""
        ) : (
          <button
            className={
              buttonState === "Create" ? "buttonDisplayClick" : "buttonDisplay"
            }
            onClick={() => {
              setButtonState("Create");
              setUrlState("/vmg/create/");
            }}
          >
            Create
          </button>
        )}
        <button
          className={
            buttonState === "Reviews" ? "buttonDisplayClick" : "buttonDisplay"
          }
          onClick={() => {
            setButtonState("Reviews");
            // setUrlState("/vmg/create/");
          }}
        >
          Reviews
        </button>
      </div>
    </div>
  );
}

export default InitialParentVendor;
