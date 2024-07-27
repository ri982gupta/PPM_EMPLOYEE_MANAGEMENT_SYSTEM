import React from "react";
import { useEffect, useState } from "react";
// import SalesPermissionsTabledisplay from "./SalesPermissionsTabledisplay";
import axios from "axios";
import { environment } from "../../environments/environment";
// import { ReactSearchAutocomplete } from "react-search-autocomplete";
// import SalesPermissonsEdit from "./SalesPermissonsEdit";
import Example from "./SalesPermissionsEditMaterial";
// import Saleseditable from "./Saleseditable";
// import Editable from "./Editable";
export default function SalesPermissions() {
  const [issueDetails, setIssueDetails] = useState([]);
  const [Data, setData] = useState([]);
  const baseUrl = environment.baseUrl;

  const [state, setState] = useState(false);

  const getTableDta = async () => {
    const response = await axios({
      method: "get",
      //   url: `http://localhost:8090/administrationms/salesPermission/getSalesPermission`,
      url: baseUrl + `/administrationms/salesPermission/getSalesPermission`,
    });
    // .then(function (response) {
    var resp = response.data;
    setData(resp);
    getData();
    // })
    // .catch(function (response) {});
  };

  const getData = async () => {
    console.log("line no 106");
    const response = await axios({
      method: "get",
      url:
        baseUrl + `/administrationms/salesPermission/getResourcesAutoComplete`,
    });
    // .then(function (response) {
    var res = response.data;
    setIssueDetails(res);
    console.log("assigned data");
    console.log(res);
    setState(true);
    // });
  };
  useEffect(() => {}, [issueDetails]);
  useEffect(() => {
    // getData();
    getTableDta();
  }, []);

  return (
    <>
      <div className="col-md-12">
        <div className="pageTitle">
          <div className="childOne"></div>
          <div className="childTwo">
            <h2>Sales Permissions</h2>
          </div>
          <div className="childThree"></div>
        </div>
      </div>
      {/* <SalesPermissionsTabledisplay Data={Data} issueDetails={issueDetails} /> */}
      {/* <SalesPermissonsEdit Data={Data} issueDetails={issueDetails} /> */}
      {state && <Example Data={Data} issueDetails={issueDetails} />}
      {/* <Saleseditable Data={Data} issueDetails={issueDetails} /> */}
    </>
  );
}
