import React, { useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateSelectedSEProp } from "../../reducers/SelectedSEReducer";
import fte_active from "../../assets/images/empstatusIcon/fte_active.png";
import fte_inactive from "../../assets/images/empstatusIcon/fte_inactive.png";
import fte_notice from "../../assets/images/empstatusIcon/fte_notice.png";
import subk_active from "../../assets/images/empstatusIcon/subk_active.png";
import subk_inactive from "../../assets/images/empstatusIcon/subk_inactive.png";
import subk_notice from "../../assets/images/empstatusIcon/subk_notice.png";
import "./EmployeeElement.scss";

const EmployeeElement = (props) => {
  const { item, propsValue, isInSelected } = props;
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

  const dispatch = useDispatch();
  const selectedSERedux = useSelector(
    (state) => state.selectedSEState.selectedSEProp
  );

  const isChecked = selectedSERedux.some((obj) => obj.id == item.id)
    ? isInSelected
      ? true
      : selectedSERedux.find((obj) => obj.id == item.id).hasOwnProperty("key")
      ? ""
      : true
    : false;

  return (
    <>
      <span
        key={item.id}
        className="option col-md-4 employee-element"
        style={{
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
          width: "170px",
          marginTop: "6px",
        }}
        title={item.salesPersonName ? item.salesPersonName : item.text}
      >
        {propsValue == "EngagementS" ? (
          <>
            <input
              type="checkbox"
              id={item.id}
              name={item.Name}
              checked={isChecked}
              onChange={(e) => {
                const isChecked = e.target.checked;
                dispatch(updateSelectedSEProp({ item, isChecked }));
              }}
              className="mr-2"
            ></input>
            <span
              className="button-pointer"
              onClick={(event) => {
                const isChecked = !document.getElementById(item.id).checked;
                dispatch(updateSelectedSEProp({ item, isChecked }));
              }}
              title={item.Name}
            >
              {item?.Name}
            </span>
          </>
        ) : (
          <>
            {" "}
            <input
              type="checkbox"
              id={item.id}
              name={item.salesPersonName ? item.salesPersonName : item.text}
              checked={isChecked}
              onChange={(event) => {
                const isChecked = event.target.checked;
                dispatch(updateSelectedSEProp({ item, isChecked }));
              }}
            ></input>
            &nbsp;
            {icons[item.type]}&nbsp;
            <span
              className="button-pointer"
              onClick={(event) => {
                const isChecked = !document.getElementById(item.id).checked;
                dispatch(updateSelectedSEProp({ item, isChecked }));
              }}
            >
              {item.salesPersonName ? item.salesPersonName : item.text}
            </span>
          </>
        )}
      </span>
    </>
  );
};

export default EmployeeElement;
