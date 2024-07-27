import React from "react";
import fte_active from "../../assets/images/empstatusIcon/fte_active.png";
import fte_inactive from "../../assets/images/empstatusIcon/fte_inactive.png";
import fte_notice from "../../assets/images/empstatusIcon/fte_notice.png";
import subk_active from "../../assets/images/empstatusIcon/subk_active.png";
import subk_inactive from "../../assets/images/empstatusIcon/subk_inactive.png";
import subk_notice from "../../assets/images/empstatusIcon/subk_notice.png";
import { FaUser } from "react-icons/fa";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateSelectedSEProp } from "../../reducers/SelectedSEReducer";
import EmployeeElement from "./EmployeeElement";
function SelectedItems(props) {
  const { selectedSEDisp, s1, nonRepeatedData } = props;
  const [dataList, setDataList] = useState([]);
  const filteredData = s1.filter((item) => item.key !== "id");
  const [visible, setVisble] = useState(true);
  const sales = filteredData.salesPersonName;
  const [checkedItems, setCheckedItems] = useState([]);
  const selectedSERedux = useSelector(
    (state) => state.selectedSEState.selectedSEProp
  );
  const isShowInactiveChecked = useSelector(
    (state) => state.selectedSEState.isShowInactiveChecked
  );
  const dispatch = useDispatch();
  const icons = {
    fte0: (
      <img
        src={fte_inactive}
        alt="(fte_inactive_icon)"
        style={{ height: "12px", marginTop: "-5px", marginRight: "10px" }}
        title="Ex-Employee"
      />
    ),

    fte1: (
      <img
        src={fte_active}
        alt="(fte_active_icon)"
        style={{ height: "12px", marginTop: "-5px", marginRight: "10px" }}
        title="Active Employee"
      />
    ),

    fte2: (
      <img
        src={fte_notice}
        alt="(fte_notice_icon)"
        style={{ height: "12px", marginTop: "-5px", marginRight: "10px" }}
        title="Employee in notice period"
      />
    ),

    subk0: (
      <img
        src={subk_inactive}
        alt="(subk_inactive_icon)"
        style={{ height: "12px", marginTop: "-5px", marginRight: "10px" }}
        title="Ex-Contractor"
      />
    ),

    subk1: (
      <img
        src={subk_active}
        alt="(subk_active_icon)"
        style={{ height: "12px", marginTop: "-5px", marginRight: "10px" }}
        title="Active Contractor"
      />
    ),

    subk2: (
      <img
        src={subk_notice}
        alt="(subk_notice_icon)"
        style={{ height: "12px", marginTop: "-5px", marginRight: "10px" }}
        title="Contractor in notice period"
      />
    ),
  };

  return (
    <div className="row engScroll" style={{ width: "98%", marginLeft: "14px" }}>
      {selectedSERedux.length === 0 ? (
        <div className="col-md-12">None Selected</div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "auto auto auto auto",
          }}
        >
          {selectedSERedux?.map((item) => {
            return (
              <div key={item.id}>
                <span>
                  {visible == true && (
                    <EmployeeElement
                      item={item}
                      key={item.id}
                      propsValue={props.propsValue}
                      isInSelected={true}
                    />
                  )}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
export default SelectedItems;
