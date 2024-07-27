import React, { useEffect, useState } from 'react';
import { Box } from '@mui/material';
import MaterialReactTable, { type } from 'material-react-table';
import { IconButton } from '@material-ui/core';
import { AiFillRightCircle } from 'react-icons/ai';
// import { data, type Person } from './makeData'
function ShiftAllowncesTable(props) {
    const { data, setData, expandedCols, colExpandState } = props;
    console.log(data[0])
    const [headers, setHeaders] = useState([]);
    let Headers = data[0]
    console.log(Headers)
    const [hiddenColumns, setHiddenColumns] = useState({});
    const [columns, setColumns] = useState(null);
    const [colExpFlag, setColumnExpFlag] = useState(false);
    const [nodes, setNodes] = useState([]);

    useEffect(() => {
        getData();
    }, [data]);

    useEffect(() => {
        setNodes(nodes)
    }, [nodes])

    const getData = () => {
        const filteredData = {};
        for (const key in Headers) {
            if (Headers.hasOwnProperty(key) && Headers[key] !== "" && Headers[key] !== "-1" && Headers[key] !== 0 && key !== "is_overridden" && key !== "timesheet_hrs") {
                filteredData[key] = Headers[key];
            }
        }

        console.log(filteredData)
        let newHeaders = [];
        let hiddenHeaders = [];
        let filteredHeaders = Object.entries(filteredData);


        // );
        console.log(filteredHeaders)



        // setHeaders(filteredHeaders);

        //     // setHeaders(filteredData);

        filteredHeaders.map(([key, value]) => {
            if (expandedCols.includes(key)) {
                hiddenHeaders.push({ [key]: false });
            }
        });

        setHiddenColumns(Object.assign({}, ...hiddenHeaders));

        const handleOnChange = (event, cell) => {
            console.log(cell)
            console.log(event)
            const newValue = event.target.value;
            console.log(cell.row.index, cell.column.id, newValue * 125)
            //updateMyData(cell.row.index, cell.column.id, newValue *125);
            console.log(newValue)
            // cell.setValue(newValue);
        };
        filteredHeaders.map(([key, value], index) => {

            newHeaders.push({

                accessorKey: key,
                header: value,
                enableColumnActions: false,
                enableHiding: true,
                Header: ({ column }) => (
                    <div>
                        {value}
                        {key == colExpandState[2] ? (
                            <IconButton
                                onClick={() => {
                                    setColumnExpFlag((prev) => !prev);
                                }}
                            >
                                <AiFillRightCircle />
                            </IconButton>
                        ) : null}
                    </div>
                ),
                Cell: ({ cell }) => {
                    console.log(cell.column.id)
                    return (
                        <div>
                            {(cell.column.id == "allow_extra_hours" || cell.column.id == "allow_wknd_hours"
                                || cell.column.id == "allow_ocall_hours" || cell.column.id == "allow_ocall_amt"
                                || cell.column.id == "comments") ?

                                <input type="text" placeholder={cell.getValue()}

                                    // onChange={(event) => handleOnChange(event, cell)}
                                    readOnly={false}></input> :
                                cell.getValue()
                            }
                        </div>
                    )


                }





            })

            setColumns(newHeaders);

            let values = [];
            data?.map((d) => (d.id !== "-1" ? values.push(d) : ""));
            setNodes(values);
            console.log(values);

        })
    }
    useEffect(() => {
        colExpFlag ? setHiddenColumns({}) : colCollapse();
    }, [colExpFlag]);
    const colCollapse = () => {
        let hiddenHeaders = [];
        // refactor this
        headers.map(([key, value]) => {
            if (expandedCols.includes(key)) {
                hiddenHeaders.push({ [key]: false });
            }
        });

        setHiddenColumns(Object.assign({}, ...hiddenHeaders));
    };
    return (
        <div className=''>
            {nodes.length ? (
                <MaterialReactTable
                    columns={columns}
                    data={nodes}
                    enableRowSelection
                    // enableExpandAll={true} //hide expand all double arrow in column header
                    // enableExpanding
                    onChange={(rowIndex, accessorKey, value) => {
                        const updatedData = [...data];
                        updatedData[rowIndex][accessorKey] = value;
                        setData(updatedData);
                    }}
                    initialState={{
                        expanded: false,
                        density: "compact",
                        columnVisibility: { ...hiddenColumns },
                        columnPinning: { right: ["total"] },
                    }} //expand all rows by default
                    state={{ columnVisibility: { ...hiddenColumns } }}
                    muiTableBodyCellProps={({ cell, column, row, table }) => ({

                        onInputCapture: (event) => {
                            let x = row;
                            x.original.allow_extra_hours_amt = String(Number(event.target.value) * 125)
                            let nodesCopy = nodes;
                            nodesCopy.map(element => {
                                element.id == row.original.id ? element.allow_extra_hours_amt = String(Number(event.target.value) * 125) : row.original.allow_extra_hours_amt;
                            })
                            setNodes(nodesCopy);
                            console.log(nodesCopy)
                            //table.setEditingRow(x);
                            // console.log(row.renderValue("allow_extra_hours"));
                            // table.setState(nodesCopy);
                            console.log(row, cell, column);

                            // row.setData(x);
                            // console.log(row, "check this");

                        }

                    })}



                // onCellEdit={(rowIndex, columnId, value) => {

                //     const node = nodes[rowIndex];

                //     // Update the allow_extra_hours_amt field in the node
                //     node.allow_extra_hours_amt = String(Number(value) * 125);


                //     const newNodes = [...nodes];
                //     newNodes[rowIndex] = node;


                //     setNodes(newNodes);
                // }}


                />) : null}
        </div>
    );

}

export default ShiftAllowncesTable;
