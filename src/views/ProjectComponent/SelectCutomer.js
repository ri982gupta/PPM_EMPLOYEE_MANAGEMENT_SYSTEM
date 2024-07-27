import { useState, useEffect, forwardRef, useImperativeHandle } from "react";
// import InDirectSE from "./InDirectSE";
import CustomerSelectedItems from "./CustomerSelectedItems";
// import VirtualTeams from "./VirtualTeams";
// import DirectSE from "./DirectSE";
import fte_active from "../../assets/images/empstatusIcon/fte_active.png";
import fte_inactive from "../../assets/images/empstatusIcon/fte_inactive.png";
import fte_notice from "../../assets/images/empstatusIcon/fte_notice.png";
import subk_active from "../../assets/images/empstatusIcon/subk_active.png";
import subk_inactive from "../../assets/images/empstatusIcon/subk_inactive.png";
import subk_notice from "../../assets/images/empstatusIcon/subk_notice.png";
import { environment } from "../../environments/environment";
import axios from "axios";
// import "./SelectedSE.scss";

const SelectSE = forwardRef((props, ref) => {
  const input = props.value;
  const { newMemberDropdown } = props;
  console.log(input);
  const baseUrl = environment.baseUrl;
  const [showInactive, setShowInactive] = useState(false);
  const [selectedSE, setselectedSE] = useState([]);
  const [selectedSEDisp, setselectedSEDisp] = useState([]);
  const [allIndirectSelected, setallIndirectSelected] = useState(false);
  const [indirectData, setIndirectdata] = useState([]);
  const [isIndividual, setisIndividual] = useState(false);
  const [search, setSearch] = useState("");
  console.log(props.value);

  console.log("in line 29---");
  console.log(newMemberDropdown);
  console.log(props.newMemberDropdown);

  console.log(selectedSE);
  console.log(newMemberDropdown);

  const icons = {
    fte0: (
      <img
        src={fte_inactive}
        alt="(fte_inactive_icon)"
        style={{ height: "12px" }}
        title="Ex-Employee"
      />
    ),
    fte1: (
      <img
        src={fte_active}
        alt="(fte_active_icon)"
        style={{ height: "12px" }}
        title="Active Employee"
      />
    ),
    fte2: (
      <img
        src={fte_notice}
        alt="(fte_notice_icon)"
        style={{ height: "12px" }}
        title="Employee in notice period"
      />
    ),
    subk0: (
      <img
        src={subk_inactive}
        alt="(subk_inactive_icon)"
        style={{ height: "12px" }}
        title="Ex-Contractor"
      />
    ),
    subk1: (
      <img
        src={subk_active}
        alt="(subk_active_icon)"
        style={{ height: "12px" }}
        title="Active Contractor"
      />
    ),
    subk2: (
      <img
        src={subk_notice}
        alt="(subk_notice_icon)"
        style={{ height: "12px" }}
        title="Contractor in notice period"
      />
    ),
  };

  //---------------------------refMethod------------------------------------

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
  const onSelectSE = (emp) => {
    console.log("***********************", emp);

    setselectedSE((prevState) => {
      return prevState.some((el) => el.id === emp.id)
        ? prevState.filter((item) => {
            return item.id !== emp.id;
          })
        : [...prevState, emp];
    });
  };

  const employeeElement = (emp) => {
    return (
      <span
        key={emp.id}
        className="option col-md-3"
        style={{
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
      >
        {props.value == "EngagementS" ? (
          <>
            <input
              type="checkbox"
              id={emp.id}
              name={emp.name}
              onChange={(e) => onSelectSE(emp)}
              checked={selectedSE.some((el) => el.id === emp.id)}
              className="mr-2"
            ></input>
            <span title={emp.Name}>{emp.Name}</span>
          </>
        ) : (
          <>
            {" "}
            <input
              type="checkbox"
              id={emp.id}
              name={emp.salesPersonName}
              onChange={(e) => onSelectSE(emp)}
              checked={selectedSE.some((el) => el.id === emp.id)}
            ></input>
            &nbsp;
            {icons[emp.type]}&nbsp;
            <span title={emp.salesPersonName}>{emp.salesPersonName}</span>
          </>
        )}
      </span>
    );
  };
  console.log("------------------------------------------------------");
  console.log(selectedSE);

  const selectAllIndirect = () => {
    console.log(props.value);
    !allIndirectSelected
      ? setselectedSE((prevState) => {
          const empId = prevState.map((item) => item.id);
          const newArray =
            props.value === "EngagementS"
              ? indirectData.filter((item) => !empId.includes(item.id))
              : indirectData
                  .filter(
                    (item) =>
                      item.status !== (showInactive ? "" : "empInactive")
                  )
                  .filter((item) => !empId.includes(item.id));
          return [...prevState, ...newArray];
        })
      : setselectedSE((prevState) => {
          const empId = indirectData.map((item) => item.id);
          const newArray = prevState.filter((item) => !empId.includes(item.id));
          return newArray;
        });
    setallIndirectSelected((prevState) => !prevState);
  };

  const SelectAllCustomers = () => {
    setselectedSE((prevState) => {
      const empId = prevState.map((item) => item.id);
      const newArray = indirectData.filter((item) => !empId.includes(item.id));
      return [...prevState, ...newArray];
    });
    setallIndirectSelected(true);
  };

  // props.value=="EngagementS"? SelectAllCustomers():""

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
            .get(baseUrl + `/ProjectMS/Engagement/getCustomerName`)
            .then((resp) => {
              const data = resp.data;
              setIndirectdata(data);
            })
            .catch((resp) => {
              console.log(resp);
            });
    }
  };

  //--------------------------------useEffect------------------------------------------
  useEffect(() => {
    setselectedSEDisp(() => {
      return props.value == "EngagementS"
        ? newMemberDropdown
            .filter((item) => {
              return item.name;
              //   .toLowerCase().includes(search);
            })
            .map((item) => {
              return employeeElement(item);
            })
        : newMemberDropdown
            .filter((item) => {
              return item.salesPersonName;
              //   \.toLowerCase().includes(search);
            })
            .map((item) => {
              return employeeElement(item);
            });
    });
    props.selectedItems != undefined && props.setSelectedItems(selectedSE);
  }, [selectedSE, search]);

  {
    props.value == "EngagementS"
      ? ""
      : useEffect(() => {
          setselectedSE((prevState) => {
            return prevState.filter((el) => el.status === "empActive");
          });
        }, [showInactive]);
  }

  useEffect(() => {
    getIndirectData();

    {
    }
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

  return (
    <div className="col-md-12">
      <div className="col-md-12">
        {/* <div className="col-md-3 nopadding">
                    <input type="text" placeholder="type to Search" onChange={(e) => setSearch(e.target.value.toLowerCase())} style={{ borderRadius: "5px" }}></input>
                </div> */}
        <div className="col-md-5 mb-2">
          <div className="form-group row">
            <label className="col-3" htmlFor="engagementName">
              Search
            </label>
            <span className="col-1 ">:</span>
            <div className="col-6">
              <input
                type="text"
                placeholder="type to Search"
                onChange={(e) => setSearch(e.target.value.toLowerCase())}
              />
            </div>
          </div>
        </div>

        {props.value == "EngagementS" ? (
          ""
        ) : (
          <>
            {" "}
            <div className="col-md-3">
              <label>Show Inactive</label>&nbsp;
              <input
                type="checkbox"
                id="showInactive"
                name="showInactive"
                onChange={() => {
                  setShowInactive((prevState) => {
                    return !prevState;
                  });
                }}
                checked={showInactive}
              ></input>
              &nbsp;
            </div>
            <div className="col-md-3">
              <label>Select Individual</label>&nbsp;
              <input
                type="checkbox"
                id="SelectIndividual"
                name="SelectIndividual"
                onChange={() => setisIndividual((prevState) => !prevState)}
                checked={isIndividual}
              ></input>
              &nbsp;
            </div>
          </>
        )}
      </div>
      {/* <div className="col-md-12 clearfix" style={{ height: '10px' }}></div> */}
      <div className="col-md-4 form-check">
        <input
          type="checkbox"
          id="SelectedItems"
          name="SelectedItems"
          className="form-check-input"
          onChange={() => {
            setselectedSE([]);
          }}
          checked={selectedSE.length > 0}
        ></input>
        <label className="form-check-label">
          Selected Items <span className="col-1 ">:</span>
        </label>
      </div>
      <>
        <CustomerSelectedItems
          selectedSEDisp={selectedSEDisp}
          newMemberDropdown={newMemberDropdown}
        />
      </>
      <div className="col-md-12 clearfixsss" style={{ height: "10px" }}></div>

      <div className="col-md-12 nopadding">
        {props.value == "EngagementS" ? (
          ""
        ) : (
          <>
            {" "}
            <div className="col-md-3 pr0">
              <div className="col-md-12 card customCard">
                {/* <DirectSE onSelectSE={onSelectSE} showInactive={showInactive} /> */}
              </div>
            </div>
          </>
        )}
        <div className="col-md-12 customCard">
          <div className="col-md-6 form-check">
            <input
              type="checkbox"
              className="form-check-input"
              onChange={selectAllIndirect}
              checked={allIndirectSelected}
            ></input>
            <label className="form-check-label">
              {props.value == "EngagementS"
                ? "All Customers"
                : "Select All Indirect Sales Executive"}
              <span className="col-1 ">:</span>
            </label>
          </div>
          <>
            {/* <InDirectSE
              employeeElement={employeeElement}
              selectedSE={selectedSE}
              data={indirectData}
              input={input}
              showInactive={showInactive}
              search={search}
            /> */}
          </>
          <div className="col-md-12 clearfix" style={{ height: "20px" }}></div>
          {props.value == "EngagementS" ? (
            ""
          ) : (
            <>
              {" "}
              <div className="col-md-12 card customCard">
                {/* <VirtualTeams
                  employeeElement={employeeElement}
                  setselectedSE={setselectedSE}
                  showInactive={showInactive}
                  search={search}
                /> */}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
});

export default SelectSE;
