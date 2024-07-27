import React from "react";
import { DialogContent, Popover } from "@material-ui/core";
function UtilizationFYPopUp(props) {
  const { iconName, anchorEl, setAnchorEl, handleClose, setIconName } = props;
  const open = Boolean(anchorEl);
  const id = open ? "my-popover" : undefined;

  console.log(iconName.includes("ytd"));

  return (
    <div className="">
      <Popover
        disablePortal={true}
        arrow={true}
        open={Boolean(anchorEl)}
        id={id}
        // open={open}
        anchorEl={anchorEl}
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
        <div className="">
          <DialogContent>
            <div>
              {iconName.includes("ytd") ? (
                <div className="">
                  <p className="mb-2">
                    Actual Utilization of current financial year till today.
                  </p>
                </div>
              ) : iconName.includes("qtd") ? (
                <div className="">
                  <p className="mb-2">
                    Actual Utilization of current quarter till today.
                  </p>
                </div>
              ) : iconName.includes("nxt30_days") ? (
                <div className="">
                  <p className="mb-2">
                    Planned Utilization for tomorrow to +30 days
                  </p>
                </div>
              ) : iconName.includes("nxt60_days") ? (
                <div className="">
                  <p className="mb-2">
                    Planned Utilization for tomorrow to +60 days
                  </p>
                </div>
              ) : iconName.includes("average") ? (
                <div className="">
                  <p className="mb-2">Total Utilization of QTD and +60 days</p>
                </div>
              ) : (
                ""
              )}
            </div>
          </DialogContent>
        </div>
      </Popover>
    </div>
  );
}
export default UtilizationFYPopUp;
