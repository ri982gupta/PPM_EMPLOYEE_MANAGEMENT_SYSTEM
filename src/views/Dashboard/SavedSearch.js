import React from "react";
import { environment } from "../../environments/environment";
import { FaCloudDownloadAlt } from "react-icons/fa";
import { SlExclamation } from "react-icons/sl";
import { useState, useEffect } from "react";
import axios from "axios";
import {
  CCollapse,
  CModal,
  CModalBody,
  CModalHeader,
  CModalTitle,
} from "@coreui/react";
import { FaChevronCircleDown, FaChevronCircleUp } from "react-icons/fa";
import { Column } from "ag-grid-community";
import CellRendererPrimeReactDataTable from "../PrimeReactTableComponent/CellRendererPrimeReactDataTable";
import { AiFillDelete, AiFillEdit } from "react-icons/ai";
import { Link, useNavigate } from "react-router-dom";
import moment from "moment";
import SavedSearchPopup from "./SaveSearchPopup";
import Draggable from "react-draggable";
import { BiCheck } from "react-icons/bi";
import ServiceSearchFilters from "../ServiceComponent/ServiceSearchFilters";
import { useContext } from "react";
import ScreenBreadcrumbs from "../Common/ScreenBreadcrumbs";
import "./SavedSearch.scss";
function SavedSearch() {
  let rows = 10;
  const loggedUserId = localStorage.getItem("resId");
  const loggedUserName = localStorage.getItem("resName");
  const [visibleA, setVisibleA] = useState(false);
  const [visibleB, setVisibleB] = useState(true);
  const [visibleC, setVisibleC] = useState(true);
  const [visibleD, setVisibleD] = useState(true);
  const [visibleE, setVisibleE] = useState(true);
  const [visibleF, setVisibleF] = useState(true);
  const [visibleG, setVisibleG] = useState(true);
  const [visibleH, setVisibleH] = useState(true);
  const [visibleI, setVisibleI] = useState(true);
  const [visibleJ, setVisibleJ] = useState(true);
  const [visibleK, setVisibleK] = useState(true);
  const [visibleL, setVisibleL] = useState(true);
  const [visibleM, setVisibleM] = useState(true);
  const [visibleN, setVisibleN] = useState(true);
  const [visibleO, setVisibleO] = useState(true);
  const [visibleP, setVisibleP] = useState(true);
  const [cheveronIconA, setCheveronIconA] = useState(FaChevronCircleDown);
  const [cheveronIconB, setCheveronIconB] = useState(FaChevronCircleDown);
  const [cheveronIconC, setCheveronIconC] = useState(FaChevronCircleDown);
  const [cheveronIconD, setCheveronIconD] = useState(FaChevronCircleDown);
  const [cheveronIconE, setCheveronIconE] = useState(FaChevronCircleDown);
  const [cheveronIconF, setCheveronIconF] = useState(FaChevronCircleDown);
  const [cheveronIconG, setCheveronIconG] = useState(FaChevronCircleDown);
  const [cheveronIconH, setCheveronIconH] = useState(FaChevronCircleDown);
  const [cheveronIconI, setCheveronIconI] = useState(FaChevronCircleDown);
  const [cheveronIconJ, setCheveronIconJ] = useState(FaChevronCircleDown);
  const [cheveronIconK, setCheveronIconK] = useState(FaChevronCircleDown);
  const [cheveronIconL, setCheveronIconL] = useState(FaChevronCircleDown);
  const [cheveronIconM, setCheveronIconM] = useState(FaChevronCircleDown);
  const [cheveronIconN, setCheveronIconN] = useState(FaChevronCircleDown);
  const [cheveronIconO, setCheveronIconO] = useState(FaChevronCircleDown);
  const [cheveronIconP, setCheveronIconP] = useState(FaChevronCircleDown);
  const baseUrl = environment.baseUrl;
  const [addmsg, setAddmsg] = useState(false);
  const [data, setData] = useState([{}]);
  const [headerData, setHeaderData] = useState([]);
  const [linkColumns, setLinkColumns] = useState([]);
  const [linkColumnsRoutes, setLinkColumnsRoutes] = useState([]);
  const [type, setType] = useState("add");
  const [editedData, setEditedData] = useState([]);
  const [editId, setEditId] = useState();
  const [deletePopup16, setDeletePopup16] = useState(false);

  const [data1, setData1] = useState([{}]);
  const [buttonPopup1, setButtonPopup1] = useState(false);
  const [headerData1, setHeaderData1] = useState([]);
  const [linkColumns1, setLinkColumns1] = useState([]);
  const [linkColumnsRoutes1, setLinkColumnsRoutes1] = useState([]);
  const [deletePopup1, setDeletePopup1] = useState(false);
  const [editId1, setEditId1] = useState();

  const [data2, setData2] = useState([{}]);
  const [buttonPopup2, setButtonPopup2] = useState(false);
  const [headerData2, setHeaderData2] = useState([]);
  const [linkColumns2, setLinkColumns2] = useState([]);
  const [linkColumnsRoutes2, setLinkColumnsRoutes2] = useState([]);
  const [deletePopup2, setDeletePopup2] = useState(false);
  const [editId2, setEditId2] = useState();

  const [data3, setData3] = useState([{}]);
  const [deletePopup3, setDeletePopup3] = useState(false);
  const [headerData3, setHeaderData3] = useState([]);
  const [linkColumns3, setLinkColumns3] = useState([]);
  const [linkColumnsRoutes3, setLinkColumnsRoutes3] = useState([]);
  const [editId3, setEditId3] = useState();

  const [data4, setData4] = useState([{}]);
  // const [buttonPopup3, setButtonPopup3] = useState(false);
  const [headerData4, setHeaderData4] = useState([]);
  const [linkColumns4, setLinkColumns4] = useState([]);
  const [linkColumnsRoutes4, setLinkColumnsRoutes4] = useState([]);
  const [deletePopup4, setDeletePopup4] = useState(false);
  const [editId4, setEditId4] = useState();

  const [data5, setData5] = useState([{}]);
  const [deletePopup5, setDeletePopup5] = useState(false);
  const [headerData5, setHeaderData5] = useState([]);
  const [linkColumns5, setLinkColumns5] = useState([]);
  const [linkColumnsRoutes5, setLinkColumnsRoutes5] = useState([]);
  const [editId5, setEditId5] = useState();

  const [data6, setData6] = useState([{}]);
  const [deletePopup6, setDeletePopup6] = useState(false);
  const [headerData6, setHeaderData6] = useState([]);
  const [linkColumns6, setLinkColumns6] = useState([]);
  const [linkColumnsRoutes6, setLinkColumnsRoutes6] = useState([]);
  const [editId6, setEditId6] = useState();

  const [data7, setData7] = useState([{}]);
  const [deletePopup7, setDeletePopup7] = useState(false);
  const [headerData7, setHeaderData7] = useState([]);
  const [linkColumns7, setLinkColumns7] = useState([]);
  const [linkColumnsRoutes7, setLinkColumnsRoutes7] = useState([]);
  const [editId7, setEditId7] = useState();

  const [data8, setData8] = useState([{}]);
  const [deletePopup8, setDeletePopup8] = useState(false);
  const [headerData8, setHeaderData8] = useState([]);
  const [linkColumns8, setLinkColumns8] = useState([]);
  const [linkColumnsRoutes8, setLinkColumnsRoutes8] = useState([]);
  const [editId8, setEditId8] = useState();

  const [data9, setData9] = useState([{}]);
  const [deletePopup9, setDeletePopup9] = useState(false);
  const [headerData9, setHeaderData9] = useState([]);
  const [linkColumns9, setLinkColumns9] = useState([]);
  const [linkColumnsRoutes9, setLinkColumnsRoutes9] = useState([]);
  const [editId9, setEditId9] = useState();

  const [data10, setData10] = useState([{}]);
  const [deletePopup10, setDeletePopup10] = useState(false);
  const [headerData10, setHeaderData10] = useState([]);
  const [linkColumns10, setLinkColumns10] = useState([]);
  const [linkColumnsRoutes10, setLinkColumnsRoutes10] = useState([]);
  const [editId10, setEditId10] = useState();

  const [data11, setData11] = useState([{}]);
  const [deletePopup11, setDeletePopup11] = useState(false);
  const [headerData11, setHeaderData11] = useState([]);
  const [linkColumns11, setLinkColumns11] = useState([]);
  const [linkColumnsRoutes11, setLinkColumnsRoutes11] = useState([]);
  const [editId11, setEditId11] = useState();

  const [data12, setData12] = useState([{}]);
  const [deletePopup12, setDeletePopup12] = useState(false);
  const [headerData12, setHeaderData12] = useState([]);
  const [linkColumns12, setLinkColumns12] = useState([]);
  const [linkColumnsRoutes12, setLinkColumnsRoutes12] = useState([]);
  const [editId12, setEditId12] = useState();

  const [data13, setData13] = useState([{}]);
  const [deletePopup13, setDeletePopup13] = useState(false);
  const [headerData13, setHeaderData13] = useState([]);
  const [linkColumns13, setLinkColumns13] = useState([]);
  const [linkColumnsRoutes13, setLinkColumnsRoutes13] = useState([]);
  const [editId13, setEditId13] = useState();

  const [data14, setData14] = useState([{}]);
  const [deletePopup14, setDeletePopup14] = useState(false);
  const [headerData14, setHeaderData14] = useState([]);
  const [linkColumns14, setLinkColumns14] = useState([]);
  const [linkColumnsRoutes14, setLinkColumnsRoutes14] = useState([]);
  const [editId14, setEditId14] = useState();

  const [data15, setData15] = useState([{}]);
  const [deletePopup15, setDeletePopup15] = useState(false);
  const [headerData15, setHeaderData15] = useState([]);
  const [linkColumns15, setLinkColumns15] = useState([]);
  const [linkColumnsRoutes15, setLinkColumnsRoutes15] = useState([]);
  const [editId15, setEditId15] = useState();

  const value = "SavedSearch";

  // ------------breadcrumbs------------------
  const [routes, setRoutes] = useState([]);
  let textContent = "Dashboards";
  let currentScreenName = ["Saved Searches"];
  sessionStorage.setItem(
    "breadCrumbs",
    JSON.stringify({
      routes: routes,
      currentScreenName: currentScreenName,
      textContent: textContent,
    })
  );

  const getMenus = () => {
    // setMenusData

    axios({
      method: "GET",
      url: baseUrl + `/CommonMS/master/getMenus?loggedUserId=${loggedUserId}`,
    }).then((resp) => {
      let data = resp.data;
      const updatedMenuData = data.map((category) => ({
        ...category,
        subMenus: category.subMenus.filter(
          (submenu) => submenu.display_name !== "Custom Dashboard"
        ),
      }));

      updatedMenuData.forEach((item) => {
        if (item.display_name === textContent) {
          setRoutes([item]);
          sessionStorage.setItem("displayName", item.display_name);
        }
      });
    });
  };
  const getUrlPath = () => {
    axios({
      method: "get",
      url:
        baseUrl +
        `/CommonMS/security/authorize?url=/search/savedSearches&userId=${loggedUserId}`,
    }).then((res) => {
      console.log(res, "urlResponse");
    });
  };
  //----------------------------MonthlyRevenuveForecast----------------------------------
  const getData = () => {
    axios
      .get(
        baseUrl +
          `/dashboardsms/savedsearch/getMonthlyRevenuveForecast?user_id=${loggedUserId}`
      )
      .then((res) => {
        const GetData = res.data;
        for (let i = 0; i < GetData.length; i++) {
          GetData[i]["SNo"] = i + 1;
          GetData[i]["date_created"] =
            GetData[i]["date_created"] == null
              ? ""
              : moment(GetData[i]["date_created"]).format("DD-MMM-YYYY");
        }

        let dataHeaders = [
          {
            SNo: "S.No",
            search_name: "Search Name",
            date_created: "Created on",
            Action: "Action",
          },
        ];
        let data = ["search_name", "Action"];
        let linkRoutes = ["/vendor/vendorDoc/:id", "/vendor/reviews/:id"];
        setLinkColumns(data);
        setLinkColumnsRoutes(linkRoutes);
        setData(dataHeaders.concat(GetData));
        setLoader(true);
        setTimeout(() => {
          setLoader(false);
        }, 100);
      })
      .catch((error) => {});
  };

  useEffect(() => {
    getData();
    getMenus();
    getUrlPath();
  }, []);

  const SnoAlign = (data) => {
    return <div align="center">{data.SNo}</div>;
  };
  const CreatedDate = (data) => {
    return (
      <div align="center" data-toggle="tooltip" title={data.date_created}>
        {data.date_created}
      </div>
    );
  };

  const LinkTemplateName = (data) => {
    let rou = linkColumnsRoutes[0];
    const parts = data.page_url.split("/");
    const lastTwoParts = parts.length >= 2 ? parts.slice(-2).join("/") : url;
    const baseUrl = "/search/savedSearches";
    const modifiedUrl = lastTwoParts.replace(new RegExp(`^${baseUrl}`), "");
    const navigate = useNavigate();
    const handleLinkClick = () => {
      const id = data.id;
      // Replace with your actual value
      const urlWithHash = `/#/${modifiedUrl}`;
      const updatedUrlWithHash = `${urlWithHash}?id=${id}`;

      // Open the link in a new tab
      window.open(updatedUrlWithHash, "_blank");
    };

    return (
      <>
        <div
          style={{
            color: "#15a7ea",
            textDecoration: "underline",
            cursor: "pointer",
          }}
          //   onClick={handleLinkClick}
          onClick={() => {
            handleLinkClick();
          }}
          data-toggle="tooltip"
          title={data.search_name}
        >
          {data[linkColumns[0]]}
        </div>
      </>
    );
  };

  const LinkTemplate = (data) => {
    let rou = linkColumns[0];
    return (
      <>
        <div align="center">
          {
            <AiFillDelete
              color="orange"
              cursor="pointer"
              type="edit"
              size="1.2em"
              onClick={() => {
                setDeletePopup16(true);
                setEditedData(data);
                setEditId(data.id);
                setType("edit");
              }}
              align="center"
            />
          }{" "}
          &nbsp;
        </div>
      </>
    );
  };
  const dynamicColumns = Object.keys(headerData)?.map((col, i) => {
    const columnStyle =
      col === "SNo" && SnoAlign
        ? { width: "14%" }
        : col === "Action" && LinkTemplate
        ? { width: "16%" }
        : null;
    return (
      <Column
        sortable
        key={col}
        body={
          (col == "SNo" && SnoAlign) ||
          (col == "date_created" && CreatedDate) ||
          (col == "search_name" && LinkTemplateName) ||
          (col == "Action" && LinkTemplate)
        }
        field={col}
        header={headerData[col]}
        style={columnStyle}
      />
    );
  });
  useEffect(() => {
    data[0] && setHeaderData(JSON.parse(JSON.stringify(data[0])));
  }, [data]);
  const deletedata = () => {
    axios({
      method: "delete",
      url:
        baseUrl +
        `/dashboardsms/savedsearch/deletedataSearchFilters?saved_search_id=${editId}`,
    }).then(
      axios({
        method: "delete",
        url:
          baseUrl +
          `/dashboardsms/savedsearch/deletedataSavedSearch?id=${editId}`,
      }).then((error) => {
        getData();
        setDeletePopup16(false);
        setAddmsg(true);
        setTimeout(() => {
          setAddmsg(false);
        }, 3000);
      })
    );
  };
  //---------------------Project Status Report-------------------------
  const getData1 = () => {
    axios
      .get(
        baseUrl +
          `/dashboardsms/savedsearch/getProjectStatusReport?user_id=${loggedUserId}`
      )
      // axios.get(``)
      .then((res) => {
        const GetData = res.data;
        for (let i = 0; i < GetData.length; i++) {
          GetData[i]["SNo"] = i + 1;
          GetData[i]["date_created"] =
            GetData[i]["date_created"] == null
              ? ""
              : moment(GetData[i]["date_created"]).format("DD-MMM-YYYY");
        }
        let dataHeaders = [
          {
            SNo: "S.No",
            search_name: "Search Name",
            date_created: "Created on",
            Action: "Action",
          },
        ];
        let data = ["search_name", "Action"];
        let linkRoutes = ["/vendor/vendorDoc/:id", "/vendor/reviews/:id"];
        setLinkColumns1(data);
        setLinkColumnsRoutes1(linkRoutes);
        setData1(dataHeaders.concat(GetData));
        setLoader(true);
        setTimeout(() => {
          setLoader(false);
        }, 100);
      })
      .catch((error) => {});
  };
  useEffect(() => {
    getData1();
  }, []);

  const deletedata1 = () => {
    axios({
      method: "delete",
      url:
        baseUrl +
        `/dashboardsms/savedsearch/deletedataSearchFilters?saved_search_id=${editId1}`,
    }).then(
      axios({
        method: "delete",
        url:
          baseUrl +
          `/dashboardsms/savedsearch/deletedataSavedSearch?id=${editId1}`,
      }).then((error) => {
        getData1();
        setDeletePopup1(false);
        setAddmsg(true);
        setTimeout(() => {
          setAddmsg(false);
        }, 3000);
      })
    );
  };
  const SnoAlign1 = (data1) => {
    return <div align="center">{data1.SNo}</div>;
  };
  const CreatedDate1 = (data1) => {
    return (
      <div align="center" data-toggle="tooltip" title={data1.date_created}>
        {data1.date_created}
      </div>
    );
  };

  const LinkTemplateName1 = (data1) => {
    let rou = linkColumnsRoutes1[0];
    const parts = data1.page_url.split("/");
    const lastTwoParts = parts.length >= 2 ? parts.slice(-2).join("/") : url;
    const baseUrl = "/search/savedSearches";
    const modifiedUrl = lastTwoParts.replace(new RegExp(`^${baseUrl}`), "");
    const navigate = useNavigate();
    const handleLinkClick = () => {
      const id = data1.id;
      const urlWithHash = `/#/${modifiedUrl}`;
      const updatedUrlWithHash = `${urlWithHash}?id=${id}`;
      window.open(updatedUrlWithHash, "_blank");
    };
    return (
      <>
        <div
          style={{
            color: "#15a7ea",
            textDecoration: "underline",
            cursor: "pointer",
          }}
          onClick={() => {
            handleLinkClick();
          }}
          data-toggle="tooltip"
          title={data1.search_name}
        >
          {data1[linkColumns1[0]]}
        </div>
      </>
    );
  };
  const LinkTemplate1 = (data1) => {
    let rou = linkColumns1[0];
    return (
      <>
        <div align="center">
          {
            <AiFillDelete
              color="orange"
              cursor="pointer"
              type="edit"
              size="1.2em"
              onClick={() => {
                setEditedData(data1);
                setEditId1(data1.id);
                setDeletePopup1(true);
                setType("edit");
              }}
              align="center"
            />
          }{" "}
          &nbsp;
        </div>
      </>
    );
  };
  const dynamicColumns1 = Object.keys(headerData1)?.map((col, i) => {
    const columnStyle =
      col === "SNo" && SnoAlign1
        ? { width: "14%" }
        : col === "Action" && LinkTemplate1
        ? { width: "16%" }
        : null;
    return (
      <Column
        sortable
        key={col}
        body={
          (col == "SNo" && SnoAlign1) ||
          (col == "date_created" && CreatedDate1) ||
          (col == "search_name" && LinkTemplateName1) ||
          (col == "Action" && LinkTemplate1)
        }
        field={col}
        header={headerData1[col]}
        style={columnStyle}
      />
    );
  });
  useEffect(() => {
    data1[0] && setHeaderData1(JSON.parse(JSON.stringify(data1[0])));
  }, [data1]);
  //==================================Project Health======================================
  const getData2 = () => {
    axios
      .get(
        baseUrl +
          `/dashboardsms/savedsearch/getProjectHealth?user_id=${loggedUserId}`
      )
      // axios.get(``)
      .then((res) => {
        const GetData = res.data;
        for (let i = 0; i < GetData.length; i++) {
          GetData[i]["SNo"] = i + 1;
          GetData[i]["date_created"] =
            GetData[i]["date_created"] == null
              ? ""
              : moment(GetData[i]["date_created"]).format("DD-MMM-YYYY");
        }

        let dataHeaders = [
          {
            SNo: "S.No",
            search_name: "Search Name",
            date_created: "Created on",
            Action: "Action",
          },
        ];
        let data = ["search_name", "Action"];
        let linkRoutes = ["/vendor/vendorDoc/:id", "/vendor/reviews/:id"];

        setLinkColumns2(data);
        setLinkColumnsRoutes2(linkRoutes);

        setData2(dataHeaders.concat(GetData));
        setLoader(true);
        setTimeout(() => {
          setLoader(false);
        }, 100);
      })
      .catch((error) => {});
  };
  useEffect(() => {
    getData2();
  }, []);
  const deletedata2 = () => {
    axios({
      method: "delete",
      url:
        baseUrl +
        `/dashboardsms/savedsearch/deletedataSearchFilters?saved_search_id=${editId2}`,
    }).then(
      axios({
        method: "delete",
        url:
          baseUrl +
          `/dashboardsms/savedsearch/deletedataSavedSearch?id=${editId2}`,
      }).then((error) => {
        getData2();
        setDeletePopup2(false);
        setAddmsg(true);
        setTimeout(() => {
          setAddmsg(false);
        }, 3000);
      })
    );
  };
  const SnoAlign2 = (data2) => {
    return <div align="center">{data2.SNo}</div>;
  };
  const CreatedDate2 = (data2) => {
    return (
      <div align="center" data-toggle="tooltip" title={data2.date_created}>
        {data2.date_created}
      </div>
    );
  };

  const LinkTemplateName2 = (data2) => {
    let rou = linkColumnsRoutes2[0];
    const parts = data2.page_url.split("/");
    const lastTwoParts = parts.length >= 2 ? parts.slice(-2).join("/") : url;
    const baseUrl = "/search/savedSearches";
    const modifiedUrl = lastTwoParts.replace(new RegExp(`^${baseUrl}`), "");
    const navigate = useNavigate();
    const handleLinkClick = () => {
      const id = data2.id;
      const urlWithHash = `/#/${modifiedUrl}`;
      const updatedUrlWithHash = `${urlWithHash}?id=${id}`;
      window.open(updatedUrlWithHash, "_blank");
    };
    return (
      <>
        <div
          style={{
            color: "#15a7ea",
            textDecoration: "underline",
            cursor: "pointer",
          }}
          onClick={() => {
            handleLinkClick();
          }}
          data-toggle="tooltip"
          title={data2.search_name}
        >
          {data2[linkColumns2[0]]}
        </div>
      </>
    );
  };
  const LinkTemplate2 = (data2) => {
    let rou = linkColumns2[0];
    return (
      <>
        <div align="center">
          {
            <AiFillDelete
              color="orange"
              cursor="pointer"
              type="edit"
              size="1.2em"
              onClick={() => {
                setEditedData(data2);
                setEditId2(data2.id);
                setDeletePopup2(true);
                setType("edit");
              }}
              align="center"
            />
          }{" "}
          &nbsp;
        </div>
      </>
    );
  };
  const dynamicColumns2 = Object.keys(headerData2)?.map((col, i) => {
    const columnStyle =
      col === "SNo" && SnoAlign2
        ? { width: "14%" }
        : col === "Action" && LinkTemplate2
        ? { width: "16%" }
        : null;
    return (
      <Column
        sortable
        key={col}
        body={
          (col == "SNo" && SnoAlign2) ||
          (col == "date_created" && CreatedDate2) ||
          (col == "search_name" && LinkTemplateName2) ||
          (col == "Action" && LinkTemplate2)
        }
        field={col}
        header={headerData2[col]}
        style={columnStyle}
      />
    );
  });
  useEffect(() => {
    data2[0] && setHeaderData2(JSON.parse(JSON.stringify(data2[0])));
  }, [data2]);

  //----------------------------Innovation Dashboard---------------------------------
  const getData3 = () => {
    axios
      .get(
        baseUrl +
          `/dashboardsms/savedsearch/getInnovationDarshboard?user_id=${loggedUserId}`
      )
      // axios.get(``)
      .then((res) => {
        const GetData = res.data;
        for (let i = 0; i < GetData.length; i++) {
          GetData[i]["SNo"] = i + 1;
          GetData[i]["date_created"] =
            GetData[i]["date_created"] == null
              ? ""
              : moment(GetData[i]["date_created"]).format("DD-MMM-YYYY");
        }
        let dataHeaders = [
          {
            SNo: "S.No",
            search_name: "Search Name",
            date_created: "Created on",
            Action: "Action",
          },
        ];
        let data = ["search_name", "Action"];
        let linkRoutes = ["/vendor/vendorDoc/:id", "/vendor/reviews/:id"];
        setLinkColumns3(data);
        setLinkColumnsRoutes3(linkRoutes);
        setData3(dataHeaders.concat(GetData));
        setLoader(true);
        setTimeout(() => {
          setLoader(false);
        }, 100);
      })
      .catch((error) => {});
  };
  useEffect(() => {
    getData3();
  }, []);
  const deletedata3 = () => {
    axios({
      method: "delete",
      url:
        baseUrl +
        `/dashboardsms/savedsearch/deletedataSearchFilters?saved_search_id=${editId3}`,
    }).then(
      axios({
        method: "delete",
        url:
          baseUrl +
          `/dashboardsms/savedsearch/deletedataSavedSearch?id=${editId3}`,
      }).then((error) => {
        getData3();
        setDeletePopup3(false);
        setAddmsg(true);
        setTimeout(() => {
          setAddmsg(false);
        }, 3000);
      })
    );
  };
  const CreatedDate3 = (data3) => {
    return (
      <div align="center" data-toggle="tooltip" title={data3.date_created}>
        {data3.date_created}
      </div>
    );
  };
  const SnoAlign3 = (data3) => {
    return <div align="center">{data3.SNo}</div>;
  };
  const LinkTemplateName3 = (data3) => {
    let rou = linkColumnsRoutes3[0];
    const parts = data3.page_url.split("/");
    const lastTwoParts = parts.length >= 2 ? parts.slice(-2).join("/") : url;
    const baseUrl = "/search/savedSearches";
    const modifiedUrl = lastTwoParts.replace(new RegExp(`^${baseUrl}`), "");
    return (
      <>
        <Link
          target="_blank"
          to={`/${modifiedUrl}`}
          data-toggle="tooltip"
          title={data3.search_name}
        >
          {data3[linkColumns3[0]]}
        </Link>
      </>
    );
  };
  const LinkTemplate3 = (data3) => {
    let rou = linkColumns3[0];
    return (
      <>
        <div align="center">
          {
            <AiFillDelete
              color="orange"
              cursor="pointer"
              type="edit"
              size="1.2em"
              onClick={() => {
                setEditedData(data3);
                setEditId3(data3.id);
                setDeletePopup3(true);
                setType("edit");
              }}
              align="center"
            />
          }{" "}
          &nbsp;
        </div>
      </>
    );
  };
  const dynamicColumns3 = Object.keys(headerData3)?.map((col, i) => {
    const columnStyle =
      col === "SNo" && SnoAlign3
        ? { width: "14%" }
        : col === "Action" && LinkTemplate3
        ? { width: "16%" }
        : null;
    return (
      <Column
        sortable
        key={col}
        body={
          (col == "SNo" && SnoAlign3) ||
          (col == "date_created" && CreatedDate3) ||
          (col == "search_name" && LinkTemplateName3) ||
          (col == "Action" && LinkTemplate3)
        }
        field={col}
        header={headerData3[col]}
        style={columnStyle}
      />
    );
  });
  useEffect(() => {
    data3[0] && setHeaderData3(JSON.parse(JSON.stringify(data3[0])));
  }, [data3]);
  //--------------------------------------------Revenue & Margin Analysis------------------------------------
  const getData4 = () => {
    axios
      .get(
        baseUrl +
          `/dashboardsms/savedsearch/getRevenueMarginAnalysis?user_id=${loggedUserId}`
      )
      .then((res) => {
        const GetData = res.data;
        for (let i = 0; i < GetData.length; i++) {
          GetData[i]["SNo"] = i + 1;
          GetData[i]["date_created"] =
            GetData[i]["date_created"] == null
              ? ""
              : moment(GetData[i]["date_created"]).format("DD-MMM-YYYY");
        }
        let dataHeaders = [
          {
            SNo: "S.No",
            search_name: "Search Name",
            date_created: "Created on",
            Action: "Action",
          },
        ];
        let data = ["search_name", "Action"];
        let linkRoutes = ["/vendor/vendorDoc/:id", "/vendor/reviews/:id"];

        setLinkColumns4(data);
        setLinkColumnsRoutes4(linkRoutes);
        setData4(dataHeaders.concat(GetData));
        setLoader(true);
        setTimeout(() => {
          setLoader(false);
        }, 100);
      })
      .catch((error) => {});
  };
  useEffect(() => {
    getData4();
  }, []);
  const deletedata4 = () => {
    axios({
      method: "delete",
      url:
        baseUrl +
        `/dashboardsms/savedsearch/deletedataSearchFilters?saved_search_id=${editId4}`,
    }).then(
      axios({
        method: "delete",
        url:
          baseUrl +
          `/dashboardsms/savedsearch/deletedataSavedSearch?id=${editId4}`,
      }).then((error) => {
        getData4();
        setDeletePopup4(false);
        setAddmsg(true);
        setTimeout(() => {
          setAddmsg(false);
        }, 3000);
      })
    );
  };
  const SnoAlign4 = (data4) => {
    return <div align="center">{data4.SNo}</div>;
  };
  const CreatedDate4 = (data4) => {
    return (
      <div align="center" data-toggle="tooltip" title={data4.date_created}>
        {data4.date_created}
      </div>
    );
  };
  const LinkTemplateName4 = (data4) => {
    let rou = linkColumnsRoutes4[0];
    const parts = data4.page_url.split("/");
    const lastTwoParts = parts.length >= 2 ? parts.slice(-2).join("/") : url;
    const baseUrl = "/search/savedSearches";
    const modifiedUrl = lastTwoParts.replace(new RegExp(`^${baseUrl}`), "");
    const navigate = useNavigate();
    const handleLinkClick = () => {
      const id = data4.id;
      const urlWithHash = `/#/${modifiedUrl}`;
      const updatedUrlWithHash = `${urlWithHash}?id=${id}`;
      window.open(updatedUrlWithHash, "_blank");
    };
    return (
      <>
        <div
          style={{
            color: "#15a7ea",
            textDecoration: "underline",
            cursor: "pointer",
          }}
          onClick={() => {
            handleLinkClick();
          }}
          data-toggle="tooltip"
          title={data4.search_name}
        >
          {data4[linkColumns4[0]]}
        </div>
      </>
    );
  };
  const LinkTemplate4 = (data4) => {
    let rou = linkColumns4[0];
    return (
      <>
        <div align="center">
          {
            <AiFillDelete
              color="orange"
              cursor="pointer"
              type="edit"
              size="1.2em"
              onClick={() => {
                setEditedData(data4);
                setEditId4(data4.id);
                setDeletePopup4(true);
                setType("edit");
              }}
              align="center"
            />
          }{" "}
          &nbsp;
        </div>
      </>
    );
  };
  const dynamicColumns4 = Object.keys(headerData4)?.map((col, i) => {
    const columnStyle =
      col === "SNo" && SnoAlign4
        ? { width: "14%" }
        : col === "Action" && LinkTemplate4
        ? { width: "16%" }
        : null;
    return (
      <Column
        sortable
        key={col}
        body={
          (col == "SNo" && SnoAlign4) ||
          (col == "date_created" && CreatedDate4) ||
          (col == "search_name" && LinkTemplateName4) ||
          (col == "Action" && LinkTemplate4)
        }
        field={col}
        header={headerData4[col]}
        style={columnStyle}
      />
    );
  });
  useEffect(() => {
    data4[0] && setHeaderData4(JSON.parse(JSON.stringify(data4[0])));
  }, [data4]);

  // -------------------------------------------------Sales--------------------------------
  const getData5 = () => {
    axios
      .get(
        baseUrl + `/dashboardsms/savedsearch/getSales?user_id=${loggedUserId}`
      )
      // axios.get(``)
      .then((res) => {
        const GetData = res.data;
        for (let i = 0; i < GetData.length; i++) {
          GetData[i]["SNo"] = i + 1;
          GetData[i]["date_created"] =
            GetData[i]["date_created"] == null
              ? ""
              : moment(GetData[i]["date_created"]).format("DD-MMM-YYYY");
        }
        let dataHeaders = [
          {
            SNo: "S.No",
            search_name: "Search Name",
            date_created: "Created on",
            Action: "Action",
          },
        ];
        let data = ["search_name", "Action"];
        let linkRoutes = ["/vendor/vendorDoc/:id", "/vendor/reviews/:id"];

        setLinkColumns5(data);
        setLinkColumnsRoutes5(linkRoutes);
        setData5(dataHeaders.concat(GetData));
        setLoader(true);
        setTimeout(() => {
          setLoader(false);
        }, 100);
      })
      .catch((error) => {});
  };
  useEffect(() => {
    getData5();
  }, []);
  const deletedata5 = () => {
    axios({
      method: "delete",
      url:
        baseUrl +
        `/dashboardsms/savedsearch/deletedataSearchFilters?saved_search_id=${editId5}`,
    }).then(
      axios({
        method: "delete",
        url:
          baseUrl +
          `/dashboardsms/savedsearch/deletedataSavedSearch?id=${editId5}`,
      }).then((error) => {
        getData5();
        setDeletePopup5(false);
        setAddmsg(true);
        setTimeout(() => {
          setAddmsg(false);
        }, 3000);
      })
    );
  };
  const SnoAlign5 = (data5) => {
    return <div align="center">{data5.SNo}</div>;
  };
  const CreatedDate5 = (data5) => {
    return (
      <div align="center" data-toggle="tooltip" title={data5.date_created}>
        {data5.date_created}
      </div>
    );
  };

  const LinkTemplateName5 = (data5) => {
    let rou = linkColumnsRoutes5[0];
    const parts = data5.page_url.split("/");
    const lastTwoParts = parts.length >= 2 ? parts.slice(-2).join("/") : url;
    const baseUrl = "/search/savedSearches";
    const modifiedUrl = lastTwoParts.replace(new RegExp(`^${baseUrl}`), "");
    const navigate = useNavigate();
    const handleLinkClick = () => {
      const id = data5.id;
      // Replace with your actual value
      const urlWithHash = `/#/${modifiedUrl}`;
      const updatedUrlWithHash = `${urlWithHash}?id=${id}`;

      // Open the link in a new tab
      window.open(updatedUrlWithHash, "_blank");
    };

    return (
      <>
        <div
          style={{
            color: "#15a7ea",
            textDecoration: "underline",
            cursor: "pointer",
          }}
          onClick={() => {
            handleLinkClick();
          }}
          data-toggle="tooltip"
          title={data5.search_name}
        >
          {data5[linkColumns5[0]]}
        </div>
      </>
    );
  };

  const LinkTemplate5 = (data5) => {
    let rou = linkColumns5[0];
    return (
      <>
        <div align="center">
          {
            <AiFillDelete
              color="orange"
              cursor="pointer"
              type="edit"
              size="1.2em"
              onClick={() => {
                setEditedData(data5);
                setEditId5(data5.id);
                setDeletePopup5(true);
                setType("edit");
              }}
              align="center"
            />
          }{" "}
          &nbsp;
        </div>
      </>
    );
  };
  const dynamicColumns5 = Object.keys(headerData5)?.map((col, i) => {
    const columnStyle =
      col === "SNo" && SnoAlign5
        ? { width: "14%" }
        : col === "Action" && LinkTemplate5
        ? { width: "16%" }
        : null;

    return (
      <Column
        sortable
        key={col}
        body={
          (col == "SNo" && SnoAlign5) ||
          (col == "date_created" && CreatedDate5) ||
          (col == "search_name" && LinkTemplateName5) ||
          (col == "Action" && LinkTemplate5)
        }
        field={col}
        header={headerData5[col]}
        style={columnStyle}
      />
    );
  });
  useEffect(() => {
    data5[0] && setHeaderData5(JSON.parse(JSON.stringify(data5[0])));
  }, [data5]);
  // -------------------------Resource Overview--------------------------------------
  const getData6 = () => {
    axios
      .get(
        baseUrl +
          `/dashboardsms/savedsearch/getResourceOverview?user_id=${loggedUserId}`
      )
      // axios.get(``)
      .then((res) => {
        const GetData = res.data;
        for (let i = 0; i < GetData.length; i++) {
          GetData[i]["SNo"] = i + 1;
          GetData[i]["date_created"] =
            GetData[i]["date_created"] == null
              ? ""
              : moment(GetData[i]["date_created"]).format("DD-MMM-YYYY");
        }
        let dataHeaders = [
          {
            SNo: "S.No",
            search_name: "Search Name",
            date_created: "Created on",
            Action: "Action",
          },
        ];
        let data = ["search_name", "Action"];
        let linkRoutes = ["/vendor/vendorDoc/:id", "/vendor/reviews/:id"];
        setLinkColumns6(data);
        setLinkColumnsRoutes6(linkRoutes);
        setData6(dataHeaders.concat(GetData));
        setLoader(true);
        setTimeout(() => {
          setLoader(false);
        }, 100);
      })
      .catch((error) => {});
  };
  useEffect(() => {
    getData6();
  }, []);
  const deletedata6 = () => {
    axios({
      method: "delete",
      url:
        baseUrl +
        `/dashboardsms/savedsearch/deletedataSearchFilters?saved_search_id=${editId6}`,
    }).then(
      axios({
        method: "delete",
        url:
          baseUrl +
          `/dashboardsms/savedsearch/deletedataSavedSearch?id=${editId6}`,
      }).then((error) => {
        getData6();
        setDeletePopup6(false);
        setAddmsg(true);
        setTimeout(() => {
          setAddmsg(false);
        }, 3000);
      })
    );
  };
  const SnoAlign6 = (data6) => {
    return <div align="center">{data6.SNo}</div>;
  };
  const CreatedDate6 = (data6) => {
    return (
      <div align="center" data-toggle="tooltip" title={data6.date_created}>
        {data6.date_created}
      </div>
    );
  };

  const LinkTemplateName6 = (data6) => {
    let rou = linkColumnsRoutes6[0];
    const parts = data6.page_url.split("/");
    const lastTwoParts = parts.length >= 2 ? parts.slice(-2).join("/") : url;
    const baseUrl = "/search/savedSearches";
    const modifiedUrl = lastTwoParts.replace(new RegExp(`^${baseUrl}`), "");
    const navigate = useNavigate();
    const handleLinkClick = () => {
      const id = data6.id;
      // Replace with your actual value
      const urlWithHash = `/#/${modifiedUrl}`;
      const updatedUrlWithHash = `${urlWithHash}?id=${id}`;

      // Open the link in a new tab
      window.open(updatedUrlWithHash, "_blank");
    };

    return (
      <>
        <div
          style={{
            color: "#15a7ea",
            textDecoration: "underline",
            cursor: "pointer",
          }}
          onClick={() => {
            handleLinkClick();
          }}
          data-toggle="tooltip"
          title={data6.search_name}
        >
          {data6[linkColumns6[0]]}
        </div>
      </>
    );
  };
  const LinkTemplate6 = (data6) => {
    let rou = linkColumns6[0];
    return (
      <>
        <div align="center">
          {
            <AiFillDelete
              color="orange"
              cursor="pointer"
              type="edit"
              size="1.2em"
              onClick={() => {
                setEditedData(data6);
                setEditId6(data6.id);
                setDeletePopup6(true);
                setType("edit");
              }}
              align="center"
            />
          }{" "}
          &nbsp;
        </div>{" "}
      </>
    );
  };
  const dynamicColumns6 = Object.keys(headerData6)?.map((col, i) => {
    const columnStyle =
      col === "SNo" && SnoAlign6
        ? { width: "14%" }
        : col === "Action" && LinkTemplate6
        ? { width: "16%" }
        : null;

    return (
      <Column
        sortable
        key={col}
        body={
          (col == "SNo" && SnoAlign6) ||
          (col == "date_created" && CreatedDate6) ||
          (col == "search_name" && LinkTemplateName6) ||
          (col == "Action" && LinkTemplate6)
        }
        field={col}
        header={headerData6[col]}
        style={columnStyle}
      />
    );
  });
  useEffect(() => {
    data6[0] && setHeaderData6(JSON.parse(JSON.stringify(data6[0])));
  }, [data6]);
  // --------------------------------Resource Trending--------------------
  const getData7 = () => {
    axios
      .get(
        baseUrl +
          `/dashboardsms/savedsearch/getResourceTrending?user_id=${loggedUserId}`
      )
      .then((res) => {
        const GetData = res.data;
        for (let i = 0; i < GetData.length; i++) {
          GetData[i]["SNo"] = i + 1;
          GetData[i]["date_created"] =
            GetData[i]["date_created"] == null
              ? ""
              : moment(GetData[i]["date_created"]).format("DD-MMM-YYYY");
        }
        let dataHeaders = [
          {
            SNo: "S.No",
            search_name: "Search Name",
            date_created: "Created on",
            Action: "Action",
          },
        ];
        let data = ["search_name", "Action"];
        let linkRoutes = ["/vendor/vendorDoc/:id", "/vendor/reviews/:id"];
        setLinkColumns7(data);
        setLinkColumnsRoutes7(linkRoutes);
        setData7(dataHeaders.concat(GetData));
        setLoader(true);
        setTimeout(() => {
          setLoader(false);
        }, 100);
      })
      .catch((error) => {});
  };
  useEffect(() => {
    getData7();
  }, []);
  const deletedata7 = () => {
    axios({
      method: "delete",
      url:
        baseUrl +
        `/dashboardsms/savedsearch/deletedataSearchFilters?saved_search_id=${editId7}`,
    }).then(
      axios({
        method: "delete",
        url:
          baseUrl +
          `/dashboardsms/savedsearch/deletedataSavedSearch?id=${editId7}`,
      }).then((error) => {
        getData7();
        setDeletePopup7(false);
        setAddmsg(true);
        setTimeout(() => {
          setAddmsg(false);
        }, 3000);
      })
    );
  };
  const SnoAlign7 = (data7) => {
    return <div align="center">{data7.SNo}</div>;
  };
  const CreatedDate7 = (data7) => {
    return (
      <div align="center" data-toggle="tooltip" title={data7.date_created}>
        {data7.date_created}
      </div>
    );
  };

  const LinkTemplateName7 = (data7) => {
    let rou = linkColumnsRoutes6[0];
    const parts = data7.page_url.split("/");
    const lastTwoParts = parts.length >= 2 ? parts.slice(-2).join("/") : url;
    const baseUrl = "/search/savedSearches";
    const modifiedUrl = lastTwoParts.replace(new RegExp(`^${baseUrl}`), "");
    const navigate = useNavigate();
    const handleLinkClick = () => {
      const id = data7.id;
      // Replace with your actual value
      const urlWithHash = `/#/${modifiedUrl}`;
      const updatedUrlWithHash = `${urlWithHash}?id=${id}`;

      // Open the link in a new tab
      window.open(updatedUrlWithHash, "_blank");
    };

    return (
      <>
        <div
          style={{
            color: "#15a7ea",
            textDecoration: "underline",
            cursor: "pointer",
          }}
          onClick={() => {
            handleLinkClick();
          }}
          data-toggle="tooltip"
          title={data7.search_name}
        >
          {data7[linkColumns7[0]]}
        </div>
      </>
    );
  };
  const LinkTemplate7 = (data7) => {
    let rou = linkColumns7[0];
    return (
      <>
        <div align="center">
          {
            <AiFillDelete
              color="orange"
              cursor="pointer"
              type="edit"
              size="1.2em"
              onClick={() => {
                setEditedData(data7);
                setEditId7(data7.id);
                setDeletePopup7(true);
                setType("edit");
              }}
              align="center"
            />
          }{" "}
          &nbsp;
        </div>{" "}
      </>
    );
  };
  const dynamicColumns7 = Object.keys(headerData7)?.map((col, i) => {
    const columnStyle =
      col === "SNo" && SnoAlign7
        ? { width: "14%" }
        : col === "Action" && LinkTemplate7
        ? { width: "16%" }
        : null;

    return (
      <Column
        sortable
        key={col}
        body={
          (col == "SNo" && SnoAlign7) ||
          (col == "date_created" && CreatedDate7) ||
          (col == "search_name" && LinkTemplateName7) ||
          (col == "Action" && LinkTemplate7)
        }
        field={col}
        header={headerData7[col]}
        style={columnStyle}
      />
    );
  });
  useEffect(() => {
    data7[0] && setHeaderData7(JSON.parse(JSON.stringify(data7[0])));
  }, [data7]);

  // =====================================================Forecast================================
  const getData8 = () => {
    axios
      .get(
        baseUrl +
          `/dashboardsms/savedsearch/getForecast?user_id=${loggedUserId}`
      )
      .then((res) => {
        const GetData = res.data;
        for (let i = 0; i < GetData.length; i++) {
          GetData[i]["SNo"] = i + 1;
          GetData[i]["date_created"] =
            GetData[i]["date_created"] == null
              ? ""
              : moment(GetData[i]["date_created"]).format("DD-MMM-YYYY");
        }
        let dataHeaders = [
          {
            SNo: "S.No",
            search_name: "Search Name",
            date_created: "Created on",
            Action: "Action",
          },
        ];
        let data = ["search_name", "Action"];
        let linkRoutes = ["/vendor/vendorDoc/:id", "/vendor/reviews/:id"];
        setLinkColumns8(data);
        setLinkColumnsRoutes8(linkRoutes);
        setData8(dataHeaders.concat(GetData));
        setLoader(true);
        setTimeout(() => {
          setLoader(false);
        }, 100);
      })
      .catch((error) => {});
  };
  useEffect(() => {
    getData8();
  }, []);
  const deletedata8 = () => {
    axios({
      method: "delete",
      url:
        baseUrl +
        `/dashboardsms/savedsearch/deletedataSearchFilters?saved_search_id=${editId8}`,
    }).then(
      axios({
        method: "delete",
        url:
          baseUrl +
          `/dashboardsms/savedsearch/deletedataSavedSearch?id=${editId8}`,
      }).then((error) => {
        getData8();
        setDeletePopup8(false);
        setAddmsg(true);
        setTimeout(() => {
          setAddmsg(false);
        }, 3000);
      })
    );
  };
  const SnoAlign8 = (data8) => {
    return <div align="center">{data8.SNo}</div>;
  };
  const CreatedDate8 = (data8) => {
    return (
      <div align="center" data-toggle="tooltip" title={data8.date_created}>
        {data8.date_created}
      </div>
    );
  };
  const LinkTemplateName8 = (data8) => {
    let rou = linkColumnsRoutes8[0];
    const parts = data8.page_url.split("/");
    const lastTwoParts = parts.length >= 2 ? parts.slice(-2).join("/") : url;
    const baseUrl = "/search/savedSearches";
    const modifiedUrl = lastTwoParts.replace(new RegExp(`^${baseUrl}`), "");
    return (
      <>
        <Link
          target="_blank"
          to={`/${modifiedUrl}`}
          data-toggle="tooltip"
          title={data8.search_name}
        >
          {data8[linkColumns8[0]]}
        </Link>
      </>
    );
  };
  const LinkTemplate8 = (data8) => {
    let rou = linkColumns8[0];
    return (
      <>
        <div align="center">
          {
            <AiFillDelete
              color="orange"
              cursor="pointer"
              type="edit"
              size="1.2em"
              onClick={() => {
                setEditedData(data8);
                setEditId8(data8.id);
                setDeletePopup8(true);
                setType("edit");
              }}
              align="center"
            />
          }{" "}
          &nbsp;
        </div>{" "}
      </>
    );
  };
  const dynamicColumns8 = Object.keys(headerData8)?.map((col, i) => {
    const columnStyle =
      col === "SNo" && SnoAlign8
        ? { width: "14%" }
        : col === "Action" && LinkTemplate8
        ? { width: "16%" }
        : null;
    return (
      <Column
        sortable
        key={col}
        body={
          (col == "SNo" && SnoAlign8) ||
          (col == "date_created" && CreatedDate8) ||
          (col == "search_name" && LinkTemplateName8) ||
          (col == "Action" && LinkTemplate8)
        }
        field={col}
        header={headerData8[col]}
        style={columnStyle}
      />
    );
  });
  useEffect(() => {
    data8[0] && setHeaderData8(JSON.parse(JSON.stringify(data8[0])));
  }, [data8]);
  //============================Bench Report==================================================
  const getData9 = () => {
    axios
      .get(
        baseUrl +
          `/dashboardsms/savedsearch/getBenchReport?user_id=${loggedUserId}`
      )
      .then((res) => {
        const GetData = res.data;
        for (let i = 0; i < GetData.length; i++) {
          GetData[i]["SNo"] = i + 1;
          GetData[i]["date_created"] =
            GetData[i]["date_created"] == null
              ? ""
              : moment(GetData[i]["date_created"]).format("DD-MMM-YYYY");
        }
        let dataHeaders = [
          {
            SNo: "S.No",
            search_name: "Search Name",
            date_created: "Created on",
            Action: "Action",
          },
        ];
        let data = ["search_name", "Action"];
        let linkRoutes = ["/vendor/vendorDoc/:id", "/vendor/reviews/:id"];
        setLinkColumns9(data);
        setLinkColumnsRoutes9(linkRoutes);
        setData9(dataHeaders.concat(GetData));
        setLoader(true);
        setTimeout(() => {
          setLoader(false);
        }, 100);
      })
      .catch((error) => {});
  };
  useEffect(() => {
    getData9();
  }, []);
  const deletedata9 = () => {
    axios({
      method: "delete",
      url:
        baseUrl +
        `/dashboardsms/savedsearch/deletedataSearchFilters?saved_search_id=${editId9}`,
    }).then(
      axios({
        method: "delete",
        url:
          baseUrl +
          `/dashboardsms/savedsearch/deletedataSavedSearch?id=${editId9}`,
      }).then((error) => {
        getData9();
        setDeletePopup9(false);
        setAddmsg(true);
        setTimeout(() => {
          setAddmsg(false);
        }, 3000);
      })
    );
  };
  const SnoAlign9 = (data9) => {
    return <div align="center">{data9.SNo}</div>;
  };
  const CreatedDate9 = (data9) => {
    return (
      <div align="center" data-toggle="tooltip" title={data9.date_created}>
        {data9.date_created}
      </div>
    );
  };

  const LinkTemplateName9 = (data9) => {
    let rou = linkColumnsRoutes9[0];
    const parts = data9.page_url.split("/");
    const lastTwoParts = parts.length >= 2 ? parts.slice(-2).join("/") : url;
    const baseUrl = "/search/savedSearches";
    const modifiedUrl = lastTwoParts.replace(new RegExp(`^${baseUrl}`), "");
    const navigate = useNavigate();
    const handleLinkClick = () => {
      const id = data9.id;
      // Replace with your actual value
      const urlWithHash = `/#/${modifiedUrl}`;
      const updatedUrlWithHash = `${urlWithHash}?id=${id}`;

      // Open the link in a new tab
      window.open(updatedUrlWithHash, "_blank");
    };

    return (
      <>
        <div
          style={{
            color: "#15a7ea",
            textDecoration: "underline",
            cursor: "pointer",
          }}
          onClick={() => {
            handleLinkClick();
          }}
          data-toggle="tooltip"
          title={data9.search_name}
        >
          {data9[linkColumns9[0]]}
        </div>
      </>
    );
  };

  const LinkTemplate9 = (data9) => {
    let rou = linkColumns9[0];
    return (
      <>
        {
          <AiFillDelete
            color="orange"
            cursor="pointer"
            type="edit"
            size="1.2em"
            onClick={() => {
              setEditedData(data9);
              setEditId9(data9.id);
              setDeletePopup9(true);
              setType("edit");
            }}
            align="center"
          />
        }{" "}
        &nbsp;
      </>
    );
  };
  const dynamicColumns9 = Object.keys(headerData9)?.map((col, i) => {
    const columnStyle =
      col === "SNo" && SnoAlign9
        ? { width: "14%" }
        : col === "Action" && LinkTemplate9
        ? { width: "16%" }
        : null;

    return (
      <Column
        sortable
        key={col}
        body={
          (col == "SNo" && SnoAlign9) ||
          (col == "date_created" && CreatedDate9) ||
          (col == "search_name" && LinkTemplateName9) ||
          (col == "Action" && LinkTemplate9)
        }
        field={col}
        header={headerData9[col]}
        style={columnStyle}
      />
    );
  });
  useEffect(() => {
    data9[0] && setHeaderData9(JSON.parse(JSON.stringify(data9[0])));
  }, [data9]);
  //========================================Roll Offs==================================
  const getData10 = () => {
    axios
      .get(
        baseUrl +
          `/dashboardsms/savedsearch/getRollOffs?user_id=${loggedUserId}`
      )
      .then((res) => {
        const GetData = res.data;
        for (let i = 0; i < GetData.length; i++) {
          GetData[i]["SNo"] = i + 1;
          GetData[i]["date_created"] =
            GetData[i]["date_created"] == null
              ? ""
              : moment(GetData[i]["date_created"]).format("DD-MMM-YYYY");
        }
        let dataHeaders = [
          {
            SNo: "S.No",
            search_name: "Search Name",
            date_created: "Created on",
            Action: "Action",
          },
        ];
        let data = ["search_name", "Action"];
        let linkRoutes = ["/vendor/vendorDoc/:id", "/vendor/reviews/:id"];
        setLinkColumns10(data);
        setLinkColumnsRoutes10(linkRoutes);
        setData10(dataHeaders.concat(GetData));
        setLoader(true);
        setTimeout(() => {
          setLoader(false);
        }, 100);
      })
      .catch((error) => {});
  };
  useEffect(() => {
    getData10();
  }, []);
  const deletedata10 = () => {
    axios({
      method: "delete",
      url:
        baseUrl +
        `/dashboardsms/savedsearch/deletedataSearchFilters?saved_search_id=${editId10}`,
    }).then(
      axios({
        method: "delete",
        url:
          baseUrl +
          `/dashboardsms/savedsearch/deletedataSavedSearch?id=${editId10}`,
      }).then((error) => {
        getData10();
        setDeletePopup10(false);
        setAddmsg(true);
        setTimeout(() => {
          setAddmsg(false);
        }, 3000);
      })
    );
  };
  const SnoAlign10 = (data10) => {
    return <div align="center">{data10.SNo}</div>;
  };
  const CreatedDate10 = (data10) => {
    return (
      <div align="center" data-toggle="tooltip" title={data10.date_created}>
        {data10.date_created}
      </div>
    );
  };
  const LinkTemplateName10 = (data10) => {
    let rou = linkColumnsRoutes10[0];
    const parts = data10.page_url.split("/");
    const lastTwoParts = parts.length >= 2 ? parts.slice(-2).join("/") : url;
    const baseUrl = "/search/savedSearches";
    const modifiedUrl = lastTwoParts.replace(new RegExp(`^${baseUrl}`), "");
    return (
      <>
        <Link
          target="_blank"
          to={`/${modifiedUrl}`}
          data-toggle="tooltip"
          title={data10.search_name}
        >
          {data10[linkColumns10[0]]}
        </Link>
      </>
    );
  };
  const LinkTemplate10 = (data10) => {
    let rou = linkColumns10[0];
    return (
      <>
        <div align="center">
          {
            <AiFillDelete
              color="orange"
              cursor="pointer"
              type="edit"
              size="1.2em"
              onClick={() => {
                setEditedData(data10);
                setEditId10(data10.id);
                setDeletePopup10(true);
                setType("edit");
              }}
              align="center"
            />
          }{" "}
          &nbsp;
        </div>{" "}
      </>
    );
  };
  const dynamicColumns10 = Object.keys(headerData10)?.map((col, i) => {
    const columnStyle =
      col === "SNo" && SnoAlign10
        ? { width: "14%" }
        : col === "Action" && LinkTemplate10
        ? { width: "16%" }
        : null;
    return (
      <Column
        sortable
        key={col}
        body={
          (col == "SNo" && SnoAlign10) ||
          (col == "date_created" && CreatedDate10) ||
          (col == "search_name" && LinkTemplateName10) ||
          (col == "Action" && LinkTemplate10)
        }
        field={col}
        header={headerData10[col]}
        style={columnStyle}
      />
    );
  });
  useEffect(() => {
    data10[0] && setHeaderData10(JSON.parse(JSON.stringify(data10[0])));
  }, [data10]);
  //====================================Revenue & Margin Variance======================
  const getData11 = () => {
    axios
      .get(
        baseUrl +
          `/dashboardsms/savedsearch/getRevenveMarginvariance?user_id=${loggedUserId}`
      )
      .then((res) => {
        const GetData = res.data;
        for (let i = 0; i < GetData.length; i++) {
          GetData[i]["SNo"] = i + 1;
          GetData[i]["date_created"] =
            GetData[i]["date_created"] == null
              ? ""
              : moment(GetData[i]["date_created"]).format("DD-MMM-YYYY");
        }
        let dataHeaders = [
          {
            SNo: "S.No",
            search_name: "Search Name",
            date_created: "Created on",
            Action: "Action",
          },
        ];
        let data = ["search_name", "Action"];
        let linkRoutes = ["/vendor/vendorDoc/:id", "/vendor/reviews/:id"];
        setLinkColumns11(data);
        setLinkColumnsRoutes11(linkRoutes);
        setData11(dataHeaders.concat(GetData));
        setLoader(true);
        setTimeout(() => {
          setLoader(false);
        }, 100);
      })
      .catch((error) => {});
  };
  useEffect(() => {
    getData11();
  }, []);
  const deletedata11 = () => {
    axios({
      method: "delete",
      url:
        baseUrl +
        `/dashboardsms/savedsearch/deletedataSearchFilters?saved_search_id=${editId11}`,
    }).then(
      axios({
        method: "delete",
        url:
          baseUrl +
          `/dashboardsms/savedsearch/deletedataSavedSearch?id=${editId11}`,
      }).then((error) => {
        getData11();
        setDeletePopup11(false);
        setAddmsg(true);
        setTimeout(() => {
          setAddmsg(false);
        }, 3000);
      })
    );
  };
  const SnoAlign11 = (data11) => {
    return <div align="center">{data11.SNo}</div>;
  };
  const CreatedDate11 = (data11) => {
    return (
      <div align="center" data-toggle="tooltip" title={data11.date_created}>
        {data11.date_created}
      </div>
    );
  };

  const LinkTemplateName11 = (data11) => {
    let rou = linkColumnsRoutes11[0];
    const parts = data11.page_url.split("/");
    const lastTwoParts = parts.length >= 2 ? parts.slice(-2).join("/") : url;
    const baseUrl = "/search/savedSearches";
    const modifiedUrl = lastTwoParts.replace(new RegExp(`^${baseUrl}`), "");
    const navigate = useNavigate();
    const handleLinkClick = () => {
      const id = data11.id;
      const urlWithHash = `/#/${modifiedUrl}`;
      const updatedUrlWithHash = `${urlWithHash}?id=${id}`;
      window.open(updatedUrlWithHash, "_blank");
    };

    return (
      <>
        <div
          style={{
            color: "#15a7ea",
            textDecoration: "underline",
            cursor: "pointer",
          }}
          onClick={() => {
            handleLinkClick();
          }}
          data-toggle="tooltip"
          title={data11.search_name}
        >
          {data11[linkColumns11[0]]}
        </div>
      </>
    );
  };

  const LinkTemplate11 = (data11) => {
    let rou = linkColumns11[0];
    return (
      <>
        <div align="center">
          {
            <AiFillDelete
              color="orange"
              cursor="pointer"
              type="edit"
              size="1.2em"
              onClick={() => {
                setEditedData(data11);
                setEditId11(data11.id);
                setDeletePopup11(true);
                setType("edit");
              }}
              align="center"
            />
          }{" "}
          &nbsp;
        </div>{" "}
      </>
    );
  };
  const dynamicColumns11 = Object.keys(headerData11)?.map((col, i) => {
    const columnStyle =
      col === "SNo" && SnoAlign11
        ? { width: "14%" }
        : col === "Action" && LinkTemplate11
        ? { width: "16%" }
        : null;

    return (
      <Column
        sortable
        key={col}
        body={
          (col == "SNo" && SnoAlign11) ||
          (col == "date_created" && CreatedDate11) ||
          (col == "search_name" && LinkTemplateName11) ||
          (col == "Action" && LinkTemplate11)
        }
        field={col}
        header={headerData11[col]}
        style={columnStyle}
      />
    );
  });
  useEffect(() => {
    data11[0] && setHeaderData11(JSON.parse(JSON.stringify(data11[0])));
  }, [data11]);

  //=====================================================
  const getData12 = () => {
    axios
      .get(
        baseUrl +
          `/dashboardsms/savedsearch/getMarginForecastVariance?user_id=${loggedUserId}`
      )
      // axios.get(``)
      .then((res) => {
        const GetData = res.data;
        for (let i = 0; i < GetData.length; i++) {
          GetData[i]["SNo"] = i + 1;
          GetData[i]["date_created"] =
            GetData[i]["date_created"] == null
              ? ""
              : moment(GetData[i]["date_created"]).format("DD-MMM-YYYY");
        }
        let dataHeaders = [
          {
            SNo: "S.No",
            search_name: "Search Name",
            date_created: "Created on",
            Action: "Action",
          },
        ];
        let data = ["search_name", "Action"];
        let linkRoutes = ["/vendor/vendorDoc/:id", "/vendor/reviews/:id"];
        setLinkColumns12(data);
        setLinkColumnsRoutes12(linkRoutes);
        setData12(dataHeaders.concat(GetData));
        setLoader(true);
        setTimeout(() => {
          setLoader(false);
        }, 100);
      })
      .catch((error) => {});
  };
  useEffect(() => {
    getData12();
  }, []);
  const deletedata12 = () => {
    axios({
      method: "delete",
      url:
        baseUrl +
        `/dashboardsms/savedsearch/deletedataSearchFilters?saved_search_id=${editId12}`,
    }).then(
      axios({
        method: "delete",
        url:
          baseUrl +
          `/dashboardsms/savedsearch/deletedataSavedSearch?id=${editId12}`,
      }).then((error) => {
        getData12();
        setDeletePopup12(false);
        setAddmsg(true);
        setTimeout(() => {
          setAddmsg(false);
        }, 3000);
      })
    );
  };
  const SnoAlign12 = (data12) => {
    return <div align="center">{data12.SNo}</div>;
  };
  const CreatedDate12 = (data12) => {
    return (
      <div align="center" data-toggle="tooltip" title={data12.date_created}>
        {data12.date_created}
      </div>
    );
  };
  const LinkTemplateName12 = (data12) => {
    let rou = linkColumnsRoutes12[0];
    const parts = data12.page_url.split("/");
    const lastTwoParts = parts.length >= 2 ? parts.slice(-2).join("/") : url;
    const baseUrl = "/search/savedSearches";
    const modifiedUrl = lastTwoParts.replace(new RegExp(`^${baseUrl}`), "");
    return (
      <>
        <Link
          target="_blank"
          to={`/${modifiedUrl}`}
          data-toggle="tooltip"
          title={data12.search_name}
        >
          {data12[linkColumns12[0]]}
        </Link>
      </>
    );
  };
  const LinkTemplate12 = (data12) => {
    let rou = linkColumns12[0];
    return (
      <>
        <div align="center">
          {
            <AiFillDelete
              color="orange"
              cursor="pointer"
              type="edit"
              size="1.2em"
              onClick={() => {
                setEditedData(data12);
                setEditId12(data12.id);
                setDeletePopup12(true);
                setType("edit");
              }}
              align="center"
            />
          }{" "}
          &nbsp;
        </div>{" "}
      </>
    );
  };
  const dynamicColumns12 = Object.keys(headerData12)?.map((col, i) => {
    const columnStyle =
      col === "SNo" && SnoAlign12
        ? { width: "14%" }
        : col === "Action" && LinkTemplate12
        ? { width: "16%" }
        : null;

    return (
      <Column
        sortable
        key={col}
        body={
          (col == "SNo" && SnoAlign12) ||
          (col == "date_created" && CreatedDate12) ||
          (col == "search_name" && LinkTemplateName12) ||
          (col == "Action" && LinkTemplate12)
        }
        field={col}
        header={headerData12[col]}
        style={columnStyle}
      />
    );
  });
  useEffect(() => {
    data12[0] && setHeaderData12(JSON.parse(JSON.stringify(data12[0])));
  }, [data12]);
  // ============================Rev. Projections========================================
  const getData13 = () => {
    axios
      .get(
        baseUrl +
          `/dashboardsms/savedsearch/getRevProjections?user_id=${loggedUserId}`
      )
      // axios.get(``)
      .then((res) => {
        const GetData = res.data;
        for (let i = 0; i < GetData.length; i++) {
          GetData[i]["SNo"] = i + 1;
          GetData[i]["date_created"] =
            GetData[i]["date_created"] == null
              ? ""
              : moment(GetData[i]["date_created"]).format("DD-MMM-YYYY");
        }
        let dataHeaders = [
          {
            SNo: "S.No",
            search_name: "Search Name",
            date_created: "Created on",
            Action: "Action",
          },
        ];
        let data = ["search_name", "Action"];
        let linkRoutes = ["/vendor/vendorDoc/:id", "/vendor/reviews/:id"];
        setLinkColumns13(data);
        setLinkColumnsRoutes13(linkRoutes);
        setData13(dataHeaders.concat(GetData));
        setLoader(true);
        setTimeout(() => {
          setLoader(false);
        }, 100);
      })
      .catch((error) => {});
  };
  useEffect(() => {
    getData13();
  }, []);
  const deletedata13 = () => {
    axios({
      method: "delete",
      url:
        baseUrl +
        `/dashboardsms/savedsearch/deletedataSearchFilters?saved_search_id=${editId13}`,
    }).then(
      axios({
        method: "delete",
        url:
          baseUrl +
          `/dashboardsms/savedsearch/deletedataSavedSearch?id=${editId13}`,
      }).then((error) => {
        getData13();
        setDeletePopup13(false);
        setAddmsg(true);
        setTimeout(() => {
          setAddmsg(false);
        }, 3000);
      })
    );
  };
  const SnoAlign13 = (data13) => {
    return <div align="center">{data13.SNo}</div>;
  };
  const CreatedDate13 = (data13) => {
    return (
      <div align="center" data-toggle="tooltip" title={data13.date_created}>
        {data13.date_created}
      </div>
    );
  };

  const LinkTemplateName13 = (data13) => {
    let rou = linkColumnsRoutes13[0];
    const parts = data13.page_url.split("/");
    const lastTwoParts = parts.length >= 2 ? parts.slice(-2).join("/") : url;
    const baseUrl = "/search/savedSearches";
    const modifiedUrl = lastTwoParts.replace(new RegExp(`^${baseUrl}`), "");
    const navigate = useNavigate();
    const handleLinkClick = () => {
      const id = data13.id;
      // Replace with your actual value
      const urlWithHash = `/#/${modifiedUrl}`;
      const updatedUrlWithHash = `${urlWithHash}?id=${id}`;

      // Open the link in a new tab
      window.open(updatedUrlWithHash, "_blank");
    };

    return (
      <>
        <div
          style={{
            color: "#15a7ea",
            textDecoration: "underline",
            cursor: "pointer",
          }}
          //   onClick={handleLinkClick}
          onClick={() => {
            handleLinkClick();
          }}
          data-toggle="tooltip"
          title={data13.search_name}
        >
          {data13[linkColumns13[0]]}
        </div>
      </>
    );
  };
  const LinkTemplate13 = (data13) => {
    let rou = linkColumns13[0];
    return (
      <>
        <div align="center">
          {
            <AiFillDelete
              color="orange"
              cursor="pointer"
              type="edit"
              size="1.2em"
              onClick={() => {
                setEditedData(data13);
                setEditId13(data13.id);
                setDeletePopup13(true);
                setType("edit");
              }}
              align="center"
            />
          }{" "}
          &nbsp;
        </div>{" "}
      </>
    );
  };
  const dynamicColumns13 = Object.keys(headerData13)?.map((col, i) => {
    const columnStyle =
      col === "SNo" && SnoAlign13
        ? { width: "14%" }
        : col === "Action" && LinkTemplate13
        ? { width: "16%" }
        : null;
    return (
      <Column
        sortable
        key={col}
        body={
          (col == "SNo" && SnoAlign13) ||
          (col == "date_created" && CreatedDate13) ||
          (col == "search_name" && LinkTemplateName13) ||
          (col == "Action" && LinkTemplate13)
        }
        field={col}
        header={headerData13[col]}
        style={columnStyle}
      />
    );
  });
  useEffect(() => {
    data13[0] && setHeaderData13(JSON.parse(JSON.stringify(data13[0])));
  }, [data13]);

  // =====================================================Utilization FY==============================
  const getData14 = () => {
    axios
      .get(
        baseUrl +
          `/dashboardsms/savedsearch/getUtilizationFY?user_id=${loggedUserId}`
      )
      // axios.get(``)
      .then((res) => {
        const GetData = res.data;
        for (let i = 0; i < GetData.length; i++) {
          GetData[i]["SNo"] = i + 1;
          GetData[i]["date_created"] =
            GetData[i]["date_created"] == null
              ? ""
              : moment(GetData[i]["date_created"]).format("DD-MMM-YYYY");
        }
        let dataHeaders = [
          {
            SNo: "S.No",
            search_name: "Search Name",
            date_created: "Created on",
            Action: "Action",
          },
        ];
        let data = ["search_name", "Action"];
        let linkRoutes = ["/vendor/vendorDoc/:id", "/vendor/reviews/:id"];
        setLinkColumns14(data);
        setLinkColumnsRoutes14(linkRoutes);
        setData14(dataHeaders.concat(GetData));
        setLoader(true);
        setTimeout(() => {
          setLoader(false);
        }, 100);
      })
      .catch((error) => {});
  };
  useEffect(() => {
    getData14();
  }, []);
  const deletedata14 = () => {
    axios({
      method: "delete",
      url:
        baseUrl +
        `/dashboardsms/savedsearch/deletedataSearchFilters?saved_search_id=${editId14}`,
    }).then(
      axios({
        method: "delete",
        url:
          baseUrl +
          `/dashboardsms/savedsearch/deletedataSavedSearch?id=${editId14}`,
      }).then((error) => {
        getData14();
        setDeletePopup14(false);
        setAddmsg(true);
        setTimeout(() => {
          setAddmsg(false);
        }, 3000);
      })
    );
  };
  const SnoAlign14 = (data14) => {
    return <div align="center">{data14.SNo}</div>;
  };
  const CreatedDate14 = (data14) => {
    return (
      <div align="center" data-toggle="tooltip" title={data14.date_created}>
        {data14.date_created}
      </div>
    );
  };
  const LinkTemplateName14 = (data14) => {
    let rou = linkColumnsRoutes14[0];
    const parts = data14.page_url.split("/");
    const lastTwoParts = parts.length >= 2 ? parts.slice(-2).join("/") : url;
    const baseUrl = "/search/savedSearches";
    const modifiedUrl = lastTwoParts.replace(new RegExp(`^${baseUrl}`), "");
    const navigate = useNavigate();
    const handleLinkClick = () => {
      const id = data14.id;
      // Replace with your actual value
      const urlWithHash = `/#/${modifiedUrl}`;
      const updatedUrlWithHash = `${urlWithHash}?id=${id}`;

      // Open the link in a new tab
      window.open(updatedUrlWithHash, "_blank");
    };

    return (
      <>
        <div
          style={{
            color: "#15a7ea",
            textDecoration: "underline",
            cursor: "pointer",
          }}
          //   onClick={handleLinkClick}
          onClick={() => {
            handleLinkClick();
          }}
          data-toggle="tooltip"
          title={data14.search_name}
        >
          {data14[linkColumns14[0]]}
        </div>
      </>
    );
  };
  const LinkTemplate14 = (data14) => {
    let rou = linkColumns14[0];
    return (
      <>
        <div align="center">
          {
            <AiFillDelete
              color="orange"
              cursor="pointer"
              type="edit"
              size="1.2em"
              onClick={() => {
                setEditedData(data14);
                setEditId14(data14.id);
                setDeletePopup14(true);
                setType("edit");
              }}
              align="center"
            />
          }{" "}
          &nbsp;
        </div>{" "}
      </>
    );
  };
  const dynamicColumns14 = Object.keys(headerData14)?.map((col, i) => {
    const columnStyle =
      col === "SNo" && SnoAlign14
        ? { width: "14%" }
        : col === "Action" && LinkTemplate14
        ? { width: "16%" }
        : null;

    return (
      <Column
        sortable
        key={col}
        body={
          (col == "SNo" && SnoAlign14) ||
          (col == "date_created" && CreatedDate14) ||
          (col == "search_name" && LinkTemplateName14) ||
          (col == "Action" && LinkTemplate14)
        }
        field={col}
        header={headerData14[col]}
        style={columnStyle}
      />
    );
  });
  useEffect(() => {
    data14[0] && setHeaderData14(JSON.parse(JSON.stringify(data14[0])));
  }, [data14]);
  // ========================================NB Work - 4  Prev. Weeks===========================

  const getData15 = () => {
    axios
      .get(
        baseUrl + `/dashboardsms/savedsearch/getNbWork?user_id=${loggedUserId}`
      )
      .then((res) => {
        const GetData = res.data;
        for (let i = 0; i < GetData.length; i++) {
          GetData[i]["SNo"] = i + 1;
          GetData[i]["date_created"] =
            GetData[i]["date_created"] == null
              ? ""
              : moment(GetData[i]["date_created"]).format("DD-MMM-YYYY");
        }
        let dataHeaders = [
          {
            SNo: "S.No",
            search_name: "Search Name",
            date_created: "Created on",
            Action: "Action",
          },
        ];
        let data = ["search_name", "Action"];
        let linkRoutes = ["/vendor/vendorDoc/:id", "/vendor/reviews/:id"];
        setLinkColumns15(data);
        setLinkColumnsRoutes15(linkRoutes);
        setData15(dataHeaders.concat(GetData));
        setLoader(true);
        setTimeout(() => {
          setLoader(false);
        }, 100);
      })
      .catch((error) => {});
  };
  useEffect(() => {
    getData15();
  }, []);
  const deletedata15 = () => {
    axios({
      method: "delete",
      url:
        baseUrl +
        `/dashboardsms/savedsearch/deletedataSearchFilters?saved_search_id=${editId15}`,
    }).then(
      axios({
        method: "delete",
        url:
          baseUrl +
          `/dashboardsms/savedsearch/deletedataSavedSearch?id=${editId15}`,
      }).then((error) => {
        getData15();
        setDeletePopup15(false);
        setAddmsg(true);
        setTimeout(() => {
          setAddmsg(false);
        }, 3000);
      })
    );
  };
  const SnoAlign15 = (data15) => {
    return <div align="center">{data15.SNo}</div>;
  };
  const CreatedDate15 = (data15) => {
    return (
      <div align="center" data-toggle="tooltip" title={data15.date_created}>
        {data15.date_created}
      </div>
    );
  };
  const LinkTemplateName15 = (data15) => {
    let rou = linkColumnsRoutes15[0];
    const parts = data15.page_url.split("/");
    const lastTwoParts = parts.length >= 2 ? parts.slice(-2).join("/") : url;
    const baseUrl = "/search/savedSearches";
    const modifiedUrl = lastTwoParts.replace(new RegExp(`^${baseUrl}`), "");
    return (
      <>
        <Link
          target="_blank"
          to={`/${modifiedUrl}`}
          data-toggle="tooltip"
          title={data15.search_name}
        >
          {data15[linkColumns15[0]]}
        </Link>
      </>
    );
  };
  const LinkTemplate15 = (data15) => {
    let rou = linkColumns15[0];
    return (
      <>
        <div align="center">
          {
            <AiFillDelete
              color="orange"
              cursor="pointer"
              type="edit"
              size="1.2em"
              onClick={() => {
                setEditedData(data15);
                setEditId15(data15.id);
                setDeletePopup15(true);
                setType("edit");
              }}
              align="center"
            />
          }{" "}
          &nbsp;
        </div>
      </>
    );
  };
  const dynamicColumns15 = Object.keys(headerData15)?.map((col, i) => {
    const columnStyle =
      col === "SNo" && SnoAlign15
        ? { width: "14%" }
        : col === "Action" && LinkTemplate15
        ? { width: "16%" }
        : null;

    return (
      <Column
        sortable
        key={col}
        body={
          (col == "SNo" && SnoAlign15) ||
          (col == "date_created" && CreatedDate15) ||
          (col == "search_name" && LinkTemplateName15) ||
          (col == "Action" && LinkTemplate15)
        }
        field={col}
        header={headerData15[col]}
        style={columnStyle}
      />
    );
  });
  useEffect(() => {
    data15[0] && setHeaderData15(JSON.parse(JSON.stringify(data15[0])));
  }, [data15]);

  //-------------------Popups---------------------

  function SavedSearchPopup(props) {
    const { deletePopup16, editId, deleteid, deletedata } = props;
    return (
      <div>
        <Draggable>
          <CModal visible={deletePopup16} size="default" className=" ui-dialog">
            <CModalHeader className="hgt22">
              <CModalTitle>
                <span className="ft16">Delete Search</span>
              </CModalTitle>
            </CModalHeader>
            <CModalBody>
              <h6>Are you sure you want to delete Search ?</h6>
              <div className="btn-container center my-2">
                <button
                  type="delete"
                  className="btn btn-primary"
                  onClick={() => {
                    deletedata();
                  }}
                >
                  {" "}
                  Delete{" "}
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setDeletePopup16(false)}
                >
                  {" "}
                  Cancel{" "}
                </button>
              </div>
            </CModalBody>
          </CModal>
        </Draggable>
      </div>
    );
  }

  //===================

  function SavedSearchPopup1(props) {
    const { deletePopup1 } = props;

    return (
      <div>
        <Draggable>
          <CModal
            visible={deletePopup1}
            size="default"
            className=" ui-dialog"
            onClose={() => setDeletePopup1(false)}
          >
            <CModalHeader className="hgt22">
              <CModalTitle>
                <span className="ft16">Delete Search</span>
              </CModalTitle>
            </CModalHeader>
            <CModalBody>
              <h6>Are you sure you want to delete Search ?</h6>
              <div className="btn-container center my-2">
                <button
                  type="delete"
                  className="btn btn-primary"
                  onClick={() => {
                    deletedata1();
                  }}
                >
                  {" "}
                  Delete{" "}
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setDeletePopup1(false)}
                >
                  {" "}
                  Cancel{" "}
                </button>
              </div>
            </CModalBody>
          </CModal>
        </Draggable>
      </div>
    );
  }
  //---------------Popup2==================
  function SavedSearchPopup2(props) {
    const { deletePopup2 } = props;

    return (
      <div>
        <Draggable>
          <CModal
            visible={deletePopup2}
            size="default"
            className=" ui-dialog"
            onClose={() => setDeletePopup2(false)}
          >
            <CModalHeader className="hgt22">
              <CModalTitle>
                <span className="ft16">Delete Search</span>
              </CModalTitle>
            </CModalHeader>
            <CModalBody>
              <h6>Are you sure you want to delete Search ?</h6>
              <div className="btn-container center my-2">
                <button
                  type="delete"
                  className="btn btn-primary"
                  onClick={() => {
                    deletedata2();
                  }}
                >
                  {" "}
                  Delete{" "}
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setDeletePopup2(false)}
                >
                  {" "}
                  Cancel{" "}
                </button>
              </div>
            </CModalBody>
          </CModal>
        </Draggable>
      </div>
    );
  }
  //=======================Popup3===============================
  function SavedSearchPopup3(props) {
    const { deletePopup3 } = props;

    return (
      <div>
        <Draggable>
          <CModal
            visible={deletePopup3}
            size="default"
            className=" ui-dialog"
            onClose={() => setDeletePopup3(false)}
          >
            <CModalHeader className="hgt22">
              <CModalTitle>
                <span className="ft16">Delete Search</span>
              </CModalTitle>
            </CModalHeader>
            <CModalBody>
              <h6>Are you sure you want to delete Search ?</h6>
              <div className="btn-container center my-2">
                <button
                  type="delete"
                  className="btn btn-primary"
                  onClick={() => {
                    deletedata3();
                  }}
                >
                  {" "}
                  Delete{" "}
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setDeletePopup3(false)}
                >
                  {" "}
                  Cancel{" "}
                </button>
              </div>
            </CModalBody>
          </CModal>
        </Draggable>
      </div>
    );
  }
  //==================4================
  function SavedSearchPopup4(props) {
    const { deletePopup4 } = props;

    return (
      <div>
        <Draggable>
          <CModal
            visible={deletePopup4}
            size="default"
            className=" ui-dialog"
            onClose={() => setDeletePopup4(false)}
          >
            <CModalHeader className="hgt22">
              <CModalTitle>
                <span className="ft16">Delete Search</span>
              </CModalTitle>
            </CModalHeader>
            <CModalBody>
              <h6>Are you sure you want to delete Search ?</h6>
              <div className="btn-container center my-2">
                <button
                  type="delete"
                  className="btn btn-primary"
                  onClick={() => {
                    deletedata4();
                  }}
                >
                  {" "}
                  Delete{" "}
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setDeletePopup4(false)}
                >
                  {" "}
                  Cancel{" "}
                </button>
              </div>
            </CModalBody>
          </CModal>
        </Draggable>
      </div>
    );
  }
  //==================5==============
  function SavedSearchPopup5(props) {
    const { deletePopup5 } = props;

    return (
      <div>
        <Draggable>
          <CModal
            visible={deletePopup5}
            size="default"
            className=" ui-dialog"
            onClose={() => setDeletePopup5(false)}
          >
            <CModalHeader className="hgt22">
              <CModalTitle>
                <span className="ft16">Delete Search</span>
              </CModalTitle>
            </CModalHeader>
            <CModalBody>
              <h6>Are you sure you want to delete Search ?</h6>
              <div className="btn-container center my-2">
                <button
                  type="delete"
                  className="btn btn-primary"
                  onClick={() => {
                    deletedata5();
                  }}
                >
                  {" "}
                  Delete{" "}
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setDeletePopup5(false)}
                >
                  {" "}
                  Cancel{" "}
                </button>
              </div>
            </CModalBody>
          </CModal>
        </Draggable>
      </div>
    );
  }
  //=============================Popup6
  function SavedSearchPopup6(props) {
    const { deletePopup6 } = props;

    return (
      <div>
        <Draggable>
          <CModal
            visible={deletePopup6}
            size="default"
            className=" ui-dialog"
            onClose={() => setDeletePopup6(false)}
          >
            <CModalHeader className="hgt22">
              <CModalTitle>
                <span className="ft16">Delete Search</span>
              </CModalTitle>
            </CModalHeader>
            <CModalBody>
              <h6>Are you sure you want to delete Search ?</h6>
              <div className="btn-container center my-2">
                <button
                  type="delete"
                  className="btn btn-primary"
                  onClick={() => {
                    deletedata6();
                  }}
                >
                  {" "}
                  Delete{" "}
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setDeletePopup6(false)}
                >
                  {" "}
                  Cancel{" "}
                </button>
              </div>
            </CModalBody>
          </CModal>
        </Draggable>
      </div>
    );
  }
  //====================7
  function SavedSearchPopup7(props) {
    const { deletePopup7 } = props;

    return (
      <div>
        <Draggable>
          <CModal
            visible={deletePopup7}
            size="default"
            className=" ui-dialog"
            onClose={() => setDeletePopup7(false)}
          >
            <CModalHeader className="hgt22">
              <CModalTitle>
                <span className="ft16">Delete Search</span>
              </CModalTitle>
            </CModalHeader>
            <CModalBody>
              <h6>Are you sure you want to delete Search ?</h6>
              <div className="btn-container center my-2">
                <button
                  type="delete"
                  className="btn btn-primary"
                  onClick={() => {
                    deletedata7();
                  }}
                >
                  {" "}
                  Delete{" "}
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setDeletePopup7(false)}
                >
                  {" "}
                  Cancel{" "}
                </button>
              </div>
            </CModalBody>
          </CModal>
        </Draggable>
      </div>
    );
  }
  //==============8=====
  function SavedSearchPopup8(props) {
    const { deletePopup8 } = props;

    return (
      <div>
        <Draggable>
          <CModal
            visible={deletePopup8}
            size="default"
            className=" ui-dialog"
            onClose={() => setDeletePopup8(false)}
          >
            <CModalHeader className="hgt22">
              <CModalTitle>
                <span className="ft16">Delete Search</span>
              </CModalTitle>
            </CModalHeader>
            <CModalBody>
              <h6>Are you sure you want to delete Search ?</h6>
              <div className="btn-container center my-2">
                <button
                  type="delete"
                  className="btn btn-primary"
                  onClick={() => {
                    deletedata8();
                  }}
                >
                  {" "}
                  Delete{" "}
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setDeletePopup8(false)}
                >
                  {" "}
                  Cancel{" "}
                </button>
              </div>
            </CModalBody>
          </CModal>
        </Draggable>
      </div>
    );
  }
  //============9====================
  function SavedSearchPopup9(props) {
    const { deletePopup9 } = props;

    return (
      <div>
        <Draggable>
          <CModal
            visible={deletePopup9}
            size="default"
            className=" ui-dialog"
            onClose={() => setDeletePopup9(false)}
          >
            <CModalHeader className="hgt22">
              <CModalTitle>
                <span className="ft16">Delete Search</span>
              </CModalTitle>
            </CModalHeader>
            <CModalBody>
              <h6>Are you sure you want to delete Search ?</h6>
              <div className="btn-container center my-2">
                <button
                  type="delete"
                  className="btn btn-primary"
                  onClick={() => {
                    deletedata9();
                  }}
                >
                  {" "}
                  Delete{" "}
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setDeletePopup9(false)}
                >
                  {" "}
                  Cancel{" "}
                </button>
              </div>
            </CModalBody>
          </CModal>
        </Draggable>
      </div>
    );
  }
  //==============10===========
  function SavedSearchPopup10(props) {
    const { deletePopup10 } = props;

    return (
      <div>
        <Draggable>
          <CModal
            visible={deletePopup10}
            size="default"
            className=" ui-dialog"
            onClose={() => setDeletePopup10(false)}
          >
            <CModalHeader className="hgt22">
              <CModalTitle>
                <span className="ft16">Delete Search</span>
              </CModalTitle>
            </CModalHeader>
            <CModalBody>
              <h6>Are you sure you want to delete Search ?</h6>
              <div className="btn-container center my-2">
                <button
                  type="delete"
                  className="btn btn-primary"
                  onClick={() => {
                    deletedata10();
                  }}
                >
                  {" "}
                  Delete{" "}
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setDeletePopup10(false)}
                >
                  {" "}
                  Cancel{" "}
                </button>
              </div>
            </CModalBody>
          </CModal>
        </Draggable>
      </div>
    );
  }
  //==========================11============
  function SavedSearchPopup11(props) {
    const { deletePopup11 } = props;

    return (
      <div>
        <Draggable>
          <CModal
            visible={deletePopup11}
            size="default"
            className=" ui-dialog"
            onClose={() => setDeletePopup11(false)}
          >
            <CModalHeader className="hgt22">
              <CModalTitle>
                <span className="ft16">Delete Search</span>
              </CModalTitle>
            </CModalHeader>
            <CModalBody>
              <h6>Are you sure you want to delete Search ?</h6>
              <div className="btn-container center my-2">
                <button
                  type="delete"
                  className="btn btn-primary"
                  onClick={() => {
                    deletedata11();
                  }}
                >
                  {" "}
                  Delete{" "}
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setDeletePopup11(false)}
                >
                  {" "}
                  Cancel{" "}
                </button>
              </div>
            </CModalBody>
          </CModal>
        </Draggable>
      </div>
    );
  }
  //=====================12
  function SavedSearchPopup12(props) {
    const { deletePopup12 } = props;

    return (
      <div>
        <Draggable>
          <CModal
            visible={deletePopup12}
            size="default"
            className=" ui-dialog"
            onClose={() => setDeletePopup12(false)}
          >
            <CModalHeader className="hgt22">
              <CModalTitle>
                <span className="ft16">Delete Search</span>
              </CModalTitle>
            </CModalHeader>
            <CModalBody>
              <h6>Are you sure you want to delete Search ?</h6>
              <div className="btn-container center my-2">
                <button
                  type="delete"
                  className="btn btn-primary"
                  onClick={() => {
                    deletedata12();
                  }}
                >
                  {" "}
                  Delete{" "}
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setDeletePopup12(false)}
                >
                  {" "}
                  Cancel{" "}
                </button>
              </div>
            </CModalBody>
          </CModal>
        </Draggable>
      </div>
    );
  }
  //=======================13================
  function SavedSearchPopup13(props) {
    const { deletePopup13 } = props;

    return (
      <div>
        <Draggable>
          <CModal
            visible={deletePopup13}
            size="default"
            className=" ui-dialog"
            onClose={() => setDeletePopup13(false)}
          >
            <CModalHeader className="hgt22">
              <CModalTitle>
                <span className="ft16">Delete Search</span>
              </CModalTitle>
            </CModalHeader>
            <CModalBody>
              <h6>Are you sure you want to delete Search ?</h6>
              <div className="btn-container center my-2">
                <button
                  type="delete"
                  className="btn btn-primary"
                  onClick={() => {
                    deletedata13();
                  }}
                >
                  {" "}
                  Delete{" "}
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setDeletePopup13(false)}
                >
                  {" "}
                  Cancel{" "}
                </button>
              </div>
            </CModalBody>
          </CModal>
        </Draggable>
      </div>
    );
  }
  ///=============14===============
  function SavedSearchPopup14(props) {
    const { deletePopup14 } = props;

    return (
      <div>
        <Draggable>
          <CModal
            visible={deletePopup14}
            size="default"
            className=" ui-dialog"
            onClose={() => setDeletePopup14(false)}
          >
            <CModalHeader className="hgt22">
              <CModalTitle>
                <span className="ft16">Delete Search</span>
              </CModalTitle>
            </CModalHeader>
            <CModalBody>
              <h6>Are you sure you want to delete Search ?</h6>
              <div className="btn-container center my-2">
                <button
                  type="delete"
                  className="btn btn-primary"
                  onClick={() => {
                    deletedata14();
                  }}
                >
                  {" "}
                  Delete{" "}
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setDeletePopup14(false)}
                >
                  {" "}
                  Cancel{" "}
                </button>
              </div>
            </CModalBody>
          </CModal>
        </Draggable>
      </div>
    );
  }

  //===============15
  function SavedSearchPopup15(props) {
    const { deletePopup15 } = props;

    return (
      <div>
        <Draggable>
          <CModal
            visible={deletePopup15}
            size="default"
            className=" ui-dialog"
            onClose={() => setDeletePopup15(false)}
          >
            <CModalHeader className="hgt22">
              <CModalTitle>
                <span className="ft16">Delete Search</span>
              </CModalTitle>
            </CModalHeader>
            <CModalBody>
              <h6>Are you sure you want to delete Search ?</h6>
              <div className="btn-container center my-2">
                <button
                  type="delete"
                  className="btn btn-primary"
                  onClick={() => {
                    deletedata15();
                  }}
                >
                  {" "}
                  Delete{" "}
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setDeletePopup15(false)}
                >
                  {" "}
                  Cancel{" "}
                </button>
              </div>
            </CModalBody>
          </CModal>
        </Draggable>
      </div>
    );
  }

  return (
    <div>
      <div>
        <div className="pageTitle">
          <div className="childOne"></div>
          <div className="childTwo">
            <h2>Saved Searches</h2>
          </div>
          <div className="childThree"></div>
        </div>

        <br />
        <button
          className="btn btn-primary float-end saved-search-expandable-btn"
          onClick={() => {
            setVisibleA(!visibleA);
            setVisibleB(!visibleB);
            setVisibleC(!visibleC);
            setVisibleD(!visibleD);
            setVisibleE(!visibleE);
            setVisibleF(!visibleF);
            setVisibleG(!visibleG);
            setVisibleH(!visibleH);
            setVisibleI(!visibleI);
            setVisibleJ(!visibleJ);
            setVisibleK(!visibleK);
            setVisibleL(!visibleL);
            setVisibleM(!visibleM);
            setVisibleN(!visibleN);
            setVisibleO(!visibleO);
            setVisibleP(!visibleP);
          }}
        >
          Exp/Coll All
        </button>

        {/* -------------------------Popups------------------------------ */}
        {addmsg ? (
          <div className="statusMsg success">
            <span className="errMsg">
              <BiCheck size="1.4em" /> &nbsp; Search Name deleted successfully
            </span>
          </div>
        ) : (
          ""
        )}
        <div className="group customCard saved-search-menu">
          <div className="col-md-12 collapseHeader">
            <h2
              style={{ cursor: "pointer" }}
              onClick={() => {
                setVisibleA(!visibleA);
                visibleA
                  ? setCheveronIconA(FaChevronCircleUp)
                  : setCheveronIconA(FaChevronCircleDown);
              }}
            >
              Monthly Revenue Forecast
            </h2>
            <div
              onClick={() => {
                setVisibleA(!visibleA);
                visibleA
                  ? setCheveronIconA(FaChevronCircleUp)
                  : setCheveronIconA(FaChevronCircleDown);
              }}
            >
              <span style={{ cursor: "pointer" }}>{cheveronIconA}</span>
            </div>
          </div>
        </div>
        <CCollapse visible={!visibleA}>
          <div>
            <CellRendererPrimeReactDataTable
              data={data}
              rows={rows}
              linkColumns={linkColumns}
              linkColumnsRoutes={linkColumnsRoutes}
              dynamicColumns={dynamicColumns}
              headerData={headerData}
              setHeaderData={setHeaderData}
            />
          </div>
        </CCollapse>
        {/* /* //---------------------Project Status Report---------------------------------*/}

        <div className="group customCard saved-search-menu">
          <div className="col-md-12 collapseHeader">
            <h2
              style={{ cursor: "pointer" }}
              onClick={() => {
                setVisibleB(!visibleB);
                visibleB
                  ? setCheveronIconB(FaChevronCircleUp)
                  : setCheveronIconB(FaChevronCircleDown);
              }}
            >
              Project Status Report
            </h2>
            <div
              onClick={() => {
                setVisibleB(!visibleB);
                visibleB
                  ? setCheveronIconB(FaChevronCircleUp)
                  : setCheveronIconB(FaChevronCircleDown);
              }}
            >
              <span style={{ cursor: "pointer" }}>{cheveronIconB}</span>
            </div>
          </div>
        </div>
        <CCollapse visible={!visibleB}>
          <div>
            <CellRendererPrimeReactDataTable
              data={data1}
              rows={rows}
              linkColumns={linkColumns1}
              linkColumnsRoutes={linkColumnsRoutes1}
              dynamicColumns={dynamicColumns1}
              headerData={headerData1}
              setHeaderData={setHeaderData1}
            />
          </div>
        </CCollapse>

        {/* /* //---------------------Project Status Report-------------------------  */}
        <div className="group customCard saved-search-menu">
          <div className="col-md-12 collapseHeader">
            <h2
              style={{ cursor: "pointer" }}
              onClick={() => {
                setVisibleC(!visibleC);
                visibleC
                  ? setCheveronIconC(FaChevronCircleUp)
                  : setCheveronIconC(FaChevronCircleDown);
              }}
            >
              Project Health Report
            </h2>
            <div
              onClick={() => {
                setVisibleC(!visibleC);
                visibleC
                  ? setCheveronIconC(FaChevronCircleUp)
                  : setCheveronIconC(FaChevronCircleDown);
              }}
            >
              <span style={{ cursor: "pointer" }}>{cheveronIconC}</span>
            </div>
          </div>
        </div>
        <CCollapse visible={!visibleC}>
          <div>
            <CellRendererPrimeReactDataTable
              data={data2}
              rows={rows}
              linkColumns={linkColumns2}
              linkColumnsRoutes={linkColumnsRoutes2}
              dynamicColumns={dynamicColumns2}
              headerData={headerData2}
              setHeaderData={setHeaderData2}
            />
          </div>
        </CCollapse>
        {/* --------------------------Innovation Dashboard------------------- */}
        <div className="group customCard saved-search-menu">
          <div className="col-md-12 collapseHeader">
            <h2
              style={{ cursor: "pointer" }}
              onClick={() => {
                setVisibleD(!visibleD);
                visibleD
                  ? setCheveronIconD(FaChevronCircleUp)
                  : setCheveronIconD(FaChevronCircleDown);
              }}
            >
              Innovation Dashboard
            </h2>
            <div
              onClick={() => {
                setVisibleD(!visibleD);
                visibleD
                  ? setCheveronIconD(FaChevronCircleUp)
                  : setCheveronIconD(FaChevronCircleDown);
              }}
            >
              <span>{cheveronIconD}</span>
            </div>
          </div>
        </div>
        <CCollapse visible={!visibleD}>
          <div>
            <CellRendererPrimeReactDataTable
              data={data3}
              rows={rows}
              linkColumns={linkColumns3}
              linkColumnsRoutes={linkColumnsRoutes3}
              dynamicColumns={dynamicColumns3}
              headerData={headerData3}
              setHeaderData={setHeaderData3}
            />
          </div>
        </CCollapse>
        {/* //-----------------------------Revenue & Margin Analysis-------*/}
        <div className="group customCard saved-search-menu">
          <div className="col-md-12 collapseHeader">
            <h2
              style={{ cursor: "pointer" }}
              onClick={() => {
                setVisibleE(!visibleE);
                visibleE
                  ? setCheveronIconE(FaChevronCircleUp)
                  : setCheveronIconE(FaChevronCircleDown);
              }}
            >
              Revenue & Margin Analysis
            </h2>
            <div
              onClick={() => {
                setVisibleE(!visibleE);
                visibleE
                  ? setCheveronIconE(FaChevronCircleUp)
                  : setCheveronIconE(FaChevronCircleDown);
              }}
            >
              <span style={{ cursor: "pointer" }}>{cheveronIconE}</span>
            </div>
          </div>
        </div>
        <CCollapse visible={!visibleE}>
          <div>
            <CellRendererPrimeReactDataTable
              data={data4}
              rows={rows}
              linkColumns={linkColumns4}
              linkColumnsRoutes={linkColumnsRoutes4}
              dynamicColumns={dynamicColumns4}
              headerData={headerData4}
              setHeaderData={setHeaderData4}
            />
          </div>
        </CCollapse>
        {/* -------------------------------------------Sales---------------------------------- */}
        <div className="group customCard saved-search-menu">
          <div className="col-md-12 collapseHeader">
            <h2
              style={{ cursor: "pointer" }}
              onClick={() => {
                setVisibleF(!visibleF);
                visibleF
                  ? setCheveronIconF(FaChevronCircleUp)
                  : setCheveronIconF(FaChevronCircleDown);
              }}
            >
              Sales
            </h2>
            <div
              onClick={() => {
                setVisibleF(!visibleF);
                visibleF
                  ? setCheveronIconF(FaChevronCircleUp)
                  : setCheveronIconF(FaChevronCircleDown);
              }}
            >
              <span style={{ cursor: "pointer" }}>{cheveronIconF}</span>
            </div>
          </div>
        </div>
        <CCollapse visible={!visibleF}>
          <div>
            <CellRendererPrimeReactDataTable
              data={data5}
              rows={rows}
              linkColumns={linkColumns5}
              linkColumnsRoutes={linkColumnsRoutes5}
              dynamicColumns={dynamicColumns5}
              headerData={headerData5}
              setHeaderData={setHeaderData5}
            />
          </div>
        </CCollapse>
        {/* --------------------------------------------------Resource Overview------------- */}
        <div className="group customCard saved-search-menu">
          <div className="col-md-12 collapseHeader">
            <h2
              style={{ cursor: "pointer" }}
              onClick={() => {
                setVisibleG(!visibleG);
                visibleG
                  ? setCheveronIconG(FaChevronCircleUp)
                  : setCheveronIconG(FaChevronCircleDown);
              }}
            >
              Resource Overview
            </h2>
            <div
              onClick={() => {
                setVisibleG(!visibleG);
                visibleG
                  ? setCheveronIconG(FaChevronCircleUp)
                  : setCheveronIconG(FaChevronCircleDown);
              }}
            >
              <span style={{ cursor: "pointer" }}>{cheveronIconG}</span>
            </div>
          </div>
        </div>
        <CCollapse visible={!visibleG}>
          <div>
            <CellRendererPrimeReactDataTable
              data={data6}
              rows={rows}
              linkColumns={linkColumns6}
              linkColumnsRoutes={linkColumnsRoutes6}
              dynamicColumns={dynamicColumns6}
              headerData={headerData6}
              setHeaderData={setHeaderData6}
            />
          </div>
        </CCollapse>
        {/* --------------------------Resource Trending------------------------------------*/}
        <div className="group customCard saved-search-menu">
          <div className="col-md-12 collapseHeader">
            <h2
              style={{ cursor: "pointer" }}
              onClick={() => {
                setVisibleH(!visibleH);
                visibleH
                  ? setCheveronIconH(FaChevronCircleUp)
                  : setCheveronIconH(FaChevronCircleDown);
              }}
            >
              Resource Trending
            </h2>
            <div
              onClick={() => {
                setVisibleH(!visibleH);
                visibleH
                  ? setCheveronIconH(FaChevronCircleUp)
                  : setCheveronIconH(FaChevronCircleDown);
              }}
            >
              <span style={{ cursor: "pointer" }}>{cheveronIconH}</span>
            </div>
          </div>
        </div>
        <CCollapse visible={!visibleH}>
          <div>
            <CellRendererPrimeReactDataTable
              data={data7}
              rows={rows}
              linkColumns={linkColumns7}
              linkColumnsRoutes={linkColumnsRoutes7}
              dynamicColumns={dynamicColumns7}
              headerData={headerData7}
              setHeaderData={setHeaderData7}
            />
          </div>
        </CCollapse>
        {/* ===========================================Forecast========================== */}
        <div className="group customCard saved-search-menu">
          <div className="col-md-12 collapseHeader">
            <h2
              style={{ cursor: "pointer" }}
              onClick={() => {
                setVisibleI(!visibleI);
                visibleI
                  ? setCheveronIconI(FaChevronCircleUp)
                  : setCheveronIconI(FaChevronCircleDown);
              }}
            >
              Forecast
            </h2>
            <div
              onClick={() => {
                setVisibleI(!visibleI);
                visibleI
                  ? setCheveronIconI(FaChevronCircleUp)
                  : setCheveronIconI(FaChevronCircleDown);
              }}
            >
              <span style={{ cursor: "pointer" }}>{cheveronIconI}</span>
            </div>
          </div>
        </div>
        <CCollapse visible={!visibleI}>
          <div>
            <CellRendererPrimeReactDataTable
              data={data8}
              rows={rows}
              linkColumns={linkColumns8}
              linkColumnsRoutes={linkColumnsRoutes8}
              dynamicColumns={dynamicColumns8}
              headerData={headerData8}
              setHeaderData={setHeaderData8}
            />
          </div>
        </CCollapse>
        {/* =================================Bench Report==================================== */}

        <div className="group customCard saved-search-menu">
          <div className="col-md-12 collapseHeader">
            <h2
              style={{ cursor: "pointer" }}
              onClick={() => {
                setVisibleJ(!visibleJ);
                visibleJ
                  ? setCheveronIconJ(FaChevronCircleUp)
                  : setCheveronIconJ(FaChevronCircleDown);
              }}
            >
              Bench Report
            </h2>
            <div
              onClick={() => {
                setVisibleJ(!visibleJ);
                visibleJ
                  ? setCheveronIconJ(FaChevronCircleUp)
                  : setCheveronIconJ(FaChevronCircleDown);
              }}
            >
              <span style={{ cursor: "pointer" }}>{cheveronIconJ}</span>
            </div>
          </div>
        </div>
        <CCollapse visible={!visibleJ}>
          <div>
            <CellRendererPrimeReactDataTable
              data={data9}
              rows={rows}
              linkColumns={linkColumns9}
              linkColumnsRoutes={linkColumnsRoutes9}
              dynamicColumns={dynamicColumns9}
              headerData={headerData9}
              setHeaderData={setHeaderData9}
            />
          </div>
        </CCollapse>
        {/* /==========================================Roll Offs================================= */}
        <div className="group customCard saved-search-menu">
          <div className="col-md-12 collapseHeader">
            <h2
              style={{ cursor: "pointer" }}
              onClick={() => {
                setVisibleK(!visibleK);
                visibleK
                  ? setCheveronIconK(FaChevronCircleUp)
                  : setCheveronIconK(FaChevronCircleDown);
              }}
            >
              Roll Offs
            </h2>
            <div
              onClick={() => {
                setVisibleK(!visibleK);
                visibleK
                  ? setCheveronIconK(FaChevronCircleUp)
                  : setCheveronIconK(FaChevronCircleDown);
              }}
            >
              <span style={{ cursor: "pointer" }}>{cheveronIconK}</span>
            </div>
          </div>
        </div>
        <CCollapse visible={!visibleK}>
          <div>
            <CellRendererPrimeReactDataTable
              data={data10}
              rows={rows}
              linkColumns={linkColumns10}
              linkColumnsRoutes={linkColumnsRoutes10}
              dynamicColumns={dynamicColumns10}
              headerData={headerData10}
              setHeaderData={setHeaderData10}
            />
          </div>
        </CCollapse>

        {/* ====================================================Revenue &amp; Margin Variance============== */}
        <div className="group customCard saved-search-menu">
          <div className="col-md-12 collapseHeader">
            <h2
              style={{ cursor: "pointer" }}
              onClick={() => {
                setVisibleL(!visibleL);
                visibleL
                  ? setCheveronIconL(FaChevronCircleUp)
                  : setCheveronIconL(FaChevronCircleDown);
              }}
            >
              Revenue & Margin Variance
            </h2>
            <div
              onClick={() => {
                setVisibleL(!visibleL);
                visibleL
                  ? setCheveronIconL(FaChevronCircleUp)
                  : setCheveronIconL(FaChevronCircleDown);
              }}
            >
              <span style={{ cursor: "pointer" }}>{cheveronIconL}</span>
            </div>
          </div>
        </div>
        <CCollapse visible={!visibleL}>
          <div>
            <CellRendererPrimeReactDataTable
              data={data11}
              rows={rows}
              linkColumns={linkColumns11}
              linkColumnsRoutes={linkColumnsRoutes11}
              dynamicColumns={dynamicColumns11}
              headerData={headerData11}
              setHeaderData={setHeaderData11}
            />
          </div>
        </CCollapse>
        {/* =======================	Margin Forecast Variance==================================================== */}

        <div className="group customCard saved-search-menu">
          <div className="col-md-12 collapseHeader">
            <h2
              style={{ cursor: "pointer" }}
              onClick={() => {
                setVisibleM(!visibleM);
                visibleM
                  ? setCheveronIconM(FaChevronCircleUp)
                  : setCheveronIconM(FaChevronCircleDown);
              }}
            >
              Margin Forecast Variance
            </h2>
            <div
              onClick={() => {
                setVisibleM(!visibleM);
                visibleM
                  ? setCheveronIconM(FaChevronCircleUp)
                  : setCheveronIconM(FaChevronCircleDown);
              }}
            >
              <span style={{ cursor: "pointer" }}>{cheveronIconM}</span>
            </div>
          </div>
        </div>
        <CCollapse visible={!visibleM}>
          <div>
            <CellRendererPrimeReactDataTable
              data={data12}
              rows={rows}
              linkColumns={linkColumns12}
              linkColumnsRoutes={linkColumnsRoutes12}
              dynamicColumns={dynamicColumns12}
              headerData={headerData12}
              setHeaderData={setHeaderData12}
            />
          </div>
        </CCollapse>

        {/* ===================================Rev.Projections========================================== */}
        <div className="group customCard saved-search-menu">
          <div className="col-md-12 collapseHeader">
            <h2
              style={{ cursor: "pointer" }}
              onClick={() => {
                setVisibleN(!visibleN);
                visibleN
                  ? setCheveronIconN(FaChevronCircleUp)
                  : setCheveronIconN(FaChevronCircleDown);
              }}
            >
              Rev.Projections
            </h2>
            <div
              onClick={() => {
                setVisibleN(!visibleN);
                visibleN
                  ? setCheveronIconN(FaChevronCircleUp)
                  : setCheveronIconN(FaChevronCircleDown);
              }}
            >
              <span style={{ cursor: "pointer" }}>{cheveronIconN}</span>
            </div>
          </div>
        </div>
        <CCollapse visible={!visibleN}>
          <div>
            <CellRendererPrimeReactDataTable
              data={data13}
              rows={rows}
              linkColumns={linkColumns13}
              linkColumnsRoutes={linkColumnsRoutes13}
              dynamicColumns={dynamicColumns13}
              headerData={headerData13}
              setHeaderData={setHeaderData13}
            />
          </div>
        </CCollapse>
        {/* ======================================= Utilization FY======================= */}

        <div className="group customCard saved-search-menu">
          <div className="col-md-12 collapseHeader">
            <h2
              style={{ cursor: "pointer" }}
              onClick={() => {
                setVisibleO(!visibleO);
                visibleO
                  ? setCheveronIconO(FaChevronCircleUp)
                  : setCheveronIconO(FaChevronCircleDown);
              }}
            >
              {" "}
              Utilization-FY
            </h2>
            <div
              onClick={() => {
                setVisibleO(!visibleO);
                visibleO
                  ? setCheveronIconO(FaChevronCircleUp)
                  : setCheveronIconO(FaChevronCircleDown);
              }}
            >
              <span style={{ cursor: "pointer" }}>{cheveronIconO}</span>
            </div>
          </div>
        </div>
        <CCollapse visible={!visibleO}>
          <div>
            <CellRendererPrimeReactDataTable
              data={data14}
              rows={rows}
              linkColumns={linkColumns14}
              linkColumnsRoutes={linkColumnsRoutes14}
              dynamicColumns={dynamicColumns14}
              headerData={headerData14}
              setHeaderData={setHeaderData14}
            />
          </div>
        </CCollapse>
        {/* ==================NB Work - 4  Prev. Weeks=============================== */}

        <div className="group customCard saved-search-menu">
          <div className="col-md-12 collapseHeader">
            <h2
              style={{ cursor: "pointer" }}
              onClick={() => {
                setVisibleP(!visibleP);
                visibleP
                  ? setCheveronIconP(FaChevronCircleUp)
                  : setCheveronIconP(FaChevronCircleDown);
              }}
            >
              NB Work-4 Prev.Weeks
            </h2>
            <div
              onClick={() => {
                setVisibleP(!visibleP);
                visibleP
                  ? setCheveronIconP(FaChevronCircleUp)
                  : setCheveronIconP(FaChevronCircleDown);
              }}
            >
              <span style={{ cursor: "pointer" }}>{cheveronIconP}</span>
            </div>
          </div>
        </div>
        <CCollapse visible={!visibleP}>
          <div>
            <CellRendererPrimeReactDataTable
              data={data15}
              rows={rows}
              linkColumns={linkColumns15}
              linkColumnsRoutes={linkColumnsRoutes15}
              dynamicColumns={dynamicColumns15}
              headerData={headerData15}
              setHeaderData={setHeaderData15}
            />
          </div>
        </CCollapse>

        {deletePopup16 == true ? (
          <SavedSearchPopup
            editId={editId}
            deletedata={deletedata}
            deletePopup16={deletePopup16}
            setDeletePopup16={setDeletePopup16}
          />
        ) : (
          ""
        )}

        {deletePopup1 ? (
          <SavedSearchPopup1
            editId1={editId1}
            deletePopup1={deletePopup1}
            setDeletePopup1={setDeletePopup1}
          />
        ) : (
          ""
        )}

        {deletePopup2 ? (
          <SavedSearchPopup2
            deletedata2={deletedata2}
            editId2={editId2}
            deletePopup2={deletePopup2}
            setDeletePopup2={setDeletePopup2}
          />
        ) : (
          ""
        )}

        {deletePopup3 ? (
          <SavedSearchPopup3
            editId3={editId3}
            deletePopup3={deletePopup3}
            setDeletePopup3={setDeletePopup3}
          />
        ) : (
          ""
        )}

        {deletePopup4 ? (
          <SavedSearchPopup4
            editId4={editId4}
            deletePopup4={deletePopup4}
            setDeletePopup4={setDeletePopup4}
          />
        ) : (
          ""
        )}

        {deletePopup5 ? (
          <SavedSearchPopup5
            editId5={editId5}
            deletePopup5={deletePopup5}
            setDeletePopup5={setDeletePopup5}
          />
        ) : (
          ""
        )}

        {deletePopup6 ? (
          <SavedSearchPopup6
            editId6={editId6}
            deletePopup6={deletePopup6}
            setDeletePopup6={setDeletePopup6}
          />
        ) : (
          ""
        )}

        {deletePopup7 ? (
          <SavedSearchPopup7
            editId7={editId7}
            deletePopup7={deletePopup7}
            setDeletePopup7={setDeletePopup7}
          />
        ) : (
          ""
        )}

        {deletePopup8 ? (
          <SavedSearchPopup8
            editId8={editId8}
            deletePopup8={deletePopup8}
            setDeletePopup8={setDeletePopup8}
          />
        ) : (
          ""
        )}

        {deletePopup9 ? (
          <SavedSearchPopup9
            editId9={editId9}
            deletePopup9={deletePopup9}
            setDeletePopup9={setDeletePopup9}
          />
        ) : (
          ""
        )}

        {deletePopup10 ? (
          <SavedSearchPopup10
            editId10={editId10}
            deletePopup10={deletePopup10}
            setDeletePopup10={setDeletePopup10}
          />
        ) : (
          ""
        )}

        {deletePopup11 ? (
          <SavedSearchPopup11
            editId11={editId11}
            deletePopup11={deletePopup11}
            setDeletePopup11={setDeletePopup11}
          />
        ) : (
          ""
        )}

        {deletePopup12 ? (
          <SavedSearchPopup12
            editId12={editId12}
            deletePopup12={deletePopup12}
            setDeletePopup12={setDeletePopup12}
          />
        ) : (
          ""
        )}

        {deletePopup13 ? (
          <SavedSearchPopup13
            editId13={editId13}
            deletePopup13={deletePopup13}
            setDeletePopup13={setDeletePopup13}
          />
        ) : (
          ""
        )}

        {deletePopup14 ? (
          <SavedSearchPopup14
            editId14={editId14}
            deletePopup14={deletePopup14}
            setDeletePopup14={setDeletePopup14}
          />
        ) : (
          ""
        )}

        {deletePopup15 ? (
          <SavedSearchPopup15
            editId15={editId15}
            deletePopup15={deletePopup15}
            setDeletePopup15={setDeletePopup15}
          />
        ) : (
          ""
        )}
      </div>
      <br />
      {/* <ServiceSearchFilters filterData={filterData} /> */}
    </div>
  );
}
export default SavedSearch;
