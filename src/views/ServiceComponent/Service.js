import { useRef, useState } from "react";
import ServiceSearchFilters from "./ServiceSearchFilters";
import ServiceTargetTable from "./ServiceTargetTable";
import SigningTargets from "./SigningTargets";
import CustomerMapping from "./CustomerMapping";
import ViewTable from "./ViewTable";
import SFButtons from "./SFButtons";
import SfPipeline from "./SfPipeline";
import axios from "axios";
import { environment } from "../../environments/environment";
import "./Service.scss";
import { useEffect } from "react";
import CustomerTargets from "./CustomerTargets";
import { BiCheck, BiError } from "react-icons/bi";

export default function Service() {
  const serviceDataCall = useRef(null);
  const [Sfpipeline, setSfpipeline] = useState([]);

  const [reportRunId, setreportRunId] = useState("");
  const [coloumnArray, setcoloumnArray] = useState([]);
  const [serviceData, setserviceData] = useState([]);
  const [componentSelector, setcomponentSelector] = useState("");
  const [Summary, setSummary] = useState("Executive");
  const [showSFpipeline, setshowSFpipeline] = useState(false);
  const messageRef = useRef(null);
  const [ViewBy, setViewBy] = useState();
  const [message, setMessage] = useState(false);
  const [message1, setMessage1] = useState(false);
  const [messageCust, setMessageCust] = useState(false);
  const [messageSgng, setMessageSgng] = useState(false);
  const [search, setSearch] = useState(false);
  const [hirarchy, setHirarchy] = useState([]);
  const loggedUserId = localStorage.getItem("resId");
  const baseUrl = environment.baseUrl;
  const [accessData, setAccessData] = useState([]);
  const [refreshButton, setRefreshButton] = useState("");
  const ref = useRef(null);

  const getMenus = () => {
    // setMenusData

    axios({
      method: "GET",
      url: baseUrl + `/CommonMS/master/getMenus?loggedUserId=${loggedUserId}`,
    }).then((resp) => {
      let data = resp.data.map((menu) => {
        if (menu.subMenus) {
          menu.subMenus = menu.subMenus.filter(
            (subMenu) =>
              subMenu.display_name !== "Project Timesheet (Deprecated)" &&
              subMenu.display_name !== "Invoice Details" &&
              subMenu.display_name !== "Accounting" &&
              subMenu.display_name !== "Upload" &&
              subMenu.display_name !== "Practice Calls [Deprecated]"
          );
        }

        return menu;
      });

      const projectStatusReportSubMenu = data
        .find((item) => item.display_name === "Sales")
        .subMenus.find(
          (subMenu) => subMenu.display_name === "Services Plan & Review"
        );
      setAccessData(projectStatusReportSubMenu.access_level);
      console.log(projectStatusReportSubMenu);
    });
  };
  useEffect(() => {
    getMenus();
  }, []);
  const hirarchyAccess = () => {
    axios

      .get(
        baseUrl +
          `/ProjectMS/project/getHirarchyAccesss?loggedUserId=${loggedUserId}`
      )

      .then((resp) => {
        const data = resp.data;
        setHirarchy(data);
      })

      .catch((err) => {
        console.log(err);
      });
  };
  useEffect(() => {
    hirarchyAccess();
  }, []);
  const handleCloseTable = () => {
    setshowSFpipeline(false);
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };
  console.log(accessData);

  useEffect(() => {}, [componentSelector]);

  useEffect(() => {}, [serviceData]);

  useEffect(() => {
    if (message || message1 || messageCust || messageSgng) {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  }, [message, message1, messageCust, messageSgng]);

  return (
    <div ref={messageRef}>
      {message && (
        <div className="statusMsg success">
          <BiCheck />
          Target Saved successfully
        </div>
      )}
      {message1 && (
        <div className="statusMsg error">
          <BiError />
          No modification to save
        </div>
      )}
      {messageCust && (
        <div className="statusMsg success">
          <BiCheck />
          Mapping Saved successfully
        </div>
      )}

      {messageSgng && (
        <div className="statusMsg success">
          <BiCheck />
          Signing Targets Saved successfully
        </div>
      )}

      <ServiceSearchFilters
        setreportRunId={setreportRunId}
        setcoloumnArray={setcoloumnArray}
        setserviceData={setserviceData}
        serviceData={serviceData}
        setcomponentSelector={setcomponentSelector}
        setSummary={setSummary}
        serviceDataCall={serviceDataCall}
        setSfpipeline={setSfpipeline}
        SfPipeline={SfPipeline}
        setshowSFpipeline={setshowSFpipeline}
        setViewBy={setViewBy}
        setSearch={setSearch}
        hirarchy={hirarchy}
        setRefreshButton={setRefreshButton}
        refreshButton={refreshButton}
      />
      {componentSelector === "analytics" &&
        Summary === "Executive" &&
        search && (
          <ViewTable
            Vdata={serviceData}
            onclickchanger={"executive"}
            expandableCols={["customer", "country"]}
            ViewBy={ViewBy}
            setViewBy={setViewBy}
            setshowSFpipeline={setshowSFpipeline}
            showSFpipeline={showSFpipeline}
            reportRunId={reportRunId}
            serviceData={serviceData}
            componentSelector={componentSelector}
            setRefreshButton={setRefreshButton}
            refreshButton={refreshButton}
          />
        )}
      {componentSelector === "analytics" &&
        Summary === "Practice" &&
        search && (
          <ViewTable
            Vdata={serviceData}
            onclickchanger={"practice"}
            expandableCols={["customer", "country"]}
            ViewBy={ViewBy}
            setViewBy={setViewBy}
            setshowSFpipeline={setshowSFpipeline}
            showSFpipeline={showSFpipeline}
            reportRunId={reportRunId}
            serviceData={serviceData}
            componentSelector={componentSelector}
            setRefreshButton={setRefreshButton}
            refreshButton={refreshButton}
          />
        )}
      {componentSelector === "analytics" && Summary === "Country" && search && (
        <ViewTable
          Vdata={serviceData}
          onclickchanger={"country"}
          expandableCols={["practice"]}
          ViewBy={ViewBy}
          setViewBy={setViewBy}
          setshowSFpipeline={setshowSFpipeline}
          showSFpipeline={showSFpipeline}
          reportRunId={reportRunId}
          serviceData={serviceData}
          componentSelector={componentSelector}
          setRefreshButton={setRefreshButton}
          refreshButton={refreshButton}
        />
      )}
      {componentSelector === "analytics" &&
        Summary === "Customer" &&
        search && (
          <ViewTable
            Vdata={serviceData}
            onclickchanger={"customer"}
            expandableCols={["practice", "country"]}
            ViewBy={ViewBy}
            setViewBy={setViewBy}
            setshowSFpipeline={setshowSFpipeline}
            showSFpipeline={showSFpipeline}
            reportRunId={reportRunId}
            serviceData={serviceData}
            componentSelector={componentSelector}
            setRefreshButton={setRefreshButton}
            refreshButton={refreshButton}
          />
        )}
      {componentSelector === "analytics" &&
        Summary === "Account Owner" &&
        search && (
          <ViewTable
            Vdata={serviceData}
            onclickchanger={"executive"}
            expandableCols={["CSL", "acc_type", "Coverage"]}
            ViewBy={ViewBy}
            setViewBy={setViewBy}
            setshowSFpipeline={setshowSFpipeline}
            showSFpipeline={showSFpipeline}
            reportRunId={reportRunId}
            serviceData={serviceData}
            componentSelector={componentSelector}
            setRefreshButton={setRefreshButton}
            refreshButton={refreshButton}
          />
        )}
      {componentSelector === "target" && search && (
        <ServiceTargetTable
          serviceData={serviceData}
          coloumnArray={coloumnArray}
          accessData={accessData}
          reportRunId={reportRunId}
          setMessage={setMessage}
          setMessage1={setMessage1}
          setshowSFpipeline={setshowSFpipeline}
          showSFpipeline={showSFpipeline}
          hirarchy={hirarchy}
          componentSelector={componentSelector}
          setRefreshButton={setRefreshButton}
          refreshButton={refreshButton}
        />
      )}
      {componentSelector === "sgtarget" && search && (
        <SigningTargets
          serviceData={serviceData}
          reportRunId={reportRunId}
          coloumnArray={coloumnArray}
          serviceDataCall={serviceDataCall}
          setMessageSgng={setMessageSgng}
          setMessage1={setMessage1}
          accessData={accessData}
          setshowSFpipeline={setshowSFpipeline}
          showSFpipeline={showSFpipeline}
          componentSelector={componentSelector}
          hirarchy={hirarchy}
          setRefreshButton={setRefreshButton}
          refreshButton={refreshButton}
        />
      )}
      {componentSelector === "custTarget" && search && (
        <CustomerTargets
          serviceData={serviceData}
          reportRunId={reportRunId}
          coloumnArray={coloumnArray}
          serviceDataCall={serviceDataCall}
          setMessageCust={setMessageCust}
          setMessage1={setMessage1}
          accessData={accessData}
        />
      )}
      {componentSelector === "custForecast" && search && (
        <CustomerMapping
          serviceData={serviceData}
          reportRunId={reportRunId}
          coloumnArray={coloumnArray}
          serviceDataCall={serviceDataCall}
        />
      )}
      {showSFpipeline && search && (
        <>
          <SfPipeline
            reportRunId={String(reportRunId)}
            summval={Summary}
            onCloseTable={handleCloseTable}
            SfPipeline={SfPipeline}
            setSfpipeline={SfPipeline}
            ref={ref}
          />
        </>
      )}
    </div>
  );
}
