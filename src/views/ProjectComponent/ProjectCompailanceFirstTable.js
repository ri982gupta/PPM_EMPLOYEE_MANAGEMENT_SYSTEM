import { Column } from "ag-grid-community";
import { DataTable } from "primereact/datatable";
import React, { useEffect, useState } from "react";

function FirstTable(props) {
  const {
    tableData,
    selecttype,
    dropdowns,
    setoldData,
    setnewData,
    CompliancData,
    newData,
    setComplianceTable,
    compliancetable,
    setValidationMessage,
    validationMessage,
    comments,
    setTableData,
    isUserManager,
    pcqaCompl,
    pcqa,
    setWeightageData,
    weightagedata,
    setComments,
    managersname,
    loggedUserId,
    setPcqaComments,
    setPmComments,
    pcqracomments,
    setDropdownData,
    pmcomments,
    dropdowndata,
    calculateComplianceScore,
    setWeightage,
    weightage,
  } = props;
  // const [dropdownValues, setDropdownValues] = useState({});
  // const [previousOption, setPreviousOption] = useState("");

  // const [finalComments, setFinalComments] = useState([]);

  // comments?.map((data) => {
  //   tableData?.map((value) => {
  //     if (data.audit_check_point_id == value.id) {
  //       value["compliance_val"] = data.compliance_val;
  //       value["remarks_id"] = data.id;
  //       value["pm_remarks"] = data.pm_remarks;
  //       value["project_audit_dtl_id"] = data.project_audit_dtl_id;
  //       value["remarks"] = data.remarks;
  //       value["weightage"] = data.weightage;
  //     }
  //   });
  // });

  // const onChangeSetDate = (e, rowData) => {
  //   setDropdownData((prev) => ({
  //     ...prev,
  //     [rowData.id]: e?.target?.value,
  //   }));
  // };
  // let previousValues = [];

  // useEffect(() => {
  //   calculateComplianceScore();
  // }, []);
  // const handalChange = (e, rowData, decrementOption) => {
  //   console.log(compliancetable[0]?.audit_state);
  //   let fieldValue;
  //   //================

  //   comments.forEach((comment) => {
  //     const auditCheckPointId = comment.audit_check_point_id.toString();
  //     const weightageData = weightage[auditCheckPointId];

  //     if (weightageData) {
  //       weightageData.rowDataId = comment.audit_check_point_id;
  //       weightageData.fieldValue = parseInt(comment.weightage);
  //       weightageData.targetValue = comment.compliance_val.toString();
  //     } else {
  //       weightage[auditCheckPointId] = {
  //         rowDataId: comment.audit_check_point_id,
  //         fieldValue: parseInt(comment.weightage),
  //         targetValue: comment.compliance_val.toString(),
  //       };
  //     }
  //   });

  //   //=============
  //   if (compliancetable[0]?.audit_state === 1184) {
  //     fieldValue = rowData.initiation_weightage;
  //   } else if (compliancetable[0]?.audit_state === 1185) {
  //     fieldValue = rowData.steady_state_weightage;
  //   } else if (compliancetable[0]?.audit_state === 1186) {
  //     fieldValue = rowData.closure_weightage;
  //   } else {
  //     fieldValue = 0;
  //   }
  //   setWeightageData((prev) => {
  //     const updatedData = { ...prev };
  //     updatedData[rowData.id] = {
  //       rowDataId: rowData.id,
  //       fieldValue: fieldValue,
  //     };
  //     return updatedData;
  //   });

  //   console.log(fieldValue);

  //   if (selecttype === 1184) {
  //     fieldValue = rowData.initiation_weightage;
  //   } else if (selecttype === 1185) {
  //     fieldValue = rowData.steady_state_weightage;
  //   } else if (selecttype === 1186) {
  //     fieldValue = rowData.closure_weightage;
  //   } else {
  //     fieldValue = 0;
  //   }
  //   previousValues.push(fieldValue);
  //   setWeightage((prev) => {
  //     const updatedWeightage = { ...prev };
  //     if (fieldValue === prev[rowData.id]) {
  //       delete updatedWeightage[rowData.id];
  //     } else {
  //       updatedWeightage[rowData.id] = {
  //         rowDataId: rowData.id,
  //         targetValue: e.target.value,
  //         fieldValue: fieldValue,
  //       };
  //     }
  //     // setWeightageData(fieldValue);
  //     return updatedWeightage;
  //   });

  //   setDropdownData((prev) => ({
  //     ...prev,
  //     [rowData.id]: e?.target?.value,
  //   }));

  //   const updatedComplianceTable = [...compliancetable];
  //   setValidationMessage(false);
  //   if (e?.target?.value == "1205") {
  //     const fullyImplemented = updatedComplianceTable[0]?.full_impl_compl || 0;

  //     updatedComplianceTable[0] = {
  //       ...updatedComplianceTable[0],
  //       full_impl_compl: fullyImplemented + 1,
  //     };
  //   }

  //   if (e?.target?.value == "1206") {
  //     const partiallyImplemented =
  //       updatedComplianceTable[0]?.parti_impl_compl || 0;
  //     updatedComplianceTable[0] = {
  //       ...updatedComplianceTable[0],
  //       parti_impl_compl: partiallyImplemented + 1,
  //     };
  //   }

  //   if (e?.target?.value === "1207") {
  //     const notImplemented = updatedComplianceTable[0]?.not_impl_compl || 0;
  //     updatedComplianceTable[0] = {
  //       ...updatedComplianceTable[0],
  //       not_impl_compl: notImplemented + 1,
  //     };
  //   }

  //   if (e?.target?.value == "1208") {
  //     const notYet = updatedComplianceTable[0]?.not_yet_compl || 0;
  //     updatedComplianceTable[0] = {
  //       ...updatedComplianceTable[0],
  //       not_yet_compl: notYet + 1,
  //     };
  //   }

  //   if (e?.target?.value == "1209") {
  //     const notApplicable = updatedComplianceTable[0]?.not_appl_compl || 0;
  //     updatedComplianceTable[0] = {
  //       ...updatedComplianceTable[0],
  //       not_appl_compl: notApplicable + 1,
  //     };
  //   }
  //   if (decrementOption == "1205") {
  //     const fullyImplemented = updatedComplianceTable[0]?.full_impl_compl || 0;
  //     updatedComplianceTable[0] = {
  //       ...updatedComplianceTable[0],
  //       full_impl_compl: fullyImplemented - 1,
  //     };
  //   }

  //   if (decrementOption == "1206") {
  //     const partiallyImplemented =
  //       updatedComplianceTable[0]?.parti_impl_compl || 0;
  //     updatedComplianceTable[0] = {
  //       ...updatedComplianceTable[0],
  //       parti_impl_compl: partiallyImplemented - 1,
  //     };
  //   }

  //   if (decrementOption == "1207") {
  //     const notImplemented = updatedComplianceTable[0]?.not_impl_compl || 0;
  //     updatedComplianceTable[0] = {
  //       ...updatedComplianceTable[0],
  //       not_impl_compl: notImplemented - 1,
  //     };
  //   }

  //   if (decrementOption == "1208") {
  //     const notYet = updatedComplianceTable[0]?.not_yet_compl || 0;
  //     updatedComplianceTable[0] = {
  //       ...updatedComplianceTable[0],
  //       not_yet_compl: notYet - 1,
  //     };
  //   }

  //   if (decrementOption == "1209") {
  //     const notApplicable = updatedComplianceTable[0]?.not_appl_compl || 0;
  //     updatedComplianceTable[0] = {
  //       ...updatedComplianceTable[0],
  //       not_appl_compl: notApplicable - 1,
  //     };
  //   }

  //   updatedComplianceTable[0] = {
  //     ...updatedComplianceTable[0],
  //     [rowData.id]: e.target.value,
  //   };
  //   setComplianceTable(updatedComplianceTable);
  // };
  // useEffect(() => {
  //   calculateComplianceScore();
  // }, [weightage]);

  // const handlechangeComments = (e, rowData) => {
  //   setPcqaComments((prev) => ({
  //     ...prev,
  //     [rowData.id]: e,
  //   }));
  // };

  // const handlechangePMComments = (e, rowData) => {
  //   setPmComments((prev) => ({
  //     ...prev,
  //     [rowData.id]: e,
  //   }));
  // };

  // const renderSNo = (rowData, column) => {
  //   const index = tableData.indexOf(rowData);
  //   const sNo = index + 1;
  //   return <span title={sNo}>{sNo}</span>;
  // };

  // const getFieldBasedOnType = (rowData) => {
  //   if (compliancetable[0]?.audit_state === 1184) {
  //     return (
  //       <div title={rowData.initiation_weightage}>
  //         {rowData.initiation_weightage}
  //       </div>
  //     );
  //   } else if (compliancetable[0]?.audit_state === 1185) {
  //     return (
  //       <div title={rowData.steady_state_weightage}>
  //         {rowData.steady_state_weightage}
  //       </div>
  //     );
  //   } else if (compliancetable[0]?.audit_state === 1186) {
  //     return (
  //       <div title={rowData.closure_weightage}>{rowData.closure_weightage}</div>
  //     );
  //   } else if (selecttype === 1184) {
  //     return (
  //       <div title={rowData.initiation_weightage}>
  //         {rowData.initiation_weightage}
  //       </div>
  //     );
  //   } else if (selecttype === 1185) {
  //     return (
  //       <div title={rowData.steady_state_weightage}>
  //         {rowData.steady_state_weightage}
  //       </div>
  //     );
  //   } else if (selecttype === 1186) {
  //     return (
  //       <div title={rowData.closure_weightage}>{rowData.closure_weightage}</div>
  //     );
  //   } else if (selecttype === "null") {
  //     return <div title="0">0</div>;
  //   }
  //   return <div title="0">0</div>;
  // };

  // const ComplianceBodyTemplate = (rowData, getFieldBasedOnType) => {
  //   return (
  //     <>
  //       {compliancetable.length == 0 && (
  //         <select
  //           id="lkup_name"
  //           className="cancel"
  //           name="lkup_name"
  //           onFocus={(e) => {
  //             setPreviousOption(e.target.value, rowData.compliance_val);
  //           }}
  //           onChange={(e) => {
  //             if (
  //               // selecttype === 123 ||
  //               Array.isArray(compliancetable) &&
  //               compliancetable.length === 0
  //             ) {
  //               setValidationMessage(true);
  //               const newData = {
  //                 ...dropdownValues,
  //                 [rowData.id]: "null" || rowData.compliance_val,
  //               };
  //               setDropdownValues(newData);
  //               window.scrollTo({ top: 0, behavior: "smooth" });
  //             } else {
  //               setValidationMessage(false);
  //               const data = rowData.id;
  //               // onChangeSetDate(e, rowData)
  //               handalChange(e, rowData, previousOption);
  //               const newValue = e.target.value;
  //               setPreviousOption(newValue);
  //               const newData = {
  //                 ...dropdownValues,
  //                 [rowData.id]: newValue,
  //               };

  //               setDropdownValues(newData);
  //             }
  //           }}
  //           value={
  //             dropdownValues[rowData.id] || compliancetable.length == 0
  //               ? "123"
  //               : rowData.compliance_val
  //           }
  //           disabled={
  //             compliancetable[0]?.is_pcqa_submit === true ||
  //             (isUserManager && compliancetable.length === 0) ||
  //             pcqaCompl == true
  //           }
  //           style={{
  //             cursor:
  //               compliancetable[0]?.is_pcqa_submit || pcqaCompl == true
  //                 ? "no-drop"
  //                 : "auto",
  //             backgroundColor:
  //               compliancetable[0]?.is_pcqa_submit || pcqaCompl == true
  //                 ? "#eee"
  //                 : "white",
  //             opacity:
  //               compliancetable[0]?.is_pcqa_submit || pcqaCompl == true
  //                 ? 1
  //                 : "inherit",
  //             color:
  //               compliancetable[0]?.is_pcqa_submit || pcqaCompl == true
  //                 ? "#999"
  //                 : "inherit",
  //           }}
  //         >
  //           <option value="123">&lt;&lt;Please Select&gt;&gt;</option>
  //           {dropdowns?.map((Item, index) => (
  //             <option key={index} value={Item.id}>
  //               {Item.lkup_name}
  //             </option>
  //           ))}
  //         </select>
  //       )}
  //       <select
  //         id="lkup_name"
  //         className="cancel"
  //         name="lkup_name"
  //         onFocus={(e) => {
  //           setPreviousOption(e.target.value, rowData.compliance_val);
  //         }}
  //         onChange={(e) => {
  //           if (
  //             // selecttype === 123 ||
  //             Array.isArray(compliancetable) &&
  //             compliancetable.length === 0
  //           ) {
  //             setValidationMessage(true);
  //             const newData = {
  //               ...dropdownValues,
  //               [rowData.id]: "null" || rowData.compliance_val,
  //             };
  //             setDropdownValues(newData);
  //             window.scrollTo({ top: 0, behavior: "smooth" });
  //           } else {
  //             setValidationMessage(false);
  //             const data = rowData.id;
  //             // onChangeSetDate(e, rowData)
  //             handalChange(e, rowData, previousOption);
  //             const newValue = e.target.value;
  //             setPreviousOption(newValue);
  //             const newData = {
  //               ...dropdownValues,
  //               [rowData.id]: newValue,
  //             };

  //             setDropdownValues(newData);
  //           }
  //         }}
  //         value={dropdownValues[rowData.id] || rowData.compliance_val}
  //         disabled={
  //           compliancetable[0]?.is_pcqa_submit === true ||
  //           (isUserManager && compliancetable.length === 0) ||
  //           pcqaCompl == true
  //         }
  //         style={{
  //           cursor:
  //             compliancetable[0]?.is_pcqa_submit || pcqaCompl == true
  //               ? "no-drop"
  //               : "auto",
  //           backgroundColor:
  //             compliancetable[0]?.is_pcqa_submit || pcqaCompl == true
  //               ? "#eee"
  //               : "white",
  //           opacity:
  //             compliancetable[0]?.is_pcqa_submit || pcqaCompl == true
  //               ? 1
  //               : "inherit",
  //           color:
  //             compliancetable[0]?.is_pcqa_submit || pcqaCompl == true
  //               ? "#999"
  //               : "inherit",
  //         }}
  //       >
  //         <option value="123">&lt;&lt;Please Select&gt;&gt;</option>
  //         {dropdowns?.map((Item, index) => (
  //           <option key={index} value={Item.id}>
  //             {Item.lkup_name}
  //           </option>
  //         ))}
  //       </select>
  //     </>
  //   );
  // };

  // const pcqaBody = (rowData) => {
  //   return (
  //     <>
  //       {compliancetable.length == 0 && (
  //         <textarea
  //           id="remarks"
  //           name="remarks"
  //           placeholder="PCQA Remarks"
  //           type="text"
  //           value={
  //             compliancetable.length === 0
  //               ? ""
  //               : // rowData.remarks == undefined ? ""
  //               rowData?.remarks == null
  //               ? ""
  //               : rowData?.remarks
  //           }
  //           onChange={(e) => handlechangeComments(e.target.value, rowData)}
  //           disabled={
  //             compliancetable[0]?.is_pcqa_submit ||
  //             (isUserManager && compliancetable.length === 0) ||
  //             pcqa == true
  //           }
  //           style={{
  //             cursor:
  //               compliancetable[0]?.is_pcqa_submit ||
  //               (isUserManager && compliancetable.length === 0) ||
  //               pcqa == true
  //                 ? "no-drop"
  //                 : "auto",
  //             backgroundColor:
  //               compliancetable[0]?.is_pcqa_submit ||
  //               (isUserManager && compliancetable.length === 0) ||
  //               pcqa == true
  //                 ? "#eee"
  //                 : "white",
  //             opacity:
  //               compliancetable[0]?.is_pcqa_submit ||
  //               (isUserManager && compliancetable.length === 0) ||
  //               pcqa == true
  //                 ? 1
  //                 : "inherit",
  //             color:
  //               compliancetable[0]?.is_pcqa_submit ||
  //               (isUserManager && compliancetable.length === 0) ||
  //               pcqa == true
  //                 ? "#999"
  //                 : "inherit",
  //           }}
  //         ></textarea>
  //       )}
  //       <textarea
  //         id="remarks"
  //         name="remarks"
  //         placeholder="PCQA Remarks"
  //         type="text"
  //         defaultValue={rowData?.remarks == null ? "" : rowData?.remarks}
  //         onChange={(e) => handlechangeComments(e.target.value, rowData)}
  //         disabled={
  //           compliancetable[0]?.is_pcqa_submit ||
  //           (isUserManager && compliancetable.length === 0) ||
  //           pcqa == true
  //         }
  //         style={{
  //           cursor:
  //             compliancetable[0]?.is_pcqa_submit ||
  //             (isUserManager && compliancetable.length === 0) ||
  //             pcqa == true
  //               ? "no-drop"
  //               : "auto",
  //           backgroundColor:
  //             compliancetable[0]?.is_pcqa_submit ||
  //             (isUserManager && compliancetable.length === 0) ||
  //             pcqa == true
  //               ? "#eee"
  //               : "white",
  //           opacity:
  //             compliancetable[0]?.is_pcqa_submit ||
  //             (isUserManager && compliancetable.length === 0) ||
  //             pcqa == true
  //               ? 1
  //               : "inherit",
  //           color:
  //             compliancetable[0]?.is_pcqa_submit ||
  //             (isUserManager && compliancetable.length === 0) ||
  //             pcqa == true
  //               ? "#999"
  //               : "inherit",
  //         }}
  //       ></textarea>
  //     </>
  //   );
  // };

  // const pmaBody = (rowData) => {
  //   return (
  //     <>
  //       {compliancetable.length == 0 && (
  //         <textarea
  //           value={compliancetable.length == 0 ? "" : rowData.pm_remarks}
  //           disabled={
  //             !isUserManager ||
  //             compliancetable.length == 0 ||
  //             compliancetable[0]?.is_pcqa_submit === false ||
  //             (compliancetable[0]?.is_pcqa_submit == true &&
  //               compliancetable[0]?.is_pm_submit == true)
  //           }
  //           style={{
  //             cursor:
  //               !isUserManager ||
  //               compliancetable.length == 0 ||
  //               compliancetable[0]?.is_pcqa_submit === false ||
  //               (compliancetable[0]?.is_pcqa_submit == true &&
  //                 compliancetable[0]?.is_pm_submit == true)
  //                 ? "no-drop"
  //                 : "auto",
  //             backgroundColor:
  //               !isUserManager ||
  //               compliancetable.length == 0 ||
  //               compliancetable[0]?.is_pcqa_submit === false ||
  //               (compliancetable[0]?.is_pcqa_submit == true &&
  //                 compliancetable[0]?.is_pm_submit == true)
  //                 ? "#eee"
  //                 : "white",
  //             opacity:
  //               !isUserManager ||
  //               compliancetable.length == 0 ||
  //               compliancetable[0]?.is_pcqa_submit === false ||
  //               (compliancetable[0]?.is_pcqa_submit == true &&
  //                 compliancetable[0]?.is_pm_submit == true)
  //                 ? 1
  //                 : "inherit",
  //             color:
  //               !isUserManager ||
  //               compliancetable.length == 0 ||
  //               compliancetable[0]?.is_pcqa_submit === false ||
  //               (compliancetable[0]?.is_pcqa_submit == true &&
  //                 compliancetable[0]?.is_pm_submit == true)
  //                 ? "#999"
  //                 : "inherit",
  //           }}
  //           onChange={(e) => {
  //             handlechangePMComments(e.target.value, rowData);
  //           }}
  //           type="text"
  //           placeholder="PM Remarks"
  //         ></textarea>
  //       )}
  //       <textarea
  //         defaultValue={rowData.pm_remarks}
  //         disabled={
  //           !isUserManager ||
  //           compliancetable.length == 0 ||
  //           compliancetable[0]?.is_pcqa_submit === false ||
  //           (compliancetable[0]?.is_pcqa_submit == true &&
  //             compliancetable[0]?.is_pm_submit == true)
  //         }
  //         style={{
  //           cursor:
  //             !isUserManager ||
  //             compliancetable.length == 0 ||
  //             compliancetable[0]?.is_pcqa_submit === false ||
  //             (compliancetable[0]?.is_pcqa_submit == true &&
  //               compliancetable[0]?.is_pm_submit == true)
  //               ? "no-drop"
  //               : "auto",
  //           backgroundColor:
  //             !isUserManager ||
  //             compliancetable.length == 0 ||
  //             compliancetable[0]?.is_pcqa_submit === false ||
  //             (compliancetable[0]?.is_pcqa_submit == true &&
  //               compliancetable[0]?.is_pm_submit == true)
  //               ? "#eee"
  //               : "white",
  //           opacity:
  //             !isUserManager ||
  //             compliancetable.length == 0 ||
  //             compliancetable[0]?.is_pcqa_submit === false ||
  //             (compliancetable[0]?.is_pcqa_submit == true &&
  //               compliancetable[0]?.is_pm_submit == true)
  //               ? 1
  //               : "inherit",
  //           color:
  //             !isUserManager ||
  //             compliancetable.length == 0 ||
  //             compliancetable[0]?.is_pcqa_submit === false ||
  //             (compliancetable[0]?.is_pcqa_submit == true &&
  //               compliancetable[0]?.is_pm_submit == true)
  //               ? "#999"
  //               : "inherit",
  //         }}
  //         onChange={(e) => {
  //           handlechangePMComments(e.target.value, rowData);
  //         }}
  //         type="text"
  //         placeholder="PM Remarks"
  //       ></textarea>
  //     </>
  //   );
  // };

  // const auditBody = (rowData) => {
  //   return (
  //     <div title={rowData.check_point} className="ellipsis">
  //       {rowData.check_point}
  //     </div>
  //   );
  // };
  // const phaseBody = (rowData) => {
  //   return (
  //     <div title={rowData.proj_phase} className="ellipsis">
  //       {rowData.proj_phase}
  //     </div>
  //   );
  // };
  // const isoBody = (rowData) => {
  //   return (
  //     <div title={rowData.iso_details} className="ellipsis">
  //       {rowData.iso_details}
  //     </div>
  //   );
  // };

  return (
    <div className="darkHeader">
      <DataTable
        value={tableData}
        // editMode="row"
        showGridlines
        emptyMessage="No Records To View"
        scrollDirection="both"
        paginator
        rows={10}
        className="primeReactDataTable "    /////customerEngament
        paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
        currentPageReportTemplate="{first} to {last} of {totalRecords}"
        rowsPerPageOptions={[10, 25, 50]} //------------->
      >
        <Column
          header="S.No"
          field="SNo"
          body={renderSNo}
          title={"SNo"}
          alignHeader={"center"}
          headerStyle={{ width: "5%", minWidth: "8rem" }}
          bodyStyle={{ textAlign: "center" }}
        ></Column>
        <Column field="proj_phase" header="Phase" body={phaseBody} />
        <Column
          field="check_point"
          header="Audit Checkpoints"
          body={auditBody}
        />
        <Column
          field=""
          header="Compliance"
          filter={true}
          body={ComplianceBodyTemplate}
          headerStyle={{ width: "11%", minWidth: "8rem" }}
        />
        <Column
          field=""
          body={getFieldBasedOnType}
          header="Weightage"
          headerStyle={{ width: "6%", minWidth: "8rem" }}
        />

        <Column field="iso_details" header="ISO 9001:2015" body={isoBody} />
        <Column
          field="remarks"
          header="PCQA Remarks"
          body={pcqaBody}
          disabled={compliancetable[0]?.is_pcqa_submit === true}
        />
        <Column
          field="pm_remarks"
          header="PM Remarks"
          body={pmaBody}
          disabled={compliancetable[0]?.is_pcqa_submit === true}
        />
      </DataTable>
    </div>
  );
}
export default FirstTable;
