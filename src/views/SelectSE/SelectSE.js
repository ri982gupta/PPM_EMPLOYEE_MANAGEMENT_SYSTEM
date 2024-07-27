import { useState, useEffect, forwardRef, useImperativeHandle } from "react";
import InDirectSE from "./InDirectSE";
import SelectedItems from "./SelectedItems";
import VirtualTeams from "./VirtualTeams";
import { BiMinusCircle } from "react-icons/bi";
import {
  FaAnchor,
  FaExclamationTriangle,
  FaHistory,
  FaPlusCircle,
  FaSave,
} from "react-icons/fa";
import DirectSE from "./DirectSE";
import fte_active from "../../assets/images/empstatusIcon/fte_active.png";
import fte_inactive from "../../assets/images/empstatusIcon/fte_inactive.png";
import fte_notice from "../../assets/images/empstatusIcon/fte_notice.png";
import subk_active from "../../assets/images/empstatusIcon/subk_active.png";
import subk_inactive from "../../assets/images/empstatusIcon/subk_inactive.png";
import subk_notice from "../../assets/images/empstatusIcon/subk_notice.png";
import { environment } from "../../environments/environment";
import axios from "axios";
import "./SelectedSE.scss";
import { MD5 } from "crypto-js";

import {
  emptySelectedSEProp,
  hideIndirectInactive,
  undoSaveSelectSE,
  updateIsIndivChecked,
  updateIsShowInactiveChecked,
  updateSelectedSEProp,
} from "../../reducers/SelectedSEReducer";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@coreui/coreui";
import { CButton } from "@coreui/react";

const SelectSE = forwardRef((props, ref) => {
  const selectedSERedux = useSelector(
    (state) => state.selectedSEState.selectedSEProp
  );
  const isIndividualChecked = useSelector(
    (state) => state.selectedSEState.isIndividualChecked
  );
  const [validationMessage, setValidationMessage] = useState("");

  // const [accessData, setAccessData] = useState([]);

  const isShowInactiveChecked = useSelector(
    (state) => state.selectedSEState.isShowInactiveChecked
  );
  const dispatch = useDispatch();
  const input = props.value;
  const permissions = props.permissions;
  const setGrpId = props.setGrpId;
  const SetBulkIds = props.SetBulkIds;
  const accessData = props.accessData;
  const dataAccess = props.dataAccess;
  const setVisible = props.setVisible;
  const salesfullAccess = props.salesfullAccess;
  const [visible, setVisble] = useState(false);
  const [seOptions, setSeOptions] = useState([]);
  const loggedUserId = localStorage.getItem("resId");
  const baseUrl = environment.baseUrl;
  const [addVirtualTeam, setAddvirtualTeam] = useState(false);
  const [virtualTeamName, setVirtualTeamName] = useState([]);
  const [showInactive, setShowInactive] = useState(false);
  const [selectedSE, setselectedSE] = useState([]);
  const [selectedSEDisp, setselectedSEDisp] = useState([]);
  const [allIndirectSelected, setallIndirectSelected] = useState(false);
  const [indirectData, setIndirectdata] = useState([]);
  const [isIndividual, setisIndividual] = useState(false);
  const [search, setSearch] = useState("");
  const [filteredIndirectData, setFilteredIndirectData] = useState([]);

  const [vTeamData, setvTeamData] = useState([]);

  const getvTeamData = () => {
    axios
      .get(
        baseUrl +
          `/SalesMS/MasterController/getVirtualTeamsData?userId=${loggedUserId}`
      )
      .then((resp) => {
        const data = resp.data;
        setvTeamData(data);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const icons = {
    fte0: (
      <img
        src={fte_inactive}
        alt="(fte_inactive_icon)"
        style={{ height: "12px", marginTop: "-5px" }}
        title="Ex-Employee"
      />
    ),
    fte1: (
      <img
        src={fte_active}
        alt="(fte_active_icon)"
        style={{ height: "12px", marginTop: "-5px" }}
        title="Active Employee"
      />
    ),
    fte2: (
      <img
        src={fte_notice}
        alt="(fte_notice_icon)"
        style={{ height: "12px", marginTop: "-5px" }}
        title="Employee in notice period"
      />
    ),
    subk0: (
      <img
        src={subk_inactive}
        alt="(subk_inactive_icon)"
        style={{ height: "12px", marginTop: "-5px" }}
        title="Ex-Contractor"
      />
    ),
    subk1: (
      <img
        src={subk_active}
        alt="(subk_active_icon)"
        style={{ height: "12px", marginTop: "-5px" }}
        title="Active Contractor"
      />
    ),
    subk2: (
      <img
        src={subk_notice}
        alt="(subk_notice_icon)"
        style={{ height: "12px", marginTop: "-5px" }}
        title="Contractor in notice period"
      />
    ),
  };

  //---------------------------refMethod------------------------------------

  const writeVirtualTeam = () => {
    const payload = {
      teamName: virtualTeamName,
      userId: loggedUserId,
    };
    axios
      .post(baseUrl + `/SalesMS/MasterController/addVirtualTeams`, payload)
      .then(() => {
        getvTeamData();
        setAddvirtualTeam(false);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useImperativeHandle(ref, () => ({
    setGlobalState() {
      localStorage.setItem("selectedSE", JSON.stringify(selectedSE));
      {
        props.value == "EngagementS"
          ? ""
          : localStorage.setItem("isIndividual", isIndividual);
      }
    },
    resetTOlocalState() {
      const localSE =
        localStorage.getItem("selectedSE") === null
          ? []
          : JSON.parse(localStorage.getItem("selectedSE"));

      setselectedSE(localSE);
      {
        props.value == "EngagementS"
          ? ""
          : setisIndividual(
              localStorage.getItem("isIndividual") === "true" ? true : false
            );
      }
    },
  }));

  //---------------------------method------------------------------------------

  const onSelectSE = (item, isChecked) => {
    dispatch(updateSelectedSEProp({ item, isChecked }));
    setselectedSE((prevState) => {
      const filteredData = prevState?.filter(
        (item) => !item?.hasOwnProperty("key")
      );
      const isEmpPresent = filteredData.findIndex((obj) => obj.id === item.id);
      isEmpPresent !== -1 ? filteredData.splice(isEmpPresent, 1) : "";
      return [...filteredData, item];
    });
    setVisble(true);
  };

  const employeeElement = (item, type) => {
    return (
      <span
        key={item.id}
        className="option col-md-4"
        style={{
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
          width: "160px",
          marginTop: "6px",
        }}
      >
        {props.value == "EngagementS" ? (
          <>
            <input
              type="checkbox"
              id={item.id}
              name={item.Name}
              checked={selectedSERedux.some((obj) => obj.id == item.id)}
              onChange={(e) => {
                const isChecked = e.target.checked;
                onSelectSE(item, isChecked);
              }}
              className="mr-2"
            ></input>
            <span title={item.Name}>{item.Name}</span>
          </>
        ) : (
          <>
            {" "}
            <input
              type="checkbox"
              id={item.id}
              name={item.salesPersonName}
              checked={selectedSERedux.some((obj) => obj.id == item.id)}
              onChange={(event) => onSelectSE(item, event.target.checked)}
            ></input>
            &nbsp;
            {icons[item.type]}&nbsp;
            <span title={item.salesPersonName}>{item.salesPersonName}</span>
          </>
        )}
      </span>
    );
  };

  // Custom function to compare objects based on id
  function compareObjects(obj1, obj2) {
    return obj1.id === obj2.id;
  }

  const selectAllIndirect = (isChecked) => {
    if (isChecked) {
      filteredIndirectData.forEach((item) => {
        dispatch(updateSelectedSEProp({ item, isChecked }));
      });
      setallIndirectSelected(true);
    } else {
      filteredIndirectData.forEach((item) => {
        dispatch(updateSelectedSEProp({ item, isChecked }));
      });
    }
  };

  const SelectAllCustomers = () => {
    setselectedSE((prevState) => {
      const empId = prevState.map((item) => item.id);
      const newArray = indirectData.filter((item) => !empId.includes(item.id));
      return [...prevState, ...newArray];
    });
  };

  const getIndirectData = () => {
    {
      props.value == "EngagementS"
        ? axios
            .get(baseUrl + `/ProjectMS/Engagement/customerdata`)
            .then((resp) => {
              const data = resp.data;
              setIndirectdata(data);
            })
            .catch((resp) => {
              console.log(resp);
            })
        : axios
            .get(
              baseUrl +
                `/SalesMS/MasterController/getInDirectSalesExecutiveTreeData?userId=512`
            )
            .then((resp) => {
              const data = resp.data;
              console.log(data);
              data.push({
                type: "fte1",
                salesPersonName: "Unassigned",
                id: 9999,
                status: "empActive",
              });
              setIndirectdata(data);
            })
            .catch((resp) => {
              console.log(resp);
            });
    }
  };
  const [s1, setS1] = useState([]);

  const nonRepeatedData = s1.reduce((acc, obj) => {
    const parsedChildren = JSON.parse(obj.props.children);
    if (parsedChildren.key === "directsalesEx") {
      // Remove any previous objects with the same key
      acc = acc.filter((item) => {
        const parsedItemChildren = JSON.parse(item.props.children);
        return parsedItemChildren.key !== "directsalesEx";
      });
      acc.push(obj);
    } else {
      acc.push(obj);
    }
    return acc;
  }, []);
  console.log(accessData);
  //--------------------------------useEffect------------------------------------------
  useEffect(() => {
    getvTeamData();
  }, []);

  useEffect(() => {
    //When unselected, selectAll button should be unchecked
    const reduxIndirectData = filteredIndirectData.filter((dataObj) =>
      selectedSERedux.some((reduxObj) => dataObj.id == reduxObj.id)
    );
    if (
      reduxIndirectData.length == filteredIndirectData.length &&
      filteredIndirectData.length > 0
    ) {
      setallIndirectSelected(true);
    } else {
      setallIndirectSelected(false);
    }
  }, [selectedSERedux, filteredIndirectData]);

  useEffect(() => {
    getIndirectData();
  }, []);

  useEffect(() => {
    const localSE =
      localStorage.getItem("selectedSE") === null
        ? []
        : JSON.parse(localStorage.getItem("selectedSE"));
    props.value == "EngagementS"
      ? SelectAllCustomers()
      : setselectedSE(localSE);
    props.value == "EngagementS"
      ? ""
      : setisIndividual(
          localStorage.getItem("isIndividual") === "true" ? true : false
        );
  }, [indirectData]);

  useEffect(() => {
    const indirectDataCopy = [...indirectData];
    if (!isShowInactiveChecked) {
      var filteredIndirecData = indirectDataCopy.filter(
        (item) => item.status != "empInactive"
      );
      if (search) {
        filteredIndirecData = filteredIndirecData.filter((item) => {
          return input == "EngagementS"
            ? item.Name.toLowerCase().includes(search)
            : item.salesPersonName.toLowerCase().includes(search);
        });
      }

      setFilteredIndirectData(filteredIndirecData);
      dispatch(hideIndirectInactive(isShowInactiveChecked));
    } else {
      if (search) {
        var filteredIndirDataCopy = indirectDataCopy.filter((item) => {
          return input == "EngagementS"
            ? item.Name.toLowerCase().includes(search)
            : item.salesPersonName.toLowerCase().includes(search);
        });
        setFilteredIndirectData(filteredIndirDataCopy);
      } else setFilteredIndirectData(indirectDataCopy);
    }
  }, [isShowInactiveChecked, indirectData, search]);

  return (
    <div className="col-md-12">
      <div className="col-md-12">
        {/* <div className="col-md-3 nopadding">
                    <input type="text" placeholder="type to Search" onChange={(e) => setSearch(e.target.value.toLowerCase())} style={{ borderRadius: "5px" }}></input>
                </div> */}
        <div className="col-md-12 row">
          <div className="col-md-4 row" style={{ marginLeft: "6px" }}>
            <label
              className="col-3"
              style={{ display: "initial" }}
              htmlFor="engagementName"
            >
              Search
            </label>
            <span className="col-1 ">:</span>
            <div className="col-6">
              <input
                type="text"
                placeholder="Type to Search"
                onChange={(e) => setSearch(e.target.value.toLowerCase())}
              />
            </div>
          </div>

          {props.value == "EngagementS" ? (
            ""
          ) : (
            <>
              {" "}
              <div className="col-md-2">
                <input
                  type="checkbox"
                  id="showInactive"
                  name="showInactive"
                  onChange={(event) => {
                    setShowInactive((prevState) => {
                      return !prevState;
                    });
                    dispatch(updateIsShowInactiveChecked());
                  }}
                  checked={isShowInactiveChecked}
                ></input>
                <label style={{ marginTop: "-22px", marginLeft: "17%" }}>
                  Show Inactive
                </label>
              </div>
              <div className="col-md-2">
                <input
                  type="checkbox"
                  id="SelectIndividual"
                  name="SelectIndividual"
                  onChange={() => {
                    setisIndividual((prevState) => !prevState);
                    dispatch(updateIsIndivChecked());
                    SetBulkIds(false);
                  }}
                  checked={isIndividualChecked}
                ></input>
                <label style={{ marginTop: "-22px", marginLeft: "17%" }}>
                  Select Individual
                </label>
                &nbsp;
              </div>
              <div className="col-md-4 d-flex justify-content-end">
                <CButton
                  onClick={() => {
                    dispatch(undoSaveSelectSE("undo"));
                  }}
                  style={{ marginRight: "5px", padding: "5px" }}
                >
                  <FaHistory /> Undo
                </CButton>
                <CButton
                  onClick={() => {
                    dispatch(undoSaveSelectSE("save"));
                    setVisible(false);
                  }}
                  style={{ padding: "5px" }}
                >
                  <FaSave /> Save
                </CButton>
              </div>
            </>
          )}
        </div>
      </div>
      {/* <div className="col-md-12 clearfix" style={{ height: '10px' }}></div> */}
      <div className="col-md-4 form-check" style={{ marginLeft: "10px" }}>
        <input
          type="checkbox"
          id="SelectedItems"
          name="SelectedItems"
          className="form-check-input"
          onChange={() => {
            setselectedSE([]);
            dispatch(emptySelectedSEProp());
          }}
          checked={selectedSERedux.length > 0}
        ></input>
        <label className="form-check-label">
          Selected items <span className="col-1 ">:</span>
        </label>
      </div>
      <>
        <SelectedItems
          selectedSEDisp={selectedSEDisp}
          s1={s1}
          visible={visible}
          selectedSE={selectedSE}
          nonRepeatedData={nonRepeatedData}
          propsValue={props.value}
        />
      </>
      <div className="col-md-12 clearfixsss" style={{ height: "10px" }}></div>

      <div className="col-md-12 nopadding row">
        {props.value == "EngagementS" ? (
          ""
        ) : (
          <>
            {" "}
            <div className="col-md-4 pr-0 pl-4 mt-0.5">
              <label>Direct Sales Executives</label>
              <div
                className="col-md-9 card customCard selectSeExpand mt-1 scroll-container directse"
                style={{ width: "100%" }}
              >
                <DirectSE
                  onSelectSE={onSelectSE}
                  setGrpId={setGrpId}
                  dataAccess={dataAccess}
                  salesfullAccess={salesfullAccess}
                  accessData={accessData}
                />
              </div>
            </div>
          </>
        )}

        <div className="col-md-8 customCard">
          {accessData == 1000 ||
          accessData == 500 ||
          loggedUserId == 114598021 ||
          salesfullAccess == 920 ? (
            <>
              <div className="col-md-4 form-check">
                <input
                  type="checkbox"
                  className="form-check-input"
                  onChange={(event) => selectAllIndirect(event.target.checked)}
                  checked={allIndirectSelected}
                  style={{ marginLeft: "-22px" }}
                ></input>
                <label className="form-check-label">
                  {props.value == "EngagementS"
                    ? "All Customers"
                    : "Indirect Sales Executives"}
                  <span className="col-1 ">:</span>
                </label>
              </div>

              <InDirectSE
                data={filteredIndirectData}
                input={input}
                search={search}
                propsValue={props.value}
              />
            </>
          ) : (
            ""
          )}
          {accessData == 1000 ||
          loggedUserId == 114598021 ||
          salesfullAccess == 920 ? (
            <div>
              <div
                className="selectSEformBtns mb-1 mt-3 "
                // style={{ pointerEvents: "none" }}
              >
                <label className="">Virtual Teams</label>

                {!addVirtualTeam && (
                  <div
                    onClick={() => setAddvirtualTeam(true)}
                    className="button-pointer"
                    title="Add new team"
                  >
                    <FaPlusCircle
                      className="button-pointer"
                      title="Add new team"
                    />
                  </div>
                )}
                {addVirtualTeam && (
                  <>
                    <span onClick={() => setAddvirtualTeam(false)}>
                      <BiMinusCircle />
                    </span>
                    <input
                      placeholder="Team Name"
                      name="teamName"
                      id="teamName"
                      onChange={(e) => {
                        setVirtualTeamName(e.target.value);
                      }}
                    ></input>
                    <button
                      className="btn btn-primary btnSE"
                      type="button"
                      title="Add Team"
                      onClick={writeVirtualTeam}
                    >
                      <span>Add</span>
                    </button>
                  </>
                )}

                {/* Validation validation */}
                {validationMessage ? (
                  <div className="statusMsg error">
                    <span>
                      <FaExclamationTriangle />
                      {` ` + validationMessage}
                    </span>
                  </div>
                ) : (
                  ""
                )}
              </div>

              <>
                <div
                  className="row"
                  style={{
                    margin: "0px",
                    border: "1px solid rgb(204, 204, 204)",
                    borderRadius: "3px",
                  }}
                >
                  <div className="scroll-container virtualteam">
                    <VirtualTeams
                      employeeElement={employeeElement}
                      writeVirtualTeam={writeVirtualTeam}
                      setselectedSE={setselectedSE}
                      showInactive={showInactive}
                      search={search}
                      vTeamData={vTeamData}
                      setvTeamData={setvTeamData}
                      getvTeamData={getvTeamData}
                      propsValue={props.value}
                      setValidationMessage={setValidationMessage}
                    />
                  </div>
                </div>
              </>
            </div>
          ) : (
            ""
          )}
        </div>
      </div>
    </div>
  );
});

export default SelectSE;
