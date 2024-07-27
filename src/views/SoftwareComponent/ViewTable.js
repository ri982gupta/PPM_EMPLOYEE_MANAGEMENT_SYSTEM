import { Fragment, useRef, useState } from "react";
import ViewDetailsTable from "./DetailsTable";
import ViewDetailsSearchFilters from "./ViewDetailsSearchFilters";
import fte_active from "../../assets/images/empstatusIcon/fte_active.png";
import fte_inactive from "../../assets/images/empstatusIcon/fte_inactive.png";
import fte_notice from "../../assets/images/empstatusIcon/fte_notice.png";
import subk_active from "../../assets/images/empstatusIcon/subk_active.png";
import subk_inactive from "../../assets/images/empstatusIcon/subk_inactive.png";
import subk_notice from "../../assets/images/empstatusIcon/subk_notice.png";
import { FaAngleRight, FaCaretDown, FaCaretRight } from "react-icons/fa";
import { FaAngleDown } from "react-icons/fa";
import { MdOutlineEditNote } from "react-icons/md";
import DisplayPopUpEditNote from "./DisplayPopUpEditNote";
import Loader from "../Loader/Loader";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { environment } from "../../environments/environment";
import moment from "moment";
import { useEffect } from "react";
import {
  updateDateForSE,
  updateNeglected,
} from "../../reducers/SelectedSEReducer";

export default function ViewTable({
  VT,
  qdata,
  setQdata,
  viewDisplay,
  setViewDisplay,
  reportRunId,
  viewsalesid,
}) {
  const [serviceData, setServiceData] = useState([]);
  const [rowData, setRowData] = useState([]);
  const [viewDetailsData, setviewDetailsData] = useState([]);
  const [filterExectiveName, setFilterExectiveName] = useState("");
  const [filtertrue, setFiltertrue] = useState(false);
  const allQuarter = VT?.filter((item) => item.lvl === 1).map((item) => {
    return { quat: item.quarter, date: item.date };
  });
  const dispatch = useDispatch();
  const [expandSecond, setExpandSecond] = useState(false);
  const [cust, setCust] = useState([]);

  const [srchQuat, setsrchQuat] = useState(() =>
    allQuarter.length > 0 ? allQuarter[0] : {}
  );

  const [executive, setexecutive] = useState("-1");
  const [openPopup, setOpenPopup] = useState(false);
  const [quarterData, setQuarterData] = useState([]);
  const popupValue = "ViewTable";
  const [expanded, setexpanded] = useState([]);
  const [loader, setLoader] = useState(false);
  const abortController = useRef(null);
  const updateddate = useSelector((state) => state.selectedSEState.dateForSe);
  const executiveId = useSelector(
    (state) => state.selectedSEState.salesExectiveId
  );
  const [seData, setSeData] = useState(executiveId);
  const reportRunIdRedux = useSelector(
    (state) => state.selectedSEState.reportRunId
  );
  const [date, setDate] = useState(() => {
    const today = new Date();
    const year = today.getFullYear();
    const quarter = Math.floor((today.getMonth() + 3) / 3); // Calculate current quarter
    const startMonth = (quarter - 1) * 3; // Start month of the quarter
    const startDate = new Date(year, startMonth, 1); // Start date of the quarter

    return startDate;
  });
  const ownerDivisions = useSelector(
    (state) => state.selectedSEState.ownerDivisions
  );
  const OwnerValues = ownerDivisions?.map((item) => item.value).join(",");
  const [ownerDivison, setOwnerDiviosn] = useState(OwnerValues);
  const vendor = useSelector((state) => state.selectedSEState.vendorId);
  const [vendor1, setVendor1] = useState(vendor);
  const handleAbort = () => {
    abortController.current && abortController.current.abort();
    setLoader(false);
  };
  const baseUrl = environment.baseUrl;
  //=============For Rrfresh========================================
  const getserviceData = () => {
    const loaderTime = setTimeout(() => {
      setLoader(true);
    }, 2000);
    abortController.current = new AbortController();
    axios({
      method: "post",
      url: baseUrl + `/SalesMS/salesforce/refreshSalesForceData`,
      signal: abortController.current.signal,
      data: {
        reportRunId: "" + reportRunIdRedux,
        for: "Software",
      },
    })
      .then((resp) => {
        const data = resp.data.data;
        setLoader(false);
        clearTimeout(loaderTime);
        getviewDetailsData();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getviewDetailsData = (id, date, neglatedData) => {
    setLoader(false);
    axios({
      method: "post",
      url: baseUrl + `/SalesMS/software/getSalesSoftwareDataDetails`,
      data: {
        executives: id == undefined || id === "1" ? -1 : id,
        from: moment(date).format("YYYY-MM-DD"),
        type: "view",
        detail: true,
        reportRunId: reportRunIdRedux,
        optType: neglatedData,
        vendors: vendor1,
        saveSE: false,
        divisions: ownerDivison,
        mode: -1,
        duration: -1,
        measures: -1,
        customers: -1,
        prospects: -1,
        practices: -1,
        countries: -1,
        customerType: -1,
        summary: -1,
        showBy: "-1",
        quarter: -1,
        status: -1,
        duration2: -1,
        monthsel: -1,
        viewByTime: -1,
        fyear: -1,
        aelocation: -1,
        engComp: -1,
        Divisions: -1,
        accOwner: -1,
        newCust: -1,
        accType: -1,
      },
    })
      .then((resp) => {
        const data = resp.data.data;
        const array = [
          "id",
          "executive_division",
          "execStatus",
          "supervisor",
          "customerId",
          "customer",
          "isProspect",
          "oppId",
          "sfOppId",
          "opportunity",
          "vendor",
          "probability",
          "closeDate",
          "oppAmount",
          "calls",
          "upside",
          "closedAmount",
          "week",
          "comments",
          "lvl",
          "count",
          "isEdit",
          "isDeleted",
          "keyAttr",
          "parentAttr",
          "add_to_call",
          "isActive",
        ];
        const newArray = data.map((item) => {
          let k = JSON.parse(JSON.stringify(item, array, 4));
          return k;
        });
        const allcust = newArray
          .filter((item) => item.lvl === 1)
          .map((item) => item.customer);
        setCust(allcust);
        setviewDetailsData(newArray);
        setLoader(false);
        window.scrollTo({
          top: 450,
          behavior: "smooth", // This adds a smooth scrolling effect, optional
        });
      })
      .catch((resp) => {});
  };
  const SalesExecutive = VT.filter((item) => item.lvl === 2).map((item) => {
    let obj = {
      label: item.executive,
      value: item.id,
    };
    return obj;
  });
  const clickExpand = (qurt) => {
    if (qurt === "Summary") {
      setexpanded((prevState) => {
        return prevState.length === allQuarter.length
          ? []
          : allQuarter.map((item) => item.quat);
      });
    } else {
      setexpanded((prevState) => {
        return prevState.includes(qurt)
          ? prevState.filter((item) => item !== qurt)
          : [...prevState, qurt];
      });
    }
  };

  let toggler = 0;
  const icons = {
    fte0: (
      <img
        src={fte_inactive}
        alt="(fte_inactive_icon)"
        style={{ height: "12px" }}
        title="Ex-Employee"
      />
    ),
    fte1: (
      <img
        src={fte_active}
        alt="(fte_active_icon)"
        style={{ height: "12px" }}
        title="Active Employee"
      />
    ),
    fte2: (
      <img
        src={fte_notice}
        alt="(fte_notice_icon)"
        style={{ height: "12px" }}
        title="Employee in notice period"
      />
    ),
    subk0: (
      <img
        src={subk_inactive}
        alt="(subk_inactive_icon)"
        style={{ height: "12px" }}
        title="Ex-Contractor"
      />
    ),
    subk1: (
      <img
        src={subk_active}
        alt="(subk_active_icon)"
        style={{ height: "12px" }}
        title="Active Contractor"
      />
    ),
    subk2: (
      <img
        src={subk_notice}
        alt="(subk_notice_icon)"
        style={{ height: "12px" }}
        title="Contractor in notice period"
      />
    ),
  };
  const heads = VT.map((data) => {
    const conditions = [
      "lvl",
      "execStatus",
      "isActive",
      "country",
      "date",
      "id",
    ];
    const nonIntegers = ["quarter", "summary"];
    const nonIntegerIcons = ["executive"];
    let header = [];

    toggler =
      data["lvl"] === 2 ? toggler : expanded.includes(data.quarter) ? 1 : 0;

    for (const keys in data) {
      data[keys] !== null &&
        !conditions.includes(keys) &&
        keys !== (expanded.length > 0 ? "" : "executive") &&
        header.push(
          data.id < 0 ? (
            <th className={keys + " pipeth wowFirstTh"} key={keys}>
              <b>
                {" "}
                {data[keys] === "Amount ($)"
                  ? "Pipeline ($)"
                  : data[keys] === "Closed Amt ($)"
                  ? "Closed ($)"
                  : data[keys]}
              </b>
            </th>
          ) : (
            <td
              key={keys}
              style={{
                display: toggler === 0 && data["lvl"] === 2 ? "none" : "",
                textAlign:
                  keys === "calls" ||
                  keys === "closedAmount" ||
                  keys === "gap" ||
                  keys === "oppAmount" ||
                  keys === "target" ||
                  keys === "upside"
                    ? "end"
                    : "",
              }}
              title={data[keys]}
            >
              {nonIntegerIcons.includes(keys) ? (
                <Fragment>
                  {keys === "executive" && data["executive"] === "" ? (
                    ""
                  ) : (
                    <span>
                      {icons[data["execStatus"]]}
                      &nbsp;
                      <MdOutlineEditNote
                        style={{ float: "right", cursor: "pointer" }}
                        size={"1.5em"}
                        onClick={() => {
                          setOpenPopup(true);
                          setRowData(data);
                        }}
                        title={data[keys]}
                      />
                      <span
                        style={{ color: "#2e88c5", cursor: "pointer" }}
                        onClick={() => {
                          const originalQuarter = data.quarter;
                          const [year, quarter] = originalQuarter?.split("-");
                          const quarterToMonth = {
                            Q1: "04",
                            Q2: "07",
                            Q3: "10",
                            Q4: "01",
                          };
                          const month = quarterToMonth[quarter];
                          const quarterYear = parseInt(year);
                          const yearForQuarter =
                            quarter === "Q3" ||
                            quarter === "Q1" ||
                            quarter === "Q2"
                              ? quarterYear - 1
                              : quarterYear;
                          const formattedDate = `${yearForQuarter}-${month}-01`;
                          dispatch(updateNeglected(true));
                          const id = data.id;
                          const neglatedData = "neglected";
                          getviewDetailsData(id, formattedDate, neglatedData);
                          setExpandSecond(true);
                        }}
                      >
                        {data[keys]}
                      </span>
                    </span>
                  )}
                </Fragment>
              ) : (
                " "
              )}
              {nonIntegers.includes(keys) ? (
                <Fragment>
                  <span
                    onClick={() => {
                      clickExpand(data.quarter);
                    }}
                    title={data[keys]}
                    style={{ fontWeight: "bold" }}
                  >
                    {data["lvl"] === 0 &&
                      keys === "quarter" &&
                      (expanded.includes(data.quarter) ||
                      expanded.length === allQuarter.length ? (
                        <span>
                          {" "}
                          <> </>{" "}
                          <FaCaretDown
                            style={{ color: "#428bca", cursor: "pointer" }}
                          />
                          {data[keys]}
                        </span>
                      ) : (
                        <span style={{ fontWeight: "bold" }}>
                          <FaCaretRight
                            style={{ color: "#428bca", cursor: "pointer" }}
                            title="Expand all"
                          />
                          {data[keys]}
                        </span>
                      ))}
                    {data["lvl"] === 1 &&
                      keys === "quarter" &&
                      (expanded.includes(data.quarter) ||
                      expanded.length === allQuarter.length ? (
                        <span>
                          {" "}
                          <> </>{" "}
                          <FaCaretDown
                            style={{ color: "#428bca", cursor: "pointer" }}
                            title="Collapse all"
                          />
                          {/* {data[keys]} */}
                        </span>
                      ) : (
                        <span>
                          <FaCaretRight
                            style={{ color: "#428bca", cursor: "pointer" }}
                            title="Expand all"
                          />
                          {/* {data[keys]} */}
                        </span>
                      ))}
                  </span>

                  {keys === "quarter" && data.quarter !== "Summary"
                    ? data["lvl"] === 1 && (
                        <span
                          className="linkSty"
                          onClick={() => {
                            setexecutive(-1);
                            setsrchQuat({
                              quat: data.quarter,
                            });
                            const originalQuarter = data.quarter;
                            const [year, quarter] = originalQuarter.split("-");
                            const quarterToMonth = {
                              Q1: "04",
                              Q2: "07",
                              Q3: "10",
                              Q4: "01",
                            };
                            const month = quarterToMonth[quarter];
                            const quarterYear = parseInt(year);
                            const yearForQuarter =
                              quarter === "Q3" ||
                              quarter === "Q1" ||
                              quarter === "Q2"
                                ? quarterYear - 1
                                : quarterYear;
                            const formattedDate = `${yearForQuarter}-${month}-01`;

                            dispatch(updateNeglected(false));
                            dispatch(updateDateForSE(formattedDate));
                            const neglatedData = -1;
                            getviewDetailsData(
                              data.id,
                              formattedDate,
                              neglatedData
                            );
                          }}
                          title={data[keys]}
                        >
                          {data[keys]}
                        </span>
                      )
                    : ""}
                </Fragment>
              ) : (
                <Fragment>
                  <span title={parseInt(data[keys]).toLocaleString("en-US")}>
                    {parseInt(data[keys]).toLocaleString("en-US") == "NaN"
                      ? ""
                      : parseInt(data[keys]).toLocaleString("en-US")}
                  </span>
                  &nbsp;
                </Fragment>
              )}
            </td>
          )
        );
    }

    return (
      <tr
        className={data.executive == "" ? "pink" : "red "}
        key={data.id + data.quarter}
      >
        {header}
      </tr>
    );
  });

  return (
    <div className="col-lg-12 col-md-12 col-sm-12 customCard">
      <button
        type="button"
        className="btn btn-primary"
        style={{ marginBottom: "1%" }}
        onClick={() => {
          // setLoader(true);
          getserviceData();
          // setTimeout(() => {
          //   setLoader(false);
          // }, 4000);
        }}
      >
        {" "}
        Refresh SF Data{" "}
      </button>
      {loader ? <Loader handleAbort={handleAbort} /> : ""}
      <div
        className="darkHeader"
        style={{
          overflowY: "scroll",
          maxWidth: "fit-content",
          paddingRight: "0px !important",
          maxHeight: "400px",
        }}
      >
        <table
          className="table table-bordered  firstViewTable"
          style={{ width: "auto" }}
        >
          <thead>{heads}</thead>
        </table>
      </div>

      {VT.length > 2 && (
        <>
          <ViewDetailsSearchFilters
            setviewDetailsData={setviewDetailsData}
            SalesExecutive={SalesExecutive}
            allQuarter={allQuarter}
            setQuarterData={setQuarterData}
            quarterData={quarterData}
            srchQuat={srchQuat}
            setsrchQuat={setsrchQuat}
            qdata={qdata}
            setQdata={setQdata}
            executive={executive}
            reportRunId={reportRunId}
            viewsalesid={viewsalesid}
            setFilterExectiveName={setFilterExectiveName}
            setFiltertrue={setFiltertrue}
            setCust={setCust}
            cust={cust}
          />
          <ViewDetailsTable
            viewDetailsData={viewDetailsData}
            srchQuat={srchQuat}
            executive={executive}
            SalesExecutive={SalesExecutive}
            filterExectiveName={filterExectiveName}
            filtertrue={filtertrue}
            getviewDetailsData={getviewDetailsData}
            setCust={setCust}
            cust={cust}
          />
        </>
      )}

      {openPopup ? (
        <DisplayPopUpEditNote
          openPopup={openPopup}
          setOpenPopup={setOpenPopup}
          Vdata={serviceData}
          rowData={rowData}
          popupValue={popupValue}
        />
      ) : (
        ""
      )}
    </div>
  );
}
