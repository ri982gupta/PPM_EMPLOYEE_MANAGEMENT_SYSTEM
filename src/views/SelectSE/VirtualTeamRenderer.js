import { useEffect, useRef } from "react";
import { useState } from "react";
import { FaPencilAlt } from "react-icons/fa";
import { FaSave } from "react-icons/fa";
import { FaUserPlus } from "react-icons/fa";
import { FaPlusCircle } from "react-icons/fa";
import { FaTrash } from "react-icons/fa";
import { CListGroup, CModalBody } from "@coreui/react";
import { CModal } from "@coreui/react";
import { CModalTitle } from "@coreui/react";
import { CModalHeader } from "@coreui/react";
import { FaTrashAlt } from "react-icons/fa";
import { GrFormClose } from "react-icons/gr";
import { environment } from "../../environments/environment";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { updateSelectedSEProp } from "../../reducers/SelectedSEReducer";
import EmployeeElement from "./EmployeeElement";
import "./SelectedSE.scss";
import { ReactSearchAutocomplete } from "react-search-autocomplete";

function VirtualTeamRenderer({
  data,
  employeeElement,
  setselectedSE,
  showInactive,
  getvTeamData,
  search,
  newMemberDropdown,
  propsValue,
  setValidationMessage,
  teamMemData,
}) {
  const [editTeamName, seteditTeamName] = useState(false);
  const [addTeamMembr, setaddTeamMembr] = useState(false);
  const [teamName, setteamName] = useState(data.teamName);
  const [allTeamSelected, setallTeamSelected] = useState(false);
  const [virtualTeamValue, setVirtualTeamValue] = useState();
  const [newMemberSelected, setnewMemberSelected] = useState(0);
  const [open, setOpen] = useState(false);
  const selectedSERedux = useSelector(
    (state) => state.selectedSEState.selectedSEProp
  );
  const [isValid, setIsValid] = useState(true); //Ref to hoighligh the Team member select dropdown
  const isShowInactiveChecked = useSelector(
    (state) => state.selectedSEState.isShowInactiveChecked
  );
  const dispatch = useDispatch();
  //------------------------------------------------------------------------------------------------------

  const [options, setOptions] = useState([]);

  const handleAutocomplete = () => {
    const data = newMemberDropdown;

    const newOption = {
      value: data.props.value,
      label: data.props.children,
    };

    setOptions((prevOptions) => [...prevOptions, newOption]);
  };
  const selectedRef = useRef(); //Ref to highlight the element based on validation

  useEffect(() => {
    //When unselected, selectAll button should be unchecked
    const teamData = data.data;
    const filteredTeamArray = teamData.filter((dataObj) =>
      selectedSERedux.some((reduxObj) => dataObj.memId == reduxObj.id)
    );
    if (teamData.length == filteredTeamArray.length && teamData.length > 0)
      setallTeamSelected(true);
    else setallTeamSelected(false);
  }, [selectedSERedux]);

  function DeletePopup({ open, setOpen, id, data, getvTeamData }) {
    const deleteVirtualTeam = (id) => {
      axios
        .delete(
          baseUrl + `/SalesMS/MasterController/deleteVirtualTeam?teamId=${id}`
        )
        .then((resp) => {
          console.log(resp);
          getvTeamData();
        })
        .catch((resp) => {
          console.log(resp);
        });
    };
    return (
      <div className="reviewLogDeletePopUp">
        <CModal
          size="sm"
          visible={open}
          backdrop={"static"}
          alignment="center"
          onClose={() => {
            setOpen(false);
          }}
        >
          <CModalHeader className="">
            <CModalTitle>
              <span className="">Confirmation</span>
            </CModalTitle>
          </CModalHeader>
          <CModalBody>
            <span>Are you sure you want to delete the team?</span>
            <hr />
            <div
              style={{
                display: "flex",
              }}
            >
              <button
                type="Ok"
                className="btn btn-primary"
                onClick={() => {
                  deleteVirtualTeam(data.teamId);
                  console.log(data);
                  setOpen(false);
                }}
                style={{ marginLeft: "30%" }}
              >
                <span>Yes</span>
              </button>
              <button
                type="Cancel"
                className="btn btn-secondary mx-2"
                onClick={() => {
                  setOpen(false);
                }}
              >
                <span>No</span>
              </button>
            </div>
          </CModalBody>
        </CModal>
        {/* </Draggable> */}
      </div>
    );
  }

  const baseUrl = environment.baseUrl;
  const editVirtualName = (data) => {
    const payload = {
      id: data,
      teamName: virtualTeamValue,
    };
    axios
      .post(
        baseUrl + `/SalesMS/MasterController/postSalesVirtualTeamMembers`,
        payload
      )
      .then(() => {
        getvTeamData();
        seteditTeamName(false);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const writeVirtualTeam = (data) => {
    const payload = {
      teamId: data,
      executiveId: newMemberSelected,
      createdDate: "",
    };
    axios
      .post(baseUrl + `/SalesMS/MasterController/addVirtualMembers`, payload)
      .then(() => {
        getvTeamData();
        seteditTeamName(false);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const deleteVirtualTeam = (id) => {
    axios
      .delete(
        baseUrl + `/SalesMS/MasterController/deleteVirtualTeam?teamId=${id}`
      )
      .then((resp) => {
        console.log(resp);
        getvTeamData();
      })
      .catch((resp) => {
        console.log(resp);
      });
  };

  const addVirtualTeamMem = (id) => {
    const payload = {
      teamId: id,
      resourceId: newMemberSelected,
    };
    axios
      .post(baseUrl + `/SalesMS/MasterController/addVirtualTeamMember`, payload)
      .then(() => {
        getvTeamData();
        setaddTeamMembr(false);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const selectAllTeam = (dataArray, isChecked) => {
    const data = dataArray.map((emp) => {
      let obj = {
        type: emp.type,
        salesPersonName: emp.memName,
        id: emp.memId,
        status: emp.status,
      };
      return obj;
    });

    //Redux state update
    if (isChecked) {
      const filteredTeamArray = data
        .filter(
          (item) => item.status !== (isShowInactiveChecked ? "" : "empInactive")
        )
        .filter(
          (dataObj) =>
            !selectedSERedux.some((reduxObj) =>
              compareObjects(dataObj, reduxObj)
            )
        );

      filteredTeamArray.forEach((item) => {
        dispatch(updateSelectedSEProp({ item, isChecked }));
      });
    } else {
      const filteredTeamArray = data.filter(
        (item) => item.status !== (isShowInactiveChecked ? "" : "empInactive")
      );

      filteredTeamArray.forEach((item) => {
        dispatch(updateSelectedSEProp({ item, isChecked }));
      });
    }
    if (allTeamSelected) {
      setselectedSE((prevState) => {
        const empId = prevState.map((item) => item.id);
        const newArray = data
          .filter(
            (item) =>
              item.status !== (isShowInactiveChecked ? "" : "empInactive")
          )
          .filter((item) => !empId.includes(item.id));
        return [...prevState, ...newArray];
      });
    } else {
      setselectedSE((prevState) => {
        const empId = data.map((item) => item.id);
        const newArray = prevState.filter((item) => !empId.includes(item.id));
        return newArray;
      });
    }
    // setallTeamSelected((prevState) => !prevState);
  };

  // Custom function to compare objects based on id
  function compareObjects(obj1, obj2) {
    return obj1.id === obj2.id;
  }
  return (
    <div className="section col-md-12  optionList ">
      <div className="selectSEbtnContainer">
        <input
          type="checkbox"
          id="selectAllExec"
          onChange={(event) => {
            const isChecked = event.target.checked;
            selectAllTeam(data.data, isChecked);
          }}
          checked={allTeamSelected}
        ></input>
        {!editTeamName == true ? (
          <label>{data.teamName}</label>
        ) : (
          <input
            ref={selectedRef}
            id="virtualTeamName"
            style={{
              border: `1px solid ${isValid ? "" : "red"}`,
              backgroundColor: isValid ? "transparent" : "rgba(255, 0, 0, 0.2)",
              color: isValid ? "" : "red",
              fontWeight: isValid ? "normal" : "bold",
            }}
            type="text"
            defaultValue={data.teamName}
            onChange={(e) => {
              setVirtualTeamValue(e.target.value);
            }}
          />
        )}
        {!editTeamName && !addTeamMembr && (
          <span
            title="Edit Team"
            onClick={() => seteditTeamName(true)}
            className="button-pointer"
          >
            <FaPencilAlt />
          </span>
        )}
        {editTeamName && (
          <span
            title="Save Team"
            onClick={() => {
              const teamName = selectedRef.current.value;
              if (teamName == data.teamName) {
                setIsValid(false);
                setValidationMessage("Team Name Already Exists !!");
                window.scrollTo({
                  top: 0,
                  behavior: "smooth", // Use "auto" for instant scrolling
                });
                setTimeout(() => {
                  setValidationMessage();
                  setIsValid(true);
                }, 3000);
              } else if (
                teamName == null ||
                teamName == "" ||
                teamName.length == 0
              ) {
                setIsValid(false);
                setValidationMessage("Please enter Team Name !!");
                window.scrollTo({
                  top: 0,
                  behavior: "smooth", // Use "auto" for instant scrolling
                });
                setTimeout(() => {
                  setValidationMessage();
                  setIsValid(true);
                }, 3000);
              } else {
                editVirtualName(data.teamId);
              }
            }}
          >
            <FaSave />
          </span>
        )}
        {editTeamName && (
          <span title="Cancel" onClick={() => seteditTeamName(false)}>
            <GrFormClose />
          </span>
        )}
        <span className="selectSEformBtns">
          {!addTeamMembr && !editTeamName && (
            <span
              title="Add Member to Team"
              onClick={() => setaddTeamMembr(true)}
              className="button-pointer"
            >
              <FaPlusCircle />
            </span>
          )}
          {addTeamMembr && (
            <span title="cancel" onClick={() => setaddTeamMembr(false)}>
              <GrFormClose />
            </span>
          )}
          {addTeamMembr && (
            // <span className="">
            <>
              <div className="autoComplete-container ">
                <div className={!isValid ? "error-block" : ""}>
                  <ReactSearchAutocomplete
                    className="autocomplete"
                    items={teamMemData}
                    placeholder="Enter a name"
                    type="text"
                    name="name"
                    id="userId"
                    onSelect={(e) => {
                      setnewMemberSelected(e.resourcesId);
                    }}
                    showIcon={false}
                  />
                </div>
              </div>
              <button
                type="button"
                className="btn btn-primary btnSE"
                onClick={() => {
                  if (
                    newMemberSelected == null ||
                    newMemberSelected == 0 ||
                    newMemberSelected == undefined
                  ) {
                    setIsValid(false);
                    setValidationMessage("Please select a team member !!");
                    window.scrollTo({
                      top: 0,
                      behavior: "smooth", // Use "auto" for instant scrolling
                    });
                    setTimeout(() => {
                      setValidationMessage();
                      setIsValid(true);
                    }, 3000);
                  } else {
                    const isNewMemAlrPres = data.data.some(
                      (item) => item.memId == newMemberSelected
                    );
                    if (isNewMemAlrPres) {
                      setValidationMessage(
                        "Resource already exists in the team !!"
                      );
                      window.scrollTo({
                        top: 0,
                        behavior: "smooth", // Use "auto" for instant scrolling
                      });
                      setTimeout(() => {
                        setValidationMessage();
                      }, 3000);
                    } else {
                      writeVirtualTeam(data.teamId);
                      getvTeamData();
                      setaddTeamMembr(false);
                    }
                  }
                }}
              >
                Add
              </button>
            </>
          )}
        </span>
        {!editTeamName && !addTeamMembr && (
          <span
            title="Delete Team"
            onClick={() => {
              // deleteVirtualTeam(data.teamId);
              setOpen(true);
            }}
            className="button-pointer"
          >
            <FaTrashAlt />
          </span>
        )}
      </div>

      <div className="row engScroll virualTeamRender">
        {data.data.length === 0 && (
          <div className="col-md-12" id="noExecDiv">
            No Members found
          </div>
        )}
        {data.data
          .filter(
            (item) =>
              item.status !== (isShowInactiveChecked ? "" : "empInactive")
          )
          .filter((item) => {
            return item.memName.toLowerCase().includes(search);
          })
          .map((emp) => {
            let obj = {
              type: emp.type,
              salesPersonName: emp.memName,
              id: emp.memId,
              status: emp.status,
            };
            return (
              <EmployeeElement
                item={obj}
                key={obj.id}
                propsValue={propsValue}
              />
            );
          })}
        {/* {open && <deletePopup open={open} setOpen={setOpen} />}
         */}
        {open && (
          <DeletePopup
            open={open}
            setOpen={setOpen}
            data={data}
            // id={id}
            getvTeamData={getvTeamData}
          />
        )}
      </div>
    </div>
  );
}
export default VirtualTeamRenderer;
