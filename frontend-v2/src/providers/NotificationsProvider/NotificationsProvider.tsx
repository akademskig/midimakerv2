import React, {
  createContext,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react"
import {
  Alert,
  AlertColor,
  IconButton,
  Snackbar,
} from "@mui/material"
import CloseIcon from "@mui/icons-material/Close"
import { styled } from "@mui/system"

interface INotificationsProvider {
  children: ReactNode
}
interface INotificationsCtxValue {
  notify: (notification: SnackbarMessage) => void
}

export interface SnackbarMessage {
  message: string
  title?: string
  timeout?: number
  key?: number
  type?: AlertColor
}

export interface State {
  open: boolean
  snackPack: SnackbarMessage[]
  messageInfo?: SnackbarMessage
}

const SAlert = styled(Alert)(() => ({
  alignItems: "center",
}))

const initialValue = {
  notify: () => {},
}

export const NotificationsCtx =
  createContext<INotificationsCtxValue>(initialValue)

export default function NotificationsProvider({
  children,
}: INotificationsProvider) {
  const [notifications, setNotifications] = useState<any[]>([])
  const [currentNotification, setCurrentNotification] =
    useState<SnackbarMessage | null>(null)
  const [open, setOpen] = useState(false)

  const handleClose = () => {
    setNotifications([])
    setCurrentNotification(null)
    setOpen(false)
  }

  useEffect(() => {
    if (notifications.length) {
      // Set a new snack when we don't have an active one
      setCurrentNotification({
        key: notifications.length - 1,
        ...(notifications?.[0] || {}),
      })
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

  const notify = useCallback(
    (notification) => {
      setNotifications([...notifications, notification])
    },
    [notifications, setNotifications]
  )

  const ctxValue = useMemo(() => {
    return {
      notify,
    }
  }, [notify])
  return (
    <NotificationsCtx.Provider value={ctxValue}>
      {children}
      <Snackbar
        key={currentNotification?.key}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        open={open}
        autoHideDuration={currentNotification?.timeout}
      >
        <SAlert
          elevation={6}
          variant="filled"
          action={
            <IconButton
              aria-label="close"
              color="inherit"
              onClick={handleClose}
            >
              <CloseIcon />
            </IconButton>
          }
          onClose={handleClose}
          severity={currentNotification?.type || "info"}
        >
          {currentNotification && currentNotification.message}
        </SAlert>
      </Snackbar>
    </NotificationsCtx.Provider>
  )
}
