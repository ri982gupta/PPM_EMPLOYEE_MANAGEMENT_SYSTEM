import React, { useEffect, useState } from "react";

import { ReactSearchAutocomplete } from "react-search-autocomplete";
import moment from "moment";
import Popover from "@mui/material/Popover";
import { FaTimes } from "react-icons/fa";
import { BiTrash, BiPlus } from "react-icons/bi";
import { CModal, CModalBody, CModalHeader, CModalTitle } from "@coreui/react";
import { IoWarningOutline } from "react-icons/io5";
import "./ExpensesTypePopUp.scss";
import axios from "axios";
import { environment } from "../../../environments/environment";

function ExpensesTypePopUp({
  expensesTypePopup,
  setExpensesTypePopup,
  expenseTypeId,
  currencyOptionsData,
  country,
  cities,
  carTypes,
  paidBy,
  airportList,
  mobileType,
  expDate,
  expenseData,
  setExpenseData,
  expInfo,
  projectId,
  expName,
  setFileMap,
  fileMap,
  files,
  setFiles,
  isExpenseBillable,
  setExpCurrencySymbol,
  expCurrencySymbol,
  id,
  currencyCode,
  expenseId,
  documents,
  setDocuments,
  setExpCurrency,
}) {
  const baseUrl = environment.baseUrl;
  const expenseDataObject = (expenseTypeId) => {
    switch (expenseTypeId) {
      case 620:
        return {
          noOfNights: 0,
          subLocation: "",
          restOfWorld: "",
          prjId: projectId,
          name: expName,
          expAmt: 0.0,
        };
      case 766:
        return {
          mobileType: mobileType[0]?.id,
          prjId: projectId,
          name: expName,
          expAmt: 0.0,
        };
      case 616:
        return {
          peopleAttnd: 0,
          guestAttnd: 0,
          empAttnd: 0,
          prjId: projectId,
          name: expName,
          expAmt: 0.0,
        };
      case 615:
        return {
          noOfMiles: 0,
          rate: 0,
          rental: 0,
          charge: 0,
          fuelAmount: 0,
          carType: carTypes[0]?.id,
          tollCharge: 0,
          parking: 0,
          prjId: projectId,
          name: expName,
          expAmt: 0.0,
        };
      case 621:
        return {
          origin: "",
          destination: "",
          ticketFare: 0,
          addCharges: 0,
          prjId: projectId,
          name: expName,
          expAmt: 0.0,
          travelType: "777",
          tripType: "779",
        };
      default:
        return {
          date: moment(expDate).format("YYYY-MM-DD"),
          expTypId: expenseTypeId,
          paidBy: paidBy[0]?.id,
          currency: currencyOptionsData.find(
            (it) => it.currencyCode == currencyCode
          ).id,
          location: "3",
          description: "",
          prjId: projectId,
          name: expName,
          expAmt: 0.0,
        };
    }
  };

  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (
      !expInfo.some((it) => it.expTypId == expenseTypeId && it.date == expDate)
    ) {
      const obj = expenseDataObject(expenseTypeId);
      setExpenseData(obj);
    }
  }, []);

  const handleOnChange = (e) => {
    const { name, value } = e.target;

    setExpenseData((prev) => ({
      ...prev,
      date: moment(expDate).format("YYYY-MM-DD"),
      expTypId: expenseTypeId,
      description: "",
      [name]: value,
      prjId: projectId,
      name: expName,
    }));
    if (name === "expAmt") {
      const numericValue = parseFloat(value.replace(/,/g, ""));
      setExpenseData((prev) => ({
        ...prev,
        expAmt: isNaN(numericValue) ? "" : numericValue,
      }));
    }
    if (name == "isBillable") {
      setExpenseData((prev) => ({
        ...prev,
        isBillable: value == "on",
      }));
    }
    if (expenseTypeId.startsWith("621")) {
      setExpenseData((prev) => ({
        ...prev,
        expAmt:
          parseFloat(prev.ticketFare || 0.0) +
          parseFloat(prev.addCharges || 0.0),
        stops: stopsValue,
      }));
      if (
        expenseData?.origin !== undefined &&
        expenseData?.destination !== undefined &&
        expenseData.origin === expenseData.destination
      ) {
        setErrorMsg("Origin and destination cannot be the same.");
      } else {
        setErrorMsg("");
      }
    }
    if (
      (name === "noOfMiles" ||
        name === "rate" ||
        name === "tollCharge" ||
        name === "parking") &&
      expenseTypeId.startsWith("615")
    ) {
      const noOfMiles = name === "noOfMiles" ? value : expenseData.noOfMiles;
      const rate = name === "rate" ? value : expenseData.rate;
      const calculatedFuelAmount = noOfMiles * rate;

      const tollCharge = parseFloat(expenseData.tollCharge || 0);
      const parking = parseFloat(expenseData.parking || 0);

      const netAmount = calculatedFuelAmount + tollCharge + parking;

      setExpenseData((prev) => ({
        ...prev,
        fuelAmount: calculatedFuelAmount.toFixed(2),
        expAmt: netAmount.toFixed(2),
      }));
    }
  };

  const handleFileChange = (event) => {
    const newFiles = Array.from(event.target.files);
    setFiles((prev) => [...prev, ...newFiles]);

    const newFileMap = { ...fileMap };
    for (let i = 0; i < newFiles.length; i++) {
      const file = newFiles[i];
      const key = `${projectId}_${expenseTypeId}_${moment(expDate).format(
        "YYYY-MM-DD"
      )}`;
      if (!newFileMap[key]) {
        newFileMap[key] = [];
      }
      newFileMap[key].push(file.name);
    }

    setFileMap(newFileMap);
  };

  const [fileDelPopup, setFileDelPopup] = useState(false);
  const [deleteFileName, setDeleteFileName] = useState(null);

  const handleFileRemove = (fileName) => {
    setFileDelPopup(true);
    setDeleteFileName(fileName);
  };

  const deleteFile = () => {
    const newFileMap = { ...fileMap };
    for (const key in newFileMap) {
      const index = newFileMap[key].indexOf(deleteFileName);
      if (index !== -1) {
        newFileMap[key].splice(index, 1);
        setFileMap(newFileMap);
        break; // Assuming each file is unique across keys
      }
    }

    const newFiles = files.filter((file) => file.name !== deleteFileName);
    setFiles(newFiles);
  };

  const [deleteDocId, setDeleteDocId] = useState();

  const deleteDocumentConfirm = (docId) => {
    setDeleteDocId(docId);
    setFileDelPopup(true);
  };

  const deleteDocument = () => {
    axios
      .post(
        baseUrl +
          `/timeandexpensesms/projectExpense/deleteFile?documentId=${deleteDocId}`
      )
      .then((res) => {
        console.log(res.data);
        const docs = documents
          .flatMap((it) => it)
          .filter((i) => i.expense_id !== expenseId);
        setDocuments(docs);
      })
      .catch((error) => console.log(error));
  };

  const downloadFile = async (document_id, svn_revision, file_name) => {
    try {
      const response = await axios.get(
        baseUrl +
          `/CommonMS/document/downloadFile?documentId=${document_id}&svnRevision=${svn_revision}`,
        {
          responseType: "blob",
        }
      );

      const blob = new Blob([response.data], {
        type: response.headers["content-type"],
      });
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = file_name;

      document.body.appendChild(link);
      link.click();

      window.URL.revokeObjectURL(url);
      document.body.removeChild(link);
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };

  useEffect(() => {
    if (id === undefined) {
      setExpCurrencySymbol(() => {
        let container = document.createElement("div");
        container.innerHTML = currencyOptionsData.find(
          (item) =>
            item.id ==
            (expenseData.currency == undefined
              ? currencyOptionsData.find(
                  (it) => it.currencyCode == currencyCode
                ).id
              : expenseData.currency)
        )?.currencyCode;
        return container.innerHTML;
      });
    }
  }, [expenseData]);

  const [stops, setStops] = useState([{ id: 1, value: "", isFirst: true }]);

  const handleAddStop = () => {
    const newId = stops.length + 1;
    const newStop = { id: newId, value: "", isFirst: false };
    setStops([...stops, newStop]);
  };

  const handleDeleteStop = (id) => {
    const updatedStops = stops.filter((stop) => stop.id !== id);
    setStops(updatedStops);
  };

  const [stopsValue, setStopsValue] = useState("");

  useEffect(() => {
    const stopsValueString = stops.map((item) => item.value).join(",");
    setStopsValue(stopsValueString);
  }, [stops]);

  const handleStopChange = (id, newValue) => {
    const updatedStops = [...stops];
    updatedStops?.map((stop) => {
      if (stop.id == id) stop.value = newValue;
      return stop;
    });
    setStops(updatedStops);
  };

  const inputFields = () => {
    let excludedValues = [615, 621];
    return (
      <div className="col-12 row">
        <div className="col-4 mb-2">
          <label>Paid By</label>
          <select name="paidBy" onChange={handleOnChange}>
            {paidBy.map((item) => (
              <option key={item.id} value={item.id}>
                {item.lkup_name}
              </option>
            ))}
          </select>
        </div>
        {!expenseTypeId.includes("621") && (
          <div className="col-4 mb-2">
            <label>Country</label>
            <select name="location" onChange={handleOnChange}>
              {country.map((d) => (
                <option value={d.id} selected={d.id == 3}>
                  {d.country_name}
                </option>
              ))}
              <option value="others">Others</option>
            </select>
          </div>
        )}
        <div className="col-4 mb-2">
          <label>Currency</label>

          <select
            name="currency"
            onChange={(e) => {
              handleOnChange(e);
              setExpCurrency(e.target.value);
            }}
          >
            {currencyOptionsData.map((d) => (
              <option value={d.id} selected={d.id == expenseData.currency}>
                {d.currency}
              </option>
            ))}
          </select>
        </div>
        {expenseTypeId.includes("620") && (
          <>
            <div className="col-4 mb-2">
              <label>No. of nights</label>

              <input
                type="text"
                name="noOfNights"
                onChange={handleOnChange}
                defaultValue={
                  expInfo?.find(
                    (item) =>
                      item.expTypId == expenseTypeId &&
                      item.date == moment(expDate).format("YYYY-MM-DD")
                  )?.noOfNights
                }
                onKeyDown={(e) => {
                  const key = e.key;
                  const isNumber = /^[0-9]$/.test(key);
                  const isDecimal = key === ".";
                  const isAllowedKey = [
                    "Backspace",
                    "Delete",
                    "ArrowLeft",
                    "ArrowRight",
                  ].includes(key);

                  if (!isNumber && !isDecimal && !isAllowedKey) {
                    e.preventDefault();
                  }
                }}
              />
            </div>
            <div className="col-4 mb-2">
              <label>City</label>
              <div className="autoComplete-container">
                {" "}
                <ReactSearchAutocomplete
                  name="subLocation"
                  id="city"
                  placeholder="search city"
                  className="AutoComplete "
                  type="Text"
                  items={cities}
                  showIcon={false}
                  onSelect={(e) =>
                    setExpenseData((prev) => ({
                      ...prev,
                      subLocation: e.value,
                    }))
                  }
                />
              </div>
            </div>
            <div className="col-4 mb-2">
              <label>Other City</label>

              <input
                type="text"
                name="restOfWorld"
                onChange={handleOnChange}
                defaultValue={
                  expInfo?.find(
                    (item) =>
                      item.expTypId == expenseTypeId &&
                      item.date == moment(expDate).format("YYYY-MM-DD")
                  )?.restOfWorld
                }
              />
            </div>
          </>
        )}
        {expenseTypeId.includes("616") && (
          <>
            <div className="col-4 mb-2">
              <label>No. of Guests Attended</label>

              <input
                type="text"
                name="guestAttnd"
                onChange={handleOnChange}
                defaultValue={
                  expInfo?.find(
                    (item) =>
                      item.expTypId == expenseTypeId &&
                      item.date == moment(expDate).format("YYYY-MM-DD")
                  )?.guestAttnd
                }
                onKeyDown={(e) => {
                  const key = e.key;
                  const isNumber = /^[0-9]$/.test(key);
                  const isDecimal = key === ".";
                  const isAllowedKey = [
                    "Backspace",
                    "Delete",
                    "ArrowLeft",
                    "ArrowRight",
                  ].includes(key);

                  if (!isNumber && !isDecimal && !isAllowedKey) {
                    e.preventDefault();
                  }
                }}
              />
            </div>
            <div className="col-4 mb-2">
              <label>No. of Prolifics Employees</label>

              <input
                type="text"
                name="empAttnd"
                onChange={handleOnChange}
                defaultValue={
                  expInfo?.find(
                    (item) =>
                      item.expTypId == expenseTypeId &&
                      item.date == moment(expDate).format("YYYY-MM-DD")
                  )?.empAttnd
                }
                onKeyDown={(e) => {
                  const key = e.key;
                  const isNumber = /^[0-9]$/.test(key);
                  const isDecimal = key === ".";
                  const isAllowedKey = [
                    "Backspace",
                    "Delete",
                    "ArrowLeft",
                    "ArrowRight",
                  ].includes(key);

                  if (!isNumber && !isDecimal && !isAllowedKey) {
                    e.preventDefault();
                  }
                }}
              />
            </div>
            <div className="col-4 mb-2">
              <label>Total People Attended</label>

              <input
                type="text"
                name="peopleAttnd"
                readOnly
                value={
                  parseInt(expenseData.guestAttnd || 0) +
                  parseInt(expenseData.empAttnd || 0)
                }
                defaultValue={
                  expInfo?.find(
                    (item) =>
                      item.expTypId == expenseTypeId &&
                      item.date == moment(expDate).format("YYYY-MM-DD")
                  )?.peopleAttnd
                }
              />
            </div>
          </>
        )}
        {expenseTypeId.includes("766") && (
          <div className="col-4 mb-2">
            <label>Type</label>

            <select name="mobileType" onChange={handleOnChange}>
              {mobileType.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.lkup_name}
                </option>
              ))}
            </select>
          </div>
        )}
        {expenseTypeId.includes("621") && (
          <>
            <div className="col-4 mb-2">
              <label>Origin</label>

              <div className="autoComplete-container">
                {" "}
                <ReactSearchAutocomplete
                  name="origin"
                  id="city"
                  placeholder="search city"
                  className="AutoComplete "
                  type="Text"
                  items={airportList}
                  showIcon={false}
                  showClear={false}
                  onSelect={(e) =>
                    setExpenseData((prev) => ({ ...prev, origin: e.value }))
                  }
                  styling={{
                    backgroundColor: errorMsg !== "" ? "#F2DEDE" : "",
                  }}
                />
              </div>
            </div>
            <div className="col-4 mb-2">
              <label>Destination</label>

              <div className="autoComplete-container">
                {" "}
                <ReactSearchAutocomplete
                  name="destination"
                  id="city"
                  placeholder="search city"
                  className="AutoComplete "
                  type="Text"
                  items={airportList}
                  showIcon={false}
                  showClear={false}
                  onSelect={(e) => {
                    setExpenseData((prev) => ({
                      ...prev,
                      destination: e.value,
                    }));
                  }}
                  styling={{
                    backgroundColor: errorMsg !== "" ? "#F2DEDE" : "",
                  }}
                />
              </div>
            </div>
            <div className="col-4 mb-2">
              <label>Ticket Fare</label>

              <input
                type="text"
                name="ticketFare"
                onChange={handleOnChange}
                defaultValue={
                  expInfo?.find(
                    (item) =>
                      item.expTypId == expenseTypeId &&
                      item.date == moment(expDate).format("YYYY-MM-DD")
                  )?.ticketFare
                }
                onKeyDown={(e) => {
                  const key = e.key;
                  const isNumber = /^[0-9]$/.test(key);
                  const isDecimal = key === ".";
                  const isAllowedKey = [
                    "Backspace",
                    "Delete",
                    "ArrowLeft",
                    "ArrowRight",
                  ].includes(key);

                  if (!isNumber && !isDecimal && !isAllowedKey) {
                    e.preventDefault();
                  }
                }}
              />
            </div>
            <div className="col-4 mb-2">
              <label>Additional Charges</label>

              <input
                type="text"
                name="addCharges"
                onChange={handleOnChange}
                defaultValue={
                  expInfo?.find(
                    (item) =>
                      item.expTypId == expenseTypeId &&
                      item.date == moment(expDate).format("YYYY-MM-DD")
                  )?.addCharges
                }
                onKeyDown={(e) => {
                  const key = e.key;
                  const isNumber = /^[0-9]$/.test(key);
                  const isDecimal = key === ".";
                  const isAllowedKey = [
                    "Backspace",
                    "Delete",
                    "ArrowLeft",
                    "ArrowRight",
                  ].includes(key);

                  if (!isNumber && !isDecimal && !isAllowedKey) {
                    e.preventDefault();
                  }
                }}
              />
            </div>
            <div className="col-4 mb-2">
              <label>Travel Type</label>
              <span className="radioContainer">
                <input
                  type="radio"
                  name="travelType"
                  onChange={handleOnChange}
                  value="777"
                  defaultChecked
                />
                <label>Domestic</label>
              </span>
              <span className="radioContainer">
                <input
                  type="radio"
                  name="travelType"
                  onChange={handleOnChange}
                  value="778"
                />
                <label>International</label>
              </span>
            </div>

            <div className="col-4 mb-2">
              <label>Trip Type</label>
              <span className="radioContainer">
                <input
                  type="radio"
                  name="tripType"
                  onChange={handleOnChange}
                  value="779"
                  defaultChecked
                />
                <label>One Way</label>
              </span>
              <span className="radioContainer">
                <input
                  type="radio"
                  name="tripType"
                  onChange={handleOnChange}
                  value="780"
                />
                <label>Round Trip</label>
              </span>
              <span className="radioContainer">
                <input
                  type="radio"
                  name="tripType"
                  onChange={handleOnChange}
                  value="781"
                />
                <label>Multi-City</label>
              </span>
            </div>

            {expenseData.tripType === "781" && (
              <div className="mt-2 mb-4 row">
                {stops?.map((stop) => (
                  <div key={stop.id} className="col-6 multiStopsContainer">
                    <label>{`Stops ${stop.id}`}</label>
                    <input
                      type="text"
                      name={`stop_${stop.id}`}
                      //defaultValue={stops.find(it=>it.id).value}
                      onChange={(e) =>
                        handleStopChange(stop.id, e.target.value)
                      }
                    />
                    {stop.isFirst ? (
                      <BiPlus
                        size={"1.25em"}
                        className="iconColor"
                        onClick={handleAddStop}
                      />
                    ) : (
                      <BiTrash
                        className="iconColor"
                        size={"1.25em"}
                        onClick={() => handleDeleteStop(stop.id)}
                      />
                    )}
                  </div>
                ))}
              </div>
            )}

            <div className="col-4 mb-2">
              <label>Net Amount</label>
              <div style={{ display: "flex" }}>
                <span>{expCurrencySymbol}</span>
                <input
                  className="ms-1"
                  type="text"
                  name="expAmt"
                  style={{ textAlign: "right" }}
                  // value={
                  //   parseFloat(expenseData.ticketFare || 0.00) +
                  //   parseFloat(expenseData.addCharges || 0.00)
                  // }
                  defaultValue={
                    expInfo.length > 0
                      ? expInfo
                          ?.find(
                            (item) =>
                              item.expTypId == expenseTypeId &&
                              item.date == moment(expDate).format("YYYY-MM-DD")
                          )
                          ?.expAmt.toLocaleString("en-US", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })
                      : expenseData?.expAmt?.toLocaleString("en-US", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })
                  }
                  readOnly
                />
              </div>
            </div>
          </>
        )}
        {expenseTypeId.includes("615") && (
          <>
            <div className="col-4 mb-2">
              <label>Car Type</label>

              <select name="carType" onChange={handleOnChange}>
                {carTypes.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.lkup_name}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-4 mb-2">
              <label>Toll Charge</label>

              <input
                type="text"
                name="tollCharge"
                onChange={handleOnChange}
                defaultValue={
                  expInfo?.find(
                    (item) =>
                      item.expTypId == expenseTypeId &&
                      item.date == moment(expDate).format("YYYY-MM-DD") &&
                      item.name == expName
                  )?.tollCharge
                }
                onKeyDown={(e) => {
                  const key = e.key;
                  const isNumber = /^[0-9]$/.test(key);
                  const isDecimal = key === ".";
                  const isAllowedKey = [
                    "Backspace",
                    "Delete",
                    "ArrowLeft",
                    "ArrowRight",
                  ].includes(key);

                  if (!isNumber && !isDecimal && !isAllowedKey) {
                    e.preventDefault();
                  }
                }}
              />
            </div>
            <div className="col-4 mb-2">
              <label>Parking Fee</label>

              <input
                type="text"
                name="parking"
                onChange={handleOnChange}
                defaultValue={
                  expInfo?.find(
                    (item) =>
                      item.expTypId == expenseTypeId &&
                      item.date == moment(expDate).format("YYYY-MM-DD")
                  )?.parking
                }
                onKeyDown={(e) => {
                  const key = e.key;
                  const isNumber = /^[0-9]$/.test(key);
                  const isDecimal = key === ".";
                  const isAllowedKey = [
                    "Backspace",
                    "Delete",
                    "ArrowLeft",
                    "ArrowRight",
                  ].includes(key);

                  if (!isNumber && !isDecimal && !isAllowedKey) {
                    e.preventDefault();
                  }
                }}
              />
            </div>
            <div className="col-4 mb-2">
              <label>No. of kms</label>

              <input
                type="text"
                name="noOfMiles"
                onChange={handleOnChange}
                defaultValue={
                  expInfo?.find(
                    (item) =>
                      item.expTypId == expenseTypeId &&
                      item.date == moment(expDate).format("YYYY-MM-DD")
                  )?.noOfMiles
                }
                onKeyDown={(e) => {
                  const key = e.key;
                  const isNumber = /^[0-9]$/.test(key);
                  const isDecimal = key === ".";
                  const isAllowedKey = [
                    "Backspace",
                    "Delete",
                    "ArrowLeft",
                    "ArrowRight",
                  ].includes(key);

                  if (!isNumber && !isDecimal && !isAllowedKey) {
                    e.preventDefault();
                  }
                }}
              />
            </div>
            <div className="col-4 mb-2">
              <label>Rate per km</label>

              <input
                type="text"
                name="rate"
                onChange={handleOnChange}
                defaultValue={
                  expInfo?.find(
                    (item) =>
                      item.expTypId == expenseTypeId &&
                      item.date == moment(expDate).format("YYYY-MM-DD")
                  )?.rate
                }
                onKeyDown={(e) => {
                  const key = e.key;
                  const isNumber = /^[0-9]$/.test(key);
                  const isDecimal = key === ".";
                  const isAllowedKey = [
                    "Backspace",
                    "Delete",
                    "ArrowLeft",
                    "ArrowRight",
                  ].includes(key);

                  if (!isNumber && !isDecimal && !isAllowedKey) {
                    e.preventDefault();
                  }
                }}
              />
            </div>
            <div className="col-4 mb-2">
              <label>Amount</label>

              <input
                type="text"
                name="fuelAmount"
                value={parseFloat(
                  (
                    parseFloat(expenseData.noOfMiles || 0) *
                    parseFloat(expenseData.rate || 0)
                  ).toFixed(2)
                )}
                readOnly
              />
            </div>
            <div className="col-4 mb-2">
              <label>Net Amount</label>
              <div style={{ display: "flex" }}>
                <span>{expCurrencySymbol}</span>
                <input
                  className="ms-1"
                  type="text"
                  name="expAmt"
                  style={{ textAlign: "right" }}
                  value={
                    parseFloat(expenseData.tollCharge || 0) +
                    parseFloat(expenseData.parking || 0) +
                    parseFloat(expenseData.noOfMiles || 0) *
                      parseFloat(expenseData.rate || 0)
                  }
                  defaultValue={expInfo
                    ?.find(
                      (item) =>
                        item.expTypId == expenseTypeId &&
                        item.date == moment(expDate).format("YYYY-MM-DD")
                    )
                    ?.expAmt.toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  readOnly
                />
              </div>
            </div>
          </>
        )}
        {isExpenseBillable == 1 && (
          <div className="row">
            <div
              className="col-4 mt-2"
              style={{ display: "flex", alignItems: "center" }}
            >
              <input
                type="checkbox"
                name="isBillable"
                onChange={handleOnChange}
              />
              <strong className="ml-1">Billable</strong>
            </div>
          </div>
        )}
        {!excludedValues.some((value) => expenseTypeId.startsWith(value)) && (
          <div className="col-4 mb-2">
            <label>Net Amount</label>
            <div style={{ display: "flex" }}>
              <span>{expCurrencySymbol}</span>
              <input
                className="ms-1"
                type="text"
                name="expAmt"
                style={{ textAlign: "right" }}
                defaultValue={
                  expInfo.length > 0
                    ? (
                        expInfo.find(
                          (item) =>
                            item.expTypId == expenseTypeId &&
                            item.date == moment(expDate).format("YYYY-MM-DD") &&
                            item.name == expName
                        )?.expAmt || ""
                      ).toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })
                    : (expenseData?.expAmt || "").toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })
                }
                onKeyDown={(e) => {
                  const key = e.key;
                  const isNumber = /^[0-9]$/.test(key);
                  const isDecimal = key === ".";
                  const isAllowedKey = [
                    "Backspace",
                    "Delete",
                    "ArrowLeft",
                    "ArrowRight",
                  ].includes(key);

                  if (!isNumber && !isDecimal && !isAllowedKey) {
                    e.preventDefault();
                  }
                }}
                onChange={handleOnChange}
              />
            </div>
          </div>
        )}
        <div className="col-12">
          <label>Description</label>

          <textarea
            name="description"
            onChange={handleOnChange}
            defaultValue={
              expInfo.find(
                (item) =>
                  item.expTypId == expenseTypeId &&
                  item.date == moment(expDate).format("YYYY-MM-DD")
              )?.description
            }
          />
        </div>
        <label>
          Add Receipt:
          <span style={{ color: "#de1d1d" }}>
            Maximum allowed file size :10MB.
          </span>{" "}
          <span style={{ color: "#de1d1d" }}>
            Supported types jpg, jpeg, png, pdf
          </span>
        </label>
        <div>
          <label class="file-label">
            <input
              type="file"
              accept=".jpg,.jpeg,.pdf,.png"
              disabled={expInfo[0]?.status_id !== 634 && id !== undefined}
              onChange={handleFileChange}
            />
            <span>Choose Files</span>
          </label>
          {id === undefined ||
          !documents
            .flatMap((it) => it)
            .map((j) => j.expense_id)
            .some((i) => i == expenseId) ? (
            Object.keys(fileMap).map((key, index) => {
              const keyList = key.split("_");
              const projectIdKey = keyList[0];
              let expenseTypIdKey = keyList[1];
              let dateKey = keyList[2];
              if (keyList.length > 3) {
                expenseTypIdKey = `${keyList[1]}_${keyList[2]}`;
                dateKey = keyList[3];
              }
              // const [projectIdKey, expenseTypIdKey, dateKey] = key.split("_");
              if (
                projectIdKey == projectId &&
                expenseTypIdKey == expenseTypeId &&
                dateKey == moment(expDate).format("YYYY-MM-DD")
              ) {
                return (
                  <div key={index}>
                    {fileMap[key].map((fileName, subIndex) => (
                      <div key={subIndex}>
                        <BiTrash
                          className="iconColor"
                          onClick={() => handleFileRemove(fileName)}
                        />{" "}
                        <strong>{fileName}</strong>
                      </div>
                    ))}
                  </div>
                );
              }
              return null;
            })
          ) : documents
              .flatMap((it) => it)
              .map((j) => j.expense_id)
              .some((i) => i == expenseId) ? (
            <div>
              {documents
                .flatMap((it) => it)
                .filter((i) => i.expense_id == expenseId)
                .map((item) => (
                  <div key={item.document_id}>
                    {expInfo[0]?.status_id == 634 ? (
                      <BiTrash
                        className="iconColor"
                        onClick={() => deleteDocumentConfirm(item.document_id)}
                      />
                    ) : (
                      ""
                    )}{" "}
                    <span
                      className="linkSty"
                      onClick={() =>
                        downloadFile(
                          item.document_id,
                          item.svn_revision,
                          item.file_name
                        )
                      }
                      title={item.file_name}
                    >
                      {item.file_name}
                    </span>
                  </div>
                ))}
            </div>
          ) : (
            ""
          )}
        </div>
      </div>
    );
  };

  const FileDeleteConfirmPopup = () => {
    return (
      <>
        <CModal
          visible={fileDelPopup}
          style={{ width: "350px", marginLeft: "80px" }}
          onClose={() => setFileDelPopup(false)}
          backdrop={"static"}
          alignment="center"
        >
          <CModalHeader className="">
            <CModalTitle>
              <span className="">Delete Confirmation</span>
            </CModalTitle>
          </CModalHeader>
          <CModalBody>
            <span>Are you sure you want to permanently remove this item?</span>
            <hr />
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <button
                className="btn btn-primary"
                onClick={() => {
                  if (true) {
                    deleteFile();
                  }
                  if (id !== undefined) {
                    deleteDocument();
                  }
                  setFileDelPopup(false);
                }}
              >
                Yes
              </button>
              <button
                className="btn btn-secondary mx-2"
                onClick={() => setFileDelPopup(false)}
              >
                No
              </button>
            </div>
          </CModalBody>
        </CModal>
      </>
    );
  };

  return (
    <CModal
      size="lg"
      visible={expensesTypePopup}
      onClose={() => setExpensesTypePopup(false)}
      backdrop={"static"}
      alignment="center"
    >
      <CModalHeader>
        <CModalTitle></CModalTitle>
      </CModalHeader>
      <CModalBody>
        {errorMsg && (
          <div className="statusMsg error">
            <span>
              <IoWarningOutline /> {errorMsg}
            </span>
          </div>
        )}
        <div>{inputFields()}</div>
        <div className=" form-group col-md-12 col-sm-12 col-xs-1 btn-container center my-2">
          <button
            className="btn btn-primary"
            onClick={() => setExpensesTypePopup(false)}
          >
            Add
          </button>
        </div>
        {fileDelPopup && <FileDeleteConfirmPopup />}
      </CModalBody>
    </CModal>
  );
}

export default ExpensesTypePopUp;
