import React from 'react'
import { CModal } from '@coreui/react'
import { CModalBody } from '@coreui/react'
import { CModalHeader } from '@coreui/react'
import { CModalTitle } from '@coreui/react'
import { CButton } from '@coreui/react'


function RoleCostGridDelete(props) {

    const { roleGridDeleteState, setRoleGridDeleteState , gridCostDeleter } = props;
    return (
        <div>
            <CModal size="sm" visible={roleGridDeleteState} onClose={() => setRoleGridDeleteState(false)}>
                <CModalHeader className='hgt22'>
                    <CModalTitle><span className='ft16' >Delete Record</span></CModalTitle>
                </CModalHeader>
                <CModalBody >

                <div class="modal-body">
                    <div class="col-md-12 addRoleGridSubHeader">
                        <b>Are You Sure Want To Delete?</b>
                    </div>
                    <div class="col-md-12 mt-2 addRoleGridButtons" align="right">
                        <button class="btn btn-sm btn-outline-secondary mx-3" type="button">
                            Cancel
                            </button>
                        <button class="btn btn-sm btn-danger" type="button">
                            Delete
                        </button>
                    </div>
                </div>

                {/* <div className='col-md-12'><b>Are You Sure Want To Delete?</b></div>
                    <div className='col-md-12' align="right">
                        <span className='mr5'>
                            <CButton color="secondary" onClick={() => {setRoleGridDeleteState(false) }}>
                                <span>No</span>
                            </CButton>
                        </span>
                        <span className='mr5'>
                            <CButton color="secondary" onClick={() => { gridCostDeleter() }}>
                            <span>Yes</span>
                            </CButton>
                        </span>
                    </div> */}
                </CModalBody>
            </CModal>
        </div>
    )
}

export default RoleCostGridDelete