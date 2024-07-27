import React from "react";
import { CModal, CModalBody, CModalHeader, CModalTitle } from "@coreui/react";
import CellRendererPrimeReactDataTable from "../PrimeReactTableComponent/CellRendererPrimeReactDataTable";
import { useState, useEffect } from "react";
import axios from "axios";
import { AiFillDelete } from "react-icons/ai";
import { Column } from "primereact/column";
import NpsEmailPopUp from "./NpsEmailPopUp";
import { MdAddBox, MdAddCircleOutline } from "react-icons/md";

import { environment } from "../../environments/environment";
import { BiCheck } from "react-icons/bi";
import { BiError } from "react-icons/bi";
import { AiFillWarning } from "react-icons/ai";
import { FaSave } from "react-icons/fa";
import moment from "moment";
function EmailPopUp(openEmail, setOpenEmail) {
  const [clickButtonPopUp, setClickButtonPopUp] = useState(false);
  const [addList1, setAddList1] = useState([{}]);
  const [finalState1, setFinalState1] = useState({});
  const [details, setDetails] = useState({});
  const [displayTextEmails, setDisplayTextEmails] = useState([]);

  const clickButtonHandlerPopUp = () => {
    setClickButtonPopUp(true);
    setOpenEmail(false);
  };
  const intialOnChangeState1 = {
    customerEmails: "",
  };
  const [onChangeState1, setOnChangeState1] = useState(intialOnChangeState1);

  const handleAddEmail = () => {
    let data1 = finalState1;
    data1[Object.keys(data1).length] = onChangeState1["customerEmails"];
    setFinalState1(data1);
    setAddList1([...addList1, { customerEmails: "" }]);
    // setDetails(data1);
  };
  const handleChange1 = (e) => {
    const { id, name, value } = e.target;
    onChangeState1[id] = value;
    // setOnChangeState1((prev) => ({ ...prev, [id]: value }));
    details[(id, name)] = value;
  };
  return (
    <CModal
      visible={openEmail}
      size="xs"
      className="ui-dialog"
      onClose={() => setOpenEmail(false)}
    >
      <CModalHeader className="">
        <CModalTitle>
          <span className="">Delete Confirmation</span>
        </CModalTitle>
      </CModalHeader>
      <CModalBody>
        <div className="btn-container center my-2">
          <div className="col-md-10">
            {/* {displayTextEmails.toString()} */}
            <input
              type="text"
              name="customerEmails"
              className="disableField cancel"
              id="customerEmails"
              value={displayTextEmails.toString()}
              defaultValue={displayTextEmails.toString()}
              onChange={handleChange1}
            />
          </div>
          <div>
            <button className="btn">
              <MdAddBox
                onClick={() => {
                  clickButtonHandlerPopUp();
                }}
              />
            </button>
          </div>
        </div>

        {clickButtonPopUp ? (
          <NpsEmailPopUp
            clickButtonPopUp={clickButtonPopUp}
            setOpenEmail={setOpenEmail}
            openEmail={openEmail}
            setClickButtonPopUp={setClickButtonPopUp}
            handleChange1={handleChange1}
            handleAddEmail={handleAddEmail}
            addList1={addList1}
            setAddList1={setAddList1}
            finalState1={finalState1}
            details={details}
            setDetails={setDetails}
            setDisplayTextEmails={setDisplayTextEmails}
            displayTextEmails={displayTextEmails}
          />
        ) : (
          ""
        )}
      </CModalBody>
    </CModal>
  );
}
export default EmailPopUp;
