import React, { useEffect, useState } from "react";
import axios from "axios";
import { BiSearch } from "react-icons/bi";
import { ReactSearchAutocomplete } from "react-search-autocomplete";
import { environment } from "../../environments/environment";
import { Link } from "react-router-dom";
import { IoWarningOutline } from "react-icons/io5";

export default function InvoiceOpen() {
  const [projectId, setProjectId] = useState(-1);
  const baseUrl = environment.baseUrl;
  console.log(projectId);
  const [projectTableData, setProjectTableData] = useState([]);
  const loggedUserId = localStorage.getItem("resId");
  console.log(loggedUserId);
  //------get Project data
  const getProjectTableData = () => {
    axios({
      method: "get",
      url:
        baseUrl +
        `/ProjectMS/stakeholders/getinvoicedata?user_id=${loggedUserId}`,
    })
      .then((res) => {
        setProjectTableData(res.data);
      })
      .then((error) => {
        console.log("success", error);
      });
  };
  console.log(projectTableData);
  console.log(projectTableData);
  //----------get invoice data
  const [invoicedata, setInvoicedata] = useState([]);

  const getInvoicedata = () => {
    axios({
      method: "get",
      url:
        baseUrl +
        `/ProjectMS/stakeholders/getinvoicedata?user_id=${loggedUserId}`,
    })
      .then((res) => {
        setInvoicedata(res.data);
      })
      .then((error) => {
        console.log("success", error);
      });
  };
  console.log(invoicedata);
  // console.log(invoicedata?.unshift("ALL"));
  const [formEditData, setFormEditData] = useState([{}]);
  console.log(formEditData);
  console.log(invoicedata);
  console.log(formEditData.invoice);
  const [autoCompleteValidation, setAutoCompleteValidation] = useState("");
  const [validationmessage, setValidationMessage] = useState(false);

  const handleProjectSelect = (invoiceId) => {
    console.log("inline-------------------------10");
    if (invoiceId == null) {
      setAutoCompleteValidation("1px solid rgb(183 1 1) !important");
      setValidationMessage(true);
      return;
    } else {
      setValidationMessage(false);

      console.log(invoiceId);
      {
        <Link
          title="Search"
          to={`/invoice/create?invoiceId:${formEditData.invoice}`}
          target="_blank"
        ></Link>;
      }
      console.log(formEditData.invoice);
      axios({
        method: "post",
        url: baseUrl + `/ProjectMS/stakeholders/updateUserSearchHistory`,
        data: {
          user_id: loggedUserId,
          invoice_id: invoiceId,
        },
        headers: { "Content-Type": "application/json" },
      }).then((success) => {
        console.log(success);
        console.log(data);
      });
    }
  };
  useEffect(() => {
    getProjectTableData();
    getInvoicedata();
  }, []);
  const handleClear = () => {
    setFormEditData((prevProps) => ({ ...prevProps, id: null }));
  };
  const headers1 = [
    <div style={{ fontSize: "13px" }}>
      <h6>Invoice</h6>
    </div>,
  ];
  const headers2 = [
    <div style={{ fontSize: "13px" }}>
      <h6>Project</h6>
    </div>,
  ];
  const onSearch = (string, items) => {
    console.log(string);
    console.log(items);
    const newItems = [...items];
    console.log(newItems);
    const matches = items.filter((item) =>
      item.name.toLowerCase().includes(string.toLowerCase())
    );
    console.log(matches);
    if (matches.length === 0) {
      console.log("inline===============" + matches);
      newItems.push({ id: -1, name: "ALL", invoiceId: -1 });
      console.log(newItems);
    }
    return newItems;
  };
  return (
    <>
      <div className="pageTitle">
        <div className="childOne">
          <h2></h2>
        </div>
        <div className="childTwo">
          <h2>Invoice Search History</h2>
        </div>
        <div className="childThree"></div>
      </div>
      <div>
        <div></div>
        <div className="col-14" style={{ position: "relative" }}>
          <table
            id="table-fields"
            class="table "
            className="col-12 table table-bordered openTable customerEngament"
            style={{
              border: "1px solid #ddd",
              width: "50%",
              marginTop: "10px",
            }}
          >
            <thead
              style={{ backgroundColor: "#eeeeee" }}
              className="table_Body"
            >
              <tr className="text-center" style={{ fontSize: "15px" }}>
                <th colspan="2">
                  <div className="pageTitle">
                    <div className="childOne">
                      <h2></h2>
                    </div>
                    <div className="childTwo">
                      <h2>Recent Invoice Searches</h2>
                    </div>
                    <div className="childThree"></div>
                  </div>
                </th>
              </tr>
              <tr className="text-center" style={{ width: "51%" }}>
                {headers1.map((header) => (
                  <th key={header}>{header}</th>
                ))}
                {headers2.map((header) => (
                  <th style={{ width: "51%" }} key={header}>
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {invoicedata.map((item, index) => (
                <tr key={item.invoiceId}>
                  {/* <td>{item.id}</td> */}
                  <td>
                    <Link
                      data-toggle="tooltip"
                      title="Go To Invoice"
                      style={{ textDecoration: "none" }}
                      onMouseOver={(e) => {
                        e.target.style.textDecoration = "underline";
                        e.target.style.color = "none";
                        e.target.style.cursor = "pointer";
                      }}
                      onMouseOut={(e) => {
                        e.target.style.textDecoration = "none";
                        e.target.style.color = "none";
                      }}
                      target="_blank"
                      // onClick={(e) => { handleProjectSelect(e)}}
                      onClick={() => {
                        handleProjectSelect(item.invoiceId);
                      }}
                      to={`/invoice/create/?invoiceId=${item.invoiceId}`}
                    >
                      {" "}
                      {item.name}
                    </Link>
                  </td>
                  {/* <td>{projectTableData[index].id}</td> */}
                  <td>
                    {" "}
                    <Link
                      data-toggle="tooltip"
                      style={{ textDecoration: "none" }}
                      onMouseOver={(e) => {
                        e.target.style.textDecoration = "underline";
                        e.target.style.color = "none";
                        e.target.style.cursor = "pointer";
                      }}
                      onMouseOut={(e) => {
                        e.target.style.textDecoration = "none";
                        e.target.style.color = "none";
                      }}
                      title="Go To Project Overview"
                      to={`/project/Overview/:${projectTableData[index]?.projectId}`}
                      target="_blank"
                    >
                      {projectTableData[index]?.project_name}
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div>
            <div className="col-md-6">
              {validationmessage ? (
                <div className="statusMsg error " style={{ display: "block" }}>
                  <span>
                    <IoWarningOutline />
                    &nbsp;{`Please select any Invoice`}
                  </span>
                </div>
              ) : (
                ""
              )}
            </div>
            {/* {validationmessage ? (
              <div className="statusMsg error col-12 mb-2"
              style={{ display: "block", width: "645px" }}
              >
                <span>
                  <IoWarningOutline />
                  &nbsp;{`Please select any Invoice`}
                </span>
              </div>
            ) : (
              ""
            )} */}
          <div className="row ">
            <div className="col-1 ">
              <h6>
                Invoice <span style={{ color: "red" }}>*</span>
                &nbsp;&nbsp;&nbsp;&nbsp;:
              </h6>
            </div>
            <div className="col-4 autoComplete-container" id="autoComplete">
              <ReactSearchAutocomplete
                items={invoicedata}
                type="Text"
                name="invoice"
                id="invoice"
                invoicedata={invoicedata}
                className="AutoComplete"
                onSelect={(e) => {
                  setFormEditData((prevProps) => ({
                    ...prevProps,
                    invoice: e.id,
                  }));
                  console.log(e.id);
                }}
                showIcon={false}
                onClear={handleClear}
                onSearch={onSearch}
                placeholder="type minimum 4 character"
              />{" "}
            </div>
            <div className="err col-2">
              {formEditData.invoice == undefined ? (
                <button
                  title="Search"
                  className="btn btn-primary"
                  onClick={() => {
                    handleProjectSelect();
                  }}
                >
                  <BiSearch /> Search
                </button>
              ) : (
                <Link
                  title="Search"
                  className="no-underline"
                  to={`/invoice/create?invoiceId:${formEditData.invoice}`}
                  target="_blank"
                >
                  <button
                    title="Search"
                    className="btn btn-primary "
                    onClick={() => {
                      handleProjectSelect();
                    }}
                  >
                    <BiSearch /> Search
                  </button>
                </Link>
              )}
            </div>
          </div>
      </div>
      </div>
    </>
  );
}
