import React, { useEffect, useRef } from "react";
import { FaSave } from "react-icons/fa";
import { useState } from "react";
import { environment } from "../../environments/environment";
import axios from "axios";
import SaveIcon from "@mui/icons-material/Save";
import GlobalValidation from "../ValidationComponent/GlobalValidation";
import { AiFillDelete, AiFillWarning } from "react-icons/ai";

import { CModal, CModalBody, CModalHeader, CModalTitle } from "@coreui/react";

export default function SavedSearch(props) {
  const { setEditAddmsg } = props;
  console.log(props);

  const [openPopup, setOpenPopup] = useState(false);
  const baseUrl = environment.baseUrl;
  const [section, setSection] = useState([]);
  const getDatas = () => {
    axios({
      method: "get",
      url: baseUrl + `/ProjectMS/stakeholders/getSavesearch`,
    }).then(function (response) {
      var res = response.data;
      setSection(res);
    });
  };
  console.log(section);
  const [formData, setFormData] = useState({});
  const loggedUserId = localStorage.getItem("resId");

  const handleChange1 = (e) => {
    const { id, name, value } = e.target;
    console.log(id, name, value);
    // setFormData((prev) => {
    //     return { ...prev, [id]: value };
    // });
    // console.log(id, ":", value)
  };
  const handleChange = (e) => {
    const { value, id } = e.target;
    setFormData({ ...formData, [id]: value });
    console.log(formData);
  };
  const [validationMessage, setValidationMessage] = useState(false);

  const ref = useRef([]);

  const handleEditClick = () => {
    // let valid = GlobalValidation(ref);
    // console.log(valid);

    // if (valid) {
    //     setValidationMessage(true);
    //     return;
    // }
    axios({
      method: "post",
      url: baseUrl + `/ProjectMS/stakeholders/postSavesearch`,
      data: {
        search_name: formData.search_name,
        page_name: "Sales",
        page_url: baseUrl,
        user_id: loggedUserId,
        dashboard_type: dashboardType,
      },
    }).then((error) => {
      setEditAddmsg(true);
      setOpenPopup(false);
      setTimeout(() => {
        setEditAddmsg(false);
      }, 3000);
    });
  };

  useEffect(() => {
    getDatas();
  }, []);

  const [dashboardType, setDashboardType] = useState("1417");
  console.log(dashboardType);
  function myFunction(event) {
    setDashboardType(event.target.value);
  }
  const [pageName, setPagename] = useState([]);
  function myFunctions(event) {
    setPagename(event.target.value);
  }

  const handleChange2 = (e) => {
    console.log(e);
    const { name, value, id } = e.target;

    console.log(id, value);

    // setFormData((prev) => {
    //   return { ...prev, [id]: value };
    // });

    setFormData((prev) => ({ ...prev, [id]: value }));

    // console.log(formData)
  };
  function HelpPopUp() {
    setOpenPopup(true);
    return (
      <>
        <CModal
          visible={openPopup}
          size="sx"
          onClose={() => setOpenPopup(false)}
          backdrop={"static"}
        >
          <CModalHeader className=""></CModalHeader>
          {validationMessage ? (
            <div className="statusMsg error">
              <span className="error-block">
                <AiFillWarning /> &nbsp;Please select valid values for
                highlighted fields
              </span>
            </div>
          ) : (
            ""
          )}
          <CModalBody>
            <div className="col-md-12">
              <div className="form-group row mb-2">
                <label className="col-4" htmlFor="">
                  Enter Search Name *
                </label>
                <span className="col-1 p-0">:</span>
                <div className="col-6">
                  {/* <div className="col-6 textfield"

                                        ref={(ele) => {
                                            ref.current[0] = ele;
                                        }}
                                    > */}
                  <input
                    // className="text"
                    type="text"
                    // name="search_name"
                    id="search_name"
                    // onChange={(e) => setFormData(prev => ({ ...prev, ["search_name"]: e.target.value }))}
                    onChange={(e) => {
                      handleChange2(e);
                    }}
                  />
                  {/* </div> */}
                </div>
              </div>
              <div className="form-group row mb-2">
                <label className="col-4" htmlFor="">
                  Dashboard
                </label>
                <span className="col-1 p-0">:</span>
                <div className="col-6">
                  <select
                    id="dashboard_type"
                    name="dashboard_type"
                    onChange={myFunction}
                    value={dashboardType}
                  >
                    <option value="1417">My Dashboard </option>
                    <option value="1418">Org Dashboard</option>
                  </select>
                </div>
              </div>
              <div className="form-group row mb-2">
                <label className="col-4" htmlFor="">
                  Section
                </label>
                <span className="col-1 p-0">:</span>
                <div className="col-6">
                  <select
                    id="page_name"
                    onChange={myFunctions}
                    value={pageName}
                  >
                    <option> &lt;&lt;Please Select&gt;&gt;</option>
                    {section.map((Item) => (
                      <option value={Item.id} key={Item.id}>
                        {Item.section}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            <div className='className="col-md-12 col-sm-12 col-xs-12 btn-container center my-3'>
              <button className="btn btn-primary " onClick={handleEditClick}>
                <SaveIcon />
                Save
              </button>
            </div>
          </CModalBody>
        </CModal>
      </>
    );
  }
  return (
    <>
      <button
        className="btn btn-primary"
        type="Help"
        onClick={() => HelpPopUp()}
      >
        <FaSave size={"1.3em"} style={{ marginRight: 0 }} />
      </button>
      {openPopup ? (
        <HelpPopUp openPopup={openPopup} setOpenPopup={setOpenPopup} />
      ) : (
        ""
      )}
    </>
  );
}
