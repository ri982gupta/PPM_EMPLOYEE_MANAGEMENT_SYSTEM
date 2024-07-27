import React from "react";
import "./Issue.scss";
import { useEffect } from "react";
import { CModal } from "@coreui/react";
import { CModalBody } from "@coreui/react";
import { CModalHeader } from "@coreui/react";
import { CModalTitle } from "@coreui/react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import moment from "moment";
require("highcharts/modules/exporting")(Highcharts);

function IQAChart(props) {
  const { getGraphData, openIQA, setOpenIQA, graphData, dat } = props;
  var D = moment(graphData[0]?.actual_start_date).format("MMM" + "," + "YY");

  console.log(dat);

  useEffect(() => {
    getGraphData();
  }, []);

  let iqaData = [];
  graphData.map((g) => {
    iqaData.push({
      name: "Total",
      color: "#7cb5ec",
      data: [parseFloat(g.total + ". 0")],
    });
    iqaData.push({
      name: "Major",
      color: "#434348",
      data: [parseFloat(g.major)],
    });
    iqaData.push({
      name: "Minor",
      color: "#90ed7d",
      data: [parseFloat(g.minor)],
    });
    iqaData.push({
      name: "Observations",
      color: "#f7a35c",
      data: [parseFloat(g.medium)],
    });
    iqaData.push({
      name: "Recommendations",
      color: "#8085e9",
      data: [parseFloat(g.recommendations)],
    });
  });
  var asOfNowAxis = [];
  asOfNowAxis.push(D);
  asOfNowAxis.push(graphData?.medium);
  const chartData = {
    chart: {
      type: "column",
      width: 750,
    },
    title: {
      useHTML: true,
      text:
        dat === 477
          ? "QCR"
          : dat === 478
          ? "IQA"
          : dat === 1272
          ? "ISMS"
          : dat === 1285
          ? "CMMI"
          : dat === 1284
          ? "ISO"
          : "",
    },
    xAxis: {
      categories: asOfNowAxis,
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
    // tooltip: {
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
    //     formatter: function () {
    //         return '<b>' + this.x + '</b><br/>' +
    //             this.series.name + ': ' + (this.y) + ' <br/>';
    //     }
    // },
    credits: {
      enabled: false,
    },
    plotOptions: {
      column: {
        pointPadding: 0.2,
        borderWidth: 0,
      },
    },
    series: iqaData,
  };

  return (
    <div>
      <CModal
        visible={openIQA}
        size="lg"
        className="ui-dialog"
        onClose={() => setOpenIQA(false)}
      >
        <CModalHeader>
          <CModalTitle>
            <span>Project Details</span>
          </CModalTitle>
        </CModalHeader>
        <CModalBody>
          <HighchartsReact highcharts={Highcharts} options={chartData} />
        </CModalBody>
      </CModal>
    </div>
  );
}

export default IQAChart;
