import React from "react";
import { CModal } from '@coreui/react'
import { CModalBody } from '@coreui/react'
import { CModalHeader } from '@coreui/react'
import { CModalTitle } from '@coreui/react'
import { AiFillDelete, AiFillWarning } from "react-icons/ai";
import { ImCross } from "react-icons/im";
import { TiTickOutline } from "react-icons/ti";

function CapacityPlanOverAllocationpopup(props) {
    const { data, sendSelectedRowsData, overAllocation, setOverAllocation, setSaveOverAlloc, setConfirmSave } = props


    const handleOverallocationConfirmation = () => {
        setConfirmSave(true); // Set confirmSave state to true
        setOverAllocation(false); // Hide the overallocation popup
        sendSelectedRowsData(null, null, true, true); // Call sendSelectedRowsData with shouldSendRequest = true
    };

    return (
        <div>

            {console.log(data, "--resource_id")}
            <CModal visible={overAllocation} size="sm" className="ui-dialog" onClose={() => setOverAllocation(false)} backdrop={'static'}>
                <CModalHeader className=''>
                    <CModalTitle>
                        Resource Allocation
                    </CModalTitle>
                </CModalHeader>
                <CModalBody>
                    Below Resource(s) will be overallocated: {data.resourceData[0].resource}

                    <br /><br />
                    Do you still want to continue?

                    <div className='btn-container center my-2'>
                        <button type="delete" className="btn btn-primary" onClick={() => { console.log("yes clicked"); handleOverallocationConfirmation() }}><TiTickOutline size={"1.5em"} />Yes </button>
                        <button type="button" className="btn btn-secondary" onClick={() => { setOverAllocation(false) }}> <ImCross /> No </button>
                    </div>
                </CModalBody>

            </CModal>

        </div>
    )

}

export default CapacityPlanOverAllocationpopup