import React from "react";
import axios from "axios";
import { useEffect, useState, Fragment, useRef } from "react";
import { environment } from "../../environments/environment";
import Loader from "../Loader/Loader";
import DownloadForOfflineRoundedIcon from "@mui/icons-material/DownloadForOfflineRounded";

export default function DocumentTable(props) {
  const { docId, sfDocs } = props;
  const [open, setOpen] = useState(false);
  const baseUrl = environment.baseUrl;
  const abortController = useRef(null);

  const handleAbort = () => {
    abortController.current && abortController.current.abort();
    setOpen(false);
  };

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
                  {doc.type == "DocLInk" ? (
                    <a
                      href={
                        baseUrl +
                        `/SalesMS/sales/downloadDoc?docId=${doc.docId}&type=${doc.docType}`
                      }
                    >
                      <div title="Download Document">
                        <DownloadForOfflineRoundedIcon
                          style={{ color: "#6c9842" }}
                        />
                      </div>
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
}
