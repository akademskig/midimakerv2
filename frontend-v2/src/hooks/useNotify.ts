import { AlertColor } from "@mui/material"
import { useContext } from "react"
import { NotificationsCtx } from "../providers/NotificationsProvider/NotificationsProvider"

function useNotify() {
  const timeout = 3000
  const { notify } = useContext(NotificationsCtx)
  return (type: AlertColor, message: string | object, title?: string) => {
    if (typeof message === "object") {
      message = JSON.stringify(message)
    }

    notify({ type, message, title, timeout })
  }
}

export default useNotify
