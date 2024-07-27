import { Popover } from "@material-ui/core";
import { Typography } from "antd";
import React from "react";

export default function ReviewsPopover(props) {
  const { anchorEl, handleClose, popOverText } = props;
  const open = Boolean(anchorEl);
  const id = open ? "my-popover" : undefined;
  return (
    <div>
      <Popover
        className="ResourceOverviewPopover"
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
        <Typography sx={{ p: 2 }}> &nbsp; {popOverText} &nbsp;</Typography>
      </Popover>
    </div>
  );
}
