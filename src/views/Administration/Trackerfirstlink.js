import React from 'react'
import { useState, useEffect, useRef } from "react";
import axios from 'axios';
export default function Trackerfirstlink(props) {
    const {stabledata,getDetailsInfos}=props;
    const [tabledata, setTabledata] = useState([{}]);
    function sortObj(obj) {
        return Object.keys(obj).sort().reduce(function (result, key) {
          result[key] = obj[key];
          return result;
        }, {});
      }
      let arr = sortObj(stabledata);
      console.log(arr);
    return (
        <>   
            <table className="table-bordered  " style={{ border: "1px solid #ddd" }} >
                <thead style={{ backgroundColor: "#eeeeee" }}>
                    <tr>
                        {/* <th style={{ width: "10px", verticalAlign: "middle" }} >PageName</th>
                        <th style={{ width: "14px", verticalAlign: "middle" }}>BusinessUnit</th>
                        <th style={{ width: "10px", verticalAlign: "middle" }}>Supervisor</th>
                        <th style={{ width: "24px", verticalAlign: "middle" }}>1</th>
                        <th style={{ width: "24px", verticalAlign: "middle" }}>2</th>
                        <th style={{ width: "24px", verticalAlign: "middle" }}>3</th>
                        <th style={{ width: "24px", verticalAlign: "middle" }}>4</th>
                        <th style={{ width: "24px", verticalAlign: "middle" }}>5</th>
                        <th style={{ width: "24px", verticalAlign: "middle" }}>6</th>
                        <th style={{ width: "24px", verticalAlign: "middle" }}>7</th>
                        <th style={{ width: "24px", verticalAlign: "middle" }}>8</th>
                        <th style={{ width: "24px", verticalAlign: "middle" }}>9</th>
                        <th style={{ width: "24px", verticalAlign: "middle" }}>10</th>
                        <th style={{ width: "24px", verticalAlign: "middle" }}>11</th>
                        <th style={{ width: "24px", verticalAlign: "middle" }}>12</th>
                        <th style={{ width: "24px", verticalAlign: "middle" }}>13</th>
                        <th style={{ width: "24px", verticalAlign: "middle" }}>14</th>
                        <th style={{ width: "24px", verticalAlign: "middle" }}>15</th>
                        <th style={{ width: "24px", verticalAlign: "middle" }}>16</th>
                        <th style={{ width: "24px", verticalAlign: "middle" }}>17</th>
                        <th style={{ width: "24px", verticalAlign: "middle" }}>18</th>
                        <th style={{ width: "24px", verticalAlign: "middle" }}>19</th>
                        <th style={{ width: "24px", verticalAlign: "middle" }}>20</th>
                        <th style={{ width: "24px", verticalAlign: "middle" }}>21</th>
                        <th style={{ width: "24px", verticalAlign: "middle" }}>22</th>
                        <th style={{ width: "24px", verticalAlign: "middle" }}>23</th>
                        <th style={{ width: "24px", verticalAlign: "middle" }}>24</th>
                        <th style={{ width: "24px", verticalAlign: "middle" }}>25</th>
                        <th style={{ width: "24px", verticalAlign: "middle" }}>26</th>
                        <th style={{ width: "24px", verticalAlign: "middle" }}>27</th>
                        <th style={{ width: "24px", verticalAlign: "middle" }}>28</th>
                        <th style={{ width: "24px", verticalAlign: "middle" }}>29</th>
                        <th style={{ width: "24px", verticalAlign: "middle" }}>30</th>
                        <th style={{ width: "24px", verticalAlign: "middle" }}>31</th>
                        <th style={{ width: "24px", verticalAlign: "middle" }}>Total</th> */}
                        {/* {
                            stabledata[0].map((data) => (
                           <th style={{ width: "24px", verticalAlign: "middle" }}>{data}</th>
                           ))
                        } */}
                    </tr>
                </thead>
                {stabledata.map((data) => (
                    <tbody class="context-menu" >
                        <tr>
                            <td className="text-center" >{data.PageName} </td>
                            <td className="text-center" >{data.BusinessUnit}</td>
                            <td className="text-center" >{data.Supervisor}</td>
                            <td className="text-center" ><button onClick={getDetailsInfos} style={{ border: "none", background: "white", color: "blue" }}></button></td>
                            
                        </tr>
                    </tbody>
                ))}
            </table>
        </>

    )
}
