import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
require("highcharts/modules/exporting")(Highcharts);
import { useEffect, forwardRef } from "react";
import highcharts3d from "highcharts/highcharts-3d";
highcharts3d(Highcharts);
function ChartRenderer(props, ref) {
  const {
    yServClosed,
    ySwClosed,
    ySwSevenFive,
    ySwFifty,
    ySwTwoFive,
    ySwLessTwoFive,
    yServSevenFive,
    yServFifty,
    yServTwoFive,
    yServLessTwoFive,
    yServCreated,
    ySwCreated,
    execKey,
    xAxis,
    execName,
  } = props;

  var yGSwSevenFive = ySwSevenFive[execKey];
  var yGSwFifty = ySwFifty[execKey];
  var yGSwTwoFive = ySwTwoFive[execKey];
  var yGSwLessTwoFive = ySwLessTwoFive[execKey];

  var yGServSevenFive = yServSevenFive[execKey];
  var yGServFifty = yServFifty[execKey];
  var yGServTwoFive = yServTwoFive[execKey];
  var yGServLessTwoFive = yServLessTwoFive[execKey];

  var yGServCreated = yServCreated[execKey];
  var yGSwCreated = ySwCreated[execKey];
  var yGServClosed = yServClosed[execKey];
  var yGSwClosed = ySwClosed[execKey];

  const asOfNowSWData = [];
  const asOfNowServData = [];

  var asOfNowAxis = [];
  asOfNowAxis.push("Services");

  asOfNowServData.push({
    name: "75-99",
    color: "#2f7ed8",
    data: [parseFloat(yGServSevenFive[0])],
  });
  asOfNowServData.push({
    name: "50-74",
    color: "#1aadce",
    data: [parseFloat(yGServFifty[0])],
  });
  asOfNowServData.push({
    name: "25-49",
    color: "#8bbc21",
    data: [parseFloat(yGServTwoFive[0])],
  });
  asOfNowServData.push({
    name: "<25",
    color: "#910000",
    data: [parseFloat(yGServLessTwoFive[0])],
  });
  asOfNowSWData.push({
    name: "75-99",
    color: "#2f7ed8",
    data: [yGSwSevenFive[0]],
  });
  asOfNowSWData.push({ name: "50-74", color: "#1aadce", data: [yGSwFifty[0]] });
  asOfNowSWData.push({
    name: "25-49",
    color: "#8bbc21",
    data: [yGSwTwoFive[0]],
  });
  asOfNowSWData.push({
    name: "<25",
    color: "#910000",
    data: [yGSwLessTwoFive[0]],
  });

  const asOfNowService = {
    chart: {
      type: "column",
      width: 600,
      options3d: {
        enabled: true,
        alpha: 8,
        beta: 12,
        viewDistance: 25,
        depth: 70,
      },
    },
    title: {
      useHTML: true,
      text:
        'Services As Of Now for <b style="color:#297ab0;font-size: 14px;">' +
        execName +
        "</b><span>",
    },
    xAxis: {
      categories: asOfNowAxis,
      crosshair: true,
      gridLineWidth: 0.2,
    },
    yAxis: {
      allowDecimals: false,
      gridLineWidth: 0.2,
      min: 0,
      title: {
        text: "Amount ($)",
      },
      labels: {
        overflow: "justify",
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
          this.y.toLocaleString("en-US") +
          " <br/>"
        );
      },
    },
    plotOptions: {
      column: {
        pointPadding: 0.2,
        borderWidth: 0,
      },
    },
    series: asOfNowServData,
  };

  asOfNowAxis = [];
  asOfNowAxis.push("Software");

  const asOfNowSoftware = {
    chart: {
      type: "column",
      width: 600,
      options3d: {
        enabled: true,
        alpha: 8,
        beta: 12,
        viewDistance: 25,
        depth: 70,
      },
    },
    title: {
      useHTML: true,
      text:
        'Software As Of Now for <b style="color:#297ab0;font-size: 14px;">' +
        execName +
        "</b><span>",
    },
    xAxis: {
      categories: asOfNowAxis,
      crosshair: true,
      gridLineWidth: 0.2,
    },
    yAxis: {
      allowDecimals: false,
      min: 0,
      gridLineWidth: 0.2,
      title: {
        text: "Amount ($)",
      },
      labels: {
        overflow: "justify",
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
          this.y.toLocaleString("en-US") +
          " <br/>"
        );
      },
    },
    plotOptions: {
      column: {
        pointPadding: 0.2,
        borderWidth: 0,
      },
    },
    series: asOfNowSWData,
  };

  var seriesArray = [];
  var seriesSWArray = [];

  seriesArray.push({
    name: "Created",
    data: yGServCreated,
    stack: "second",
    color: "#ffc966",
    legendIndex: 1,
  });
  seriesSWArray.push({
    name: "Created",
    data: yGSwCreated,
    stack: "second",
    color: "#ffc966",
    legendIndex: 1,
  });

  seriesArray.push({
    name: "Closed",
    data: yGServClosed,
    stack: "first",
    color: "#00ff00",
    legendIndex: 1,
  });
  seriesSWArray.push({
    name: "Closed",
    data: yGSwClosed,
    stack: "first",
    color: "#00ff00",
    legendIndex: 1,
  });

  const serviceOpptGraph = {
    lang: {
      thousandsSep: ",",
      decimalPoint: ".",
    },
    chart: {
      type: "column",
      width: 900,
      options3d: {
        enabled: true,
        alpha: 8,
        beta: 12,
        viewDistance: 25,
        depth: 70,
      },
    },
    title: {
      useHTML: true,
      text:
        'Service Progress for <b style="color:#297ab0;font-size: 14px;">' +
        execName +
        "</b><span>",
    },
    xAxis: {
      categories: xAxis,
      crosshair: true,
      gridLineWidth: 0.2,
    },
    yAxis: {
      allowDecimals: false,
      gridLineWidth: 0.2,
      min: 0,
      title: {
        text: "Amount ($)",
      },
      labels: {
        overflow: "justify",
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
          this.y.toLocaleString("en-US") +
          " <br/>"
        );
      },
    },
    plotOptions: {
      column: {
        pointPadding: 0.2,
        borderWidth: 0,
        stacking: "normal",
      },
    },
    series: seriesArray,
  };

  const softOpptGraph = {
    lang: {
      thousandsSep: ",",
      decimalPoint: ".",
    },
    chart: {
      type: "column",
      width: 900,
      options3d: {
        enabled: true,
        alpha: 8,
        beta: 12,
        viewDistance: 25,
        depth: 70,
      },
    },
    title: {
      useHTML: true,
      text:
        'Software Progress for <b style="color:#297ab0;font-size: 14px;">' +
        execName +
        "</b><span>",
    },
    xAxis: {
      categories: xAxis,
      crosshair: true,
      gridLineWidth: 0.2,
    },
    yAxis: {
      allowDecimals: false,
      min: 0,
      gridLineWidth: 0.2,
      title: {
        text: "Amount ($)",
      },
      labels: {
        overflow: "justify",
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
          this.y.toLocaleString("en-US") +
          " <br/>"
        );
      },
    },
    plotOptions: {
      column: {
        pointPadding: 0.2,
        borderWidth: 0,
        stacking: "normal",
      },
    },
    series: seriesSWArray,
  };

  // useEffect(() => {
  //   document.getElementById("chart").scrollIntoView({
  //     behavior: "smooth",
  //     block: "start",
  //     inline: "nearest",
  //   });
  // }, [props]);
  useEffect(() => {
    if (ref && ref.current) {
      ref.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [ref]);

  return (
    <div
      id="chart"
      className="col-md-12 no-padding"
      style={{ marginTop: "2%" }}
    >
      <div
        className="col-md-12 no-padding pipelineCharts customCard card graph"
        style={{
          width: "75%",
          // marginBottom: "15px",
        }}
      >
        <HighchartsReact highcharts={Highcharts} options={serviceOpptGraph} />
      </div>
      <div
        className="col-md-12 no-padding pipelineCharts customCard card graph"
        style={{ width: "75%" }}
      >
        <HighchartsReact highcharts={Highcharts} options={softOpptGraph} />
      </div>
      <div className="col-md-12 row">
        {" "}
        <div
          className="col-5 no-padding customCard card graph thirdGraphPipelIne"
          style={{ marginLeft: "2%" }}
        >
          <HighchartsReact highcharts={Highcharts} options={asOfNowService} />
        </div>
        <div
        ref={ref}
        className="col-5 no-padding customCard card graph fourthGraphPipeLine">
          <HighchartsReact highcharts={Highcharts} options={asOfNowSoftware} />
        </div>
      </div>
    </div>
  );
}
export default forwardRef(ChartRenderer);