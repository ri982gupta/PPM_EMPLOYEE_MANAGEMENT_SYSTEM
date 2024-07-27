import React from "react";
import { CModal } from "@coreui/react";
import { CModalBody } from "@coreui/react";
import { CModalHeader } from "@coreui/react";
import { CModalTitle } from "@coreui/react";
// import "./Issue.scss";
import { useEffect } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import moment from "moment";
require("highcharts/modules/exporting")(Highcharts);

function PCQAChart(props) {
  const { getGraphData, openTrend, setOpenTrend, graphData, dat } = props;
  console.log("PCQA chart will display");
  console.log(graphData);
  var asOfNowAxisQCR = [];
  var asOfNowAxisCMMI = [];
  var asOfNowAxisIQA = [];
  var asOfNowAxisISMS = [];
  var asOfNowAxisISO = [];
  useEffect(() => {
    getGraphData();
  }, []);

  var chartDataArray = [];
  let cmmiTotalData = [];
  let cmmiMajorData = [];
  let cmmiMinorData = [];
  let cmmiMediumData = [];
  let cmmiRecomData = [];
  let iqaTotalData = [];
  let iqaMajorData = [];
  let iqaMinorData = [];
  let iqaMediumData = [];
  let iqaRecomData = [];
  let ismsTotalData = [];
  let ismsMajorData = [];
  let ismsMinorData = [];
  let ismsMediumData = [];
  let ismsRecomData = [];
  let isoTotalData = [];
  let isoMajorData = [];
  let isoMinorData = [];
  let isoMediumData = [];
  let isoRecomData = [];
  let qcrData = [];
  graphData.map((g) => {
    if (g.auditType === 477) {
      qcrData.push([parseFloat(g.percentage)]);
      var A = moment(g?.actual_start_date).format("MMM" + "," + "YY");
      asOfNowAxisQCR.push(A);
    }
    if (g.auditType === 1285) {
      var B = moment(g?.actual_start_date).format("MMM" + "," + "YY");
      asOfNowAxisCMMI.push(B);
      cmmiTotalData.push([parseFloat(g.total + ". 0")]);
      cmmiMajorData.push([parseFloat(g.major)]);
      cmmiMinorData.push([parseFloat(g.minor)]);
      cmmiMediumData.push([parseFloat(g.medium)]);
      cmmiRecomData.push([parseFloat(g.recommendations)]);
    }
    if (g.auditType === 478) {
      var C = moment(g?.actual_start_date).format("MMM" + "," + "YY");
      asOfNowAxisIQA.push(C);
      iqaTotalData.push([parseFloat(g.total + ". 0")]);
      iqaMajorData.push([parseFloat(g.major)]);
      iqaMinorData.push([parseFloat(g.minor)]);
      iqaMediumData.push([parseFloat(g.medium)]);
      iqaRecomData.push([parseFloat(g.recommendations)]);
    }
    if (g.auditType === 1272) {
      var D = moment(g?.actual_start_date).format("MMM" + "," + "YY");
      asOfNowAxisISMS.push(D);
      ismsTotalData.push([parseFloat(g.total + ". 0")]);
      ismsMajorData.push([parseFloat(g.major)]);
      ismsMinorData.push([parseFloat(g.minor)]);
      ismsMediumData.push([parseFloat(g.medium)]);
      ismsRecomData.push([parseFloat(g.recommendations)]);
    }
    if (g.auditType === 1284) {
      var E = moment(g?.actual_start_date).format("MMM" + "," + "YY");
      asOfNowAxisISO.push(E);
      isoTotalData.push([parseFloat(g.total + ". 0")]);
      isoMajorData.push([parseFloat(g.major)]);
      isoMinorData.push([parseFloat(g.minor)]);
      isoMediumData.push([parseFloat(g.medium)]);
      isoRecomData.push([parseFloat(g.recommendations)]);
    }
  });
  
  const qcrDataArray = {
    chart: {
      type: "line",
    },
    title: {
      text: "QCR - Audit Chart",
    },
    xAxis: {
      categories: asOfNowAxisQCR,
      crosshair: true,
    },
    yAxis: {
      allowDecimals: false,
      min: 0,
      title: {
        text: "Percentage",
      },
      labels: {
        overflow: "justify",
      },
    },
    tooltip: {
      formatter: function () {
        return (
          "<b>" + this.series.name + "</b><br/>" + "QCR% = " + this.y + " <br/>"
        );
      },
    },
    credits: {
      enabled: false,
    },
    plotOptions: {
      column: {
        pointPadding: 0.2,
        borderWidth: 1,
      },
    },
    series: [
      {
        name: "Series 1",
        color: "#7cb5ec",
        data: qcrData
      }
    ]
  };
  const iqaDataArray = {
    chart: {
      type: "column",
      width: 750,
    },
    title: {
      useHTML: true,
      text: "IQA",
    },
    xAxis: {
      categories: asOfNowAxisIQA,
      crosshair: true,
    },
    yAxis: {
      allowDecimals: false,
      min: 0,
      title: {
        text: "Score",
      },
      labels: {
        overflow: "justify",
      },
    },
    tooltip: {
      formatter: function () {
        let tooltipText = "<b>" + this.x + "</b><br/>";
        this.points.forEach(function (point) {
          tooltipText += `<span style="color:${point.series.color}">${point.series.name}</span> : ${point.y}<br/>`;
        });
        return tooltipText;
      },
      shared: true,
    },
    credits: {
      enabled: false,
    },
    plotOptions: {
      column: {
        pointPadding: 0.2,
        borderWidth: 0,
      },
    },
    series: [
      {
        name: "Total",
        color: "#7cb5ec",
        data: iqaTotalData,
      },
      {
        name: "Major",
        color: "#434348",
        data: iqaMajorData,
      },
      {
        name: "Minor",
        color: "#90ed7d",
        data: iqaMinorData,
      },
      {
        name: "Observations",
        color: "#f7a35c",
        data: iqaMediumData,
      },
      {
        name: "Recommendations",
        color: "#8085e9",
        data: iqaRecomData,
      }
    ]
  };

  const ismsDataArray = {
    chart: {
      type: "column",
      width: 750,
    },
    title: {
      useHTML: true,
      text: "ISMS",
    },
    xAxis: {
      categories: asOfNowAxisISMS,
      crosshair: true,
    },
    yAxis: {
      allowDecimals: false,
      min: 0,
      title: {
        text: "Score",
      },
      labels: {
        overflow: "justify",
      },
    },
    tooltip: {
      formatter: function () {
        let tooltipText = "<b>" + this.x + "</b><br/>";
        this.points.forEach(function (point) {
          tooltipText += `<span style="color:${point.series.color}">${point.series.name}</span> : ${point.y}<br/>`;
        });
        return tooltipText;
      },
      shared: true,
    },
    credits: {
      enabled: false,
    },
    plotOptions: {
      column: {
        pointPadding: 0.2,
        borderWidth: 0,
      },
    },
    series: [
      {
        name: "Total",
        color: "#7cb5ec",
        data: ismsTotalData,
      },
      {
        name: "Major",
        color: "#434348",
        data: ismsMajorData,
      },
      {
        name: "Minor",
        color: "#90ed7d",
        data: ismsMinorData,
      },
      {
        name: "Observations",
        color: "#f7a35c",
        data: ismsMediumData,
      },
      {
        name: "Recommendations",
        color: "#8085e9",
        data: ismsRecomData,
      }
    ]
  };

  const isoDataArray = {
    chart: {
      type: "column",
      width: 750,
    },
    title: {
      useHTML: true,
      text: "ISO",
    },
    xAxis: {
      categories: asOfNowAxisISO,
      crosshair: true,
    },
    yAxis: {
      allowDecimals: false,
      min: 0,
      title: {
        text: "Score",
      },
      labels: {
        overflow: "justify",
      },
    },
    tooltip: {
      formatter: function () {
        let tooltipText = "<b>" + this.x + "</b><br/>";
        this.points.forEach(function (point) {
          tooltipText += `<span style="color:${point.series.color}">${point.series.name}</span> : ${point.y}<br/>`;
        });
        return tooltipText;
      },
      shared: true,
    },
    credits: {
      enabled: false,
    },
    plotOptions: {
      column: {
        pointPadding: 0.2,
        borderWidth: 0,
      },
    },
    series: [
      {
        name: "Total",
        color: "#7cb5ec",
        data: isoTotalData,
      },
      {
        name: "Major",
        color: "#434348",
        data: isoMajorData,
      },
      {
        name: "Minor",
        color: "#90ed7d",
        data: isoMinorData,
      },
      {
        name: "Observations",
        color: "#f7a35c",
        data: isoMediumData,
      },
      {
        name: "Recommendations",
        color: "#8085e9",
        data: isoRecomData,
      }
    ]
  };

  const cmmiDataArray = {
    chart: {
      type: "column",
      width: 750,
    },
    title: {
      useHTML: true,
      text: "CMMI",
    },
    xAxis: {
      categories: asOfNowAxisCMMI,
      crosshair: true,
    },
    yAxis: {
      allowDecimals: false,
      min: 0,
      title: {
        text: "Score",
      },
      labels: {
        overflow: "justify",
      },
    },
    tooltip: {
      formatter: function () {
        let tooltipText = "<b>" + this.x + "</b><br/>";
        this.points.forEach(function (point) {
          tooltipText += `<span style="color:${point.series.color}">${point.series.name}</span> : ${point.y}<br/>`;
        });
        return tooltipText;
      },
      shared: true,
    },
    credits: {
      enabled: false,
    },
    plotOptions: {
      column: {
        pointPadding: 0.2,
        borderWidth: 0,
      },
    },
    series: [
      {
        name: "Total",
        color: "#7cb5ec",
        data: cmmiTotalData,
      },
      {
        name: "Major",
        color: "#434348",
        data: cmmiMajorData,
      },
      {
        name: "Minor",
        color: "#90ed7d",
        data: cmmiMinorData,
      },
      {
        name: "Observations",
        color: "#f7a35c",
        data: cmmiMediumData,
      },
      {
        name: "Recommendations",
        color: "#8085e9",
        data: cmmiRecomData,
      }
    ]
  };

  if (cmmiTotalData.length > 0) {
    chartDataArray.push(cmmiDataArray);
  }
  if (iqaTotalData.length > 0) {
    chartDataArray.push(iqaDataArray);
  }
  if (ismsTotalData.length > 0) {
    chartDataArray.push(ismsDataArray);
  }
  if (isoTotalData.length > 0) {
    chartDataArray.push(isoDataArray);
  }
  if (qcrData.length > 0) {
    chartDataArray.push(qcrDataArray);
  }

  return (
    <div>
      <CModal
        visible={openTrend}
        size="lg"
        className="ui-dialog"
        onClose={() => setOpenTrend(false)}
      >
        <CModalHeader>
          <CModalTitle>
            <span className="ft16">Project Details</span>
          </CModalTitle>
        </CModalHeader>
        <CModalBody>
          <div style={{ overflowX: "auto" }}>
            <div className="charts-container" style={{ display: "flex" }}>
              {chartDataArray.map((chartData, index) => (
                <div
                  key={index}
                  className="chart"
                  style={{ flex: 1, margin: "10px" }}
                >
                  <HighchartsReact
                    highcharts={Highcharts}
                    options={chartData}
                  />
                </div>
              ))}
            </div>
          </div>
        </CModalBody>
      </CModal>
    </div>
  );
}

export default PCQAChart;
