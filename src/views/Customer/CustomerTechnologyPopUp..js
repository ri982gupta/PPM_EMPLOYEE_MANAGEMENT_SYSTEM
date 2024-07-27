import { CModal, CModalHeader, CModalBody, CModalTitle } from "@coreui/react";
import React, { useRef, useState } from "react";
import Draggable from "react-draggable";
import GlobalValidation from "../ValidationComponent/GlobalValidation";
import SaveIcon from "@mui/icons-material/Save";
import axios from "axios";
import { environment } from "../../environments/environment";
import { AiFillWarning } from "react-icons/ai";

function CustomerTechnologyPopUp(props) {
  const { buttonPopup, setButtonPopup, customerId, gettabledata, setAddmsg } =
    props;
  const [validationMessage, setValidationMessage] = useState(false);
  const [formdata, setFormdata] = useState({
    "Software or Function": "",
    Software: "",
    Platform: "",
    "Service Vendor": "",
    "Future Plans": "",
    "Competitor Notes": "",
  });
  const ref = useRef([]);
  const baseUrl = environment.baseUrl;

  const handleChange = (event) => {
    event.preventDefault;
    const { name, value } = event.target;
    setFormdata((prevProps) => ({ ...prevProps, [name]: value }));
  };

  const handleClick = () => {
    let valid = GlobalValidation(ref);
    if (valid) {
      setValidationMessage(true);
      return;
    }
    axios({
      method: "post",
      url: baseUrl + `/customersms/Customers/postCustomerTechnology`,
      data: {
        customerId: customerId,
        systemFunction: formdata["Software or Function"],
        software: formdata.Software,
        platform: formdata.Platform,
        serviceVendor: formdata["Service Vendor"],
        futurePlans: formdata["Future Plans"],
        competitorNotes: formdata["Competitor Notes"],
      },
    }).then(function (response) {
      gettabledata();
      setButtonPopup(false);
      setAddmsg(true);
      setTimeout(() => {
        setAddmsg(false);
      }, 3000);
    });
  };

  return (
    <div>
      <CModal
        size="xs"
        backdrop="static"
        visible={buttonPopup}
        className="ui-dialog "
        onClose={() => {
          setButtonPopup(false);
        }}
      >
        <CModalHeader className="hgt22" style={{ cursor: "all-scroll" }}>
          <CModalTitle>
            <span className="ft16"> Add Technology</span>
          </CModalTitle>
        </CModalHeader>
        <CModalBody>
          <div className="col-md-12 ">
            {validationMessage ? (
              <div className="statusMsg error">
                <span className="error-block">
                  <AiFillWarning /> Please select valid values for highlighted
                  fields
                </span>
              </div>
            ) : (
              ""
            )}
            <div className="group-content row mb-2">
              <div className="form-group row mb-2">
                <label className="col-5" htmlFor="Software or Function">
                  Software or Function
                  <span className="required error-text ml-1">*</span>
                </label>
                <span className="col-1">:</span>
                <div
                  className="col-6 textfield"
                  ref={(ele) => {
                    ref.current[0] = ele;
                  }}
                >
                  <input
                    type="text"
                    // className="form-control"
                    id="Software or Function"
                    name="Software or Function"
                    placeholder="Max 50 characters"
                    maxLength={50}
                    required
                    onKeyDown={(event) => {
                      if (
                        event.code === "Space" &&
                        !formdata["Software or Function"]
                      )
                        event.preventDefault();
                    }}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="form-group row mb-2">
                <label className="col-5" htmlFor="Software">
                  Software
                  <span className="required error-text ml-1">*</span>
                </label>
                <span className="col-1">:</span>
                <div
                  className="col-6 textfield"
                  ref={(ele) => {
                    ref.current[1] = ele;
                  }}
                >
                  <input
                    type="text"
                    // className="form-control"
                    id="Software"
                    name="Software"
                    placeholder="Max 50 characters"
                    maxLength={50}
                    required
                    onKeyDown={(event) => {
                      if (event.code === "Space" && !formdata.Software)
                        event.preventDefault();
                    }}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="form-group row mb-2">
                <label className="col-5" htmlFor="Platform">
                  Platform
                </label>
                <span className="col-1">:</span>
                <div className="col-6">
                  <input
                    type="text"
                    // className="form-control"
                    id="Platform"
                    name="Platform"
                    placeholder="Max 50 characters"
                    maxLength={50}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="form-group row mb-2">
                <label className="col-5" htmlFor="Service Vendor">
                  Service Vendor
                </label>
                <span className="col-1">:</span>
                <div className="col-6">
                  <input
                    type="text"
                    // className="form-control"
                    id="Service Vendor"
                    name="Service Vendor"
                    placeholder="Max 50 characters"
                    maxLength={50}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="form-group mb-2">
                <label htmlFor="Future Plans">Future Plans</label>
                <textarea
                  type="text"
                  name="Future Plans"
                  id="Future Plans"
                  onChange={handleChange}
                />
              </div>
              <div className="form-group mb-2">
                <label htmlFor="Competitor Notes">Competitor Notes</label>
                <textarea
                  type="text"
                  name="Competitor Notes"
                  id="Competitor Notes"
                  onChange={handleChange}
                />
              </div>
              <div className='className="col-md-12 col-sm-12 col-xs-12 btn-container center my-3'>
                <button className="btn btn-primary " onClick={handleClick}>
                  <SaveIcon />
                  Save
                </button>
              </div>
            </div>
          </div>
        </CModalBody>
      </CModal>
    </div>
  );
}
export default CustomerTechnologyPopUp;
