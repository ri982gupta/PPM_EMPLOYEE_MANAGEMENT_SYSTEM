import React, { useState, useEffect, useRef } from "react";
import { Card } from "primereact/card";
import axios from "axios";
import { environment } from "../../../environments/environment";
import "../survey/Survey.scss";
import { FaExclamationCircle } from "react-icons/fa";

const CsatSurvey = ({ surveyData }) => {
  const [email, setEmail] = useState("");
  const [isValidated, setIsValidated] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [responses, setResponses] = useState([]);
  const [comments, setComments] = useState("");
  const [unansweredQuestions, setUnansweredQuestions] = useState([]);
  const [emailWarning, setEmailWarning] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const baseUrl = environment.baseUrl;
  const warningRef = useRef(null);

  const handleValidate = () => {
    const enteredEmail = email.toLowerCase();
    const clientEmail = surveyData.clientEmail.toLowerCase();
    if (enteredEmail === clientEmail) {
      setIsValidated(true);
    } else {
      setEmailWarning(true);
      setTimeout(() => {
        setEmailWarning(false);
      }, 3000);
    }
  };

  const handleRadioChange = (questionId, ansId) => {
    setResponses((prevResponses) => [
      ...prevResponses,
      { prjSurveyId: surveyData.id, queId: questionId, ansId: ansId },
    ]);
  };

  const handleSave = async () => {
    const unanswered = questions.filter(
      (question) =>
        !responses.some((response) => response.queId === question.questionId)
    );

    if (unanswered.length > 0) {
      setUnansweredQuestions(unanswered);
      setShowWarning(true);
      setTimeout(() => {
        setShowWarning(false);
      }, 3000);
      return;
    }
    try {
      const apiUrl = `${baseUrl}/governancems/Csat/saveClientSurveyResponse`;
      const payload = {
        saveObj: responses,
        prjSurveyId: surveyData.id,
        comments: comments,
      };
      await axios.post(apiUrl, payload);
      setSaveSuccess(true);
    } catch (error) {
      console.error("Error saving survey response:", error);
    }
  };

  useEffect(() => {
    const fetchSurveyQuestions = async () => {
      try {
        const apiUrl = `${baseUrl}/governancems/Csat/surveyQuestions?surveyId=${surveyData.surveyId}&prjSurveyId=${surveyData.id}`;
        const response = await axios.get(apiUrl);
        setQuestions(response.data);
      } catch (error) {
        console.error("Error fetching survey questions:", error);
      }
    };

    if (isValidated && surveyData.isCompleted === 0) {
      fetchSurveyQuestions();
    }
  }, [isValidated]);

  useEffect(() => {
    if (showWarning && warningRef.current) {
      warningRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [showWarning]);

  return (
    <div>
      <div className="col-md-12">
        {showWarning && (
          <div className="statusMsg error" ref={warningRef}>
            {" "}
            <span>
              {" "}
              <FaExclamationCircle /> Please select responses for all questions.{" "}
            </span>
          </div>
        )}

        {emailWarning && (
          <div className="statusMsg error">
            {" "}
            <span>
              {" "}
              <FaExclamationCircle /> No Survey found associated with this email
              address .{" "}
            </span>
          </div>
        )}

        <div className="pageTitle pageSurveyTitle">
          <div className="childOne"> </div>
          <div className="childTwo">
            <h2>Client Survey</h2>
          </div>
          <div className="childThree"></div>
        </div>
      </div>
      <div className="container">
        <div className="row justify-content-center">
          {saveSuccess ? (
            <div className="col-md-12">
              <div className="container">
                <div className="row justify-content-center">
                  <div className="col-md-12">
                    <Card className="errorCard">
                      <div>Thank You for your response.</div>
                    </Card>
                  </div>
                </div>
              </div>
            </div>
          ) : isValidated ? (
            surveyData.isCompleted === 0 ? (
              <div className="col-md-12">
                <Card className="questionsCard">
                  <div className="prolificsLogo">
                    <img
                      src="prolifics-logo.png"
                      alt=""
                      className="headerLogo"
                    />
                  </div>
                  <div className="hr"></div>
                  <div className="noteStyle">
                    Note: All questions are mandatory
                  </div>
                  <div className="hr"></div>
                  {questions.map((question) => (
                    <div className="quesAnsStyle" key={question.questionId}>
                      <div className="quesStyle">{question.question}</div>
                      <div className="ansStyle">
                        {question.response.map((option) => (
                          <div key={option.id}>
                            <input
                              type="radio"
                              id={option.lkup_name}
                              name={`group${question.questionId}`}
                              onChange={() =>
                                handleRadioChange(
                                  question.questionId,
                                  option.id
                                )
                              }
                            />
                            <span
                              className={
                                unansweredQuestions.some(
                                  (q) => q.questionId === question.questionId
                                )
                                  ? "unanswered ansStyle"
                                  : "ansStyle"
                              }
                            >
                              {option.lkup_name}
                            </span>

                            <br />
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                  <div className="quesAnsStyle">
                    <div className="col-md-12 txtCmmt">
                      <span>Other Comments</span>
                    </div>
                    <div>
                      <textarea
                        value={comments}
                        onChange={(e) => setComments(e.target.value)}
                      ></textarea>
                    </div>
                  </div>

                  <div className="col-md-12 col-sm-12 col-xs-12 btn-container center my-3">
                    <button
                      className="saveBtn btn-secondary center"
                      onClick={handleSave}
                    >
                      Save
                    </button>
                  </div>
                </Card>
              </div>
            ) : (
              <div className="container">
                <div className="row justify-content-center">
                  <div className="col-md-12">
                    <Card className="errorCard">
                      <div>This survey has already been completed.</div>
                    </Card>
                  </div>
                </div>
              </div>
            )
          ) : (
            <div className="col-md-6 mt-2">
              <Card className="emailCard">
                <p className="message">
                  * Please Validate With Your Official Email Address
                </p>
                <div>
                  <input
                    className="emailInput"
                    type="email"
                    placeholder="Enter Email here.."
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="col-md-12 col-sm-12 col-xs-12 btn-container center my-3">
                  <button
                    className="buttonStyle btn-secondary center"
                    onClick={handleValidate}
                  >
                    Validate
                  </button>
                </div>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CsatSurvey;
