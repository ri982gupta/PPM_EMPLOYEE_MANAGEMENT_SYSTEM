import React, { useState } from "react";
import Modal from "./Modal";
import { MultiSelect } from "react-multi-select-component";

function RolesPermissions() {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div>
      <div>
        {" "}
        <Modal open={isOpen} onClose={() => setIsOpen(false)}></Modal>
        <div className="group mb-3 customCard">
          <h2>Roles Permission</h2>
          <div className="group-content row">
            <div className=" col-md-3 mb-2">
              <div className="form-group row">
                <label className="col-5" htmlFor="Menu Type">
                  Menu Type
                  <span className="required">*</span>
                </label>
                <span className="col-1 p-0">:</span>
                <div className="col-6">
                  <select id="Menu Type">
                    <option value="Main Menu">Main Menu</option>
                    <option value="Page Menu">Page Menu</option>
                  </select>
                </div>
              </div>
            </div>
            <div className=" col-md-3 mb-2">
              <div className="form-group row">
                <label className="col-5" htmlFor="Menu">
                  Menu
                  <span className="required">*</span>
                </label>
                <span className="col-1 p-0">:</span>
                <div className="col-6">
                  <select id="Menu">
                    <option value="Customers">Customers</option>
                    <option value="Projects">Projects</option>
                  </select>
                </div>
              </div>
            </div>
            <div className=" col-md-3 mb-2">
              <div className="form-group row">
                <label className="col-5" htmlFor="Sub Menu">
                  Sub Menu
                  <span className="required">*</span>
                </label>
                <span className="col-1 p-0">:</span>
                <div className="col-6">
                  <MultiSelect
                    id="Sub Menu"
                    options={[]}
                    hasSelectAll={true}
                    isLoading={false}
                    shouldToggleOnHover={false}
                    disableSearch={false}
                    //   valueRenderer={customValueRenderer}
                    //   value={selectedRoleTypes}
                    disabled={false}
                  />
                </div>
              </div>
            </div>
            <div className=" col-md-3 mb-2">
              <div className="form-group row">
                <label className="col-5" htmlFor="Role Type">
                  Role Type
                  <span className="required">*</span>
                </label>
                <span className="col-1 p-0">:</span>
                <div className="col-6">
                  <button onClick={() => setIsOpen(true)}>
                    Select Roles Types
                  </button>
                </div>
              </div>
            </div>{" "}
            <div className="col-md-12 col-sm-12 col-xs-12 btn-container center my-3">
              <button type="submit" className="btn btn-primary">
                Search{" "}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RolesPermissions;
