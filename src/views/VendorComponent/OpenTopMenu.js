import React, { useState } from "react";
import VendorPerformance from "./VendorPerformance";


function OpenTopMenu() {
    let topMenus = ["Dashboard", "Documents", "Resources","Reviews","Performance"];
    const [buttonState, setButtonState] = useState(() => {
      // Retrieve the last selected tab from localStorage on component mount
      return localStorage.getItem("selectedOpenTopMenuTab") || topMenus[0];
    });

    useEffect(() => {
      // Save the selected tab to localStorage whenever it changes
      localStorage.setItem("selectedOpenTopMenuTab", btnState);
      tabMenus();
    }, [btnState]);
  return (
    <div> <div className="tabs">
    {topMenus.map((data, index) => {
      return (
        <button
          className={
            buttonState === data ? "buttonDisplayClick" : "buttonDisplay"
          }
          onClick={() => {
            setButtonState(data);
            // navigate("/home");
          }}
          key={index}
        >
          {data}
        </button>
      );
    })}
</div>
   
    {buttonState === "Performance" && <VendorPerformance />}
    </div>
  )
}

export default OpenTopMenu