import ProgressTable from "./ProgressTable";
import { useState, useEffect } from 'react';
import ProgressSearchFilter from "./ProgressSearchFilter";
import './Progress.scss';
import axios from "axios";
import { environment } from "../../environments/environment";



export default function Progress(props) {

    const [tableFlag, setTableFlag] = useState()
    const [progressData, setProgressData] = useState()
    const baseUrl = environment.baseUrl;
    const loggedUserId = localStorage.getItem("resId")



    return (
        <div className="col-md-12  border-box no-padding">
            <div className="col-lg-12 col-md-12 col-sm-12 no-padding">
                <ProgressSearchFilter
                    setProgressData={setProgressData}
                    setTableFlag={setTableFlag}
                />
                {tableFlag && <ProgressTable
                    progressData={progressData}
                />}

            </div>

        </div>
    );
}