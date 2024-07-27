import { useState, useEffect, forwardRef, useImperativeHandle } from "react";
import CustomerListRender from "./CustomerListRender";
import SelectedItems from "./SelectedItems";
import { environment } from "../../environments/environment";
import axios from "axios";

const Customer = forwardRef((props, ref) => {
  const baseUrl = environment.baseUrl;
  const [selectedCust, setselectedCust] = useState([]);
  const [selectedCustDisp, setselectedCustDisp] = useState([]);
  const [allIndirectSelected, setallIndirectSelected] = useState(false);
  const [custData, setcustData] = useState([]);
  const [search, setSearch] = useState("");
  const loggedUserId = localStorage.getItem("resId");
  const [isLoading, setIsLoading] = useState(false);
  console.log(props.dataAccess);
  //---------------------------refMethod------------------------------------

  useImperativeHandle(ref, () => ({
    setGlobalState() {
      localStorage.setItem("selectedCust", JSON.stringify(selectedCust));
    },
    resetTOlocalState() {
      const localSE =
        localStorage.getItem("selectedCust") === null
          ? []
          : JSON.parse(localStorage.getItem("selectedCust"));
      setselectedCust(localSE);
      localSE.length === custData.length
        ? setallIndirectSelected(true)
        : setallIndirectSelected(false);
    },
  }));

  //---------------------------method------------------------------------------
  const onSelectCust = (emp) => {
    setselectedCust((prevState) => {
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
            checked={selectedCust.some((el) => el.id === emp.id)}
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
      ? setselectedCust((prevState) => {
          const empId = prevState.map((item) => item.id);
          const newArray = custData.filter((item) => !empId.includes(item.id));
          return [...prevState, ...newArray];
        })
      : setselectedCust((prevState) => {
          const empId = custData.map((item) => item.id);
          const newArray = prevState.filter((item) => !empId.includes(item.id));
          return newArray;
        });
    setallIndirectSelected((prevState) => !prevState);
  };

  const getcustData = () => {
    setIsLoading(true);
    axios
      .get(
        props.vendorSelectBox == "VendorSelect"
          ? baseUrl + `/VendorMS/vendor/getVendorsNameandId`
          : props.flag == 1
          ? baseUrl + `/customersms/Customers/getCustomersList`
          : props.flag == 2
          ? baseUrl + `/SalesMS/sales/getSFOpportunityAccounts`
          : props.flag == 3 && props.dataAccess == 600
          ? baseUrl +
            `/CommonMS/master/getCustomers?loggedUserId=${loggedUserId}`
          : props.dataAccess == 690
          ? baseUrl +
            `/ProjectMS/project/getCustomersByDP?loggedUserId=${loggedUserId}`
          : props.dataAccess == 641
          ? baseUrl +
            `/ProjectMS/project/getCustomersByCsl?loggedUserId=${loggedUserId}`
          : props.dataAccess == 932 || props.dataAccess == 500
          ? baseUrl +
            `/dashboardsms/allocationDashboard/getCustomers?loggedUserId=${loggedUserId}`
          : props.dataAccess == 400
          ? baseUrl +
            `/dashboardsms/allocationDashboard/getCustomers?loggedUserId=${loggedUserId}`
          : baseUrl +
            `/administrationms/subkconversiontrend/geActiveCustomerList`
      )

      .then((resp) => {
        const data = resp.data;
        {
          props.flag == 2 ? setcustData(data.sfAccResult) : setcustData(data);
        }
        setIsLoading(false);
      })
      .catch((resp) => {
        setIsLoading(false);
      });
  };

  //--------------------------------useEffect------------------------------------------
  useEffect(() => {
    setselectedCustDisp(() => {
      return selectedCust
        .filter((item) => {
          return item.fullName?.toLowerCase().includes(search);
        })
        .map((item) => {
          return employeeElement(item);
        });
    });
  }, [selectedCust, search]);

  useEffect(() => {
    getcustData();
  }, []);

  useEffect(() => {
    const localSE =
      localStorage.getItem("selectedCust") === null
        ? []
        : JSON.parse(localStorage.getItem("selectedCust"));
    setselectedCust(localSE);
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
            setselectedCust([]);
            setallIndirectSelected(false);
          }}
          checked={selectedCust.length > 0}
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
          {props.vendorSelectBox == "VendorSelect" ? (
            <span>All Vendors </span>
          ) : (
            <span>All Customers</span>
          )}
          <span className="col-1">:</span>
        </label>
        &nbsp;
      </div>
      <>
        <CustomerListRender
          employeeElement={employeeElement}
          selectedCust={selectedCust}
          data={custData}
          search={search}
          isLoading={isLoading}
        />
      </>
    </div>
  );
});

export default Customer;
