import { useEffect, useState } from "react";
import { BiLoaderCircle } from "react-icons/bi";

export default function SalesCustomerList(params) {
  const {
    employeeElement,
    selectedCust,
    data,
    search,
    custDataOne,
    isLoading,
  } = params;

  const [custDataList, setcustDataList] = useState([]);
  const [custDataListOne, setcustDataListOne] = useState([]);

  useEffect(() => {
    setcustDataList(() =>
      data
        .filter((item) => {
          return item.fullName?.toLowerCase().includes(search);
        })
        .map((item) => {
          return employeeElement(item);
        })
    );
  }, [selectedCust, data, search]);

  //   useEffect(() => {
  //     setcustDataListOne(() =>
  //       custDataOne
  //         .filter((item) => {
  //           return item.fullName?.toLowerCase().includes(search);
  //         })
  //         .map((item) => {
  //           return employeeElement(item);
  //         })
  //     );
  //   }, [selectedCust, custDataOne, search]);

  return (
    <>
      <div className="row engScroll">
        {custDataList.length === 0 && (
          <div className="col-md-12" id="noExecDiv">
            No Executives found
          </div>
        )}
        {isLoading ? (
          <div className="loader">
            <div className="loader-animation" style={{ textAlign: "center" }}>
              <>
                Loading...
                <BiLoaderCircle />
              </>
            </div>
          </div>
        ) : (
          ""
        )}

        {custDataList}
      </div>
      {/* <div className="row engScroll">
        {custDataListOne.length === 0 && (
          <div className="col-md-12" id="noExecDiv">
            No Executives found
          </div>
        )}

        {custDataListOne}
      </div> */}
    </>
  );
}
