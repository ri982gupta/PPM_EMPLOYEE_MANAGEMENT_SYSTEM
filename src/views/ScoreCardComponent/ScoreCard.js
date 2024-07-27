import ScoreCardSearchFilter from "./ScoreCardSearchFilter";
import Summary from "./Summary";
import { environment } from "../../environments/environment";
import { useState, useEffect } from "react";
import "./ScoreCard.scss";
// import targetJson from "./target.json";
// import scoreCard from "./ScoreCard.json";
import TargetRealisedPlanned from "./TargetRealisedPlanned";
import Csat from "./Csat";
import Risks from "./Risks";
import ProgressOfsw from "./ProgressOfsw";
// import { performance, targets, locRecRev, practRecRev, prjRecRev, oppRecRev, custCatRecRev, custRecRev, custRecRevTable, custContRecRev, custWOWRecRev, custContRecRevTable, openOpptys, locSUBKRecRev, locFTERecRev, csatProjList, projRisksList, reportRunId } from "./ScoreCard.json"
import CustomerRealisedRevCategory from "./CustomerRealisedRevCategory";
import TopCustByRealRev from "./TopCustByRealRev";
import OpenServicePipeLine from "./OpenServicePipeLine";
import RealisedRevByContract from "./RealisedRevByContract";
import PlannedByLocation from "./PlannedByLocation";
import QBRList from "./QBRList";
import HistoricalTrend from "./HistoricalTrend";
import axios from "axios";
// import histroricalTrendData from "./histroricalTrendData.json"
import EffortVariance from "./EffortVariance";

export default function ScoreCard() {
  const baseUrl = environment.baseUrl;

  const [scoreCardData, setScoreCardData] = useState({});
  const [csat, setcsat] = useState([]);
  const [risk, setrisk] = useState([]);
  const [qbrList, setqbrList] = useState([]);
  const [tableFlag, setTableFlag] = useState();
  const [targetData, setTargetData] = useState([]);
  const [targetLocationData, setTargetLocationData] = useState([]);
  const [custRelRevCat, setCustRelRevCat] = useState([]);
  const [topCustomerByRealRev, setTopCustomerByRealRev] = useState([]);
  const [cusRecRev, setCusRecRev] = useState([]);
  const [openOpptys, setOpenOpptys] = useState([]);
  const [relRevByCon, setRelRevByCon] = useState([]);
  const [custContRecRevTable, setCustContRecRevTable] = useState([]);
  const [showHistoricalTrend, setShowHistoricalTrend] = useState(false);
  const [historicalTrendData, setHistoricalTrendData] = useState({});
  const [cardSelector, setcardSelector] = useState("-1");
  const [subKPlanByLoc, setSubKPlanByLoc] = useState({});
  const [ftePlanByLoc, setFteKPlanByLoc] = useState({});
  const loggedUserId = localStorage.getItem("resId");
  const [data, setData] = useState([]);
  const [dataAccess, setDataAccess] = useState([]);
  const [effortvar, setEffortvar] = useState([]);
  const [scoreCradPermission, setScoreCradPermission] = useState([]);
  const getMenus = () => {
    axios
      .get(baseUrl + `/CommonMS/master/getMenus?loggedUserId=${loggedUserId}`)
      .then((resp) => {
        const getData = resp.data;
        setData(getData);
        // setDataAccess(accessLevel);
      });
  };

  useEffect(() => {
    const revenueVarianceSubMenu = data
      ?.find((item) => item.display_name === "Sales")
      ?.subMenus.find(
        (subMenu) => subMenu.display_name === "Scorecard"
      ).userRoles;

    const accessLevel = revenueVarianceSubMenu
      ? revenueVarianceSubMenu?.includes("690")
        ? 690
        : revenueVarianceSubMenu?.includes("641")
        ? 641
        : revenueVarianceSubMenu?.includes("930")
        ? 930
        : revenueVarianceSubMenu?.includes("46") && 46
      : null;
    setDataAccess(accessLevel);
    setscoreCardDataPayload({
      ...scoreCardDataPayload,
      cslIds: accessLevel == 641 ? Number(loggedUserId) + 1 : "-1",
      dpIds: accessLevel == 690 ? Number(loggedUserId) + 1 : "-1",
      // executives: accessLevel == 690 ? "" : -2,
    });
  }, [data]);

  useEffect(() => {
    getMenus();
  }, []);
  console.log(dataAccess);
  const [scoreCardDataPayload, setscoreCardDataPayload] = useState({
    executives: "-2",
    isActive: true,
    measures: "-1",
    isSearch: true,
    from: "2024-01-01",
    duration: 1,
    type: "cu",
    viewby: "se",
    cslIds: -1,
    dpIds: -1,
    customerId: -1,
    isIndividual: false,
    key: loggedUserId,
    opptyActType: "-1",
  });

  useEffect(() => {
    setTargetData(scoreCardData.practRecRev);
    setTargetLocationData(scoreCardData.locRecRev);
    setCustRelRevCat(scoreCardData.custCatRecRev);
    setTopCustomerByRealRev(scoreCardData.custRecRevTable);
    setCusRecRev(scoreCardData.custRecRev);
    setOpenOpptys(scoreCardData.openOpptys);
    setRelRevByCon(scoreCardData.custContRecRev);
    setCustContRecRevTable(scoreCardData.custContRecRevTable);
    setHistoricalTrendData(scoreCardData);
    setSubKPlanByLoc(scoreCardData.locSUBKRecRev);
    setFteKPlanByLoc(scoreCardData.locFTERecRev);
    setEffortvar(scoreCardData.effortvar);
  }, [
    scoreCardData,
    targetData,
    targetLocationData,
    custRelRevCat,
    topCustomerByRealRev,
    cusRecRev,
    openOpptys,
    relRevByCon,
    custContRecRevTable,
    historicalTrendData,
    subKPlanByLoc,
    ftePlanByLoc,
    effortvar,
  ]);

  return (
    <div className="col-lg-12 col-md-12 col-sm-12 no-padding">
      {/* <div className="pageHeading">Scorecard</div> */}
      <ScoreCardSearchFilter
        setScoreCardData={setScoreCardData}
        setscoreCardDataPayload={setscoreCardDataPayload}
        scoreCardDataPayload={scoreCardDataPayload}
        setqbrList={setqbrList}
        setrisk={setrisk}
        scoreCradPermission={scoreCradPermission}
        setcsat={setcsat}
        // setHistoricalTrendData={setHistoricalTrendData}
        setShowHistoricalTrend={setShowHistoricalTrend}
        setcardSelector={setcardSelector}
      />

      {/* {console.log(historicalTrendData, cardSelector, "in scorecard")} */}
      {!showHistoricalTrend ? (
        <div>
          {(cardSelector.includes("-1") || cardSelector.includes("1")) &&
          scoreCardData.targets?.length > 0 ? (
            <div>
              <Summary scoreCardData={scoreCardData} />
            </div>
          ) : (
            ""
          )}

          <div
            className="col-12 mr-0 pr-0 row"
            style={{ margin: "0px", padding: "0px" }}
          >
            <div className="col-6 pl-0">
              {(cardSelector.includes("-1") || cardSelector.includes("2")) &&
              targetData?.length > 0 ? (
                <div>
                  {" "}
                  <TargetRealisedPlanned
                    targetData={targetData}
                    type={"Practice"}
                  />{" "}
                </div>
              ) : (
                ""
              )}
            </div>
            <div className="col-6 pr-0">
              {(cardSelector.includes("-1") || cardSelector.includes("2")) &&
              targetLocationData?.length > 0 ? (
                <div>
                  <TargetRealisedPlanned
                    targetData={targetLocationData}
                    type={"Location"}
                  />{" "}
                </div>
              ) : (
                ""
              )}
            </div>
          </div>
          <div
            className="col-12 mr-0 pr-0 row"
            style={{ margin: "0px", padding: "0px" }}
          >
            <div className="col-6 pl-0">
              {(cardSelector.includes("-1") || cardSelector.includes("3")) &&
              custRelRevCat?.length > 0 ? (
                <div>
                  <CustomerRealisedRevCategory custRelRevCat={custRelRevCat} />
                </div>
              ) : (
                ""
              )}
            </div>
            <div className="col-6 pr-0">
              {(cardSelector.includes("-1") || cardSelector.includes("3")) &&
              topCustomerByRealRev?.length > 0 &&
              cusRecRev?.length > 0 ? (
                <div>
                  <TopCustByRealRev
                    topCustomerByRealRev={topCustomerByRealRev}
                    cusRecRev={cusRecRev}
                    scoreCardDataPayload={scoreCardDataPayload}
                  />
                </div>
              ) : (
                ""
              )}
            </div>
          </div>
          <div className="col-md-12 no-padding">
            <div className="col-md-12 no-padding">
              {(cardSelector.includes("-1") || cardSelector.includes("4")) &&
              custContRecRevTable?.length > 0 ? (
                <div>
                  <RealisedRevByContract
                    custContRecRev={relRevByCon}
                    custContRecRevTable={custContRecRevTable}
                    type={"Practice"}
                  />{" "}
                </div>
              ) : (
                ""
              )}
            </div>
          </div>
          <div className="col-md-12 no-padding">
            <div className="col-md-12 no-padding">
              {(cardSelector.includes("-1") || cardSelector.includes("5")) &&
              (ftePlanByLoc?.length > 0 || subKPlanByLoc?.length > 0) ? (
                <div>
                  <PlannedByLocation
                    ftePlanByLoc={ftePlanByLoc}
                    subKPlanByLoc={subKPlanByLoc}
                  />{" "}
                </div>
              ) : (
                ""
              )}
            </div>
          </div>
          {(cardSelector.includes("-1") || cardSelector.includes("6")) &&
          scoreCardData.custWOWRecRev?.length > 0 ? (
            <ProgressOfsw scoreCardData={scoreCardData} />
          ) : (
            ""
          )}
          {(cardSelector.includes("-1") || cardSelector.includes("8")) &&
          scoreCardData.csatProjList?.length > 0 ? (
            <Csat scoreCardData={scoreCardData.csatProjList} />
          ) : (
            ""
          )}
          {(cardSelector.includes("-1") || cardSelector.includes("9")) &&
          scoreCardData.risks?.length > 0 ? (
            <Risks risk={scoreCardData.risks} />
          ) : (
            ""
          )}

          <div className="col-md-12 no-padding">
            {(cardSelector.includes("-1") || cardSelector.includes("10")) &&
            scoreCardData.qbr?.length > 0 ? (
              <QBRList qbrList={scoreCardData.qbr} />
            ) : (
              ""
            )}
          </div>

          <div className="col-md-12 no-padding">
            {(cardSelector.includes("-1") || cardSelector.includes("9")) &&
            effortvar?.length > 0 ? (
              <EffortVariance effortvar={effortvar} />
            ) : (
              ""
            )}
          </div>

          <div className="col-md-12 no-padding">
            {(cardSelector.includes("-1") || cardSelector.includes("7")) &&
            openOpptys?.length > 0 ? (
              <OpenServicePipeLine openOpptys={openOpptys} />
            ) : (
              ""
            )}
          </div>
        </div>
      ) : (
        <div>
          <HistoricalTrend
            historicalTrendData={historicalTrendData}
            scoreCardDataPayload={scoreCardDataPayload}
          />
        </div>
      )}
      {/* {console.log(
        historicalTrendData,
        "historicalTrendData",
        scoreCardData,
        "scoreCardData"
      )} */}
    </div>
  );
}
