import { useState, useEffect } from "react";
import axios from "axios";
import { FaSearch, FaCaretDown } from "react-icons/fa";
import { environment } from "../../environments/environment";
import { MultiSelect } from "react-multi-select-component";
import Loader from "../Loader/Loader";
import { useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import GlobalValidation from "../ValidationComponent/GlobalValidation";
import { updateActionData } from "../../reducers/SelectedSEReducer";

export default function ViewDetailsSearchFilters({
  setreportRunId,
  SalesExecutive,
  setviewDetailsData,
  allQuarter,
  srchQuat,
  setsrchQuat,
  executive,
  qdata,
  setQdata,
  reportRunId,
  viewsalesid,
  setFilterExectiveName,
  setFiltertrue,
  cust,
  setCust,
}) {
  //-------------------------var decs--------------------------------
  const baseUrl = environment.baseUrl;
  const ref = useRef([]);
  const [searching, setsearching] = useState(false);
  const vendor = useSelector((state) => state.selectedSEState.vendorId);
  const vendorName = useSelector(
    (state) => state.selectedSEState.vendorNamewithId
  );
  const [exceName, setExceName] = useState("");
  const ownerDivisions = useSelector(
    (state) => state.selectedSEState.ownerDivisions
  );
  const [quaterDatesToDisplay, setQuaterDatesToDisplay] = useState("");
  const OwnerValues = ownerDivisions.map((item) => item.value).join(",");

  const [selectedSalesE, setselectedSalesE] = useState(SalesExecutive);
  const [vendorDropdown, setvendorDropdown] = useState([]);
  const [selectedvendor, setselectedvendor] = useState(vendorName);
  const [ownerDivison, setOwnerDiviosn] = useState(OwnerValues);
  const [vendor1, setVendor1] = useState(vendor);
  const SelectSEData = useSelector(
    (state) => state.selectedSEState.directSETreeData
  );
  const executiveId = useSelector(
    (state) => state.selectedSEState.salesExectiveId
  );
  const combinedData = [SelectSEData, executiveId];
  const concatenatedString = combinedData.join(",");
  const [seData, setSeData] = useState(executiveId);
  const [sFOwnerDivisionsDropdown, setSFOwnerDivisionsDropdown] = useState([]);
  const [selectesFOwnerDivison, setselectesFOwnerDivison] =
    useState(ownerDivisions);
  const [errorMsg, setErrorMsg] = useState(false);
  const abortController = useRef(null);
  const [loader2, setLoader2] = useState(false);
  const QuaterDate = useSelector((state) => state.selectedSEState.quaterDate);

  const [date, setDate] = useState(QuaterDate);
  const handleAbort = () => {
    abortController.current && abortController.current.abort();
    setLoader2(false);
  };
  const reportRunIdRedux = useSelector(
    (state) => state.selectedSEState.reportRunId
  );

  const [viewDetailsDataPayload, setviewDetailsDataPayload] = useState({
    executives: seData,
    from: date,
    type: "view",
    detail: true,
    reportRunId: reportRunIdRedux,
    optType: "neglected",
    vendors: vendor1,
    saveSE: false,
    divisions: "109",
  });
  //-----------------------------methods--------------------------------
  const onFilterChange = ({ id, value }) => {
    setviewDetailsDataPayload((prevState) => {
      return { ...prevState, [id]: value };
    });
    if (id === "executives" && value === "1") {
      setVisible(true);
    }
  };
  const viewDetailsSearchValidator = () => {
    // viewDetailsDataPayload.executives === "" ||
    // viewDetailsDataPayload.vendors === "" ||
    // viewDetailsDataPayload.divisions === "" ||
    // viewDetailsDataPayload.from === ""
    //   ? setErrorMsg(true)
    // :
    getviewDetailsData();
  };

  //-------------------------------calls-----------------------------------
  const getSFOwnerDivisionsDropdown = () => {
    axios
      .get(baseUrl + `/SalesMS/MasterController/SFOwnerDivisions`)
      .then((resp) => {
        const data = resp.data;
        const dropdownOptions = data.map((item) => {
          return {
            value: item.id,
            label: item.owner_Division,
          };
        });
        setSFOwnerDivisionsDropdown(dropdownOptions);
        // setselectesFOwnerDivison(dropdownOptions);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getvendor = () => {
    axios
      .get(baseUrl + "/CommonMS/master/getSalesVendors")
      .then((resp) => {
        const data = resp.data;
        const dropdownOptions = data.map((item) => {
          return {
            value: item,
            label: item,
          };
        });
        const initialSelection = dropdownOptions.some(
          (item) => item.value === "Prolifics - Jam/Panther/XMLink"
        )
          ? dropdownOptions.filter(
              (item) => item.value !== "Prolifics - Jam/Panther/XMLink"
            )
          : dropdownOptions;
        setvendorDropdown(dropdownOptions);
        // setselectedvendor(initialSelection);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const dispatch = useDispatch();

  const getviewDetailsData = () => {
    let valid = GlobalValidation(ref);

    if (valid == true) {
      setsearching(false);
      // setErrorMsg(true);
    }

    if (valid) {
      // setValidator(true);
      // setErrorMsg(true)
      return;
    }
    setErrorMsg(false);

    setLoader2(false);
    setErrorMsg(false);
    const executiveIdPayload =
      SelectSEData == ""
        ? "2064731,139715916,123791883,3575,139,191,225,235,257,57997421,513,523,3617428,667,81525,2119701,76287764,57559815,825,2811358,2119741,881,905,120820778,981,57997419,4849403,20493348,116106000,2119787,2119795,88470523,128367163,1165,2639222,130391575,88998194,1375,1381,2119837,2119851,81587,1529,97925857,18910037,2640070,2119655,43972990,793,1675,2639520,70301986,1717,38380211,124117738,1785,97320362,114598022,106940587,2167,3007509,2227,2119945,47112354,46642168,2257,2119951,2249,4872942,2263,11651218,2119961,2607,2737,112208586,2596928,96657988,3129,658084,4452476,3283,846041,3495,2120031,3617,2120057,1495,2120063,2120069,3665,21505179,111399803,3737,3887,3977,2120091,4065,25313227,123558264,81825,111450,112875977,31161422,4095,81871,49413793,2120157,123454586,123558274,4937,2120161,2120163,117718248,30549612,2120177,5265,114159851,9999"
        : SelectSEData;
    axios({
      method: "post",
      url: baseUrl + `/SalesMS/software/getSalesSoftwareDataDetails`,
      data: {
        executives: seData == "1" ? executiveIdPayload : seData,
        from: date,
        type: "view",
        detail: true,
        reportRunId: reportRunIdRedux,
        optType: "neglected",
        vendors: vendor1,
        saveSE: false,
        divisions: ownerDivison,
        mode: -1,
        duration: -1,
        measures: -1,
        customers: -1,
        prospects: -1,
        practices: -1,
        countries: -1,
        customerType: -1,
        summary: -1,
        showBy: "-1",
        quarter: -1,
        status: -1,
        duration2: -1,
        monthsel: -1,
        viewByTime: -1,
        fyear: -1,
        aelocation: -1,
        engComp: -1,
        Divisions: -1,
        accOwner: -1,
        newCust: -1,
        accType: -1,
      },
    })
      .then((resp) => {
        setLoader2(false);

        const data = resp.data.data;
        const array = [
          "id",
          "executive_division",
          "execStatus",
          "supervisor",
          "customerId",
          "customer",
          "isProspect",
          "oppId",
          "sfOppId",
          "opportunity",
          "vendor",
          "probability",
          "closeDate",
          "oppAmount",
          "calls",
          "upside",
          "closedAmount",
          "week",
          "comments",
          "lvl",
          "count",
          "isEdit",
          "isDeleted",
          "keyAttr",
          "parentAttr",
          "add_to_call",
          "isActive",
        ];
        const newArray = data.map((item) => {
          let k = JSON.parse(JSON.stringify(item, array, 4));
          return k;
        });
        const allcust = newArray
          .filter((item) => item.lvl === 1)
          .map((item) => item.customer);
        setCust(allcust);
        dispatch(updateActionData(allcust));
        setviewDetailsData(newArray);
        setreportRunId(resp.data.reportRunId);
        setsearching(false);
      })
      .catch((resp) => {});
  };
  useEffect(() => {
    getvendor();
    getSFOwnerDivisionsDropdown();
  }, []);

  useEffect(() => {
    setviewDetailsDataPayload((prevState) => {
      return { ...prevState, ["from"]: srchQuat.date };
    });
  }, [srchQuat]);

  useEffect(() => {
    getviewDetailsData();
  }, [QuaterDate]);

  // useEffect(() => {
  //   srchQuat.date === viewDetailsDataPayload.from ? getviewDetailsData() : "";
  // }, [viewDetailsDataPayload]);
  const ArrowRenderer = ({ expanded }) => (
    <>
      {expanded ? (
        <FaCaretDown className="chevronIcon" />
      ) : (
        <FaCaretDown className="chevronIcon" />
      )}
    </>
  );
  const generateDropdownLabel = (selectedOptions, allOptions) => {
    const selectedValues = selectedOptions.map((option) => option.value);
    const allValues = allOptions.map((item) => item.value);

    if (selectedValues.length === allValues.length) {
      return "<< ALL >>";
    } else {
      return selectedOptions.map((option) => option.label).join(", ");
    }
  };
  return (
    <div className="col-lg-12 col-md-12 col-sm-12 customCard grayBg pb-2 mt-3">
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
      {loader2 ? <Loader handleAbort={handleAbort} /> : ""}

      <div className="group-content row">
        <div className="col-md-3 mb-2">
          <div className="clearfix" style={{ height: "10px" }}></div>
          <div className="form-group row">
            <label className="col-5">
              Quarter <span className="required error-text ml-1"> *</span>
            </label>
            <span className="col-1 p-0">:</span>
            <span className="col-6 textfield">
              <select
                id="from"
                value={srchQuat.quat}
                onChange={(e) => {
                  onFilterChange(e.target);
                  console.log(e.target.value);
                  // setsrchQuat(e.target.value);
                  setsrchQuat({
                    quat: e.target.value,
                  });
                  const [year, quarter] = e.target.value.split("-");
                  const quarterToMonth = {
                    Q1: "04",
                    Q2: "07",
                    Q3: "10",
                    Q4: "01",
                  };
                  let adjustedYear = year; // Initialize with the original year
                  if (
                    quarter === "Q1" ||
                    quarter === "Q2" ||
                    quarter === "Q3"
                  ) {
                    adjustedYear = year - 1;
                  }
                  const month = quarterToMonth[quarter];
                  const day = "01";
                  const date1 = `${adjustedYear}-${month}-${day}`;
                  setDate(date1);
                }}
                ref={(ele) => {
                  ref.current[0] = ele;
                }}
              >
                {allQuarter.map((item) => (
                  <option key={item.date} value={item.date}>
                    {item.quat}
                  </option>
                ))}
              </select>
            </span>
          </div>
        </div>
        <div className="col-md-3 mb-2">
          <div className="clearfix" style={{ height: "10px" }}></div>
          <div className="form-group row">
            <label className="col-5">
              Sales Executive{" "}
              <span className="required error-text ml-1"> *</span>
            </label>
            <span className="col-1 p-0">:</span>
            <span
              className="col-6 multiselect"
              ref={(ele) => {
                ref.current[1] = ele;
              }}
            >
              <MultiSelect
                id="executives"
                ArrowRenderer={ArrowRenderer}
                valueRenderer={generateDropdownLabel}
                options={SalesExecutive}
                hasSelectAll={true}
                isLoading={false}
                shouldToggleOnHover={false}
                disableSearch={false}
                value={selectedSalesE}
                disabled={false}
                onChange={(e) => {
                  setselectedSalesE(e);
                  let filterPractice = [];
                  e.forEach((d) => {
                    filterPractice.push(d.value);
                  });
                  setSeData(filterPractice.toString());
                  // setFilterExectiveName(e);
                  setExceName(e);
                }}
              />
            </span>
          </div>
        </div>
        <div className="col-md-3 mb-2">
          <div className="clearfix" style={{ height: "10px" }}></div>
          <div className="form-group row">
            <label className="col-5">
              Vendor <span className="required error-text ml-1"> *</span>
            </label>
            <span className="col-1  p-0">:</span>
            <span
              className="col-6 multiselect"
              ref={(ele) => {
                ref.current[2] = ele;
              }}
            >
              <MultiSelect
                ArrowRenderer={ArrowRenderer}
                valueRenderer={generateDropdownLabel}
                id="practiceId"
                options={vendorDropdown}
                hasSelectAll={true}
                value={selectedvendor}
                disabled={false}
                onChange={(e) => {
                  setselectedvendor(e);
                  let filterPractice = [];
                  e.forEach((d) => {
                    filterPractice.push(d.value);
                  });

                  setVendor1(filterPractice.toString());
                }}
              />
            </span>
          </div>
        </div>
        <div className="col-md-3 mb-2">
          <div className="clearfix" style={{ height: "10px" }}></div>
          <div className="form-group row">
            <label className="col-5">
              Sales Division{" "}
              <span className="required error-text ml-1"> *</span>
            </label>
            <span className="col-1 p-0">:</span>
            <span
              className="col-6 multiselect"
              ref={(ele) => {
                ref.current[3] = ele;
              }}
            >
              <MultiSelect
                ArrowRenderer={ArrowRenderer}
                valueRenderer={generateDropdownLabel}
                options={sFOwnerDivisionsDropdown}
                hasSelectAll={true}
                isLoading={false}
                shouldToggleOnHover={false}
                disableSearch={false}
                value={selectesFOwnerDivison}
                disabled={false}
                onChange={(e) => {
                  setselectesFOwnerDivison(e);
                  let filterPractice = [];
                  e.forEach((d) => {
                    filterPractice.push(d.value);
                  });

                  setOwnerDiviosn(filterPractice.toString());
                }}
              />
            </span>
          </div>
        </div>
      </div>
      <div className="col-md-12 col-sm-12 col-xs-12 my-2 search btn-container center">
        <button
          type="button"
          className="btn btn-primary"
          // onClick={viewDetailsSearchValidator}
          onClick={() => {
            viewDetailsSearchValidator();
            setFiltertrue(true);
            setFilterExectiveName(exceName);
            // setsrchQuat(quaterDatesToDisplay);
          }}
        >
          <FaSearch /> Search{" "}
        </button>
      </div>
    </div>
  );
}
