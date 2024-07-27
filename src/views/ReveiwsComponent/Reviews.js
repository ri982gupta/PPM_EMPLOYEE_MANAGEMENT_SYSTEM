import ReviewTargetTable from "./ReviewTargetTable";
import ReviewSearchFilters from "./ReviewSearchFilters";
import axios from "axios";
import { environment } from "../../environments/environment";
import { useState, useEffect } from "react";
import "./Reviews.scss";

export default function Reviews() {
  const baseUrl = environment.baseUrl;
  const loggedUserId = localStorage.getItem("resId");
  const [targetReviewsData, setTargetReviewsData] = useState({});
  const [tableFlag, setTableFlag] = useState();

  return (
    <div className="col-lg-12 col-md-12 col-sm-12 no-padding">
      <ReviewSearchFilters
        setTargetReviewsData={setTargetReviewsData}
        setTableFlag={setTableFlag}
      />
      {tableFlag && <ReviewTargetTable targetReviewsData={targetReviewsData} />}
    </div>
  );
}
