import React, { useEffect, useState } from "react";
import "primeicons/primeicons.css";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.css";
import "primeflex/primeflex.css";
import axios from "axios";
import { environment } from "../../environments/environment";
import moment from "moment";
import CellRendererPrimeReactDataTable from "../PrimeReactTableComponent/CellRendererPrimeReactDataTable";
import { Column } from "primereact/column";
import { Link } from "react-router-dom";

function HelpContents() {
  const [data, setData] = useState([{}]);
  const baseUrl = environment.baseUrl;
  const [linkColumns, setLinkColumns] = useState([]);
  const [linkColumnsRoutes, setLinkColumnsRoutes] = useState([]);
  const [headerData, setHeaderData] = useState([]);
  const loggedUserId = localStorage.getItem("resId");

  const [routes, setRoutes] = useState([]);
  let textContent = "Help Document";
  let currentScreenName = ["Help Documents"];
  console.log(routes, "routes");
  sessionStorage.setItem(
    "breadCrumbs",
    JSON.stringify({
      routes: routes,
      currentScreenName: currentScreenName,
      textContent: textContent,
    })
  );

  // const getBreadCrumbs = () => {
  //   axios({
  //     method: "GET",
  //     url: baseUrl + `/CommonMS/master/getMenus?loggedUserId=${loggedUserId}`,
  //   }).then((resp) => {
  //     let data = resp.data;

  //     data.forEach((item) => {
  //       if (item.display_name === textContent) {
  //         setRoutes([item]);
  //         sessionStorage.setItem("displayName", "Help Document");
  //       }
  //     });
  //   });
  // };

  useEffect(() => {
    let breadCrumbsData = [
      {
        display_name: "Help",
        icon_name: "",
        subMenus: [
          {
            url_path: "::help::ReleaseNotes",
            display_name: "Release Notes",
          },
          {
            url_path: "::help::helpContents",
            display_name: "Help Contents",
          },
        ],
      },
    ];
    setRoutes(breadCrumbsData);
    sessionStorage.setItem("displayName", "Help Document");
  }, []);

  const getData = () => {
    axios
      .get(baseUrl + `/supportms/support/gethelpdetails`)
      .then((res) => {
        const GetData = res.data;
        console.log(GetData);
        GetData.forEach((GetData, index) => {
          GetData["S.No"] = index + 1;
          GetData["id"] = index;
        });
        const Headerdata = [
          {
            "S.No": "S.No",
            file_name: "Documents",
            version_number: "Version Number",
            release_date: "Last Updated",
          },
        ];

        for (let i = 0; i < GetData.length; i++) {
          GetData[i]["release_date"] =
            GetData[i]["release_date"] == null
              ? ""
              : moment(GetData[i]["release_date"]).format("DD-MMM-YYYY");
        }
        let data = ["file_name"];
        let linkRoutes = ["/project/Overview/:id"];
        setLinkColumns(data);
        setLinkColumnsRoutes(linkRoutes);

        setData(Headerdata.concat(GetData));
        console.log(data);
      })
      .catch((error) => {
        console.log("Error :" + error);
      });
  };
  console.log(data);
  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    data[0] && setHeaderData(JSON.parse(JSON.stringify(data[0])));
  }, [data]);

  const LeftAlign = (data) => {
    return <div style={{ textAlign: "center" }}>{data["S.No"]}</div>;
  };

  const LinkTemplate = (data) => {
    console.log(data);
    let rou = linkColumnsRoutes[0]?.split(":");

    const downloadEmployeeData = (data) => {
      console.log(data?.file_name);
      console.log(data);

      const docUrl =
        baseUrl +
        `/VendorMS/vendor/downloadFile?documentId=${data?.document_id}&svnRevision=${data?.svn_revision}`;

      axios({
        url: docUrl,
        method: "GET",
        responseType: "blob",
      }).then((response) => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        console.log(url);
        const link = document.createElement("a");
        console.log(link);
        link.href = url;
        link.setAttribute("download", data.file_name); //or any other extension
        document.body.appendChild(link);
        link.click();
      });
    };

    useEffect(() => {
      downloadEmployeeData();
    }, []);

    return (
      <>
        <Link
          style={{ cursor: "pointer" }}
          onClick={() => {
            downloadEmployeeData(data);
          }}
        >
          <div title={data[linkColumns[0]]}> {data[linkColumns[0]]}</div>
        </Link>
      </>
    );
  };

  const VersionNumber = (data) => {
    return (
      <div style={{ textAlign: "right" }} title={data.version_number}>
        {data.version_number}
      </div>
    );
  };
  const ReleaseDate = (data) => {
    return (
      <div title={data.release_date} style={{ textAlign: "center" }}>
        {data.release_date}
      </div>
    );
  };
  const dynamicColumns = Object.keys(headerData)?.map((col, i) => {
    return (
      <Column
        sortable
        key={col}
        body={
          col == "file_name"
            ? LinkTemplate
            : col == "S.No"
            ? LeftAlign
            : col == "version_number"
            ? VersionNumber
            : col == "release_date"
            ? ReleaseDate
            : ""
        }
        field={col}
        header={headerData[col]}
        style={col === "id" ? { width: "150px" } : {}}
      />
    );
  });

  return (
    <div>
      <div className="col-md-12 mb-2">
        <div className="pageTitle">
          <div className="childOne"></div>
          <div className="childTwo">
            <h2>Help Documents</h2>
          </div>
          <div className="childThree"></div>
        </div>
      </div>

      <CellRendererPrimeReactDataTable
        data={data}
        linkColumns={linkColumns}
        linkColumnsRoutes={linkColumnsRoutes}
        dynamicColumns={dynamicColumns}
        headerData={headerData}
        setHeaderData={setHeaderData}
        rows={10}
      />
    </div>
  );
}
export default HelpContents;
