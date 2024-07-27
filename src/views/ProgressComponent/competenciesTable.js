import axios from "axios";
import React, { memo } from "react";
import { environment } from "../../environments/environment";

const competenciesTable = async (
  data,
  projectId,
  roleId,
  setDataProjectId,
  setFlag,
  setTableData
) => {
  //   const { data, projectId, roleId, setDataProjectId, setFlag, setTableData } =
  //     props;

  //   // const temp = (data, projectId, roleId) => {

  let respData = null;

  const baseUrl = environment.baseUrl;

  const criticality = await axios({
    method: "get",
    url:
      baseUrl +
      `/ProjectMS/project/getResCompts?resId=${data}&prjId=${projectId}&roleId=${roleId}`,
  });

  console.log("in line 31-------");
  console.log(criticality.data);
  // .then((res) => {
  // let criticality = res.data;

  //   const handleMegaBoost = React.useCallback(() => {
  setTableData(criticality.data);
  setDataProjectId(data + "_" + projectId);
  setFlag(data == undefined ? false : true);
  // setCount((currentValue) => currentValue + 1234);
  //   }, []);

  respData = criticality.data;
  //   });
  //   };
  return criticality.data;
};
export default competenciesTable;
