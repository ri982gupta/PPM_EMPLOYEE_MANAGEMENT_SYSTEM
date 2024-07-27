import { Fragment, useState } from "react";

import InsideSalesProgressTable from "./InsideSalesProgressTable";
import fte_active from '../../assets/images/empstatusIcon/fte_active.png'
import fte_inactive from '../../assets/images/empstatusIcon/fte_inactive.png'
import fte_notice from '../../assets/images/empstatusIcon/fte_notice.png'
import subk_active from '../../assets/images/empstatusIcon/subk_active.png'
import subk_inactive from '../../assets/images/empstatusIcon/subk_inactive.png'
import subk_notice from '../../assets/images/empstatusIcon/subk_notice.png'

export default function InsideSalesMTable({ insideSalesData, reportRunId }) {

  const [execId, setexecId] = useState("")
  const [execName, setexecName] = useState("")


  const icons = {
    fte0: <img src={fte_inactive} alt='(fte_inactive_icon)' style={{ height: '12px' }} title='Ex-Employee' />,
    fte1: <img src={fte_active} alt='(fte_active_icon)' style={{ height: '12px' }} title='Active Employee' />,
    fte2: <img src={fte_notice} alt='(fte_notice_icon)' style={{ height: '12px' }} title='Employee in notice period' />,
    subk0: <img src={subk_inactive} alt='(subk_inactive_icon)' style={{ height: '12px' }} title='Ex-Contractor' />,
    subk1: <img src={subk_active} alt='(subk_active_icon)' style={{ height: '12px' }} title='Active Contractor' />,
    subk2: <img src={subk_notice} alt='(subk_notice_icon)' style={{ height: '12px' }} title='Contractor in notice period' />,
  }

  const heads = insideSalesData.map((data) => {
    const conditions = ["Count", "execStatus", "id", "isActive"];
    let header = [];

    for (const keys in data) {

      data[keys] !== null &&
        !conditions.some((el) => keys.includes(el)) &&
        header.push(
          data.id < 0 ? (
            <th className={keys?.split("_")[0] + " pipeth"}
              key={keys}
              colSpan={data[keys]?.split("^&")[2]}
              rowSpan={data[keys]?.split("^&")[1]}
            >
              {data[keys]?.split("^&")[0]}
            </th>
          ) : (
            <td className={(keys.includes("service") ? "service" : "software") + " pipetd " + keys?.split("_")[0]}

              key={keys}
              colSpan={data[keys]?.split("^&")[2]}
              rowSpan={data[keys]?.split("^&")[1]}
              style={{ backgroundColor: data.id === 0 ? "#EADDCA" : "" }}
            >
              {keys !== "executive"
                ?

                <Fragment>
                  <span>{(parseInt(data[keys]?.split("^&")[0])).toLocaleString('en-US')}</span>&nbsp;
                  (<span
                  >{data[keys + "Count"]?.split("^&")[0]}</span>)
                </Fragment>
                :
                <Fragment>
                  <span>{icons[data["execStatus"]]}</span><span className={data.id === 0 ? "" : "linkSty"} onClick={() => { setexecId(data["id"]); setexecName(data["executive"]) }}
                  >{data[keys]?.split("^&")[0]}</span>
                </Fragment>}
            </td>
          )
        );
    }


    return <tr key={data.id}>{header}</tr>;
  });

  return (
    <div className="col-lg-12 col-md-12 col-sm-12 customCard">
      <div className="col-lg-12 col-md-12 col-sm-12 no-padding scrollit" >
        <table className="table table-bordered table-striped pipelinetable ">
          <tbody>
            {heads}
          </tbody>
        </table>
      </div>
      {execId === "" ? "" : <InsideSalesProgressTable execId={execId} execName={execName} reportRunId={reportRunId} />}
    </div>
  );
}