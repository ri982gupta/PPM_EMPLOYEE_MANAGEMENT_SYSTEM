import React, { useState, useEffect } from "react";
import CellRendererPrimeReactDataTable from "../PrimeReactTableComponent/CellRendererPrimeReactDataTable";
import axios from "axios";
import { Link } from "react-router-dom";
import { Column } from "primereact/column";
import "primeicons/primeicons.css";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.css";
import "primeflex/primeflex.css";
import {
  FaChevronCircleDown,
  FaChevronCircleUp,
} from "react-icons/fa";
import { CCollapse } from "@coreui/react";
function Search() {
  const [tableData, setTableData] = useState([]);
  const [dataAr, setDataAr] = useState([]);
  const [value, onChange] = useState(new Date());
  const [visible, setVisible] = useState(false);
  const [cheveronIcon, setCheveronIcon] = useState(FaChevronCircleUp);
  const [getidfullname, setGetiffullname] = useState([]);
  const [details, setDetails] = useState({
    full_name: getidfullname.id,
    StatusId: parseInt(""),
    SalesTerretory: parseInt(""),
    IndustryId: parseInt("")
  })
  console.log(details);
  const [selectType, setSelectType] = useState('')
  const handleChange = (e) => {
    const { id, name, value } = e.target;
    setDetails((prev) => {
      return { ...prev, [name]: value };
    });
    setSelectType(value)
  };
  console.log(selectType)
  const [exportData, setExportData] = useState([]);
  useEffect(() => {
    let imp = ["XLS","PDF"]
    setExportData(imp);
    let ctmFlts = {
      "id" : "filterTable",
      "type" : "select",
      "data" :  {
        "0" : "All",
        "1" : "Active"
      },
      "align" : "right",
      "filterTable" : ""
    }
   
  }, [])
  const handleChangedata = (e) => {
    const { id, name, value } = e.target;
    console.log(id);
    console.log(e.target.name);
    setDetails((prev) => {
      return { ...prev, [name]: value };
    });
  };
  const [isShow, setIsShow] = useState(false);
  const [data, setData] = useState([{}]);
  console.log(details.full_name)
  const handleClick = () => {
    axios({
      method: "post",
      url: `http://localhost:8092/customersms/Customersearch/getdata`,
      data: {
        "IndustryId": parseInt(details.IndustryId),
        "StatusId": parseInt(details.StatusId),
        "SalesTerretory": parseInt(details.SalesTerretory),
        "CustomerName":details.full_name
      },
      headers: { "Content-Type": "application/json" },
    })
      .then(res => {
        const data = res.data;
        console.log(data)
        const Headerdata = [{
          CustomerName: "Customer Name", IndustryId: "Industry Type", SalesTerretory: "Sales Territory", StatusId: "Customer Status", website: "website"
        }]
      let data1 = ["CustomerName", ""];
      let linkRoutes = ["/customer/dashboard/:id", ""];
      setLinkColumns(data1);
      setLinkColumnsRoutes(linkRoutes);
      setData(Headerdata.concat(data));
      console.log(data)
      })
      .catch(error => {
        console.log("Error :" + error);
      })
    setIsShow(true);
  };
  console.log(details, "inline----38");
  const [linkColumns, setLinkColumns] = useState([]);
  const [linkColumnsRoutes, setLinkColumnsRoutes] = useState([]);
  const [headerData, setHeaderData] = useState([]);
  useEffect(() => {
    data[0] && setHeaderData(JSON.parse(JSON.stringify(data[0])));
  }, [data]);
  const LinkTemplate = (data) => {
    let rou = linkColumnsRoutes[0]?.split(":");
     return (
       <>
         <Link target="_blank" to={rou[0] + ":" + data[rou[1]]} data-toggle="tooltip" title={data.CustomerName}>
           {data[linkColumns[0]]}
         </Link>
       </>
     );
   };
  const dynamicColumns = Object.keys(headerData)?.map((col, i) => {
    return (
      <Column
        sortable
        key={col}
        body={
          col == "CustomerName" ? LinkTemplate :'' 
        }
        field={col}
        header={headerData[col]}
      />
    );
  });
  const getData = () => {
    axios({
      method: "get",
      url: `http://localhost:8092/customersms/Customersearch/getid`,
    })
      .then((res) => {
        let manger = res.data;
        setGetiffullname(manger);
      })
      .catch((error) => {
        console.log("error :" + error);
      });
  };
  console.log(getidfullname);
  const [salesterritories, setSalesTerritories] = useState([]);
  const handleSalesTerritories = () => {
    axios({
      method: "get",
      url: `http://localhost:8092/customersms/Customersearch/getsalesterritory`,
    })
      .then((res) => {
        let manger = res.data;
        setSalesTerritories(res.data);
      })
      .catch((error) => {
        console.log("error :" + error);
      });
  };
  const [industryType, setIndustryType] = useState([]);
  const handleIndustryType = () => {
    axios({
      method: "get",
      url: `http://localhost:8092/customersms/Customersearch/getIndusdetails`,
    })
      .then((res) => {
        let manger = res.data;
        setIndustryType(manger);
      })
      .catch((error) => {
        console.log("error :" + error);
      });
  };
  useEffect(() => {
    handleSalesTerritories();
    getData();
    handleIndustryType();;
  }, []);
  return (
    <div>
      <div className="col-md-12">
        <div className="pageTitle">
          <div className="childOne"></div>
          <div className="childTwo">
            <h2>Customer Search</h2>
          </div>
          <div className="childThree"></div>
        </div>
      </div><div className="group mb-3 customCard">
        <div className="col-md-12 collapseHeader">
          <h2>Search Filters</h2>
          <button
                className="searchFilterButton btn btn-primary"
                onClick={() => {
                  setVisible(!visible);
 
                  visible
                    ? setCheveronIcon(FaChevronCircleUp)
                    : setCheveronIcon(FaChevronCircleDown);
                }}
              >
                Search Filters
                <span className="serchFilterText">{cheveronIcon}</span>
              </button>
        </div>
        <CCollapse visible={!visible}>
          <div className="group-content row">
            <div className=" col-md-3 mb-2">
              <div className="form-group row"><label className="col-5" htmlFor="customername">Customer Name</label><span className="col-1 p-0">:</span>
                <div className="col-6">
                  <div
                    className="textfield"
                  // ref={(ele) => {
                  //   ref.current[0] = ele;
                  // }}
                  >
                    <input
                      type="text"
                      className="cancel"
                      name="full_name"
                      id="full_name"
                      onChange={handleChangedata}
                    />
                  </div></div>
              </div>
            </div>
            <div className=" col-md-3 mb-2">
              <div className="form-group row"><label className="col-5" htmlFor="industrytype">Industry Type</label><span className="col-1 p-0">:</span>
                <div className="col-6"><select
                  // ref={(ele) => {
                  //   ref.current[3] = ele;
                  // }}
                  className="text cancel"
                  id="IndustryId"
                  name="IndustryId"
                  onChange={handleChange}
                >
                  <option value="IndustryId"> &lt;&lt;Please Select&gt;&gt;</option>
                  {industryType.map((Item) => (
                    <option value={Item.id}>{Item.lkup_name}</option>
                  ))}
                </select></div>
              </div>
            </div>
            <div className=" col-md-3 mb-2">
              <div className="form-group row"><label className="col-5" htmlFor="salesterritory">Sales Territory</label><span className="col-1 p-0">:</span>
                <div className="col-6"><select
                  // ref={(ele) => {
                  //   ref.current[2] = ele;
                  // }}
                  className="text cancel"
                  name="SalesTerretory"
                  id="SalesTerretory"
                  onChange={handleChange}
                >
                  <option value="SalesTerretory"> &lt;&lt;Please Select&gt;&gt;</option>
                  {salesterritories.map((Item) => (
                    <option value={Item.id}>{Item.full_name}</option>
                  ))}
                </select></div>
              </div>
            </div>
            <div className=" col-md-3 mb-2">
              <div className="form-group row">
                <label className="col-5" htmlFor="customerstatus">Customer Status</label><span className="col-1 p-0">:</span>
                <div className="col-6"><select
                  // ref={(ele) => {
                  //   ref.current[1] = ele;
                  // }}
                  className="text cancel"
                  name="StatusId"
                  id="StatusId"
                  onChange={handleChange}
                >
                  <option value="StatusId"> &lt;&lt;Please Select&gt;&gt;</option>
                  <option value={160}>New</option>
                  <option value={161}>Active</option>
                  <option value={162}>InActive</option>
                </select></div>
              </div>
            </div>
            <div className="col-md-12 col-sm-12 col-xs-12 btn-container center my-2">
              <button type="submit" className="btn btn-primary" onClick={handleClick}>
                Search{" "}
              </button>
            </div>
          </div>
        </CCollapse>
      </div>
      {isShow == true ?
        <div className="group mb-3 customCard">
          <CellRendererPrimeReactDataTable
            data={data}
            linkColumns={linkColumns}
            linkColumnsRoutes={linkColumnsRoutes}
            dynamicColumns={dynamicColumns}
            headerData={headerData}
            setHeaderData={setHeaderData}
            exportData = { exportData }

          />
        </div>
      
: <></>}
    </div>
  );
}
export default Search