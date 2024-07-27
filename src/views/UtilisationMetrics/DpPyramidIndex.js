import React, { useEffect, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import "primeicons/primeicons.css";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.css";
import "primeflex/primeflex.css";
import "../PrimeReactTableComponent/PrimeReactTable.scss"
import { ColumnGroup } from 'primereact/columngroup';
import { Row } from 'primereact/row';

import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import funnel from "highcharts/modules/funnel.js";
funnel(Highcharts);


function DpPyramidIndex(props) {
    const { data, Header, DP } = props;
    const [mainData, setMainData] = useState([]);
    const [headerData, setHeaderData] = useState(null);
    const [headerDat, setHeaderDat] = useState([]);
    const [bodyData, setBodyData] = useState([]);
    const [filter, setFilter] = useState([]);
    let headerGroup = []
    console.log("Header Data", Header)
    console.log("Table Data", data)
    console.log("DP", DP)


    useEffect(() => {
        setMainData(JSON.parse(JSON.stringify(data)));
    }, [data]);

    let a225 = data.filter(item => item.cadre !== 'Total' && item.cadre !== "Pyramid Alignment Index")
        .map((item) => ({
            name: item.cadre,
            y: parseFloat(item['225_pi']),
        }))

    let b225 = (a225.every(item => item.y === 0 || isNaN(item.y)) ? false : true)

    console.log(data.filter(item => item.cadre !== 'Total' && item.cadre !== "Pyramid Alignment Index")
        .map((item) => ({
            name: item.cadre,
            y: parseFloat(item['225_pi']),
        })))

    let a257 = data.filter(item => item.cadre !== 'Total' && item.cadre !== "Pyramid Alignment Index")
        .map((item) => ({
            name: item.cadre,
            y: parseFloat(item['257_pi']),
        }))

    let b257 = (a257.every(item => item.y === 0 || isNaN(item.y)) ? false : true)

    let a871 = data.filter(item => item.cadre !== 'Total' && item.cadre !== "Pyramid Alignment Index")
        .map((item) => ({
            name: item.cadre,
            y: parseFloat(item['871_pi']),
        }))

    let b871 = (a871.every(item => item.y === 0 || isNaN(item.y)) ? false : true)

    let a881 = data.filter(item => item.cadre !== 'Total' && item.cadre !== "Pyramid Alignment Index")
        .map((item) => ({
            name: item.cadre,
            y: parseFloat(item['881_pi']),
        }))

    let b881 = (a881.every(item => item.y === 0 || isNaN(item.y)) ? false : true)

    let a1115 = data.filter(item => item.cadre !== 'Total' && item.cadre !== "Pyramid Alignment Index")
        .map((item) => ({
            name: item.cadre,
            y: parseFloat(item['1115_pi']),
        }))

    let b1115 = (a1115.every(item => item.y === 0 || isNaN(item.y)) ? false : true)

    let a1165 = data.filter(item => item.cadre !== 'Total' && item.cadre !== "Pyramid Alignment Index")
        .map((item) => ({
            name: item.cadre,
            y: parseFloat(item['1165_pi']),
        }))

    let b1165 = (a1165.every(item => item.y === 0 || isNaN(item.y)) ? false : true)

    let a1375 = data.filter(item => item.cadre !== 'Total' && item.cadre !== "Pyramid Alignment Index")
        .map((item) => ({
            name: item.cadre,
            y: parseFloat(item['1375_pi']),
        }))

    let b1375 = (a1375.every(item => item.y === 0 || isNaN(item.y)) ? false : true)

    let a81587 = data.filter(item => item.cadre !== 'Total' && item.cadre !== "Pyramid Alignment Index")
        .map((item) => ({
            name: item.cadre,
            y: parseFloat(item['81587_pi']),
        }))

    let b81587 = (a81587.every(item => item.y === 0 || isNaN(item.y)) ? false : true)

    let a38380211 = data.filter(item => item.cadre !== 'Total' && item.cadre !== "Pyramid Alignment Index")
        .map((item) => ({
            name: item.cadre,
            y: parseFloat(item['38380211_pi']),
        }))

    let b38380211 = (a38380211.every(item => item.y === 0 || isNaN(item.y)) ? false : true)

    let a106940587 = data.filter(item => item.cadre !== 'Total' && item.cadre !== "Pyramid Alignment Index")
        .map((item) => ({
            name: item.cadre,
            y: parseFloat(item['106940587_pi']),
        }))

    let b106940587 = (a106940587.every(item => item.y === 0 || isNaN(item.y)) ? false : true)

    let a81651 = data.filter(item => item.cadre !== 'Total' && item.cadre !== "Pyramid Alignment Index")
        .map((item) => ({
            name: item.cadre,
            y: parseFloat(item['81651_pi']),
        }))

    let b81651 = (a81651.every(item => item.y === 0 || isNaN(item.y)) ? false : true)

    let a2889 = data.filter(item => item.cadre !== 'Total' && item.cadre !== "Pyramid Alignment Index")
        .map((item) => ({
            name: item.cadre,
            y: parseFloat(item['2889_pi']),
        }))

    let b2889 = (a2889.every(item => item.y === 0 || isNaN(item.y)) ? false : true)

    let a3129 = data.filter(item => item.cadre !== 'Total' && item.cadre !== "Pyramid Alignment Index")
        .map((item) => ({
            name: item.cadre,
            y: parseFloat(item['3129_pi']),
        }))

    let b3129 = (a3129.every(item => item.y === 0 || isNaN(item.y)) ? false : true)
    console.log(a3129)

    let a4452476 = data.filter(item => item.cadre !== 'Total' && item.cadre !== "Pyramid Alignment Index")
        .map((item) => ({
            name: item.cadre,
            y: parseFloat(item['4452476_pi']),
        }))

    let b4452476 = (a4452476.every(item => item.y === 0 || isNaN(item.y)) ? false : true)

    let a846041 = data.filter(item => item.cadre !== 'Total' && item.cadre !== "Pyramid Alignment Index")
        .map((item) => ({
            name: item.cadre,
            y: parseFloat(item['846041_pi']),
        }))

    let b846041 = (a846041.every(item => item.y === 0 || isNaN(item.y)) ? false : true)

    let a3887 = data.filter(item => item.cadre !== 'Total' && item.cadre !== "Pyramid Alignment Index")
        .map((item) => ({
            name: item.cadre,
            y: parseFloat(item['3887_pi']),
        }))

    let b3887 = (a3887.every(item => item.y === 0 || isNaN(item.y)) ? false : true)

    let a107342187 = data.filter(item => item.cadre !== 'Total' && item.cadre !== "Pyramid Alignment Index")
        .map((item) => ({
            name: item.cadre,
            y: parseFloat(item['107342187_pi']),
        }))

    let b107342187 = (a107342187.every(item => item.y === 0 || isNaN(item.y)) ? false : true)

    let a81825 = data.filter(item => item.cadre !== 'Total' && item.cadre !== "Pyramid Alignment Index")
        .map((item) => ({
            name: item.cadre,
            y: parseFloat(item['81825_pi']),
        }))

    let b81825 = (a81825.every(item => item.y === 0 || isNaN(item.y)) ? false : true)

    let a4455 = data.filter(item => item.cadre !== 'Total' && item.cadre !== "Pyramid Alignment Index")
        .map((item) => ({
            name: item.cadre,
            y: parseFloat(item['4455_pi']),
        }))

    let b4455 = (a4455.every(item => item.y === 0 || isNaN(item.y)) ? false : true)

    let a112875977 = data.filter(item => item.cadre !== 'Total' && item.cadre !== "Pyramid Alignment Index")
        .map((item) => ({
            name: item.cadre,
            y: parseFloat(item['112875977_pi']),
        }))

    let b112875977 = (a112875977.every(item => item.y === 0 || isNaN(item.y)) ? false : true)

    let a1561 = data.filter(item => item.cadre !== 'Total' && item.cadre !== "Pyramid Alignment Index")
        .map((item) => ({
            name: item.cadre,
            y: parseFloat(item['1561_pi']),
        }))

    let b1561 = (a1561.every(item => item.y === 0 || isNaN(item.y)) ? false : true)

    let a123454586 = data.filter(item => item.cadre !== 'Total' && item.cadre !== "Pyramid Alignment Index")
        .map((item) => ({
            name: item.cadre,
            y: parseFloat(item['123454586_pi']),
        }))

    let b123454586 = (a123454586.every(item => item.y === 0 || isNaN(item.y)) ? false : true)

    let a4935 = data.filter(item => item.cadre !== 'Total' && item.cadre !== "Pyramid Alignment Index")
        .map((item) => ({
            name: item.cadre,
            y: parseFloat(item['4935_pi']),
        }))

    let b4935 = (a4935.every(item => item.y === 0 || isNaN(item.y)) ? false : true)

    let a4937 = data.filter(item => item.cadre !== 'Total' && item.cadre !== "Pyramid Alignment Index")
        .map((item) => ({
            name: item.cadre,
            y: parseFloat(item['4937_pi']),
        }))

    let b4937 = (a4937.every(item => item.y === 0 || isNaN(item.y)) ? false : true)

    let a5201 = data.filter(item => item.cadre !== 'Total' && item.cadre !== "Pyramid Alignment Index")
        .map((item) => ({
            name: item.cadre,
            y: parseFloat(item['5201_pi']),
        }))

    let b5201 = (a5201.every(item => item.y === 0 || isNaN(item.y)) ? false : true)

    let a5211 = data.filter(item => item.cadre !== 'Total' && item.cadre !== "Pyramid Alignment Index")
        .map((item) => ({
            name: item.cadre,
            y: parseFloat(item['5211_pi']),
        }))

    let b5211 = (a5211.every(item => item.y === 0 || isNaN(item.y)) ? false : true)

    let a5269 = data.filter(item => item.cadre !== 'Total' && item.cadre !== "Pyramid Alignment Index")
        .map((item) => ({
            name: item.cadre,
            y: parseFloat(item['5269_pi']),
        }))

    let b5269 = (a5269.every(item => item.y === 0 || isNaN(item.y)) ? false : true)

    let a114159851 = data.filter(item => item.cadre !== 'Total' && item.cadre !== "Pyramid Alignment Index")
        .map((item) => ({
            name: item.cadre,
            y: parseFloat(item['114159851_pi']),
        }))

    let b114159851 = (a114159851.every(item => item.y === 0 || isNaN(item.y)) ? false : true)

    let a72292702 = data.filter(item => item.cadre !== 'Total' && item.cadre !== "Pyramid Alignment Index")
        .map((item) => ({
            name: item.cadre,
            y: parseFloat(item['72292702_pi']),
        }))

    let b72292702 = (a72292702.every(item => item.y === 0 || isNaN(item.y)) ? false : true)

    let a999 = data.filter(item => item.cadre !== 'Total' && item.cadre !== "Pyramid Alignment Index")
        .map((item) => ({
            name: item.cadre,
            y: parseFloat(item['999_pi']),
        }))

    let b999 = (a999.every(item => item.y === 0 || isNaN(item.y)) ? false : true)


    useEffect(() => {
        if (mainData.length > 0) {

            console.log("in line 29------");
            console.log(mainData[0])

            const obj = {};

            for (let i = 0; i < Header.length; i++) {
                console.log(Header[i]["value"])
                let mainDataKeys = JSON.parse(JSON.stringify(Object.keys(mainData[0])));

                let arr = ["cadre", "ideal"];

                if ((arr).includes((Header[i]["id"])) == false) {
                    console.log("in line 40-------");
                    console.log(Header[i]["value"]);
                    console.log(mainDataKeys)
                    setFilter(mainDataKeys)
                    let filteredKeys = mainDataKeys.filter(d => d.includes(Header[i]["id"]));
                    console.log(filteredKeys)

                    for (let j = 0; j < filteredKeys.length; j++) {
                        obj[filteredKeys[j]] = j == 0 ? Header[i]["value"] : "";
                    }


                    console.log("in lien 42----");
                    console.log(filteredKeys)
                } else {
                    obj[Header[i]["id"]] = Header[i]["value"];
                }
            }

            let headerD = [];
            headerD.push(obj);

            const nObj = {}

            Object.keys(obj).forEach(d => {
                if (d.includes("pi")) {
                    nObj[d] = "pi"
                } else if (d.includes("count")) {
                    nObj[d] = "count"
                } else {
                    nObj[d] = obj[d];
                }
            })

            headerD.push(nObj);
            console.log(headerD)
            for (let i = 0; i < headerD.length; i++) {
                headerGroup = (
                    <ColumnGroup>
                        <Row>
                            if(headerD[i]["cadre"])
                            {
                                <Column header={"Cadre"} rowSpan={2} /> //Cadre
                            }
                            else if(headerD[i]["ideal"])
                            {
                                <Column header={"Ideal"} rowSpan={2} /> //Ideal
                            }
                            else
                            {
                                <Column
                                    // header={Header[i]["value"]}
                                    colSpan={2} />
                            }
                        </Row>
                        <Row>
                            if ((headerD[i]).includes("pi") == true){
                                <Column header="PI" colSpan={1} />
                            }
                            if ((headerD[i]).includes("count") == true){
                                <Column header="Count" colSpan={1} />
                            }
                        </Row>
                    </ColumnGroup>

                );
            }


            setHeaderDat(obj);
            setHeaderData(
                () => {
                    return <ColumnGroup>
                        <Row>
                            {Object.keys(obj).map(ele => obj[ele] != "" &&
                                <Column
                                    header={obj[ele]}
                                    rowSpan={(["Cadre", "Ideal"]).includes(obj[ele]) ? 2 : ""}
                                    colSpan={((["Cadre", "Ideal"]).includes(obj[ele]) == false) ? 2 : ""}
                                    style={{ textAlign: 'center',overflow: 'hidden', textOverflow: 'ellipsis' }}
                                />)}
                        </Row>
                        <Row>
                            {Object.keys(obj).map(ele => ((["Cadre", "Ideal"]).includes(obj[ele]) == false) && <Column
                                header={ele.includes("_pi") ? "PI" : "Count"}
                                style={{ textAlign: 'center'}}
                            />)}
                        </Row>
                    </ColumnGroup>
                }
            );
            const updatedBodyData = mainData.map(data => {
                const updatedData = {};
                for (const key in data) {
                    if (key.includes('_pi')) {
                        updatedData[key] = <strong>{data[key].toFixed(1)} %</strong>;;
                    }
                    else if (key.includes('ideal')) {
                        updatedData[key] = data[key] + ' %';
                    } else {
                        updatedData[key] = data[key];
                    }
                }
                return updatedData;
            });
            setBodyData(updatedBodyData);
        }
    }, [mainData]);

    const dynamicColumns = Object.keys(headerDat).map((col, i) => {
        console.log(headerData)
        let columnHeader;
        if (col === "cadre") {
            columnHeader = (
                <Column rowSpan={2} key={col} field={col} />
            );
        } else if (col === "ideal") {
            columnHeader = (
                <Column rowSpan={2} key={col} field={col} />
            );
        } else if (col.includes("_pi") || col.includes("_count")) {
            columnHeader = (
                <Column key={col} field={col} />
            );
        }
        return columnHeader;
    });


    ////////////////////////////////////////////////////////////////////////////////////////////////////
    const chartOptionsOne = {
        chart: {
            type: 'pyramid',
        },
        title: {
            text: 'Ideal',
            align: "center",
            style: {
              fontSize: "14px",
              fontWeight: "bold",
              fontFamily: "Lucida Sans"
            },
        },
        tooltip: {
            enabled: false
        },

        plotOptions: {
            pyramid: {
                reversed: true,
            },
            series: {
                dataLabels: {
                    enabled: true,
                    format: '<b>{point.name}({point.y:,.1f})%</b>',
                    softConnector: true
                },
                center: ["35px", "50%"],
        width: "60px",
        margin: "0",
        showInLegend: true,
            },
        },
        credits: {
            enabled: false
        },
        legend: {
            enabled: false,
            verticalAlign: 'bottom',
            align: 'center',
        },
        series: [{
            data: data.filter(item => item.cadre !== 'Total' && item.cadre !== "Pyramid Alignment Index")
                .map((item) => ({
                    name: item.cadre,
                    y: parseFloat(item.ideal),
                })).reverse(),
        }],
    }

    const chartOptionsTwo = {
        chart: {
            type: 'pyramid',
        },
        title: {
            text: 'Amrith Kaur-Maldonado',
            align: "center",
            style: {
              fontSize: "14px",
              fontWeight: "bold",
              fontFamily: "Lucida Sans"
            },
        },
        tooltip: {
            enabled: false
        },

        plotOptions: {
            pyramid: {
                reversed: true,
            },
            series: {
                dataLabels: {
                    enabled: true,
                    format: '<b>{point.name}({point.y:,.1f})%</b>',
                    softConnector: true
                },
                center: ["35px", "50%"],
        width: "60px",
        margin: "0",
        showInLegend: true,
            },
        },
        credits: {
            enabled: false
        },
        legend: {
            enabled: false,
            verticalAlign: 'bottom',
            align: 'center',
        },
        series: [{
            data: data.filter(item => item.cadre !== 'Total' && item.cadre !== "Pyramid Alignment Index")
                .map((item) => ({
                    name: item.cadre,
                    y: parseFloat(item['225_pi']),
                })).reverse(),
        }],
    };

    const chartOptionsThree = {
        chart: {
            type: 'pyramid',
        },
        title: {
            text: 'Andrew Blank',
            align: "center",
            style: {
              fontSize: "14px",
              fontWeight: "bold",
              fontFamily: "Lucida Sans"
            },
        },
        tooltip: {
            enabled: false
        },
        plotOptions: {
            pyramid: {
                reversed: true,
            },
            series: {
                dataLabels: {
                    enabled: true,
                    format: '<b>{point.name}({point.y:,.1f})%</b>',
                    softConnector: true
                },
                center: ["35px", "50%"],
        width: "60px",
        margin: "0",
        showInLegend: true,
            },
        },
        credits: {
            enabled: false
        },
        legend: {
            enabled: false,
            verticalAlign: 'bottom',
            align: 'center',
        },
        series: [{
            data: data.filter(item => item.cadre !== 'Total' && item.cadre !== "Pyramid Alignment Index")
                .map((item) => ({
                    name: item.cadre,
                    y: parseFloat(item['257_pi']),
                })),
        }],
    };

    const chartOptionsFour = {
        chart: {
            type: 'pyramid',
        },
        title: {
            text: 'Debasish Behera',
            align: "center",
            style: {
              fontSize: "14px",
              fontWeight: "bold",
              fontFamily: "Lucida Sans"
            },
        },
        tooltip: {
            enabled: false
        },
        plotOptions: {
            pyramid: {
                reversed: true,
            },
            series: {
                dataLabels: {
                    enabled: true,
                    format: '<b>{point.name}({point.y:,.1f})%</b>',
                    softConnector: true
                },
                center: ["35px", "50%"],
        width: "60px",
        margin: "0",
        showInLegend: true,
            },
        },
        credits: {
            enabled: false
        },
        legend: {
            enabled: false,
            verticalAlign: 'bottom',
            align: 'center',
        },
        series: [{
            data: data.filter(item => item.cadre !== 'Total' && item.cadre !== "Pyramid Alignment Index")
                .map((item) => ({
                    name: item.cadre,
                    y: parseFloat(item['871_pi']),
                })).reverse(),
        }],
    };

    const chartOptionsFive = {
        chart: {
            type: 'pyramid',
        },
        title: {
            text: 'Deepak Goel',
            align: "center",
            style: {
              fontSize: "14px",
              fontWeight: "bold",
              fontFamily: "Lucida Sans"
            },
        },
        tooltip: {
            enabled: false
        },
        plotOptions: {
            pyramid: {
                reversed: true,
            },
            series: {
                dataLabels: {
                    enabled: true,
                    format: '<b>{point.name}({point.y:,.1f})%</b>',
                    softConnector: true
                },
                center: ["35px", "50%"],
        width: "60px",
        margin: "0",
        showInLegend: true,
            },
        },
        credits: {
            enabled: false
        },
        legend: {
            enabled: false,
            verticalAlign: 'bottom',
            align: 'center',
        },
        series: [{
            data: data.filter(item => item.cadre !== 'Total' && item.cadre !== "Pyramid Alignment Index")
                .map((item) => ({
                    name: item.cadre,
                    y: parseFloat(item['881_pi']),
                })).reverse(),
        }],
    };

    const chartOptionsSix = {
        chart: {
            type: 'pyramid',
        },
        title: {
            text: 'Girish Konnur',
            align: "center",
      style: {
        fontSize: "14px",
        fontWeight: "bold",
        fontFamily: "Lucida Sans"
      },
        },
        tooltip: {
            enabled: false
        },
        plotOptions: {
            pyramid: {
                reversed: true,
            },
            series: {
                dataLabels: {
                    enabled: true,
                    format: '<b>{point.name}({point.y:,.1f})%</b>',
                    softConnector: true
                },
                center: ["35px", "50%"],
        width: "60px",
        margin: "0",
        showInLegend: true,
            },
        },
        credits: {
            enabled: false
        },
        legend: {
            enabled: false,
            verticalAlign: 'bottom',
            align: 'center',
        },
        series: [{
            data: data.filter(item => item.cadre !== 'Total' && item.cadre !== "Pyramid Alignment Index")
                .map((item) => ({
                    name: item.cadre,
                    y: parseFloat(item['1115_pi']),
                })).reverse(),
        }],
    };

    const chartOptionsSeven = {
        chart: {
            type: 'pyramid',
        },
        title: {
            text: 'Greg Kordelski',
            align: "center",
            style: {
              fontSize: "14px",
              fontWeight: "bold",
              fontFamily: "Lucida Sans"
            },
        },
        tooltip: {
            enabled: false
        },
        plotOptions: {
            pyramid: {
                reversed: true,
            },
            series: {
                dataLabels: {
                    enabled: true,
                    format: '<b>{point.name}({point.y:,.1f})%</b>',
                    softConnector: true
                },
                center: ["35px", "50%"],
        width: "60px",
        margin: "0",
        showInLegend: true,
            },
        },
        credits: {
            enabled: false
        },
        legend: {
            enabled: false,
            verticalAlign: 'bottom',
            align: 'center',
        },
        series: [{
            data: data.filter(item => item.cadre !== 'Total' && item.cadre !== "Pyramid Alignment Index")
                .map((item) => ({
                    name: item.cadre,
                    y: parseFloat(item['1165_pi']),
                })).reverse(),
        }],
    };

    const chartOptionsEight = {
        chart: {
            type: 'pyramid',
        },
        title: {
            text: 'Jagadeeswara Reddy Katamareddy',
            align: "center",
      style: {
        fontSize: "14px",
        fontWeight: "bold",
        fontFamily: "Lucida Sans"
      },
        },
        tooltip: {
            enabled: false
        },
        plotOptions: {
            pyramid: {
                reversed: true,
            },
            series: {
                dataLabels: {
                    enabled: true,
                    format: '<b>{point.name}({point.y:,.1f})%</b>',
                    softConnector: true
                },
                center: ["35px", "50%"],
        width: "60px",
        margin: "0",
        showInLegend: true,
            },
        },
        credits: {
            enabled: false
        },
        legend: {
            enabled: false,
            verticalAlign: 'bottom',
            align: 'center',
        },
        series: [{
            data: data.filter(item => item.cadre !== 'Total' && item.cadre !== "Pyramid Alignment Index")
                .map((item) => ({
                    name: item.cadre,
                    y: parseFloat(item['1375_pi']),
                })).reverse(),
        }],
    };

    const chartOptionsNine = {
        chart: {
            type: 'pyramid',
        },
        title: {
            text: 'Jason Sabotka',
            align: "center",
      style: {
        fontSize: "14px",
        fontWeight: "bold",
        fontFamily: "Lucida Sans"
      },
        },
        tooltip: {
            enabled: false
        },
        plotOptions: {
            pyramid: {
                reversed: true,
            },
            series: {
                dataLabels: {
                    enabled: true,
                    format: '<b>{point.name}({point.y:,.1f})%</b>',
                    softConnector: true
                },
                center: ["35px", "50%"],
        width: "60px",
        margin: "0",
        showInLegend: true,
            },
        },
        credits: {
            enabled: false
        },
        legend: {
            enabled: false,
            verticalAlign: 'bottom',
            align: 'center',
        },
        series: [{
            data: data.filter(item => item.cadre !== 'Total' && item.cadre !== "Pyramid Alignment Index")
                .map((item) => ({
                    name: item.cadre,
                    y: parseFloat(item['81587_pi']),
                })).reverse(),
        }],
    };

    const chartOptionsTen = {
        chart: {
            type: 'pyramid',
        },
        title: {
            text: 'Kishan Rao Alwapuram',
            align: "center",
      style: {
        fontSize: "14px",
        fontWeight: "bold",
        fontFamily: "Lucida Sans"
      },
        },
        tooltip: {
            enabled: false
        },
        plotOptions: {
            pyramid: {
                reversed: true,
            },
            series: {
                dataLabels: {
                    enabled: true,
                    format: '<b>{point.name}({point.y:,.1f})%</b>',
                    softConnector: true
                },
                center: ["35px", "50%"],
        width: "60px",
        margin: "0",
        showInLegend: true,
            },
        },
        credits: {
            enabled: false
        },
        legend: {
            enabled: false,
            verticalAlign: 'bottom',
            align: 'center',
        },
        series: [{
            data: data.filter(item => item.cadre !== 'Total' && item.cadre !== "Pyramid Alignment Index")
                .map((item) => ({
                    name: item.cadre,
                    y: parseFloat(item['38380211_pi']),
                })).reverse(),
        }],
    };

    const chartOptionsEleven = {
        chart: {
            type: 'pyramid',
        },
        title: {
            text: 'Malreddy Kotireddy',
            align: "center",
            style: {
              fontSize: "14px",
              fontWeight: "bold",
              fontFamily: "Lucida Sans"
            },
        },
        tooltip: {
            enabled: false
        },
        plotOptions: {
            pyramid: {
                reversed: true,
            },
            series: {
                dataLabels: {
                    enabled: true,
                    format: '<b>{point.name}({point.y:,.1f})%</b>',
                    softConnector: true
                },
                center: ["35px", "50%"],
        width: "60px",
        margin: "0",
        showInLegend: true,
            },
        },
        credits: {
            enabled: false
        },
        legend: {
            enabled: false,
            verticalAlign: 'bottom',
            align: 'center',
        },
        series: [{
            data: data.filter(item => item.cadre !== 'Total' && item.cadre !== "Pyramid Alignment Index")
                .map((item) => ({
                    name: item.cadre,
                    y: parseFloat(item['106940587_pi']),
                })).reverse(),
        }],
    };

    const chartOptionsTwelve = {
        chart: {
            type: 'pyramid',
        },
        title: {
            text: 'Mario Bourassa',
            align: "center",
            style: {
              fontSize: "14px",
              fontWeight: "bold",
              fontFamily: "Lucida Sans"
            },
        },
        tooltip: {
            enabled: false
        },
        plotOptions: {
            pyramid: {
                reversed: true,
            },
            series: {
                dataLabels: {
                    enabled: true,
                    format: '<b>{point.name}({point.y:,.1f})%</b>',
                    softConnector: true
                },
                center: ["35px", "50%"],
        width: "60px",
        margin: "0",
        showInLegend: true,
            },
        },
        credits: {
            enabled: false
        },
        legend: {
            enabled: false,
            verticalAlign: 'bottom',
            align: 'center',
        },
        series: [{
            data: data.filter(item => item.cadre !== 'Total' && item.cadre !== "Pyramid Alignment Index")
                .map((item) => ({
                    name: item.cadre,
                    y: parseFloat(item['81651_pi']),
                })).reverse(),
        }],
    };

    const chartOptionsThirteen = {
        chart: {
            type: 'pyramid',
        },
        title: {
            text: 'Prameela Mukkavilli',
            align: "center",
            style: {
              fontSize: "14px",
              fontWeight: "bold",
              fontFamily: "Lucida Sans"
            },
        },
        tooltip: {
            enabled: false
        },
        plotOptions: {
            pyramid: {
                reversed: true,
            },
            series: {
                dataLabels: {
                    enabled: true,
                    format: '<b>{point.name}({point.y:,.1f})%</b>',
                    softConnector: true
                },
                center: ["35px", "50%"],
        width: "60px",
        margin: "0",
        showInLegend: true,
            },
        },
        credits: {
            enabled: false
        },
        legend: {
            enabled: false,
            verticalAlign: 'bottom',
            align: 'center',
        },
        series: [{
            data: data.filter(item => item.cadre !== 'Total' && item.cadre !== "Pyramid Alignment Index")
                .map((item) => ({
                    name: item.cadre,
                    y: parseFloat(item['2889_pi']),
                })).reverse(),
        }],
    };
    const chartOptionsFourteen = {
        chart: {
            type: 'pyramid',
        },
        title: {
            text: 'Raghav Mathur',
            align: "center",
      style: {
        fontSize: "14px",
        fontWeight: "bold",
        fontFamily: "Lucida Sans"
      },
        },
        tooltip: {
            enabled: false
        },
        plotOptions: {
            pyramid: {
                reversed: true,
            },
            series: {
                dataLabels: {
                    enabled: true,
                    format: '<b>{point.name}({point.y:,.1f})%</b>',
                    softConnector: true
                },
                center: ["35px", "50%"],
        width: "60px",
        margin: "0",
        showInLegend: true,
            },
        },
        credits: {
            enabled: false
        },
        legend: {
            enabled: false,
            verticalAlign: 'bottom',
            align: 'center',
        },
        series: [{
            data: data.filter(item => item.cadre !== 'Total' && item.cadre !== "Pyramid Alignment Index")
                .map((item) => ({
                    name: item.cadre,
                    y: parseFloat(item['3129_pi']),
                })).reverse(),
        }],
    };

    const chartOptionsFifteen = {
        chart: {
            type: 'pyramid',
        },
        title: {
            text: 'Rajeswari Kanupuru',
            align: "center",
      style: {
        fontSize: "14px",
        fontWeight: "bold",
        fontFamily: "Lucida Sans"
      },
        },
        tooltip: {
            enabled: false
        },
        plotOptions: {
            pyramid: {
                reversed: true,
            },
            series: {
                dataLabels: {
                    enabled: true,
                    format: '<b>{point.name}({point.y:,.1f})%</b>',
                    softConnector: true
                },
                center: ["35px", "50%"],
        width: "60px",
        margin: "0",
        showInLegend: true,
            },
        },
        credits: {
            enabled: false
        },
        legend: {
            enabled: false,
            verticalAlign: 'bottom',
            align: 'center',
        },
        series: [{
            data: data.filter(item => item.cadre !== 'Total' && item.cadre !== "Pyramid Alignment Index")
                .map((item) => ({
                    name: item.cadre,
                    y: parseFloat(item['4452476_pi']),
                })).reverse(),
        }],
    };

    const chartOptionsSixteen = {
        chart: {
            type: 'pyramid',
        },
        title: {
            text: 'Rakesh Kurchkulla',
            align: "center",
            style: {
              fontSize: "14px",
              fontWeight: "bold",
              fontFamily: "Lucida Sans"
            },
        },
        tooltip: {
            enabled: false
        },
        plotOptions: {
            pyramid: {
                reversed: true,
            },
            series: {
                dataLabels: {
                    enabled: true,
                    format: '<b>{point.name}({point.y:,.1f})%</b>',
                    softConnector: true
                },
                center: ["35px", "50%"],
        width: "60px",
        margin: "0",
        showInLegend: true,
            },
        },
        credits: {
            enabled: false
        },
        legend: {
            enabled: false,
            verticalAlign: 'bottom',
            align: 'center',
        },
        series: [{
            data: data.filter(item => item.cadre !== 'Total' && item.cadre !== "Pyramid Alignment Index")
                .map((item) => ({
                    name: item.cadre,
                    y: parseFloat(item['846041_pi']),
                })).reverse(),
        }],
    };

    const chartOptionsSeventeen = {
        chart: {
            type: 'pyramid',
        },
        title: {
            text: 'Sarat Addanki',
            align: "center",
            style: {
              fontSize: "14px",
              fontWeight: "bold",
              fontFamily: "Lucida Sans"
            },
        },
        tooltip: {
            enabled: false
        },
        plotOptions: {
            pyramid: {
                reversed: true,
            },
            series: {
                dataLabels: {
                    enabled: true,
                    format: '<b>{point.name}({point.y:,.1f})%</b>',
                    softConnector: true
                },
                center: ["35px", "50%"],
        width: "60px",
        margin: "0",
        showInLegend: true,
            },
        },
        credits: {
            enabled: false
        },
        legend: {
            enabled: false,
            verticalAlign: 'bottom',
            align: 'center',
        },
        series: [{
            data: data.filter(item => item.cadre !== 'Total' && item.cadre !== "Pyramid Alignment Index")
                .map((item) => ({
                    name: item.cadre,
                    y: parseFloat(item['3887_pi']),
                })).reverse(),
        }],
    };

    const chartOptionsEighteen = {
        chart: {
            type: 'pyramid',
        },
        title: {
            text: 'Sateesh Cherukuri',
            align: "center",
            style: {
              fontSize: "14px",
              fontWeight: "bold",
              fontFamily: "Lucida Sans"
            },
        },
        tooltip: {
            enabled: false
        },
        plotOptions: {
            pyramid: {
                reversed: true,
            },
            series: {
                dataLabels: {
                    enabled: true,
                    format: '<b>{point.name}({point.y:,.1f})%</b>',
                    softConnector: true
                },
                center: ["35px", "50%"],
        width: "60px",
        margin: "0",
        showInLegend: true,
            },
        },
        credits: {
            enabled: false
        },
        legend: {
            enabled: false,
            verticalAlign: 'bottom',
            align: 'center',
        },
        series: [{
            data: data.filter(item => item.cadre !== 'Total' && item.cadre !== "Pyramid Alignment Index")
                .map((item) => ({
                    name: item.cadre,
                    y: parseFloat(item['107342187_pi']),
                })).reverse(),
        }],
    };

    const chartOptionsNineteen = {
        chart: {
            type: 'pyramid',
        },
        title: {
            text: 'Shobhit Gupta',
            align: "center",
            style: {
              fontSize: "14px",
              fontWeight: "bold",
              fontFamily: "Lucida Sans"
            },
        },
        tooltip: {
            enabled: false
        },
        plotOptions: {
            pyramid: {
                reversed: true,
            },
            series: {
                dataLabels: {
                    enabled: true,
                    format: '<b>{point.name}({point.y:,.1f})%</b>',
                    softConnector: true
                },
                center: ["35px", "50%"],
        width: "60px",
        margin: "0",
        showInLegend: true,
            },
        },
        credits: {
            enabled: false
        },
        legend: {
            enabled: false,
            verticalAlign: 'bottom',
            align: 'center',
        },
        series: [{
            data: data.filter(item => item.cadre !== 'Total' && item.cadre !== "Pyramid Alignment Index")
                .map((item) => ({
                    name: item.cadre,
                    y: parseFloat(item['81825_pi']),
                })).reverse(),
        }],
    };

    const chartOptionsTwenty = {
        chart: {
            type: 'pyramid',
        },
        title: {
            text: 'Sravanthi Chowdary Movva',
            align: "center",
            style: {
              fontSize: "14px",
              fontWeight: "bold",
              fontFamily: "Lucida Sans"
            },
        },
        tooltip: {
            enabled: false
        },
        plotOptions: {
            pyramid: {
                reversed: true,
            },
            series: {
                dataLabels: {
                    enabled: true,
                    format: '<b>{point.name}({point.y:,.1f})%</b>',
                    softConnector: true
                },
                center: ["35px", "50%"],
        width: "60px",
        margin: "0",
        showInLegend: true,
            },
        },
        credits: {
            enabled: false
        },
        legend: {
            enabled: false,
            verticalAlign: 'bottom',
            align: 'center',
        },
        series: [{
            data: data.filter(item => item.cadre !== 'Total' && item.cadre !== "Pyramid Alignment Index")
                .map((item) => ({
                    name: item.cadre,
                    y: parseFloat(item['4455_pi']),
                })).reverse(),
        }],
    };

    const chartOptionsTwentyone = {
        chart: {
            type: 'pyramid',
        },
        title: {
            text: 'Sriharsha Kotekar Shridhara',
            align: "center",
            style: {
              fontSize: "14px",
              fontWeight: "bold",
              fontFamily: "Lucida Sans"
            },
        },
        tooltip: {
            enabled: false
        },
        plotOptions: {
            pyramid: {
                reversed: true,
            },
            series: {
                dataLabels: {
                    enabled: true,
                    format: '<b>{point.name}({point.y:,.1f})%</b>',
                    softConnector: true
                },
                center: ["35px", "50%"],
        width: "60px",
        margin: "0",
        showInLegend: true,
            },
        },
        credits: {
            enabled: false
        },
        legend: {
            enabled: false,
            verticalAlign: 'bottom',
            align: 'center',
        },
        series: [{
            data: data.filter(item => item.cadre !== 'Total' && item.cadre !== "Pyramid Alignment Index")
                .map((item) => ({
                    name: item.cadre,
                    y: parseFloat(item['112875977_pi']),
                })).reverse(),
        }],
    };

    const chartOptionsTwentytwo = {
        chart: {
            type: 'pyramid',
        },
        title: {
            text: 'Srinivas Kalyan Chakravarthy Ganjam',
            align: "center",
      style: {
        fontSize: "14px",
        fontWeight: "bold",
        fontFamily: "Lucida Sans"
      },
        },
        tooltip: {
            enabled: false
        },
        plotOptions: {
            pyramid: {
                reversed: true,
            },
            series: {
                dataLabels: {
                    enabled: true,
                    format: '<b>{point.name}({point.y:,.1f})%</b>',
                    softConnector: true
                },
                center: ["35px", "50%"],
        width: "60px",
        margin: "0",
        showInLegend: true,
            },
        },
        credits: {
            enabled: false
        },
        legend: {
            enabled: false,
            verticalAlign: 'bottom',
            align: 'center',
        },
        series: [{
            data: data.filter(item => item.cadre !== 'Total' && item.cadre !== "Pyramid Alignment Index")
                .map((item) => ({
                    name: item.cadre,
                    y: parseFloat(item['1561_pi']),
                })).reverse(),
        }],
    };

    const chartOptionsTwentythree = {
        chart: {
            type: 'pyramid',
        },
        title: {
            text: 'Sundar Rajan Srinivasan',
            align: "center",
            style: {
              fontSize: "14px",
              fontWeight: "bold",
              fontFamily: "Lucida Sans"
            },
        },
        tooltip: {
            enabled: false
        },
        plotOptions: {
            pyramid: {
                reversed: true,
            },
            series: {
                dataLabels: {
                    enabled: true,
                    format: '<b>{point.name}({point.y:,.1f})%</b>',
                    softConnector: true
                },
                center: ["35px", "50%"],
        width: "60px",
        margin: "0",
        showInLegend: true,
            },
        },
        credits: {
            enabled: false
        },
        legend: {
            enabled: false,
            verticalAlign: 'bottom',
            align: 'center',
        },
        series: [{
            data: data.filter(item => item.cadre !== 'Total' && item.cadre !== "Pyramid Alignment Index")
                .map((item) => ({
                    name: item.cadre,
                    y: parseFloat(item['123454586_pi']),
                })).reverse(),
        }],
    };

    const chartOptionsTwentyfour = {
        chart: {
            type: 'pyramid',
        },
        title: {
            text: 'Suresh Babu Sabbisetti',
            align: "center",
            style: {
              fontSize: "14px",
              fontWeight: "bold",
              fontFamily: "Lucida Sans"
            },
        },
        tooltip: {
            enabled: false
        },
        plotOptions: {
            pyramid: {
                reversed: true,
            },
            series: {
                dataLabels: {
                    enabled: true,
                    format: '<b>{point.name}({point.y:,.1f})%</b>',
                    softConnector: true
                },
                center: ["35px", "50%"],
        width: "60px",
        margin: "0",
        showInLegend: true,
            },
        },
        credits: {
            enabled: false
        },
        legend: {
            enabled: false,
            verticalAlign: 'bottom',
            align: 'center',
        },
        series: [{
            data: data.filter(item => item.cadre !== 'Total' && item.cadre !== "Pyramid Alignment Index")
                .map((item) => ({
                    name: item.cadre,
                    y: parseFloat(item['4935_pi']),
                })).reverse(),
        }],
    };

    const chartOptionsTwentyfive = {
        chart: {
            type: 'pyramid',
        },
        title: {
            text: 'Suresh Sakamuri',
            align: "center",
            style: {
              fontSize: "14px",
              fontWeight: "bold",
              fontFamily: "Lucida Sans"
            },
        },
        tooltip: {
            enabled: false
        },
        plotOptions: {
            pyramid: {
                reversed: true,
            },
            series: {
                dataLabels: {
                    enabled: true,
                    format: '<b>{point.name}({point.y:,.1f})%</b>',
                    softConnector: true
                },
                center: ["35px", "50%"],
        width: "60px",
        margin: "0",
        showInLegend: true,
            },
        },
        credits: {
            enabled: false
        },
        legend: {
            enabled: false,
            verticalAlign: 'bottom',
            align: 'center',
        },
        series: [{
            data: data.filter(item => item.cadre !== 'Total' && item.cadre !== "Pyramid Alignment Index")
                .map((item) => ({
                    name: item.cadre,
                    y: parseFloat(item['4937_pi']),
                })).reverse(),
        }],
    };

    const chartOptionsTwentysix = {
        chart: {
            type: 'pyramid',
        },
        title: {
            text: 'Varun Sakshi Sharma',
            align: "center",
            style: {
              fontSize: "14px",
              fontWeight: "bold",
              fontFamily: "Lucida Sans"
            },
        },
        tooltip: {
            enabled: false
        },
        plotOptions: {
            pyramid: {
                reversed: true,
            },
            series: {
                dataLabels: {
                    enabled: true,
                    format: '<b>{point.name}({point.y:,.1f})%</b>',
                    softConnector: true
                },
                center: ["35px", "50%"],
        width: "60px",
        margin: "0",
        showInLegend: true,
            },
        },
        credits: {
            enabled: false
        },
        legend: {
            enabled: false,
            verticalAlign: 'bottom',
            align: 'center',
        },
        series: [{
            data: data.filter(item => item.cadre !== 'Total' && item.cadre !== "Pyramid Alignment Index")
                .map((item) => ({
                    name: item.cadre,
                    y: parseFloat(item['5201_pi']),
                })).reverse(),
        }],
    };

    const chartOptionsTwentyseven = {
        chart: {
            type: 'pyramid',
        },
        title: {
            text: 'Vasavi Raigiri',
            align: "center",
      style: {
        fontSize: "14px",
        fontWeight: "bold",
        fontFamily: "Lucida Sans"
      },
        },
        tooltip: {
            enabled: false
        },
        plotOptions: {
            pyramid: {
                reversed: true,
            },
            series: {
                dataLabels: {
                    enabled: true,
                    format: '<b>{point.name}({point.y:,.1f})%</b>',
                    softConnector: true
                },
                center: ["35px", "50%"],
        width: "60px",
        margin: "0",
        showInLegend: true,
            },
        },
        credits: {
            enabled: false
        },
        legend: {
            enabled: false,
            verticalAlign: 'bottom',
            align: 'center',
        },
        series: [{
            data: data.filter(item => item.cadre !== 'Total' && item.cadre !== "Pyramid Alignment Index")
                .map((item) => ({
                    name: item.cadre,
                    y: parseFloat(item['5211_pi']),
                })).reverse(),
        }],
    };

    const chartOptionsTwentyeight = {
        chart: {
            type: 'pyramid',
        },
        title: {
            text: 'Venkata Chandra Sekhar Burra',
            align: "center",
            style: {
              fontSize: "14px",
              fontWeight: "bold",
              fontFamily: "Lucida Sans"
            },
        },
        tooltip: {
            enabled: false
        },
        plotOptions: {
            pyramid: {
                reversed: true,
            },
            series: {
                dataLabels: {
                    enabled: true,
                    format: '<b>{point.name}({point.y:,.1f})%</b>',
                    softConnector: true
                },
                center: ["35px", "50%"],
        width: "60px",
        margin: "0",
        showInLegend: true,
            },
        },
        credits: {
            enabled: false
        },
        legend: {
            enabled: false,
            verticalAlign: 'bottom',
            align: 'center',
        },
        series: [{
            data: data.filter(item => item.cadre !== 'Total' && item.cadre !== "Pyramid Alignment Index")
                .map((item) => ({
                    name: item.cadre,
                    y: parseFloat(item['5269_pi']),
                })).reverse(),
        }],
    };

    const chartOptionsTwentynine = {
        chart: {
            type: 'pyramid',
        },
        title: {
            text: 'Venkata Maheswara Rao Kotyada Jyothir',
            align: "center",
            style: {
              fontSize: "14px",
              fontWeight: "bold",
              fontFamily: "Lucida Sans"
            },
        },
        tooltip: {
            enabled: false
        },
        plotOptions: {
            pyramid: {
                reversed: true,
            },
            series: {
                dataLabels: {
                    enabled: true,
                    format: '<b>{point.name}({point.y:,.1f})%</b>',
                    softConnector: true
                },
                center: ["35px", "50%"],
        width: "60px",
        margin: "0",
        showInLegend: true,
            },
        },
        credits: {
            enabled: false
        },
        legend: {
            enabled: false,
            verticalAlign: 'bottom',
            align: 'center',
        },
        series: [{
            data: data.filter(item => item.cadre !== 'Total' && item.cadre !== "Pyramid Alignment Index")
                .map((item) => ({
                    name: item.cadre,
                    y: parseFloat(item['114159851_pi']),
                })).reverse(),
        }],
    };

    const chartOptionsThirty = {
        chart: {
            type: 'pyramid',
        },
        title: {
            text: 'Vicky Mehra',
            align: "center",
      style: {
        fontSize: "14px",
        fontWeight: "bold",
        fontFamily: "Lucida Sans"
      },
        },
        tooltip: {
            enabled: false
        },
        plotOptions: {
            pyramid: {
                reversed: true,
            },
            series: {
                dataLabels: {
                    enabled: true,
                    format: '<b>{point.name}({point.y:,.1f})%</b>',
                    softConnector: true
                },
                center: ["35px", "50%"],
        width: "60px",
        margin: "0",
        showInLegend: true,
            },
        },
        credits: {
            enabled: false
        },
        legend: {
            enabled: false,
            verticalAlign: 'bottom',
            align: 'center',
        },
        series: [{
            data: data.filter(item => item.cadre !== 'Total' && item.cadre !== "Pyramid Alignment Index")
                .map((item) => ({
                    name: item.cadre,
                    y: parseFloat(item['72292702_pi']),
                })).reverse(),
        }],
    };

    const chartOptionsThirtyone = {
        chart: {
            type: 'pyramid',
        },
        title: {
            text: 'UnAssigned',
            align: "center",
            style: {
              fontSize: "14px",
              fontWeight: "bold",
              fontFamily: "Lucida Sans"
            },
        },
        tooltip: {
            enabled: false
        },
        plotOptions: {
            pyramid: {
                reversed: true,
            },
            series: {
                dataLabels: {
                    enabled: true,
                    format: '<b>{point.name}({point.y:,.1f})%</b>',
                    softConnector: true
                },
                center: ["35px", "50%"],
        width: "60px",
        margin: "0",
        showInLegend: true,
            },
        },
        credits: {
            enabled: false
        },
        legend: {
            enabled: false,
            verticalAlign: 'bottom',
            align: 'center',
        },
        series: [{
            data: data.filter(item => item.cadre !== 'Total' && item.cadre !== "Pyramid Alignment Index")
                .map((item) => ({
                    name: item.cadre,
                    y: parseFloat(item['999_pi']),
                })).reverse(),
        }],
    };

    //////////////////////////////////////////////////////////////////////////////////////////////////////////

    return (
        <div>
            <div className="card">
                {(headerData != null && bodyData.length > 0) ? (
                    <DataTable
                        headerColumnGroup={headerData}
                        value={bodyData}
                        showGridlines
                        rows={15}
                        rowHover={true}
                        dataKey="id"
                        responsiveLayout="scroll"
                        emptyMessage="No Records found."
                    >

                        {dynamicColumns}
                    </DataTable>
                ) : ""}
            </div>
            <div className="row">
                <div className="legendContainer mt-3">
                    <strong>Legends :</strong>
                    <div className="legend skyblue">
                        <div className="legendCircle"></div>
                        <div className="legendTxt"><strong>T1</strong>- Trainees,</div>
                    </div>
                    <div className="legend darkgray">
                        <div className="legendCircle"></div>
                        <div className="legendTxt"><strong>E1</strong>- Associate Engineers,</div>
                    </div>
                    <div className="legend lightgreen">
                        <div className="legendCircle"></div>
                        <div className="legendTxt"><strong>E2</strong>- Engineers,</div>
                    </div>
                    <div className="legend lightorange">
                        <div className="legendCircle"></div>
                        <div className="legendTxt"><strong>E3</strong>- Senior Engineers,</div>
                    </div>
                    <div className="legend purple">
                        <div className="legendCircle"></div>
                        <div className="legendTxt"><strong>L</strong>- Leads,</div>
                    </div>
                    <div className="legend crimson">
                        <div className="legendCircle"></div>
                        <div className="legendTxt"><strong>M</strong>- Managers,</div>
                    </div>
                    <div className="legend golden">
                        <div className="legendCircle"></div>
                        <div className="legendTxt"><strong>G</strong>- Delivery Managers</div>
                    </div>
                </div>
            </div>
            <div className=" pyramids">
                    <HighchartsReact highcharts={Highcharts} options={chartOptionsOne}   />

                {filter.includes("225_pi") ?
                    <>
                        {b225 == true ?
                                <HighchartsReact highcharts={Highcharts} options={chartOptionsTwo}   />
                            : ""
                        }
                    </> : ""}

                {filter.includes("257_pi") ?
                    <>
                        {b257 == true ?
                             
                                <HighchartsReact highcharts={Highcharts} options={chartOptionsThree}   />
                             : ""
                        }
                    </> : ""}

                {filter.includes("871_pi") ?
                    <>
                        {b871 == true ?
                             
                                <HighchartsReact highcharts={Highcharts} options={chartOptionsFour}   />
                             : ""
                        }
                    </> : ""}



                {filter.includes("881_pi") ?
                    <>
                        {b881 == true ?
                             
                                <HighchartsReact highcharts={Highcharts} options={chartOptionsFive}   />
                             : ""
                        }
                    </> : ""}

                {filter.includes("1115_pi") ?
                    <>
                        {b1115 == true ?
                             
                                <HighchartsReact highcharts={Highcharts} options={chartOptionsSix}   />
                             : ""
                        }
                    </> : ""}

                {filter.includes("1165_pi") ?
                    <>
                        {b1165 == true ?
                             
                                <HighchartsReact highcharts={Highcharts} options={chartOptionsSeven}   />
                             : ""
                        }
                    </> : ""}

                {filter.includes("1375_pi") ?
                    <>
                        {b1375 == true ?
                             
                                <HighchartsReact highcharts={Highcharts} options={chartOptionsEight}   />
                             : ""
                        }
                    </> : ""}

                {filter.includes("81587_pi") ?
                    <>
                        {b81587 == true ?
                             
                                <HighchartsReact highcharts={Highcharts} options={chartOptionsNine}   />
                             : ""
                        }
                    </> : ""}

                {filter.includes("38380211_pi") ?
                    <>
                        {b38380211 == true ?
                             
                                <HighchartsReact highcharts={Highcharts} options={chartOptionsTen}   />
                             : ""
                        }
                    </> : ""}

                {filter.includes("106940587_pi") ?
                    <>
                        {b106940587 == true ?
                             
                                <HighchartsReact highcharts={Highcharts} options={chartOptionsEleven}   />
                             : ""
                        }
                    </> : ""}

                {filter.includes("81651_pi") ?
                    <>
                        {b81651 == true ?
                             
                                <HighchartsReact highcharts={Highcharts} options={chartOptionsTwelve}   />
                             : ""
                        }
                    </> : ""}

                {filter.includes("2889_pi") ?
                    <>
                        {b2889 == true ?
                             
                                <HighchartsReact highcharts={Highcharts} options={chartOptionsThirteen}   />
                             : ""
                        }
                    </>
                    : ""}

                {filter.includes("3129_pi") ?
                    <>
                        {b3129 == true ?
                             
                                <HighchartsReact highcharts={Highcharts} options={chartOptionsFourteen}   />
                             : ""
                        }
                    </>
                    : ""}

                {filter.includes("4452476_pi") ?
                    <>
                        {b4452476 == true ?
                             
                                <HighchartsReact highcharts={Highcharts} options={chartOptionsFifteen}   />
                             : ""
                        }
                    </>
                    : ""}

                {filter.includes("846041_pi") ?
                    <>
                        {b846041 == true ?
                             
                                <HighchartsReact highcharts={Highcharts} options={chartOptionsSixteen}   />
                             : ""
                        }
                    </>
                    : ""}

                {filter.includes("3887_pi") ?
                    <>
                        {b3887 == true ?
                             
                                <HighchartsReact highcharts={Highcharts} options={chartOptionsSeventeen}   />
                             : ""
                        }
                    </>
                    : ""}

                {filter.includes("107342187_pi") ?
                    <>
                        {b107342187 == true ?
                             
                                <HighchartsReact highcharts={Highcharts} options={chartOptionsEighteen}   />
                             : ""
                        }
                    </>
                    : ""}

                {filter.includes("81825_pi") ?
                    <>
                        {b81825 == true ?
                             
                                <HighchartsReact highcharts={Highcharts} options={chartOptionsNineteen}   />
                             : ""
                        }
                    </>
                    : ""}

                {filter.includes("4455_pi") ?
                    <>
                        {b4455 == true ?
                             
                                <HighchartsReact highcharts={Highcharts} options={chartOptionsTwenty}   />
                             : ""
                        }
                    </>
                    : ""}

                {filter.includes("112875977_pi") ?
                    <>
                        {b112875977 == true ?
                             
                                <HighchartsReact highcharts={Highcharts} options={chartOptionsTwentyone}   />
                             : ""
                        }
                    </>
                    : ""}

                {filter.includes("1561_pi") ?
                    <>
                        {b1561 == true ?
                             
                                <HighchartsReact highcharts={Highcharts} options={chartOptionsTwentytwo}   />
                             : ""
                        }
                    </>
                    : ""}

                {filter.includes("123454586_pi") ?
                    <>
                        {b123454586 == true ?
                             
                                <HighchartsReact highcharts={Highcharts} options={chartOptionsTwentythree}   />
                            : ""
                        }
                    </>
                    : ""}

                {filter.includes("4935_pi") ?
                    <>
                        {b4935 == true ?
                             
                                <HighchartsReact highcharts={Highcharts} options={chartOptionsTwentyfour}   />
                             : ""
                        }
                    </>
                    : ""}

                {filter.includes("4937_pi") ?
                    <>
                        {b4937 == true ?
                             
                                <HighchartsReact highcharts={Highcharts} options={chartOptionsTwentyfive}   />
                            : ""
                        }
                    </>
                    : ""}

                {filter.includes("5201_pi") ?
                    <>
                        {b5201 == true ?
                             
                                <HighchartsReact highcharts={Highcharts} options={chartOptionsTwentysix}   />
                            : ""
                        }
                    </>
                    : ""}

                {filter.includes("5211_pi") ?
                    <>
                        {b5211 == true ?
                             
                                <HighchartsReact highcharts={Highcharts} options={chartOptionsTwentyseven}   />
                             : ""
                        }
                    </>
                    : ""}

                {filter.includes("5269_pi") ?
                    <>
                        {b5269 == true ?
                             
                                <HighchartsReact highcharts={Highcharts} options={chartOptionsTwentyeight}   />
                             : ""
                        }
                    </>
                    : ""}

                {filter.includes("114159851_pi") ?
                    <>
                        {b114159851 == true ?
                             
                                <HighchartsReact highcharts={Highcharts} options={chartOptionsTwentynine}   />
                             : ""
                        }
                    </>
                    : ""}

                {filter.includes("72292702_pi") ?
                    <>
                        {b72292702 == true ?
                             
                                <HighchartsReact highcharts={Highcharts} options={chartOptionsThirty}   />
                             : ""
                        }
                    </>
                    : ""}

                {filter.includes("999_pi") ?
                    <>
                        {b999 == true ?
                             
                                <HighchartsReact highcharts={Highcharts} options={chartOptionsThirtyone}   />
                             : ""
                        }
                    </>
                    : ""}
            </div>
        </div>
    );
}

export default DpPyramidIndex;
