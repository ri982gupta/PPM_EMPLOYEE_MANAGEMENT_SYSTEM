import AttainmentTable from "./AttainmentTable";
import { useState, useEffect } from "react";
import AttainmentSearchFilter from "./AttainmentSearchFilter";
import "./Attainment.scss";
import axios from "axios";
import { environment } from "../../environments/environment";

export default function Attainment() {
  const [tableFlag, setTableFlag] = useState();
  const [attainmentData, setAttainmentData] = useState();
  const [display, setDisplay] = useState([]);
  const baseUrl = environment.baseUrl;
  const loggedUserId = localStorage.getItem("resId");


  return (
    <div className="col-md-12  border-box no-padding">
      <div className="col-lg-12 col-md-12 col-sm-12 no-padding">
        <AttainmentSearchFilter
          setAttainmentData={setAttainmentData}
          setTableFlag={setTableFlag}
          setDisplay={setDisplay}
        />
        {tableFlag && (
          <AttainmentTable attainmentData={attainmentData} display={display} />
        )}
        {/* <AttainmentTable /> */}
      </div>
    </div>
  );
}
