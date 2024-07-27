import { DialogContent, DialogTitle, Popover } from '@material-ui/core';
import Typography from '@mui/material/Typography';

import React from 'react'

export default function MyDashboardInfoPopOver(props) {
    const { projectData, isOpenInfo, anchorEl, onClose, handleClose } = props;
    let plannedDate = (projectData.row.original.taskPlannedStartDt && projectData.row.original.taskPlannedEndDt) ?
        projectData.row.original.taskPlannedStartDt + " to " + projectData.row.original.taskPlannedEndDt : "NA to NA";
    let ActualDates = (projectData.row.original.taskActualStartDt && projectData.row.original.taskActualEndDt) ?
        projectData.row.original.taskActualStartDt + " to " + projectData.row.original.taskActualEndDt : "NA to NA";
    let EstimatedHours = projectData.row.original.estimatedHours !== null ? projectData.row.original.estimatedHours.toFixed(2) : "NA";
    let AllocatedHours = projectData.row.original.allocatedHours !== null ? projectData.row.original.allocatedHours.toFixed(2) : "NA";
    let AllocatedDates = projectData.row.original.allocatedDates !== null ? projectData.row.original.allocatedDates : "NA";

    const open = Boolean(anchorEl);
    const id = open ? 'my-popover' : undefined;
    return (
        <div>

            <Popover
                className='MydashboardPopover'
                onClose={handleClose}
                id={id}
                open={Boolean(anchorEl)}
                anchorEl={anchorEl}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                }}

            >

                <Typography sx={{ p: 1 }}>
                    <span style={{ fontWeight: 'bold' }}>Planned Date</span><br />{plannedDate}<br />
                    <span style={{ fontWeight: 'bold' }}>Actual Dates</span><br />{ActualDates}<br />
                    <span style={{ fontWeight: 'bold' }}>Estimated Hours</span><br />{EstimatedHours}<br />
                    <span style={{ fontWeight: 'bold' }}>Allocated Hours</span><br />{AllocatedHours}<br />
                    <span style={{ fontWeight: 'bold' }}>Allocated Dates</span><br />{AllocatedDates}
                </Typography>


            </Popover>
        </div>
    )
}
