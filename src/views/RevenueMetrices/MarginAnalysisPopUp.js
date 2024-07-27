import Draggable from "react-draggable";
import { CModal, CModalBody, CModalHeader, CModalTitle } from "@coreui/react";
import MarginAnalysisHierarchy from "./MarginAnalysisHierarchy";
import React, { useState } from "react";

function MarginAnalysisPopUp(props) {
  const { showPopup, setShowPopup, setSelectedResource, setResName } = props;
  const [nodeClicked, setNodeClicked] = useState("");
  const [validation, setValidation] = useState(false);
  const handleNodeClicked = (value) => {
    console.log(value);
    setNodeClicked(value);
  };
  const handelOk = () => {
    if (nodeClicked == "") {
      setValidation(true);
    } else {
      setSelectedResource(nodeClicked);
      setShowPopup(false);
      setValidation(false);
    }
  };

  return (
    <div>
      <CModal
        visible={showPopup}
        alignment="center"
        size="md"
        onClose={() => {
          setShowPopup(false);
          setResName("Select Resource");
        }}
        //   onClose={(e) => console.log(setShowPopup)}
        backdrop={"static"}
      >
        <CModalHeader className="">
          <CModalTitle>
            <span className="">Resource Directory</span>
          </CModalTitle>
        </CModalHeader>
        <CModalBody>
          <div className="col-md-12">
            <div className="form-group row mb-2"></div>
            <MarginAnalysisHierarchy
              setNodeClicked={handleNodeClicked}
              validation={validation}
              setResName={setResName}
            />
            <div className=" form-group col-md-12 col-sm-12 col-xs-12 btn-container center my-3 mb-2">
              <button className="btn btn-primary" type="ok" onClick={handelOk}>
                OK
              </button>
            </div>
          </div>
        </CModalBody>
      </CModal>
    </div>
  );
}

export default MarginAnalysisPopUp;
