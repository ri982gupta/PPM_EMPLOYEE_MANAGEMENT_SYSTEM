import React, { useCallback, useMemo, useState } from "react";
import MaterialReactTable from "material-react-table";
import axios from "axios";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  //   MenuItem,
  Stack,
  TextField,
  Tooltip,
} from "@mui/material";
import { Delete, Edit, Cancel, Save } from "@mui/icons-material";
import { useEffect } from "react";
import { ReactSearchAutocomplete } from "react-search-autocomplete";
import { environment } from "../../environments/environment";

// import { data, states } from "./makeData";

const Example = (props) => {
  const { Data, issueDetails } = props;

  useEffect(() => {
    console.log(issueDetails);
  }, [issueDetails]);

  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [validationErrors, setValidationErrors] = useState({});
  const [Resource, setResource] = useState();
  const [products, setProducts] = useState([]);
  const baseUrl = environment.baseUrl;
  const initialValues = {
    name: "",
    roleTypeId: "543",
    isPrimary: "0",
    hasfullHierarchy: "",
  };
  const [editModeValues, setEditModeValues] = useState(initialValues);
  console.log(editModeValues);
  const getData = () => {
    console.log("line no 106");
    axios({
      method: "get",
      url:
        baseUrl + `/administrationms/salesPermission/getResourcesAutoComplete`,
    }).then(function (response) {
      var res = response.data;
      setResource(res);
      console.log("assigned data");
      console.log(res);
    });
  };

  const getTableDta = () => {
    axios({
      method: "get",
      //   url: `http://localhost:8090/administrationms/salesPermission/getSalesPermission`,
      url: baseUrl + `/administrationms/salesPermission/getSalesPermission`,
    })
      .then(function (response) {
        var resp = response.data;
        setProducts(resp);
      })
      .catch(function (response) {});
  };

  //   const Saveresourceaccess = () => {
  //     axios({
  //       method: "post",
  //       //   url: `http://localhost:8090/administrationms/salesPermission/saveresourceaccess`,
  //       url: baseUrl + `/administrationms/salesPermission/saveresourceaccess`,

  //       data: {
  //         userId: "",
  //         roleTypeId: 543,
  //         isPrimary: 0,
  //         hasfullHierarchy: "",
  //       },
  //     }).then((error) => {
  //       console.log("success", error);
  //       getTableData();
  //       setFlag(false);
  //       setAddmsg(true);
  //       setTimeout(() => {
  //         setAddmsg(false);
  //       }, 3000);
  //     });
  //     // console.log(addFormData);
  //   };

  const handleCreateNewRow = (values) => {
    console.log("----------------------------- on click of add icon");
    tableData.push(values);
    setTableData([...tableData]);
  };

  console.log(editModeValues.name);
  const handleSaveRowEdits = async ({ exitEditingMode, row, table }) => {
    console.log(row);
    console.log("-----------------------------on click of edit icon");
    console.log("in line 99---");
    console.log(editModeValues);
    console.log(
      editModeValues.name,
      editModeValues.id,
      editModeValues.id === undefined ? editModeValues.name : editModeValues.id
    );
    axios({
      method: "post",

      url: baseUrl + `/administrationms/salesPermission/saveresourceaccess`,

      data: {
        // // userId: "" + Resource,
        // // userId: Resource,
        // roleTypeId: "543",
        // isPrimary: "0",
        // // hasfullHierarchy: hirarchyId.toString(),
        // userId:
        //   editModeValues.id === "null"
        //     ? editModeValues.name
        //     : editModeValues.name == "null"
        //     ? editModeValues.id
        //     : editModeValues.id,
        userId:
          editModeValues.id === undefined
            ? editModeValues.name
            : editModeValues.id,
        roleTypeId: "543",
        isPrimary: "0",
        hasfullHierarchy: editModeValues.hasFullHierarchy,
      },
    }).then((error) => {
      //   console.log(data);
      console.log("success", error);
      // console.log(typeof editId);
      getTableDta();
      // postData();
    });

    // console.log(editModeValues.name);

    // exitEditingMode(); //required to exit editing mode and close modal

    if (!Object.keys(validationErrors).length) {
      tableData[row.index] = values;
      //send/receive api updates here, then refetch or update local table data for re-render
      setTableData([...tableData]);
      exitEditingMode(); //required to exit editing mode and close modal
    }
  };

  const handleCancelRowEdits = () => {
    setValidationErrors({});
  };

  const handleDeleteRow = useCallback(
    (row) => {
      console.log(row.original.id);
      console.log(row.name);
      console.log(editModeValues.name);
      console.log(editModeValues.id);

      //   if (!confirm(`Are you sure you want to delete ${row.getValue("name")}`)) {
      //     return;
      //   }

      //send api delete request here, then refetch or update local table data for re-render

      axios({
        method: "delete",
        url:
          baseUrl +
          `/administrationms/salesPermission/deleteSalesPermission?Roleid=543&UserId=${row.original.id}`,
        // data: formData,
      }).then((error) => {
        console.log(error);
        console.log("success", error);
        setDeletePopup(false);
        setDeleteMessage(true);
        setTimeout(() => {
          setDeleteMessage(false);
        }, 3000);
      });
      tableData.splice(row.index, 1);
      setTableData([...tableData]);
    },
    [tableData]
  );

  const getCommonEditTextFieldProps = useCallback(
    (cell) => {
      return {
        error: !!validationErrors[cell.id],
        helperText: validationErrors[cell.id],
        onBlur: (event) => {
          const isValid =
            cell.column.id === "email"
              ? validateEmail(event.target.value)
              : cell.column.id === "age"
              ? validateAge(+event.target.value)
              : validateRequired(event.target.value);
          if (!isValid) {
            //set validation error for cell if invalid
            setValidationErrors({
              ...validationErrors,
              [cell.id]: `${cell.column.columnDef.header} is required`,
            });
          } else {
            //remove validation error for cell if valid
            delete validationErrors[cell.id];
            setValidationErrors({
              ...validationErrors,
            });
          }
        },
      };
    },
    [validationErrors]
  );

  const columns = useMemo(
    () => [
      //   {
      //     accessorKey: "id",
      //     header: "ID",
      //     enableColumnOrdering: false,
      //     enableEditing: false, //disable editing on this column
      //     enableSorting: false,
      //     size: 80,
      //   },
      {
        accessorKey: "name",
        header: "Name",
        Edit: ({ cell, column, table }) => (
          <>
            {console.log(cell.getValue())}
            {console.log("" + cell.getValue() == "")}
            {console.log(column)}
            {/* {Object.keys(cell).map((d) => (
              <li>{d + "-" + cell[d]}</li>
            ))} */}
            {cell.getValue() != "" ? (
              <input type="text" disabled value={cell.getValue()} />
            ) : (
              <ReactSearchAutocomplete
                items={issueDetails}
                // value={"hello"}
                type="Text"
                name="userId"
                id="userId"
                className="wrapperauto"
                issueDetails={issueDetails}
                // getData={getData}
                //   onSelect={handleAddFormChange}
                onSelect={(e) => {
                  {
                    console.log(issueDetails);

                    setEditModeValues((prev) => ({
                      ...prev,
                      ["name"]: e.id,
                    }));

                    // setAadFormData((prevProps) => ({
                    //   ...prevProps,
                    //   userId: e.id,
                    // }));
                    console.log(e.id);
                  }
                }}
                // onChange={(e) => {
                //   console.log(e);
                // }}
                showIcon={false}
              />
            )}
          </>
        ),
      },
      {
        accessorKey: "hasFullHierarchy",
        header: "Has Full Hierarchy",
        Cell: ({ cell }) => (cell.getValue() == 1 ? "Yes" : "No"),
        Edit: ({ cell, column, table, options }) => (
          <input
            id="hasFullHierarchy"
            type="checkBox"
            onChange={(e) => {
              setEditModeValues((prev) => ({
                ...prev,
                [e.target.id]: e.target.checked ? 1 : 0,
              }));

              //   console.log(column);
              //   console.log(cell);
              //   console.log(table);
              //   console.log(e.target.checked);
              //   console.log(cell.row.original.hasFullHierarchy);
              //   //   cell.row.original.hasFullHierarchy = e.target.checked ? 1 : 0;
              //   console.log(cell.row.original.hasFullHierarchy);
              //   options.editorCallback(e.target.checked);
              //   cell.setValue()
            }}
            checked={editModeValues.hasFullHierarchy == 1 ? true : false}
          />
        ),
      },
    ],
    [getCommonEditTextFieldProps, editModeValues]
  );

  useEffect(() => {
    console.log(Data);
    setTableData(Data);
  }, [Data]);

  // add  button api
  const onClickHandler = () => {
    const obj = [
      {
        name: "",
        hasFullHierarchy: "",
      },
    ];

    setTableData([...obj, ...tableData]);
  };

  useEffect(() => {
    console.log(tableData);

    if (tableData[0]?.name == "") {
      setTimeout(() => {
        console.log("in timeout");
        document
          ?.getElementsByClassName(
            "MuiButtonBase-root MuiIconButton-root MuiIconButton-sizeMedium css-78trlr-MuiButtonBase-root-MuiIconButton-root"
          )[5]
          ?.click();
      }, 200);
    }
  }, [tableData]);

  return (
    <div className="roleMappingTable">
      <>
        <MaterialReactTable
          displayColumnDefOptions={{
            "mrt-row-actions": {
              muiTableHeadCellProps: {
                align: "center",
              },
              size: 120,
            },
          }}
          columns={columns}
          data={tableData}
          editingMode="row"
          enableColumnOrdering
          enableEditing
          //   onEditingRowSave={handleSaveRowEdits}
          onEditingRowCancel={handleCancelRowEdits}
          renderRowActions={({ row, table }) => (
            <Box sx={{ display: "flex", gap: "1rem" }}>
              <Tooltip arrow placement="right" title="Edit">
                <IconButton
                  onClick={() => {
                    console.log(row.original);
                    setEditModeValues(row.original);
                    table.setEditingRow(row);
                  }}
                >
                  <Edit />
                </IconButton>
              </Tooltip>
              <Tooltip arrow placement="left" title="Save">
                <IconButton
                  onClick={() => {
                    handleSaveRowEdits(row, table);
                  }}
                >
                  <Save />
                </IconButton>
              </Tooltip>
              <Tooltip arrow placement="left" title="Cancel">
                <IconButton onClick={() => table.setEditingRow("")}>
                  <Cancel />
                </IconButton>
              </Tooltip>
              <Tooltip arrow placement="right" title="Delete">
                <IconButton color="error" onClick={() => handleDeleteRow(row)}>
                  <Delete />
                </IconButton>
              </Tooltip>
            </Box>
          )}
          renderTopToolbarCustomActions={() => (
            <Button
              color="secondary"
              onClick={() => onClickHandler()}
              variant="contained"
            >
              {/* Create New Account */}
              add
            </Button>
          )}
        />

        <CreateNewAccountModal
          columns={columns}
          open={createModalOpen}
          onClose={() => setCreateModalOpen(false)}
          onSubmit={handleCreateNewRow}
        />
      </>
    </div>
  );
};

//example of creating a mui dialog modal for creating new rows
export const CreateNewAccountModal = ({ open, columns, onClose, onSubmit }) => {
  const [values, setValues] = useState(() =>
    columns.reduce((acc, column) => {
      acc[column.accessorKey ?? ""] = "";
      return acc;
    }, {})
  );

  const handleSubmit = () => {
    //put your validation logic here
    onSubmit(values);
    onClose();
  };

  return (
    <Dialog open={open}>
      <DialogTitle textAlign="center">Create New Account</DialogTitle>
      <DialogContent>
        <form onSubmit={(e) => e.preventDefault()}>
          <Stack
            sx={{
              width: "100%",
              minWidth: { xs: "300px", sm: "360px", md: "400px" },
              gap: "1.5rem",
            }}
          >
            {columns.map((column) => (
              <TextField
                key={column.accessorKey}
                label={column.header}
                name={column.accessorKey}
                onChange={(e) =>
                  setValues({ ...values, [e.target.name]: e.target.value })
                }
              />
            ))}
          </Stack>
        </form>
      </DialogContent>
      <DialogActions sx={{ p: "1.25rem" }}>
        <Button onClick={onClose}>Cancel</Button>
        <Button color="secondary" onClick={handleSubmit} variant="contained">
          Add
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const validateRequired = (value) => !!value.length;
const validateEmail = (email) =>
  !!email.length &&
  email
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
const validateAge = (age) => age >= 18 && age <= 50;

export default Example;
