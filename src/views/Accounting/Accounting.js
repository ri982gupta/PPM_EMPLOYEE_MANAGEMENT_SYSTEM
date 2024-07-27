import React, { useEffect, useState } from "react";
import Company from "./Company";
import ConstCenters from "./ConstCenters";
import ContractTerms from "./ContractTerms";
import ExpenseTypes from "./ExpenseTypes";
import ResourceCostCenter from "./ResourceCostCenter";

function Accounting() {
  const [btnState, setbtnState] = useState(() => {
    // Retrieve the last selected tab from localStorage on component mount
    return localStorage.getItem("selectedAccountTab") || "Company";
  });

  useEffect(() => {
    // Save the selected tab to localStorage whenever it changes
    localStorage.setItem("selectedAccountTab", btnState);
  }, [btnState]);

  return (
    <div>
      <div className="tabs">
        <button
          className={
            btnState === "Company" ? "buttonDisplayClick" : "buttonDisplay"
          }
          onClick={() => {
            setbtnState("Company");
          }}
        >
          Company
        </button>
        <button
          className={
            btnState === "Contact" ? "buttonDisplayClick" : "buttonDisplay"
          }
          onClick={() => {
            setbtnState("Contact");
          }}
        >
          Contact Terms
        </button>
        <button
          className={
            btnState === "Expense" ? "buttonDisplayClick" : "buttonDisplay"
          }
          onClick={() => {
            setbtnState("Expense");
          }}
        >
          Expense Types
        </button>
        <button
          className={
            btnState === "Cost" ? "buttonDisplayClick" : "buttonDisplay"
          }
          onClick={() => {
            setbtnState("Cost");
          }}
        >
          Cost Centers
        </button>
        <button
          className={
            btnState === "Resource" ? "buttonDisplayClick" : "buttonDisplay"
          }
          onClick={() => {
            setbtnState("Resource");
          }}
        >
          Resource Cost Center
        </button>
      </div>

      {btnState === "Company" ? <Company /> : ""}
      {btnState === "Contact" ? <ContractTerms /> : ""}
      {btnState === "Expense" ? <ExpenseTypes /> : ""}
      {btnState === "Cost" ? <ConstCenters /> : ""}
      {btnState === "Resource" ? <ResourceCostCenter /> : ""}
    </div>
  );
}

export default Accounting;
