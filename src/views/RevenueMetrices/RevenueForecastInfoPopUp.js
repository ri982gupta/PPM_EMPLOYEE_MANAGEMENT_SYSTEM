import React from "react";
import { DialogContent, Popover } from "@material-ui/core";
import "../VendorComponent/Resources.scss";
function RevenueForecastInfoPopUp(props) {
  const { iconName, anchorEl, setAnchorEl } = props;
  const open = Boolean(anchorEl);
  const id = open ? "my-popver" : undefined;
  const handleClose = () => {
    setAnchorEl(false);
  };
  return (
    <div className="">
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
          <DialogContent>
            <div>
              {iconName.includes("Capacity") ? (
                <div className="">
                  <p className="mb-2">
                    <b>Capacity:</b> Total Number of hrs available for
                    utilization in the period under consideration ( month ){" "}
                    <br />
                    based on the filter criterion used.
                  </p>

                  <p className="mb-2">
                    <b>Gross Capacity:</b> Standard available hrs of resource in
                    a day * Gross working Days ( Excluding
                    <br /> weekends & Holidays)
                  </p>

                  <p className="mb-2">
                    <b>Net Capacity:</b> Standard available hrs of resource in a
                    day * Net working days ( Excluding Weekends,
                    <br /> Holidays and Leaves/Timeoffs) Holidays considered are
                    based on the holidays listed in resource calender
                  </p>

                  <p>
                    <b>Gross%:</b> [ Gross Capacity - Net Capacity ] * 100 /
                    Gross Capacity
                  </p>
                </div>
              ) : iconName.includes("Allocations") ? (
                <div className="">
                  <p className="mb-2">
                    <b>Total Allocations:</b>Total no of billable & Non billable
                    planned hrs allocated to resource in capacity <br />
                    plan
                  </p>

                  <p className="mb-2">
                    <b> Net %:</b> Percentage of allocation hrs over Net
                    Capacity hrs
                  </p>
                </div>
              ) : iconName.includes("Bill Alloc") ? (
                <div className="">
                  <p className="mb-2">
                    <b> Billable Allocations: </b>
                    Total billable allocation hrs in capacity plan for a
                    resource.
                  </p>

                  <p className="mb-2">
                    <b> Net%:</b> Percentage of Bilable allocation hrs over Net
                    Capacity hrs
                  </p>
                </div>
              ) : iconName.includes("Bill Ass") ? (
                <div className="">
                  <p className="mb-2">
                    <b> Billable Assigned:</b> Total billable assigned hrs in
                    task plan for a resource.
                  </p>

                  <p className="mb-2">
                    <b> Net %:</b> Percentage of Bilable assignement hrs over
                    Net Capacity hrs
                  </p>
                </div>
              ) : iconName.includes("Bill Act") ? (
                <div className="">
                  <p className="mb-2">
                    <b> Billable Actuals: </b>Total billable Actuals hrs logged
                    by resource on a billable task.
                  </p>

                  <p className="mb-2">
                    <b> Net %: </b>Percentage of Bilable actual hrs logged over
                    Net Capacity hrs
                  </p>
                </div>
              ) : iconName.includes("Bill Appr") ? (
                <div className="">
                  <p className="mb-2">
                    <b> Billable Approved:</b> Total billable Actuals hrs of
                    resource approved by the PM.
                  </p>

                  <p className="mb-2">
                    <b> Net %:</b> Percentage of Bilable approved hrs of project
                    over Net Capacity hrs
                  </p>
                </div>
              ) : iconName.includes("Revenue") ? (
                <div className="">
                  <p className="mb-2">
                    <b> Planned Revenue:</b> Billable allocated hrs * Billing
                    rate of a resource in project
                  </p>

                  <p className="mb-2">
                    <b> Assigned Revenue:</b>Billable assignments on a billable
                    task * Billing rate of a resource in project
                  </p>

                  <p className="mb-2">
                    <b> Actual Revenue:</b> Billable actuals logged * billing
                    rate of a resource
                  </p>

                  <p className="mb-2">
                    <b> Approved Revenue:</b> Billable approved hrs * billing
                    rate of a resource
                  </p>
                </div>
              ) : iconName.includes("Cost") ? (
                <div className="">
                  <p className="mb-2">
                    <b> Average role cost:</b> average cost rate/hr for a
                    resource based on his designation, County and Unit. This is
                    standard rate provided by finance <br />
                    for all resources
                  </p>

                  <p className="mb-2">
                    <b> Role Cost:</b> at Project / Customer level ; Average
                    role cost of a resource * total <br />
                    allocations of a resource in project/s
                  </p>

                  <p className="mb-2">
                    <b> Role Cost: </b>at other levels ; Average role cost of a
                    resource * Net capacity hrs
                    <br /> of a resource
                  </p>
                </div>
              ) : iconName.includes("GM") ? (
                <div className="">
                  <b> GM % (Role) :</b> [Planned revenue - Cost (role) ] /
                  Planned revenue as a %
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
export default RevenueForecastInfoPopUp;
