// import React, { useState } from "react";

// import RProfile from "../ResourceProfile/RProfile";
// import BankDetails from "./BankDetails";
// import CommonComponents from "./CommonComponents";
// import HeaderFooter from "./HeaderFooter";
// import InvoiceOpen from "./InvoiceOpen";
// import Services from "./Services";
// import Projectinvoicedetails from "./Projectinvoicedetails";
// import ProjectInvoiceDetailsFilters from "../ProjectInvoiceDetailsComponent/ProjectInvoiceDetailsFilters";
// function Invoice() {
//   let topMenus = ["Header & Footer", "Bank Details", "Open", "Common Components","Services","Invoice Details"];

//   const [buttonState, setButtonState] = useState(topMenus);
//   return (
//     <div>
//       <div className="tabs">
//       {topMenus.map((data, index) => {
//         return (
//           <button
//             className={
//               buttonState === data ? "buttonDisplayClick" : "buttonDisplay"
//             }
//             onClick={() => {
//               setButtonState(data);
//               // navigate("/home");
//             }}
//             key={index}
//           >
//             {data}
//           </button>
//         );
//       })}
// </div>
//       {buttonState === "Header & Footer" && <HeaderFooter />}
//       {buttonState === "Bank Details" && <BankDetails />}
//       {buttonState === "Open" && <InvoiceOpen/>}
//       {buttonState === "Invoice Details" && <Projectinvoicedetails/>}
//       {buttonState === "Common Components" && <CommonComponents/>}
//       {buttonState === "Services" && <Services/>}
   
//     </div>
//   );
// }

// export default Invoice;

// ******************** This code is for when we are refresh at a particular page, it should be with in that page ***********************
import React, { useState, useEffect } from "react";
import RProfile from "../ResourceProfile/RProfile";
import BankDetails from "./BankDetails";
import CommonComponents from "./CommonComponents";
import HeaderFooter from "./HeaderFooter";
import InvoiceOpen from "./InvoiceOpen";
import Services from "./Services";
import Projectinvoicedetails from "./Projectinvoicedetails";
import ProjectInvoiceDetailsFilters from "../ProjectInvoiceDetailsComponent/ProjectInvoiceDetailsFilters";

function Invoice() {
  let topMenus = ["Header & Footer", "Bank Details", "Open", "Common Components", "Services", "Invoice Details"];

  const [buttonState, setButtonState] = useState(() => {
    // Retrieve the last selected button state from localStorage on component mount
    return localStorage.getItem("invoiceButtonState") || topMenus[0];
  });

  useEffect(() => {
    // Save the selected button state to localStorage whenever it changes
    localStorage.setItem("invoiceButtonState", buttonState);
  }, [buttonState]);

  return (
    <div>
      <div className="tabs">
        {topMenus.map((data, index) => {
          return (
            <button
              className={
                buttonState === data ? "buttonDisplayClick" : "buttonDisplay"
              }
              onClick={() => {
                setButtonState(data);
              }}
              key={index}
            >
              {data}
            </button>
          );
        })}
      </div>
      {buttonState === "Header & Footer" && <HeaderFooter />}
      {buttonState === "Bank Details" && <BankDetails />}
      {buttonState === "Open" && <InvoiceOpen />}
      {buttonState === "Invoice Details" && <Projectinvoicedetails />}
      {buttonState === "Common Components" && <CommonComponents />}
      {buttonState === "Services" && <Services />}
    </div>
  );
}

export default Invoice;

