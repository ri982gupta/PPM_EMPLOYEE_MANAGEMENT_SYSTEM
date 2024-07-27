import React, { useState, useEffect } from 'react';
import { RiFileExcel2Line } from "react-icons/ri";
import * as XLSX from 'xlsx'
import ReactPaginate from 'react-paginate';
import './EngagementSearch.scss'


function SearchTable(props) {
    const { tabledata, SetTableData, searchTableData } = props
    const [filterValue, setFilterValue] = useState('');
    const [displayTable, setDisplayTable] = useState(null)
    const [order, setOrder] = useState("ASC");
    const [getData, setGetData] = useState(10);
    const [currentItem, setCurrentItem] = useState(0);
    const [pageCount, setpageCount] = useState(1);
    const [itemOffSet, setItemOffSet] = useState(0);
    const itemPerPage = getData;
    const [finalRow, setFinalRow] = useState(itemPerPage);
    const totalRows = tabledata.length;
    const Firstrow = itemOffSet + 1;

    useEffect(() => {
        const endOffset = itemOffSet + itemPerPage;
        const length = tabledata.slice(itemOffSet, endOffset);

        if (endOffset > totalRows) {
            setFinalRow(totalRows);
        }
        else {
            setFinalRow(endOffset);
        }
        setCurrentItem(length);
        setpageCount(Math.ceil(tabledata.length / itemPerPage));
        displayTableFnc(length)
    }, [tabledata, itemOffSet, itemPerPage, getData, pageCount])

    //replace the names with the postman output names
    let keys = [
        "EngagementName",
        "Business Unit",
        "Customer",
        "Cost Center",
        "Manager",
        "Sales Executive",
        "Contract Terms",
        "Start Date",
        "End Date",
        "Engagement Company",
        "Status"

    ]

    const displayTableFnc = (dt) => {
        setDisplayTable(() => {
            return dt == "" ? <tr><td colSpan={16} >No Records Found</td></tr> : dt?.map((element, index) => {
                let tabData = []
                keys.forEach((inEle, inInd) => {
                    if (inEle == "Status") {
                        tabData.push(<td >{element[inEle] == true ? "Active" : "Inactive"}</td>);
                    }
                    else {
                        tabData.push(<td className='ellpss' title={element[inEle]} >{element[inEle]}</td>);
                    }
                })
                return <tr key={index}>{tabData}</tr>
            })
        })

    }
    useEffect(() => {
        displayTableFnc();
    }, [])

    const Sorting = (col) => {
        if (order === "ASC") {
            const Sorted = [...tabledata].sort((a, b) =>
                a[col]?.toLowerCase() > b[col]?.toLowerCase() ? 1 : -1
            );
            SetTableData(Sorted);
            setOrder("DSC");
        }
        if (order === "DSC") {
            const Sorted = [...tabledata].sort((a, b) =>
                a[col]?.toLowerCase() < b[col]?.toLowerCase() ? 1 : -1
            );
            SetTableData(Sorted);
            setOrder("ASC");
        }
    };

    const handleFilter = (e) => {
        if (e.target.value == '') {
            SetTableData(searchTableData)
        }
        else {
            const filterResult = searchTableData.filter(items =>
                items.EngagementName.toLowerCase().includes(e.target.value.toLowerCase()) ||
                items.BusinessUnit.toLowerCase().includes(e.target.value.toLowerCase()) ||
                items.Customer.toLowerCase().includes(e.target.value.toLowerCase()) ||
                items.costCenter.toLowerCase().includes(e.target.value.toLowerCase()) ||
                items.Manager.toLowerCase().includes(e.target.value.toLowerCase()) ||
                items.SalesExecutive.toLowerCase().includes(e.target.value.toLowerCase()) ||
                items.ContractTerms.toLowerCase().includes(e.target.value.toLowerCase()) ||
                items.StartDate.toLowerCase().includes(e.target.value.toLowerCase()) ||
                items.EndDate.toLowerCase().includes(e.target.value.toLowerCase()) ||
                items.EngagementCompany.toLowerCase().includes(e.target.value.toLowerCase()) ||
                items.Status.toLowerCase().includes(e.target.value.toLowerCase())
            )
            SetTableData(filterResult)
        }
        setFilterValue(e.target.value)
    }

    const handleOnExport = () => {
        var wb = XLSX.utils.book_new(tabledata),
            ws = XLSX.utils.json_to_sheet(tabledata);
        XLSX.utils.book_append_sheet(wb, ws, "Engagement Search.xlsx");
        XLSX.writeFile(wb, "Engagement Search.xlsx");
    };

    const handlePageClick = (click) => {
        const newOffSet = (click.selected * itemPerPage) % tabledata.length;
        setItemOffSet(newOffSet);
    }

    const itemRender = (current, type, originalElement) => {
        if (type === "prev") {
            return <a>Previous</a>;
        }
        if (type === "next") {
            return <a>Next</a>;
        }
        return originalElement;
    };
    const onChangePractice = (e) => {
        const { value, id } = e.target
        setGetData(value);

    }

    return (
        <div className='customCard'>
            <div className='form-group row'>
                <div className='col-2' >
                    <label >Show <select name="vendors_length" aria-controls="vendors" onChange={(e) => { onChangePractice(e) }}>
                        <option value="10">10</option>
                        <option value="20">20</option>
                        <option value="30">30</option>
                        <option value="40">40</option>
                        <option value="50">50</option>
                        <option value="100">100</option>
                    </select> entries
                    </label>
                </div>
                <div className='col-3'></div>
                <div className='col-3'></div>
                <div className='col-3'>
                    <label>Search :<input type="search" value={filterValue} onChange={(e) => handleFilter(e)}></input>&nbsp;
                        <RiFileExcel2Line size="1.5em" title='Export to Excel' cursor="pointer" />
                    </label>
                </div>
            </div>
            <div class="form-group">
                <table className="table table-bordered" role="grid" >
                    <tbody className='table_Body'>
                        <tr>
                            <th onClick={() => Sorting("EngagementName")}>Engagement Name</th>
                            <th onClick={() => Sorting("BusinessUnit")}>Business Unit</th>
                            <th onClick={() => Sorting("Customer")}>Customer</th>
                            <th onClick={() => Sorting("CostCenter")}>Cost Center</th>
                            <th onClick={() => Sorting("Manager")}>Manager</th>
                            <th onClick={() => Sorting("SalesExecutive")}>Sales Executive</th>
                            <th onClick={() => Sorting("ContractTerms")}>Contract Terms</th>
                            <th onClick={() => Sorting("StartDate")}>Start Date</th>
                            <th onClick={() => Sorting("EndDate")}>End Date</th>
                            <th onClick={() => Sorting("EngagementCompany")}>Engagement Company</th>
                            <th onClick={() => Sorting("Status")}>Status</th>
                        </tr>
                        {displayTable}</tbody>
                </table>
                <div className='form-group row'>
                    <div className='col-4'></div>
                    <div className='col-4 pagination justify-content-center' >
                        <label ><ReactPaginate
                            previousLabel={"Previous"}
                            nextLabel={"Next"}
                            pageCount={pageCount}
                            pageRangeDisplayed={5}
                            onPageChange={handlePageClick}
                            containerClassName={"pagination"}
                            pageClassName={'page-item'}
                            pageLinkClassName={'pagination__link'}
                            previousClassName={'pagination__link'}
                            previousLinkClassName={'pagination__link'}
                            disabledClassName={"pagination__link--disabled"}
                            nextClassName={'pagination__link-item'}
                            nextLinkClassName={'papagination__link'}
                            breakClassName={'pagination__link'}
                            breakLinkClassName={'pagination__link'}
                            activeClassName={'pagination__link--active'}
                            renderOnZeroPageCount={null}
                        />
                        </label>
                    </div>
                    <div className='col-4' >
                        <label >showing {Firstrow} to {finalRow} of {totalRows} entries
                        </label>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SearchTable;