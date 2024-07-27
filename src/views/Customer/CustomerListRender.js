import { useEffect, useState } from "react";
import { BiLoaderCircle } from "react-icons/bi";

export default function CustomerListRender(params) {
  const { employeeElement, selectedCust, data, search, isLoading } = params;

  const [custDataList, setcustDataList] = useState([]);

  useEffect(() => {
    setcustDataList(() =>
      data
        ?.filter((item) => {
          return item.fullName?.toLowerCase().includes(search);
        })
        .map((item) => {
          return employeeElement(item);
        })
    );
  }, [selectedCust, data, search]);

  return (
    <div className="row engScroll">
      {custDataList?.length === 0 && (
        <div className="col-md-12" id="noExecDiv">
          {/* No Executives found */}
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
  );
}
