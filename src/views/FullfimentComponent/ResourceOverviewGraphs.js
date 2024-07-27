import React from 'react'
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import highcharts3d from 'highcharts/highcharts-3d'
highcharts3d(Highcharts)
import { useState } from 'react';
import { format, parseISO, parse } from "date-fns";


function ResourceOverviewGraphs(props) {
    const { tableData, column, filteredData, allHeaders, alldata } = props
    const [type, setType] = useState([])
    //=======================Deployable Bench - Actual=================
    const fteData = {};

    filteredData?.forEach((data) => {
        if (data["kpi"].includes("Deployable Bench - Actual")) {

            Object.keys(data).forEach((key) => {
                if (key.includes("count")) {
                    const dateKey = key.substring(0, 10);
                    const date = parseISO(dateKey.replace(/_/g, "-"));
                    const formattedDateKey = format(date, "dd-MMM-yyyy");
                    fteData[formattedDateKey] = data[key];
                }
            });
        }
    });

    const sortedDates3 = Object.keys(fteData).sort((a, b) => {
        return new Date(a) - new Date(b);
    });

    const sortedFteData3 = {};
    sortedDates3.forEach((date) => {
        sortedFteData3[date] = fteData[date];
    });
    //=================================NBL on projects==
    const fteData4 = {};

    filteredData?.forEach((data) => {
        if (data["kpi"].includes("NBL on projects")) {
            Object.keys(data).forEach((key) => {
                if (key.includes("count")) {
                    const dateKey = key.substring(0, 10);
                    const date = parseISO(dateKey.replace(/_/g, "-"));
                    const formattedDateKey = format(date, "dd-MMM-yyyy");
                    fteData4[formattedDateKey] = data[key];
                }
            });
        }
    });

    const sortedDates4 = Object.keys(fteData4).sort((a, b) => {
        return new Date(a) - new Date(b);
    });

    const sortedData4 = {};
    sortedDates4.forEach((date) => {
        sortedData4[date] = fteData4[date];
    });

    //=============================Bench (Zero Allocation)============
    const fteData5 = {};

    filteredData?.forEach((data) => {
        if (data["kpi"].includes("Bench (Zero Allocation)")) {

            Object.keys(data).forEach((key) => {
                if (key.includes("count")) {
                    const dateKey = key.substring(0, 10);
                    const date = parseISO(dateKey.replace(/_/g, "-"));
                    const formattedDateKey = format(date, "dd-MMM-yyyy");
                    fteData5[formattedDateKey] = data[key];
                }
            });
        }
    });

    const sortedDates5 = Object.keys(fteData5).sort((a, b) => {
        return new Date(a) - new Date(b);
    });

    const sortedData5 = {};
    sortedDates5.forEach((date) => {
        sortedData5[date] = fteData5[date];
    });


    //==================================================================
    const fteData1 = {};

    filteredData?.forEach((data) => {
        if (data["kpi"].includes("Resources being billed")) {
            Object.keys(data).forEach((key) => {
                if (key.includes("count")) {
                    const dateKey = key.substring(0, 10);
                    const date = parseISO(dateKey.replace(/_/g, "-"));
                    const formattedDateKey = format(date, "dd-MMM-yyyy");
                    fteData1[formattedDateKey] = data[key];
                }
            });
        }
    });


    const sortedDates = Object.keys(fteData1).sort((a, b) => {
        return new Date(a) - new Date(b);
    });

    const sortedFteData = {};
    sortedDates.forEach((date) => {
        sortedFteData[date] = fteData1[date];
    });


    ///////////////////////////////////////////////////////////////////////////

    const fteData2 = {};

    filteredData?.forEach((data) => {
        if (data["kpi"].includes("Total Billable Resources")) {
            Object.keys(data).forEach((key) => {
                if (key.includes("count")) {
                    const dateKey = key.substring(0, 10);
                    const date = parseISO(dateKey.replace(/_/g, "-"));
                    const formattedDateKey = format(date, "dd-MMM-yyyy");
                    fteData2[formattedDateKey] = data[key];
                }
            });
        }
    });


    const sortedDates2 = Object.keys(fteData2).sort((a, b) => {
        return new Date(a) - new Date(b);
    });

    const sortedFteData2 = {};
    sortedDates2.forEach((date) => {
        sortedFteData2[date] = fteData2[date];
    });



    //////////////////////////////////////////////////////////////////////////

    const mergedFteData = Object.assign({}, fteData, fteData1);

    const fteDataChartConfig = {
        chart: {
            type: 'column',
        },
        title: {
            text: 'Resource Overview',
        },
        exporting: { enabled: true },
        xAxis: {
            categories: Object.keys(sortedFteData3),
            title: {
                text: 'Weeks',
            },
        },
        yAxis: {

            title: {
                text: 'Resource Count',
            },
        },

        tooltip: {
            formatter: function () {
                let tooltipText = '<b>' + this.x + '</b><br/>';
                this.points.forEach(function (point) {
                    tooltipText += '<span style="color:' + point.color + '">' + point.series.name + '</span>: <span style="text-align: right; display: inline-block">' + '<b>' + point.y + '</b></span><br/>';
                });
                return tooltipText;
            },

            shared: true,
            positioner: function (labelWidth, labelHeight, point) {
                return {
                    x: point.plotX + this.chart.plotLeft - labelWidth / 2,
                    y: point.plotY + this.chart.plotTop - labelHeight - 10,
                };
            },
        },

        series: [
            {
                name: 'Deployable Bench - Actual',
                data: Object.values(sortedFteData3).map(value => Number(value)),
                dataLabels: {
                    enabled: true,
                    formatter: function () {
                        return this.y;
                    }
                },
                marker: {
                    symbol: 'square'
                }
            },
            {
                name: 'NBL on projects',
                data: Object.values(sortedData4).map(value => Number(value)),
                dataLabels: {
                    enabled: true,
                    formatter: function () {
                        return this.y;
                    }
                },
                marker: {
                    symbol: 'square'
                }
            },
            {
                name: 'Bench (Zero Allocation)',
                data: Object.values(sortedData5).map(value => Number(value)),
                dataLabels: {
                    enabled: true,
                    formatter: function () {
                        return this.y;
                    }
                },
                marker: {
                    symbol: 'square'
                }
            }
        ]


    };


    // console.log(Object.keys(fteData1))

    const fteData1ChartConfig = {
        chart: {
            type: 'line',
        },
        title: {
            text: 'Billable vs Billed',
        },
        exporting: { enabled: true },
        xAxis: {
            categories: Object.keys(sortedFteData),
            title: {
                text: 'Weeks',
            },
        },
        yAxis: {

            title: {
                text: 'Resource Count',
            },
        },
        tooltip: {
            formatter: function () {
                return '<b>' + this.x + '</b><br/>' +
                    this.series.name + ': ' + this.y
            }
        },
        tooltip: {

            formatter: function () {

                let tooltipText = '<b>' + this.x + '</b><br/>';

                this.points.forEach(function (point) {

                    tooltipText += point.series.name + ': ' + point.y + '<br/>';

                });

                return tooltipText;

            },

            shared: true,
            positioner: function (labelWidth, labelHeight, point) {
                return {
                    x: point.plotX + this.chart.plotLeft - labelWidth / 2,
                    y: point.plotY + this.chart.plotTop - labelHeight - 10,
                };
            },

        },
        series: [
            {
                name: 'Total Billable Resources',
                data: Object.values(sortedFteData2).map(value => Number(value)),
            },
            {
                name: 'Resources Being billed',
                data: Object.values(sortedFteData).map(value => Number(value)),
            },
        ],
    };


    return (
        <div>
            <div></div>

            <HighchartsReact
                highcharts={Highcharts}
                options={fteData1ChartConfig}
            />
            <HighchartsReact
                highcharts={Highcharts}
                options={fteDataChartConfig}
            />
        </div>

    )
}

export default ResourceOverviewGraphs