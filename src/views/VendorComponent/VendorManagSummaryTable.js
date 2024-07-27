import React, { useEffect, useState } from "react";
import Resources from "./Resources";
import ResourceEditable from "./ResourceEditable";
import axios from "axios";
import { environment } from "../../environments/environment";
import Loader from "../Loader/Loader";
import { Refresh } from "@mui/icons-material";
import { useLocation } from "react-router-dom";

function VendorManagSummaryTable(props) {
  const {
    summaryDataNw,
    formData,
    setFormData,
    formattedFromDate,
    toDateFromDate,
    flags,
    setRefresh,
    refresh,
    validationM,
    alldepartments,
    allcountries,
    allcsls,
    allDPs,
    allVendors,
    allCustomers,
    abortController,
    setValidation,
    setLoader,
    loader,
    checked,
    setChecked,
    buttonState,
    maxHeight1,
    fileName,
  } = props;

  const [data, setData] = useState([]);
  const [displayTable, setDisplayTable] = useState(null);
  const [displayHeader, setDisplayHeaders] = useState(null);
  const [open, setOpen] = useState(false);
  const [headerData, setHeaderData] = useState([]);
  const [bodyData, setBodyData] = useState([]);
  const [searchapidata, setSearchApiData] = useState([]);
  const [tableTitle, srtTableTitle] = useState();
  const [colorFilter, setColorFilter] = useState([]);
  const [contractIds, setContractIds] = useState([{}]);
  const [value, setValue] = useState(false);
  const [summaryData, setSummaryData] = useState(summaryDataNw);
  const [openNw, setOpenNw] = useState(false);
  const location = useLocation();
  const currentURL = location.pathname.toString();

  const searchHandle = () => {
    console.log(formData);
    {
      currentURL.includes("/vmg/vmg")
        ? axios({
            method: "post",
            url:
              baseUrl + `/VendorMS/management/getVendManagementResourceDtlsNew`,
            // url: `http://localhost:8090/VendorMS/management/getVendManagementResourceDtlsNew`,
            signal: abortController.current.signal,
            data: {
              resource_id: -1,
              buIds:
                formData.viewType === "BU"
                  ? formData.buIds === alldepartments
                    ? "-1"
                    : formData.buIds
                  : "-1",
              country: formData?.country,
              fromDate: formattedFromDate,
              toDate: toDateFromDate,
              isExport: 0,
              vendorId:
                formData.viewType === "Vendor"
                  ? formData.vendorIds === allVendors
                    ? -1
                    : formData.vendorIds
                  : -1,
              page: "vmg",
              custId:
                formData.viewType === "Customer"
                  ? formData.customerIds === allCustomers
                    ? "0"
                    : formData.customerIds
                  : "0",
              projId: "0",
              buId: "0",
              cslId:
                formData.viewType === "CSL"
                  ? formData.cslIds === allcsls
                    ? "-1"
                    : formData.cslIds
                  : "-1",
              dpId:
                formData.viewType === "DP"
                  ? formData.dpIds === allDPs
                    ? "-1"
                    : formData.dpIds
                  : "-1",
              vendorStatus: formData.vendorStatus,
            },
            headers: { "Content-Type": "application/json" },
          }).then((response) => {
            var resp = response.data;
            setSummaryData(resp);
          })
        : axios({
            method: "post",
            // url: `http://localhost:8090/VendorMS/management/getVendManagementSummary`,
            url: baseUrl + `/VendorMS/management/getVendManagementSummary`,
            data: {
              viewtype: formData.viewType,
              buIds:
                formData.viewType === "BU"
                  ? alldepartments
                  : formData.viewType === "CSL"
                  ? allcsls
                  : allDPs,
              country: allcountries,
              fromDate: formattedFromDate,
              toDate: toDateFromDate,
              isExport: 0,
              vendorStatus: formData.vendorStatus,
            },

            headers: { "Content-Type": "application/json" },
          }).then((response) => {
            const unclassifiedObject = {
              name: "Unclassified",
              lvl: "1", // Assuming lvl is a string, adjust accordingly if it's a number
              total_hc: String(
                Number(response.data[1].total_hc) -
                  (Number(response.data[2].total_hc) +
                    Number(response.data[3].total_hc))
              ),
              awaiting_conv: String(
                Number(response.data[1].awaiting_conv) -
                  (Number(response.data[2].awaiting_conv) +
                    Number(response.data[3].awaiting_conv))
              ),
              contract: String(
                Number(response.data[1].contract) -
                  (Number(response.data[2].contract) +
                    Number(response.data[3].contract))
              ),
              contract_hire: String(
                Number(response.data[1].contract_hire) -
                  (Number(response.data[2].contract_hire) +
                    Number(response.data[3].contract_hire))
              ),
              conv_in_prog: String(
                Number(response.data[1].conv_in_prog) -
                  (Number(response.data[2].conv_in_prog) +
                    Number(response.data[3].conv_in_prog))
              ),
              fixed_bid: String(
                Number(response.data[1].fixed_bid) -
                  (Number(response.data[2].fixed_bid) +
                    Number(response.data[3].fixed_bid))
              ),
              freelancer: String(
                Number(response.data[1].freelancer) -
                  (Number(response.data[2].freelancer) +
                    Number(response.data[3].freelancer))
              ),
              id: 0,
              offered: String(
                Number(response.data[1].offered) -
                  (Number(response.data[2].offered) +
                    Number(response.data[3].offered))
              ),
              on_exit_path: String(
                Number(response.data[1].on_exit_path) -
                  (Number(response.data[2].on_exit_path) +
                    Number(response.data[3].on_exit_path))
              ),
            };

            // Add the "Unclassified" object to the array
            response.data.push(unclassifiedObject);
            setSummaryData(response.data);
            //displayTableFnc();
          });
    }
  };

  const baseUrl = environment.baseUrl;
  let flag = 1;

  let tabHeaders = [
    "name",
    "total_hc",
    "contract",
    "contract_hire",
    "freelancer",
    "fixed_bid",
    "offered",
    "on_exit_path",
    "conv_in_prog",
    "awaiting_conv",
  ];

  useEffect(() => {
    displayTableFnc();
  }, [summaryData]);

  const getresourcedtls = (skillType) => {
    abortController.current = new AbortController();
    axios({
      method: "post",
      url: baseUrl + `/VendorMS/management/getVendManagementResourceDtls`,
      // url: `http://localhost:8093/VendorMS/management/getVendManagementResourceDtls`,
      signal: abortController.current.signal,
      data: {
        buIds: formData?.buIds,
        country: formData?.country,
        fromDate: formattedFromDate,
        toDate: toDateFromDate,
        lkKey: skillType.a,
        skillId: skillType.b,
        isExport: 0,
        vendorId: -1,
        page: "vmg",
        custId: "0",
        projId: "0",
        buId: "0",
      },

      headers: { "Content-Type": "application/json" },
    }).then((response) => {
      var response = response.data;
      let hData = [];
      let bData = [];
      for (let index = 0; index < response.length; index++) {
        if (index == 0) {
          hData.push(response[index]);
        } else {
          bData.push(response[index]);
        }
      }
      /*setTimeout(() => {
        setRefresh(false);
        setOpen(true);
      }, 1000);*/
      setHeaderData(hData);
      setBodyData(bData);
      setData(response);
      setSearchApiData(bData);
      setOpenNw(true);
      //color sorting

      let firstColor,
        secondColor,
        thirdColor = "",
        count = 0;
      firstColor = bData[0].alloc_contract_date_icon?.split("~")[0];
      secondColor = "";
      for (let index = 0; index < bData.length; index++) {
        let colorFind = bData[index].alloc_contract_date_icon?.split("~")[0];
        if (firstColor != colorFind && count == 0) {
          secondColor = colorFind;
          count++;
        } else if (firstColor != colorFind && secondColor != colorFind) {
          thirdColor = colorFind;
          break;
        }
      }
      const colorFilter = [firstColor, secondColor, thirdColor];
      setColorFilter(colorFilter);
      setLoader(false);
    });
  };
  useEffect(() => {
    setOpen(true);
    setRefresh(false);
  }, [data]);

  useEffect(() => {
    getContractId();
    // setLoader(true);
    setTimeout(() => {
      setLoader(false);
    }, 1000);
  }, [checked]);

  useEffect(() => {
    if (currentURL.includes("/vmg/vmg")) {
      console.log(summaryData);
      let hData = [];
      let bData = [];
      for (let index = 0; index < summaryData.length; index++) {
        if (index == 0) {
          hData.push(summaryData[index]);
        } else {
          bData.push(summaryData[index]);
        }
      }
      /*setTimeout(() => {
        setRefresh(false);
        setOpen(true);
      }, 1000);*/
      setHeaderData(hData);
      setBodyData(bData);
      setData(summaryData);
      setSearchApiData(bData);
      setOpenNw(true);
      //color sorting

      let firstColor,
        secondColor,
        thirdColor = "",
        count = 0;
      firstColor = bData[0]?.alloc_contract_date_icon?.split("~")[0];
      secondColor = "";
      for (let index = 0; index < bData.length; index++) {
        let colorFind = bData[index].alloc_contract_date_icon?.split("~")[0];
        if (firstColor != colorFind && count == 0) {
          secondColor = colorFind;
          count++;
        } else if (firstColor != colorFind && secondColor != colorFind) {
          thirdColor = colorFind;
          break;
        }
      }
      console.log(firstColor);
      console.log(secondColor);
      console.log(thirdColor);
      const colorFilter = [firstColor, secondColor, thirdColor];
      setColorFilter(colorFilter);
      setLoader(false);
    }
  }, [summaryData, summaryDataNw]);

  const getContractId = () => {
    axios
      .get(baseUrl + `/VendorMS/management/getContractTypes`)

      .then((Response) => {
        let data = Response.data;
        setContractIds(data);
        setLoader(false);
      })
      .catch((error) => console.log(error));
  };

  const onclickHandler = (a, b) => {
    setValidation("");
    setOpenNw(false);
    setRefresh(false);
    // a --- contract type
    // b --- skill type

    const temp = {};
    temp["a"] = a;
    temp["b"] = b;
    setTimeout(() => {
      setLoader(true);
      // Use another setTimeout to fetch data after 2 seconds
      setTimeout(() => {
        getresourcedtls(temp);
        getContractId();
        srtTableTitle(a);
        // setLoader(false); // Hide the loader when data is loaded
      }, 1000); // 2-second delay for data fetching
    }, 1000);
    // getresourcedtls(temp);

    // setLoader(true);
  };

  const displayTableFnc = () => {
    setDisplayHeaders(() => {
      return summaryData.map((element, index) => {
        let tabHeader = [];
        tabHeaders.forEach((inEle, inInd) => {
          if (index === 0) {
            let value = ("" + element[inEle]).includes("^&1")
              ? element[inEle].replaceAll("^&1", " ")
              : element[inEle];
            tabHeader.push(
              <th
                key={inInd}
                style={{
                  textAlign: "center",
                }}
                title={element[inEle]}
              >
                {value == "awaiting Conv - DP/CL"
                  ? "Awaiting Conv - DP/CL"
                  : value}
              </th>
            );
          }
        });
        return <tr key={index}>{tabHeader}</tr>;
      });
    });
    setDisplayTable(() => {
      return summaryData.slice(1).map((element, index) => {
        let tabData = [];
        tabHeaders.forEach((inEle, inInd) => {
          if (index === 0) {
            tabData.push(
              <td align={inInd > 0 ? "right" : "left"}>
                <b>
                  <span
                    style={{
                      cursor: inInd > 0 && element[inEle] != 0 ? "pointer" : "",
                      color: inInd != 0 && element[inEle] != 0 ? "#2e88c5" : "",
                    }}
                    onClick={() => {
                      inInd > 0 && element[inEle] != 0
                        ? onclickHandler(inEle, element.id)
                        : "";
                    }}
                    className="summary"
                    title={element[inEle]}
                  >
                    {element[inEle]}
                  </span>
                </b>
              </td>
            );
          } else {
            tabData.push(
              <td align={inInd > 0 ? "right" : "left"}>
                <span
                  style={{
                    cursor: inInd > 0 && element[inEle] != 0 ? "pointer" : "",
                    color: inInd != 0 && element[inEle] != 0 ? "#2e88c5" : "",
                  }}
                  onClick={() => {
                    inInd > 0 && element[inEle] != 0
                      ? onclickHandler(inEle, element.id)
                      : "";
                  }}
                  title={element[inEle]}
                >
                  {element[inEle]}
                </span>
              </td>
            );
          }
          // }
        });
        return (
          <tr
            style={{
              backgroundColor:
                index === 1
                  ? "#f5d5a7 "
                  : index === 0
                  ? "#f4f4f4"
                  : "#d8eaeac4",
            }}
            key={index}
          >
            {tabData}
          </tr>
        );
      });
    });
  };

  const validationMsg = (v) => {
    validationM(v);
  };
  return (
    <div className="mt-3 darkHeader total-headcount-table-as-view">
      {buttonState === "Performance" ? (
        <table className="table table-bordered table-striped htmlTable ">
          <thead>{displayHeader}</thead>
          <tbody>{displayTable}</tbody>
        </table>
      ) : (
        ""
      )}
      <div>
        {open === true && openNw == true && formData?.viewBy == "view" ? (
          // && loader == false
          <Resources
            maxHeight1={maxHeight1}
            fileName={fileName}
            setRefresh={setRefresh}
            refresh={Refresh}
            tableTitle={tableTitle}
            flag={flag}
            flags={flags}
            headerData={headerData}
            bodyDataa={bodyData}
            setBodyData={setBodyData}
            colorFilterR={colorFilter}
            setFormData={setFormData}
            checked={checked}
            setChecked={setChecked}
          />
        ) : (
          ""
        )}

        {open === true && openNw == true && formData?.viewBy == "Edit" ? (
          <ResourceEditable
            maxHeight1={maxHeight1}
            fileName={fileName}
            loader={loader}
            setLoader={setLoader}
            setRefresh={setRefresh}
            refresh={Refresh}
            tableTitle={tableTitle}
            flag={flag}
            headerData={headerData}
            bodyDataa={bodyData}
            setBodyData={setBodyData}
            colorFilter={colorFilter}
            summaryData={summaryData}
            validationMsg={validationMsg}
            contractIds={contractIds}
            searchHandle={searchHandle}
            setFormData={setFormData}
            checked={checked}
            setChecked={setChecked}
          />
        ) : (
          ""
        )}
      </div>
    </div>
  );
}

export default VendorManagSummaryTable;
