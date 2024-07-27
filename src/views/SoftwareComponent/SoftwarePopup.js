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

const SoftwarePopup = (props) => {
  const { openPopup, setOpenPopup, WOW, rowData } = props;
  const [deptId, setdeptId] = useState([]);
  const [selectedDeptid, setSelectedDeptId] = useState([]);
  const [searchDataB, setSearchDataB] = useState([]);
  const [notesData, setNotesData] = useState({});
  const [value, setValue] = useState("");
  const baseUrl = environment.baseUrl;

  const editorToolBar = {
    toolbar: [
      [
        { header: [false, 1, 2, 3, 4, 5, 6] },
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
            <span className=""> Notes - {rowData.executive} </span>
          </CModalTitle>
        </CModalHeader>
        <CModalBody>
          <ReactQuill
            className=""
            theme="snow"
            value={value}
            name="notes"
            defaultValue={notesData[0]?.notes}
            id="editor-container"
            onChange={(e) => {
              setValue(e);
            }}
            modules={editorToolBar}
          />
        </CModalBody>
      </CModal>
    </div>
  );
};
export default SoftwarePopup;
