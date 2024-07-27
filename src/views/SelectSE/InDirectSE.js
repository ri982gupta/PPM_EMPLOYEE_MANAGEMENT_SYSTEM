import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import EmployeeElement from "./EmployeeElement";

export default function InDirectSE(params) {
  const { data, input, search, propsValue } = params;

  const [indirectseList, setindirectseList] = useState([]);
  const selectedSERedux = useSelector(
    (state) => state.selectedSEState.selectedSEProp
  );

  useEffect(() => {
    setindirectseList(() =>
      input == "EngagementS"
        ? data
            .filter((item) => {
              return item.Name.toLowerCase().includes(search);
            })
            .map((item) => {
              return (
                <EmployeeElement
                  item={item}
                  key={item.id}
                  propsValue={propsValue}
                />
              );
            })
        : data
            .filter((item) => {
              return item.salesPersonName.toLowerCase().includes(search);
            })
            .map((item) => {
              return (
                <EmployeeElement
                  item={item}
                  key={item.id}
                  propsValue={propsValue}
                />
              );
            })
    );
  }, [selectedSERedux, data, search]);

  return (
    <div
      className="row scroll-container indirectse"
      style={{ margin: "0px", border: "1px solid #ccc", borderRadius: "3px" }}
    >
      {indirectseList.length === 0 && (
        <div className="col-md-12" id="noExecDiv">
          No Executives found
        </div>
      )}
      {indirectseList}
    </div>
  );
}
