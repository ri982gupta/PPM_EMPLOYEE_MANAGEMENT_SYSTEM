import React, { useState, useEffect } from "react";
import { Card } from "primereact/card";
import { useParams } from "react-router-dom";
import { environment } from "../../../environments/environment";
import axios from "axios";
import "../survey/Survey.scss";
import CsatSurvey from "./CsatSurvey";

const CsatSurveyParentComponent = () => {
  const { token } = useParams();
  const [surveyData, setSurveyData] = useState(null);
  const baseUrl = environment.baseUrl;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const apiUrl = `${baseUrl}/governancems/Csat/doSurvey?accessToken=${token}`;
        const response = await axios.get(apiUrl);
        setSurveyData(response.data);
      } catch (error) {
        console.error("Error fetching survey data:", error);
      }
    };
    document.title = "CSAT Survey";

    fetchData();
  }, [token, baseUrl]);

  return (
    <div className="col-md-12">
      {surveyData ? (
        surveyData.accessToken === token ? (
          <CsatSurvey surveyData={surveyData} />
        ) : (
          ""
        )
      ) : (
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-md-12 mt-2">
              <Card className="errorCard">
                <div>
                  Error- No Survey Found With this Access Token. Please Contact
                  administrator for any support, if required.
                </div>
              </Card>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CsatSurveyParentComponent;
