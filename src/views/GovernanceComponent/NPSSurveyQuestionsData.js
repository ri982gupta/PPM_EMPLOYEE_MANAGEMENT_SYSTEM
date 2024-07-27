import React,{ useState } from "react";
import axios from "axios";

export function NPSSurveyQuestionsData() {
  const [data, setData] = useState([]);
  const [subData, setSubData] = useState([]);
  axios.get(`http://localhost:8090/governancems/pcqa/getnpv`)
    .then((Response) => { setData(Response.data); })
  axios.get(`http://localhost:8090/governancems/pcqa/getnpvques?csatId=10`)
    .then((Response) => { setSubData(Response.data); })

  let tabledata = [
    {
      id: data.id,
      name: data.survey_name,
      date: data.created_on,

      subrow: [

        {
          question: subData.question,
          range: subData.question_range,
        },
      ],
    }
  ];
  return tabledata;



}

