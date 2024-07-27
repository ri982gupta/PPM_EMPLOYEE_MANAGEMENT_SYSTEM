import { Label } from '@mui/icons-material';
import axios from 'axios';
import React from 'react'
import {useRef, useEffect } from 'react';
import { useState } from 'react';
import { BiSave } from "react-icons/bi";
import { environment } from '../../environments/environment';
import GlobalCancel from '../ValidationComponent/GlobalCancel';

function CommonComponents() {
    const baseUrl = environment.baseUrl;
    const ref = useRef([]);
    const [data, setData] = useState([])
    const [saveData, setSaveData] = useState([])
    const [successfulmessage, setSuccessfulmessage] = useState(false);
    const [backUpData, setBackUpData] = useState({});
    console.log("backup data---------------------",backUpData)
    


    const [details, setDetails] = useState({
        id:1,
        PanNumber : "",
        cstNumber : "",
        ServiceNumber : "",
        serviceTax : "",
        salesTax : "",
        vatTax : ""
    })



const getData =() =>{
    axios.get(baseUrl + `/timeandexpensesms/getCommondata`).then((res)=>{
    setData(res.data)
    })
}
console.log("getting already save data from API--------------",data)


const getSaveData =() =>{

    axios({
        method:"put",
        url: baseUrl + `/timeandexpensesms/saveInvoiceCommonComponent`,
        data:{
        "id": 1,
        "panNumber": details.PanNumber===""?data[0].PanNumber:details.PanNumber,
        "cstNumber": details.cstNumber===""?data[0].cstNumber:details.cstNumber,
        "serviceNumber": details.ServiceNumber===""?data[0].ServiceNumber:details.ServiceNumber,
        "serviceTax":details.serviceTax===""?data[0].serviceTax:details.serviceTax,
        "salesTax": details.salesTax===""?data[0].salesTax:details.salesTax,
        "vatTax": details.vatTax===""?data[0].vatTax:details.vatTax
        }
    }).then((res)=>{
        setSaveData(res.data)
        
    })

    setSuccessfulmessage(true);
    setTimeout(() => {
      setSuccessfulmessage(false);
    }, 5000)

}
console.log("clicking on save button ---------------",saveData)

useEffect(()=>{
    getData();
    
},[saveData])

const handleChange = (e) => {
  setSuccessfulmessage(false);
    const { id, value } = e.target;

    setDetails((prev) => {
      return { ...prev, [id]: value };
    });

  };


  const handleCancel = (e) => {
    GlobalCancel(ref);
    let ele = document.getElementsByClassName("cancel");
    for (let index = 0; index < ele.length; index++) {
      console.log(ele[index])
      console.log(ele[index].id)
      console.log("Back--------",backUpData[ele[index].id])
      console.log("Before--------",ele[index].value)
      ele[index].value = Object.keys(backUpData).length > 0 ? backUpData[ele[index].id] : "";
      console.log("After--------",ele[index].value)
      // console.log(backUpData)
    }

    setDetails((prev) => ({ ...prev, ["PanNumber"]: "" }));
    setDetails((prev) => ({ ...prev, ["cstNumber"]: "" }));
    setDetails((prev) => ({ ...prev, ["ServiceNumber"]: "" }));
    setDetails((prev) => ({ ...prev, ["serviceTax"]: "" }));
    setDetails((prev) => ({ ...prev, ["salesTax"]: "" }));
    setDetails((prev) => ({ ...prev, ["vatTax"]: "" }));

  };

useEffect(()=>{
  console.log(data.length)
  if(data.length > 0 ){
  setBackUpData(JSON.parse(JSON.stringify(data[0])));
  console.log(backUpData);
  }
},[data])

  return (
<div>

<>{successfulmessage ? <div className='statusMsg success' >Common Components Added Successfully</div> : ""}</>
     <div className="col-md-12">
        <div className="pageTitle">
          <div className="childOne"></div>
          <div className="childTwo">
            <h2>Common Components</h2>
          </div>
          <div className="childThree"></div>
        </div>
      </div>
    
        <div className="group mb-5 customCard">
    <div className="group-content row">
      <div className="form-group col-md-4 mb-2"><label htmlFor="PAN">PAN</label>
      {/* <input type="text" className="form-control" id="PAN" placeholder /> */}
      {data.map((e)=>{
        return (
            <input type="text"className="text cancel" id="PanNumber" name='PanNumber'  onChange={handleChange}
         defaultValue={e.PanNumber} 
            />)
            })}
      </div>


      <div className="form-group col-md-4 mb-2"><label htmlFor="CST Number">CST Number</label>
      {/* <input type="text" className="form-control" id="CST Number" placeholder /></div> */}
      {data.map((e)=>{
        return(
              <input type="text" className="text cancel" id="cstNumber" name='cstNumber'  onChange={handleChange} defaultValue={e.cstNumber} 
               />)
               })}
      </div>

      <div className="form-group col-md-4 mb-2"><label htmlFor="Service Tax Number">Service Tax Number</label>
      {/* <input type="text" className="form-control" id="Service Tax Number" placeholder /></div> */}
      {data.map((e)=>{
            return(
              <input type="text" className="text cancel" id="ServiceNumber" name='ServiceNumber'  onChange={handleChange} defaultValue={e.ServiceNumber} 
               />)
               })}
      </div>
      
      <div className="form-group col-md-4 mb-2"><label htmlFor="Service Tax %">Service Tax %</label>
      {/* <input type="text" className="form-control" id="Service Tax %" placeholder /></div> */}
      {data.map((e)=>{
            return (
              <input type="text" className="text cancel" id="serviceTax" name='serviceTax'  onChange={handleChange} defaultValue={e.serviceTax} 
               />)
               })}
      </div>
      
      <div className="form-group col-md-4 mb-2"><label htmlFor="Sales Tax %">Sales Tax %</label>
      {/* <input type="text" className="form-control" id="Sales Tax %" placeholder /></div> */}
      {data.map((e)=>{
            return (
             <input type="text" className="text cancel" id="salesTax" name='salesTax'  onChange={handleChange} defaultValue={e.salesTax} 
               />)
               })}
    </div>
    
      <div className="form-group col-md-4 mb-2"><label htmlFor="VAT/CST %">VAT/CST %</label>
      {/* <input type="text" className="form-control" id="VAT/CST %" placeholder /></div> */}
      {data.map((e)=>{
            return (
              <input type="text" className="text cancel" id="vatTax" name='vatTax'  onChange={handleChange} defaultValue={e.vatTax} 
               />)
               })}
        </div>
    </div>
  </div>


 
    <div className=" form-group col-md-12 col-sm-12 col-xs-12 btn-container center my-3 mb-2">
                <button className="btn btn-primary" type="submit"  onClick={getSaveData} ><BiSave /> Save</button>
                <button className="btn btn-secondary"   
                onClick={() => {
            handleCancel();
          }}
          ><span className="logo" >x</span> Cancel</button>
            </div>

</div>
  )
}

export default CommonComponents
