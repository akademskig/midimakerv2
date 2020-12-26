import React, { useState, useEffect } from 'react';
import { Snackbar } from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close'
import MuiAlert, { AlertProps } from '@material-ui/lab/Alert';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        close: {
            padding: theme.spacing(0.5),
        },
    }),
);

export interface SnackbarMessage {
    message: string;
    key: number;
}

export interface State {
    open: boolean;
    snackPack: SnackbarMessage[];
    messageInfo?: SnackbarMessage;
}
function Alert(props: AlertProps) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}
export default function Notifications() {
    const [notifications, setNotifications ] = useState<any[]>([])
    let messageInfo: any = null
    const [open, setOpen] = useState(false)
    useEffect(() => {
        if (notifications.length) {
            // Set a new snack when we don't have an active one
            messageInfo = { ...(notifications?.[0] || {}) };
            setOpen(true)
        } else if (!notifications.length) {
            // Close an active snack when a new one is added
           setOpen(false)
        }
    }, [setOpen, open])
   
    const handleClose = (event: React.SyntheticEvent | MouseEvent, reason?: string) => {
        setOpen(false)
    };

    const handleExited = () => {
        messageInfo = null
    };

    const classes = useStyles();
    return (
        <div>
            <Snackbar
                key={messageInfo ? messageInfo.key : undefined}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                }}
                open={open}
                autoHideDuration={6000}
                onExited={handleExited}
            >
                <Alert 
                    action={
                    <React.Fragment>
                        {/* <Button color="secondary" size="small" onClick={handleClose}>
                            UNDO
                        </Button> */}
                        <IconButton
                            aria-label="close"
                            color="inherit"
                            className={classes.close}
                            onClick={handleClose}
                        >
                            <CloseIcon />
                        </IconButton>
                    </React.Fragment>
                } onClose={handleClose} severity={messageInfo ? messageInfo.type : "info"}>
                    {messageInfo && messageInfo.message}
                </Alert>
            </Snackbar>
        </div>
    );
}