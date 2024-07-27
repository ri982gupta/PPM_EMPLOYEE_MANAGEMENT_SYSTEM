import React, { useEffect, useRef, useState } from "react";
import { FaCaretDown } from "react-icons/fa";
import "./RevenueForecastMultiSelect.scss";
import Utils from "../../Utils";

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

const RevenueForecastMultiSelect = (props) => {
  const {
    financialMeasures,
    setFinancialMeasures,
    setFormData,
    formData,
    setSelectedFinancialMeasures,
    dataAccess,
    selectview,
  } = props; // Destructure props
  const dropdownRef = useRef(null);
  Utils.Log(dataAccess, "dataAccess");

  const [selectedOptions, setSelectedOptions] = useState(["Planned Revenue"]);
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
    setSelectedFinancialMeasures(updatedFruits);
    updateSelectedOptions(updatedFruits);
  };

  const handleCheckChieldElement = (event) => {
    const updatedFruits = financialMeasures.map((fruit) =>
      `${fruit.groupId}-${fruit.id}` === event.target.value
        ? { ...fruit, isChecked: event.target.checked }
        : fruit
    );
    setFinancialMeasures(updatedFruits);
    setSelectedFinancialMeasures(updatedFruits);
    updateSelectedOptions(updatedFruits);
  };

  const handleAllChange = (event) => {
    const updatedFruits = financialMeasures.map((fruit) => ({
      ...fruit,
      isChecked: event.target.checked,
    }));

    setFinancialMeasures(updatedFruits);
    setSelectedFinancialMeasures(updatedFruits);
    updateSelectedOptions(updatedFruits);
  };

  const updateSelectedOptions = (updatedFruits) => {
    const selected = updatedFruits
      .filter((fruit) => fruit.isChecked)
      .map((fruit) => fruit.value);
    const selectedMeasures = updatedFruits
      .filter((fruit) => fruit.isChecked)
      .map((fruit) => fruit.id);
    setSelectedOptions(selected);
    setFormData((prevVal) => ({
      ...prevVal,
      ["Financialmeasures"]: selectedMeasures.toString(),
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

  const areAllChecked = financialMeasures.every((fruit) => fruit.isChecked);

  Utils.Log(formData, "formData in multiselect");
  const dropdownOptions =
    (dataAccess === 919 || dataAccess === 126) &&
    selectview === "consol" &&
    formData.summaryBy.includes("Region")
      ? [
          { id: 1, name: "Planned" },
          { id: 2, name: "Assigned" },
          { id: 3, name: "Actual" },
          { id: 4, name: "Approved" },
          { id: 5, name: "Recognized" },
          { id: 6, name: "Capacity" },
          { id: 7, name: "Billable Approved" },
          { id: 8, name: "Bench Cost" },
        ]
      : [
          { id: 1, name: "Planned" },
          { id: 2, name: "Assigned" },
          { id: 3, name: "Actual" },
          { id: 4, name: "Approved" },
          { id: 5, name: "Recognized" },
          { id: 6, name: "Capacity" },
          { id: 7, name: "Billable Approved" },
        ];
  return (
    <div id="Financialmeasures" name="Financialmeasures">
      <div className="RevenueForecastMultiSelect" ref={dropdownRef}>
        <div
          className="RevenueForecastMultiSelect-text"
          onClick={toggleDropdown}
        >
          <span>
            {selectedOptions.length === financialMeasures.length
              ? "<<ALL>>"
              : selectedOptions.length > 0 &&
                selectedOptions.length != areAllChecked
              ? selectedOptions.join(", ")
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
              dropdownOptions.map((item) => (
                <div
                  key={item.id}
                  className={
                    financialMeasures
                      .filter((fruit) => fruit.groupId === item.id)
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
                        .filter((fruit) => fruit.groupId === item.id)
                        .every((f) => f.isChecked)}
                    />
                    <strong> {item.name}</strong>
                  </span>
                  <ul className="options">
                    {financialMeasures
                      .filter((fruit) => fruit.groupId === item.id)
                      .map((fruit, index) => (
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

export default RevenueForecastMultiSelect;
