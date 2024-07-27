import React, { useEffect, useState } from "react";
import { CModal, CModalBody, CModalHeader, CModalTitle } from "@coreui/react";
import { MdHelp } from "react-icons/md";

function GlobalHelp(props) {
  const [openPopup, setOpenPopup] = useState(false);
  const { pdfname, name } = props;
  const folderName = "helpdocuments";
  const pdfPath = `${folderName}/${pdfname}`;

  return (
    <>
      {!openPopup && (
        <button
          className="btn btn-primary btn-help"
          type="Help"
          onClick={() => setOpenPopup(true)}
        >
          <b>Help</b>
          <MdHelp size={"1.1em"} style={{ marginRight: 0 }} />
        </button>
      )}
      {openPopup && (
        <CModal
          visible={openPopup}
          size="xl"
          onClose={() => setOpenPopup(false)}
          backdrop={"static"}
        >
          <CModalHeader className="">
            <CModalTitle>
              <span className=""> {name}</span>
            </CModalTitle>
          </CModalHeader>
          <CModalBody>
            <div className="align center">
              <embed src={pdfPath} width="100%" className="embDoc"></embed>
            </div>
          </CModalBody>
        </CModal>
      )}
    </>
  );
}

export default GlobalHelp;
