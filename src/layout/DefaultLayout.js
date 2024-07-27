import React from "react";
import {
  AppContent,
  AppSidebar,
  AppFooter,
  AppHeader,
} from "../components/index";

const DefaultLayout = () => {
  const page404 = sessionStorage.getItem("404") === "true";
  return (
    <div>
      {!page404 && <AppSidebar />}
      <div className="wrapper d-flex flex-column min-vh-100">
        {!page404 && <AppHeader />}

        <div className="body ">
          <AppContent />
        </div>
        {/* <AppFooter /> */}
      </div>
    </div>
  );
};

export default DefaultLayout;
