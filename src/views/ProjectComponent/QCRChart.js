import React from "react";
import { CModal } from "@coreui/react";
import { CModalBody } from "@coreui/react";
import { CModalHeader } from "@coreui/react";
import { CModalTitle } from "@coreui/react";
import "./Issue.scss";
import { useEffect } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import moment from "moment";
require("highcharts/modules/exporting")(Highcharts);

function QCRChart(props) {
  const { getGraphData, openQCR, setOpenQCR, graphData, Auditname } = props;
  console.log("QCR chart will display");

  var D = moment(graphData[0]?.actual_start_date).format("MMM" + "," + "YY");
  useEffect(() => {
    getGraphData();
  }, []);

  let iqaData = [];
  graphData.map((g) => {
    iqaData.push({
      name: "Series 1",
      color: "#7cb5ec",
      data: [parseFloat(g.percentage)],
    });
  });
  var asOfNowAxis = [];
  asOfNowAxis.push(D);

  const chartData = {
    chart: {
      type: "line",
      width: 700,
    },
    title: {
      useHTML: true,
      text:
        Auditname === 477
          ? "QCR" + " - Audit Chart"
          : Auditname === 478
          ? "IQA" + " - Audit Chart"
          : Auditname === 1272
          ? "ISMS" + " - Audit Chart"
          : Auditname === 1285
          ? "CMMI" + " - Audit Chart"
          : Auditname === 1284
          ? "ISO" + " - Audit Chart"
          : "",
    },
    xAxis: {
      categories: asOfNowAxis,
      crosshair: true,
    },
    yAxis: {
      allowDecimals: false,
      min: 0,
      // tickInterval:5,
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
    series: iqaData,
  };

  return (
    <div>
      <CModal
        visible={openQCR}
        size="lg"
        className="ui-dialog"
        onClose={() => setOpenQCR(false)}
      >
        <CModalHeader>
          <CModalTitle>
            <span className="ft16">Project Details</span>
          </CModalTitle>
        </CModalHeader>
        <CModalBody>
          <div className="align center">
            <HighchartsReact highcharts={Highcharts} options={chartData} />
          </div>
        </CModalBody>
      </CModal>
    </div>
  );
}

export default QCRChart;
