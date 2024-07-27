import React, { useLayoutEffect, useState } from 'react'
import { useRef } from 'react';
import { useEffect } from 'react';
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import highcharts3d from 'highcharts/highcharts-3d'
highcharts3d(Highcharts)


function PracticeWiseMetrics(props) {

    const {  practiceWise } = props
    console.log(practiceWise)

    const categoryData = useRef([])
    const [chartData, setChartData] = useState({})


    const HandleChartData = () => {
        let categoryTempData = [];
        let score = [];

        console.log(score)
        practiceWise.map(d => {
            if (d.id != -1) {
                categoryTempData.push(d.practice);
                console.log(d.practice)
            // for (let i in d) {
                    score.push(parseFloat(d.score))
                    console.log(d.score,"---------score")
                // }

            }
        })
        console.log(categoryTempData)
        categoryData.current = categoryTempData

        const chart = {
            credits: {
                enabled: false,
            },
            chart: {
                type: 'column',
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
                text: `CSAT Practice Metrics`
            },

            xAxis: {
                categories: categoryData.current
            },

            yAxis: {
                allowDecimals: false,
                min: 0,
                title: {
                    text: 'Average Score'
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
                        name: 'Average Score',
                        color: 'orange',
                        data: score,
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
    }, [practiceWise])



    return (
        <div>
            <div className='col-md-12 mt-3  customCard card'>
            <HighchartsReact highcharts={Highcharts} options={chartData} />
            </div>
        </div>
    )
}

export default PracticeWiseMetrics