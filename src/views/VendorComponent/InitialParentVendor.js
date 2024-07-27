import React, { useState, useEffect } from "react";
import SearchVendor from "./SearchVendor";
import VendorCreate from "./VendorCreate";
import VendorOpen from "./VendorOpen";
import "./VendorCss.scss";
import axios from "axios";
import { environment } from "../../environments/environment";
import ReviewsVendor from "./ReviewsVendor";

function InitialParentVendor() {
  const [buttonState, setButtonState] = useState("Open");
  const [urlState, setUrlState] = useState("/search/userVendorHistory/");
  const [buttonValue, setButtonValue] = useState("Vendor");
  const [accessData, setAccessData] = useState([]);
  const loggedUserId = localStorage.getItem("resId");
  const baseUrl = environment.baseUrl;

  const getMenus = () => {
    // Save the selected tab to localStorage whenever it changes

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
      {buttonState === "Create" && (
        <VendorCreate
          urlState={urlState}
          buttonState={buttonState}
          setButtonState={setButtonState}
          setUrlState={setUrlState}
        />
      )}
      {buttonState === "Open" && (
        <VendorOpen
          buttonValue={buttonValue}
          urlState={urlState}
          buttonState={buttonState}
          setButtonState={setButtonState}
          setUrlState={setUrlState}
        />
      )}
      {buttonState === "Search" && (
        <SearchVendor
          urlState={urlState}
          buttonState={buttonState}
          setButtonState={setButtonState}
          setUrlState={setUrlState}
        />
      )}
      {buttonState === "Reviews" && (
        <ReviewsVendor
          urlState={urlState}
          buttonState={buttonState}
          setButtonState={setButtonState}
          setUrlState={setUrlState}
        />
      )}
    </div>
  );
}

export default InitialParentVendor;
