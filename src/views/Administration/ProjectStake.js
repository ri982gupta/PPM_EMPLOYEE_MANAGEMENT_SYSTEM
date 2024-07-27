import React, { useMemo, useState, useEffect } from 'react';
import MaterialReactTable from 'material-react-table';
import axios from 'axios';
import { environment } from "../../environments/environment";
import moment from "moment";
// import DatePicker from 'react-datepicker';
import { DatePicker } from '@material-ui/pickers';

import {
  
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  MenuItem,
  Stack,
  TextField,
  Tooltip,
} from '@mui/material'
import { ReactSearchAutocomplete } from 'react-search-autocomplete';
const ProjectStake = (props) => {
  const { projectId } = props;
  const [products, setProducts] = useState(null);
  const baseUrl = environment.baseUrl;
  const [tableData, setTableData] = useState(products || []);
  const getStakeHoldersDetails = () => {
    axios({
      url:
        baseUrl + `/ProjectMS/stakeholders/getStakeHolderDetails?ObjectId=${projectId}`,
    }).then((resp) => {
      const GetData = resp.data;
      for (let i = 0; i < GetData.length; i++) {
        GetData[i]["date_created"] = GetData[i]["date_created"] == null ? "" : moment(GetData[i]["date_created"]).format("DD-MMM-YYYY");
        GetData[i]["FromDate"] = GetData[i]["FromDate"] == null ? "" : moment(GetData[i]["FromDate"]).format("DD-MMM-YYYY");
        GetData[i]["ToDate"] = GetData[i]["ToDate"] == null ? "" : moment(GetData[i]["ToDate"]).format("DD-MMM-YYYY");
        GetData[i]["AssignmentType"] = GetData[i]["AssignmentType"] == null ? "" : (GetData[i]["AssignmentType"]) == true ? "Manual" : "System";
        GetData[i]["IsActive"] = GetData[i]["IsActive"] == null ? "" : (GetData[i]["IsActive"]) == 1 ? "YES" : "NO";
      }
      setProducts(GetData);
    });
  };
  console.log(products)
  const [roles, SetRoles] = useState([]);

  const getRoles = () => {
    axios({
      url: baseUrl + `/ProjectMS/stakeholders/getRoles`,
    }).then((resp) => {
      SetRoles(resp.data);
    });
  };
  console.log(roles)
  const [issueDetails, setIssueDetails] = useState([])

  const getData = () => {
    axios({
      method: "get",
      url: baseUrl + `/ProjectMS/risks/getAssignedData`,
    }).then(function (response) {
      var res = response.data
      setIssueDetails(res)
    })
  }
  console.log(issueDetails)
  const [formEditData, setFormEditData] = useState([{}])
  console.log(formEditData)
  const getProjectId = (e) => {
    const { value, id } = e.target
    setFormEditData({ ...formEditData, [id]: value })
    console.log(formEditData)
  }
  const DateColumn = ({ value, onChange }) => (
    <DatePicker
      name="FromDate"
      selected={value}
      id="FromDate"
      autoComplete='off'
      dateFormat='dd-MMM-yyyy'
      onChange={(e) => {
        setFormEditData(prev => ({ ...prev, ["FromDate"]: (moment(e).format("yyyy-MM-DD")) }));
        console.log(e);
      }}
      onKeyDown={(e) => {
        e.preventDefault();
      }}
    />
  );
  const columns = useMemo(() => [
    {
      accessorKey: 'User',
      header: 'User',
      Cell: ({ value }) => (
        <ReactSearchAutocomplete
          items={issueDetails}
          id="User"
          name="User"
          onSelect={selectedItem => {
            alert(`Selected user: ${selectedItem.id}`);
            console.log(selectedItem)
            setFormEditData((prevProps) => ({
              ...prevProps,
              "User": selectedItem.id,
            }));
            console.log(formEditData)
          }}
          autoFocus
          showIcon={false}
        />
      ),
    },
    {
      accessorKey: 'Role',
      header: 'Role',
      Cell: ({ value }) => (
        <select id="Role" defaultValue={value} onChange={(e) => { getProjectId(e) }}>
          {roles.map((Item) => (
            <option value={Item.id} key={Item.id}>{Item.display_name}
            </option>
          ))}
        </select>
      ),
    },
    {
      accessorKey: 'FromDate',
      header: 'FromDate',
      renderCell: ({ rowData, updateData }) => (
        <DatePicker
          value={rowData.FromDate}
          onChange={(date) => {
            updateData(rowData.id, 'FromDate', date);
            console.log('Selected date:', date);
          }}
        />
      ),
    },
    {
      accessorKey: 'ToDate',
      header: 'ToDate',
    },
    {
      accessorKey: 'AssignmentType',
      header: 'AssignmentType',
    },
    {
      accessorKey: 'assignedBy',
      header: 'assignedBy',
    },
    {
      accessorKey: 'date_created',
      header: 'date_created',
    }, {
      accessorKey: 'IsActive',
      header: 'IsActive',
    }
  ],
    [tableData],
  );
  //-----
  console.log(products)
  console.log(tableData)
  useEffect(() => {
    if (products) {
      setTableData(products);
    }
  }, [products]);
  const handleSaveRow = async ({ exitEditingMode, row, values }) => {
    tableData[row.index] = values;
    console.log("post Method----------")
    setTableData([...tableData]);
  };
  const handleCreateNewRow = () => {
    console.log('create a new row')
    // tableData.unshift(values)
    setTableData([{}, ...tableData])
    document.getElementsByClassName(
      'MuiButtonBase-root MuiIconButton-root MuiIconButton-sizeMedium css-78trlr-MuiButtonBase-root-MuiIconButton-root',
    )[5]
      .click()
  }
  useEffect(() => {
    getStakeHoldersDetails()
    getRoles();
    getData();
  }, [])
  return (
    <MaterialReactTable
      columns={columns}
      data={tableData}
      editingMode="row"
      enableEditing
      cellProps={{
        onChange: (rowIndex, accessorKey, value) => {
          // Update the tableData array with the new value
        }
      }}
      onEditingRowSave={handleSaveRow}
      renderTopToolbarCustomActions={() => (
        <Button
          onClick={handleCreateNewRow}
          variant="contained"
        >
          Create New Row
        </Button>
      )}
    />
  );
};

export default ProjectStake;
