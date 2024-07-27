import React, { useState, useEffect, useMemo } from "react";
import MaterialReactTable from "material-react-table";
import moment from "moment";
import { useRef } from "react";
import ExcelJS from "exceljs";
import jsPDF from "jspdf";
import "./ReportIdComponent.scss";
import useDynamicMaxHeight from "../PrimeReactTableComponent/useDynamicMaxHeight";

export default function MaterialReactReportsTable(props) {
    const { reportIdNw, reportsData, reportsHeader, setLoader, fileName } = props;
    const [nodes, setNodes] = useState([]);
    const [columns, setColumns] = useState(null);
    const [headers, setHeaders] = useState([]);
    const [colAr, setColAr] = useState([]);

    const abortController = useRef(null);
    // console.log(reportsData, "reportsData");
    // console.log(reportIdNw, "reportIdNw");

    const domElement = document.getElementsByClassName(
        "materialreact-details-report-table"
    );
    const maxHeight = useDynamicMaxHeight(domElement);

    useEffect(() => {
        reportIdNw == 12
            ? (reportsData?.tableData?.slice(4)?.forEach((object) => {
                Object.keys(object).forEach((item) => {
                    let value = object[item];
                    if (
                        typeof value == "number" &&
                        item != "level" &&
                        item != "id" &&
                        item != "parent" &&
                        item != "uniqueId"
                    ) {
                        object[item] = value.toFixed(2);
                    }
                });
            }),
                getData())
            : reportIdNw == 25
                ? getDataTwo()
                : "";
        setLoader(false);
    }, [reportsData.tableData]);

    const getData = () => {
        let tableData = reportsData?.tableData;
        tableData = tableData?.slice(1);
        tableData?.length > 0 ? (tableData[0]["hours"] = "Hours") : "";

        let column = null;

        if (reportsData?.columns?.includes("'")) {
            column = reportsData?.columns?.replaceAll("'", "");
        } else {
            column = reportsData?.columns;
        }

        let colArr = column?.split(",");
        let colArrNw = column?.split(",");
        setColAr(colArrNw);

        colArr?.push("hours");

        let newHeaders = [];
        const obj = {};

        for (let i = 0; i < colArr?.length; i++) {
            let colVal = colArr[i].trim();

            let firstData = tableData[0];
            obj[colVal] = firstData[colVal];
        }

        let headerArray = Object.entries(obj);
        let unWantedCols = [
            "allocHrs",
            "aprvHrs",
            "leaveHrs",
            "variance",
            "reportedHrs",
        ];

        let filteredHeaders = headerArray.filter(
            (d) => !unWantedCols.includes(d[0])
        );

        setHeaders(filteredHeaders);

        let minusOneRow = tableData?.filter((d) => d.level == -1);
        filteredHeaders.map(([key, value], index) => {
            newHeaders.push({
                id: key,
                accessorKey: key,
                // header: value?.split("^&")[0],
                header: value,
                enableColumnActions: false,
                enableHiding: true,
                Header: ({ column }) => (
                    <div className={key != "hours" ? "mixer" : ""}>{value}</div>
                ),
            });
        });

        let subHeaders = minusOneRow && Object.entries(minusOneRow[0]);
        // subHeaders?.sort();
        let unWantedColsNw = ["id", "level", "uniqueId", "parent"];

        subHeaders = subHeaders?.filter((d) => !unWantedColsNw.includes(d[0]));
        var isCurrentDateWeekendId;
        var valueNw;

        newHeaders.map((data) => {
            let i = newHeaders.indexOf(data);
            let subArray = [];
            subHeaders?.map(([key, value], index) => {
                if (
                    key == "allocHrs" ||
                    key == "reportedHrs" ||
                    key == "aprvHrs" ||
                    key == "leaveHrs" ||
                    key == "variance"
                ) {
                    if (data.accessorKey == "hours") {
                        let obj = {
                            id: key,
                            header:
                                value == null ? (
                                    ""
                                ) : (
                                    <div className={key == "variance" ? "varianceWidth" : ""}>
                                        {value}
                                    </div>
                                ),
                            accessorKey: key,

                            Cell: ({ cell }) => {
                                isCurrentDateWeekendId =
                                    cell.row.original.uniqueId == isCurrentDateWeekendId
                                        ? isCurrentDateWeekendId
                                        : "";
                                return (
                                    <div
                                        className={
                                            cell.row.original.uniqueId == isCurrentDateWeekendId &&
                                            "weekend-color"
                                        }
                                        align="right"
                                    >
                                        {cell.getValue()}
                                    </div>
                                );
                            },
                        };
                        subArray.push(obj);
                        newHeaders[i].columns = subArray;
                    }
                } else {
                    if (key == data.accessorKey) {
                        let obj = {
                            id: key,
                            header: value == "-" || value == null ? "" : <div>{value}</div>,
                            accessorKey: key,

                            Cell: ({ cell }) => {
                                valueNw = cell.column.id == "tDate" ? cell.getValue() : "";
                                isCurrentDateWeekendId =
                                    cell.row.original.uniqueId == isCurrentDateWeekendId
                                        ? isCurrentDateWeekendId
                                        : "";
                                if (valueNw != "") {
                                    const regex = /\d/; // Regular expression to match any digit (number)
                                    const isDigit = regex.test(valueNw);
                                    if (isDigit) {
                                        const dateObject = moment(valueNw, "DD-MMM-YYYY").toDate();
                                        const dayOfWeek = dateObject.getDay(); // Returns a number (0 for Sunday, 1 for Monday, ..., 6 for Saturday)
                                        isCurrentDateWeekendId =
                                            dayOfWeek === 0 || dayOfWeek === 6
                                                ? cell.row.original.uniqueId
                                                : "";
                                    }
                                }

                                return (
                                    <div
                                        className={
                                            key != "name" && key != "billable" && key != "fte"
                                                ? cell.row.original.uniqueId ==
                                                isCurrentDateWeekendId && "weekend-color"
                                                : ""
                                        }
                                    >
                                        {key == "fte" ? (
                                            <div align="right">{cell.getValue()}</div>
                                        ) : key == "tDate" ? (
                                            <div align="center" style={{ minWidth: "80px" }}>
                                                {cell.getValue()}
                                            </div>
                                        ) : (
                                            <div
                                                className={
                                                    cell.column.id == "name" ||
                                                        cell.column.id == "billable"
                                                        ? cell.row.original.level == 0
                                                            ? "customer"
                                                            : cell.row.original.level == 1
                                                                ? "project"
                                                                : cell.row.original.level == 2
                                                                    ? "resource"
                                                                    : cell.row.original.level == 3 && "allocType"
                                                        : ""
                                                }
                                            >
                                                {cell.getValue()}
                                            </div>
                                        )}
                                    </div>
                                );
                            },
                        };
                        newHeaders[i].columns = [obj];
                    }
                }
            });
        });

        setColumns(newHeaders);
        let values = [];

        var targetId = "-1";
        var index = tableData?.findIndex(function (obj) {
            return obj.level === targetId;
        });
        tableData?.map((d) =>
            d.level != -2 && d.level != -3 ? values.push(d) : ""
        );

        let tempData = jsonToTree(values, { children: "subRows" });
        setNodes(tempData.slice(1, tempData.length));

        // console.log(jsonToTree(values, { children: "subRows" }), "nodes");
    };

    const jsonToTree = (flatArray, options) => {
        options = {
            id: "id",
            parentId: "parent",
            children: "subRows",
            ...options,
        };
        const dictionary = {}; // a hash table mapping to the specific array objects with their ids as key
        const tree = [];
        const children = options.children;
        flatArray.forEach((node) => {
            const nodeId = node[options.id];
            const nodeParentId = node[options.parentId];
            // set up current node data in dictionary
            dictionary[nodeId] = {
                [children]: [], // init a children property
                ...node, // add other propertys
                ...dictionary[nodeId], // children will be replaced if this node already has children property which was set below
            };
            dictionary[nodeParentId] = dictionary[nodeParentId] || { [children]: [] }; // if it's not exist in dictionary, init an object with children property
            dictionary[nodeParentId][children].push(dictionary[nodeId]); // add reference to current node object in parent node object
        });
        // find root nodes
        Object.values(dictionary).forEach((obj) => {
            if (typeof obj[options.id] === "undefined") {
                tree.push(...obj[children]);
            }
        });
        return tree;
    };

    const getDataTwo = () => {
        let tableData = reportsData.tableData;
        let columns = null;
        if (reportsData?.columns?.includes("'")) {
            columns = reportsData?.columns?.replaceAll("'", "");
        } else {
            columns = reportsData?.columns;
        }

        let dd = columns?.split(",");
        //let Indicators = ["course_1"];
        let colArr = null;

        if (dd != undefined) {
            colArr = [...dd];
        }
        let newHeaders = [];

        const obj = {};
        for (let i = 0; i < colArr?.length; i++) {
            let colVal = colArr[i].trim();

            let firstData = tableData[0];
            obj[colVal] = firstData[colVal];
        }

        let headerArray = Object.entries(obj);
        let unWantedCols = [
            "project_id",
            "resource_id",
            "lvl",
            "project_rowspan",
            "contract_term_rowspan",
            "resource_rowspan",
            "country_rowspan",
        ];
        let filteredHeaders = headerArray.filter(
            (d) => !unWantedCols.includes(d[0])
        );
        setHeaders(filteredHeaders);

        var numericRegex = /^[0-9]+$/;
        let C = tableData?.filter((d) => d.lvl == "0");
        filteredHeaders.map(([key, value], index) => {
            let digitH = numericRegex.test(value);
            // let A = value?.replace("<br>", "");
            newHeaders.push({
                accessorKey: key,
                header: value,
                enableColumnActions: false,
                enableHiding: true,
                Header: ({ column }) => (
                    <div className={digitH == false ? "mixer" : ""}>{value}</div>
                ),
            });
        });
        let subHeaders =
            C && Object.entries(C[0])?.filter((d) => !unWantedCols?.includes(d[0]));
        {
        }

        newHeaders.map((data) => {
            let i = newHeaders.indexOf(data);

            subHeaders.map(([key, value], index) => {
                if (key == data.accessorKey) {
                    let obj = {
                        id: key,
                        header: <div className={""}>{value == "-" ? "" : value}</div>,
                        accessorKey: key,

                        Cell: ({ cell }) => {
                            return (
                                <div>
                                    {cell.getValue() != null &&
                                        cell.getValue().split("_")[1] == "leave" ? (
                                        <span
                                            className="pink-for-leave align right datesColumn"
                                            title={Math.round(cell.getValue().split("_")[0])}
                                        >
                                            {Math.round(cell.getValue().split("_")[0])}
                                        </span>
                                    ) : cell.getValue().split("_")[1] == "overalloc" ? (
                                        <span
                                            className="lightpink-for-overalloc align right datesColumn"
                                            title={Math.round(cell.getValue().split("_")[0])}
                                        >
                                            {Math.round(cell.getValue().split("_")[0])}
                                        </span>
                                    ) : cell.getValue() == "0_holiday" ||
                                        cell.getValue() == "0.00_holiday" ? (
                                        <span
                                            className="blue-holiday align right datesColumn"
                                            title={Math.round(cell.getValue().split("_")[0])}
                                        >
                                            {Math.round(cell.getValue().split("_")[0])}
                                        </span>
                                    ) : cell.getValue().includes("_w") ? (
                                        <span
                                            className="disabledDatesColumn datesColumn weekendColor_PRRT"
                                            title={cell.getValue()}
                                        >
                                            {""}
                                        </span>
                                    ) : cell.column.id == "Total" ? (
                                        <div class="align right " title={Math.round(cell.getValue())}>
                                            {" "}
                                            {Math.round(cell.getValue())}
                                        </div>
                                    ) : cell.column.id == "country" ||
                                        cell.column.id == "dept_name" ||
                                        cell.column.id == "measure_name" ||
                                        cell.column.id == "project_name" ||
                                        cell.column.id == "contract_term" ||
                                        cell.column.id == "resource_name" ? (
                                        <div class="align left " title={cell.getValue()}>
                                            {" "}
                                            {cell.getValue() == "-" ? "" : cell.getValue()}
                                        </div>
                                    ) : (
                                        <div
                                            class="align right datesColumn"
                                            title={Math.round(cell.getValue())}
                                        >
                                            {" "}
                                            {Math.round(cell.getValue())}
                                        </div>
                                    )}
                                </div>
                            );
                        },
                    };

                    newHeaders[i].columns = [obj];
                } else {
                }
            });
        });
        setColumns(newHeaders);

        let finalData = tableData?.filter((d) => d.lvl !== "-1" && d.lvl !== "0");

        setNodes(finalData);
    };

    // const exportPdf = () => {
    //     reportIdNw == 25
    //         ? printTwo()
    //         : print();
    // };

    const print = () => {
        const pdf = new jsPDF("l", "mm", "a3");
        const columnArr = colAr.map(key => reportsData.tableData[1][key]);
        let pdfData = JSON.parse(JSON.stringify(reportsData.tableData));
        pdfData = pdfData.slice(3);
        let rows = [];

        for (let i = 0; i < pdfData.length; i++) {
            let temp = colAr.map((d) => {
                const value = pdfData[i][d];
                let isOnlyDigits = /^-?[0-9]*\.?[0-9]*$/.test(value);
                const floatValue = (isOnlyDigits == true && value != "") ? parseFloat(value) : "";
                return (isOnlyDigits == true) ? floatValue.toLocaleString('en-US') : value;
            });

            rows.push(temp);
        }
        const columnWidths = [30, 30, 30, 30, 30, 30,];
        pdf.text(15, 30, fileName);
        const colStyles = {
            0: { cellWidth: columnWidths[0] },
            1: { cellWidth: columnWidths[1] },
            2: { cellWidth: columnWidths[2] },
            3: { cellWidth: columnWidths[3] },
            4: { cellWidth: columnWidths[4] },
            5: { cellWidth: columnWidths[5] },
        };
        pdf.autoTable(columnArr, rows, {
            startY: 34,
            theme: "grid",
            styles: {
                font: "times",
                halign: "center",
                cellPadding: 1,
                lineWidth: 0.5,
                lineColor: [0, 0, 0],
                textColor: [0, 0, 0],
            },
            headStyles: {
                textColor: [0, 0, 0],
                fontStyle: "normal",
                lineWidth: 0.5,
                lineColor: [0, 0, 0],
                fillColor: [166, 204, 247],
            },
            alternateRowStyles: {
                fillColor: [212, 212, 212],
                textColor: [0, 0, 0],
                lineWidth: 0.5,
                lineColor: [0, 0, 0],
            },
            rowStyles: {
                lineWidth: 0.5,
                lineColor: [0, 0, 0],
            },
            tableLineColor: [0, 0, 0],
            columnStyles: colStyles,
        });
        pdf.save(fileName);
    };

    const printTwo = () => {
        const pdf = new jsPDF("l", "mm", "a3");
        const data = reportsData.tableData;
        const columnArr = headers.map((d) => d[1]);
        let rows = [];

        for (let i = 1; i < data.length; i++) {
            let temp = headers.map((d) => {
                const value = data[i][d[0]];
                let isOnlyDigits = /^-?[0-9]*\.?[0-9]*$/.test(value);
                const floatValue =
                    isOnlyDigits == true && value != "" ? parseFloat(value) : "";
                return isOnlyDigits == true
                    ? floatValue.toLocaleString("en-US")
                    : value;
            });
            rows.push(temp);
        }
        const columnWidths = [30, 30, 30, 30, 30, 30, 30, 30];
        pdf.text(15, 30, fileName);
        const colStyles = {
            0: { cellWidth: columnWidths[0] },
            1: { cellWidth: columnWidths[1] },
            2: { cellWidth: columnWidths[2] },
            3: { cellWidth: columnWidths[3] },
            4: { cellWidth: columnWidths[4] },
            5: { cellWidth: columnWidths[5] },
            6: { cellWidth: columnWidths[6] },
            7: { cellWidth: columnWidths[7] },
        };

        pdf.autoTable(columnArr, rows, {
            startY: 34,
            theme: "grid",
            styles: {
                font: "times",
                halign: "center",
                cellPadding: 1,
                lineWidth: 0.5,
                lineColor: [0, 0, 0],
                textColor: [0, 0, 0],
            },
            headStyles: {
                textColor: [0, 0, 0],
                fontStyle: "normal",
                lineWidth: 0.5,
                lineColor: [0, 0, 0],
                fillColor: [166, 204, 247],
            },
            alternateRowStyles: {
                fillColor: [212, 212, 212],
                textColor: [0, 0, 0],
                lineWidth: 0.5,
                lineColor: [0, 0, 0],
            },
            rowStyles: {
                lineWidth: 0.5,
                lineColor: [0, 0, 0],
            },
            tableLineColor: [0, 0, 0],
            columnStyles: colStyles,
        });
        pdf.save(fileName);
    };

    const exportExcel = () => {
        let node = reportsData.tableData;
        node = node.slice(1);
        let desiredColumnOrder = [];
        desiredColumnOrder = colAr;
        const wantedValues = node.slice(1).map((item) => {
            const obj = {};
            desiredColumnOrder.forEach((col) => {
                let colss = col;
                const value = item[colss];
                if (typeof value === "string") {
                    obj[colss] = value == "-"
                        ? ""
                        : value.includes("-H") ? value.split("-").pop() : value;
                } else {
                    obj[colss] = value;
                }
            });
            return obj;
        });
        const rows = wantedValues.map((item) => {
            const row = [];
            desiredColumnOrder.forEach((col) => {
                row.push(item[col]);
            });
            return row;
        });

        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet("TimesheetDetailedReport");
        wantedValues.forEach((item) => {
            const row = worksheet.addRow(Object.values(item));
        });
        const boldRow = [1, 2];
        boldRow.forEach((index) => {
            const row = worksheet.getRow(index);
            row.font = { bold: true };
        });
        workbook.xlsx.writeBuffer().then((buffer) => {
            saveAs(new Blob([buffer]), "Timesheet Detailed Report.xlsx");
        });
    };

    const exportExcelTwo = () => {
        let node = reportsData.tableData;
        const colArr = headers.map((d) => d[0]);
        let desiredColumnOrder = [];
        desiredColumnOrder = colArr;
        const wantedValues = node.map((item) => {
            const obj = {};
            desiredColumnOrder.forEach((col) => {
                let colss = col;
                const value = item[colss];
                if (typeof value === "string") {
                    obj[colss] = (value == "-" || value.includes("_w")) ? "" : value.split("-").pop();
                } else {
                    obj[colss] = value;
                }
            });
            return obj;
        });

        const rows = wantedValues.map((item) => {
            const row = [];
            desiredColumnOrder.forEach((col) => {
                row.push(item[col]);
            });
            return row;
        });

        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet("ProjectResourceReport");
        wantedValues.forEach((item) => {
            const row = worksheet.addRow(Object.values(item));
        });
        const boldRow = [1, 2];
        boldRow.forEach((index) => {
            const row = worksheet.getRow(index);
            row.font = { bold: true };
        });
        workbook.xlsx.writeBuffer().then((buffer) => {
            saveAs(new Blob([buffer]), "Project Resource Report.xlsx");
        });
    };

    return (
        <div
            className={
                reportIdNw == 12
                    ? "timesheet-details-report-table  materialreact-details-report-table"
                    : "projectResource-report-table  materialreact-details-report-table"
            }
        >
            <div className="materialReactExpandableTable   darkHeader">
                {columns?.length ? (
                    <MaterialReactTable
                        columns={columns}
                        data={nodes}
                        enableExpandAll={true} //hide expand all double arrow in column header
                        enableExpanding={reportIdNw == 12 ? true : false}
                        enablePagination={true}
                        enableBottomToolbar={true}
                        enableTopToolbar={true}
                        enableColumnActions={false}
                        enableSorting={false}
                        defaultColumn={{ minSize: 40, maxSize: 1000, size: 40 }} //units are in px
                        pageSize={25}
                        muiTableContainerProps={{
                            sx: {
                                maxHeight: `${maxHeight - 76}px`,
                            },
                        }}
                        muiTableBodyProps={{
                            sx: {
                                "&": {
                                    borderRight: "1px solid #ccc",
                                    borderBottom: "1px solid #ccc",
                                },
                                "& td": {
                                    borderTop: "1px solid #ccc",
                                    borderRight: "1px solid #ccc",
                                    fontSize: "12px",
                                },
                                "& td:nth-of-type(2)": {
                                    minWidth: "280px",
                                    maxWidth: "280px",
                                },
                                "& tr:first-of-type td": {
                                    background: "#f5d5a7 ",
                                },
                            },
                        }}
                        muiTableHeadProps={{
                            sx: {
                                "& th": {
                                    borderTop: "1px solid #ccc",
                                    borderRight: "1px solid #ccc",
                                    background: "#f4f4f4 ",
                                    fontSize: "12px",
                                },
                                "& th:nth-of-type(2)": {
                                    minWidth: "280px",
                                    maxWidth: "280px",
                                },
                            },
                        }}
                        renderTopToolbar={({ table }) => (
                            <>
                                {reportsHeader}
                                <div className="excel-alignment">
                                    <div className="legendContainer ">
                                        <div
                                            className={
                                                reportIdNw == 12 ? "legend blueNew" : "legend blueNew"
                                            }
                                        >
                                            <div className="legendCircle"></div>
                                            {reportIdNw == 12 ? (
                                                <div className="legendTxt"> Weekend</div>
                                            ) : (
                                                <div className="legendTxt"> Holiday</div>
                                            )}
                                        </div>
                                        <div
                                            className={
                                                reportIdNw == 12 ? "legend greenNew" : "legend greenNew"
                                            }
                                        >
                                            <div className="legendCircle"></div>
                                            {reportIdNw == 12 ? (
                                                <div className="legendTxt"> Customer</div>
                                            ) : (
                                                <div className="legendTxt"> Leave</div>
                                            )}
                                        </div>
                                        <div
                                            className={
                                                reportIdNw == 12
                                                    ? "legend purpleNew"
                                                    : "legend purpleNew"
                                            }
                                        >
                                            <div className="legendCircle"></div>
                                            {reportIdNw == 12 ? (
                                                <div className="legendTxt"> Project</div>
                                            ) : (
                                                <div className="legendTxt"> Over Allocated</div>
                                            )}
                                        </div>
                                        {reportIdNw == 12 ? (
                                            <div className="legend orangeNew">
                                                <div className="legendCircle"></div>
                                                <div className="legendTxt"> Resource</div>
                                            </div>
                                        ) : (
                                            ""
                                        )}
                                    </div>
                                    <div className="excelandpdf-alignment">
                                        <span
                                            className="pi pi-file-excel excel"
                                            onClick={reportIdNw == 12 ? exportExcel : exportExcelTwo}
                                            title="Export to Excel"
                                        />
                                        {/* <span
                                            className="pi pi-file-pdf pdf"
                                            onClick={exportPdf}
                                            title="Export to PDF"
                                        /> */}
                                    </div>
                                </div>
                            </>
                        )}
                    />
                ) : null}
            </div>
        </div>
    );
}
