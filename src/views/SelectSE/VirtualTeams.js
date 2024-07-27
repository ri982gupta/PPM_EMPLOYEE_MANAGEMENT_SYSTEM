import { useEffect, useState } from "react";
import VirtualTeamRenderer from "./VirtualTeamRenderer";
import { environment } from "../../environments/environment";
import axios from "axios";

export default function VirtualTeams({
  employeeElement,
  setselectedSE,
  showInactive,
  getvTeamData,
  seOptions,
  vTeamData,
  search,
  propsValue,
  setValidationMessage,
}) {
  const [newMemberDropdown, setnewMemberDropdown] = useState([]);
  const [teamMemData, setTeamMemData] = useState([]);

  const baseUrl = environment.baseUrl;

  const getnewMemberDropdown = () => {
    axios
      .get(baseUrl + "/SalesMS/MasterController/getResources?isActive=1")
      .then((resp) => {
        const data = resp.data;
        const updatedTeamMemData = data.map((member) => {
          const teamObj = { ...member };
          teamObj.name = teamObj.resourceName;
          delete teamObj.resourceName;
          return teamObj;
        });

        setTeamMemData(updatedTeamMemData);
        const dropdownOptions = data.map((item) => {
          return (
            <option key={item.userId} value={item.resourcesId}>
              {item.resourceName}
            </option>
          );
        });
        setnewMemberDropdown(dropdownOptions);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    getnewMemberDropdown();
  }, []);

  const array = vTeamData.map((item) => {
    return (
      <>
        <VirtualTeamRenderer
          key={item.teamId}
          data={item}
          employeeElement={employeeElement}
          setselectedSE={setselectedSE}
          showInactive={showInactive}
          getvTeamData={getvTeamData}
          search={search}
          seOptions={seOptions}
          newMemberDropdown={newMemberDropdown}
          propsValue={propsValue}
          setValidationMessage={setValidationMessage}
          teamMemData={teamMemData} //For team member auto search data
        />
        <div className="col-md-12 nopadding clearfix"></div>
      </>
    );
  });

  return <div className="col-md-12">{array}</div>;
}
