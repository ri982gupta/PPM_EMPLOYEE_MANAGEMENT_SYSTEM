import axios from "axios";
import { useState } from "react";
import { environment } from "../../environments/environment";
import Loader from "../Loader/Loader";
import { useRef } from "react";
export default function SFButtons({
  showSFpipeline,
  setshowSFpipeline,
  reportRunId,
  componentSelector,
  setRefreshButton,
  refreshButton,
}) {
  const [loader, setLoader] = useState(false);
  const abortController = useRef(null);

  const handleAbort = () => {
    abortController.current && abortController.current.abort();
    setLoader(false);
  };
  // const[services, setServices] = useState([])
  const baseUrl = environment.baseUrl;
  const getserviceSFData = () => {
    const loaderTime = setTimeout(() => {
      setLoader(true);
    }, 2000);
    abortController.current = new AbortController();
    axios({
      method: "post",
      url: baseUrl + `/SalesMS/salesforce/refreshSalesForceData`,
      signal: abortController.current.signal,
      data: {
        reportRunId: "" + reportRunId,
        for: "Services",
      },
    })
      .then((resp) => {
        const data = resp.data.status;
        setLoader(false);
        setRefreshButton(data);
        clearTimeout(loaderTime);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleHideShowPipeline = () => {
    setshowSFpipeline((prevState) => !prevState);
  };

  return (
    <div>
      {componentSelector !== "custTarget" && (
        <div className="col-4 row " style={{}}>
          <button
            id="sfData"
            className="col-4 btn btn-primary mr-2"
            style={{
              width: "auto",
              fontWeight: "bold",
            }}
            onClick={handleHideShowPipeline}
          >
            {showSFpipeline ? "Hide Sf Pipeline" : "Show Sf Pipeline"}
          </button>
          <button
            id="refreshData"
            className="col-4 btn btn-primary"
            style={{
              width: "auto",
              fontWeight: "bold",
            }}
            onClick={() => {
              getserviceSFData();
            }}
          >
            Refresh Sf Data
          </button>
        </div>
      )}
      {loader ? <Loader handleAbort={handleAbort} /> : ""}
    </div>
  );
}
