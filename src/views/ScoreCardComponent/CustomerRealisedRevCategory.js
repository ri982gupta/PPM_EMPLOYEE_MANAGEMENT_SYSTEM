import React, { useEffect, useRef, useState } from 'react'
import { AiFillDownCircle } from "react-icons/ai";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import highcharts3d from 'highcharts/highcharts-3d'
import { FaAngleDown, FaAngleRight } from 'react-icons/fa';
highcharts3d(Highcharts)

function CustomerRealisedRevCategory(props) {
    const { custRelRevCat } = props
    const existingAndExisting = useRef(0);
    const existingAndNew = useRef(0);
    const newAndNew = useRef(0);
    const [chartDataProp, setChartDataProp] = useState({})
    const [displayTableData, setDisplayTableData] = useState([])
    let angle = 180;
    const [expanded, setexpanded] = useState([]);
    let onclickchanger = "category"
    const allExecutives = custRelRevCat.filter(item => item.lvl == 1).map(item => item[onclickchanger]);
    let toggler = 0;


    useEffect(() => {
        handleChartData();
        // handleTableData();
    }, [])

    const clickExpand = (exec) => {
        if (exec == "All Customers") {
            setexpanded(prevState => {
                return prevState.length == allExecutives.length ? [] : allExecutives
            })
        }
        else {
            setexpanded(prevState => {
                return prevState.includes(exec) ? prevState.filter(item => item !== exec) : [...prevState, exec]
            })
        }
    };

    useEffect(() => {


        const table = custRelRevCat.map(data => {
            let displayData = [];

            let keysArray = ["category", "revenue", "planned", "calls", "total"]

            //  ["Customer", "Realised", "Planned", "Upside", "Call"];
            let headerTitlesKeys = [];
            toggler = (data["lvl"] == 2) ? toggler : (expanded.includes(data[onclickchanger]) ? 1 : 0);

            keysArray.forEach((keys) => {

                // keys == "obj" && console.log("in line 13" + data[keys])
                data[keys] !== undefined &&
                    displayData.push(data.id < 0 ?

                        <th key={keys} style={{ textAlign: "center", position: "sticky", top: 0 }}>{data[keys]}</th> :
                        // keys == "obj" && data[keys] == null ? <td key={keys}> null </td> :
                        keys != "category" ?
                            <td style={{ textAlign: "right" }} data-toggle="tooltip" title={(parseInt(data[keys])).toLocaleString('en-US')}>{"$" + (data[keys] !== "" ? (parseInt(data[keys])).toLocaleString('en-US') : "0")}</td>

                            :
                            <td className="ellipsis" data-toggle="tooltip" title={data[keys]} key={keys}
                                style={{ display: ((toggler == 0 && (data["lvl"] == 2))) ? "none" : "" }}>
                                {keys == onclickchanger && data["lvl"] < 2 &&
                                    <>
                                        <span style={{ cursor: "pointer" }} onClick={() => { clickExpand(data[onclickchanger]); console.log("expanded") }}>{(expanded.includes(data[onclickchanger]) || expanded.length == allExecutives.length) ? <FaAngleDown /> : <FaAngleRight />}</span>

                                    </>
                                }
                                {(data[keys])}
                            </td >)
            })


            return (<tr key={data.id} style={{ display: (data["lvl"] == 2 && toggler == 0) ? "none" : "" }}>{displayData}</tr>)

        });
        setDisplayTableData(table)

    }, [custRelRevCat, expanded])

    const handleChartData = () => {
        custRelRevCat.map(d => {
            //Graph Data
            if (d.id > 0) {
                switch (d.category) {
                    case "Existing & Existing":
                        existingAndExisting.current = parseInt(d.total);
                        break;
                    case "Existing & New":
                        existingAndNew.current = parseInt(d.total);
                        break;
                    case "New & New":
                        newAndNew.current = parseInt(d.total);
                        break;
                    default:
                }
            }
        });


        const chartData = {

            credits: {
                enabled: false
            },
            chart: {
                plotBackgroundColor: null,
                plotBorderWidth: null,
                plotShadow: false,
                type: 'pie',
                options3d: {
                    enabled: true,
                    alpha: 45,
                    beta: 0
                }
            },
            title: {
                text: 'Customer Realised Revenue By Category',
                style: {
                    fontSize: '15px', // Set font size to 16px
                },
            },
            tooltip: {
                formatter: function () {

                    return `${this.point.name}<br /><li style="color: ${this.point.color}">&#9679;</li> Rec. Revenue: <b>$${Highcharts.numberFormat(this.point.y, 0, ',', ',')}</b> (${Math.round(this.point.percentage * 10) / 10})%`;

                }
                // pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
            },
            xAxis: {
                categories: ["Existing & Existing", "Existing & New", "New & New"]
            },
            accessibility: {
                point: {
                    valueSuffix: '%'
                }
            },
            plotOptions: {
                pie: {
                    allowPointSelect: true,
                    cursor: 'pointer',
                    shadow: true,
                    startAngle: angle,
                    cursor: 'pointer',
                    depth: 55,
                    size: '100%',
                    showInLegend: true,
                    // dataLabels: {
                    //     enabled: true,
                    //     format: '<b>{point.name}</b>: {point.percentage:.1f} %'
                    // }
                }
            },
            series: [{
                name: 'Rec. Revenue',
                colorByPoint: true,
                data: [{
                    name: 'Existing & Existing',
                    y: existingAndExisting.current,
                    /* sliced: true, */
                    selected: true,
                    dataLabels: {
                        enabled: true,
                        distance: 10,
                        // format: '<b>{point.name}</b>: <br/>${point.y:,.0f} ({point.percentage:.1f})%'
                        formatter: function () {
                            return `<b>${this.point.name}</b>:<br/>$${Highcharts.numberFormat(this.point.y, 0, ',', ',')} (${Math.round(this.point.percentage * 10) / 10})%`
                        }
                    }
                }, {
                    name: 'Existing & New',
                    y: existingAndNew.current,
                    dataLabels: {
                        enabled: true,
                        distance: 10,
                        formatter: function () {

                            return `<b>${this.point.name}</b>:<br/>$${Highcharts.numberFormat(this.point.y, 0, ',', ',')} (${Math.round(this.point.percentage * 10) / 10})%`

                        }
                        // format: '<b>{point.name}</b>: <br/>${point.y:,.0f} ({point.percentage:.1f})%'
                    }
                }, {
                    name: 'New & New',
                    y: newAndNew.current,
                    dataLabels: {
                        enabled: true,
                        distance: 10,
                        // format: '<b>{point.name}</b>: <br/>${point.y:,.0f} ({point.percentage:.1f})%'
                        formatter: function () {

                            return `<b>${this.point.name}</b>:<br/>$${Highcharts.numberFormat(this.point.y, 0, ',', ',')} (${Math.round(this.point.percentage * 10) / 10})%`

                        }
                    }
                }]
            }]
        }
        setChartDataProp(chartData);
    }




  return (
    <div className="col-12 mt-2  customCard card graph thead">
      <div className="mr-0">
        <HighchartsReact highcharts={Highcharts} options={chartDataProp} />
      </div>
      {/* <div><TargetCharts chartData={chartDataProp} /></div> */}
      {displayTableData != null ? (
        <div
          className="darkHeader"
          style={{ maxHeight: "111px", overflowY: "auto" }}
        >
          <table
            // style={{ maxHeight: "50px", overflowX: "auto", marginTop: "10px", overflowY: "auto" }}
            className="table table-bordered serviceTable "
          >
            <thead style={{ fontSize: "13px" }}>{displayTableData}</thead>
          </table>
        </div>
      ) : (
        ""
      )}
    </div>
  );
}

export default CustomerRealisedRevCategory;
