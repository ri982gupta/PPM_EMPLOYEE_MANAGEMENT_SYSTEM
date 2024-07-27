import { useState, useEffect, forwardRef, useImperativeHandle } from "react";
import CustomerListRender from "../Customer/CustomerListRender";
import SelectedItems from "../Customer/SelectedItems";
import { environment } from "../../environments/environment";
import axios from "axios";

const SalesReviewsCustomer = forwardRef((props, ref) => {
  const baseUrl = environment.baseUrl;
  const [selectedEngCust, setSelectedEngCust] = useState([]);
  const [selectedCustDisp, setselectedCustDisp] = useState([]);
  const [allIndirectSelected, setallIndirectSelected] = useState(false);
  const [custData, setcustData] = useState([]);
  const [search, setSearch] = useState("");
  //---------------------------refMethod------------------------------------

  useImperativeHandle(ref, () => ({
    setGlobalState() {
      localStorage.setItem("selectedEngCust", JSON.stringify(selectedEngCust));
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
              marginTop: "-2px",
            }}
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

  const getcustData = () => {
    axios
      .get(baseUrl + `/ProjectMS/project/activeSalesReviewsCustomers`)

      .then((resp) => {
        const data = resp.data;
        console.log("respone--" + data.length);
        console.log(data);
        setcustData(data);
      })
      .catch((resp) => {
        console.log(resp);
      });
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

  useEffect(() => {
    getcustData();
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
            setallIndirectSelected(false);
          }}
          checked={selectedEngCust.length > 0}
        ></input>
        <label className="form-check-label">
          Selected Items<span className="col-1">:</span>
        </label>
      </div>

      <>
        <div className="col-md-12 my-3 ">
          <SelectedItems selectedCustDisp={selectedCustDisp} />
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
          All Customers<span className="col-1">:</span>
        </label>
        &nbsp;
      </div>
      <>
        <CustomerListRender
          employeeElement={employeeElement}
          selectedCust={selectedEngCust}
          data={custData}
          search={search}
        />
      </>
    </div>
  );
});

export default SalesReviewsCustomer;
