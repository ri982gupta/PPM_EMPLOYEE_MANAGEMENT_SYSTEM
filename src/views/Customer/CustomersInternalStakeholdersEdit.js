import React, { useEffect, useRef, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import axios from "axios";
import { environment } from "../../environments/environment";
import { AiFillEdit, AiFillWarning } from "react-icons/ai";
import { MdOutlineAdd } from "react-icons/md";
import { TfiSave } from "react-icons/tfi";
import { ImCross } from "react-icons/im";
import { ReactSearchAutocomplete } from "react-search-autocomplete";
import { options } from "preact";

function CustomersInternalStakeholdersEdit(props) {
  const { customerId, setAddIntStakeMessage } = props;
  const [products, setProducts] = useState([]);

  const [validateproject, setValidateproject] = useState(false);
  const [buttonDisabled, setButtonDisabled] = useState(true);
  const [valid, setValid] = useState(false);
  const baseUrl = environment.baseUrl;
  const abortController = useRef(null);
  const loggedUserId = localStorage.getItem("resId");
  const [resource, setResource] = useState([]);
  const [resourceId, setResourcseId] = useState("");
  const [resourceId1, setResourceId1] = useState("");
  const [type, setType] = useState([]);
  const [internStakeDefaultValues, setInternStakeDefaultValues] = useState([]);

  const [backupData, setBackupData] = useState([]);
  const [typeId, setTypeId] = useState([]);
  const [enableDropDown, setEnableDropDown] = useState(false);
  const [resourceEditId, setResourceEditId] = useState([]);
  const [editor, setEditor] = useState(false);
  const [lkpName, setLkpName] = useState([]);
  const [editAutoId, setEditAutoId] = useState([]);
  const [dropEditId, setDropEditId] = useState([]);
  const [rowId, setRowId] = useState([]);
  // console.log(internStakeDefaultValues[0]?.email_official);
  const [isModified, setIsModified] = useState(false);
  // console.log(isModified);

  useEffect(() => {
    setDetails((prev) => ({
      ...prev,
      id: rowId,
      resourceId: editAutoId,
      typeId: dropEditId,
      loggedId: loggedUserId,
      customerId: customerId,
    }));
  }, [editAutoId, dropEditId]);

  const [details, setDetails] = useState({
    id: rowId,
    resourceId: editAutoId,
    typeId: dropEditId,
    loggedId: loggedUserId,
    customerId: customerId,
  });
  // console.log(details.resourceId);

  const resourceFnc = async () => {
    await axios({
      method: "get",
      url: baseUrl + `/ProjectMS/risks/getAssignedData`,
    }).then((res) => {
      let manger = res.data;
      setResource(manger);
    });
  };

  const getInternStakeDefaultValues = () => {
    axios({
      method: "get",
      url:
        baseUrl +
        `/customersms/Customers/getInternStakeDefaultValues?cid=${resourceId1}`,
    }).then((res) => {
      let manger = res.data;
      setInternStakeDefaultValues(manger);
    });
  };
  useEffect(() => {
    resourceFnc();
    getInternStakeDefaultValues();
  }, [resourceId1]);

  const getType = () => {
    axios
      .get(
        baseUrl + `/customersms/Customers/getInternalStakeholderTypeDropDown`
      )

      .then((Response) => {
        let type = [];
        let data = Response.data;
        data.length > 0 &&
          data.forEach((e) => {
            let TypeObj = {
              label: e.lkup_name,
              value: e.id,
            };
            type.push(TypeObj);
          });
        setType(data);
      });
  };

  useEffect(() => {
    getType();
  }, []);

  const Reset = () => {
    setProducts(backupData);
    setValidateproject(false);
    setButtonDisabled(true);
    setValid(false);
    setInternStakeDefaultValues("");
    setTypeId("");
    setResourcseId("");
    setEditor(false);
    setIsModified(false);
  };

  const getData1 = () => {
    abortController.current = new AbortController();
    axios({
      url:
        baseUrl +
        `/customersms/Customers/getCustomerEditInternalStakeholders?cid=${customerId}`,
      signal: abortController.current.signal,
    }).then((resp) => {
      let GetData = resp.data;
      const dataWithSNo = GetData.map((item) => ({
        ui: "1",
        ...item,
      }));

      setProducts([...dataWithSNo]);
      setBackupData([...dataWithSNo]);

      setTimeout(() => {}, 1000);
    });
  };

  const handleAddClick = (options) => {
    let data;
    if (rowId == "") {
      data = {
        // id: rowData.id,
        loggedId: loggedUserId,
        customerId: customerId,
        resourceId: resourceId,
        typeId: typeId,
      };
    } else {
      data = details;
    }
    if (
      resourceId == undefined
      // resourceId == [] ||
      // typeId == "" ||
      // resourceId == "" ||
      // typeId == []
    ) {
      setValidateproject(true);
    } else {
      axios({
        method: "post",
        url:
          baseUrl + `/customersms/Customers/postCustomersInternalStakeholders`,
        // data: {
        //   // id: rowData.id,
        //   loggedId: loggedUserId,
        //   customerId: customerId,
        //   resourceId: resourceId,
        //   typeId: typeId,
        // },
        data: data,
      }).then((response) => {
        getData1();
        setValidateproject(false);
        setAddIntStakeMessage(true);
        setTimeout(() => {
          setAddIntStakeMessage(false);
        }, 3000);
      });
      setButtonDisabled(true);
      setValid(false);
      setInternStakeDefaultValues("");
      // setTypeId("");
      // setResourcseId("");
    }
  };

  const addHandler1 = () => {
    if (!valid) {
      setValid(true);
      setButtonDisabled(false);
    }
    const newRow = {
      Name: "",
      depatName: "",
      lkup_name: "",
      Address: "",
      Phone: "",
      email: "",
      Action: 0,
      ui: "new",
    };

    setProducts((prevTaskResources) => [newRow, ...prevTaskResources]);
  };

  useEffect(() => {
    getData1();
  }, []);

  const renderRowActions = (options) => {
    return (
      <>
        <div>
          <AiFillEdit
            color="orange"
            cursor="pointer"
            title="Edit"
            onClick={() => {
              // console.log(options.id);
              setRowId(options.id);
              setEnableDropDown(true);
              setResourceEditId(options.resource_id);
              setEditor(true);
              setLkpName(options.type_id);
              setValid(true);
              setButtonDisabled(false);
            }}
          />
        </div>
      </>
    );
  };
  const handleChange = (e) => {
    const { id, value } = e.target;
    setDetails((prev) => {
      return { ...prev, [id]: value };
    });
  };

  return (
    <>
      {validateproject ? (
        <div className="statusMsg error">
          <span>
            <AiFillWarning />
            &nbsp;
            {"Please provide valid values for highlighted values"}
          </span>
        </div>
      ) : (
        ""
      )}

      <div>
        <div className="customCard card graph mt-2 mb-2">
          <div className="group mb-0 customCard">
            <div
              className="col-md-12  collapseHeader px-3"
              style={{ backgroundColor: "#f4f4f4" }}
            >
              <h2 style={{ backgroundColor: "#f4f4f4" }}>
                Internal Stakeholders
              </h2>
            </div>
          </div>
          {/* <div className=" p-fluid  mb-2"> */}
          <DataTable
            className="primeReactDataTable eventsTable customerEngament Roles"
            value={products}
            editMode="row"
            rows={25}
            showGridlines
            paginator
            rowHover
            highlightOnHover
            pagination
            paginationPerPage={5}
            filterDisplay="row"
            currentPageReportTemplate="{first} to {last} of {totalRecords}"
            paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
            rowsPerPageOptions={[10, 25, 50]}
            paginationComponentOptions={{
              rowsPerPageText: "Records per page:",
              rangeSeparatorText: "out of",
            }}
            paginationRowsPerPageOptions={[5, 15, 25, 50]}
          >
            <Column
              key={"Name"}
              field="Name"
              header="Name"
              alignHeader={"center"}
              body={(options) => {
                if (
                  enableDropDown &&
                  options.resource_id === resourceEditId &&
                  editor
                ) {
                  setEditAutoId(options.resource_id);

                  return (
                    <div className="autoComplete-container react  cancel  reactsearchautocomplete">
                      <ReactSearchAutocomplete
                        items={resource}
                        id="resourceId"
                        name="resourceId"
                        inputSearchString={
                          options.Name == null ? "" : options.Name
                        }
                        onSelect={(e) => {
                          // console.log(e.id);
                          setResourceId1(e.id);
                          setIsModified(true);

                          setDetails((prev) => ({
                            ...prev,
                            resourceId: e.id,
                          }));
                        }}
                        showIcon={false}
                      />
                    </div>
                  );
                } else if (options.Name === "") {
                  return (
                    <div className="autoComplete-container inTable">
                      <ReactSearchAutocomplete
                        items={resource}
                        id="resource_id"
                        name="resourceId"
                        inputSearchString={
                          products.rowData?.Name == null
                            ? ""
                            : products?.rowData?.Name
                        }
                        onSelect={(selectedItem) => {
                          setResourcseId(selectedItem.id);
                          setResourceId1(selectedItem.id);
                        }}
                        showIcon={false}
                      />
                    </div>
                  );
                } else {
                  return <>{options.Name}</>;
                }
              }}
            />

            <Column
              key={"depatName"}
              field="depatName"
              header="BU"
              alignHeader={"center"}
              // body={(options) =>
              //   options.depatName == "" ? (
              //     <input
              //       type="text"
              //       value={internStakeDefaultValues[0]?.departmentName}
              //       readOnly
              //       onFocus={(event) => event.target.blur()}
              //     />
              //   ) : (
              //     <>{options.depatName}</>
              //   )
              // }
              body={(options) => {
                if (
                  enableDropDown &&
                  options.resource_id === resourceEditId &&
                  editor
                ) {
                  // console.log(options.depatName);
                  return (
                    <input
                      type="text"
                      style={{ pointerEvents: "none", cursor: "not-allowed" }}
                      disabled
                      value={
                        isModified == true
                          ? internStakeDefaultValues[0]?.departmentName
                          : options?.depatName
                      }
                      readOnly
                      onFocus={(event) => event.target.blur()}
                    />
                  );
                } else if (options.email === "") {
                  return (
                    <input
                      type="text"
                      style={{ pointerEvents: "none", cursor: "not-allowed" }}
                      value={internStakeDefaultValues[0]?.departmentName}
                      readOnly
                      onFocus={(event) => event.target.blur()}
                    />
                  );
                } else {
                  return <>{options.depatName}</>;
                }
              }}
            ></Column>
            <Column
              key={"lkup_name"}
              field="lkup_name"
              header="Type"
              alignHeader={"center"}
              body={(options) => {
                if (
                  enableDropDown &&
                  options.resource_id === resourceEditId &&
                  editor
                ) {
                  setDropEditId(options.type_id);
                  return (
                    <select id="typeId" onChange={(e) => handleChange(e)}>
                      <option value="">{"<<Please Select>>"}</option>
                      {type?.map((item, index) => (
                        <option
                          key={index}
                          value={item.id}
                          selected={
                            item.lkup_name == options.lkup_name
                              ? options.lkup_name
                              : ""
                          }
                        >
                          {item.lkup_name}
                        </option>
                      ))}
                    </select>
                  );
                } else if (options.lkup_name === "") {
                  return (
                    <select
                      onChange={(e) => setTypeId(e.target.value)}
                      // value=""
                    >
                      <option value="">{"<<Please Select>>"}</option>
                      {type?.map((Item, index) => (
                        <option key={index} value={Item.id}>
                          {Item.lkup_name}
                        </option>
                      ))}
                    </select>
                  );
                } else {
                  return <>{options.lkup_name}</>;
                }
              }}
            ></Column>

            <Column
              field="Address"
              key={"Address"}
              header="Address"
              alignHeader={"center"}
              // body={(options) =>
              //   options.ui != "1" ? (
              //     <input
              //       type="text"
              //       value={internStakeDefaultValues[0]?.address}
              //       readOnly
              //       onFocus={(event) => event.target.blur()}
              //     />
              //   ) : (
              //     <>{options.Address}</>
              //   )
              // }
              body={(options) => {
                if (
                  enableDropDown &&
                  options.resource_id === resourceEditId &&
                  editor
                ) {
                  return (
                    <input
                      type="text"
                      style={{ pointerEvents: "none", cursor: "not-allowed" }}
                      disabled
                      value={
                        isModified == true
                          ? internStakeDefaultValues[0]?.address
                          : options.address
                      }
                      readOnly
                      onFocus={(event) => event.target.blur()}
                    />
                  );
                } else if (options.ui != "1") {
                  return (
                    <input
                      type="text"
                      style={{ pointerEvents: "none", cursor: "not-allowed" }}
                      value={internStakeDefaultValues[0]?.address}
                      readOnly
                      onFocus={(event) => event.target.blur()}
                    />
                  );
                } else {
                  return <>{options.address}</>;
                }
              }}
            ></Column>
            <Column
              key={"Phone"}
              field="Phone"
              header="Phone"
              alignHeader={"center"}
              // body={(options) =>
              //   options.ui != "1" ? (
              //     <input
              //       type="text"
              //       value={internStakeDefaultValues[0]?.Phone}
              //       readOnly
              //       onFocus={(event) => event.target.blur()}
              //     />
              //   ) : (
              //     <>{options.Phone}</>
              //   )
              // }
              body={(options) => {
                if (
                  enableDropDown &&
                  options.resource_id === resourceEditId &&
                  editor
                ) {
                  return (
                    <input
                      type="text"
                      style={{ pointerEvents: "none", cursor: "not-allowed" }}
                      disabled
                      value={
                        isModified == true
                          ? internStakeDefaultValues[0]?.Phone
                          : options.Phone
                      }
                      readOnly
                      onFocus={(event) => event.target.blur()}
                    />
                  );
                } else if (options.ui != "1") {
                  return (
                    <input
                      type="text"
                      style={{ pointerEvents: "none", cursor: "not-allowed" }}
                      value={internStakeDefaultValues[0]?.Phone}
                      readOnly
                      onFocus={(event) => event.target.blur()}
                    />
                  );
                } else {
                  return <>{options.Phone}</>;
                }
              }}
            ></Column>
            <Column
              key={"email"}
              field="email"
              header="Email"
              alignHeader={"center"}
              body={(options) => {
                if (
                  enableDropDown &&
                  options.resource_id === resourceEditId &&
                  editor
                ) {
                  return (
                    <input
                      type="text"
                      style={{ pointerEvents: "none", cursor: "not-allowed" }}
                      disabled
                      value={
                        isModified == true
                          ? internStakeDefaultValues[0]?.email_official
                          : options.email
                      }
                      readOnly
                      onFocus={(event) => event.target.blur()}
                    />
                  );
                } else if (options.email === "") {
                  return (
                    <input
                      type="text"
                      style={{ pointerEvents: "none", cursor: "not-allowed" }}
                      value={internStakeDefaultValues[0]?.email_official}
                      readOnly
                      onFocus={(event) => event.target.blur()}
                    />
                  );
                } else {
                  return <>{options.email}</>;
                }
              }}
            ></Column>

            <Column
              key={"Actions"}
              field="Actions"
              header="Actions"
              headerStyle={{ width: "100px", backgroundColor: "#eeecec" }}
              bodyStyle={{ textAlign: "center" }}
              body={(options) => {
                return renderRowActions(options);
              }}
            />
          </DataTable>
          {/* </div> */}
        </div>
      </div>
      <div className="form-group col-md-2 btn-container-events center my-3">
        <button
          className="btn btn-primary"
          disabled={valid}
          title={"Add new row"}
          onClick={() => {
            addHandler1();
          }}
        >
          <MdOutlineAdd size="1.2em" /> Add
        </button>
        <button
          className="btn btn-primary"
          disabled={buttonDisabled}
          title={"Save row"}
          onClick={() => {
            // setAddDropdown(false);
            handleAddClick();
          }}
        >
          <TfiSave size="0.9em" /> Save
        </button>
        <button
          className="btn btn-secondary"
          disabled={buttonDisabled}
          title={"Cancel row editing"}
          onClick={() => {
            Reset();
          }}
        >
          <ImCross /> Cancel
        </button>
      </div>
    </>
  );
}
export default CustomersInternalStakeholdersEdit;
