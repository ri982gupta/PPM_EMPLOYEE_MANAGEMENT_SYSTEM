import React from "react";
import FlatPrimeReactTable from "../PrimeReactTableComponent/FlatPrimeReactTable";
import { environment } from "../../environments/environment";
import { MdOutlinePlaylistAdd } from "react-icons/md";
import axios from "axios";
import { FaSave } from "react-icons/fa";
import { useEffect, useState, useRef } from "react";
import { CModal, CModalHeader, CModalTitle } from "@coreui/react";
import { ReactSearchAutocomplete } from "react-search-autocomplete";
import GlobalValidation from "../ValidationComponent/GlobalValidation";
import { AiFillWarning } from "react-icons/ai";
import { ImCross } from "react-icons/im";
import { Column } from "primereact/column";
import ProjectorAesFlatPrimeReactTable from "./ProjectorAesFlatPrimeReactTable";
import { BiCheck } from "react-icons/bi";
import GlobalHelp from "../PrimeReactTableComponent/GlobalHelp";
import ScreenBreadcrumbs from "../Common/ScreenBreadcrumbs";
 
function ProjectorAes({maxHeight1}) {
  const [data, setData] = useState([{}]);
  const [item, setItem] = useState([]);
  const [successmsg, setSuccessMessage] = useState(false);
 
  const loggedUserId = localStorage.getItem("resId");
  const [routes, setRoutes] = useState([]);
  let currentScreenName = ["Hammer Tool", "Report", "Projector AES"];
  let textContent = "Administration";
  sessionStorage.setItem(
    "breadCrumbs",
    JSON.stringify({ routes: routes, currentScreenName: currentScreenName, textContent: textContent })
  );

  const baseUrl = environment.baseUrl;
  const [buttonPopup, setButtonPopup] = useState(false);
  const rows = 25;
  const getData = () => {
    axios
      .get(
        baseUrl +
        // `http://localhost:8090/administrationms/getProjectAES`,)
        `/administrationms/getProjectAES`
      )
      .then((res) => {
        const GetData = res.data;
        const Headerdata = [
          {
            ProjName: "Projector Name",
            resource: "Resource",
            isActive: "Is Active",
          },
        ];
        for (let i = 0; i < GetData.length; i++) {
          GetData[i]["isActive"] =
            GetData[i]["isActive"] == null ? "-" : GetData[i]["isActive"];
        }
        setData(Headerdata.concat(GetData));
        console.log(data);
      })
      .catch((error) => {
        console.log("Error :" + error);
      });
  };
  const getUrlPath = () => {
    axios({
      method: "get",
      url:
        baseUrl +
        `/CommonMS/security/authorize?url=/admin/projectorAES&userId=${loggedUserId}`,
    }).then((res) => {
      console.log(res, "urlResponse");
    });
  };
  const getMenus = () => {
    axios({
      method: "GET",
      url: baseUrl + `/CommonMS/master/getMenus?loggedUserId=${loggedUserId}`,
    }).then((resp) => {
      let getData = resp.data.map((menu) => {
        if (menu.subMenus) {
          menu.subMenus = menu.subMenus.filter(
            (subMenu) =>
              subMenu.display_name !== "Roles Permissions" &&
              subMenu.display_name !== "Sales Permissions" &&
              subMenu.display_name !== "Jobs Daily Status" &&
              subMenu.display_name !== "Error Logs" &&
              subMenu.id != 27 &&
              subMenu.display_name !== "Tracker" &&
              subMenu.display_name !== "Role Costs" &&
              subMenu.display_name !== "Upload Role Costs" &&
              subMenu.display_name !== "Contract Documents"
          );
        }
        return menu;
      });
 
      getData.forEach((item) => {
        if (item.display_name === textContent) {
          setRoutes([item]);
          sessionStorage.setItem("displayName", item.display_name)

        }
      });
    }
    )
  }
  useEffect(() => {
    getMenus();
    getData();
    getUrlPath();
  }, []);
 
  const clickHanlder = () => {
    console.log(data);
    setButtonPopup(true);
    // ProjName
  };

  return (
    <div>
      <div className="col-md-12">
        {successmsg ? (
          <div className="statusMsg success">
            <span className="errMsg">
              <BiCheck size="1.4em" strokeWidth={{ width: "100px" }} /> &nbsp;
              Projector name added successfully
            </span>
          </div>
        ) : (
          ""
        )}
      </div>

      <div className="col-6 mt-2 ">
        <ProjectorAesFlatPrimeReactTable data={data} rows={rows} maxHeight1 = {maxHeight1}/>

        <center>
          <button
            type="button"
            className="btn btn-primary btn-container  "
            onClick={() => {
              clickHanlder();
            }}
          >
            {" "}
            <MdOutlinePlaylistAdd />
            Add
          </button>
        </center>
      </div>
      {buttonPopup ? (
        <ProjectorAesPOPup
          buttonPopup={buttonPopup}
          setButtonPopup={setButtonPopup}
          setSuccessMessage={setSuccessMessage}
          data={data}
        />
      ) : (
        ""
      )}
    </div>
  );

  function ProjectorAesPOPup(props) {
    const { buttonPopup, data, setSuccessMessage } = props;
    const intialValue = { resourceFullName: "", userId: "", isActive: "" };
    const [formData, setFormData] = useState(intialValue);
    const [riskDetails, setRiskDetails] = useState([]);
    const ref = useRef([]);
    const [validationmessage, setValidationMessage] = useState(false);
    const [uniquemessage, setUniqueMessage] = useState(false);

    console.log(formData);

    const onSaveClick = () => {
      // console.log(ref);
      let valid = GlobalValidation(ref);
      console.log(valid);
      if (valid == true) {
        setValidationMessage(true);
      }
      if (valid) {
        return;
      }

      let someData = data.some((d) => d.ProjName == formData.resourceFullName);
      // console.log(someData);

      if (someData) {
        let ele = document.getElementsByClassName("unique");
        console.log(ele.length);
        for (let index = 0; index < ele.length; index++) {
          ele[index].classList.add("error-block");
        }
        setUniqueMessage(true);

        return;
      }
      setUniqueMessage(false);

      axios({
        method: "post",
        url: baseUrl + `/administrationms/createProjectAES`,

        data: formData,
      }).then(function (res) {
        var resp = res.data;
        setFormData(resp);
        setButtonPopup(false);
        setSuccessMessage(true);
        getData();
        setTimeout(() => {
          setSuccessMessage(false);
        }, 3000);
      });
      // }
    };

    const onCancelClick = () => {
      setButtonPopup(false);
    };

    const getDataa = () => {
      axios({
        method: "get",
        url: baseUrl + `/ProjectMS/risks/getAssignedData`,
      }).then(function (response) {
        var res = response.data;
        setRiskDetails(res);
        // console.log("assigned data")
        // console.log(res);
      });
    };
    useEffect(() => { }, [riskDetails]);

    useEffect(() => {
      getDataa();
    }, []);

    return (
      <div className="col-md-12">
        <CModal
          visible={buttonPopup}
          onClose={() => setButtonPopup(false)}
          size="xs"
          className=" ui-dialog"
          backdrop={"static"}
        >
          <CModalHeader className="hgt22">
            <CModalTitle>
              <span className="ft16">Projector AES</span>
            </CModalTitle>
          </CModalHeader>
          <div>
            {validationmessage ? (
              <div className=" ml-3 mr-4 statusMsg error">
                <AiFillWarning />
                Please select valid values for highlighted fields
              </div>
            ) : (
              ""
            )}
            {uniquemessage ? (
              <div className=" ml-3 mr-4 statusMsg error">
                <AiFillWarning /> Please select unique name
              </div>
            ) : (
              ""
            )}

            <div className="group-content row">
              <div className="form-group row">
                {/* <label className="col-4 pl-5">Projector Name <span className="col-1 p-0 error-text">*</span> </label> */}
                <label className="col-4 pl-5">
                  Projector Name{" "}
                  <span
                    className="col-1 p-0 error-text"
                    style={{ marginLeft: "5px" }}
                  >
                    *
                  </span>
                </label>

                <span className="col-1 p-0">:</span>
                <span className="col-6 pl-0">
                  <div
                    className="textfield"
                    ref={(ele) => {
                      ref.current[0] = ele;
                    }}
                  >
                    <input
                      type="text"
                      id="resourceFullName"
                      className="validCheck unique"
                      onKeyDown={(event) => {
                        if (event.code == "Space" && !formData.resourceFullName)
                          event.preventDefault();
                      }}
                      onChange={(e) => {
                        setFormData({
                          ...formData,
                          ["resourceFullName"]: e.target.value,
                        });
                        console.log(e.target.value);
                      }}
                    ></input>
                  </div>
                </span>
              </div>
              <br></br>
              &nbsp;
              <div className="form-group row ">
                <label className="col-4 pl-5 ">
                  Resource Name{" "}
                  <span
                    className="col-1 p-0 error-text"
                    style={{ marginLeft: "5px" }}
                  >
                    *
                  </span>
                </label>

                <span className="col-1 p-0">:</span>
                <div
                  className="col-6 autocomplete pl-0"
                  name="Assigned_To"
                  id="userId"
                  ref={(ele) => {
                    ref.current[1] = ele;
                  }}
                >
                  <div className="autoComplete-container react mt-2 ">
                    <ReactSearchAutocomplete
                      items={riskDetails}
                      type="Text"
                      name="Assigned_To"
                      id="userId"
                      placeholder="Enter Resource Name"
                      riskDetails={riskDetails}
                      getData={getData}
                      className="AutoComplete"
                      onSelect={(e) => {
                        setFormData((prevProps) => ({
                          ...prevProps,
                          userId: e.id,
                        }));
                        console.log(e);
                      }}
                      showIcon={false}
                    />
                    <span>{item.name}</span>
                    {/* &nbsp; */}
                  </div>
                </div>
              </div>
              <div className="form-group row mt-2">
                <label className="col-4 pl-5">Is Active</label>
                <span className="col-1 p-0">:</span>
                <span className="col-6  pl-0 align-self-center">
                  <input
                    type="checkbox"
                    onChange={(e) => {
                      setFormData({
                        ...formData,
                        ["isActive"]: e.target.value === "on" ? "1" : "0",
                      });
                      console.log(e.target.value === "on" ? "1" : "0");
                    }}
                    style={{ marginTop: "5px" }} // add margin-top here
                  ></input>
                </span>
              </div>
              &nbsp; &nbsp;
              <div className="col-md-12 col-sm-12 col-xs-12 my-2 btn-container center">
                &nbsp; &nbsp;
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={onSaveClick}
                >
                  <FaSave /> Save{" "}
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={onCancelClick}
                >
                  {" "}
                  <ImCross />
                  Cancel{" "}
                </button>
              </div>
            </div>
          </div>
        </CModal>
      </div>
    );
  }
}
export default ProjectorAes;
