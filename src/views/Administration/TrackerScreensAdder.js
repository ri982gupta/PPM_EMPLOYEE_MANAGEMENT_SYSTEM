import React from "react";
import axios from "axios";
import { useEffect, useState, useRef } from "react";
import FlatPrimeReactTable from "../PrimeReactTableComponent/FlatPrimeReactTable";
import { CModal, CModalHeader, CModalTitle, CModalBody } from "@coreui/react";
import { MdOutlinePlaylistAdd } from "react-icons/md";
import CheckFlatPrimeReactTable from "../PrimeReactTableComponent/CheckFlatPrimeReactTable";
import { environment } from "../../environments/environment";
import { AiFillWarning } from "react-icons/ai";
import { ImCross } from "react-icons/im";
import GlobalValidation from "../ValidationComponent/GlobalValidation";
import { BiCheck } from "react-icons/bi";
import CellRendererPrimeReactDataTable from "../PrimeReactTableComponent/CellRendererPrimeReactDataTable";
import TrackerScreenFlatPrimeReactTable from "./TrackerScreenFlatPrimeReactTable";
import { FaSave } from "react-icons/fa";
import ScreenBreadcrumbs from "../Common/ScreenBreadcrumbs";

function TrackerScreensAdder({maxHeight1}) {
  const [data, setData] = useState([{}]);
  const [buttonPopup, setButtonPopup] = useState(false);
  const intialValue = { id: "", displayName: "" };
  const [formData, setFormData] = useState(intialValue);
  const [successmsg, setSuccessMessage] = useState(false);
  const rows = 20;
  const baseUrl = environment.baseUrl;
  const value = "trackerscreensadder";

  const loggedUserId = localStorage.getItem("resId");
  const [routes, setRoutes] = useState([]);
  let currentScreenName = ["Hammer Tool", "Add Tracker Screen"];
  let textContent = "Administration";

  sessionStorage.setItem(
    "breadCrumbs",
    JSON.stringify({ routes: routes, currentScreenName: currentScreenName, textContent: textContent })
  );

  const getData = () => {
    axios
      .get(
        baseUrl +
        // `http://localhost:8090/administrationms/tracker/getTrackerScreens`,

        `/administrationms/tracker/getTrackerScreens`
      )

      .then((res) => {
        const GetData = res.data;
        GetData.forEach((GetData, index) => {
          GetData["S.No"] = index + 1;
          GetData["id"] = index;
        });

        console.log("in line 32--------");
        console.log(GetData);
        const Headerdata = [
          {
            "S.No": "S.No",
            screenName: "Screen Names",
          },
        ];
        setData(Headerdata.concat(GetData));
        // console.log("INLINE 31")
        console.log(data);
      })
      .catch((error) => {
        console.log("Error :" + error);
      });
  };
  useEffect(() => {
    getData();
    getMenus();
    getUrlPath();
  }, []);

  const getUrlPath = () => {
    axios({
      method: "get",
      url:
        baseUrl +
        `/CommonMS/security/authorize?url=/admin/Tracker&userId=${loggedUserId}`,
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

  const clickHanlder = () => {
    setButtonPopup(true);
  };
  console.log(data);

  return (
    <div>
      <div className="col-md-12">
        {successmsg ? (
          <div className="statusMsg success">
            <span className="errMsg">
              <BiCheck size="1.4em" strokeWidth={{ width: "100px" }} /> &nbsp;
              Tracker screen added successfully
            </span>
          </div>
        ) : (
          ""
        )}
      </div>

      &nbsp;
      <div className="darkHeader primeReactTable">
        <TrackerScreenFlatPrimeReactTable data={data} rows={25}  maxHeight1 = {maxHeight1}/>
      </div>
      <div className="col-md-6 btn-container center">
        <button
          type="button"
          className="btn btn-primary"
          onClick={() => {
            clickHanlder();
          }}
        >
          {" "}
          <MdOutlinePlaylistAdd />
          Add
        </button>
      </div>
      {buttonPopup ? (
        <TrackerScreensAdderPopUp
          getData={getData}
          buttonPopup={buttonPopup}
          setButtonPopup={setButtonPopup}
          setSuccessMessage={setSuccessMessage}
        />
      ) : (
        ""
      )}
    </div>
  );

  function TrackerScreensAdderPopUp(props) {
    const [data, setData] = useState([{}]);
    const { buttonPopup, setButtonpopup, setSuccessMessage, getData } = props;
    const [checkedData, setCheckedData] = useState([]);
    const [validationmessage, setValidationMessage] = useState("");
    // const [successmsg, setSuccessMessage] = useState(false)

    let rows = [10];
    const getDataa = () => {
      axios
        .get(baseUrl + `/administrationms/tracker/getTrackerScreensAdder`)

        .then((res) => {
          const GetData = res.data;

          for (let i = 0; i < GetData.length; i++) {
            GetData[i]["id"] = i + 1;
          }

          console.log(GetData);

          const Headerdata = [
            {
              display_name: "Screen Names",
            },
          ];
          setData(Headerdata.concat(GetData));
          console.log("inline ----------------------");
          console.log(data);
        })
        .catch((error) => {
          console.log("Error :" + error);
        });
    };
    useEffect(() => {
      getDataa();
    }, []);

    const onCancelClick = () => {
      setButtonPopup(false);
    };

    console.log(checkedData);
    const ref = useRef([]);

    const onConfirmClick = () => {
      console.log(ref);
      console.log(checkedData);

      let valid = GlobalValidation(ref);
      console.log(valid);
      if (checkedData.length == 0) {
        setValidationMessage(
          <div className=" ml-3 mr-4 statusMsg error">
            <AiFillWarning /> Please select atleast one Tracker Screen
          </div>
        );
        return;
      }
      setValidationMessage("");

      let Fdata = [];
      for (let i = 0; i < checkedData.length; i++) {
        const obj = {};
        obj["id"] = checkedData[i]["scrnId"];
        obj["displayName"] = checkedData[i]["display_name"];
        Fdata.push(obj);
      }

      axios({
        method: "post",
        url:
          baseUrl +
          // `http://localhost:8090/administrationms/tracker/insertUserActions`
          `/administrationms/tracker/insertUserActions`,
        data: Fdata,
      }).then(function (res) {
        var resp = res.data;
        setFormData(resp);
        console.log(resp);
        // setValidationMessage(<div className="statusMsg success">Tracker screen added successfully</div>);
        // setTimeout(() => {
        //     setValidationMessage("");
        // }
        //     , 3000);
        setButtonPopup(false);
        setSuccessMessage(true);
        getData();
        setTimeout(() => {
          setSuccessMessage(false);
        }, 3000);
      });
    };
    return (
      <div className="col-md-12">
        <CModal
          alignment="center"
          // backdrop={false}
          visible={buttonPopup}
          onClose={() => setButtonPopup(false)}
          size="xs"
          className=" ui-dialog"
          backdrop={"static"}
        >
          <CModalHeader className="hgt22" style={{ cursor: "all-scroll" }}>
            <CModalTitle>
              <span className="ft16">List of Screens</span>
            </CModalTitle>
          </CModalHeader>
          {validationmessage}
          <CModalBody>
            <div className="darkHeader">
              <CheckFlatPrimeReactTable
                data={data}
                rows={rows}
                value={value}
                checkedData={checkedData}
                setCheckedData={setCheckedData}
              />
            </div>
          </CModalBody>

          <div className="col-md-12 col-sm-12 col-xs-12 my-2 btn-container center">
            <button
              type="button"
              className="btn btn-primary"
              onClick={onConfirmClick}
            >
              {" "}
              <FaSave /> Confirm{" "}
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
        </CModal>
      </div>
    );
  }
}
export default TrackerScreensAdder;
