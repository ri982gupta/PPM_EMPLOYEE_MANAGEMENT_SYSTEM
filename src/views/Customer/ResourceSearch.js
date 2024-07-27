import React from 'react'

function ResourceSearch() {
  return (
    <div> <div className="group mb-3 customCard">
      <h2>Group1</h2>
      <div className="group-content row">
        <div className=" col-md-3 mb-2">
          <div className="form-group row"><label className="col-5" htmlFor="resourcetype">Resource Type</label><span className="col-1">:</span>
            <div className="col-6"><select id="resourcetype">
              <option value="USA">United States</option>
              <option value="CAN">Canada</option>
              <option value="MEX">Mexico</option>
            </select></div>
          </div>
        </div>
        <div className=" col-md-3 mb-2">
          <div className="form-group row"><label className="col-5" htmlFor="resourcebillable">Resource Billable</label><span className="col-1">:</span>
            <div className="col-6"><select id="resourcebillable">
              <option value="USA">United States</option>
              <option value="CAN">Canada</option>
              <option value="MEX">Mexico</option>
            </select></div>
          </div>
        </div>
        <div className=" col-md-3 mb-2">
          <div className="form-group row"><label className="col-5" htmlFor="businessunit">Business Unit</label><span className="col-1">:</span>
            <div className="col-6"><select id="businessunit">
              <option value="USA">United States</option>
              <option value="CAN">Canada</option>
              <option value="MEX">Mexico</option>
            </select></div>
          </div>
        </div>
        <div className=" col-md-3 mb-2">
          <div className="form-group row"><label className="col-5" htmlFor="resourcestatus">Resource Status</label><span className="col-1">:</span>
            <div className="col-6"><select id="resourcestatus">
              <option value="USA">United States</option>
              <option value="CAN">Canada</option>
              <option value="MEX">Mexico</option>
            </select></div>
          </div>
        </div>
        <div className=" col-md-3 mb-2">
          <div className="form-group row"><label className="col-5" htmlFor="reslocation">Res.Location</label><span className="col-1">:</span>
            <div className="col-6"><select id="reslocation">
              <option value="USA">United States</option>
              <option value="CAN">Canada</option>
              <option value="MEX">Mexico</option>
            </select></div>
          </div>
        </div>
        <div className=" col-md-3 mb-2">
          <div className="form-group row"><label className="col-5" htmlFor="lob">Resource LOB Category</label><span className="col-1">:</span>
            <div className="col-6"><select id="lob">
              <option value="USA">United States</option>
              <option value="CAN">Canada</option>
              <option value="MEX">Mexico</option>
            </select></div>
          </div>
        </div>
      </div>
    </div></div>
  )
}

export default ResourceSearch