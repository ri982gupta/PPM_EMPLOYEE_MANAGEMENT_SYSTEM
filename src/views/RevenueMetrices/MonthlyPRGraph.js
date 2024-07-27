import React from 'react'
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import { format, parseISO, parse } from "date-fns";

export default function MonthlyPRGraph(props) {

    const { filterData } = props;
    console.log(filterData, "filterData............")
    let fdata = {};
    let pldata = {};
    // console.log(Object.keys(filterData))
    // console.log(filterData)
    Object.keys(filterData).forEach((key) => {
        //   console.log("key.........." + key)
        if (key.includes("plRevDelta")) {

            const dateKey = key.substring(0, 10);
            const date = parseISO(dateKey.replace(/_/g, "-"));
            //  console.log(date)
            const formattedDateKey = format(date, "dd-MMM-yyyy");
            fdata[formattedDateKey] = filterData[key];
            // fdata[key] = filterData[key];
        } else if (key.includes("plRev")) {

            console.log(key, "keys.................")
            console.log("key.........." + filterData[key])
            const dateKey = key.substring(0, 10);
            console.log(dateKey + "in line 27...")
            const date = parseISO(dateKey.replace(/_/g, "-"));
            const formattedDateKey = format(date, "dd-MMM-yyyy");
            pldata[formattedDateKey] = filterData[key];
            // console.log(filterData[key], " ", pldata[formattedDateKey])

        }
    })

    // const sortedDates = Object.keys(plRev).map((key) => new Date(key)).sort((a, b) => a - b);

    // Create a new object with sorted data
    // const sortedPlRev = {};
    // sortedDates.forEach((date) => {
    //     const dateString = date.toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' });
    //     sortedPlRev[dateString] = plRev[dateString];
    // });

    console.log(pldata, "pldata..........")
    const sortedDates = Object.keys(fdata).sort((a, b) => {
        return new Date(a) - new Date(b);
    });

    const sortedFteData = {};
    sortedDates.forEach((date) => {
        sortedFteData[date] = fdata[date];
    });

    console.log(sortedFteData, "sortedFteData..................")
    const sortedPldata = {};
    Object.keys(pldata)
        .sort((dateA, dateB) => new Date(dateA) - new Date(dateB))
        .forEach(date => {
            sortedPldata[date] = pldata[date];
        });

    // console.log(Object.keys(sortedFteData).map(key => key.split("-")[0]), "sortedFteData....................");
    //console.log(Object.keys(sortedPldata).map(key => key.split("-")[0]))

    const fteData1ChartConfig = {
        chart: {
            type: 'line',
        },
        title: {
            text: 'Delta',
        },
        exporting: { enabled: true },
        xAxis: {
            categories: Object.keys(sortedPldata).map(key => key.split("-")[0]),
            title: {
                text: 'Days',
            },
        },
        yAxis: {
            tickInterval: 2500,
            title: {
                text: 'Revenue',
            },
        },


        series: [

            {
                name: 'Delta',
                data: Object.values(sortedFteData).map(value => Number(value)),
            },
        ],
    };

    const Plchart = {
        chart: {
            type: 'line',
        },
        title: {
            text: 'Planned Revenue',
        },
        exporting: { enabled: true },
        xAxis: {
            categories: Object.keys(sortedPldata).map(key => key.split("-")[0]),
            title: {
                text: 'Days',
            },
        },
        yAxis: {
            tickInterval: 2500,
            title: {
                text: 'Revenue',
            },
        },


        series: [

            {
                name: 'Planned Revenue',
                data: Object.values(sortedPldata).map(value => Number(value)),
            },
        ],
    };
    return (
        <div className='col-12 row'>
            <div className='col-6'>
                <HighchartsReact
                    highcharts={Highcharts}
                    options={Plchart}
                />
            </div>

            <div className='col-6'> <HighchartsReact
                highcharts={Highcharts}
                options={fteData1ChartConfig}
            /></div>


        </div>

    )
}
