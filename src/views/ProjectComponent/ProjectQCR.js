import React, { useState } from "react";
import { CCollapse } from "@coreui/react";
import { SlExclamation } from "react-icons/sl";
import { VscSave } from "react-icons/vsc";
import { FaCheck } from "react-icons/fa";

import {
  FaChevronCircleDown,
  FaChevronCircleUp,
  FaSearch,
} from "react-icons/fa";

function ProjectQCR({ grp6Items }) {
  const dataObject = grp6Items.find((item) => item.display_name === "QCR");
  const [visible, setVisible] = useState(false);
  const [cheveronIcon, setCheveronIcon] = useState(FaChevronCircleUp);
  return (
    <div>
      <div className="pageTitle ">
        <div className="childOne">
          <h2>IA Support(IA Support)</h2>
        </div>
        <div className="childTwo">
          <h2>Documents</h2>
        </div>
        <div className="childThree"></div>
      </div>

      <div className="col-md-12 customCard">
        <div className="col-md-12 collapseHeader">
          <button
            className="searchFilterButton btn btn-primary"
            onClick={() => {
              setVisible(!visible);

              visible
                ? setCheveronIcon(FaChevronCircleUp)
                : setCheveronIcon(FaChevronCircleDown);
            }}
          >
            Search Filters
            <span className="serchFilterText">{cheveronIcon}</span>
          </button>
        </div>
        <CCollapse visible={!visible}>
          <div className="group-content row">
            <div className=" col-md-4">
              <div className="form-group row">
                <label className="col-5" htmlFor="Document">
                  Document Name
                </label>
                <span className="col-1 p-0">:</span>
                <div className="col-6">
                  <input
                    type="text"
                    className="form-control"
                    id="Document"
                    placeholder
                  />
                </div>
              </div>
            </div>
            <div className=" col-md-3 ">
              <div className="form-group row">
                <div className="col-4">
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => handleClick()}
                  >
                    <FaSearch /> Search{" "}
                  </button>
                </div>
              </div>
            </div>
            <div className=" col-md-5 ">
              <div className="form-group row"></div>
            </div>
          </div>
        </CCollapse>
        <div>
          <label className=" Warning1 col-md-12">
            <SlExclamation /> Audit Details can be updated between 5 to 30 dates
            of every month.
          </label>
        </div>
        <div className="row">
          <div className="col-md-9"></div>
          <div className="col-3">
            {dataObject?.is_write === true ? (
              <div className="   col-md-12 col-sm-12 col-xs-12 btn-container center my-3 mb-2">
                <button className="btn btn-primary" type="submit">
                  <VscSave /> Save
                </button>
                <button className="btn btn-primary">
                  <FaCheck /> Submit
                </button>
              </div>
            ) : (
              ""
            )}
          </div>
        </div>
        <div className="row">
          <div className=" col-md-2 mb-0"></div>
          <div className=" col-md-4 mb-0">
            <div className="  row">
              <label className="col-5" htmlFor="dateOfReview">
                Date of Review *
              </label>
              <span className="col-1">:</span>
              <div className="col-6">
                <input
                  type="text"
                  className="form-control"
                  id="dateOfReview"
                  required
                />
              </div>
            </div>
          </div>
          <div className=" col-md-4 mb-0">
            <div className="  row">
              <label className="col-5" htmlFor="projectManager ">
                Project Manager *
              </label>
              <span className="col-1">:</span>
              <div className="col-6">
                <input
                  type="text"
                  className="form-control"
                  id="projectManager"
                  required
                />
              </div>
            </div>
          </div>
          <div className=" col-md-2 mb-0"></div>

          <div className=" col-md-2 mb-2"></div>
          <div className=" col-md-4 mb-2">
            <div className="  row">
              <label className="col-5" htmlFor="reviewDoneBy">
                Review Done By *
              </label>
              <span className="col-1">:</span>
              <div className="col-6">
                <input
                  type="text"
                  className="form-control"
                  id="reviewDoneBy"
                  required
                />
              </div>
            </div>
          </div>
          <div className=" col-md-4 mb-2">
            <div className="  row">
              <label className="col-5" htmlFor="effortSpent">
                Effort spent for Review (person hours) *
              </label>
              <span className="col-1">:</span>
              <div className="col-6">
                <input
                  type="text"
                  className="form-control"
                  id="effortSpent "
                  required
                />
              </div>
            </div>
          </div>
          <div className=" col-md-2 mb-0"></div>

          <div className=" col-md-2 mb-0"></div>
          <div className=" col-md-4 mb-0"></div>
          <div className=" col-md-2 mb-0"></div>
        </div>
      </div>
    </div>
  );
}

export default ProjectQCR;
