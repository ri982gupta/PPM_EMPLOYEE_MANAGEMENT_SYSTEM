// import { CModal, CModalBody, CModalHeader, CModalTitle } from "@coreui/react";
// import React from "react";
// import { ImCross } from "react-icons/im";
// import { TfiSave } from "react-icons/tfi";

// const OppRoleDeletePopUp = (props) => {
//   const { roleDeletePopup, setRoleDeletePopup, DeleteRole, deleteId } = props;
//   return (
//     <div>
//       <CModal
//         alignment="center"
//         backdrop="static"
//         visible={roleDeletePopup}
//         size="sm"
//         className="ui-dialog"
//         onClose={() => setRoleDeletePopup(false)}
//       >
//         <CModalHeader className="">
//           <CModalTitle>
//             <span className="">Delete Role</span>
//           </CModalTitle>
//         </CModalHeader>
//         <CModalBody>
//           <div className=" col-md-12 mb-2">
//             <strong> Are you sure to delete Role ?</strong>
//             <div className="form-group row ellipsis mt-2">
//               <label htmlFor="name-input-inline">Comment :</label>
//               <p class="ellipsis">
//                 <textarea rows="3" cols="20"></textarea>
//               </p>
//             </div>
//           </div>
//           <div className="btn-container center my-2">
//             <button
//               className="btn btn-primary"
//               title="Delete"
//               onClick={() => {
//                 const comment = document.querySelector("textarea").value;
//                 // handleDeleteRole(comment);
//                 DeleteRole(comment);
//               }}
//             >
//               <TfiSave /> Delete
//             </button>
//             <button
//               className="btn btn-secondary"
//               title="Cancel"
//               onClick={() => {
//                 setRoleDeletePopup(false);
//               }}
//             >
//               <ImCross /> Cancel{" "}
//             </button>
//           </div>
//         </CModalBody>
//       </CModal>
//     </div>
//   );
// };

// export default OppRoleDeletePopUp;
