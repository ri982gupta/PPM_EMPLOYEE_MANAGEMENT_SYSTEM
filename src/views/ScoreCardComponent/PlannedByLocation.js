import ScoreCard from "./ScoreCard.json";
import TargetTable from "./TargetTable";
import FETPlannedByLocation from "./FETPlannedByLocation";
import SubKPlannedByLocation from "./SubKPlannedByLocation";

export default function PlannedByLocation(props) {

    const { ftePlanByLoc, subKPlanByLoc } = props
    return (
        <div className="col-12 mr-0 pr-0 row" style={{ margin: "0px", padding: "0px" }}>
            <div className="col-6 pr-0 customCard card graph">
                <FETPlannedByLocation ftePlanByLoc={ftePlanByLoc} />
            </div>
            {/* <div className="col-1"></div> */}
            <div className="col-6 pl-0 customCard card graph" >
                <SubKPlannedByLocation subKPlanByLoc={subKPlanByLoc} />
            </div>



        </div>
    );
}