import { useState, useEffect, forwardRef, useImperativeHandle } from "react";
import CustomerListRender from "../Customer/CustomerListRender";
import SelectedItems from "../Customer/SelectedItems";
import { environment } from "../../environments/environment";
import axios from "axios";
import SalesCustomerList from "../Customer/SalesCustomerList";

window.addEventListener("beforeunload", () => {
  localStorage.removeItem("selectedEngCust");
  localStorage.removeItem("selectedEngCustOne");
});

const SalesCustomer = forwardRef((props, ref) => {
  const baseUrl = environment.baseUrl;
  const [selectedEngCust, setSelectedEngCust] = useState([]);
  const [selectedCustDisp, setselectedCustDisp] = useState([]);
  const [allIndirectSelected, setallIndirectSelected] = useState(false);
  const [custData, setcustData] = useState([]);
  const [custDataOne, setcustDataOne] = useState([]);
  const [search, setSearch] = useState("");

  //======
  const [selectedEngCustOne, setSelectedEngCustOne] = useState([]);
  const [selectedCustDispOne, setselectedCustDispOne] = useState([]);
  const [criterionCustData, setCriterionCustData] = useState([]);

  const [allIndirectSelectedOne, setallIndirectSelectedOne] = useState(false);
  const [allIndirectSelectedTwo, setallIndirectSelectedTwo] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  //---------------------------refMethod------------------------------------

  useImperativeHandle(ref, () => ({
    setGlobalState() {
      localStorage.setItem("selectedEngCust", JSON.stringify(selectedEngCust));

      localStorage.setItem(
        "selectedEngCustOne",
        JSON.stringify(selectedEngCustOne)
      );
    },

    resetTOlocalState() {
      const localSE =
        localStorage.getItem("selectedEngCust") === null
          ? []
          : JSON.parse(localStorage.getItem("selectedEngCust"));
      setSelectedEngCust(localSE);
      localSE.length === custData?.length
        ? setallIndirectSelected(true)
        : setallIndirectSelected(false);
      const localSET =
        localStorage.getItem("selectedEngCustOne") === null
          ? []
          : JSON.parse(localStorage.getItem("selectedEngCustOne"));
      setSelectedEngCustOne(localSET);
      localSET.length === custDataOne?.length
        ? setallIndirectSelectedOne(true)
        : setallIndirectSelectedOne(false);
    },
  }));

  //---------------------------method------------------------------------------
  const onSelectCust = (emp) => {
    setSelectedEngCust((prevState) => {
      return prevState.some((el) => el.id === emp.id)
        ? prevState.filter((item) => {
            return item.id !== emp.id;
          })
        : [...prevState, emp];
    });
  };

  //=========
  const onSelectCustOne = (emp) => {
    setSelectedEngCustOne((prevState) => {
      return prevState.some((el) => el.id === emp.id)
        ? prevState.filter((item) => {
            return item.id !== emp.id;
          })
        : [...prevState, emp];
    });
  };
  //===========

  const employeeElement = (emp) => {
    return (
      <div key={emp.id} className="option col-md-3 ellipsis row">
        <div className="col-md-2" style={{ marginTop: "3px", width: "10px" }}>
          {" "}
          <input
            type="checkbox"
            id={emp.id}
            style={{
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              // marginRight: "10px",
              marginTop: "-2px",
            }}
            // name={emp.fullName}
            onChange={(e) => onSelectCust(emp)}
            checked={selectedEngCust.some((el) => el.id === emp.id)}
            className="mr-2"
          ></input>
        </div>

        <div
          className=" col-md-10 customerRoleMap"
          style={{
            width: "215px",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
          title={emp.fullName}
        >
          {emp.fullName}
        </div>
      </div>
    );
  };
  //=============

  const employeeElementOne = (emp) => {
    return (
      <div key={emp.id} className="option col-md-3 ellipsis row">
        <div className="col-md-2" style={{ marginTop: "3px", width: "10px" }}>
          {" "}
          <input
            type="checkbox"
            id={emp.id}
            style={{
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              // marginRight: "10px",
              marginTop: "-2px",
            }}
            // name={emp.fullName}
            onChange={(e) => onSelectCustOne(emp)}
            checked={selectedEngCustOne.some((el) => el.id === emp.id)}
            className="mr-2"
          ></input>
        </div>

        <div
          className=" col-md-10 customerRoleMap"
          style={{
            width: "215px",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
          title={emp.fullName}
        >
          {emp.fullName}
        </div>
      </div>
    );
  };

  const employeeElementTwo = (emp) => {
    return (
      <div key={emp.id} className="option col-md-3 ellipsis row">
        <div className="col-md-2" style={{ marginTop: "3px", width: "10px" }}>
          {" "}
          <input
            type="checkbox"
            id={emp.id}
            style={{
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              // marginRight: "10px",
              marginTop: "-2px",
            }}
            // name={emp.fullName}
            onChange={(e) => onSelectCustOne(emp)}
            checked={selectedEngCustOne.some((el) => el.id === emp.id)}
            className="mr-2"
          ></input>
        </div>

        <div
          className=" col-md-10 customerRoleMap"
          style={{
            width: "215px",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
          title={emp.fullName}
        >
          {emp.fullName}
        </div>
      </div>
    );
  };

  //=============
  const selectAllIndirect = () => {
    !allIndirectSelected
      ? setSelectedEngCust((prevState) => {
          const empId = prevState.map((item) => item.id);
          const newArray = custData.filter((item) => !empId.includes(item.id));
          return [...prevState, ...newArray];
        })
      : setSelectedEngCust((prevState) => {
          const empId = custData.map((item) => item.id);
          const newArray = prevState.filter((item) => !empId.includes(item.id));
          return newArray;
        });
    setallIndirectSelected((prevState) => !prevState);
  };

  const selectAllIndirectOne = () => {
    !allIndirectSelectedOne
      ? setSelectedEngCustOne((prevState) => {
          const empId = prevState.map((item) => item.id);
          const newArray = custDataOne.filter(
            (item) => !empId.includes(item.id)
          );
          return [...prevState, ...newArray];
        })
      : setSelectedEngCustOne((prevState) => {
          const empId = custDataOne.map((item) => item.id);
          const newArray = prevState.filter((item) => !empId.includes(item.id));
          return newArray;
        });
    setallIndirectSelectedOne((prevState) => !prevState);
  };

  const selectAllIndirectTwo = () => {
    !allIndirectSelectedTwo
      ? setSelectedEngCustOne((prevState) => {
          const empId = prevState.map((item) => item.id);
          const newArray = criterionCustData.filter(
            (item) => !empId.includes(item.id)
          );
          return [...prevState, ...newArray];
        })
      : setSelectedEngCustOne((prevState) => {
          const empId = criterionCustData.map((item) => item.id);
          const newArray = prevState.filter((item) => !empId.includes(item.id));
          return newArray;
        });
    setallIndirectSelectedTwo((prevState) => !prevState);
  };

  const getcustData = () => {
    setIsLoading(true);
    axios
      .get(baseUrl + `/SalesMS/services/customerProspects`)

      .then((resp) => {
        const data = resp.data;
        setcustData(data);
        setIsLoading(false);
        props.setPopupIsLoading(false);
      })
      .catch((resp) => {
        console.log(resp);
      });
  };

  const getcustDataOne = () => {
    axios
      .get(
        baseUrl + `/administrationms/subkconversiontrend/geActiveCustomerList`
      )

      .then((resp) => {
        const data = resp.data;
        setcustDataOne(data);
      })
      .catch((error) => console.log(error));
  };

  const getCriterionCustData = () => {
    const requestBody = {
      executiveIds: props.executiveIds,
    };
    axios
      .post(baseUrl + `/SalesMS/services/customerCriteria`, requestBody)
      .then((res) => {
        setCriterionCustData(res.data);
      })
      .catch((error) => console.log(error));
  };
  //--------------------------------useEffect------------------------------------------
  useEffect(() => {
    setselectedCustDisp(() => {
      return selectedEngCust
        .filter((item) => {
          return item.fullName?.toLowerCase().includes(search);
        })
        .map((item) => {
          return employeeElement(item);
        });
    });
  }, [selectedEngCust, search]);
  //=====
  useEffect(() => {
    setselectedCustDispOne(() => {
      return selectedEngCustOne
        .filter((item) => {
          return item.fullName?.toLowerCase().includes(search);
        })
        .map((item) => {
          return employeeElementOne(item);
        });
    });
  }, [selectedEngCustOne, search]);
  //====

  useEffect(() => {
    getcustData();
    getcustDataOne();
    getCriterionCustData();
  }, []);

  useEffect(() => {
    const localSE =
      localStorage.getItem("selectedEngCust") === null
        ? []
        : JSON.parse(localStorage.getItem("selectedEngCust"));
    setSelectedEngCust(localSE);
    custData?.length == localSE?.length
      ? setallIndirectSelected(true)
      : setallIndirectSelected(false);
  }, [custData]);
  //===========================

  useEffect(() => {
    const localSE =
      localStorage.getItem("selectedEngCustOne") === null
        ? []
        : JSON.parse(localStorage.getItem("selectedEngCustOne"));
    setSelectedEngCustOne(localSE);
    custDataOne?.length == localSE?.length &&
    criterionCustData?.length == localSE?.length
      ? (setallIndirectSelectedOne(true), setallIndirectSelectedTwo(true))
      : (setallIndirectSelectedOne(false), setallIndirectSelectedTwo(false));
  }, [custDataOne, criterionCustData]);
  // useEffect(() => {
  // localStorage.removeItem("selectedEngCust");
  // localStorage.removeItem("selectedEngCustOne");  }, []);

  return (
    <div className="col-md-12 ">
      <div className="col-md-12 mb-2">
        <div className="col-md-5 ">
          <div className="form-group row">
            <label className="col-3" htmlFor="engagementName">
              Search
            </label>
            <span className="col-1 ">:</span>
            <div className="col-6">
              <input
                type="text"
                placeholder="minimum 3 characters"
                onChange={(e) => setSearch(e.target.value.toLowerCase())}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="col-md-4 form-check">
        <input
          type="checkbox"
          id="SelectedItems"
          name="SelectedItems"
          className="form-check-input"
          onChange={() => {
            setSelectedEngCust([]);
            setSelectedEngCustOne([]);
            setallIndirectSelectedOne(false);
            setallIndirectSelected(false);
          }}
          checked={selectedEngCust.length > 0 || selectedEngCustOne.length > 0}
        ></input>
        <label className="form-check-label">
          Selected Items<span className="col-1">:</span>
        </label>
      </div>

      <>
        <div className="col-md-12 my-3 ">
          <SelectedItems
            selectedCustDisp={selectedCustDisp}
            selectedCustDispOne={selectedCustDispOne}
          />
        </div>
      </>

      <div className="col-md-6 form-check">
        <input
          type="checkbox"
          className="form-check-input"
          onChange={selectAllIndirect}
          checked={allIndirectSelected}
        ></input>{" "}
        <label className="form-check-label">
          Prospects<span className="col-1">:</span>
        </label>
        &nbsp;
      </div>
      <SalesCustomerList
        employeeElement={employeeElement}
        selectedCust={selectedEngCust}
        data={custData}
        search={search}
        isLoading={isLoading}
        //custDataOne={custDataOne}
      />

      <div className="col-md-6 form-check mt-3">
        <input
          type="checkbox"
          className="form-check-input"
          onChange={selectAllIndirectTwo}
          checked={allIndirectSelectedTwo}
        ></input>{" "}
        <label className="form-check-label">
          Criterion Customers (Customers of Selected Sales Executives)
          <span className="col-1">:</span>
        </label>
        &nbsp;
      </div>
      <SalesCustomerList
        employeeElement={employeeElementTwo}
        selectedCust={selectedEngCustOne}
        data={criterionCustData}
        search={search}
        //custDataOne={custDataOne}
      />

      <div className="col-md-6 form-check mt-3">
        <input
          type="checkbox"
          className="form-check-input"
          onChange={selectAllIndirectOne}
          checked={allIndirectSelectedOne}
        ></input>{" "}
        <label className="form-check-label">
          All Customers<span className="col-1">:</span>
        </label>
        &nbsp;
      </div>
      <SalesCustomerList
        employeeElement={employeeElementOne}
        selectedCust={selectedEngCustOne}
        data={custDataOne}
        search={search}
        //custDataOne={custDataOne}
      />
    </div>
  );
});

export default SalesCustomer;
