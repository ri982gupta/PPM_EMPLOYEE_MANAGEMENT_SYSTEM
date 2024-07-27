import Customer from "./Customer";
import { useEffect, useRef, useState } from "react";
import { CModal } from "@coreui/react";
import { CModalBody } from "@coreui/react";
import { CModalFooter } from "@coreui/react";
import { CModalHeader } from "@coreui/react";
import { CModalTitle } from "@coreui/react";
import { CButton } from "@coreui/react";
import { RiSave3Line } from "react-icons/ri";
import { FaUndo } from "react-icons/fa";
import { ImCross } from "react-icons/im";
import EngagementCustomer from "../DeliveryComponent/EngagementCustomer";
import SalesCustomer from "../ServiceComponent/SalesCustomer";
import RevenueCustomer from "./RevenueCustomer.js";

export default function SelectCustDialogBox({
  visible,
  setVisible,
  setSelectedItems,
  selectedItems,
  value,
  flag,
  variance,
  vendorSelectBox,
  executiveIds,
  setUpdatedValue,
  dataAccess,
  setPopupIsLoading,
  activeCustomersList,
  setInitialLength,
}) {
  const CustomerRef = useRef(null);
  const ProspectsRef = useRef(null);
  const [buttonPopup, setButtonPopup] = useState(false);
  const customerPopup = () => {
    setButtonPopup(!buttonPopup);
  };
  console.log(dataAccess);
  useEffect(() => { }, [dataAccess]);
  function CustomerPopUp(props) {
    const { setVisible, buttonPopup, setButtonPopup } = props;
    return (
      <div>
        <CModal
          visible={buttonPopup}
          alignment="center"
          backdrop="static"
          size="sm"
        >
          <CModalHeader closeButton={false}>
            <div className="row">
              <CModalTitle>
                <div>Confirmation</div>
              </CModalTitle>
            </div>
            <div>
              <button
                className="btn float end"
                type="popup"
                onClick={() => setButtonPopup(false)}
              >
                <ImCross />
              </button>
            </div>
          </CModalHeader>
          <CModalBody>
            <h6>Save changes ?</h6>
            <div className="col-md-12 col-sm-12 col-xs-12 btn-container center my-3">
              <button
                type="delete"
                className="btn btn-primary"
                onClick={() => {
                  setVisible(false);
                  setButtonPopup(false);
                }}
              >
                Yes
              </button>

              <button
                type="button"
                className="btn btn-primary"
                onClick={() => {
                  setVisible(false);
                  setButtonPopup(false);
                }}
              >
                No
              </button>
            </div>
          </CModalBody>
        </CModal>
      </div>
    );
  }

  return (
    <>
      <div>
        <CModal
          alignment="center"
          backdrop="static"
          visible={visible}
          onClose={() => setVisible(false)}
          size="xl"
        >
          <CModalHeader closeButton={false}>
            <div className="row">
              <CModalTitle>
                {value == "EngagementS" ? (
                  <div style={{ fontSize: "15px" }}>Select Customers</div>
                ) : flag == 2 ? (
                  <div>Select Sf Accounts</div>
                ) : (
                  <div>
                    {vendorSelectBox == "VendorSelect" ? (
                      <p>Select Vendor</p>
                    ) : (
                      <p>Select Customers / Prospects</p>
                    )}
                  </div>
                )}
              </CModalTitle>
            </div>
            {value == "EngagementS" ? (
              <div>
                <button
                  className="btn float end"
                  type="popup"
                  onClick={() => setVisible(false)}
                >
                  <ImCross />
                </button>
              </div>
            ) : (
              <div>
                <button
                  className="btn float end"
                  type="popup"
                  onClick={() => setVisible(false)}
                >
                  <ImCross />
                </button>
              </div>
            )}
          </CModalHeader>
          <CModalBody>
            {value == "EngagementS" ? (
              <EngagementCustomer
                setInitialLength={setInitialLength}
                ref={CustomerRef}
                setSelectedItems={setSelectedItems}
                selectedItems={selectedItems}
              />
            ) : value == "select" ? (
              <div>
                <SalesCustomer
                  value={value}
                  ref={CustomerRef}
                  setSelectedItems={setSelectedItems}
                  selectedItems={selectedItems}
                  executiveIds={executiveIds}
                  setPopupIsLoading={setPopupIsLoading}
                />
              </div>
            ) : variance == 1 ? (
              <RevenueCustomer
                value={value}
                variance={variance}
                ref={CustomerRef}
                setSelectedItems={setSelectedItems}
                selectedItems={selectedItems}
                dataAccess={dataAccess}
                flag={flag}
                activeCustomersList={activeCustomersList}
              />
            ) : (
              <Customer
                value={value}
                flag={flag}
                vendorSelectBox={vendorSelectBox}
                variance={variance}
                ref={CustomerRef}
                setSelectedItems={setSelectedItems}
                selectedItems={selectedItems}
                setUpdatedValue={setUpdatedValue}
                dataAccess={dataAccess}
              />
            )}
          </CModalBody>

          <CModalFooter>
            <div className=" form-group col-md-12 col-sm-12 col-xs-12 btn-container center my-2">
              <CButton
                color="primary"
                title="Save Changes"
                onClick={() => {
                  CustomerRef.current.setGlobalState();
                  setVisible(false);
                  setButtonPopup(false);
                }}
              >
                <RiSave3Line />
                Save
              </CButton>
              <CButton
                color="primary"
                title="Undo Changes"
                onClick={() => {
                  CustomerRef.current.resetTOlocalState();
                }}
              >
                <FaUndo size="1.0em" title="Undo Chages" />
                Undo
              </CButton>
            </div>
          </CModalFooter>
        </CModal>
      </div>

      {buttonPopup && value !== "EngagementS" ? (
        <CustomerPopUp
          buttonPopup={buttonPopup}
          setButtonPopup={setButtonPopup}
          setVisible={setVisible}
        />
      ) : buttonPopup && value !== "select" ? (
        <CustomerPopUp
          buttonPopup={buttonPopup}
          setButtonPopup={setButtonPopup}
          setVisible={setVisible}
        />
      ) : (
        ""
      )}
    </>
  );
}
