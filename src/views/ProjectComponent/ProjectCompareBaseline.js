import React, { useEffect, useState } from 'react';
import axios from "axios";
import CheckFlatPrimeReactTable from '../PrimeReactTableComponent/CheckFlatPrimeReactTable';
import FlatPrimeReactTable from '../PrimeReactTableComponent/FlatPrimeReactTable';
import CollapsibleTable from '../PrimeReactTableComponent/CollapsibleTable';
import ProjectCompareBaselineTable from './ProjectCompareBaselineTable';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { MdOutlineDoubleArrow, } from 'react-icons/md';
import Loader from '../Loader/Loader';
import ProjectBaselines from './ProjectBaselines';

function ProjectCompareBaseline(props) {
    const [loader, setLoader] = useState(false)
    const location = useLocation();
    // const navigate = useNavigate();
    console.log("in line 10------");
    console.log(props)
    console.log(location.state)

    let pprs = location?.state

    const { tabledata, projectData, excludedCols, displayColumns, columns, iconState, projectId } = pprs;
    // const[tabledata,setTableData]=useState([])
    let row = 20;

    const navigate = useNavigate();


    useEffect(() => {
        console.log("in line 15------");
        // console.log(tabledata)
    }, [])

    return (
        <div>
            <div className='col-md-12' >
                <div className="pageTitle">
                    <div className="childOne">
                        {loader ? <Loader /> : ""}
                        {projectData?.map((list) => (
                            <h2>{list.projectName}</h2>))}</div>
                    <div className="childTwo">
                        <h2>Project Compare Baseline</h2>
                    </div>
                    <div className="childThree"></div>
                </div>

            </div>
         
            <div>
                <span className="pull-right mr20" onClick={() => { navigate(`/project/Overview/:${projectId}`, { state: { "btnState": "Baselines" } }); }} >
                    <i style={{ float: "right", color: "#15a7ea", cursor: "pointer", textDecoration: 'underline' }}>Go Back</i>
                </span>

                {/* <a href="#" className="pull-right mr20" onClick={() => { window.history.back(); }}><i style={{ float: "right", }}> &lt;&lt;Go Back</i></a> */}
            </div>

            <br />

            <div className='col-md-12'>

                <ProjectCompareBaselineTable
                    data={tabledata}
                    rows={row}
                    excludedCols={excludedCols}
                    displayColumns={displayColumns}
                    columns={columns}
                    iconState={iconState}
                />

            </div>
        </div>


    )
}
export default ProjectCompareBaseline;
