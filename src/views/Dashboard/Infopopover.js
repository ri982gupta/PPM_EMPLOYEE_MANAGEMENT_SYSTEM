import { Popover } from "@coreui/coreui";
import { DialogContent } from "@material-ui/core";
import React from "react";

export default function Infopopover(props) {
  const { projectData, isOpenInfo } = props;
  return (
    <div>
      {" "}
      <Popover open={isOpenInfo}>
        <div style={{ width: "196px", height: "168px" }}>
          <DialogTitle className="header padding">
            <div
              className="col-md-12"
              style={{ height: "28px", marginTop: "-21px" }}
            >
              <span
                align="center"
                style={{ fontSize: "13px", top: "250px", color: "#2E88C5" }}
              >
                {"Add Comments"}
              </span>
              <button
                title="Close"
                style={{
                  float: "right",
                  marginRight: "-1px",
                  height: "33px",
                  width: "24px",
                  right: "0.3em",
                  position: "absolute",
                }}
              >
                {projectData}
              </button>
            </div>
          </DialogTitle>
        </div>
      </Popover>
    </div>
  );
}
