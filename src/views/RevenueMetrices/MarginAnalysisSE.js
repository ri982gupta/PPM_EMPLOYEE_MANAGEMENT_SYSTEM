import React, { useState, useMemo, useRef } from "react";
import MaterialReactTable from "material-react-table";
import { useEffect } from "react";
import "./HeadCountTableComponent.scss";
import moment from "moment";
import Loader from "../Loader/Loader";
import { environment } from "../../environments/environment";
import { FaChevronCircleRight, FaChevronCircleDown } from "react-icons/fa";
import axios from "axios";
import { RiFileExcel2Line } from "react-icons/ri";

function MarginAnalysisSE(props) {
  const {
    tableData,
    column,
    selectType,
    month,
    searchdata,
    project,
    customer,
    resources,
    SalesExe,
    selectedCust,
    sortBy,
    defaultMeasureLabel,
  } = props;
  const baseUrl = environment.baseUrl;
  const abortController = useRef(null);
  const [loader, setLoader] = useState(false);
  const name = column[0];
  const kpi = column[1];
  const handleAbort = () => {
    abortController.current && abortController.current.abort();
    setLoader(false);
  };

  const dates = column.slice(2).sort();

  const adjustedColumn = [name, kpi, ...dates, "Total"];
  const [data, setData] = useState(adjustedColumn);
  const [nodes, setNodes] = useState([]);
  useEffect(() => {
    setData(props.column);
  }, [props.column]);

  useEffect(() => {
    let id = 1;
    for (let i = 0; i < tableData.length; i++) {
      tableData[i].id = id;
      id++;
      if (id % 10000 == 17) {
        id += 9984;
      }
    }

    setNodes(jsonToTree(tableData));
  }, [tableData]);

  const Data = moment(month).startOf("month").format("yyyy-MM-DD");

  {
    /*-------------------------------------For Getting Customer's According to Customer Industry------------------------------ */
  }
  const HandleInsertedData = (objId, objLabel, innerColumn) => {
    abortController.current = new AbortController();
    const loaderTime = setTimeout(() => {
      setLoader(true);
    }, 2000);
    axios({
      method: "post",
      url:
        baseUrl +
        `/revenuemetricsms/RevenueMarginAnalysis/GetGMASalesExecutiveFinancialsFinalData`,
      data: {
        ownerDivisions: -1,
        month: Data,
        duration: searchdata.duration,
        countries: searchdata.countries,
        searchType: searchdata.searchType,
        busUnits: -1,
        customers:
          searchdata.customers == "select"
            ? selectedCust
            : searchdata.customers,
        srcType: searchdata.searchType,
        srcTypeId: objId,
        tarType: innerColumn,
        busUnitId: -1,
        custId: searchdata.custId,
        prjId: searchdata.prjId,
        resId: searchdata.resId,
        measures: searchdata.measures,
        salesExecId: objId,
        salesExecs: searchdata.salesExecs,
        sortBy: searchdata.sortBy,
        custCountries: searchdata.custCountries,
        source: searchdata.source,
        resTyp: searchdata.resTyp,
        engCountries: searchdata.engCountries,
        contTerms: searchdata.contTerms,
        engComp: searchdata.engComp,
        cslRes: searchdata.cslRes,
        cslResId: searchdata.cslResId,
        dpRes: -1,
        dpResId: -1,
        indTypes: -1,
        indTypesId: -1,
      },
      signal: abortController.current.signal,
    })
      .then((res) => {
        setLoader(false);
        clearTimeout(loaderTime);
        let respData = res.data.data;
        respData = respData.map((item) => {
          return {
            ...item,
            name: item.name + "*" + objId + "*" + innerColumn,
          };
        });

        setNodes((prevNodes) => {
          const grossMarginIndex = prevNodes.findIndex((node) => {
            return searchdata.measures !=
              "1350,638,965,639,640,641,643,644,872,761"
              ? searchdata.sortBy != -1
                ? sortBy.some(
                    (Item) =>
                      node.kpi ===
                        (Item.id == searchdata.sortBy ? Item.measures : "") &&
                      node.name.split("*")[0] === objLabel
                  )
                : node.kpi === defaultMeasureLabel &&
                  node.name.split("*")[0] === objLabel
              : searchdata.sortBy == -1
              ? node.kpi === defaultMeasureLabel &&
                node.name.split("*")[0] === objLabel
              : sortBy.some(
                  (Item) =>
                    node.kpi ===
                      (Item.id == searchdata.sortBy ? Item.measures : "") &&
                    node.name.split("*")[0] === objLabel
                );
          });
          if (grossMarginIndex !== -1) {
            return [
              ...prevNodes.slice(0, grossMarginIndex + 1),
              ...respData.map((data, i) => ({
                ...data,
                uniqueId: data.id,
                id: objId + i + 1,
              })),
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

  {
    /*-------------------------------------For Getting Project's According to Customer------------------------------ */
  }

  const HandleInsertedData1 = (
    objId,
    objLabel,
    innerColumn,
    source,
    custBU
  ) => {
    abortController.current = new AbortController();
    const loaderTime = setTimeout(() => {
      setLoader(true);
    }, 2000);
    axios({
      method: "post",
      url:
        baseUrl +
        `/revenuemetricsms/RevenueMarginAnalysis/GetGMASalesExecutiveFinancialsFinalData`,
      data: {
        ownerDivisions: -1,
        month: Data,
        duration: searchdata.duration,
        countries: searchdata.countries,
        searchType: "Sales Executive",
        busUnits: -1,
        customers:
          searchdata.customers == "select"
            ? selectedCust
            : searchdata.customers,
        srcType: source,
        srcTypeId: objId,
        tarType: innerColumn,
        busUnitId: -1,
        custId: objId,
        prjId: searchdata.prjId,
        resId: searchdata.resId,
        measures: searchdata.measures,
        salesExecId: custBU,
        salesExecs: searchdata.salesExecs,
        sortBy: searchdata.sortBy,
        custCountries: searchdata.custCountries,
        source: searchdata.source,
        resTyp: searchdata.resTyp,
        engCountries: searchdata.engCountries,
        contTerms: searchdata.contTerms,
        engComp: searchdata.engComp,
        cslRes: searchdata.cslRes,
        cslResId: searchdata.cslResId,
        dpRes: -1,
        dpResId: -1,
        indTypes: -1,
        indTypesId: -1,
      },
      signal: abortController.current.signal,
    })
      .then((res) => {
        setLoader(false);
        clearTimeout(loaderTime);
        let respData = res.data.data;
        respData = respData.map((item) => {
          return {
            ...item,
            name: item.name + "*" + objId + "*" + innerColumn + "*" + custBU,
            ui: item.id,
          };
        });
        setNodes((prevNodes) => {
          const grossMarginIndex = prevNodes.findIndex((node) => {
            return searchdata.measures !=
              "1350,638,965,639,640,641,643,644,872,761"
              ? searchdata.sortBy != -1
                ? sortBy.some(
                    (Item) =>
                      node.kpi ===
                        (Item.id == searchdata.sortBy ? Item.measures : "") &&
                      node.name.split("*")[0] === objLabel
                  )
                : node.kpi === defaultMeasureLabel &&
                  node.name.split("*")[0] === objLabel
              : searchdata.sortBy == -1
              ? node.kpi === defaultMeasureLabel &&
                node.name.split("*")[0] === objLabel
              : sortBy.some(
                  (Item) =>
                    node.kpi ===
                      (Item.id == searchdata.sortBy ? Item.measures : "") &&
                    node.name.split("*")[0] === objLabel
                );
          });
          if (grossMarginIndex !== -1) {
            return [
              ...prevNodes.slice(0, grossMarginIndex + 1),
              ...respData.map((data, i) => ({
                ...data,
                uniqueId: data.id,
                id: objId + i + 1,
              })),
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

  const HandleInsertedData2 = (
    objId,
    objLabel,
    innerColumn,
    source,
    custBU,
    custId
  ) => {
    abortController.current = new AbortController();
    const loaderTime = setTimeout(() => {
      setLoader(true);
    }, 2000);
    axios({
      method: "post",
      url:
        baseUrl +
        `/revenuemetricsms/RevenueMarginAnalysis/GetGMASalesExecutiveFinancialsFinalData`,
      data: {
        ownerDivisions: -1,
        month: Data,
        duration: searchdata.duration,
        countries: searchdata.countries,
        searchType: "Sales Executive",
        busUnits: -1,
        customers:
          searchdata.customers == "select"
            ? selectedCust
            : searchdata.customers,
        srcType: source,
        srcTypeId: objId,
        tarType: innerColumn,
        busUnitId: -1,
        custId: custId,
        prjId: objId,
        resId: searchdata.resId,
        measures: searchdata.measures,
        salesExecId: custBU,
        salesExecs: searchdata.salesExecs,
        sortBy: searchdata.sortBy,
        custCountries: searchdata.custCountries,
        source: searchdata.source,
        resTyp: searchdata.resTyp,
        engCountries: searchdata.engCountries,
        contTerms: searchdata.contTerms,
        engComp: searchdata.engComp,
        cslRes: searchdata.cslRes,
        cslResId: searchdata.cslResId,
        dpRes: -1,
        dpResId: -1,
        indTypes: -1,
        indTypesId: -1,
      },
      signal: abortController.current.signal,
    })
      .then((res) => {
        setLoader(false);
        clearTimeout(loaderTime);
        let respData = res.data.data;
        respData = respData.map((item) => {
          return {
            ...item,
            name:
              item.name +
              "*" +
              objId +
              "*" +
              innerColumn +
              "*" +
              custBU +
              "*" +
              custId,
          };
        });
        setNodes((prevNodes) => {
          const grossMarginIndex = prevNodes.findIndex((node) => {
            console.log("first>", node.ui, " second>", objLabel);
            return searchdata.measures !=
              "1350,638,965,639,640,641,643,644,872,761"
              ? searchdata.sortBy != -1
                ? sortBy.some(
                    (Item) =>
                      node.kpi ===
                        (Item.id == searchdata.sortBy ? Item.measures : "") &&
                      objLabel.includes(node.name.split("*")[0]) &&
                      node.ui == objId
                  )
                : node.kpi === defaultMeasureLabel &&
                  objLabel.includes(node.name.split("*")[0]) &&
                  node.ui == objId
              : searchdata.sortBy == -1
              ? node.kpi === defaultMeasureLabel &&
                objLabel.includes(node.name.split("*")[0]) &&
                node.ui == objId
              : sortBy.some(
                  (Item) =>
                    node.kpi ===
                      (Item.id == searchdata.sortBy ? Item.measures : "") &&
                    objLabel.includes(node.name.split("*")[0]) &&
                    node.ui == objId
                );
          });
          console.log(grossMarginIndex);
          if (grossMarginIndex !== -1) {
            return [
              ...prevNodes.slice(0, grossMarginIndex + 1),
              ...respData.map((data, i) => ({
                ...data,
                uniqueId: data.id,
                id: objId + i + 1,
              })),
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
    const loaderTime = setTimeout(() => {
      setLoader(true);
    }, 2000);
    axios({
      method: "post",
      url:
        baseUrl +
        `/revenuemetricsms/RevenueMarginAnalysis/GetGMASalesExecutiveFinancialsFinalData`,
      data: {
        ownerDivisions: -1,
        month: Data,
        duration: searchdata.duration,
        countries: searchdata.countries,
        searchType: "Sales Executive",
        busUnits: -1,
        customers:
          searchdata.customers == "select"
            ? selectedCust
            : searchdata.customers,
        srcType: source,
        srcTypeId: objId,
        tarType: innerColumn,
        busUnitId: -1,
        custId: custprojectId,
        prjId: projectID,
        resId: -1,
        measures: searchdata.measures,
        salesExecId: searchdata.salesExecId,
        salesExecs: searchdata.salesExecs,
        sortBy: searchdata.sortBy,
        custCountries: searchdata.custCountries,
        source: searchdata.source,
        resTyp: searchdata.resTyp,
        engCountries: searchdata.engCountries,
        contTerms: searchdata.contTerms,
        engComp: searchdata.engComp,
        cslRes: searchdata.cslRes,
        cslResId: searchdata.cslResId,
        dpRes: -1,
        dpResId: custBU,
        indTypes: -1,
        indTypesId: -1,
      },
      signal: abortController.current.signal,
    })
      .then((res) => {
        setLoader(false);
        clearTimeout(loaderTime);
        let respData = res.data.data;
        respData = respData.map((item) => {
          return {
            ...item,
            name: item.name + "*" + objId + "*" + innerColumn + "*" + custBU,
          };
        });
        setNodes((prevNodes) => {
          const grossMarginIndex = prevNodes.findIndex((node) => {
            return searchdata.measures !=
              "1350,638,965,639,640,641,643,644,872,761"
              ? searchdata.sortBy != -1
                ? sortBy.some(
                    (Item) =>
                      node.kpi ===
                        (Item.id == searchdata.sortBy ? Item.measures : "") &&
                      node.name.split("*")[0].replace(/\s+/g, " ") ===
                        objLabel.replace(/\s+/g, " ")
                  )
                : node.kpi === defaultMeasureLabel &&
                  node.name.split("*")[0].replace(/\s+/g, " ") ===
                    objLabel.replace(/\s+/g, " ")
              : searchdata.sortBy == -1
              ? node.kpi === defaultMeasureLabel &&
                node.name.split("*")[0].replace(/\s+/g, " ") ===
                  objLabel.replace(/\s+/g, " ")
              : sortBy.some(
                  (Item) =>
                    node.kpi ===
                      (Item.id == searchdata.sortBy ? Item.measures : "") &&
                    node.name.split("*")[0].replace(/\s+/g, " ") ===
                      objLabel.replace(/\s+/g, " ")
                );
          });
          if (grossMarginIndex !== -1) {
            return [
              ...prevNodes.slice(0, grossMarginIndex + 1),
              ...respData.map((data, i) => ({
                ...data,
                uniqueId: data.id,
                id: objId + i + 1,
              })),
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

  const dynamicColumns = useMemo(() => {
    const columns = [
      // for data[0] where accessorKey is name
      {
        header: (
          // <div className="header-label">BU Customer Project Res</div>
          <div title="" className="legendContainer wrap">
            <div className="legend lightbrown">
              <div className="legendCircle"></div>
              <div className="legendTxt">
                <b>SE</b>
              </div>
            </div>
            <div className="legend darkgreen">
              <div className="legendCircle"></div>
              <div className="legendTxt">
                <b>Customer</b>
              </div>
            </div>
            <div className="legend purple">
              <div className="legendCircle"></div>
              <div className="legendTxt">
                <b>Project</b>
              </div>
            </div>
            <div className="legend brown">
              <div className="legendCircle"></div>
              <div className="legendTxt">
                <b>Res</b>
              </div>
            </div>
          </div>
        ),
        accessorKey: `name`,
        enableGrouping: false,
        GroupedCell: ({ cell }) => {
          if (selectType == "Sales Executive") {
            //--------------------//----------------------//-----------------------Parent Level (Customer Industry)

            const department = SalesExe.find(
              (dep) => dep.value === cell.row.original.uniqueId
            );
            const [activeIcons, setActiveIcons] = useState({});
            const [isHandlingClick, setIsHandlingClick] = useState(false);

            const handleClick = () => {
              setIsHandlingClick(true);

              if (department) {
                const { value, label } = department;
                const isDataPresent = nodes.some((node) => {
                  return node.name.includes(`*${value}`);
                });

                if (isDataPresent) {
                  setActiveIcons((prevActiveIcons) => ({
                    ...prevActiveIcons,
                    [value]: false,
                  }));
                  setNodes((prevNodes) =>
                    prevNodes.filter((node) => !node.name.includes(`*${value}`))
                  );
                  setIsHandlingClick(false);
                } else if (isHandlingClick) {
                  return;
                } else {
                  setActiveIcons((prevActiveIcons) => ({
                    ...prevActiveIcons,
                    [value]: true,
                  }));

                  HandleInsertedData(value, label, "Customer")
                    .then(() => {
                      setIsHandlingClick(false);
                    })
                    .catch((error) => {
                      console.error("Error in HandleInsertedData:", error);
                      setIsHandlingClick(false);
                    });
                }
              }
            };

            //--------------------//----------------------//-----------------------First Child Layer (Customer)

            const cust = customer.find((dep) => {
              return dep.id === cell.row.original.uniqueId;
            });

            const [activeIcons1, setActiveIcons1] = useState({});
            const [isHandlingClick1, setIsHandlingClick1] = useState(false);

            const handleClick1 = () => {
              setIsHandlingClick1(true);

              if (cust) {
                const { id, fullName } = cust;
                const isDataPresent = nodes.some((node) => {
                  return node.name.includes(`*${id}`);
                });

                if (isDataPresent) {
                  setActiveIcons1((prevActiveIcons) => ({
                    ...prevActiveIcons,
                    [id]: false,
                  }));
                  setNodes((prevNodes) =>
                    prevNodes.filter((node) => !node.name.includes(`*${id}`))
                  );
                  setIsHandlingClick1(true);
                } else if (isHandlingClick1) {
                  return;
                } else {
                  setActiveIcons1((prevActiveIcons) => ({
                    ...prevActiveIcons,
                    [id]: true,
                  }));
                  HandleInsertedData1(
                    id,
                    fullName,
                    "Project",
                    "Customer",
                    cell.getValue().split("*")[1]
                  )
                    .then(() => {
                      setIsHandlingClick1(false);
                    })
                    .catch((error) => {
                      console.error("Error in HandleInsertedData1:", error);
                      setIsHandlingClick1(false);
                    });
                }
              }
            };

            //--------------------//----------------------//-----------------------Second Child Layer (Project)

            const proj = project.find((dep) => {
              return dep.id === cell.row.original.uniqueId;
            });

            const [activeIcons2, setActiveIcons2] = useState({});
            const [isHandlingClick2, setIsHandlingClick2] = useState(false);

            const handleClick2 = () => {
              setIsHandlingClick2(true);

              if (proj) {
                const { id, name } = proj;
                const isDataPresent = nodes.some((node) => {
                  return node.name.includes(`*${id}`);
                });

                if (isDataPresent) {
                  setActiveIcons2((prevActiveIcons) => ({
                    ...prevActiveIcons,
                    [id]: false,
                  }));
                  setNodes((prevNodes) =>
                    prevNodes.filter((node) => !node.name.includes(`*${id}`))
                  );
                  setIsHandlingClick2(false);
                } else if (isHandlingClick2) {
                  return;
                } else {
                  setActiveIcons2((prevActiveIcons) => ({
                    ...prevActiveIcons,
                    [id]: true,
                  }));
                  HandleInsertedData2(
                    id,
                    name,
                    "Res",
                    "Project",
                    cell.getValue().split("*")[3],
                    cell.getValue().split("*")[1]
                  )
                    .then(() => {
                      setIsHandlingClick2(false);
                    })
                    .catch((error) => {
                      console.error("Error in HandleInsertedData2:", error);
                      setIsHandlingClick2(false);
                    });
                }
              }
            };

            //--------------------//----------------------//-----------------------Third Child Layer (Resource)

            const res = resources.find((dep) => {
              return dep.id === cell.row.original.uniqueId;
            });

            const [activeIcons3, setActiveIcons3] = useState({});
            const [isHandlingClick3, setIsHandlingClick3] = useState(false);

            const handleClick3 = () => {
              setIsHandlingClick3(true);

              if (res) {
                const { id, fullName } = res;
                const isDataPresent = nodes.some((node) => {
                  return node.name.includes(`*${id}`);
                });

                if (isDataPresent) {
                  setActiveIcons3((prevActiveIcons) => ({
                    ...prevActiveIcons,
                    [id]: false,
                  }));
                  setNodes((prevNodes) =>
                    prevNodes.filter((node) => !node.name.includes(`*${id}`))
                  );
                  setIsHandlingClick3(false);
                } else if (isHandlingClick3) {
                  return;
                } else {
                  setActiveIcons3((prevActiveIcons) => ({
                    ...prevActiveIcons,
                    [id]: true,
                  }));
                  HandleInsertedData3(
                    id,
                    fullName,
                    "Leaf",
                    "Res",
                    cell.getValue().split("*")[3],
                    cell.getValue().split("*")[1],
                    cell.getValue().split("*")[4]
                  )
                    .then(() => {
                      setIsHandlingClick3(false);
                    })
                    .catch((error) => {
                      console.error("Error in HandleInsertedData3:", error);
                      setIsHandlingClick3(false);
                    });
                }
              }
            };

            //--------------------//----------------------//-----------------------Execution of the Layers
            if (department) {
              const { value } = department;
              const isActive = activeIcons[value];
              return (
                <span
                  style={{ cursor: "pointer" }}
                  value={department.value}
                  onClick={() => {
                    handleClick();
                  }}
                  className={"parent"}
                >
                  {isActive ? (
                    <FaChevronCircleDown />
                  ) : (
                    <FaChevronCircleRight />
                  )}{" "}
                  <b
                    className="buRM"
                    title={
                      department.label + " (" + cell.row.original.count + ")"
                    }
                  >
                    {department.label} ({cell.row.original.count})
                  </b>
                </span>
              );
            } else if (cust) {
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
                  {isActive1 ? (
                    <FaChevronCircleDown />
                  ) : (
                    <FaChevronCircleRight />
                  )}{" "}
                  <b
                    className="custBU custRM"
                    title={cust.fullName + " (" + cell.row.original.count + ")"}
                  >
                    {cust.fullName} ({cell.row.original.count})
                  </b>
                </span>
              );
            } else if (proj) {
              const { id } = proj;
              const isActive2 = activeIcons2[id];
              return (
                <span
                  style={{ cursor: "pointer" }}
                  value={proj.id}
                  onClick={() => {
                    handleClick2();
                  }}
                  className={"parent"}
                >
                  {isActive2 ? (
                    <FaChevronCircleDown />
                  ) : (
                    <FaChevronCircleRight />
                  )}{" "}
                  <b
                    className="projBU projRM"
                    title={proj.name + " (" + cell.row.original.count + ")"}
                  >
                    {proj.name} ({cell.row.original.count})
                  </b>
                </span>
              );
            } else if (res) {
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
                  {isActive3 ? (
                    <FaChevronCircleDown />
                  ) : (
                    <FaChevronCircleRight />
                  )}{" "}
                  <b
                    className="resBU resRM"
                    title={res.fullName + " (" + cell.row.original.count + ")"}
                  >
                    {res.fullName}
                  </b>
                </span>
              );
            } else {
              return (
                <span
                  className="child"
                  title={
                    cell.row.original.name === ""
                      ? "Summary"
                      : cell.getValue().split("*")[0] +
                        " (" +
                        cell.row.original.count +
                        ")"
                  }
                >
                  <b
                    className={
                      cell.getValue().split("*")[2] == "Customer"
                        ? "buRM"
                        : cell.getValue().split("*")[2] == "Project"
                        ? "custRM"
                        : cell.getValue().split("*")[2] == "Res"
                        ? "projRM"
                        : cell.getValue().split("*")[2] == "Leaf"
                        ? "resRM"
                        : ""
                    }
                    style={{
                      display:
                        cell.row.original.name == "" ||
                        cell.getValue().split("*")[0] == ""
                          ? "flex"
                          : "",
                      justifyContent:
                        cell.row.original.name == "" ||
                        cell.getValue().split("*")[0] == ""
                          ? "center"
                          : "",
                    }}
                  >
                    {cell.row.original.name == "" ? (
                      "Summary"
                    ) : cell.getValue().split("*")[0] == "" ? (
                      "Summary"
                    ) : (
                      <div onClick={handleClick1}>
                        <FaChevronCircleRight /> {cell.getValue().split("*")[0]}
                      </div>
                    )}{" "}
                    {cell.row.original.count === 0
                      ? ""
                      : `(${cell.row.original.count})`}
                  </b>{" "}
                </span>
              );
            }
          }
        },
      },
      {
        header: "",
        accessorKey: `kpi`,
        Cell: ({ cell }) => {
          const department = SalesExe.find(
            (dep) => dep.value === cell.row.original.uniqueId
          );

          const cust = customer.find((dep) => {
            return dep.id === cell.row.original.uniqueId;
          });

          const proj = project.find((dep) => {
            return dep.id === cell.row.original.uniqueId;
          });

          const res = resources.find((dep) => {
            return dep.id === cell.row.original.uniqueId;
          });

          return (
            <span>
              <b
                className={
                  department
                    ? "buRMchild"
                    : cust
                    ? "custRMchild"
                    : proj
                    ? "projRMchild"
                    : res
                    ? "resRMchild"
                    : cell.row.original.name.split("*")[2] == "Customer"
                    ? "buRMchild"
                    : cell.row.original.name.split("*")[2] == "Project"
                    ? "custRMchild"
                    : cell.row.original.name.split("*")[2] == "Res"
                    ? "projRMchild"
                    : cell.row.original.name.split("*")[2] == "Leaf"
                    ? "resRMchild"
                    : ""
                }
              >
                {cell.getValue()}
              </b>
            </span>
          );
        },
      },
    ];
    data.forEach((item, index) => {
      if (index > 1 && item !== "Total") {
        const dateObj = new Date(
          `${item.slice(0, 4)}-${item.slice(5, 7)}-${item.slice(8, 10)}`
        );

        const header = dateObj
          .toLocaleDateString("en-US", {
            month: "short",
            year: "numeric",
            timeZone: "UTC",
          })
          .replace(" ", "-");
        const currentDate = new Date()
          .toLocaleDateString("en-US", {
            month: "short",
            year: "numeric",
            timeZone: "UTC",
          })
          .replace(" ", "-");

        let greenDate = new Date(header) >= new Date(currentDate);
        columns.push({
          header,
          accessorKey: `${item}`,
          className: "software",
          Cell: ({ cell }) => (
            <span className={greenDate ? "greenColumn" : ""}>
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
                (cell.row.original.kpi == "FTE" &&
                  cell.row.original.descr != "hcfte") ||
                (cell.row.original.kpi == "SUBK" &&
                  cell.row.original.descr != "hcsubk") ||
                cell.row.original.kpi == "Billed Utilization" ? (
                  <span>%</span>
                ) : (
                  ""
                )}
              </span>
            </span>
          ),
        });
      }
    });

    return columns;
  });

  {
    /*----------------------------------Total-------------------------------- */
  }

  const columnIndex = dynamicColumns.length;

  const newColumn = {
    header: "Total",
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
            (cell.row.original.kpi == "FTE" &&
              cell.row.original.descr != "hcfte") ||
            (cell.row.original.kpi == "SUBK" &&
              cell.row.original.descr != "hcsubk") ||
            cell.row.original.kpi == "Billed Utilization" ? (
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
  {
    /*--------------------------Export Excel---------------------- */
  }

  const exportExcel = () => {
    import("exceljs").then((ExcelJS) => {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Revenue Analysis");
      let desiredColumnOrder = [];
      let cols = [];
      cols = data;
      desiredColumnOrder = cols;
      //----------------Months Sorting in order-----------------
      desiredColumnOrder.sort((colA, colB) => {
        const [yearA, monthA] = colA.split("_");
        const [yearB, monthB] = colB.split("_");
        console.log(colA, "|", colA);
        const yearComparison = parseInt(yearA) - parseInt(yearB);
        // If years are the same, compare months in ascending order
        if (yearComparison !== 0) {
          return yearComparison;
        } else return parseInt(monthA) - parseInt(monthB);
      });

      const wantedValues = data.concat(nodes).map((item) => {
        const obj = {};
        data.forEach((col) => {
          const value = item[col];
          if (typeof value === "string") {
            const [extractedValue, ,] = value.split("^&");
            obj[col] = extractedValue;
          } else if (typeof value === "number") {
            obj[col] = value.toLocaleString("en-US");
          } else {
            obj[col] = value;
          }
        });

        if ("name" in obj && obj["name"] === "") {
          obj["name"] = "Summary";
        } else if (
          "name" in obj &&
          obj["name"] !== "" &&
          obj["name"] !== undefined
        ) {
          obj["name"] =
            obj["name"].split("*")[0] == ""
              ? "Summary"
              : obj["name"].split("*")[0];
        }

        if (
          obj["kpi"] === "Planned Revenue" ||
          obj["kpi"] === "Actual Revenue" ||
          obj["kpi"] === "Recognized Revenue" ||
          obj["kpi"] === "Resource Direct Cost" ||
          obj["kpi"] === "Other Direct Cost" ||
          obj["kpi"] === "Gross Margin"
        ) {
          Object.keys(obj).forEach((key) => {
            if (key !== "name" && key !== "kpi" && !isNaN(obj[key])) {
              obj[key] = "$" + (obj[key] == null ? "" : obj[key]);
            }
          });
        } else if (
          obj["kpi"] === "Gross Margin %" ||
          obj["kpi"] === "Billable Utilization" ||
          obj["kpi"] === "Billed Utilization" ||
          obj["kpi"] === "FTE" ||
          obj["kpi"] === "SUBK"
        ) {
          Object.keys(obj).forEach((key) => {
            if (key !== "name" && key !== "kpi" && !isNaN(obj[key])) {
              obj[key] = (obj[key] == null ? 0 : obj[key]) + " %";
            }
          });
        }

        return obj;
      });

      const formatMMMYYYY = (dateStr) => {
        const [year, month, day] = dateStr.split("_");
        const monthName = new Date(`${year}-${month}-01`).toLocaleString(
          "en-us",
          { month: "short", timeZone: "UTC" }
        );
        return `${monthName}-${year}`;
      };

      const formatHeaderKey = (key) => {
        if (key.match(/^\d{4}_\d{2}_\d{2}$/)) {
          return formatMMMYYYY(key);
        }
        return key;
      };

      const headerRow = {};
      Object.keys(wantedValues[0]).forEach((key) => {
        headerRow[key] =
          formatHeaderKey(key) == "name"
            ? "SE  Customer  Project  Res"
            : formatHeaderKey(key) == "kpi"
            ? ""
            : formatHeaderKey(key);
      });

      const filteredValues = wantedValues.filter((item) =>
        Object.values(item).some(
          (value) => value !== null && value !== undefined && value !== ""
        )
      );

      filteredValues.unshift(headerRow);

      const rows = filteredValues.map((item) => {
        const row = [];
        desiredColumnOrder.forEach((col) => {
          row.push(item[col]);
        });
        return row;
      });

      rows.forEach((row) => {
        worksheet.addRow(row);
      });

      //--------------bold--------------------
      [1].forEach((rowIndex) => {
        const row = worksheet.getRow(rowIndex);
        row.font = { bold: true };
      });

      // ----------  Name Merging ---------------------
      const nameColumnIndex = desiredColumnOrder.indexOf("name");

      let mergeStartIndex = 1;
      let currentName = rows[0][nameColumnIndex];

      for (let rowIndex = 1; rowIndex < rows.length; rowIndex++) {
        const row = rows[rowIndex];
        const rowName = row[nameColumnIndex];

        if (rowName !== currentName) {
          if (rowIndex - mergeStartIndex > 0) {
            worksheet.mergeCells(
              mergeStartIndex + 1,
              nameColumnIndex,
              rowIndex,
              nameColumnIndex
            );
          }

          mergeStartIndex = rowIndex;
          currentName = rowName;
        }
      }

      if (rows.length - mergeStartIndex > 0) {
        worksheet.mergeCells(
          mergeStartIndex + 1,
          nameColumnIndex,
          rows.length,
          nameColumnIndex
        );
      }

      workbook.xlsx.writeBuffer().then((buffer) => {
        saveAs(new Blob([buffer]), "Revenue Analysis.xlsx");
      });
    });
  };

  return (
    <div className="materialReactExpandableTable headCountTable darkHeader">
      <div className="mb-2" align=" right ">
        <RiFileExcel2Line
          size="1.5em"
          title="Export to Excel"
          style={{ color: "green" }}
          cursor="pointer"
          onClick={exportExcel}
        />
      </div>
      <MaterialReactTable
        columns={dynamicColumns}
        data={nodes}
        enableExpanding={(column) => column.id === "name"}
        // enableRowVirtualization={true}
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
          sx: { maxHeight: "calc(100vh - 138px)" },
        }}
        muiTableBodyProps={{
          sx: {
            "&": {
              borderRight: "1px solid #ccc",
              borderBottom: "1px solid #ccc",
            },
            "& td": {
              borderRight: "1px solid #ccc",
              height: "22px",
              padding: "0px 5px",
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
            },
          },
        }}
      />
      {loader ? <Loader handleAbort={handleAbort} /> : ""}
    </div>
  );
}

export default MarginAnalysisSE;
