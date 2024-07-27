import { CCollapse } from "@coreui/react";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { FaChevronCircleDown, FaChevronCircleUp } from "react-icons/fa";
import { environment } from "../../environments/environment";
import CellRendererPrimeReactDataTable from "../PrimeReactTableComponent/CellRendererPrimeReactDataTable";
import { Column } from "ag-grid-community";
import { useNavigate } from "react-router-dom";
import { AiFillDelete } from "react-icons/ai";
import moment from "moment";
import CustomDashboardDeletePopUp from "./CustomDashboardDeletePopUp";

function CustomOrgDashboard(props) {
  const { setAddmsg } = props;
  const [getData, setGetData] = useState([]);
  const [getTableData, setGetTableData] = useState({});
  const loggedUserId = localStorage.getItem("resId");
  const [linkColumns, setLinkColumns] = useState([]);
  const [headerData, setHeaderData] = useState([]);
  const baseUrl = environment.baseUrl;
  const [deletePopup, setDeletePopup] = useState(false);
  const [sectionStates, setSectionStates] = useState({}); // Use an object to store section visibility states.
  const [deleteId, setDeleteId] = useState();
  const [tableId, setTableId] = useState();
  const [tableName, setTableName] = useState();

  const getMyDashboardData = () => {
    axios
      .get(
        `${baseUrl}/dashboardsms/customDashboard/getMyDashboardCollapse?userId=${loggedUserId}&dashType=1418`
      )
      .then((res) => {
        const data = res.data;
        setGetData(data);
      });
  };

  const deleteMyDashboardData = () => {
    axios({
      method: "delete",
      url: `${baseUrl}/dashboardsms/savedsearch/deletedataSearchFilters?saved_search_id=${deleteId}`,
    }).then(
      axios({
        method: "delete",
        url: `${baseUrl}/dashboardsms/savedsearch/deletedataSavedSearch?id=${deleteId}`,
      }).then((error) => {
        setDeletePopup(false);
        getMyDashboardData();
        getMyDashboardTablesData();
        setAddmsg(true);
        setTimeout(() => {
          setAddmsg(false);
        }, 3000);
        window.scrollTo({ top: 0, behavior: "smooth" });
      })
    );
  };

  const getMyDashboardTablesData = (value, sessionName) => {
    axios
      .get(
        `${baseUrl}/dashboardsms/customDashboard/getMyDashboardTable?dashType=1418&sectionId=${tableId}&userId=${loggedUserId}`
      )
      .then((res) => {
        const data = res.data;
        let GetData = res.data;
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
        setGetTableData((prev) => ({
          ...prev,
          [tableName]: dataHeaders.concat(GetData),
        }));
        let data1 = ["search_name", "Action"];
        setLinkColumns(data1);
      });
  };

  useEffect(() => {
    getMyDashboardData();
  }, []);

  useEffect(() => {
    getMyDashboardTablesData();
  }, [tableId]);

  const toggleSection = (section, id) => {
    // Toggle the visibility state for a specific section.
    setSectionStates((prevState) => ({
      ...prevState,
      [section]: !prevState[section] || false,
    }));
  };

  useEffect(() => {
    getTableData[0] &&
      setHeaderData(JSON.parse(JSON.stringify(getTableData[0])));
  }, [getTableData]);

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
    // let rou = linkColumnsRoutes[0];
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
            // setId(data.id);
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
                setDeletePopup(true);
                // setEditedData(data);
                setDeleteId(data.id);
                // setType("edit"),
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
  return (
    <div>
      {getData.map((item, index) => (
        <div key={index} className="group mb-1 customCard">
          <div className="col-md-12 collapseHeader">
            <h2
              style={{ cursor: "pointer" }}
              onClick={() =>
                toggleSection(
                  item.section,
                  setTableName(item.section),
                  setTableId(item.id)
                )
              }
            >
              {item.section}
            </h2>
            <div
              style={{ cursor: "pointer" }}
              onClick={() =>
                toggleSection(
                  item.section,
                  setTableName(item.section),
                  setTableId(item.id)
                )
              }
            >
              <span>
                {sectionStates[item.section] ? (
                  <FaChevronCircleUp />
                ) : (
                  <FaChevronCircleDown />
                )}
              </span>
            </div>
          </div>
          <CCollapse visible={sectionStates[item.section]}>
            <div>
              <CellRendererPrimeReactDataTable
                data={
                  getTableData[item.section] == undefined
                    ? []
                    : getTableData[item.section]
                }
                rows={5}
                linkColumns={linkColumns}
                // linkColumnsRoutes={linkColumnsRoutes}
                dynamicColumns={dynamicColumns}
                headerData={headerData}
                setHeaderData={setHeaderData}
              />
            </div>
            {/* Add your additional components or content here */}
          </CCollapse>
        </div>
      ))}
      {getData.length === 0 && (
        <div className="group mb-5 customCard">
          <div className="group-content row collapseHeader">
            <div
              className="form-group row"
              style={{
                fontSize: "15px",
                justifyContent: "center",
              }}
            >
              No Data Found
            </div>
          </div>
        </div>
      )}

      {deletePopup == true ? (
        <CustomDashboardDeletePopUp
          //   editId={editId}
          deleteMyDashboardData={deleteMyDashboardData}
          deletePopup={deletePopup}
          setDeletePopup={setDeletePopup}
        />
      ) : (
        ""
      )}
    </div>
  );
}
export default CustomOrgDashboard;
