import React, { useState, useRef, useEffect } from "react";
import {
  FaChevronCircleDown,
  FaChevronCircleUp,
  FaSearch,
} from "react-icons/fa";
import DatePicker from "react-datepicker";
import axios from "axios";
import moment from "moment";
import Loader from "../Loader/Loader";
import { RiFileExcel2Line } from "react-icons/ri";
import GlobalValidation from "../ValidationComponent/GlobalValidation";
import RevenueByIndustrySecondTable from "./RevenueByIndustrySecondTable";
import RevenueIndustryCollapsibleTable from "./RevenueIndustryCollapsibleTable";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import highcharts3d from "highcharts/highcharts-3d";
import { Column } from "primereact/column";
import { Tooltip } from "primereact/tooltip";
import { environment } from "../../environments/environment";
import { AiFillWarning } from "react-icons/ai";
import { CCollapse } from "@coreui/react";
import GlobalHelp from "../PrimeReactTableComponent/GlobalHelp";
import ScreenBreadcrumbs from "../Common/ScreenBreadcrumbs";
import "./RevenueIndustrySecondTable.scss";
import { WidthFull } from "@mui/icons-material";

highcharts3d(Highcharts);

function RevenueIndustry() {
  const [month, setMonth] = useState(null);

  const [details, setDetails] = useState([]);
  const [columns, setColumns] = useState([]);
  const [visible, setVisible] = useState(false);
  const [searching, setsearching] = useState(false);
  const [search, setSearch] = useState(false);
  const [validationmessage, setValidationMessage] = useState(false);
  const [visible1, setVisible1] = useState(false);
  const [cheveronIcon, setCheveronIcon] = useState(FaChevronCircleUp);

  const ref = useRef([]);

  const [graphData, setGraphData] = useState([]);
  const [graphData2, setGraphData2] = useState([]);

  const [chartDataProp, setChartDataProp] = useState({});
  const [chartDataProp2, setChartDataProp2] = useState({});
  const [duration, setDuration] = useState([]);

  const [count, setCount] = useState(0);

  const abortController = useRef(null);

  useEffect(() => { }, [count]);

  const initialvalue = {
    indTypes: "",
    month: "",
    Duration: "",
  };
  const [formData, setFormData] = useState(initialvalue);

  const [tableData, setTableData] = useState([]);
  let angle = 180;
  const [secondTabData, setSecondTabData] = useState([]);

  const [bodyData, setBodyData] = useState([]);
  const [headerData, setHeaderData] = useState([]);
  const loggedUserId = localStorage.getItem("resId");

  const baseUrl = environment.baseUrl;

  //----------------------breadcrumbs----------------------

  const [routes, setRoutes] = useState([]);
  let textContent = "Revenue Metrics";
  let currentScreenName = [" Recognized Revenue By Industry"];
  sessionStorage.setItem(
    "breadCrumbs",
    JSON.stringify({
      routes: routes,
      currentScreenName: currentScreenName,
      textContent: textContent,
    })
  );

  useEffect(() => {
    getMenus();
  }, []);

  const getMenus = () => {
    axios({
      method: "GET",
      url: baseUrl + `/CommonMS/master/getMenus?loggedUserId=${loggedUserId}`,
    }).then((resp) => {
      const data = resp.data;
      for (let i = 0; i < data.length; i++) {
        const menus = data[i].subMenus;
        if (menus) {
          for (let j = 0; j < menus.length; j++) {
            if (menus[j].display_name === "Revenue By Industry") {
              // Update the display_name
              menus[j].display_name = "Recognized Rev By Industry";
            }
          }
        }
      }
      const modifiedUrlPath = "/pmo/custIndustryReport";
      getUrlPath(modifiedUrlPath);

      let getData = data.map((menu) => {
        if (menu.subMenus) {
          menu.subMenus = menu.subMenus.filter(
            (subMenu) =>
              // subMenu.display_name !== "Monthly Revenue Trend" &&
              subMenu.display_name !== "Revenue & Margin Variance" &&
              subMenu.display_name !== "Rev. Projections" &&
              subMenu.display_name !== "Project Timesheet (Deprecated)" &&
              subMenu.display_name !== "Financial Plan & Review"
          );
        }

        return menu;
      });
      // setData2(getData);

      getData.forEach((item) => {
        if (item.display_name === textContent) {
          setRoutes([item]);
          sessionStorage.setItem("displayName", item.display_name);
        }
      });
    });
  };
  const getUrlPath = (modifiedUrlPath) => {
    console.log(modifiedUrlPath);
    axios({
      method: "get",
      url:
        baseUrl +
        `/CommonMS/security/authorize?url=${modifiedUrlPath}&userId=${loggedUserId}`,
    })
      .then((res) => { })
      .catch((error) => { });
  };

  var maxDate = new Date();
  var year = maxDate.getFullYear();
  var month1 = maxDate.getMonth();

  var maxDate = new Date(year, month1 + 11);

  const calculateDuration = (e) => {
    let currentMon = moment();
    let selectedMon = moment(e);

    let monthDifference = currentMon.diff(selectedMon, "months");

    formData["Duration"] = monthDifference;

    let dr = [];

    for (let i = 1; i <= monthDifference; i++) {
      i < 13 && dr.push(i);
    }

    setDuration(dr);
  };

  useEffect(() => {
    let mon = null;

    let subMon = null;

    let current = moment().format("MM");

    let finalMonth = null;

    if (current >= 1 && current <= 3) {
      mon = moment().format("MM");
      subMon = mon - 1;
      finalMonth = moment().subtract(subMon, "months");
    } else if (current >= 4 && current <= 6) {
      mon = moment().format("MM");
      subMon = mon - 4;
      finalMonth = moment().subtract(subMon, "months");
    } else if (current >= 7 && current <= 9) {
      mon = moment().format("MM");
      subMon = mon - 7;
      finalMonth = moment().subtract(subMon, "months");
    } else if (current >= 10 && current <= 12) {
      mon = moment().format("MM");
      subMon = mon - 10;
      finalMonth = moment().subtract(subMon, "months");
    }

    finalMonth = finalMonth.subtract(5, "months")._d;

    setMonth(finalMonth);

    formData["month"] = finalMonth;

    calculateDuration(finalMonth);
  }, []);

  const onSearchClick = async (e) => {
    setTableData([]);
    let valid = GlobalValidation(ref);
    if (valid) {
      {
        setValidationMessage(true);
      }
      return;
    }
    if (valid) {
      return;
    }

    // =================================for table=================================================
    const loaderTime = setTimeout(() => {
      setsearching(true);
    }, 2000);
    setSearch(false);

    abortController.current = new AbortController();

    const obj = {
      indTypes: "",
      FromDate: moment(formData.month).startOf("month").format("YYYY-MM-DD"),
      Duration: formData.Duration,
      UserId: loggedUserId,
    };

    const res = await axios({
      method: "post",
      url: baseUrl + `/revenuemetricsms/industry/postRevenueByIndustry`,
      signal: abortController.current.signal,

      data: obj,
    });
    let detail = res.data.tableData;
    let cols = res.data.columns?.replaceAll("'", "").split(",");
    setDetails(detail);
    setTableData(res.data);
    setColumns(cols);
    setValidationMessage(false);
    setsearching(false);
    clearTimeout(loaderTime);
    //=========================for first graph====================================
    if (res !== undefined && res.status === 200) {
      const response = await axios.get(
        baseUrl + `/revenuemetricsms/industry/postRevenueByTopIndustry`
      );
      let resp = response.data;
      console.log(response, "response");
      setGraphData(resp);
      handleChartData(resp);
      setVisible(true);

      // // ==========================for second graph======================================
      if (response != undefined && response.status === 200) {
        const cacheBuster = Math.random();
        const responseTwo = await axios.get(
          baseUrl +
          `/revenuemetricsms/industry/postRevenueByTopIndustryTypeGraph?cacheBuster=${cacheBuster}`
        );
        let rep = responseTwo.data;
        setGraphData2(rep);
        handleChartData2(rep);
        setVisible(true);
      }
    }

    // // ==========================for second graph======================================

    const responseThree = await axios({
      method: "get",
      url: baseUrl + `/revenuemetricsms/industry/postRevenueByTopIndustryType`,
    });
    let respons = responseThree.data;

    let hData = [];
    let bData = [];

    let Headerdata = [
      {
        SNo: "Rank",
        resource_name: "Customer",
        val: "Rec.Revenue($)",
        gm: "GM($)",
        gmperc: "GM(%)",
        rrperc: "RR(%)",
      },
    ];

    for (let i = 0; i < respons.length; i++) {
      respons[i]["SNo"] = i + 0;
      if (i == 0) {
        hData.push(respons[i]);
      } else {
        bData.push(respons[i]);
      }
    }

    let d1 = Headerdata.concat(bData);

    const updatedData = d1?.map((item) => {
      const key = isNaN(item.key) ? item.key : parseFloat(item.key);
      const val = isNaN(item.val) ? item.val : parseFloat(item.val);
      const gm = isNaN(item.gm) ? item.gm : parseFloat(item.gm);
      const gmperc = isNaN(item.gmperc) ? item.gmperc : parseFloat(item.gmperc);
      const rrperc = isNaN(item.rrperc) ? item.rrperc : parseFloat(item.rrperc);

      return {
        ...item,
        key: key !== undefined ? key.toLocaleString("en-US") : undefined,
        val: val !== undefined ? val.toLocaleString("en-US") : undefined,
        gm: gm !== undefined ? gm.toLocaleString("en-US") : undefined,
        gmperc:
          gmperc !== undefined
            ? gmperc == "GM(%)"
              ? gmperc
              : gmperc + "%"
            : undefined,
        rrperc:
          rrperc !== undefined
            ? rrperc == "RR(%)"
              ? rrperc
              : rrperc + "%"
            : undefined,
      };
    });

    setSecondTabData(updatedData);
    setSearch(true);
    setBodyData(bData);

    !valid && setVisible1(!visible1);
    visible1
      ? setCheveronIcon(FaChevronCircleUp)
      : setCheveronIcon(FaChevronCircleDown);
  };
  const RankAlign = (data) => {
    return (
      <div
        className="ellipsis text-center"
        style={{ maxWidth: "80px", backgroundColor: data.color }}
        data-toggle="tooltip"
        title={data.SNo}
      >
        {data.SNo}
      </div>
    );
  };

  const ResourceAlign = (data) => {
    return (
      <div
        style={{ backgroundColor: data.color }}
        className="ellipsis"
        data-toggle="tooltip"
        title={data.resource_name}
      >
        {data.resource_name}
      </div>
    );
  };
  const ValAlign = (data) => {
    return (
      <div
        className="ellipsis"
        style={{ textAlign: "right", backgroundColor: data.color }}
        data-toggle="tooltip"
        title={data.val}
      >
        {data.val}
      </div>
    );
  };
  const gmAlign = (data) => {
    return (
      <div
        className="ellipsis"
        style={{ textAlign: "right", backgroundColor: data.color }}
        data-toggle="tooltip"
        title={data.gm}
      >
        {data.gm}
      </div>
    );
  };
  const gmpercAlign = (data) => {
    console.log(
      data.color +
      ">>>>>" +
      `ellipsis revenueInd ${data.color == "#7cb5ec"
        ? "blue"
        : data.color == "#e4d354"
          ? "yellow"
          : data.color == "#90ed7d"
            ? "green"
            : data.color == "#f7a35c"
              ? "orange"
              : "brown-red"
      }`
    );

    return (
      <div
        className={`ellipsis revenueInd ${data.color == "#7cb5ec"
            ? "blue"
            : data.color == "#e4d354"
              ? "yellow"
              : data.color == "#90ed7d"
                ? "green"
                : data.color == "#f7a35c"
                  ? "orange"
                  : "brown-red"
          }`}
        style={{ textAlign: "right" }}
        data-toggle="tooltip"
        title={data.gmperc}
      >
        {data.gmperc}
      </div>
    );
  };
  const rrpercAlign = (data) => {
    return (
      <div
        className="ellipsis"
        style={{ textAlign: "right", backgroundColor: data.color }}
        data-toggle="tooltip"
        title={data.rrperc}
      >
        {data.rrperc}
      </div>
    );
  };

  const dynamicColumns = Object.keys(headerData)?.map((col, i) => {
    const headerAlignClassName =
      headerData[col] === "Customer"
        ? "customerHeaderAlign"
        : headerData[col] === "GM($)"
          ? "gmAlign"
          : "defaultHeaderAlign";

    return (
      <Column
        key={col}
        body={
          col === "SNo"
            ? RankAlign
            : (col === "resource_name" && ResourceAlign) ||
            (col === "val" && ValAlign) ||
            (col === "gm" && gmAlign) ||
            (col === "gmperc" && gmpercAlign) ||
            (col === "rrperc" && rrpercAlign)
        }
        title={headerData[col]}
        field={col}
        header={
          <span className={headerAlignClassName}>
            <span>{headerData[col]}</span>
          </span>
        }
      />
    );
  });

  // ----------------------------------------for second graph ----------------------------------------------------------------

  const handleChartData = (graphData) => {
    const chartData = {
      credits: {
        enabled: false,
      },
      chart: {
        type: "pie",
        options3d: {
          enabled: true,
          alpha: 45,
          beta: 0,
        },
      },
      lang: {
        thousandsSep: ",",
      },
      title: {
        text: "Top Industry By Rec.Rev.",
        align: "center",
      },
      tooltip: {
        pointFormat: "{point.resource_name}: <b>{point.percentage:.1f}%</b>",
      },
      plotOptions: {
        pie: {
          cursor: "pointer",
          shadow: true,
          startAngle: angle,
          cursor: "pointer",
          depth: 55,
          size: "100%",
          showInLegend: true,
        },
      },
      series: [
        {
          data: graphData?.map((item) => ({
            name: item.cat,
            y: parseInt(item.val),
            color: item.color,
            resource_name: item.resource_name,
          })),
          allowPointSelect: true,
          cursor: "pointer",
          dataLabels: {
            enabled: true,
            distance: 10,
            formatter: function () {
              return `<b>${this.point.name}</b>:<br/>$${Highcharts.numberFormat(
                this.point.y,
                0,
                ",",
                ","
              )} (${Math.round(this.point.percentage * 10) / 10})%`;
            },
          },
        },
      ],
    };

    setChartDataProp(chartData);
  };
  // ----------------------------------------------------------------------------------------------------------
  // --------------------------------for first graph -------------------------------------------------------------------

  const handleChartData2 = (graphData2) => {
    let top1 = null;
    let top2to5 = null;
    let top6to10 = null;
    let top11to20 = null;
    let top21to40 = null;
    let rest = null;

    graphData2.map((d) => {
      if (d.lvl != "-1") {
        graphData2.push(d.cat);

        switch (d.cat) {
          case "Top 1":
            top1 = parseInt(d.val);
            break;
          case "Top 2-5":
            top2to5 = parseInt(d.val);
            break;
          case "Top 6-10":
            top6to10 = parseInt(d.val);
            break;
          case "Top 11-20":
            top11to20 = parseInt(d.val);
            break;
          case "Top 21-40":
            top21to40 = parseInt(d.val);
            break;
          case "Rest":
            rest = parseInt(d.val);
            break;
          default:
        }
      }
    });

    const chartData2 = {
      credits: {
        enabled: false,
      },
      chart: {
        plotBackgroundColor: null,
        plotBorderWidth: null,
        plotShadow: false,
        type: "pie",
        options3d: {
          enabled: true,
          alpha: 45,
          beta: 0,
        },
      },
      title: {
        text: "Top Customers By Rec.Rev.",
      },
      tooltip: {
        pointFormat: "{series.name}: <b>{point.percentage:.1f}%</b>",
      },
      xAxis: {
        categories: [
          "Top 1",
          "Top 2-5",
          "Top 6-10",
          "Top 11-20",
          "Top 21-40",
          "Rest",
        ],
      },
      accessibility: {
        point: {
          valueSuffix: "%",
        },
      },
      plotOptions: {
        pie: {
          allowPointSelect: true,
          cursor: "pointer",
          shadow: true,
          startAngle: angle,
          cursor: "pointer",
          depth: 55,
          size: "100%",
          showInLegend: true,
        },
      },
      series: [
        {
          colorByPoint: true,
          data: [
            {
              name: "Top 1",
              y: top1,
              selected: true,
              dataLabels: {
                enabled: true,
                distance: 10,
                formatter: function () {
                  return `<b>${this.point.name
                    }</b>:<br/>$${Highcharts.numberFormat(
                      this.point.y,
                      0,
                      ",",
                      ","
                    )} (${Math.round(this.point.percentage * 10) / 10})%`;
                },
              },
            },
            {
              name: "Top 2-5",
              color: "#e4d354",
              y: top2to5,
              dataLabels: {
                enabled: true,
                distance: 10,
                formatter: function () {
                  return `<b>${this.point.name
                    }</b>:<br/>$${Highcharts.numberFormat(
                      this.point.y,
                      0,
                      ",",
                      ","
                    )} (${Math.round(this.point.percentage * 10) / 10})%`;
                },
              },
            },
            {
              name: "Top 6-10",
              y: top6to10,
              dataLabels: {
                enabled: true,
                distance: 10,
                formatter: function () {
                  return `<b>${this.point.name
                    }</b>:<br/>$${Highcharts.numberFormat(
                      this.point.y,
                      0,
                      ",",
                      ","
                    )} (${Math.round(this.point.percentage * 10) / 10})%`;
                },
              },
            },
            {
              name: "Top 11-20",
              y: top11to20,
              dataLabels: {
                enabled: true,
                distance: 10,
                formatter: function () {
                  return `<b>${this.point.name
                    }</b>:<br/>$${Highcharts.numberFormat(
                      this.point.y,
                      0,
                      ",",
                      ","
                    )} (${Math.round(this.point.percentage * 10) / 10})%`;
                },
              },
            },
            {
              name: "Top 21-40",
              color: "#e5a4a4",
              y: top21to40,
              dataLabels: {
                enabled: true,
                distance: 10,
                formatter: function () {
                  return `<b>${this.point.name
                    }</b>:<br/>$${Highcharts.numberFormat(
                      this.point.y,
                      0,
                      ",",
                      ","
                    )} (${Math.round(this.point.percentage * 10) / 10})%`;
                },
              },
            },
            {
              name: "Rest",
              y: rest,
              dataLabels: {
                enabled: true,
                distance: 10,
                formatter: function () {
                  return `<b>${this.point.name
                    }</b>:<br/>$${Highcharts.numberFormat(
                      this.point.y,
                      0,
                      ",",
                      ","
                    )} (${Math.round(this.point.percentage * 10) / 10})%`;
                },
              },
            },
          ],
        },
      ],
    };

    setChartDataProp2(chartData2);
  };
  const handleAbort = () => {
    abortController.current && abortController.current.abort();
    setsearching(false);
  };

  const exportExcel = () => {
    import("xlsx").then((xlsx) => {
      const columnsToExclude = [
        "id",
        "industryId",
        "industry",
        "customerId",
        "lvl",
        "keyAttr",
        "parentAttr",
        "total_rr_sort",
      ];

      const filteredColumns = columns.filter(
        (col) => !columnsToExclude.includes(col)
      );

      const wantedValues = details
        .filter((item) => item.id !== -2)
        .map((item) => {
          const obj = {};
          filteredColumns.forEach((col) => {
            const value = item[col];
            if (typeof value === "string") {
              const [extractedValue, ,] = value.split("^&");
              obj[col] = extractedValue;
            } else {
              obj[col] = value;
            }
          });
          return obj;
        });

      const rows = wantedValues.map((item) => {
        const row = [];
        filteredColumns.forEach((col) => {
          row.push(item[col]);
        });
        return row;
      });

      const worksheet = xlsx.utils.aoa_to_sheet([...rows]);
      const workbook = { Sheets: { data: worksheet }, SheetNames: ["data"] };
      const excelBuffer = xlsx.write(workbook, {
        bookType: "xlsx",
        type: "array",
      });

      saveAsExcelFile(excelBuffer, "RevenueByIndustry");
    });
  };

  const saveAsExcelFile = (buffer, fileName) => {
    import("file-saver").then((module) => {
      if (module && module.default) {
        let EXCEL_TYPE =
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
        let EXCEL_EXTENSION = ".xlsx";
        const data = new Blob([buffer], { type: EXCEL_TYPE });
        module.default.saveAs(data, fileName + EXCEL_EXTENSION);
      }
    });
  };

  const HelpPDFName = "Revenue By Industry.pdf";
  const Headername = "Revenue By Industry Help";
  return (
    <div>
      {validationmessage ? (
        <div className="statusMsg error">
          {" "}
          <AiFillWarning /> Please select valid values for highlighted fields
        </div>
      ) : (
        ""
      )}
      <div className="col-md-12">
        <div className="pageTitle">
          <div className="childOne"></div>
          <div className="childTwo">
            <h2> Recognized Revenue By Industry</h2>
          </div>

          <div className="childThree toggleBtns">
            <button
              className="searchFilterButton btn btn-primary"
              onClick={() => {
                setVisible(!visible);

                visible
                  ? setCheveronIcon(FaChevronCircleUp)
                  : setCheveronIcon(FaChevronCircleDown);
              }}
            >
              Search Filters
              <span className="serchFilterText">{cheveronIcon}</span>
            </button>
            <GlobalHelp pdfname={HelpPDFName} name={Headername} />
          </div>
        </div>
      </div>

      <div className="group mb-3 customCard  mt-2">
        <div className="col-md-12 collapseHeader"></div>
        <CCollapse visible={!visible1}>
          <div className="group-content row">
            <div className=" col-md-4 mb-2">
              <div className="form-group row">
                <label className="col-4" htmlFor="Duration">
                  Month&nbsp;
                  <span className="col-1 p-0 error-text">*</span>
                </label>
                <span className="col-1 p-0">:</span>
                <div className="col-6 industryDatePicker">
                  <DatePicker
                    id="month"
                    selected={month}
                    onChange={(e) => {
                      setCount((prev) => prev + 1);
                      const elementToChange =
                        document.getElementById("Duration");
                      elementToChange.value = 0;
                      calculateDuration(e);
                      setFormData((prev) => ({
                        ...prev,
                        ["month"]: moment(e).format("yyyy-MM-DD"),
                      }));

                      setMonth(e);
                    }}
                    maxDate={moment().subtract(1, "months")._d}
                    minDate={
                      moment().subtract(10, "years").subtract(1, "months")._d
                    }
                    dateFormat="MMM-yyyy"
                    showMonthYearPicker
                  />
                </div>
              </div>
            </div>
            <div className=" col-md-4 mb-2">
              <div className="form-group row">
                <label className="col-4" htmlFor="Duration">
                  Duration&nbsp;
                  <span className="col-1 p-0 error-text">*</span>
                </label>
                <span className="col-1">:</span>
                <div className="col-6">
                  <select
                    className="text cancel"
                    id="Duration"
                    name="Duration"
                    onChange={(e) => {
                      const { value, id } = e.target;

                      setFormData({ ...formData, [id]: value });
                    }}
                    ref={(ele) => {
                      ref.current[formData.Duration == "" ? 0 : ""] = ele;
                    }}
                  >
                    <option value=""> &lt;&lt;Please Select&gt;&gt;</option>
                    {duration.map((d) => (
                      <option
                        selected={
                          formData.Duration == d && count == 0 ? true : false
                        }
                        value={d}
                      >
                        {d}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            <div className="col-md-12 col-sm-12 col-xs-12 btn-container center my-3 ">
              <button
                type="submit"
                className="btn btn-primary"
                onClick={() => {
                  onSearchClick();
                }}
              >
                <FaSearch /> Search
              </button>
            </div>
          </div>
        </CCollapse>
      </div>

      {searching ? <Loader handleAbort={handleAbort} /> : ""}

      {search == true ? (
        <div className="mb-2" align=" right ">
          <RiFileExcel2Line
            size="1.5em"
            title="Export to Excel"
            style={{ color: "green" }}
            cursor="pointer"
            onClick={exportExcel}
          />
          <br />
        </div>
      ) : (
        ""
      )}
      <RevenueIndustryCollapsibleTable
        data={tableData}
        expandedCols={[]}
        colExpandState={[]}
      />

      <div className="col-12 row">&nbsp;</div>

      {/***************************************Chart**************************************** */}
      {visible && search ? (
        <>
          <div className="col-md-12 no-padding row d-flex justify-content-between ms-1">
            <div className="col-md-6 customCard card graph ">
              <HighchartsReact
                highcharts={Highcharts}
                options={chartDataProp2}
              />
            </div>

            <div className="col-md-6 customCard card graph ">
              <HighchartsReact
                highcharts={Highcharts}
                options={chartDataProp}
              />
            </div>
          </div>
          {/***************************************Chart**************************************** */}
        </>
      ) : (
        ""
      )}
      {search && (
        <div className="col-12 row ms-1">
          <div className="col-6 topCust mt-2">
            <RevenueByIndustrySecondTable
              data={secondTabData}
              dynamicColumns={dynamicColumns}
              headerData={headerData}
              setHeaderData={setHeaderData}
              rows={20}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default RevenueIndustry;
