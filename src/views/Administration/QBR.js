import React from "react";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Column } from "primereact/column";
import { AiFillEdit } from "react-icons/ai";
import CellRendererPrimeReactDataTable from "../PrimeReactTableComponent/CellRendererPrimeReactDataTable";
import { MdOutlinePlaylistAdd } from "react-icons/md";
import { BiCheck } from "react-icons/bi";
import { environment } from "../../environments/environment";
import "primeicons/primeicons.css";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.css";
import "primeflex/primeflex.css";
import QbrUpdate from "./QbrUpdate";
function QBR(props) {
  const { customerId } = props;
  const [data, setData] = useState([{}]);
  const [issueDetails, setIssueDetails] = useState([]);
  const initialValue = {
    ToDate: "",
  };
  const [addmsg, setAddmsg] = useState(false);
  const [editedData, setEditedData] = useState([]);
  const [searchdates, setSearchdates] = useState(initialValue);
  const [editId, setEditId] = useState();
  const [buttonPopups, setButtonPopups] = useState(false);
  const [headerData, setHeaderData] = useState([]);
  const [linkColumns, setLinkColumns] = useState([]);
  const [linkColumnsRoutes, setLinkColumnsRoutes] = useState([]);
  const getData = () => {
    axios
      .get(baseUrl + `/customersms/Qbr/getQbrDetails?cid=${customerId}`)
      .then((res) => {
        const GetData = res.data;
        for (let i = 0; i < GetData.length; i++) {
          GetData[i]["SNo"] = i + 1;
        }
        let dataHeader = [
          {
            SNo: "S.No",
            qbrDt: "QBR Date",
            leadPresenter: "Lead Presenter",
            prolificsParticipants: "Prolifics Participants",
            customerParticipants: "Customer Participants",
            presentationDt: "Presentation Date",
            meetingNotes: "Metting Notes & Next Steps",
            docId: "Presentation File",
            Action: "Action",
          },
        ];
        let data = ["Action"];
        setLinkColumns(data);
        setData(dataHeader.concat(GetData));
      })
      .catch((error) => {});
  };
  const getDatas = () => {
    axios({
      method: "get",
      url: baseUrl + `/ProjectMS/Issues/getAssignedData`,
    }).then(function (response) {
      var res = response.data;
      setIssueDetails(res);
    });
  };

  const [editmsg, setEditAddmsg] = useState(false);
  useEffect(() => {
    getData();
    getDatas();
  }, []);
  const [type, setType] = useState("add");
  useEffect(() => {}, [editedData]);
  const LinkTemplate = (data) => {
    let rou = linkColumns[0];
    return (
      <>
        {
          <AiFillEdit
            type="edit"
            size="1.2em"
            onClick={() => {
              setEditedData(data);
              setEditId(data.SNo);
              setButtonPopups(true);
              setType("edit");
            }}
            align="center"
          />
        }
      </>
    );
  };

  const dynamicColumns = Object.keys(headerData)?.map((col, i) => {
    return (
      <Column
        sortable
        key={col}
        body={col == "Action" && LinkTemplate}
        field={col}
        header={headerData[col]}
      />
    );
  });

  useEffect(() => {
    data[0] && setHeaderData(JSON.parse(JSON.stringify(data[0])));
  }, [data]);
  const [buttonPopup, setButtonPopup] = useState(false);

  return (
    <div>
      {addmsg ? (
        <div className="statusMsg success">
          <span className="errMsg">
            <BiCheck /> &nbsp; Saved successfully
          </span>
        </div>
      ) : (
        ""
      )}
      {editmsg ? (
        <div className="statusMsg success">
          <span className="errMsg">
            <BiCheck /> &nbsp; Update successfully
          </span>
        </div>
      ) : (
        ""
      )}

      <div className="row">
        <div className="col-md-11"></div>
        <div className="col-md-1">
          <button
            onClick={() => {
              setButtonPopups(true);
              setType("add");
            }}
            className="btn btn-primary mt-2 mb-2"
          >
            <MdOutlinePlaylistAdd />
            Add
          </button>
        </div>
      </div>
      <CellRendererPrimeReactDataTable
        data={data}
        linkColumns={linkColumns}
        linkColumnsRoutes={linkColumnsRoutes}
        dynamicColumns={dynamicColumns}
        headerData={headerData}
        setHeaderData={setHeaderData}
      />
      {buttonPopups ? (
        <QbrUpdate
          setSearchdates={setSearchdates}
          issueDetails={issueDetails}
          type={type}
          customerId={customerId}
          setEditedData={setEditedData}
          editId={editId}
          editedData={editedData}
          setAddmsg={setAddmsg}
          setEditAddmsg={setEditAddmsg}
          buttonPopups={buttonPopups}
          setButtonPopups={setButtonPopups}
        />
      ) : (
        ""
      )}
    </div>
  );
}
export default QBR;
