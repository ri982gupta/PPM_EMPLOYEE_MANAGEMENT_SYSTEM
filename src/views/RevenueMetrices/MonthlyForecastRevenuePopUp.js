import React from "react";
import axios from "axios";
import { CModal } from "@coreui/react";
import { CModalBody } from "@coreui/react";
import { CModalHeader } from "@coreui/react";
import { CModalTitle } from "@coreui/react";
import Draggable from "react-draggable";
import FlatPrimeReactTableRevenue from "./FlatPrimeReactTableRevenue";
import { useEffect } from "react";
import "./MonthlyForecastRevenuePopUp.scss";

function MonthlyForecastRevenuePopUp(props) {
  const {
    buttonPopup,
    setButtonPopup,
    actionItems,
    setActionItems,
    rows,
    actionTable,
    handleActionItems,
  } = props;

  useEffect(() => {
    handleActionItems();
  }, [actionTable]);
  return (
    <div className="col-md-12">
      <Draggable>
        <CModal
          size="xl"
          visible={buttonPopup}
          className="ui-dialog "
          onClose={() => setButtonPopup(false)}
        >
          <CModalHeader className="hgt22">
            <CModalTitle>
              <span className="ft16">Action Items</span>
            </CModalTitle>
          </CModalHeader>
          <CModalBody>
            <div className="row">
              <div className="col-md-12">
                <FlatPrimeReactTableRevenue
                  data={actionItems}
                  rows={rows}
                ></FlatPrimeReactTableRevenue>
              </div>
            </div>
          </CModalBody>
        </CModal>
      </Draggable>
    </div>
  );
}
export default MonthlyForecastRevenuePopUp;
