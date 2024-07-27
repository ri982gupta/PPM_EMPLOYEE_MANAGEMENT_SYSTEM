import Progress from './Progress.json'
import  axios  from "axios";
import { useEffect, useState } from "react";
import { environment } from '../../environments/environment';
import { BiReset } from "react-icons/bi";
import { FaSave,FaCircle } from "react-icons/fa";

export default function InsideSalesProgressTable({reportRunId,execName,execId}) {
  const baseUrl = environment.baseUrl;

  const [monthlyResourceData,setmonthlyResourceData] = useState([])

  const monthlyDataPayload = {
    "reportRunId" : String(reportRunId),
    "executiveId" : String(execId)
  }

  const [commentsObj,setcommentsObj] = useState({})

  const prosicon = {
    1:<FaCircle style={{color:'purple'}}/>,
    0:<FaCircle style={{color:'green'}}/>
}


  //----------------------call-----------------------------------

  const getInsideSalesProgressDetails = () => {
    setcommentsObj({})
    axios.post(baseUrl+`/SalesMS/insideSales/getInsideSalesProgressDetails`,monthlyDataPayload)
    .then((resp)=>{
      const data = resp.data.data;
      const array = [ "id", "type", "qrtr", "opportunity", "count", "customer", "isProspect", "country", "closeDate", "amount", "probability", "nextStep", "comments" ]
      const newArray = data.map((item)=>{
          let k = JSON.parse(JSON.stringify(item,array,4))
          return k
      })
      setmonthlyResourceData(newArray)
    })
    .catch((resp)=>{
        
    })
  }

  const postcommentAndnextStep = () => {
    axios.post(baseUrl+`/SalesMS/insideSales/saveInsideSalesComments`,commentsObj)
    .then((resp)=>{
      console.log(resp)
    })
    .catch((err)=>{
      console.log(err)
    })
  }

  //----------------------useEffect----------------------

  useEffect(()=>{
    getInsideSalesProgressDetails()
  },[execId])

  //----------------------methods---------------------------------------

  const onCommentsEnter = (e,eId) => {
    const {value,id} = e.target;
    setmonthlyResourceData(prevState =>{
      const index = prevState.findIndex(element=>parseInt(element.id) === parseInt(eId))
      prevState[index][id] = value
      return prevState
    });

    
    setcommentsObj((prevState)=>{
      const index = monthlyResourceData.findIndex(element=>parseInt(element.id) === parseInt(eId))
      return {
        ...prevState, 
        [eId]: 
        { "comments": id === "comments" ? value : prevState[eId] === undefined ? monthlyResourceData[index]["comments"] : prevState[eId].comments,
         "nextStep": id === "nextStep" ? value : prevState[eId] === undefined ? monthlyResourceData[index]["nextStep"] : prevState[eId]?.nextStep }
      }
    })
  }

  //---------------------------logic-----------------------------
  

  
  const tablerender = monthlyResourceData.map((data)=>{
    const conditions = ["count", "id","isProspect"];
    let header = [];

      for (const keys in data) {
            !conditions.includes(keys) && header.push(
                data.id < 0 ? (
                <th key={keys}>
                    {data[keys] === "__iconCust__ Customer __iconProsp__ Prospect" ?  <span><span>{prosicon["0"]}</span>{data[keys].split("_")[4]}<br/><span>{prosicon["1"]}</span>{data[keys].split("_")[8]}</span> : data[keys].replace(/(<([^>]+)>)/ig, '')}
                </th>)
                : (
                    <td key={keys} className={keys}>
                        {keys === "customer" && prosicon[data["isProspect"]]}
                        {(keys === "nextStep" || keys === "comments") ? <input type="text" id={keys} value={data[keys]} onChange={(e)=>{onCommentsEnter(e,data.id)}} placeholder="Enter Comments Here"></input> 
                        : keys === "amount" ? (parseInt(data[keys])).toLocaleString('en-US') : data[keys] }
                    </td>)
            )
        }
      return <tr key={data.id}>{header}</tr>
  })

  
  return (
    <div className="col-lg-12 col-md-12 col-sm-12 mt10 no-padding ">
         <div className="col-lg-12 col-md-12 col-sm-12 no-padding"><b>Inside Sales Progress of <span className='linkSty'>{execName}</span></b></div>
         <div className='col-lg-12 col-md-12 col-sm-12 no-padding clearfix' style={{height:'10px'}}></div>

        <table className="table table-bordered table-striped progresstable">
            <tbody>
                {tablerender}
            </tbody>
        </table>
        
        <div className="col-md-12 col-sm-12 col-xs-12 no-padding center">
          <div className="clearfix" style={{ height: '25px' }}></div>
          <button type="button" className="btn btn-primary" onClick={postcommentAndnextStep} ><FaSave/>Save </button>
          <button type="button" className="btn btn-primary" onClick={getInsideSalesProgressDetails} style={{marginLeft:"10px"}} ><BiReset/>Reset </button>
        </div>
    </div>
  );
}
