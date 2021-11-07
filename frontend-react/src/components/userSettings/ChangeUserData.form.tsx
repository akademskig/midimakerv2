import React, { useContext } from "react"
import { isEmpty } from "lodash"
import Avatar from "@material-ui/core/Avatar"
import SaveIcon from "@material-ui/icons/Save"
import { IconButton } from "@material-ui/core"
import CancelIcon from "@material-ui/icons/Cancel"
import { useForm } from "react-hook-form"
import { AuthCtx } from "../../providers/auth.provider"
import useUsers from "../../api/protected/users"
import useNotify from "../common/notifications/notifications"
import { makeStyles } from "@material-ui/core/styles"
import { useTheme } from "@material-ui/styles"

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  actionButtons: {
    display: "flex",
    width: "85px",
    justifyContent: "space-between",
    alignItems: "center",
    color: theme.palette.primary.contrastText,
  },
  editButton: {
    color: theme.palette.error.light,
  },
}))
const ChangeUserDataForm = ({
  field,
  value,
  handleFieldCancel,
  children,
  errors,
}: any) => {
  const { updateUser } = useUsers()
  const { user } = useContext(AuthCtx)
  const notify = useNotify()
  const classes = useStyles()
  const { handleSubmit } = useForm({ mode: "onChange" })
  const onSubmit = (values: any) => {
    if (values.length || !user?.id) {
      return handleFieldCancel(field)
    }
    updateUser({ userId: user.id, [field]: value })
      .then(() => notify("success", "User updated"))
      .catch(() => notify("error", "An error occurred."))
    handleFieldCancel(field)
  }
  return (
    <form className={classes.root} noValidate onSubmit={handleSubmit(onSubmit)}>
      {children}
      <span className={classes.actionButtons}>
        <Avatar>
          <IconButton
            disabled={!isEmpty(errors[field])}
            type="submit"
            className={classes.editButton}
          >
            <SaveIcon />
          </IconButton>
        </Avatar>
        <Avatar>
          <IconButton
            onClick={() => handleFieldCancel(field)}
            className="buttonCancel"
          >
            <CancelIcon />
          </IconButton>
        </Avatar>
      </span>
    </form>
  )
}

export default ChangeUserDataForm
