import React from "react";
import { useState } from "react";
import Loader from "../Loader/Loader";
import axios from "axios";
import { environment } from "../../environments/environment";
import { useRef } from "react";
import { useEffect } from "react";
import DownloadForOfflineRoundedIcon from "@mui/icons-material/DownloadForOfflineRounded";
const SfpipelineDocument = (props) => {
  const { type } = props;
  const [sfDocs, setSfDocs] = useState([]);
  const [open, setOpen] = useState(false);
  const baseUrl = environment.baseUrl;
  const abortController = useRef(null);
  const [docName, setDocName] = useState("");
  const getSfDocuments = () => {
    setOpen(true);
    abortController.current = new AbortController();

    axios({
      method: "post",
      url: baseUrl + `/SalesMS/sales/getSFOppDocs`,
      data: {
        oppId: type,
      },
    }).then((resp) => {
      const data = resp.data;
      setSfDocs(data.data);
      setOpen(false);

      window.scrollTo({ top: 1500, behavior: "smooth" });
    });
  };

  useEffect(() => {}, [sfDocs]);

  useEffect(() => {
    getSfDocuments();
  }, [type]);

  const handleAbort = () => {
    abortController.current && abortController.current.abort();
    setOpen(false);
  };
  const handleDownload = (data) => {
    const docId = data.docId;
    const docType = data.type;
    const docFileName = data.name;

    const docUrl =
      baseUrl + `SalesMS/sales/downloadDoc?docId=${docId}&type=${docType}`;

    return <a href={docUrl}></a>;
  };

  const SfDocsTable = ({ sfDocs }) => {
    return (
      <div className="darkHeader">
        <table
          className="table table-bordered attainTable ellipsis"
          style={{ width: "20%" }}
        >
          <thead
            style={{
              textAlign: "center",
              backgroundColor: "#f4f4f4",
              color: "black",
            }}
          >
            <tr className="fs10">
              <th>Document Name</th>
              <th style={{ textAlign: "center" }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {sfDocs?.data && sfDocs.data.length > 0 ? (
              sfDocs.data.map((doc) => (
                <tr key={doc.docId}>
                  <td>{doc.name}</td>
                  <td style={{ textAlign: "center" }}>
                    {doc.type == "DocLInk" ? (
                      <a
                        href={
                          baseUrl +
                          `/SalesMS/sales/downloadDoc?docId=${doc.docId}&type=${doc.docType}`
                        }
                      >
                        <DownloadForOfflineRoundedIcon
                          style={{ color: "#86b558" }}
                          //   onClick={() => {
                          //     handleDownload(sfDocs.data[0]);
                          //   }}
                        />
                      </a>
                    ) : (
                      ""
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="2" style={{ textAlign: "center" }}>
                  No Document Found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    );
  };
  return (
    <>
      {/* <div class="" style={{padding: '5px !important'}}>
                <span style= {{fontSize: '13px',fontWeight:'bold'}}>Sf Documents For </span>
                <span style={{ color: '#297ab0', fontSize: '15px', fontWeight: 'bolder' }}>
  {sfDocs?.data && sfDocs.data.length > 0 ? sfDocs.data[0].name : ''}
</span>
            </div> */}
      <div className="col-lg-12 col-md-12 col-sm-12 mt10 no-padding">
        {open ? <Loader handleAbort={handleAbort} /> : ""}
        <>
          <SfDocsTable sfDocs={sfDocs} />
        </>
      </div>
    </>
  );
};

export default SfpipelineDocument;
