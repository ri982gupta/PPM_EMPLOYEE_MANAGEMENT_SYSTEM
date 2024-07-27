import { chart } from "highcharts";
import React from "react";
import TargetCharts from "./TargetCharts";
// import histroricalTrendData from "./histroricalTrendData.json"
import { useEffect } from "react";
// import Highcharts from "highcharts/highstock";

import { useState } from "react";

function HistoricalTrend(props) {
  const { historicalTrendData, scoreCardDataPayload } = props;
  const [targetsData, setTargetsData] = useState([]);
  const [practRecRev, setPractRecRev] = useState([]);
  const [locRecRev, setLocRecRev] = useState([]);
  const [custCatRecRev, setCustCatRecRev] = useState([]);
  const [custContRecRev, setCustContRecRev] = useState([]);
  const [locSUBKRecRev, setLocSUBKRecRev] = useState([]);
  const [locFTERecRev, setLocFTERecRev] = useState([]);
  const [displayTableData, setDisplayTableData] = useState(null);

  useEffect(() => {
    console.log("in line 11------");
    console.log(historicalTrendData.targets);
    console.log(historicalTrendData);
    handleChartsData();
    handleTableData();
    // customerRecRevTable(historicalTrendData.custRecRevTable);
  }, [historicalTrendData]);

  const handleChartsData = () => {
    let targetTotalTargets = [];
    let targetTotalRealised = [];
    let targetServiceTarget = [];
    let targetServiceRealised = [];
    let targetSoftwareTarget = [];
    let targetSoftwareRealised = [];
    let targetRangeDescription = [];
    let xAxis1 = [];

    console.log("in line 28-------");
    console.log(historicalTrendData.targets);

    historicalTrendData.targets?.map((d) => {
      console.log(
        d.qrtr,
        d.qrtr.substring(0, 4) + "-" + d.qrtr.substring(5),
        "qrtr"
      );
      targetRangeDescription.push(d.qrtr);
      switch (d.category) {
        case "Total":
          targetTotalTargets.push(parseInt(d.target));
          targetTotalRealised.push(parseInt(d.realised));
          xAxis1.push(d.qrtr.substring(0, 4) + "-" + d.qrtr.substring(5));
          break;
        case "Service":
          targetServiceTarget.push(parseInt(d.target));
          targetServiceRealised.push(parseInt(d.realised));
          xAxis1.push(d.qrtr.substring(0, 4) + "-" + d.qrtr.substring(5));

          break;
        case "Software":
          targetSoftwareTarget.push(parseInt(d.target));
          targetSoftwareRealised.push(parseInt(d.realised));
          xAxis1.push(d.qrtr.substring(0, 4) + "-" + d.qrtr.substring(5));

          break;
        default:
      }
    });
    console.log(xAxis1, "xaxis");

    const chartData1 = {
      title: {
        text: "Target,Realised/Closed By Quarter Trend",
      },

      // subtitle: {
      //     text: 'Source: <a href="https://irecusa.org/programs/solar-jobs-census/" target="_blank">IREC</a>'
      // },

      yAxis: {
        tickInterval: 2000000,
        title: {
          text: "Number of Employees",
        },
      },
      tooltip: {
        formatter: function () {
          return (
            "<b>" +
            this.x +
            "</b><br/>" +
            this.series.name +
            ": " +
            this.y?.toLocaleString("en-US") +
            "<br/>"
          );
        },
      },
      // xAxis: {
      //   type: "area",
      //   categories: xAxis1,
      //   crosshair: true,
      //   title: {
      //     text: "Quater",
      //   },
      //   accessibility: {
      //     rangeDescription: xAxis1.toString(),
      //   },
      // },
      xAxis: {
        type: "line", // Change type to line
        categories: xAxis1,
        crosshair: true,
        title: {
          text: "Quarter",
        },
        accessibility: {
          rangeDescription: xAxis1.toString(),
        },
      },

      legend: {
        align: "center",
        verticalAlign: "bottom",
        layout: "horizontal",
      },

      plotOptions: {
        series: {
          label: {
            connectorAllowed: false,
          },
        },
      },

      series: [
        {
          name: "Total Targets",
          data: targetTotalTargets,
          type: "area",
        },
        {
          name: "Total Realised",
          data: targetTotalRealised,
          type: "area",
        },
        {
          name: "Service Target",
          data: targetServiceTarget,
          type: "area",
        },
        {
          name: "Service Realised",
          data: targetServiceRealised,
          type: "area",
        },
        {
          name: "Software Target",
          data: targetSoftwareTarget,
          type: "area",
        },
        {
          name: "Software Realised",
          data: targetSoftwareRealised,
          type: "area",
        },
      ],

      responsive: {
        rules: [
          {
            condition: {
              maxWidth: 500,
            },
            chartOptions: {
              legend: {
                layout: "horizontal",
                align: "center",
                verticalAlign: "bottom",
              },
            },
          },
        ],
      },
    };
    setTargetsData(chartData1);

    let pracRecTotalTargets = [];
    let pracRecTotalRealised = [];
    let pracRecDACSTarget = [];
    let pracRecDACSRealised = [];
    let pracRecIMATarget = [];
    let pracRecIMARealised = [];
    let pracRecQATATargets = [];
    let pracRecQATARealised = [];
    let pracRecProlificsProductsTargets = [];
    let pracRecProlificsProductsRealised = [];
    let pracRecRangeDescription = [];
    let xAxis2 = [];
    console.log("in line 136-------");
    console.log(historicalTrendData.practRecRev);

    historicalTrendData.practRecRev?.map((d) => {
      pracRecRangeDescription.push(d.qrtr);
      switch (d.category) {
        case "Total":
          pracRecTotalTargets.push(parseInt(d.target));
          pracRecTotalRealised.push(parseInt(d.realised));
          xAxis2.push(d.qrtr.substring(0, 4) + "-" + d.qrtr.substring(5));

          break;
        case "DACS":
          pracRecDACSTarget.push(parseInt(d.target));
          pracRecDACSRealised.push(parseInt(d.realised));
          xAxis2.push(d.qrtr.substring(0, 4) + "-" + d.qrtr.substring(5));

          break;
        case "IM&A":
          pracRecIMATarget.push(parseInt(d.target));
          pracRecIMARealised.push(parseInt(d.realised));
          xAxis2.push(d.qrtr.substring(0, 4) + "-" + d.qrtr.substring(5));

          break;
        case "QA&TA":
          pracRecQATATargets.push(parseInt(d.target));
          pracRecQATARealised.push(parseInt(d.realised));
          xAxis2.push(d.qrtr.substring(0, 4) + "-" + d.qrtr.substring(5));

          break;
        case "Prolifics Products":
          pracRecProlificsProductsTargets.push(parseInt(d.target));
          pracRecProlificsProductsRealised.push(parseInt(d.realised));
          xAxis2.push(d.qrtr.substring(0, 4) + "-" + d.qrtr.substring(5));

          break;
        default:
      }
    });
    console.log(xAxis2, "xaxiz2");
    const chartData2 = {
      title: {
        text: "Target,Realised/Closed Quarter Trend By Practice",
      },

      // subtitle: {
      //     text: 'Source: <a href="https://irecusa.org/programs/solar-jobs-census/" target="_blank">IREC</a>'
      // },

      yAxis: {
        tickInterval: 2000000,
        title: {
          text: "Number of Employees",
        },
      },
      tooltip: {
        formatter: function () {
          return (
            "<b>" +
            this.x +
            "</b><br/>" +
            this.series.name +
            ": " +
            this.y?.toLocaleString("en-US") +
            "<br/>"
          );
        },
      },

      xAxis: {
        type: "category",
        categories: xAxis2,
        crosshair: true,
        title: {
          text: "Quater",
        },

        accessibility: {
          rangeDescription: xAxis2.toString(),
        },
      },

      legend: {
        align: "center",
        verticalAlign: "bottom",
        layout: "horizontal",
      },

      plotOptions: {
        series: {
          label: {
            connectorAllowed: false,
          },
        },
      },

      series: [
        {
          name: "Total Targets",
          data: pracRecTotalTargets,
          type: "spline",
        },
        {
          name: "Total Realised",
          data: pracRecTotalRealised,
          type: "spline",
        },
        {
          name: "DACS Target",
          data: pracRecDACSTarget,
          type: "spline",
        },
        {
          name: "DACS Realised",
          data: pracRecDACSRealised,
          type: "spline",
        },
        {
          name: "IM&A Target",
          data: pracRecIMATarget,
          type: "spline",
        },
        {
          name: "IM&A Realised",
          data: pracRecIMARealised,
          type: "spline",
        },
        {
          name: "QA&TA Target",
          data: pracRecQATATargets,
          type: "spline",
        },
        {
          name: "QA&TA Realised",
          data: pracRecQATARealised,
          type: "spline",
        },
        {
          name: "Prolifics Products Target",
          data: pracRecProlificsProductsTargets,
          type: "spline",
        },
        {
          name: "Prolifics Products Realised",
          data: pracRecProlificsProductsRealised,
          type: "spline",
        },
      ],

      responsive: {
        rules: [
          {
            condition: {
              maxWidth: 500,
            },
            chartOptions: {
              legend: {
                layout: "horizontal",
                align: "center",
                verticalAlign: "bottom",
              },
            },
          },
        ],
      },
    };
    setPractRecRev(chartData2);

    let locRecrevTotalTargets = [];
    let locRecrevTotalRealised = [];
    let locRecrevUKTarget = [];
    let locRecrevUKRealised = [];
    let locRecrevUSTarget = [];
    let locRecrevUSRealised = [];
    let locRecrevIndiaTargets = [];
    let locRecrevIndiaRealised = [];
    let locRecrevGermanyTargets = [];
    let locRecrevGermanyRealised = [];
    let locRecrevCanadaTargets = [];
    let locRecrevCanadaRealised = [];
    let locRecrevRangeDescription = [];
    let xAxis3 = [];
    console.log("in line 274------");
    console.log(historicalTrendData.locRecRev);

    historicalTrendData.locRecRev?.map((d) => {
      locRecrevRangeDescription.push(d.qrtr);
      switch (d.category) {
        case "Total":
          locRecrevTotalTargets.push(parseInt(d.target));
          locRecrevTotalRealised.push(parseInt(d.realised));
          xAxis3.push(d.qrtr.substring(0, 4) + "-" + d.qrtr.substring(5));

          break;
        case "UK":
          locRecrevUKTarget.push(parseInt(d.target));
          locRecrevUKRealised.push(parseInt(d.realised));
          xAxis3.push(d.qrtr.substring(0, 4) + "-" + d.qrtr.substring(5));

          break;
        case "US":
          locRecrevUSTarget.push(parseInt(d.target));
          locRecrevUSRealised.push(parseInt(d.realised));
          xAxis3.push(d.qrtr.substring(0, 4) + "-" + d.qrtr.substring(5));

          break;
        case "India":
          locRecrevIndiaTargets.push(parseInt(d.target));
          locRecrevIndiaRealised.push(parseInt(d.realised));
          xAxis3.push(d.qrtr.substring(0, 4) + "-" + d.qrtr.substring(5));

          break;
        case "Germany":
          locRecrevGermanyTargets.push(parseInt(d.target));
          locRecrevGermanyRealised.push(parseInt(d.realised));
          xAxis3.push(d.qrtr.substring(0, 4) + "-" + d.qrtr.substring(5));

          break;
        case "Canada":
          locRecrevCanadaTargets.push(parseInt(d.target));
          locRecrevCanadaRealised.push(parseInt(d.realised));
          xAxis3.push(d.qrtr.substring(0, 4) + "-" + d.qrtr.substring(5));

          break;
        default:
      }
    });

    const chartData3 = {
      title: {
        text: "Target,Realised/Closed Quarter Trend By Country",
      },

      // subtitle: {
      //     text: 'Source: <a href="https://irecusa.org/programs/solar-jobs-census/" target="_blank">IREC</a>'
      // },

      yAxis: {
        tickInterval: 2000000,
        title: {
          text: "Number of Employees",
        },
      },

      tooltip: {
        formatter: function () {
          return (
            "<b>" +
            this.x +
            "</b><br/>" +
            this.series.name +
            ": " +
            this.y?.toLocaleString("en-US") +
            "<br/>"
          );
        },
      },
      xAxis: {
        type: "category",
        categories: xAxis3,
        crosshair: true,
        title: {
          text: "Quater",
        },
        accessibility: {
          rangeDescription: xAxis3.toString(),
        },
      },

      legend: {
        align: "center",
        verticalAlign: "bottom",
        layout: "horizontal",
      },

      plotOptions: {
        series: {
          label: {
            connectorAllowed: false,
          },
        },
      },

      series: [
        {
          name: "Total Targets",
          data: locRecrevTotalTargets,
          type: "bar",
        },
        {
          name: "Total Realised",
          data: locRecrevTotalRealised,
          type: "bar",
        },
        {
          name: "UK Target",
          data: locRecrevUKTarget,
          type: "bar",
        },
        {
          name: "UK Realised",
          data: locRecrevUKRealised,
          type: "bar",
        },
        {
          name: "US Target",
          data: locRecrevUSTarget,
          type: "bar",
        },
        {
          name: "US Realised",
          data: locRecrevUSRealised,
          type: "bar",
        },
        {
          name: "India Target",
          data: locRecrevIndiaTargets,
          type: "bar",
        },
        {
          name: "India Realised",
          data: locRecrevIndiaRealised,
          type: "bar",
        },
        {
          name: "Germany Target",
          data: locRecrevGermanyTargets,
          type: "bar",
        },
        {
          name: "Germany Realised",
          data: locRecrevGermanyRealised,
          type: "bar",
        },
        {
          name: "Canada Target",
          data: locRecrevCanadaTargets,
          type: "bar",
        },
        {
          name: "Canada Realised",
          data: locRecrevCanadaRealised,
          type: "bar",
        },
      ],

      responsive: {
        rules: [
          {
            condition: {
              maxWidth: 500,
            },
            chartOptions: {
              legend: {
                layout: "horizontal",
                align: "center",
                verticalAlign: "bottom",
              },
            },
          },
        ],
      },
    };
    setLocRecRev(chartData3);

    //////////////

    let custCatRecRevExistingnExistingRealised = [];
    let custCatRecRevExistingnNewRealised = [];
    let custCatRecRevNewnNewRealised = [];
    let custCatRecRevRangeDescription = [];
    let xAxis4 = [];
    console.log("in line 274------");
    console.log(historicalTrendData.custCatRecRev);

    historicalTrendData.custCatRecRev?.map((d) => {
      custCatRecRevRangeDescription.push(d.qrtr);
      switch (d.category) {
        case "Existing & Existing":
          // custCatRecRevExistingnExistingRealised.push(parseInt(d.target));
          custCatRecRevExistingnExistingRealised.push(parseInt(d.realised));
          xAxis4.push(d.qrtr.substring(0, 4) + "-" + d.qrtr.substring(5));

          break;
        case "Existing & New":
          // custCatRecRevExistingnNewRealised.push(parseInt(d.target));
          custCatRecRevExistingnNewRealised.push(parseInt(d.realised));
          xAxis4.push(d.qrtr.substring(0, 4) + "-" + d.qrtr.substring(5));

          break;
        case "New & New":
          // locRecrevUSTarget.push(parseInt(d.target));
          custCatRecRevNewnNewRealised.push(parseInt(d.realised));
          xAxis4.push(d.qrtr.substring(0, 4) + "-" + d.qrtr.substring(5));

          break;
        default:
      }
    });

    const chartData4 = {
      title: {
        text: "Customer Realised Revenue Quarter Trend By Category",
      },

      // subtitle: {
      //     text: 'Source: <a href="https://irecusa.org/programs/solar-jobs-census/" target="_blank">IREC</a>'
      // },

      yAxis: {
        tickInterval: 2000000,
        title: {
          text: "Realised",
        },
      },
      tooltip: {
        formatter: function () {
          return (
            "<b>" +
            this.x +
            "</b><br/>" +
            this.series.name +
            ": " +
            this.y?.toLocaleString("en-US") +
            "<br/>"
          );
        },
      },
      xAxis: {
        type: "category",
        categories: xAxis4,
        crosshair: true,
        title: {
          text: "Quater",
        },
        accessibility: {
          rangeDescription: xAxis4.toString(),
        },
      },

      legend: {
        align: "center",
        verticalAlign: "bottom",
        layout: "horizontal",
      },

      plotOptions: {
        series: {
          label: {
            connectorAllowed: false,
          },
        },
        type: "bubble",
      },

      series: [
        {
          name: "Existing & Existing Realised",
          data: custCatRecRevExistingnExistingRealised,
        },
        {
          name: "Existing & New Realised",
          data: custCatRecRevExistingnNewRealised,
        },
        {
          name: "New & New Realised",
          data: custCatRecRevNewnNewRealised,
        },
      ],

      responsive: {
        rules: [
          {
            condition: {
              maxWidth: 500,
            },
            chartOptions: {
              legend: {
                layout: "horizontal",
                align: "center",
                verticalAlign: "bottom",
              },
            },
          },
        ],
      },
    };
    setCustCatRecRev(chartData4);

    let custContRecRevBMSRealised = [];
    let custContRecRevBNERealised = [];
    let custContRecRevBSARealised = [];
    let custContRecRevBTMRealised = [];
    let custContRecRevFPRealised = [];
    let custContRecRevRangeDescription = [];
    let xAxis5 = [];
    console.log("in line 274------");
    console.log(historicalTrendData.custContRecRev);

    historicalTrendData.custContRecRev?.map((d) => {
      custContRecRevRangeDescription.push(d.qrtr);
      switch (d.category) {
        case "BMS":
          // custCatRecRevExistingnExistingRealised.push(parseInt(d.target));
          custContRecRevBMSRealised.push(parseInt(d.realised));
          xAxis5.push(d.qrtr.substring(0, 4) + "-" + d.qrtr.substring(5));

          break;
        case "BNE":
          // custCatRecRevExistingnNewRealised.push(parseInt(d.target));
          custContRecRevBNERealised.push(parseInt(d.realised));
          xAxis5.push(d.qrtr.substring(0, 4) + "-" + d.qrtr.substring(5));

          break;
        case "BSA":
          // locRecrevUSTarget.push(parseInt(d.target));
          custContRecRevBSARealised.push(parseInt(d.realised));
          xAxis5.push(d.qrtr.substring(0, 4) + "-" + d.qrtr.substring(5));

          break;
        case "BTM":
          // locRecrevUSTarget.push(parseInt(d.target));
          custContRecRevBTMRealised.push(parseInt(d.realised));
          xAxis5.push(d.qrtr.substring(0, 4) + "-" + d.qrtr.substring(5));

          break;
        case "FP":
          // locRecrevUSTarget.push(parseInt(d.target));
          custContRecRevFPRealised.push(parseInt(d.realised));
          xAxis5.push(d.qrtr.substring(0, 4) + "-" + d.qrtr.substring(5));

          break;
        default:
      }
    });

    const chartData5 = {
      title: {
        text: "Customer Realised Revenue Quarter Trend By ContractTerms",
      },

      // subtitle: {
      //     text: 'Source: <a href="https://irecusa.org/programs/solar-jobs-census/" target="_blank">IREC</a>'
      // },

      yAxis: {
        tickInterval: 2000000,
        title: {
          text: "Realised",
        },
      },
      tooltip: {
        formatter: function () {
          return (
            "<b>" +
            this.x +
            "</b><br/>" +
            this.series.name +
            ": " +
            this.y?.toLocaleString("en-US") +
            "<br/>"
          );
        },
      },

      xAxis: {
        type: "category",
        categories: xAxis5,
        crosshair: true,
        title: {
          text: "Quater",
        },
        accessibility: {
          rangeDescription: xAxis5.toString(),
        },
      },

      legend: {
        align: "center",
        verticalAlign: "bottom",
        layout: "horizontal",
      },

      plotOptions: {
        series: {
          label: {
            connectorAllowed: false,
          },
        },
      },

      series: [
        {
          name: "BMS Realised",
          data: custContRecRevBMSRealised,
        },
        {
          name: "BNE Realised",
          data: custContRecRevBNERealised,
        },
        {
          name: "BSA Realised",
          data: custContRecRevBSARealised,
        },
        {
          name: "BTM Realised",
          data: custContRecRevBTMRealised,
        },
        {
          name: "FP Realised",
          data: custContRecRevFPRealised,
        },
      ],

      responsive: {
        rules: [
          {
            condition: {
              maxWidth: 500,
            },
            chartOptions: {
              legend: {
                layout: "horizontal",
                align: "center",
                verticalAlign: "bottom",
              },
            },
          },
        ],
      },
    };
    setCustContRecRev(chartData5);

    ////

    let locFTERecRevTotalPlanned = [];
    let locFTERecRevTotalRealised = [];
    let locFTERecRevUKPlanned = [];
    let locFTERecRevUKRealised = [];
    let locFTERecRevUSPlanned = [];
    let locFTERecRevUSRealised = [];
    let locFTERecRevIndiaPlanned = [];
    let locFTERecRevIndiaRealised = [];
    let locFTERecRevGermanyPlanned = [];
    let locFTERecRevGermanyRealised = [];
    let locFTERecRevCanadaPlanned = [];
    let locFTERecRevCanadaRealised = [];
    let locFTERecRevRangeDescription = [];
    let xAxis6 = [];
    console.log("in line 136-------");
    console.log(historicalTrendData.locFTERecRev);

    historicalTrendData.locFTERecRev?.map((d) => {
      locFTERecRevRangeDescription.push(d.qrtr);
      switch (d.category) {
        case "Total":
          locFTERecRevTotalPlanned.push(parseInt(d.planned));
          locFTERecRevTotalRealised.push(parseInt(d.realised));
          xAxis6.push(d.qrtr.substring(0, 4) + "-" + d.qrtr.substring(5));

          break;
        case "UK":
          locFTERecRevUKPlanned.push(parseInt(d.planned));
          locFTERecRevUKRealised.push(parseInt(d.realised));
          xAxis6.push(d.qrtr.substring(0, 4) + "-" + d.qrtr.substring(5));

          break;
        case "US":
          locFTERecRevUSPlanned.push(parseInt(d.planned));
          locFTERecRevUSRealised.push(parseInt(d.realised));
          xAxis6.push(d.qrtr.substring(0, 4) + "-" + d.qrtr.substring(5));

          break;
        case "India":
          locFTERecRevIndiaPlanned.push(parseInt(d.planned));
          locFTERecRevIndiaRealised.push(parseInt(d.realised));
          xAxis6.push(d.qrtr.substring(0, 4) + "-" + d.qrtr.substring(5));

          break;
        case "Germany":
          locFTERecRevGermanyPlanned.push(parseInt(d.planned));
          locFTERecRevGermanyRealised.push(parseInt(d.realised));
          xAxis6.push(d.qrtr.substring(0, 4) + "-" + d.qrtr.substring(5));

          break;
        case "Canada":
          locFTERecRevCanadaPlanned.push(parseInt(d.planned));
          locFTERecRevCanadaRealised.push(parseInt(d.realised));
          xAxis6.push(d.qrtr.substring(0, 4) + "-" + d.qrtr.substring(5));

          break;
        default:
      }
    });

    const chartData6 = {
      title: {
        text: "FTE Planned, Realised/Closed Quarter Trend By Country",
      },

      // subtitle: {
      //     text: 'Source: <a href="https://irecusa.org/programs/solar-jobs-census/" target="_blank">IREC</a>'
      // },

      yAxis: {
        tickInterval: 2000000,
        title: {
          text: "Number of Employees",
        },
      },
      tooltip: {
        formatter: function () {
          return (
            "<b>" +
            this.x +
            "</b><br/>" +
            this.series.name +
            ": " +
            this.y?.toLocaleString("en-US") +
            "<br/>"
          );
        },
      },

      xAxis: {
        type: "category",
        categories: xAxis6,
        crosshair: true,
        title: {
          text: "Quater",
        },
        accessibility: {
          rangeDescription: xAxis6.toString(),
        },
      },

      legend: {
        align: "center",
        verticalAlign: "bottom",
        layout: "horizontal",
      },

      plotOptions: {
        series: {
          label: {
            connectorAllowed: false,
          },
        },
      },

      series: [
        {
          name: "Total Planned",
          data: locFTERecRevTotalPlanned,
        },
        {
          name: "Total Realised",
          data: locFTERecRevTotalRealised,
        },
        {
          name: "UK Planned",
          data: locFTERecRevUKPlanned,
        },
        {
          name: "UK Realised",
          data: locFTERecRevUKRealised,
        },
        {
          name: " US Planned",
          data: locFTERecRevUSPlanned,
        },
        {
          name: "US Realised",
          data: locFTERecRevUSRealised,
        },
        {
          name: "India Planned",
          data: locFTERecRevIndiaPlanned,
        },
        {
          name: " India Realised",
          data: locFTERecRevIndiaRealised,
        },
        {
          name: "Germany Planned",
          data: locFTERecRevGermanyPlanned,
        },
        {
          name: "Germany Realised",
          data: locFTERecRevGermanyRealised,
        },
        {
          name: "Canada Planned",
          data: locFTERecRevCanadaPlanned,
        },
        {
          name: "Canada Realised",
          data: locFTERecRevCanadaRealised,
        },
      ],

      responsive: {
        rules: [
          {
            condition: {
              maxWidth: 500,
            },
            chartOptions: {
              legend: {
                layout: "horizontal",
                align: "center",
                verticalAlign: "bottom",
              },
            },
          },
        ],
      },
    };
    setLocFTERecRev(chartData6);

    /////

    let locSUBKRecRevTotalPlanned = [];
    let locSUBKRecRevTotalRealised = [];
    let locSUBKRecRevUKPlanned = [];
    let locSUBKRecRevUKRealised = [];
    let locSUBKRecRevUSPlanned = [];
    let locSUBKRecRevUSRealised = [];
    let locSUBKRecRevIndiaPlanned = [];
    let locSUBKRecRevIndiaRealised = [];
    let locSUBKRecRevGermanyPlanned = [];
    let locSUBKRecRevGermanyRealised = [];
    let locSUBKRecRevCanadaPlanned = [];
    let locSUBKRecRevCanadaRealised = [];
    let locSUBKRecRevRangeDescription = [];
    let xAxis7 = [];
    console.log("in line 136-------");
    console.log(historicalTrendData.locSUBKRecRev);

    historicalTrendData.locSUBKRecRev?.map((d) => {
      locSUBKRecRevRangeDescription.push(d.qrtr);
      switch (d.category) {
        case "Total":
          locSUBKRecRevTotalPlanned.push(parseInt(d.planned));
          locSUBKRecRevTotalRealised.push(parseInt(d.realised));
          xAxis7.push(d.qrtr.substring(0, 4) + "-" + d.qrtr.substring(5));

          break;
        case "UK":
          locSUBKRecRevUKPlanned.push(parseInt(d.planned));
          locSUBKRecRevUKRealised.push(parseInt(d.realised));
          xAxis7.push(d.qrtr.substring(0, 4) + "-" + d.qrtr.substring(5));

          break;
        case "US":
          locSUBKRecRevUSPlanned.push(parseInt(d.planned));
          locSUBKRecRevUSRealised.push(parseInt(d.realised));
          xAxis7.push(d.qrtr.substring(0, 4) + "-" + d.qrtr.substring(5));

          break;
        case "India":
          locSUBKRecRevIndiaPlanned.push(parseInt(d.planned));
          locSUBKRecRevIndiaRealised.push(parseInt(d.realised));
          xAxis7.push(d.qrtr.substring(0, 4) + "-" + d.qrtr.substring(5));

          break;
        case "Germany":
          locSUBKRecRevGermanyPlanned.push(parseInt(d.planned));
          locSUBKRecRevGermanyRealised.push(parseInt(d.realised));
          xAxis7.push(d.qrtr.substring(0, 4) + "-" + d.qrtr.substring(5));

          break;
        case "Canada":
          locSUBKRecRevCanadaPlanned.push(parseInt(d.planned));
          locSUBKRecRevCanadaRealised.push(parseInt(d.realised));
          xAxis7.push(d.qrtr.substring(0, 4) + "-" + d.qrtr.substring(5));

          break;
        default:
      }
    });

    const chartData7 = {
      title: {
        text: "SUBK Planned, Realised/Closed Quarter Trend By Country",
      },

      // subtitle: {
      //     text: 'Source: <a href="https://irecusa.org/programs/solar-jobs-census/" target="_blank">IREC</a>'
      // },

      yAxis: {
        tickInterval: 2000000,
        title: {
          text: "Number of Employees",
        },
      },
      tooltip: {
        formatter: function () {
          return (
            "<b>" +
            this.x +
            "</b><br/>" +
            this.series.name +
            ": " +
            this.y?.toLocaleString("en-US") +
            "<br/>"
          );
        },
      },
      xAxis: {
        type: "category",
        categories: xAxis7,
        crosshair: true,
        title: {
          text: "Quater",
        },
        accessibility: {
          rangeDescription: xAxis7.toString(),
        },
      },

      legend: {
        align: "center",
        verticalAlign: "bottom",
        layout: "horizontal",
      },

      plotOptions: {
        series: {
          label: {
            connectorAllowed: false,
          },
        },
      },

      series: [
        {
          name: "Total Planned",
          data: locSUBKRecRevTotalPlanned,
        },
        {
          name: "Total Realised",
          data: locSUBKRecRevTotalRealised,
        },
        {
          name: "UK Planned",
          data: locSUBKRecRevUKPlanned,
        },
        {
          name: "UK Realised",
          data: locSUBKRecRevUKRealised,
        },
        {
          name: " US Planned",
          data: locSUBKRecRevUSPlanned,
        },
        {
          name: "US Realised",
          data: locSUBKRecRevUSRealised,
        },
        {
          name: "India Planned",
          data: locSUBKRecRevIndiaPlanned,
        },
        {
          name: " India Realised",
          data: locSUBKRecRevIndiaRealised,
        },
        {
          name: "Germany Planned",
          data: locSUBKRecRevGermanyPlanned,
        },
        {
          name: "Germany Realised",
          data: locSUBKRecRevGermanyRealised,
        },
        {
          name: "Canada Planned",
          data: locSUBKRecRevCanadaPlanned,
        },
        {
          name: "Canada Realised",
          data: locSUBKRecRevCanadaRealised,
        },
      ],

      responsive: {
        rules: [
          {
            condition: {
              maxWidth: 500,
            },
            chartOptions: {
              legend: {
                layout: "horizontal",
                align: "center",
                verticalAlign: "bottom",
              },
            },
          },
        ],
      },
    };
    setLocSUBKRecRev(chartData7);
  };

  // const handleTableData = () => {
  //     let headerTitles = scoreCardDataPayload.viewby == "cust" ? ["Rank", "Project", "Planned", "Realised", "GM", "GM%"] : ["Rank", "Customer", "Realised"];
  //     let headerTitlesKeys = [];
  //     const filteredData = historicalTrendData.custRecRevTable.filter(item => item.lvl !== "0");
  //     const groupedData = filteredData.reduce((groups, item) => {
  //         const { cat, ...rest } = item;
  //         if (!groups[cat]) {
  //             groups[cat] = [];
  //         }
  //         groups[cat].push(rest);
  //         return groups;
  //     }, {});
  //     console.log(groupedData)

  //     setDisplayTableData(() => {

  //         return historicalTrendData.custRecRevTable?.map((d, index) => {
  //             let headerData = []
  //             headerTitles.forEach((element, index1) => {
  //                 // console.log(index, index1, d["cat"], "d[headerTitlesKeys[index1]]")

  //                 if (d.id == -1) {
  //                     headerTitlesKeys.push(Object.keys(d).find(key => d[key] === element));
  //                     headerData.push(<th style={{ textAlign: "center", backgroundColor: "#f4f4f4", position: "sticky", top: 0 }}>{element}</th>);
  //                 } else {
  //                     if (headerTitles[index1] == "Customer") {
  //                         headerData.push(<td style={{ textAlign: index1 > 1 && "right" || headerTitles[index1] === "Rank" && "center" }} >{d[headerTitlesKeys[index1]]}</td>);
  //                     } else {
  //                         headerData.push(<td style={{ textAlign: index1 > 1 && "right" || headerTitles[index1] == "Rank" && "center" }} >{headerTitles[index1] == "Rank" ? index : (headerTitles[index1] != "Project") ? `${index1 > 1 ? "$" : ""}` + parseInt(d[headerTitlesKeys[index1]]).toLocaleString('en-US') : `${index1 > 1 ? "$" : ""}` + d[headerTitlesKeys[index1]]}</td>);
  //                     }
  //                 }
  //             })
  //             return (
  //                 index === 0 ? <><tr><td style={{ textAlign: "center", backgroundColor: "#f4f4f4", fontWeight: "bold" }} colSpan={"3"}>{"2023-Q4"}</td></tr><tr style={{ backgroundColor: d.color }} >{headerData}</tr></> : <tr style={{ backgroundColor: d.color }} >{headerData}</tr>
  //             )
  //         });
  //     })
  // }
  const handleTableData = () => {
    let headerTitles =
      scoreCardDataPayload.viewby === "cust"
        ? ["Rank", "Project", "Planned", "Realised", "GM", "GM%"]
        : ["Rank", "Customer", "Realised"];
    let headerTitlesKeys = [];
    console.log(
      historicalTrendData?.custRecRevTable?.filter((item) => item.lvl == "0")
    );
    const filteredData = historicalTrendData?.custRecRevTable?.filter(
      (item) => item.lvl !== "0"
    );
    const groupedData = filteredData?.reduce((groups, item) => {
      const { cat, ...rest } = item;
      if (!groups[cat]) {
        groups[cat] =
          scoreCardDataPayload.viewby == "cust"
            ? [
                {
                  gm: "GM",
                  lvl: "0",
                  cat: "Category",
                  gmperc: "GM%",
                  planned: "Planned",
                  id: -1,
                  realised: "Realised",
                  customer: "Project",
                },
              ]
            : [
                {
                  lvl: "0",
                  customer: "Customer",
                  id: -1,
                  realised: "Realised",
                  cat: "Category",
                },
              ];
      }
      groups[cat].push({ ...rest, cat });
      return groups;
    }, {});

    // const headerObj = groupedData["Category"];
    // groupedData.map((key, value) => {
    //     if (key !== "Category") {
    //         groupedData[key].unshift(headerObj);
    //     }
    // });
    console.log(groupedData);
    const tables =
      groupedData &&
      Object.keys(groupedData)?.map((key, tableIndex) => {
        console.log(key);
        const tableRows = groupedData[key]?.map((d, index) => {
          let headerData = [];
          console.log(headerTitles, "headerTitles");
          headerTitles.forEach((element, index1) => {
            console.log(d["cat"], element, "d[cat]");
            if (d.id == -1) {
              headerTitlesKeys.push(
                Object.keys(d).find((key) => d[key] === element)
              );
              headerData.push(
                <th
                  key={`header-${index1}`}
                  style={{
                    textAlign: "center",
                    backgroundColor: "#f4f4f4",
                    position: "sticky",
                    top: 0,
                  }}
                >
                  {element}
                </th>
              );
              console.log(headerTitlesKeys, element);
            } else {
              if (headerTitles[index1] === "Customer") {
                headerData.push(
                  <td
                    key={`row-${tableIndex}-${index}-${index1}`}
                    style={{
                      textAlign:
                        index1 > 1
                          ? "right"
                          : headerTitles[index1] === "Rank"
                          ? "center"
                          : "left",
                    }}
                  >
                    {d[headerTitlesKeys[index1]]}
                  </td>
                );
              } else {
                headerData.push(
                  <td
                    key={`row-${tableIndex}-${index}-${index1}`}
                    style={{
                      textAlign:
                        index1 > 1
                          ? "right"
                          : headerTitles[index1] === "Rank"
                          ? "center"
                          : "left",
                    }}
                  >
                    {headerTitles[index1] === "Rank"
                      ? index
                      : headerTitles[index1] !== "Project"
                      ? (index1 > 1 ? "$" : "") +
                        parseInt(d[headerTitlesKeys[index1]]).toLocaleString(
                          "en-US"
                        )
                      : (index1 > 1 ? "$" : "") + d[headerTitlesKeys[index1]]}
                  </td>
                );
              }
            }
          });
          console.log(headerData);
          console.log(groupedData[key]);

          return (
            <React.Fragment key={`table-${tableIndex}-row-${index}`}>
              {index === 0 ? (
                <tr>
                  <td
                    style={{
                      textAlign: "center",
                      backgroundColor: "#f4f4f4",
                      fontWeight: "bold",
                    }}
                    colSpan={headerTitles.length}
                  >
                    {key}
                  </td>
                </tr>
              ) : null}
              <tr>{headerData}</tr>
            </React.Fragment>
          );
        });

        return (
          <table
            key={`table-${tableIndex}`}
            className="mt-3 ml-2 col-5 table table-bordered custtable"
          >
            <tbody>{tableRows}</tbody>
          </table>
        );
      });

    setDisplayTableData(tables);
  };

  return (
    <div className="col-12">
      <div className="col-12 row">
        <div className="col-6 mt-2 customCard card graph">
          <TargetCharts chartData={targetsData} />
        </div>
        <div className="col-6 mt-2 customCard card graph">
          <TargetCharts chartData={practRecRev} />
        </div>
      </div>
      <div className="col-12 row">
        <div className="col-6 mt-2  customCard card graph">
          <TargetCharts chartData={locRecRev} />
        </div>
        <div className="col-6 mt-2  customCard card graph">
          <TargetCharts chartData={custCatRecRev} />
        </div>
      </div>
      <div className="col-12 row">
        <div className="col-6 mt-2  customCard card graph">
          <TargetCharts chartData={custContRecRev} />
        </div>
        <div className="col-6 mt-2  customCard card graph">
          <TargetCharts chartData={locFTERecRev} />
        </div>
      </div>
      <div className="col-12 row">
        <div className="col-6 mt-2  customCard card graph">
          <TargetCharts chartData={locSUBKRecRev} />
        </div>
        <div
          className="col-6 mt-2  customCard card graph"
          style={{ maxHeight: "401px", overflowY: "auto" }}
        >
          {/* {displayTableData != null ? */}
          <b className="mt-3 ml-3" style={{ fontSize: "15px" }}>
            {scoreCardDataPayload.viewby == "cust"
              ? "Project Realised Revenue Quarter Trend By Top Projects"
              : "Customer Realised Revenue Quarter Trend By Top Customers "}
          </b>
          {/* <table
                        className="mt-3 ml-3 col-10 table table-bordered custtable" >
                        <thead>

                        </thead>
                        <tbody> */}
          <div className="col-12">
            <div className="row">{displayTableData}</div>
          </div>
          {/* </tbody>

                    </table> */}
          {/* : ""} */}
          {/* <customerRecRevTable tableData={historicalTrendData.custRecRevTable} /> */}
        </div>
      </div>
    </div>
  );
}

export default HistoricalTrend;
