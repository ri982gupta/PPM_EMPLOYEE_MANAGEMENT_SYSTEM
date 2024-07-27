import React, { useEffect, useRef, useState } from "react";
import { FilterMatchMode, FilterOperator } from "primereact/api";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import "primeicons/primeicons.css";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.css";
import "primeflex/primeflex.css";
import { InputText } from "primereact/inputtext";

import "../PrimeReactTableComponent/PrimeReactTable.scss"
import { Link } from "react-router-dom";
import { Button } from 'primereact/button';

function IssuesTable(props) {
    const {
        data,
        rows,
        col,
        headerdatagroup,
        linkColumns,
        linkColumnsRoutes,
        dynamicColumns,
        headerData,
        setHeaderData,
        exportData,
        customFilters,
        customFilterValue,
        setCustomFilterValue
    } = props;
    const [mainData, setMainData] = useState([]);
    const [bodyData, setBodyData] = useState([]);
    const [exportColumns, setExportColumns] = useState([])
    const dt = useRef(null);
    useEffect(() => {
        console.log(data)
        setMainData(JSON.parse(JSON.stringify(data)));
    }, [data]);

    useEffect(() => {
        if (mainData.length > 0) {
            setHeaderData(mainData[0]);
            setBodyData(mainData.splice(1));

            let dtt = [];
            let headDt = mainData[0];

            Object.keys(headDt).forEach(d => {
                dtt.push({ title: d, dataKey: headDt[d] });
            })

            setExportColumns(dtt);

            console.log(mainData);
        }
    }, [mainData]);

    const filtersData = {
        contains: { value: null, matchMode: FilterMatchMode.CONTAINS },
    };

    const [filters1, setFilters1] = useState({
        global: filtersData["contains"],
    });

    useEffect(() => {
        setFilters1({
            global: filtersData["contains"],
        });
    }, [headerData]);
    const [globalFilterValue1, setGlobalFilterValue1] = useState("");

    const clearFilter1 = () => {
        initFilters1();
    };

    const initFilters1 = () => {
        setGlobalFilterValue1("");
    };

    const onGlobalFilterChange1 = (e) => {
        const value = e.target.value;
        let _filters1 = { ...filters1 };
        _filters1["global"].value = value;
        setFilters1(_filters1);
        setGlobalFilterValue1(value);
    };




    const RenderCustomFilters = () => {

        let cstFtlrs = customFilters;

        switch (cstFtlrs["type"]) {
            case "select":
                return <select id={cstFtlrs["id"]} onChange={(e) => { setCustomFilterValue(e.target.value); }} >
                    {Object.keys(cstFtlrs["data"]).map(d => {
                        return <option selected={customFilterValue == d ? true : false} value={d}>{cstFtlrs["data"][d]}</option>;
                    })}</select>
                break;

            default:
                break;
        }
    }


    const exportCSV = (selectionOnly) => { dt.current.exportCSV({ selectionOnly }); };
    const saveAsExcelFile = (buffer, fileName) => { import('file-saver').then((module) => { if (module && module.default) { let EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8'; let EXCEL_EXTENSION = '.xlsx'; const data1 = new Blob([buffer], { type: EXCEL_TYPE }); module.default.saveAs(data1, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION); } }); };
    const exportExcel = () => { import('xlsx').then((xlsx) => { const worksheet = xlsx.utils.json_to_sheet(data); const workbook = { Sheets: { data: worksheet }, SheetNames: ['data'] }; const excelBuffer = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' }); saveAsExcelFile(excelBuffer, 'Project Issues'); }); };
    const exportPdf = () => { import('jspdf').then((jsPDF) => { import('jspdf-autotable').then(() => { const doc = new jsPDF.default(0, 0); doc.autoTable(exportColumns, data); doc.save('Data.pdf'); }); }); };
    const renderHeader1 = () => {
        return (
            <div className="flex  flex-row-reverse">
                {customFilters != undefined && <span><RenderCustomFilters /></span>}

                <div className="exportBtn ml-3">
                    {exportData?.includes("CSV") && <span className="pi pi-file csv" onClick={() => exportCSV(false)} title="CSV" />}
                    {exportData?.includes("XLS") && <span className="pi pi-file-excel excel" onClick={exportExcel} title="XLS" />}
                    {exportData?.includes("PDF") && <span className="pi pi-file-pdf pdf" onClick={exportPdf} title="PDF" />}
                </div>
                <span className="p-input-icon-left tableGsearch">
                    <i className="pi pi-search" />
                    <InputText
                        defaultValue={globalFilterValue1}
                        onChange={onGlobalFilterChange1}
                        placeholder="Keyword Search"
                    />
                </span>
            </div>
        );
    };

    const header1 = renderHeader1();

    return (
        <div>
            <div className="card">
                {Object.keys(headerData).length > 0 && (
                    <DataTable

                        value={bodyData}
                        paginator
                        showGridlines
                        rows={rows}
                        dataKey="id"
                        filters={filters1}
                        responsiveLayout="scroll"
                        header={header1}
                        emptyMessage="No Records found."
                        ref={(el) => { dt.current = el; }}
                        className="customerEngament"
                    >
                        {/* <Column header={headerdatagroup} colSpan={col} /> */}

                        {dynamicColumns}
                    </DataTable>
                )}
            </div>
        </div>
    );
}

export default IssuesTable;
