import React, { useRef } from "react";
import { useState, useEffect } from "react";
import { environment } from "../../environments/environment";
import axios from "axios";
import { CModalHeader } from "@coreui/react";
import { CModalBody } from "@coreui/react";
import { CButton } from "@coreui/react";
import { CModal } from "@coreui/react";
import Draggable from "react-draggable";
import moment from "moment";
import { ReactSearchAutocomplete } from "react-search-autocomplete";
import SaveIcon from "@mui/icons-material/Save";
import { MdCreate } from "react-icons/md";
import { CModalTitle } from "@coreui/react";
import { AiFillDelete, AiFillWarning } from "react-icons/ai";
import Initiatives from "./Initiatives";
import GlobalValidation from "../ValidationComponent/GlobalValidation";
function InitiativePopup(props) {
  const {
    buttonPopup,
    setButtonPopup,
    data1,
    customerId,
    // handleSaveClick,
    // handleChange,
    getData,
    editId,
    type,
    // data,
    setEditedData,
    editedData,
    setFormData,
    formData,
    setAddmsg,
    setEditAddmsg,
    // setValidationMessage
  } = props;
  const baseUrl = environment.baseUrl;
  const [value, setValue] = useState("");
  const ref = useRef([]);
  // const data = {
  //     "id": null, "cusId": 128765260, "initiative": "", "functionArea": "",
  //     "curStatus": "",
  //     "innTech": "",
  //     "cusStake": "",
  //     "primObj": "",
  //     "des": ""
  // }
  const [formData1, setFormData1] = useState(setFormData);
  const [formEditData, setFormEditData] = useState(editedData);
  const [id, setid] = useState(0);
  const [validationMessage, setValidationMessage] = useState(false);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData1((prev) => ({ ...prev, [id]: value }));
  };

  // const handleChange1 = (e) => {
  //     const { id, value } = e.target;
  //     setFormEditData(prev => ({ ...prev, [id]: value }))
  // }

  const handleEditClick = () => {

    console.log(formEditData, "formEditData");

    let valid = GlobalValidation(ref);

    if (valid) {
      setValidationMessage(true);

      // setTimeout(() => {
      //     // setValidationMessage(false);
      // }, 3000);

      return;
    }
    axios({
      method: "post",
      url: baseUrl + `/customersms/initiatives/postintiativedata`,
      data: {
        id: editId,
        cusId: customerId,
        initiative: formEditData.Initiative,
        functionArea: formEditData.FunctionArea,
        curStatus: formEditData.CurStatus,
        innTech: formEditData.InnTech,
        cusStake: formEditData.CusStake,
        primObj: formEditData.PrimObj,
        des: formEditData.Des,
      },
    }).then((error) => {
      getData();
      setid();
      setButtonPopup(false);
      setEditAddmsg(true);

      setTimeout(() => {
        setEditAddmsg(false);
      }, 3000);
    });
  };
  //-----
  const handleSaveClick = () => {
    let valid = GlobalValidation(ref);

    if (valid) {
      setValidationMessage(true);

      // setTimeout(() => {
      //     setValidationMessage(false);
      // }, 3000);

      return;
    }
    axios({
      method: "post",
      url: baseUrl + `/customersms/initiatives/postintiativedata`,
      data: {
        id: null,
        cusId: customerId,
        initiative: formEditData.Initiative,
        functionArea: formEditData.FunctionArea,
        curStatus: formEditData.CurStatus,
        innTech: formEditData.InnTech,
        cusStake: formEditData.CusStake,
        primObj: formEditData.PrimObj,
        des: formEditData.Des,
      },
    }).then((error) => {
      getData();
      setid();
      setButtonPopup(false);

      setAddmsg(true);
      setTimeout(() => {
        setAddmsg(false);
      }, 3000);
    });
  };

  //----

  return (
    <div>
      {/* <Draggable> */}
      <CModal
        size="xs"
        visible={buttonPopup}
        onClose={() => {
          setButtonPopup(false);
        }}
        backdrop={"static"}
      >
        <CModalHeader className="hgt22" style={{ cursor: "all-scroll" }}>
          <CModalTitle>
            {type == "add" ? (
              <span className="ft16"> Add Initiative</span>
            ) : (
              <span className="ft16"> Edit Initiative</span>
            )}
          </CModalTitle>
        </CModalHeader>
        <CModalBody>
          <div className="col-md-12">
            {validationMessage ? (
              <div className="statusMsg error">
                <span className="error-block">
                  <AiFillWarning /> &nbsp;Please select valid values for
                  highlighted fields
                </span>
              </div>
            ) : (
              ""
            )}
            <div className="form-group row mb-2">
              <label className="col-5" htmlFor="form-label">
                Initiative&nbsp;<span className="error-text">*</span>
              </label>
              <span className="col-1 p-0">:</span>
              <div
                className="col-6 textfield"
                ref={(ele) => {
                  ref.current[0] = ele;
                }}
              >
                {type == "add" ? (
                  <input
                    name="initiative"
                    id="initiative"
                    type="text"
                    placeholder={"Max 50 character"}
                    // value={value}
                    maxLength={50}
                    // onChange={(e) => handleChange(e)
                    onChange={(e) =>
                      setFormEditData((prev) => ({
                        ...prev,
                        ["Initiative"]: e.target.value,
                      }))
                    }
                  />
                ) : (
                  <input
                    type="text"
                    // value={value}
                    name="initiative"
                    id="initiative"
                    placeholder={"Max 50 character"}
                    maxLength={50}
                    defaultValue={editedData.Initiative}
                    // onChange={(e) => handleChange1(e)}
                    onChange={(e) =>
                      setFormEditData((prev) => ({
                        ...prev,
                        ["Initiative"]: e.target.value,
                      }))
                    }
                  />
                )}
              </div>
            </div>
          </div>

          <div className="col-md-12">
            <div className="form-group row mb-2">
              <label className="col-5" htmlFor="form-label">
                Function Area&nbsp;<span className="error-text">*</span>
              </label>
              <span className="col-1 p-0">:</span>
              <div
                className="col-6 textfield"
                ref={(ele) => {
                  ref.current[1] = ele;
                }}
              >
                {type == "add" ? (
                  <input
                    type="text"
                    placeholder="Max 50 character"
                    name="functionArea"
                    id="functionArea"
                    maxLength={50}
                    // onChange={(e) => handleChange(e)}
                    onChange={(e) =>
                      setFormEditData((prev) => ({
                        ...prev,
                        ["FunctionArea"]: e.target.value,
                      }))
                    }
                  />
                ) : (
                  <input
                    type="text"
                    placeholder="Max 50 character"
                    name="functionArea"
                    id="functionArea"
                    maxLength={50}
                    defaultValue={editedData.FunctionArea}
                    //  onChange={(e) => handleChange1(e)}
                    onChange={(e) =>
                      setFormEditData((prev) => ({
                        ...prev,
                        ["FunctionArea"]: e.target.value,
                      }))
                    }
                  />
                )}
              </div>
            </div>
          </div>

          <div className="col-md-12">
            <div className="form-group row mb-2">
              <label className="col-5" htmlFor="">
                Current Status&nbsp;<span className="error-text">*</span>
              </label>
              <span className="col-1 p-0">:</span>
              <div
                className="col-6 textfield"
                ref={(ele) => {
                  ref.current[2] = ele;
                }}
              >
                {type == "add" ? (
                  <input
                    type="text"
                    placeholder="Max 50 character"
                    name="curStatus"
                    id="curStatus"
                    maxLength={50}
                    // onChange={(e) => handleChange(e)}
                    onChange={(e) =>
                      setFormEditData((prev) => ({
                        ...prev,
                        ["CurStatus"]: e.target.value,
                      }))
                    }
                  />
                ) : (
                  <input
                    type="text"
                    placeholder="Max 50 character"
                    name="curStatus"
                    id="curStatus"
                    maxLength={50}
                    defaultValue={editedData.CurStatus}
                    // onChange={(e) => handleChange1(e)}
                    onChange={(e) =>
                      setFormEditData((prev) => ({
                        ...prev,
                        ["CurStatus"]: e.target.value,
                      }))
                    }
                  />
                )}
              </div>
            </div>
          </div>

          <div className="col-md-12">
            <div className="form-group row mb-2">
              <label className="col-5" htmlFor="Date">
                Innovative Technology&nbsp;<span className="error-text">*</span>
              </label>
              <span className="col-1 p-0">:</span>
              <div
                className="col-6 textfield"
                ref={(ele) => {
                  ref.current[3] = ele;
                }}
              >
                {type == "add" ? (
                  <input
                    type="text"
                    placeholder="Max 50 character"
                    name="innTech"
                    id="innTech"
                    maxLength={50}
                    //onChange={(e) => handleChange(e)}
                    onChange={(e) =>
                      setFormEditData((prev) => ({
                        ...prev,
                        ["InnTech"]: e.target.value,
                      }))
                    }
                  />
                ) : (
                  <input
                    type="text"
                    placeholder="Max 50 character"
                    name="innTech"
                    id="innTech"
                    maxLength={50}
                    defaultValue={editedData.InnTech}
                    // onChange={(e) => handleChange1(e)}
                    onChange={(e) =>
                      setFormEditData((prev) => ({
                        ...prev,
                        ["InnTech"]: e.target.value,
                      }))
                    }
                  />
                )}
              </div>
            </div>
          </div>

          <div className="col-md-12">
            <div className="form-group row mb-2">
              <label className="col-5" htmlFor="Date">
                Customer Stakeholder&nbsp;<span className="error-text">*</span>
              </label>
              <span className="col-1 p-0">:</span>
              <div
                className="col-6 textfield"
                ref={(ele) => {
                  ref.current[4] = ele;
                }}
              >
                {type == "add" ? (
                  <input
                    type="text"
                    placeholder="Max 50 character"
                    name="cusStake"
                    id="cusStake"
                    maxLength={50}
                    onChange={(e) =>
                      setFormEditData((prev) => ({
                        ...prev,
                        ["CusStake"]: e.target.value,
                      }))
                    }
                  />
                ) : (
                  <input
                    type="text"
                    placeholder="Max 50 character"
                    name="cusStake"
                    id="cusStake"
                    maxLength={50}
                    defaultValue={editedData.CusStake}
                    // onChange={(e) => handleChange1(e)}
                    onChange={(e) =>
                      setFormEditData((prev) => ({
                        ...prev,
                        ["CusStake"]: e.target.value,
                      }))
                    }
                  />
                )}
              </div>
            </div>
          </div>

          <div className="col-md-12">
            <div className="form-group row mb-2">
              <label className="col-5" htmlFor="">
                Primary Objective
              </label>
              <span className="col-1 p-0">:</span>
              <div className="col-6">
                {type == "add" ? (
                  <textarea
                    type="text"
                    name="primObj"
                    id="primObj"
                    maxLength={50}
                    // onChange={(e) => handleChange(e)}
                    onChange={(e) =>
                      setFormEditData((prev) => ({
                        ...prev,
                        ["PrimObj"]: e.target.value,
                      }))
                    }
                  />
                ) : (
                  <textarea
                    type="text"
                    name="primObj"
                    id="primObj"
                    maxLength={50}
                    defaultValue={editedData.PrimObj}
                    // onChange={(e) => handleChange1(e)}
                    onChange={(e) =>
                      setFormEditData((prev) => ({
                        ...prev,
                        ["PrimObj"]: e.target.value,
                      }))
                    }
                  />
                )}
              </div>
            </div>
          </div>

          <div className="col-md-12">
            <div className="form-group row mb-2">
              <label className="col-5" htmlFor="">
                Description
              </label>
              <span className="col-1 p-0">:</span>
              <div className="col-6">
                {type == "add" ? (
                  <textarea
                    type="text"
                    name="des"
                    id="des"
                    maxLength={50}
                    // onChange={(e) => handleChange(e)}
                    onChange={(e) =>
                      setFormEditData((prev) => ({
                        ...prev,
                        ["Des"]: e.target.value,
                      }))
                    }
                  />
                ) : (
                  <textarea
                    type="text"
                    name="Des"
                    id="Des"
                    maxLength={50}
                    defaultValue={editedData.Des}
                    // onChange={(e) => handleChange1(e)}
                    onChange={(e) =>
                      setFormEditData((prev) => ({
                        ...prev,
                        ["Des"]: e.target.value,
                      }))
                    }
                  />
                )}
              </div>
            </div>
          </div>

          <div className='className="col-md-12 col-sm-12 col-xs-12 btn-container center my-3'>
            {type == "add" ? (
              <button
                className="btn btn-primary "
                onClick={handleSaveClick}

                // onClick={(e) => {
                //     handleSaveClick(e);
                //     ;
                //     setFormData((prev) => ({
                //       ...prev,
                //       [e.target.id]: e.target.value,
                //     }));
                // }}
              >
                <SaveIcon />
                Save
              </button>
            ) : (
              <button className="btn btn-primary " onClick={handleEditClick}>
                <SaveIcon />
                Save
              </button>
            )}
          </div>
        </CModalBody>
      </CModal>
      {/* </Draggable> */}

      {/* <Initiatives setid={setid} id={id}/> */}
    </div>
  );
}
export default InitiativePopup;
