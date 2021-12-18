import { useContext, useState, useCallback, useEffect } from "react"

import { EmailField, UsernameField } from "../FormFields/FormFields"

import ChangePasswordForm from "../ChangePasswordForm/ChangePassword.form"
import ChangeUserDataForm from "../ChangeUserDataForm/ChangeUserData.form"
import { AuthCtx } from "../../../providers/AuthProvider"
import {
  Avatar,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
} from "@mui/material"
import EditIcon from "@mui/icons-material/Edit"
import LockIcon from "@mui/icons-material/Lock"
import { useForm } from "react-hook-form"

const UserSettings = () => {
  const { user } = useContext(AuthCtx)
  const [usernameEdit, setUsernameEdit] = useState(false)
  const [emailEdit, setEmailEdit] = useState(false)
  const [passwordEdit, setPasswordEdit] = useState(false)
  const [email, setEmail] = useState(user && user.email)
  const [username, setUsername] = useState(user && user.username)
  const {
    register,
    formState: { errors },
  } = useForm({ mode: "onChange" })

  useEffect(() => {
    setUsername(user?.username || "")
    setEmail(user?.email || "")
  }, [user])

  const handleFieldCancel = useCallback(
    (field: string) => {
      switch (field) {
        case "username": {
          setUsername(user?.username || username)
          setUsernameEdit(false)
          break
        }
        case "email": {
          setEmail(user?.email || email)
          setEmailEdit(false)
          break
        }
        default:
          break
      }
    },
    [user, email, username]
  )
  return (
    <List>
      {usernameEdit ? (
        <ListItem>
          <ChangeUserDataForm
            {...{
              field: "username",
              value: username,
              handleFieldCancel,
              errors,
            }}
          >
            <UsernameField {...{ username, setUsername, errors, register }} />
          </ChangeUserDataForm>
        </ListItem>
      ) : (
        <ListItem>
          <ListItemText primary="Username" secondary={username} />
          <ListItemAvatar>
            <Avatar className="buttonEdit">
              <IconButton color="primary" onClick={() => setUsernameEdit(true)}>
                <EditIcon />
              </IconButton>
            </Avatar>
          </ListItemAvatar>
        </ListItem>
      )}
      {emailEdit ? (
        <ListItem>
          <ChangeUserDataForm
            {...{ field: "email", value: email, handleFieldCancel, errors }}
          >
            <EmailField {...{ email, setEmail, errors, register }} />
          </ChangeUserDataForm>
        </ListItem>
      ) : (
        <ListItem>
          <ListItemText primary="Email" secondary={email} />
          <ListItemAvatar>
            <Avatar className="buttonEdit">
              <IconButton onClick={() => setEmailEdit(true)}>
                <EditIcon />
              </IconButton>
            </Avatar>
          </ListItemAvatar>
        </ListItem>
      )}
      <Divider />
      {passwordEdit ? (
        <ChangePasswordForm {...{ setPasswordEdit }}></ChangePasswordForm>
      ) : (
        <ListItem>
          <ListItemText primary="Password" secondary="*********" />
          <ListItemAvatar>
            <IconButton onClick={() => setPasswordEdit(true)}>
              <Avatar>
                <LockIcon />
              </Avatar>
            </IconButton>
          </ListItemAvatar>
        </ListItem>
      )}
    </List>
  )
}

export default UserSettings
