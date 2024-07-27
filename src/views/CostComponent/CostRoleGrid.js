import axios from "axios";
import React, { useEffect, useState } from "react";
import { environment } from "../../environments/environment";
import CostRoleGridFilters from "./CostRoleGridFilters";
import "./CostCss.scss";
import AddRoleGrid from "./AddRoleGrid";
import Loader from "../Loader/Loader";

function CostRoleGrid() {
  const baseUrl = environment.baseUrl;

  const [countries, setCountries] = useState([]);
  const [practices, setPractices] = useState([]);
  const [cadres, setCadres] = useState([]);
  const [addRoleGrid, setAddRoleGrid] = useState(false);
  const [addRoleGridData, setAddRoleGridData] = useState([]);
  const [roleGridCostData, setRoleGridCostData] = useState([]);
  const [roleGridMedianCostData, setRoleGridMedianCostData] = useState([]);
  const [signal, setSignal] = useState(false);

  const initialValueForm = {
    practice: "",
    country: "",
    cadre: "",
  };

  const loggedUserId = localStorage.getItem("resId");
  let url = window.location.href;

  const [formData, setFormData] = useState(initialValueForm);
  const [loaderState, setLoaderState] = useState(false);

  useEffect(() => {
    getCostRoleGrid();
    getCountries();
    getPractices();
    getCadres();
    getIpAddress();
  }, []);

  useEffect(() => {}, [roleGridCostData]);

  const getCountries = () => {
    axios({
      url: baseUrl + `/CostMS/cost/getCountries`,
    }).then((resp) => {
      setCountries(resp.data);
    });
  };

  const getPractices = () => {
    axios({
      url: baseUrl + `/CostMS/cost/getPractices`,
    }).then((resp) => {
      setPractices(resp.data);
    });
  };

  const getCadres = () => {
    axios({
      url: baseUrl + `/CostMS/cost/getCadres`,
    }).then((resp) => {
      setCadres(resp.data);
    });
  };

  const getCostRoleGrid = () => {
    setSignal(false);
    setLoaderState(true);

    axios({
      method: "POST",
      url: baseUrl + "/CostMS/cost/getRoleGridCost",
      data: formData,
    }).then((resp) => {
      setRoleGridCostData(resp.data);
      setSignal(true);
      setLoaderState(false);
    });
  };

  const getIpAddress = async () => {
    await fetch("https://geolocation-db.com/json/")
      .then((response) => {
        return response.json();
      }, "jsonp")
      .then((res) => {
        loginHistoryTracks(res.IPv4);
      })
      .catch((err) => console.log(err));
  };

  const loginHistoryTracks = (ipAddress) => {
    const loginTrackData = {};

    let urlData = url.split("#");

    loginTrackData["ipAddress"] = ipAddress;
    loginTrackData["userId"] = loggedUserId;
    loginTrackData["url"] = urlData[1];

    axios({
      method: "POST",
      url: baseUrl + "/CostMS/cost/saveLoginTracks",
      data: loginTrackData,
    }).then((resp) => {
      console.log(resp.data);
    });
  };

  const onChangeFilters = (e) => {
    const { id, value } = e.target;

    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const filtersClickHandler = () => {
    console.log(formData);
    getCostRoleGrid();
  };

  return (
    <div>
      {loaderState ? <Loader /> : ""}
      <>
        <CostRoleGridFilters
          countries={countries}
          practices={practices}
          cadres={cadres}
          setAddRoleGrid={setAddRoleGrid}
          addRoleGrid={addRoleGrid}
          addRoleGridData={addRoleGridData}
          formData={formData}
          setFormData={setFormData}
          onChangeFilters={onChangeFilters}
          filtersClickHandler={filtersClickHandler}
        />
      </>

      {signal && (
        <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12 customCard">
          <AddRoleGrid
            addRoleGridData={addRoleGridData}
            countries={countries}
            practices={practices}
            cadres={cadres}
            roleGridCostData={roleGridCostData}
            getCostRoleGrid={getCostRoleGrid}
            addRoleGrid={addRoleGrid}
            setAddRoleGrid={setAddRoleGrid}
            setLoaderState={setLoaderState}
          />
        </div>
      )}

      {/* <div className='col-xs-12 col-sm-12 col-md-12 col-lg-12 customCard'>
        {signal && <DisplayRoleCostGridData roleGridCostData={roleGridCostData} />}
      </div> */}
    </div>
  );
}

export default CostRoleGrid;
