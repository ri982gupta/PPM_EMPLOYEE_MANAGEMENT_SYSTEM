import React from "react";
import { BiX } from "react-icons/bi";
import { DialogContent, DialogTitle, Popover } from "@material-ui/core";
// import "../VendorComponent/Resources.scss";
import RevvenueForecastCalenderHierarchy from "./RevenueForecastCalenderHierarchy";
import "./MonthlyForecastRevenueCalenderTable.scss";

function MonthlyForecastTableHierarchyPopUp(props) {
  const {
    hierarchyPopUp,
    setHierarchyPopUp,
    anchor,
    setAnchor,
    hierarchyData,
    hierearchyVisible,
    setHierarchyVisible,
    handleAbort,
  } = props;

  const open = Boolean(anchor);
  const id = open ? "my-popver" : undefined;
  const handleClose = () => {
    setAnchor(false);
  };

  return (
    <div className="">
      <Popover
        id={id}
        open={Boolean(anchor)}
        anchorEl={anchor}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
      >
        <div className="hierarchyPopup">
          <DialogTitle>
            <BiX onClick={handleClose} />
          </DialogTitle>
          <DialogContent>
            <div>
              {" "}
              {hierarchyData != undefined ? (
                <RevvenueForecastCalenderHierarchy data={hierarchyData} />
              ) : (
                " "
              )}
            </div>
          </DialogContent>
        </div>
      </Popover>
    </div>
  );
}
export default MonthlyForecastTableHierarchyPopUp;
