import React, { Suspense, useEffect, useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { CContainer, CRow, CSpinner } from "@coreui/react";

// routes config
import routes from "../routes";
import axios from "axios";
import { environment } from "../environments/environment";

const AppContent = () => {
  const loggedUserId = localStorage.getItem("resId");
  const Page404 = React.lazy(() => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(import("../views/pages/page404/Page404"));
      }, 1000);
    });
  });

  const baseUrl = environment.baseUrl;

  const [routesData, setRoutesData] = useState([]);
  const [responseReceived, setResponseReceived] = useState(false);

  useEffect(() => {
    getRouterMenus();
  }, [routes]);

  const getRouterMenus = () => {
    let routesDt = [];
    axios({
      method: "GET",
      url: baseUrl + `/CommonMS/master/getMenus?loggedUserId=${loggedUserId}`,
    })
      .then((resp) => {
        let data = resp.data;
        for (let i = 0; i < data.length; i++) {
          let subMenusRawData = data[i]["subMenus"];
          if (subMenusRawData.length > 0) {
            formattingSubMenusRawData(subMenusRawData, routesDt);
          } else {
            formattingSubMenusRawData([data[i]], routesDt);
          }
        }

        let staticRoutesData = routes["staticRoutesData"];

        for (let i = 0; i < staticRoutesData.length; i++) {
          routesDt.push(staticRoutesData[i]);
        }

        setRoutesData(routesDt);
        setResponseReceived(true);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setResponseReceived(true);
      });
  };

  const formattingSubMenusRawData = (subMenusRawData, routesDt) => {
    for (let j = 0; j < subMenusRawData.length; j++) {
      const routePathData = {
        path: "",
        name: "",
        element: null,
      };
      routePathData["path"] = subMenusRawData[j]["url_path"].replaceAll(
        "::",
        "/"
      );
      routePathData["name"] = subMenusRawData[j]["display_name"].replaceAll(
        " ",
        ""
      );

      routePathData["element"] = routes["routesData"][routePathData["name"]];

      if (
        subMenusRawData[j]["url_path"]
          .replaceAll("::", "/")
          .includes("/pmo/projectInvoiceDetails")
      ) {
        console.log(subMenusRawData[j]);
        console.log(routePathData);
        console.log(routePathData["name"]);
      }

      routesDt.push(routePathData);
      console.log(routePathData);
    }
  };

  return (
    <CContainer fluid className="pageContainer">
      <CRow>
        <Suspense fallback={""}>
          <Routes>
            {routesData.map((route, idx) => {
              return (
                route.element && (
                  <Route
                    key={idx}
                    path={route.path}
                    exact={route.exact}
                    name={route.name}
                    element={<route.element />}
                  />
                )
              );
            })}
            <Route path="/" element={<Navigate to="md/project" replace />} />
            <Route
              path="*"
              element={
                responseReceived ? (
                  <Page404 responseReceived={responseReceived} />
                ) : (
                  ""
                )
              }
            />{" "}
          </Routes>
        </Suspense>
      </CRow>
    </CContainer>
  );
};

export default React.memo(AppContent);
