import { useState } from "react";
import Popover from "@mui/material/Popover";
import Typography from "@mui/material/Typography";
import React from "react";

export default function ProjectExpensePopOver(props) {
  const { rowData, setAnchorEl, anchorEl } = props;

  console.log(rowData + "in line 9...");

  const handlePopoverOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  return (
    <div>
      <Typography
        aria-owns={open ? "mouse-over-popover" : undefined}
        aria-haspopup="true"
        onMouseEnter={handlePopoverOpen}
        onMouseLeave={handlePopoverClose}
      ></Typography>
      <Popover
        id="mouse-over-popover"
        sx={{
          pointerEvents: "none",
        }}
        open={open}
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        onClose={handlePopoverClose}
        disableRestoreFocus
      >
        <Typography sx={{ p: 1 }}>
          <div>
            <strong
              style={{
                fontSize: "14px",
              }}
            >
              Approval WorkFlow:
            </strong>
            <br />
            <span style={{ fontSize: "13px" }}>{rowData}</span>
          </div>
        </Typography>
      </Popover>
    </div>
  );
}
