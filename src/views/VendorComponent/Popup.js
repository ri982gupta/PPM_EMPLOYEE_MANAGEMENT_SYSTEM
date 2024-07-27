import * as React from "react";
import Popover from "@mui/material/Popover";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
// import { keys } from 'core-js/core/array';
// import "./Resources.scss";
import { Margin } from "@mui/icons-material";
import Resources from "./Resources";
import "../VendorComponent/Resources.scss";
import { BiX } from "react-icons/bi";
import { Link } from "react-router-dom";
import "./Resources.scss";
import "../FullfimentComponent/ResourceOverviewTable.scss";

export default function Popup(props) {
  const {
    anchorEl,
    handleClose,
    name,
    LinkId,
    setAllocationTable,
    setAnchorEl,
    setGraphKey1,
  } = props;
  // console.log("in line 12")
  // console.log(resource_name)
  const open = Boolean(anchorEl);
  const id = open ? "my-popver" : undefined;
  // const {resource_name}=props;
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  return (
    <div>
      <Popover
        id={id}
        open={Boolean(anchorEl)}
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
          <DialogTitle style={{ padding: "2px 8px", backgroundColor: "#ddd" }}>
            <span style={{ fontSize: "14px" }}>{name}</span>
            <button
              style={{
                float: "right",
                marginRight: "-8px",
                backgroundColor: "rgb(221, 221, 221)",
              }}
              className="button1"
              onClick={handleClose}
            >
              <BiX />
            </button>
          </DialogTitle>
          <DialogContent style={{ height: "48px" }}>
            <ul style={{ height: "10px" }}>
              <Link to={`/resource/profile/:${LinkId}`} target="_blank">
                View Resource's Profile
              </Link>
              <br />
              <Link
                onClick={() => {
                  setAllocationTable(true);
                  setAnchorEl(false);
                  setGraphKey1((prevKey) => prevKey + 1);
                }}
              >
                View Resource's Allocations
              </Link>
            </ul>
          </DialogContent>
        </div>
      </Popover>
    </div>
  );
}
