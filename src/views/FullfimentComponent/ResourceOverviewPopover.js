import { useState } from 'react';
import Button from '@mui/material/Button';
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';
import { makeStyles } from '@material-ui/core/styles';

function ResourceOverviewPopover(props) {
    const { anchorEl, handleClose, name, popoverContent, message, handleInfoClick, infoMessage } = props
    console.log(infoMessage)


    const open = Boolean(anchorEl);
    const id = open ? 'my-popover' : undefined;

    return (
        <div>
            {/* <Button onClick={handleClick}>Open Popover</Button> */}
            <Popover
                className='ResourceOverviewPopover'
                disablePortal={true}
                arrow={true}
                open={Boolean(anchorEl)}
                id={id}
                // open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                }}
                transformOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}

            >
                <Typography sx={{ p: 1 }}>

                    {infoMessage}
                </Typography>
            </Popover>
        </div>
    );
}

export default ResourceOverviewPopover;
