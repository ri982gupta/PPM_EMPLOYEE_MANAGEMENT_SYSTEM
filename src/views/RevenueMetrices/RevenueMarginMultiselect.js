import React, { useEffect, useRef, useState } from "react";
import { FaCaretDown } from "react-icons/fa";
import "./RevenueForecastMultiSelect.scss";

const CheckBox = ({ handleCheckChieldElement, isChecked, value, label }) => {
  return (
    <li className={isChecked ? "checked" : "not-Checked"}>
      <input
        onChange={handleCheckChieldElement}
        type="checkbox"
        checked={isChecked}
        value={value}
      />{" "}
      {label}
    </li>
  );
};

const RevenueMarginMultiselect = (props) => {
  const {
    financialMeasures,
    setFinancialMeasures,
    setFormData,
    formData,
    measuresValidation,
  } = props; // Destructure props
  const dropdownRef = useRef(null);

  const [selectedOptions, setSelectedOptions] = useState([
    "Bill Alloc",
    "Bill Actual",
    "Variance",
    "Variance %",
    "Planned",
    "Actual",
    "Variance",
    "Variance %",
    "MOM",
    "MOM %",
    "Planned GM",
    "Actual GM",
    "Variance",
    "Variance %",
  ]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleAllChecked = (id, name) => (event) => {
    const updatedFruits = financialMeasures.map((fruit) =>
      fruit.groupId === id
        ? { ...fruit, isChecked: event.target.checked }
        : fruit
    );
    setFinancialMeasures(updatedFruits);
    updateSelectedOptions(updatedFruits);
  };

  const handleCheckChieldElement = (event) => {
    const updatedFruits = financialMeasures.map((fruit) =>
      `${fruit.groupId}-${fruit.id}` === event.target.value
        ? { ...fruit, isChecked: event.target.checked }
        : fruit
    );
    if (updatedFruits[9].isChecked == true) {
      const up = updatedFruits.map((ele) => {
        if (
          (ele.groupId == 2 && ele.id == "plRev") ||
          (ele.groupId == 2 && ele.id == "plMOM")
        ) {
          ele.isChecked = true;
        }
      });
    } else if (updatedFruits[8].isChecked == true) {
      const up = updatedFruits.map((ele) => {
        if (ele.groupId == 2 && ele.id == "plRev") {
          ele.isChecked = true;
        }
      });
    }
    setFinancialMeasures(updatedFruits);
    updateSelectedOptions(updatedFruits);
  };

  const handleAllChange = (event) => {
    const updatedFruits = financialMeasures.map((fruit) => ({
      ...fruit,
      isChecked: event.target.checked,
    }));

    setFinancialMeasures(updatedFruits);
    updateSelectedOptions(updatedFruits);
  };

  const updateSelectedOptions = (updatedFruits) => {
    const selected = updatedFruits
      ?.filter((fruit) => fruit.isChecked)
      ?.map((fruit) => fruit.value);
    const selectedMeasures = updatedFruits
      ?.filter((fruit) => fruit.isChecked)
      ?.map((fruit) => fruit.id);
    setSelectedOptions(selected);
    setFormData((prevVal) => ({
      ...prevVal,
      ["measures"]: selectedMeasures?.toString(),
    }));
  };

  const handleClickOutside = (e) => {
    if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
      setIsDropdownOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const areAllChecked = financialMeasures?.every((fruit) => fruit?.isChecked);
  return (
    <div
      id="Financialmeasures"
      name="Financialmeasures"
      style={{ cursor: "auto" }}
    >
      <div
        className="RevenueForecastMultiSelect"
        style={{
          border:
            selectedOptions?.length == 0 && measuresValidation
              ? "1px solid #e41b1b"
              : "",
          backgroundColor:
            selectedOptions?.length == 0 && measuresValidation ? "#f0bdbc" : "",
        }}
        ref={dropdownRef}
      >
        <div
          className="RevenueForecastMultiSelect-text"
          onClick={toggleDropdown}
        >
          <span style={{ cursor: "default" }}>
            {selectedOptions?.length === financialMeasures?.length
              ? "<<ALL>>"
              : selectedOptions?.length > 0 &&
                selectedOptions?.length != areAllChecked
              ? selectedOptions?.join(", ")
              : "Select..."}
          </span>
        </div>
        <span
          className="iconbutton"
          style={{ float: "right" }}
          onClick={toggleDropdown}
        >
          <FaCaretDown />
        </span>

        <div className={isDropdownOpen ? "customSelect " : ""}>
          <div className="customDropdown">
            {isDropdownOpen && (
              <div
                className={areAllChecked ? "checked all" : "not-Checked all"}
              >
                <input
                  type="checkbox"
                  onChange={handleAllChange}
                  checked={areAllChecked}
                />{" "}
                ALL
              </div>
            )}

            {isDropdownOpen &&
              [
                { id: 1, name: "Hours" },
                { id: 2, name: "Revenue" },
                { id: 3, name: "Margin" },
              ].map((item) => (
                <div
                  className={
                    financialMeasures
                      ?.filter((fruit) => fruit.groupId === item.id)
                      .every((f) => f.isChecked)
                      ? "checked group"
                      : "not-Checked group"
                  }
                >
                  <span className="groupHeader">
                    <input
                      type="checkbox"
                      onChange={handleAllChecked(item.id, item.name)}
                      checked={financialMeasures
                        ?.filter((fruit) => fruit.groupId === item?.id)
                        ?.every((f) => f.isChecked)}
                    />
                    <strong> {item.name}</strong>
                  </span>
                  <ul className="options">
                    {financialMeasures
                      ?.filter((fruit) => fruit?.groupId === item?.id)
                      ?.map((fruit, index) => (
                        <CheckBox
                          key={`${item.id}-${fruit.id}`}
                          handleCheckChieldElement={handleCheckChieldElement}
                          {...fruit}
                          value={`${item.id}-${fruit.id}`}
                          label={fruit.value}
                        />
                      ))}
                  </ul>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RevenueMarginMultiselect;
