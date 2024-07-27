import React, { useEffect, useRef, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import axios from "axios";
import { environment } from "../../environments/environment";
import { AiFillWarning } from "react-icons/ai";
import { ImCross } from "react-icons/im";
import { ReactSearchAutocomplete } from "react-search-autocomplete";
import { FaPlus, FaSave } from "react-icons/fa";

function CustomersStakeholdersEdit(props) {
  const { customerId, setCsAddMessage } = props;
  const [products, setProducts] = useState([]);
  const [rowId, setRowId] = useState([]);
  const [validateproject, setValidateproject] = useState(false);
  const [buttonDisabled, setButtonDisabled] = useState(true);
  const [valid, setValid] = useState(false);
  const baseUrl = environment.baseUrl;
  const abortController = useRef(null);
  const componentRef = useRef(null);
  const [resource, setResource] = useState([]);
  const [type, setType] = useState([]);
  const [divisionId, setDivisionId] = useState("");
  const loggedUserId = localStorage.getItem("resId");

  let sideArrow = document.getElementsByClassName(
    "p-paginator-next p-paginator-element p-link"
  );
  let sideDoubleArrow = document.getElementsByClassName(
    "p-paginator-last p-paginator-element p-link"
  );

  const resourceFnc = async () => {
    await axios({
      method: "get",
      url:
        baseUrl + `/customersms/Customers/getDivisionNames?cid=${customerId}`,
    }).then((res) => {
      let manger = res.data;
      setResource(manger);
    });
  };
  useEffect(() => {
    resourceFnc();
  }, []);

  const onRowEditComplete = (e) => {
    let _products = [...products];
    let { newData, index } = e;
    _products[index] = newData;
    setProducts(_products);
    handleAddClick(e.newData);
  };

  const removeFirstRowIfEmpty = (prod) => {
    Object.keys(prod).forEach((d) => {
      if (["", null, undefined, " "].includes(prod[d])) {
        setProducts(products.slice(1));
        setValid((prev) => !prev);
        return;
      }
    });
  };

  const getType = () => {
    axios
      .get(baseUrl + `/customersms/Customers/getTypeDropdown`)

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

  useEffect(() => {
    let prod = products[0];
    sideArrow[0]?.addEventListener("click", function () {
      removeFirstRowIfEmpty(prod);
    });

    sideDoubleArrow[0]?.addEventListener("click", function () {
      removeFirstRowIfEmpty(prod);
    });

    if (products[0]?.name == "") {
      const icon = document.getElementsByClassName("customerStakeholder")[0]
        .children[0].children[0].children[1].children[0].children[6]
        .children[1];

      icon.setAttribute("title", "Edit selected row");
      icon.click();
      setTimeout(() => {
        const saveIcon = document.getElementsByClassName(
          "p-row-editor-save p-link"
        )[0];
        saveIcon.setAttribute("title", "Save row");
        const cancelIcon = document.getElementsByClassName(
          "p-row-editor-cancel p-link"
        )[0];
        cancelIcon.setAttribute("title", "Cancel row editing");
        cancelIcon?.addEventListener(
          "click",
          function (e) {
            if (products[0]?.name == "") {
              setProducts(products.slice(1, products.length));
              setButtonDisabled(true);
              setValidateproject(false);
              setValid(false);
              componentRef.current.forceUpdate();
            }
          },
          true
        );
      }, 200);
    }
  }, [products]);

  const Save = () => {
    document
      .getElementsByClassName("p-row-editor-save-icon pi pi-fw pi-check")[0]
      ?.click();
  };

  const Reset = () => {
    document.getElementsByClassName("p-row-editor-cancel p-link")[0]?.click();
    setValidateproject(false);
  };

  const textEditorEventName = (products) => {
    setRowId(products.rowData.id);
    return (
      <>
        <input
          className={`error ${
            validateproject && !products.rowData.name ? "error-block" : ""
          }`}
          id="name"
          type="text"
          value={products.rowData.name}
          onChange={(e) => {
            products.editorCallback(e.target.value);
          }}
        />
      </>
    );
  };

  const statusbodyEvents = (rowData) => {
    return (
      <>
        <input
          className="ellipsis"
          id="name"
          title={rowData.name}
          value={rowData.name}
          type="text"
          autoComplete="off"
          required
          disabled
        />
      </>
    );
  };

  const textEditorDivision = (products) => {
    const handleClear = () => {};
    return (
      <>
        <div className="autoComplete-container">
          <div
            className={` ${
              validateproject && !products.rowData.divisionName
                ? "error-block"
                : ""
            }`}
          >
            <ReactSearchAutocomplete
              items={resource}
              autoFocus
              id="divisionId"
              name="divisionId"
              inputSearchString={
                products.rowData.divisionName == null
                  ? ""
                  : products.rowData.divisionName
              }
              onSelect={(selectedItem) => {
                setDivisionId(selectedItem);
              }}
              onClear={handleClear}
              showIcon={false}
            />
          </div>
        </div>
      </>
    );
  };

  const statusbodyDivision = (rowData) => {
    return (
      <>
        <input
          className="ellipsis"
          id="divisionName"
          title={rowData.divisionName}
          value={rowData.divisionName}
          type="text"
          autoComplete="off"
          required
          disabled
        />
      </>
    );
  };

  const textEditorType = (products) => {
    return (
      <>
        <select
          className={`error ${
            validateproject && !products?.products?.lkup_name
              ? "error-block"
              : ""
          }`}
          id="type_id"
          name="typeId"
          type="text"
          value={products.rowData.lkup_name}
          onChange={(e) => {
            products.editorCallback(e.target.value);
            type.map((a) => {
              if (a.id == e.target.value) {
                products["rowData"]["value"] = a.lkup_name;
                products["rowData"]["typeId"] = e.target.value;
              }
            });
          }}
        >
          <option value="">{"<<Please Select>>"}</option>
          {type?.map((Item, index) => (
            <option
              key={index}
              value={Item.id}
              selected={Item.id == products.rowData.typeId ? true : false}
            >
              {Item.lkup_name}
            </option>
          ))}
        </select>
      </>
    );
  };

  const statusbodyType = (rowData) => {
    return (
      <>
        <input
          className="ellipsis"
          id="type_id"
          title={rowData.typeName}
          value={rowData.typeName}
          type="text"
          autoComplete="off"
          required
          disabled
        />
      </>
    );
  };

  const textEditorAddress = (products) => {
    return (
      <>
        <input
          className={`error ${
            validateproject && !products.rowData.address ? "error-block" : ""
          }`}
          id="address"
          type="text"
          value={products.rowData.address}
          onChange={(e) => {
            products.editorCallback(e.target.value);
          }}
        />
      </>
    );
  };

  const statusbodyAddress = (rowData) => {
    return (
      <>
        <input
          className="ellipsis"
          id="address"
          title={rowData.address}
          value={rowData.address}
          type="text"
          autoComplete="off"
          required
          disabled
        />
      </>
    );
  };

  const textEditorPhone = (products) => {
    return (
      <>
        <input
          className={`error ${
            validateproject && !products.rowData.phone ? "error-block" : ""
          }`}
          id="phone"
          type="text"
          maxLength={15}
          onKeyDown={(e) =>
            e.keyCode &&
            (e.keyCode <= 47 || e.keyCode >= 58) &&
            e.keyCode != 8 &&
            e.preventDefault()
          }
          value={products.rowData.phone}
          onChange={(e) => {
            products.editorCallback(e.target.value);
          }}
        />
      </>
    );
  };

  const statusbodyPhone = (rowData) => {
    return (
      <>
        <input
          className="ellipsis"
          id="phone"
          title={rowData.phone}
          value={rowData.phone}
          type="text"
          autoComplete="off"
          required
          disabled
        />
      </>
    );
  };

  const textEditorEmail = (products) => {
    return (
      <>
        <input
          className={`error ${
            validateproject && !products.rowData.email ? "error-block" : ""
          }`}
          id="email"
          type="text"
          value={products.rowData.email}
          onChange={(e) => {
            products.editorCallback(e.target.value);
          }}
        />
      </>
    );
  };

  const statusbodyEmail = (rowData) => {
    return (
      <>
        <input
          className="ellipsis"
          id="email"
          title={rowData.email}
          value={rowData.email}
          type="text"
          autoComplete="off"
          required
          disabled
        />
      </>
    );
  };

  const getData = () => {
    abortController.current = new AbortController();
    axios({
      url:
        baseUrl +
        `/customersms/Customers/getCustomerEditStakeholders?cid=${customerId}`,
      signal: abortController.current.signal,
    }).then((resp) => {
      let GetData = resp.data;
      setProducts(() => GetData);
      setTimeout(() => {}, 1000);
    });
  };

  const handleAddClick = (rowData) => {
    rowData["divisionId"] =
      divisionId.name == undefined ? rowData["divisionId"] : divisionId.name;
    rowData["divisionId"] =
      divisionId.id == undefined ? rowData["divisionId"] : divisionId.id;

    if (
      rowData.name == "" ||
      rowData.typeId == "" ||
      rowData.phone == "" ||
      rowData.email == "" ||
      rowData.address == ""
    ) {
      setValidateproject(true);
    } else {
      axios({
        method: "post",
        url:
          baseUrl + `/customersms/Customers/postCustomersExternalStakeholders`,
        data: {
          id: rowData.id,
          loggedId: loggedUserId,
          customerId: customerId,
          Name: rowData.name,
          division: rowData.divisionId,
          type: rowData.typeId,
          address: rowData.address,
          phone: rowData.phone,
          email: rowData.email,
        },
      }).then((response) => {
        getData();
        setValidateproject(false);
        setCsAddMessage(true);
        setTimeout(() => {
          setCsAddMessage(false);
        }, 3000);
      });
      setButtonDisabled(true);
      setValid(false);
    }
  };

  const addHandler1 = () => {
    let daa = document.getElementsByClassName(
      "p-paginator-first p-paginator-element p-link"
    )[1];

    daa.click();

    if (!valid) {
      setValid(true);
      setButtonDisabled(false);
    }

    const data = {
      typeId: "",
      typeName: "",
      phone: "",
      id: "",
      name: "",
      email: "",
      address: "",
      divisionName: "",
      divisionId: "",
    };

    let dt = [];
    dt.push(data);
    setProducts([...dt, ...products]);
  };

  useEffect(() => {
    getData();
  }, []);

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
                Customer Stakeholders
              </h2>
            </div>
          </div>
          <div className=" p-fluid darkHeader mb-2">
            <DataTable
              className="primeReactDataTable projDependenciesTable customerStakeholder"
              value={products}
              editMode="row"
              rows={25}
              showGridlines
              paginator
              rowHover
              onRowEditComplete={onRowEditComplete}
              tableStyle={{ minWidth: "auto", width: "auto" }}
              filterDisplay="row"
              currentPageReportTemplate="View {first} - {last} of {totalRecords} "
              paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
              rowsPerPageOptions={[10, 25, 50]}
              paginationComponentOptions={{
                rowsPerPageText: "Records per page:",
                rangeSeparatorText: "out of",
              }}
            >
              <Column
                field="name"
                header={<span>Name</span>}
                style={{ width: "220px" }}
                body={statusbodyEvents}
                editor={(options) => textEditorEventName(options)}
              ></Column>
              <Column
                field="divisionName"
                header={<span>Division</span>}
                style={{ width: "220px" }}
                body={statusbodyDivision}
                editor={(options) => textEditorDivision(options)}
              ></Column>
              <Column
                field="typeName"
                header={<span>Type</span>}
                style={{ width: "300px" }}
                body={statusbodyType}
                editor={(options) => textEditorType(options)}
              ></Column>
              <Column
                field="address"
                header={<span>Address</span>}
                style={{ width: "220px" }}
                body={statusbodyAddress}
                editor={(options) => textEditorAddress(options)}
              ></Column>
              <Column
                field="phone"
                header={<span>Phone</span>}
                style={{ width: "220px" }}
                body={statusbodyPhone}
                editor={(options) => textEditorPhone(options)}
              ></Column>
              <Column
                field="email"
                header={<span> Email</span>}
                style={{ width: "220px" }}
                body={statusbodyEmail}
                editor={(options) => textEditorEmail(options)}
              ></Column>
              <Column
                field="Actions"
                header="Actions"
                rowEditor
                headerStyle={{ width: "100px", backgroundColor: "#eeecec" }}
                bodyStyle={{ textAlign: "center" }}
              />
            </DataTable>
          </div>
        </div>
      </div>
      <div className="form-group col-md-2 btn-container-events center my-3">
        <button
          className="btn btn-primary"
          disabled={valid}
          title={"Add new row"}
          onClick={addHandler1}
        >
          <FaPlus /> Add
        </button>
        <button
          className="btn btn-primary"
          disabled={buttonDisabled}
          title={"Save row"}
          onClick={() => {
            Save();
          }}
        >
          <FaSave /> Save
        </button>
        <button
          className="btn btn-secondary"
          disabled={buttonDisabled}
          title={"Cancel row editing"}
          onClick={() => {
            Reset();
          }}
        >
          <ImCross fontSize={"11px"} /> Cancel
        </button>
      </div>
    </>
  );
}
export default CustomersStakeholdersEdit;
