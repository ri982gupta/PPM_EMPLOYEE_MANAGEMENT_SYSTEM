import React, { useState, useRef } from "react";
import MaterialReactTable from "material-react-table";
import { useEffect } from "react";
import moment from "moment";
import Loader from "../Loader/Loader";
import { environment } from "../../environments/environment";
import { FaChevronCircleRight, FaChevronCircleDown } from "react-icons/fa";
import axios from "axios";
import './FinancialsTable.scss'

export default function FinancialsTable(props) {
    const [projectId, setProjectId] = useState();
    const {
        tableData,
        column,
        departments,
        month,
        startDate,
        duration,
        customerId,
        project,
        customer,
        resources,
    } = props;
    // console.log(column, "column>>>>>>>>>>>>>>")
    const baseUrl = environment.baseUrl;
    const abortController = useRef(null);
    const [loader, setLoader] = useState(false);
    const name = column[0];
    const kpi = column[1];
    const handleAbort = () => {
        abortController.current && abortController.current.abort();
        setLoader(false);
    };

    // console.log("slice>>>", column.slice(2).sort())
    const dates = column.slice(2).sort();
    // console.log(dates, "dates........")
    const adjustedColumn = [name, kpi, ...dates, "Total"];
    const [data, setData] = useState(adjustedColumn);
    // console.log("column>>>>>>>>>>>", adjustedColumn)

    const [nodes, setNodes] = useState([]);
    useEffect(() => {
        setData(adjustedColumn);

    }, [props.column]);
    useEffect(() => {
        let id = 1;
        for (let i = 0; i < tableData?.length; i++) {
            tableData[i].id = id;
            id++;
            if (id % 10000 == 17) {
                id += 9984;
            }
        }

        setNodes(jsonToTree(tableData));
    }, [tableData]);

    const jsonToTree = (flatArray, options) => {
        options = {
            id: "id",
            parentId: "parentId",
            children: "subRows",
            ...options,
        };
        const dictionary = {};
        const tree = [];
        const children = options.children;
        flatArray.forEach((node) => {
            const nodeId = node[options.id];
            const nodeParentId = node[options.parentId];
            dictionary[nodeId] = {
                [children]: [],
                ...node,
                ...dictionary[nodeId],
            };
            dictionary[nodeParentId] = dictionary[nodeParentId] || { [children]: [] };
            dictionary[nodeParentId][children].push(dictionary[nodeId]);
        });

        Object.values(dictionary).forEach((obj) => {
            if (typeof obj[options.id] === "undefined") {
                tree.push(...obj[children]);
            }
        });
        return tree;
    };




    {

        /*-------------------------------------For Getting Customer's According to BU------------------------------ */

    }

    const HandleInsertedData = (objId, objLabel, innerColumn) => {

        abortController.current = new AbortController();

        axios({

            method: "post",
            url: baseUrl + '/customersms/Financials/getFinancials',

            data: {


                "indTypesId": -1,
                "indTypes": -1,
                "dpResId": -1,
                "dpRes": -1,
                "cslResId": -1,
                "cslRes": -1,
                "engComp": -1,
                "contTerms": -1,
                "engCountries": -1,
                "source": -1,
                "resTyp": -1,
                "custCountries": -1,
                "sortBy": -1,
                "salesExecs": -1,
                "salesExecId": -1,
                "measures": -1,
                "resId": -1,
                "prjId": -1,
                "custId": customerId,
                "busUnitId": -1,
                "tarType": "Project",
                "srcTypeId": customerId,
                "srcType": "Customer",
                "customers": customerId,
                "busUnits": -1,
                "searchType": "Customer",
                "countries": -1,
                "duration": duration,
                "month": startDate,
                "ownerDivisions": -1,
                "direction": ""



            },

            signal: abortController.current.signal,

        })

            .then((res) => {

                setLoader(false);

                let respData = res.data.data;

                respData = respData.map((item) => {

                    return {

                        ...item,

                        name: item.name + "_" + objId + "_" + innerColumn,

                    };

                });

                setNodes((prevNodes) => {

                    const grossMarginIndex = prevNodes.findIndex((node) => {

                        return node.descr === "Planned Revenue" && node.name === objLabel;

                    });

                    if (grossMarginIndex !== -1) {

                        return [

                            ...prevNodes.slice(0, grossMarginIndex + 1),

                            ...respData.map((data, i) => ({ ...data, id: objId + i + 1 })),

                            ...prevNodes.slice(grossMarginIndex + 1),

                        ];

                    } else {

                        return prevNodes;

                    }

                });


            })

            .catch((e) => {

                setLoader(false);

                console.log("Error :", e);

            });

    };

    useEffect(() => {
        HandleInsertedData()
    }, []);



    const HandleInsertedData1 = (
        objId,
        objLabel,
        innerColumn,
        source,
        custBU


    ) => {

        setProjectId(objId);
        abortController.current = new AbortController();
        axios({
            method: "post",
            url:
                baseUrl +
                `/revenuemetricsms/RevenueMarginAnalysis/GetFinancialsFinalData`,
            data: {
                "indTypesId": -1,
                "indTypes": -1,
                "dpResId": -1,
                "dpRes": -1,
                "cslResId": -1,
                "cslRes": -1,
                "engComp": -1,
                "contTerms": -1,
                "engCountries": -1,
                "source": -1,
                "resTyp": -1,
                "custCountries": -1,
                "sortBy": -1,
                "salesExecs": -1,
                "salesExecId": -1,
                "measures": -1,
                "resId": -1,
                "prjId": objId,
                "custId": custBU,
                "busUnitId": -1,
                "tarType": "BusinessUnit",
                "srcTypeId": objId,
                "srcType": "Project",
                "customers": custBU,
                "busUnits": -1,
                "searchType": "Customer",
                "countries": -1,
                "duration": duration,
                "month": startDate,
                "ownerDivisions": -1
            },
            signal: abortController.current.signal,
        })
            .then((res) => {
                setLoader(false);
                let respData = res.data.data;
                respData = respData.map((item) => {
                    return {
                        ...item,
                        name: item.name + "_" + objId + "_" + innerColumn + "_" + custBU,
                    };
                });
                setNodes((prevNodes) => {
                    const grossMarginIndex = prevNodes.findIndex((node) => {
                        return (
                            node.kpi === "Planned Revenue" &&
                            node.name.split("_")[0] === objLabel
                        );
                    });
                    if (grossMarginIndex !== -1) {
                        return [
                            ...prevNodes.slice(0, grossMarginIndex + 1),
                            ...respData.map((data, i) => ({ ...data, id: objId + i + 1 })),
                            ...prevNodes.slice(grossMarginIndex + 1),
                        ];
                    } else {
                        return prevNodes;
                    }
                });

            })
            .catch((e) => {
                setLoader(false);
                console.log("Error :", e);
            });
    };
    useEffect(() => {
        HandleInsertedData1()
    }, []);

    const HandleInsertedData2 = (
        objId,
        objLabel,
        innerColumn,
        source,
        custBU,
        custId
    ) => {

        abortController.current = new AbortController();
        axios({
            method: "post",
            url:
                baseUrl +
                `/customersms/Financials/getFinancials`,
            data: {
                "indTypesId": -1,
                "indTypes": -1,
                "dpResId": -1,
                "dpRes": -1,
                "cslResId": -1,
                "cslRes": -1,
                "engComp": -1,
                "contTerms": -1,
                "engCountries": -1,
                "source": -1,
                "resTyp": -1,
                "custCountries": -1,
                "sortBy": -1,
                "salesExecs": -1,
                "salesExecId": -1,
                "measures": -1,
                "resId": -1,
                "prjId": projectId,
                "custId": custBU,
                "busUnitId": objId,
                "tarType": "Res",
                "srcTypeId": objId,
                "srcType": "BusinessUnit",
                "customers": custBU,
                "busUnits": -1,
                "searchType": "Customer",
                "countries": -1,
                "duration": duration,
                "month": startDate,
                "ownerDivisions": -1
            },
            signal: abortController.current.signal,
        })
            .then((res) => {
                setLoader(false);
                let respData = res.data.data;
                respData = respData.map((item) => {
                    return {
                        ...item,
                        name:
                            item.name +
                            "_" +
                            objId +
                            "_" +
                            innerColumn +
                            "_" +
                            custBU +
                            "_" +
                            custId,
                    };
                });
                setNodes((prevNodes) => {
                    const grossMarginIndex = prevNodes.findIndex((node) => {
                        return (
                            node.kpi === "Planned Revenue" &&
                            node.name.split("_")[0] === objLabel
                        );
                    });
                    if (grossMarginIndex !== -1) {
                        return [
                            ...prevNodes.slice(0, grossMarginIndex + 1),
                            ...respData.map((data, i) => ({ ...data, id: objId + i + 1 })),
                            ...prevNodes.slice(grossMarginIndex + 1),
                        ];
                    } else {
                        return prevNodes;
                    }
                });
            })
            .catch((e) => {
                setLoader(false);
                console.log("Error :", e);
            });
    };

    useEffect(() => {
        HandleInsertedData2()
    }, []);

    const HandleInsertedData3 = (
        objId,
        objLabel,
        innerColumn,
        source,
        custBU,
        projectID,
        custprojectId
    ) => {
        abortController.current = new AbortController();
        axios({
            method: "post",
            url:
                baseUrl +
                `/customersms/Financials/getFinancials`,
            data: {
                "indTypesId": -1,
                "indTypes": -1,
                "dpResId": -1,
                "dpRes": -1,
                "cslResId": -1,
                "cslRes": -1,
                "engComp": -1,
                "contTerms": -1,
                "engCountries": -1,
                "source": -1,
                "resTyp": -1,
                "custCountries": -1,
                "sortBy": -1,
                "salesExecs": -1,
                "salesExecId": -1,
                "measures": -1,
                "resId": -1,
                "prjId": custprojectId,
                "custId": custBU,
                "busUnitId": projectID,
                "tarType": innerColumn,
                "srcTypeId": objId,
                "srcType": source,
                "customers": custBU,
                "busUnits": -1,
                "searchType": "Customer",
                "countries": -1,
                "duration": duration,
                "month": startDate,
                "ownerDivisions": -1
            },
            signal: abortController.current.signal,
        })
            .then((res) => {
                setLoader(false);
                let respData = res.data.data;
                respData = respData.map((item) => {
                    return {
                        ...item,
                        name: item.name + "_" + objId + "_" + innerColumn + "_" + custBU,
                    };
                });
                setNodes((prevNodes) => {
                    const grossMarginIndex = prevNodes.findIndex((node) => {
                        return (
                            node.kpi === "Planned Revenue" &&
                            node.name.split("_")[0].replace(/\s+/g, " ") ===
                            objLabel.replace(/\s+/g, " ")
                        );
                    });
                    if (grossMarginIndex !== -1) {
                        return [
                            ...prevNodes.slice(0, grossMarginIndex + 1),
                            ...respData.map((data, i) => ({ ...data, id: objId + i + 1 })),
                            ...prevNodes.slice(grossMarginIndex + 1),
                        ];
                    } else {
                        return prevNodes;
                    }
                });
            })
            .catch((e) => {
                setLoader(false);
                console.log("Error :", e);
            });
    };

    useEffect(() => {
        HandleInsertedData3()
    }, []);

    const dynamicColumns = [
        {
            header: (
                // <div className="header-label">BU Customer Project Res</div>
                <div className="legendContainer wrap">

                    <div className="legend green">
                        <div className="legendCircle"></div>
                        <div className="legendTxt"><b>Customer</b></div>
                    </div>
                    <div className="legend" >
                        <div className="legendCircle" style={{ backgroundColor: '#800080' }}></div>
                        <div className="legendTxt"><b>Project</b></div>
                    </div>

                    <div className="legend ">
                        <div className="legendCircle" style={{ backgroundColor: '#e17658' }}></div>
                        <div className="legendTxt"><b>BU</b></div>
                    </div>

                    <div className="legend black">
                        <div className="legendCircle"></div>
                        <div className="legendTxt"><b>Res</b></div>
                    </div>

                </div>
            ), accessorKey: `name`,
            enableGrouping: false,
            GroupedCell: ({ cell }) => {

                const department = customer.find(
                    (dep) => dep.fullName === cell.getValue()
                );

                const [activeIcons, setActiveIcons] = useState({});

                const handleClick = () => {
                    if (department) {

                        const { id, fullName } = department;

                        const isDataPresent = nodes.some((node) => {

                            return node.name.includes(`_${id}`);

                        });
                        if (isDataPresent) {

                            setActiveIcons((prevActiveIcons) => ({

                                ...prevActiveIcons,

                                [id]: false,

                            }));

                            setNodes((prevNodes) =>

                                prevNodes.filter((node) => !node.name.includes(`_${id}`))

                            );

                        } else {

                            setActiveIcons((prevActiveIcons) => ({

                                ...prevActiveIcons,

                                [id]: true,

                            }));

                            setLoader(true);

                            HandleInsertedData(id, fullName, "Project");

                        }

                    }

                };


                //--------------------//----------------------//-----------------------First Child Layer (Project)




                let custBU;

                const cust = project.find((dep) => {

                    if (dep.name === cell.getValue().split("_")[0]) {

                        const value = cell.getValue().split("_")[1];

                        custBU = value;

                    }

                    return dep.name === cell.getValue().split("_")[0];

                });




                const [activeIcons1, setActiveIcons1] = useState({});




                const handleClick1 = () => {
                    if (cust) {

                        const { id, name } = cust;

                        const isDataPresent = nodes.some((node) => {

                            return node.name.includes(`_${id}`);

                        });
                        if (isDataPresent) {

                            setActiveIcons1((prevActiveIcons) => ({

                                ...prevActiveIcons,

                                [id]: false,

                            }));

                            setNodes((prevNodes) =>

                                prevNodes.filter((node) => !node.name.includes(`_${id}`))

                            );

                        } else {

                            setActiveIcons1((prevActiveIcons) => ({

                                ...prevActiveIcons,

                                [id]: true,

                            }));

                            setLoader(true);

                            HandleInsertedData1(id, name, "BusinessUnit", "Customer", custBU);

                        }

                    }

                };

                // //--------------------//----------------------//-----------------------Second Child Layer (BU)

                let projBU;
                let custId;
                const proj = departments.find((dep) => {
                    if (dep.label === cell.getValue().split("_")[0]) {
                        const value = cell.getValue().split("_")[3];
                        projBU = value;
                        custId = cell.getValue().split("_")[1];
                    }
                    return (
                        dep.label.split("_")[0] === cell.getValue().split("_")[0] ||
                        dep.label.split("_")[0] === cell.getValue().split("_")[0]
                    );
                });

                const [activeIcons2, setActiveIcons2] = useState({});

                const handleClick2 = () => {
                    if (proj) {
                        const { value, label } = proj;
                        const isDataPresent = nodes.some((node) => {
                            return node.name.includes(`_${value}`);
                        });
                        if (isDataPresent) {
                            setActiveIcons2((prevActiveIcons) => ({
                                ...prevActiveIcons,
                                [value]: false,
                            }));
                            setNodes((prevNodes) =>
                                prevNodes.filter((node) => !node.name.includes(`_${value}`))
                            );
                        } else {
                            setActiveIcons2((prevActiveIcons) => ({
                                ...prevActiveIcons,
                                [value]: true,
                            }));
                            setLoader(true);
                            HandleInsertedData2(
                                value,
                                label,
                                "Res",
                                "BusinessUnit",
                                projBU,
                                custId
                            );
                        }
                    }
                };


                // //--------------------//----------------------//-----------------------Third Child Layer (Resource)

                let resBU;
                let projectID;
                let custprojectId;
                const res = resources.find((dep) => {
                    if (dep.fullName === cell.getValue().split("_")[0]) {
                        const value = cell.getValue().split("_")[3];
                        projectID = cell.getValue().split("_")[1];
                        custprojectId = cell.getValue().split("_")[4];
                        resBU = value;
                    }
                    // console.log("cel>>>", cell.getValue().split("_")[0])
                    // return dep.fullName.split("_")[0].trim() === cell.getValue().split("_")[0].trim();
                    return dep.fullName.split("_")[0] === cell.getValue().split("_")[0];

                });

                const [activeIcons3, setActiveIcons3] = useState({});

                const handleClick3 = () => {
                    if (res) {
                        const { id, fullName } = res;
                        const isDataPresent = nodes.some((node) => {
                            return node.name.includes(`_${id}`);
                        });
                        if (isDataPresent) {
                            setActiveIcons3((prevActiveIcons) => ({
                                ...prevActiveIcons,
                                [id]: false,
                            }));
                            setNodes((prevNodes) =>
                                prevNodes.filter((node) => !node.name.includes(`_${id}`))
                            );
                        } else {
                            setActiveIcons3((prevActiveIcons) => ({
                                ...prevActiveIcons,
                                [id]: true,
                            }));
                            setLoader(true);
                            HandleInsertedData3(
                                id,
                                fullName,
                                "Leaf",
                                "Res",
                                resBU,
                                projectID,
                                custprojectId
                            );
                        }
                    }
                };



                if (department) {
                    const { id } = department;
                    const isActive = activeIcons[id];
                    return (
                        <span
                            style={{ cursor: "pointer" }}
                            value={department.id}
                            onClick={() => {
                                handleClick();
                            }}
                            className={"parent"}
                        >
                            {isActive ? <FaChevronCircleDown /> : <FaChevronCircleRight />}{" "}
                            <b
                                style={{ color: "rgba(66, 144, 99, 0.9)" }}
                                title={
                                    department.fullName + " (" + cell.row.original.count + ")"
                                }
                            >
                                {department.fullName} ({cell.row.original.count})
                            </b>
                        </span>
                    );
                }
                else if (cust) {

                    const { id } = cust;

                    const isActive1 = activeIcons1[id];

                    return (
                        <span
                            style={{ cursor: "pointer" }}
                            value={cust.id}
                            onClick={() => {
                                handleClick1();
                            }}
                            className={"parent"}
                        >
                            {cell.row.original.name.split("_")[0] == "" ? (
                                "Summary"
                            ) : (
                                <>{isActive1 ? (
                                    <FaChevronCircleDown />
                                ) : (
                                    <FaChevronCircleRight />
                                )}{" "}
                                    <b style={{ color: "purple" }}
                                        title={cust.name + " (" + cell.row.original.count + ")"}
                                    >{cell.getValue().split("_")[0] == ""
                                        ? <div style={{ justifyContent: "center" }}>Summary</div>
                                        : "" + cust.name + "(" + cell.row.original.count + ")"}
                                    </b></>
                            )}</span>
                    );

                }
                else if (proj) {
                    const { value } = proj;
                    const isActive2 = activeIcons2[value];
                    return (
                        <span
                            style={{ cursor: "pointer" }}
                            value={proj.value}
                            onClick={() => {
                                handleClick2();
                            }}
                            className={"parent"}
                        >
                            {isActive2 ? <FaChevronCircleDown /> : <FaChevronCircleRight />}{" "}
                            <b
                                style={{ color: "#e17658" }}
                                title={proj.label + " (" + cell.row.original.count + ")"}
                            >
                                {proj.label} ({cell.row.original.count})
                            </b>
                        </span>
                    );
                }

                else if (res) {
                    const { id } = res;
                    const isActive3 = activeIcons3[id];
                    return (
                        <span
                            style={{ cursor: "pointer" }}
                            value={res.id}
                            onClick={() => {
                                handleClick3();
                            }}
                            className={"parent"}
                        >
                            {isActive3 ? <FaChevronCircleDown /> : <FaChevronCircleRight />}{" "}
                            <b
                                style={{ color: "#333" }}
                                title={res.fullName}
                            >
                                {res.fullName}
                            </b>
                        </span>
                    );
                }

                else {

                    return (

                        <span

                            className="child"

                            style={{

                                color:

                                    cell.getValue().split("_")[2] === "Customer"

                                        ? "rgba(66, 144, 99, 0.9)"

                                        : "",
                                display: "flex",
                                justifyContent: "center"


                            }}

                            title={

                                cell.row.original.name === ""

                                    ? "Summary"

                                    : cell.getValue().split("_")[0] +
                                    " (" +
                                    cell.row.original.count +
                                    ")"
                            } >

                            <b style={{
                                color: cell.getValue().split("_")[2] == "Project" ? "rgba(66, 144, 99, 0.9)" :
                                    cell.getValue().split("_")[2] == "BusinessUnit" ? "purple" :
                                        cell.getValue().split("_")[2] == "Res" ? "#e17658" :
                                            cell.getValue().split("_")[2] == "Leaf" ? "#333" : ""
                            }} className="summary">
                                {cell.row.original.name == "" ? (
                                    "Summary"
                                ) : cell.getValue().split("_")[0] == "" ? (
                                    "Summary"
                                ) : (
                                    <div onClick={handleClick1}>
                                        <FaChevronCircleRight /> {cell.getValue().split("_")[0]}
                                    </div>
                                )}{" "}
                                {(cell.getValue().split("_")[2] == "Leaf") ? "" : "(" + cell.row.original.count + ")"}
                            </b>{" "}</span>);
                }
            }
        },
        {
            header: "",
            accessorKey: `kpi`,
            Cell: ({ cell }) => {
                // console.log("Data>>>", cell.row.original.name)
                const department = customer.find(
                    (dep) => { return dep.fullName === cell.row.original.name }
                );

                const cust = project.find((dep) => {
                    return dep.name === cell.row.original.name.split("_")[0];
                });

                const proj = departments.find((dep) => {
                    return (
                        dep.label.split("_")[0] === cell.row.original.name.split("_")[0]
                    );
                });

                const res = resources.find((dep) => {
                    return dep.fullName.split("_")[0] === cell.row.original.name.split("_")[0];
                });


                return <span className="kpi">
                    <b style={{
                        color: department ? "rgba(66, 144, 99, 0.9)"
                            : cust ? "purple" :
                                proj ? "#e17658" :
                                    res ? "#333" :
                                        cell.row.original.name.split("_")[2] == "Project" ? "rgba(66, 144, 99, 0.9)" :
                                            cell.row.original.name.split("_")[2] == "BusinessUnit" ? "purple" :
                                                cell.row.original.name.split("_")[2] == "Res" ? "#e17658" :
                                                    cell.row.original.name.split("_")[2] == "Leaf" ? "#333" : ""
                    }}>{cell.getValue()}</b>
                </span>
            }
            ,
        },
    ]

    data.forEach((item, index) => {
        if (index > 1 && item !== "Total") {
            const dateObj = new Date(
                `${item.slice(0, 4)}-${item.slice(5, 7)}-${item.slice(8, 10)}`
            );
            const header = dateObj
                .toLocaleDateString("en-US", { month: "short", year: "numeric" })
                .replace(" ", "-");



            dynamicColumns?.push({
                header,
                accessorKey: `${item}`,
                className: "software",
                Cell: ({ cell }) => (
                    <span>
                        {cell.row.original.kpi == "Planned Revenue" ||
                            cell.row.original.kpi == "Actual Revenue" ||
                            cell.row.original.kpi == "Recognized Revenue" ||
                            cell.row.original.kpi == "Resource Direct Cost" ||
                            cell.row.original.kpi == "Other Direct Cost" ||
                            cell.row.original.kpi == "Gross Margin" ? (
                            <span style={{ display: "block", float: "left" }}>$</span>
                        ) : (
                            ""
                        )}
                        <span style={{ display: "block", float: "right" }}>
                            {cell.getValue() == null
                                ? 0
                                : cell.getValue()?.toLocaleString("en-US")}
                            {cell.row.original.kpi == "Gross Margin %" ||
                                cell.row.original.kpi == "Billable Utilization" ||
                                cell.row.original.kpi == "FTE" ||
                                cell.row.original.kpi == "SUBK" ||
                                cell.row.original.kpi == "Billed Utilization" ||
                                cell.row.original.kpi == "SUBK" ? (
                                <span>%</span>
                            ) : (
                                ""
                            )}
                        </span>
                    </span>
                ),
            });
            // console.log("dynamicColumns>>>>", dynamicColumns)
        }
    });



    {
        /*----------------------------------Total-------------------------------- */
    }

    const columnIndex = dynamicColumns.length;
    const newColumn = {
        header: <b>Total</b>,
        accessorKey: `Total`,
        Cell: ({ cell }) => (
            <>
                {cell.row.original.kpi == "Planned Revenue" ||
                    cell.row.original.kpi == "Actual Revenue" ||
                    cell.row.original.kpi == "Recognized Revenue" ||
                    cell.row.original.kpi == "Resource Direct Cost" ||
                    cell.row.original.kpi == "Other Direct Cost" ||
                    cell.row.original.kpi == "Gross Margin" ? (
                    <span style={{ display: "block", float: "left" }}>
                        <b>$</b>
                    </span>
                ) : (
                    ""
                )}
                <span style={{ display: "block", float: "right" }} className="total">
                    <b>
                        {cell.getValue()?.toLocaleString("en-US")}
                        {cell.row.original.kpi == "Gross Margin %" ||
                            cell.row.original.kpi == "Billable Utilization" ||
                            cell.row.original.kpi == "FTE" ||
                            cell.row.original.kpi == "SUBK" ||
                            cell.row.original.kpi == "Billed Utilization" ||
                            cell.row.original.kpi == "SUBK" ? (
                            <span>{cell.getValue() == null ? 0 : "%"}</span>
                        ) : (
                            ""
                        )}
                    </b>
                </span>
            </>
        ),
    };

    dynamicColumns.splice(columnIndex, 0, newColumn);

    // console.log("nodes.........", nodes)

    return (
        <div className="materialReactExpandableTable financialTable darkHeader">
            <MaterialReactTable
                columns={dynamicColumns}
                data={nodes}
                enableExpanding={(column) => column.id === "name"}
                enablePagination={false}
                enableGlobalFilter={true}
                enableDensityToggle={false}
                enableFullScreenToggle={false}
                enableHiding={false}
                enableColumnFilters={false}
                enableBottomToolbar={false}
                enableTopToolbar={false}
                enableColumnActions={false}
                enableSorting={false}
                filterFromLeafRows //apply filtering to all rows instead of just parent rows
                initialState={{
                    showGlobalFilter: true,
                    grouping: ["name"],
                    expanded: true,
                    density: "compact",
                    columnPinning: { right: ["Total"] },
                }} //expand all rows by default
                muiTableContainerProps={{
                    sx: { width: "auto" },
                }}
                muiTableBodyProps={{
                    sx: {
                        "&": {
                            borderRight: "1px solid #ccc",
                            borderBottom: "1px solid #ccc",
                        },
                        "& td": {
                            // borderTop: "1px solid #ccc",
                            borderRight: "1px solid #ccc",
                            height: "22px",
                            padding: "0px 5px",
                            minWidth: "60px",
                            width: "60px",
                            maxWidth: "60px",
                        },
                    },
                }}
                muiTableHeadProps={{
                    sx: {
                        "& th": {
                            borderTop: "1px solid #ccc",
                            borderRight: "1px solid #ccc",
                            background: "#f4f4f4 ",
                            padding: "0 5px",
                            minWidth: "60px",
                            width: "60px",
                            maxWidth: "60px",
                            verticalAlign: "middle",
                        },
                    },
                }}
            />
            {loader ? <Loader handleAbort={handleAbort} /> : ""}
        </div>
    )
}
