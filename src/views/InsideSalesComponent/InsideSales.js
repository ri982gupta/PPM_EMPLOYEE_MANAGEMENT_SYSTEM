import InsideSalesSearchFilters from "./InsideSalesSearchFilters";
import InsideSalesMTable from "./InsideSalesMTable";
import { useState } from "react";
import Loader from "../Loader/Loader";
import './insideSales.scss'

export default function InsideSales() {

    const [insideSalesData,setinsideSalesData] = useState([])
    const [reportRunId,setreportRunId] = useState("")
    const [searching,setsearching] = useState(false);


    return(
        <>
        <div className="col-lg-12 col-md-12 col-sm-12 no-padding">
            <div className="pageHeading">Inside Sales</div>
            <InsideSalesSearchFilters setinsideSalesData={setinsideSalesData} setreportRunId={setreportRunId} searching={searching} setsearching={setsearching}/>
            <InsideSalesMTable insideSalesData={insideSalesData} reportRunId={reportRunId}/>
        </div>
        {searching && <Loader setsearching={setsearching}/>}
        </>
    );
}