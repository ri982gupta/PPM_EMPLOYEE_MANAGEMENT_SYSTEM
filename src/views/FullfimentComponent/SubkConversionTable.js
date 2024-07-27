import axios from "axios";
import React from "react";
import { useEffect, useState } from "react";
import Loader from "../Loader/Loader";
import SubkconversionSecondTable from "./SubkconversionSecondTable";

function SubkConversionTable(props) {
  const { myCol, myCol1, formData, data1 } = props;
  const [loader, setLoader] = useState(false);

  const initialValue = {
    CountryIds: "6,5,3,8,7,1,2",
    colVal: myCol,
    searchType: formData.searchType,
    UserId: 0,
    FromDate: formData.month,
    Duration: formData.duration,
    serarchVals: myCol1,
    isExport: 0,
  };

  const searchHandle = () => {
    axios({
      method: "post",
      // url: baseUrl + `/administrationms/subkconversiontrend/GetFteHCResDtls`,
      data: initialValue,
    })
      .then(function (response) {
        var response = response.data;

        // let hData = [];
        // let bData = [];
        // for (let index = 0; index < response.length; index++) {
        //     if (index == 0) {
        //         hData.push(response[index]);
        //     } else {
        //         bData.push(response[index]);
        //     }
        // }
        // setData(Headerdata.concat(bData));
        // setBodyData(bData);
        // setSearchApiData(bData);
        // setLoader(true)
        // setLoader(false);

        // setTimeout(() => {
        //   setLoader(false);
        // }, 1000);
      })
      .catch(function (response) {
        console.log(response);
      });
  };

  useEffect(() => {
    searchHandle();
  }, []);

  // console.log(data1);

  return (
    <div>
      {loader ? <Loader /> : ""}
      <SubkconversionSecondTable data={data1} rows={10} />
    </div>
  );
}
export default SubkConversionTable;
