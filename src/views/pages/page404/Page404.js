import React, { useEffect } from "react";
import { CCol, CContainer, CRow } from "@coreui/react";
import { FaHome } from "react-icons/fa";
import { Link } from "react-router-dom";

const Page404 = () => {
  useEffect(() => {
    sessionStorage.setItem("404", "true");

    return () => {
      sessionStorage.removeItem("404");
    };
  }, []);

  return (
    <div className="bg-light min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={6}>
            <div className="clearfix">
              <h1 className="float-start display-3 me-4">404</h1>
              <h4 className="pt-3">Oops! You{"'"}re lost.</h4>
              <p className="text-medium-emphasis float-start">
                The page you are looking for was not found.
              </p>
            </div>
            <div style={{ width: "27%" }}>
              <Link to="/" className="btn btn-primary mt-3">
                <FaHome /> Go to Homepage
              </Link>
            </div>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  );
};

export default Page404;
