
import { createStyles, IconButton, makeStyles, Snackbar, Theme } from '@material-ui/core';
import MuiAlert, { AlertProps, Color } from '@material-ui/lab/Alert';
import React, { createContext, ReactNode,useCallback, useEffect, useMemo, useState } from 'react'
import CloseIcon from '@material-ui/icons/Close'
interface INotificationsProvider {
    children: ReactNode
}
interface INotificationsCtxValue  {
    notify: (notification: SnackbarMessage) =>  void,
}

export interface SnackbarMessage {
    message: string;
    title?: string;
    timeout?:number;
    key?: number;
    type?: Color;
}

export interface State {
    open: boolean;
    snackPack: SnackbarMessage[];
    messageInfo?: SnackbarMessage;
}
function Alert(props: AlertProps) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}
const initialValue ={ 
    notify: ()=> {},
}
const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        close: {
            padding: theme.spacing(0.5),
        },
    }),
);
export const NotificationsCtx = createContext<INotificationsCtxValue>(initialValue)

export default function NotificationsProvider({ children }: INotificationsProvider ){
    
    const [notifications, setNotifications ] = useState<any[]>([])
    const classes = useStyles();
    const [currentNotification, setCurrentNotification] = useState<SnackbarMessage | null>(null)
    const [open, setOpen] = useState(false)

    const handleClose = () => {
        setNotifications([])
        setCurrentNotification(null)
        setOpen(false)
    };
   
    useEffect(() => {
        if (notifications.length) {
            // Set a new snack when we don't have an active one
            setCurrentNotification({ key: notifications.length - 1, ...(notifications?.[0] || {}) });
            setOpen(true)
            const t = setTimeout(() => {
                handleClose()
            }, notifications?.[0]?.timeout || 0)
            return () => {
                clearTimeout(t)
            }
        } else if (!notifications.length) {
            // Close an active snack when a new one is added
           setOpen(false)
        }
    }, [setOpen, open, notifications])
   

    const handleExited = () => {
        setCurrentNotification(null)
    };

    const notify = useCallback((notification) => {
        setNotifications([...notifications, notification])

    }, [ notifications, setNotifications])

    const ctxValue = useMemo(()=> {
        return {
            notify
        }
    }, [ notify ])
    return(
        <NotificationsCtx.Provider value={ctxValue}>
            { children }
            <div>
            <Snackbar
                key={currentNotification?.key}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                }}
                open={open}
                autoHideDuration={currentNotification?.timeout}
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
                } onClose={handleClose} severity={currentNotification?.type || "info"}>
                    {currentNotification && currentNotification.message}
                </Alert>
            </Snackbar>
        </div>
        </NotificationsCtx.Provider>
    )



}