import React, { useState, useEffect, useRef } from "react";
import { Card } from "primereact/card";
import axios from "axios";
import { environment } from "../../../environments/environment";
import "../survey/Survey.scss";
import { FaExclamationCircle } from "react-icons/fa";

const NpsSurvey = React.memo(({ surveyData }) => {
  const [email, setEmail] = useState("");
  const [isValidated, setIsValidated] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [comments, setComments] = useState("");
  const [emailWarning, setEmailWarning] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [selectedRange, setselectedRange] = useState("null");
  const [questionResponses, setQuestionResponses] = useState({});
  const { pcqaNpvCustomerSurveys } = surveyData;
  const baseUrl = environment.baseUrl;

  const warningRef = useRef(null);

  const handleValidate = () => {
    const enteredEmail = email.toLowerCase();
    const clientEmail = pcqaNpvCustomerSurveys.clientEmail.toLowerCase();
    if (enteredEmail === clientEmail) {
      setIsValidated(true);
    } else {
      setEmailWarning(true);
      setTimeout(() => {
        setEmailWarning(false);
      }, 3000);
    }
  };
  const fetchSurveyQuestions = async (selectedRange) => {
    try {
      const apiUrl =
        baseUrl +
        `/governancems/pcqa/getNPVSurveyQuestions?surveyId=${pcqaNpvCustomerSurveys.surveyId}&prjSurveyId=${pcqaNpvCustomerSurveys.id}&range=${selectedRange}`;
      const response = await axios.get(apiUrl);
      setQuestions(response.data);
    } catch (error) {
      console.error("Error fetching survey questions:", error);
    }
  };

  const handleRangeChange = (e) => {
    const newSelectedRange = e.target.value;
    setselectedRange(newSelectedRange);
    setQuestionResponses({});
    setComments("");
    if (newSelectedRange !== "null") {
      fetchSurveyQuestions(newSelectedRange);
    }
  };

  const handleSave = async () => {
    try {
      const allQuestionsAnswered = questions.every(
        (surveyQuestion) => questionResponses[surveyQuestion.questionId]
      );

      if (!allQuestionsAnswered) {
        setShowWarning(true);
        setTimeout(() => {
          setShowWarning(false);
        }, 3000);
        return;
      }

      const saveObj = Object.entries(questionResponses).map(
        ([queId, ansId]) => ({
          prjSurveyId: pcqaNpvCustomerSurveys.id,
          queId: parseInt(queId),
          ansId: ansId,
        })
      );

      const apiUrl = baseUrl + `/governancems/pcqa/saveNPVSurveyResponse`;
      const payload = {
        saveObj: saveObj,
        prjSurveyId: pcqaNpvCustomerSurveys.id,
        comments: comments,
        rangeQuestion: selectedRange,
      };

      await axios.post(apiUrl, payload);
      setSaveSuccess(true);
    } catch (error) {
      console.error("Error saving survey response:", error);
    }
  };

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
            pcqaNpvCustomerSurveys.isCompleted === 0 ||
            pcqaNpvCustomerSurveys.isCompleted === null ? (
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
                  <div className="quesAnsStyle">
                    <div className="quesStyle">
                      How likely are you to recommend Prolifics to your peers/
                      friends / colleagues
                    </div>
                    <div className="col-md-2">
                      <select onChange={handleRangeChange}>
                        <option value="null">{"<< Please Select >>"} </option>
                        <option value="0">0-6</option>
                        <option value="7">7-8</option>
                        <option value="9">9-10</option>
                      </select>
                    </div>
                    <div className="ansStyle"></div>
                  </div>
                  {selectedRange != "null" ? (
                    <>
                      {questions.map((surveyQuestion) => (
                        <div
                          className="quesAnsStyle"
                          key={surveyQuestion.questionId}
                        >
                          <div className="col-md-12 txtCmmt">
                            <span>{surveyQuestion.question}</span>
                          </div>
                          <div>
                            <textarea
                              value={
                                questionResponses[surveyQuestion.questionId] ||
                                ""
                              }
                              className={
                                questionResponses === ""
                                  ? "emptyTextarea"
                                  : "rak"
                              }
                              onChange={(e) => {
                                const newResponses = { ...questionResponses };
                                newResponses[surveyQuestion.questionId] =
                                  e.target.value;
                                setQuestionResponses(newResponses);
                              }}
                            />
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
                    </>
                  ) : (
                    ""
                  )}
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
                    required
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
});
export default NpsSurvey;
