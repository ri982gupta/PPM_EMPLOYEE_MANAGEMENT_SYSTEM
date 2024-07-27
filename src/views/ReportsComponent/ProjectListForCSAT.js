import React, { useState , useEffect} from "react";
import DatePicker from "react-datepicker";
import {
  FaChevronCircleDown,
  FaChevronCircleUp,
  FaSearch,
  FaCheck,
} from "react-icons/fa";
import { CCollapse } from "@coreui/react";
import { getTableData } from "./ProjectListForCSATTable";
import FlatPrimeReactTable from "../PrimeReactTableComponent/FlatPrimeReactTable";
function ProjectListForCSAT() {
  const [startDate, setStartDate] = useState(new Date());
  const [visible, setVisible] = useState(false);
  const [cheveronIcon, setCheveronIcon] = useState(FaChevronCircleUp);
  const [dataAr, setDataAr] = useState([]);


  useEffect(() => {
   
    let tdata=getTableData();
   
    //console.log('ski1',tdata);
    setDataAr(tdata);

  }, []);
  return (
    <div>
      <div className="col-md-12">
        <div className="pageTitle">
          <div className="childOne"></div>
          <div className="childTwo">
            <h2>Project List For CSAT</h2>
          </div>
          <div className="childThree"></div>
        </div>
      </div>
      <div className="group mb-3 customCard">
        <div className="col-md-12 collapseHeader">
          <h2>Search Filters</h2>

          <div
            onClick={() => {
              setVisible(!visible);

              visible
                ? setCheveronIcon(FaChevronCircleUp)
                : setCheveronIcon(FaChevronCircleDown);
            }}
          >
            <span>{cheveronIcon}</span>
          </div>
        </div>
        {/* <h2>Project List For CSAT</h2> */}
        <CCollapse visible={!visible}>
          <div className="group-content row">
            <div className="col-md-3 mb-2">
              <div className="form-group row">
                <label className="col-5" htmlFor="month">
                  Month
                </label>
                <span className="col-1 p-0">:</span>
                <div className="col-6">
                  <DatePicker
                    selected={startDate}
                    onChange={(date) => setStartDate(date)}
                    dateFormat="MM/yyyy"
                    showMonthYearPicker
                  />
                </div>
              </div>
            </div>
            <div className="col-md-12 col-sm-12 col-xs-12 btn-container center my-3 mb-2">
              <button className="btn btn-primary ">Search</button>
            </div>
          </div>
        </CCollapse>
      </div>
      <div className="col-md-12">
          <FlatPrimeReactTable data={dataAr}/>
    </div>
    </div>
  );
}

export default ProjectListForCSAT;
