import React, { useLayoutEffect, useState } from 'react'
import { useRef } from 'react';
import { useEffect } from 'react';
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import highcharts3d from 'highcharts/highcharts-3d'
highcharts3d(Highcharts)


function FeedbackjWiseMetrics(props) {

    const { feedbackWise } = props
    console.log(feedbackWise)

    const categoryData = useRef([])
    const [chartData, setChartData] = useState({})


    const HandleChartData = () => {
        let categoryTempData = [];
        let feedbackSent = [];
        let feedbackRec = [];

        feedbackWise.map(d => {
            if (d.id != -1) {
                categoryTempData.push(d.project);
                console.log(d.prjId)
                    feedbackSent.push(parseFloat(d.feedbackSent))
                    feedbackRec.push(parseFloat(d.feedbackRec))
               

            }
        })
        console.log(categoryTempData)
        categoryData.current = categoryTempData

        const chart = {
            credits: {
                enabled: false,
            },
            chart: {
                type: 'bar',
                width: 600,
                options3d: {
                    enabled: true,
                    alpha: 8,
                    beta: 12,
                    viewDistance: 25,
                    depth: 70
                }
            },

            title: {
                text: `CSAT Feedback Sent Vs Recieved Metrics`
            },

            xAxis: {
                categories: categoryData.current
            },

            yAxis: {
                allowDecimals: false,
                min: 0,
                title: {
                    text: 'Projects'
                }
            },

            tooltip: {
                formatter: function () {
                    return '<b>' + this.x + '</b><br/>' +
                        this.series.name + ': ' + this.y
                }
            },

            plotOptions: {
                column: {
                    stacking: 'normal'
                }
            },

            series:
                [
                    {
                        name: 'Feedback Sent',
                        color: 'orange',
                        data: feedbackSent,
                        stack: 'first',
                        legendIndex: 1
                    },
                    {
                        name: 'Feedback Recived',
                        color: '#7cb5ec',
                        data: feedbackRec,
                        stack: 'first',
                        legendIndex: 1
                    }
                ],
            exporting: {
                buttons: {
                    contextButton: {
                        symbolStrokeWidth: 1,
                        symbolFill: '#a4edba',
                        symbolStroke: '#330033'
                    }
                }
            },
            responsive: {
                rules: [
                    {
                        condition: {
                            maxWidth: 2000
                        }
                    }
                ]
            }
        }
        setChartData(chart);
    }

    useEffect(() => {
        HandleChartData();
    }, [feedbackWise])



    return (
        <div>
            <div className='col-md-12 mt-3  customCard card'>
                <HighchartsReact highcharts={Highcharts} options={chartData} />
            </div>
        </div>
    )
}

export default FeedbackjWiseMetrics