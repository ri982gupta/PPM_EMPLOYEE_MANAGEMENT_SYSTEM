import { CModal, CModalBody, CModalHeader, CModalTitle } from "@coreui/react";
import axios from "axios";
import React, { useState } from "react";
import { environment } from "../../environments/environment";
import DocumentPopUpHierarchy from "./DocumentPopUpHierarchy";

function DocumentsPopUp(props) {
  const {
    openPopup,
    setOpenPopup,
    projectId,
    hierarchydata,
    SetDocFolderId,
    selectedIds,
    setSelectedIds,
    setCopySuccessmsg,
    setMoveSuccessmsg,
    getapiData,
    setCheckboxSelect,
  } = props;
  const loggedUserId = localStorage.getItem("resId");
  const baseUrl = environment.baseUrl;
  const [copy, setCopy] = useState([]);
  const [move, setMove] = useState([]);

  const [popDocFolderId, setPopDocFolderId] = useState(null);

  const copyDocsToFolder = () => {
    setCopySuccessmsg(true);
    const updatedDocIds = Array.isArray(selectedIds)
      ? selectedIds.map((val) => parseInt(val))
      : [];

    axios({
      method: "post",
      url: baseUrl + `/ProjectMS/ContractDocuments/copyDocsToFolder`,
      data: {
        loggedUserId: loggedUserId,
        docIds: updatedDocIds,
        docFolderId: popDocFolderId,
      },
    })
      .then(function (response) {
        let resp = response.data;
        setCopy(resp);
        getapiData();
        setSelectedIds([]);
      })
      .catch(function (error) {})
      .finally(function () {
        setTimeout(() => {
          setCopySuccessmsg(false);
        }, 2000);
      });
  };

  const moveDocsToFolder = () => {
    setMoveSuccessmsg(true);
    const updatedDocIds = Array.isArray(selectedIds)
      ? selectedIds.map((val) => parseInt(val))
      : [];

    axios({
      method: "post",
      url: baseUrl + `/ProjectMS/ContractDocuments/moveDocsToFolder`,
      data: {
        loggedUserId: loggedUserId,
        docIds: updatedDocIds,
        docFolderId: popDocFolderId,
      },
    })
      .then(function (response) {
        let resp = response.data;
        setSelectedIds([]);
        setMove(resp);
        getapiData();
      })
      .catch(function (error) {})
      .finally(function () {
        setTimeout(() => {
          setMoveSuccessmsg(false);
        }, 2000);
      });
  };

  return (
    <div>
      <div className="col-md-12">
        <CModal
          visible={openPopup}
          size="xs"
          onClose={() => setOpenPopup(false)}
          backdrop={"static"}
        >
          <CModalHeader className="">
            <CModalTitle>
              <span className=""> Folders</span>
            </CModalTitle>
          </CModalHeader>
          <CModalBody>
            <div className="col-md-9 customCard">
              <div className="col-md-12 collapseHeader">
                <h2>Document Folders</h2>
              </div>
              {
                <DocumentPopUpHierarchy
                  defaultExpandedRows={String(projectId)}
                  data={hierarchydata}
                  SetDocFolderId={SetDocFolderId}
                  projectId={projectId}
                  popDocFolderId={popDocFolderId}
                  setPopDocFolderId={setPopDocFolderId}
                />
              }
            </div>
            <div className=" form-group col-md-12 col-sm-12 col-xs-1 btn-container center my-2">
              <button
                className="btn btn-primary"
                type="Add"
                title="Add"
                onClick={() => {
                  copyDocsToFolder();
                  setOpenPopup(false);
                  setCheckboxSelect(false);
                }}
              >
                Copy
              </button>
              <button
                className="btn btn-primary"
                type="Move/Copy Files"
                title="Add"
                onClick={() => {
                  moveDocsToFolder();
                  setOpenPopup(false);
                  setCheckboxSelect(false);
                }}
              >
                Move
              </button>
            </div>
          </CModalBody>
        </CModal>
      </div>
    </div>
  );
}
export default DocumentsPopUp;
