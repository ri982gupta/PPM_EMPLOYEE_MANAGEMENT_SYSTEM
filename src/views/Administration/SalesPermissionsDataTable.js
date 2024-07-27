//// NOT THIS ONE ///////////////
import React from "react";
import { useEffect, useState } from "react";
import axios from "axios";
import { ColumnGroup } from "primereact/columngroup";
import { Row } from "primereact/row";
import "primeflex/primeflex.css";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { environment } from "../../environments/environment";
import { ReactSearchAutocomplete } from "react-search-autocomplete";
import { AiFillDelete, AiFillEdit } from "react-icons/ai";
import Checkbox from "@material-ui/core/Checkbox";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { InputNumber } from "primereact/inputnumber";
import { Dropdown } from "primereact/dropdown";
import { Tag } from "primereact/tag";
function SalesPermissionsDataTable() {
  const baseUrl = environment.baseUrl;
  const [Data, setData] = useState([]);
  const [flag, setFlag] = useState(false);
  const [issueDetails, setIssueDetails] = useState([]);
  const [item, setItem] = useState([]);
  const [checkbox, setCheckbox] = useState(1);
  const [checked, setChecked] = React.useState(true);
  const [roleid, setRoleid] = useState(543);
  const [userId, setUserId] = useState([]);
  const searchdata = { roleid: roleid, userId: userId };
  const [hasFullHierarchy, setHasFullHierarchy] = useState([]);
  const [formData, setFormData] = useState(searchdata);
  const [editedData, setEditedData] = useState(searchdata);
  const [deletePopup, setDeletePopup] = useState(false);
  useEffect(() => {
    console.log(item);
  }, [item]);
  const [addFormData, setAadFormData] = useState({
    // survey_name: "",
    // type: "CSAT",
    userId: "",
    roleTypeId: 543,
    isPrimary: 0,
    hasfullHierarchy: checkbox,
  });

  const getData = () => {
    console.log("line no 106");
    axios({
      method: "get",
      url:
        baseUrl + `/administrationms/salesPermission/getResourcesAutoComplete`,
    }).then(function (response) {
      var res = response.data;
      setIssueDetails(res);
      console.log("assigned data");
      console.log(res);
    });
  };
  useEffect(() => {}, [issueDetails]);
  useEffect(() => {
    getData();
  }, []);

  const handleAddFormChange = (event) => {
    // event.preventDefault();
    console.log("in handleChasge");
    const fieldName = event.target.getAttribute("name");
    const fieldValue = event.target.id;

    const newFormData = { ...addFormData };
    newFormData[fieldName] = fieldValue;

    console.log(newFormData);
    setAadFormData(newFormData);
  };
  const handleChange = () => {
    setChecked(true);
    console.log(checked);
  };
  // table headings
  let headerGroup = (
    <ColumnGroup>
      <Row>
        {/* <Column /> */}
        <Column header="Resource" />
        <Column header="Has Full Hierarchy" />
        <Column header="Actions" />
        {/* <Column header="Question type" /> */}
      </Row>
    </ColumnGroup>
  );
  const handleForm = (
    <div className="newEntryFields">
      <form className="col-md-12">
        <div className="row px-1 py-2">
          <div className="col-9">
            {/* <input
              type="text"
              name="user_id"
              required
              onChange={handleAddFormChange}
            /> */}
            <div className="autoComplete-container">
              <div>
                <ReactSearchAutocomplete
                  items={issueDetails}
                  type="Text"
                  name="userId"
                  id="userId"
                  className="wrapperauto"
                  issueDetails={issueDetails}
                  getData={getData}
                  //   onSelect={handleAddFormChange}
                  onSelect={(e) => {
                    {
                      setAadFormData((prevProps) => ({
                        ...prevProps,
                        userId: e.id,
                      }));
                      console.log(e.id);
                    }
                  }}
                  showIcon={false}
                />
              </div>
            </div>
            <span>{item.name}</span>
          </div>
          <div>
            <Checkbox
              name="hasfullHierarchy"
              id="1"
              onChange={(e) => {
                setHasFullHierarchy(e.target.value);
                console.log(e.target.id);
                setCheckbox(e.target.id);
                console.log("in checkbox");
              }}
            />
          </div>
        </div>
      </form>
    </div>
  );
  const representDate = (data) => {
    return (
      <>
        <button
          onClick={() => {
            console.log("true in edit");
            Saveresourceaccess();
          }}
        >
          <AiFillEdit />
        </button>
        <button
          onClick={() => {
            console.log("true in delete");
            deleteResource();
          }}
        >
          <AiFillDelete />
        </button>
      </>
    );
  };
  const hierarchy = (data) => {
    return <>{data.hasFullHierarchy == true ? "Yes" : "No"}</>;
  };
  useEffect(() => {
    getTableDta();
  }, []);

  const getTableDta = () => {
    axios({
      method: "get",
      //   url: `http://localhost:8090/administrationms/salesPermission/getSalesPermission`,
      url: baseUrl + `/administrationms/salesPermission/getSalesPermission`,
    })
      .then(function (response) {
        var resp = response.data;
        setData(resp);
      })
      .catch(function (response) {});
  };

  const Saveresourceaccess = () => {
    axios({
      method: "post",
      //   url: `http://localhost:8090/administrationms/salesPermission/saveresourceaccess`,
      url: baseUrl + `/administrationms/salesPermission/saveresourceaccess`,

      data: addFormData,
    }).then((error) => {
      console.log("success", error);
      getTableData();
      setFlag(false);
      setAddmsg(true);
      setTimeout(() => {
        setAddmsg(false);
      }, 3000);
    });
    console.log(addFormData);
  };

  const deleteResource = () => {
    console.log();
    axios({
      method: "delete",
      url:
        baseUrl +
        `/administrationms/salesPermission/deleteSalesPermission?Roleid=${roleid}&UserId=${userId}`,
      data: formData,
    }).then((error) => {
      console.log("success", error);
      setDeletePopup(false);
      setDeleteMessage(true);
      setTimeout(() => {
        setDeleteMessage(false);
      }, 3000);
    });
  };

  return (
    // <div>in salespermissionDataTable</div>
    // <React.Fragment>
    //   <div className="p-card ">
    //     <DataTable
    //       value={Data}
    //       showGridlines
    //       headerColumnGroup={headerGroup}
    //       //   expandedRows={expandedRows}
    //       //   onRowToggle={(e) => setExpandedRows(e.data)}
    //       //   rowExpansionTemplate={rowExpansionTemplate}
    //       pagination
    //       paginator
    //       rows={6}
    //       className="p-card "
    //       paginationPerPage={5}
    //       paginationRowsPerPageOptions={[5, 15, 25, 50]}
    //       paginationComponentOptions={{
    //         rowsPerPageText: "Records per page:",
    //         rangeSeparatorText: "out of",
    //       }}
    //     >
    //       {/* <Column expander={allowExpansion} /> */}
    //       <Column field="name" header={Data.name} />
    //       <Column
    //         field="hasFullHierarchy"
    //         header={Data.hasFullHierarchy}
    //         body={hierarchy}
    //       />
    //       {/* <Column field="userId" header={Data.is_primary} /> */}

    //       <Column field="action" body={representDate} />
    //     </DataTable>
    //     <div className="customCard">
    //       <div>{flag === true && <span>{handleForm}</span>}</div>
    //       <div className="m-1">
    //         <Button
    //           icon="pi pi-plus"
    //           onClick={() => setFlag(true)}
    //           style={{
    //             width: "25px",
    //             minWidth: "1rem",
    //             height: "5px",
    //             minHeight: "1rem",
    //           }}
    //           className="ml-2"
    //         />
    //         <Button
    //           icon="pi pi-times"
    //           onClick={() => setFlag(false)}
    //           style={{
    //             width: "25px",
    //             minWidth: "1rem",
    //             height: "5px",
    //             minHeight: "1rem",
    //           }}
    //           className="ml-1"
    //         />
    //         <Button
    //           icon="pi pi-check"
    //           onClick={() => Saveresourceaccess()}
    //           style={{
    //             width: "25px",
    //             minWidth: "1rem",
    //             height: "5px",
    //             minHeight: "1rem",
    //           }}
    //           className="ml-1"
    //         />
    //       </div>
    //     </div>
    //   </div>
    // </React.Fragment>
    <DataTable
      value={Data}
      editMode="row"
      // dataKey="id"
      //   onRowEditComplete={onRowEditComplete}
      tableStyle={{ minWidth: "50rem" }}
    >
      <Column
        field="name"
        header="Resource"
        //   editor={(options) => textEditor(options)}
        style={{ width: "20%" }}
      ></Column>
      <Column
        field="comments"
        header="comments"
        //   editor={(options) => textEditor(options)}
        style={{ width: "20%" }}
      ></Column>
      {/* <Column
          field="inventoryStatus"
          header="Status"
          body={statusBodyTemplate}
          editor={(options) => statusEditor(options)}
          style={{ width: "20%" }}
        ></Column>
        <Column
          field="price"
          header="Price"
          body={priceBodyTemplate}
          editor={(options) => priceEditor(options)}
          style={{ width: "20%" }}
        ></Column>*/}
      <Column
        rowEditor
        headerStyle={{ width: "10%", minWidth: "8rem" }}
        bodyStyle={{ textAlign: "center" }}
      ></Column>
    </DataTable>
  );
}

export default SalesPermissionsDataTable;
