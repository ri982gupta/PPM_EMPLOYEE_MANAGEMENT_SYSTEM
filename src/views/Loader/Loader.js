import React, { useState, useEffect } from "react";
import "./Loader.scss";

const Loader = ({ setsearching, controller, handleAbort }) => {
  const [time, setTime] = useState(3);

  // const handleAbort = () =>{
  //   controller.abort();
  //   setsearching(false);
  // }

  useEffect(() => {
    const interval = setInterval(
      () => setTime((prevState) => prevState + 1),
      1000
    );
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {/* Loader 1 */}
      <div className="loaderContainer">
        <div className="loaderContent">
          <span className="spinner">
            <span className="timeTicker">{time}</span>
            <div class="lds-ripple">
              <div></div>
              <div></div>
            </div>
          </span>
          <button className="btn btn-primary abortBtn" onClick={handleAbort}>
            Abort Request
          </button>
        </div>
      </div>

      {/* Loader 2 */}
      {/* <div class="gaugeLoaderContainer">
        <div className="blackBox">
          <div class="loaderElem">
            <span>{time}</span>
            <div class="gaugeLoader"></div>
          </div>
          <button class="abortBtn" onClick={handleAbort}>
            Abort
          </button>
        </div>
      </div> */}

      {/* Loader 3 */}
      {/* <div class="ballLoaderContainer">
        <div className="snowLoaderContent">
          <span className="overlayTimer">{time}</span>
          <div class="pl">
            <div class="pl__outer-ring"></div>
            <div class="pl__inner-ring"></div>
            <div class="pl__track-cover"></div>
            <div class="pl__ball">
              <div class="pl__ball-texture"></div>
              <div class="pl__ball-outer-shadow"></div>
              <div class="pl__ball-inner-shadow"></div>
              <div class="pl__ball-side-shadows"></div>
            </div>
          </div>
          <button class="abortBtn" onClick={handleAbort}>
            Abort
          </button>
        </div>
      </div> */}
    </>
  );
};

export default Loader;
