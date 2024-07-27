import React, { useEffect } from 'react'
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
require("highcharts/modules/exporting")(Highcharts);

function TargetCharts(props) {

    const { chartData } = props


    return (
        <div>
            <HighchartsReact
                highcharts={Highcharts}
                options={chartData}
            />
        </div>
    )
}

export default TargetCharts