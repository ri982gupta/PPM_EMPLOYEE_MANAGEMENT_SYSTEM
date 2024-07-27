import React from "react";
import ReactQuill from "react-quill";
import { CModal } from "@coreui/react";
import { CModalBody } from "@coreui/react";
import { CModalHeader } from "@coreui/react";
import { CModalTitle } from "@coreui/react";
import { useState } from "react";
import { useEffect } from "react";
import { environment } from "../../environments/environment";

import axios from "axios";
import { FaSave } from "react-icons/fa";
import { ImCross } from "react-icons/im";

const DisplayPopUpEditNote = (props) => {
  const { openPopup, setOpenPopup, Vdata, rowData, popupValue } = props;
  const [notesData, setNotesData] = useState({});
  const [value, setValue] = useState("");
  const baseUrl = environment.baseUrl;

  const editorToolBar = {
    toolbar: [
      [
        { header: [false, 1, 2, 3, 4, 5, 6] },
        // {tooltip:["ee"]},
        // { size: [] },
        { font: [] },
        { color: [] },
        { bold: { tooltip: "Bold (Ctrl+B)" } },
        "italic",
        "underline",
        { list: "ordered" },
        { list: "bullet" },
        { script: "sub" },
        { script: "super" },
        { indent: "-1" },
        { indent: "+1" },
        { align: null },
        { align: "center" },
        { align: "right" },
        "strike",
        "link",
        "code-block",
        "clean",
      ],
    ],
  };
  const getNotesData = () => {
    axios({
      method: "get",
      url: baseUrl + `/SalesMS/services/getExecutiveNotes?rid=${rowData.id}`,
    }).then((res) => {
      var resp = res.data;
      setNotesData(resp);
      const defaultNotes = resp[0]?.notes || "";
      setValue(defaultNotes);
    });
  };

  const saveNotesData = () => {
    const cleanedNotes = value.replace(/<\/?[^>]+(>|$)/g, "");
    const requestData = {
      resId: rowData.id,
      notes: cleanedNotes,
      loggedUserId: localStorage.getItem("resId"),
    };
    axios({
      method: "POST",
      url: baseUrl + `/SalesMS/pmo/savenotes`,
      data: requestData,
    }).then((resp) => {
      var data = resp.data;
      setNotesData(data);
      setOpenPopup(false);
    });
  };

  useEffect(() => {
    getNotesData();
  }, []);

  return (
    <div>
      <CModal
        visible={openPopup}
        size="xl"
        onClose={() => setOpenPopup(false)}
        backdrop={"static"}
      >
        <CModalHeader className="" style={{ cursor: "all-scroll" }}>
          <CModalTitle>
            <span className="">
              Notes -{" "}
              {popupValue === "ViewTable" ? rowData?.executive : rowData?.name}
            </span>
          </CModalTitle>
        </CModalHeader>
        <CModalBody>
          <ReactQuill
            className=""
            theme="snow"
            value={value}
            name="notes"
            // data-toggle="tooltip"
            // title={"link"}
            defaultValue={notesData[0]?.notes}
            id="editor-container"
            onChange={(e) => {
              setValue(e);
            }}
            modules={editorToolBar}
          />

          {/* {popupValue === "TargetTable" ? ( */}
          <div className="col-md-12 col-sm-12 col-xs-12 my-2 btn-container center">
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => {
                saveNotesData();
              }}
            >
              <FaSave />
              Save{" "}
            </button>
            <button
              type="button"
              className="btn btn-primary"
              // onClick={setOpenPopup(false)}
              onClick={() => {
                setOpenPopup(false);
              }}
            >
              <ImCross fontSize={"11px"} />
              Cancel{" "}
            </button>
          </div>
          {/* ) : (
            ""
          )} */}
        </CModalBody>
      </CModal>
    </div>
  );
};
export default DisplayPopUpEditNote;
