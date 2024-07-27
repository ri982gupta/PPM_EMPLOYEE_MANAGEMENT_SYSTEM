import { useState, useEffect } from "react";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import addDays from "date-fns/addDays";
import { FaSearch } from "react-icons/fa";
import { environment } from "../../environments/environment";
import SelectSEDialogBox from "../SelectSE/SelectSEDialogBox";

export default function InsideSalesSearchFilters({
  setreportRunId,
  setinsideSalesData,
  searching,
  setsearching,
}) {
  const localSE =
    localStorage.getItem("selectedSELocal") === null
      ? []
      : JSON.parse(localStorage.getItem("selectedSELocal"));
  const [visible, setVisible] = useState(false);
  const [startDate, setStartDate] = useState(() => {
    const today = new Date();
    const first = today.getDate() - today.getDay() + 1;
    const monday = new Date(today.setDate(first));
    return monday;
  });
  const [quarter, setquarter] = useState(() => {
    const date = new Date();
    date.setFullYear(date.getFullYear() + 1);
    date.setMonth(date.getMonth() - 3);
    return date;
  });
  const defaultDate = () => {
    const now = new Date();
    const quarter = Math.floor(now.getMonth() / 3);
    const firstDate = new Date(now.getFullYear(), quarter * 3, 1);
    return firstDate.toLocaleDateString("en-CA");
  };
  const [selectedSE, setselectedSE] = useState("<< All SE >>");
  const isIndividualChecked =
    localStorage.getItem("isIndividualCheckedLocal") === null
      ? false
      : JSON.parse(localStorage.getItem("isIndividualCheckedLocal"));

  const [salesExecutiveDropdown, setsalesExecutiveDropdown] = useState([]);
  const [errorMsg, setErrorMsg] = useState(false);
  const [insideSalesDataPayload, setinsideSalesDataPayload] = useState({
    type: "main",
    executives: "-2",
    isActive: "true",
    isIndividual: "false",
    from: startDate.toLocaleDateString("en-CA"),
    duration: "2",
    duration2: "2",
    quarter: defaultDate(),
    selectExecs: "",
  });

  const onFilterChange = ({ id, value }) => {
    console.log(id + " " + value);
    setinsideSalesDataPayload((prevState) => {
      return { ...prevState, [id]: value };
    });
    if (id === "executives" && value === "1") {
      setVisible(true);
    }
  };

  const insideSalesSearchValidator = () => {
    insideSalesDataPayload.executives === "0"
      ? setErrorMsg(true)
      : getinsideSalesData();
  };

  const baseUrl = environment.baseUrl;

  const getsalesExecutiveDropdown = () => {
    axios
      .get(baseUrl + "/SalesMS/MasterController/salesExecutiveData")
      .then((resp) => {
        const data = resp.data;
        const dropdownOptions = data
          .filter((item) => item.isActive === 1)
          .map((item) => {
            return (
              <option key={item.id} value={item.val}>
                {item.lkupName}
              </option>
            );
          });
        setsalesExecutiveDropdown(dropdownOptions);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getinsideSalesData = () => {
    setsearching(true);
    setErrorMsg(false);

    insideSalesDataPayload.executives === "1"
      ? (insideSalesDataPayload.executives = String(
          JSON.parse(localStorage.getItem("selectedSE")).map((item) => {
            return item.id;
          })
        ))
      : "";
    insideSalesDataPayload.isIndividual =
      localStorage.getItem("selectedSE") === "true" ? "true" : "false";

    axios
      .post(
        baseUrl + `/SalesMS/insideSales/getInsideSalesProgress`,
        insideSalesDataPayload
      )
      .then((resp) => {
        const data = resp.data.data;
        const array = resp.data.insideSales.split(",");
        const newArray = data.map((item) => {
          let k = JSON.parse(JSON.stringify(item, array, 4));
          return k;
        });
        setinsideSalesData(newArray);
        setreportRunId(resp.data.reportRunId);
        setsearching(false);
      })
      .catch((resp) => {
        console.log(resp);
      });
  };

  const weekSelector = (date) => {
    const day = date.getDay();
    return day === 1;
  };

  useEffect(() => {
    getsalesExecutiveDropdown();
    getinsideSalesData();
  }, []);

  return (
    <div className="col-lg-12 col-md-12 col-sm-12 customCard">
      {errorMsg && (
        <div className="alert alert-danger">
          <span>
            <strong>
              <em className="icon" data-icon=""></em>
            </strong>
            Please select valid values for highlighted fields
          </span>
        </div>
      )}
      <div className="col-lg-12 col-md-12 col-sm-12">
        <div className="col-md-3 col-sm-10 col-xs-12 seDiv" id="execSelDiv">
          <div className="clearfix" style={{ height: "10px" }}></div>
          <div className="form-group pui-require">
            <label className="col-md-6 col-sm-6 col-xs-6 no-padding">
              Inside Sales Executive<span style={{ color: "red" }}>*</span>
            </label>
            <span className="col-xs-1 bold">:</span>
            <span
              className={`col-md-5 col-sm-5 col-xs-5 no-padding ${
                errorMsg && "error"
              }`}
              style={{ height: "23px" }}
            >
              <select
                id="executives"
                className="col-md-12 col-sm-12 col-xs-12  onLoadEmpty"
                value={insideSalesDataPayload.executives}
                onChange={(e) => {
                  onFilterChange(e.target);
                  setselectedSE(e.target.options[e.target.selectedIndex].text);
                }}
              >
                <option value={0}>{"<< Please select>> "}</option>
                {salesExecutiveDropdown}
              </select>
            </span>
          </div>
        </div>

        <div className="col-md-3 col-sm-10 col-xs-12 seDiv" id="execSelDiv">
          <div className="clearfix" style={{ height: "10px" }}></div>
          <div className="form-group pui-require">
            <label className="col-md-6 col-sm-6 col-xs-6 no-padding">
              Start Week <span style={{ color: "red" }}>*</span>
            </label>
            <span className="col-xs-1 bold">:</span>
            <span
              className={`col-md-5 col-sm-5 col-xs-5 no-padding`}
              style={{ height: "23px" }}
            >
              <DatePicker
                selected={startDate}
                onChange={(date) => {
                  const [start, end] = date;
                  setStartDate(start);
                  onFilterChange({
                    id: "from",
                    value: start.toLocaleDateString("en-CA"),
                  });
                }}
                startDate={startDate}
                endDate={addDays(startDate, 6)}
                selectsRange
                calendarStartDay={1}
                filterDate={weekSelector}
                dateFormat="dd/MM/yyyy"
              />
            </span>
          </div>
        </div>

        <div className="col-md-3 col-sm-10 col-xs-12 seDiv">
          <div className="clearfix" style={{ height: "12px" }}></div>
          <div className="form-group pui-require">
            <label className="col-md-6 col-sm-6 col-xs-6 no-padding">
              Duration <span style={{ color: "red" }}>*</span>
            </label>
            <span className="col-xs-1 bold">:</span>
            <span
              className="col-md-5 col-sm-5 col-xs-5 no-padding"
              style={{ height: "23px" }}
            >
              <select
                id="duration"
                name="duration"
                className="col-md-12 col-sm-12 col-xs-12 "
                defaultValue={"2"}
                onChange={(e) => {
                  onFilterChange(e.target);
                }}
              >
                <option value={1}>1</option>
                <option value={2}>2</option>
                <option value={3}>3</option>
                <option value={4}>4</option>
              </select>
            </span>
          </div>
        </div>

        <div className="col-md-3 col-sm-10 col-xs-12 seDiv" id="execSelDiv">
          <div className="clearfix" style={{ height: "10px" }}></div>
          <div className="form-group pui-require">
            <label className="col-md-6 col-sm-6 col-xs-6 no-padding">
              Quarter <span style={{ color: "red" }}>*</span>
            </label>
            <span className="col-xs-1 bold">:</span>
            <span
              className={`col-md-5 col-sm-5 col-xs-5 no-padding`}
              style={{ height: "23px" }}
            >
              <DatePicker
                selected={quarter}
                onChange={(e) => {
                  setquarter(e);
                  const date = new Date(e.getTime());
                  date.setFullYear(date.getFullYear() - 1);
                  date.setMonth(date.getMonth() + 3);
                  onFilterChange({
                    id: "quarter",
                    value: date.toLocaleDateString("en-CA"),
                  });
                }}
                dateFormat="yyyy, QQQ"
                showQuarterYearPicker
              />
            </span>
          </div>
        </div>
      </div>

      <div className="col-lg-12 col-md-12 col-sm-12">
        <div className="col-md-3 col-sm-10 col-xs-12 seDiv">
          <div className="clearfix" style={{ height: "12px" }}></div>
          <div className="form-group pui-require">
            <label className="col-md-6 col-sm-6 col-xs-6 no-padding">
              Quarters <span style={{ color: "red" }}>*</span>
            </label>
            <span className="col-xs-1 bold">:</span>
            <span
              className="col-md-5 col-sm-5 col-xs-5 no-padding"
              style={{ height: "23px" }}
            >
              <select
                id="duration2"
                name="duration2"
                className="col-md-12 col-sm-12 col-xs-12 "
                defaultValue={"2"}
                onChange={(e) => {
                  onFilterChange(e.target);
                }}
              >
                <option value={1}>1</option>
                <option value={2}>2</option>
                <option value={3}>3</option>
                <option value={4}>4</option>
              </select>
            </span>
          </div>
        </div>
      </div>

      <div className="col-md-12 no-padding section">
        <div className="clearfix" style={{ height: "20px" }}></div>
        <div className="seFooter" style={{ borderTop: "1px solid #CCC" }}>
          <div className="clearfix" style={{ height: "5px" }}></div>
          <span className="selectedSE">
            <b>Selected SE : </b>
            <span className="dynText">
              {selectedSE === "<< Select SE >>"
                ? localSE.map((item, index) => (
                    <span key={item.id}>
                      {isIndividualChecked
                        ? item.salesPersonName
                          ? item.salesPersonName
                          : item.text
                        : item.salesPersonName
                        ? item.salesPersonName
                        : item.text + ` & Team`}
                      {index === localSE.length - 1 ? "" : ", "}
                    </span>
                  ))
                : selectedSE}
            </span>
          </span>
          <div className="clearfix " style={{ height: "5px" }}></div>
        </div>
      </div>

      <div className="col-md-12 no-padding section">
        <div className="seFooter" style={{ borderTop: "1px solid #CCC" }}></div>
      </div>

      <div className="col-md-12 col-sm-12 col-xs-12 no-padding center">
        <div className="clearfix" style={{ height: "25px" }}></div>
        {searching ? (
          <button className="btn btn-primary" type="button" disabled>
            <span
              className="spinner-grow spinner-grow-sm"
              role="status"
              aria-hidden="true"
            ></span>
            Loading...
          </button>
        ) : (
          <button
            type="button"
            className="btn btn-primary"
            onClick={insideSalesSearchValidator}
            style={{ boxShadow: "none" }}
          >
            <FaSearch /> Search{" "}
          </button>
        )}
      </div>

      <SelectSEDialogBox visible={visible} setVisible={setVisible} />
    </div>
  );
}
