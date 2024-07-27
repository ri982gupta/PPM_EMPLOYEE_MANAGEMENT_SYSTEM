import React from "react";
import { useState } from "react";
import Loader from "../Loader/Loader";
import axios from "axios";
import { environment } from "../../environments/environment";
import { useRef } from "react";
import { useEffect } from "react";
import DownloadForOfflineRoundedIcon from "@mui/icons-material/DownloadForOfflineRounded";
const SfDocuments = (props) => {
  const { type } = props;
  const [sfDocs, setSfDocs] = useState([]);
  const [open, setOpen] = useState(false);
  const baseUrl = environment.baseUrl;
  const abortController = useRef(null);
  const [docDisplay, setDocDisplay] = useState(false);
  const getSfDocuments = () => {
    abortController.current = new AbortController();
    const loaderTime = setTimeout(() => {
      setOpen(true);
    }, 2000);

    axios({
      method: "post",
      url: baseUrl + `/SalesMS/sales/getSFOppDocs`,
      data: {
        oppId: type,
      },
    }).then((resp) => {
      const data = resp.data;
      console.log(data, "data");
      setSfDocs(data.data);
      setDocDisplay(true);
      setOpen(false);
      clearTimeout(loaderTime);

      window.scrollTo({ top: 1500, behavior: "smooth" });
    });
  };

  useEffect(() => {
    getSfDocuments();
  }, [type]);

  const handleAbort = () => {
    abortController.current && abortController.current.abort();
    setOpen(false);
  };

  const handleDownload = async (doc) => {
    const loaderTime = setTimeout(() => {
      setOpen(true);
    }, 2000);

    try {
      const response = await axios.get(`${baseUrl}/SalesMS/sales/downloadDoc`, {
        params: { docId: doc.docId, type: doc.type },
        responseType: "blob",
      });

      clearTimeout(loaderTime);
      setOpen(false);

      if (response.status === 200) {
        const fileName = doc.name + "." + doc.extension;
        const blob = new Blob([response.data]);
        const link = document.createElement("a");
        link.download = fileName;
        link.href = window.URL.createObjectURL(blob);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } catch (error) {
      clearTimeout(loaderTime);
      setOpen(false);
      console.error("Error downloading the file:", error);
    }
  };

  const SfDocsTable = ({ sfDocs }) => {
    return (
      <div className="darkHeader">
        <table
          className="table table-bordered table-striped attainTable "
          style={{ width: "50%" }}
        >
          <thead>
            <tr className="fs10">
              <th className="">Document Name</th>
              <th style={{ textAlign: "center" }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {sfDocs?.data && sfDocs.data.length > 0 ? (
              sfDocs.data.map((doc) => (
                <tr key={doc.docId}>
                  <td>{doc.name}</td>
                  <td style={{ textAlign: "center" }}>
                    {doc.type == "DocLInk" && (
                      <div title="Download Document">
                        <DownloadForOfflineRoundedIcon
                          style={{ color: "#6c9842", cursor: "pointer" }}
                          onClick={() => handleDownload(doc)}
                        />
                      </div>
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
      <div className="col-lg-12 col-md-12 col-sm-12 mt10 no-padding">
        {open ? <Loader handleAbort={handleAbort} /> : ""}
        <>
          {docDisplay && (
            <div>
              <SfDocsTable sfDocs={sfDocs} />
            </div>
          )}
        </>
      </div>
    </>
  );
};

export default SfDocuments;
