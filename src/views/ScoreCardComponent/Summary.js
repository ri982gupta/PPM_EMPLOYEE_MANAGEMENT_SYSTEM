import ScoreCard from "./ScoreCard.json";
import TargetTable from "./TargetTable";
import SummarySoftware from "./SoftwareSummary";
import ServiceSummary from "./ServiceSummary";


export default function Summary({ scoreCardData }) {

    console.log(scoreCardData)
    return (
        <div className="col-md-12  customCard card graph">
            <TargetTable targets={scoreCardData} />

            <div className="col-md-12 ml-1 row">

                <div className="col-md-6">
                    <ServiceSummary softdata={scoreCardData} />
                </div>
                <div className="col-md-6">
                    <SummarySoftware softdata={scoreCardData} />
                </div>
            </div>

        </div>
    );
}