import MaterialReactTable from "material-react-table";
import { useState, useEffect } from "react";
import { environment } from "../../environments/environment";
import { FaSave } from "react-icons/fa";
import { ImCross } from "react-icons/im";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { BiCheck } from "react-icons/bi";
import { CModal, CModalFooter } from "@coreui/react";
import { CModalBody } from "@coreui/react";
import { CModalHeader, CModalTitle } from "@coreui/react";
import { AiFillWarning } from "react-icons/ai";
import "./CapactityPlanEditableTable.scss";
import { updateCapacityPlanEditableTableHours } from "../../reducers/SelectedSEReducer";

function CapactityPlanEditableTable(props) {
  const { tableData, selectedObjForCapPlanEdit, handleResourceClick, setIsReloadedTableData } = props;
  const [iniTableData, setIniTableData] = useState([]);
  useEffect(() => {
    setIniTableData(tableData);
  }, [tableData]);
  const [columns, setColumns] = useState([]);
  const [rows, setRows] = useState([]);
  const baseUrl = environment.baseUrl;
  const [successfullymsg, setSccessfullyMsg] = useState(false);
  const [validationMsg, setValidationMessage] = useState(false);
  const [showErrorMsgForEmtyPayload, setShowErrorMsgForEmtyPayload] = useState(false)
  const [newData, setNewData] = useState([]);
  const [buttonPopup, setButtonPopup] = useState(false);
  const loggedUserId = +localStorage.getItem("resId");
  const dispatch = useDispatch();
  const invalidDates = useSelector(
    (state) => state.selectedSEState.capacityPlanResourceHours
  );
  const { projectId } = useParams();
  let projId = +projectId.split(":")[1];
  const [formdata, setFormdata] = useState([
    {
      project_role_booking_id: "",
      project_role_id: "",
      resource_id: "",
      project_id: "",
      alloc_date: "",
      actual_alloc_hours: "",
      changed_alloc_hours: "",
      created_by_id: loggedUserId,
    },
  ]);
  useEffect(() => {
    const slicedData = tableData.slice(1);
    setNewData(slicedData);
  }, [tableData]);

  useEffect(() => {
    getData();
  }, [tableData, invalidDates, newData]);
  const handleSaveClick = () => {
    let finaldata = formdata.slice(1);
    setButtonPopup(false);
    const filteredDates = finaldata
      .filter((item) => item?.changed_alloc_hours === "")
      .map((item) => item?.alloc_date);
    const formattedDates = filteredDates.map((date) => {
      const formattedDate = new Date(date);
      const year = formattedDate.getFullYear();
      const month = (formattedDate.getMonth() + 1).toString().padStart(2, "0");
      const day = formattedDate.getDate().toString().padStart(2, "0");
      const day1 = formattedDate.getDate().toString().padStart(1, "0");
      return `${year}_${month}_${day}_day`;
    });
    dispatch(updateCapacityPlanEditableTableHours(formattedDates));
    if (formattedDates.length > 0) {
      setValidationMessage(true);
      return;
    } else {
      const newData = finaldata
        .filter(
          (item) =>
            item != null &&
            item?.actual_alloc_hours !== null &&
            item?.changed_alloc_hours !== null
        )
        .map((item) => ({
          ...item,
          actual_alloc_hours: parseFloat(item.actual_alloc_hours),
          changed_alloc_hours: parseFloat(item.changed_alloc_hours),
        }));
      if (newData.length <= 0) {
        setShowErrorMsgForEmtyPayload(true)
        setTimeout(() => {
          setShowErrorMsgForEmtyPayload(false)
        }, 3000);
      } else {
        setValidationMessage(false);
        setShowErrorMsgForEmtyPayload(false)
        axios({
          url: `http://10.11.12.125:8060/ProjectMS/CapacityPlan/cplanUpdateAllocationHours`,
          method: "post",
          data: newData,
        }).then((resp) => {
          axios
            .get(
              `http://10.11.12.125:8060/ProjectMS/CapacityPlan/getsplitingAllocations?bookingId=${selectedObjForCapPlanEdit.id}&userId=${selectedObjForCapPlanEdit.resource_id}`
            )
            .then((res) => { });
          setFormdata([
            {
              project_role_booking_id: "",
              project_role_id: "",
              resource_id: "",
              project_id: "",
              alloc_date: "",
              actual_alloc_hours: "",
              changed_alloc_hours: "",
              created_by_id: loggedUserId,
            },
            ,
          ]);
          setSccessfullyMsg(true);
          setTimeout(() => {
            setSccessfullyMsg(false);
            setIsReloadedTableData(true)
          }, 3000);
          dispatch(updateCapacityPlanEditableTableHours(""));
          //     searchHandle1();
          getData();
        });
      }
    }
  };
  const openHandileSaveModal = () => {
    setButtonPopup(true);
  };
  const handleReset = () => {
    setValidationMessage(false);
    setFormdata([
      {
        project_role_booking_id: "",
        project_role_id: "",
        resource_id: "",
        project_id: "",
        alloc_date: "",
        actual_alloc_hours: "",
        changed_alloc_hours: "",
        created_by_id: loggedUserId,
      },
      ,
    ]);
    handleResourceClick(selectedObjForCapPlanEdit);
    // axios.get(`http://10.11.12.125:8060/ProjectMS/CapacityPlan/getsplitingAllocations?bookingId=${selectedObjForCapPlanEdit.id}&userId=${selectedObjForCapPlanEdit.resource_id}`).then((res)=>{
    // })
    getData();
    setButtonPopup(false);
  };
  const getData = () => {
    const headerRow = tableData.find((row) => row.id === -1);
    if (!headerRow) {
      setColumns(null);
      return;
    }
    const headers = Object.keys(headerRow);
    const filteredHeaders = headers.filter(
      (header) => !["id", "resource_id", "lvl"].includes(header)
    );
    filteredHeaders.sort((a, b) => {
      // If one of the elements is 'name', it should always come first
      if (a === "name") return -1;
      if (b === "name") return 1;

      // Sort based on the keys of the 'obj' object
      const dateA = headerRow[a].split("^&")[0];
      const dateB = headerRow[b].split("^&")[0];
      return new Date(dateA) - new Date(dateB);
    });
    const newHeaders = filteredHeaders.map((key, index) => {
      const headerValue = headerRow[key];
      const headerText = key == "name" ? "Name" : key;
      return {
        accessorKey: key,
        header: headerText,
        Header: () => (
          <div
            title={
              key.includes("_") ? headerValue?.split("^&")[0] : headerValue
            }
          >
            {key.includes("_")
              ? headerValue?.split("^&")[0]
              : headerValue == "Resource^&1^&1"
                ? "Resource"
                : headerValue == "type"
                  ? "Type"
                  : headerValue}
          </div>
        ),
        Cell: ({ cell, index }) => {
          const cellValue = cell.getValue();
          let keyval = key.split("_");
          let invoicableDt = keyval.slice(0, 3).join("-");
          const handleInputChange = (e, invoicableDt, key) => {
            const { name, value, id } = e.target;
            setFormdata((prevData) => {
              const newData = [...prevData];
              const existingIndex = newData.findIndex(
                (item) => item?.alloc_date === invoicableDt
              );
              if (existingIndex !== -1) {
                // If an object with the same invoicableDt already exists, update it
                newData[existingIndex][name] = value; // Set the changed_alloc_hours to the new value
                newData[existingIndex]['actual_alloc_hours'] = iniTableData[1][key]; // Set the actual_alloc_hours to the value from the table
              } else {
                // If not, create a new object for this invoicableDt
                newData.push({
                  project_role_booking_id: selectedObjForCapPlanEdit.id,
                  project_role_id: selectedObjForCapPlanEdit.project_role_id,
                  resource_id: selectedObjForCapPlanEdit.resource_id,
                  project_id: projId,
                  changed_alloc_hours: value,
                  actual_alloc_hours: iniTableData[1][key], // Set the actual_alloc_hours to the value from the table
                  alloc_date: invoicableDt,
                  created_by_id: loggedUserId,
                });
              }
              return newData;
            });
          };

          return (
            <div>
              {key.includes("_") && cell.row.original.id != 99 ? (
                <div className="col-12 p-0">
                  <div className="col-12 p-0 ">
                    <input
                      type="number"
                      id="changed_alloc_hours"
                      name="changed_alloc_hours"
                      className={
                        invalidDates.includes(key) && validationMsg
                          ? "error-block"
                          : ""
                      }
                      value={cellValue}
                      placeholder="hrs"
                      onChange={(e) => {
                        const { value } = e.target;
                        handleInputChange(e, invoicableDt, key);
                        setNewData((prevNewData) =>
                          prevNewData.map((row) => {
                            if (row.id === cell.row.original.id) {
                              return {
                                ...row,
                                [key]: value,
                              };
                            }
                            return row;
                          })
                        );
                      }}
                    />
                  </div>
                </div>
              ) : (
                cellValue
              )}
            </div>
          );
        },
      };
    });
    newHeaders.sort();
    setColumns(newHeaders);
  };
  return (
    <div>
      {successfullymsg ? (
        <div className="statusMsg success">
          <BiCheck />
          {"Invoiceable Hours added Successfully"}
        </div>
      ) : (
        ""
      )}
      {showErrorMsgForEmtyPayload ? (
        <div className="statusMsg error">
          <AiFillWarning />
          {"edit the hours before save."}
        </div>
      ) : (
        ""
      )}

      <div className="materialReactExpandableTable capacity-plan-resource-editable-table darkHeader">
        {rows && (
          <MaterialReactTable
            enableExpanding={false}
            enableStickyHeader
            enablePagination={false}
            enableBottomToolbar={false}
            enableColumnFilterModes={false}
            enableDensityToggle={false}
            enableColumnActions={false}
            enableHiding={false}
            enableSorting={false}
            enableFullScreenToggle={false}
            enableGlobalFilter={false}
            enableTopToolbar={false}
            filterFromLeafRows 
            initialState={{
              showGlobalFilter: true,
              expanded: false,
              density: "compact",
              columnPinning: {
                left: ["name"],
              },
              enablePinning: true,
            }}
            paginateExpandedRows={false} 
            muiSearchTextFieldProps={{
              placeholder: `Search `,
              sx: { minWidth: "300px" },
              variant: "outlined",
            }}
            columns={columns}
            data={newData}
          />
        )}
      </div>
      <div className="row">
        <div className="col-md-12 btn-container center ">
          <button
            className="btn btn-primary"
            onClick={() => openHandileSaveModal()}
          >
            <FaSave />
            Save
          </button>
          <button className="btn btn-secondary" onClick={() => handleReset()}>
            <ImCross />
            Cancel
          </button>
        </div>
      </div>
      <div className="col-md-12">
        <CModal
          visible={buttonPopup}
          onClose={() => setButtonPopup(false)}
          size="xs"
          className=" ui-dialog CPE-pop-up-table"
          backdrop={"static"}
        >
          <CModalHeader>
            <CModalTitle>
              <p className>Changing the capacity plan hours</p>
            </CModalTitle>
          </CModalHeader>
          <CModalBody className="CPE-pop-up-table-body">
            {" "}
            <p>Are you sure you want to save the changes</p>
          </CModalBody>
          <CModalFooter className="CPE-pop-up-table-footer">
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleSaveClick}
            >
              <FaSave /> Yes{" "}
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleReset}
            >
              {" "}
              <ImCross />
              No{" "}
            </button>
          </CModalFooter>
        </CModal>
      </div>
    </div>
  );
}
export default CapactityPlanEditableTable;
