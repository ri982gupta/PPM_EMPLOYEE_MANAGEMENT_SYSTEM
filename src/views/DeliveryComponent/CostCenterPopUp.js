// import Draggable from "react-draggable";
// import { CModal, CModalBody, CModalHeader, CModalTitle } from "@coreui/react";
// import RiskAutoComplete from "../ProjectComponent/RiskAutocomplete";
// import { useEffect } from "react";
// import { environment } from "../../environments/environment";
// import { useState } from "react";
// import axios from "axios";
// // import CostCenterHierarchy from "./CostCenterHierarchy";

// function CostCenterPopUp(props) {
//   const { costPopup, setCostPopup, handleChange2, setDetails } = props;
//   const [CostCenter, setCostCenter] = useState([]);
//   const [hierarchy, setHierarchy] = useState([]);
//   const baseUrl = environment.baseUrl;

//   const getCostCenterHierarchy = () => {
//     axios({
//       method: "get",
//       url: baseUrl + `/customersms/Customers/getCostCenterHierarchy`,
//     }).then(function (response) {
//       var resp = response.data;
//       setHierarchy(resp);
//     });
//   };

//   const getCostCenter = () => {
//     axios({
//       method: "get",
//       url: baseUrl + `/ProjectMS/Engagement/CostCenter`,
//     }).then(function (response) {
//       var resp = response.data;
//       const filteredData = resp.filter(
//         (d) =>
//           !(
//             d.name === "00X: Delivery" ||
//             d.name === "000: Delivery" ||
//             d.name === "Entire Organization"
//           )
//       );
//       filteredData.push({});
//       setCostCenter(filteredData);
//     });
//   };

//   useEffect(() => {
//     getCostCenter();
//     getCostCenterHierarchy();
//   }, []);

//   return (
//     <div>
//       <Draggable>
//         <CModal
//           alignment="center"
//           backdrop="static"
//           size="md"
//           visible={costPopup}
//           onClose={() => {
//             setCostPopup(false);
//           }}
//         >
//           <CModalHeader className="" style={{ cursor: "all-scroll" }}>
//             <CModalTitle>
//               <span className="">Cost Centre Directory</span>
//             </CModalTitle>
//           </CModalHeader>
//           <CModalBody>
//             <div className="col-md-12">
//               <div className="form-group row mb-2">
//                 <label className="col-5" htmlFor="costCenter">
//                   Search
//                 </label>
//                 <span className="col-1 ">:</span>
//                 <div className="col-6">
//                   <div autoComplete-container reactautocomplete>
//                     <RiskAutoComplete
//                       name="costCenter"
//                       id="costCenter"
//                       riskDetails={CostCenter}
//                       onChange={(e) => {
//                         handleChange2(e);
//                       }}
//                       setFormData={setDetails}
//                     />
//                   </div>
//                 </div>
//               </div>
//               <CostCenterHierarchy
//                 defaultExpandedRows={String(-1)}
//                 data={hierarchy}
//               />
//               <div className=" form-group col-md-12 col-sm-12 col-xs-12 btn-container center my-3 mb-2">
//                 <button className="btn btn-primary" type="ok">
//                   OK
//                 </button>
//               </div>
//             </div>
//           </CModalBody>
//         </CModal>
//       </Draggable>
//     </div>
//   );
// }

// export default CostCenterPopUp;
