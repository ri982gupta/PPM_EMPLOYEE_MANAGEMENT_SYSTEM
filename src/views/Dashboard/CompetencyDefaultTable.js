import React, { useState, useEffect } from "react";
import { Column } from "primereact/column";
import CellRendererPrimeReactDataTable from "../PrimeReactTableComponent/CellRendererPrimeReactDataTable";

function CompetencyDefaultTable(props) {
  const { data, CustomersFileName, competencyMaxDynaHeigjht } = props;
  const [headerData, setHeaderData] = useState([]);
  const [exportData, setExportData] = useState([]);

  useEffect(() => {
    let imp = ["XLS"];
    setExportData(imp);
  }, []);

  const SnoAlign = (data) => {
    return <div align="center">{data.sno}</div>;
  };
  const SelfRatingAlign = (data) => {
    return <div align="right">{data.selfRating}</div>;
  };
  const ExpAlign = (data) => {
    return <div align="right">{data.skillExp}</div>;
  };
  const SuperVisorRatingAlign = (data) => {
    return (
      <div className="ellipsis" align="right">
        {data.skillRating}
      </div>
    );
  };
  const empIdtooltip = (data) => {
    return (
      <div className="ellipsis" data-toggle="tooltip" title={data.empId}>
        {data.empId}
      </div>
    );
  };
  const resNametooltip = (data) => {
    return (
      <div className="ellipsis" data-toggle="tooltip" title={data.resName}>
        {data.resName}
      </div>
    );
  };
  const resDepttooltip = (data) => {
    return (
      <div className="ellipsis" data-toggle="tooltip" title={data.resDept}>
        {data.resDept}
      </div>
    );
  };
  const resCountrytooltip = (data) => {
    return (
      <div className="ellipsis" data-toggle="tooltip" title={data.resCountry}>
        {data.resCountry}
      </div>
    );
  };
  const projectstooltip = (data) => {
    return (
      <div className="ellipsis" data-toggle="tooltip" title={data.projects}>
        {data.projects}
      </div>
    );
  };
  const skillstooltip = (data) => {
    return (
      <div className="ellipsis" data-toggle="tooltip" title={data.skills}>
        {data.skills}
      </div>
    );
  };
  const resCoursetooltip = (data) => {
    return (
      <div className="ellipsis" data-toggle="tooltip" title={data.resCourse}>
        {data.resCourse}
      </div>
    );
  };
  const traingTypetooltip = (data) => {
    return (
      <div className="ellipsis" data-toggle="tooltip" title={data.traingType}>
        {data.traingType}
      </div>
    );
  };
  const certNametooltip = (data) => {
    return (
      <div className="ellipsis" data-toggle="tooltip" title={data.certName}>
        {data.certName}
      </div>
    );
  };
  const certCustomertooltip = (data) => {
    return (
      <div className="ellipsis" data-toggle="tooltip" title={data.certCustomer}>
        {data.certCustomer}
      </div>
    );
  };
  const resourceNametooltip = (data) => {
    return (
      <div className="ellipsis" data-toggle="tooltip" title={data.resourceName}>
        {data.resourceName}
      </div>
    );
  };
  const skillGrptooltip = (data) => {
    return (
      <div className="ellipsis" data-toggle="tooltip" title={data.skillGrp}>
        {data.skillGrp}
      </div>
    );
  };
  const skillNametooltip = (data) => {
    return (
      <div className="ellipsis" data-toggle="tooltip" title={data.skillName}>
        {data.skillName}
      </div>
    );
  };
  const skillCategorytooltip = (data) => {
    return (
      <div
        className="ellipsis"
        data-toggle="tooltip"
        title={data.skillCategory}
      >
        {data.skillCategory}
      </div>
    );
  };
  const skillStatustooltip = (data) => {
    return (
      <div className="ellipsis" data-toggle="tooltip" title={data.skillStatus}>
        {data.skillStatus}
      </div>
    );
  };
  const commentstooltip = (data) => {
    return (
      <div className="ellipsis" data-toggle="tooltip" title={data.comments}>
        {data.comments}
      </div>
    );
  };
  const reviewedBytooltip = (data) => {
    return (
      <div className="ellipsis" data-toggle="tooltip" title={data.reviewedBy}>
        {data.reviewedBy}
      </div>
    );
  };
  const CourseTimeCghanges = (data) => {
    return (
      <div className="ellipsis" align="right">
        {data.courseTime}
      </div>
    );
  };
  const ScoreChanges = (data) => {
    return (
      <div className="ellipsis" align="right">
        {data.courseScore}
      </div>
    );
  };

  const dynamicColumns = Object.keys(headerData)?.map((col, i) => {
    return (
      <Column
        sortable
        // style={{ textAlign: "center" }}
        key={col}
        body={
          // col == "S.No."? SnoAlign : col == "Self Rating" && SelfRatingAlign ? col == "Supervisor Rating" && SuperVisorRatingAlign : col == "Exp(In Months)" && ExpAlign
          col == "sno"
            ? SnoAlign
            : (col == "selfRating" && SelfRatingAlign) ||
              (col == "skillRating" && SuperVisorRatingAlign) ||
              (col == "skillExp" && ExpAlign) ||
              (col == "empId" && empIdtooltip) ||
              (col == "resName" && resNametooltip) ||
              (col == "resDept" && resDepttooltip) ||
              (col == "resCountry" && resCountrytooltip) ||
              (col == "projects" && projectstooltip) ||
              (col == "skills" && skillstooltip) ||
              (col == "resCourse" && resCoursetooltip) ||
              (col == "traingType" && traingTypetooltip) ||
              (col == "certName" && certNametooltip) ||
              (col == "certCustomer" && certCustomertooltip) ||
              (col == "resourceName" && resourceNametooltip) ||
              (col == "skillGrp" && skillGrptooltip) ||
              (col == "skillName" && skillNametooltip) ||
              (col == "skillCategory" && skillCategorytooltip) ||
              (col == "skillStatus" && skillStatustooltip) ||
              (col == "comments" && commentstooltip) ||
              (col == "reviewedBy" && reviewedBytooltip) ||
              (col == "courseScore" && ScoreChanges) ||
              (col == "courseTime" && CourseTimeCghanges)
        }
        field={col}
        header={headerData[col]}
      />
    );
  });

  useEffect(() => {
    data[0] && setHeaderData(JSON.parse(JSON.stringify(data[0])));
  }, [data]);

  return (
    <div>
      <CellRendererPrimeReactDataTable
        competencyMaxDynaHeigjht = {competencyMaxDynaHeigjht}
        CustomersFileName = {CustomersFileName}
        rows={25}
        data={data}
        dynamicColumns={dynamicColumns}
        headerData={headerData}
        setHeaderData={setHeaderData}
        exportData={exportData}
        fileName= "Competency Dashboard"
      />
    </div>
  );
}
export default CompetencyDefaultTable;
