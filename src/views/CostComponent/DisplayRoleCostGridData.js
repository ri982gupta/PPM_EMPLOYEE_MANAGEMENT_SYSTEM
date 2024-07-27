import React, { useEffect, useState } from 'react'

function DisplayRoleCostGridData(props) {

  const { roleGridCostData } = props

  const [displayTable, setDisplayTable] = useState(null)

  let tabHeaders = [

    "group_name",
    "cadre",
    "country_name",
    "min_experience",
    "max_experience",
    "min_salary",
    "max_salary",
    "salary_diff",
    "gm_perc",
    "revenue_influence",
    "total_count",
    "below_min_sal",
    "above_max_salary",
    "less_than_median",
    "greater_than_median",
    "equal_to_median"
  ];

//   "created_dt": null,
//   "below_min_sal": 7,
//   "gm_perc": 8,
//   "total_count": null,
//   "created_by": null,
//   "salary_diff": 200000,
//   "min_experience": 2,
//   "modified_dt": null,
//   "cadre": "E2",
//   "group_name": "QA&TA",
//   "max_salary": 300000,
//   "revenue_influence": 200000,
//   "greater_than_median": 1,
//   "country_name": "India",
//   "min_salary": 100000,
//   "modified_by": null,
//   "less_than_median": 3,
//   "equal_to_median": 3,
//   "above_max_salary": 0,
//   "practice_id": 4,
//   "country_id": 3,
//   "id": 5,
//   "max_experience": 300000


//   Practice	Cadre	Country	Exp Range	Sal Range (L)	"Difference 
// Max-Min (L)"	GM%	"Revenue 
// Influence"	Total Count		Mapped Resources & %			
// 									Below Min	Above Max	>Median + 5%	<Median - 5%	  Median (+ or - 5 %)


  useEffect(() => {
    displayTableFnc();
  }, [])

  const displayTableFnc = () => {
    setDisplayTable(() => {
      return roleGridCostData.length === 0 ? <tr><td align="center" colSpan={"16"}>No Records Found</td></tr> : roleGridCostData.map((element,index)=>{
        let tabData = []
        tabHeaders.forEach((inEle,inInd)=>{
          tabData.push(<td align={inInd > 2 ? "right" : "left"} >{element[inEle]}</td>);
        })
        return <tr>{tabData}</tr>
      })
    })
  }


  return (
    <div>
      <table className='table table-bordered table-striped' style={{ width: "100%" }}>
        <tbody>
          <tr>
            <th>Practice</th>
            <th>Cadre</th>
            <th>Country</th>
            <th>Min. Exp.</th>
            <th>Max. Exp</th>
            <th>Min. Salary</th>
            <th>Max. Salary</th>
            <th>Difference Max-Min(L)</th>
            <th>GM%</th>
            <th>Revenue Influence</th>
            <th>Total Count</th>
            <th>Below Min</th>
            <th>Above Max</th>
            <th>{"< Median"}</th>
            <th>{"> Median"}</th>
            <th>{" Median"}</th>
          </tr>
          {displayTable}
        </tbody>
      </table>
    </div>
  )
}

export default DisplayRoleCostGridData