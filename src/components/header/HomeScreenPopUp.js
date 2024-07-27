import {
  CModal,
  CModalBody,
  CModalHeader,
  CModalTitle,
  CFooter,
} from "@coreui/react";
import axios from "axios";
import React, { useEffect, useState } from "react";
import Draggable from "react-draggable";
import { BiCheck } from "react-icons/bi";
import { useDispatch } from "react-redux";
import { environment } from "../../environments/environment";
import {
  updateHomeScreenmsg,
  updateSubmenuName,
} from "../../reducers/SelectedSEReducer";

function HomeScreenPopUp(props) {
  const { subMenueId, visible, setVisible, subMenueName } = props;
  const loggedUserId = localStorage.getItem("resId");
  const baseUrl = environment.baseUrl;
  const [addmsg, setAddmsg] = useState(false);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(updateSubmenuName(subMenueName));
  }, [subMenueName]);
  const setHomeScreen = () => {
    setVisible(false);
    axios({
      method: "get",
      url:
        baseUrl +
        `/CommonMS/master/setHomeScreen?loggedUserId=${loggedUserId}&actionId=${subMenueId}`,
    }).then((res) => {
      let data = res.data;
      // setAddmsg(true);

      setTimeout(() => {
        dispatch(updateHomeScreenmsg(true));
      }, 2000);
      dispatch(updateHomeScreenmsg(false));

      // setTimeout(() => {
      //   setAddmsg(false);
      setVisible(false);
      // }, 2000);
      window.location.reload();
    });
  };

  const handleClose = () => {
    // Prevent the modal from closing when clicking outside by checking a condition
    if (!addmsg) {
      setVisible(false);
    }
  };

  return (
    <div>
      <CModal
        visible={visible}
        // onClose={handleClose}
        size="sm"
        className=" ui-dialog"
      >
        <CModalHeader className="hgt22">
          <CModalTitle>
            <span className="ft16">Save Home Page</span>
          </CModalTitle>
        </CModalHeader>
        {/* {addmsg ? (
            <div className="statusMsg success">
              <span className="errMsg">
                <BiCheck size="1.4em" /> &nbsp; Set Home page as a{" "}
                {subMenueName}
              </span>
            </div>
          ) : (
            ""
          )} */}
        <CModalBody>
          <p style={{ fontSize: "14px", color: "black" }}>
            Do you want to set {subMenueName} as home page?
          </p>
        </CModalBody>
        <CFooter
          style={{
            borderBottomLeftRadius: "var(--cui-modal-inner-border-radius)",
            borderBottomRightRadius: "var(--cui-modal-inner-border-radius)",
          }}
        >
          <div
            className="btn-container center my-2"
            style={{ marginLeft: "30%" }}
          >
            <button
              type="delete"
              className="btn btn-primary"
              onClick={() => {
                setHomeScreen();
              }}
            >
              {" "}
              Yes{" "}
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setVisible(false)}
            >
              {" "}
              No{" "}
            </button>
          </div>
        </CFooter>
      </CModal>
    </div>
  );
}

export default HomeScreenPopUp;
